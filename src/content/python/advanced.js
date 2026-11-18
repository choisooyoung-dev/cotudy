// Python quests beyond the basics (after 1회차): comprehensions, lambda/sorted, enumerate/zip, function arguments,
// closures, decorators, generators, inheritance, special methods, custom exceptions/with. One quest = one concept.
// Stages are the Python-only ones in ../stages.js. Korean and English side by side via t('한국어', 'English').
// Explained only in Python terms. Every example, predict, fill and write solution was run for real
// (scripts/daily-check.mjs checks them daily).
import { tr as t } from '../../i18n.js';

const P = () => t('이 코드를 실행하면 어떻게 찍힐까요?', 'What will this code print?');
const W = t('# 여기에 코드를 쓰세요\n', '# Write your code here\n');

export const QUESTS = [
    // ───────────── 출고장 · 오팀원 · 데이터 다루기 ─────────────
    {
        id: 'py-comprehension',
        stage: 'py-data',
        npc: 'oh',
        title: t('출고 목록 한 줄로 만들기', 'The shipping list in one line'),
        request: [
            t(
                '무게 목록에서 요금 목록도 만들고, 무거운 것만 골라낸 목록도 필요해요.',
                'From the weight list I need a fee list, and a list of just the heavy ones.',
            ),
            t(
                'for 문을 몇 줄씩 쓰지 않고 짧게 만들 수 있을까요?',
                'Can I make them short, without several lines of for loops?',
            ),
        ],
        thanks: t('한 줄로 바로 새 목록이 나오네요!', 'A new list in a single line!'),
        concepts: [
            {
                title: t('리스트 컴프리헨션', 'List comprehensions'),
                body: t(
                    '<code>[식 for 변수 in 목록]</code> 은 칸마다 식을 계산한 <b>새 리스트</b>예요. 뒤에 <code>if 조건</code> 을 붙이면 조건에 맞는 칸만 남아요.',
                    '<code>[expr for var in list]</code> is a <b>new list</b> with expr worked out for every item. Add <code>if condition</code> at the end to keep only matching items.',
                ),
                code: 'kgs = [2, 15, 3, 22]\nfees = [kg * 1000 for kg in kgs]\nheavy = [kg for kg in kgs if kg >= 10]\nprint(fees)\nprint(heavy)',
            },
            {
                title: t('딕셔너리 컴프리헨션', 'Dict comprehensions'),
                body: t(
                    '<code>{키: 값 for 변수 in 목록}</code> 으로 딕셔너리도 한 줄로 만들어요. <code>if</code> 도 똑같이 붙일 수 있어요.',
                    '<code>{key: value for var in list}</code> builds a dict in one line too. <code>if</code> works the same way.',
                ),
                code: `items = ["${t('립밤', 'balm')}", "${t('토너', 'toner')}", "${t('쿠션', 'cushion')}"]
stock = {name: 0 for name in items}
lens = {name: len(name) for name in items if name != "${t('토너', 'toner')}"}
print(stock)
print(lens)`,
            },
        ],
        predict: {
            prompt: P(),
            code: 'nums = [1, 2, 3, 4, 5]\nr = [n * 10 for n in nums if n % 2 == 1]\nprint(r)',
            choices: ['[10, 30, 50]', '[20, 40]', '[1, 3, 5]', '[10, 20, 30, 40, 50]'],
            answer: 0,
            explain: t('홀수 1, 3, 5 만 남고 10 을 곱해요.', 'Only the odd 1, 3 and 5 remain, times 10.'),
        },
        fill: {
            prompt: t('10kg 미만 주문의 번호만 모으세요.', 'Collect the ids of the orders under 10kg.'),
            code: 'orders = [("A1", 3), ("A2", 12), ("A3", 8)]\nids = [{{0}} for oid, kg in orders {{1}} kg < 10]\nprint(ids)',
            blanks: [{ size: 3 }, { size: 2 }],
            expected: "['A1', 'A3']",
            hints: [t('모을 것은 주문 번호(oid), 고르는 건 if.', 'Collect the id (oid); picking uses if.'), 'oid, if'],
            solution: ['oid', 'if'],
        },
        write: {
            prompt: t(
                '10kg 이상인 박스만 골라 kg × 500 요금 리스트를 컴프리헨션으로 만들어 찍어 주세요.',
                'Use a comprehension to make a list of kg × 500 fees for boxes of 10kg or more, and print it.',
            ),
            starter: `kgs = [4, 18, 7, 25]\n${W}`,
            expected: t('요금: [9000, 12500]', 'Fees: [9000, 12500]'),
            mustInclude: [
                {
                    re: '\\[[^\\]]+\\bfor\\b[^\\]]+\\bin\\b[^\\]]+\\]',
                    msg: t(
                        '<code>[… for … in …]</code> 컴프리헨션으로 만들어 주세요.',
                        'Make it with a <code>[… for … in …]</code> comprehension.',
                    ),
                },
            ],
            hints: [
                'fees = [kg * 500 for kg in kgs if kg >= 10]',
                t('print(f"요금: {fees}")', 'print(f"Fees: {fees}")'),
            ],
            solution: `kgs = [4, 18, 7, 25]\nfees = [kg * 500 for kg in kgs if kg >= 10]\nprint(f"${t('요금', 'Fees')}: {fees}")`,
        },
        learned: [
            t('<code>[식 for x in 목록]</code>', '<code>[expr for x in list]</code>'),
            t('뒤에 <code>if 조건</code> 으로 고르기', 'Pick with <code>if condition</code> at the end'),
            t('<code>{키: 값 for x in 목록}</code>', '<code>{key: value for x in list}</code>'),
        ],
    },
    {
        id: 'py-lambda-sort',
        stage: 'py-data',
        npc: 'oh',
        title: t('무게순으로 줄 세우기', 'Lining up by weight'),
        request: [
            t(
                '트럭 목록을 무게순으로 세우고, 제일 무거운 트럭도 찾아야 해요.',
                'I need the truck list in weight order, and the heaviest truck.',
            ),
            t(
                '목록 안에 (이름, 무게) 가 들어 있어서 그냥 정렬이 안 돼요.',
                "Each item is (name, weight), so a plain sort doesn't work.",
            ),
        ],
        thanks: t('기준만 알려 주면 알아서 줄 서네요!', 'Just give it the rule and it lines up on its own!'),
        concepts: [
            {
                title: t('<code>sorted</code> 와 <code>key</code>', '<code>sorted</code> and <code>key</code>'),
                body: t(
                    '<code>sorted(목록)</code> 은 정렬된 <b>새 리스트</b>예요. <code>reverse=True</code> 면 큰 순, <code>key=함수</code> 를 주면 그 함수가 돌려준 값을 기준으로 정렬해요.',
                    '<code>sorted(list)</code> is a sorted <b>new list</b>. <code>reverse=True</code> gives largest first, and <code>key=function</code> sorts by what that function returns.',
                ),
                code: `kgs = [12, 3, 25, 8]
print(sorted(kgs))
print(sorted(kgs, reverse=True))
names = [${t('"한빛로지스", "번개", "새벽배송"', '"Lightning", "Dawn", "Hanbit"')}]
print(sorted(names, key=len))`,
            },
            {
                title: t(
                    '<code>lambda</code>: 이름 없는 짧은 함수',
                    '<code>lambda</code>: a short function with no name',
                ),
                body: t(
                    '<code>lambda 매개변수: 결과</code> 는 한 줄짜리 함수예요. <code>key=lambda t: t[1]</code> 처럼 정렬 기준을 바로 적을 때 써요. <code>max</code> / <code>min</code> 에도 <code>key</code> 를 줄 수 있어요.',
                    '<code>lambda params: result</code> is a one-line function. Use it to write a sort rule on the spot, like <code>key=lambda t: t[1]</code>. <code>max</code> / <code>min</code> take <code>key</code> too.',
                ),
                code: `trucks = [("${t('1호차', 'Truck1')}", 800), ("${t('2호차', 'Truck2')}", 300), ("${t('3호차', 'Truck3')}", 500)]
light = sorted(trucks, key=lambda t: t[1])
print(light[0])
heavy = max(trucks, key=lambda t: t[1])
print(heavy[0])
double = lambda n: n * 2
print(double(21))`,
            },
        ],
        predict: {
            prompt: P(),
            code: 'words = ["bb", "a", "ccc"]\nprint(sorted(words, key=lambda w: -len(w)))',
            choices: ["['ccc', 'bb', 'a']", "['a', 'bb', 'ccc']", "['bb', 'a', 'ccc']", "['ccc', 'a', 'bb']"],
            answer: 0,
            explain: t(
                '-len(w) 이 작은 것부터라서, 글자가 긴 것이 먼저 와요.',
                'It sorts by -len(w) smallest first, so longer words come first.',
            ),
        },
        fill: {
            prompt: t(
                '가벼운 순서로 줄 세우고, 가장 무거운 박스를 찾으세요.',
                'Sort lightest first, and find the heaviest box.',
            ),
            code: 'boxes = [{"id": "A", "kg": 7}, {"id": "B", "kg": 2}, {"id": "C", "kg": 9}]\norder = sorted(boxes, {{0}}=lambda b: b["kg"])\nprint([b["id"] for b in order])\nprint(max(boxes, key={{1}} b: b["kg"])["id"])',
            blanks: [{ size: 3 }, { size: 6 }],
            expected: "['B', 'A', 'C']\nC",
            hints: [
                t(
                    '정렬 기준을 주는 이름, 그리고 짧은 함수를 만드는 키워드.',
                    'The name that gives the sort rule, and the keyword for a short function.',
                ),
                'key, lambda',
            ],
            solution: ['key', 'lambda'],
        },
        write: {
            prompt: t(
                '주문을 금액이 큰 순서로 정렬해서(<code>lambda</code>) 주문 번호를 한 줄에 찍어 주세요.',
                'Sort the orders by amount, largest first (<code>lambda</code>), and print the order ids on one line.',
            ),
            starter: `orders = [("A-1", 12000), ("A-2", 8000), ("A-3", 30000)]\n${W}`,
            expected: 'A-3 A-1 A-2',
            mustInclude: [
                {
                    re: 'lambda',
                    msg: t('<code>lambda</code> 로 기준을 주세요.', 'Give the rule with <code>lambda</code>.'),
                },
                {
                    re: 'sorted\\s*\\(|\\.sort\\s*\\(',
                    msg: t('<code>sorted</code> 로 정렬해 주세요.', 'Sort with <code>sorted</code>.'),
                },
            ],
            hints: ['top = sorted(orders, key=lambda o: o[1], reverse=True)', 'print(" ".join([o[0] for o in top]))'],
            solution:
                'orders = [("A-1", 12000), ("A-2", 8000), ("A-3", 30000)]\ntop = sorted(orders, key=lambda o: o[1], reverse=True)\nprint(" ".join([o[0] for o in top]))',
        },
        learned: [
            t('<code>sorted(목록, key=…, reverse=True)</code>', '<code>sorted(list, key=…, reverse=True)</code>'),
            t('<code>lambda x: 결과</code>', '<code>lambda x: result</code>'),
            t('<code>max(목록, key=…)</code>', '<code>max(list, key=…)</code>'),
        ],
    },
    {
        id: 'py-zip',
        stage: 'py-data',
        npc: 'oh',
        title: t('두 목록 짝 맞추기', 'Pairing up two lists'),
        request: [
            t(
                '주문 번호 목록이랑 무게 목록이 따로 와요. 같은 자리끼리 짝지어야 해요.',
                'Order ids and weights come as separate lists. I need to pair them by position.',
            ),
            t('번호도 1번부터 붙이고 싶고요.', 'And number them from 1, too.'),
        ],
        thanks: t('짝도 맞고 번호도 붙고, 깔끔해요!', 'Paired and numbered. Neat!'),
        concepts: [
            {
                title: t('<code>enumerate</code>: 번호와 함께', '<code>enumerate</code>: with numbers'),
                body: t(
                    '<code>for i, x in enumerate(목록, start=1):</code> 은 번호와 값을 같이 꺼내요. <code>start</code> 를 안 주면 0 부터예요.',
                    '<code>for i, x in enumerate(list, start=1):</code> gives the number and the value together. Without <code>start</code> it begins at 0.',
                ),
                code: `couriers = [${t('"번개택배", "한빛로지스", "새벽배송"', '"Lightning", "Hanbit", "Dawn"')}]
for i, name in enumerate(couriers, start=1):
    print(f"{i}. {name}")`,
            },
            {
                title: t('<code>zip</code> 과 나눠 담기', '<code>zip</code> and unpacking'),
                body: t(
                    '<code>zip(a, b)</code> 는 같은 자리끼리 <code>(a값, b값)</code> 으로 묶어요. 짧은 쪽에 맞춰 끝나요. <code>x, y = 값1, 값2</code> 처럼 여러 변수에 나눠 담을 수 있어서, 두 값 바꾸기도 한 줄이에요.',
                    '<code>zip(a, b)</code> pairs items by position as <code>(a_item, b_item)</code>, stopping at the shorter one. You can unpack into several variables, <code>x, y = v1, v2</code>, so swapping two values is one line.',
                ),
                code: 'ids = ["A1", "A2", "A3"]\nkgs = [3, 12, 8]\nfor oid, kg in zip(ids, kgs):\n    print(oid, kg)\na, b = 10, 20\na, b = b, a\nprint(a, b)',
            },
        ],
        predict: {
            prompt: P(),
            code: 'names = ["a", "b", "c"]\nnums = [1, 2]\nprint(list(zip(names, nums)))',
            choices: [
                "[('a', 1), ('b', 2)]",
                "[('a', 1), ('b', 2), ('c', None)]",
                "[('a', 'b'), (1, 2)]",
                "['a1', 'b2']",
            ],
            answer: 0,
            explain: t(
                'zip 은 짧은 쪽(2개)에 맞춰서 끝나요. "c" 는 짝이 없어서 빠져요.',
                'zip stops at the shorter list (2 items). "c" has no partner, so it\'s left out.',
            ),
        },
        fill: {
            prompt: t(
                '상품과 수량을 짝지어 번호와 함께 찍으세요.',
                'Pair products with quantities and print them with numbers.',
            ),
            code: `items = ["${t('립밤', 'balm')}", "${t('토너', 'toner')}"]\nqtys = [3, 5]\nfor {{0}}, (name, q) in enumerate({{1}}(items, qtys), start=1):\n    print(f"{i}: {name} x{q}")`,
            blanks: [{ size: 2 }, { size: 4 }],
            expected: t('1: 립밤 x3\n2: 토너 x5', '1: balm x3\n2: toner x5'),
            hints: [
                t(
                    '아래 print 에서 쓰는 번호 변수 이름, 그리고 짝짓는 함수.',
                    'The number variable used in the print, and the pairing function.',
                ),
                'i, zip',
            ],
            solution: ['i', 'zip'],
        },
        write: {
            prompt: t(
                '<code>zip</code> 으로 요일과 박스 수를 짝지어 한 줄씩 찍고, 마지막에 합계를 찍어 주세요.',
                'Pair days and box counts with <code>zip</code>, print one line each, then print the total.',
            ),
            starter: `days = [${t('"월", "화", "수"', '"Mon", "Tue", "Wed"')}]\nboxes = [120, 95, 140]\n${W}`,
            expected: t('월 120\n화 95\n수 140\n합계 355', 'Mon 120\nTue 95\nWed 140\nTotal 355'),
            mustInclude: [
                {
                    re: 'zip\\s*\\(',
                    msg: t('<code>zip</code> 으로 짝지어 주세요.', 'Pair them with <code>zip</code>.'),
                },
            ],
            hints: [
                'for d, b in zip(days, boxes):\n    print(d, b)',
                t('print("합계", sum(boxes))', 'print("Total", sum(boxes))'),
            ],
            solution: `days = [${t('"월", "화", "수"', '"Mon", "Tue", "Wed"')}]\nboxes = [120, 95, 140]\nfor d, b in zip(days, boxes):\n    print(d, b)\nprint("${t('합계', 'Total')}", sum(boxes))`,
        },
        learned: [
            t(
                '<code>enumerate(목록, start=1)</code> → 번호와 값',
                '<code>enumerate(list, start=1)</code> → number and value',
            ),
            t('<code>zip(a, b)</code> → 같은 자리끼리 짝', '<code>zip(a, b)</code> → pairs by position'),
            t('<code>a, b = b, a</code> 나눠 담기', 'Unpacking: <code>a, b = b, a</code>'),
        ],
    },

    // ───────────── 지게차 통로 · 최기사 · 함수 더 깊이 ─────────────
    {
        id: 'py-args',
        stage: 'py-func',
        npc: 'choi',
        title: t('편하게 부르는 함수', 'Functions that are easy to call'),
        request: [
            t(
                '운송비 함수를 부를 때마다 값을 전부 넣기가 번거로워요.',
                'Passing every value each time I call the fee function is a hassle.',
            ),
            t(
                '보통은 기본값을 쓰고, 필요할 때만 바꿀 수 있으면 좋겠어요.',
                "I'd like it to use defaults normally and change them only when needed.",
            ),
        ],
        thanks: t('필요한 것만 넣어 부르니까 훨씬 편해요!', 'Calling it with only what I need is so much easier!'),
        concepts: [
            {
                title: t('기본값과 키워드 인자', 'Default values and keyword arguments'),
                body: t(
                    '<code>def fee(kg, per=100):</code> 처럼 매개변수에 기본값을 주면, 부를 때 빼도 돼요. 부를 때 <code>express=True</code> 처럼 <b>이름을 붙여</b> 넘기면 순서와 상관없이 그 매개변수에 들어가요.',
                    'Give a parameter a default, like <code>def fee(kg, per=100):</code>, and callers can leave it out. Passing it <b>by name</b>, like <code>express=True</code>, puts it in that parameter regardless of order.',
                ),
                code: 'def fee(kg, per=100, express=False):\n    total = kg * per\n    if express:\n        total += 3000\n    return total\n\nprint(fee(10))\nprint(fee(10, 150))\nprint(fee(10, express=True))',
            },
            {
                title: t('<code>*args</code> 와 <code>**kwargs</code>', '<code>*args</code> and <code>**kwargs</code>'),
                body: t(
                    '<code>*kgs</code> 는 넘긴 값 여러 개를 <b>튜플</b>로 받아요. <code>**info</code> 는 이름 붙여 넘긴 값들을 <b>딕셔너리</b>로 받아요. 몇 개를 넘길지 정해지지 않았을 때 써요.',
                    "<code>*kgs</code> takes any number of values as a <b>tuple</b>. <code>**info</code> takes named values as a <b>dict</b>. Use them when the number of arguments isn't fixed.",
                ),
                code: 'def total(*kgs):\n    return sum(kgs)\n\ndef label(**info):\n    return ", ".join([f"{k}={v}" for k, v in info.items()])\n\nprint(total(3, 5, 2))\nprint(label(id="A1", kg=3))',
            },
        ],
        predict: {
            prompt: P(),
            code: `def pack(item, qty=1, *extra):\n    return f"{item}x{qty} {len(extra)}"\n\nprint(pack("${t('토너', 'toner')}"))\nprint(pack("${t('립밤', 'balm')}", 3, "${t('뽁뽁이', 'wrap')}", "${t('상자', 'box')}"))`,
            choices: [
                t('토너x1 0\n립밤x3 2', 'tonerx1 0\nbalmx3 2'),
                t('토너x1 0\n립밤x3 4', 'tonerx1 0\nbalmx3 4'),
                t('토너x0 0\n립밤x3 2', 'tonerx0 0\nbalmx3 2'),
                t('토너x1 1\n립밤x3 2', 'tonerx1 1\nbalmx3 2'),
            ],
            answer: 0,
            explain: t(
                'qty 를 안 넘기면 기본값 1. 세 번째부터는 extra 튜플에 들어가서 2개예요.',
                'Without qty the default 1 is used. From the third value on they go into the extra tuple: 2 of them.',
            ),
        },
        fill: {
            prompt: t(
                '박스 무게는 몇 개든 받고, 택배사는 이름으로 바꿀 수 있게 하세요.',
                'Take any number of box weights, and let the courier be changed by name.',
            ),
            code: `def ship(*boxes, {{0}}="${t('번개', 'Bolt')}"):\n    return f"{courier}: {len(boxes)}${t('박스', ' boxes')}, {sum(boxes)}kg"\n\nprint(ship(3, 5, 2))\nprint(ship(10, {{1}}="${t('한빛', 'Hanbit')}"))`,
            blanks: [{ size: 7 }, { size: 7 }],
            expected: t('번개: 3박스, 10kg\n한빛: 1박스, 10kg', 'Bolt: 3 boxes, 10kg\nHanbit: 1 boxes, 10kg'),
            hints: [
                t(
                    '함수 안에서 쓰는 이름과 같아야 해요. 부를 때도 그 이름을 붙여요.',
                    'It must match the name used inside. Use the same name when calling.',
                ),
                'courier, courier',
            ],
            solution: ['courier', 'courier'],
        },
        write: {
            prompt: t(
                '<code>order(item, qty=1, **opts)</code> 를 만들어 주세요. "상품 xN" 뒤에 opts 의 항목마다 " [키=값]" 을 붙여 돌려줘요.',
                'Make <code>order(item, qty=1, **opts)</code>. It returns "item xN" followed by " [key=value]" for each entry in opts.',
            ),
            starter: `${W}\nprint(order("${t('토너', 'toner')}"))\nprint(order("${t('립밤', 'balm')}", 2, gift="yes"))\n`,
            expected: t('토너 x1\n립밤 x2 [gift=yes]', 'toner x1\nbalm x2 [gift=yes]'),
            mustInclude: [
                {
                    re: 'def\\s+order\\s*\\(',
                    msg: t('<code>def order(…)</code> 를 만들어 주세요.', 'Make <code>def order(…)</code>.'),
                },
                {
                    re: '\\*\\*\\w+',
                    msg: t('<code>**opts</code> 로 받아 주세요.', 'Take them with <code>**opts</code>.'),
                },
            ],
            hints: [
                'def order(item, qty=1, **opts):\n    s = f"{item} x{qty}"',
                'for k, v in opts.items():\n        s += f" [{k}={v}]"\n    return s',
            ],
            solution: `def order(item, qty=1, **opts):\n    s = f"{item} x{qty}"\n    for k, v in opts.items():\n        s += f" [{k}={v}]"\n    return s\n\nprint(order("${t('토너', 'toner')}"))\nprint(order("${t('립밤', 'balm')}", 2, gift="yes"))`,
        },
        learned: [
            t('기본값 <code>def f(a, b=1)</code>', 'Defaults <code>def f(a, b=1)</code>'),
            t('이름 붙여 넘기기 <code>f(1, b=5)</code>', 'Pass by name <code>f(1, b=5)</code>'),
            t(
                '<code>*args</code> → 튜플, <code>**kwargs</code> → 딕셔너리',
                '<code>*args</code> → tuple, <code>**kwargs</code> → dict',
            ),
        ],
    },
    {
        id: 'py-closure',
        stage: 'py-func',
        npc: 'choi',
        title: t('지게차마다 따로 세는 카운터', 'A counter for each forklift'),
        request: [
            t(
                '지게차가 두 대인데, 각자 운행 횟수를 따로 세고 싶어요.',
                "We have two forklifts and I want to count each one's trips separately.",
            ),
            t('전역 변수 하나로는 섞여 버리더라고요.', 'One global variable mixes them up.'),
        ],
        thanks: t('지게차마다 자기 숫자를 기억하네요. 신기해요!', 'Each forklift remembers its own number. Neat!'),
        concepts: [
            {
                title: t('함수를 돌려주는 함수', 'A function that returns a function'),
                body: t(
                    '함수 안에 함수를 만들고, 그 함수를 <code>return</code> 할 수 있어요. 돌려받은 함수는 변수에 담아 두고 나중에 불러요.',
                    'You can define a function inside a function and <code>return</code> it. Store the returned function and call it later.',
                ),
                code: `def make_greeter(name):\n    def greet():\n        return name + "${t('님 안녕하세요', ', hello')}"\n    return greet\n\nhi = make_greeter("${t('최기사', 'Choi')}")\nprint(hi())`,
            },
            {
                title: t('클로저와 <code>nonlocal</code>', 'Closures and <code>nonlocal</code>'),
                body: t(
                    '안쪽 함수는 바깥 함수의 변수를 기억해요. 이걸 <b>클로저</b>라고 해요. 그 변수를 <b>바꾸려면</b> 안쪽에서 <code>nonlocal 변수</code> 라고 적어야 해요. <code>make_counter()</code> 를 부를 때마다 count 가 새로 생겨서 카운터마다 따로예요.',
                    "The inner function remembers the outer function's variables: a <b>closure</b>. To <b>change</b> one, write <code>nonlocal name</code> inside. Every call to <code>make_counter()</code> makes a new count, so each counter is separate.",
                ),
                code: 'def make_counter():\n    count = 0\n    def add():\n        nonlocal count\n        count += 1\n        return count\n    return add\n\ntruck1 = make_counter()\ntruck2 = make_counter()\ntruck1()\ntruck1()\nprint(truck1())\nprint(truck2())',
            },
        ],
        predict: {
            prompt: P(),
            code: 'def make_adder(base):\n    return lambda n: base + n\n\nadd10 = make_adder(10)\nadd5 = make_adder(5)\nprint(add10(1) + add5(1))',
            choices: ['17', '16', '11', '22'],
            answer: 0,
            explain: t(
                'add10(1) 은 11, add5(1) 은 6. 각자 자기 base 를 기억해요.',
                'add10(1) is 11 and add5(1) is 6. Each remembers its own base.',
            ),
        },
        fill: {
            prompt: t('카운터를 완성해서 운행 2회가 찍히게 하세요.', 'Finish the counter so it prints 2 trips.'),
            code: `def make_counter():\n    count = 0\n    def add():\n        {{0}} count\n        count += 1\n        return count\n    return {{1}}\n\nforklift = make_counter()\nforklift()\nprint(f"${t('운행: ', 'Trips: ')}{forklift()}${t('회', '')}")`,
            blanks: [{ size: 8 }, { size: 3 }],
            expected: t('운행: 2회', 'Trips: 2'),
            hints: [
                t(
                    '바깥 변수를 바꾸려면 적는 키워드, 그리고 돌려줄 안쪽 함수 이름.',
                    "The keyword to change an outer variable, and the inner function's name to return.",
                ),
                'nonlocal, add',
            ],
            solution: ['nonlocal', 'add'],
        },
        write: {
            prompt: t(
                '<code>make_loader(limit)</code> 를 만들어 주세요. 돌려주는 함수는 kg 를 받아, 지금까지 실은 무게에 더해도 limit 이하면 더하고 "OK", 넘으면 더하지 않고 "초과" 를 돌려줘요.',
                'Make <code>make_loader(limit)</code>. The returned function takes kg: if the total so far plus kg stays within limit, add it and return "OK"; otherwise don\'t add it and return "Over".',
            ),
            starter: `${t('# make_loader 를 여기에 만드세요', '# Make make_loader here')}\n\nload = make_loader(1000)\nprint(load(600))\nprint(load(300))\nprint(load(200))\n`,
            expected: t('OK\nOK\n초과', 'OK\nOK\nOver'),
            mustInclude: [
                {
                    re: 'def\\s+make_loader',
                    msg: t('<code>make_loader</code> 를 만들어 주세요.', 'Make <code>make_loader</code>.'),
                },
                {
                    re: 'nonlocal',
                    msg: t(
                        '바깥 변수를 바꾸려면 <code>nonlocal</code> 이 필요해요.',
                        'Changing the outer variable needs <code>nonlocal</code>.',
                    ),
                },
            ],
            hints: [
                t(
                    'make_loader 안에 total = 0 과 안쪽 함수를 두고 return 해요.',
                    'Put total = 0 and an inner function in make_loader, and return it.',
                ),
                t(
                    'if total + kg > limit:\n            return "초과"',
                    'if total + kg > limit:\n            return "Over"',
                ),
            ],
            solution: `def make_loader(limit):\n    total = 0\n    def load(kg):\n        nonlocal total\n        if total + kg > limit:\n            return "${t('초과', 'Over')}"\n        total += kg\n        return "OK"\n    return load\n\nload = make_loader(1000)\nprint(load(600))\nprint(load(300))\nprint(load(200))`,
        },
        learned: [
            t('함수 안의 함수를 돌려주기', 'Returning an inner function'),
            t('클로저: 바깥 변수를 기억', 'Closure: remembers outer variables'),
            t('바꾸려면 <code>nonlocal</code>', 'To change it, <code>nonlocal</code>'),
        ],
    },
    {
        id: 'py-decorator',
        stage: 'py-func',
        npc: 'choi',
        title: t('기록을 남기는 장식', 'A decoration that keeps a log'),
        request: [
            t(
                '계산 함수들이 언제 불렸는지 기록을 남기고 싶어요.',
                'I want a log of when the calculation functions are called.',
            ),
            t(
                '함수마다 print 를 넣긴 싫은데, 한 번에 씌울 수 있을까요?',
                "I don't want to add print to each one. Can I wrap them all at once?",
            ),
        ],
        thanks: t('@ 한 줄로 기록이 붙네요. 깔끔해요!', 'One @ line and the log is attached. Tidy!'),
        concepts: [
            {
                title: t('함수를 감싸는 함수', 'A function that wraps a function'),
                body: t(
                    '함수를 받아서, 그 함수를 부르는 <b>새 함수(wrapper)</b>를 돌려줄 수 있어요. 원래 함수 앞뒤에 일을 더할 수 있죠.',
                    'A function can take a function and return a <b>new function (wrapper)</b> that calls it, adding work before or after.',
                ),
                code: `def shout(fn):\n    def wrapper():\n        return fn() + "!"\n    return wrapper\n\ndef hello():\n    return "${t('출고', 'Ship')}"\n\nloud = shout(hello)\nprint(loud())`,
            },
            {
                title: t('데코레이터 <code>@</code>', 'Decorators <code>@</code>'),
                body: t(
                    '함수 위에 <code>@log</code> 라고 쓰면 <code>fee = log(fee)</code> 와 같아요. 이걸 <b>데코레이터</b>라고 해요. wrapper 가 <code>*args</code> 로 받아 넘기면 매개변수가 있는 함수도 감쌀 수 있어요.',
                    'Writing <code>@log</code> above a function is the same as <code>fee = log(fee)</code>. This is a <b>decorator</b>. If the wrapper takes and passes <code>*args</code>, it can wrap functions with parameters.',
                ),
                code: `def log(fn):\n    def wrapper(*args):\n        print(f"[${t('기록', 'log')}] {fn.__name__} ${t('시작', 'start')}")\n        result = fn(*args)\n        print(f"[${t('기록', 'log')}] ${t('결과', 'result')} {result}")\n        return result\n    return wrapper\n\n@log\ndef fee(kg):\n    return kg * 100\n\nfee(5)`,
            },
        ],
        predict: {
            prompt: P(),
            code: 'def twice(fn):\n    def wrapper(n):\n        return fn(fn(n))\n    return wrapper\n\n@twice\ndef add3(n):\n    return n + 3\n\nprint(add3(1))',
            choices: ['7', '4', '10', '6'],
            answer: 0,
            explain: t(
                '@twice 때문에 add3 이 두 번 불려요. 1 + 3 + 3 = 7.',
                '@twice makes add3 run twice: 1 + 3 + 3 = 7.',
            ),
        },
        fill: {
            prompt: t(
                '0 으로 나누면 에러 대신 안내를 돌려주는 데코레이터를 씌우세요.',
                'Put on a decorator that returns a notice instead of an error when dividing by 0.',
            ),
            code: `def safe(fn):\n    def wrapper(*args):\n        try:\n            return fn(*args)\n        except ZeroDivisionError:\n            return "${t('나눌 수 없음', 'Cannot divide')}"\n    return {{0}}\n\n{{1}}safe\ndef per_box(total, boxes):\n    return total // boxes\n\nprint(per_box(100, 4))\nprint(per_box(100, 0))`,
            blanks: [{ size: 7 }, { size: 2 }],
            expected: t('25\n나눌 수 없음', '25\nCannot divide'),
            hints: [
                t(
                    'safe 가 돌려줄 것은 안쪽 함수. 데코레이터를 씌우는 기호는?',
                    'safe must return the inner function. Which symbol puts a decorator on?',
                ),
                'wrapper, @',
            ],
            solution: ['wrapper', '@'],
        },
        write: {
            prompt: t(
                '<code>count_calls</code> 데코레이터를 만들어 주세요. 함수가 불릴 때마다 "N번째 호출" 을 먼저 찍고, 원래 함수의 결과를 돌려줘요 (<code>nonlocal</code> 로 횟수 세기).',
                'Make a <code>count_calls</code> decorator. Each time the function is called it first prints "call N", then returns the original result (count with <code>nonlocal</code>).',
            ),
            starter: `${t('# count_calls 를 여기에 만드세요', '# Make count_calls here')}\n\n@count_calls\ndef load(kg):\n    return f"{kg}${t('kg 실음', 'kg loaded')}"\n\nprint(load(100))\nprint(load(200))\n`,
            expected: t('1번째 호출\n100kg 실음\n2번째 호출\n200kg 실음', 'call 1\n100kg loaded\ncall 2\n200kg loaded'),
            mustInclude: [
                {
                    re: 'def\\s+count_calls',
                    msg: t('<code>count_calls</code> 를 만들어 주세요.', 'Make <code>count_calls</code>.'),
                },
                {
                    re: 'nonlocal',
                    msg: t('횟수는 <code>nonlocal</code> 로 세어 주세요.', 'Count with <code>nonlocal</code>.'),
                },
            ],
            hints: [
                'def count_calls(fn):\n    n = 0\n    def wrapper(*args):\n        nonlocal n\n        n += 1',
                t(
                    '        print(f"{n}번째 호출")\n        return fn(*args)\n    return wrapper',
                    '        print(f"call {n}")\n        return fn(*args)\n    return wrapper',
                ),
            ],
            solution: `def count_calls(fn):\n    n = 0\n    def wrapper(*args):\n        nonlocal n\n        n += 1\n        print(f"${t('{n}번째 호출', 'call {n}')}")\n        return fn(*args)\n    return wrapper\n\n@count_calls\ndef load(kg):\n    return f"{kg}${t('kg 실음', 'kg loaded')}"\n\nprint(load(100))\nprint(load(200))`,
        },
        learned: [
            t('함수를 받아 wrapper 를 돌려주기', 'Take a function, return a wrapper'),
            t('<code>@데코</code> = <code>f = 데코(f)</code>', '<code>@deco</code> = <code>f = deco(f)</code>'),
            t('wrapper 는 <code>*args</code> 로 받아 넘기기', 'The wrapper passes along <code>*args</code>'),
        ],
    },

    // ───────────── 패킹 · 송사원 · 제너레이터 ─────────────
    {
        id: 'py-generator',
        stage: 'py-iter',
        npc: 'song',
        title: t('필요할 때 하나씩 꺼내기', 'One at a time, when needed'),
        request: [
            t(
                '박스 번호를 수천 개 미리 만들어 두면 메모리가 아까워요.',
                'Making thousands of box numbers in advance wastes memory.',
            ),
            t('필요할 때마다 하나씩 만들어 줄 수는 없을까요?', 'Can it make one each time I need one?'),
        ],
        thanks: t('필요한 만큼만 만드니까 가볍고 좋네요!', 'Making only as many as needed. Light and nice!'),
        concepts: [
            {
                title: t('<code>yield</code>: 하나씩 내주기', '<code>yield</code>: handing out one at a time'),
                body: t(
                    '함수 안에 <code>yield 값</code> 이 있으면 <b>제너레이터</b>가 돼요. 부르면 바로 실행되지 않고, <code>for</code> 가 하나 달라고 할 때마다 다음 <code>yield</code> 까지 실행해서 값을 내줘요.',
                    "A function with <code>yield value</code> becomes a <b>generator</b>. Calling it doesn't run it right away; each time a <code>for</code> asks for one, it runs to the next <code>yield</code> and hands out the value.",
                ),
                code: 'def box_numbers(n):\n    for i in range(1, n + 1):\n        yield f"BOX-{i:03}"\n\nfor b in box_numbers(3):\n    print(b)',
            },
            {
                title: t('<code>next</code> 와 제너레이터 식', '<code>next</code> and generator expressions'),
                body: t(
                    '<code>next(제너레이터)</code> 로 하나씩 직접 꺼낼 수도 있어요. <code>(식 for x in 목록)</code> 처럼 괄호로 쓰면 리스트를 만들지 않고 하나씩 흘려보내는 제너레이터 식이에요. <code>sum(...)</code> 같은 함수에 바로 넣어요.',
                    'You can also take one out with <code>next(generator)</code>. Written with parentheses, <code>(expr for x in list)</code> is a generator expression that flows values one at a time without building a list. Put it straight into functions like <code>sum(...)</code>.',
                ),
                code: `def tape_rolls():\n    yield "${t('1번 테이프', 'Tape 1')}"\n    yield "${t('2번 테이프', 'Tape 2')}"\n\ng = tape_rolls()\nprint(next(g))\nprint(next(g))\ntotal = sum(kg * 2 for kg in [3, 5, 2])\nprint(total)`,
            },
        ],
        predict: {
            prompt: P(),
            code: `def count_up():\n    print("${t('시작', 'start')}")\n    yield 1\n    print("${t('중간', 'middle')}")\n    yield 2\n\ng = count_up()\nprint(next(g))\nprint(next(g))`,
            choices: [
                t('시작\n1\n중간\n2', 'start\n1\nmiddle\n2'),
                t('시작\n중간\n1\n2', 'start\nmiddle\n1\n2'),
                '1\n2',
                t('시작\n1\n2', 'start\n1\n2'),
            ],
            answer: 0,
            explain: t(
                'next 를 부를 때마다 다음 yield 까지만 실행돼요. 그래서 "중간" 은 두 번째 next 에서 찍혀요.',
                'Each next runs only to the next yield, so "middle" prints on the second next.',
            ),
        },
        fill: {
            prompt: t(
                '무거운 박스만 하나씩 내주는 제너레이터를 완성하고, 가벼운 박스 무게를 더하세요.',
                "Finish the generator that hands out only heavy boxes, and add up the light boxes' weight.",
            ),
            code: 'def heavy(kgs, limit):\n    for kg in kgs:\n        if kg >= limit:\n            {{0}} kg\n\nprint(list(heavy([4, 12, 7, 20], 10)))\nprint({{1}}(kg for kg in [4, 12, 7, 20] if kg < 10))',
            blanks: [{ size: 5 }, { size: 3 }],
            expected: '[12, 20]\n11',
            hints: [
                t(
                    '하나씩 내주는 키워드, 그리고 다 더하는 함수.',
                    'The keyword that hands out one value, and the function that adds them all.',
                ),
                'yield, sum',
            ],
            solution: ['yield', 'sum'],
        },
        write: {
            prompt: t(
                '<code>labels(prefix, n)</code> 제너레이터를 만들어 "접두어-번호" 를 1부터 n 까지 하나씩 내주게 하고, <code>labels("C", 3)</code> 을 for 로 돌며 찍어 주세요.',
                'Make a <code>labels(prefix, n)</code> generator that yields "prefix-number" from 1 to n, then loop over <code>labels("C", 3)</code> and print each.',
            ),
            starter: W,
            expected: 'C-1\nC-2\nC-3',
            mustInclude: [
                {
                    re: '\\byield\\b',
                    msg: t('<code>yield</code> 로 하나씩 내주세요.', 'Hand them out with <code>yield</code>.'),
                },
            ],
            hints: [
                'def labels(prefix, n):\n    for i in range(1, n + 1):\n        yield f"{prefix}-{i}"',
                'for x in labels("C", 3):\n    print(x)',
            ],
            solution:
                'def labels(prefix, n):\n    for i in range(1, n + 1):\n        yield f"{prefix}-{i}"\n\nfor x in labels("C", 3):\n    print(x)',
        },
        learned: [
            t('<code>yield</code> 가 있으면 제너레이터', 'A function with <code>yield</code> is a generator'),
            t('<code>next(g)</code> 는 다음 yield 까지', '<code>next(g)</code> runs to the next yield'),
            t('<code>sum(x for x in …)</code> 제너레이터 식', 'Generator expression <code>sum(x for x in …)</code>'),
        ],
    },

    // ───────────── 센터장실 · 문센터장 · 클래스 더 깊이 ─────────────
    {
        id: 'py-inherit',
        stage: 'py-class',
        npc: 'moon',
        title: t('파손주의 상품 카드', 'Fragile product cards'),
        request: [
            t(
                '김사원님, 상품 카드에 "파손주의" 상품만 따로 표시하고 싶어요.',
                'Kim, I want the product cards to mark "fragile" products separately.',
            ),
            t(
                '기존 Item 클래스는 그대로 두고 기능만 더할 수 있을까요?',
                'Can we add that without touching the existing Item class?',
            ),
        ],
        thanks: t(
            '물려받아서 늘리니까 기존 코드는 손댈 필요가 없네요!',
            'Building on it by inheritance means no touching the old code!',
        ),
        concepts: [
            {
                title: t('상속 <code>class 자식(부모)</code>', 'Inheritance <code>class Child(Parent)</code>'),
                body: t(
                    '<code>class Fragile(Item):</code> 처럼 괄호 안에 부모 클래스를 적으면, 부모의 <code>__init__</code> 과 메서드를 물려받아요. 아무것도 더하지 않을 땐 <code>pass</code>.',
                    "Put the parent class in parentheses, like <code>class Fragile(Item):</code>, and the child inherits the parent's <code>__init__</code> and methods. Use <code>pass</code> if you add nothing.",
                ),
                code: `class Item:\n    def __init__(self, name):\n        self.name = name\n\n    def label(self):\n        return f"[${t('상품', 'Item')}] {self.name}"\n\nclass Fragile(Item):\n    pass\n\nprint(Fragile("${t('유리병 토너', 'Glass toner')}").label())`,
            },
            {
                title: t('<code>super()</code> 와 덮어쓰기', '<code>super()</code> and overriding'),
                body: t(
                    '자식에서 같은 이름의 메서드를 만들면 부모 것을 <b>덮어써요</b>. 자식 <code>__init__</code> 에서는 <code>super().__init__(…)</code> 로 부모 것도 불러야 부모의 속성이 생겨요.',
                    "A same-named method in the child <b>overrides</b> the parent's. In the child's <code>__init__</code>, call <code>super().__init__(…)</code> so the parent's attributes get set too.",
                ),
                code: `class Item:\n    def __init__(self, name):\n        self.name = name\n\n    def label(self):\n        return f"[${t('상품', 'Item')}] {self.name}"\n\nclass Fragile(Item):\n    def __init__(self, name, level):\n        super().__init__(name)\n        self.level = level\n\n    def label(self):\n        return super().label() + f" (${t('파손주의', 'fragile')} {self.level})"\n\nitems = [Item("${t('립밤', 'Lip balm')}"), Fragile("${t('유리병 토너', 'Glass toner')}", 3)]\nfor it in items:\n    print(it.label())`,
            },
        ],
        predict: {
            prompt: P(),
            code: `class Box:\n    def size(self):\n        return "${t('보통', 'medium')}"\n\nclass BigBox(Box):\n    def size(self):\n        return "${t('큼', 'big')}"\n\na = Box()\nb = BigBox()\nprint(a.size() + "/" + b.size())`,
            choices: [
                t('보통/큼', 'medium/big'),
                t('보통/보통', 'medium/medium'),
                t('큼/큼', 'big/big'),
                t('큼/보통', 'big/medium'),
            ],
            answer: 0,
            explain: t('BigBox 가 size 를 덮어써서 b 만 "큼"이에요.', 'BigBox overrides size, so only b is "big".'),
        },
        fill: {
            prompt: t('냉장 트럭이 트럭을 물려받게 하세요.', 'Make the cold truck inherit from Truck.'),
            code: `class Truck:\n    def __init__(self, no):\n        self.no = no\n\nclass ColdTruck({{0}}):\n    def __init__(self, no, temp):\n        {{1}}().__init__(no)\n        self.temp = temp\n\nt = ColdTruck("${t('냉장 1호', 'Cold 1')}", -5)\nprint(f"{t.no} {t.temp}${t('도', '°C')}")`,
            blanks: [{ size: 5 }, { size: 5 }],
            expected: t('냉장 1호 -5도', 'Cold 1 -5°C'),
            hints: [
                t(
                    '괄호 안에는 부모 클래스 이름, 부모를 부르는 함수는?',
                    'The parent class goes in the parentheses; which function calls the parent?',
                ),
                'Truck, super',
            ],
            solution: ['Truck', 'super'],
        },
        write: {
            prompt: t(
                '<code>Staff</code> 클래스(이름 name, <code>hello()</code> 는 "안녕하세요, 이름")를 만들고, 물려받은 <code>Driver</code>(차 car 추가, hello 는 부모 인사 뒤에 " (차)")를 만들어 윤기사(1톤)의 인사를 찍어 주세요.',
                'Make a <code>Staff</code> class (name; <code>hello()</code> returns "Hello, name") and a <code>Driver</code> that inherits it (adds car; hello is the parent greeting plus " (car)"). Print the greeting of Yoon (1-ton).',
            ),
            starter: `${t('# Staff 와 Driver 를 여기에 만드세요', '# Make Staff and Driver here')}\n\nprint(Driver("${t('윤기사', 'Yoon')}", "${t('1톤', '1-ton')}").hello())\n`,
            expected: t('안녕하세요, 윤기사 (1톤)', 'Hello, Yoon (1-ton)'),
            mustInclude: [
                {
                    re: 'class\\s+Driver\\s*\\(\\s*Staff\\s*\\)',
                    msg: t(
                        '<code>class Driver(Staff):</code> 로 물려받아 주세요.',
                        'Inherit with <code>class Driver(Staff):</code>.',
                    ),
                },
                {
                    re: 'super\\(\\)',
                    msg: t('<code>super()</code> 로 부모를 불러 주세요.', 'Call the parent with <code>super()</code>.'),
                },
            ],
            hints: [
                t(
                    'Driver 의 __init__: super().__init__(name); self.car = car',
                    "Driver's __init__: super().__init__(name); self.car = car",
                ),
                'return super().hello() + f" ({self.car})"',
            ],
            solution: `class Staff:\n    def __init__(self, name):\n        self.name = name\n\n    def hello(self):\n        return "${t('안녕하세요, ', 'Hello, ')}" + self.name\n\nclass Driver(Staff):\n    def __init__(self, name, car):\n        super().__init__(name)\n        self.car = car\n\n    def hello(self):\n        return super().hello() + f" ({self.car})"\n\nprint(Driver("${t('윤기사', 'Yoon')}", "${t('1톤', '1-ton')}").hello())`,
        },
        learned: [
            t('<code>class 자식(부모):</code>', '<code>class Child(Parent):</code>'),
            t(
                '<code>super().__init__(…)</code> 로 부모 초기화',
                'Initialize the parent with <code>super().__init__(…)</code>',
            ),
            t('같은 이름 메서드 = 덮어쓰기', 'Same-named method = override'),
        ],
    },
    {
        id: 'py-dunder',
        stage: 'py-class',
        npc: 'moon',
        title: t('print 하면 보기 좋게 나오는 객체', 'Objects that print nicely'),
        request: [
            t(
                '상자 객체를 print 하면 <__main__.Box object at …> 같은 이상한 글자가 나와요.',
                'Printing a box object shows odd text like <__main__.Box object at …>.',
            ),
            t(
                '사람이 읽기 좋게 나오게 할 수 있어요? len 도 쓰고 싶고요.',
                "Can it show something readable? I'd like len to work too.",
            ),
        ],
        thanks: t('이제 print 만 해도 바로 알아보겠어요!', 'Now I can tell what it is just by printing it!'),
        concepts: [
            {
                title: t('<code>__str__</code>: 글자로 보여 주기', '<code>__str__</code>: how it looks as text'),
                body: t(
                    '<code>__str__</code> 메서드를 만들면 <code>print(객체)</code> 나 f-문자열에서 그 메서드가 돌려준 글자가 나와요. 앞뒤에 밑줄 두 개가 붙은 메서드를 <b>특별 메서드</b>라고 해요.',
                    'Define <code>__str__</code> and <code>print(obj)</code> or an f-string shows the text it returns. Methods with two underscores on each side are <b>special methods</b>.',
                ),
                code: `class Box:\n    def __init__(self, code, kg):\n        self.code = code\n        self.kg = kg\n\n    def __str__(self):\n        return f"{self.code} ({self.kg}kg)"\n\nb = Box("A-1", 3)\nprint(b)\nprint(f"${t('상자', 'Box')}: {b}")`,
            },
            {
                title: t('<code>__len__</code> 과 <code>__eq__</code>', '<code>__len__</code> and <code>__eq__</code>'),
                body: t(
                    '<code>__len__</code> 을 만들면 <code>len(객체)</code> 가, <code>__eq__</code> 를 만들면 <code>==</code> 비교가 그 메서드대로 동작해요.',
                    'Define <code>__len__</code> and <code>len(obj)</code> works; define <code>__eq__</code> and <code>==</code> compares the way you say.',
                ),
                code: 'class Pallet:\n    def __init__(self, boxes):\n        self.boxes = boxes\n\n    def __len__(self):\n        return len(self.boxes)\n\n    def __eq__(self, other):\n        return sum(self.boxes) == sum(other.boxes)\n\na = Pallet([3, 5])\nb = Pallet([4, 4])\nprint(len(a))\nprint(a == b)',
            },
        ],
        predict: {
            prompt: P(),
            code: 'class Tag:\n    def __init__(self, text):\n        self.text = text\n\n    def __str__(self):\n        return "#" + self.text\n\ntags = [Tag("fast"), Tag("cold")]\nprint(tags[0], len(tags))',
            choices: ['#fast 2', 'fast 2', '#fast #cold', 'Tag 2'],
            answer: 0,
            explain: t(
                'print 는 tags[0] 을 __str__ 로 보여 줘서 "#fast", 리스트 길이는 2.',
                'print shows tags[0] through __str__ as "#fast", and the list length is 2.',
            ),
        },
        fill: {
            prompt: t(
                '주문을 print 하면 건수가 보이고, len 으로 건수를 셀 수 있게 하세요.',
                'Make printing an order show its count, and let len count its items.',
            ),
            code: `class Order:\n    def __init__(self, items):\n        self.items = items\n\n    def {{0}}(self):\n        return f"${t('주문({len(self.items)}건)', 'Order({len(self.items)} items)')}"\n\n    def {{1}}(self):\n        return len(self.items)\n\no = Order(["${t('립밤', 'balm')}", "${t('토너', 'toner')}", "${t('쿠션', 'cushion')}"])\nprint(o)\nprint(len(o))`,
            blanks: [{ size: 7 }, { size: 7 }],
            expected: t('주문(3건)\n3', 'Order(3 items)\n3'),
            hints: [
                t(
                    'print 할 때 쓰는 특별 메서드, len 이 부르는 특별 메서드.',
                    'The special method print uses, and the one len calls.',
                ),
                '__str__, __len__',
            ],
            solution: ['__str__', '__len__'],
        },
        write: {
            prompt: t(
                '<code>Truck</code> 클래스(번호 no, 무게 kg)를 만들고, <code>__str__</code> 은 "번호 (무게kg)", <code>__eq__</code> 는 무게가 같으면 True 가 되게 해 주세요.',
                'Make a <code>Truck</code> class (no, kg) with <code>__str__</code> giving "no (kgkg)" and <code>__eq__</code> True when the weights match.',
            ),
            starter: `${t('# Truck 클래스를 여기에 만드세요', '# Make the Truck class here')}\n\nprint(Truck("${t('12가3456', '12GA3456')}", 900))\nprint(Truck("A", 900) == Truck("B", 900))\n`,
            expected: t('12가3456 (900kg)\nTrue', '12GA3456 (900kg)\nTrue'),
            mustInclude: [
                {
                    re: 'def\\s+__str__',
                    msg: t('<code>__str__</code> 을 만들어 주세요.', 'Make <code>__str__</code>.'),
                },
                { re: 'def\\s+__eq__', msg: t('<code>__eq__</code> 를 만들어 주세요.', 'Make <code>__eq__</code>.') },
            ],
            hints: [
                'def __str__(self):\n        return f"{self.no} ({self.kg}kg)"',
                'def __eq__(self, other):\n        return self.kg == other.kg',
            ],
            solution: `class Truck:\n    def __init__(self, no, kg):\n        self.no = no\n        self.kg = kg\n\n    def __str__(self):\n        return f"{self.no} ({self.kg}kg)"\n\n    def __eq__(self, other):\n        return self.kg == other.kg\n\nprint(Truck("${t('12가3456', '12GA3456')}", 900))\nprint(Truck("A", 900) == Truck("B", 900))`,
        },
        learned: [
            t('<code>__str__</code> → print 할 때의 글자', '<code>__str__</code> → the text print shows'),
            t('<code>__len__</code> → len(객체)', '<code>__len__</code> → len(obj)'),
            t('<code>__eq__</code> → == 비교', '<code>__eq__</code> → == comparison'),
        ],
    },

    // ───────────── 택배 상차장 · 윤기사님 · 예외 더 깊이 ─────────────
    {
        id: 'py-raise',
        stage: 'py-error',
        npc: 'yoon',
        title: t('트럭 과적 막기', 'Stopping an overloaded truck'),
        request: [
            t('1톤 트럭에 1톤 넘게 실으면 큰일 나요.', 'Loading over a ton onto a 1-ton truck is dangerous.'),
            t(
                '"과적"이라는 우리만의 오류를 만들어서 확실히 멈추게 할 수 있을까요?',
                'Can we make our own "overload" error so it definitely stops?',
            ),
        ],
        thanks: t(
            '과적이면 딱 멈추고 이유도 알려 주네요. 안전 최고!',
            'It stops right at an overload and says why. Safety first!',
        ),
        concepts: [
            {
                title: t('예외 만들기와 <code>raise</code>', 'Making an exception, and <code>raise</code>'),
                body: t(
                    '<code>class 이름(Exception): pass</code> 로 우리만의 예외를 만들고, <code>raise 이름("메시지")</code> 로 일으켜요. 받는 쪽은 <code>except 이름 as e:</code> 로 잡고, <code>e</code> 를 찍으면 메시지가 나와요.',
                    'Make your own exception with <code>class Name(Exception): pass</code> and raise it with <code>raise Name("message")</code>. Catch it with <code>except Name as e:</code>; printing <code>e</code> shows the message.',
                ),
                code: `class OverloadError(Exception):\n    pass\n\ndef load(kg):\n    if kg > 1000:\n        raise OverloadError(f"{kg}${t('kg 은 너무 무거워요', 'kg is too heavy')}")\n    print(f"{kg}${t('kg 실음', 'kg loaded')}")\n\ntry:\n    load(800)\n    load(1200)\n    load(500)\nexcept OverloadError as e:\n    print("${t('멈춤:', 'Stopped:')}", e)`,
            },
            {
                title: t('<code>finally</code> 와 <code>with</code>', '<code>finally</code> and <code>with</code>'),
                body: t(
                    '<code>finally</code> 블록은 에러가 나든 안 나든 <b>항상</b> 실행돼요. <code>with open(…) as f:</code> 는 블록이 끝나면 파일을 알아서 닫아 줘요. 마무리를 잊지 않게 해 주는 문법이에요.',
                    'A <code>finally</code> block runs <b>always</b>, error or not. <code>with open(…) as f:</code> closes the file for you when the block ends. Both make sure the wrap-up happens.',
                ),
                code: `try:\n    print("${t('상차 시작', 'Loading starts')}")\n    slots = [0, 0]\n    slots[5] = 1\nexcept IndexError:\n    print("${t('자리 없음', 'No slot')}")\nfinally:\n    print("${t('문 닫기', 'Close the door')}")\n\nwith open("log.txt", "w") as f:\n    f.write("${t('상차 완료', 'Loading done')}")\nwith open("log.txt") as f:\n    print(f.read())`,
            },
        ],
        predict: {
            prompt: P(),
            code: `class BadCode(Exception):\n    pass\n\ndef check(code):\n    if not code.startswith("A"):\n        raise BadCode(code)\n    return code + " OK"\n\nfor c in ["A1", "B2", "A3"]:\n    try:\n        print(check(c))\n    except BadCode as e:\n        print("${t('오류', 'error')}", e)`,
            choices: [
                t('A1 OK\n오류 B2\nA3 OK', 'A1 OK\nerror B2\nA3 OK'),
                t('A1 OK\n오류 B2', 'A1 OK\nerror B2'),
                'A1 OK\nA3 OK',
                t('오류 B2', 'error B2'),
            ],
            answer: 0,
            explain: t(
                'try 가 반복문 안에 있어서 B2 를 잡고 나서도 A3 로 계속 가요.',
                'The try is inside the loop, so after catching B2 it carries on to A3.',
            ),
        },
        fill: {
            prompt: t(
                '재고가 없으면 우리만의 예외를 일으키게 하세요.',
                "Raise our own exception when there's no stock.",
            ),
            code: `class EmptyError({{0}}):\n    pass\n\ndef pick(stock):\n    if stock == 0:\n        {{1}} EmptyError("${t('재고 없음', 'Out of stock')}")\n    return stock - 1\n\ntry:\n    print(pick(2))\n    print(pick(0))\nexcept EmptyError as e:\n    print(e)`,
            blanks: [{ size: 9 }, { size: 5 }],
            expected: t('1\n재고 없음', '1\nOut of stock'),
            hints: [
                t(
                    '예외 클래스가 물려받는 부모, 그리고 예외를 일으키는 키워드.',
                    'The parent an exception class inherits, and the keyword that raises it.',
                ),
                'Exception, raise',
            ],
            solution: ['Exception', 'raise'],
        },
        write: {
            prompt: t(
                '<code>LateError</code> 를 만들고, <code>arrive(minutes)</code> 는 30분 넘게 늦으면 "N분 늦음" 으로 일으키고 아니면 "정시 도착" 을 찍게 하세요. 10분, 45분 순서로 부르고, 잡으면 "지연: 메시지", 마지막엔 꼭 "기록 완료" 를 찍어 주세요.',
                'Make <code>LateError</code>; <code>arrive(minutes)</code> raises "N min late" if over 30 minutes late, else prints "On time". Call it with 10 then 45, print "Delay: message" when caught, and always print "Logged" at the end.',
            ),
            starter: W,
            expected: t('정시 도착\n지연: 45분 늦음\n기록 완료', 'On time\nDelay: 45 min late\nLogged'),
            mustInclude: [
                {
                    re: 'class\\s+LateError\\s*\\(\\s*Exception\\s*\\)',
                    msg: t(
                        '<code>class LateError(Exception):</code> 로 만들어 주세요.',
                        'Make it with <code>class LateError(Exception):</code>.',
                    ),
                },
                {
                    re: '\\braise\\b',
                    msg: t('<code>raise</code> 로 일으켜 주세요.', 'Raise it with <code>raise</code>.'),
                },
                {
                    re: '\\bfinally\\b',
                    msg: t(
                        '"기록 완료" 는 <code>finally</code> 에서 찍어 주세요.',
                        'Print "Logged" in <code>finally</code>.',
                    ),
                },
            ],
            hints: [
                t(
                    'if minutes > 30:\n        raise LateError(f"{minutes}분 늦음")',
                    'if minutes > 30:\n        raise LateError(f"{minutes} min late")',
                ),
                'try:\n    arrive(10)\n    arrive(45)\nexcept LateError as e:\n    …\nfinally:\n    …',
            ],
            solution: `class LateError(Exception):\n    pass\n\ndef arrive(minutes):\n    if minutes > 30:\n        raise LateError(f"{minutes}${t('분 늦음', ' min late')}")\n    print("${t('정시 도착', 'On time')}")\n\ntry:\n    arrive(10)\n    arrive(45)\nexcept LateError as e:\n    print("${t('지연:', 'Delay:')}", e)\nfinally:\n    print("${t('기록 완료', 'Logged')}")`,
        },
        learned: [
            t('<code>class 이름(Exception): pass</code>', '<code>class Name(Exception): pass</code>'),
            t(
                '<code>raise 이름("메시지")</code>, <code>except 이름 as e</code>',
                '<code>raise Name("message")</code>, <code>except Name as e</code>',
            ),
            t(
                '<code>finally</code> 는 항상, <code>with</code> 는 알아서 닫기',
                '<code>finally</code> always runs; <code>with</code> closes for you',
            ),
        ],
    },
];
