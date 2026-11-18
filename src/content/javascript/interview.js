// HQ job interview (JavaScript): one combined question per stage (see ../stages.js), in stage order.
// Right → every concept (quest) of that stage counts as known. Wrong or "I don't know" → each quest's own
// predict question checks its concept one by one. Two stages in a row with nothing known end the interview.
// Types: predict (choices[0] is right), bug (choices[0] is right; errorLine = the line that throws, or
// output = what the buggy code prints), fill ({{n}} blanks, graded by running against `expected`).
// Every answer was checked by running the code (scripts/daily-check.mjs checks them daily). See PLAN.md §8.
import { tr as t } from '../../i18n.js';

export const INTERVIEW = [
  {
    stage: 'office', type: 'bug', errorLine: 4,
    code: `// ${t('출고 메모', 'shipping note')}
console.log("${t('박스 3개', '3 boxes')}")
console.log("${t('테이프 1개', '1 tape')}");
consol.log("${t('송장 2장', '2 labels')}");`,
    choices: [t('4번째 줄: console 철자가 틀렸어요', 'Line 4: console is misspelled'), t('2번째 줄: 끝에 ; 가 없어서 에러예요', 'Line 2: no ; at the end, so it errors'), t('1번째 줄: 주석은 맨 위에 쓸 수 없어요', 'Line 1: a comment can\'t go at the top'), t('틀린 곳이 없어요', 'Nothing is wrong')],
  },
  {
    stage: 'receiving', type: 'predict',
    code: `const qty = "12";
let total = qty * 2;
total += "${t('개', ' pcs')}";
console.log(total, typeof qty);`,
    choices: [t('24개 string', '24 pcs string'), t('1212개 string', '1212 pcs string'), t('24개 number', '24 pcs number'), t('NaN개 string', 'NaN pcs string')],
  },
  {
    stage: 'printing', type: 'fill',
    code: `const total = 12000 * 3;
const island = true;
const free = total >= 30000 {{0}} !island;
console.log(free, total {{1}} 7);`,
    blanks: [{ size: 2 }, { size: 2 }], expected: 'false 6', solution: ['&&', '%'],
    prompt: t('섬 지역이 아니면서 3만 원 이상일 때만 무료 배송이에요. 빈칸을 채워 <code>false 6</code> 이 찍히게 하세요.', 'Free shipping only when it\'s 30000 or more AND not an island. Fill the blanks so it prints <code>false 6</code>.'),
  },
  {
    stage: 'picking', type: 'predict',
    code: `const zone = "B";
let floor = 0;
switch (zone) {
  case "A":
    floor = 1;
  case "B":
    floor = 2;
  case "C":
    floor = 3;
    break;
  default:
    floor = 9;
}
console.log(floor);`,
    choices: ['3', '2', '9', '0'],
  },
  {
    stage: 'packing', type: 'predict',
    code: `let out = "";
for (let i = 1; i <= 5; i++) {
  if (i === 2) continue;
  if (i === 4) break;
  out += i;
}
console.log(out);`,
    choices: ['13', '1345', '135', '134'],
  },
  {
    stage: 'shipping', type: 'fill',
    code: `const kgs = [5, 12, 8];
kgs.{{0}}(20);
let max = kgs[0];
for (const kg of kgs) {
  if (kg > max) max = kg;
}
console.log(kgs.{{1}}, max);`,
    blanks: [{ size: 4 }, { size: 6 }], expected: '4 20', solution: ['push', 'length'],
    prompt: t('20kg 박스를 배열 끝에 넣고, 박스 개수와 최대 무게가 <code>4 20</code> 으로 찍히게 하세요.', 'Add a 20kg box to the end, then make it print the box count and the max weight as <code>4 20</code>.'),
  },
  {
    stage: 'loading', type: 'predict',
    code: `const code = "seoul-gangnam-0417";
const parts = code.split("-");
console.log(parts[1].toUpperCase().slice(0, 4) + parts.length);`,
    choices: ['GANG3', 'gang3', 'GANGNAM3', 'GANG2'],
  },
  {
    stage: 'forklift', type: 'bug', output: 'undefined',
    code: `function totalKg(list) {
  let sum = 0;
  for (let i = 0; i < list.length; i++) {
    sum += list[i];
  }
}
console.log(totalKg([3, 4]));`,
    prompt: t('7 이 찍혀야 하는데 이상한 값이 찍혀요. 무엇이 문제일까요?', 'It should print 7 but prints something odd. What\'s wrong?'),
    choices: [t('return sum; 이 없어서 undefined 가 찍혀요', 'There\'s no return sum;, so it prints undefined'), t('let sum 을 const sum 으로 바꿔야 해요', 'let sum must be const sum'), t('i <= list.length 로 바꿔야 해요', 'It must be i <= list.length'), t('틀린 곳이 없어요. 7 이 찍혀요', 'Nothing\'s wrong. It prints 7')],
  },
  {
    stage: 'parttime', type: 'predict',
    code: `const stock = { ${t('립밤', 'balm')}: 3 };
stock["${t('토너', 'toner')}"] = 5;
stock.${t('립밤', 'balm')} += 2;
let names = "";
for (const k in stock) names += k;
console.log(names, "${t('토너', 'toner')}" in stock, stock.${t('쿠션', 'cushion')});`,
    choices: [t('립밤토너 true undefined', 'balmtoner true undefined'), t('립밤토너 true 0', 'balmtoner true 0'), t('토너립밤 false undefined', 'tonerbalm false undefined'), t('립밤 true undefined', 'balm true undefined')],
  },
  {
    stage: 'rest', type: 'predict',
    code: `class Box {
  constructor(kg) {
    if (kg <= 0) throw new Error("${t('무게 오류', 'bad weight')}");
    this.kg = kg;
  }
}
const list = [];
for (const kg of [3, -1, 5]) {
  try {
    list.push(new Box(kg));
  } catch (e) {
    console.log(e.message);
  }
}
console.log(list.length);`,
    choices: [t('무게 오류\n2', 'bad weight\n2'), t('무게 오류\n3', 'bad weight\n3'), '2', t('무게 오류', 'bad weight')],
  },
  {
    stage: 'js-fn', type: 'predict',
    code: `function make() {
  let n = 0;
  return () => ++n;
}
const a = make();
const b = a;
a();
b();
console.log(a(), make()());`,
    choices: ['3 1', '1 1', '2 1', '3 3'],
  },
  {
    stage: 'js-array', type: 'fill',
    code: `const orders = [
  { id: "A", kg: 4 },
  { id: "B", kg: 11 },
  { id: "C", kg: 15 },
];
const total = orders
  .{{0}}((o) => o.kg > 10)
  .{{1}}((sum, o) => sum + o.kg, 0);
console.log(total);`,
    blanks: [{ size: 6 }, { size: 6 }], expected: '26', solution: ['filter', 'reduce'],
    prompt: t('10kg 넘는 주문만 골라 무게를 하나로 더해서 <code>26</code> 이 찍히게 하세요 (배열 메서드 두 개).', 'Pick only the orders over 10kg and add their weights into one value so it prints <code>26</code> (two array methods).'),
  },
  {
    stage: 'js-data', type: 'predict',
    code: `const text = '{"id":"A1","qty":2,"tags":["fast"]}';
const { qty, tags } = JSON.parse(text);
const copy = { ...JSON.parse(text), qty: qty + 1 };
console.log(qty, copy.qty, tags.length);`,
    choices: ['2 3 1', '3 3 1', '2 3 4', '2 2 1'],
  },
  {
    stage: 'js-class', type: 'bug', errorLine: 8,
    code: `class Truck {
  constructor(no) {
    this.no = no;
  }
}
class ColdTruck extends Truck {
  constructor(no, temp) {
    this.temp = temp;
    super(no);
  }
}
console.log(new ColdTruck("${t('1호', 'No.1')}", -5).no);`,
    choices: [t('8번째 줄: super(no) 를 부르기 전에 this 를 썼어요', 'Line 8: it uses this before calling super(no)'), t('6번째 줄: extends 가 아니라 implements 를 써야 해요', 'Line 6: it should be implements, not extends'), t('12번째 줄: new 를 빼야 해요', 'Line 12: new must be removed'), t('틀린 곳이 없어요', 'Nothing is wrong')],
  },
  {
    stage: 'js-async', type: 'predict',
    code: `const wait = (ms, v) => new Promise((r) => setTimeout(() => r(v), ms));
async function run() {
  const a = wait(30, "A");
  const b = wait(10, "B");
  console.log(await a, await b);
  console.log("${t('끝', 'end')}");
}
run();
console.log("${t('시작', 'start')}");`,
    choices: [t('시작\nA B\n끝', 'start\nA B\nend'), t('A B\n끝\n시작', 'A B\nend\nstart'), t('시작\nB A\n끝', 'start\nB A\nend'), t('A B\n시작\n끝', 'A B\nstart\nend')],
  },
];
