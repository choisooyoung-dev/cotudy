// 게임 전체 흐름. 화면 틀(HUD·버튼)을 만들고, 3D 세계(world/game.js)를 띄우고, 대화창·퀘스트·미션 창·투어·
// 면접·본사 직원 방문·재도전 게시판·설정을 이어 붙인다. 파일 아래쪽 "start" 부분에서 게임이 시작된다.
import './style.css';
import { installErrorLog, logError, playErrors, clearPlayErrors } from './errlog.js';
import { createWorld } from './world/game.js';
import { store, LOOKS as CHAR_LOOKS } from './store.js';
import { stagesFor } from './content/stages.js';
import { NPCS } from './content/npcs.js';
import { QUESTS as JAVA_QUESTS } from './content/java/quests.js';
import { QUESTS as JS_QUESTS } from './content/javascript/quests.js';
import { QUESTS as PY_QUESTS } from './content/python/quests.js';
import { RUNTIMES } from './runner/index.js';
import { openMission, faceHTML } from './ui/mission.js';
import { runHiring, askQuestion, conceptQuestion } from './ui/hire.js';
import { warmUpJava, runJava } from './runner/java.js';
import { runJs } from './runner/javascript.js';
import { codeKey, savedOutputs } from './runner/cache.js';
import { runPython, warmUpPython } from './runner/python.js';
import { QUESTS as JAVA_QUESTS_EN } from './content/java/quests.en.js';
import { QUESTS as JS_QUESTS_EN } from './content/javascript/quests.en.js';
import { QUESTS as PY_QUESTS_EN } from './content/python/quests.en.js';
import { QUESTS as JAVA_MORE } from './content/java/more.js';
import { QUESTS as JS_MORE } from './content/javascript/more.js';
import { QUESTS as PY_MORE } from './content/python/more.js';
import { QUESTS as JS_ADV } from './content/javascript/advanced.js';
import { QUESTS as JAVA_ADV } from './content/java/advanced.js';
import { QUESTS as PY_ADV } from './content/python/advanced.js';
import { isEn, tr, setUiLang, UI_LANG } from './i18n.js';
import { TOUR_START, TOUR_STOPS, TOUR_END } from './content/tour.js';
import { HQ_TESTS as JAVA_HQ } from './content/java/hq.js';
import { HQ_TESTS as JS_HQ } from './content/javascript/hq.js';
import { HQ_TESTS as PY_HQ } from './content/python/hq.js';
import { RETRY_SPOT, OBJECT_SPOTS } from './world/layout.js';
import { INTERVIEW as JAVA_IV } from './content/java/interview.js';
import { INTERVIEW as JS_IV } from './content/javascript/interview.js';
import { INTERVIEW as PY_IV } from './content/python/interview.js';

// 3D 센터를 만들기 전에 언어 실행기부터 불러오기 시작한다 (그래야 더 빨리 준비된다).
// (처음 자바를 받을 때는 10초 넘게 걸리고, 그다음부터는 브라우저 캐시 덕분에 2초쯤)
const warm = (store.lang || 'java') === 'java' ? warmUpJava() : Promise.resolve();
if (store.lang === 'python') warmUpPython();

installErrorLog();

// 고를 수 있는 코딩 언어들: id, 이름, 아이콘, 퀘스트 목록 (기초 + 1회차 나머지 + 고급). 화면 언어가 영어면 영어 퀘스트.
const LANGS = [
    {
        id: 'java',
        name: 'Java',
        icon: '<img class="lang-ico" src="./icons/java-original.svg" alt="">',
        quests: [...(isEn ? JAVA_QUESTS_EN : JAVA_QUESTS), ...JAVA_MORE, ...JAVA_ADV],
    },
    {
        id: 'javascript',
        name: 'JavaScript',
        icon: '<img class="lang-ico" src="./icons/javascript-original.svg" alt="">',
        quests: [...(isEn ? JS_QUESTS_EN : JS_QUESTS), ...JS_MORE, ...JS_ADV],
    },
    {
        id: 'python',
        name: 'Python',
        icon: '<img class="lang-ico" src="./icons/python-original.svg" alt="">',
        quests: [...(isEn ? PY_QUESTS_EN : PY_QUESTS), ...PY_MORE, ...PY_ADV],
    },
];

const app = document.getElementById('app'); // 게임 화면 전체가 들어가는 요소
// 화면 틀: 3D 세계, 왼쪽 위 진행 HUD, 오른쪽 위 목표·바로 가기, 알림(toast), 휴대폰 버튼, 설정 버튼, 아래 저작권 줄
app.innerHTML = `
  <div id="world"></div>
  <div class="hud"><span class="hud-title"></span><small class="hud-sub"></small><div class="cells"></div><div class="tip"></div></div>
  <div class="goal"></div>
  <button class="goto-btn hide">${tr('▶ 바로 가기', '▶ Go there')}</button>
  <div class="toast hide"></div>
  <div class="pad"><button class="u">▲</button><button class="l">◀</button><button class="act off"></button><button class="r">▶</button><button class="d">▼</button></div>
  <button class="menu-btn" title="${tr('언어 · 저장 파일 · 초기화', 'Language · save file · reset')}"><span class="ico">⚙️</span>${tr('설정', 'Settings')}</button>
  <div class="credit"><span class="java-state">${tr('☕ 자바 준비 중…', '☕ Getting Java ready…')}</span> · <a href="https://cheerpj.com" target="_blank" rel="noopener">Built with CheerpJ</a> · © 2026 choisooyoung-dev. All rights reserved.</div>`;

/** 화면 안에서 요소 하나 찾기. */
const $ = (s) => app.querySelector(s);
/** 지금 언어의 정보 (LANGS 의 한 칸). */
const langInfo = () => LANGS.find((l) => l.id === (store.lang || 'java'));
let quests = langInfo().quests; // 지금 언어의 퀘스트 전부
let STAGES = stagesFor(store.lang || 'java'); // 지금 언어의 단계들, 순서대로
/** 사람 이름표 글자: "인사팀 한지원" / "Jiwon · HR". */
const whoOf = (npc) => (isEn ? `${npc.name} · ${npc.role}` : `${npc.role} ${npc.name}`);
const LAP = tr('1회차', 'Lap 1');
let busy = false; // 대화창·미션 창이 떠 있는지 (떠 있으면 다른 사람에게 말 걸기를 막는다)
let interviewing = false; // 본사 면접·합격 메일 화면이 떠 있는지
let touring = false; // 첫 출근 투어 중인지: 한지원이 앞장서고, 평소의 말 걸기는 꺼진다

// ---------- 진행 상황 ----------
/** 그 단계의 퀘스트들. */
const questsOf = (stageId) => quests.filter((q) => q.stage === stageId);
/** 그 단계의 퀘스트를 모두 끝냈는지. */
const stageDone = (s) => {
    const qs = questsOf(s.id);
    return qs.length > 0 && qs.every((q) => store.isDone(q.id));
};
/** 지금 단계 번호 = 아직 다 못 끝낸 첫 단계 (모두 끝냈으면 단계 수). */
function currentStageIndex() {
    const i = STAGES.findIndex((s) => !stageDone(s));
    return i === -1 ? STAGES.length : i;
}
/** 다음에 할 퀘스트 = 지금 단계에서 아직 안 끝낸 첫 퀘스트 (없으면 null). */
function nextQuest() {
    const si = currentStageIndex();
    const stage = STAGES[si];
    if (!stage) return null;
    return questsOf(stage.id).find((q) => !store.isDone(q.id)) || null;
}
/** 그 언어의 진행률(%) = 끝낸 퀘스트(개념) 수 / 전체 퀘스트 수. 기본은 지금 언어. */
function percent(langId = store.lang || 'java', done = store.doneOf(langId)) {
    const qs = LANGS.find((l) => l.id === langId)?.quests || [];
    return qs.length ? Math.round((qs.filter((q) => q.id in done).length / qs.length) * 100) : 0;
}

/** 휴대폰·태블릿인지: 그러면 방향키 대신 바닥을 터치해서 걷는다. */
const TOUCH = matchMedia('(pointer: coarse)').matches;

