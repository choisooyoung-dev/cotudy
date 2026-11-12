// Runs JavaScript in a separate Web Worker, so a mistake (like an endless loop) can't freeze the game.
// console.log output is collected and returned. The worker is killed after a time limit.

const TIME_LIMIT = 3000;

function format(v) {
  if (typeof v === 'string') return v;
  if (v === undefined) return 'undefined';
  if (typeof v === 'function') return '[Function]';
  if (Array.isArray(v)) return '[ ' + v.map((x) => (typeof x === 'string' ? `'${x}'` : format(x))).join(', ') + ' ]';
  if (v && typeof v === 'object') {
    try { return '{ ' + Object.entries(v).map(([k, x]) => `${k}: ${typeof x === 'string' ? `'${x}'` : format(x)}`).join(', ') + ' }'; } catch { return String(v); }
  }
  return String(v);
}

// Line 1 of the worker script is this prelude (no newline inside), so user line N = worker line N + 1.
const PRELUDE = `const __f=${format.toString().replace(/\n\s*/g, ' ')};const __o=[];self.console={log:(...a)=>__o.push(a.map(__f).join(' ')),error:(...a)=>__o.push(a.map(__f).join(' ')),warn:(...a)=>__o.push(a.map(__f).join(' '))};self.onerror=null;`;

/** Runs code. Returns { ok, phase: 'compile' | 'run', output, error, line, ms }. */
export function runJs(source) {
  return new Promise((resolve) => {
    const t0 = performance.now();
    const script = `${PRELUDE}\n${source}\n;postMessage({done:true,out:__o});`;
    const url = URL.createObjectURL(new Blob([script], { type: 'text/javascript' }));
    const w = new Worker(url);
    let settled = false;
    const finish = (r) => {
      if (settled) return;
      settled = true;
      clearTimeout(timer);
      w.terminate();
      URL.revokeObjectURL(url);
      resolve({ ms: performance.now() - t0, ...r });
    };
    const timer = setTimeout(() => finish({
      ok: false, phase: 'run', output: '', line: 0,
      error: `시간 초과: ${TIME_LIMIT / 1000}초 안에 끝나지 않았어요.`,
    }), TIME_LIMIT);
    w.onmessage = (e) => {
      if (e.data?.done) finish({ ok: true, phase: 'run', output: e.data.out.join('\n') + (e.data.out.length ? '\n' : ''), error: '', line: 0 });
    };
    w.onerror = (e) => {
      e.preventDefault();
      const line = Math.max(0, (e.lineno || 1) - 1);
      const msg = (e.message || 'Error').replace(/^Uncaught /, '');
      const syntax = /^SyntaxError/.test(msg);
      finish({ ok: false, phase: syntax ? 'compile' : 'run', output: '', line, error: `${line ? `${line}번째 줄: ` : ''}${msg}` });
    };
  });
}

/** Turns common JavaScript errors into short Korean explanations. */
export function explainJsError(text, line) {
  if (!text) return '';
  const where = line ? `${line}번째 줄` : '코드';
  const rules = [
    [/시간 초과/, '코드가 끝나지 않아요. 반복문이 멈추는 조건이 있는지 확인해 주세요.'],
    [/(\w+) is not defined/, `${where}: %1 은(는) 자바스크립트가 모르는 이름이에요. 오타가 있거나, 아직 let/const 로 만들지 않은 변수일 수 있어요. (대소문자도 구분해요: console.log)`],
    [/Assignment to constant variable/, `${where}: const 로 만든 변수에는 새 값을 넣을 수 없어요. 바뀌는 값이면 let 으로 만들어요.`],
    [/Identifier '(\w+)' has already been declared/, `변수 %1 을(를) 두 번 만들었어요. 이미 만든 변수에 새 값을 넣을 때는 let 을 다시 쓰지 않아요.`],
    [/Invalid or unexpected token|Unterminated string|unterminated string/i, `${where}: 따옴표가 닫히지 않았거나, 쓸 수 없는 기호가 있어요.`],
    [/missing \) after argument list/, `${where}: 괄호 ) 가 빠졌거나, 값 사이에 + 또는 , 가 빠졌어요.`],
    [/Unexpected end of input/, '괄호 ( ) 나 { } 짝이 안 맞아요. 여는 괄호마다 닫는 괄호가 있는지 확인해 주세요.'],
    [/Unexpected token/, `${where} 근처에 기호가 잘못 들어갔어요. 괄호와 따옴표 짝을 확인해 주세요.`],
    [/(\S+) is not a function/, `${where}: %1 은(는) 함수가 아니에요. 이름에 오타가 없는지 확인해 주세요.`],
    [/Cannot read properties of (undefined|null)/, `${where}: 값이 없는(%1) 변수에서 무언가를 꺼내려고 했어요.`],
  ];
  for (const [re, ko] of rules) {
    const r = text.match(re);
    if (r) return ko.replace(/%(\d)/g, (_, i) => r[+i] ?? '');
  }
  return '';
}
