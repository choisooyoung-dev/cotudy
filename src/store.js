// Progress lives in the browser's localStorage, separately for each language.
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
  stars(qid) { return langState().done[qid] || 0; },
  complete(qid, stars) {
    const d = langState().done;
    d[qid] = Math.max(d[qid] || 0, stars);
    write(state);
  },
  get pos() { return langState().pos; },
  savePos(x, z) { langState().pos = { x: +x.toFixed(2), z: +z.toFixed(2) }; write(state); },
  reset() { state = { byLang: {} }; write(state); },
};
