// 자바 실행기. 브라우저 안에서 CheerpJ(https://cheerpj.com)로 진짜 Java 21 을 돌린다. CheerpJ 의 Java 21 런타임
// 안에 javac(컴파일러)가 들어 있다.
// 자바는 보이지 않는 작은 창(iframe, public/java-frame.html) 안에서 돈다. 그 창이 CheerpJ 와 우리 도우미
// (src/runner/java-helper/cotudy/Runner.java → public/cotudy-runner-2.jar)를 불러서, 한 번 부르면 Main.java 를
// 컴파일하고 실행까지 한다.
//
// 왜 작은 창을 쓰나: CheerpJ 의 javac 는 Java 17/21/25 모두 한 페이지에서 68번째 컴파일에 멈춘다 (2026-11-18 시험.
// 우리 쪽이 아니라 CheerpJ 문제). 그래서 FRAME_RUNS 번 컴파일하면 새 창으로 바꾸고, 그보다 조금 먼저(SPARE_AT) 다음 창을
// 미리 띄워 두어 바꿀 때 기다리지 않게 한다 (시험: 120번 연달아 실행, 1.5초 넘은 것 없음).
// 대답이 없는 창(TIME_LIMIT)은 버리고 다음 실행 때 새 창을 쓴다. 다만 끝없이 도는 반복문은 여전히 페이지를 멈춘다:
// 같은 사이트의 작은 창은 페이지와 같은 스레드에서 돌아서, 그 사이 타이머가 끼어들 수 없다.
// 대부분의 코드는 여기까지 오지도 않는다: 예제와 정답 그대로의 빈칸은 src/content/outputs.json 에 미리 실행해 둔
// 결과가 있다 (src/runner/cache.js).

import { tr } from '../i18n.js';

export const JAVA_VERSION = 21; // CheerpJ 에 요청하는 자바 버전
const FRAME_RUNS = 50; // 창 하나로 컴파일하는 횟수 (CheerpJ 는 68번째에 멈춘다)
const SPARE_AT = 40; // 이만큼 컴파일하면 다음 창을 미리 띄우기 시작
const TIME_LIMIT = 60000; // 컴파일+실행 한 번의 제한(ms). 창이 고장 났는지 알아채는 용도 (무한 반복은 어차피 못 끊는다)

let slotN = 0; // 지금까지 만든 창 수 (폴더 이름 a/b/c 를 돌아가며 정하는 데 쓴다)
// 창마다 다른 폴더(/files/a/, b, c 차례로): 창들이 저장 공간(/files/)을 함께 써서, 다음 창을 데우는 동안
// 지금 창의 Main.java 를 덮어쓰지 않게 한다 (2026-11-18 고침). 동시에 살아 있는 창은 많아야 둘 + 버리는 중 하나.
const frameUrl = () =>
    new URL(import.meta.env.BASE_URL + 'java-frame.html?slot=' + 'abc'[slotN++ % 3], location.href).href;

let seq = 0; // 실행 요청마다 붙이는 번호 (창의 답을 맞는 요청에 돌려주는 데 쓴다)
/**
 * 보이지 않는 자바 창을 하나 만든다. 돌려주는 값: { el, ready, runs, dead, waiting, send(code) }.
 * - ready: 창이 CheerpJ 와 도우미를 다 불러오면 끝나는 Promise
 * - runs: 이 창으로 컴파일한 횟수 / dead: 버린 창인지
 * - send(code): 코드를 보내고, 창이 돌려준 날것의 결과({ res } 또는 { fail })를 기다린다
 */
