// Runs real Java in the browser with CheerpJ (https://cheerpj.com).
// The CheerpJ runtime comes from its CDN; javac comes from public/tools.jar (Eclipse Temurin OpenJDK 8u512).
// CheerpJ maps "/app/..." to this web server's root, "/str/..." to in-memory files,
// and "/files/..." to a writable IndexedDB folder.

import { tr } from '../i18n.js';

const LOADER_URL = 'https://cjrtnc.leaningtech.com/5.0/loader.js';

let initPromise = null;
let queue = Promise.resolve();
let runCount = 0;

function loadScript(src) {
  return new Promise((resolve, reject) => {
    const s = document.createElement('script');
    s.src = src;
    s.onload = resolve;
    s.onerror = () => reject(new Error(tr('CheerpJ 를 불러오지 못했어요. 인터넷 연결을 확인해 주세요.', 'Couldn\'t load CheerpJ. Check your internet connection.')));
    document.head.appendChild(s);
  });
}

function consoleEl() {
  let el = document.getElementById('console');
  if (!el) {
    // CheerpJ writes System.out / System.err into an element with id="console".
    el = document.createElement('pre');
    el.id = 'console';
    el.style.display = 'none';
    document.body.appendChild(el);
  }
  return el;
}

function toolsJarPath() {
  // e.g. "/app/tools.jar" on localhost, "/app/cotudy/tools.jar" on GitHub Pages.
  const url = new URL(import.meta.env.BASE_URL + 'tools.jar', location.href);
  return '/app' + url.pathname;
}

/** Starts loading CheerpJ (safe to call many times). */
export function initJava() {
  if (!initPromise) {
    initPromise = (async () => {
      consoleEl();
      await loadScript(LOADER_URL);
      await window.cheerpjInit({ status: 'none' });
    })();
    initPromise.catch(() => { initPromise = null; });
  }
  return initPromise;
}

let warm = null;
/** Loads CheerpJ and runs javac once in the background so the first real run is fast. */
export function warmUpJava() {
  warm ||= runJava('public class Main { public static void main(String[] a) { } }').catch(() => { warm = null; });
  return warm;
}

export function isJavaReady() {
  return !!initPromise && window.__cotudyJavaReady === true;
}

/**
 * Compiles and runs a single Main.java source.
 * Returns { ok, phase: 'compile' | 'run', output, error, ms }.
 */
export function runJava(source) {
  const job = queue.then(() => doRun(source));
  queue = job.catch(() => {});
  return job;
}

// ---- fast path ----
// Starting javac with cheerpjRunMain for every run is slow (javac + a second JVM main each time).
// Instead we load a small helper (src/runner/java-helper/cotudy/Runner.java, shipped precompiled in
// public/cotudy-runner-1.jar) with cheerpjRunLibrary. Then each run is one Java method call: compile with
// javac's API, then call Main.main through a fresh class loader.
function helperPath() {
  // The version number is in the file name: CheerpJ keeps downloaded files in the browser, so a new
  // name makes sure nobody gets an old (or broken) copy. Bump it whenever the helper changes.
  const url = new URL(import.meta.env.BASE_URL + 'cotudy-runner-1.jar', location.href);
  return '/app' + url.pathname;
}

let fastRunner = null; // Promise<Runner class | null>
function loadFastRunner() {
  fastRunner ||= (async () => {
    const load = (async () => {
      const lib = await window.cheerpjRunLibrary(`${toolsJarPath()}:${helperPath()}`);
      return await lib.cotudy.Runner;
    })();
    // never wait forever on the fast path: after 30s fall back to the slow (but proven) way
    const timeout = new Promise((_, reject) => setTimeout(() => reject(new Error('timeout loading the helper')), 30000));
    return await Promise.race([load, timeout]);
  })().catch((e) => { console.warn('[cotudy] fast Java runner unavailable, using the slow path', e); return null; });
  return fastRunner;
}

async function doRun(source) {
  await initJava();
  window.__cotudyJavaReady = true;
  const Runner = await loadFastRunner();
  if (!Runner) return doRunSlow(source);
  const t0 = performance.now();
  const res = String(await Runner.run(source));
  const ms = performance.now() - t0;
  const kind = res[0];
  const text = res.slice(1).replaceAll('/files/src/', '');
  if (kind === 'C') {
    return { ok: false, phase: 'compile', output: '', error: text.trim(), line: +(text.match(/Main\.java:(\d+)/)?.[1] || 0), ms };
  }
  // drop the reflection frames our helper adds under the user's own stack trace
  const output = kind === 'X'
    ? text.split('\n').filter((l) => !/^\s+at (sun\.reflect|java\.lang\.reflect|jdk\.internal|cotudy\.Runner|com\.leaningtech)/.test(l)).join('\n')
    : text;
  return { ok: kind === 'R', phase: 'run', output, error: kind === 'X' ? output.trim() : '', line: +(output.match(/Main\.java:(\d+)\)/)?.[1] || 0), ms };
}

