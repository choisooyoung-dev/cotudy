// 새 캐릭터의 입사 과정: 본사 면접 → "며칠 뒤" → 합격 메일 → 첫 출근 (PLAN.md §8).
// 면접은 본사 회의실 그림 위에서 대화창으로 진행한다 (3D 맵 없음). 가벼운 질문 뒤에 실력 체크를 한다:
// 이미 아는 개념(= 퀘스트)을 지우고, 남은 미션이 그 사람의 일이 된다. 항상 합격이고, 무엇부터 시작하는지만 다르다.

import { tr } from '../i18n.js';
import { faceHTML } from './mission.js';
import { highlight } from './code.js';

export const COMPANY = () => tr('한빛로지스', 'Hanbit Logis'); // 회사 이름 (메일·회의실 간판에 쓴다). 바꾸려면 여기만
/** HTML 에 넣을 글자의 특수 기호(& < >)를 바꾼다. */
const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
/** ms 밀리초 기다린다. */
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
/** 배열을 무작위로 섞은 새 배열 (면접 선택지 순서). */
const shuffle = (a) => {
    const b = [...a];
    for (let i = b.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [b[i], b[j]] = [b[j], b[i]];
    }
    return b;
};

/**
 * 입사 과정 전체를 진행한다 (면접 → 며칠 뒤 → 메일 → 「출근하기」를 누를 때까지).
 * ctx: 게임(main.js)이 넘겨주는 도구들
 *   { app(화면 뿌리 요소), dialog(대화창 함수), npcs, whoOf(사람 이름표 글자), langs(언어 목록),
 *     pickLang(id)(언어를 정하고 실행기를 미리 불러옴), stagesFor(lang), questsFor(lang), interviewFor(lang)(종합 문제),
 *     run(lang, code)(코드 실행 → { ok, output }) }
 * 돌려주는 값: { start(시작 단계 id), known(면접으로 아는 걸로 확인된 퀘스트 id 들), items(낸 문제와 맞혔는지) }.
 */
