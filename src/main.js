import './style.css';
import { createWorld } from './world/game.js';
import { ZONES } from './world/layout.js';
import { store } from './store.js';
import { STAGES } from './content/stages.js';
import { NPCS } from './content/npcs.js';
import { QUESTS as JAVA_QUESTS } from './content/java/quests.js';
import { QUESTS as JS_QUESTS } from './content/javascript/quests.js';
import { QUESTS as PY_QUESTS } from './content/python/quests.js';
import { RUNTIMES } from './runner/index.js';
import { openMission } from './ui/mission.js';
import { warmUpJava, runJava } from './runner/java.js';
import { runJs } from './runner/javascript.js';
import { runPython, warmUpPython } from './runner/python.js';

const LANGS = [
  { id: 'java', name: 'Java', desc: '백엔드 · 안드로이드', quests: JAVA_QUESTS },
  { id: 'javascript', name: 'JavaScript', desc: '웹 · 프론트엔드 · Node.js', quests: JS_QUESTS },
  { id: 'python', name: 'Python', desc: '데이터 · 자동화 · AI', quests: PY_QUESTS },
];

const app = document.getElementById('app');
app.innerHTML = `
  <div id="world"></div>
  <div class="hud"><span class="hud-title">Java · 1회차</span><small class="hud-sub"></small><div class="cells"></div><div class="tip"></div></div>
  <div class="goal"></div>
  <div class="toast hide"></div>
  <div class="pad"><button class="u">▲</button><button class="l">◀</button><button class="act">말 걸기</button><button class="r">▶</button><button class="d">▼</button></div>
  <button class="menu-btn" title="진행 초기화 등">⚙︎</button>
  <div class="credit"><span class="java-state">☕ 자바 준비 중…</span> · <a href="https://cheerpj.com" target="_blank" rel="noopener">Built with CheerpJ</a> · © 2026 choisooyoung-dev. All rights reserved.</div>`;

const $ = (s) => app.querySelector(s);
const langInfo = () => LANGS.find((l) => l.id === (store.lang || 'java'));
let quests = langInfo().quests || JAVA_QUESTS;
let busy = false;

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
function percent() {
  let sum = 0;
  for (const s of STAGES) {
    const qs = questsOf(s.id);
    if (qs.length) sum += qs.filter((q) => store.isDone(q.id)).length / qs.length;
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
  // locks: an area opens when its stage is reached AND it has quests (v1 has only office + receiving)
  for (const s of STAGES) {
    const zone = s.zone;
    if (!ZONES[zone]?.lockRect) continue;
    const reached = STAGES.indexOf(s) <= si && questsOf(s.id).length > 0;
    const anyOpen = STAGES.some((o) => o.zone === zone && STAGES.indexOf(o) <= si && questsOf(o.id).length > 0);
    if (reached || anyOpen) world.unlockZone(zone); else world.lockZone(zone);
  }
  world.setQuestMarks(q ? [q.npc] : []);
  world.setArrowTarget(q ? q.npc : null);

  // HUD
  const lang = langInfo();
  $('.hud-title').textContent = `${lang.name} · 1회차`;
  $('.hud-sub').textContent = stage ? `${stage.name} · ${stage.topic}` : '1회차 완료!';
  $('.cells').innerHTML = STAGES.map((s, i) => `<i class="${stageDone(s) ? 'on' : i === si ? 'now' : ''}" title="${s.name} · ${s.topic}"></i>`).join('');
  const doneCount = STAGES.filter(stageDone).length;
  $('.tip').innerHTML = `${percent()}% 완료 <span>(${doneCount}/${STAGES.length}${stage ? ' · 지금: ' + stage.name : ''})</span>`;
  if (q) $('.goal').textContent = `📍 ${NPCS[q.npc].name}에게 말 걸기 · ${q.title}`;
  else if (stage) $('.goal').textContent = `🚧 ${stage.name}(${stage.topic})은 다음 업데이트에서 열려요`;
  else $('.goal').textContent = '🎉 1회차 완료!';
}

let toastTimer;
function toast(html, ms = 3200) {
  const t = $('.toast');
  t.innerHTML = html;
  t.classList.remove('hide');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => t.classList.add('hide'), ms);
}

