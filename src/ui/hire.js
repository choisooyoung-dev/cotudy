// A new character's hiring: HQ interview → "a few days later" → offer mail → first day (PLAN.md §8).
// The interview is a dialog scene in an HQ meeting room (no 3D map). Small talk first, then the skill check:
// it erases the concepts (= quests) they already know, stage by stage, and the missions left are the job.
// Always hired; only what they start with differs.

import { tr } from '../i18n.js';
import { faceHTML } from './mission.js';
import { highlight } from './code.js';

export const COMPANY = () => tr('한빛로지스', 'Hanbit Logis');
const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const shuffle = (a) => { const b = [...a]; for (let i = b.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [b[i], b[j]] = [b[j], b[i]]; } return b; };

/**
 * ctx: { app, dialog, npcs, whoOf, langs, pickLang(id) (sets + warms the language),
 *        stagesFor(lang), questsFor(lang), interviewFor(lang), run(lang, code) → { ok, output } }
 * Resolves with { start: stage id, known: [quest ids the interview showed they know] }.
 */
export async function runHiring(ctx) {
  const { app, dialog, npcs, whoOf } = ctx;
  const [seo, baek, cha] = [npcs.hq1, npcs.hq2, npcs.hq3];

  // ---- the meeting room ----
  const room = document.createElement('div');
  room.className = 'iv-room';
  room.innerHTML = `<div class="iv-wall"><div class="iv-window"></div><div class="iv-sign">${COMPANY()} ${tr('본사 · 3층 회의실', 'HQ · Meeting room 3F')}</div></div>
    <div class="iv-panel">${[seo, baek, cha].map((n, i) => `<div class="iv-person" data-i="${i}">${faceHTML(n.look, { bust: true })}<div class="iv-plate">${n.name}</div></div>`).join('')}</div>
    <div class="iv-table"></div>`;
  app.appendChild(room);
  await sleep(30);
  room.classList.add('in');
  const people = [seo, baek, cha];
  const talking = (n) => room.querySelectorAll('.iv-person').forEach((el, i) => el.classList.toggle('talking', people[i] === n));
  // no "Close" in an interview: a line without choices just goes on
  const NEXT = () => [{ label: tr('다음', 'Next'), value: true, primary: true }];
  const say = async (n, lines, buttons = NEXT()) => { talking(n); const v = await dialog({ who: whoOf(n), lines, buttons }); talking(null); return v; };

  // ---- greeting + language ----
  await say(seo, [
    tr('안녕하세요, 김사원님. 면접 보러 오셨죠? 저는 본사 서다은이에요. 오늘 면접을 진행할게요.', 'Hello, Kim. You\'re here for the interview, right? I\'m Seo from HQ. I\'ll be running it today.'),
    tr('옆에는 백승호 님, 차미경 님이에요. 편하게 하셔도 돼요.', 'Next to me are Baek and Cha. Make yourself comfortable.'),
  ]);
  const lang = await say(seo, [tr('우리 센터는 전산 일을 코드로 해요. 어떤 언어로 면접 보실래요?', 'At our center we do the system work in code. Which language will you interview in?')],
    ctx.langs.map((l) => ({ html: `${l.icon}${l.name}`, value: l.id, disabled: !l.quests, primary: l.id === 'java' })));
  ctx.pickLang(lang || 'java');

  // ---- small talk (no score) ----
  const exp = await say(seo, [tr('물류 일은 해 보셨어요?', 'Have you worked in logistics before?')],
    [{ label: tr('네, 조금요', 'Yes, a little'), value: 'yes', primary: true }, { label: tr('아니요, 처음이에요', 'No, it\'s my first time'), value: 'no' }]);
  await say(seo, [exp === 'yes'
    ? tr('오, 그럼 센터 분위기는 금방 익히시겠네요.', 'Oh, then you\'ll get used to the center quickly.')
    : tr('괜찮아요. 센터 분들이 친절하게 알려 주실 거예요.', 'That\'s fine. The people at the center will show you the ropes.')]);
  const code = await say(baek, [tr('코딩은 얼마나 해 보셨어요?', 'How much coding have you done?')],
    [{ label: tr('조금 해 봤어요', 'Some'), value: 'some', primary: true }, { label: tr('거의 처음이에요', 'Almost none'), value: 'new' }]);
  let skip = false;
  if (code === 'new') {
    skip = (await say(baek, [tr('그럼 기초부터 차근차근 배우는 것도 괜찮아요. 간단한 문제를 몇 개 풀어 볼래요, 아니면 기초부터 시작할래요?', 'Then starting from the basics is fine too. Want to try a few short questions, or start from the basics?')],
      [{ label: tr('문제 풀어 볼게요', 'I\'ll try the questions'), value: 'try', primary: true }, { label: tr('기초부터 할게요', 'Start from the basics'), value: 'basic' }])) === 'basic';
  } else {
    await say(baek, [tr('좋아요. 그럼 간단한 문제 몇 개 볼게요.', 'Good. Let\'s look at a few short questions, then.')]);
  }

  // ---- technical questions: erase the concepts they already know, in about 10 questions ----
  // The stages go from easy to hard, so: 1) binary search for the first stage they don't know, asking each
  // probed stage's combined question (right → that stage and every easier one count as known); 2) with the
  // questions left, check the concepts (quests) of that stage and the next one by their own predict question.
  const L = lang || 'java';
  const stages = ctx.stagesFor(L).filter((st) => ctx.questsFor(L).some((q) => q.stage === st.id));
  const quests = ctx.questsFor(L);
  const known = new Set();
  const BUDGET = 10;
  if (!skip) {
    await say(cha, [
      tr('이제 실력을 볼게요. 10문제 정도예요. 아는 건 건너뛰고, 모르는 것부터 일을 드릴 거예요.', 'Now let\'s see your skills: about 10 questions. We\'ll skip what you know and give you work on what you don\'t.'),
      tr('모르면 「잘 모르겠어요」를 눌러도 돼요. 찍는 것보다 그게 나아요.', 'If you don\'t know, press "I don\'t know". That\'s better than guessing.'),
    ]);
    const groups = ctx.interviewFor(L) || [];
    const people3 = [seo, baek, cha];
    let n = 0;
    const ask = async (q, si, tag) => {
      const asker = people3[Math.min(2, Math.floor((si / stages.length) * 3))];
      talking(asker);
      const r = await askQuestion(app, q, ++n, `${stages[si].name} · ${tag}`, whoOf(asker), (code) => ctx.run(L, code));
      talking(null);
      return r;
    };
    const askConcept = (q, si) => ask({ type: 'predict', prompt: q.predict.prompt, code: q.predict.code, choices: q.predict.choices, answer: q.predict.answer }, si, tr('개념 확인', 'concept check'));
    // 1) binary search: lo = first stage that might be unknown, hi = first stage known to be unknown
    let lo = 0, hi = stages.length;
    while (lo < hi && n < BUDGET - 2) {
      const mid = Math.floor((lo + hi) / 2);
      const g = groups.find((x) => x.stage === stages[mid].id);
      const right = g ? await ask(g, mid, tr('종합', 'combined')) : false;
      if (right) lo = mid + 1; else hi = mid;
    }
    for (const st of stages.slice(0, lo)) quests.filter((q) => q.stage === st.id).forEach((q) => known.add(q.id));
    // 2) the frontier: that stage's concepts, then the next stage's, while questions are left
    for (let si = lo; si < stages.length && n < BUDGET; si++) {
      let got = 0;
      for (const q of quests.filter((x) => x.stage === stages[si].id && x.predict)) {
        if (n >= BUDGET) break;
        if (await askConcept(q, si)) { known.add(q.id); got++; }
      }
      if (!got) break; // nothing known here: the stages after it are surely new too
    }
    if (known.size === quests.length) await say(cha, [tr('전부 알고 계시네요. 대단해요.', 'You know all of it. Impressive.')]);
  }
  const first = quests.find((q) => !known.has(q.id)) || quests[quests.length - 1];
  const start = first.stage;
  await say(seo, [tr('수고하셨어요! 오늘 면접은 여기까지예요. 결과는 메일로 보내 드릴게요.', 'Thank you! That\'s all for today. We\'ll send you the result by email.')]);

  // ---- a few days later: the mail ----
  room.classList.add('dark');
  await sleep(500);
  const later = document.createElement('div');
  later.className = 'iv-later';
  later.textContent = tr('며칠 뒤…', 'A few days later…');
  room.appendChild(later);
  await sleep(1700);
  later.remove();
  await showMail(room, { stage: stages.find((s) => s.id === start), quest: first, known: known.size, total: quests.length }, npcs, whoOf);
  room.classList.remove('in');
  await sleep(350);
  room.remove();
  return { start, known: [...known] };
}