export async function runHiring(ctx) {
    const { app, dialog, npcs, whoOf } = ctx;
    const [seo, baek, cha] = [npcs.hq1, npcs.hq2, npcs.hq3]; // 면접관 셋: 서다은(진행), 백승호, 차미경

    // ---- 회의실 화면: 벽, 창문, 간판, 면접관 셋, 책상 ----
    const room = document.createElement('div');
    room.className = 'iv-room';
    room.innerHTML = `<div class="iv-wall"><div class="iv-window"></div><div class="iv-sign">${COMPANY()} ${tr('본사 · 3층 회의실', 'HQ · Meeting room 3F')}</div></div>
    <div class="iv-panel">${[seo, baek, cha].map((n, i) => `<div class="iv-person" data-i="${i}">${faceHTML(n.look, { bust: true })}<div class="iv-plate">${n.name}</div></div>`).join('')}</div>
    <div class="iv-table"></div>`;
    app.appendChild(room);
    await sleep(30);
    room.classList.add('in');
    const people = [seo, baek, cha];
    /** 말하는 면접관을 살짝 크게 보여 준다 (n = null 이면 모두 보통). */
    const talking = (n) =>
        room.querySelectorAll('.iv-person').forEach((el, i) => el.classList.toggle('talking', people[i] === n));
    // 면접 중에는 "닫기" 대신 "다음": 선택지가 없는 대사는 그냥 넘어간다
    const NEXT = () => [{ label: tr('다음', 'Next'), value: true, primary: true }];
    /** 면접관 n 이 대사(lines)를 말한다. 버튼이 있으면 고른 값을 돌려준다. */
    const say = async (n, lines, buttons = NEXT()) => {
        talking(n);
        const v = await dialog({ who: whoOf(n), lines, buttons });
        talking(null);
        return v;
    };

    // ---- 인사 + 면접 볼 언어 고르기 ----
    await say(seo, [
        tr(
            '안녕하세요, 김사원님. 면접 보러 오셨죠? 저는 본사 서다은이에요. 오늘 면접을 진행할게요.',
            "Hello, Kim. You're here for the interview, right? I'm Seo from HQ. I'll be running it today.",
        ),
        tr(
            '옆에는 백승호 님, 차미경 님이에요. 편하게 하셔도 돼요.',
            'Next to me are Baek and Cha. Make yourself comfortable.',
        ),
    ]);
    const lang = await say(
        seo,
        [
            tr(
                '우리 센터는 전산 일을 코드로 해요. 어떤 언어로 면접 보실래요?',
                'At our center we do the system work in code. Which language will you interview in?',
            ),
        ],
        ctx.langs.map((l) => ({
            html: `${l.icon}${l.name}`,
            value: l.id,
            disabled: !l.quests,
            primary: l.id === 'java',
        })),
    );
    ctx.pickLang(lang || 'java');

    // ---- 가벼운 질문 (점수 없음). 코딩이 거의 처음이면 면접 없이 기초부터 시작할 수도 있다 ----
    const exp = await say(
        seo,
        [tr('물류 일은 해 보셨어요?', 'Have you worked in logistics before?')],
        [
            { label: tr('네, 조금요', 'Yes, a little'), value: 'yes', primary: true },
            { label: tr('아니요, 처음이에요', "No, it's my first time"), value: 'no' },
        ],
    );
    await say(seo, [
        exp === 'yes'
            ? tr('오, 그럼 센터 분위기는 금방 익히시겠네요.', "Oh, then you'll get used to the center quickly.")
            : tr(
                  '괜찮아요. 센터 분들이 친절하게 알려 주실 거예요.',
                  "That's fine. The people at the center will show you the ropes.",
              ),
    ]);
    const code = await say(
        baek,
        [tr('코딩은 얼마나 해 보셨어요?', 'How much coding have you done?')],
        [
            { label: tr('조금 해 봤어요', 'Some'), value: 'some', primary: true },
            { label: tr('거의 처음이에요', 'Almost none'), value: 'new' },
        ],
    );
    let skip = false; // true 면 기술 면접을 건너뛰고 기초부터 시작
    if (code === 'new') {
        skip =
            (await say(
                baek,
                [
                    tr(
                        '그럼 기초부터 차근차근 배우는 것도 괜찮아요. 간단한 문제를 몇 개 풀어 볼래요, 아니면 기초부터 시작할래요?',
                        'Then starting from the basics is fine too. Want to try a few short questions, or start from the basics?',
                    ),
                ],
                [
                    { label: tr('문제 풀어 볼게요', "I'll try the questions"), value: 'try', primary: true },
                    { label: tr('기초부터 할게요', 'Start from the basics'), value: 'basic' },
                ],
            )) === 'basic';
    } else {
        await say(baek, [
            tr('좋아요. 그럼 간단한 문제 몇 개 볼게요.', "Good. Let's look at a few short questions, then."),
        ]);
    }

    // ---- 기술 면접: 아는 개념을 지운다, 10문제 안팎 ----
    // 단계들은 쉬운 것부터 어려운 것 순서라서:
    //  1) 반씩 줄여 가며(이진 탐색) 처음 모르는 단계(경계)를 찾는다. 고른 단계의 종합 문제를 맞히면 그 단계와 그보다
    //     쉬운 단계는 모두 아는 것으로 친다.
    //  2) 남은 문제로 경계 단계와 그다음 단계의 개념(퀘스트)을 그 퀘스트의 출력 맞히기 문제로 하나씩 확인한다.
    const L = lang || 'java'; // 면접 언어
    const stages = ctx.stagesFor(L).filter((st) => ctx.questsFor(L).some((q) => q.stage === st.id)); // 퀘스트가 있는 단계만, 순서대로
    const quests = ctx.questsFor(L); // 그 언어의 퀘스트 전부 (= 개념 전부)
    const known = new Set(); // 아는 것으로 확인된 퀘스트 id
    const items = []; // 낸 문제마다: { kind: 'combined'(종합) | 'concept'(개념 확인), stage, quest?, right } (재도전 게시판용)
    const BUDGET = 10; // 최대 문제 수
    if (!skip) {
        await say(cha, [
            tr(
                '이제 실력을 볼게요. 10문제 정도예요. 아는 건 건너뛰고, 모르는 것부터 일을 드릴 거예요.',
                "Now let's see your skills: about 10 questions. We'll skip what you know and give you work on what you don't.",
            ),
            tr(
                '모르면 「잘 모르겠어요」를 눌러도 돼요. 찍는 것보다 그게 나아요.',
                "If you don't know, press \"I don't know\". That's better than guessing.",
            ),
        ]);
        const groups = ctx.interviewFor(L) || []; // 단계별 종합 문제
        const people3 = [seo, baek, cha];
        let n = 0; // 지금까지 낸 문제 수
        /** 문제 q 를 낸다 (si = 단계 번호. 앞쪽 단계는 서다은, 중간은 백승호, 뒤쪽은 차미경이 묻는다). 맞히면 true. */
        const ask = async (q, si, tag) => {
            const asker = people3[Math.min(2, Math.floor((si / stages.length) * 3))];
            talking(asker);
            const r = await askQuestion(app, q, ++n, `${stages[si].name} · ${tag}`, whoOf(asker), (code) =>
                ctx.run(L, code),
            );
            talking(null);
            return r;
        };
        /** 퀘스트 q 의 출력 맞히기 문제로 그 개념을 확인하고 기록한다. */
        const askConcept = async (q, si) => {
            const right = await ask(conceptQuestion(q), si, tr('개념 확인', 'concept check'));
            items.push({ kind: 'concept', stage: stages[si].id, quest: q.id, right });
            return right;
        };
        // 1) 이진 탐색: lo = 모를 수도 있는 첫 단계, hi = 모르는 게 확인된 첫 단계
        let lo = 0,
            hi = stages.length;
        while (lo < hi && n < BUDGET - 2) {
            const mid = Math.floor((lo + hi) / 2);
            const g = groups.find((x) => x.stage === stages[mid].id);
            const right = g ? await ask(g, mid, tr('종합', 'combined')) : false;
            if (g) items.push({ kind: 'combined', stage: stages[mid].id, right });
            if (right) lo = mid + 1;
            else hi = mid;
        }
        for (const st of stages.slice(0, lo)) quests.filter((q) => q.stage === st.id).forEach((q) => known.add(q.id));
        // 2) 경계: 그 단계의 개념들, 문제가 남으면 다음 단계 개념들
        for (let si = lo; si < stages.length && n < BUDGET; si++) {
            let got = 0;
            for (const q of quests.filter((x) => x.stage === stages[si].id && x.predict)) {
                if (n >= BUDGET) break;
                if (await askConcept(q, si)) {
                    known.add(q.id);
                    got++;
                }
            }
            if (!got) break; // 이 단계에서 하나도 몰랐으면 그 뒤 단계도 분명 처음이다
        }
        if (known.size === quests.length)
            await say(cha, [tr('전부 알고 계시네요. 대단해요.', 'You know all of it. Impressive.')]);
    }
    const first = quests.find((q) => !known.has(q.id)) || quests[quests.length - 1]; // 첫 업무 = 남은 것 중 맨 앞
    const start = first.stage; // 시작 단계
    await say(seo, [
        tr(
            '수고하셨어요! 오늘 면접은 여기까지예요. 결과는 메일로 보내 드릴게요.',
            "Thank you! That's all for today. We'll send you the result by email.",
        ),
    ]);

    // ---- 며칠 뒤: 화면이 어두워지고 휴대폰 메일함이 뜬다 ----
    room.classList.add('dark');
    await sleep(500);
    const later = document.createElement('div');
    later.className = 'iv-later';
    later.textContent = tr('며칠 뒤…', 'A few days later…');
    room.appendChild(later);
    await sleep(1700);
    later.remove();
    await showMail(
        room,
        {
            stage: stages.find((s) => s.id === start),
            quest: first,
            known: known.size,
            total: quests.length,
            board: conceptBoard(stages, quests, known, items),
        },
        npcs,
        whoOf,
    );
    room.classList.remove('in');
    await sleep(350);
    room.remove();
    return { start, known: [...known], items };
}

