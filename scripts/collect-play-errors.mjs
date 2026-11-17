// Files the play-error logs downloaded from the game (⚙️ Settings → 🐞 Download error log) into the private
// repo cotudy-log, then commits and pushes. Run every night by scripts/nightly.mjs.
//
//  - looks for cotudy-errors-*.json in ~/Downloads
//  - adds them to cotudy-log/play/YYYY-MM-DD.md (today, Korean date) and keeps the file in cotudy-log/play/raw/
//  - removes the file from Downloads, commits and pushes (nothing to commit = just pulls the daily checks)
//
// usage: node scripts/collect-play-errors.mjs      (LOG_REPO / DOWNLOADS to override the folders)

import { execFileSync } from 'node:child_process';
import { readdirSync, readFileSync, writeFileSync, appendFileSync, mkdirSync, renameSync, existsSync, copyFileSync, unlinkSync } from 'node:fs';
import { homedir } from 'node:os';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const REPO = process.env.LOG_REPO || join(here, '..', '..', 'cotudy-log');
const DOWNLOADS = process.env.DOWNLOADS || join(homedir(), 'Downloads');
const git = (...args) => execFileSync('git', ['-C', REPO, ...args], { encoding: 'utf8' }).trim();
const log = (...a) => console.log(new Date().toISOString(), ...a);

if (!existsSync(join(REPO, '.git'))) { log('no log repo at', REPO); process.exit(1); }
git('pull', '--rebase', '--quiet');

const files = readdirSync(DOWNLOADS).filter((f) => /^cotudy-errors-.*\.json$/.test(f)).sort();
if (!files.length) { log('no new error files'); process.exit(0); }

const kst = new Date(Date.now() + 9 * 3600e3);
const day = kst.toISOString().slice(0, 10);
const md = join(REPO, 'play', `${day}.md`);
const raw = join(REPO, 'play', 'raw');
mkdirSync(raw, { recursive: true });
if (!existsSync(md)) writeFileSync(md, `# ${day} 플레이 중 오류\n\n게임 ⚙️ 설정 → 🐞 오류 기록 받기로 받은 파일을 모은 것.\n`);

const KIND = { page: '화면 스크립트 오류', promise: '처리 안 된 Promise 오류', runner: '실행기(자바/파이썬) 문제' };
let total = 0;
for (const f of files) {
  const src = join(DOWNLOADS, f);
  let data;
  try { data = JSON.parse(readFileSync(src, 'utf8')); } catch { log('skip (not JSON):', f); continue; }
  if (data?.app !== 'cotudy-errors' || !Array.isArray(data.errors)) { log('skip (not a cotudy error file):', f); continue; }
  const lines = ['', `## ${f}`, '', `받은 시각: ${data.exportedAt || '?'} · 오류 ${data.errors.length}개`, ''];
  for (const e of data.errors) {
    lines.push(`- **${KIND[e.kind] || e.kind}** · ${e.at}${e.count > 1 ? ` · ${e.count}번 (마지막 ${e.last})` : ''} · 언어 ${e.lang || '?'} · 화면 ${e.ui || '?'}`);
    lines.push(`  - ${e.msg.replace(/\n/g, ' ')}`);
    if (e.ua) lines.push(`  - 기기: ${e.ua}`);
    if (e.stack) lines.push('  ```', ...e.stack.split('\n').slice(0, 8).map((l) => '  ' + l), '  ```');
  }
  appendFileSync(md, lines.join('\n') + '\n');
  const dest = join(raw, f.replace(/[^\w.-]+/g, '_'));
  try { renameSync(src, dest); } catch { copyFileSync(src, dest); unlinkSync(src); }
  total += data.errors.length;
}
if (!total) { log('nothing usable'); process.exit(0); }

git('add', 'play');
git('commit', '--quiet', '-m', `플레이 중 오류 ${day} (${total}개)`);
git('push', '--quiet');
log(`filed ${total} errors from ${files.length} file(s) into play/${day}.md`);