// "can't go there yet" message when bumping into tape
let lastBump = 0;
setInterval(() => {
  const z = world.blockedZone;
  if (z && performance.now() - lastBump > 4000) {
    lastBump = performance.now();
    const stage = STAGES.find((s) => s.zone === z);
    const ready = stage && questsOf(stage.id).length > 0;
    toast(ready ? `🚧 ${ZONES[z].name}은 앞 공간을 끝내면 열려요` : `🚧 ${ZONES[z].name}은 아직 준비 중이에요 (다음 업데이트)`);
  }
}, 200);

// ---------- dialog ----------
function dialog({ who, lines, buttons }) {
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
      d.innerHTML = `<div class="who">${who}</div><p>${lines[i]}</p><div class="btns"></div>`;
      const btns = d.querySelector('.btns');
      const list = last ? (buttons || [{ label: '닫기', value: null, primary: true }]) : [{ label: '다음', value: '__next', primary: true }];
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
  if (busy) return;
  const npc = NPCS[id];
  const who = `${npc.role} ${npc.name}`;
  const q = nextQuest();
  if (q && q.npc === id) {
    const choice = await dialog({
      who, lines: q.request,
      buttons: [{ label: '나중에 할게요', value: 'later' }, { label: '퀘스트 시작', value: 'start', primary: true }],
    });
    if (choice === 'start') await startQuest(q);
    return;
  }
  // replay: talking to a quest giver whose quests are done
  const doneHere = quests.filter((x) => x.npc === id && store.isDone(x.id));
  const line = npc.talk[Math.floor(Math.random() * npc.talk.length)];
  if (doneHere.length) {
    const v = await dialog({
      who, lines: [line],
      buttons: [{ label: '다시 풀어 보기', value: 'replay' }, { label: '닫기', value: null, primary: true }],
    });
    if (v === 'replay') {
      const pick = await dialog({
        who, lines: ['어떤 걸 다시 해 볼래요?'],
        buttons: [...doneHere.map((x) => ({ label: `${x.title} ${'★'.repeat(store.stars(x.id))}`, value: x.id })), { label: '닫기', value: null, primary: true }],
      });
      const rq = quests.find((x) => x.id === pick);
      if (rq) await startQuest(rq);
    }
    return;
  }
  if (q && STAGES[currentStageIndex()]?.npc !== id) {
    await dialog({ who, lines: [line, `${NPCS[q.npc].name}님이 김사원님 찾던데요?`] });
    return;
  }
  await dialog({ who, lines: [line] });
}

async function startQuest(q) {
  busy = true;
  world.setFrozen(true);
  const before = currentStageIndex();
  const wasNext = nextQuest();
  const res = await openMission(app, q, NPCS[q.npc], RUNTIMES[store.lang || 'java']);
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
    toast(`✅ ${done.name} 완료! ${next ? `다음: ${next.name}` : ''}`, 4000);
    if (nq && nq.npc !== q.npc) { await world.showNpc(nq.npc); toast(`📍 ${NPCS[nq.npc].name}에게 가 보세요! 주황 화살표가 방향을 알려 줘요`, 4500); }
    else if (!nq && next) toast(`🎉 지금 만들어 둔 퀘스트는 여기까지예요! ${next.name}(${next.topic})은 다음 업데이트에서 열려요`, 6000);
  } else if (nq && nq !== wasNext) {
    toast(`📍 ${NPCS[nq.npc].name}님의 다음 퀘스트: ${nq.title}`, 3500);
  }
}