/** 퀘스트의 출력 맞히기(predict) 문제를 면접 문제 모양으로 바꾼다 (개념 확인, 재도전 게시판에서 쓴다). */
export const conceptQuestion = (q) => ({
    type: 'predict',
    prompt: q.predict.prompt,
    code: q.predict.code,
    choices: q.predict.choices,
    answer: q.predict.answer,
    explain: q.predict.explain,
});

/**
 * 개념 상태표: 단계마다 한 줄, 개념(퀘스트)마다 한 칸.
 * 칸 상태: 'right'(면접에서 맞혀 확인), 'skip'(더 어려운 걸 맞혀서 묻지 않고 면제), 'wrong'(그 개념 문제를 틀림),
 * 'todo'(배울 것). 합격 메일의 게이지가 이걸로 그려진다.
 */
export function conceptBoard(stages, quests, known, items) {
    const rightStages = new Set(items.filter((x) => x.kind === 'combined' && x.right).map((x) => x.stage));
    const res = new Map(items.filter((x) => x.kind === 'concept').map((x) => [x.quest, x.right]));
    return stages
        .map((st) => ({
            stage: st,
            cells: quests
                .filter((q) => q.stage === st.id)
                .map((q) => ({
                    title: q.title,
                    state: res.has(q.id)
                        ? res.get(q.id)
                            ? 'right'
                            : 'wrong'
                        : rightStages.has(st.id)
                          ? 'right'
                          : known.has(q.id)
                            ? 'skip'
                            : 'todo',
                })),
        }))
        .filter((row) => row.cells.length);
}

