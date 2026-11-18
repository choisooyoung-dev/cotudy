// Runs real Java 21 in the browser with CheerpJ (https://cheerpj.com). CheerpJ's Java 21 runtime has javac built in.
// Java runs inside a hidden iframe (public/java-frame.html) that loads CheerpJ and our small helper
// (src/runner/java-helper/cotudy/Runner.java → public/cotudy-runner-1.jar): one call compiles + runs Main.java.
//
// Why an iframe: CheerpJ's javac on Java 17/21/25 breaks on the 68th compile in one page (tested 2026-11-18;
// a CheerpJ issue, not ours). So after FRAME_RUNS compiles a fresh frame takes over; a spare is started a bit
// earlier so the swap doesn't make anyone wait (tested: 120 runs in a row, none slower than 1.5s).
// A frame that stops answering (TIME_LIMIT) is thrown away and the next run gets a fresh one. A tight endless loop
// still freezes the page, though: a same-site iframe runs on the page's own thread, so no timer can fire.
// Most code never gets here: examples and exact fill-in answers come pre-run from src/content/outputs.json.

import { tr } from '../i18n.js';

export const JAVA_VERSION = 21;
const FRAME_RUNS = 50; // compiles per frame (CheerpJ breaks at 68)
const SPARE_AT = 40; // start the next frame after this many compiles
const TIME_LIMIT = 15000; // ms for one compile + run (not counting the first load)

const frameUrl = () => new URL(import.meta.env.BASE_URL + 'java-frame.html', location.href).href;

let seq = 0;
/** Creates a hidden Java frame. Returns { el, ready: Promise, runs, send(code) → Promise<raw result> }. */
function makeFrame() {
  const el = document.createElement('iframe');
  el.src = frameUrl();
  el.title = 'java';
  el.setAttribute('aria-hidden', 'true');
  el.tabIndex = -1;
  el.style.cssText = 'position:fixed;left:-10px;top:-10px;width:1px;height:1px;border:0;opacity:0;pointer-events:none';
  const waiting = new Map();
  const f = { el, runs: 0, dead: false, waiting };
  f.ready = new Promise((resolve, reject) => {
    f.onMessage = (e) => {
      if (e.source !== el.contentWindow) return;
      const d = e.data || {};
      if (d.ready) resolve();
      else if (d.loadError) reject(new Error(d.loadError));
      else if (d.id && waiting.has(d.id)) { waiting.get(d.id)(d); waiting.delete(d.id); }
    };
    addEventListener('message', f.onMessage);
    el.onerror = () => reject(new Error('frame failed to load'));
  });
  f.send = (code) => new Promise((resolve) => {
    const id = ++seq;
    waiting.set(id, resolve);
    el.contentWindow.postMessage({ id, code }, location.origin);
  });
  document.body.appendChild(el);
  return f;
}
function killFrame(f) {
  if (!f || f.dead) return;
  f.dead = true;
  removeEventListener('message', f.onMessage);
  f.el.remove();
}

let current = null; // the frame in use
let spare = null; // the next one, warming up
const loadFailed = () => new Error(tr('CheerpJ 를 불러오지 못했어요. 인터넷 연결을 확인해 주세요.', 'Couldn\'t load CheerpJ. Check your internet connection.'));

/** A frame that has loaded and compiled once (so its first real run is fast). */
function warmFrame() {
  const f = makeFrame();
  f.warm = f.ready.then(() => f.send('public class Main { public static void main(String[] a) { } }')).then(() => { f.runs = 1; });
  f.warm.catch(() => {});
  return f;
}

async function frameForRun() {
  if (!current) current = warmFrame();
  if (current.runs >= SPARE_AT && !spare) spare = warmFrame();
  if (current.runs >= FRAME_RUNS) {
    const old = current;
    current = spare || warmFrame();
    spare = null;
    setTimeout(() => killFrame(old), 2000); // let anything still in flight finish
  }
  try { await current.warm; } catch { killFrame(current); current = null; throw loadFailed(); }
  return current;
}

/** Starts loading Java in the background (safe to call many times). */
export function initJava() {
  if (!current) current = warmFrame();
  return current.warm;
}

/** Loads Java and compiles once in the background so the first real run is fast. */
export function warmUpJava() {
  return initJava().catch((e) => { killFrame(current); current = null; throw e; });
}

export function isJavaReady() {
  return window.__cotudyJavaReady === true;
}

let queue = Promise.resolve();
/**
 * Compiles and runs a single Main.java source.
 * Returns { ok, phase: 'compile' | 'run', output, error, line, ms }.
 */
export function runJava(source) {
  const job = queue.then(() => doRun(source));
  queue = job.catch(() => {});
  return job;
}

async function doRun(source) {
  const f = await frameForRun();
  window.__cotudyJavaReady = true;
  f.runs++;
  const t0 = performance.now();
  const timer = new Promise((resolve) => setTimeout(() => resolve({ timeout: true }), TIME_LIMIT));
  const d = await Promise.race([f.send(source), timer]);
  const ms = performance.now() - t0;
  if (d.timeout || d.fail) {
    // no answer (or Java broke): throw this frame away, the next run gets a fresh one
    if (current === f) current = null;
    killFrame(f);
    if (d.timeout) return { ok: false, phase: 'run', output: '', line: 0, ms, error: tr(`시간 초과: ${TIME_LIMIT / 1000}초 안에 끝나지 않았어요.`, `Time limit: it didn't finish within ${TIME_LIMIT / 1000} seconds.`) };
    return { ok: false, phase: 'run', output: '', line: 0, ms, error: tr('자바 실행기에 문제가 생겨서 다시 준비할게요. 한 번 더 실행해 주세요.', 'The Java runner had a problem and is restarting. Please run it again.') };
  }
  const res = d.res;
  const kind = res[0];
  const text = res.slice(1).replaceAll('/files/src/', '');
  if (kind === 'C') {
    return { ok: false, phase: 'compile', output: '', error: text.trim(), line: +(text.match(/Main\.java:(\d+)/)?.[1] || 0), ms };
  }
  // drop the reflection frames our helper adds under the user's own stack trace
  const output = kind === 'X'
    ? text.split('\n').filter((l) => !/^\s+at (sun\.reflect|java\.lang\.reflect|java\.lang\.invoke|jdk\.internal|cotudy\.Runner|com\.leaningtech)/.test(l)).join('\n')
    : text;
  return { ok: kind === 'R', phase: 'run', output, error: kind === 'X' ? output.trim() : '', line: +(output.match(/Main\.java:(\d+)\)/)?.[1] || 0), ms };
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
