// Runs Python in the browser with Pyodide (https://pyodide.org), inside a Web Worker.
// The worker loads Pyodide from the jsDelivr CDN once and is reused. If code runs too long,
// the worker is killed and a fresh one is started on the next run.

const PYODIDE = 'https://cdn.jsdelivr.net/pyodide/v0.29.0/full/';
const TIME_LIMIT = 5000;

const WORKER_SRC = `
importScripts('${PYODIDE}pyodide.js');
let py = null;
const ready = loadPyodide({ indexURL: '${PYODIDE}' }).then((p) => { py = p; postMessage({ ready: true }); });
self.onmessage = async (e) => {
  await ready;
  const out = [];
  py.setStdout({ batched: (s) => out.push(s) });
  py.setStderr({ batched: (s) => out.push(s) });
  try {
    // fresh globals each run so variables from the last run don't leak in
    const ns = py.toPy({});
    py.runPython(e.data.code, { globals: ns, filename: 'main.py' });
    ns.destroy();
    postMessage({ id: e.data.id, ok: true, out: out.join('\\n') });
  } catch (err) {
    postMessage({ id: e.data.id, ok: false, out: out.join('\\n'), err: String(err.message || err) });
  }
};`;

let worker = null;
let readyPromise = null;
let seq = 0;
const waiting = new Map();

function start() {
  const url = URL.createObjectURL(new Blob([WORKER_SRC], { type: 'text/javascript' }));
  worker = new Worker(url);
  readyPromise = new Promise((resolve, reject) => {
    worker.onmessage = (e) => {
      if (e.data.ready) { resolve(); return; }
      const cb = waiting.get(e.data.id);
      if (cb) { waiting.delete(e.data.id); cb(e.data); }
    };
    worker.onerror = (e) => { reject(new Error('파이썬을 불러오지 못했어요. 인터넷 연결을 확인해 주세요.')); e.preventDefault(); };
  });
  readyPromise.catch(() => { worker?.terminate(); worker = null; readyPromise = null; });
}

/** Loads Pyodide in the background (safe to call many times). */
export function warmUpPython() {
  if (!worker) start();
  return readyPromise;
}

/** Runs code. Returns { ok, phase: 'compile' | 'run', output, error, line, ms }. */
export async function runPython(source) {
  const t0 = performance.now();
  await warmUpPython();
  const id = ++seq;
  const res = await new Promise((resolve) => {
    const timer = setTimeout(() => {
      waiting.delete(id);
      worker.terminate(); worker = null; readyPromise = null; // next run starts a fresh worker
      resolve({ ok: false, out: '', err: `시간 초과: ${TIME_LIMIT / 1000}초 안에 끝나지 않았어요.`, timeout: true });
    }, TIME_LIMIT);
    waiting.set(id, (d) => { clearTimeout(timer); resolve(d); });
    worker.postMessage({ id, code: source });
  });
  const ms = performance.now() - t0;
  const output = res.out ? res.out + '\n' : '';
  if (res.ok) return { ok: true, phase: 'run', output, error: '', line: 0, ms };
  // keep only the part of the traceback about the user's file
  const err = res.err || '';
  const lines = err.split('\n');
  const start = lines.findIndex((l) => /File "(main\.py|<exec>)"/.test(l));
  const short = (start >= 0 ? lines.slice(start) : lines.slice(-3)).join('\n').trim();
  const lineNos = [...err.matchAll(/File "(?:main\.py|<exec>)", line (\d+)/g)].map((m) => +m[1]);
  const line = lineNos.length ? lineNos[lineNos.length - 1] : 0;
  const syntax = /^(SyntaxError|IndentationError|TabError)/m.test(short);
  return { ok: false, phase: syntax ? 'compile' : 'run', output: '', error: short, line, ms };
}

/** Turns common Python errors into short Korean explanations. */
export function explainPyError(text, line) {
  if (!text) return '';
  const where = line ? `${line}번째 줄` : '코드';
  const rules = [
    [/시간 초과/, '코드가 끝나지 않아요. 반복문이 멈추는 조건이 있는지 확인해 주세요.'],
    [/NameError: name '(\w+)' is not defined/, `${where}: %1 은(는) 파이썬이 모르는 이름이에요. 오타가 있거나, 아직 값을 넣지 않은 변수일 수 있어요. (대소문자도 구분해요: print, True)`],
    [/can only concatenate str \(not "(\w+)"\) to str/, `${where}: 문자열과 %1 은(는) + 로 바로 붙일 수 없어요. str(값) 으로 바꾸거나 f"…{값}…" 을 써요.`],
    [/unsupported operand type\(s\) for \+: 'int' and 'str'/, `${where}: 숫자와 문자열은 + 로 바로 더할 수 없어요. int(문자열) 이나 str(숫자) 로 맞춰 주세요.`],
    [/unterminated string literal|EOL while scanning/, `${where}: 따옴표가 닫히지 않았어요.`],
    [/'\(' was never closed|unexpected EOF/, `${where}: 여는 괄호 ( 가 닫히지 않았어요.`],
    [/unmatched '\)'/, `${where}: 닫는 괄호 ) 가 하나 더 있어요.`],
    [/unexpected indent/, `${where}: 줄 맨 앞에 필요 없는 띄어쓰기가 있어요. 파이썬은 줄 앞 띄어쓰기에 의미가 있어요.`],
    [/expected an indented block/, `${where}: 이 줄은 앞에 띄어쓰기(들여쓰기)가 필요해요.`],
    [/IndentationError/, `${where}: 들여쓰기(줄 앞 띄어쓰기)가 맞지 않아요.`],
    [/invalid syntax|SyntaxError/, `${where} 근처에 문법이 잘못됐어요. 따옴표, 괄호, 쉼표를 확인해 주세요.`],
    [/ZeroDivisionError/, `${where}: 0 으로 나누었어요.`],
    [/invalid literal for int\(\) with base 10: '([^']*)'/, `${where}: '%1' 은(는) 정수로 바꿀 수 없는 글자예요.`],
    [/TypeError: '(\w+)' object is not callable/, `${where}: %1 값 뒤에 괄호 ( ) 를 붙였어요. 변수 이름이 함수 이름(print 등)과 겹치지 않는지 확인해 주세요.`],
  ];
  for (const [re, ko] of rules) {
    const r = text.match(re);
    if (r) return ko.replace(/%(\d)/g, (_, i) => r[+i] ?? '');
  }
  return '';
}
