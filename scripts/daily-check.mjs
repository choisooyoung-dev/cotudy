// Daily check of the game (scripts/nightly.mjs builds this repo's code and points it here every night).
// Opens it in headless Chrome and
//  1. records errors the page throws while loading (Korean and English screens),
//  2. runs every quest's example, predict, fill-in and answer code in Java, JavaScript and Python
//     and compares the output with what the quest expects (same check as the game's grading),
//  3. does the same for the HQ coding tests and the job-interview questions (right answer = choices[0]).
// Writes the result to $LOG_DIR/daily/YYYY-MM-DD.md (Korean date; LOG_DIR defaults to ./logs) and exits with 1
// when something is wrong. The console only gets counts: details stay in the file (the logs repo is private).
//
// usage: node scripts/daily-check.mjs [url]       (default: the GitHub Pages site; CHECK_LABEL names it in the log)
// Chrome: CHROME_PATH, or the usual macOS / Linux location.

import { spawn } from 'node:child_process';
import { mkdirSync, writeFileSync, mkdtempSync, existsSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

const URL_ = process.argv[2] || 'https://choisooyoung-dev.github.io/cotudy/';
const PORT = 9444;
const LOG_DIR = process.env.LOG_DIR || 'logs';
const chromePath = process.env.CHROME_PATH
  || ['/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', '/usr/bin/google-chrome', '/usr/bin/google-chrome-stable', '/usr/bin/chromium']
    .find((p) => existsSync(p));
if (!chromePath) { console.error('Chrome not found (set CHROME_PATH)'); process.exit(2); }

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const chrome = spawn(chromePath, [
  '--headless=new', `--remote-debugging-port=${PORT}`, `--user-data-dir=${mkdtempSync(join(tmpdir(), 'cotudy-check-'))}`,
  '--no-first-run', '--no-default-browser-check', '--no-sandbox', '--disable-dev-shm-usage', '--window-size=1280,800', 'about:blank',
], { stdio: ['ignore', 'ignore', 'pipe'] });
let chromeErr = '';
chrome.stderr.on('data', (b) => { chromeErr = (chromeErr + b).slice(-2000); });
let up = false;
for (let i = 0; i < 300 && !up; i++) { try { await fetch(`http://127.0.0.1:${PORT}/json/version`); up = true; } catch { await sleep(200); } }
if (!up) { console.error('Chrome did not start in 60s\n' + chromeErr); chrome.kill(); process.exit(2); }
console.log('chrome up');

const tab = await (await fetch(`http://127.0.0.1:${PORT}/json/new?about:blank`, { method: 'PUT' })).json();
const ws = new WebSocket(tab.webSocketDebuggerUrl);
let id = 0;
const pending = new Map();
const pageErrors = [];
let screen = '';
const send = (method, params = {}) => new Promise((r) => { const i = ++id; pending.set(i, r); ws.send(JSON.stringify({ id: i, method, params })); });
ws.onmessage = (m) => {
  const d = JSON.parse(m.data);
  if (d.id && pending.has(d.id)) { pending.get(d.id)(d.result ?? d.error); pending.delete(d.id); }
  if (d.method === 'Runtime.exceptionThrown') {
    const e = d.params.exceptionDetails;
    pageErrors.push(`[${screen}] ${(e.exception?.description || e.text || '').split('\n').slice(0, 3).join(' / ')}`);
  }
  if (d.method === 'Runtime.consoleAPICalled' && d.params.args[0]?.value?.startsWith?.('[check]')) console.log(d.params.args[0].value);
  if (d.method === 'Network.loadingFailed' && !d.params.canceled) pageErrors.push(`[${screen}] network: ${d.params.errorText} (${d.params.type})`);
  if (d.method === 'Network.responseReceived' && d.params.response.status >= 400) pageErrors.push(`[${screen}] HTTP ${d.params.response.status} ${d.params.response.url}`);
};
await new Promise((r) => (ws.onopen = r));
await send('Runtime.enable');
await send('Network.enable');
await send('Page.enable');
const ev = async (expression) => {
  const r = await send('Runtime.evaluate', { expression, awaitPromise: true, returnByValue: true });
  if (r?.exceptionDetails) throw new Error(r.exceptionDetails.exception?.description || r.exceptionDetails.text);
  return r?.result?.value;
};

// one character that already did the tour, so no dialogs open
const prepare = (ui) => `localStorage.clear(); sessionStorage.clear();
  localStorage.setItem('cotudy.ui', '${ui}');
  localStorage.setItem('cotudy.chars', JSON.stringify({ current: 'c1', list: [{ id: 'c1', look: 0, created: 0 }] }));
  localStorage.setItem('cotudy.char.c1', JSON.stringify({ lang: 'java', toured: true, byLang: {} }));
  sessionStorage.setItem('cotudy.picked', '1');`;

// runs inside the page: every piece of quest code for one language
const CHECK = (lang) => `(async () => {
  const c = window.cotudy;
  const run = { java: c.runJava, javascript: c.runJs, python: c.runPython }['${lang}'];
  const norm = (s) => (s || '').replace(/\\r/g, '').split('\\n').map((l) => l.replace(/\\s+$/, '')).join('\\n').replace(/\\n+$/, '');
  const short = (s) => (s || '').replace(/\\n/g, '⏎').slice(0, 120);
  const bad = []; let count = 0;
  // a run that never answers (or a runner that never gets ready) must not hang the whole check
  const timed = (p, ms, what) => Promise.race([p, new Promise((_, no) => setTimeout(() => no(new Error(what + ' 시간 초과 ' + ms / 1000 + '초')), ms))]);
  const t0 = performance.now();
  try {
    await timed(run({ java: 'public class Main { public static void main(String[] a) { System.out.println(1); } }', javascript: 'console.log(1)', python: 'print(1)' }['${lang}']), 180000, '실행기 준비');
  } catch (e) { return { count: 0, bad: ['실행기를 준비하지 못함 · ' + e.message], quests: c.current['${lang}'].length }; }
  console.log('[check] ${lang} ready in ' + Math.round(performance.now() - t0) + 'ms');
  // examples that fail on purpose (the "read the error message" quest): these must give an error
  const MUST_FAIL = ['office-2 개념2', 'office-2 출력 맞히기'];
  const expect = async (where, code, expected, mustInclude) => {
    count++;
    let r;
    try { r = await timed(run(code), 30000, '실행'); } catch (e) { bad.push(where + ': ' + e.message); return; }
    if (count % 40 === 0) console.log('[check] ${lang} ' + count + ' runs');
    if (MUST_FAIL.includes(where)) { if (r.ok) bad.push(where + ': 일부러 에러가 나야 하는 예제인데 그냥 실행됨'); return; }
    if (!r.ok) { bad.push(where + ': 에러 · ' + short(r.error)); return; }
    if (expected != null && norm(r.output) !== norm(expected)) bad.push(where + ': 출력 다름 · 나옴 "' + short(r.output) + '" / 기대 "' + short(expected) + '"');
    const stripped = code.replace(/\\/\\/.*$/gm, '').replace(/^\\s*#.*$/gm, '');
    const miss = (mustInclude || []).find((m) => !new RegExp(m.re).test(stripped));
    if (miss) bad.push(where + ': 정답 코드가 mustInclude 를 못 맞춤 · ' + miss.re);
  };
  for (const q of c.current['${lang}']) {
    for (const [i, k] of (q.concepts || []).entries()) if (k.code) await expect(q.id + ' 개념' + (i + 1), k.code, null);
    if (q.predict) await expect(q.id + ' 출력 맞히기', q.predict.code, q.predict.choices[q.predict.answer]);
    if (q.fill) await expect(q.id + ' 빈칸', q.fill.code.replace(/\\{\\{(\\d+)\\}\\}/g, (_, n) => q.fill.solution[n]), q.fill.expected);
    if (q.write) await expect(q.id + ' 직접 쓰기', q.write.solution, q.write.expected, q.write.mustInclude);
  }
  for (const p of c.hq['${lang}']) await expect(p.id + ' (본사)', p.solution, p.expected, p.mustInclude);
  for (const [i, q] of (c.interview?.['${lang}'] || []).entries()) {
    const where = '면접 ' + (i + 1) + ' (' + q.stage + ', ' + (q.type || 'predict') + ')';
    if (!q.type || q.type === 'predict') await expect(where, q.code, q.choices[0]);
    else if (q.type === 'fill') await expect(where, q.code.replace(/\\{\\{(\\d+)\\}\\}/g, (_, n) => q.solution[n]), q.expected);
    else if (q.type === 'bug') {
      count++;
      let r;
      try { r = await timed(run(q.code), 30000, '실행'); } catch (e) { bad.push(where + ': ' + e.message); continue; }
      if (q.errorLine != null && (r.ok || r.line !== q.errorLine)) bad.push(where + ': ' + q.errorLine + '번째 줄 에러가 나야 하는데 · ' + (r.ok ? '그냥 실행됨' : r.line + '번째 줄 에러'));
      if (q.output != null && (!r.ok || norm(r.output) !== norm(q.output))) bad.push(where + ': 출력이 "' + q.output + '" 이어야 하는데 · ' + short(r.ok ? r.output : r.error));
    }
    if (q.choices && new Set(q.choices.map(norm)).size !== q.choices.length) bad.push(where + ': 선택지가 겹침');
  }
  return { count, bad, quests: c.current['${lang}'].length };
})()`;

const started = Date.now();
const results = [];
let fatal = null;
try {
  for (const ui of ['ko', 'en']) {
    screen = ui === 'ko' ? '한국어 화면' : '영어 화면';
    // free the last page's Java/Python memory first (a second load in a full tab can fail to allocate)
    await send('Page.navigate', { url: 'about:blank' });
    await sleep(1000);
    await send('Page.navigate', { url: URL_ });
    await sleep(1500);
    await ev(prepare(ui) + ' location.reload()');
    await sleep(4000);
    if (!(await ev('!!window.cotudy'))) throw new Error(`${screen}: 게임이 뜨지 않았어요 (window.cotudy 없음)`);
    for (const lang of ['java', 'javascript', 'python']) {
      const t0 = Date.now();
      const r = await ev(CHECK(lang));
      results.push({ ui, lang, ...r, sec: Math.round((Date.now() - t0) / 1000) });
      console.log(ui, lang, r.count, 'runs,', r.bad.length, 'problems');
    }
  }
} catch (e) {
  fatal = e.message;
  console.error('check stopped');
}
ws.close();
chrome.kill();

// ---- write the log ----
const kst = new Date(Date.now() + 9 * 3600e3);
const day = kst.toISOString().slice(0, 10);
const problems = results.reduce((n, r) => n + r.bad.length, 0) + pageErrors.length + (fatal ? 1 : 0);
const LANG = { java: 'Java', javascript: 'JavaScript', python: 'Python' };
const lines = [
  `# ${day} 매일 점검`,
  '',
  `- 대상: ${process.env.CHECK_LABEL || URL_}`,
  `- 시각: ${kst.toISOString().slice(11, 16)} (한국 시간), ${Math.round((Date.now() - started) / 1000)}초 걸림`,
  `- 결과: ${problems === 0 ? '✅ 문제 없음' : `❌ 문제 ${problems}개`}`,
  '',
  '## 페이지 오류',
  '',
  ...(fatal ? [`- ❌ 점검 중단: ${fatal}`] : []),
  ...(pageErrors.length ? pageErrors.map((e) => `- ${e}`) : fatal ? [] : ['- 없음']),
  '',
  '## 퀘스트 코드 실행',
  '',
  '| 화면 | 언어 | 퀘스트 | 실행한 코드 | 문제 | 시간 |',
  '|---|---|---|---|---|---|',
  ...results.map((r) => `| ${r.ui === 'ko' ? '한국어' : '영어'} | ${LANG[r.lang]} | ${r.quests} | ${r.count} | ${r.bad.length ? '❌ ' + r.bad.length : '✅ 0'} | ${r.sec}초 |`),
  '',
  ...results.filter((r) => r.bad.length).flatMap((r) => [`### ${r.ui === 'ko' ? '한국어' : '영어'} · ${LANG[r.lang]}`, '', ...r.bad.map((b) => `- ${b}`), '']),
];
mkdirSync(join(LOG_DIR, 'daily'), { recursive: true });
writeFileSync(join(LOG_DIR, 'daily', `${day}.md`), lines.join('\n') + '\n');
console.log(`daily/${day}.md`, problems === 0 ? 'OK' : `${problems} problems`);
process.exit(problems === 0 ? 0 : 1);
