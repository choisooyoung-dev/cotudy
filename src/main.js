import './style.css';
import { createWorld } from './world/game.js';
import { store } from './store.js';
import { STAGES } from './content/stages.js';
import { NPCS } from './content/npcs.js';
import { QUESTS as JAVA_QUESTS } from './content/java/quests.js';
import { QUESTS as JS_QUESTS } from './content/javascript/quests.js';
import { QUESTS as PY_QUESTS } from './content/python/quests.js';
import { RUNTIMES } from './runner/index.js';
import { openMission, faceHTML } from './ui/mission.js';
import { warmUpJava, runJava } from './runner/java.js';
import { runJs } from './runner/javascript.js';
import { runPython, warmUpPython } from './runner/python.js';
import { QUESTS as JAVA_QUESTS_EN } from './content/java/quests.en.js';
import { QUESTS as JS_QUESTS_EN } from './content/javascript/quests.en.js';
import { QUESTS as PY_QUESTS_EN } from './content/python/quests.en.js';
import { isEn, tr, setUiLang, UI_LANG } from './i18n.js';
import { TOUR_START, TOUR_STOPS, TOUR_END } from './content/tour.js';

// Start loading the language runtime first, before the 3D center is built, so it is ready sooner.
// (The first Java load takes 10+ seconds on a new browser; after that the browser cache makes it ~2s.)
const warm = (store.lang || 'java') === 'java' ? warmUpJava() : Promise.resolve();
if (store.lang === 'python') warmUpPython();

const LANGS = [
  { id: 'java', name: 'Java', icon: '<img class="lang-ico" src="./icons/java-original.svg" alt="">', quests: isEn ? JAVA_QUESTS_EN : JAVA_QUESTS },
  { id: 'javascript', name: 'JavaScript', icon: '<img class="lang-ico" src="./icons/javascript-original.svg" alt="">', quests: isEn ? JS_QUESTS_EN : JS_QUESTS },
  { id: 'python', name: 'Python', icon: '<img class="lang-ico" src="./icons/python-original.svg" alt="">', quests: isEn ? PY_QUESTS_EN : PY_QUESTS },
];

const app = document.getElementById('app');
app.innerHTML = `
  <div id="world"></div>
  <div class="hud"><span class="hud-title"></span><small class="hud-sub"></small><div class="cells"></div><div class="tip"></div></div>
  <div class="goal"></div>
  <div class="toast hide"></div>
  <div class="pad"><button class="u">▲</button><button class="l">◀</button><button class="act">${tr('말 걸기', 'Talk')}</button><button class="r">▶</button><button class="d">▼</button></div>
  <button class="menu-btn" title="${tr('언어 · 저장 파일 · 초기화', 'Language · save file · reset')}"><span class="ico">⚙️</span>${tr('설정', 'Settings')}</button>
  <div class="credit"><span class="java-state">${tr('☕ 자바 준비 중…', '☕ Getting Java ready…')}</span> · <a href="https://cheerpj.com" target="_blank" rel="noopener">Built with CheerpJ</a> · © 2026 choisooyoung-dev. All rights reserved.</div>`;

const $ = (s) => app.querySelector(s);
const langInfo = () => LANGS.find((l) => l.id === (store.lang || 'java'));
let quests = langInfo().quests;
/** "인사팀 한지원" / "Jiwon · HR" */
const whoOf = (npc) => (isEn ? `${npc.name} · ${npc.role}` : `${npc.role} ${npc.name}`);
const LAP = tr('1회차', 'Lap 1');
let busy = false;
let touring = false; // first-day tour in progress: Jiwon leads, normal talking is off

// ---------- progress ----------
const questsOf = (stageId) => quests.filter((q) => q.stage === stageId);
const stageDone = (s) => { const qs = questsOf(s.id); return qs.length > 0 && qs.every((q) => store.isDone(q.id)); };
function currentStageIndex() {
  const i = STAGES.findIndex((s) => !stageDone(s));
  return i === -1 ? STAGES.length : i;
}
function nextQuest() {
  const si = currentStageIndex();
  const stage = STAGES[si];
  if (!stage) return null;
  return questsOf(stage.id).find((q) => !store.isDone(q.id)) || null;
}
/** Progress of a language in % (default: the current one). Each 1회차 stage counts the same. */
function percent(langId = store.lang || 'java') {
  const lang = LANGS.find((l) => l.id === langId);
  const done = store.doneOf(langId);
  let sum = 0;
  for (const s of STAGES) {
    const qs = (lang?.quests || []).filter((q) => q.stage === s.id);
    if (qs.length) sum += qs.filter((q) => q.id in done).length / qs.length;
  }
  return Math.round((sum / STAGES.length) * 100);
}

