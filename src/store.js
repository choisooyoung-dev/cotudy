// 저장 담당. 진행 상황은 브라우저의 localStorage 에 저장된다.
// 캐릭터(저장 칸)마다 저장이 따로 있고, 그 안에서 언어마다 진행이 또 따로 있다.
import { tr } from './i18n.js';
// 캐릭터 목록: cotudy.chars = { current: 'c1', list: [{ id, look, created }] }
// 캐릭터 하나의 저장: cotudy.char.<id> = { lang: 'java', toured, byLang: { java: { done: { 퀘스트id: 별 개수 }, pos: {x,z} } } }

/** 캐릭터가 고를 수 있는 모습들. 캐릭터마다 이 배열의 번호(look)를 저장한다. 0번이 원래 김사원. */
export const LOOKS = [
    { hair: '#5a3825', vest: '#ff9f43', shirt: '#ffffff', pants: '#2d3e66' },
    { hair: '#1e1e1e', vest: '#4fc3f7', shirt: '#ffffff', pants: '#3d4a5c' },
    { hair: '#7b4a2a', vest: '#c792ea', shirt: '#ffffff', pants: '#2d3e66', style: 'long' },
    { hair: '#c49a3a', vest: '#7ed37e', shirt: '#ffffff', pants: '#4a4a4a' },
    { hair: '#3b2a20', vest: '#f48fb1', shirt: '#ffffff', pants: '#2d3e66', style: 'bun' },
    { hair: '#6d4c41', vest: '#ffd54f', shirt: '#ffffff', pants: '#3d4a5c', glasses: true },
];
const LEGACY = 'cotudy.v1'; // 캐릭터 기능이 생기기 전의 저장 하나 (처음 실행 때 c1 로 옮긴다)
const INDEX = 'cotudy.chars'; // 캐릭터 목록이 저장되는 키
const slotKey = (id) => 'cotudy.char.' + id; // 캐릭터 하나의 저장 키 (예: cotudy.char.c1)

/** localStorage 에서 JSON 을 읽는다. 없거나 깨졌으면 null. */
function load(key) {
    try {
        return JSON.parse(localStorage.getItem(key));
    } catch {
        return null;
    }
}
/** localStorage 에 JSON 으로 쓴다. 저장이 막힌 브라우저(사생활 보호 모드 등)에서는 조용히 넘어간다. */
function save(key, v) {
    try {
        localStorage.setItem(key, JSON.stringify(v));
    } catch {
        /* private mode etc. */
    }
}

// ---- 페이지를 열 때 한 번: 캐릭터 목록을 읽고 지금 캐릭터를 정한다 ----
let index = load(INDEX); // 캐릭터 목록 { current, list }
if (!index?.list?.length) {
    // 캐릭터 기능을 처음 쓰는 경우: 예전 저장(있으면)을 첫 캐릭터 c1 로 옮긴다
    index = { current: 'c1', list: [{ id: 'c1', look: 0, created: Date.now() }] };
    const old = load(LEGACY);
    if (old) save(slotKey('c1'), old);
    save(INDEX, index);
}
if (!index.list.some((c) => c.id === index.current)) index.current = index.list[0].id; // 지금 캐릭터가 지워졌으면 첫 캐릭터로
const KEY = slotKey(index.current); // 지금 캐릭터의 저장 키

/** 지금 캐릭터의 저장을 통째로 읽는다. */
function read() {
    return load(KEY) || {};
}
/** 지금 캐릭터의 저장을 통째로 쓴다. */
function write(s) {
    save(KEY, s);
}

let state = read(); // 지금 캐릭터의 저장 (메모리에 들고 있다가 바뀔 때마다 write)
state.byLang ||= {};

/** 지금 언어의 진행 칸 { done, pos, hq } 을 돌려준다. 없으면 만든다. */
function langState() {
    const l = state.lang || 'java';
    state.byLang[l] ||= { done: {}, pos: null };
    return state.byLang[l];
}

