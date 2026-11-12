// Code display helpers: Java syntax highlight, read-only view (with blanks), and a small editor.

const KEYWORDS = new Set('public private protected class static void new return if else for while do switch case break continue final this super extends implements interface abstract try catch finally throw throws import package true false null'.split(' '));
const TYPES = new Set('int long double float boolean char byte short String System Math Integer Double Long Boolean Character Object ArrayList HashMap List Map Scanner'.split(' '));

const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

/** Returns highlighted HTML for one line of Java. */
export function highlightLine(line) {
  let out = '';
  const re = /(\/\/.*$)|("(?:[^"\\]|\\.)*"?)|('(?:[^'\\]|\\.)*'?)|(\b\d+(?:\.\d+)?[LlDdFf]?\b)|([A-Za-z_]\w*)|([\s\S])/g;
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
export function codeView(code, { title = 'Main.java', blanks = null } = {}) {
  const el = document.createElement('div');
  el.className = 'editor';
  el.innerHTML = `<div class="tabbar"><span class="tab">${title}</span><span class="java">Java 8</span></div>`;
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
    el, inputs,
    values: () => inputs.map((i) => i.value),
    fill: (src) => code.replace(/\{\{(\d+)\}\}/g, (_, i) => inputs[+i]?.value ?? ''),
    markLine(n) { [...pre.children].forEach((r, i) => r.classList.toggle('err', i + 1 === n)); },
  };
}

/** Editable code box with highlight overlay, line numbers, Tab = 4 spaces. */
export function codeEditor(initial, { title = 'Main.java', onRun } = {}) {
  const el = document.createElement('div');
  el.className = 'editor grow';
  el.innerHTML = `<div class="tabbar"><span class="tab">${title}</span><button class="reset" title="처음 코드로">처음으로</button><span class="java">Java 8</span></div>
  <div class="ed-wrap"><div class="ed-gutter"></div><div class="ed-area"><pre></pre><textarea spellcheck="false" autocapitalize="off" autocomplete="off"></textarea></div></div>`;
  const ta = el.querySelector('textarea');
  const pre = el.querySelector('pre');
  const gutter = el.querySelector('.ed-gutter');
  let errLine = 0;
  const render = () => {
    const lines = ta.value.split('\n');
    pre.innerHTML = lines.map((l, i) => {
      const h = highlightLine(l) || ' ';
      return i + 1 === errLine ? `<span style="background:#5a2a2a;display:inline-block;min-width:100%">${h}</span>` : h;
    }).join('\n') + '\n';
    gutter.textContent = lines.map((_, i) => i + 1).join('\n');
    // let the textarea grow with content so the wrapper scrolls
    ta.style.height = 'auto';
    ta.style.height = pre.scrollHeight + 'px';
    ta.style.width = Math.max(pre.scrollWidth, ta.parentElement.clientWidth) + 'px';
  };
  ta.value = initial;
  ta.addEventListener('input', () => { errLine = 0; render(); });
  ta.addEventListener('keydown', (e) => {
    e.stopPropagation(); // don't move the character while typing
    if (e.key === 'Tab') {
      e.preventDefault();
      const s = ta.selectionStart, en = ta.selectionEnd;
      ta.setRangeText('    ', s, en, 'end');
      render();
    } else if (e.key === 'Enter' && !e.shiftKey && !e.metaKey && !e.ctrlKey) {
      // keep indentation
      e.preventDefault();
      const s = ta.selectionStart;
      const lineStart = ta.value.lastIndexOf('\n', s - 1) + 1;
      const indent = ta.value.slice(lineStart).match(/^ */)[0];
      const extra = ta.value[s - 1] === '{' ? '    ' : '';
      ta.setRangeText('\n' + indent + extra, s, ta.selectionEnd, 'end');
      render();
    } else if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
      e.preventDefault();
      onRun?.();
    }
  });
  el.querySelector('.reset').addEventListener('click', () => { ta.value = initial; errLine = 0; render(); ta.focus(); });
  requestAnimationFrame(render);
  return {
    el,
    get value() { return ta.value; },
    set value(v) { ta.value = v; render(); },
    focus() {
      ta.focus();
      const marker = ta.value.indexOf('// 여기에 코드를 쓰세요');
      if (marker >= 0) {
        const end = ta.value.indexOf('\n', marker);
        const indent = ta.value.slice(ta.value.lastIndexOf('\n', marker) + 1, marker);
        if (ta.value[end + 1] === '\n') { ta.setRangeText(indent, end + 1, end + 1, 'end'); render(); }
        else ta.setSelectionRange(end + 1, end + 1);
      }
    },
    markLine(n) { errLine = n; render(); },
  };
}
