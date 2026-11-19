// JavaScript quests beyond the basics (after 1회차): scope, closures, callbacks, array methods, destructuring,
// JSON, inheritance, promises, async/await. One quest = one concept. Stages are the JS-only ones in
// ../stages.js. Korean and English side by side via t('한국어', 'English'). Explained only in JavaScript terms.
// Every example, predict, fill and write solution was run for real (scripts/daily-check.mjs checks them daily).
import { tr as t } from '../../i18n.js';

const P = () => t('이 코드를 실행하면 어떻게 찍힐까요?', 'What will this code print?');

export const QUESTS = [
    // ───────────── 지게차 통로 · 최기사 · 스코프 · 클로저 ─────────────
    {
        id: 'js-scope',
        stage: 'js-fn',
        npc: 'choi',
        title: t('운행 횟수 세기', 'Counting trips'),
        request: [
            t(
                '김사원님, 함수로 운행 횟수를 세려는데 숫자가 자꾸 0 이에요.',
                "Kim, I'm counting trips with a function but the number stays at 0.",
            ),
            t(
                '변수가 어디서 보이고 어디서 안 보이는지 같이 봐 줄래요?',
                "Could you help me see where a variable can be seen and where it can't?",
            ),
        ],
        thanks: t(
            '변수를 함수 밖에 두니까 횟수가 제대로 쌓이네요!',
            'With the variable outside the function, the count adds up properly!',
        ),
        concepts: [
            {
                title: t('블록 스코프', 'Block scope'),
                body: t(
                    '<code>let</code>·<code>const</code> 로 만든 변수는 만든 <code>{ }</code> 블록 안에서만 보여요. 블록 안에서 같은 이름을 새로 만들면 바깥 변수와는 <b>다른 변수</b>예요.',
                    'A variable made with <code>let</code> or <code>const</code> only exists inside the <code>{ }</code> block it was made in. Making the same name inside a block makes a <b>different variable</b> from the outer one.',
                ),
                code: t(
                    `const zone = "A";
if (true) {
  const zone = "B"; // 블록 { } 안에서 새로 만든 다른 변수
  console.log("안:", zone); // → 안: B
}
console.log("밖:", zone); // 블록 밖에서는 바깥 zone → 밖: A`,
                    `const zone = "A";
if (true) {
  const zone = "B"; // a different variable made inside the { } block
  console.log("in:", zone); // → in: B
}
console.log("out:", zone); // outside the block it is the outer zone → out: A`,
                ),
            },
            {
                title: t('함수 안의 변수, 밖의 변수', 'Variables inside and outside a function'),
                body: t(
                    '함수 안에서 만든 변수는 함수가 끝나면 사라지고 밖에서는 못 써요. 반대로 함수 <b>밖</b>에 있는 변수는 함수 안에서 읽고 바꿀 수 있어요. 여러 번 불러도 쌓여야 하는 값은 밖에 둬요.',
                    "A variable made inside a function disappears when the function ends and can't be used outside. A variable <b>outside</b> can be read and changed from inside. Keep values that must add up over many calls outside.",
                ),
                code: `let count = 0;
function addTrip() {
  const add = 1;
  count = count + add;
}
addTrip();
addTrip();
console.log(count);`,
                note: t(
                    '여기서 <code>console.log(add)</code> 를 함수 밖에 쓰면 <code>ReferenceError</code> 가 나요. <code>add</code> 는 함수 안에만 있거든요.',
                    'Writing <code>console.log(add)</code> outside the function gives a <code>ReferenceError</code>: <code>add</code> only exists inside it.',
                ),
            },
        ],
        predict: {
            prompt: P(),
            code: `let name = "${t('최기사', 'Choi')}";
function shift() {
  let name = "${t('야간 기사', 'night driver')}";
  return name;
}
console.log(shift());
console.log(name);`,
            choices: [
                t('야간 기사\n최기사', 'night driver\nChoi'),
                t('야간 기사\n야간 기사', 'night driver\nnight driver'),
                t('최기사\n최기사', 'Choi\nChoi'),
                t('최기사\n야간 기사', 'Choi\nnight driver'),
            ],
            answer: 0,
            explain: t(
                '함수 안의 name 은 함수 안에서 새로 만든 다른 변수예요. 바깥 name 은 그대로예요.',
                'The name inside the function is a new, different variable. The outer name is unchanged.',
            ),
        },
        fill: {
            prompt: t(
                '함수를 부를 때마다 운행 횟수가 1씩 늘게 하세요.',
                'Make the trip count go up by 1 on every call.',
            ),
            code: `{{0}} trips = 0;
function drive() {
  {{1}} = trips + 1;
}
drive();
drive();
drive();
console.log("${t('운행: ', 'Trips: ')}" + trips + "${t('회', '')}");`,
            blanks: [{ size: 5 }, { size: 5 }],
            expected: t('운행: 3회', 'Trips: 3'),
            hints: [
                t(
                    '값이 바뀌는 변수는 const 가 아니라…? 함수 안에서는 바깥 변수 이름을 그대로 써요.',
                    "A variable whose value changes isn't const but…? Inside the function, use the outer variable's name.",
                ),
                'let, trips',
            ],
            solution: ['let', 'trips'],
        },
        write: {
            prompt: t(
                '함수 밖에 <code>let battery = 100;</code> 을 두고, <code>use(kg)</code> 함수가 battery 에서 <code>kg / 10</code> 을 빼게 하세요. <code>use(200)</code>, <code>use(300)</code> 을 부른 뒤 배터리를 찍어 주세요.',
                'Put <code>let battery = 100;</code> outside, and make <code>use(kg)</code> subtract <code>kg / 10</code> from battery. Call <code>use(200)</code> and <code>use(300)</code>, then print the battery.',
            ),
            starter: t('// 여기에 코드를 쓰세요\n', '// Write your code here\n'),
            expected: t('배터리: 50', 'Battery: 50'),
            mustInclude: [
                {
                    re: 'function\\s+use\\s*\\(|use\\s*=\\s*\\(?',
                    msg: t('<code>use(kg)</code> 함수를 만들어 주세요.', 'Make a <code>use(kg)</code> function.'),
                },
                {
                    re: 'battery\\s*(-=|=\\s*battery\\s*-)',
                    msg: t('함수 안에서 battery 를 줄여 주세요.', 'Reduce battery inside the function.'),
                },
            ],
            hints: [
                'battery -= kg / 10;',
                t('console.log("배터리: " + battery);', 'console.log("Battery: " + battery);'),
            ],
            solution: `let battery = 100;
function use(kg) {
  battery -= kg / 10;
}
use(200);
use(300);
console.log("${t('배터리: ', 'Battery: ')}" + battery);`,
        },
        learned: [
            t('<code>{ }</code> 안의 let/const 는 그 안에서만', 'let/const inside <code>{ }</code> live only there'),
            t('함수 안 변수는 끝나면 사라짐', 'Variables inside a function vanish when it ends'),
            t('쌓이는 값은 함수 밖에', 'Keep values that add up outside'),
        ],
    },
    {
        id: 'js-closure',
        stage: 'js-fn',
        npc: 'choi',
        title: t('지게차마다 따로 세는 카운터', 'A counter for each forklift'),
        request: [
            t(
                '지게차가 두 대인데, 각자 운행 횟수를 따로 세고 싶어요.',
                "We have two forklifts and I want to count each one's trips separately.",
            ),
            t(
                '바깥 변수 하나로는 섞여 버리더라고요. 방법이 있을까요?',
                'One outside variable mixes them up. Is there a way?',
            ),
        ],
        thanks: t('지게차마다 자기 숫자를 기억하네요. 신기해요!', 'Each forklift remembers its own number. Neat!'),
        concepts: [
            {
                title: t('함수를 돌려주는 함수', 'A function that returns a function'),
                body: t(
                    '함수도 값이라서 <code>return</code> 으로 돌려줄 수 있어요. 돌려받은 함수는 변수에 담아 두고 나중에 불러요.',
                    'Functions are values too, so a function can <code>return</code> one. Store the returned function in a variable and call it later.',
                ),
                code: `function makeGreeter(name) {
  return function () {
    return name + "${t('님 안녕하세요', ', hello')}";
  };
}
const hi = makeGreeter("${t('최기사', 'Choi')}");
console.log(hi());`,
            },
            {
                title: t(
                    '클로저: 만들어질 때의 변수를 기억',
                    'Closures: remembering the variables from when it was made',
                ),
                body: t(
                    '안쪽 함수는 자기가 만들어진 곳의 변수(<code>count</code>)를 계속 쓸 수 있어요. 이걸 <b>클로저</b>라고 해요. <code>makeCounter()</code> 를 부를 때마다 <code>count</code> 가 새로 생겨서, 카운터마다 숫자가 따로예요. 밖에서는 <code>count</code> 를 직접 못 건드려요.',
                    'The inner function keeps using the variables (<code>count</code>) of the place it was made. This is a <b>closure</b>. Each call to <code>makeCounter()</code> makes a new <code>count</code>, so every counter has its own number, and nothing outside can touch <code>count</code> directly.',
                ),
                code: t(
                    `function makeCounter() {
  let count = 0; // 부를 때마다 새 count 가 생겨요
  return () => {
    count++; // 안쪽 함수가 바깥 count 를 계속 써요 (클로저)
    return count;
  };
}
const truck1 = makeCounter();
const truck2 = makeCounter();
truck1();
truck1();
console.log(truck1()); // truck1 의 count 는 세 번째 → 3
console.log(truck2()); // truck2 는 자기 count 를 따로 → 1`,
                    `function makeCounter() {
  let count = 0; // a new count is made on every call
  return () => {
    count++; // the inner function keeps using the outer count (closure)
    return count;
  };
}
const truck1 = makeCounter();
const truck2 = makeCounter();
truck1();
truck1();
console.log(truck1()); // third time for truck1's count → 3
console.log(truck2()); // truck2 has its own count → 1`,
                ),
            },
        ],
        predict: {
            prompt: P(),
            code: `function makeAdder(base) {
  return (n) => base + n;
}
const add10 = makeAdder(10);
const add5 = makeAdder(5);
console.log(add10(1) + add5(1));`,
            choices: ['17', '16', '11', '22'],
            answer: 0,
            explain: t(
                'add10(1) 은 10 + 1 = 11, add5(1) 은 5 + 1 = 6. 각자 자기 base 를 기억해요.',
                'add10(1) is 10 + 1 = 11 and add5(1) is 5 + 1 = 6. Each remembers its own base.',
            ),
        },
        fill: {
            prompt: t('카운터 함수를 완성해서 운행 2회가 찍히게 하세요.', 'Finish the counter so it prints 2 trips.'),
            code: `function makeCounter() {
  let count = 0;
  return () => {
    count++;
    {{0}} count;
  };
}
const forklift = {{1}}();
forklift();
console.log("${t('운행: ', 'Trips: ')}" + forklift() + "${t('회', '')}");`,
            blanks: [{ size: 6 }, { size: 11 }],
            expected: t('운행: 2회', 'Trips: 2'),
            hints: [
                t(
                    '안쪽 함수는 count 를 돌려줘야 해요. 카운터는 어떤 함수를 불러서 만들까요?',
                    'The inner function must hand back count. Which function do you call to make a counter?',
                ),
                'return, makeCounter',
            ],
            solution: ['return', 'makeCounter'],
        },
        write: {
            prompt: t(
                '<code>makeLoader(limit)</code> 를 만들어 주세요. 돌려주는 함수는 kg 를 받아, 지금까지 실은 무게에 더해도 limit 이하면 더하고 <code>"OK"</code>, 넘으면 더하지 않고 <code>"초과"</code> 를 돌려줘요.',
                'Make <code>makeLoader(limit)</code>. The function it returns takes kg: if the total so far plus kg stays within limit, add it and return <code>"OK"</code>; otherwise don\'t add it and return <code>"Over"</code>.',
            ),
            starter: `// ${t('makeLoader 를 여기에 만드세요', 'Make makeLoader here')}

const load = makeLoader(1000);
console.log(load(600));
console.log(load(300));
console.log(load(200));
`,
            expected: t('OK\nOK\n초과', 'OK\nOK\nOver'),
            mustInclude: [
                {
                    re: 'function\\s+makeLoader|makeLoader\\s*=',
                    msg: t(
                        '<code>makeLoader</code> 함수를 만들어 주세요.',
                        'Make the <code>makeLoader</code> function.',
                    ),
                },
                {
                    re: 'return\\s*(\\(|function)',
                    msg: t('makeLoader 가 <b>함수</b>를 돌려줘야 해요.', 'makeLoader must return a <b>function</b>.'),
                },
            ],
            hints: [
                t(
                    'makeLoader 안에 let total = 0; 을 두고, 함수를 return 해요.',
                    'Put let total = 0; inside makeLoader and return a function.',
                ),
                t('if (total + kg > limit) return "초과";', 'if (total + kg > limit) return "Over";'),
            ],
            solution: `function makeLoader(limit) {
  let total = 0;
  return (kg) => {
    if (total + kg > limit) return "${t('초과', 'Over')}";
    total += kg;
    return "OK";
  };
}

const load = makeLoader(1000);
console.log(load(600));
console.log(load(300));
console.log(load(200));`,
        },
        learned: [
            t('함수가 함수를 돌려줄 수 있음', 'A function can return a function'),
            t('클로저: 만들어진 곳의 변수를 기억', 'Closure: remembers the variables where it was made'),
            t('부를 때마다 따로 생기는 변수', 'A fresh variable on every call'),
        ],
    },

    // ───────────── 출고장 · 오팀원 · 콜백 · 배열 메서드 ─────────────
    {
        id: 'js-callback',
        stage: 'js-array',
        npc: 'oh',
        title: t('출고 알림 보내기', 'Sending shipping alerts'),
        request: [
            t(
                '출고할 때마다 알림을 보내는데, 알림 방법이 그때그때 달라요.',
                'We send an alert for every shipment, but how we send it changes.',
            ),
            t('"무엇을 할지"를 함수로 넘겨줄 수 있다던데요?', 'I heard you can pass "what to do" as a function?'),
        ],
        thanks: t('알림 방법만 바꿔 끼우면 되니까 편하네요!', 'Now I just swap in a different alert. So handy!'),
        concepts: [
            {
                title: t('함수도 값이에요', 'Functions are values'),
                body: t(
                    '함수를 변수에 담거나 다른 함수에 <b>넘겨줄</b> 수 있어요. 넘겨받아서 나중에 부르는 함수를 <b>콜백</b>이라고 해요. 넘길 때는 <code>shout</code> 처럼 괄호 없이 이름만 써요.',
                    'You can store a function in a variable or <b>pass</b> it to another function. A function passed in to be called later is a <b>callback</b>. Pass it by name without parentheses, like <code>shout</code>.',
                ),
                code: `function shout(msg) {
  return msg + "!";
}
const say = shout;
console.log(say("${t('출고', 'Ship')}"));

function twice(fn, value) {
  return fn(fn(value));
}
console.log(twice(shout, "${t('출고', 'Ship')}"));`,
            },
            {
                title: t(
                    '<code>forEach</code>: 하나씩 콜백 부르기',
                    '<code>forEach</code>: calling a callback for each item',
                ),
                body: t(
                    '<code>배열.forEach(콜백)</code> 은 칸마다 콜백을 불러요. 콜백은 <code>(값, 번호)</code> 를 받아요.',
                    '<code>array.forEach(callback)</code> calls the callback for every item. The callback gets <code>(value, index)</code>.',
                ),
                code: `const couriers = ["${t('번개택배', 'Lightning')}", "${t('한빛로지스', 'Hanbit')}", "${t('새벽배송', 'Dawn')}"];
couriers.forEach((name, i) => {
  console.log(i + 1 + ". " + name);
});`,
            },
        ],
        predict: {
            prompt: P(),
            code: `function run(task) {
  console.log("${t('시작', 'start')}");
  task();
  console.log("${t('끝', 'end')}");
}
run(() => console.log("${t('상차', 'load')}"));`,
            choices: [
                t('시작\n상차\n끝', 'start\nload\nend'),
                t('상차\n시작\n끝', 'load\nstart\nend'),
                t('시작\n끝\n상차', 'start\nend\nload'),
                t('시작\n끝', 'start\nend'),
            ],
            answer: 0,
            explain: t(
                '넘겨준 함수는 run 안에서 task() 를 부르는 그 순간에 실행돼요.',
                'The passed function runs exactly when run calls task().',
            ),
        },
        fill: {
            prompt: t(
                '박스 수를 하나씩 더해 합계를 찍으세요.',
                'Add up the box counts one by one and print the total.',
            ),
            code: `const boxes = [3, 5, 2];
let total = 0;
boxes.{{0}}((n) => {
  total += {{1}};
});
console.log("${t('합계: ', 'Total: ')}" + total);`,
            blanks: [{ size: 7 }, { size: 3 }],
            expected: t('합계: 10', 'Total: 10'),
            hints: [
                t(
                    '칸마다 콜백을 부르는 배열 메서드는? 콜백이 받은 값의 이름은?',
                    "Which array method calls a callback for each item? What is the callback's value called?",
                ),
                'forEach, n',
            ],
            solution: ['forEach', 'n'],
        },
        write: {
            prompt: t(
                '<code>notify(list, fn)</code> 함수를 만들어 list 의 주문마다 <code>fn(주문)</code> 을 부르게 하세요. 그리고 주문 앞에 <code>"알림: "</code> 을 붙여 찍는 함수를 넘겨서 불러 주세요.',
                'Make <code>notify(list, fn)</code> that calls <code>fn(order)</code> for every order in list. Then call it with a function that prints <code>"Alert: "</code> before the order.',
            ),
            starter: `const orders = ["A-1", "A-2"];

// ${t('여기에 notify 를 만들고 불러 보세요', 'Make notify here and call it')}
`,
            expected: t('알림: A-1\n알림: A-2', 'Alert: A-1\nAlert: A-2'),
            mustInclude: [
                {
                    re: 'function\\s+notify|notify\\s*=',
                    msg: t('<code>notify</code> 함수를 만들어 주세요.', 'Make the <code>notify</code> function.'),
                },
                {
                    re: 'notify\\s*\\(\\s*orders\\s*,',
                    msg: t(
                        '<code>notify(orders, 함수)</code> 로 불러 주세요.',
                        'Call it as <code>notify(orders, function)</code>.',
                    ),
                },
            ],
            hints: [
                t('notify 안에서 list.forEach((o) => fn(o));', 'Inside notify: list.forEach((o) => fn(o));'),
                t(
                    'notify(orders, (o) => console.log("알림: " + o));',
                    'notify(orders, (o) => console.log("Alert: " + o));',
                ),
            ],
            solution: `const orders = ["A-1", "A-2"];

function notify(list, fn) {
  list.forEach((o) => fn(o));
}

notify(orders, (o) => console.log("${t('알림: ', 'Alert: ')}" + o));`,
        },
        learned: [
            t('함수를 변수에 담고 넘겨줄 수 있음', 'Functions can be stored and passed'),
            t('콜백: 넘겨받아 나중에 부르는 함수', 'Callback: a function passed in to call later'),
            t('<code>배열.forEach((값, 번호) => …)</code>', '<code>array.forEach((value, index) => …)</code>'),
        ],
    },
    {
        id: 'js-map-filter',
        stage: 'js-array',
        npc: 'oh',
        title: t('출고 목록 걸러 내기', 'Filtering the shipping list'),
        request: [
            t('무거운 박스만 골라서 요금을 매겨야 해요.', 'I need to pick out only the heavy boxes and price them.'),
            t('반복문 말고 더 짧게 쓰는 방법이 있다던데요?', "I heard there's a shorter way than a loop?"),
        ],
        thanks: t('한 줄로 고르고 바꾸니까 읽기도 쉽네요!', "Picking and changing in one line, and it's easy to read!"),
        concepts: [
            {
                title: t(
                    '<code>map</code>: 칸마다 바꾼 새 배열',
                    '<code>map</code>: a new array with every item changed',
                ),
                body: t(
                    '<code>배열.map(콜백)</code> 은 칸마다 콜백이 돌려준 값으로 <b>새 배열</b>을 만들어요. 원래 배열은 그대로예요.',
                    '<code>array.map(callback)</code> makes a <b>new array</b> from what the callback returns for each item. The original array stays as it is.',
                ),
                code: `const kgs = [2, 5, 3];
const fees = kgs.map((kg) => kg * 1000);
console.log(fees);
console.log(kgs);`,
            },
            {
                title: t('<code>filter</code>: 조건에 맞는 칸만', '<code>filter</code>: only the items that match'),
                body: t(
                    '<code>filter</code> 는 조건에 맞는 칸만 모은 새 배열을 돌려줘요. <code>map</code> 과 이어 쓸 수 있어요.',
                    '<code>filter</code> returns a new array of only the items that match. You can chain it with <code>map</code>.',
                ),
                code: t(
                    `const kgs = [2, 15, 3, 22];
const heavy = kgs.filter((kg) => kg >= 10); // 콜백이 true 를 돌려준 칸만 모으기 (15, 22)
console.log(heavy);
console.log(heavy.length + "개"); // → 2개`,
                    `const kgs = [2, 15, 3, 22];
const heavy = kgs.filter((kg) => kg >= 10); // keeps the items where the callback returns true (15, 22)
console.log(heavy);
console.log(heavy.length + " boxes"); // → 2 boxes`,
                ),
            },
        ],
        predict: {
            prompt: P(),
            code: `const nums = [1, 2, 3, 4];
const result = nums.filter((n) => n % 2 === 0).map((n) => n * 10);
console.log(result);`,
            choices: ['[ 20, 40 ]', '[ 10, 30 ]', '[ 2, 4 ]', '[ 10, 20, 30, 40 ]'],
            answer: 0,
            explain: t(
                'filter 로 짝수 2, 4 만 남기고, map 으로 10 을 곱해요.',
                'filter keeps the even 2 and 4, then map multiplies them by 10.',
            ),
        },
        fill: {
            prompt: t('10kg 미만 주문의 번호만 모아서 찍으세요.', 'Collect and print the ids of orders under 10kg.'),
            code: `const orders = [
  { id: "A1", kg: 3 },
  { id: "A2", kg: 12 },
  { id: "A3", kg: 8 },
];
const ids = orders.{{0}}((o) => o.kg < 10).{{1}}((o) => o.id);
console.log(ids.join(", "));`,
            blanks: [{ size: 6 }, { size: 3 }],
            expected: 'A1, A3',
            hints: [
                t(
                    '먼저 고르고(조건), 그다음 번호로 바꿔요.',
                    'First pick (the condition), then change each into its id.',
                ),
                'filter, map',
            ],
            solution: ['filter', 'map'],
        },
        write: {
            prompt: t(
                '10kg 이상인 박스만 골라(<code>filter</code>) kg × 500 원 요금으로 바꾼(<code>map</code>) 다음, 쉼표로 이어 찍어 주세요.',
                'Pick the boxes of 10kg or more (<code>filter</code>), turn them into fees of kg × 500 (<code>map</code>), then print them joined by commas.',
            ),
            starter: `const kgs = [4, 18, 7, 25];
`,
            expected: t('요금: 9000, 12500', 'Fees: 9000, 12500'),
            mustInclude: [
                {
                    re: '\\.filter\\s*\\(',
                    msg: t('<code>filter</code> 로 골라 주세요.', 'Pick them with <code>filter</code>.'),
                },
                {
                    re: '\\.map\\s*\\(',
                    msg: t('<code>map</code> 으로 바꿔 주세요.', 'Change them with <code>map</code>.'),
                },
            ],
            hints: [
                'kgs.filter((kg) => kg >= 10).map((kg) => kg * 500)',
                t('console.log("요금: " + fees.join(", "));', 'console.log("Fees: " + fees.join(", "));'),
            ],
            solution: `const kgs = [4, 18, 7, 25];
const fees = kgs.filter((kg) => kg >= 10).map((kg) => kg * 500);
console.log("${t('요금: ', 'Fees: ')}" + fees.join(", "));`,
        },
        learned: [
            t('<code>map</code> → 바꾼 새 배열', '<code>map</code> → a new, changed array'),
            t('<code>filter</code> → 고른 새 배열', '<code>filter</code> → a new, picked array'),
            t('<code>.filter(…).map(…)</code> 이어 쓰기', 'Chain <code>.filter(…).map(…)</code>'),
        ],
    },
    {
        id: 'js-reduce-sort',
        stage: 'js-array',
        npc: 'oh',
        title: t('출고량 합치고 줄 세우기', 'Totals and sorting'),
        request: [
            t(
                '트럭별 적재량을 다 더하고, 가벼운 순서로 줄도 세워야 해요.',
                "I need to add up each truck's load and line them up lightest first.",
            ),
            t('배열 메서드로 할 수 있을까요?', 'Can array methods do that?'),
        ],
        thanks: t('합계도 순서도 깔끔하게 나왔어요!', 'Clean totals and a clean order!'),
        concepts: [
            {
                title: t('<code>reduce</code>: 하나로 모으기', '<code>reduce</code>: boiling it down to one value'),
                body: t(
                    '<code>배열.reduce((모은값, 칸) => 새모은값, 처음값)</code>. 처음값에서 시작해서 칸마다 콜백이 돌려준 값이 다음 "모은값"이 돼요. 합계를 구할 때 처음값은 <code>0</code>.',
                    '<code>array.reduce((acc, item) => newAcc, start)</code>. It starts from start, and what the callback returns for each item becomes the next acc. For a sum, start is <code>0</code>.',
                ),
                code: `const boxes = [3, 5, 2];
const total = boxes.reduce((sum, n) => sum + n, 0);
console.log(total);`,
            },
            {
                title: t('<code>sort</code> 와 비교 함수', '<code>sort</code> and a compare function'),
                body: t(
                    '<code>sort</code> 는 배열 자체를 바꿔요. 숫자는 비교 함수를 꼭 넘겨야 해요. 이유는 예제 주석을 보세요.',
                    '<code>sort</code> changes the array itself. For numbers you must pass a compare function. See the comments for why.',
                ),
                code: t(
                    `const kgs = [12, 3, 25, 8];
kgs.sort((a, b) => a - b); // a - b: 작은 순 (b - a 는 큰 순) → 3, 8, 12, 25
console.log(kgs);
console.log([10, 9, 100].sort()); // 아무것도 안 넘기면 글자 순서라 10, 100, 9`,
                    `const kgs = [12, 3, 25, 8];
kgs.sort((a, b) => a - b); // a - b: smallest first (b - a is largest first) → 3, 8, 12, 25
console.log(kgs);
console.log([10, 9, 100].sort()); // with nothing passed it sorts as text: 10, 100, 9`,
                ),
            },
        ],
        predict: {
            prompt: P(),
            code: `const kgs = [4, 10, 6];
const total = kgs.reduce((sum, n) => sum + n, 100);
console.log(total);`,
            choices: ['120', '20', '100', '4106'],
            answer: 0,
            explain: t(
                '처음값이 100 이라서 100 + 4 + 10 + 6 = 120.',
                'The start value is 100, so 100 + 4 + 10 + 6 = 120.',
            ),
        },
        fill: {
            prompt: t(
                '가벼운 순서로 줄 세우고 전체 무게를 더하세요.',
                'Sort lightest first and add up the total weight.',
            ),
            code: `const trucks = [
  { name: "${t('1호차', 'Truck 1')}", kg: 800 },
  { name: "${t('2호차', 'Truck 2')}", kg: 300 },
  { name: "${t('3호차', 'Truck 3')}", kg: 500 },
];
trucks.sort((a, b) => a.kg {{0}} b.kg);
const total = trucks.reduce((sum, t) => sum + t.{{1}}, 0);
console.log(trucks[0].name + " / ${t('합계', 'total')} " + total);`,
            blanks: [{ size: 2 }, { size: 3 }],
            expected: t('2호차 / 합계 1600', 'Truck 2 / total 1600'),
            hints: [
                t(
                    '작은 순서는 a.kg - b.kg. 더할 값은 각 트럭의 무게.',
                    "Smallest first is a.kg - b.kg. Add each truck's weight.",
                ),
                '-, kg',
            ],
            solution: ['-', 'kg'],
        },
        write: {
            prompt: t(
                '<code>reduce</code> 로 금액 합계를 구하고, <code>sort</code> 로 큰 순서로 줄 세운 뒤 합계와 가장 큰 금액을 찍어 주세요.',
                'Get the total with <code>reduce</code>, sort largest first with <code>sort</code>, then print the total and the largest amount.',
            ),
            starter: `const amounts = [12000, 8000, 30000];
`,
            expected: t('합계: 50000\n최고: 30000', 'Total: 50000\nTop: 30000'),
            mustInclude: [
                {
                    re: '\\.reduce\\s*\\(',
                    msg: t('<code>reduce</code> 로 더해 주세요.', 'Add them with <code>reduce</code>.'),
                },
                {
                    re: '\\.sort\\s*\\(',
                    msg: t('<code>sort</code> 로 줄 세워 주세요.', 'Sort with <code>sort</code>.'),
                },
            ],
            hints: ['amounts.reduce((sum, a) => sum + a, 0)', 'amounts.sort((a, b) => b - a); amounts[0]'],
            solution: `const amounts = [12000, 8000, 30000];
const total = amounts.reduce((sum, a) => sum + a, 0);
amounts.sort((a, b) => b - a);
console.log("${t('합계: ', 'Total: ')}" + total);
console.log("${t('최고: ', 'Top: ')}" + amounts[0]);`,
        },
        learned: [
            t('<code>reduce((모은값, 칸) => …, 처음값)</code>', '<code>reduce((acc, item) => …, start)</code>'),
            t('숫자 정렬은 <code>sort((a, b) => a - b)</code>', 'Sort numbers with <code>sort((a, b) => a - b)</code>'),
            t('그냥 <code>sort()</code> 는 글자 순서', 'Plain <code>sort()</code> sorts as text'),
        ],
    },

    // ───────────── 주문 출력실 · 이대리 · 구조 분해 · JSON ─────────────
    {
        id: 'js-destructure',
        stage: 'js-data',
        npc: 'lee',
        title: t('주문 정보 꺼내기', 'Unpacking an order'),
        request: [
            t(
                '주문 객체에서 필요한 것만 꺼내 쓰고, 일부만 바꾼 복사본도 만들어야 해요.',
                'I need to take just what I need from an order object, and make a copy with a few things changed.',
            ),
            t('order.id, order.qty… 매번 쓰기 귀찮아요!', 'Writing order.id, order.qty… every time is tiring!'),
        ],
        thanks: t('한 줄로 꺼내니까 코드가 훨씬 짧아졌어요!', 'Unpacking in one line made the code much shorter!'),
        concepts: [
            {
                title: t('구조 분해', 'Destructuring'),
                body: t(
                    '<code>const { id, qty } = order;</code> 는 객체에서 같은 이름의 값을 꺼내 변수로 만들어요. 배열은 <code>const [a, b] = 배열;</code> 처럼 <b>순서대로</b> 꺼내요.',
                    '<code>const { id, qty } = order;</code> takes the values with those names out of the object as variables. Arrays unpack <b>in order</b>: <code>const [a, b] = array;</code>.',
                ),
                code: `const order = { id: "A-17", qty: 3, item: "${t('립밤', 'lip balm')}" };
const { id, qty } = order;
console.log(id, qty);

const [first, second] = ["${t('번개택배', 'Lightning')}", "${t('한빛로지스', 'Hanbit')}"];
console.log(second);`,
            },
            {
                title: t('스프레드 <code>...</code>', 'Spread <code>...</code>'),
                body: t(
                    '<code>{ ...base }</code> 는 base 의 내용을 펼쳐 담은 <b>새 객체</b>예요. 뒤에 쓴 값이 앞의 값을 덮어써요. 배열도 <code>[...a, ...b]</code> 로 이어 붙여요.',
                    "<code>{ ...base }</code> is a <b>new object</b> with base's contents spread in. Values written later overwrite earlier ones. Arrays join with <code>[...a, ...b]</code>.",
                ),
                code: `const base = { item: "${t('토너', 'toner')}", qty: 1 };
const urgent = { ...base, qty: 5, fast: true };
console.log(urgent);

const am = [1, 2];
const pm = [3];
console.log([...am, ...pm]);`,
            },
        ],
        predict: {
            prompt: P(),
            code: `const box = { kg: 3, zone: "A" };
const moved = { ...box, zone: "B" };
console.log(box.zone + moved.zone);`,
            choices: ['AB', 'BB', 'AA', 'BA'],
            answer: 0,
            explain: t(
                'moved 는 새 객체라서 box 는 그대로 "A", moved 만 "B" 예요.',
                'moved is a new object, so box is still "A" and only moved is "B".',
            ),
        },
        fill: {
            prompt: t(
                '수량과 가격을 꺼내고, 수량만 바꾼 복사본을 만드세요.',
                'Unpack qty and price, and make a copy with only qty changed.',
            ),
            code: `const order = { id: "B-2", qty: 4, price: 2500 };
const { qty, {{0}} } = order;
const copy = { {{1}}order, qty: 10 };
console.log(qty * price);
console.log(copy.qty * copy.price);`,
            blanks: [{ size: 5 }, { size: 3 }],
            expected: '10000\n25000',
            hints: [
                t(
                    '아래에서 price 를 바로 써요. 객체를 펼치는 기호는?',
                    'price is used directly below. Which symbol spreads an object?',
                ),
                'price, ...',
            ],
            solution: ['price', '...'],
        },
        write: {
            prompt: t(
                '구조 분해로 <code>driver</code> 와 <code>kg</code> 를 꺼내 찍고, 스프레드로 kg 만 1200 으로 바꾼 새 객체를 만들어 새 kg 와 원래 kg 를 찍어 주세요.',
                'Unpack <code>driver</code> and <code>kg</code> and print them, then use spread to make a new object with kg changed to 1200, and print the new and original kg.',
            ),
            starter: `const truck = { no: "${t('12가3456', '12GA3456')}", driver: "${t('윤기사', 'Yoon')}", kg: 900 };
`,
            expected: t('윤기사: 900kg\n새 1200 / 원래 900', 'Yoon: 900kg\nnew 1200 / old 900'),
            mustInclude: [
                {
                    re: 'const\\s*\\{[^}]*driver',
                    msg: t(
                        '<code>const { driver, kg } = truck;</code> 처럼 꺼내 주세요.',
                        'Unpack like <code>const { driver, kg } = truck;</code>.',
                    ),
                },
                {
                    re: '\\.\\.\\.\\s*truck',
                    msg: t(
                        '<code>{ ...truck, kg: 1200 }</code> 으로 새 객체를 만들어 주세요.',
                        'Make the new object with <code>{ ...truck, kg: 1200 }</code>.',
                    ),
                },
            ],
            hints: ['const { driver, kg } = truck;', 'const heavier = { ...truck, kg: 1200 };'],
            solution: `const truck = { no: "${t('12가3456', '12GA3456')}", driver: "${t('윤기사', 'Yoon')}", kg: 900 };
const { driver, kg } = truck;
console.log(driver + ": " + kg + "kg");
const heavier = { ...truck, kg: 1200 };
console.log("${t('새 ', 'new ')}" + heavier.kg + "${t(' / 원래 ', ' / old ')}" + truck.kg);`,
        },
        learned: [
            t('<code>const { a, b } = 객체;</code>', '<code>const { a, b } = object;</code>'),
            t('<code>const [x, y] = 배열;</code> 은 순서대로', '<code>const [x, y] = array;</code> goes in order'),
            t('<code>{ ...obj, 바꿀값 }</code> → 새 객체', '<code>{ ...obj, change }</code> → a new object'),
        ],
    },
    {
        id: 'js-json',
        stage: 'js-data',
        npc: 'lee',
        title: t('주문 데이터 주고받기', 'Sending and receiving order data'),
        request: [
            t(
                '쇼핑몰 서버에서 주문이 글자(문자열)로 들어와요.',
                "Orders come in from the shop's server as text (a string).",
            ),
            t(
                '이걸 객체로 바꿔서 쓰고, 다시 글자로 돌려보내야 해요.',
                'I need to turn it into an object to use, then send it back as text.',
            ),
        ],
        thanks: t(
            '주문이 문자열로 와도 이제 바로 읽을 수 있어요!',
            'Now I can read orders right away, even when they arrive as strings!',
        ),
        concepts: [
            {
                title: t('<code>JSON.stringify</code>: 객체 → 문자열', '<code>JSON.stringify</code>: object → string'),
                body: t(
                    'JSON 은 데이터를 글자로 주고받는 약속이에요. <code>JSON.stringify(객체)</code> 는 객체를 JSON 문자열로 바꿔요. 키에도 큰따옴표가 붙어요.',
                    'JSON is an agreed way to send data as text. <code>JSON.stringify(object)</code> turns an object into a JSON string, with double quotes on the keys too.',
                ),
                code: `const order = { id: "A-1", qty: 2 };
const text = JSON.stringify(order);
console.log(text);
console.log(typeof text);`,
            },
            {
                title: t('<code>JSON.parse</code>: 문자열 → 객체', '<code>JSON.parse</code>: string → object'),
                body: t(
                    '<code>JSON.parse(문자열)</code> 은 JSON 문자열을 다시 객체(또는 배열)로 바꿔요. 그다음엔 <code>.</code> 으로 값을 꺼내 써요. 따옴표 안의 숫자는 문자열이라는 점을 조심해요.',
                    '<code>JSON.parse(string)</code> turns a JSON string back into an object (or array). Then read values with <code>.</code>. Careful: a number in quotes is a string.',
                ),
                code: `const text = '{"item":"${t('쿠션', 'cushion')}","qty":3}';
const data = JSON.parse(text);
console.log(data.item);
console.log(data.qty + 1);`,
            },
        ],
        predict: {
            prompt: P(),
            code: `const text = '{"qty":"5"}';
const data = JSON.parse(text);
console.log(data.qty + 1);`,
            choices: ['51', '6', 'NaN', '5 1'],
            answer: 0,
            explain: t(
                '"5" 는 따옴표 안이라 문자열이에요. 문자열 + 1 은 이어 붙이기라서 "51".',
                '"5" is in quotes, so it\'s a string. String + 1 joins them: "51".',
            ),
        },
        fill: {
            prompt: t(
                '주문 목록 문자열을 배열로 바꾸고 무게를 더하세요.',
                'Turn the order-list string into an array and add up the weights.',
            ),
            code: `const text = '[{"id":"A1","kg":3},{"id":"A2","kg":7}]';
const orders = JSON.{{0}}(text);
const total = orders.reduce((s, o) => s + o.{{1}}, 0);
console.log(orders.length + "${t('건, ', ' orders, ')}" + total + "kg");`,
            blanks: [{ size: 5 }, { size: 3 }],
            expected: t('2건, 10kg', '2 orders, 10kg'),
            hints: [t('문자열 → 배열은 parse. 더할 값은 kg.', 'String → array is parse. Add up kg.'), 'parse, kg'],
            solution: ['parse', 'kg'],
        },
        write: {
            prompt: t(
                'JSON 문자열을 객체로 바꿔 주문 번호와 상품 개수를 찍고, items 에 쿠션을 추가한 뒤 다시 JSON 문자열로 찍어 주세요.',
                'Parse the JSON string, print the order id and item count, add cushion to items, then print it as a JSON string again.',
            ),
            starter: `const text = '{"id":"C-9","items":["${t('립밤', 'lip balm')}","${t('토너', 'toner')}"]}';
`,
            expected: t(
                'C-9: 2개\n{"id":"C-9","items":["립밤","토너","쿠션"]}',
                'C-9: 2 items\n{"id":"C-9","items":["lip balm","toner","cushion"]}',
            ),
            mustInclude: [
                {
                    re: 'JSON\\.parse\\s*\\(',
                    msg: t(
                        '<code>JSON.parse</code> 로 바꿔 주세요.',
                        'Turn it into an object with <code>JSON.parse</code>.',
                    ),
                },
                {
                    re: 'JSON\\.stringify\\s*\\(',
                    msg: t(
                        '<code>JSON.stringify</code> 로 다시 바꿔 찍어 주세요.',
                        'Turn it back with <code>JSON.stringify</code>.',
                    ),
                },
            ],
            hints: [
                'const order = JSON.parse(text);',
                t(
                    'order.items.push("쿠션"); console.log(JSON.stringify(order));',
                    'order.items.push("cushion"); console.log(JSON.stringify(order));',
                ),
            ],
            solution: `const text = '{"id":"C-9","items":["${t('립밤', 'lip balm')}","${t('토너', 'toner')}"]}';
const order = JSON.parse(text);
console.log(order.id + ": " + order.items.length + "${t('개', ' items')}");
order.items.push("${t('쿠션', 'cushion')}");
console.log(JSON.stringify(order));`,
        },
        learned: [
            t('<code>JSON.stringify(객체)</code> → 문자열', '<code>JSON.stringify(object)</code> → string'),
            t('<code>JSON.parse(문자열)</code> → 객체', '<code>JSON.parse(string)</code> → object'),
            t('따옴표 안의 숫자는 문자열', 'A number in quotes is a string'),
        ],
    },

    // ───────────── 센터장실 · 문센터장 · 상속 ─────────────
    {
        id: 'js-extends',
        stage: 'js-class',
        npc: 'moon',
        title: t('상품 종류별 카드', 'Cards for each kind of product'),
        request: [
            t(
                '김사원님, 상품 카드에 "파손주의" 상품만 따로 표시하고 싶어요.',
                'Kim, I want the product cards to mark "fragile" products separately.',
            ),
            t(
                '기존 카드는 그대로 두고 기능만 더할 수 있을까요?',
                'Can we add that without touching the existing card?',
            ),
        ],
        thanks: t(
            '기존 클래스를 물려받아서 깔끔하게 늘렸네요. 역시!',
            'You built on the existing class and kept it tidy. Nicely done!',
        ),
        concepts: [
            {
                title: t('<code>extends</code>: 물려받기', '<code>extends</code>: inheriting'),
                body: t(
                    '<code>class 자식 extends 부모</code> 로 만들면, 부모의 생성자와 메서드를 그대로 물려받아요. 같은 코드를 다시 쓰지 않아도 돼요.',
                    "Declare <code>class Child extends Parent</code> and the child inherits the parent's constructor and methods. No need to write the same code again.",
                ),
                code: `class Item {
  constructor(name) {
    this.name = name;
  }
  label() {
    return "[${t('상품', 'Item')}] " + this.name;
  }
}
class Fragile extends Item {}

const cup = new Fragile("${t('유리병 토너', 'glass-bottle toner')}");
console.log(cup.label());`,
            },
            {
                title: t('<code>super</code> 와 덮어쓰기', '<code>super</code> and overriding'),
                body: t(
                    '자식에서 같은 이름의 메서드를 만들면 부모 것을 <b>덮어써요</b>. 자식 생성자에서는 먼저 <code>super(…)</code> 로 부모 생성자를 불러야 해요. <code>super.label()</code> 처럼 부모 메서드도 부를 수 있어요.',
                    "A method with the same name in the child <b>overrides</b> the parent's. A child constructor must first call the parent's with <code>super(…)</code>. You can also call parent methods like <code>super.label()</code>.",
                ),
                code: `class Item {
  constructor(name) {
    this.name = name;
  }
  label() {
    return "[${t('상품', 'Item')}] " + this.name;
  }
}
class Fragile extends Item {
  constructor(name, level) {
    super(name);
    this.level = level;
  }
  label() {
    return super.label() + " (${t('파손주의', 'fragile')} " + this.level + ")";
  }
}
console.log(new Fragile("${t('유리병 토너', 'glass-bottle toner')}", 3).label());`,
            },
        ],
        predict: {
            prompt: P(),
            code: `class Box {
  size() {
    return "${t('보통', 'medium')}";
  }
}
class BigBox extends Box {
  size() {
    return "${t('큼', 'big')}";
  }
}
const a = new Box();
const b = new BigBox();
console.log(a.size() + "/" + b.size());`,
            choices: [
                t('보통/큼', 'medium/big'),
                t('보통/보통', 'medium/medium'),
                t('큼/큼', 'big/big'),
                t('큼/보통', 'big/medium'),
            ],
            answer: 0,
            explain: t(
                'BigBox 가 size 를 덮어써서 b 만 "큼"이에요. 부모 Box 는 그대로예요.',
                'BigBox overrides size, so only b is "big". The parent Box is unchanged.',
            ),
        },
        fill: {
            prompt: t('냉장 트럭이 트럭을 물려받게 하세요.', 'Make the cold truck inherit from Truck.'),
            code: `class Truck {
  constructor(no) {
    this.no = no;
  }
}
class ColdTruck {{0}} Truck {
  constructor(no, temp) {
    {{1}}(no);
    this.temp = temp;
  }
}
const t = new ColdTruck("${t('냉장 1호', 'Cold 1')}", -5);
console.log(t.no + " " + t.temp + "${t('도', '°C')}");`,
            blanks: [{ size: 7 }, { size: 5 }],
            expected: t('냉장 1호 -5도', 'Cold 1 -5°C'),
            hints: [
                t(
                    '물려받는 키워드, 부모 생성자를 부르는 키워드.',
                    'The keyword to inherit, and the one that calls the parent constructor.',
                ),
                'extends, super',
            ],
            solution: ['extends', 'super'],
        },
        write: {
            prompt: t(
                '<code>Staff</code> 클래스(이름 name, <code>hello()</code> 는 "안녕하세요, 이름")를 만들고, 이를 물려받은 <code>Driver</code>(차 car 추가, hello 는 부모 인사 뒤에 " (차)")를 만들어 윤기사(1톤)의 인사를 찍어 주세요.',
                'Make a <code>Staff</code> class (name; <code>hello()</code> returns "Hello, name") and a <code>Driver</code> that inherits it (adds car; hello is the parent greeting plus " (car)"). Print the greeting of Yoon (1-ton).',
            ),
            starter: t('// 여기에 코드를 쓰세요\n', '// Write your code here\n'),
            expected: t('안녕하세요, 윤기사 (1톤)', 'Hello, Yoon (1-ton)'),
            mustInclude: [
                {
                    re: 'class\\s+Driver\\s+extends\\s+Staff',
                    msg: t(
                        '<code>class Driver extends Staff</code> 로 물려받아 주세요.',
                        'Inherit with <code>class Driver extends Staff</code>.',
                    ),
                },
                {
                    re: 'super',
                    msg: t('<code>super</code> 로 부모를 불러 주세요.', 'Call the parent with <code>super</code>.'),
                },
            ],
            hints: [
                t('Driver 생성자: super(name); this.car = car;', 'Driver constructor: super(name); this.car = car;'),
                'return super.hello() + " (" + this.car + ")";',
            ],
            solution: `class Staff {
  constructor(name) {
    this.name = name;
  }
  hello() {
    return "${t('안녕하세요, ', 'Hello, ')}" + this.name;
  }
}
class Driver extends Staff {
  constructor(name, car) {
    super(name);
    this.car = car;
  }
  hello() {
    return super.hello() + " (" + this.car + ")";
  }
}
console.log(new Driver("${t('윤기사', 'Yoon')}", "${t('1톤', '1-ton')}").hello());`,
        },
        learned: [
            t('<code>class 자식 extends 부모</code>', '<code>class Child extends Parent</code>'),
            t('자식 생성자는 먼저 <code>super(…)</code>', 'A child constructor calls <code>super(…)</code> first'),
            t(
                '같은 이름 메서드 = 덮어쓰기, <code>super.메서드()</code>',
                'Same-named method = override; <code>super.method()</code>',
            ),
        ],
    },

    // ───────────── 택배 상차장 · 윤기사님 · 비동기 ─────────────
    {
        id: 'js-promise',
        stage: 'js-async',
        npc: 'yoon',
        title: t('트럭 도착 기다리기', 'Waiting for the truck'),
        request: [
            t(
                '트럭이 도착해야 상차를 시작하는데, 언제 올지 몰라요.',
                'Loading starts when the truck arrives, but we never know when it will come.',
            ),
            t(
                '기다리는 동안 다른 일을 하다가 도착하면 알려 주는 코드가 필요해요.',
                'I need code that does other work meanwhile and tells me when it arrives.',
            ),
        ],
        thanks: t(
            '기다리는 동안 다른 일도 하고, 도착하면 딱 알려 주네요!',
            'It does other work while waiting and tells me right when it arrives!',
        ),
        concepts: [
            {
                title: t('<code>setTimeout</code>: 나중에 실행', '<code>setTimeout</code>: run later'),
                body: t(
                    '<code>setTimeout(함수, ms)</code> 는 ms 밀리초 뒤에 함수를 불러요. 기다리는 동안 아래 코드가 <b>먼저</b> 실행돼요.',
                    '<code>setTimeout(fn, ms)</code> calls the function after ms milliseconds. The code below runs <b>first</b> while it waits.',
                ),
                code: `console.log("${t('상차 시작', 'Loading starts')}");
setTimeout(() => {
  console.log("${t('트럭 도착', 'Truck arrived')}");
}, 100);
console.log("${t('기다리는 중', 'Waiting')}");`,
            },
            {
                title: t('<code>Promise</code> 와 <code>then</code>', '<code>Promise</code> and <code>then</code>'),
                body: t(
                    '<code>Promise</code> 는 "나중에 결과를 주겠다" 는 약속이에요. 결과를 주고받는 법은 예제 주석을 보세요.',
                    'A <code>Promise</code> is a promise to give a result later. See the comments for how the result is given and received.',
                ),
                code: t(
                    `function arrive(truck) {
  return new Promise((resolve) => {
    setTimeout(() => resolve(truck + " 도착"), 100); // 0.1초 뒤 resolve(값): 결과 주기
  });
}
arrive("1호차").then((msg) => { // .then(값 => …): 결과가 나오면 받기
  console.log(msg); // → 1호차 도착 (두 번째로 찍혀요)
});
console.log("먼저 찍혀요"); // 기다리지 않고 바로 실행`,
                    `function arrive(truck) {
  return new Promise((resolve) => {
    setTimeout(() => resolve(truck + " arrived"), 100); // after 0.1 s, resolve(value): give the result
  });
}
arrive("Truck 1").then((msg) => { // .then(value => …): receive the result when it is ready
  console.log(msg); // → Truck 1 arrived (printed second)
});
console.log("Printed first"); // runs right away, without waiting`,
                ),
            },
        ],
        predict: {
            prompt: P(),
            code: `console.log("A");
setTimeout(() => console.log("B"), 0);
Promise.resolve().then(() => console.log("C"));
console.log("D");`,
            choices: ['A\nD\nC\nB', 'A\nB\nC\nD', 'A\nD\nB\nC', 'A\nC\nD\nB'],
            answer: 0,
            explain: t(
                '지금 코드(A, D)가 먼저 끝나고, 그다음 Promise 의 then(C), 마지막으로 setTimeout(B) 이에요. 0ms 라도 setTimeout 은 then 보다 늦어요.',
                "The current code (A, D) finishes first, then the Promise's then (C), and setTimeout (B) last. Even at 0ms, setTimeout comes after then.",
            ),
        },
        fill: {
            prompt: t(
                '상차 시간을 나중에 돌려주는 함수를 완성하세요.',
                'Finish the function that hands back the loading time later.',
            ),
            code: `function load(boxes) {
  return new {{0}}((resolve) => {
    setTimeout(() => resolve(boxes * 2), 50);
  });
}
load(5).{{1}}((n) => console.log("${t('상차 완료: ', 'Loaded: ')}" + n + "${t('분', ' min')}"));`,
            blanks: [{ size: 7 }, { size: 4 }],
            expected: t('상차 완료: 10분', 'Loaded: 10 min'),
            hints: [
                t(
                    '나중에 결과를 주는 약속 객체, 결과를 받는 메서드.',
                    'The promise object that gives a result later, and the method that receives it.',
                ),
                'Promise, then',
            ],
            solution: ['Promise', 'then'],
        },
        write: {
            prompt: t(
                '<code>delay(ms, text)</code> 를 만들어 ms 뒤에 text 를 주는 Promise 를 돌려주게 하세요. 그리고 <code>"출발"</code> 을 받아 찍은 다음, 이어서 <code>"도착"</code> 을 받아 찍어 주세요 (<code>then</code> 에서 다음 Promise 를 return).',
                'Make <code>delay(ms, text)</code> that returns a Promise giving text after ms. Receive and print <code>"Depart"</code>, then receive and print <code>"Arrive"</code> (return the next Promise inside <code>then</code>).',
            ),
            starter: t('// 여기에 코드를 쓰세요\n', '// Write your code here\n'),
            expected: t('출발\n도착', 'Depart\nArrive'),
            mustInclude: [
                {
                    re: 'new\\s+Promise',
                    msg: t('<code>new Promise</code> 로 만들어 주세요.', 'Make it with <code>new Promise</code>.'),
                },
                {
                    re: '\\.then\\s*\\(',
                    msg: t('<code>.then</code> 으로 받아 주세요.', 'Receive it with <code>.then</code>.'),
                },
            ],
            hints: [
                'return new Promise((resolve) => setTimeout(() => resolve(text), ms));',
                t(
                    'delay(50, "출발").then((m) => { console.log(m); return delay(50, "도착"); }).then((m) => console.log(m));',
                    'delay(50, "Depart").then((m) => { console.log(m); return delay(50, "Arrive"); }).then((m) => console.log(m));',
                ),
            ],
            solution: `function delay(ms, text) {
  return new Promise((resolve) => setTimeout(() => resolve(text), ms));
}

delay(50, "${t('출발', 'Depart')}")
  .then((m) => {
    console.log(m);
    return delay(50, "${t('도착', 'Arrive')}");
  })
  .then((m) => console.log(m));`,
        },
        learned: [
            t('<code>setTimeout(함수, ms)</code> → 나중에', '<code>setTimeout(fn, ms)</code> → later'),
            t('<code>new Promise((resolve) => …)</code>', '<code>new Promise((resolve) => …)</code>'),
            t('<code>.then(값 => …)</code>, 이어 쓰려면 return', '<code>.then(value => …)</code>; return to chain'),
        ],
    },
    {
        id: 'js-async',
        stage: 'js-async',
        npc: 'yoon',
        title: t('상차 순서대로 처리하기', 'Loading in order'),
        request: [
            t(
                '박스를 하나 싣고, 끝나면 다음 박스를 싣고… then 을 줄줄이 쓰니까 헷갈려요.',
                "Load one box, then the next when it's done… chaining then over and over gets confusing.",
            ),
            t('위에서 아래로 읽히게 쓸 수는 없을까요?', 'Can I write it so it reads top to bottom?'),
        ],
        thanks: t(
            '위에서 아래로 읽히니까 상차 순서가 한눈에 보여요!',
            'Reading top to bottom, I can see the loading order at a glance!',
        ),
        concepts: [
            {
                title: t('<code>async</code> / <code>await</code>', '<code>async</code> / <code>await</code>'),
                body: t(
                    '<code>async function</code> 안에서는 <code>await Promise</code> 로 결과가 나올 때까지 <b>그 함수만</b> 기다렸다가 다음 줄로 가요. then 을 이어 쓰지 않아도 위에서 아래로 읽혀요.',
                    'Inside an <code>async function</code>, <code>await promise</code> makes <b>just that function</b> wait for the result before the next line. It reads top to bottom without chaining then.',
                ),
                code: `const wait = (ms) => new Promise((r) => setTimeout(r, ms));

async function loadTruck() {
  console.log("${t('1번 박스', 'Box 1')}");
  await wait(50);
  console.log("${t('2번 박스', 'Box 2')}");
  await wait(50);
  console.log("${t('출발!', 'Go!')}");
}
loadTruck();`,
            },
            {
                title: t(
                    '<code>await</code> 의 값과 <code>try</code> / <code>catch</code>',
                    'The value of <code>await</code>, and <code>try</code> / <code>catch</code>',
                ),
                body: t(
                    '<code>await</code> 로 Promise 의 결과를 받고, 실패는 <code>try</code> / <code>catch</code> 로 잡아요. 흐름은 예제 주석을 보세요.',
                    'Get a Promise result with <code>await</code>, and catch failures with <code>try</code> / <code>catch</code>. See the comments for the flow.',
                ),
                code: t(
                    `function checkTruck(ok) {
  return new Promise((resolve, reject) => {
    // ok 면 resolve(값), 아니면 reject(에러) 로 실패
    setTimeout(() => (ok ? resolve("통과") : reject(new Error("타이어 점검 필요"))), 50);
  });
}

async function inspect() {
  try {
    console.log(await checkTruck(true)); // await: Promise 가 준 값을 돌려줘요 → 통과
    console.log(await checkTruck(false)); // reject 되면 이 줄에서 에러 → catch 로
  } catch (e) {
    console.log("멈춤: " + e.message); // → 멈춤: 타이어 점검 필요
  }
}
inspect();`,
                    `function checkTruck(ok) {
  return new Promise((resolve, reject) => {
    // resolve(value) if ok, otherwise fail with reject(error)
    setTimeout(() => (ok ? resolve("passed") : reject(new Error("tires need a check"))), 50);
  });
}

async function inspect() {
  try {
    console.log(await checkTruck(true)); // await: gives back the value the Promise produced → passed
    console.log(await checkTruck(false)); // if it is rejected, this line throws → goes to catch
  } catch (e) {
    console.log("Stopped: " + e.message); // → Stopped: tires need a check
  }
}
inspect();`,
                ),
            },
        ],
        predict: {
            prompt: P(),
            code: `const wait = (ms) => new Promise((r) => setTimeout(r, ms));
async function go() {
  console.log("1");
  await wait(10);
  console.log("3");
}
go();
console.log("2");`,
            choices: ['1\n2\n3', '1\n3\n2', '2\n1\n3', '1\n2'],
            answer: 0,
            explain: t(
                'go() 는 1 을 찍고 await 에서 멈춰요. 그동안 바깥 코드가 2 를 찍고, 기다림이 끝나면 3 을 찍어요.',
                'go() prints 1 and pauses at await. Meanwhile the outside code prints 2, and when the wait ends it prints 3.',
            ),
        },
        fill: {
            prompt: t('박스를 하나씩 기다렸다가 순서대로 찍으세요.', 'Wait for each box and print them in order.'),
            code: `const wait = (ms) => new Promise((r) => setTimeout(r, ms));

{{0}} function count() {
  for (let i = 1; i <= 3; i++) {
    {{1}} wait(20);
    console.log(i + "${t('번 상차', ' loaded')}");
  }
}
count();`,
            blanks: [{ size: 5 }, { size: 5 }],
            expected: t('1번 상차\n2번 상차\n3번 상차', '1 loaded\n2 loaded\n3 loaded'),
            hints: [
                t(
                    'await 를 쓰려면 함수 앞에 무엇이 필요할까요?',
                    'What does a function need in front of it to use await?',
                ),
                'async, await',
            ],
            solution: ['async', 'await'],
        },
        write: {
            prompt: t(
                '<code>async function report()</code> 를 만들어 <code>await fetchStock(…)</code> 으로 립밤·토너 재고를 찍고, 없는 쿠션은 <code>try</code> / <code>catch</code> 로 잡아 "없음: 쿠션" 을 찍어 주세요.',
                'Make <code>async function report()</code> that prints lip balm and toner stock with <code>await fetchStock(…)</code>, and catches the missing cushion with <code>try</code> / <code>catch</code> to print "Missing: cushion".',
            ),
            starter: `function fetchStock(item) {
  const table = { "${t('립밤', 'lip balm')}": 3, "${t('토너', 'toner')}": 0 };
  return new Promise((resolve, reject) => {
    setTimeout(() => (item in table ? resolve(table[item]) : reject(new Error(item))), 30);
  });
}

// ${t('여기에 report 를 만들고 불러 보세요', 'Make report here and call it')}
`,
            expected: t('립밤: 3\n토너: 0\n없음: 쿠션', 'lip balm: 3\ntoner: 0\nMissing: cushion'),
            mustInclude: [
                {
                    re: 'async\\s+function\\s+report|report\\s*=\\s*async',
                    msg: t(
                        '<code>async function report()</code> 를 만들어 주세요.',
                        'Make <code>async function report()</code>.',
                    ),
                },
                {
                    re: 'await\\s+fetchStock',
                    msg: t(
                        '<code>await fetchStock(…)</code> 으로 받아 주세요.',
                        'Receive with <code>await fetchStock(…)</code>.',
                    ),
                },
                {
                    re: 'catch',
                    msg: t(
                        '<code>try</code> / <code>catch</code> 로 잡아 주세요.',
                        'Catch it with <code>try</code> / <code>catch</code>.',
                    ),
                },
            ],
            hints: [
                t(
                    'console.log("립밤: " + (await fetchStock("립밤")));',
                    'console.log("lip balm: " + (await fetchStock("lip balm")));',
                ),
                t(
                    'try { await fetchStock("쿠션"); } catch (e) { console.log("없음: " + e.message); }',
                    'try { await fetchStock("cushion"); } catch (e) { console.log("Missing: " + e.message); }',
                ),
            ],
            solution: `function fetchStock(item) {
  const table = { "${t('립밤', 'lip balm')}": 3, "${t('토너', 'toner')}": 0 };
  return new Promise((resolve, reject) => {
    setTimeout(() => (item in table ? resolve(table[item]) : reject(new Error(item))), 30);
  });
}

async function report() {
  console.log("${t('립밤: ', 'lip balm: ')}" + (await fetchStock("${t('립밤', 'lip balm')}")));
  console.log("${t('토너: ', 'toner: ')}" + (await fetchStock("${t('토너', 'toner')}")));
  try {
    await fetchStock("${t('쿠션', 'cushion')}");
  } catch (e) {
    console.log("${t('없음: ', 'Missing: ')}" + e.message);
  }
}
report();`,
        },
        learned: [
            t(
                '<code>async function</code> 안에서 <code>await</code>',
                '<code>await</code> inside an <code>async function</code>',
            ),
            t('<code>await</code> 는 Promise 의 값을 돌려줌', "<code>await</code> gives back the Promise's value"),
            t(
                '실패는 <code>try</code> / <code>catch</code> 로',
                'Handle failure with <code>try</code> / <code>catch</code>',
            ),
        ],
    },
];