// ---------- 센터 곳곳의 사물 ----------
// 사물 옆에서 Enter 를 누르면 하는 일 (사물 목록은 world/layout.js 의 OBJECT_SPOTS). 살펴보기는 김사원의 짧은 혼잣말이고,
// 정수기와 커피 자판기는 김사원 손에 컵을 들려 준다.
// 사물 종류별 안내 글자 (없는 종류는 "살펴보기")
const OBJECT_ACTIONS = {
    water: () => tr('물 마시기', 'Drink water'),
    coffee: () => tr('커피 뽑기', 'Get a coffee'),
    clockin: () => tr('출근 찍기', 'Clock in'),
    menu: () => tr('오늘의 메뉴 보기', "Check today's menu"),
};
/** 배열에서 아무거나 하나. */
const pick = (a) => a[Math.floor(Math.random() * a.length)];
// 사물 종류별 김사원의 혼잣말들 [한국어, 영어] (살펴볼 때 하나를 고른다)
const LOOKS = {
    pallet: [
        [
            '박스에 "수분 크림 24개입"이라고 적혀 있다. 생각보다 묵직하다.',
            'The box says "Moisturizing cream ×24". Heavier than it looks.',
        ],
        [
            '쿠션 팩트 박스가 차곡차곡 쌓여 있다. 몇 개인지 세려면… 코드가 필요하겠다.',
            'Cushion compact boxes, stacked neatly. Counting them all would take… some code.',
        ],
        [
            '송장에 "취급주의 · 유리병"이라고 붙어 있다. 살살 다뤄야지.',
            'The label says "Fragile · Glass". Gently does it.',
        ],
    ],
    scanner: [
        [
            '바코드 스캐너다. 삑! 박스 번호가 화면에 떴다.',
            'A barcode scanner. Beep! A box number pops up on the screen.',
        ],
    ],
    printer: [
        [
            '송장이 계속 나오고 있다. 주문번호, 받는 사람, 상품명… 같은 게 한 장도 없다.',
            'Shipping labels keep coming out. Order number, name, item… no two are the same.',
        ],
        [
            '프린터에 "용지 부족" 불이 깜빡인다. 이대리님께 말씀드려야겠다.',
            'The "paper low" light is blinking. I should tell Lee.',
        ],
    ],
    cutoff: [
        [
            '오늘 출고 마감은 15시. 그 전에 다 싣고 나가야 한다!',
            'Shipping cutoff is 15:00 today. Everything has to be loaded before then!',
        ],
    ],
    rack: [
        [
            '선반마다 "A-03-2" 같은 번호가 붙어 있다. 구역, 줄, 층 번호인가 보다.',
            'Every shelf has a code like "A-03-2". Zone, row and level, I guess.',
        ],
        [
            '립스틱, 마스카라, 선크림… 작은 상자들이 줄지어 있다.',
            'Lipstick, mascara, sunscreen… rows and rows of little boxes.',
        ],
    ],
    cage: [
        [
            '택배사별로 박스를 모아 두는 바퀴 달린 철망 카트다. 꽤 꽉 찼다.',
            'A wire cart on wheels that collects boxes for each courier. Pretty full already.',
        ],
    ],
    belt: [
        [
            '컨베이어 위로 박스가 천천히 흘러간다. 계속 보고 있으니 졸리다…',
            'Boxes drift slowly along the conveyor. Watching it makes me sleepy…',
        ],
    ],
    pack: [
        ['에어캡이 놓여 있다. 하나만 톡… 아무도 못 봤겠지?', 'Some bubble wrap. Just one pop… nobody saw that, right?'],
        ['포장 상자가 S, M, L 크기별로 쌓여 있다.', 'Packing boxes stacked by size: S, M and L.'],
    ],
    books: [
        [
            '물류 관리, 재고 관리, 안전 수칙… 맨 끝에 "처음 배우는 코딩"도 꽂혀 있다.',
            'Logistics, inventory, safety rules… and at the very end, "Coding for Beginners".',
        ],
    ],
};
let cupTimer; // 컵을 내려놓는 타이머
/** 김사원에게 컵을 ms 동안 들려 준다 (drink: 음료 색). */
function giveCup(drink, ms) {
    world.holdCup('me', true, drink);
    clearTimeout(cupTimer);
    cupTimer = setTimeout(() => world.holdCup('me', false), ms);
}
/** 사물 o 를 쓴다 (물 마시기, 커피 뽑기, 출근 찍기, 오늘의 메뉴, 살펴보기). */
async function useObject(o) {
    if (!o) return;
    const think = (ko, en) => speak([{ who: 'me', text: tr(ko, en) }]);
    switch (o.kind) {
        case 'water':
            giveCup('#bfe6ff', 5000);
            return toast(tr('💧 시원한 물 한 잔 마셨어요', '💧 You drank a cup of cold water'), 2500);
        case 'coffee':
            giveCup('#6f4e37', 40000);
            return toast(tr('☕ 300원 넣고 믹스커피 한 잔 뽑았어요', '☕ 300 won in, one cup of coffee out'), 2500);
        case 'clockin': {
            const now = new Date();
            return toast(
                tr(
                    `🪪 삑! ${now.getHours()}시 ${now.getMinutes()}분, 출근 찍혔어요`,
                    `🪪 Beep! Clocked in at ${now.getHours()}:${String(now.getMinutes()).padStart(2, '0')}`,
                ),
                2500,
            );
        }
        case 'menu': {
            // 오늘의 메뉴: 날짜로 정해서 하루에 한 번만 바뀐다 (같은 날은 몇 번 봐도 같은 메뉴). 2026-11-18 사용자 요청
            const d = new Date();
            let seed = d.getFullYear() * 10000 + (d.getMonth() + 1) * 100 + d.getDate(); // 예: 20261118
            const rand = () => {
                seed = (seed * 1103515245 + 12345) % 2147483648;
                return seed / 2147483648;
            }; // 날짜로 시작하는 고정 난수
            const pick = (list) => list[Math.floor(rand() * list.length)];
            const main = pick([
                ['제육볶음', 'spicy pork'],
                ['돈까스', 'pork cutlet'],
                ['비빔밥', 'bibimbap'],
                ['짜장면', 'black bean noodles'],
                ['김치찌개', 'kimchi stew'],
                ['카레라이스', 'curry rice'],
                ['닭갈비', 'spicy chicken'],
                ['불고기', 'bulgogi'],
                ['생선구이', 'grilled fish'],
                ['떡볶이', 'tteokbokki'],
                ['오므라이스', 'omurice'],
                ['잔치국수', 'noodle soup'],
            ]);
            const soup = pick([
                ['미역국', 'seaweed soup'],
                ['된장국', 'soybean soup'],
                ['어묵국', 'fish cake soup'],
                ['계란국', 'egg soup'],
                ['콩나물국', 'bean sprout soup'],
            ]);
            const side = pick([
                ['김치', 'kimchi'],
                ['계란말이', 'rolled omelette'],
                ['잡채', 'japchae'],
                ['감자조림', 'braised potatoes'],
                ['어묵볶음', 'stir-fried fish cake'],
                ['샐러드', 'salad'],
            ]);
            const dessert =
                rand() < 0.3
                    ? pick([
                          ['요구르트', 'a yogurt drink'],
                          ['과일', 'fruit'],
                          ['식혜', 'sikhye'],
                      ])
                    : null;
            return think(
                `오늘의 메뉴는 ${main[0]}, ${soup[0]}, ${side[0]}${dessert ? `, 후식은 ${dessert[0]}` : ''}! ${['맛있겠다.', '점심시간 기다려진다.', '오늘은 줄이 길겠는데…', '든든하겠다.'][Math.floor(Math.random() * 4)]}`,
                `Today's menu: ${main[1]}, ${soup[1]}, ${side[1]}${dessert ? `, and ${dessert[1]} for dessert` : ''}! ${['Looks good.', "Can't wait for lunch.", 'The line will be long today…', "That'll keep me going."][Math.floor(Math.random() * 4)]}`,
            );
        }
        default: {
            const l = LOOKS[o.kind];
            if (l) return think(...pick(l));
        }
    }
}

// ---------- 3D 세계 ----------
const savedPos = store.pos; // 마지막으로 저장된 김사원 위치 (없으면 사무실 앞)
const world = createWorld($('#world'), {
    npcs: NPCS,
    playerStart: savedPos || { x: -19.8, z: 11.3 },
    playerLook: store.look,
    onInteract: (id) => talkTo(id),
    onMove: (x, z) => store.savePos(x, z),
    onPrompt: (act) => {
        const b = $('.pad .act');
        if (!b) return;
        b.textContent = act || '';
        b.classList.toggle('off', !act);
    },
    spots: [
        {
            id: 'retry',
            ...RETRY_SPOT,
            label: tr('📋 재도전 게시판', '📋 Retry board'),
            action: tr('게시판 보기', 'Check the board'),
        },
        ...OBJECT_SPOTS.map((o) => ({ ...o, action: OBJECT_ACTIONS[o.kind]?.() || tr('살펴보기', 'Look') })),
    ],
});

/** 진행에 맞게 화면을 새로 맞춘다: 느낌표·화살표, 왼쪽 위 HUD(단계 칸·진행률), 오른쪽 위 목표, 바로 가기 버튼. */
function refresh() {
    const si = currentStageIndex();
    const stage = STAGES[si];
    const q = nextQuest();
    // 모든 구역을 걸어 다닐 수 있다 (2026-11-12: 테이프 벽이 잘 안 보였음). 순서는 퀘스트만 따른다
    world.setQuestMarks([...(q ? [q.npc] : []), ...(hqVisitor ? [hqVisitor] : [])]);
    world.setArrowTarget(q ? q.npc : null);

    // 왼쪽 위 HUD
    const lang = langInfo();
    $('.hud-title').textContent = `${lang.name} · ${LAP}`;
    $('.hud-sub').textContent = stage ? `${stage.name} · ${stage.topic}` : tr('1회차 완료!', 'Lap 1 complete!');
    $('.cells').innerHTML = STAGES.map(
        (s, i) => `<i class="${stageDone(s) ? 'on' : i === si ? 'now' : ''}" title="${s.name} · ${s.topic}"></i>`,
    ).join('');
    const doneCount = STAGES.filter(stageDone).length;
    $('.tip').innerHTML =
        `${percent()}% ${tr('완료', 'done')} <span>(${doneCount}/${STAGES.length}${stage ? tr(' · 지금: ', ' · now: ') + stage.name : ''})</span>`;
    if (q)
        $('.goal').textContent = tr(
            `📍 ${NPCS[q.npc].name}에게 말 걸기 · ${q.title}`,
            `📍 Talk to ${NPCS[q.npc].name} · ${q.title}`,
        );
    else if (stage)
        $('.goal').textContent = tr(
            `🚧 ${stage.name}(${stage.topic})은 다음 업데이트에서 열려요`,
            `🚧 ${stage.name} (${stage.topic}) opens in a future update`,
        );
    else $('.goal').textContent = tr('🎉 1회차 완료!', '🎉 Lap 1 complete!');
    updateGoto();
}

