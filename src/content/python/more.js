// Python quests for the rest of lap 1 (operators → classes). Korean and English sit side by side:
// t('한국어', 'English') picks the display language. Explained only in Python terms.
// Every example, fill solution and write solution was run for real and matches `expected`.
import { tr as t } from '../../i18n.js';

const W = t('# 여기에 코드를 쓰세요\n', '# Write your code here\n');

export const QUESTS = [
  // ───────────── 주문 출력실 · 이대리 · 연산자 ─────────────
  {
    id: 'print-arith', stage: 'printing', npc: 'lee',
    title: t('송장 금액 계산하기', 'Work out the order total'),
    request: [t('김사원님, 송장에 결제 금액이 찍혀야 하는데 계산이 자꾸 틀려요…', 'Kim, the payment amount on the labels keeps coming out wrong…'), t('파이썬으로 금액 계산 좀 해 줄래요?', 'Could you do the math in Python?')],
    thanks: t('금액이 딱 맞네요! 송장 출력 시작할게요~', 'The totals are spot on! Printing the labels now!'),
    concepts: [
      {
        title: t('사칙연산, 몫 <code>//</code>, 나머지 <code>%</code>', 'Math, floor division <code>//</code>, remainder <code>%</code>'),
        body: t('<code>+ - * /</code> 로 계산해요. <code>/</code> 는 소수점까지, <code>//</code> 는 몫만, <code>%</code> 는 <b>나머지</b>예요. <code>**</code> 는 거듭제곱. 곱하기·나누기가 먼저, 괄호가 있으면 괄호부터예요.', 'Use <code>+ - * /</code>. <code>/</code> keeps decimals, <code>//</code> gives the whole part, <code>%</code> the <b>remainder</b>. <code>**</code> is a power. Multiply/divide first, parentheses before that.'),
        code: 'print(10 + 3 * 2)\nprint((10 + 3) * 2)\nprint(23 / 5)\nprint(23 // 5)\nprint(23 % 5)\nprint(2 ** 3)',
      },
      {
        title: t('줄여 쓰기 <code>+=</code>', 'Shortcut <code>+=</code>'),
        body: t('<code>a += 3</code> 은 <code>a = a + 3</code> 과 같아요. <code>-=</code>, <code>*=</code> 도 있어요. 1 씩 늘릴 때도 <code>a += 1</code> 이라고 써요.', '<code>a += 3</code> is the same as <code>a = a + 3</code>. There\'s also <code>-=</code> and <code>*=</code>. To add 1, write <code>a += 1</code>.'),
        code: 'count = 10\ncount += 5\ncount += 1\ncount -= 2\nprint(count)',
      },
    ],
    predict: { prompt: t('이 코드를 실행하면 어떻게 찍힐까요?', 'What will this code print?'), code: 'a = 17\nprint(a % 4)', choices: ['1', '4', '4.25', '0'], answer: 0, explain: t('17 을 4 로 나누면 몫 4, 나머지 1 이에요. % 는 나머지예요.', '17 divided by 4 is 4 with a remainder of 1. % gives the remainder.') },
    fill: {
      prompt: t('박스 23개를 5개씩 묶었어요. 묶음 수와 남은 박스를 찍어 주세요.', '23 boxes are bundled in fives. Print the bundles and the boxes left over.'),
      code: `boxes = 23\nprint(f"${t('묶음', 'Bundles')}: {boxes {{0}} 5}")\nprint(f"${t('남은 박스', 'Left over')}: {boxes {{1}} 5}")`,
      blanks: [{ size: 3 }, { size: 2 }], expected: t('묶음: 4\n남은 박스: 3', 'Bundles: 4\nLeft over: 3'),
      hints: [t('몫만 구하는 기호(슬래시 두 개)와 나머지 기호예요.', 'The whole-part symbol (two slashes) and the remainder symbol.'), '//, %'], solution: ['//', '%'],
    },
    write: {
      prompt: t('립밤 한 개 4500원, 3개 주문에 배송비 3000원이에요. 변수 <code>price</code>, <code>qty</code>, <code>shipping</code> 을 만들고 결제 금액을 찍어 주세요.', 'One lip balm is 4500 won, 3 were ordered, and shipping is 3000 won. Make variables <code>price</code>, <code>qty</code>, <code>shipping</code> and print the total.'),
      starter: W, expected: t('결제 금액: 16500원', 'Total: 16500 won'),
      mustInclude: [{ re: 'price\\s*=', msg: t('<code>price</code> 변수를 만들어 주세요.', 'Make a <code>price</code> variable.') }, { re: 'price\\s*\\*\\s*qty|qty\\s*\\*\\s*price', msg: t('<code>price * qty</code> 로 계산해 주세요.', 'Calculate it with <code>price * qty</code>.') }],
      hints: ['price * qty + shipping', t('print(f"결제 금액: {price * qty + shipping}원")', 'print(f"Total: {price * qty + shipping} won")')],
      solution: `price = 4500\nqty = 3\nshipping = 3000\nprint(f"${t('결제 금액: ', 'Total: ')}{price * qty + shipping}${t('원', ' won')}")`,
    },
    learned: [t('<code>* /</code> 가 <code>+ -</code> 보다 먼저', '<code>* /</code> before <code>+ -</code>'), t('<code>//</code> 몫, <code>%</code> 나머지, <code>**</code> 거듭제곱', '<code>//</code> whole part, <code>%</code> remainder, <code>**</code> power'), t('<code>a += 1</code> 로 1 늘리기', 'Add 1 with <code>a += 1</code>')],
  },
  {
    id: 'print-compare', stage: 'printing', npc: 'lee',
    title: t('무료 배송 판별하기', 'Check free shipping'),
    request: [t('3만 원 넘게 사면 무료 배송인데요,', 'Orders of 30,000 won or more ship free,'), t('주문마다 맞는지 True/False 로 찍어 줄래요?', 'could you print True or False for each order?')],
    thanks: t('True, False 로 보니까 한눈에 들어와요!', 'Seeing True and False makes it so clear!'),
    concepts: [
      {
        title: t('비교 연산자', 'Comparison operators'),
        body: t('<code>&gt; &lt; &gt;= &lt;= == !=</code> 로 비교하면 결과는 <code>True</code> 아니면 <code>False</code> 예요. 같다는 <code>==</code> (등호 두 개), 다르다는 <code>!=</code>.', 'Comparing with <code>&gt; &lt; &gt;= &lt;= == !=</code> gives <code>True</code> or <code>False</code>. Equal is <code>==</code> (two signs), not equal is <code>!=</code>.'),
        code: 'price = 35000\nprint(price >= 30000)\nprint(price == 30000)\nprint(price != 30000)',
      },
      {
        title: t('<code>and</code>, <code>or</code>, <code>not</code>', '<code>and</code>, <code>or</code>, <code>not</code>'),
        body: t('<code>and</code> 는 둘 다 참일 때만 참, <code>or</code> 는 하나만 참이어도 참, <code>not</code> 은 반대로 바꿔요. 파이썬은 기호 대신 영어 단어를 써요.', '<code>and</code> is true only when both are, <code>or</code> when either is, and <code>not</code> flips it. Python uses English words for these.'),
        code: 'fragile = True\nheavy = False\nprint(fragile and heavy)\nprint(fragile or heavy)\nprint(not heavy)',
      },
    ],
    predict: { prompt: t('이 코드를 실행하면 어떻게 찍힐까요?', 'What will this code print?'), code: 'print(5 > 3 and 2 > 4)', choices: ['False', 'True', '5', t('에러', 'Error')], answer: 0, explain: t('5 > 3 은 True, 2 > 4 는 False. and 는 둘 다 True 여야 해서 False.', '5 > 3 is True, 2 > 4 is False. and needs both, so False.') },
    fill: {
      prompt: t('3만 원 이상이면 무료 배송, 깨지거나 무거우면 뽁뽁이 포장이에요.', 'Free shipping from 30,000 won; bubble wrap if fragile or heavy.'),
      code: `price = 35000\nfragile = False\nheavy = True\nprint(f"${t('무료 배송', 'Free shipping')}: {price {{0}} 30000}")\nprint(f"${t('뽁뽁이', 'Bubble wrap')}: {fragile {{1}} heavy}")`,
      blanks: [{ size: 3 }, { size: 3 }], expected: t('무료 배송: True\n뽁뽁이: True', 'Free shipping: True\nBubble wrap: True'),
      hints: [t('"이상"은 같은 것도 포함해요. "또는"은 영어 단어로 써요.', '"From" includes equal. "Or" is written as an English word.'), '>=, or'], solution: ['>=', 'or'],
    },
    write: {
      prompt: t('주문 금액 <code>total</code> 이 28000원이고 쿠폰 <code>has_coupon</code> 이 있어요(True). 2만 원 이상이면서 쿠폰이 있으면 할인이에요. 할인 여부를 찍어 주세요.', 'The order <code>total</code> is 28000 won and <code>has_coupon</code> is True. A discount applies if the total is 20000 or more AND there is a coupon. Print whether it applies.'),
      starter: W, expected: t('할인 가능: True', 'Discount: True'),
      mustInclude: [{ re: '\\band\\b', msg: t('두 조건을 <code>and</code> 로 합쳐 주세요.', 'Combine the two conditions with <code>and</code>.') }, { re: 'has_coupon\\s*=', msg: t('<code>has_coupon</code> 변수를 만들어 주세요.', 'Make a <code>has_coupon</code> variable.') }],
      hints: ['total >= 20000 and has_coupon', t('print(f"할인 가능: {total >= 20000 and has_coupon}")', 'print(f"Discount: {total >= 20000 and has_coupon}")')],
      solution: `total = 28000\nhas_coupon = True\nprint(f"${t('할인 가능: ', 'Discount: ')}{total >= 20000 and has_coupon}")`,
    },
    learned: [t('비교 결과는 <code>True</code>/<code>False</code>', 'Comparisons give <code>True</code>/<code>False</code>'), t('같다 <code>==</code>, 다르다 <code>!=</code>', 'equal <code>==</code>, not equal <code>!=</code>'), '<code>and</code>, <code>or</code>, <code>not</code>'],
  },

  // ───────────── 피킹 · 정사원 · 조건문 ─────────────
  {
    id: 'pick-if', stage: 'picking', npc: 'jung',
    title: t('재고 확인하고 피킹하기', 'Check stock before picking'),
    request: [t('김사원님, 주문 들어온 만큼 재고가 있는지 보고 피킹해야 해요.', 'Kim, we need to check there\'s enough stock before picking an order.'), t('재고에 따라 다른 말을 찍어 줄래요?', 'Could you print a different message depending on stock?')],
    thanks: t('이제 재고 없는 걸 헛걸음 안 하겠어요!', 'No more walking to empty shelves!'),
    concepts: [
      {
        title: t('<code>if</code> 와 <code>else</code>, 그리고 들여쓰기', '<code>if</code>, <code>else</code>, and indentation'),
        body: t('<code>if 조건:</code> 다음 줄들은 <b>앞에 띄어쓰기 4칸</b>을 넣어요(들여쓰기). 들여쓴 줄만 조건이 True 일 때 실행돼요. <code>else:</code> 는 False 일 때예요. 콜론 <code>:</code> 을 잊지 마세요.', 'Lines after <code>if condition:</code> start with <b>4 spaces</b> (indentation). Only the indented lines run when it\'s True. <code>else:</code> is for False. Don\'t forget the colon <code>:</code>.'),
        code: `stock = 3\norder = 5\nif stock >= order:\n    print("${t('피킹 가능', 'Ready to pick')}")\nelse:\n    print("${t('재고 부족', 'Not enough stock')}")`,
      },
      {
        title: t('여러 갈래 <code>elif</code>', 'Many branches <code>elif</code>'),
        body: t('조건을 위에서부터 차례로 보고, <b>처음 맞는 것 하나만</b> 실행해요. "else if" 를 파이썬은 <code>elif</code> 라고 써요.', 'Conditions are checked from the top, and <b>only the first match</b> runs. Python writes "else if" as <code>elif</code>.'),
        code: `weight = 7\nif weight < 2:\n    print("${t('소형', 'Small')}")\nelif weight < 10:\n    print("${t('중형', 'Medium')}")\nelse:\n    print("${t('대형', 'Large')}")`,
      },
    ],
    predict: { prompt: t('이 코드를 실행하면 어떻게 찍힐까요?', 'What will this code print?'), code: 'n = 15\nif n > 10:\n    print("A")\nelif n > 5:\n    print("B")\nelse:\n    print("C")', choices: ['A', 'B', 'A\nB', 'C'], answer: 0, explain: t('15 > 10 이 먼저 맞아서 A 만 찍고 끝나요. 아래 조건은 보지 않아요.', '15 > 10 matches first, so only A prints. The rest are skipped.') },
    fill: {
      prompt: t('재고가 주문 수량 이상이면 "피킹 가능", 아니면 "재고 부족"이 찍히게 하세요.', 'Print "Ready to pick" if stock covers the order, otherwise "Not enough stock".'),
      code: `stock = 8\norder = 5\n{{0}} stock >= order:\n    print("${t('피킹 가능', 'Ready to pick')}")\n{{1}}:\n    print("${t('재고 부족', 'Not enough stock')}")`,
      blanks: [{ size: 3 }, { size: 5 }], expected: t('피킹 가능', 'Ready to pick'),
      hints: [t('"만약"과 "아니면"에 해당하는 단어예요.', 'The words for "if" and "otherwise".'), 'if, else'], solution: ['if', 'else'],
    },
    write: {
      prompt: t('랙 번호 <code>rack</code> 이 12예요. 10 이하는 "A구역", 20 이하는 "B구역", 그 외는 "C구역"을 찍어 주세요.', 'The <code>rack</code> number is 12. Print "Zone A" for 10 or less, "Zone B" for 20 or less, otherwise "Zone C".'),
      starter: W, expected: t('B구역', 'Zone B'),
      mustInclude: [{ re: '\\belif\\b', msg: t('<code>elif</code> 를 써 주세요.', 'Use <code>elif</code>.') }],
      hints: ['if rack <= 10: … elif rack <= 20: … else: …', t('각 갈래 아래 줄은 4칸 들여써요.', 'Indent the line under each branch by 4 spaces.')],
      solution: `rack = 12\nif rack <= 10:\n    print("${t('A구역', 'Zone A')}")\nelif rack <= 20:\n    print("${t('B구역', 'Zone B')}")\nelse:\n    print("${t('C구역', 'Zone C')}")`,
    },
    learned: [t('<code>if 조건:</code> + 4칸 들여쓰기', '<code>if condition:</code> + 4-space indent'), t('<code>else:</code> → 아닐 때', '<code>else:</code> → otherwise'), t('<code>elif</code> → 처음 맞는 하나만', '<code>elif</code> → only the first match')],
  },
  {
    id: 'pick-string-cond', stage: 'picking', npc: 'jung',
    title: t('구역 이름으로 고르기', 'Pick by zone name'),
    request: [t('이번엔 구역 이름이 글자로 와요. "A" 구역이면서 수량이 있을 때만 피킹이에요.', 'This time the zone comes as text. We pick only from zone "A" and only if there\'s quantity.'), t('글자도 비교할 수 있어요?', 'Can you compare text too?')],
    thanks: t('글자 비교도 문제없네요!', 'Comparing text is no problem either!'),
    concepts: [
      {
        title: t('문자열 비교', 'Comparing strings'),
        body: t('문자열도 <code>==</code> 로 같은지 비교해요. 대소문자가 다르면 다른 글자예요. 무시하고 싶으면 <code>lower()</code> 로 바꿔서 비교해요. <code>in</code> 으로 여러 값 중 하나인지도 볼 수 있어요.', 'Compare strings with <code>==</code>. Different case means different text; to ignore case, use <code>lower()</code> first. <code>in</code> checks whether it\'s one of several values.'),
        code: 'zone = "A"\nprint(zone == "A")\nprint(zone == "a")\nprint(zone.lower() == "a")\nprint(zone in ["A", "B"])',
      },
      {
        title: t('조건 합치기', 'Combining conditions'),
        body: t('<code>if</code> 안에서도 <code>and</code>, <code>or</code> 로 조건을 합칠 수 있어요.', 'You can combine conditions with <code>and</code> and <code>or</code> inside an <code>if</code>.'),
        code: `zone = "A"\nqty = 0\nif zone == "A" and qty > 0:\n    print("${t('피킹', 'Pick')}")\nelse:\n    print("${t('건너뛰기', 'Skip')}")`,
      },
    ],
    predict: { prompt: t('이 코드를 실행하면 어떻게 찍힐까요?', 'What will this code print?'), code: 'c = "B"\nif c == "A" or c == "B":\n    print("OK")\nelse:\n    print("NO")', choices: ['OK', 'NO', 'OK\nNO', t('에러', 'Error')], answer: 0, explain: t('c 는 "B" 라서 두 번째 조건이 True. or 는 하나만 맞아도 돼요.', 'c is "B", so the second check is True. or needs just one.') },
    fill: {
      prompt: t('구역이 "A" 이고 수량이 0보다 크면 "A구역 피킹"이 찍히게 하세요.', 'Print "Picking zone A" when the zone is "A" and quantity is above 0.'),
      code: `zone = "A"\nqty = 4\nif zone {{0}} "A" {{1}} qty > 0:\n    print("${t('A구역 피킹', 'Picking zone A')}")`,
      blanks: [{ size: 3 }, { size: 4 }], expected: t('A구역 피킹', 'Picking zone A'),
      hints: [t('같은지 보는 기호(등호 두 개)와 "그리고" 단어예요.', 'The equals check (two signs) and the word for "and".'), '==, and'], solution: ['==', 'and'],
    },
    write: {
      prompt: t('택배사 <code>courier</code> 가 "번개택배"이고 무게 <code>weight</code> 가 12예요. 번개택배이면서 10kg 넘으면 "추가 요금", 아니면 "기본 요금"을 찍어 주세요.', 'The <code>courier</code> is "Lightning" and <code>weight</code> is 12. Print "Extra fee" if it\'s Lightning and over 10kg, otherwise "Base fee".'),
      starter: W, expected: t('추가 요금', 'Extra fee'),
      mustInclude: [{ re: '==', msg: t('<code>==</code> 로 비교해 주세요.', 'Compare with <code>==</code>.') }, { re: '\\band\\b', msg: t('두 조건을 <code>and</code> 로 합쳐 주세요.', 'Combine with <code>and</code>.') }],
      hints: [t('courier == "번개택배" and weight > 10', 'courier == "Lightning" and weight > 10'), t('if 와 else 로 두 갈래를 만들어요.', 'Make two branches with if and else.')],
      solution: `courier = "${t('번개택배', 'Lightning')}"\nweight = 12\nif courier == "${t('번개택배', 'Lightning')}" and weight > 10:\n    print("${t('추가 요금', 'Extra fee')}")\nelse:\n    print("${t('기본 요금', 'Base fee')}")`,
    },
    learned: [t('문자열도 <code>==</code> 로 비교', 'Compare strings with <code>==</code>'), t('대소문자 무시: <code>lower()</code>', 'Ignore case: <code>lower()</code>'), t('<code>x in [a, b]</code> → 여럿 중 하나?', '<code>x in [a, b]</code> → one of several?')],
  },
  {
    id: 'pick-switch', stage: 'picking', npc: 'jung',
    title: t('구역 코드로 층 안내하기', 'Floor guide by zone code'),
    request: [t('구역 코드마다 몇 층인지 안내해야 해요.', 'We need to tell people which floor each zone code is on.'), t('if 를 길게 늘어놓기보다 깔끔한 방법이 있대요!', 'There\'s apparently a cleaner way than a long chain of ifs!')],
    thanks: t('match 로 쓰니까 표처럼 보이네요!', 'With match it reads like a table!'),
    concepts: [
      {
        title: '<code>match</code> / <code>case</code>',
        body: t('값 하나를 여러 경우와 비교할 때 써요. 맞는 <code>case</code> 하나만 실행하고 끝나요. <code>case _:</code> 는 "그 외 전부"예요.', 'Use it to compare one value against many cases. Only the matching <code>case</code> runs. <code>case _:</code> means "anything else".'),
        code: `zone = "B"\nmatch zone:\n    case "A":\n        print("${t('1층', '1st floor')}")\n    case "B":\n        print("${t('2층', '2nd floor')}")\n    case _:\n        print("${t('모르는 구역', 'Unknown zone')}")`,
      },
      {
        title: t('여러 값을 한 번에', 'Several values at once'),
        body: t('<code>case "A" | "B":</code> 처럼 <code>|</code> 로 여러 값을 한 경우에 묶을 수 있어요.', 'Group values in one case with <code>|</code>, like <code>case "A" | "B":</code>.'),
        code: 'day = "sat"\nmatch day:\n    case "sat" | "sun":\n        print("weekend")\n    case _:\n        print("weekday")',
      },
    ],
    predict: { prompt: t('이 코드를 실행하면 어떻게 찍힐까요?', 'What will this code print?'), code: 'day = 3\nmatch day:\n    case 1:\n        print("Mon")\n    case 3:\n        print("Wed")\n    case _:\n        print("?")', choices: ['Wed', 'Mon', '?', 'Wed\n?'], answer: 0, explain: t('day 가 3 이라 case 3 만 실행하고 끝나요.', 'day is 3, so only case 3 runs.') },
    fill: {
      prompt: t('구역 코드가 "C" 일 때 "3층"이 찍히게 빈칸을 채우세요.', 'Fill in the blanks so zone "C" prints "3rd floor".'),
      code: `zone = "C"\n{{0}} zone:\n    case "A":\n        print("${t('1층', '1st floor')}")\n    {{1}} "C":\n        print("${t('3층', '3rd floor')}")`,
      blanks: [{ size: 5 }, { size: 4 }], expected: t('3층', '3rd floor'),
      hints: [t('값을 여러 경우와 비교하는 문장과, 각 경우 앞에 붙는 단어예요.', 'The statement that compares against cases, and the word before each case.'), 'match, case'], solution: ['match', 'case'],
    },
    write: {
      prompt: t('등급 <code>grade</code> 가 "B" 예요. A 는 "특급 배송", B 는 "일반 배송", 그 외는 "확인 필요"를 match 로 찍어 주세요.', 'The <code>grade</code> is "B". Use match: A → "Express", B → "Standard", anything else → "Check needed".'),
      starter: W, expected: t('일반 배송', 'Standard'),
      mustInclude: [{ re: 'match\\s+\\w+\\s*:', msg: t('<code>match grade:</code> 를 써 주세요.', 'Use <code>match grade:</code>.') }, { re: 'case\\s+_', msg: t('그 외는 <code>case _:</code> 로 처리해 주세요.', 'Handle the rest with <code>case _:</code>.') }],
      hints: ['match grade:\n    case "A": …\n    case "B": …\n    case _: …', t('case 아래 줄은 한 번 더 들여써요.', 'Indent the line under each case once more.')],
      solution: `grade = "B"\nmatch grade:\n    case "A":\n        print("${t('특급 배송', 'Express')}")\n    case "B":\n        print("${t('일반 배송', 'Standard')}")\n    case _:\n        print("${t('확인 필요', 'Check needed')}")`,
    },
    learned: [t('<code>match 값:</code> + <code>case …:</code>', '<code>match value:</code> + <code>case …:</code>'), t('맞는 case 하나만 실행', 'Only the matching case runs'), t('그 외 전부는 <code>case _:</code>', 'Everything else: <code>case _:</code>')],
  },

  // ───────────── 패킹 · 송사원 · 반복문 ─────────────
  {
    id: 'pack-for', stage: 'packing', npc: 'song',
    title: t('박스 번호 붙이기', 'Number the boxes'),
    request: [t('김사원님, 박스마다 번호를 붙여야 하는데 하나하나 쓰려니 끝이 없어요.', 'Kim, every box needs a number, and writing them one by one takes forever.'), t('반복해서 찍는 방법 없을까요?', 'Is there a way to print them in a loop?')],
    thanks: t('100개도 금방이겠네요! 고마워요~', 'Even 100 boxes would be quick now! Thanks!'),
    concepts: [
      {
        title: t('<code>for</code> 와 <code>range</code>', '<code>for</code> and <code>range</code>'),
        body: t('<code>for i in range(1, 4):</code> 는 i 가 1, 2, 3 일 때 반복해요. <code>range(시작, 끝)</code> 은 끝 <b>바로 앞</b>까지예요. <code>range(3)</code> 은 0, 1, 2.', '<code>for i in range(1, 4):</code> repeats with i = 1, 2, 3. <code>range(start, end)</code> stops <b>just before</b> end. <code>range(3)</code> is 0, 1, 2.'),
        code: `for i in range(1, 4):\n    print("${t('박스', 'Box')}", i)`,
      },
      {
        title: t('반복하면서 더하기 (누적)', 'Adding up in a loop'),
        body: t('반복문 밖에 합계 변수를 0 으로 만들고, 안에서 계속 더해요.', 'Make a total variable set to 0 outside the loop, then keep adding to it inside.'),
        code: 'total = 0\nfor i in range(1, 5):\n    total += i\nprint(total)',
      },
    ],
    predict: { prompt: t('이 코드를 실행하면 어떻게 찍힐까요?', 'What will this code print?'), code: 'for i in range(3):\n    print(i)', choices: ['0\n1\n2', '1\n2\n3', '0\n1\n2\n3', '3'], answer: 0, explain: t('range(3) 은 0, 1, 2. 3 은 포함하지 않아요.', 'range(3) is 0, 1, 2. It doesn\'t include 3.') },
    fill: {
      prompt: t('"박스 1" 부터 "박스 3" 까지 찍히게 빈칸을 채우세요.', 'Fill in the blanks to print "Box 1" through "Box 3".'),
      code: `for i in {{0}}(1, {{1}}):\n    print("${t('박스', 'Box')}", i)`,
      blanks: [{ size: 5 }, { size: 2 }], expected: t('박스 1\n박스 2\n박스 3', 'Box 1\nBox 2\nBox 3'),
      hints: [t('숫자 범위를 만드는 함수예요. 끝 숫자는 포함되지 않아요.', 'The function that makes a number range. The end isn\'t included.'), 'range, 4'], solution: ['range', '4'],
    },
    write: {
      prompt: t('1번 박스엔 테이프 1m, 2번엔 2m … 5번엔 5m 를 써요. for 로 다 더해서 찍어 주세요.', 'Box 1 uses 1m of tape, box 2 uses 2m … box 5 uses 5m. Add them up with a for loop and print it.'),
      starter: W, expected: t('총 테이프: 15m', 'Total tape: 15m'),
      mustInclude: [{ re: 'for\\s+\\w+\\s+in', msg: t('<code>for … in</code> 반복문을 써 주세요.', 'Use a <code>for … in</code> loop.') }],
      hints: ['total = 0\nfor i in range(1, 6):\n    total += i', t('print(f"총 테이프: {total}m")', 'print(f"Total tape: {total}m")')],
      solution: `total = 0\nfor i in range(1, 6):\n    total += i\nprint(f"${t('총 테이프: ', 'Total tape: ')}{total}m")`,
    },
    learned: ['<code>for i in range(1, n + 1):</code>', t('<code>range</code> 는 끝 바로 앞까지', '<code>range</code> stops just before the end'), t('합계는 밖에서 0, 안에서 <code>+=</code>', 'Total: 0 outside, <code>+=</code> inside')],
  },
  {
    id: 'pack-while', stage: 'packing', npc: 'song',
    title: t('테이프 다 쓸 때까지 포장하기', 'Pack until the tape runs out'),
    request: [t('테이프 한 롤로 박스를 몇 개나 쌀 수 있는지 궁금해요.', 'I wonder how many boxes one roll of tape can wrap.'), t('몇 번 반복할지 모를 때는 어떻게 해요?', 'What do you do when you don\'t know how many times to repeat?')],
    thanks: t('while 이면 끝날 때까지 알아서 도네요!', 'So while just keeps going until it\'s done!'),
    concepts: [
      {
        title: '<code>while</code>',
        body: t('<code>while 조건:</code> 은 조건이 참인 동안 계속 반복해요. 안에서 조건이 언젠가 거짓이 되게 해야 끝나요.', '<code>while condition:</code> repeats as long as the condition is true. Something inside must make it false, or it never ends.'),
        code: 'tape = 10\ncount = 0\nwhile tape >= 3:\n    tape -= 3\n    count += 1\nprint(count, tape)',
      },
      {
        title: t('<code>break</code> 와 <code>continue</code>', '<code>break</code> and <code>continue</code>'),
        body: t('<code>break</code> 는 반복을 바로 끝내고, <code>continue</code> 는 이번 차례만 건너뛰고 다음으로 가요.', '<code>break</code> ends the loop right away; <code>continue</code> skips just this round.'),
        code: 'for i in range(1, 7):\n    if i == 3:\n        continue\n    if i == 5:\n        break\n    print(i)',
      },
    ],
    predict: { prompt: t('이 코드를 실행하면 어떻게 찍힐까요?', 'What will this code print?'), code: 'n = 1\nwhile n < 10:\n    n *= 2\nprint(n)', choices: ['16', '8', '10', '2'], answer: 0, explain: t('1 → 2 → 4 → 8 → 16. 16 이 되면 n < 10 이 거짓이라 멈춰요.', '1 → 2 → 4 → 8 → 16. At 16, n < 10 is false, so it stops.') },
    fill: {
      prompt: t('테이프 10m, 박스 하나에 3m 씩 써요. 포장한 박스와 남은 테이프를 찍게 하세요.', '10m of tape, 3m per box. Print the boxes packed and the tape left.'),
      code: `tape = 10\ncount = 0\n{{0}} tape >= 3:\n    tape -= 3\n    count {{1}} 1\nprint(f"${t('포장한 박스', 'Boxes packed')}: {count}")\nprint(f"${t('남은 테이프', 'Tape left')}: {tape}m")`,
      blanks: [{ size: 5 }, { size: 3 }], expected: t('포장한 박스: 3\n남은 테이프: 1m', 'Boxes packed: 3\nTape left: 1m'),
      hints: [t('조건이 참인 동안 반복하는 단어, 그리고 더해서 넣는 기호예요.', 'The word that repeats while true, and the add-and-store symbol.'), 'while, +='], solution: ['while', '+='],
    },
    write: {
      prompt: t('박스 1번부터 10번 중 <b>짝수 번호만</b> 한 줄씩 찍어 주세요. 홀수는 <code>continue</code> 로 건너뛰어요.', 'Print only the <b>even</b> box numbers from 1 to 10, one per line. Skip odd ones with <code>continue</code>.'),
      starter: W, expected: '2\n4\n6\n8\n10',
      mustInclude: [{ re: 'continue', msg: t('<code>continue</code> 를 써서 홀수를 건너뛰어 주세요.', 'Skip the odd numbers with <code>continue</code>.') }],
      hints: [t('i % 2 != 0 이면 홀수예요.', 'If i % 2 != 0, it\'s odd.'), 'for i in range(1, 11):\n    if i % 2 != 0:\n        continue\n    print(i)'],
      solution: 'for i in range(1, 11):\n    if i % 2 != 0:\n        continue\n    print(i)',
    },
    learned: [t('<code>while 조건:</code> → 참인 동안 반복', '<code>while condition:</code> → repeat while true'), t('<code>break</code> 끝내기, <code>continue</code> 건너뛰기', '<code>break</code> ends, <code>continue</code> skips'), t('조건이 언젠가 거짓이 되게!', 'Make sure the condition turns false!')],
  },
  {
    id: 'pack-nested', stage: 'packing', npc: 'song',
    title: t('팔레트에 박스 쌓기', 'Stack boxes on a pallet'),
    request: [t('팔레트에 박스를 3층, 층마다 4개씩 쌓아요.', 'We stack boxes on a pallet: 3 layers, 4 boxes per layer.'), t('층마다 박스 위치를 다 찍을 수 있을까요?', 'Could you print every box position?')],
    thanks: t('반복 안에 반복이라니, 신기해요!', 'A loop inside a loop, how neat!'),
    concepts: [
      {
        title: t('반복문 안의 반복문', 'A loop inside a loop'),
        body: t('바깥 반복이 한 번 돌 때마다 안쪽 반복이 처음부터 끝까지 다 돌아요. 안쪽 반복은 한 번 더 들여써요.', 'Each time the outer loop goes around once, the inner loop runs all the way through. Indent the inner loop once more.'),
        code: `for floor in range(1, 3):\n    for n in range(1, 4):\n        print(f"{floor}${t('층', 'F')}-{n}")`,
      },
      {
        title: t('한 줄에 이어 찍기', 'Printing on one line'),
        body: t('<code>print(…, end="")</code> 는 줄을 바꾸지 않아요. 줄 끝에서 <code>print()</code> 로 줄을 바꿔요. 같은 글자 반복은 <code>"■" * 4</code> 처럼 곱하기로도 돼요.', '<code>print(…, end="")</code> doesn\'t start a new line. Call <code>print()</code> at the end to move on. You can also repeat a string with <code>"■" * 4</code>.'),
        code: 'for row in range(3):\n    for col in range(4):\n        print("■", end="")\n    print()\nprint("■" * 4)',
      },
    ],
    predict: { prompt: t('이 코드를 실행하면 어떻게 찍힐까요?', 'What will this code print?'), code: 'stars = 0\nfor i in range(3):\n    for j in range(2):\n        stars += 1\nprint(stars)', choices: ['6', '5', '3', '2'], answer: 0, explain: t('바깥 3번 × 안쪽 2번 = 6번.', 'Outer 3 times × inner 2 times = 6.') },
    fill: {
      prompt: t('2층, 층마다 3개씩 박스 모양이 찍히게 하세요.', 'Print 2 layers of 3 boxes each.'),
      code: 'for row in range(2):\n    for col in range({{0}}):\n        print("■", {{1}})\n    print()',
      blanks: [{ size: 2 }, { size: 6 }], expected: '■■■\n■■■',
      hints: [t('한 줄에 3개, 줄을 바꾸지 않게 하는 옵션이에요.', '3 per line, and the option that stops the line break.'), '3, end=""'], solution: ['3', 'end=""'],
    },
    write: {
      prompt: t('3층 팔레트에 층마다 4개씩 있어요. 층별로 "1층: ■■■■" 처럼 찍어 주세요. 반복문 안에 반복문을 써 보세요.', 'A 3-layer pallet with 4 boxes per layer. Print each layer like "Layer 1: ■■■■", using a loop inside a loop.'),
      starter: W, expected: t('1층: ■■■■\n2층: ■■■■\n3층: ■■■■', 'Layer 1: ■■■■\nLayer 2: ■■■■\nLayer 3: ■■■■'),
      mustInclude: [{ re: 'for[\\s\\S]*for', msg: t('반복문 안에 반복문을 넣어 주세요.', 'Put a loop inside a loop.') }],
      hints: [t('바깥: for floor in range(1, 4): print(f"{floor}층: ", end="")', 'Outer: for floor in range(1, 4): print(f"Layer {floor}: ", end="")'), t('안쪽: print("■", end="") 4번, 끝나면 print()', 'Inner: print("■", end="") 4 times, then print()')],
      solution: `for floor in range(1, 4):\n    print(f"${t('{floor}층: ', 'Layer {floor}: ')}", end="")\n    for n in range(4):\n        print("■", end="")\n    print()`,
    },
    learned: [t('바깥 한 번에 안쪽은 끝까지', 'Inner loop runs fully each outer round'), t('<code>end=""</code> 이어 찍기, <code>print()</code> 줄 바꾸기', '<code>end=""</code> stays, <code>print()</code> breaks the line'), t('<code>"■" * 4</code> 문자열 반복', '<code>"■" * 4</code> repeats a string')],
  },

  // ───────────── 출고장 · 오팀원 · 리스트 ─────────────
  {
    id: 'ship-array', stage: 'shipping', npc: 'oh',
    title: t('택배사 목록 만들기', 'List the couriers'),
    request: [t('김사원님, 출고는 택배사별로 나눠요. 택배사가 여러 개라 변수를 하나씩 만들기 힘들어요.', 'Kim, we sort shipments by courier. There are several, so one variable each gets messy.'), t('한 번에 묶어서 담는 방법이 있나요?', 'Is there a way to keep them together?')],
    thanks: t('리스트에 담으니까 정리가 쉽네요!', 'Keeping them in a list makes it so tidy!'),
    concepts: [
      {
        title: t('리스트 만들기와 번호(인덱스)', 'Lists and index numbers'),
        body: t('<code>[값, 값, …]</code> 으로 여러 값을 한 번에 담아요. 꺼낼 때는 <code>이름[번호]</code>, 번호는 <b>0 부터</b>. 맨 끝은 <code>[-1]</code>. 개수는 <code>len(리스트)</code>.', '<code>[value, value, …]</code> holds many values at once. Get one with <code>name[index]</code>; indexes start at <b>0</b>. The last is <code>[-1]</code>. The count is <code>len(list)</code>.'),
        code: `couriers = ["${t('번개택배', 'Lightning')}", "${t('하늘택배', 'Sky')}", "${t('바다택배', 'Ocean')}"]\nprint(couriers[0])\nprint(couriers[-1])\nprint(len(couriers))`,
      },
      {
        title: t('반복문으로 하나씩 보기', 'Going through with a loop'),
        body: t('<code>for x in 리스트:</code> 로 값을 하나씩 꺼내요. 번호도 필요하면 <code>for i, x in enumerate(리스트):</code>.', '<code>for x in list:</code> takes each value. If you need the index too, use <code>for i, x in enumerate(list):</code>.'),
        code: 'boxes = [12, 7, 9]\nfor b in boxes:\n    print(b)\nfor i, b in enumerate(boxes):\n    print(i, b)',
      },
    ],
    predict: { prompt: t('이 코드를 실행하면 어떻게 찍힐까요?', 'What will this code print?'), code: 'a = [3, 5, 7]\nprint(a[1])', choices: ['5', '3', '7', t('에러', 'Error')], answer: 0, explain: t('번호는 0 부터라 a[0]=3, a[1]=5.', 'Indexes start at 0, so a[0]=3 and a[1]=5.') },
    fill: {
      prompt: t('두 번째 택배사와 택배사 수가 찍히게 하세요.', 'Print the second courier and the number of couriers.'),
      code: `couriers = ["${t('번개택배', 'Lightning')}", "${t('하늘택배', 'Sky')}", "${t('바다택배', 'Ocean')}"]\nprint(couriers[{{0}}])\nprint(f"${t('택배사 수', 'Couriers')}: {{{1}}(couriers)}")`,
      blanks: [{ size: 2 }, { size: 4 }], expected: t('하늘택배\n택배사 수: 3', 'Sky\nCouriers: 3'),
      hints: [t('두 번째는 번호 1 이에요. 개수를 세는 함수는?', 'The second one is index 1. Which function counts?'), '1, len'], solution: ['1', 'len'],
    },
    write: {
      prompt: t('택배사별 출고 박스가 <code>[12, 7, 9]</code> 예요. 리스트 <code>boxes</code> 에 담고 반복문으로 다 더해서 찍어 주세요.', 'Boxes per courier are <code>[12, 7, 9]</code>. Put them in a list <code>boxes</code> and add them up with a loop.'),
      starter: W, expected: t('총 출고 박스: 28개', 'Total boxes shipped: 28'),
      mustInclude: [{ re: 'boxes\\s*=\\s*\\[', msg: t('<code>boxes</code> 리스트를 만들어 주세요.', 'Make a <code>boxes</code> list.') }, { re: 'for\\s+\\w+\\s+in', msg: t('반복문으로 더해 주세요.', 'Add them with a loop.') }],
      hints: ['total = 0\nfor b in boxes:\n    total += b', t('print(f"총 출고 박스: {total}개")', 'print(f"Total boxes shipped: {total}")')],
      solution: `boxes = [12, 7, 9]\ntotal = 0\nfor b in boxes:\n    total += b\nprint(f"${t('총 출고 박스: {total}개', 'Total boxes shipped: {total}')}")`,
    },
    learned: ['<code>a = [1, 2, 3]</code>', t('번호는 0 부터: <code>a[0]</code>, 끝은 <code>a[-1]</code>', 'Indexes from 0: <code>a[0]</code>, last <code>a[-1]</code>'), t('개수 <code>len(a)</code>, 돌기 <code>for x in a:</code>', 'Count <code>len(a)</code>, loop <code>for x in a:</code>')],
  },
  {
    id: 'ship-array-search', stage: 'shipping', npc: 'oh',
    title: t('제일 무거운 박스 찾기', 'Find the heaviest box'),
    request: [t('트럭에 실을 때 무거운 박스부터 알아야 해요.', 'When loading the truck, we need to know the heavy boxes.'), t('제일 무거운 것, 기준 넘는 것 개수… 찾아 줄래요?', 'The heaviest one, how many are over the limit… could you find them?')],
    thanks: t('이제 무거운 박스 걱정 끝!', 'No more worrying about heavy boxes!'),
    concepts: [
      {
        title: t('값 바꾸기, 기본 함수', 'Changing values, built-in functions'),
        body: t('<code>리스트[번호] = 새 값</code> 으로 그 칸의 값을 바꿔요. <code>sum()</code>, <code>max()</code>, <code>min()</code> 으로 합계·최댓값·최솟값을 바로 구할 수도 있어요.', '<code>list[index] = newValue</code> changes that slot. <code>sum()</code>, <code>max()</code> and <code>min()</code> give the total, max and min right away.'),
        code: 'w = [4, 9, 2]\nw[2] = 6\nprint(w)\nprint(sum(w), max(w), min(w))',
      },
      {
        title: t('직접 찾기, 개수 세기', 'Finding and counting yourself'),
        body: t('첫 값을 최댓값으로 두고, 더 큰 값이 나오면 바꿔요. 개수는 조건이 맞을 때마다 1 씩 더해요. 원리를 알아 두면 조건이 복잡할 때 쓸 수 있어요.', 'Start with the first value as the max and replace it when a bigger one shows up. To count, add 1 each time it matches. Knowing how lets you handle trickier conditions.'),
        code: 'w = [4, 9, 2, 7]\nbiggest = w[0]\nover5 = 0\nfor x in w:\n    if x > biggest:\n        biggest = x\n    if x > 5:\n        over5 += 1\nprint(biggest)\nprint(over5)',
      },
    ],
    predict: { prompt: t('이 코드를 실행하면 어떻게 찍힐까요?', 'What will this code print?'), code: 'a = [2, 8, 5]\na[0] = a[1] + 1\nprint(a[0])', choices: ['9', '3', '8', '2'], answer: 0, explain: t('a[1] 은 8, 거기에 1 을 더한 9 가 a[0] 에 들어가요.', 'a[1] is 8, plus 1 makes 9, which goes into a[0].') },
    fill: {
      prompt: t('가장 무거운 박스 무게를 직접 찾아 찍게 하세요.', 'Find the heaviest box weight yourself and print it.'),
      code: `weights = [8, 15, 3, 11]\nbiggest = weights[0]\nfor w in weights:\n    if w {{0}} biggest:\n        biggest = {{1}}\nprint(f"${t('최대 무게', 'Heaviest')}: {biggest}kg")`,
      blanks: [{ size: 2 }, { size: 2 }], expected: t('최대 무게: 15kg', 'Heaviest: 15kg'),
      hints: [t('지금 값이 최댓값보다 크면, 최댓값을 지금 값으로 바꿔요.', 'If the current value is bigger, set biggest to it.'), '>, w'], solution: ['>', 'w'],
    },
    write: {
      prompt: t('박스 무게가 <code>[8, 12, 15, 3, 11]</code> 이에요. 10kg 넘는 박스가 몇 개인지 반복문으로 세서 찍어 주세요.', 'Box weights are <code>[8, 12, 15, 3, 11]</code>. Count the boxes over 10kg with a loop and print it.'),
      starter: W, expected: t('10kg 넘는 박스: 3개', 'Boxes over 10kg: 3'),
      mustInclude: [{ re: 'for\\s+\\w+\\s+in', msg: t('반복문을 써 주세요.', 'Use a loop.') }, { re: '\\bif\\b', msg: t('<code>if</code> 로 조건을 확인해 주세요.', 'Check the condition with <code>if</code>.') }],
      hints: ['count = 0\nfor w in weights:\n    if w > 10:\n        count += 1', t('print(f"10kg 넘는 박스: {count}개")', 'print(f"Boxes over 10kg: {count}")')],
      solution: `weights = [8, 12, 15, 3, 11]\ncount = 0\nfor w in weights:\n    if w > 10:\n        count += 1\nprint(f"${t('10kg 넘는 박스: {count}개', 'Boxes over 10kg: {count}')}")`,
    },
    learned: [t('값 바꾸기 <code>a[i] = 값</code>', 'Change a value <code>a[i] = value</code>'), '<code>sum()</code>, <code>max()</code>, <code>min()</code>', t('개수: 조건 맞으면 <code>count += 1</code>', 'Count: <code>count += 1</code> when it matches')],
  },
  {
    id: 'ship-list', stage: 'shipping', npc: 'oh',
    title: t('늘어나는 출고 목록', 'A growing shipping list'),
    request: [t('출고 목록은 하루 종일 늘었다 줄었다 해요.', 'The shipping list grows and shrinks all day.'), t('리스트에 넣고 빼는 방법을 알려 줄래요?', 'Can you show me how to add to and remove from a list?')],
    thanks: t('append, pop 으로 목록 관리가 편해요!', 'append and pop make managing the list easy!'),
    concepts: [
      {
        title: t('넣고 빼기', 'Adding and removing'),
        body: t('<code>append(값)</code> 은 맨 뒤에 넣고, <code>pop()</code> 은 맨 뒤를 빼요. <code>pop(0)</code> 은 맨 앞을 빼요. 리스트는 크기가 알아서 늘고 줄어요.', '<code>append(value)</code> adds to the end, <code>pop()</code> removes the last, and <code>pop(0)</code> removes the first. Lists grow and shrink on their own.'),
        code: `items = []\nitems.append("${t('토너', 'Toner')}")\nitems.append("${t('립밤', 'Lip balm')}")\nitems.append("${t('쿠션', 'Cushion')}")\nprint(len(items))\nitems.pop()\nprint(items)\nitems.pop(0)\nprint(items)`,
      },
      {
        title: t('찾기와 값으로 빼기', 'Finding and removing by value'),
        body: t('<code>값 in 리스트</code> 는 들어 있는지, <code>index(값)</code> 은 몇 번째인지, <code>remove(값)</code> 은 그 값을 빼요.', '<code>value in list</code> tells whether it\'s there, <code>index(value)</code> where, and <code>remove(value)</code> removes it.'),
        code: 'items = ["A", "B", "C"]\nprint("C" in items)\nprint(items.index("B"))\nitems.remove("B")\nprint(items)',
      },
    ],
    predict: { prompt: t('이 코드를 실행하면 어떻게 찍힐까요?', 'What will this code print?'), code: 'a = [5, 8]\na.append(2)\na.pop(0)\nprint(a)', choices: ['[8, 2]', '[5, 8]', '[5, 2]', '[2]'], answer: 0, explain: t('append(2) 로 [5, 8, 2], pop(0) 으로 맨 앞 5 를 빼서 [8, 2].', 'append(2) makes [5, 8, 2], then pop(0) removes the first (5): [8, 2].') },
    fill: {
      prompt: t('목록에 상품 두 개를 넣고 개수를 찍게 하세요.', 'Add two products to the list and print the count.'),
      code: `items = []\nitems.{{0}}("${t('선크림', 'Sunscreen')}")\nitems.append("${t('쿠션', 'Cushion')}")\nprint(f"${t('출고 대기', 'Waiting')}: {{{1}}(items)}")`,
      blanks: [{ size: 6 }, { size: 4 }], expected: t('출고 대기: 2', 'Waiting: 2'),
      hints: [t('맨 뒤에 넣는 메서드와 개수를 세는 함수예요.', 'The method that adds to the end, and the counting function.'), 'append, len'], solution: ['append', 'len'],
    },
    write: {
      prompt: t('리스트 <code>orders</code> 에 "토너", "립밤", "선크림" 을 append 로 넣고, 첫 번째("토너")는 출고됐으니 빼 주세요. 남은 목록과 개수를 찍어 주세요.', 'Append "Toner", "Lip balm", "Sunscreen" to a list <code>orders</code>. The first ("Toner") has shipped, so remove it. Print what\'s left and the count.'),
      starter: W, expected: t("['립밤', '선크림']\n남은 주문: 2", "['Lip balm', 'Sunscreen']\nOrders left: 2"),
      mustInclude: [{ re: '\\.append\\s*\\(', msg: t('<code>append</code> 로 넣어 주세요.', 'Add with <code>append</code>.') }, { re: '\\.pop\\s*\\(\\s*0\\s*\\)|\\.remove\\s*\\(', msg: t('<code>pop(0)</code> 으로 맨 앞을 빼 주세요.', 'Remove the first with <code>pop(0)</code>.') }],
      hints: ['orders = []\norders.append(…) ×3\norders.pop(0)', t('print(orders)\nprint(f"남은 주문: {len(orders)}")', 'print(orders)\nprint(f"Orders left: {len(orders)}")')],
      solution: `orders = []\norders.append("${t('토너', 'Toner')}")\norders.append("${t('립밤', 'Lip balm')}")\norders.append("${t('선크림', 'Sunscreen')}")\norders.pop(0)\nprint(orders)\nprint(f"${t('남은 주문: ', 'Orders left: ')}{len(orders)}")`,
    },
    learned: [t('<code>append</code> 뒤에 넣기, <code>pop()</code> 뒤에서 빼기', '<code>append</code> adds, <code>pop()</code> removes last'), t('<code>pop(0)</code> 앞에서 빼기, <code>remove(값)</code>', '<code>pop(0)</code> removes first, <code>remove(value)</code>'), t('<code>x in a</code>, <code>a.index(x)</code>', '<code>x in a</code>, <code>a.index(x)</code>')],
  },

  // ───────────── 택배 상차장 · 윤기사님 · 문자열 ─────────────
  {
    id: 'load-string', stage: 'loading', npc: 'yoon',
    title: t('송장 번호 읽기', 'Read tracking numbers'),
    request: [t('송장 번호 앞 두 글자가 나라 코드예요.', 'The first two letters of a tracking number are the country code.'), t('번호에서 필요한 부분만 뽑아 줄 수 있어요?', 'Can you pull out just the parts we need?')],
    thanks: t('번개처럼 빠르네요! 바로 실을게요~', 'Fast as lightning! Loading them now!'),
    concepts: [
      {
        title: t('길이와 글자 하나', 'Length and one character'),
        body: t('<code>len(s)</code> 는 글자 수, <code>s[번호]</code> 는 그 위치의 글자 하나예요. 번호는 0 부터, 맨 끝은 <code>s[-1]</code>.', '<code>len(s)</code> is the number of characters, <code>s[index]</code> is one character. Indexes start at 0, the last is <code>s[-1]</code>.'),
        code: 'code = "KR20261112"\nprint(len(code))\nprint(code[0])\nprint(code[-1])',
      },
      {
        title: t('자르기(슬라이스)와 대소문자', 'Slicing and case'),
        body: t('<code>s[시작:끝]</code> 은 시작부터 끝 <b>바로 앞</b>까지 잘라요. <code>s[3:]</code> 은 3번부터 끝까지. <code>upper()</code> 대문자, <code>lower()</code> 소문자, <code>strip()</code> 앞뒤 공백 지우기.', '<code>s[start:end]</code> cuts from start up to <b>just before</b> end. <code>s[3:]</code> goes from 3 to the end. <code>upper()</code>, <code>lower()</code>, and <code>strip()</code> removes spaces at both ends.'),
        code: 'code = "  kr-778  "\nclean = code.strip().upper()\nprint(clean)\nprint(clean[0:2])\nprint(clean[3:])',
      },
    ],
    predict: { prompt: t('이 코드를 실행하면 어떻게 찍힐까요?', 'What will this code print?'), code: 's = "ABC123"\nprint(s[1:4])', choices: ['BC1', 'ABC', 'BC12', 'C12'], answer: 0, explain: t('번호 1 (B) 부터 4 바로 앞 (번호 3, 1) 까지라 BC1.', 'From index 1 (B) up to just before 4 (index 3, "1"), so BC1.') },
    fill: {
      prompt: t('송장 번호의 나라 코드와 길이를 찍게 하세요.', 'Print the country code and the length of the tracking number.'),
      code: `tracking = "KR20261112"\nprint(f"${t('국가', 'Country')}: {tracking[0:{{0}}]}")\nprint(f"${t('길이', 'Length')}: {{{1}}(tracking)}")`,
      blanks: [{ size: 2 }, { size: 4 }], expected: t('국가: KR\n길이: 10', 'Country: KR\nLength: 10'),
      hints: [t('앞 두 글자는 0 부터 2 바로 앞까지예요. 글자 수를 세는 함수는?', 'The first two are 0 up to just before 2. Which function counts characters?'), '2, len'], solution: ['2', 'len'],
    },
    write: {
      prompt: t('기사님이 송장을 <code>"  kr-778  "</code> 처럼 받아 왔어요. 앞뒤 공백을 지우고 대문자로 바꿔서 찍어 주세요.', 'The driver got a label like <code>"  kr-778  "</code>. Remove the spaces at both ends, make it uppercase, and print it.'),
      starter: W, expected: t('송장: KR-778', 'Label: KR-778'),
      mustInclude: [{ re: 'strip\\s*\\(', msg: t('<code>strip()</code> 으로 공백을 지워 주세요.', 'Remove the spaces with <code>strip()</code>.') }, { re: 'upper\\s*\\(', msg: t('<code>upper()</code> 로 대문자로 바꿔 주세요.', 'Make it uppercase with <code>upper()</code>.') }],
      hints: ['raw = "  kr-778  "', t('print(f"송장: {raw.strip().upper()}")', 'print(f"Label: {raw.strip().upper()}")')],
      solution: `raw = "  kr-778  "\nprint(f"${t('송장: ', 'Label: ')}{raw.strip().upper()}")`,
    },
    learned: [t('<code>len(s)</code> 글자 수, <code>s[i]</code> 한 글자', '<code>len(s)</code> count, <code>s[i]</code> one char'), t('<code>s[a:b]</code> → b 바로 앞까지', '<code>s[a:b]</code> → up to just before b'), '<code>strip()</code>, <code>upper()</code>'],
  },
  {
    id: 'load-string-search', stage: 'loading', npc: 'yoon',
    title: t('배송 경로 나누기', 'Split the delivery route'),
    request: [t('배송 경로가 "부산-대구-광주" 처럼 한 줄로 와요.', 'Delivery routes come in one line, like "Busan-Daegu-Gwangju".'), t('도시별로 나누고, 주소에 특정 동네가 있는지도 봐야 해요.', 'I need them split by city, and to check whether an address has a certain area.')],
    thanks: t('경로가 한눈에 보이네요. 출발합니다~', 'Now I can see the whole route. Off I go!'),
    concepts: [
      {
        title: t('찾기와 바꾸기', 'Finding and replacing'),
        body: t('<code>"글자" in s</code> 는 들어 있는지, <code>s.find(글자)</code> 는 몇 번째인지(없으면 -1), <code>s.replace(옛것, 새것)</code> 은 전부 바꾼 문자열을 줘요.', '<code>"text" in s</code> tells whether it\'s there, <code>s.find(text)</code> where (-1 if not), and <code>s.replace(old, new)</code> gives a string with all of them replaced.'),
        code: `addr = "${t('서울시 강남구 테헤란로', 'Teheran-ro, Gangnam, Seoul')}"\nprint("${t('강남', 'Gangnam')}" in addr)\nprint(addr.find("${t('강남', 'Gangnam')}"))\nprint("A-B-C".replace("-", "/"))`,
      },
      {
        title: t('나누기 <code>split</code>, 붙이기 <code>join</code>', 'Splitting with <code>split</code>, joining with <code>join</code>'),
        body: t('<code>s.split(기준)</code> 은 기준 글자로 잘라서 <b>리스트</b>를 줘요. 반대로 <code>"기준".join(리스트)</code> 는 하나로 붙여요.', '<code>s.split(separator)</code> cuts at the separator and gives a <b>list</b>. <code>"separator".join(list)</code> glues it back.'),
        code: 'parts = "A-B-C".split("-")\nprint(len(parts))\nprint(parts[1])\nprint(" > ".join(parts))',
      },
    ],
    predict: { prompt: t('이 코드를 실행하면 어떻게 찍힐까요?', 'What will this code print?'), code: 's = "a,b,c,d"\nprint(len(s.split(",")))', choices: ['4', '3', '7', '1'], answer: 0, explain: t('쉼표로 나누면 a, b, c, d 네 조각이에요.', 'Splitting at commas gives four pieces: a, b, c, d.') },
    fill: {
      prompt: t('주소에 "강남"이 들어 있는지와, "-" 를 "/" 로 바꾼 경로를 찍게 하세요.', 'Print whether the address contains "Gangnam", and the route with "-" replaced by "/".'),
      code: `addr = "${t('서울시 강남구', 'Gangnam, Seoul')}"\nroute = "A-B-C"\nprint("${t('강남', 'Gangnam')}" {{0}} addr)\nprint(route.{{1}}("-", "/"))`,
      blanks: [{ size: 3 }, { size: 7 }], expected: 'True\nA/B/C',
      hints: [t('들어 있는지 보는 단어와, 바꾸는 메서드예요.', 'The word that checks membership, and the method that replaces.'), 'in, replace'], solution: ['in', 'replace'],
    },
    write: {
      prompt: t('경로 <code>"부산-대구-광주"</code> 를 "-" 로 나눠서 도시를 한 줄씩 찍어 주세요.', 'Split the route <code>"Busan-Daegu-Gwangju"</code> at "-" and print each city on its own line.'),
      starter: W, expected: t('부산\n대구\n광주', 'Busan\nDaegu\nGwangju'),
      mustInclude: [{ re: 'split\\s*\\(', msg: t('<code>split</code> 으로 나눠 주세요.', 'Split it with <code>split</code>.') }, { re: 'for\\s+\\w+\\s+in', msg: t('반복문으로 하나씩 찍어 주세요.', 'Print them one by one with a loop.') }],
      hints: ['cities = route.split("-")', 'for c in cities:\n    print(c)'],
      solution: `route = "${t('부산-대구-광주', 'Busan-Daegu-Gwangju')}"\ncities = route.split("-")\nfor c in cities:\n    print(c)`,
    },
    learned: [t('<code>"x" in s</code> 있나?, <code>s.find</code> 어디?', '<code>"x" in s</code> is it there?, <code>s.find</code> where?'), t('<code>replace(옛것, 새것)</code>', '<code>replace(old, new)</code>'), t('<code>split</code> → 리스트, <code>join</code> → 문자열', '<code>split</code> → list, <code>join</code> → string')],
  },
  {
    id: 'load-format', stage: 'loading', npc: 'yoon',
    title: t('송장 라벨 서식 맞추기', 'Format the shipping label'),
    request: [t('송장 라벨은 칸이 딱 정해져 있어요. 금액엔 쉼표, 번호는 0 으로 채워야 하고요.', 'Labels have fixed layouts. Amounts need commas, and numbers need leading zeros.'), t('예쁘게 맞춰서 찍을 수 있을까요?', 'Can you print them neatly?')],
    thanks: t('라벨이 반듯하네요! 고객님들도 좋아하겠어요.', 'The labels look so neat! Customers will love it.'),
    concepts: [
      {
        title: t('f-문자열 서식', 'f-string formatting'),
        body: t('<code>{값:서식}</code> 으로 모양을 정해요. <code>{n:,}</code> 는 천 단위 쉼표, <code>{n:05}</code> 는 5자리로 앞을 0 으로 채우기, <code>{x:.1f}</code> 는 소수 한 자리.', 'Shape values with <code>{value:format}</code>. <code>{n:,}</code> adds thousands commas, <code>{n:05}</code> pads to 5 digits with zeros, <code>{x:.1f}</code> gives one decimal place.'),
        code: 'print(f"{1250000:,}")\nprint(f"{42:05}")\nprint(f"{2.345:.1f}")',
      },
      {
        title: t('칸 맞추기', 'Lining up columns'),
        body: t('<code>{s:&lt;6}</code> 은 6칸에서 왼쪽 정렬, <code>{n:&gt;5}</code> 는 오른쪽 정렬이에요. 표처럼 줄을 맞출 때 써요.', '<code>{s:&lt;6}</code> left-aligns in 6 spaces, <code>{n:&gt;5}</code> right-aligns. Use it to line up rows like a table.'),
        code: 'for name, qty in [("A", 3), ("BBB", 12)]:\n    print(f"[{name:<4}] {qty:>3}")',
      },
    ],
    predict: { prompt: t('이 코드를 실행하면 어떻게 찍힐까요?', 'What will this code print?'), code: 'print(f"{7:03}")', choices: ['007', '7', '700', '0007'], answer: 0, explain: t(':03 은 3자리로 맞추고 앞을 0 으로 채워요.', ':03 pads to 3 digits with leading zeros.') },
    fill: {
      prompt: t('금액은 쉼표, 송장 번호는 6자리로 앞을 0 으로 채워 찍게 하세요.', 'Print the amount with commas and the tracking number padded to 6 digits.'),
      code: `amount = 1250000\nno = 42\nprint(f"${t('금액', 'Amount')}: {amount:{{0}}}${t('원', ' won')}")\nprint(f"${t('번호', 'No.')}: {no:{{1}}}")`,
      blanks: [{ size: 2 }, { size: 3 }], expected: t('금액: 1,250,000원\n번호: 000042', 'Amount: 1,250,000 won\nNo.: 000042'),
      hints: [t('쉼표 서식은 쉼표 하나, 6자리 0 채우기는 06.', 'The comma format is just a comma; 6-digit zero padding is 06.'), ', 06'], solution: [',', '06'],
    },
    write: {
      prompt: t('상품 <code>"토너"</code>, 수량 3, 금액 45000 을 f-문자열로 한 줄에 찍어 주세요. 금액엔 쉼표를 넣어요.', 'Print product <code>"Toner"</code>, quantity 3, and amount 45000 on one line with an f-string. Put commas in the amount.'),
      starter: W, expected: t('토너 x3 = 45,000원', 'Toner x3 = 45,000 won'),
      mustInclude: [{ re: 'f"|f\'', msg: t('f-문자열을 써 주세요.', 'Use an f-string.') }, { re: ':,\\}', msg: t('금액에 <code>:,</code> 서식을 써 주세요.', 'Use the <code>:,</code> format for the amount.') }],
      hints: [t('f"{name} x{qty} = {amount:,}원"', 'f"{name} x{qty} = {amount:,} won"'), t('먼저 name, qty, amount 변수를 만들어요.', 'Make the name, qty and amount variables first.')],
      solution: `name = "${t('토너', 'Toner')}"\nqty = 3\namount = 45000\nprint(f"{name} x{qty} = {amount:,}${t('원', ' won')}")`,
    },
    learned: [t('<code>{n:,}</code> 쉼표, <code>{n:05}</code> 0 채우기', '<code>{n:,}</code> commas, <code>{n:05}</code> zero padding'), t('<code>{x:.1f}</code> 소수 한 자리', '<code>{x:.1f}</code> one decimal place'), t('<code>{s:&lt;6}</code> 왼쪽, <code>{n:&gt;5}</code> 오른쪽 정렬', '<code>{s:&lt;6}</code> left, <code>{n:&gt;5}</code> right align')],
  },

  // ───────────── 지게차 통로 · 최기사 · 함수 ─────────────
  {
    id: 'fork-method', stage: 'forklift', npc: 'choi',
    title: t('안전 수칙 방송 만들기', 'Make the safety announcement'),
    request: [t('빵빵! 김사원님, 지게차 지나갈 때마다 안전 방송을 해야 하는데요,', 'Beep beep! Kim, I have to make a safety announcement every time the forklift passes,'), t('같은 코드를 매번 쓰기 귀찮아요. 묶어 둘 수 없을까요?', 'and writing the same code each time is a pain. Can we bundle it?')],
    thanks: t('이제 한 줄만 부르면 방송 끝! 편하네요~', 'Now one line does the whole announcement. So handy!'),
    concepts: [
      {
        title: t('함수 만들고 부르기', 'Making and calling a function'),
        body: t('자주 쓰는 코드를 <b>함수</b>로 묶어 이름을 붙여요. <code>def 이름():</code> 아래 줄들을 들여써서 만들고, <code>이름()</code> 으로 불러요.', 'Bundle code you use often into a <b>function</b> with a name. Write <code>def name():</code> with the body indented, and call it with <code>name()</code>.'),
        code: `def warn():\n    print("${t('지게차 지나갑니다!', 'Forklift coming through!')}")\n\nwarn()\nwarn()`,
      },
      {
        title: t('매개변수: 값 넘겨주기', 'Parameters: passing values in'),
        body: t('괄호 안에 <b>매개변수</b>를 만들면 부를 때마다 다른 값을 넘길 수 있어요.', 'Put a <b>parameter</b> in the parentheses and you can pass a different value each call.'),
        code: `def warn(place):\n    print(place + "${t(' 지게차 통행 중!', ': forklift passing!')}")\n\nwarn("${t('입고장', 'Receiving')}")\nwarn("${t('출고장', 'Shipping')}")`,
      },
    ],
    predict: { prompt: t('이 코드를 실행하면 어떻게 찍힐까요?', 'What will this code print?'), code: 'def hi(name):\n    print("Hi " + name)\n\nhi("Kim")\nhi("Lee")', choices: ['Hi Kim\nHi Lee', 'Hi name\nHi name', 'Hi Kim', 'Hi Lee\nHi Kim'], answer: 0, explain: t('부를 때 넘긴 값이 name 에 들어가요. 부른 순서대로 찍혀요.', 'The value you pass goes into name, in the order you call it.') },
    fill: {
      prompt: t('함수를 만들고 두 번 불러서 방송이 두 번 나오게 하세요.', 'Make the function and call it twice so the announcement plays twice.'),
      code: `{{0}} beep():\n    print("${t('빵빵!', 'Beep beep!')}")\n\nbeep()\n{{1}}`,
      blanks: [{ size: 3 }, { size: 6 }], expected: t('빵빵!\n빵빵!', 'Beep beep!\nBeep beep!'),
      hints: [t('함수를 만드는 단어와, 함수를 부르는 모양이에요.', 'The word that makes a function, and how you call it.'), 'def, beep()'], solution: ['def', 'beep()'],
    },
    write: {
      prompt: t('<code>announce(zone)</code> 함수를 만들어 "[구역] 통행 주의" 를 찍게 하고, "피킹", "패킹" 으로 두 번 불러 주세요.', 'Make a function <code>announce(zone)</code> that prints "[zone] watch out", then call it with "Picking" and "Packing".'),
      starter: t('# 여기에 함수를 만들고 불러 보세요\n', '# Make your function and call it here\n'),
      expected: t('[피킹] 통행 주의\n[패킹] 통행 주의', '[Picking] watch out\n[Packing] watch out'),
      mustInclude: [{ re: 'def\\s+announce\\s*\\(\\s*\\w+\\s*\\)', msg: t('<code>def announce(zone):</code> 를 만들어 주세요.', 'Make <code>def announce(zone):</code>.') }, { re: 'announce\\s*\\(\\s*["\']', msg: t('<code>announce("…")</code> 로 불러 주세요.', 'Call it with <code>announce("…")</code>.') }],
      hints: [t('print(f"[{zone}] 통행 주의")', 'print(f"[{zone}] watch out")'), t('announce("피킹")\nannounce("패킹")', 'announce("Picking")\nannounce("Packing")')],
      solution: `def announce(zone):\n    print(f"[{zone}] ${t('통행 주의', 'watch out')}")\n\nannounce("${t('피킹', 'Picking')}")\nannounce("${t('패킹', 'Packing')}")`,
    },
    learned: [t('<code>def 이름():</code> + 들여쓰기로 만들기', 'Define with <code>def name():</code> + indent'), t('<code>이름()</code> 으로 부르기', 'Call with <code>name()</code>'), t('매개변수로 값 넘기기', 'Pass values with parameters')],
  },
  {
    id: 'fork-return', stage: 'forklift', npc: 'choi',
    title: t('적재 무게 계산기', 'Load weight calculator'),
    request: [t('지게차에 실을 무게를 매번 계산해야 해요.', 'I have to work out the load weight every time.'), t('계산해서 결과를 돌려주는 함수도 만들 수 있어요?', 'Can a function work it out and hand back the result?')],
    thanks: t('return 으로 받아 쓰니까 어디서든 쓸 수 있네요!', 'With return I can use the result anywhere!'),
    concepts: [
      {
        title: t('값을 돌려주는 <code>return</code>', 'Handing back a value with <code>return</code>'),
        body: t('<code>return 값</code> 으로 결과를 돌려줘요. 부른 쪽에서 변수에 담거나 바로 찍을 수 있어요. 매개변수에 <code>each=10</code> 처럼 기본값을 줄 수도 있어요.', 'Hand back a result with <code>return value</code>. The caller can store it or print it. Parameters can have defaults, like <code>each=10</code>.'),
        code: 'def total(boxes, each=10):\n    return boxes * each\n\nw = total(4, 12)\nprint(w)\nprint(total(3))',
      },
      {
        title: t('조건에 따라 돌려주기', 'Returning based on a condition'),
        body: t('<code>return</code> 을 만나면 함수는 그 자리에서 끝나요. True/False 를 돌려주면 조건문에 바로 쓸 수 있어요.', 'A function ends right where it hits <code>return</code>. Returning True/False lets you use it in an if right away.'),
        code: 'def can_lift(kg):\n    return kg <= 1000\n\nprint(can_lift(800))\nprint(can_lift(1200))',
      },
    ],
    predict: { prompt: t('이 코드를 실행하면 어떻게 찍힐까요?', 'What will this code print?'), code: 'def twice(n):\n    return n * 2\n\nprint(twice(twice(3)))', choices: ['12', '6', '9', '3'], answer: 0, explain: t('twice(3) 은 6, twice(6) 은 12.', 'twice(3) is 6, and twice(6) is 12.') },
    fill: {
      prompt: t('박스 수 × 박스 무게를 돌려주는 함수를 완성하세요.', 'Finish the function that returns boxes × weight per box.'),
      code: `def load(boxes, {{0}}):\n    {{1}} boxes * each\n\nprint(f"${t('적재 무게', 'Load')}: {load(5, 20)}kg")`,
      blanks: [{ size: 4 }, { size: 7 }], expected: t('적재 무게: 100kg', 'Load: 100kg'),
      hints: [t('두 번째 매개변수 이름은 아래에서 쓰는 이름과 같아야 해요. 돌려주는 단어는?', 'The second parameter must match the name used below. And the word that hands a value back?'), 'each, return'], solution: ['each', 'return'],
    },
    write: {
      prompt: t('<code>fee(kg)</code> 함수를 만들어 kg 당 1.5 를 곱한 운송비를 돌려주게 하고, 40kg 의 운송비를 찍어 주세요.', 'Make a function <code>fee(kg)</code> that returns kg × 1.5, then print the fee for 40kg.'),
      starter: t('# 여기에 함수를 만들고 불러 보세요\n', '# Make your function and call it here\n'),
      expected: t('운송비: 60.0', 'Fee: 60.0'),
      mustInclude: [{ re: 'def\\s+fee\\s*\\(', msg: t('<code>def fee(kg):</code> 를 만들어 주세요.', 'Make <code>def fee(kg):</code>.') }, { re: 'return', msg: t('<code>return</code> 으로 돌려주세요.', 'Hand it back with <code>return</code>.') }],
      hints: ['return kg * 1.5', t('print(f"운송비: {fee(40)}")', 'print(f"Fee: {fee(40)}")')],
      solution: `def fee(kg):\n    return kg * 1.5\n\nprint(f"${t('운송비: ', 'Fee: ')}{fee(40)}")`,
    },
    learned: [t('<code>return 값</code> → 거기서 끝', '<code>return value</code> → ends there'), t('기본값 <code>def f(a, b=10):</code>', 'Defaults <code>def f(a, b=10):</code>'), t('부른 결과를 변수에 담거나 바로 쓰기', 'Store the result or use it right away')],
  },
  {
    id: 'fork-reuse', stage: 'forklift', npc: 'choi',
    title: t('운행 기록 정리하기', 'Tidy the trip log'),
    request: [t('하루 운행 기록을 정리해야 해요. 리스트로 받은 무게를 다 더하고, 제일 무거운 것도 알고 싶어요.', 'I need to tidy up today\'s trip log: add up the weights from a list, and find the heaviest.'), t('함수로 나눠 두면 다음에도 쓸 수 있겠죠?', 'If we split it into functions, we can reuse them, right?')],
    thanks: t('함수로 나누니까 읽기도 쉽고 다시 쓰기도 좋네요!', 'Split into functions, it\'s easy to read and reuse!'),
    concepts: [
      {
        title: t('리스트를 받는 함수', 'A function that takes a list'),
        body: t('매개변수로 리스트도 받을 수 있어요. 함수 안에서 반복문을 돌리고 결과를 돌려줘요.', 'A parameter can be a list too. Loop inside the function and return the result.'),
        code: 'def total(arr):\n    s = 0\n    for x in arr:\n        s += x\n    return s\n\ntrips = [300, 450, 200]\nprint(total(trips))',
      },
      {
        title: t('함수끼리 부르기', 'Functions calling functions'),
        body: t('함수 안에서 다른 함수를 불러도 돼요. 작은 함수를 조립해서 큰 일을 해요.', 'A function can call another function. Build big jobs out of small ones.'),
        code: 'def total(arr):\n    s = 0\n    for x in arr:\n        s += x\n    return s\n\ndef average(arr):\n    return total(arr) / len(arr)\n\nprint(average([300, 450, 200]))',
      },
    ],
    predict: { prompt: t('이 코드를 실행하면 어떻게 찍힐까요?', 'What will this code print?'), code: 'def add(a, b):\n    return a + b\n\ndef triple(n):\n    return add(add(n, n), n)\n\nprint(triple(4))', choices: ['12', '8', '16', '4'], answer: 0, explain: t('add(4, 4) = 8, add(8, 4) = 12.', 'add(4, 4) = 8, then add(8, 4) = 12.') },
    fill: {
      prompt: t('리스트에서 제일 큰 값을 돌려주는 함수를 완성하세요.', 'Finish the function that returns the biggest value in the list.'),
      code: `def biggest(arr):\n    m = arr[0]\n    for x in arr:\n        if x > m:\n            m = x\n    {{0}} m\n\ntrips = [300, 450, 200]\nprint(f"${t('최대', 'Max')}: {{{1}}(trips)}kg")`,
      blanks: [{ size: 7 }, { size: 8 }], expected: t('최대: 450kg', 'Max: 450kg'),
      hints: [t('찾은 값을 돌려주고, 함수 이름으로 불러요.', 'Return what you found, and call it by name.'), 'return, biggest'], solution: ['return', 'biggest'],
    },
    write: {
      prompt: t('<code>count_over(arr, limit)</code> 함수를 만들어 limit 보다 무거운 운행 수를 돌려주게 하세요. <code>[300, 1200, 450, 1100]</code> 에서 1000 넘는 횟수를 찍어 주세요.', 'Make <code>count_over(arr, limit)</code> that returns how many trips are heavier than limit. Print the count over 1000 for <code>[300, 1200, 450, 1100]</code>.'),
      starter: t('trips = [300, 1200, 450, 1100]\n# 여기에 함수를 만들고 불러 보세요\n', 'trips = [300, 1200, 450, 1100]\n# Make your function and call it here\n'),
      expected: t('과적 운행: 2회', 'Heavy trips: 2'),
      mustInclude: [{ re: 'def\\s+count_over\\s*\\(\\s*\\w+\\s*,\\s*\\w+\\s*\\)', msg: t('<code>def count_over(arr, limit):</code> 를 만들어 주세요.', 'Make <code>def count_over(arr, limit):</code>.') }],
      hints: ['c = 0\nfor x in arr:\n    if x > limit:\n        c += 1\nreturn c', t('print(f"과적 운행: {count_over(trips, 1000)}회")', 'print(f"Heavy trips: {count_over(trips, 1000)}")')],
      solution: `trips = [300, 1200, 450, 1100]\n\ndef count_over(arr, limit):\n    c = 0\n    for x in arr:\n        if x > limit:\n            c += 1\n    return c\n\nprint(f"${t('과적 운행: {count_over(trips, 1000)}회', 'Heavy trips: {count_over(trips, 1000)}')}")`,
    },
    learned: [t('리스트도 매개변수로 받기', 'Lists can be parameters'), t('매개변수 여러 개: <code>(arr, limit)</code>', 'Several parameters: <code>(arr, limit)</code>'), t('작은 함수를 조립해서 쓰기', 'Build with small functions')],
  },

  // ───────────── 패킹 작업대 · 강군 · 딕셔너리 ─────────────
  {
    id: 'part-map', stage: 'parttime', npc: 'kang',
    title: t('상품별 재고표 만들기', 'Make a stock table'),
    request: [t('김사원님! 상품 이름으로 재고를 바로 찾고 싶은데요,', 'Kim! I want to look up stock by product name,'), t('리스트는 번호로만 찾잖아요. 이름으로 찾는 건 없어요?', 'but lists only go by number. Is there something that goes by name?')],
    thanks: t('이름표 붙인 서랍 같네요! 재고 찾기 쉬워졌어요.', 'It\'s like labelled drawers! Finding stock is easy now.'),
    concepts: [
      {
        title: t('딕셔너리: 키로 값 찾기', 'Dictionaries: find values by key'),
        body: t('<code>{키: 값, …}</code> 으로 키-값 짝을 담아요. <code>d[키]</code> 로 꺼내고, <code>d[키] = 값</code> 으로 넣거나 바꿔요. 개수는 <code>len(d)</code>.', '<code>{key: value, …}</code> holds key-value pairs. Read with <code>d[key]</code>, add or change with <code>d[key] = value</code>. The count is <code>len(d)</code>.'),
        code: `stock = {"${t('토너', 'toner')}": 12, "${t('립밤', 'lipbalm')}": 30}\nprint(stock["${t('토너', 'toner')}"])\nstock["${t('토너', 'toner')}"] = 10\nstock["${t('쿠션', 'cushion')}"] = 8\nprint(stock)\nprint(len(stock))`,
      },
      {
        title: t('있는지 확인하기', 'Checking a key'),
        body: t('<code>키 in d</code> 로 그 키가 있는지 봐요. 없는 키를 <code>d[키]</code> 로 꺼내면 에러(KeyError)가 나요. <code>d.get(키, 기본값)</code> 은 없을 때 기본값을 줘요.', 'Check with <code>key in d</code>. Reading a missing key with <code>d[key]</code> is an error (KeyError). <code>d.get(key, default)</code> gives the default instead.'),
        code: `stock = {"${t('토너', 'toner')}": 12}\nprint("${t('쿠션', 'cushion')}" in stock)\nprint(stock.get("${t('쿠션', 'cushion')}", 0))`,
      },
    ],
    predict: { prompt: t('이 코드를 실행하면 어떻게 찍힐까요?', 'What will this code print?'), code: 'm = {"a": 1, "b": 2}\nm["a"] = 5\nprint(m["a"] + m["b"])', choices: ['7', '3', '8', '12'], answer: 0, explain: t('"a" 는 5 로 바뀌었어요. 5 + 2 = 7.', '"a" was changed to 5. 5 + 2 = 7.') },
    fill: {
      prompt: t('재고표에 쿠션 8개를 넣고 꺼내 찍게 하세요.', 'Put 8 cushions in the stock table and print it.'),
      code: `stock = {}\nstock[{{0}}] = 8\nprint(f"${t('쿠션 재고', 'Cushion stock')}: {stock[{{1}}]}")`,
      blanks: [{ size: 10 }, { size: 10 }], expected: t('쿠션 재고: 8', 'Cushion stock: 8'),
      hints: [t('대괄호 안에 키를 문자열로 써요. f-문자열 안에서는 작은따옴표를 써요.', 'Write the key as a string in the brackets. Inside the f-string, use single quotes.'), t('"쿠션", \'쿠션\'', '"cushion", \'cushion\'')], solution: [t('"쿠션"', '"cushion"'), t("'쿠션'", "'cushion'")],
    },
    write: {
      prompt: t('재고표 <code>stock</code> 에 토너 12, 립밤 30 을 넣어 주세요. 립밤이 5개 팔렸으니 25 로 바꾸고, 선크림이 있는지(<code>in</code>)도 찍어 주세요.', 'Put toner 12 and lip balm 30 into a dict <code>stock</code>. 5 lip balms sold, so change it to 25. Also print whether sunscreen is there (<code>in</code>).'),
      starter: W, expected: t('립밤: 25\n선크림 있음: False', 'lipbalm: 25\nhas sunscreen: False'),
      mustInclude: [{ re: 'stock\\s*=\\s*\\{', msg: t('<code>stock = {…}</code> 딕셔너리를 만들어 주세요.', 'Make a dict <code>stock = {…}</code>.') }, { re: '\\bin\\s+stock', msg: t('<code>… in stock</code> 으로 확인해 주세요.', 'Check with <code>… in stock</code>.') }],
      hints: [t('stock["립밤"] = 25 로 바꿔요.', 'Change it with stock["lipbalm"] = 25.'), t('print(f"선크림 있음: {\'선크림\' in stock}")', 'print(f"has sunscreen: {\'sunscreen\' in stock}")')],
      solution: `stock = {"${t('토너', 'toner')}": 12, "${t('립밤', 'lipbalm')}": 30}\nstock["${t('립밤', 'lipbalm')}"] = 25\nprint(f"${t('립밤', 'lipbalm')}: {stock['${t('립밤', 'lipbalm')}']}")\nprint(f"${t('선크림 있음', 'has sunscreen')}: {'${t('선크림', 'sunscreen')}' in stock}")`,
    },
    learned: ['<code>d = {"key": value}</code>', t('<code>d[키]</code> 읽기·쓰기, <code>len(d)</code>', '<code>d[key]</code> read/write, <code>len(d)</code>'), t('<code>키 in d</code>, <code>d.get(키, 0)</code>', '<code>key in d</code>, <code>d.get(key, 0)</code>')],
  },
  {
    id: 'part-count', stage: 'parttime', npc: 'kang',
    title: t('택배사별 박스 세기', 'Count boxes per courier'),
    request: [t('오늘 포장한 박스가 택배사 이름으로 쭉 적혀 있어요.', 'Today\'s packed boxes are listed by courier name.'), t('택배사마다 몇 개인지 세 줄 수 있어요? 에어캡 하나 드릴게요 ㅎㅎ', 'Can you count how many each courier has? I\'ll give you a bubble wrap sheet, hehe.')],
    thanks: t('딱 맞아요! 에어캡은 비밀로 터뜨려요… 쉿!', 'Spot on! Pop the bubble wrap in secret… shh!'),
    concepts: [
      {
        title: t('딕셔너리로 개수 세기', 'Counting with a dict'),
        body: t('없으면 0 에서 시작해서 1 씩 더해요. <code>d[k] = d.get(k, 0) + 1</code> 이 흔한 모양이에요.', 'Start at 0 if missing and add 1. <code>d[k] = d.get(k, 0) + 1</code> is the usual pattern.'),
        code: 'picks = ["A", "B", "A", "A"]\ncount = {}\nfor p in picks:\n    count[p] = count.get(p, 0) + 1\nprint(count["A"])\nprint(count["B"])',
      },
      {
        title: t('딕셔너리 전체 돌기', 'Going through a whole dict'),
        body: t('<code>for k, v in d.items():</code> 로 키와 값을 같이 돌아요. 이름 순서로 돌고 싶으면 <code>for k in sorted(d):</code>.', 'Loop over keys and values with <code>for k, v in d.items():</code>. For name order, use <code>for k in sorted(d):</code>.'),
        code: 'm = {"b": 2, "a": 1, "c": 3}\nfor k in sorted(m):\n    print(f"{k}={m[k]}")',
      },
    ],
    predict: { prompt: t('이 코드를 실행하면 어떻게 찍힐까요?', 'What will this code print?'), code: 's = ["x", "y", "x"]\nc = {}\nfor k in s:\n    c[k] = c.get(k, 0) + 1\nprint(c["x"])', choices: ['2', '1', '3', 'None'], answer: 0, explain: t('"x" 가 두 번 나와서 0 → 1 → 2.', '"x" appears twice: 0 → 1 → 2.') },
    fill: {
      prompt: t('택배사 이름이 나올 때마다 1 씩 세게 하세요.', 'Count 1 each time a courier name appears.'),
      code: `boxes = ["${t('번개', 'Bolt')}", "${t('하늘', 'Sky')}", "${t('번개', 'Bolt')}"]\ncount = {}\nfor b in boxes:\n    count[b] = count.{{0}}(b, 0) + {{1}}\nprint(f"${t('번개', 'Bolt')}: {count['${t('번개', 'Bolt')}']}")`,
      blanks: [{ size: 4 }, { size: 2 }], expected: t('번개: 2', 'Bolt: 2'),
      hints: [t('없으면 기본값을 주는 메서드, 그리고 하나씩 더하는 수예요.', 'The method that gives a default when missing, and the number to add each time.'), 'get, 1'], solution: ['get', '1'],
    },
    write: {
      prompt: t('박스 목록 <code>["번개", "하늘", "번개", "바다", "번개", "하늘"]</code> 을 택배사별로 세서, 이름 순서대로 "이름: 개수" 를 찍어 주세요.', 'Count the box list <code>["Bolt", "Sky", "Bolt", "Ocean", "Bolt", "Sky"]</code> by courier and print "name: count" in name order.'),
      starter: W, expected: t('바다: 1\n번개: 3\n하늘: 2', 'Bolt: 3\nOcean: 1\nSky: 2'),
      mustInclude: [{ re: 'sorted\\s*\\(', msg: t('<code>sorted(count)</code> 로 이름 순서를 맞춰 주세요.', 'Use <code>sorted(count)</code> for name order.') }, { re: 'for\\s+\\w+\\s+in', msg: t('반복문으로 세 주세요.', 'Count with a loop.') }],
      hints: ['count = {}\nfor b in boxes:\n    count[b] = count.get(b, 0) + 1', 'for k in sorted(count):\n    print(f"{k}: {count[k]}")'],
      solution: `boxes = ["${t('번개', 'Bolt')}", "${t('하늘', 'Sky')}", "${t('번개', 'Bolt')}", "${t('바다', 'Ocean')}", "${t('번개', 'Bolt')}", "${t('하늘', 'Sky')}"]\ncount = {}\nfor b in boxes:\n    count[b] = count.get(b, 0) + 1\nfor k in sorted(count):\n    print(f"{k}: {count[k]}")`,
    },
    learned: [t('세기: <code>d[k] = d.get(k, 0) + 1</code>', 'Counting: <code>d[k] = d.get(k, 0) + 1</code>'), t('키·값 돌기: <code>for k, v in d.items():</code>', 'Keys and values: <code>for k, v in d.items():</code>'), t('이름 순서: <code>sorted(d)</code>', 'Name order: <code>sorted(d)</code>')],
  },

  // ───────────── 센터장실 · 문센터장 · 클래스, 예외, 복습 ─────────────
  {
    id: 'rest-class', stage: 'rest', npc: 'moon',
    title: t('상품 카드 만들기', 'Make product cards'),
    request: [t('김사원님, 이제 우리 센터 상품을 전산에 제대로 등록해 볼까요?', 'Kim, shall we register our products in the system properly now?'), t('상품마다 이름, 가격, 재고가 있잖아요. 이걸 한 덩어리로 찍어 내는 틀을 만들 수 있어요.', 'Each product has a name, price and stock. We can make a template that stamps them out.')],
    thanks: t('클래스까지 하다니, 이제 어엿한 전산 담당이네요!', 'Classes too! You\'re a real systems person now!'),
    concepts: [
      {
        title: t('클래스와 객체', 'Classes and objects'),
        body: t('<b>클래스</b>는 설계도, <b>객체</b>는 설계도로 만든 물건이에요. <code>class 이름:</code> 안에 <code>def __init__(self, …):</code> 를 만들고 <code>self.필드 = 값</code> 으로 값을 담아요. <code>이름(…)</code> 으로 객체를 만들어요.', 'A <b>class</b> is a blueprint; an <b>object</b> is built from it. Inside <code>class Name:</code>, write <code>def __init__(self, …):</code> and store values with <code>self.field = value</code>. Make objects with <code>Name(…)</code>.'),
        code: `class Product:\n    def __init__(self, name, price):\n        self.name = name\n        self.price = price\n\np = Product("${t('토너', 'Toner')}", 15000)\nprint(p.name, p.price)`,
      },
      {
        title: t('객체마다 따로', 'Each object is separate'),
        body: t('같은 클래스로 만든 객체라도 각자 자기 값을 따로 가져요. <code>self</code> 는 "이 객체" 예요.', 'Objects from the same class each keep their own values. <code>self</code> means "this object".'),
        code: `class Product:\n    def __init__(self, name, price):\n        self.name = name\n        self.price = price\n\na = Product("${t('토너', 'Toner')}", 15000)\nb = Product("${t('립밤', 'Lip balm')}", 4500)\nprint(a.name + ", " + b.name)`,
      },
    ],
    predict: { prompt: t('이 코드를 실행하면 어떻게 찍힐까요?', 'What will this code print?'), code: 'class Box:\n    def __init__(self, w):\n        self.w = w\n\na = Box(3)\nb = Box(5)\nprint(a.w + b.w)', choices: ['8', '35', '3', '5'], answer: 0, explain: t('a.w 는 3, b.w 는 5. 각 객체가 자기 값을 따로 가져요.', 'a.w is 3 and b.w is 5. Each object keeps its own value.') },
    fill: {
      prompt: t('생성 함수로 상품을 만들고 이름과 가격을 찍게 하세요.', 'Make a product with the init method and print its name and price.'),
      code: `class Product:\n    def {{0}}(self, name, price):\n        {{1}}.name = name\n        self.price = price\n\np = Product("${t('쿠션', 'Cushion')}", 22000)\nprint(f"{p.name}: {p.price}")`,
      blanks: [{ size: 8 }, { size: 4 }], expected: t('쿠션: 22000', 'Cushion: 22000'),
      hints: [t('객체를 만들 때 실행되는 특별한 함수(밑줄 두 개씩), 그리고 "이 객체" 를 뜻하는 단어예요.', 'The special method that runs when an object is made (two underscores each side), and the word for "this object".'), '__init__, self'], solution: ['__init__', 'self'],
    },
    write: {
      prompt: t('<code>name</code>, <code>stock</code> 을 받는 <code>Item</code> 클래스를 만들고, 토너(12개)와 립밤(30개) 객체를 만들어 찍어 주세요.', 'Make a class <code>Item</code> that takes <code>name</code> and <code>stock</code>. Create toner (12) and lip balm (30) and print them.'),
      starter: W, expected: t('토너: 12개\n립밤: 30개', 'Toner: 12\nLip balm: 30'),
      mustInclude: [{ re: 'class\\s+Item', msg: t('<code>class Item:</code> 을 만들어 주세요.', 'Make <code>class Item:</code>.') }, { re: 'def\\s+__init__\\s*\\(\\s*self', msg: t('<code>def __init__(self, name, stock):</code> 을 만들어 주세요.', 'Make <code>def __init__(self, name, stock):</code>.') }, { re: 'Item\\s*\\(\\s*["\']', msg: t('<code>Item("…", …)</code> 으로 객체를 만들어 주세요.', 'Create objects with <code>Item("…", …)</code>.') }],
      hints: ['class Item:\n    def __init__(self, name, stock):\n        self.name = name\n        self.stock = stock', t('a = Item("토너", 12)\nprint(f"{a.name}: {a.stock}개")', 'a = Item("Toner", 12)\nprint(f"{a.name}: {a.stock}")')],
      solution: `class Item:\n    def __init__(self, name, stock):\n        self.name = name\n        self.stock = stock\n\na = Item("${t('토너', 'Toner')}", 12)\nb = Item("${t('립밤', 'Lip balm')}", 30)\nprint(f"{a.name}: {a.stock}${t('개', '')}")\nprint(f"{b.name}: {b.stock}${t('개', '')}")`,
    },
    learned: [t('클래스 = 설계도, 객체 = <code>이름(…)</code> 으로 만든 것', 'Class = blueprint, object = made with <code>Name(…)</code>'), t('<code>__init__</code> 에서 <code>self.필드 = 값</code>', '<code>self.field = value</code> in <code>__init__</code>'), t('<code>객체.필드</code> 로 꺼내기', 'Read with <code>object.field</code>')],
  },
  {
    id: 'rest-object-method', stage: 'rest', npc: 'moon',
    title: t('재고가 스스로 줄어들게', 'Let stock update itself'),
    request: [t('상품이 팔리면 재고가 줄어야죠.', 'When a product sells, its stock should go down.'), t('그 일을 상품 객체가 직접 하게 만들 수 있어요.', 'We can make the product object do that itself.')],
    thanks: t('객체가 자기 일을 하니까 코드가 깔끔하네요. 훌륭해요!', 'Objects doing their own work keeps the code tidy. Excellent!'),
    concepts: [
      {
        title: t('객체의 메서드', 'Object methods'),
        body: t('클래스 안에 <code>def 이름(self, …):</code> 로 메서드를 만들면, <code>self</code> 로 그 객체의 값을 쓰고 바꿀 수 있어요. <code>객체.메서드()</code> 로 불러요. 첫 매개변수 <code>self</code> 는 부를 때 넘기지 않아요.', 'Write <code>def name(self, …):</code> inside the class to make a method; it uses and changes the object\'s values through <code>self</code>. Call it with <code>object.method()</code>; you don\'t pass <code>self</code> yourself.'),
        code: `class Item:\n    def __init__(self, name, stock):\n        self.name = name\n        self.stock = stock\n\n    def sell(self, n):\n        self.stock -= n\n\n    def label(self):\n        return f"{self.name} ({self.stock})"\n\nt = Item("${t('토너', 'Toner')}", 12)\nt.sell(3)\nprint(t.label())`,
      },
      {
        title: t('객체 여러 개를 리스트에', 'Many objects in a list'),
        body: t('객체도 리스트에 담고, 반복문으로 하나씩 일을 시킬 수 있어요.', 'Objects go into lists too, and you can loop through them.'),
        code: 'class Item:\n    def __init__(self, name, stock):\n        self.name = name\n        self.stock = stock\n\nitems = [Item("A", 5), Item("B", 0)]\nfor it in items:\n    print(f"{it.name}: {it.stock}")',
      },
    ],
    predict: { prompt: t('이 코드를 실행하면 어떻게 찍힐까요?', 'What will this code print?'), code: 'class Counter:\n    def __init__(self):\n        self.n = 0\n\n    def up(self):\n        self.n += 1\n\na = Counter()\nb = Counter()\na.up()\na.up()\nb.up()\nprint(a.n, b.n)', choices: ['2 1', '3 3', '1 1', '2 2'], answer: 0, explain: t('a 와 b 는 각자 자기 n 을 가져요. a 는 두 번, b 는 한 번 올렸어요.', 'a and b each have their own n. a went up twice, b once.') },
    fill: {
      prompt: t('판매 메서드를 완성해서 재고가 줄게 하세요.', 'Finish the sell method so stock goes down.'),
      code: `class Item:\n    def __init__(self):\n        self.stock = 10\n\n    def sell(self, n):\n        {{0}}.stock {{1}} n\n\nit = Item()\nit.sell(4)\nprint(f"${t('남은 재고', 'Stock left')}: {it.stock}")`,
      blanks: [{ size: 4 }, { size: 2 }], expected: t('남은 재고: 6', 'Stock left: 6'),
      hints: [t('"이 객체" 를 뜻하는 단어, 그리고 빼서 넣는 줄임 기호예요.', 'The word for "this object", and the subtract-and-store shortcut.'), 'self, -='], solution: ['self', '-='],
    },
    write: {
      prompt: t('<code>Item</code> 에 <code>is_empty(self)</code> (재고가 0 이면 True) 메서드를 만들어 주세요. 립밤(재고 2)을 2개 팔고, 비었는지 찍어 주세요.', 'Give <code>Item</code> a method <code>is_empty(self)</code> (True when stock is 0). Sell 2 lip balms (stock 2) and print whether it\'s empty.'),
      starter: `class Item:\n    def __init__(self, name, stock):\n        self.name = name\n        self.stock = stock\n\n    def sell(self, n):\n        self.stock -= n\n\n    ${t('# 여기에 is_empty 를 만드세요', '# Make is_empty here')}\n\n${t('# 여기서 써 보세요', '# Use it here')}\n`,
      expected: t('립밤 품절: True', 'Lip balm sold out: True'),
      mustInclude: [{ re: 'def\\s+is_empty\\s*\\(\\s*self\\s*\\)', msg: t('<code>def is_empty(self):</code> 를 만들어 주세요.', 'Make <code>def is_empty(self):</code>.') }, { re: '\\.is_empty\\s*\\(\\s*\\)', msg: t('<code>객체.is_empty()</code> 로 불러 주세요.', 'Call it with <code>object.is_empty()</code>.') }],
      hints: ['def is_empty(self):\n    return self.stock == 0', t('b = Item("립밤", 2)\nb.sell(2)\nprint(f"립밤 품절: {b.is_empty()}")', 'b = Item("Lip balm", 2)\nb.sell(2)\nprint(f"Lip balm sold out: {b.is_empty()}")')],
      solution: `class Item:\n    def __init__(self, name, stock):\n        self.name = name\n        self.stock = stock\n\n    def sell(self, n):\n        self.stock -= n\n\n    def is_empty(self):\n        return self.stock == 0\n\nb = Item("${t('립밤', 'Lip balm')}", 2)\nb.sell(2)\nprint(f"${t('립밤 품절: ', 'Lip balm sold out: ')}{b.is_empty()}")`,
    },
    learned: [t('메서드: <code>def 이름(self, …):</code>', 'Methods: <code>def name(self, …):</code>'), t('<code>self.필드</code> 로 자기 값 쓰기', 'Use its own values with <code>self.field</code>'), t('부를 땐 <code>객체.메서드()</code> (self 는 안 넘김)', 'Call <code>object.method()</code> (no self)')],
  },
  {
    id: 'rest-exception', stage: 'rest', npc: 'moon',
    title: t('잘못된 입력 막기', 'Guard against bad input'),
    request: [t('전산에 숫자 칸인데 글자가 들어오는 일이 꼭 있어요.', 'Sometimes letters end up in a number field.'), t('그럴 때 프로그램이 멈추지 않게 할 수 있어요?', 'Can we keep the program from crashing when that happens?')],
    thanks: t('에러가 나도 침착하게 넘어가네요. 든든해요!', 'Even with errors it carries on calmly. Reassuring!'),
    concepts: [
      {
        title: t('<code>try</code> / <code>except</code>', '<code>try</code> / <code>except</code>'),
        body: t('에러(예외)가 날 수 있는 코드를 <code>try:</code> 아래에 넣고, 에러가 나면 <code>except 에러종류:</code> 아래가 대신 실행돼요. 프로그램은 멈추지 않고 이어져요.', 'Put code that might fail under <code>try:</code>. If it fails, the block under <code>except ErrorType:</code> runs instead, and the program keeps going.'),
        code: `try:\n    n = int("12a")\n    print(n)\nexcept ValueError:\n    print("${t('숫자가 아니에요', 'Not a number')}")\nprint("${t('계속 진행', 'Still running')}")`,
      },
      {
        title: t('자주 보는 에러들', 'Common errors'),
        body: t('<code>ValueError</code> (숫자로 못 바꿈), <code>ZeroDivisionError</code> (0 으로 나누기), <code>IndexError</code> (없는 번호), <code>KeyError</code> (없는 키). <code>finally:</code> 는 에러가 나든 안 나든 마지막에 실행돼요.', '<code>ValueError</code> (can\'t make a number), <code>ZeroDivisionError</code> (divide by 0), <code>IndexError</code> (no such index), <code>KeyError</code> (no such key). <code>finally:</code> runs at the end either way.'),
        code: `a = [1, 2, 3]\ntry:\n    print(a[5])\nexcept IndexError:\n    print("${t('없는 번호예요', 'No such index')}")\nfinally:\n    print("${t('확인 끝', 'Check done')}")`,
      },
    ],
    predict: { prompt: t('이 코드를 실행하면 어떻게 찍힐까요?', 'What will this code print?'), code: 'try:\n    print("A")\n    x = 10 / 0\n    print("B")\nexcept ZeroDivisionError:\n    print("C")', choices: ['A\nC', 'A\nB\nC', 'C', 'A\nB'], answer: 0, explain: t('A 를 찍고 10 / 0 에서 에러가 나서 B 는 건너뛰고 except 의 C 를 찍어요.', 'A prints, then 10 / 0 fails, so B is skipped and except prints C.') },
    fill: {
      prompt: t('글자 "abc" 를 숫자로 바꾸다 에러가 나면 "입력 오류" 가 찍히게 하세요.', 'Print "Input error" when turning "abc" into a number fails.'),
      code: `{{0}}:\n    qty = int("abc")\n    print(qty)\n{{1}} ValueError:\n    print("${t('입력 오류', 'Input error')}")`,
      blanks: [{ size: 3 }, { size: 6 }], expected: t('입력 오류', 'Input error'),
      hints: [t('시도하는 블록과 에러를 잡는 블록의 단어예요.', 'The words for the trying block and the catching block.'), 'try, except'], solution: ['try', 'except'],
    },
    write: {
      prompt: t('수량 칸에 들어온 값들 <code>["3", "x", "5"]</code> 을 숫자로 바꿔서 더해 주세요. 바꿀 수 없는 값은 "건너뜀: x" 를 찍고 넘어가요. 마지막에 합계를 찍어 주세요.', 'Turn the quantity entries <code>["3", "x", "5"]</code> into numbers and add them. For one that can\'t be converted, print "Skipped: x" and move on. Print the total at the end.'),
      starter: W, expected: t('건너뜀: x\n합계: 8', 'Skipped: x\nTotal: 8'),
      mustInclude: [{ re: 'try\\s*:', msg: t('<code>try:</code> 를 써 주세요.', 'Use <code>try:</code>.') }, { re: 'except', msg: t('<code>except</code> 로 에러를 잡아 주세요.', 'Catch the error with <code>except</code>.') }],
      hints: ['for s in inputs:\n    try:\n        total += int(s)\n    except ValueError:\n        …', t('except 안에서 print(f"건너뜀: {s}")', 'Inside except: print(f"Skipped: {s}")')],
      solution: `inputs = ["3", "x", "5"]\ntotal = 0\nfor s in inputs:\n    try:\n        total += int(s)\n    except ValueError:\n        print(f"${t('건너뜀: ', 'Skipped: ')}{s}")\nprint(f"${t('합계: ', 'Total: ')}{total}")`,
    },
    learned: [t('<code>try:</code> / <code>except 에러:</code>', '<code>try:</code> / <code>except Error:</code>'), t('에러가 나도 프로그램은 계속', 'The program keeps going after an error'), t('<code>finally:</code> 는 항상 마지막에', '<code>finally:</code> always runs last')],
  },
  {
    id: 'rest-review', stage: 'rest', npc: 'moon',
    title: t('하루 마감 보고서', 'End-of-day report'),
    request: [t('오늘 하루 수고 많았어요. 마지막으로 마감 보고서를 만들어 볼까요?', 'Great work today. Shall we finish with the end-of-day report?'), t('지금까지 배운 걸 다 써야 할 거예요. 천천히 해 봐요.', 'You\'ll need everything you\'ve learned. Take your time.')],
    thanks: t('완벽한 보고서예요. 김사원님, 1회차 졸업 축하해요! 🎉', 'A perfect report. Kim, congratulations on finishing lap 1! 🎉'),
    concepts: [
      {
        title: t('배운 것 모아 쓰기', 'Putting it all together'),
        body: t('변수, 리스트, 반복문, 조건문, 함수를 한 프로그램에 같이 써요. 큰 일은 작은 함수로 나누면 읽기 쉬워요.', 'Use variables, lists, loops, conditions and functions in one program. Splitting a big job into small functions keeps it readable.'),
        code: 'def is_free(amount):\n    return amount >= 30000\n\norders = [12000, 35000, 8000]\nfree = 0\nfor o in orders:\n    if is_free(o):\n        free += 1\nprint(free)',
      },
      {
        title: t('보고서 모양 만들기', 'Shaping the report'),
        body: t('합계·개수 같은 결과를 변수에 모아 두고, 마지막에 f-문자열로 한꺼번에 찍어요.', 'Collect results like totals and counts in variables, then print them with f-strings at the end.'),
        code: `total = 55000\ncount = 3\nprint(f"${t('주문 {count}건, 합계 {total:,}원', '{count} orders, total {total:,} won')}")`,
      },
    ],
    predict: { prompt: t('이 코드를 실행하면 어떻게 찍힐까요?', 'What will this code print?'), code: 'a = [5, 12, 7, 20]\ntotal = 0\nfor x in a:\n    if x >= 10:\n        total += x\nprint(total)', choices: ['32', '44', '12', '20'], answer: 0, explain: t('10 이상인 12 와 20 만 더해서 32.', 'Only 12 and 20 are 10 or more: 32.') },
    fill: {
      prompt: t('3만 원 이상 주문만 세는 함수를 완성하세요.', 'Finish the function that counts orders of 30,000 or more.'),
      code: `def count_free(orders):\n    c = 0\n    for o in orders:\n        if o {{0}} 30000:\n            c += 1\n    {{1}} c\n\nprint(f"${t('무료 배송', 'Free shipping')}: {count_free([12000, 35000, 8000, 50000])}")`,
      blanks: [{ size: 3 }, { size: 7 }], expected: t('무료 배송: 2', 'Free shipping: 2'),
      hints: [t('"이상" 비교 기호와, 값을 돌려주는 단어예요.', 'The "or more" comparison, and the word that hands a value back.'), '>=, return'], solution: ['>=', 'return'],
    },
    write: {
      prompt: t('오늘 주문 금액 <code>[12000, 35000, 8000, 50000]</code> 으로 보고서를 찍어 주세요: 총 금액(쉼표), 무료 배송(3만 원 이상) 건수, 가장 큰 주문. 반복문 하나로 계산해 보세요.', 'Print a report for today\'s orders <code>[12000, 35000, 8000, 50000]</code>: the total (with commas), the number of free-shipping orders (30,000 or more), and the biggest order. Work them out in one loop.'),
      starter: W, expected: t('총 금액: 105,000원\n무료 배송: 2건\n최대 주문: 50,000원', 'Total: 105,000 won\nFree shipping: 2\nBiggest order: 50,000 won'),
      mustInclude: [{ re: 'for\\s+\\w+\\s+in', msg: t('반복문을 써 주세요.', 'Use a loop.') }, { re: '\\bif\\b', msg: t('<code>if</code> 로 조건을 확인해 주세요.', 'Check conditions with <code>if</code>.') }],
      hints: [t('total, free, biggest 세 변수를 반복문 하나에서 같이 계산해요.', 'Work out total, free and biggest in a single loop.'), t('f"총 금액: {total:,}원"', 'f"Total: {total:,} won"')],
      solution: `orders = [12000, 35000, 8000, 50000]\ntotal = 0\nfree = 0\nbiggest = orders[0]\nfor o in orders:\n    total += o\n    if o >= 30000:\n        free += 1\n    if o > biggest:\n        biggest = o\nprint(f"${t('총 금액: {total:,}원', 'Total: {total:,} won')}")\nprint(f"${t('무료 배송: {free}건', 'Free shipping: {free}')}")\nprint(f"${t('최대 주문: {biggest:,}원', 'Biggest order: {biggest:,} won')}")`,
    },
    learned: [t('반복문 하나로 여러 값 같이 계산', 'Work out several values in one loop'), t('큰 일은 작은 함수로', 'Split big jobs into small functions'), t('마지막에 서식 맞춰 찍기', 'Print neatly at the end')],
  },
];
