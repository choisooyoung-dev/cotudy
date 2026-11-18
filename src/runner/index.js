// 언어마다 하나씩: 코드를 어떻게 실행하는지, 에러를 쉬운 말로 어떻게 풀어 주는지, 코드 창에 무엇을 표시하는지.
// 미션 창(src/ui/mission.js)과 면접(src/ui/hire.js)은 언어를 몰라도 RUNTIMES[언어].run(코드) 하나로 실행한다.
import { runJava, explainError, warmUpJava } from './java.js';
import { runJs, explainJsError } from './javascript.js';
import { runPython, explainPyError, warmUpPython } from './python.js';
import { tr } from '../i18n.js';
import { withSaved, hasSaved } from './cache.js';

/**
 * 언어별 실행기 정보.
 * - name / file / badge / badgeColor: 코드 창 위에 보이는 언어 이름, 파일 이름, 배지 글자와 색
 * - run(code): 실행해서 { ok, phase, output, error, line, ms } 를 돌려준다 (자바·파이썬은 미리 실행한 결과부터 확인)
 * - saved(code): 이 코드의 미리 실행한 결과가 있는지
 * - explain(err, line): 에러 메시지를 쉬운 한국어 설명으로
 * - warm(): 실행기를 미리 불러 두기 (첫 실행이 빠르도록)
 * - loadingNote: 실행기를 불러오는 동안 보여 줄 안내 (JavaScript 는 바로 돼서 없음)
 */
export const RUNTIMES = {
    java: {
        name: 'Java',
        file: 'Main.java',
        badge: 'Java 21',
        badgeColor: '#f89820',
        run: withSaved('java', runJava),
        saved: (code) => hasSaved('java', code),
        explain: (err) => explainError(err),
        warm: warmUpJava,
        loadingNote: tr(
            '☕ 자바 준비 중… 처음 한 번은 10~40초쯤 걸려요',
            '☕ Getting Java ready… the first time takes about 10–40 seconds',
        ),
    },
    javascript: {
        name: 'JavaScript',
        file: 'main.js',
        badge: 'JavaScript',
        badgeColor: '#d4b100',
        run: runJs,
        saved: () => false,
        explain: (err, line) => explainJsError(err, line),
        warm: () => Promise.resolve(),
        loadingNote: '',
    },
    python: {
        name: 'Python',
        file: 'main.py',
        badge: 'Python 3',
        badgeColor: '#3776ab',
        run: withSaved('python', runPython),
        saved: (code) => hasSaved('python', code),
        explain: (err, line) => explainPyError(err, line),
        warm: warmUpPython,
        loadingNote: tr(
            '🐍 파이썬 준비 중… 처음 한 번은 몇 초 걸려요',
            '🐍 Getting Python ready… the first time takes a few seconds',
        ),
    },
};