let toastTimer; // 알림을 지우는 타이머
/** 화면 위쪽 가운데에 알림을 ms 동안 띄운다. */
function toast(html, ms = 3200) {
    const t = $('.toast');
    t.innerHTML = html;
    t.classList.remove('hide');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => t.classList.add('hide'), ms);
}

// ---------- 대화창 ----------
/** 김사원의 모습 (대화창 초상화용, 3D 김사원과 같은 색). */
const PLAYER_LOOK = store.look;

// 대화창 키보드: Enter·Space 로 선택된 버튼을 누르고(처음엔 기본 버튼), 방향키로 선택을 옮기고, Esc 로 닫는다.
// 키 안내는 한 번씩만 보여 준다 (그다음엔 다들 아니까): "Enter 누르기"는 맨 처음 대화창에서,
// "←→ 고르기"는 선택지가 처음 나오는 대화창에서 (QA 2026-11-18: 첫 대화엔 선택지가 없어서 고르기 안내가 안 보였음).
const KEY_HINT = 'cotudy.keyhint'; // "Enter 누르기" 안내를 이미 봤는지 저장하는 키
const KEY_HINT_CHOOSE = 'cotudy.keyhint.choose'; // "←→ 고르기" 안내를 이미 봤는지 저장하는 키
/** 그 안내를 이미 봤는지 (저장이 막힌 브라우저면 봤다고 친다). */
const keyHintSeen = (key = KEY_HINT) => {
    try {
        return !!localStorage.getItem(key);
    } catch {
        return true;
    }
};
/** 그 안내를 봤다고 저장한다. */
const markKeyHint = (key = KEY_HINT) => {
    try {
        localStorage.setItem(key, '1');
    } catch {
        /* ignore */
    }
};

/**
 * 대화창을 띄우고 버튼을 누를 때까지 기다린다. 고른 버튼의 value 를 돌려준다 (Esc 로 닫으면 null).
 * who: 말하는 사람 / lines: 대사들 (글자, 또는 여러 사람 대화면 { who, text, me, look }) / buttons: 마지막 대사의 버튼들
 * look: 초상화 모습. 대사가 여러 개면 "다음"으로 넘기고, 마지막 대사에서 buttons 를 보여 준다 (없으면 "닫기").
 */
function dialog({ who, lines, buttons, look }) {
    return new Promise((resolve) => {
        busy = true;
        world.setFrozen(true);
        const d = document.createElement('div');
        d.className = 'dlg';
        app.appendChild(d);
        let i = 0;
        let els = [],
            sel = 0;
        const hint = !TOUCH && !keyHintSeen(); // 이 대화창에서 "Enter 누르기"를 보여 줄지
        const hintChoose = !TOUCH && !keyHintSeen(KEY_HINT_CHOOSE); // 선택지가 나오면 "←→ 고르기"를 보여 줄지
        let choseShown = false; // 이 대화창에서 "←→ 고르기"를 실제로 보여 줬는지
        const finish = (v) => {
            d.remove();
            removeEventListener('keydown', onKey, true);
            busy = false;
            world.setFrozen(false);
            if (hint) markKeyHint();
            if (choseShown) markKeyHint(KEY_HINT_CHOOSE);
            resolve(v);
        };
        // 선택된 버튼이 초록: 방향키로 옮기면 초록이 따라간다
        const select = (k) => {
            if (!els.length) return;
            sel = (k + els.length) % els.length;
            els.forEach((el, j) => el.classList.toggle('go', j === sel));
        };
        const draw = () => {
            const last = i === lines.length - 1;
            // 대사 하나는 글자(who 가 말함) 또는 여러 사람 대화용 { who, text, me }
            const line = lines[i];
            const text = typeof line === 'string' ? line : line.text;
            const speaker = typeof line === 'string' ? who : line.who;
            const face = typeof line === 'string' ? look : line.look;
            d.classList.toggle('has-face', !!face);
            d.innerHTML = `${face ? `<div class="portrait">${faceHTML(face, { bust: true })}</div>` : ''}<div class="who${line?.me ? ' me' : ''}">${speaker}</div><p>${text}</p><div class="btns"></div>`;
            const btns = d.querySelector('.btns');
            const list = last
                ? buttons || [{ label: tr('닫기', 'Close'), value: null, primary: true }]
                : [{ label: tr('다음', 'Next'), value: '__next', primary: true }];
            els = [];
            const many = list.filter((b) => !b.disabled).length > 1; // 고를 버튼이 둘 이상인지
            const showChoose = many && hintChoose;
            if (showChoose) choseShown = true;
            if (hint || showChoose)
                btns.insertAdjacentHTML(
                    'beforeend',
                    `<span class="keyhint">${showChoose ? tr('<kbd>←</kbd><kbd>→</kbd> 고르기 · ', '<kbd>←</kbd><kbd>→</kbd> choose · ') : ''}<kbd>Enter</kbd> ${tr('누르기', 'press')}</span>`,
                );
            list.forEach((b) => {
                const el = document.createElement('button');
                el.className = 'btn' + (b.primary ? ' go' : '');
                el.disabled = !!b.disabled;
                el.innerHTML = b.html || b.label;
                el.addEventListener('click', () => (b.value === '__next' ? (i++, draw()) : finish(b.value)));
                btns.appendChild(el);
                if (!b.disabled) els.push(el);
                if (b.primary) el.dataset.primary = '1';
            });
            if (!TOUCH)
                select(
                    Math.max(
                        0,
                        els.findIndex((el) => el.dataset.primary),
                    ),
                );
        };
        const onKey = (e) => {
            const k = e.key;
            if (k === 'Enter' || k === ' ') {
                e.preventDefault();
                e.stopImmediatePropagation();
                (els[sel] || d.querySelector('[data-primary]'))?.click();
            } else if (k === 'ArrowLeft' || k === 'ArrowUp') {
                e.preventDefault();
                e.stopImmediatePropagation();
                select(sel - 1);
            } else if (k === 'ArrowRight' || k === 'ArrowDown') {
                e.preventDefault();
                e.stopImmediatePropagation();
                select(sel + 1);
            } else if (k === 'Escape') {
                e.stopImmediatePropagation();
                finish(null);
            }
        };
        setTimeout(() => addEventListener('keydown', onKey, true), 150);
        draw();
    });
}

/**
 * Enter 로 무언가를 썼을 때 (world 의 onInteract). id 가 사람이면 퀘스트 부탁 / 다시 풀기 / 잡담,
 * 'spot:…' 이면 사물, 'hq…' 면 본사 직원.
 */
async function talkTo(id) {
    if (busy || touring) return;
    if (id === 'spot:retry') return retryBoard();
    if (id.startsWith('spot:')) return useObject(OBJECT_SPOTS.find((o) => 'spot:' + o.id === id));
    if (id.startsWith('hq')) return hqTalk(id);
    const npc = NPCS[id];
    const who = whoOf(npc);
    const look = npc.look;
    const q = nextQuest();
    if (q && q.npc === id) return offerQuest(q);
    // 다시 풀기: 이미 끝낸 퀘스트가 있는 사람에게 말을 걸면 골라서 다시 풀 수 있다
    const doneHere = quests.filter((x) => x.npc === id && store.isDone(x.id));
    const li = Math.floor(Math.random() * npc.talk.length);
    const line = npc.talk[li];
    if (doneHere.length) {
        const v = await dialog({
            who,
            look,
            lines: [line],
            buttons: [
                { label: tr('다시 풀어 보기', 'Play again'), value: 'replay' },
                { label: tr('닫기', 'Close'), value: null, primary: true },
            ],
        });
        if (v === 'replay') {
            const pick = await dialog({
                who,
                look,
                lines: [tr('어떤 걸 다시 해 볼래요?', 'Which one do you want to redo?')],
                buttons: [
                    ...doneHere.map((x) => ({
                        label: `${x.title} ${store.stars(x.id) ? '★'.repeat(store.stars(x.id)) : tr('· 면접 통과', '· passed in interview')}`,
                        value: x.id,
                    })),
                    { label: tr('닫기', 'Close'), value: null, primary: true },
                ],
            });
            const rq = quests.find((x) => x.id === pick);
            if (rq) await startQuest(rq);
        } else if (li === npc.coffeeLine) await serveCoffee(id);
        return;
    }
    // 이 사람에게 아직(또는 원래) 퀘스트가 없으면: 평소 잡담
    await dialog({ who, look, lines: [line] });
    if (li === npc.coffeeLine) await serveCoffee(id);
}