function makeFrame() {
    const el = document.createElement('iframe');
    el.src = frameUrl();
    el.title = 'java';
    el.setAttribute('aria-hidden', 'true');
    el.tabIndex = -1;
    el.style.cssText =
        'position:fixed;left:-10px;top:-10px;width:1px;height:1px;border:0;opacity:0;pointer-events:none';
    const waiting = new Map(); // 요청 번호 → 답을 기다리는 함수
    const f = { el, runs: 0, dead: false, waiting };
    f.ready = new Promise((resolve, reject) => {
        f.onMessage = (e) => {
            if (e.source !== el.contentWindow) return;
            const d = e.data || {};
            if (d.ready) resolve();
            else if (d.loadError) reject(new Error(d.loadError));
            else if (d.id && waiting.has(d.id)) {
                waiting.get(d.id)(d);
                waiting.delete(d.id);
            }
        };
        addEventListener('message', f.onMessage);
        el.onerror = () => reject(new Error('frame failed to load'));
    });
    f.send = (code) =>
        new Promise((resolve) => {
            const id = ++seq;
            waiting.set(id, resolve);
            el.contentWindow.postMessage({ id, code }, location.origin);
        });
    document.body.appendChild(el);
    return f;
}
/** 창을 버린다: 메시지 듣기를 멈추고 페이지에서 지운다. */
function killFrame(f) {
    if (!f || f.dead) return;
    f.dead = true;
    removeEventListener('message', f.onMessage);
    f.el.remove();
}

let current = null; // 지금 쓰는 창
let spare = null; // 다음에 쓸 창 (미리 데우는 중)
/** CheerpJ 를 못 불러왔을 때의 에러. */
const loadFailed = () =>
    new Error(
        tr(
            'CheerpJ 를 불러오지 못했어요. 인터넷 연결을 확인해 주세요.',
            "Couldn't load CheerpJ. Check your internet connection.",
        ),
    );

// 새 창을 미리 데울 때 돌리는 코드. 람다, 스트림, 컬렉션, String.format 을 한 번씩 쓴다: 새 JVM 에서 이것들을
// 처음 쓸 때 느려서(QA 2026-11-18: 창을 바꾼 직후 람다 정답 코드가 시간 제한에 걸림), 그 느림을 뒤에서 미리 겪게 한다.
const WARM_CODE = `import java.util.*;
import java.util.stream.*;
public class Main {
    public static void main(String[] args) {
        List<Integer> a = new ArrayList<>(Arrays.asList(3, 1, 2));
        a.sort((x, y) -> y - x);
        a.removeIf(x -> x < 0);
        a.forEach(x -> { });
        Map<String, Integer> m = new HashMap<>();
        m.put("a", 1);
        String s = a.stream().filter(x -> x > 0).map(x -> x * 2).map(String::valueOf).collect(Collectors.joining(","));
        int t = a.stream().mapToInt(x -> x).sum();
        StringBuilder sb = new StringBuilder(String.format("%s %d %.1f", s, t, 1.5));
        sb.append(new TreeSet<>(a)).append(m);
    }
}`;

/** 불러오고 한 번 컴파일까지 해 둔 창을 만든다 (그래서 첫 진짜 실행이 빠르다). f.warm 은 데우기가 끝나면 끝나는 Promise. */
function warmFrame() {
    const f = makeFrame();
    f.warm = f.ready
        .then(() => f.send(WARM_CODE))
        .then(() => {
            f.runs = 1;
        });
    f.warm.catch(() => {});
    return f;
}

/**
 * 이번 실행에 쓸 창을 고른다: 없으면 만들고, SPARE_AT 번째부터 다음 창을 미리 띄우고, FRAME_RUNS 번 썼으면 다음 창으로
 * 바꾼다 (헌 창은 2초 뒤에 버린다). 창이 준비될 때까지 기다린다. 못 불러오면 에러.
 */
async function frameForRun() {
    if (!current) current = warmFrame();
    if (current.runs >= SPARE_AT && !spare) spare = warmFrame();
    if (current.runs >= FRAME_RUNS) {
        const old = current;
        current = spare || warmFrame();
        spare = null;
        setTimeout(() => killFrame(old), 2000); // 아직 처리 중인 것이 있으면 끝나게 잠깐 기다렸다가 버린다
    }
    try {
        await current.warm;
    } catch {
        killFrame(current);
        current = null;
        throw loadFailed();
    }
    return current;
}

/** 자바를 뒤에서 불러오기 시작한다 (여러 번 불러도 괜찮다). */
export function initJava() {
    if (!current) current = warmFrame();
    return current.warm;
}

/** 자바를 불러오고 한 번 컴파일까지 해 둔다 (첫 진짜 실행이 빠르도록). 게임을 시작할 때 부른다. 실패하면 창을 버린다. */
export function warmUpJava() {
    return initJava().catch((e) => {
        killFrame(current);
        current = null;
        throw e;
    });
}