// ---------- world ----------
const savedPos = store.pos;
const world = createWorld($('#world'), {
  npcs: NPCS,
  playerStart: savedPos || { x: -19.8, z: 11.3 },
  onInteract: (id) => talkTo(id),
  onMove: (x, z) => store.savePos(x, z),
});

function refresh() {
  const si = currentStageIndex();
  const stage = STAGES[si];
  const q = nextQuest();
  // every area is open to walk around (2026-11-12: the tape walls were hard to see); only quests follow the order
  world.setQuestMarks(q ? [q.npc] : []);
  world.setArrowTarget(q ? q.npc : null);

  // HUD
  const lang = langInfo();
  $('.hud-title').textContent = `${lang.name} · ${LAP}`;
  $('.hud-sub').textContent = stage ? `${stage.name} · ${stage.topic}` : tr('1회차 완료!', 'Lap 1 complete!');
  $('.cells').innerHTML = STAGES.map((s, i) => `<i class="${stageDone(s) ? 'on' : i === si ? 'now' : ''}" title="${s.name} · ${s.topic}"></i>`).join('');
  const doneCount = STAGES.filter(stageDone).length;
  $('.tip').innerHTML = `${percent()}% ${tr('완료', 'done')} <span>(${doneCount}/${STAGES.length}${stage ? tr(' · 지금: ', ' · now: ') + stage.name : ''})</span>`;
  if (q) $('.goal').textContent = tr(`📍 ${NPCS[q.npc].name}에게 말 걸기 · ${q.title}`, `📍 Talk to ${NPCS[q.npc].name} · ${q.title}`);
  else if (stage) $('.goal').textContent = tr(`🚧 ${stage.name}(${stage.topic})은 다음 업데이트에서 열려요`, `🚧 ${stage.name} (${stage.topic}) opens in a future update`);
  else $('.goal').textContent = tr('🎉 1회차 완료!', '🎉 Lap 1 complete!');
}

let toastTimer;
function toast(html, ms = 3200) {
  const t = $('.toast');
  t.innerHTML = html;
  t.classList.remove('hide');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => t.classList.add('hide'), ms);
}

// ---------- dialog ----------
/** Same colors as the player character in src/world/game.js. */
const PLAYER_LOOK = { hair: '#5a3825', vest: '#ff9f43', shirt: '#ffffff' };

function dialog({ who, lines, buttons, look }) {
  return new Promise((resolve) => {
    busy = true;
    world.setFrozen(true);
    const d = document.createElement('div');
    d.className = 'dlg';
    app.appendChild(d);
    let i = 0;
    const finish = (v) => { d.remove(); removeEventListener('keydown', onKey, true); busy = false; world.setFrozen(false); resolve(v); };
    const draw = () => {
      const last = i === lines.length - 1;
      // a line is a string (said by `who`) or { who, text, me } for conversations with several people
      const line = lines[i];
      const text = typeof line === 'string' ? line : line.text;
      const speaker = typeof line === 'string' ? who : line.who;
      const face = typeof line === 'string' ? look : line.look;
      d.classList.toggle('has-face', !!face);
      d.innerHTML = `${face ? `<div class="portrait">${faceHTML(face, { bust: true })}</div>` : ''}<div class="who${line?.me ? ' me' : ''}">${speaker}</div><p>${text}</p><div class="btns"></div>`;
      const btns = d.querySelector('.btns');
      const list = last ? (buttons || [{ label: tr('닫기', 'Close'), value: null, primary: true }]) : [{ label: tr('다음', 'Next'), value: '__next', primary: true }];
      list.forEach((b, k) => {
        const el = document.createElement('button');
        el.className = 'btn' + (b.primary ? ' go' : '');
        el.disabled = !!b.disabled;
        el.innerHTML = b.html || b.label + (b.primary ? '<kbd>Space</kbd>' : '');
        el.addEventListener('click', () => (b.value === '__next' ? (i++, draw()) : finish(b.value)));
        btns.appendChild(el);
        if (b.primary) el.dataset.primary = '1';
      });
    };
    const onKey = (e) => {
      if (e.key === ' ' || e.key === 'Enter') { e.preventDefault(); e.stopImmediatePropagation(); d.querySelector('[data-primary]')?.click(); }
      else if (e.key === 'Escape') { e.stopImmediatePropagation(); finish(null); }
    };
    setTimeout(() => addEventListener('keydown', onKey, true), 150);
    draw();
  });
}

