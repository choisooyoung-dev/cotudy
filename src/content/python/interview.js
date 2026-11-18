// HQ job interview (Python): one combined question per stage (see ../stages.js), in stage order.
// Right → that stage (and every easier one) counts as known; see src/ui/hire.js. Types: predict (default),
// bug (errorLine / output), fill. choices[0] is the right answer (the game shuffles them). Every answer was checked by running the code.
// Korean and English side by side via t('한국어', 'English'). See PLAN.md §8.
import { tr as t } from '../../i18n.js';

export const INTERVIEW = [
    {
        stage: 'office',
        title: t('end 로 이어 찍기', 'Printing on with end'),
        code: `print("${t('송장', 'Invoice')}", end="")\nprint("${t('번호', 'No')}")\nprint("${t('확인', 'OK')}", end="")`,
        choices: [
            t('송장번호\n확인', 'InvoiceNo\nOK'),
            t('송장\n번호\n확인', 'Invoice\nNo\nOK'),
            t('송장번호확인', 'InvoiceNoOK'),
            t('송장 번호\n확인', 'Invoice No\nOK'),
        ],
    },
    {
        stage: 'receiving',
        title: t('나누기, 몫, int()', 'Division, floor division, int()'),
        code: 'boxes = 5\nhalf = boxes / 2\nprint(half)\nprint(boxes // 2 + int("3"))',
        choices: ['2.5\n5', '2\n5', '2.5\n23', '2\n23'],
    },
    {
        stage: 'printing',
        title: t('복합 대입과 나머지', 'Compound assignment and remainder'),
        code: 'qty = 10\nqty += 5\nprint(qty % 4)\nqty -= 1\nqty *= 2\nprint(qty)',
        choices: ['3\n28', '3\n30', '3.75\n28', '3\n29'],
    },
    {
        stage: 'picking',
        title: t('수량으로 등급 나누기', 'Grading by quantity'),
        code: `qty = 15\nif qty > 5:\n    print("${t('보통', 'Medium')}")\nelif qty > 10:\n    print("${t('많음', 'Many')}")\nelse:\n    print("${t('적음', 'Few')}")`,
        choices: [t('보통', 'Medium'), t('많음', 'Many'), t('많음\n보통', 'Many\nMedium'), t('적음', 'Few')],
    },
    {
        stage: 'packing',
        title: t('3씩 건너뛰는 range', 'range stepping by 3'),
        code: 'total = 0\nfor i in range(1, 11, 3):\n    total += i\nprint(total)',
        choices: ['22', '15', '12', '55'],
    },
    {
        stage: 'shipping',
        title: t('리스트 값 바꾸고 길이 보기', 'Changing a list, checking its length'),
        code: 'boxes = [3, 8, 5]\nboxes[1] = boxes[0] + boxes[2]\nprint(boxes[1], len(boxes))',
        choices: ['8 3', '8 2', '3 3', '5 3'],
    },
    {
        stage: 'loading',
        title: t('find 와 슬라이스', 'find and slicing'),
        code: 'code = "BOX-0417"\nprint(code.find("-"))\nprint(code[4:])',
        choices: ['3\n0417', '4\n0417', '3\n-0417', '4\nBOX-'],
    },
    {
        stage: 'forklift',
        title: t('함수 안에서 함수 부르기', 'A function calling a function'),
        code: 'def twice(n):\n    return n * 2\n\nprint(twice(twice(3)) + 1)',
        choices: ['13', '7', '12', '10'],
    },
    {
        stage: 'parttime',
        title: t('딕셔너리에 같은 키 두 번', 'The same key twice in a dict'),
        code: `stock = {}\nstock["${t('립밤', 'Lip balm')}"] = 3\nstock["${t('립밤', 'Lip balm')}"] = 5\nstock["${t('토너', 'Toner')}"] = 2\nprint(stock["${t('립밤', 'Lip balm')}"], len(stock))`,
        choices: ['5 2', '8 2', '5 3', '3 2'],
    },
    {
        stage: 'rest',
        title: t('리스트 칸에 값 넣다가', 'Putting a value into a list slot'),
        code: 'shelf = [0, 0]\ntry:\n    shelf[2] = 1\n    print("A")\nexcept IndexError:\n    print("B")\nprint("C")',
        choices: ['B\nC', 'A\nC', 'C', 'A\nB\nC'],
    },
    // ───── beyond the basics (Python-only stages): combined questions of other types ─────
    {
        stage: 'py-data',
        title: t('무거운 주문 고르고 가장 무거운 것', 'Heavy orders and the heaviest'),
        type: 'fill',
        code: 'orders = [("A", 4), ("B", 11), ("C", 15)]\nheavy = [oid for oid, kg in orders {{0}} kg > 10]\ntop = max(orders, key={{1}} o: o[1])\nprint(heavy, top[0])',
        blanks: [{ size: 2 }, { size: 6 }],
        expected: "['B', 'C'] C",
        solution: ['if', 'lambda'],
        prompt: t(
            "10kg 넘는 주문만 골라 번호를 모으고, 가장 무거운 주문을 찾아서 <code>['B', 'C'] C</code> 가 찍히게 하세요.",
            "Collect the ids of orders over 10kg and find the heaviest so it prints <code>['B', 'C'] C</code>.",
        ),
    },
    {
        stage: 'py-func',
        title: t('기본값이 있는 카운터', 'A counter with a default'),
        type: 'predict',
        code: 'def make():\n    n = 0\n    def inc(step=1):\n        nonlocal n\n        n += step\n        return n\n    return inc\n\na = make()\na()\na(5)\nprint(a(), make()())',
        choices: ['7 1', '2 1', '7 7', '3 1'],
    },
    {
        stage: 'py-iter',
        title: t('next 로 꺼내는 제너레이터', 'A generator read with next'),
        type: 'predict',
        code: `def gen():\n    for i in range(3):\n        print("${t('만듦', 'made')}", i)\n        yield i * 10\n\ng = gen()\nprint(next(g) + next(g))`,
        choices: [
            t('만듦 0\n만듦 1\n10', 'made 0\nmade 1\n10'),
            t('만듦 0\n만듦 1\n만듦 2\n30', 'made 0\nmade 1\nmade 2\n30'),
            '10',
            t('만듦 0\n0\n만듦 1\n10', 'made 0\n0\nmade 1\n10'),
        ],
    },
    {
        stage: 'py-class',
        title: t('파손주의 상품 클래스', 'A fragile-item class'),
        type: 'bug',
        errorLine: 10,
        code: `class Item:\n    def __init__(self, name):\n        self.name = name\n\nclass Fragile(Item):\n    def __init__(self, name, level):\n        self.level = level\n\nf = Fragile("${t('유리병', 'glass')}", 3)\nprint(f.name)`,
        choices: [
            t(
                '6번째 줄: super().__init__(name) 를 부르지 않아서 name 이 없어요',
                "Line 6: super().__init__(name) is never called, so there's no name",
            ),
            t(
                '5번째 줄: 괄호 안에 Item 이 아니라 object 를 써야 해요',
                'Line 5: it should be object, not Item, in the parentheses',
            ),
            t('9번째 줄: 인자가 너무 많아요', 'Line 9: too many arguments'),
            t('틀린 곳이 없어요', 'Nothing is wrong'),
        ],
    },
    {
        stage: 'py-error',
        title: t('과적 예외', 'An overload exception'),
        type: 'bug',
        output: t('1500kg 실음', '1500kg loaded'),
        code: `class OverError(Exception):\n    pass\n\ndef load(kg):\n    if kg > 1000:\n        OverError("${t('과적', 'overload')}")\n    print(f"{kg}${t('kg 실음', 'kg loaded')}")\n\ntry:\n    load(1500)\nexcept OverError as e:\n    print("${t('멈춤:', 'Stopped:')}", e)`,
        prompt: t(
            '1500kg 은 멈춰야 하는데 그냥 실려 버려요. 무엇이 문제일까요?',
            "1500kg should stop, but it gets loaded anyway. What's wrong?",
        ),
        choices: [
            t(
                '6번째 줄: 앞에 raise 가 없어서 예외가 일어나지 않아요',
                "Line 6: there's no raise in front, so nothing is raised",
            ),
            t('1번째 줄: Exception 대신 Error 를 물려받아야 해요', 'Line 1: it should inherit Error, not Exception'),
            t('11번째 줄: except 대신 finally 를 써야 해요', 'Line 11: it should be finally, not except'),
            t('틀린 곳이 없어요', 'Nothing is wrong'),
        ],
    },
];