/** 자바로 한 번이라도 실행했는지 (준비가 끝났는지 대략 알 때 쓴다). */
export function isJavaReady() {
    return window.__cotudyJavaReady === true;
}

let queue = Promise.resolve(); // 실행을 한 줄로 세우는 대기열 (자바 실행은 한 번에 하나씩)
/**
 * Main.java 하나를 컴파일하고 실행한다. 앞 실행이 끝나야 다음 실행을 한다.
 * 돌려주는 값: { ok, phase: 'compile' | 'run', output, error, line, ms }.
 */
export function runJava(source) {
    const job = queue.then(() => doRun(source));
    queue = job.catch(() => {});
    return job;
}

/** 실제 실행: 창을 골라 코드를 보내고, 창이 돌려준 글자를 결과 객체로 바꾼다. 창의 답 첫 글자: C=컴파일 에러, R=정상, X=실행 중 예외. */
async function doRun(source) {
    const f = await frameForRun();
    window.__cotudyJavaReady = true;
    f.runs++;
    const t0 = performance.now();
    const timer = new Promise((resolve) => setTimeout(() => resolve({ timeout: true }), TIME_LIMIT));
    const d = await Promise.race([f.send(source), timer]);
    const ms = performance.now() - t0;
    if (d.timeout || d.fail) {
        // 대답이 없거나 자바가 고장 남: 이 창은 버리고 다음 실행 때 새 창을 쓴다
        if (current === f) current = null;
        killFrame(f);
        if (d.timeout)
            return {
                ok: false,
                phase: 'run',
                output: '',
                line: 0,
                ms,
                error: tr(
                    `시간 초과: ${TIME_LIMIT / 1000}초 안에 끝나지 않았어요.`,
                    `Time limit: it didn't finish within ${TIME_LIMIT / 1000} seconds.`,
                ),
            };
        return {
            ok: false,
            phase: 'run',
            output: '',
            line: 0,
            ms,
            error: tr(
                '자바 실행기에 문제가 생겨서 다시 준비할게요. 한 번 더 실행해 주세요.',
                'The Java runner had a problem and is restarting. Please run it again.',
            ),
        };
    }
    const res = d.res;
    const kind = res[0];
    const text = res.slice(1).replace(/\/files\/(?:[a-z]\/)?src\//g, ''); // 에러 메시지의 내부 폴더 경로는 지워서 Main.java 만 보이게
    if (kind === 'C') {
        return {
            ok: false,
            phase: 'compile',
            output: '',
            error: text.trim(),
            line: +(text.match(/Main\.java:(\d+)/)?.[1] || 0),
            ms,
        };
    }
    // 예외 내용에서 우리 도우미가 덧붙이는 내부 호출 줄(reflection 등)은 빼고 사용자 코드 부분만 남긴다
    const output =
        kind === 'X'
            ? text
                  .split('\n')
                  .filter(
                      (l) =>
                          !/^\s+at (sun\.reflect|java\.lang\.reflect|java\.lang\.invoke|jdk\.internal|cotudy\.Runner|com\.leaningtech)/.test(
                              l,
                          ),
                  )
                  .join('\n')
            : text;
    return {
        ok: kind === 'R',
        phase: 'run',
        output,
        error: kind === 'X' ? output.trim() : '',
        line: +(output.match(/Main\.java:(\d+)\)/)?.[1] || 0),
        ms,
    };
}

/**
 * 자주 보는 javac(컴파일) 에러와 실행 중 예외를 짧은 쉬운 말로 풀어 준다. 미션 창의 "쉬운 말로" 칸에 나온다.
 */
