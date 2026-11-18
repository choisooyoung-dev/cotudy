// Errors that happen while playing (not mistakes in the player's own code): page script errors, failed
// promises, and a runner (Java/Python) that couldn't load. Kept in this browser's localStorage; the player can
// download them from ⚙️ Settings, and scripts/collect-play-errors.mjs files them into the private cotudy-log repo.

const KEY = 'cotudy.errors';
const MAX = 100;

function read() {
    try {
        return JSON.parse(localStorage.getItem(KEY)) || [];
    } catch {
        return [];
    }
}
function write(list) {
    try {
        localStorage.setItem(KEY, JSON.stringify(list.slice(-MAX)));
    } catch {
        /* storage full or blocked */
    }
}

/** kind: 'page' | 'promise' | 'runner'. The same message again only bumps its count. */
export function logError(kind, message, extra = {}) {
    const msg = String(message || '').slice(0, 600);
    if (!msg) return;
    const list = read();
    const same = list.find((e) => e.kind === kind && e.msg === msg);
    const now = new Date().toISOString();
    if (same) {
        same.count = (same.count || 1) + 1;
        same.last = now;
    } else {
        let lang = null;
        try {
            const idx = JSON.parse(localStorage.getItem('cotudy.chars'));
            lang = JSON.parse(localStorage.getItem('cotudy.char.' + idx.current))?.lang || null;
        } catch {
            /* ignore */
        }
        list.push({
            at: now,
            kind,
            msg,
            lang,
            ui: document.documentElement.lang || null,
            ua: navigator.userAgent,
            ...extra,
        });
    }
    write(list);
}

export const playErrors = () => read();
export const clearPlayErrors = () => write([]);

/** Starts listening for errors on the page. */
export function installErrorLog() {
    addEventListener('error', (e) => {
        if (!e.message) return; // a failed <img>/<script> load: no message, the network panel shows it
        const where = e.filename ? ` (${e.filename.split('/').pop()}:${e.lineno}:${e.colno})` : '';
        logError('page', e.message + where, e.error?.stack ? { stack: String(e.error.stack).slice(0, 800) } : {});
    });
    addEventListener('unhandledrejection', (e) => {
        const r = e.reason;
        logError('promise', r?.message || String(r), r?.stack ? { stack: String(r.stack).slice(0, 800) } : {});
    });
}
