// Progress lives in the browser's localStorage. Each character (save slot) has its own save, and inside it
// progress is kept separately for each language.
import { tr } from './i18n.js';
// Character list: cotudy.chars = { current: 'c1', list: [{ id, look, created }] }
// One character's save: cotudy.char.<id> = { lang: 'java', toured, byLang: { java: { done: { questId: stars }, pos: {x,z} } } }

/** Looks a character can have (index stored per character). The first one is the original 김사원. */
export const LOOKS = [
  { hair: '#5a3825', vest: '#ff9f43', shirt: '#ffffff', pants: '#2d3e66' },
  { hair: '#1e1e1e', vest: '#4fc3f7', shirt: '#ffffff', pants: '#3d4a5c' },
  { hair: '#7b4a2a', vest: '#c792ea', shirt: '#ffffff', pants: '#2d3e66', style: 'long' },
  { hair: '#c49a3a', vest: '#7ed37e', shirt: '#ffffff', pants: '#4a4a4a' },
  { hair: '#3b2a20', vest: '#f48fb1', shirt: '#ffffff', pants: '#2d3e66', style: 'bun' },
  { hair: '#6d4c41', vest: '#ffd54f', shirt: '#ffffff', pants: '#3d4a5c', glasses: true },
];
const LEGACY = 'cotudy.v1'; // the single save from before characters existed
const INDEX = 'cotudy.chars';
const slotKey = (id) => 'cotudy.char.' + id;

function load(key) {
  try { return JSON.parse(localStorage.getItem(key)); } catch { return null; }
}
function save(key, v) {
  try { localStorage.setItem(key, JSON.stringify(v)); } catch { /* private mode etc. */ }
}

let index = load(INDEX);
if (!index?.list?.length) {
  // first run with characters: the old save (if any) becomes the first character
  index = { current: 'c1', list: [{ id: 'c1', look: 0, created: Date.now() }] };
  const old = load(LEGACY);
  if (old) save(slotKey('c1'), old);
  save(INDEX, index);
}
if (!index.list.some((c) => c.id === index.current)) index.current = index.list[0].id;
const KEY = slotKey(index.current);

function read() { return load(KEY) || {}; }
function write(s) { save(KEY, s); }

let state = read();
state.byLang ||= {};

function langState() {
  const l = state.lang || 'java';
  state.byLang[l] ||= { done: {}, pos: null };
  return state.byLang[l];
}

export const store = {
  /** All characters, with what's needed for the picker: { id, look (object), lookIdx, lang, byLang, last }. */
  get chars() {
    return index.list.map((c) => {
      const d = c.id === index.current ? state : load(slotKey(c.id)) || {};
      return { id: c.id, lookIdx: c.look, look: LOOKS[c.look] || LOOKS[0], lang: d.lang || null, byLang: d.byLang || {}, last: c.last || c.created };
    });
  },
  get charId() { return index.current; },
  get look() { return LOOKS[index.list.find((c) => c.id === index.current)?.look] || LOOKS[0]; },
  /** Makes a new empty character and makes it current (the page reloads after this). */
  newChar(look) {
    const id = 'c' + (Math.max(0, ...index.list.map((c) => +c.id.slice(1) || 0)) + 1);
    index.list.push({ id, look, created: Date.now() });
    index.current = id;
    save(INDEX, index);
    return id;
  },
  switchChar(id) {
    if (!index.list.some((c) => c.id === id)) return;
    index.current = id;
    index.list.find((c) => c.id === id).last = Date.now();
    save(INDEX, index);
  },
  /** Deletes the current character (only when another one is left) and switches to another. */
  deleteChar() {
    if (index.list.length < 2) return false;
    try { localStorage.removeItem(KEY); } catch { /* ignore */ }
    index.list = index.list.filter((c) => c.id !== index.current);
    index.current = index.list[0].id;
    save(INDEX, index);
    return true;
  },
  get lang() { return state.lang || null; },
  setLang(l) { state.lang = l; langState(); write(state); },
  isDone(qid) { return qid in langState().done; },
  /** Finished quests of any language (for showing progress on the language picker). */
  doneOf(lang) { return state.byLang[lang]?.done || {}; },
  stars(qid) { return langState().done[qid] || 0; },
  complete(qid, stars) {
    const d = langState().done;
    d[qid] = Math.max(d[qid] || 0, stars);
    write(state);
  },
  get pos() { return langState().pos; },
  savePos(x, z) { langState().pos = { x: +x.toFixed(2), z: +z.toFixed(2) }; write(state); },
  /** HQ staff visits for the current language: { week, at, done, failed: [ids], passed: [ids] }. */
  get hq() { const l = langState(); l.hq ||= { week: '', at: 0, done: false, failed: [], passed: [] }; return l.hq; },
  saveHq() { write(state); },
  /** True after the first-day tour (greeting the team) has been played once. */
  /** Where the HQ interview placed this character: stage id, or null (no interview yet / older character). */
  get placement() { return state.placement || null; },
  setPlacement(stage) { state.placement = stage; write(state); },
  get toured() { return !!state.toured; },
  setToured() { state.toured = true; write(state); },
  reset() { state = { byLang: {} }; write(state); },

  /** The whole save as a JSON string (for the "저장 파일 받기" button). */
  exportText() {
    return JSON.stringify({ app: 'cotudy', version: 1, savedAt: new Date().toISOString(), data: state }, null, 2);
  },
  /** Replaces the save with an exported file. Throws a Korean message if the file is not a cotudy save. */
  importText(text) {
    let obj;
    try { obj = JSON.parse(text); } catch { throw new Error(tr('JSON 파일이 아니에요.', 'This is not a JSON file.')); }
    const data = obj?.app === 'cotudy' ? obj.data : null;
    if (!data || typeof data.byLang !== 'object') throw new Error(tr('cotudy 저장 파일이 아니에요.', 'This is not a cotudy save file.'));
    for (const l of Object.values(data.byLang)) {
      if (typeof l?.done !== 'object') throw new Error(tr('저장 파일 내용이 깨졌어요.', 'The save file is damaged.'));
    }
    state = data;
    write(state);
    return obj.savedAt || null;
  },
};
