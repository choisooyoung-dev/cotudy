// Runs every fixed piece of Java and Python quest code (concept examples, the fill-in solution, the write
// solution, HQ test solutions) in the game's own runners, Korean and English screens, and saves the results to
// src/content/outputs.json. The game then shows those results at once instead of loading Java/Python
// (see src/runner/cache.js). Run it again after adding or editing quests:
//
//   npm run dev            (in another terminal)
//   node scripts/precompute-outputs.mjs [url]      (default http://localhost:5180/)
//
// Chrome: CHROME_PATH, or the usual macOS / Linux location.

import { spawn } from 'node:child_process';
import { writeFileSync, mkdtempSync, existsSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const URL_ = process.argv[2] || 'http://localhost:5180/';
const OUT = join(dirname(fileURLToPath(import.meta.url)), '..', 'src', 'content', 'outputs.json');
const PORT = 9445;
const LANGS = ['java', 'python']; // JavaScript runs instantly, no need
const chromePath = process.env.CHROME_PATH
  || ['/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', '/usr/bin/google-chrome', '/usr/bin/google-chrome-stable', '/usr/bin/chromium']
    .find((p) => existsSync(p));
if (!chromePath) { console.error('Chrome not found (set CHROME_PATH)'); process.exit(2); }

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const chrome = spawn(chromePath, [
  '--headless=new', `--remote-debugging-port=${PORT}`, `--user-data-dir=${mkdtempSync(join(tmpdir(), 'cotudy-pre-'))}`,
  '--no-first-run', '--no-default-browser-check', '--no-sandbox', '--disable-dev-shm-usage', 'about:blank',
], { stdio: 'ignore' });
let up = false;
for (let i = 0; i < 300 && !up; i++) { try { await fetch(`http://127.0.0.1:${PORT}/json/version`); up = true; } catch { await sleep(200); } }
if (!up) { console.error('Chrome did not start'); chrome.kill(); process.exit(2); }

const tab = await (await fetch(`http://127.0.0.1:${PORT}/json/new?about:blank`, { method: 'PUT' })).json();
const ws = new WebSocket(tab.webSocketDebuggerUrl);
let id = 0;
const pending = new Map();
const send = (method, params = {}) => new Promise((r) => { const i = ++id; pending.set(i, r); ws.send(JSON.stringify({ id: i, method, params })); });
ws.onmessage = (m) => {
  const d = JSON.parse(m.data);
  if (d.id && pending.has(d.id)) { pending.get(d.id)(d.result ?? d.error); pending.delete(d.id); }
  if (d.method === 'Runtime.consoleAPICalled' && String(d.params.args[0]?.value).startsWith('[pre]')) console.log(d.params.args[0].value);
};
await new Promise((r) => (ws.onopen = r));
await send('Runtime.enable');
await send('Page.enable');
const ev = async (expression) => {
  const r = await send('Runtime.evaluate', { expression, awaitPromise: true, returnByValue: true, timeout: 1200000 });
  if (r?.exceptionDetails) throw new Error(r.exceptionDetails.exception?.description || r.exceptionDetails.text);
  return r?.result?.value;
};

const prepare = (ui, lang) => `localStorage.clear(); sessionStorage.clear();
  localStorage.setItem('cotudy.ui', '${ui}');
  localStorage.setItem('cotudy.chars', JSON.stringify({ current: 'c1', list: [{ id: 'c1', look: 0, created: 0 }] }));
  localStorage.setItem('cotudy.char.c1', JSON.stringify({ lang: '${lang}', toured: true, byLang: {} }));
  sessionStorage.setItem('cotudy.picked', '1');`;

// runs inside the page: every fixed code of one language, with the raw (not saved) runner
const RUN = (lang) => `(async () => {
  const c = window.cotudy;
  const run = { java: c.runJava, python: c.runPython }['${lang}'];
  const codes = new Set();
  for (const q of c.current['${lang}']) {
    for (const k of q.concepts || []) if (k.code) codes.add(k.code);
    if (q.fill) codes.add(q.fill.code.replace(/\\{\\{(\\d+)\\}\\}/g, (_, n) => q.fill.solution[n]));
    if (q.write) codes.add(q.write.solution);
  }
  for (const p of c.hq['${lang}'] || []) codes.add(p.solution);
  const out = {};
  let n = 0;
  for (const code of codes) {
    const r = await run(code);
    out[c.codeKey('${lang}', code)] = { ok: r.ok, phase: r.phase, output: r.output, error: r.error, line: r.line };
    if (++n % 40 === 0) console.log('[pre] ${lang} ' + n + '/' + codes.size);
  }
  return out;
})()`;

const all = {};
try {
  for (const ui of ['ko', 'en']) {
    for (const lang of LANGS) {
      await send('Page.navigate', { url: 'about:blank' });
      await sleep(800);
      await send('Page.navigate', { url: URL_ });
      await sleep(1500);
      await ev(prepare(ui, lang) + ' location.reload()');
      await sleep(3000);
      const t0 = Date.now();
      const got = await ev(RUN(lang));
      Object.assign(all, got);
      console.log(ui, lang, Object.keys(got).length, 'codes', Math.round((Date.now() - t0) / 1000) + 's');
    }
  }
} finally {
  ws.close();
  chrome.kill();
}
const sorted = Object.fromEntries(Object.keys(all).sort().map((k) => [k, all[k]]));
writeFileSync(OUT, JSON.stringify(sorted, null, 0).replace(/},"/g, '},\n"') + '\n');
console.log('saved', Object.keys(sorted).length, 'results to src/content/outputs.json');
process.exit(0);