// "커피 한잔해요"는 진짜 커피: 센터장이 방의 커피 테이블에서 컵을 가져와 건네주고, 김사원이 한동안 들고 마신다.
const COFFEE_TABLE = { x: 16.7, z: 16.6 }, // 센터장실 커피 테이블 자리
    COFFEE_LOOK = { x: 15.6, z: 16.6 };
/** 센터장(id)이 커피를 타서 김사원에게 건네준다. */
async function serveCoffee(id) {
    const from = world.npcPos(id);
    if (!from) return;
    const back = { x: from.x, z: from.z };
    // 책상 뒤에 있으면 책상을 뚫고 가지 않고 오른쪽 끝으로 돌아간다
    const aroundDesk =
        back.z > 19
            ? [
                  { x: 19.4, z: back.z },
                  { x: 19.4, z: 18.4 },
              ]
            : [];
    busy = true;
    await world.walkNpc(id, [...aroundDesk, COFFEE_TABLE], { speed: 2.2, face: COFFEE_LOOK });
    await wait(900); // 커피 믹스 젓는 중
    await world.walkNpc(id, [...aroundDesk.reverse(), back], { speed: 2.2 });
    giveCup('#6f4e37', 40000);
    toast(tr('☕ 믹스커피를 받았어요', '☕ You got a cup of coffee'), 2500);
    busy = false;
    await speak([
        { who: id, text: tr('자, 믹스커피예요. 뜨거우니까 조심하고요.', "Here, instant coffee. Careful, it's hot.") },
        { who: 'me', text: tr('감사합니다! 잘 마실게요.', "Thank you! I'll enjoy it.") },
    ]);
    world.freeNpc(id);
}

/** 퀘스트를 준 사람이 q 를 부탁한다. lead 대사가 먼저 나온다 (예: "고마워요, 그리고 하나 더…"). "시작"을 고르면 미션 창. */
async function offerQuest(q, lead = []) {
    const npc = NPCS[q.npc];
    const choice = await dialog({
        who: whoOf(npc),
        look: npc.look,
        lines: [...lead, ...q.request],
        buttons: [
            { label: tr('나중에 할게요', 'Maybe later'), value: 'later' },
            { label: tr('퀘스트 시작', 'Start quest'), value: 'start', primary: true },
        ],
    });
    if (choice === 'start') await startQuest(q);
}

/** 미션을 끝낸 직후, 같은 사람이 다음 일도 줄 때 하는 연결 대사들 [한국어, 영어]. */
const CHAIN_LINES = [
    [
        '덕분에 해결됐어요! 그런데 하나만 더 부탁해도 될까요?',
        'That did it, thanks! Could I ask you for one more thing?',
    ],
    ['고마워요! 온 김에 다음 일도 좀 봐 줄래요?', "Thank you! While you're here, could you look at the next job too?"],
    ['역시 김사원님! 이어서 이것도 부탁해요.', "Knew I could count on you, Kim! Here's the next one."],
    ['일이 확 줄었어요! 그럼 다음 일은 이거예요~', "That saved me so much work! So, here's the next job~"],
];

/** 퀘스트 q 의 미션 창을 열고, 끝나면 별을 저장하고 다음 퀘스트로 안내한다 (같은 사람이면 대화를 이어 간다). */
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
    setTimeout(checkHqVisit, 2500);
    const after = currentStageIndex();
    const nq = nextQuest();
    // 같은 사람이 다음 일도 줌: 다시 Enter 를 누르게 하지 않고 대화를 이어 간다
    if (wasNext?.id === q.id && nq && nq.npc === q.npc) {
        if (after > before) toast(tr(`✅ ${STAGES[before].name} 완료!`, `✅ ${STAGES[before].name} done!`), 3000);
        const [ko, en] = CHAIN_LINES[Math.floor(Math.random() * CHAIN_LINES.length)];
        busy = true; // 대화창이 뜨기 전에 다른 말 걸기가 끼어들지 않게
        await new Promise((r) => setTimeout(r, 250));
        return offerQuest(nq, [tr(ko, en)]);
    }
    if (after > before) {
        const done = STAGES[before];
        const next = STAGES[after];
        toast(
            tr(
                `✅ ${done.name} 완료! ${next ? `다음: ${next.name}` : ''}`,
                `✅ ${done.name} done! ${next ? `Next: ${next.name}` : ''}`,
            ),
            4000,
        );
        if (nq && nq.npc !== q.npc) {
            await world.showNpc(nq.npc);
            toast(
                tr(
                    `📍 ${NPCS[nq.npc].name}에게 가 보세요! 주황 화살표가 방향을 알려 줘요`,
                    `📍 Go see ${NPCS[nq.npc].name}! The orange arrow shows the way`,
                ),
                4500,
            );
        } else if (!nq && next)
            toast(
                tr(
                    `🎉 지금 만들어 둔 퀘스트는 여기까지예요! ${next.name}(${next.topic})은 다음 업데이트에서 열려요`,
                    `🎉 That's all the quests for now! ${next.name} (${next.topic}) opens in a future update`,
                ),
                6000,
            );
    } else if (nq && nq !== wasNext) {
        toast(
            tr(
                `📍 ${NPCS[nq.npc].name}님의 다음 퀘스트: ${nq.title}`,
                `📍 ${NPCS[nq.npc].name}'s next quest: ${nq.title}`,
            ),
            3500,
        );
    }
}

// ---------- 코딩 언어 고르기 (설정에서 언어 바꾸기) ----------
/** 코딩 언어를 고른다. 언어마다 진행이 따로라서, 다른 언어를 고르면 페이지를 새로고침한다. */
async function chooseLanguage() {
    const v = await dialog({
        who: whoOf(NPCS.han),
        look: NPCS.han.look,
        lines: store.lang
            ? [
                  tr(
                      '다른 언어로 일해 볼래요? 언어마다 진행 상황은 따로 저장돼요.',
                      'Want to work in another language? Progress is saved separately for each language.',
                  ),
              ]
            : [
                  tr(
                      '김사원님, 물류팀 입사를 축하해요! 저는 인사팀 한지원이에요.',
                      "Kim, welcome to the logistics team! I'm Jiwon from HR.",
                  ),
                  tr(
                      '우리 센터는 전산 일을 코드로 해요. 어떤 언어로 일하실 거예요?',
                      'Here at the center we do our system work in code. Which language will you work in?',
                  ),
              ],
        buttons: LANGS.map((l) => {
            const p = l.quests ? percent(l.id) : 0;
            const progress = p > 0 ? `<span class="lang-pct">${p}%</span>` : '';
            return {
                html: `${l.icon}${l.name}${progress}${store.lang === l.id ? ' ✓' : ''}`,
                value: l.id,
                disabled: !l.quests,
                primary: l.id === (store.lang || 'java'),
            };
        }),
    });
    const first = !store.lang;
    if (!first && (!v || v === store.lang)) return; // 닫았거나 같은 언어를 골랐으면 그대로
    if (!first) {
        store.setLang(v);
        location.reload();
        return;
    } // 다른 언어 = 다른 진행과 위치
    applyLang(v || 'java');
    refresh();
    if (!store.toured) {
        runTour();
        return;
    }
    toast(
        TOUCH
            ? tr(
                  '👆 바닥을 누른 채 끌면 따라 걸어요. 사람 옆에서 오른쪽 아래 버튼(또는 그 사람)을 누르면 말을 걸어요',
                  '👆 Hold and drag on the floor to walk. Next to someone, tap the button at the bottom right (or them) to talk',
              )
            : tr(
                  '⌨️ 방향키(또는 WASD)로 움직여요. 사람 앞에서 <kbd>Enter</kbd> 를 누르면 말을 걸어요',
                  '⌨️ Move with the arrow keys (or WASD). Press <kbd>Enter</kbd> next to someone to talk',
              ),
        6000,
    );
}

/** 아직 언어가 없는 캐릭터의 언어를 정하고, 그 언어의 실행기를 미리 불러오기 시작한다. */
function applyLang(id) {
    store.setLang(id);
    quests = langInfo().quests;
    STAGES = stagesFor(id);
    if (store.lang === 'javascript') $('.java-state').textContent = '⚡ JavaScript';
    if (store.lang === 'java') warmUpJava();
    if (store.lang === 'python') {
        $('.java-state').textContent = tr('🐍 파이썬 준비 중…', '🐍 Getting Python ready…');
        warmUpPython().then(() => {
            $('.java-state').textContent = tr('🐍 파이썬 준비 완료', '🐍 Python ready');
        });
    }
}