/** 개념 상태 게이지 HTML (합격 메일용): 맨 위 전체 게이지 하나, 그 아래 단계마다 같은 길이의 게이지. */
export function boardHTML(board) {
    const esc2 = (t) => String(t).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/"/g, '&quot;');
    const cells = board.flatMap((r) => r.cells);
    const knownN = cells.filter((c) => c.state === 'right' || c.state === 'skip').length;
    const bar = (list) =>
        `<span class="iv-gauge">${list.map((c) => `<i class="${c.state}" title="${esc2(c.title)}"></i>`).join('')}</span>`;
    return `<div class="iv-total"><span>${tr('아는 개념', 'Known concepts')} <b>${knownN} / ${cells.length}</b></span>${bar(cells)}</div>
    <div class="iv-board">${board.map((row) => `<div class="iv-row"><span>${row.stage.name} <small>${row.stage.topic}</small></span>${bar(row.cells)}</div>`).join('')}</div>
    <div class="iv-legend"><i class="right"></i>${tr('면접에서 확인', 'Shown in interview')} <i class="skip"></i>${tr('면제 (더 쉬운 단계)', 'Waived (easier)')} <i class="wrong"></i>${tr('틀림·모름', 'Missed')} <i class="todo"></i>${tr('배울 것', 'To learn')}</div>`;
}

/** 출력 비교용으로 글자를 다듬는다: \r 제거, 줄 끝 공백 제거, 마지막 빈 줄 제거. */
const norm = (s) =>
    (s || '')
        .replace(/\r/g, '')
        .split('\n')
        .map((l) => l.replace(/\s+$/, ''))
        .join('\n')
        .replace(/\n+$/, '');

/**
 * 문제 하나를 화면에 띄우고 답을 기다린다. 맞히면 true, 틀리거나 「잘 모르겠어요」면 false.
 * q: { type: 'predict'(출력 맞히기) | 'bug'(버그 찾기) | 'fill'(빈칸), code, choices + answer(정답 번호, 기본 0),
 *      prompt?(질문 글), blanks, expected, solution }
 * n: 몇 번째 문제 / tag: 위에 보일 설명 / who: 묻는 사람 / run(code): 빈칸 문제를 채점할 때 코드를 실행한다.
 * 키보드: 1~4 로 바로 고르기, 방향키로 선택 옮기기(선택된 칸이 초록), Enter·Space 로 누르기 (빈칸은 Enter 로 확인).
 */
