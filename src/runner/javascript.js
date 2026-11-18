// JavaScript 실행기. 코드를 따로 떨어진 Web Worker(별도 스레드)에서 돌려서, 무한 반복 같은 실수가 있어도
// 게임이 멈추지 않는다. console.log 출력을 모아서 돌려주고, 시간 제한이 지나면 워커를 없앤다.

import { tr } from '../i18n.js';

const TIME_LIMIT = 3000; // 한 번 실행할 수 있는 시간(ms). 넘으면 "시간 초과"

/**
 * console.log 에 넘긴 값 하나를 글자로 바꾼다 (Node.js 와 비슷한 모양).
 * 문자열은 그대로, 배열은 [ 1, 'a' ], 객체는 { k: 'v' } 처럼. 이 함수는 워커 안에도 그대로 복사해 넣는다.
 */
function format(v) {
    if (typeof v === 'string') return v;
    if (v === undefined) return 'undefined';
    if (typeof v === 'function') return '[Function]';
    if (Array.isArray(v)) return '[ ' + v.map((x) => (typeof x === 'string' ? `'${x}'` : format(x))).join(', ') + ' ]';
    if (v && typeof v === 'object') {
        try {
            return (
                '{ ' +
                Object.entries(v)
                    .map(([k, x]) => `${k}: ${typeof x === 'string' ? `'${x}'` : format(x)}`)
                    .join(', ') +
                ' }'
            );
        } catch {
            return String(v);
        }
    }
    return String(v);
}

// 워커 스크립트 맨 앞에 붙는 준비 코드(PRELUDE). 줄바꿈 없이 한 줄이라, 사용자 코드의 N번째 줄 = 워커의 N+1번째 줄.
// 하는 일:
// - console.log/error/warn 을 바꿔서 출력을 __o 배열에 모은다
// - setTimeout·Promise·async/await 처럼 나중에 찍히는 코드가 있으니, 남은 타이머가 0개가 되고 마이크로태스크까지
//   다 끝난 뒤에(__end) 결과를 보낸다 (__n = 남은 타이머 수, __sent = 이미 보냈는지)
// - 아무도 잡지 않은 Promise 실패(reject)는 에러로 보낸다
const PRELUDE =
    `const __f=${format.toString().replace(/\n\s*/g, ' ')};const __o=[];self.console={log:(...a)=>__o.push(a.map(__f).join(' ')),error:(...a)=>__o.push(a.map(__f).join(' ')),warn:(...a)=>__o.push(a.map(__f).join(' '))};self.onerror=null;` +
    `let __n=0,__sent=false;const __st=self.setTimeout.bind(self),__ct=self.clearTimeout.bind(self),__ids=new Set();` +
    `const __end=()=>__st(()=>__st(()=>{if(!__sent&&__n===0){__sent=true;postMessage({done:true,out:__o});}},0),0);` +
    `self.setTimeout=(f,ms,...a)=>{__n++;const id=__st(()=>{__ids.delete(id);__n--;try{typeof f==='function'&&f(...a);}finally{__end();}},ms);__ids.add(id);return id;};` +
    `self.clearTimeout=(id)=>{if(__ids.delete(id)){__n--;__ct(id);__end();}};` +
    `self.onunhandledrejection=(e)=>{if(__sent)return;__sent=true;const r=e.reason;postMessage({rejected:true,out:__o,msg:(r&&r.name?r.name+': '+r.message:String(r))});};`;

/**
 * 자바스크립트 코드를 실행한다. 돌려주는 값: { ok, phase: 'compile' | 'run', output, error, line, ms }.
 * - ok: 끝까지 문제없이 돌았는지 / phase: 문법 에러면 'compile', 실행 중 에러면 'run'
 * - output: 찍힌 글자 / error: 에러 메시지 / line: 에러 난 줄 번호(모르면 0) / ms: 걸린 시간
 */