// ---------- 입사: 본사 면접 → 합격 메일 → 첫 출근 (PLAN.md §8, 진행은 ui/hire.js) ----------
const INTERVIEWS = { java: JAVA_IV, javascript: JS_IV, python: PY_IV }; // 언어별 면접 종합 문제
/** 새 캐릭터의 입사 과정을 진행하고, 결과(시작 단계, 아는 개념, 면접 기록)를 저장한 뒤 첫 출근 투어를 시작한다. */
async function startHiring() {
    interviewing = true;
    const { start, known, items } = await runHiring({
        app,
        dialog,
        npcs: NPCS,
        whoOf,
        langs: LANGS,
        pickLang: (id) => applyLang(id),
        stagesFor,
        questsFor: (id) => LANGS.find((l) => l.id === id)?.quests || [],
        interviewFor: (id) => INTERVIEWS[id],
        run: (id, code) => RUNTIMES[id].run(code),
    });
    store.setPlacement(start);
    store.setInterview({ lang: store.lang, at: Date.now(), items });
    // 면접으로 아는 게 확인된 개념은 끝낸 것으로: "면접 통과" (다시 풀기 전까지 별 0개)
    for (const id of known) if (!store.isDone(id)) store.complete(id, 0);
    interviewing = false;
    refresh();
    runTour();
}

// ---------- 캐릭터 (캐릭터마다 저장이 따로) ----------
// 캐릭터가 이미 있으면 페이지를 열 때(탭마다 한 번) 고르는 창을 띄운다. 다른 언어를 배우려면 새 캐릭터로
// 첫날부터 따로 시작할 수 있게.
const PICKED = 'cotudy.picked'; // 이 탭에서 이미 캐릭터를 골랐는지 (sessionStorage)
/** 이 탭에서 캐릭터를 골랐다고 표시한다. */
const markPicked = () => {
    try {
        sessionStorage.setItem(PICKED, '1');
    } catch {
        /* ignore */
    }
};
/** 이 탭에서 이미 캐릭터를 골랐는지. */
const wasPicked = () => {
    try {
        return !!sessionStorage.getItem(PICKED);
    } catch {
        return true;
    }
};
/** 버튼 안에 넣는 작은 얼굴 HTML. */
const mini = (look) => `<span class="mini-face">${faceHTML(look, { bust: true })}</span>`;
/** 캐릭터 고르기 버튼 글자: "김사원 · ☕ Java 18%". */
function charLabel(c) {
    const l = LANGS.find((x) => x.id === c.lang);
    if (!l) return tr('김사원 · 언어 아직 안 고름', 'Kim · no language yet');
    return `${tr('김사원', 'Kim')} · ${l.icon}${l.name}<span class="lang-pct">${percent(l.id, c.byLang[l.id]?.done || {})}%</span>`;
}
/** 캐릭터 고르기 창: 다른 캐릭터를 고르면 페이지를 새로고침, 「새 캐릭터」면 모습 고르기로. */
async function chooseCharacter() {
    markPicked();
    const list = store.chars;
    const v = await dialog({
        who: tr('출근하기', 'Clock in'),
        lines: [
            tr(
                '누구로 출근할까요? 캐릭터마다 진행 상황이 따로 저장돼요.',
                'Who is clocking in today? Each character has its own saved progress.',
            ),
        ],
        buttons: [
            ...list.map((c) => ({
                html: `${mini(c.look)}${charLabel(c)}`,
                value: c.id,
                primary: c.id === store.charId,
            })),
            ...(list.length < CHAR_LOOKS.length
                ? [{ label: tr('➕ 새 캐릭터', '➕ New character'), value: 'new' }]
                : []),
        ],
    });
    if (v === 'new') return newCharacter();
    if (v && v !== store.charId) {
        store.switchChar(v);
        location.reload();
        return;
    }
    if (!store.toured && (!store.lang || !store.placement)) startHiring();
    else if (!store.toured) runTour();
    else if (!store.lang) chooseLanguage();
}
/** 새 캐릭터 만들기: 모습 6가지 중 하나를 고르면 만들고 새로고침 (그다음 면접부터 시작). */
async function newCharacter() {
    const used = new Set(store.chars.map((c) => c.lookIdx));
    const first = CHAR_LOOKS.findIndex((_, i) => !used.has(i));
    const v = await dialog({
        who: tr('새 캐릭터', 'New character'),
        lines: [
            tr(
                '어떤 모습으로 출근할까요? 새 캐릭터는 첫날부터 시작해요.',
                'How will your new character look? A new character starts from day one.',
            ),
        ],
        buttons: [
            ...CHAR_LOOKS.map((l, i) => ({ html: mini(l), value: String(i), primary: i === first })),
            { label: tr('취소', 'Cancel'), value: null },
        ],
    });
    if (v == null) return chooseCharacter();
    store.newChar(+v);
    location.reload();
}

// ---------- 「바로 가기」 버튼 ----------
// 센터를 가로질러 걸으면 오래 걸리고 휴대폰에선 번거로워서, 가야 할 사람(투어 중 한지원, 다음 퀘스트를 줄 사람,
// 방문한 본사 직원) 옆으로 한 번에 갈 수 있게 한다.
/** 지금 「바로 가기」가 데려갈 사람 id (없으면 null). */
function gotoTarget() {
    if (touring) return 'han';
    return nextQuest()?.npc || hqVisitor;
}
/** 「바로 가기」 버튼 글자와 보이기를 지금 상황에 맞춘다. */
function updateGoto() {
    const id = gotoTarget();
    const btn = $('.goto-btn');
    btn.classList.toggle('hide', !id);
    if (id) btn.innerHTML = tr(`▶ ${NPCS[id].name}에게 바로 가기`, `▶ Go to ${NPCS[id].name}`);
}
$('.goto-btn').addEventListener('click', () => {
    if (busy) return;
    const id = gotoTarget();
    if (!id) return;
    if (touring) world.skipWalk('han');
    world.teleportTo(id);
});

// ---------- 첫 출근 투어 ----------
/** 고른 언어로 코드를 실행할 준비가 됐는지 (자바는 처음 받는 데 오래 걸린다). */
function runtimeReady() {
    return Promise.race([
        RUNTIMES[store.lang || 'java'].warm().then(
            () => true,
            () => true,
        ),
        new Promise((r) => setTimeout(() => r(false), 50)),
    ]);
}
/** 김사원 이름표 글자. */
const ME = () => tr('물류팀 김사원', 'Kim · Logistics');
/** 투어 대사 묶음을 대화창으로 보여 준다 (l.who === 'me' 면 김사원이 말함). */
const speak = (lines) =>
    dialog({
        who: '',
        lines: lines.map((l) => ({
            text: l.text,
            me: l.who === 'me',
            who: l.who === 'me' ? ME() : whoOf(NPCS[l.who]),
            look: l.who === 'me' ? PLAYER_LOOK : NPCS[l.who].look,
        })),
    });

/** ms 밀리초 기다린다. */
const wait = (ms) => new Promise((r) => setTimeout(r, ms));
/** 투어 마지막: 센터장이 커피 테이블에 다녀와서 김사원과 한지원에게 컵을 건넨다. */
async function coffeeBreak(stop) {
    const c = stop.coffee;
    busy = true; // 장면 중에 다른 사람에게 말 걸기를 막는다 (멈춤을 쓰면 센터장도 멈춰서 busy 로)
    await world.walkNpc(stop.npc, [c.table], { speed: 2, face: c.look });
    await wait(900); // 커피 믹스 젓는 중
    await world.walkNpc(stop.npc, [stop.meet], { speed: 2 });
    world.holdCup('me', true);
    world.holdCup('han', true);
    toast(tr('☕ 믹스커피를 받았어요', '☕ You got a cup of coffee'), 2500);
    await wait(500);
    busy = false;
    await speak(c.lines);
}

/**
 * 첫 출근 투어: 한지원이 앞장서서 이대리·박주임·강군·문센터장에게 차례로 인사하고(tour.js), 커피를 마신 뒤 끝난다.
 * 투어 동안 자바를 뒤에서 받는다 (기다린다는 말은 하지 않는다). 면접으로 다른 단계에 배치됐으면 그 담당자에게 안내한다.
 */
