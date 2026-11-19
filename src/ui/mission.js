// 미션 창: 개념 공부 → 출력 맞히기 → 빈칸 채우기 → 직접 쓰기 → 끝(별점). 퀘스트 하나를 이 창에서 푼다.
// 본사 코딩테스트도 이 창을 쓰는데, 그때는 "직접 쓰기" 단계만 있다 (opts.test).
import { codeView, codeEditor } from './code.js';
import { tr } from '../i18n.js';
import { goalOf } from '../content/goals.js';

// 오른쪽 위의 단계 칸 5개 이름: 퀘스트의 단계마다 하나. 지금 단계 이름만 글자로 보인다.
const STEP_NAMES = tr(
    ['부탁 듣기', '개념 공부', '출력 맞히기', '빈칸 채우기', '직접 쓰기'],
    ['Request', 'Concepts', 'Predict the output', 'Fill in the blanks', 'Write it yourself'],
);
/** 출력 비교용으로 글자를 다듬는다: \r 제거, 줄 끝 공백 제거, 마지막 빈 줄 제거. 내 출력과 기대 출력을 이걸로 비교한다. */
const norm = (s) =>
    (s || '')
        .replace(/\r/g, '')
        .split('\n')
        .map((l) => l.replace(/\s+$/, ''))
        .join('\n')
        .replace(/\n+$/, '');

const readyLangs = new Set(); // 실행기 준비가 끝난 언어들 (한 번 끝나면 다음 미션부터 "준비 중" 안내를 안 띄운다)

/**
 * 네모 조각으로 그린 캐릭터 얼굴 HTML. look: 머리·조끼·모자·안경 같은 모습 정보.
 * bust: 테두리·배경 없이 가슴까지 그린다 (대화창 옆 초상화, 면접관, 캐릭터 고르기에 쓴다).
 */
export function faceHTML(look = {}, { bust = false } = {}) {
    const hair = look.hair || '#3b2a20';
    const vest = look.vest === false ? look.shirt || '#ddd' : look.vest || '#c6f432';
    const shirt = look.shirt || '#f4f4f4';
    const cap = look.cap || look.helmet;
    const body =
        bust && look.jacket
            ? `<i style="left:2px;top:62px;width:72px;height:36px;background:${look.jacket};border-radius:16px 16px 0 0"></i>
    <i style="left:28px;top:62px;width:20px;height:36px;background:#fff"></i>
    <i style="left:35px;top:66px;width:6px;height:32px;background:${look.tie || '#2f6fd6'}"></i>
    <i style="left:52px;top:72px;width:12px;height:14px;background:${look.badge || '#fff'};border-radius:2px"></i>`
            : bust
              ? `<i style="left:2px;top:62px;width:72px;height:36px;background:${shirt};border-radius:16px 16px 0 0"></i>
    ${look.vest === false ? '' : `<i style="left:2px;top:62px;width:24px;height:36px;background:${vest};border-radius:16px 0 0 0"></i><i style="left:50px;top:62px;width:24px;height:36px;background:${vest};border-radius:0 16px 0 0"></i>`}
    <i style="left:30px;top:62px;width:16px;height:8px;background:${look.skin || '#ffd9b8'};border-radius:0 0 8px 8px"></i>`
              : `<i style="left:6px;top:64px;width:64px;height:16px;background:${vest};border-radius:6px 6px 0 0"></i>`;
    return `<div class="face${bust ? ' bust' : ''}">
    ${bust ? body : ''}
    ${cap ? '' : `<i style="left:12px;top:10px;width:52px;height:20px;background:${hair};border-radius:6px 6px 2px 2px"></i>`}
    <i style="left:13px;top:18px;width:50px;height:46px;background:${look.skin || '#ffd9b8'};border-radius:8px"></i>
    ${
        cap
            ? // 모자·안전모: 눈썹까지 덮는 모자와 챙, 양옆으로 짧은 머리가 살짝 보인다
              `<i style="left:12px;top:26px;width:6px;height:12px;background:${hair};border-radius:2px"></i>
    <i style="left:58px;top:26px;width:6px;height:12px;background:${hair};border-radius:2px"></i>
    <i style="left:11px;top:6px;width:54px;height:22px;background:${cap};border-radius:14px 14px 2px 2px"></i>
    <i style="left:9px;top:24px;width:58px;height:5px;background:${cap};filter:brightness(0.8);border-radius:3px"></i>`
            : `<i style="left:12px;top:10px;width:52px;height:18px;background:${hair};border-radius:6px 6px 2px 2px"></i>
    <i style="left:14px;top:26px;width:24px;height:8px;background:${hair};border-radius:2px"></i>`
    }
    ${look.glasses ? `<i style="left:21px;top:36px;width:17px;height:14px;border:3px solid #222;border-radius:4px;box-sizing:border-box"></i><i style="left:39px;top:36px;width:17px;height:14px;border:3px solid #222;border-radius:4px;box-sizing:border-box"></i><i style="left:36px;top:40px;width:5px;height:3px;background:#222"></i>` : ''}
    ${look.style === 'bun' ? `<i style="left:28px;top:${cap ? 4 : 0}px;width:20px;height:14px;background:${hair};border-radius:7px 7px 3px 3px"></i>` : ''}
    ${look.style === 'long' ? `<i style="left:8px;top:22px;width:8px;height:44px;background:${hair};border-radius:3px"></i><i style="left:60px;top:22px;width:8px;height:44px;background:${hair};border-radius:3px"></i>` : ''}
    <i style="left:27px;top:39px;width:6px;height:9px;background:#2d2d2d;border-radius:2px"></i>
    <i style="left:44px;top:39px;width:6px;height:9px;background:#2d2d2d;border-radius:2px"></i>
    <i style="left:18px;top:50px;width:9px;height:5px;background:#ff9aa2;border-radius:3px"></i>
    <i style="left:50px;top:50px;width:9px;height:5px;background:#ff9aa2;border-radius:3px"></i>
    ${bust ? '' : body}
  </div>`;
}