export function explainError(text) {
    if (!text) return '';
    const m = text.match(/Main\.java:(\d+): error: (.+)/);
    const line = m ? tr(`${m[1]}번째 줄`, `Line ${m[1]}`) : tr('코드', 'Your code');
    const msg = m ? m[2] : text;
    const rules = [
        [
            /';' expected/,
            `${line} 끝에 ; 가 빠졌어요. 자바는 문장이 끝날 때마다 ; 를 붙여야 해요.`,
            `${line}: a ; is missing at the end. Every Java statement ends with ;.`,
        ],
        [
            /cannot find symbol/,
            `${line}에 자바가 모르는 이름이 있어요. 오타가 있거나, 아직 만들지 않은 변수를 썼을 수 있어요. (대소문자도 구분해요: System, String 은 대문자로 시작)`,
            `${line}: there is a name Java doesn't know. Maybe a typo, or a variable you haven't made yet. (Case matters too: System and String start with a capital.)`,
        ],
        [
            /unclosed string literal/,
            `${line}의 문자열 따옴표 " 가 닫히지 않았어요.`,
            `${line}: the string's closing quote " is missing.`,
        ],
        [
            /unclosed character literal|empty character literal/,
            `${line}의 char 따옴표 ' 를 확인해 주세요. char 는 글자 하나를 '가' 처럼 작은따옴표로 감싸요.`,
            `${line}: check the char quotes '. A char holds one character in single quotes, like 'A'.`,
        ],
        [
            /possible lossy conversion from (\w+) to (\w+)/,
            `${line}: 큰 타입(%1)을 작은 타입(%2) 변수에 그냥 넣을 수 없어요. 값이 잘릴 수 있어서예요. (%2) 처럼 형변환을 써야 해요.`,
            `${line}: you can't put a bigger type (%1) straight into a smaller type (%2) variable, because part of the value could be lost. Use a cast like (%2).`,
        ],
        [
            /incompatible types: (\w+) cannot be converted to (\w+)/,
            `${line}: %1 값을 %2 변수에 넣을 수 없어요. 타입을 확인해 주세요.`,
            `${line}: a %1 value can't go into a %2 variable. Check the types.`,
        ],
        [
            /integer number too large/,
            `${line}: int 에 담기엔 너무 큰 숫자예요. long 을 쓰고 숫자 끝에 L 을 붙여 주세요.`,
            `${line}: this number is too big for an int. Use long and put L at the end of the number.`,
        ],
        [
            /reached end of file while parsing/,
            `{ } 짝이 안 맞아요. 여는 { 마다 닫는 } 가 있는지 확인해 주세요.`,
            `The { } don't match. Make sure every { has a closing }.`,
        ],
        [
            /class, interface, (or )?enum.* expected/,
            `${line} 근처에서 { } 짝이 안 맞거나, 클래스 밖에 코드가 있어요.`,
            `Near ${line}: the { } don't match, or there is code outside the class.`,
        ],
        [
            /variable (\w+) is already defined/,
            `${line}: 변수 %1 를 두 번 만들었어요. 이미 만든 변수에 새 값을 넣을 때는 타입(int 등)을 다시 쓰지 않아요.`,
            `${line}: you made the variable %1 twice. When you store a new value in an existing variable, don't write the type (int etc.) again.`,
        ],
        [
            /variable (\w+) might not have been initialized/,
            `${line}: 변수 %1 에 아직 값을 넣지 않았어요.`,
            `${line}: the variable %1 doesn't have a value yet.`,
        ],
        [
            /not a statement/,
            `${line}이 자바 문장이 아니에요. 빠진 글자나 기호가 없는지 확인해 주세요.`,
            `${line} is not a Java statement. Check for missing letters or symbols.`,
        ],
        [
            /illegal start of expression/,
            `${line} 근처에 기호가 잘못 들어갔어요. 괄호 ( ) 와 { } 짝을 확인해 주세요.`,
            `Near ${line}: a symbol is in the wrong place. Check that ( ) and { } come in pairs.`,
        ],
    ];
    for (const [re, ko, en] of rules) {
        const r = msg.match(re);
        if (r) return tr(ko, en).replace(/%(\d)/g, (_, i) => r[+i] ?? '');
    }
    if (/ArithmeticException/.test(text)) return tr('실행 중에 0 으로 나누었어요.', 'You divided by 0 while running.');
    if (/ArrayIndexOutOfBounds/.test(text))
        return tr('배열에 없는 칸 번호를 썼어요.', "You used a position that isn't in the array.");
    if (/NullPointerException/.test(text))
        return tr('값이 없는(null) 변수를 사용했어요.', 'You used a variable that has no value (null).');
    if (/Exception in thread/.test(text))
        return tr(
            '실행 중에 오류가 났어요. 위 메시지의 첫 줄을 확인해 주세요.',
            'Something went wrong while running. Check the first line of the message above.',
        );
    return '';
}
