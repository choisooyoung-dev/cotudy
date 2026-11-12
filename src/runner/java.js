// Runs real Java in the browser with CheerpJ (https://cheerpj.com).
// The CheerpJ runtime comes from its CDN; javac comes from public/tools.jar (Eclipse Temurin OpenJDK 8u512).
// CheerpJ maps "/app/..." to this web server's root, "/str/..." to in-memory files,
// and "/files/..." to a writable IndexedDB folder.

const LOADER_URL = 'https://cjrtnc.leaningtech.com/5.0/loader.js';

let initPromise = null;
let queue = Promise.resolve();
let runCount = 0;

function loadScript(src) {
  return new Promise((resolve, reject) => {
    const s = document.createElement('script');
    s.src = src;
    s.onload = resolve;
    s.onerror = () => reject(new Error('CheerpJ 를 불러오지 못했어요. 인터넷 연결을 확인해 주세요.'));
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
// Instead we compile this small helper once, load it with cheerpjRunLibrary, and then each run is one
// Java method call: compile with javac's API, then call Main.main through a fresh class loader.
const RUNNER_SRC = `package cotudy;
import java.io.*; import java.net.*; import java.lang.reflect.*;
public class Runner {
  public static String run(String code) throws Exception {
    File dir = new File("/files/run/");
    dir.mkdirs();
    new File("/files/src/").mkdirs();
    String src = "/files/src/Main.java";
    Writer w = new OutputStreamWriter(new FileOutputStream(src), "UTF-8");
    w.write(code);
    w.close();
    StringWriter log = new StringWriter();
    PrintWriter pw = new PrintWriter(log);
    int rc = com.sun.tools.javac.Main.compile(new String[] { src, "-d", "/files/run/", "-encoding", "UTF-8" }, pw);
    pw.flush();
    if (rc != 0) return "C" + log;
    PrintStream oldOut = System.out, oldErr = System.err;
    ByteArrayOutputStream buf = new ByteArrayOutputStream();
    PrintStream ps = new PrintStream(buf, true, "UTF-8");
    System.setOut(ps); System.setErr(ps);
    String status = "R";
    try {
      URLClassLoader cl = new URLClassLoader(new URL[] { dir.toURI().toURL() }, null);
      Method m = cl.loadClass("Main").getMethod("main", String[].class);
      m.invoke(null, (Object) new String[0]);
    } catch (InvocationTargetException e) {
      status = "X";
      ps.print("Exception in thread \\"main\\" ");
      e.getCause().printStackTrace(ps);
    } catch (Throwable t) {
      status = "X";
      t.printStackTrace(ps);
    } finally {
      ps.flush();
      System.setOut(oldOut); System.setErr(oldErr);
    }
    return status + buf.toString("UTF-8");
  }
}`;

let fastRunner = null; // Promise<Runner class | null>
function loadFastRunner() {
  fastRunner ||= (async () => {
    const out = consoleEl();
    window.cheerpOSAddStringFile('/str/Runner.java', new TextEncoder().encode(RUNNER_SRC));
    out.textContent = '';
    const code = await window.cheerpjRunMain('com.sun.tools.javac.Main', toolsJarPath(), '/str/Runner.java', '-d', '/files/', '-encoding', 'UTF-8');
    if (code !== 0) throw new Error('runner compile failed: ' + out.textContent);
    const lib = await window.cheerpjRunLibrary(`${toolsJarPath()}:/files/`);
    return await lib.cotudy.Runner;
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
  const line = m ? `${m[1]}번째 줄` : '코드';
  const msg = m ? m[2] : text;
  const rules = [
    [/';' expected/, `${line} 끝에 ; 가 빠졌어요. 자바는 문장이 끝날 때마다 ; 를 붙여야 해요.`],
    [/cannot find symbol/, `${line}에 자바가 모르는 이름이 있어요. 오타가 있거나, 아직 만들지 않은 변수를 썼을 수 있어요. (대소문자도 구분해요: System, String 은 대문자로 시작)`],
    [/unclosed string literal/, `${line}의 문자열 따옴표 " 가 닫히지 않았어요.`],
    [/unclosed character literal|empty character literal/, `${line}의 char 따옴표 ' 를 확인해 주세요. char 는 글자 하나를 '가' 처럼 작은따옴표로 감싸요.`],
    [/possible lossy conversion from (\w+) to (\w+)/, `${line}: 큰 타입(%1)을 작은 타입(%2) 변수에 그냥 넣을 수 없어요. 값이 잘릴 수 있어서예요. (%2) 처럼 형변환을 써야 해요.`],
    [/incompatible types: (\w+) cannot be converted to (\w+)/, `${line}: %1 값을 %2 변수에 넣을 수 없어요. 타입을 확인해 주세요.`],
    [/integer number too large/, `${line}: int 에 담기엔 너무 큰 숫자예요. long 을 쓰고 숫자 끝에 L 을 붙여 주세요.`],
    [/reached end of file while parsing/, `{ } 짝이 안 맞아요. 여는 { 마다 닫는 } 가 있는지 확인해 주세요.`],
    [/class, interface, (or )?enum.* expected/, `${line} 근처에서 { } 짝이 안 맞거나, 클래스 밖에 코드가 있어요.`],
    [/variable (\w+) is already defined/, `${line}: 변수 %1 를 두 번 만들었어요. 이미 만든 변수에 새 값을 넣을 때는 타입(int 등)을 다시 쓰지 않아요.`],
    [/variable (\w+) might not have been initialized/, `${line}: 변수 %1 에 아직 값을 넣지 않았어요.`],
    [/not a statement/, `${line}이 자바 문장이 아니에요. 빠진 글자나 기호가 없는지 확인해 주세요.`],
    [/illegal start of expression/, `${line} 근처에 기호가 잘못 들어갔어요. 괄호 ( ) 와 { } 짝을 확인해 주세요.`],
  ];
  for (const [re, ko] of rules) {
    const r = msg.match(re);
    if (r) return ko.replace(/%(\d)/g, (_, i) => r[+i] ?? '');
  }
  if (/ArithmeticException/.test(text)) return '실행 중에 0 으로 나누었어요.';
  if (/ArrayIndexOutOfBounds/.test(text)) return '배열에 없는 칸 번호를 썼어요.';
  if (/NullPointerException/.test(text)) return '값이 없는(null) 변수를 사용했어요.';
  if (/Exception in thread/.test(text)) return '실행 중에 오류가 났어요. 위 메시지의 첫 줄을 확인해 주세요.';
  return '';
}