/** 게임 어디서나 쓰는 저장 창구. 읽기는 getter, 쓰기는 메서드로 한다. */
export const store = {
    /** 모든 캐릭터 (캐릭터 고르기 화면용): { id, look(모습 객체), lookIdx, lang, byLang, last }. */
    get chars() {
        return index.list.map((c) => {
            const d = c.id === index.current ? state : load(slotKey(c.id)) || {};
            return {
                id: c.id,
                lookIdx: c.look,
                look: LOOKS[c.look] || LOOKS[0],
                lang: d.lang || null,
                byLang: d.byLang || {},
                last: c.last || c.created,
            };
        });
    },
    /** 지금 캐릭터 id (예: 'c1'). */
    get charId() {
        return index.current;
    },
    /** 지금 캐릭터의 모습 객체. */
    get look() {
        return LOOKS[index.list.find((c) => c.id === index.current)?.look] || LOOKS[0];
    },
    /** 빈 캐릭터를 새로 만들고 지금 캐릭터로 정한다 (부른 뒤 페이지를 새로고침한다). */
    newChar(look) {
        const id = 'c' + (Math.max(0, ...index.list.map((c) => +c.id.slice(1) || 0)) + 1);
        index.list.push({ id, look, created: Date.now() });
        index.current = id;
        save(INDEX, index);
        return id;
    },
    /** 다른 캐릭터로 바꾼다 (부른 뒤 페이지를 새로고침한다). */
    switchChar(id) {
        if (!index.list.some((c) => c.id === id)) return;
        index.current = id;
        index.list.find((c) => c.id === id).last = Date.now();
        save(INDEX, index);
    },
    /** 지금 캐릭터를 지우고 다른 캐릭터로 바꾼다. 캐릭터가 하나뿐이면 지우지 않는다. */
    deleteChar() {
        if (index.list.length < 2) return false;
        try {
            localStorage.removeItem(KEY);
        } catch {
            /* ignore */
        }
        index.list = index.list.filter((c) => c.id !== index.current);
        index.current = index.list[0].id;
        save(INDEX, index);
        return true;
    },
    /** 지금 캐릭터의 코딩 언어 ('java' | 'javascript' | 'python'), 아직 안 골랐으면 null. */
    get lang() {
        return state.lang || null;
    },
    /** 코딩 언어를 정한다. */
    setLang(l) {
        state.lang = l;
        langState();
        write(state);
    },
    /** 이 퀘스트를 끝냈는지 (면접 통과로 지운 것도 끝낸 것으로 친다). */
    isDone(qid) {
        return qid in langState().done;
    },
    /** 어떤 언어의 끝낸 퀘스트들 { 퀘스트id: 별 } (언어 고르기 화면의 진행률용). */
    doneOf(lang) {
        return state.byLang[lang]?.done || {};
    },
    /** 이 퀘스트의 별 개수 (0 = 아직 안 했거나 면접 통과). */
    stars(qid) {
        return langState().done[qid] || 0;
    },
    /** 퀘스트를 끝냈다고 기록한다. 별은 더 많은 쪽을 남긴다. */
    complete(qid, stars) {
        const d = langState().done;
        d[qid] = Math.max(d[qid] || 0, stars);
        write(state);
    },
    /** 마지막으로 저장된 김사원 위치 {x, z}. */
    get pos() {
        return langState().pos;
    },
    /** 김사원 위치를 저장한다 (걸어 다니는 동안 1초마다 불린다). */
    savePos(x, z) {
        langState().pos = { x: +x.toFixed(2), z: +z.toFixed(2) };
        write(state);
    },
    /** 지금 언어의 본사 직원 방문 상태: { week(몇 번째 방문 예정인지), at(올 시각), done, failed: [문제id], passed: [문제id] }. */
    get hq() {
        const l = langState();
        l.hq ||= { week: '', at: 0, done: false, failed: [], passed: [] };
        return l.hq;
    },
    /** store.hq 를 고친 뒤 저장한다. */
    saveHq() {
        write(state);
    },
    /** 본사 면접에서 낸 문제와 맞혔는지: { lang, at, items: [{ kind, stage, quest?, right, retried? }] }. */
    get interview() {
        return state.interview || null;
    },
    /** 면접 기록을 저장한다. */
    setInterview(v) {
        state.interview = v;
        write(state);
    },
    /** 면접 결과로 시작한 단계 id. 면접을 안 본(예전) 캐릭터는 null. */
    get placement() {
        return state.placement || null;
    },
    /** 면접 결과 단계를 저장한다. */
    setPlacement(stage) {
        state.placement = stage;
        write(state);
    },
    /** 첫 출근 투어(팀에 인사하기)를 한 번 했는지. */
    get toured() {
        return !!state.toured;
    },
    /** 투어를 끝냈다고 기록한다. 첫 출근 날짜도 이때 정해진다. */
    setToured() {
        state.toured = true;
        state.firstDay ||= Date.now();
        write(state);
    },
    /** 첫 출근 날짜(ms). 예전 저장은 처음 물을 때 "지금"으로 정한다. 본사 직원 방문 날짜의 기준이다. */
    get firstDay() {
        if (!state.firstDay && state.toured) {
            state.firstDay = Date.now();
            write(state);
        }
        return state.firstDay || null;
    },
    /** 지금 캐릭터의 진행을 모두 지운다. */
    reset() {
        state = { byLang: {} };
        write(state);
    },

    /** 저장 전체를 JSON 글자로 (설정의 "저장 파일 받기" 버튼용). */
    exportText() {
        return JSON.stringify({ app: 'cotudy', version: 1, savedAt: new Date().toISOString(), data: state }, null, 2);
    },
    /** 받아 둔 저장 파일로 지금 저장을 바꾼다. cotudy 저장 파일이 아니면 한국어 메시지로 에러를 던진다. */
    importText(text) {
        let obj;
        try {
            obj = JSON.parse(text);
        } catch {
            throw new Error(tr('JSON 파일이 아니에요.', 'This is not a JSON file.'));
        }
        const data = obj?.app === 'cotudy' ? obj.data : null;
        if (!data || typeof data.byLang !== 'object')
            throw new Error(tr('cotudy 저장 파일이 아니에요.', 'This is not a cotudy save file.'));
        for (const l of Object.values(data.byLang)) {
            if (typeof l?.done !== 'object')
                throw new Error(tr('저장 파일 내용이 깨졌어요.', 'The save file is damaged.'));
        }
        state = data;
        write(state);
        return obj.savedAt || null;
    },
};
