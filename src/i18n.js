// Display language (Korean / English) for everything shown on screen.
// Saved in localStorage; the first visit follows the browser's language.
// Changing it reloads the page, so every module can read UI_LANG once at load time.

const KEY = 'cotudy.ui';

function detect() {
  try {
    const v = localStorage.getItem(KEY);
    if (v === 'ko' || v === 'en') return v;
  } catch { /* storage blocked */ }
  return (navigator.language || '').toLowerCase().startsWith('ko') ? 'ko' : 'en';
}

export const UI_LANG = detect();
export const isEn = UI_LANG === 'en';

/** Picks the text for the current display language: tr('한국어', 'English'). */
export const tr = (ko, en) => (isEn ? en : ko);

export function setUiLang(v) {
  try { localStorage.setItem(KEY, v); } catch { /* storage blocked */ }
  location.reload();
}

document.documentElement.lang = UI_LANG;
