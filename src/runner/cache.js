// 미리 실행해 둔 결과. 퀘스트에서 바뀌지 않는 코드(개념 예제, 빈칸 정답, 직접 쓰기 정답)는
// scripts/precompute-outputs.mjs 가 게임 실행기로 미리 돌려서 src/content/outputs.json 에 저장해 둔다.
// 게임에서 똑같은 코드를 실행하면 저장된 결과를 바로 돌려주므로, 자바·파이썬은 플레이어가 자기 코드를
// 실행할 때(다른 빈칸 답, 직접 쓴 코드)에만 불러온다. 파일에 없는 코드(새로 만들거나 고친 퀘스트)는 그냥 진짜로
// 실행한다. scripts/daily-check.mjs 가 저장된 결과를 실제 실행과 매일 비교한다.
import OUTPUTS from '../content/outputs.json';

/**
 * 코드 한 조각의 짧은 지문(키). FNV-1a 32비트 해시 + 글자 수. 예: 'java:1abc2de:164'.
 * 저장된 결과(outputs.json)를 찾는 열쇠로 쓴다.
 */
export function codeKey(lang, code) {
    let h = 0x811c9dc5; // FNV 시작값
    for (let i = 0; i < code.length; i++) {
        h ^= code.charCodeAt(i);
        h = Math.imul(h, 0x01000193) >>> 0; // FNV 곱하기 (32비트로 자름)
    }
    return `${lang}:${h.toString(36)}:${code.length}`;
}

/** 저장된 결과 전체 { 키: { ok, phase, output, error, line } } (매일 점검이 비교할 때 쓴다). */
export const savedOutputs = OUTPUTS;

/** 이 코드의 저장된 결과가 있는지 (있으면 자바·파이썬이 준비되기를 기다릴 필요가 없다). */
export const hasSaved = (lang, code) => !!OUTPUTS[codeKey(lang, code)];

/**
 * 실행 함수를 감싼다: 저장된 결과가 있으면 바로 돌려주고(ms 0, saved: true), 없으면 진짜로 실행한다.
 * src/runner/index.js 에서 자바·파이썬 실행기에 씌운다.
 */
export function withSaved(lang, run) {
    return async (code) => {
        const hit = OUTPUTS[codeKey(lang, code)];
        if (hit) return { ...hit, ms: 0, saved: true };
        return run(code);
    };
}
