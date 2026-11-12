// Progress lives in the browser's localStorage, separately for each language.
import { tr } from './i18n.js';
// Shape: { lang: 'java', byLang: { java: { done: { questId: stars }, pos: {x,z} } } }

const KEY = 'cotudy.v1';

function read() {
  try { return JSON.parse(localStorage.getItem(KEY)) || {}; } catch { return {}; }
}
function write(s) {
  try { localStorage.setItem(KEY, JSON.stringify(s)); } catch { /* private mode etc. */ }
}

let state = read();
state.byLang ||= {};

function langState() {
  const l = state.lang || 'java';
  state.byLang[l] ||= { done: {}, pos: null };
  return state.byLang[l];
}

export const store = {
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
  /** True after the first-day tour (greeting the team) has been played once. */
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