/**
 * 미션 창을 연다. 다 풀면 { stars }(별 개수)로, 중간에 닫으면 null 로 끝난다.
 * root: 창을 붙일 곳 / quest: 퀘스트 데이터 / npc: 부탁한 사람 / rt: 언어 실행기(RUNTIMES[언어])
 * who: 부탁한 사람 이름표 / opts.test: 본사 코딩테스트 모드
 */
export function openMission(root, quest, npc, rt, who = `${npc.role} ${npc.name}`, opts = {}) {
    // opts.test: 본사 코딩테스트. "직접 쓰기" 단계만 있고 개념 공부와 마무리 카드가 없다.
    const test = !!opts.test;
    const look = { badge: rt.badge, badgeColor: rt.badgeColor, title: rt.file };
    return new Promise((resolve) => {
        const bg = document.createElement('div');
        bg.className = 'mission-bg';
        bg.innerHTML = `<div class="win">
      <div class="top">
        <button class="btn back">${tr('← 센터로', '← Center')}</button>
        <div class="title">${quest.title}<small>${test ? tr(`${who}의 코딩테스트`, `Coding test from ${who}`) : tr(`${who}의 퀘스트`, `Quest from ${who}`)}</small></div>
        <div class="steps"><span class="step-now"></span>${STEP_NAMES.map(() => '<i></i>').join('')}</div>
      </div>
      <div class="body"><div class="left"></div><div class="right"></div></div>
    </div>`;
        root.appendChild(bg);
        const left = bg.querySelector('.left'); // 왼쪽 칸: 부탁한 사람 말풍선, 문제 카드, 배운 것
        const right = bg.querySelector('.right'); // 오른쪽 칸: 개념 설명·코드·실행 결과
        const win = bg.querySelector('.win');
        const stepEls = [...bg.querySelectorAll('.steps i')]; // 위쪽 단계 칸 5개

        // 미션 진행 상태
        const st = {
            step: test ? 'write' : 'concept', // 지금 단계: concept | predict | fill | write | done
            ci: 0, // 보고 있는 개념 번호
            seen: new Set([0]), // 본 개념 번호들
            hintsUsed: 0, // 힌트를 본 횟수 (별이 하나 줄어든다)
            solutionShown: false, // 정답 보기를 눌렀는지 (별이 하나 줄어든다)
            wrong: { predict: 0, fill: 0, write: 0 }, // 단계별로 틀린 횟수
            shownHints: { fill: 0, write: 0 }, // 단계별로 펼친 힌트 수
            reviewFrom: null, // 문제를 풀다가 개념을 다시 보러 갔을 때 돌아갈 단계
            passed: {}, // 통과한 단계들
        };

        let javaStatus = readyLangs.has(rt.name) || !rt.loadingNote ? 'ready' : 'loading'; // 실행기 준비 상태 ("준비 중" 안내를 띄울지)
        rt.warm().then(() => {
            readyLangs.add(rt.name);
            javaStatus = 'ready';
            bg.querySelectorAll('.loading-java').forEach((e) => e.remove());
        });

        /** 창을 닫고 결과를 돌려준다 (result: { stars } 또는 null). */
        const close = (result) => {
            bg.remove();
            removeEventListener('keydown', onKey, true);
            resolve(result);
        };
        bg.querySelector('.back').addEventListener('click', () => {
            if (st.step === 'done') return close({ stars: starCount(), peeked: st.solutionShown });
            if (
                confirm(
                    test
                        ? tr(
                              '테스트를 그만둘까요? 휴게실 재도전 게시판에서 다시 풀 수 있어요.',
                              'Stop the test? You can retry it later from the break room retry board.',
                          )
                        : tr(
                              '센터로 돌아갈까요? 이 퀘스트는 처음부터 다시 해야 해요.',
                              "Go back to the center? You'll have to start this quest over.",
                          ),
                )
            )
                close(null);
        });
        /** 창이 열린 동안의 키보드 (Esc 로 닫기 등). */
        const onKey = (e) => {
            if (e.key === 'Escape' && st.step === 'done') close({ stars: starCount(), peeked: st.solutionShown });
        };
        addEventListener('keydown', onKey, true);

        /** 별 개수: 3개에서 힌트를 봤으면 -1, 정답을 봤으면 -1 (최소 1개). */
        const starCount = () => Math.max(1, 3 - (st.hintsUsed > 0 ? 1 : 0) - (st.solutionShown ? 1 : 0));

        /** 위쪽 단계 칸 5개를 지금 단계에 맞게 칠한다. */
        function setSteps() {
            if (test) {
                bg.querySelector('.steps').style.display = 'none';
                return;
            }
            const idx = { concept: 1, predict: 2, fill: 3, write: 4, done: 5 }[st.reviewFrom || st.step];
            stepEls.forEach((el, i) => {
                el.className = i < idx ? 'on' : i === idx ? 'now' : '';
                el.title = STEP_NAMES[i];
            });
            bg.querySelector('.step-now').textContent =
                idx < STEP_NAMES.length
                    ? tr(
                          `${idx + 1}/${STEP_NAMES.length}단계 · ${STEP_NAMES[idx]}`,
                          `Step ${idx + 1}/${STEP_NAMES.length} · ${STEP_NAMES[idx]}`,
                      )
                    : tr('완료!', 'Done!');
        }

        let reactEl = null; // 부탁한 사람의 반응 말풍선 (맞았어요 / 아쉬워요)
        /** 부탁한 사람의 반응 말풍선을 띄운다. ok: 잘했을 때 true. */
        function react(ok, title, text) {
            reactEl?.remove();
            reactEl = document.createElement('div');
            reactEl.className = 'react' + (ok ? '' : ' err');
            reactEl.innerHTML = `<div class="rface">${faceHTML(npc.look, { bust: true })}</div><div><b>${ok ? '🎉 ' : ''}${title}</b><p>${npc.name}: "${text}"</p></div><button class="rclose" aria-label="${tr('닫기', 'Close')}">✕</button>`;
            win.appendChild(reactEl);
            // 누르면 닫힌다 (휴대폰에서 아래쪽 「다음」 버튼을 가리던 문제, 2026-11-19)
            const el = reactEl;
            el.addEventListener('click', () => {
                el.remove();
                if (reactEl === el) reactEl = null;
            });
            // 틀렸을 때는 6초, 휴대폰에서는 맞았을 때도 4초 뒤에 저절로 사라진다
            const phone = matchMedia('(max-width: 700px)').matches;
            if (!ok || phone)
                setTimeout(
                    () => {
                        el.remove();
                        if (reactEl === el) reactEl = null;
                    },
                    ok ? 4000 : 6000,
                );
        }
        /** 반응 말풍선을 지운다. */
        const clearReact = () => {
            reactEl?.remove();
            reactEl = null;
        };

        /** 왼쪽 위 부탁한 사람의 얼굴과 말풍선 HTML. */
        function npcBox(text) {
            return `<div class="npc">${faceHTML(npc.look)}<div class="bubble"><b>${who}</b>${text}</div></div>`;
        }
        /** 실행기를 불러오는 중이면 "준비 중" 안내 HTML, 아니면 빈 글자. */
        const javaNote = () => (javaStatus === 'ready' ? '' : `<span class="loading-java">${rt.loadingNote}</span>`);

        /** 실행 결과 칸 요소를 만든다. single: 한 칸짜리 (개념 예제용). */
        function consoleBox(single) {
            const c = document.createElement('div');
            c.className = 'console' + (single ? ' single' : '');
            return c;
        }

        // ---------- 개념 공부: 개념마다 설명 + 예제 코드 + 「▶ 실행해 보기」 ----------
        /** 개념 공부 화면. */
        function renderConcept() {
            const cs = quest.concepts;
            const goal = goalOf(quest.id, rt.name); // 「이번에 배우는 개념」 { name, what } (content/goals.js)
            const c = cs[st.ci];
            const reviewing = !!st.reviewFrom;
            left.innerHTML =
                npcBox(
                    reviewing
                        ? tr('개념 다시 보고 문제로 돌아가요!', 'Review the concepts, then head back to the problem!')
                        : st.ci === 0
                          ? quest.request[quest.request.length - 1] +
                            tr('<br>먼저 이것부터 같이 봐요!', "<br>Let's look at this together first!")
                          : tr('천천히 봐도 괜찮아요~', 'Take your time!'),
                ) +
                (goal
                    ? `<div class="card side-card learn-goal"><h4>${tr('🎯 이번에 배우는 개념', '🎯 Concept you learn')}</h4><p class="learn-name">${goal.name}</p><p>${goal.what}</p></div>`
                    : '') +
                `<div class="card side-card"><h4>${tr('이번 퀘스트에 필요한 개념', 'Concepts for this quest')}</h4><div class="clist">${cs.map((x, i) => `<div class="ci ${i === st.ci ? 'cur' : st.seen.has(i) ? 'done' : ''}" data-i="${i}">${st.seen.has(i) && i !== st.ci ? '✓ ' : i === st.ci ? '▶ ' : ''}${i + 1}. ${x.title}</div>`).join('')}</div></div>` +
                `<div class="card side-card" style="font-size:13px">${tr('각 예제는 <b>▶ 실행해 보기</b>로 진짜 실행 결과를 볼 수 있어요. 개념을 다 보면 <b>문제 풀기</b>로 넘어가요.', "Press <b>▶ Try it</b> on each example to see the real output. When you've seen all the concepts, go on to <b>Solve</b>.")}</div>`;
            left.querySelectorAll('.ci').forEach((el) =>
                el.addEventListener('click', () => {
                    st.ci = +el.dataset.i;
                    st.seen.add(st.ci);
                    render();
                }),
            );

            right.innerHTML = `<div class="concept">
        <div class="ctop"><span class="cnum">${tr('개념', 'Concept')} ${st.ci + 1} / ${cs.length}</span><h2>${c.title}</h2></div>
        <p>${c.body}</p></div>`;
            const box = right.querySelector('.concept');
            const view = codeView(c.code, { ...look, title: tr('예제 · ', 'Example · ') + rt.file });
            box.appendChild(view.el);
            const bar = document.createElement('div');
            bar.className = 'runbar';
            bar.innerHTML = `<button class="btn run">${tr('▶ 실행해 보기', '▶ Try it')}</button>${rt.saved?.(c.code) ? '' : javaNote()}<span class="status"></span>`;
            box.appendChild(bar);
            const out = consoleBox(true);
            out.innerHTML = `<div class="col"><h5>${tr('실행 결과', 'Output')}</h5><span class="muted">${tr('▶ 실행해 보기를 눌러 보세요', 'Press ▶ Try it')}</span></div>`;
            box.appendChild(out);
            bar.querySelector('.run').addEventListener('click', async (e) => {
                const b = e.currentTarget;
                b.disabled = true;
                bar.querySelector('.status').textContent = tr('실행 중…', 'Running…');
                const r = await rt.run(c.code);
                b.disabled = false;
                bar.querySelector('.status').textContent =
                    r.phase === 'compile' && !r.ok
                        ? tr('컴파일 에러', 'Compile error')
                        : r.saved
                          ? tr('실행 결과', 'Output')
                          : tr(`실행 ${(r.ms / 1000).toFixed(1)}초`, `Ran in ${(r.ms / 1000).toFixed(1)}s`);
                if (r.ok)
                    out.innerHTML = `<div class="col"><h5>${tr('실행 결과', 'Output')}</h5><span class="ok">${esc(r.output) || `<span class="muted">${tr('(출력 없음)', '(no output)')}</span>`}</span></div>`;
                else {
                    out.classList.remove('single');
                    view.markLine(r.line);
                    out.innerHTML = `<div class="col"><h5>${tr('에러', 'Error')}</h5><span class="bad">${esc(r.error)}</span></div><div class="col plain"><h5>${tr('쉬운 말로', 'In plain words')}</h5><b>${rt.explain(r.error, r.line)}</b></div>`;
                }
            });
            if (c.note) {
                const n = document.createElement('p');
                n.className = 'note';
                n.innerHTML = '👀 ' + c.note;
                box.appendChild(n);
            }
            const nav = document.createElement('div');
            nav.className = 'nav';
            const last = st.ci === cs.length - 1;
            nav.innerHTML =
                `<button class="btn prev" ${st.ci === 0 ? 'disabled' : ''}>${tr('← 이전 개념', '← Previous')}</button>` +
                (reviewing
                    ? `<button class="btn go back2">${tr('문제로 돌아가기 →', 'Back to the problem →')}</button>`
                    : `<button class="btn go next">${last ? tr('문제 풀기 →', 'Solve →') : tr('다음 개념 →', 'Next concept →')}</button>`);
            box.appendChild(nav);
            nav.querySelector('.prev').addEventListener('click', () => {
                st.ci--;
                render();
            });
            nav.querySelector('.next')?.addEventListener('click', () => {
                if (last) {
                    st.step = 'predict';
                } else {
                    st.ci++;
                    st.seen.add(st.ci);
                }
                render();
            });
            nav.querySelector('.back2')?.addEventListener('click', () => {
                st.step = st.reviewFrom;
                st.reviewFrom = null;
                render();
            });
        }

        /** 풀어야 할 문제 카드: 무엇을 해야 하는지 바로 보이게 눈에 띄게 만든다. */
        /** 문제 카드 HTML: 제목, 문제 글, "이렇게 나오면 성공" 기대 출력. */
        function taskCard(title, prompt, expected) {
            return (
                `<div class="card task"><span class="task-tag">${title}</span><div class="task-text">${prompt}</div>` +
                `<div class="expect-label">${tr('✅ 이렇게 나오면 성공', '✅ Make it print this')}</div><div class="expect">${esc(expected)}</div></div>`
            );
        }
        /** 지금까지 배운 것 요약 카드 (개념 제목들). */
        function learnedCard() {
            if (test) return '';
            return `<div class="card side-card"><h4>${tr('개념 정리', 'Summary')} <button class="linkish review">${tr('📖 개념 다시 보기', '📖 Review concepts')}</button></h4><ul>${quest.learned.map((l) => `<li>${l}</li>`).join('')}</ul></div>`;
        }
        /** 배운 것 카드의 개념을 누르면 그 개념을 다시 보러 간다. */
        function bindReview() {
            left.querySelector('.review')?.addEventListener('click', () => {
                st.reviewFrom = st.step;
                st.step = 'concept';
                render();
            });
        }

        // ---------- 출력 맞히기: 코드를 보고 4개 중 출력 고르기 ----------
        /** 출력 맞히기 화면. 두 번 틀리면 설명을 보여 준다. */
        function renderPredict() {
            const p = quest.predict;
            left.innerHTML =
                npcBox(tr('이 코드, 실행하면 어떻게 나올 것 같아요?', 'What do you think this code prints?')) +
                learnedCard();
            bindReview();
            right.innerHTML = `<div class="concept"><div class="ctop"><span class="cnum">${tr('출력 맞히기', 'Predict the output')}</span><h2>${p.prompt}</h2></div></div>`;
            const box = right.querySelector('.concept');
            box.appendChild(codeView(p.code, look).el);
            const ch = document.createElement('div');
            ch.className = 'choices';
            p.choices.forEach((c, i) => {
                const b = document.createElement('button');
                b.className = 'choice';
                b.textContent = c;
                b.addEventListener('click', () => {
                    if (st.passed.predict) return;
                    if (i === p.answer) {
                        b.classList.add('right');
                        st.passed.predict = true;
                        react(true, tr('정답이에요!', 'Correct!'), p.explain);
                        nav.querySelector('.next').disabled = false;
                    } else {
                        b.classList.add('wrong');
                        st.wrong.predict++;
                        react(
                            false,
                            tr('아쉬워요', 'Not quite'),
                            st.wrong.predict >= 2
                                ? p.explain
                                : tr(
                                      '음… 다시 한번 골라 볼래요? 한 줄씩, 출력 순서와 변수 값을 천천히 따라가 봐요.',
                                      'Hmm… want to pick again? Follow it one line at a time: the print order and the variable values.',
                                  ),
                        );
                    }
                });
                ch.appendChild(b);
            });
            box.appendChild(ch);
            const nav = document.createElement('div');
            nav.className = 'nav';
            nav.innerHTML = `<span></span><button class="btn go next" disabled>${tr('다음 →', 'Next →')}</button>`;
            box.appendChild(nav);
            nav.querySelector('.next').addEventListener('click', () => {
                clearReact();
                st.step = 'fill';
                render();
            });
            if (st.passed.predict) nav.querySelector('.next').disabled = false;
        }

        // ---------- 빈칸·직접 쓰기 공통: 힌트, 채점 ----------
        /** 힌트 줄 HTML (펼친 힌트들 + 「힌트 보기」「정답 보기」 버튼). kind: 'fill' | 'write'. */
        function hintRow(kind, data) {
            const shown = st.shownHints[kind];
            const canSolve = st.wrong[kind] >= 3 || shown >= data.hints.length;
            return `<div class="hints">${data.hints
                .slice(0, shown)
                .map((h, i) => `<div class="hint-box">💡 ${tr('힌트', 'Hint')} ${i + 1}: ${h}</div>`)
                .join('')}</div>
        <div class="hint-row">
          ${data.hints.map((_, i) => `<button class="btn hint" data-i="${i}" ${i !== shown ? 'disabled' : ''}>💡 ${tr('힌트', 'Hint')} ${i + 1}${i < shown ? ' ✓' : ''}</button>`).join('')}
          <button class="btn solve" ${canSolve ? '' : 'disabled'} title="${tr('3번 틀리면 열려요', 'Opens after 3 wrong tries')}">${tr('정답 보기', 'Show answer')}${canSolve ? '' : ' 🔒'}</button>
        </div>`;
        }
        /** 힌트 칸만 제자리에서 다시 그린다 (코드 칸과 실행 결과는 건드리지 않는다). onSolve: 정답 보기를 눌렀을 때. */
        function bindHints(kind, data, onSolve) {
            left.querySelector('.hints')?.remove();
            left.querySelector('.hint-row')?.remove();
            left.insertAdjacentHTML('beforeend', hintRow(kind, data));
            left.querySelectorAll('.hint').forEach((b) =>
                b.addEventListener('click', () => {
                    st.shownHints[kind]++;
                    st.hintsUsed++;
                    bindHints(kind, data, onSolve);
                }),
            );
            left.querySelector('.solve')?.addEventListener('click', () => {
                st.solutionShown = true;
                onSolve();
            });
        }

        /**
         * 채점: 코드를 실행해서 출력이 기대 출력과 같은지 본다. 맞으면 true.
         * 직접 쓰기는 먼저 mustInclude(꼭 써야 하는 문법)를 검사해서, 답 글자만 찍는 꼼수는 통과하지 못하게 한다.
         * 에러면 줄을 표시하고 쉬운 말 설명을 보여 준다.
         */
        async function grade(kind, code, view, out, statusEl, data) {
            clearReact();
            statusEl.textContent = tr('실행 중…', 'Running…');
            if (kind === 'write' && data.mustInclude) {
                // 코드 모양부터 검사한다 (정답 글자를 그대로 찍기만 해서는 통과하지 못하게)
                const stripped = code.replace(/\/\/.*$/gm, '');
                const miss = data.mustInclude.find((m) => !new RegExp(m.re).test(stripped));
                if (miss) {
                    statusEl.textContent = '';
                    out.innerHTML = `<div class="col plain"><h5>${tr('확인해 주세요', 'Check this')}</h5>${miss.msg}</div><div class="col"><h5>${tr('기대 출력', 'Expected output')}</h5>${esc(data.expected)}</div>`;
                    st.wrong[kind]++;
                    react(
                        false,
                        tr('조금만 더!', 'Almost!'),
                        tr(
                            '출력만 맞추는 게 아니라, 배운 걸 써서 만들어 볼래요? ',
                            'Not just the right output: can you build it with what you learned? ',
                        ) + miss.msg.replace(/<[^>]+>/g, ''),
                    );
                    return false;
                }
            }
            const r = await rt.run(code);
            statusEl.textContent =
                r.phase === 'compile' && !r.ok
                    ? tr('컴파일 실패', 'Compile failed')
                    : r.saved
                      ? ''
                      : tr(`실행 ${(r.ms / 1000).toFixed(1)}초`, `Ran in ${(r.ms / 1000).toFixed(1)}s`);
            if (!r.ok) {
                const line = r.line;
                view.markLine(line);
                const ex = rt.explain(r.error, line);
                out.innerHTML = `<div class="col"><h5>${tr('내 출력', 'Your output')}</h5><span class="bad">${esc(r.error)}</span></div><div class="col plain"><h5>${tr('쉬운 말로', 'In plain words')}</h5><b>${ex || tr('에러 메시지의 첫 줄을 확인해 주세요.', 'Check the first line of the error message.')}</b></div>`;
                st.wrong[kind]++;
                react(
                    false,
                    tr('아직이에요', 'Not yet'),
                    line
                        ? tr(
                              `앗, 에러가 났네요. ${line}번째 줄을 한번 볼래요?`,
                              `Oops, an error. Want to look at line ${line}?`,
                          )
                        : tr(
                              '앗, 에러가 났네요. 메시지를 같이 볼까요?',
                              'Oops, an error. Shall we read the message together?',
                          ),
                );
                return false;
            }
            view.markLine(0);
            const ok = norm(r.output) === norm(data.expected);
            out.innerHTML = `<div class="col"><h5>${tr('내 출력', 'Your output')}</h5>${esc(r.output) || `<span class="muted">${tr('(출력 없음)', '(no output)')}</span>`}</div><div class="col"><h5>${tr('기대 출력', 'Expected output')}</h5><span class="${ok ? 'ok' : ''}">${esc(data.expected)}${ok ? ' ✓' : ''}</span></div>`;
            if (ok) return true;
            st.wrong[kind]++;
            react(
                false,
                tr('출력이 조금 달라요', 'The output is a bit different'),
                tr(
                    '내 출력이랑 기대 출력을 한 글자씩 비교해 볼래요? 띄어쓰기랑 기호도요!',
                    'Compare your output with the expected output letter by letter. Spaces and symbols too!',
                ),
            );
            return false;
        }

        // ---------- 빈칸 채우기 ----------
        /** 빈칸 채우기 화면: 빈칸이 있는 코드 + 실행해서 채점. */
        function renderFill() {
            const f = quest.fill;
            left.innerHTML =
                npcBox(
                    tr(
                        '빈칸만 채우면 돼요! 채우고 ▶ 실행을 눌러 주세요.',
                        'Just fill in the blanks! Then press ▶ Run.',
                    ),
                ) +
                taskCard(tr('📝 문제 · 빈칸 채우기', '📝 Task · Fill in the blanks'), f.prompt, f.expected) +
                learnedCard();
            bindReview();
            right.innerHTML = '';
            const view = codeView(f.code, { ...look, blanks: f.blanks });
            view.el.classList.add('grow');
            right.appendChild(view.el);
            const bar = document.createElement('div');
            bar.className = 'runbar';
            bar.innerHTML = `<button class="btn run">${tr('▶ 실행', '▶ Run')}</button>${javaNote()}<span class="status"></span>`;
            right.appendChild(bar);
            const out = consoleBox();
            out.innerHTML = `<div class="col"><h5>${tr('내 출력', 'Your output')}</h5><span class="muted">${tr('빈칸을 채우고 ▶ 실행', 'Fill in the blanks, then ▶ Run')}</span></div><div class="col"><h5>${tr('기대 출력', 'Expected output')}</h5>${esc(f.expected)}</div>`;
            right.appendChild(out);
            const nav = document.createElement('div');
            nav.className = 'nav';
            nav.innerHTML = `<span></span><button class="btn go next" disabled>${tr('다음 →', 'Next →')}</button>`;
            right.appendChild(nav);
            if (st.fillValues)
                view.inputs.forEach((inp, i) => {
                    inp.value = st.fillValues[i] || '';
                });
            view.inputs.forEach((inp) =>
                inp.addEventListener('input', () => {
                    st.fillValues = view.values();
                }),
            );
            view.inputs.forEach((inp) =>
                inp.addEventListener('keydown', (e) => {
                    e.stopPropagation();
                    if (e.key === 'Enter') run();
                }),
            );
            setTimeout(() => view.inputs[0]?.focus(), 50);
            const run = async () => {
                const b = bar.querySelector('.run');
                b.disabled = true;
                const ok = await grade('fill', view.fill(), view, out, bar.querySelector('.status'), f);
                b.disabled = false;
                if (ok) {
                    st.passed.fill = true;
                    nav.querySelector('.next').disabled = false;
                    react(
                        true,
                        tr('빈칸 통과!', 'Blanks done!'),
                        tr('좋아요! 이제 직접 써 볼까요?', 'Nice! Now want to write it yourself?'),
                    );
                } else bindHints('fill', f, solveFill);
            };
            const solveFill = () => {
                view.inputs.forEach((inp, i) => {
                    inp.value = f.solution[i];
                });
                st.fillValues = view.values();
            };
            bar.querySelector('.run').addEventListener('click', run);
            nav.querySelector('.next').addEventListener('click', () => {
                clearReact();
                st.step = 'write';
                render();
            });
            if (st.passed.fill) nav.querySelector('.next').disabled = false;
            bindHints('fill', f, solveFill);
        }

        // ---------- 직접 쓰기 (본사 코딩테스트도 이 단계) ----------
        /** 직접 쓰기 화면: 코드 편집기 + 실행해서 채점. ⌘/Ctrl+Enter 로도 실행. */
        function renderWrite() {
            const w = quest.write;
            left.innerHTML =
                npcBox(
                    test
                        ? tr(
                              '제한 시간은 없어요. 지금까지 배운 걸로 풀 수 있어요!',
                              "There's no time limit. You can solve it with what you've learned!",
                          )
                        : tr(
                              '이번엔 직접 써 볼래요? 다 쓰면 ▶ 실행!',
                              "This time, write it yourself! Press ▶ Run when you're done.",
                          ),
                ) +
                taskCard(
                    test
                        ? tr('🏢 본사 코딩테스트', '🏢 HQ coding test')
                        : tr('📝 문제 · 직접 쓰기', '📝 Task · Write it yourself'),
                    w.prompt,
                    w.expected,
                ) +
                learnedCard();
            bindReview();
            right.innerHTML = '';
            const ed = codeEditor(st.writeCode ?? w.starter, {
                ...look,
                braces: rt.name !== 'Python',
                onRun: () => run(),
            });
            right.appendChild(ed.el);
            const bar = document.createElement('div');
            bar.className = 'runbar';
            bar.innerHTML = `<button class="btn run">${tr('▶ 실행', '▶ Run')}</button><span class="status" style="margin-left:0">${tr('⌘/Ctrl + Enter 로도 실행', '⌘/Ctrl + Enter also runs')}</span>${javaNote()}`;
            right.appendChild(bar);
            const out = consoleBox();
            out.innerHTML = `<div class="col"><h5>${tr('내 출력', 'Your output')}</h5><span class="muted">${tr('코드를 쓰고 ▶ 실행', 'Write your code, then ▶ Run')}</span></div><div class="col"><h5>${tr('기대 출력', 'Expected output')}</h5>${esc(w.expected)}</div>`;
            right.appendChild(out);
            const nav = document.createElement('div');
            nav.className = 'nav';
            nav.innerHTML = `<span></span><button class="btn go next" disabled>${test ? tr('제출하기 →', 'Submit →') : tr('퀘스트 완료 →', 'Finish quest →')}</button>`;
            right.appendChild(nav);
            setTimeout(() => ed.focus(), 50);
            ed.el.querySelector('textarea').addEventListener('input', () => {
                st.writeCode = ed.value;
            });
            const status = bar.querySelector('.status');
            const solveWrite = () => {
                ed.value = w.solution;
                st.writeCode = w.solution;
            };
            const run = async () => {
                const b = bar.querySelector('.run');
                b.disabled = true;
                st.writeCode = ed.value;
                const ok = await grade('write', ed.value, ed, out, status, w);
                b.disabled = false;
                if (ok) {
                    st.passed.write = true;
                    nav.querySelector('.next').disabled = false;
                    react(
                        true,
                        test
                            ? tr('정답이에요!', 'Correct!')
                            : `${tr('미션 성공!', 'Mission complete!')} ${'★'.repeat(starCount())}`,
                        quest.thanks,
                    );
                } else bindHints('write', w, solveWrite);
            };
            bar.querySelector('.run').addEventListener('click', run);
            nav.querySelector('.next').addEventListener('click', () => {
                clearReact();
                st.step = 'done';
                render();
            });
            if (st.passed.write) nav.querySelector('.next').disabled = false;
            bindHints('write', w, solveWrite);
        }

        // ---------- 끝: 별점과 배운 것 정리 ----------
        /** 끝 화면: 별 개수와 배운 것. 「센터로」를 누르면 { stars } 로 끝난다. */
        function renderDone() {
            left.innerHTML = npcBox(quest.thanks) + learnedCard();
            left.querySelector('.review')?.remove();
            const stars = starCount();
            right.innerHTML = `<div class="done-screen">
        <div class="stars">${'★'.repeat(stars)}${'☆'.repeat(3 - stars)}</div>
        <h2>${test ? tr('코딩테스트 통과!', 'Coding test passed!') : tr('퀘스트 완료!', 'Quest complete!')} ${quest.title}</h2>
        <p style="margin:0;opacity:.8">${
            !st.solutionShown && st.hintsUsed === 0
                ? tr('힌트 없이 해냈어요!', 'You did it without hints!')
                : !st.solutionShown
                  ? tr(
                        '힌트를 보고 해냈어요. 다음엔 힌트 없이 도전!',
                        'You did it with hints. Try it without hints next time!',
                    )
                  : test
                    ? tr(
                          '정답을 보고 끝냈어요. 나중에 안 보고 다시 써 봐요.',
                          'You finished after seeing the answer. Try writing it again later without looking.',
                      )
                    : tr(
                          '정답을 보고 끝냈어요. 휴게실 <b>재도전 게시판</b>에 붙여 둘게요. 나중에 정답을 안 보고 다시 풀면 떼어져요.',
                          'You finished after seeing the answer, so it goes on the <b>Retry board</b> in the break room. Solve it again later without the answer to take it off.',
                      )
        }</p>
        <button class="btn go" style="font-size:17px;padding:10px 22px">${tr('센터로 돌아가기', 'Back to the center')}</button></div>`;
            right.querySelector('.btn.go').addEventListener('click', () => close({ stars, peeked: st.solutionShown }));
        }

        /** 지금 단계(st.step)에 맞는 화면을 그린다. 단계가 바뀔 때마다 부른다. */
        function render() {
            setSteps();
            ({
                concept: renderConcept,
                predict: renderPredict,
                fill: renderFill,
                write: renderWrite,
                done: renderDone,
            })[st.step]();
            right.scrollTop = 0;
        }
        render();
    });
}

/** HTML 에 넣을 글자의 특수 기호(& < >)를 바꾼다. */
function esc(s) {
    return String(s ?? '')
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;');
}