export function askQuestion(app, q, n, tag, who, run) {
    return new Promise((resolve) => {
        const type = q.type || 'predict';
        const el = document.createElement('div');
        el.className = 'iv-q';
        const prompt =
            q.prompt ||
            (type === 'bug'
                ? tr(
                      '이 코드에는 잘못된 곳이 있어요. 어디가 왜 틀렸을까요?',
                      'Something in this code is wrong. Where, and why?',
                  )
                : type === 'fill'
                  ? tr('빈칸을 채워서 아래처럼 찍히게 하세요.', 'Fill in the blanks so it prints this.')
                  : tr('이 코드를 실행하면 어떻게 찍힐까요?', 'What will this code print?'));
        const right = q.answer ?? 0;
        const choices = type === 'fill' ? [] : shuffle(q.choices.map((c, k) => ({ c, right: k === right })));
        // 빈칸 문제: 코드의 {{번호}} 자리에 입력칸을 넣는다
        const codeHTML =
            type === 'fill'
                ? // (먼저 특수 문자로 표시해 둔다: 코드 색칠기가 빈칸 번호를 숫자로 칠해 버리지 않게)
                  highlight(
                      q.code.replace(/\{\{(\d+)\}\}/g, (_, k) => `\uE000${String.fromCharCode(97 + +k)}\uE001`),
                  ).replace(/\uE000([a-z])\uE001/g, (_, c) => {
                      const k = c.charCodeAt(0) - 97;
                      return `<input class="iv-blank" data-k="${k}" size="${(q.blanks?.[k]?.size || 4) + 1}" spellcheck="false" autocomplete="off" autocapitalize="off">`;
                  })
                : highlight(q.code);
        el.innerHTML = `<div class="who">${who}</div><div class="iv-count">${tr(`${n}번째`, `#${n}`)} · ${tag}</div>
      <p>${prompt}</p>
      <pre class="iv-code">${codeHTML}</pre>
      ${
          type === 'fill'
              ? `<div class="iv-expect"><span>${tr('✅ 이렇게 나오면 성공', '✅ Make it print this')}</span><pre>${esc(q.expected)}</pre></div><div class="iv-status"></div>`
              : `<div class="iv-choices">${choices.map((x, k) => `<button class="btn iv-choice" data-k="${k}"><b>${k + 1}</b><span>${esc(x.c)}</span></button>`).join('')}</div>`
      }
      <div class="btns">${type === 'fill' ? `<button class="btn go iv-check">${tr('확인', 'Check')}</button>` : ''}<button class="btn iv-skip">${tr('잘 모르겠어요', "I don't know")}</button></div>`;
        app.appendChild(el);
        /** 답이 정해지면 키 듣기를 멈추고 문제 창을 지운 뒤 결과를 돌려준다. */
        const done = (v) => {
            removeEventListener('keydown', onKey, true);
            el.remove();
            resolve(v);
        };
        el.querySelectorAll('.iv-choice').forEach((b) =>
            b.addEventListener('click', () => done(choices[+b.dataset.k].right)),
        );
        el.querySelector('.iv-skip').addEventListener('click', () => done(false));
        const check = el.querySelector('.iv-check');
        if (check) {
            el.querySelector('.iv-blank')?.focus();
            check.addEventListener('click', async () => {
                const vals = [...el.querySelectorAll('.iv-blank')].reduce(
                    (m, i) => ({ ...m, [i.dataset.k]: i.value.trim() }),
                    {},
                );
                if (Object.values(vals).some((v) => !v)) {
                    el.querySelector('.iv-status').textContent = tr('빈칸을 모두 채워 주세요.', 'Fill in every blank.');
                    return;
                }
                check.disabled = true;
                el.querySelector('.iv-status').textContent = tr('실행해서 확인하는 중…', 'Running it to check…');
                const r = await run(q.code.replace(/\{\{(\d+)\}\}/g, (_, k) => vals[k]));
                done(!!r?.ok && norm(r.output) === norm(q.expected));
            });
        }
        // 키: 1~4 는 바로 고르기, 방향키는 선택지와 「잘 모르겠어요」 사이에서 (초록) 선택을 옮기고, Enter·Space 로 누른다
        // (빈칸 문제는 Enter 가 "확인")
        const opts = [...el.querySelectorAll('.iv-choice'), el.querySelector('.iv-skip')];
        let sel = -1; // 선택된 칸 번호 (-1 = 아직 없음)
        const select = (k) => {
            sel = (k + opts.length) % opts.length;
            opts.forEach((b, j) => b.classList.toggle('sel', j === sel));
        };
        const onKey = (e) => {
            if (type === 'fill') {
                if (e.key === 'Enter') {
                    e.preventDefault();
                    e.stopImmediatePropagation();
                    check.click();
                }
                return;
            }
            const stop = () => {
                e.preventDefault();
                e.stopImmediatePropagation();
            };
            if (e.key === 'ArrowDown' || e.key === 'ArrowRight') {
                stop();
                select(sel + 1);
                return;
            }
            if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') {
                stop();
                select(sel < 0 ? opts.length - 1 : sel - 1);
                return;
            }
            if (e.key === 'Enter' || e.key === ' ') {
                stop();
                if (sel >= 0) opts[sel].click();
                return;
            }
            const k = +e.key;
            if (k >= 1 && k <= choices.length) {
                stop();
                done(choices[k - 1].right);
            }
        };
        setTimeout(() => addEventListener('keydown', onKey, true), 150);
    });
}

/**
 * 휴대폰 메일함: 안 읽은 합격 메일 하나 → 누르면 메일 내용(첫 업무, 면제 수, 담당, 개념 게이지) → 「출근하기」를 누르면 끝.
 */
function showMail(room, { stage, quest, known, total, board }, npcs, whoOf) {
    return new Promise((resolve) => {
        const boss = npcs[quest.npc];
        const fromStart = known === 0; // 아는 개념이 없으면 "기초부터" 문구
        const phone = document.createElement('div');
        phone.className = 'iv-phone';
        const subject = tr(`[${COMPANY()}] 최종 합격 안내`, `[${COMPANY()}] Your job offer`);
        phone.innerHTML = `<div class="iv-phone-bar">${tr('받은메일함', 'Inbox')}</div>
      <button class="iv-mail-row"><i class="dot"></i><div><b>${tr(`${COMPANY()} 인사팀`, `${COMPANY()} HR`)}</b><span>${subject}</span></div><small>${tr('오전 10:02', '10:02 AM')}</small></button>`;
        room.appendChild(phone);
        phone.querySelector('.iv-mail-row').addEventListener('click', () => {
            phone.innerHTML = `<div class="iv-phone-bar"><span>‹</span>${tr('메일', 'Mail')}</div>
        <div class="iv-mail">
          <h3>${subject}</h3>
          <div class="from">${tr(`보낸 사람: ${COMPANY()} 인사팀`, `From: ${COMPANY()} HR`)}</div>
          <p>${tr(`김사원님, ${COMPANY()} 물류팀 <b>최종 합격</b>을 축하드립니다! 🎉`, `Kim, congratulations: you're <b>hired</b> for the ${COMPANY()} logistics team! 🎉`)}</p>
          <p>${
              fromStart
                  ? tr(
                        '면접 결과에 따라 아래와 같이 배치되었습니다. 기초부터 차근차근 함께해요.',
                        "Based on your interview, here is your placement. We'll start from the basics together.",
                    )
                  : tr(
                        `면접에서 확인된 <b>${known}개 업무</b>는 교육이 면제되고, 아직 배우지 않은 업무부터 시작합니다.`,
                        `The <b>${known} jobs</b> you showed you know in the interview are waived; you start with what you haven't learned yet.`,
                    )
          }</p>
          <table>
            <tr><th>${tr('근무지', 'Workplace')}</th><td>${tr('화장품 물류센터', 'Cosmetics logistics center')}</td></tr>
            <tr><th>${tr('첫 업무', 'First job')}</th><td>${
                known === total
                    ? tr(
                          '모든 업무 면제 · 원하는 업무를 골라 다시 해 볼 수 있어요',
                          'Every job waived · replay any job you like',
                      )
                    : `${quest.title}<br><small>${stage.name} · ${stage.topic}</small>`
            }</td></tr>
            <tr><th>${tr('면제', 'Waived')}</th><td>${tr(`${known} / ${total}개 업무`, `${known} / ${total} jobs`)}</td></tr>
            <tr><th>${tr('담당', 'Contact')}</th><td>${whoOf(boss)}</td></tr>
            <tr><th>${tr('출근', 'Start')}</th><td>${tr('내일 오전 9시', 'Tomorrow, 9 AM')}</td></tr>
          </table>
          <h4>${tr('개념 상태', 'Concepts')}</h4>
          ${boardHTML(board)}
          <p class="iv-note">${tr('면접에서 푼 문제는 휴게실 「재도전 게시판」에서 다시 볼 수 있어요.', 'You can look at the interview questions again on the Retry board in the break room.')}</p>
          <button class="btn go iv-go">${tr('출근하기', 'Go to work')}</button>
        </div>`;
            phone.querySelector('.iv-go').addEventListener('click', () => {
                phone.remove();
                resolve();
            });
        });
    });
}