async function talkTo(id) {
  if (busy || touring) return;
  const npc = NPCS[id];
  const who = whoOf(npc);
  const look = npc.look;
  const q = nextQuest();
  if (q && q.npc === id) {
    const choice = await dialog({
      who, look, lines: q.request,
      buttons: [{ label: tr('나중에 할게요', 'Maybe later'), value: 'later' }, { label: tr('퀘스트 시작', 'Start quest'), value: 'start', primary: true }],
    });
    if (choice === 'start') await startQuest(q);
    return;
  }
  // replay: talking to a quest giver whose quests are done
  const doneHere = quests.filter((x) => x.npc === id && store.isDone(x.id));
  const line = npc.talk[Math.floor(Math.random() * npc.talk.length)];
  if (doneHere.length) {
    const v = await dialog({
      who, look, lines: [line],
      buttons: [{ label: tr('다시 풀어 보기', 'Play again'), value: 'replay' }, { label: tr('닫기', 'Close'), value: null, primary: true }],
    });
    if (v === 'replay') {
      const pick = await dialog({
        who, look, lines: [tr('어떤 걸 다시 해 볼래요?', 'Which one do you want to redo?')],
        buttons: [...doneHere.map((x) => ({ label: `${x.title} ${'★'.repeat(store.stars(x.id))}`, value: x.id })), { label: tr('닫기', 'Close'), value: null, primary: true }],
      });
      const rq = quests.find((x) => x.id === pick);
      if (rq) await startQuest(rq);
    }
    return;
  }
  // no quest from this person yet (or ever): just everyday small talk
  await dialog({ who, look, lines: [line] });
}

async function startQuest(q) {
  busy = true;
  world.setFrozen(true);
  const before = currentStageIndex();
  const wasNext = nextQuest();
  const res = await openMission(app, q, NPCS[q.npc], RUNTIMES[store.lang || 'java'], whoOf(NPCS[q.npc]));
  busy = false;
  world.setFrozen(false);
  if (!res) return;
  store.complete(q.id, res.stars);
  refresh();
  const after = currentStageIndex();
  const nq = nextQuest();
  if (after > before) {
    const done = STAGES[before];
    const next = STAGES[after];
    toast(tr(`✅ ${done.name} 완료! ${next ? `다음: ${next.name}` : ''}`, `✅ ${done.name} done! ${next ? `Next: ${next.name}` : ''}`), 4000);
    if (nq && nq.npc !== q.npc) { await world.showNpc(nq.npc); toast(tr(`📍 ${NPCS[nq.npc].name}에게 가 보세요! 주황 화살표가 방향을 알려 줘요`, `📍 Go see ${NPCS[nq.npc].name}! The orange arrow shows the way`), 4500); }
    else if (!nq && next) toast(tr(`🎉 지금 만들어 둔 퀘스트는 여기까지예요! ${next.name}(${next.topic})은 다음 업데이트에서 열려요`, `🎉 That's all the quests for now! ${next.name} (${next.topic}) opens in a future update`), 6000);
  } else if (nq && nq !== wasNext) {
    toast(tr(`📍 ${NPCS[nq.npc].name}님의 다음 퀘스트: ${nq.title}`, `📍 ${NPCS[nq.npc].name}'s next quest: ${nq.title}`), 3500);
  }
}

