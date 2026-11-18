// Pre-run results: quest code that never changes (concept examples, the fill-in solution, the write solution)
// is run ahead of time by scripts/precompute-outputs.mjs with the game's own runners, and saved in
// src/content/outputs.json. Running exactly that code again in the game returns the saved result at once,
// so Java/Python only load when someone runs code of their own (a different fill-in answer, their own write).
// A code that isn't in the file (new or edited quest) simply runs for real. scripts/daily-check.mjs checks
// every saved result against a real run.
import OUTPUTS from '../content/outputs.json';

/** A short fingerprint of one language's code: FNV-1a 32-bit + length. */
export function codeKey(lang, code) {
  let h = 0x811c9dc5;
  for (let i = 0; i < code.length; i++) {
    h ^= code.charCodeAt(i);
    h = Math.imul(h, 0x01000193) >>> 0;
  }
  return `${lang}:${h.toString(36)}:${code.length}`;
}

export const savedOutputs = OUTPUTS;

/** True when this exact code has a saved result (no need to wait for Java/Python to load). */
export const hasSaved = (lang, code) => !!OUTPUTS[codeKey(lang, code)];

/** Wraps a runner: a saved result comes back right away (ms 0), anything else runs for real. */
export function withSaved(lang, run) {
  return async (code) => {
    const hit = OUTPUTS[codeKey(lang, code)];
    if (hit) return { ...hit, ms: 0, saved: true };
    return run(code);
  };
}
