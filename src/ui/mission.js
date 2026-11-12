// The mission window: concept study → predict output → fill blanks → write code → done.
import { runJava, explainError, warmUpJava } from '../runner/java.js';
import { codeView, codeEditor } from './code.js';

const STEP_NAMES = ['부탁', '개념 공부', '출력 예상', '빈칸', '직접 쓰기'];
const norm = (s) => (s || '').replace(/\r/g, '').split('\n').map((l) => l.replace(/\s+$/, '')).join('\n').replace(/\n+$/, '');

let javaReady = false;

export function faceHTML(look = {}) {
  const hair = look.hair || '#3b2a20';
  const vest = look.vest === false ? (look.shirt || '#ddd') : (look.vest || '#c6f432');
  const cap = look.cap || look.helmet;
  return `<div class="face">
    <i style="left:12px;top:${cap ? 16 : 10}px;width:52px;height:20px;background:${hair};border-radius:6px 6px 2px 2px"></i>
    <i style="left:13px;top:18px;width:50px;height:46px;background:${look.skin || '#ffd9b8'};border-radius:8px"></i>
    <i style="left:12px;top:${cap ? 14 : 10}px;width:52px;height:${cap ? 10 : 18}px;background:${cap || hair};border-radius:6px 6px 2px 2px"></i>
    <i style="left:14px;top:26px;width:24px;height:8px;background:${hair};border-radius:2px"></i>
    ${look.style === 'long' ? `<i style="left:8px;top:22px;width:8px;height:44px;background:${hair};border-radius:3px"></i><i style="left:60px;top:22px;width:8px;height:44px;background:${hair};border-radius:3px"></i>` : ''}
    <i style="left:27px;top:39px;width:6px;height:9px;background:#2d2d2d;border-radius:2px"></i>
    <i style="left:44px;top:39px;width:6px;height:9px;background:#2d2d2d;border-radius:2px"></i>
    <i style="left:18px;top:50px;width:9px;height:5px;background:#ff9aa2;border-radius:3px"></i>
    <i style="left:50px;top:50px;width:9px;height:5px;background:#ff9aa2;border-radius:3px"></i>
    <i style="left:6px;top:64px;width:64px;height:16px;background:${vest};border-radius:6px 6px 0 0"></i>
  </div>`;
}

/**
 * Opens the mission window. Resolves with { stars } when finished, or null if closed early.
 */