const norm = (s) => (s || '').replace(/\r/g, '').split('\n').map((l) => l.replace(/\s+$/, '')).join('\n').replace(/\n+$/, '');

/**
 * One question: { type: 'predict' | 'bug' | 'fill', code, choices + answer (default 0), prompt?, blanks, expected, solution }.
 * Resolves true when answered right. `run(code)` runs code for fill questions.
 */
function askQuestion(app, q, n, tag, who, run) {
  return new Promise((resolve) => {
    const type = q.type || 'predict';
    const el = document.createElement('div');
    el.className = 'iv-q';
    const prompt = q.prompt || (type === 'bug'
      ? tr('이 코드에는 잘못된 곳이 있어요. 어디가 왜 틀렸을까요?', 'Something in this code is wrong. Where, and why?')
      : type === 'fill' ? tr('빈칸을 채워서 아래처럼 찍히게 하세요.', 'Fill in the blanks so it prints this.')
      : tr('이 코드를 실행하면 어떻게 찍힐까요?', 'What will this code print?'));
    const right = q.answer ?? 0;
    const choices = type === 'fill' ? [] : shuffle(q.choices.map((c, k) => ({ c, right: k === right })));
    // fill: the code with an input in place of every {{n}}
    const codeHTML = type === 'fill'
      // (marked with private-use characters first, so the highlighter leaves the blank number alone)
      ? highlight(q.code.replace(/\{\{(\d+)\}\}/g, (_, k) => `\uE000${String.fromCharCode(97 + +k)}\uE001`))
        .replace(/\uE000([a-z])\uE001/g, (_, c) => { const k = c.charCodeAt(0) - 97; return `<input class="iv-blank" data-k="${k}" size="${(q.blanks?.[k]?.size || 4) + 1}" spellcheck="false" autocomplete="off" autocapitalize="off">`; })
      : highlight(q.code);
    el.innerHTML = `<div class="who">${who}</div><div class="iv-count">${tr(`${n}번째`, `#${n}`)} · ${tag}</div>
      <p>${prompt}</p>
      <pre class="iv-code">${codeHTML}</pre>
      ${type === 'fill'
        ? `<div class="iv-expect"><span>${tr('✅ 이렇게 나오면 성공', '✅ Make it print this')}</span><pre>${esc(q.expected)}</pre></div><div class="iv-status"></div>`
        : `<div class="iv-choices">${choices.map((x, k) => `<button class="btn iv-choice" data-k="${k}"><b>${k + 1}</b><span>${esc(x.c)}</span></button>`).join('')}</div>`}
      <div class="btns">${type === 'fill' ? `<button class="btn go iv-check">${tr('확인', 'Check')}</button>` : ''}<button class="btn iv-skip">${tr('잘 모르겠어요', 'I don\'t know')}</button></div>`;
    app.appendChild(el);
    const done = (v) => { removeEventListener('keydown', onKey, true); el.remove(); resolve(v); };
    el.querySelectorAll('.iv-choice').forEach((b) => b.addEventListener('click', () => done(choices[+b.dataset.k].right)));
    el.querySelector('.iv-skip').addEventListener('click', () => done(false));
    const check = el.querySelector('.iv-check');
    if (check) {
      el.querySelector('.iv-blank')?.focus();
      check.addEventListener('click', async () => {
        const vals = [...el.querySelectorAll('.iv-blank')].reduce((m, i) => ({ ...m, [i.dataset.k]: i.value.trim() }), {});
        if (Object.values(vals).some((v) => !v)) { el.querySelector('.iv-status').textContent = tr('빈칸을 모두 채워 주세요.', 'Fill in every blank.'); return; }
        check.disabled = true;
        el.querySelector('.iv-status').textContent = tr('실행해서 확인하는 중…', 'Running it to check…');
        const r = await run(q.code.replace(/\{\{(\d+)\}\}/g, (_, k) => vals[k]));
        done(!!r?.ok && norm(r.output) === norm(q.expected));
      });
    }
    const onKey = (e) => {
      if (type === 'fill') { if (e.key === 'Enter') { e.preventDefault(); e.stopImmediatePropagation(); check.click(); } return; }
      const k = +e.key;
      if (k >= 1 && k <= choices.length) { e.preventDefault(); e.stopImmediatePropagation(); done(choices[k - 1].right); }
    };
    setTimeout(() => addEventListener('keydown', onKey, true), 150);
  });
}

/** The phone mail box: one unread offer mail → open it → 「출근하기」. */
function showMail(room, { stage, quest, known, total }, npcs, whoOf) {
  return new Promise((resolve) => {
    const boss = npcs[quest.npc];
    const fromStart = known === 0;
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
          <p>${fromStart
            ? tr('면접 결과에 따라 아래와 같이 배치되었습니다. 기초부터 차근차근 함께해요.', 'Based on your interview, here is your placement. We\'ll start from the basics together.')
            : tr(`면접에서 확인된 <b>${known}개 업무</b>는 교육이 면제되고, 아직 배우지 않은 업무부터 시작합니다.`, `The <b>${known} jobs</b> you showed you know in the interview are waived; you start with what you haven't learned yet.`)}</p>
          <table>
            <tr><th>${tr('근무지', 'Workplace')}</th><td>${tr('화장품 물류센터', 'Cosmetics logistics center')}</td></tr>
            <tr><th>${tr('첫 업무', 'First job')}</th><td>${known === total
              ? tr('모든 업무 면제 · 원하는 업무를 골라 다시 해 볼 수 있어요', 'Every job waived · replay any job you like')
              : `${quest.title}<br><small>${stage.name} · ${stage.topic}</small>`}</td></tr>
            <tr><th>${tr('면제', 'Waived')}</th><td>${tr(`${known} / ${total}개 업무`, `${known} / ${total} jobs`)}</td></tr>
            <tr><th>${tr('담당', 'Contact')}</th><td>${whoOf(boss)}</td></tr>
            <tr><th>${tr('출근', 'Start')}</th><td>${tr('내일 오전 9시', 'Tomorrow, 9 AM')}</td></tr>
          </table>
          <button class="btn go iv-go">${tr('출근하기', 'Go to work')}</button>
        </div>`;
      phone.querySelector('.iv-go').addEventListener('click', () => { phone.remove(); resolve(); });
    });
  });
}
