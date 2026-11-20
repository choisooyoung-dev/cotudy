// Code display helpers: Java syntax highlight, read-only view (with blanks), and a small editor.
import { tr } from '../i18n.js';

const KEYWORDS = new Set(
    'public private protected class static void new return if else for while do switch case break continue final this super extends implements interface abstract try catch finally throw throws import package true false null let const var function typeof undefined of in async await def elif and or not None True False pass lambda from as with global'.split(
        ' ',
    ),
);
const TYPES = new Set(
    'int long double float boolean char byte short String System Math Integer Double Long Boolean Character Object ArrayList HashMap List Map Scanner console Number Array JSON'.split(
        ' ',
    ),
);

const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

/** Returns highlighted HTML for one line of Java. */
export function highlightLine(line) {
    let out = '';
    const re =
        /(\/\/.*$|#.*$)|("(?:[^"\\]|\\.)*"?|`(?:[^`\\]|\\.)*`?)|('(?:[^'\\]|\\.)*'?)|(\b\d+(?:\.\d+)?[LlDdFf]?\b)|([A-Za-z_]\w*)|([\s\S])/g;
    let m;
    while ((m = re.exec(line))) {
        if (m[1]) out += `<span class="c">${esc(m[1])}</span>`;
        else if (m[2] || m[3]) out += `<span class="s">${esc(m[2] || m[3])}</span>`;
        else if (m[4]) out += `<span class="num">${m[4]}</span>`;
        else if (m[5]) {
            const w = m[5];
            const next = line.slice(re.lastIndex).trimStart()[0];
            if (KEYWORDS.has(w)) out += `<span class="k">${w}</span>`;
            else if (TYPES.has(w)) out += `<span class="t">${w}</span>`;
            else if (next === '(') out += `<span class="f">${w}</span>`;
            else out += w;
        } else out += esc(m[6]);
    }
    return out;
}

export function highlight(code) {
    return code.split('\n').map(highlightLine).join('\n');
}

/** Read-only code box. `blanks` turns {{i}} into inputs. Returns { el, values(), inputs }. */
const badgeHTML = (badge, color) =>
    `<span class="java" style="background:${color || '#f89820'}">${badge || 'Java 21'}</span>`;

export function codeView(code, { title = 'Main.java', blanks = null, badge, badgeColor } = {}) {
    const el = document.createElement('div');
    el.className = 'editor';
    el.innerHTML = `<div class="tabbar"><span class="tab">${title}</span>${badgeHTML(badge, badgeColor)}</div>`;
    const pre = document.createElement('pre');
    pre.className = 'codeview';
    const inputs = [];
    code.split('\n').forEach((line, i) => {
        const row = document.createElement('div');
        row.className = 'ln';
        row.innerHTML = `<span class="n">${i + 1}</span>`;
        const span = document.createElement('span');
        if (blanks) {
            // split by {{n}} and highlight the pieces around the inputs
            const parts = line.split(/(\{\{\d+\}\})/);
            for (const part of parts) {
                const bm = part.match(/^\{\{(\d+)\}\}$/);
                if (bm) {
                    const idx = +bm[1];
                    const inp = document.createElement('input');
                    inp.className = 'blank';
                    inp.spellcheck = false;
                    inp.autocapitalize = 'off';
                    inp.setAttribute('autocomplete', 'off');
                    inp.style.width = `${Math.max(3, blanks[idx]?.size || 6) + 1}ch`;
                    inp.dataset.idx = idx;
                    inputs[idx] = inp;
                    span.appendChild(inp);
                } else {
                    const s = document.createElement('span');
                    s.innerHTML = highlightLine(part);
                    span.appendChild(s);
                }
            }
        } else span.innerHTML = highlightLine(line);
        row.appendChild(span);
        pre.appendChild(row);
    });
    el.appendChild(pre);
    return {
        el,
        inputs,
        values: () => inputs.map((i) => i.value),
        fill: (src) => code.replace(/\{\{(\d+)\}\}/g, (_, i) => inputs[+i]?.value ?? ''),
        markLine(n) {
            [...pre.children].forEach((r, i) => r.classList.toggle('err', i + 1 === n));
        },
    };
}

/**
 * 중괄호 언어(Java, JavaScript)의 들여쓰기를 { } 깊이에 맞춰 다시 맞춘다. 한 단계는 공백 4칸.
 * 문자열·글자·주석 안의 괄호는 세지 않고, switch 의 case 아래 줄은 한 칸 더 들여쓴다.
 * 여러 줄에 걸친 JS 템플릿 문자열(`…`) 안의 줄은 건드리지 않는다.
 */
export function reindentBraces(src, unit = 4) {
    const out = [];
    let depth = 0;
    let inBlock = false; // /* … */ 안
    let inTpl = false; // ` … ` 안 (여러 줄)
    const caseAt = []; // caseAt[d] = 이 깊이에서 case 를 만났는지
    const extraAt = []; // extraAt[d] = 깊이 d 의 줄들에 더할 들여쓰기 (case 아래, 점 이어 쓰기 안쪽)
    const openerExtra = []; // openerExtra[d] = 깊이 d 를 연 줄의 추가 들여쓰기 (닫는 } 를 거기에 맞춘다)
    for (const raw of src.split('\n')) {
        const startedInTpl = inTpl;
        const t = raw.trim();
        // 이 줄의 괄호 세기 (문자열·주석 제외)
        let opens = 0,
            closes = 0,
            leading = 0,
            seenCode = false;
        for (let i = 0; i < t.length; i++) {
            const ch = t[i];
            if (inBlock) {
                if (ch === '*' && t[i + 1] === '/') {
                    inBlock = false;
                    i++;
                }
                continue;
            }
            if (inTpl) {
                if (ch === '\\') i++;
                else if (ch === '`') inTpl = false;
                continue;
            }
            if (ch === '/' && t[i + 1] === '/') break;
            if (ch === '/' && t[i + 1] === '*') {
                inBlock = true;
                i++;
                continue;
            }
            if (ch === '"' || ch === "'") {
                for (i++; i < t.length && t[i] !== ch; i++) if (t[i] === '\\') i++;
                seenCode = true;
                continue;
            }
            if (ch === '`') {
                inTpl = true;
                seenCode = true;
                continue;
            }
            if (ch === '{') opens++;
            else if (ch === '}') {
                if (!seenCode && opens === 0) leading++;
                else if (opens > 0) opens--;
                else closes++;
            } else if (ch !== ' ') seenCode = true;
        }
        if (startedInTpl) {
            out.push(raw); // 템플릿 문자열 안: 그대로
            depth = Math.max(0, depth - leading - closes + opens);
            continue;
        }
        // 맨 앞의 } 들은 이 줄부터 한 단계씩 내린다
        // 맨 앞의 } 는 그 { 를 연 줄과 같은 들여쓰기로 맞춘다
        let closeExtra = null;
        for (let k = 0; k < leading; k++) {
            caseAt[depth] = false;
            closeExtra = openerExtra[depth] || 0;
            depth = Math.max(0, depth - 1);
        }
        const isCase = /^(case\b.*|default\s*):/.test(t);
        // .then(…) 처럼 점으로 이어지는 줄은 한 칸 더 (JS 메서드 이어 쓰기)
        const lineExtra = (extraAt[depth] || 0) + (t.startsWith('.') ? 1 : 0) + (caseAt[depth] && !isCase ? 1 : 0);
        const level = depth + (closeExtra ?? lineExtra);
        if (isCase) caseAt[depth] = true;
        out.push(t ? ' '.repeat(level * unit) + t : '');
        for (let k = 0; k < closes; k++) {
            caseAt[depth] = false;
            depth = Math.max(0, depth - 1);
        }
        const ex = closeExtra ?? lineExtra;
        for (let k = 0; k < opens; k++) {
            caseAt[++depth] = false;
            extraAt[depth] = ex; // 이 { 안쪽 줄들이 물려받는 추가 들여쓰기
            openerExtra[depth] = ex; // 이 { 를 닫는 } 의 추가 들여쓰기
        }
    }
    return out.join('\n');
}

/** Editable code box with highlight overlay, line numbers, Tab = one indent unit (4 spaces, JavaScript 2). */
export function codeEditor(initial, { title = 'Main.java', onRun, badge, badgeColor, braces = true, unit = 4 } = {}) {
    // unit: 들여쓰기 한 단계의 칸 수. JavaScript 예제·정답은 2칸, Java·Python 은 4칸.
    const pad = ' '.repeat(unit);
    // braces: 중괄호 언어(Java, JavaScript)면 true → 「정렬」 버튼과 } 자동 내어쓰기. Python 은 false.
    const el = document.createElement('div');
    el.className = 'editor grow';
    const fmtBtn = braces
        ? `<button class="reset fmt" title="${tr('들여쓰기를 { } 에 맞춰 정렬 (Shift + Alt + F)', 'Line up the indentation with the { } (Shift + Alt + F)')}">${tr('정렬', 'Format')}</button>`
        : '';
    el.innerHTML = `<div class="tabbar"><span class="tab">${title}</span><button class="reset" title="${tr('처음 코드로', 'Back to the starting code')}">${tr('처음으로', 'Reset')}</button>${fmtBtn}${badgeHTML(badge, badgeColor)}</div>
  <div class="ed-wrap"><div class="ed-gutter"></div><div class="ed-area"><pre></pre><textarea spellcheck="false" autocapitalize="off" autocomplete="off"></textarea></div></div>`;
    const ta = el.querySelector('textarea');
    const pre = el.querySelector('pre');
    const gutter = el.querySelector('.ed-gutter');
    let errLine = 0;
    const render = () => {
        const lines = ta.value.split('\n');
        pre.innerHTML =
            lines
                .map((l, i) => {
                    const h = highlightLine(l) || ' ';
                    return i + 1 === errLine
                        ? `<span style="background:#5a2a2a;display:inline-block;min-width:100%">${h}</span>`
                        : h;
                })
                .join('\n') + '\n';
        gutter.textContent = lines.map((_, i) => i + 1).join('\n');
        // let the textarea grow with content so the wrapper scrolls
        ta.style.height = 'auto';
        ta.style.height = pre.scrollHeight + 'px';
        ta.style.width = Math.max(pre.scrollWidth, ta.parentElement.clientWidth) + 'px';
    };
    ta.value = initial;
    ta.addEventListener('input', () => {
        errLine = 0;
        render();
    });
    const changed = () => ta.dispatchEvent(new Event('input')); // 화면 다시 그리기 + 미션 쪽 저장
    /** [시작, 끝) 줄 범위: 선택 영역이 걸친 줄들의 맨 앞 위치와 끝 위치 */
    const lineRange = () => {
        const a = ta.value.lastIndexOf('\n', ta.selectionStart - 1) + 1;
        let b = ta.value.indexOf('\n', ta.selectionEnd - (ta.selectionEnd > ta.selectionStart ? 1 : 0));
        if (b < 0) b = ta.value.length;
        return [a, b];
    };
    const format = () => {
        // 커서가 있던 줄과, 그 줄에서 들여쓰기 뒤 몇 번째 글자였는지를 기억해 두고 정렬 뒤에 되돌린다
        const before = ta.value.slice(0, ta.selectionStart).split('\n');
        const row = before.length - 1;
        const oldLine = ta.value.split('\n')[row];
        const col = Math.max(0, before[row].length - oldLine.match(/^ */)[0].length);
        const next = reindentBraces(ta.value, unit);
        if (next === ta.value) return;
        ta.value = next;
        const lines = next.split('\n');
        let pos = lines.slice(0, row).reduce((n, l) => n + l.length + 1, 0);
        pos += Math.min(lines[row].match(/^ */)[0].length + col, lines[row].length);
        ta.setSelectionRange(pos, pos);
        changed();
    };
    ta.addEventListener('keydown', (e) => {
        e.stopPropagation(); // don't move the character while typing
        const s = ta.selectionStart,
            en = ta.selectionEnd;
        const lineStart = ta.value.lastIndexOf('\n', s - 1) + 1;
        const beforeCursor = ta.value.slice(lineStart, s);
        if (e.key === 'Tab' && (e.shiftKey || ta.value.slice(s, en).includes('\n'))) {
            // 여러 줄 선택 Tab → 한 칸씩 들여쓰기, Shift+Tab → 한 칸씩 내어쓰기
            e.preventDefault();
            const [a, b] = lineRange();
            const block = ta.value.slice(a, b);
            const moved = block
                .split('\n')
                .map((l) => (e.shiftKey ? l.replace(new RegExp(`^ {1,${unit}}`), '') : l ? pad + l : l))
                .join('\n');
            ta.setRangeText(moved, a, b, 'select');
            if (s === en) {
                const p = Math.max(a, s + (moved.length - block.length));
                ta.setSelectionRange(p, p);
            }
            changed();
        } else if (e.key === 'Tab') {
            e.preventDefault();
            ta.setRangeText(pad, s, en, 'end');
            changed();
        } else if (e.key === 'Enter' && !e.shiftKey && !e.metaKey && !e.ctrlKey) {
            // 들여쓰기 유지, { 나 : 뒤면 한 칸 더, {|} 사이면 } 를 다음 줄로
            e.preventDefault();
            const indent = beforeCursor.match(/^ */)[0];
            const prev = ta.value.slice(lineStart, s).trimEnd();
            const opens = prev.endsWith('{') || (!braces && prev.endsWith(':'));
            if (braces && prev.endsWith('{') && ta.value.slice(en).match(/^ *\}/) && s === en) {
                const after = ta.value.slice(en).match(/^ */)[0].length;
                ta.setRangeText('\n' + indent + pad + '\n' + indent, s, en + after, 'start');
                const p = s + 1 + indent.length + unit;
                ta.setSelectionRange(p, p);
            } else {
                // Python: return·break·continue·pass·raise 다음 줄은 한 칸 내어 쓴다
                const out = !braces && /^\s*(return|break|continue|pass|raise)\b/.test(prev);
                const ind = out ? indent.slice(unit) : indent + (opens ? pad : '');
                ta.setRangeText('\n' + ind, s, en, 'end');
            }
            changed();
        } else if (braces && e.key === '}' && /^ *$/.test(beforeCursor) && beforeCursor.length >= unit) {
            // 빈 줄에서 } 를 치면 한 칸 내어 쓴다
            e.preventDefault();
            ta.setRangeText('}', s - unit, en, 'end');
            changed();
        } else if (braces && e.code === 'KeyF' && e.shiftKey && e.altKey) {
            e.preventDefault();
            format();
        } else if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
            e.preventDefault();
            onRun?.();
        }
    });
    el.querySelector('.fmt')?.addEventListener('click', () => {
        format();
        ta.focus();
    });
    el.querySelector('.reset').addEventListener('click', () => {
        ta.value = initial;
        changed();
        ta.focus();
    });
    requestAnimationFrame(render);
    return {
        el,
        get value() {
            return ta.value;
        },
        set value(v) {
            ta.value = v;
            render();
        },
        focus() {
            ta.focus();
            // put the cursor on the line after the "write your code here" comment
            const marker =
                [
                    '// 여기에 코드를 쓰세요',
                    '# 여기에 코드를 쓰세요',
                    '// Write your code here',
                    '# Write your code here',
                ]
                    .map((m) => ta.value.indexOf(m))
                    .find((i) => i >= 0) ?? -1;
            if (marker >= 0) {
                const end = ta.value.indexOf('\n', marker);
                const indent = ta.value.slice(ta.value.lastIndexOf('\n', marker) + 1, marker);
                if (ta.value[end + 1] === '\n') {
                    ta.setRangeText(indent, end + 1, end + 1, 'end');
                    render();
                } else ta.setSelectionRange(end + 1, end + 1);
            }
        },
        markLine(n) {
            errLine = n;
            render();
        },
    };
}