async function runTour() {
    touring = true;
    // 투어는 로딩 화면이 아니라 첫 출근: "자바 준비 중" 표시는 숨긴다
    $('.java-state').style.visibility = 'hidden';
    world.setQuestMarks([]);
    world.setArrowTarget('han');
    const goal = tr('📍 한지원을 따라가며 인사하기', '📍 Follow Jiwon and say hello');
    $('.goal').textContent = goal;
    updateGoto();
    await speak(TOUR_START);
    toast(
        TOUCH
            ? tr(
                  '👆 바닥을 누른 채 끌면 따라 걸어요. 한지원을 따라가세요',
                  '👆 Hold and drag on the floor to walk. Follow Jiwon',
              )
            : tr('⌨️ 방향키(또는 W A S D)로 한지원을 따라가세요', '⌨️ Follow Jiwon with the arrow keys (or W A S D)'),
        5000,
    );
    for (const stop of TOUR_STOPS) {
        world.walkNpc(stop.npc, [stop.meet], { speed: 2.2, face: stop.path[stop.path.length - 1] });
        await world.walkNpc('han', stop.path, { lead: true });
        await speak(stop.lines);
        if (stop.coffee) await coffeeBreak(stop);
        // 마지막 자리에서는 실행기가 준비될 때까지 커피를 마시며 이야기를 더 한다 (추가 대화는 한 번씩만)
        for (const more of stop.extra || []) {
            if (await runtimeReady()) break;
            await speak(more);
        }
        world.freeNpc(stop.npc);
    }
    const placed =
        store.placement && store.placement !== STAGES[0].id ? STAGES.find((s) => s.id === store.placement) : null;
    await speak(
        placed
            ? [
                  {
                      who: 'han',
                      text: tr(
                          `김사원님은 면접 결과대로 ${placed.name}(${placed.topic})부터 시작해요! ${whoOf(NPCS[placed.npc])}님께 가 보세요. 저는 사무실로 돌아갈게요~`,
                          `Kim, based on your interview you start at ${placed.name} (${placed.topic})! Go see ${whoOf(NPCS[placed.npc])}. I'll head back to the office~`,
                      ),
                  },
              ]
            : TOUR_END.lines,
    );
    await world.walkNpc('han', TOUR_END.path, { lead: true });
    world.freeNpc('han');
    world.holdCup('me', false);
    world.holdCup('han', false);
    touring = false;
    $('.java-state').style.visibility = '';
    store.setToured();
    refresh();
    const q = nextQuest();
    if (q?.npc === 'han') await talkTo('han');
    else if (q)
        toast(
            tr(
                `📍 ${NPCS[q.npc].name}님에게 가 보세요. 위쪽 「바로 가기」로 옆까지 갈 수 있어요`,
                `📍 Go see ${NPCS[q.npc].name}. The "Go there" button at the top takes you right next to them`,
            ),
            6000,
        );
}

// ---------- 본사 직원 방문 ----------
// 본사 직원 셋이 돌아가며 온다: 첫 방문은 첫 출근 7일째 날, 그 뒤로 7일마다, 그날 아무 시간에나
// (그 시간에 게임을 안 하고 있었으면 다음에 들어올 때 와 있다). 직원마다 난이도가 정해져 있고(서다은 하, 백승호 중,
// 차미경 상), 그 직원의 unlock 단계를 끝내야 온다. 방문한 직원은 김사원을 따라다니고, 말을 걸면 이미 끝낸 주제로
// 짧은 코딩테스트를 낸다. 맨 처음 방문 때는 센터장도 불려 온다. 못 푼 문제는 휴게실 재도전 게시판에 붙는다.
// (2026-11-18: 달력 주가 아니라 첫 출근부터 센다. 면접 통과로 앞 단계가 끝나 있어서 첫날부터 오던 문제를 고침)
const HQ_TESTS = { java: JAVA_HQ, javascript: JS_HQ, python: PY_HQ }; // 언어별 본사 코딩테스트 문제
const HQ_IDS = ['hq1', 'hq2', 'hq3']; // 본사 직원 id
const DAY = 24 * 3600 * 1000; // 하루(ms)
const VISIT_EVERY_DAYS = 7; // 며칠마다 오는지
const HQ_DOOR = { x: -17, z: 7.6 }; // 본사 직원이 들어오고 나가는 문 자리
let hqVisitor = null; // 지금 방문 중인 본사 직원 id
/** 그날 0시(ms). */
const dayStart = (ts) => {
    const d = new Date(ts);
    return new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime();
};
/** 지금 언어의 본사 문제들. */
const hqTests = () => HQ_TESTS[store.lang || 'java'];
/** 단계 id 를 끝냈는지. */
const stageIsDone = (id) => {
    const st = STAGES.find((x) => x.id === id);
    return !!st && stageDone(st);
};
/** 올 수 있는 본사 직원들 (unlock 단계를 끝낸 사람). */
const hqAvailable = () => HQ_IDS.filter((id) => stageIsDone(NPCS[id].unlock));

/** 본사 직원이 올 때가 됐는지 확인한다 (30초마다). 다음 방문 시각을 정해 두고, 그 시각이 지났으면 부른다. */
function checkHqVisit() {
    if (hqVisitor || busy || touring || interviewing || !store.lang || !store.toured) return;
    const avail = hqAvailable();
    if (!avail.length) return;
    const h = store.hq;
    const n = (h.visits || 0) + 1; // 기다리는 방문이 몇 번째인지
    if (h.week !== 'v' + n) {
        // n 번째 방문 시각 정하기: 첫 출근 + 7n 일째 날, 9시~18시 사이
        h.week = 'v' + n;
        h.done = false;
        h.at = dayStart(store.firstDay) + n * VISIT_EVERY_DAYS * DAY + (9 + Math.random() * 9) * 3600 * 1000;
        h.who = avail[(h.visits || 0) % avail.length]; // 돌아가며
        store.saveHq();
    }
    if (!h.done && Date.now() >= h.at) hqArrive(avail.includes(h.who) ? h.who : avail[0]);
}

/** 본사 직원 id 가 문으로 들어와 김사원을 따라다니기 시작한다. */
function hqArrive(id) {
    hqVisitor = id;
    world.setNpcHidden(id, false, HQ_DOOR);
    world.followNpc(id, true);
    refresh();
    toast(
        tr(
            `🏢 본사에서 ${NPCS[id].name}님이 왔어요! 말을 걸어 보세요`,
            `🏢 ${NPCS[id].name} from HQ is here! Go say hello`,
        ),
        5000,
    );
}

/** 방문한 본사 직원이 문으로 나가서 사라진다. */
function hqLeave() {
    const id = hqVisitor;
    hqVisitor = null;
    world.followNpc(id, false);
    refresh();
    world.walkNpc(id, [HQ_DOOR], { speed: 4 }).then(() => world.setNpcHidden(id, true));
}

/** 이 난이도의 문제 하나를 고른다: 가장 최근에 끝낸 주제부터, 이미 통과했거나 게시판에 붙은 문제는 빼고. */
function pickHqTest(level) {
    const h = store.hq;
    const open = hqTests().filter((p) => p.level === level && stageIsDone(p.needs));
    const fresh = open.filter((p) => !h.passed.includes(p.id) && !h.failed.includes(p.id));
    const order = (p) => STAGES.findIndex((x) => x.id === p.needs);
    return (fresh.length ? fresh : open).sort((a, b) => order(b) - order(a))[0];
}

/** 본사 문제 p 를 미션 창이 쓰는 퀘스트 모양으로 바꾼다 (직접 쓰기만). */
const hqQuest = (p) => ({
    title: p.title,
    learned: [],
    thanks: tr('정답이에요! 본사에 잘 보고할게요.', "Correct! I'll give HQ a good report."),
    write: {
        prompt: p.prompt,
        starter: p.starter,
        expected: p.expected,
        hints: p.hints,
        solution: p.solution,
        mustInclude: p.mustInclude,
    },
});
/** 문제 p 를 내는 본사 직원 id (난이도로 찾는다). */
const hqOf = (p) => HQ_IDS.find((id) => NPCS[id].level === p.level);
const LEVEL = { 1: tr('하', 'Easy'), 2: tr('중', 'Medium'), 3: tr('상', 'Hard') };

/** 본사 문제 p 를 미션 창(테스트 모드)으로 풀게 한다. 통과하면 true, 못 풀면 게시판에 붙인다. */
async function runHqTest(p) {
    const h = store.hq;
    const npc = NPCS[hqOf(p)];
    busy = true;
    world.setFrozen(true);
    const res = await openMission(app, hqQuest(p), npc, RUNTIMES[store.lang || 'java'], whoOf(npc), { test: true });
    busy = false;
    world.setFrozen(false);
    const passed = !!res;
    h.failed = h.failed.filter((x) => x !== p.id);
    if (passed) {
        if (!h.passed.includes(p.id)) h.passed.push(p.id);
    } else h.failed.push(p.id);
    store.saveHq();
    return passed;
}

// 본사 직원별 대사: 첫 만남, 다시 왔을 때, 문제 난이도 소개
const HQ_LINES = {
    hq1: {
        hello: tr(
            '안녕하세요, 본사에서 나온 서다은이에요. 새로 온 김사원님이죠?',
            "Hello, I'm Seo from HQ. You must be Kim, the new hire?",
        ),
        again: tr('또 왔어요! 이번 주 문제 하나 풀어 볼까요?', "I'm back! Shall we do this week's problem?"),
        level: tr('가볍게 몸 풀기 문제예요.', 'Just a warm-up.'),
    },
    hq2: {
        hello: tr(
            '처음 뵙네요. 본사 백승호입니다. 김사원님 얘기 많이 들었어요.',
            "Nice to meet you. I'm Baek from HQ. I've heard a lot about you, Kim.",
        ),
        again: tr('잘 지냈어요? 오늘도 하나 준비해 왔어요.', 'How have you been? I brought one for you today.'),
        level: tr('이번엔 조금 생각해야 하는 문제예요.', 'This one takes a bit of thinking.'),
    },
    hq3: {
        hello: tr(
            '본사 차미경이에요. 기본이 탄탄한지 보러 왔어요.',
            "I'm Cha from HQ. I'm here to see if your basics are solid.",
        ),
        again: tr('왔어요. 오늘 것도 만만치 않을 거예요.', "I'm here. Today's won't be easy either."),
        level: tr(
            '실무에서 바로 쓰는 수준이에요. 천천히, 정확하게.',
            'This is real work level. Slowly, and precisely.',
        ),
    },
};