async function doRunSlow(source) {
  const t0 = performance.now();
  const out = consoleEl();
  ++runCount;
  const dir = '/files/';
  const classPath = `${toolsJarPath()}:${dir}`;

  (window.cheerpOSAddStringFile || window.cheerpjAddStringFile)('/str/Main.java', new TextEncoder().encode(source));

  out.textContent = '';
  const code = await window.cheerpjRunMain(
    'com.sun.tools.javac.Main', classPath,
    '/str/Main.java', '-d', dir, '-encoding', 'UTF-8',
  );
  const compileLog = out.textContent.replaceAll('/str/', '');
  if (code !== 0) {
    return { ok: false, phase: 'compile', output: '', error: compileLog.trim(), line: +(compileLog.match(/Main\.java:(\d+)/)?.[1] || 0), ms: performance.now() - t0 };
  }

  out.textContent = '';
  const runCode = await window.cheerpjRunMain('Main', classPath);
  await new Promise((r) => setTimeout(r, 30)); // let the last console write land
  const output = out.textContent;
  const crashed = runCode !== 0 || /Exception in thread/.test(output);
  return { ok: !crashed, phase: 'run', output, error: crashed ? output.trim() : '', line: +(output.match(/Main\.java:(\d+)\)/)?.[1] || 0), ms: performance.now() - t0 };
}

/** Turns common javac / runtime errors into short Korean explanations. */
export function explainError(text) {
  if (!text) return '';
  const m = text.match(/Main\.java:(\d+): error: (.+)/);
  const line = m ? tr(`${m[1]}번째 줄`, `Line ${m[1]}`) : tr('코드', 'Your code');
  const msg = m ? m[2] : text;
  const rules = [
    [/';' expected/, `${line} 끝에 ; 가 빠졌어요. 자바는 문장이 끝날 때마다 ; 를 붙여야 해요.`, `${line}: a ; is missing at the end. Every Java statement ends with ;.`],
    [/cannot find symbol/, `${line}에 자바가 모르는 이름이 있어요. 오타가 있거나, 아직 만들지 않은 변수를 썼을 수 있어요. (대소문자도 구분해요: System, String 은 대문자로 시작)`, `${line}: there is a name Java doesn't know. Maybe a typo, or a variable you haven't made yet. (Case matters too: System and String start with a capital.)`],
    [/unclosed string literal/, `${line}의 문자열 따옴표 " 가 닫히지 않았어요.`, `${line}: the string's closing quote " is missing.`],
    [/unclosed character literal|empty character literal/, `${line}의 char 따옴표 ' 를 확인해 주세요. char 는 글자 하나를 '가' 처럼 작은따옴표로 감싸요.`, `${line}: check the char quotes '. A char holds one character in single quotes, like 'A'.`],
    [/possible lossy conversion from (\w+) to (\w+)/, `${line}: 큰 타입(%1)을 작은 타입(%2) 변수에 그냥 넣을 수 없어요. 값이 잘릴 수 있어서예요. (%2) 처럼 형변환을 써야 해요.`, `${line}: you can't put a bigger type (%1) straight into a smaller type (%2) variable, because part of the value could be lost. Use a cast like (%2).`],
    [/incompatible types: (\w+) cannot be converted to (\w+)/, `${line}: %1 값을 %2 변수에 넣을 수 없어요. 타입을 확인해 주세요.`, `${line}: a %1 value can't go into a %2 variable. Check the types.`],
    [/integer number too large/, `${line}: int 에 담기엔 너무 큰 숫자예요. long 을 쓰고 숫자 끝에 L 을 붙여 주세요.`, `${line}: this number is too big for an int. Use long and put L at the end of the number.`],
    [/reached end of file while parsing/, `{ } 짝이 안 맞아요. 여는 { 마다 닫는 } 가 있는지 확인해 주세요.`, `The { } don't match. Make sure every { has a closing }.`],
    [/class, interface, (or )?enum.* expected/, `${line} 근처에서 { } 짝이 안 맞거나, 클래스 밖에 코드가 있어요.`, `Near ${line}: the { } don't match, or there is code outside the class.`],
    [/variable (\w+) is already defined/, `${line}: 변수 %1 를 두 번 만들었어요. 이미 만든 변수에 새 값을 넣을 때는 타입(int 등)을 다시 쓰지 않아요.`, `${line}: you made the variable %1 twice. When you store a new value in an existing variable, don't write the type (int etc.) again.`],
    [/variable (\w+) might not have been initialized/, `${line}: 변수 %1 에 아직 값을 넣지 않았어요.`, `${line}: the variable %1 doesn't have a value yet.`],
    [/not a statement/, `${line}이 자바 문장이 아니에요. 빠진 글자나 기호가 없는지 확인해 주세요.`, `${line} is not a Java statement. Check for missing letters or symbols.`],
    [/illegal start of expression/, `${line} 근처에 기호가 잘못 들어갔어요. 괄호 ( ) 와 { } 짝을 확인해 주세요.`, `Near ${line}: a symbol is in the wrong place. Check that ( ) and { } come in pairs.`],
  ];
  for (const [re, ko, en] of rules) {
    const r = msg.match(re);
    if (r) return tr(ko, en).replace(/%(\d)/g, (_, i) => r[+i] ?? '');
  }
  if (/ArithmeticException/.test(text)) return tr('실행 중에 0 으로 나누었어요.', 'You divided by 0 while running.');
  if (/ArrayIndexOutOfBounds/.test(text)) return tr('배열에 없는 칸 번호를 썼어요.', 'You used a position that isn\'t in the array.');
  if (/NullPointerException/.test(text)) return tr('값이 없는(null) 변수를 사용했어요.', 'You used a variable that has no value (null).');
  if (/Exception in thread/.test(text)) return tr('실행 중에 오류가 났어요. 위 메시지의 첫 줄을 확인해 주세요.', 'Something went wrong while running. Check the first line of the message above.');
  return '';
}