// ---------- language select (first visit) ----------
async function chooseLanguage() {
  const v = await dialog({
    who: whoOf(NPCS.han),
    look: NPCS.han.look,
    lines: store.lang
      ? [tr('다른 언어로 일해 볼래요? 언어마다 진행 상황은 따로 저장돼요.', 'Want to work in another language? Progress is saved separately for each language.')]
      : [tr('김사원님, 물류팀 입사를 축하해요! 저는 인사팀 한지원이에요.', 'Kim, welcome to the logistics team! I\'m Jiwon from HR.'), tr('우리 센터는 전산 일을 코드로 해요. 어떤 언어로 일하실 거예요?', 'Here at the center we do our system work in code. Which language will you work in?')],
    buttons: LANGS.map((l) => {
      const p = l.quests ? percent(l.id) : 0;
      const progress = p > 0 ? `<span class="lang-pct">${p}%</span>` : '';
      return { html: `${l.icon}${l.name}${progress}${store.lang === l.id ? ' ✓' : ''}`, value: l.id, disabled: !l.quests, primary: l.id === (store.lang || 'java') };
    }),
  });
  const first = !store.lang;
  if (!first && (!v || v === store.lang)) return; // closed, or picked the same language
  store.setLang(v || 'java');
  if (!first) { location.reload(); return; } // other language = other progress and position
  quests = langInfo().quests;
  if (store.lang === 'javascript') $('.java-state').textContent = '⚡ JavaScript';
  if (store.lang === 'java') warmUpJava();
  if (store.lang === 'python') { $('.java-state').textContent = tr('🐍 파이썬 준비 중…', '🐍 Getting Python ready…'); warmUpPython().then(() => { $('.java-state').textContent = tr('🐍 파이썬 준비 완료', '🐍 Python ready'); }); }
  refresh();
  if (!store.toured) { runTour(); return; }
  toast(tr('⌨️ 방향키(또는 WASD)로 움직여요. 사람 앞에서 <kbd>Space</kbd> 를 누르면 말을 걸어요', '⌨️ Move with the arrow keys (or WASD). Press <kbd>Space</kbd> next to someone to talk'), 6000);
}

// ---------- first-day tour ----------
/** True once the chosen language can run code (Java needs a long first download). */
function runtimeReady() {
  return Promise.race([RUNTIMES[store.lang || 'java'].warm().then(() => true, () => true), new Promise((r) => setTimeout(() => r(false), 50))]);
}
const ME = () => tr('물류팀 김사원', 'Kim · Logistics');
const speak = (lines) => dialog({ who: '', lines: lines.map((l) => ({ text: l.text, me: l.who === 'me', who: l.who === 'me' ? ME() : whoOf(NPCS[l.who]), look: l.who === 'me' ? PLAYER_LOOK : NPCS[l.who].look })) });

async function runTour() {
  touring = true;
  // the tour is the first day at work, not a loading screen: hide the "getting Java ready" status
  $('.java-state').style.visibility = 'hidden';
  world.setQuestMarks([]);
  world.setArrowTarget('han');
  const goal = tr('📍 한지원을 따라가며 인사하기', '📍 Follow Jiwon and say hello');
  $('.goal').textContent = goal;
  await speak(TOUR_START);
  toast(tr('⌨️ 방향키(또는 W A S D)로 한지원을 따라가세요', '⌨️ Follow Jiwon with the arrow keys (or W A S D)'), 5000);
  for (const stop of TOUR_STOPS) {
    world.walkNpc(stop.npc, [stop.meet], { speed: 2.2, face: stop.path[stop.path.length - 1] });
    await world.walkNpc('han', stop.path, { lead: true });
    await speak(stop.lines);
    // the last stop keeps chatting over coffee until the runtime is ready (at most every extra group once)
    for (const more of stop.extra || []) {
      if (await runtimeReady()) break;
      await speak(more);
    }
    world.freeNpc(stop.npc);
  }
  await speak(TOUR_END.lines);
  await world.walkNpc('han', TOUR_END.path, { lead: true });
  world.freeNpc('han');
  touring = false;
  $('.java-state').style.visibility = '';
  store.setToured();
  refresh();
  const q = nextQuest();
  if (q?.npc === 'han') await talkTo('han');
}

// ---------- touch pad ----------
const padMap = { u: [0, -1], d: [0, 1], l: [-1, 0], r: [1, 0] };
for (const [cls, [x, z]] of Object.entries(padMap)) {
  const b = $(`.pad .${cls}`);
  const on = (e) => { e.preventDefault(); world.setPad(x, z); };
  const off = () => world.setPad(0, 0);
  b.addEventListener('pointerdown', on); b.addEventListener('pointerup', off); b.addEventListener('pointerleave', off);
}
$('.pad .act').addEventListener('click', () => dispatchEvent(new KeyboardEvent('keydown', { key: ' ' })));