export function runJs(source) {
    return new Promise((resolve) => {
        const t0 = performance.now();
        const script = `${PRELUDE}\n${source}\n;__end();`; // 준비 코드 + 사용자 코드 + "끝나면 결과 보내기"
        const url = URL.createObjectURL(new Blob([script], { type: 'text/javascript' }));
        const w = new Worker(url);
        let settled = false; // 결과를 이미 돌려줬는지 (한 번만 돌려준다)
        /** 결과를 한 번만 돌려주고 워커를 정리한다. */
        const finish = (r) => {
            if (settled) return;
            settled = true;
            clearTimeout(timer);
            w.terminate();
            URL.revokeObjectURL(url);
            resolve({ ms: performance.now() - t0, ...r });
        };
        // 시간 제한: 끝나지 않으면 "시간 초과" 로 끝낸다
        const timer = setTimeout(
            () =>
                finish({
                    ok: false,
                    phase: 'run',
                    output: '',
                    line: 0,
                    error: tr(
                        `시간 초과: ${TIME_LIMIT / 1000}초 안에 끝나지 않았어요.`,
                        `Time limit: it didn't finish within ${TIME_LIMIT / 1000} seconds.`,
                    ),
                }),
            TIME_LIMIT,
        );
        // 워커가 보낸 결과: done = 정상 끝, rejected = 잡지 않은 Promise 실패
        w.onmessage = (e) => {
            if (e.data?.done)
                finish({
                    ok: true,
                    phase: 'run',
                    output: e.data.out.join('\n') + (e.data.out.length ? '\n' : ''),
                    error: '',
                    line: 0,
                });
            else if (e.data?.rejected)
                finish({ ok: false, phase: 'run', output: e.data.out.join('\n'), line: 0, error: e.data.msg });
        };
        // 문법 에러나 실행 중 에러: 줄 번호는 준비 코드 한 줄을 빼서 사용자 기준으로 맞춘다
        w.onerror = (e) => {
            e.preventDefault();
            const line = Math.max(0, (e.lineno || 1) - 1);
            const msg = (e.message || 'Error').replace(/^Uncaught /, '');
            const syntax = /^SyntaxError/.test(msg);
            finish({
                ok: false,
                phase: syntax ? 'compile' : 'run',
                output: '',
                line,
                error: `${line ? tr(`${line}번째 줄: `, `Line ${line}: `) : ''}${msg}`,
            });
        };
    });
}

/**
 * 자주 보는 자바스크립트 에러를 짧은 쉬운 말로 풀어 준다. 미션 창의 "쉬운 말로" 칸에 나온다.
 * rules: [에러 메시지에서 찾을 패턴, 한국어 설명, 영어 설명]. 설명의 %1 은 패턴에서 잡은 첫 번째 부분.
 */
export function explainJsError(text, line) {
    if (!text) return '';
    const where = line ? tr(`${line}번째 줄`, `Line ${line}`) : tr('코드', 'Your code');
    const rules = [
        [
            /시간 초과|Time limit/,
            '코드가 끝나지 않아요. 반복문이 멈추는 조건이 있는지 확인해 주세요.',
            'The code never finishes. Check that your loop has a condition that stops it.',
        ],
        [
            /(\w+) is not defined/,
            `${where}: %1 은(는) 자바스크립트가 모르는 이름이에요. 오타가 있거나, 아직 let/const 로 만들지 않은 변수일 수 있어요. (대소문자도 구분해요: console.log)`,
            `${where}: JavaScript doesn't know the name %1. Maybe a typo, or a variable you haven't made with let/const yet. (Case matters too: console.log)`,
        ],
        [
            /Assignment to constant variable/,
            `${where}: const 로 만든 변수에는 새 값을 넣을 수 없어요. 바뀌는 값이면 let 으로 만들어요.`,
            `${where}: you can't put a new value into a const variable. If the value changes, make it with let.`,
        ],
        [
            /Identifier '(\w+)' has already been declared/,
            `변수 %1 을(를) 두 번 만들었어요. 이미 만든 변수에 새 값을 넣을 때는 let 을 다시 쓰지 않아요.`,
            `You made the variable %1 twice. When you store a new value in an existing variable, don't write let again.`,
        ],
        [
            /Invalid or unexpected token|Unterminated string|unterminated string/i,
            `${where}: 따옴표가 닫히지 않았거나, 쓸 수 없는 기호가 있어요.`,
            `${where}: a quote isn't closed, or there is a symbol that can't be used.`,
        ],
        [
            /missing \) after argument list/,
            `${where}: 괄호 ) 가 빠졌거나, 값 사이에 + 또는 , 가 빠졌어요.`,
            `${where}: a ) is missing, or a + or , is missing between values.`,
        ],
        [
            /Unexpected end of input/,
            '괄호 ( ) 나 { } 짝이 안 맞아요. 여는 괄호마다 닫는 괄호가 있는지 확인해 주세요.',
            "The ( ) or { } don't match. Make sure every opening bracket has a closing one.",
        ],
        [
            /Unexpected token/,
            `${where} 근처에 기호가 잘못 들어갔어요. 괄호와 따옴표 짝을 확인해 주세요.`,
            `Near ${where}: a symbol is in the wrong place. Check that brackets and quotes come in pairs.`,
        ],
        [
            /(\S+) is not a function/,
            `${where}: %1 은(는) 함수가 아니에요. 이름에 오타가 없는지 확인해 주세요.`,
            `${where}: %1 is not a function. Check the name for typos.`,
        ],
        [
            /Cannot read properties of (undefined|null)/,
            `${where}: 값이 없는(%1) 변수에서 무언가를 꺼내려고 했어요.`,
            `${where}: you tried to read something from a variable with no value (%1).`,
        ],
    ];
    for (const [re, ko, en] of rules) {
        const r = text.match(re);
        if (r) return tr(ko, en).replace(/%(\d)/g, (_, i) => r[+i] ?? '');
    }
    return '';
}