/** 본사 직원에게 말을 걸었을 때: 첫 만남이면 인사(첫 방문은 센터장도), 그다음 코딩테스트. 끝나면 돌아간다. */
async function hqTalk(id) {
    const h = store.hq;
    const hq = NPCS[id];
    const look = hq.look;
    const who = whoOf(hq);
    if (hqVisitor !== id || h.done) {
        await dialog({ who, look, lines: [hq.talk[Math.floor(Math.random() * hq.talk.length)]] });
        return;
    }
    const say = (lines) =>
        dialog({
            who: '',
            lines: lines.map(([sid, text]) => ({
                text,
                me: sid === 'me',
                who: sid === 'me' ? ME() : whoOf(NPCS[sid]),
                look: sid === 'me' ? PLAYER_LOOK : NPCS[sid].look,
            })),
        });
    h.metIds ||= [];
    const L = HQ_LINES[id];
    if (!h.met) {
        // 맨 처음 본사 방문: 센터장도 와서 인사한다
        await say([
            [id, L.hello],
            ['me', tr('네! 물류팀 김사원입니다.', "Yes! I'm Kim from the logistics team.")],
            [id, tr('센터장님도 잠깐 뵙고 갈게요. 센터장님~', 'Let me say hi to the director too. Director!')],
        ]);
        const p = world.playerPos;
        await world.walkNpc('moon', [{ x: p.x + 1.6, z: p.z + 0.9 }], { speed: 4.5 });
        await say([
            [
                'moon',
                tr(
                    '아, 본사에서 오셨군요! 김사원님 요즘 아주 잘하고 있어요.',
                    "Ah, you're from HQ! Kim has been doing really well lately.",
                ),
            ],
            [id, tr('그래요? 그럼 실력 한번 볼까요?', "Really? Then let's see what you can do.")],
        ]);
        world.walkNpc('moon', [{ x: 17.6, z: 17 }], { speed: 3 }).then(() => world.freeNpc('moon'));
        h.met = true;
    } else if (!h.metIds.includes(id)) {
        await say([
            [id, L.hello],
            ['me', tr('네! 물류팀 김사원입니다. 잘 부탁드려요!', "Yes! I'm Kim from logistics. Nice to meet you!")],
        ]);
    } else {
        await say([[id, L.again]]);
    }
    if (!h.metIds.includes(id)) h.metIds.push(id);
    store.saveHq();
    const test = pickHqTest(hq.level);
    const v = await dialog({
        who,
        look,
        lines: [`${L.level} ${tr(`문제는 "${test.title}" 이에요.`, `The problem is "${test.title}".`)}`],
        buttons: [
            { label: tr('나중에 할게요', 'Maybe later'), value: null },
            { label: tr('풀어 볼게요', "Let's do it"), value: 'go', primary: true },
        ],
    });
    if (v !== 'go') return;
    const passed = await runHqTest(test);
    h.done = true;
    h.visits = (h.visits || 0) + 1;
    store.saveHq();
    await dialog({
        who,
        look,
        lines: [
            passed
                ? tr('훌륭해요! 다음에 또 들를게요.', "Excellent! I'll drop by again.")
                : tr(
                      '괜찮아요. 휴게실 재도전 게시판에 붙여 둘게요. 언제든 다시 풀어 봐요!',
                      "That's okay. I'll pin it on the break room retry board. Try it again anytime!",
                  ),
        ],
    });
    hqLeave();
}

/** 휴게실 재도전 게시판: 못 푼 본사 문제와 면접 문제 목록. 골라서 다시 푼다. */
async function retryBoard() {
    const h = store.hq;
    const board = tr('재도전 게시판', 'Retry board');
    const tests = hqTests().filter((p) => h.failed.includes(p.id));
    const iv = store.interview?.lang === store.lang ? store.interview.items : [];
    if (!tests.length && !iv.length) {
        await dialog({
            who: board,
            lines: [
                tr(
                    '붙어 있는 문제가 없어요. 본사 직원이 내는 코딩테스트를 못 풀면 여기에 붙어요.',
                    "Nothing pinned here. HQ coding tests you don't pass get pinned here.",
                ),
            ],
        });
        return;
    }
    const missed = iv.filter((x) => !x.right && !x.retried).length;
    const pick = await dialog({
        who: board,
        lines: [tr('다시 풀어 볼 문제를 골라요.', 'Pick a problem to try again.')],
        buttons: [
            ...tests.map((p) => ({ label: `📌 [${LEVEL[p.level]}] ${p.title}`, value: p.id })),
            ...(iv.length
                ? [
                      {
                          label: tr(
                              `🗂️ 면접 문제 (${iv.length}개, 다시 볼 것 ${missed}개)`,
                              `🗂️ Interview questions (${iv.length}, ${missed} to review)`,
                          ),
                          value: '__interview',
                      },
                  ]
                : []),
            { label: tr('닫기', 'Close'), value: null, primary: true },
        ],
    });
    if (pick === '__interview') return interviewReview();
    const p = tests.find((x) => x.id === pick);
    if (!p) return;
    if (await runHqTest(p))
        toast(tr(`✅ "${p.title}" 통과! 게시판에서 뗐어요`, `✅ "${p.title}" passed! Taken off the board`), 4000);
}

/** 면접 문제 다시 보기: 그때 맞혔는지 ✅ / ❌ 로 보여 주고, 골라서 다시 풀면 정답과 설명을 보여 준다. */
async function interviewReview() {
    const rec = store.interview;
    const items = rec.items;
    const board = tr('재도전 게시판 · 면접 문제', 'Retry board · Interview');
    const stageOf = (id) => STAGES.find((x) => x.id === id);
    // 문제 이름: 종합 문제면 그 제목, 개념 확인이면 그 퀘스트 이름, 그리고 문제 종류
    const KIND = {
        predict: tr('출력 맞히기', 'predict the output'),
        bug: tr('버그 찾기', 'find the bug'),
        fill: tr('빈칸', 'fill in'),
    };
    const groupOf = (x) => INTERVIEWS[store.lang].find((g) => g.stage === x.stage);
    const questOf = (x) => quests.find((y) => y.id === x.quest);
    const nameOf = (x) =>
        x.kind === 'combined'
            ? `${groupOf(x)?.title || stageOf(x.stage)?.name} · ${KIND[groupOf(x)?.type || 'predict']}`
            : `${questOf(x)?.title || x.quest} · ${KIND.predict}`;
    const v = await dialog({
        who: board,
        lines: [
            tr(
                '면접에서 풀었던 문제예요. ❌ 는 틀렸거나 모른다고 한 문제예요. 골라서 다시 풀어 봐요.',
                'These are the interview questions. ❌ means missed or "I don\'t know". Pick one to try again.',
            ),
        ],
        buttons: [
            ...items.map((x, i) => ({
                label: `${x.right || x.retried ? '✅' : '❌'} ${i + 1}. ${nameOf(x)}${!x.right && x.retried ? tr(' (다시 풀어 맞힘)', ' (solved later)') : ''}`,
                value: String(i),
            })),
            { label: tr('닫기', 'Close'), value: null, primary: true },
        ],
    });
    if (v == null) return;
    const x = items[+v];
    const st = stageOf(x.stage);
    const q =
        x.kind === 'combined'
            ? groupOf(x)
            : (() => {
                  const qq = questOf(x);
                  return qq && conceptQuestion(qq);
              })();
    if (!q || !st) return;
    busy = true;
    world.setFrozen(true);
    const right = await askQuestion(app, q, +v + 1, `${st.name} · ${nameOf(x)}`, board, (code) =>
        RUNTIMES[store.lang].run(code),
    );
    busy = false;
    world.setFrozen(false);
    if (right && !x.right) {
        x.retried = true;
        store.setInterview(rec);
    }
    const escA = (t) => String(t).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    const answer =
        q.type === 'fill'
            ? tr(
                  `빈칸 정답: <code>${q.solution.map(escA).join('</code>, <code>')}</code>`,
                  `Blank answers: <code>${q.solution.map(escA).join('</code>, <code>')}</code>`,
              )
            : `${tr('정답', 'Answer')}:<pre class="iv-answer">${escA(q.choices[q.answer ?? 0])}</pre>`;
    await dialog({
        who: board,
        lines: right
            ? [tr('정답이에요! 👏', 'Correct! 👏') + (q.explain ? ' ' + q.explain : '')]
            : [tr('아쉬워요.', 'Not quite.') + ' ' + answer + (q.explain ? `<br>${q.explain}` : '')],
    });
    return interviewReview();
}
setInterval(checkHqVisit, 30000);