// ---------- settings ----------
$('.menu-btn').addEventListener('click', async () => {
  if (busy) return;
  const v = await dialog({
    who: tr('설정', 'Settings'),
    lines: [tr('진행 상황은 이 브라우저에만 저장돼요. 다른 컴퓨터에서 이어 하려면 저장 파일을 받아서 거기서 불러오세요.', 'Your progress is saved only in this browser. To continue on another computer, download a save file and load it there.')],
    buttons: [
      { label: tr('💻 코딩 언어 바꾸기', '💻 Change coding language'), value: 'lang' },
      { label: tr('🌐 화면 언어: English', '🌐 Display language: 한국어'), value: 'ui' },
      { label: tr('💾 저장 파일 받기', '💾 Download save file'), value: 'export' },
      { label: tr('📂 저장 파일 불러오기', '📂 Load save file'), value: 'import' },
      { label: tr('진행 초기화', 'Reset progress'), value: 'reset' },
      { label: tr('닫기', 'Close'), value: null, primary: true },
    ],
  });
  if (v === 'lang') chooseLanguage();
  if (v === 'ui') setUiLang(UI_LANG === 'en' ? 'ko' : 'en');
  if (v === 'export') exportSave();
  if (v === 'import') importSave();
  if (v === 'reset' && confirm(tr('모든 진행 상황을 지울까요? 되돌릴 수 없어요.\n(지우기 전에 저장 파일을 받아 두면 나중에 불러올 수 있어요)', 'Delete all progress? This can\'t be undone.\n(Download a save file first if you might want it back.)'))) { store.reset(); location.reload(); }
});

function exportSave() {
  const blob = new Blob([store.exportText()], { type: 'application/json' });
  const a = document.createElement('a');
  const d = new Date();
  a.href = URL.createObjectURL(blob);
  a.download = `cotudy-save-${d.getFullYear()}${String(d.getMonth() + 1).padStart(2, '0')}${String(d.getDate()).padStart(2, '0')}.json`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(a.href), 1000);
  toast(tr('💾 저장 파일을 받았어요. 다른 컴퓨터에서 ⚙️ 설정 → 저장 파일 불러오기로 이어 할 수 있어요', '💾 Save file downloaded. On another computer, use ⚙️ Settings → Load save file to continue'), 5000);
}

function importSave() {
  const input = document.createElement('input');
  input.type = 'file';
  input.accept = '.json,application/json';
  input.addEventListener('change', async () => {
    const file = input.files?.[0];
    if (!file) return;
    try {
      const text = await file.text();
      if (!confirm(tr('지금 진행 상황을 이 저장 파일로 바꿀까요? 지금 진행은 사라져요.', 'Replace your current progress with this save file? Your current progress will be lost.'))) return;
      store.importText(text);
      location.reload();
    } catch (e) {
      toast(tr(`⚠️ 불러오지 못했어요: ${e.message}`, `⚠️ Couldn't load it: ${e.message}`), 5000);
    }
  });
  input.click();
}

// ---------- start ----------
refresh();
if (!store.lang) setTimeout(chooseLanguage, 400);

if ((store.lang || 'java') === 'java') {
  // The first load downloads Java from the CheerpJ server. When that server is slow it can take
  // a minute or more, so say so instead of looking frozen.
  let javaReady = false;
  warm.finally(() => { javaReady = true; });
  setTimeout(() => { if (!javaReady) $('.java-state').textContent = tr('☕ 자바 서버가 느려요… 1분 넘게 안 되면 새로고침해 주세요', '☕ The Java server is slow… if it takes over a minute, reload the page'); }, 45000);
  warm.then(() => { $('.java-state').textContent = tr('☕ 자바 준비 완료', '☕ Java ready'); }, () => { $('.java-state').textContent = tr('⚠️ 자바를 불러오지 못했어요 (인터넷 연결 확인)', '⚠️ Couldn\'t load Java (check your internet connection)'); });
} else if (store.lang === 'python') {
  $('.java-state').textContent = tr('🐍 파이썬 준비 중…', '🐍 Getting Python ready…');
  warmUpPython().then(() => { $('.java-state').textContent = tr('🐍 파이썬 준비 완료', '🐍 Python ready'); }, () => { $('.java-state').textContent = tr('⚠️ 파이썬을 불러오지 못했어요 (인터넷 연결 확인)', '⚠️ Couldn\'t load Python (check your internet connection)'); });
} else {
  $('.java-state').textContent = `⚡ ${langInfo().name}`;
}
// debug helper for development
window.cotudy = { store, refresh, world, runJava, runJs, runPython, warm, talkTo, startQuest, runTour, quests: { java: JAVA_QUESTS, javascript: JS_QUESTS, python: PY_QUESTS, en: { java: JAVA_QUESTS_EN, javascript: JS_QUESTS_EN, python: PY_QUESTS_EN } } };