export function openMission(root, quest, npc) {
  return new Promise((resolve) => {
    const bg = document.createElement('div');
    bg.className = 'mission-bg';
    bg.innerHTML = `<div class="win">
      <div class="top">
        <button class="btn back">← 센터로</button>
        <div class="title">${quest.title}<small>${npc.role} ${npc.name}의 퀘스트</small></div>
        <div class="steps"><span>${STEP_NAMES.join(' · ')}</span>${STEP_NAMES.map(() => '<i></i>').join('')}</div>
      </div>
      <div class="body"><div class="left"></div><div class="right"></div></div>
    </div>`;
    root.appendChild(bg);
    const left = bg.querySelector('.left');
    const right = bg.querySelector('.right');
    const win = bg.querySelector('.win');
    const stepEls = [...bg.querySelectorAll('.steps i')];

    const st = { step: 'concept', ci: 0, seen: new Set([0]), hintsUsed: 0, solutionShown: false, wrong: { predict: 0, fill: 0, write: 0 }, shownHints: { fill: 0, write: 0 }, reviewFrom: null, passed: {} };

    let javaStatus = javaReady ? 'ready' : 'loading';
    warmUpJava().then(() => { javaReady = true; javaStatus = 'ready'; bg.querySelectorAll('.loading-java').forEach((e) => e.remove()); });

    const close = (result) => { bg.remove(); removeEventListener('keydown', onKey, true); resolve(result); };
    bg.querySelector('.back').addEventListener('click', () => {
      if (st.step === 'done') return close({ stars: starCount() });
      if (confirm('센터로 돌아갈까요? 이 퀘스트는 처음부터 다시 해야 해요.')) close(null);
    });
    const onKey = (e) => { if (e.key === 'Escape' && st.step === 'done') close({ stars: starCount() }); };
    addEventListener('keydown', onKey, true);

    const starCount = () => Math.max(1, 3 - (st.hintsUsed > 0 ? 1 : 0) - (st.solutionShown ? 1 : 0));

    function setSteps() {
      const idx = { concept: 1, predict: 2, fill: 3, write: 4, done: 5 }[st.reviewFrom || st.step];
      stepEls.forEach((el, i) => { el.className = i < idx ? 'on' : i === idx ? 'now' : ''; el.title = STEP_NAMES[i]; });
    }

    let reactEl = null;
    function react(ok, title, text) {
      reactEl?.remove();
      reactEl = document.createElement('div');
      reactEl.className = 'react' + (ok ? '' : ' err');
      reactEl.innerHTML = `<div class="big">${ok ? '🎉' : '🧐'}</div><div><b>${title}</b><p>${npc.name}: "${text}"</p></div>`;
      win.appendChild(reactEl);
      if (!ok) setTimeout(() => reactEl?.classList.contains('err') && reactEl.remove(), 6000);
    }
    const clearReact = () => { reactEl?.remove(); reactEl = null; };

    function npcBox(text) {
      return `<div class="npc">${faceHTML(npc.look)}<div class="bubble"><b>${npc.role} ${npc.name}</b>${text}</div></div>`;
    }
    const javaNote = () => (javaStatus === 'ready' ? '' : '<span class="loading-java">☕ 자바 준비 중… 처음 한 번은 10~40초쯤 걸려요</span>');

    function consoleBox(single) {
      const c = document.createElement('div');
      c.className = 'console' + (single ? ' single' : '');
      return c;
    }

    // ---------- concept ----------
    function renderConcept() {
      const cs = quest.concepts;
      const c = cs[st.ci];
      const reviewing = !!st.reviewFrom;
      left.innerHTML = npcBox(reviewing ? '개념 다시 보고 문제로 돌아가요!' : st.ci === 0 ? quest.request[quest.request.length - 1] + '<br>먼저 이것부터 같이 봐요!' : '천천히 봐도 괜찮아요~')
        + `<div class="card"><h4>이번 퀘스트에 필요한 개념</h4><div class="clist">${cs.map((x, i) => `<div class="ci ${i === st.ci ? 'cur' : st.seen.has(i) ? 'done' : ''}" data-i="${i}">${st.seen.has(i) && i !== st.ci ? '✓ ' : i === st.ci ? '▶ ' : ''}${i + 1}. ${x.title}</div>`).join('')}</div></div>`
        + `<div class="card" style="font-size:13px">각 예제는 <b>▶ 실행해 보기</b>로 진짜 실행 결과를 볼 수 있어요. 개념을 다 보면 <b>문제 풀기</b>로 넘어가요.</div>`;
      left.querySelectorAll('.ci').forEach((el) => el.addEventListener('click', () => { st.ci = +el.dataset.i; st.seen.add(st.ci); render(); }));

      right.innerHTML = `<div class="concept">
        <div class="ctop"><span class="cnum">개념 ${st.ci + 1} / ${cs.length}</span><h2>${c.title}</h2></div>
        <p>${c.body}</p></div>`;
      const box = right.querySelector('.concept');
      const view = codeView(c.code, { title: '예제 · Main.java' });
      box.appendChild(view.el);
      const bar = document.createElement('div');
      bar.className = 'runbar';
      bar.innerHTML = `<button class="btn run">▶ 실행해 보기</button>${javaNote()}<span class="status"></span>`;
      box.appendChild(bar);
      const out = consoleBox(true);
      out.innerHTML = '<div class="col"><h5>실행 결과</h5><span class="muted">▶ 실행해 보기를 눌러 보세요</span></div>';
      box.appendChild(out);
      bar.querySelector('.run').addEventListener('click', async (e) => {
        const b = e.currentTarget; b.disabled = true;
        bar.querySelector('.status').textContent = '실행 중…';
        const r = await runJava(c.code);
        b.disabled = false;
        bar.querySelector('.status').textContent = r.phase === 'compile' && !r.ok ? '컴파일 에러' : `실행 ${(r.ms / 1000).toFixed(1)}초`;
        if (r.ok) out.innerHTML = `<div class="col"><h5>실행 결과</h5><span class="ok">${esc(r.output) || '<span class="muted">(출력 없음)</span>'}</span></div>`;
        else {
          out.classList.remove('single');
          const line = +(r.error.match(/Main\.java:(\d+)/)?.[1] || 0);
          view.markLine(line);
          out.innerHTML = `<div class="col"><h5>에러</h5><span class="bad">${esc(r.error)}</span></div><div class="col plain"><h5>쉬운 말로</h5><b>${explainError(r.error)}</b></div>`;
        }
      });
      if (c.note) { const n = document.createElement('p'); n.className = 'note'; n.innerHTML = '👀 ' + c.note; box.appendChild(n); }
      const nav = document.createElement('div');
      nav.className = 'nav';
      const last = st.ci === cs.length - 1;
      nav.innerHTML = `<button class="btn prev" ${st.ci === 0 ? 'disabled' : ''}>← 이전 개념</button>`
        + (reviewing ? '<button class="btn go back2">문제로 돌아가기 →</button>' : `<button class="btn go next">${last ? '문제 풀기 →' : '다음 개념 →'}</button>`);
      box.appendChild(nav);
      nav.querySelector('.prev').addEventListener('click', () => { st.ci--; render(); });
      nav.querySelector('.next')?.addEventListener('click', () => {
        if (last) { st.step = 'predict'; } else { st.ci++; st.seen.add(st.ci); }
        render();
      });
      nav.querySelector('.back2')?.addEventListener('click', () => { st.step = st.reviewFrom; st.reviewFrom = null; render(); });
    }

    function learnedCard() {
      return `<div class="card"><h4>개념 정리 <button class="linkish review">📖 개념 다시 보기</button></h4><ul>${quest.learned.map((l) => `<li>${l}</li>`).join('')}</ul></div>`;
    }
    function bindReview() {
      left.querySelector('.review')?.addEventListener('click', () => { st.reviewFrom = st.step; st.step = 'concept'; render(); });
    }

    // ---------- predict ----------
    function renderPredict() {
      const p = quest.predict;
      left.innerHTML = npcBox('이 코드, 실행하면 어떻게 나올 것 같아요?') + learnedCard();
      bindReview();
      right.innerHTML = `<div class="concept"><div class="ctop"><span class="cnum">출력 예상</span><h2>${p.prompt}</h2></div></div>`;
      const box = right.querySelector('.concept');
      box.appendChild(codeView(p.code).el);
      const ch = document.createElement('div');
      ch.className = 'choices';
      p.choices.forEach((c, i) => {
        const b = document.createElement('button');
        b.className = 'choice';
        b.textContent = c;
        b.addEventListener('click', () => {
          if (st.passed.predict) return;
          if (i === p.answer) {
            b.classList.add('right'); st.passed.predict = true;
            react(true, '정답이에요!', p.explain);
            nav.querySelector('.next').disabled = false;
          } else {
            b.classList.add('wrong'); st.wrong.predict++;
            react(false, '아쉬워요', st.wrong.predict >= 2 ? p.explain : '음… 다시 한번 골라 볼래요? print 와 println, 변수 값을 천천히 따라가 봐요.');
          }
        });
        ch.appendChild(b);
      });
      box.appendChild(ch);
      const nav = document.createElement('div');
      nav.className = 'nav';
      nav.innerHTML = '<span></span><button class="btn go next" disabled>다음 →</button>';
      box.appendChild(nav);
      nav.querySelector('.next').addEventListener('click', () => { clearReact(); st.step = 'fill'; render(); });
      if (st.passed.predict) nav.querySelector('.next').disabled = false;
    }

    // ---------- fill / write shared ----------
    function hintRow(kind, data) {
      const shown = st.shownHints[kind];
      const canSolve = st.wrong[kind] >= 3 || shown >= data.hints.length;
      return `<div class="hints">${data.hints.slice(0, shown).map((h, i) => `<div class="hint-box">💡 힌트 ${i + 1}: ${h}</div>`).join('')}</div>
        <div class="hint-row">
          ${data.hints.map((_, i) => `<button class="btn hint" data-i="${i}" ${i !== shown ? 'disabled' : ''}>💡 힌트 ${i + 1}${i < shown ? ' ✓' : ''}</button>`).join('')}
          <button class="btn solve" ${canSolve ? '' : 'disabled'} title="3번 틀리면 열려요">정답 보기${canSolve ? '' : ' 🔒'}</button>
        </div>`;
    }
    /** (Re)draws the hint area in place, without touching the editor or the output. */
    function bindHints(kind, data, onSolve) {
      left.querySelector('.hints')?.remove();
      left.querySelector('.hint-row')?.remove();
      left.insertAdjacentHTML('beforeend', hintRow(kind, data));
      left.querySelectorAll('.hint').forEach((b) => b.addEventListener('click', () => { st.shownHints[kind]++; st.hintsUsed++; bindHints(kind, data, onSolve); }));
      left.querySelector('.solve')?.addEventListener('click', () => { st.solutionShown = true; onSolve(); });
    }

    async function grade(kind, code, view, out, statusEl, data) {
      clearReact();
      statusEl.textContent = '실행 중…';
      if (kind === 'write' && data.mustInclude) {
        // check the shape of the code first (so printing the answer as text doesn't pass)
        const stripped = code.replace(/\/\/.*$/gm, '');
        const miss = data.mustInclude.find((m) => !new RegExp(m.re).test(stripped));
        if (miss) {
          statusEl.textContent = '';
          out.innerHTML = `<div class="col plain"><h5>확인해 주세요</h5>${miss.msg}</div><div class="col"><h5>기대 출력</h5>${esc(data.expected)}</div>`;
          st.wrong[kind]++;
          react(false, '조금만 더!', '출력만 맞추는 게 아니라, 배운 걸 써서 만들어 볼래요? ' + miss.msg.replace(/<[^>]+>/g, ''));
          return false;
        }
      }
      const r = await runJava(code);
      statusEl.textContent = r.phase === 'compile' && !r.ok ? '컴파일 실패' : `실행 ${(r.ms / 1000).toFixed(1)}초`;
      if (!r.ok) {
        const line = +(r.error.match(/Main\.java:(\d+)/)?.[1] || 0);
        view.markLine(line);
        const ex = explainError(r.error);
        out.innerHTML = `<div class="col"><h5>내 출력</h5><span class="bad">${esc(r.error)}</span></div><div class="col plain"><h5>쉬운 말로</h5><b>${ex || '에러 메시지의 첫 줄을 확인해 주세요.'}</b></div>`;
        st.wrong[kind]++;
        react(false, '아직이에요', line ? `앗, 에러가 났네요. ${line}번째 줄을 한번 볼래요?` : '앗, 에러가 났네요. 메시지를 같이 볼까요?');
        return false;
      }
      view.markLine(0);
      const ok = norm(r.output) === norm(data.expected);
      out.innerHTML = `<div class="col"><h5>내 출력</h5>${esc(r.output) || '<span class="muted">(출력 없음)</span>'}</div><div class="col"><h5>기대 출력</h5><span class="${ok ? 'ok' : ''}">${esc(data.expected)}${ok ? ' ✓' : ''}</span></div>`;
      if (ok) return true;
      st.wrong[kind]++;
      react(false, '출력이 조금 달라요', '내 출력이랑 기대 출력을 한 글자씩 비교해 볼래요? 띄어쓰기랑 기호도요!');
      return false;
    }

    // ---------- fill ----------
    function renderFill() {
      const f = quest.fill;
      left.innerHTML = npcBox('빈칸만 채우면 돼요! 채우고 ▶ 실행을 눌러 주세요.')
        + `<div class="card"><h4>빈칸 채우기</h4>${f.prompt}<div class="expect">${esc(f.expected)}</div></div>` + learnedCard();
      bindReview();
      right.innerHTML = '';
      const view = codeView(f.code, { blanks: f.blanks });
      view.el.classList.add('grow');
      right.appendChild(view.el);
      const bar = document.createElement('div');
      bar.className = 'runbar';
      bar.innerHTML = `<button class="btn run">▶ 실행</button>${javaNote()}<span class="status"></span>`;
      right.appendChild(bar);
      const out = consoleBox();
      out.innerHTML = `<div class="col"><h5>내 출력</h5><span class="muted">빈칸을 채우고 ▶ 실행</span></div><div class="col"><h5>기대 출력</h5>${esc(f.expected)}</div>`;
      right.appendChild(out);
      const nav = document.createElement('div');
      nav.className = 'nav';
      nav.innerHTML = '<span></span><button class="btn go next" disabled>다음 →</button>';
      right.appendChild(nav);
      if (st.fillValues) view.inputs.forEach((inp, i) => { inp.value = st.fillValues[i] || ''; });
      view.inputs.forEach((inp) => inp.addEventListener('input', () => { st.fillValues = view.values(); }));
      view.inputs.forEach((inp) => inp.addEventListener('keydown', (e) => { e.stopPropagation(); if (e.key === 'Enter') run(); }));
      setTimeout(() => view.inputs[0]?.focus(), 50);
      const run = async () => {
        const b = bar.querySelector('.run'); b.disabled = true;
        const ok = await grade('fill', view.fill(), view, out, bar.querySelector('.status'), f);
        b.disabled = false;
        if (ok) { st.passed.fill = true; nav.querySelector('.next').disabled = false; react(true, '빈칸 통과!', '좋아요! 이제 직접 써 볼까요?'); }
        else bindHints('fill', f, solveFill);
      };
      const solveFill = () => { view.inputs.forEach((inp, i) => { inp.value = f.solution[i]; }); st.fillValues = view.values(); };
      bar.querySelector('.run').addEventListener('click', run);
      nav.querySelector('.next').addEventListener('click', () => { clearReact(); st.step = 'write'; render(); });
      if (st.passed.fill) nav.querySelector('.next').disabled = false;
      bindHints('fill', f, solveFill);
    }

    // ---------- write ----------
    function renderWrite() {
      const w = quest.write;
      left.innerHTML = npcBox('이번엔 직접 써 볼래요? 다 쓰면 ▶ 실행!')
        + `<div class="card"><h4>직접 쓰기</h4>${w.prompt}<div class="expect">${esc(w.expected)}</div></div>` + learnedCard();
      bindReview();
      right.innerHTML = '';
      const ed = codeEditor(st.writeCode ?? w.starter, { onRun: () => run() });
      right.appendChild(ed.el);
      const bar = document.createElement('div');
      bar.className = 'runbar';
      bar.innerHTML = `<button class="btn run">▶ 실행</button><span class="status" style="margin-left:0">⌘/Ctrl + Enter 로도 실행</span>${javaNote()}`;
      right.appendChild(bar);
      const out = consoleBox();
      out.innerHTML = `<div class="col"><h5>내 출력</h5><span class="muted">코드를 쓰고 ▶ 실행</span></div><div class="col"><h5>기대 출력</h5>${esc(w.expected)}</div>`;
      right.appendChild(out);
      const nav = document.createElement('div');
      nav.className = 'nav';
      nav.innerHTML = '<span></span><button class="btn go next" disabled>퀘스트 완료 →</button>';
      right.appendChild(nav);
      setTimeout(() => ed.focus(), 50);
      ed.el.querySelector('textarea').addEventListener('input', () => { st.writeCode = ed.value; });
      const status = bar.querySelector('.status');
      const solveWrite = () => { ed.value = w.solution; st.writeCode = w.solution; };
      const run = async () => {
        const b = bar.querySelector('.run'); b.disabled = true;
        st.writeCode = ed.value;
        const ok = await grade('write', ed.value, ed, out, status, w);
        b.disabled = false;
        if (ok) { st.passed.write = true; nav.querySelector('.next').disabled = false; react(true, `미션 성공! ${'★'.repeat(starCount())}`, quest.thanks); }
        else bindHints('write', w, solveWrite);
      };
      bar.querySelector('.run').addEventListener('click', run);
      nav.querySelector('.next').addEventListener('click', () => { clearReact(); st.step = 'done'; render(); });
      if (st.passed.write) nav.querySelector('.next').disabled = false;
      bindHints('write', w, solveWrite);
    }

    // ---------- done ----------
    function renderDone() {
      left.innerHTML = npcBox(quest.thanks) + learnedCard();
      left.querySelector('.review')?.remove();
      const stars = starCount();
      right.innerHTML = `<div class="done-screen">
        <div class="stars">${'★'.repeat(stars)}${'☆'.repeat(3 - stars)}</div>
        <h2>퀘스트 완료! ${quest.title}</h2>
        <p style="margin:0;opacity:.8">${stars === 3 ? '힌트 없이 해냈어요!' : stars === 2 ? '힌트를 보고 해냈어요. 다음엔 힌트 없이 도전!' : '정답을 보고 끝냈어요. 나중에 안 보고 다시 써 봐요.'}</p>
        <button class="btn go" style="font-size:17px;padding:10px 22px">센터로 돌아가기</button></div>`;
      right.querySelector('.btn.go').addEventListener('click', () => close({ stars }));
    }

    function render() {
      setSteps();
      ({ concept: renderConcept, predict: renderPredict, fill: renderFill, write: renderWrite, done: renderDone })[st.step]();
      right.scrollTop = 0;
    }
    render();
  });
}

function esc(s) { return String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;'); }