// ---------- language select (first visit) ----------
async function chooseLanguage() {
  const v = await dialog({
    who: '인사팀 한지원',
    lines: store.lang
      ? ['다른 언어로 일해 볼래요? 언어마다 진행 상황은 따로 저장돼요.']
      : ['김사원님, 물류팀 입사를 축하해요! 저는 인사팀 한지원이에요.', '우리 센터는 전산 일을 코드로 해요. 어떤 언어로 일하실 거예요?'],
    buttons: LANGS.map((l) => ({ html: `${l.name}<small> · ${l.desc}</small>${store.lang === l.id ? ' ✓' : ''}`, value: l.id, disabled: !l.quests, primary: l.id === (store.lang || 'java') })),
  });
  const first = !store.lang;
  if (!v && !first) return;
  store.setLang(v || 'java');
  if (!first) { location.reload(); return; } // other language = other progress and position
  quests = langInfo().quests;
  if (store.lang === 'javascript') $('.java-state').textContent = '⚡ JavaScript';
  if (store.lang === 'python') { $('.java-state').textContent = '🐍 파이썬 준비 중…'; warmUpPython().then(() => { $('.java-state').textContent = '🐍 파이썬 준비 완료'; }); }
  refresh();
  toast('⌨️ 방향키(또는 WASD)로 움직여요. 사람 앞에서 <kbd>Space</kbd> 를 누르면 말을 걸어요', 6000);
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
    who: '설정',
    lines: ['진행 상황은 이 브라우저에만 저장돼요. 다른 컴퓨터에서 이어 하려면 저장 파일을 받아서 거기서 불러오세요.'],
    buttons: [
      { label: '🌐 언어 바꾸기', value: 'lang' },
      { label: '💾 저장 파일 받기', value: 'export' },
      { label: '📂 저장 파일 불러오기', value: 'import' },
      { label: '진행 초기화', value: 'reset' },
      { label: '닫기', value: null, primary: true },
    ],
  });
  if (v === 'lang') chooseLanguage();
  if (v === 'export') exportSave();
  if (v === 'import') importSave();
  if (v === 'reset' && confirm('모든 진행 상황을 지울까요? 되돌릴 수 없어요.\n(지우기 전에 저장 파일을 받아 두면 나중에 불러올 수 있어요)')) { store.reset(); location.reload(); }
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
  toast('💾 저장 파일을 받았어요. 다른 컴퓨터에서 ⚙︎ → 저장 파일 불러오기 로 이어 할 수 있어요', 5000);
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
      if (!confirm('지금 진행 상황을 이 저장 파일로 바꿀까요? 지금 진행은 사라져요.')) return;
      store.importText(text);
      location.reload();
    } catch (e) {
      toast(`⚠️ 불러오지 못했어요: ${e.message}`, 5000);
    }
  });
  input.click();
}

// ---------- start ----------
refresh();
if (!store.lang) setTimeout(chooseLanguage, 400);

// debug helper for development
// Java needs a slow first load, so start it in the background right away (only when playing Java)
const warm = (store.lang || 'java') === 'java' ? warmUpJava() : Promise.resolve();
if ((store.lang || 'java') === 'java') {
  warm.then(() => { $('.java-state').textContent = '☕ 자바 준비 완료'; }, () => { $('.java-state').textContent = '⚠️ 자바를 불러오지 못했어요 (인터넷 연결 확인)'; });
} else if (store.lang === 'python') {
  $('.java-state').textContent = '🐍 파이썬 준비 중…';
  warmUpPython().then(() => { $('.java-state').textContent = '🐍 파이썬 준비 완료'; }, () => { $('.java-state').textContent = '⚠️ 파이썬을 불러오지 못했어요 (인터넷 연결 확인)'; });
} else {
  $('.java-state').textContent = `⚡ ${langInfo().name}`;
}
window.cotudy = { store, refresh, world, runJava, runJs, runPython, warm, talkTo, startQuest };
