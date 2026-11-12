// One entry per language: how to run code, explain errors, and label the code box.
import { runJava, explainError, warmUpJava } from './java.js';
import { runJs, explainJsError } from './javascript.js';
import { runPython, explainPyError, warmUpPython } from './python.js';

export const RUNTIMES = {
  java: {
    name: 'Java', file: 'Main.java', badge: 'Java 8', badgeColor: '#f89820',
    run: runJava,
    explain: (err) => explainError(err),
    warm: warmUpJava,
    loadingNote: '☕ 자바 준비 중… 처음 한 번은 10~40초쯤 걸려요',
  },
  javascript: {
    name: 'JavaScript', file: 'main.js', badge: 'JavaScript', badgeColor: '#d4b100',
    run: runJs,
    explain: (err, line) => explainJsError(err, line),
    warm: () => Promise.resolve(),
    loadingNote: '',
  },
  python: {
    name: 'Python', file: 'main.py', badge: 'Python 3', badgeColor: '#3776ab',
    run: runPython,
    explain: (err, line) => explainPyError(err, line),
    warm: warmUpPython,
    loadingNote: '🐍 파이썬 준비 중… 처음 한 번은 몇 초 걸려요',
  },
};