// ---------- 휴대폰 버튼 (방향 버튼은 예전 방식, 행동 버튼은 Enter 와 같다) ----------
const padMap = { u: [0, -1], d: [0, 1], l: [-1, 0], r: [1, 0] };
for (const [cls, [x, z]] of Object.entries(padMap)) {
    const b = $(`.pad .${cls}`);
    const on = (e) => {
        e.preventDefault();
        world.setPad(x, z);
    };
    const off = () => world.setPad(0, 0);
    b.addEventListener('pointerdown', on);
    b.addEventListener('pointerup', off);
    b.addEventListener('pointerleave', off);
}
$('.pad .act').addEventListener('click', () => dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' })));

// ---------- 설정 메뉴 ----------
$('.menu-btn').addEventListener('click', async () => {
    if (busy) return;
    const v = await dialog({
        who: tr('설정', 'Settings'),
        lines: [
            tr(
                '진행 상황은 이 브라우저에만 저장돼요. 다른 컴퓨터에서 이어 하려면 저장 파일을 받아서 거기서 불러오세요.',
                'Your progress is saved only in this browser. To continue on another computer, download a save file and load it there.',
            ),
        ],
        buttons: [
            { label: tr('👥 캐릭터 바꾸기', '👥 Switch character'), value: 'char' },
            { label: tr('💻 코딩 언어 바꾸기', '💻 Change coding language'), value: 'lang' },
            { label: tr('🌐 화면 언어: English', '🌐 Display language: 한국어'), value: 'ui' },
            { label: tr('💾 저장 파일 받기', '💾 Download save file'), value: 'export' },
            { label: tr('📂 저장 파일 불러오기', '📂 Load save file'), value: 'import' },
            {
                label: tr(
                    `🐞 오류 기록 받기 (${playErrors().length})`,
                    `🐞 Download error log (${playErrors().length})`,
                ),
                value: 'errors',
            },
            { label: tr('진행 초기화', 'Reset progress'), value: 'reset' },
            ...(store.chars.length > 1
                ? [{ label: tr('🗑️ 이 캐릭터 지우기', '🗑️ Delete this character'), value: 'delchar' }]
                : []),
            { label: tr('닫기', 'Close'), value: null, primary: true },
        ],
    });
    if (v === 'char') chooseCharacter();
    if (
        v === 'delchar' &&
        confirm(
            tr(
                '이 캐릭터를 지울까요? 이 캐릭터의 진행 상황이 모두 사라지고 되돌릴 수 없어요.',
                "Delete this character? All of its progress will be gone, and this can't be undone.",
            ),
        )
    ) {
        store.deleteChar();
        markPicked();
        location.reload();
    }
    if (v === 'lang') chooseLanguage();
    if (v === 'ui') setUiLang(UI_LANG === 'en' ? 'ko' : 'en');
    if (v === 'export') exportSave();
    if (v === 'errors') exportErrors();
    if (v === 'import') importSave();
    if (
        v === 'reset' &&
        confirm(
            tr(
                '모든 진행 상황을 지울까요? 되돌릴 수 없어요.\n(지우기 전에 저장 파일을 받아 두면 나중에 불러올 수 있어요)',
                "Delete all progress? This can't be undone.\n(Download a save file first if you might want it back.)",
            ),
        )
    ) {
        store.reset();
        location.reload();
    }
});

/** 저장 파일(JSON)을 내려받는다. */
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
    toast(
        tr(
            '💾 저장 파일을 받았어요. 다른 컴퓨터에서 ⚙️ 설정 → 저장 파일 불러오기로 이어 할 수 있어요',
            '💾 Save file downloaded. On another computer, use ⚙️ Settings → Load save file to continue',
        ),
        5000,
    );
}

/** 쌓인 플레이 오류를 파일로 내려받고 비운다 (맥이 매일 밤 비공개 기록 저장소로 정리한다). */
function exportErrors() {
    const list = playErrors();
    if (!list.length) {
        toast(tr('🐞 기록된 오류가 없어요', '🐞 No errors recorded'), 3000);
        return;
    }
    const d = new Date();
    const p2 = (n) => String(n).padStart(2, '0');
    const stamp = `${d.getFullYear()}${p2(d.getMonth() + 1)}${p2(d.getDate())}-${p2(d.getHours())}${p2(d.getMinutes())}${p2(d.getSeconds())}`;
    const blob = new Blob(
        [JSON.stringify({ app: 'cotudy-errors', version: 1, exportedAt: d.toISOString(), errors: list }, null, 2)],
        { type: 'application/json' },
    );
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `cotudy-errors-${stamp}.json`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(a.href), 1000);
    clearPlayErrors(); // 이제 파일에 들어 있으니 비운다
    toast(
        tr(
            `🐞 오류 ${list.length}개를 파일로 받았어요. 맥의 다운로드 폴더에 있으면 매일 밤 비공개 기록 저장소로 정리돼요`,
            `🐞 Downloaded ${list.length} errors. Files in the Mac's Downloads folder are filed into the private log repo every night`,
        ),
        5000,
    );
}

/** 저장 파일을 골라 지금 저장을 바꾼다. */
function importSave() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json,application/json';
    input.addEventListener('change', async () => {
        const file = input.files?.[0];
        if (!file) return;
        try {
            const text = await file.text();
            if (
                !confirm(
                    tr(
                        '지금 진행 상황을 이 저장 파일로 바꿀까요? 지금 진행은 사라져요.',
                        'Replace your current progress with this save file? Your current progress will be lost.',
                    ),
                )
            )
                return;
            store.importText(text);
            location.reload();
        } catch (e) {
            toast(tr(`⚠️ 불러오지 못했어요: ${e.message}`, `⚠️ Couldn't load it: ${e.message}`), 5000);
        }
    });
    input.click();
}

// ---------- 시작 ----------
// 캐릭터 고르기(이미 있으면) → 면접(새 캐릭터) → 투어(투어 전에 나갔으면) → 언어 고르기 순서로 필요한 것부터 띄운다.
refresh();
setTimeout(checkHqVisit, 4000);
if (!wasPicked() && (store.lang || store.chars.length > 1)) setTimeout(chooseCharacter, 400);
else if (!store.toured && (!store.lang || !store.placement))
    setTimeout(startHiring, 400); // 새로 들어온 사람 (또는 면접 중에 나갔던 사람)
else if (!store.toured)
    setTimeout(runTour, 400); // 합격했지만 첫 출근 투어를 끝내기 전에 나갔던 사람
else if (!store.lang) setTimeout(chooseLanguage, 400);
markPicked();

if ((store.lang || 'java') === 'java') {
    // 처음엔 CheerpJ 서버에서 자바를 받는다. 서버가 느리면 1분 넘게 걸릴 수 있어서, 멈춘 것처럼 보이지 않게 알려 준다.
    let javaReady = false;
    warm.finally(() => {
        javaReady = true;
    });
    setTimeout(() => {
        if (!javaReady) logError('runner', 'Java still not ready after 45s');
    }, 45000);
    setTimeout(() => {
        if (!javaReady)
            $('.java-state').textContent = tr(
                '☕ 자바 서버가 느려요… 1분 넘게 안 되면 새로고침해 주세요',
                '☕ The Java server is slow… if it takes over a minute, reload the page',
            );
    }, 45000);
    warm.then(
        () => {
            $('.java-state').textContent = tr('☕ 자바 준비 완료', '☕ Java ready');
        },
        (e) => {
            logError('runner', 'Java load failed: ' + (e?.message || e));
            $('.java-state').textContent = tr(
                '⚠️ 자바를 불러오지 못했어요 (인터넷 연결 확인)',
                "⚠️ Couldn't load Java (check your internet connection)",
            );
        },
    );
} else if (store.lang === 'python') {
    $('.java-state').textContent = tr('🐍 파이썬 준비 중…', '🐍 Getting Python ready…');
    warmUpPython().then(
        () => {
            $('.java-state').textContent = tr('🐍 파이썬 준비 완료', '🐍 Python ready');
        },
        (e) => {
            logError('runner', 'Python load failed: ' + (e?.message || e));
            $('.java-state').textContent = tr(
                '⚠️ 파이썬을 불러오지 못했어요 (인터넷 연결 확인)',
                "⚠️ Couldn't load Python (check your internet connection)",
            );
        },
    );
} else {
    $('.java-state').textContent = `⚡ ${langInfo().name}`;
}
// 개발용 도우미: 브라우저 콘솔에서 window.cotudy 로 게임 상태를 보고 조종한다 (시험 스크립트도 쓴다)
window.cotudy = {
    codeKey,
    savedOutputs,
    hq: { java: JAVA_HQ, javascript: JS_HQ, python: PY_HQ },
    interview: { java: JAVA_IV, javascript: JS_IV, python: PY_IV },
    hqArrive: (id = 'hq1') => hqArrive(id),
    store,
    refresh,
    world,
    runJava,
    runJs,
    runPython,
    warm,
    talkTo,
    startQuest,
    runTour,
    current: Object.fromEntries(LANGS.map((l) => [l.id, l.quests])),
    quests: {
        java: JAVA_QUESTS,
        javascript: JS_QUESTS,
        python: PY_QUESTS,
        en: { java: JAVA_QUESTS_EN, javascript: JS_QUESTS_EN, python: PY_QUESTS_EN },
    },
};
