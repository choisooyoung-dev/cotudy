// The Mac's nightly job (launchd, 22:00: ~/Library/LaunchAgents/dev.cotudy.collect-errors.plist, not in this repo).
//  1. builds THIS repo's code as it is on the Mac (not the deployed site), serves the build, and checks it with
//     scripts/daily-check.mjs → cotudy-log/daily/DATE.md, commit + push. A failed build is logged too.
//  2. files downloaded play-error logs (scripts/collect-play-errors.mjs) → cotudy-log/play/DATE.md, commit + push
// The logs repo is private: choisooyoung-dev/cotudy-log, cloned next to this repo (LOG_REPO to override).
// Never touches this repo's files or git state; the build goes to a temp folder.
//
// usage: node scripts/nightly.mjs

import { execFileSync, spawnSync, spawn } from 'node:child_process';
import { existsSync, mkdtempSync, mkdirSync, writeFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const ROOT = join(here, '..');
const REPO = process.env.LOG_REPO || join(ROOT, '..', 'cotudy-log');
const VITE = join(ROOT, 'node_modules', 'vite', 'bin', 'vite.js');
const PORT = 5190;
const gitIn = (dir, ...args) => execFileSync('git', ['-C', dir, ...args], { encoding: 'utf8' }).trim();
const git = (...args) => gitIn(REPO, ...args);
const log = (...a) => console.log(new Date().toISOString(), ...a);
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const day = new Date(Date.now() + 9 * 3600e3).toISOString().slice(0, 10);

if (!existsSync(join(REPO, '.git'))) { log('no log repo at', REPO); process.exit(1); }
git('pull', '--rebase', '--quiet');

// which code is being checked
const commit = gitIn(ROOT, 'log', '-1', '--format=%h %s');
const dirty = gitIn(ROOT, 'status', '--porcelain', '--untracked-files=no').split('\n').filter(Boolean).length;
const label = `이 맥의 cotudy 코드 · 커밋 ${commit}${dirty ? ` · 커밋 안 한 변경 ${dirty}개 포함` : ''}`;

// 1a. build into a temp folder
const out = mkdtempSync(join(tmpdir(), 'cotudy-nightly-'));
const b = spawnSync(process.execPath, [VITE, 'build', '--outDir', out, '--emptyOutDir', '--logLevel', 'error'], { cwd: ROOT, encoding: 'utf8', timeout: 5 * 60e3 });
let status;
if (b.status !== 0) {
  mkdirSync(join(REPO, 'daily'), { recursive: true });
  writeFileSync(join(REPO, 'daily', `${day}.md`), [`# ${day} 매일 점검`, '', `- 대상: ${label}`, '- 결과: ❌ 빌드 실패 (점검 못 함)', '', '```', ((b.stderr || '') + (b.stdout || '')).trim().slice(-3000), '```', ''].join('\n'));
  log('build failed');
  status = 1;
} else {
  // 1b. serve the build and check it
  const server = spawn(process.execPath, [VITE, 'preview', '--outDir', out, '--port', String(PORT), '--strictPort'], { cwd: ROOT, stdio: 'ignore' });
  let up = false;
  for (let i = 0; i < 60 && !up; i++) { try { up = (await fetch(`http://localhost:${PORT}/`)).ok; } catch { await sleep(500); } }
  const r = spawnSync(process.execPath, [join(here, 'daily-check.mjs'), `http://localhost:${PORT}/`], { env: { ...process.env, LOG_DIR: REPO, CHECK_LABEL: label }, stdio: 'inherit', timeout: 15 * 60e3 });
  server.kill();
  status = r.status;
  log('daily check exit', status);
}
rmSync(out, { recursive: true, force: true });
git('add', 'daily');
if (git('diff', '--cached', '--name-only')) {
  git('commit', '--quiet', '-m', `매일 점검 ${day}${status === 0 ? '' : ' (문제 있음)'}`);
  git('push', '--quiet');
  log('daily check pushed');
}

// 2. play errors
const c = spawnSync(process.execPath, [join(here, 'collect-play-errors.mjs')], { env: { ...process.env, LOG_REPO: REPO }, stdio: 'inherit' });
log('collect exit', c.status);
process.exit(status === 0 && c.status === 0 ? 0 : 1);
