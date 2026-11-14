// JavaScript quests for the rest of lap 1 (operators → classes). Korean and English sit side by side:
// t('한국어', 'English') picks the display language. Explained only in JavaScript terms.
// Every example, fill solution and write solution was run for real and matches `expected`.
import { tr as t } from '../../i18n.js';

const W = t('// 여기에 코드를 쓰세요\n', '// Write your code here\n');

export const QUESTS = [
  // ───────────── 주문 출력실 · 이대리 · 연산자 ─────────────
  {
    id: 'print-arith', stage: 'printing', npc: 'lee',
    title: t('송장 금액 계산하기', 'Work out the order total'),
    request: [t('김사원님, 송장에 결제 금액이 찍혀야 하는데 계산이 자꾸 틀려요…', 'Kim, the payment amount on the labels keeps coming out wrong…'), t('자바스크립트로 금액 계산 좀 해 줄래요?', 'Could you do the math in JavaScript?')],
    thanks: t('금액이 딱 맞네요! 송장 출력 시작할게요~', 'The totals are spot on! Printing the labels now!'),
    concepts: [
      {
        title: t('사칙연산과 나머지 <code>%</code>', 'Math and remainder <code>%</code>'),
        body: t('<code>+ - * /</code> 로 계산해요. <code>/</code> 는 소수점까지 나와요. <code>%</code> 는 나눈 <b>나머지</b>, 몫만 필요하면 <code>Math.floor(a / b)</code>. 곱하기·나누기가 먼저, 괄호가 있으면 괄호부터예요.', 'Use <code>+ - * /</code>. <code>/</code> keeps decimals. <code>%</code> gives the <b>remainder</b>; for the whole part use <code>Math.floor(a / b)</code>. Multiply/divide first, parentheses before that.'),
        code: 'console.log(10 + 3 * 2);\nconsole.log((10 + 3) * 2);\nconsole.log(23 / 5);\nconsole.log(Math.floor(23 / 5));\nconsole.log(23 % 5);',
      },
      {
        title: t('줄여 쓰기 <code>+=</code> <code>++</code>', 'Shortcuts <code>+=</code> <code>++</code>'),
        body: t('<code>a += 3</code> 은 <code>a = a + 3</code> 과 같아요. <code>a++</code> 는 1 더하기, <code>a--</code> 는 1 빼기예요.', '<code>a += 3</code> is the same as <code>a = a + 3</code>. <code>a++</code> adds 1, <code>a--</code> subtracts 1.'),
        code: 'let count = 10;\ncount += 5;\ncount++;\ncount -= 2;\nconsole.log(count);',
      },
    ],
    predict: { prompt: t('이 코드를 실행하면 어떻게 찍힐까요?', 'What will this code print?'), code: 'const a = 17;\nconsole.log(a % 4);', choices: ['1', '4', '4.25', '0'], answer: 0, explain: t('17 을 4 로 나누면 몫 4, 나머지 1 이에요. % 는 나머지예요.', '17 divided by 4 is 4 with a remainder of 1. % gives the remainder.') },
    fill: {
      prompt: t('박스 23개를 5개씩 묶었어요. 묶음 수와 남은 박스를 찍어 주세요.', '23 boxes are bundled in fives. Print the bundles and the boxes left over.'),
      code: `const boxes = 23;\nconsole.log("${t('묶음', 'Bundles')}: " + Math.floor(boxes {{0}} 5));\nconsole.log("${t('남은 박스', 'Left over')}: " + (boxes {{1}} 5));`,
      blanks: [{ size: 2 }, { size: 2 }], expected: t('묶음: 4\n남은 박스: 3', 'Bundles: 4\nLeft over: 3'),
      hints: [t('나눈 다음 Math.floor 로 몫만 남겨요. 나머지는 다른 기호예요.', 'Divide, then Math.floor keeps the whole part. The remainder uses another symbol.'), '/, %'], solution: ['/', '%'],
    },
    write: {
      prompt: t('립밤 한 개 4500원, 3개 주문에 배송비 3000원이에요. 변수 <code>price</code>, <code>qty</code>, <code>shipping</code> 을 만들고 결제 금액을 찍어 주세요.', 'One lip balm is 4500 won, 3 were ordered, and shipping is 3000 won. Make variables <code>price</code>, <code>qty</code>, <code>shipping</code> and print the total.'),
      starter: W, expected: t('결제 금액: 16500원', 'Total: 16500 won'),
      mustInclude: [{ re: '(let|const)\\s+price', msg: t('<code>price</code> 변수를 만들어 주세요.', 'Make a <code>price</code> variable.') }, { re: 'price\\s*\\*\\s*qty|qty\\s*\\*\\s*price', msg: t('<code>price * qty</code> 로 계산해 주세요.', 'Calculate it with <code>price * qty</code>.') }],
      hints: ['price * qty + shipping', t('console.log("결제 금액: " + (price * qty + shipping) + "원");', 'console.log("Total: " + (price * qty + shipping) + " won");')],
      solution: `const price = 4500;\nconst qty = 3;\nconst shipping = 3000;\nconsole.log("${t('결제 금액: ', 'Total: ')}" + (price * qty + shipping) + "${t('원', ' won')}");`,
    },
    learned: [t('<code>* /</code> 가 <code>+ -</code> 보다 먼저', '<code>* /</code> before <code>+ -</code>'), t('<code>%</code> 나머지, <code>Math.floor(a / b)</code> 몫', '<code>%</code> remainder, <code>Math.floor(a / b)</code> whole part'), '<code>a += 3</code>, <code>a++</code>'],
  },
  {
    id: 'print-compare', stage: 'printing', npc: 'lee',
    title: t('무료 배송 판별하기', 'Check free shipping'),
    request: [t('3만 원 넘게 사면 무료 배송인데요,', 'Orders of 30,000 won or more ship free,'), t('주문마다 맞는지 true/false 로 찍어 줄래요?', 'could you print true or false for each order?')],
    thanks: t('true, false 로 보니까 한눈에 들어와요!', 'Seeing true and false makes it so clear!'),
    concepts: [
      {
        title: t('비교 연산자', 'Comparison operators'),
        body: t('<code>&gt; &lt; &gt;= &lt;=</code> 로 비교하면 결과는 <code>true</code> 아니면 <code>false</code> 예요. 같다는 <code>===</code> (등호 세 개), 다르다는 <code>!==</code> 를 써요. 등호 두 개 <code>==</code> 는 타입을 멋대로 바꿔 비교해서 헷갈리기 쉬워요.', 'Comparing with <code>&gt; &lt; &gt;= &lt;=</code> gives <code>true</code> or <code>false</code>. Use <code>===</code> (three signs) for equal and <code>!==</code> for not equal. The two-sign <code>==</code> converts types on its own and is easy to get wrong.'),
        code: 'const price = 35000;\nconsole.log(price >= 30000);\nconsole.log(price === 30000);\nconsole.log(price !== 30000);\nconsole.log(5 == "5", 5 === "5");',
      },
      {
        title: t('그리고 <code>&&</code>, 또는 <code>||</code>, 아니다 <code>!</code>', 'and <code>&&</code>, or <code>||</code>, not <code>!</code>'),
        body: t('<code>&&</code> 는 둘 다 참일 때만 참, <code>||</code> 는 하나만 참이어도 참, <code>!</code> 는 반대로 바꿔요.', '<code>&&</code> is true only when both are true, <code>||</code> is true when either is, and <code>!</code> flips it.'),
        code: 'const fragile = true;\nconst heavy = false;\nconsole.log(fragile && heavy);\nconsole.log(fragile || heavy);\nconsole.log(!heavy);',
      },
    ],
    predict: { prompt: t('이 코드를 실행하면 어떻게 찍힐까요?', 'What will this code print?'), code: 'console.log(5 > 3 && 2 > 4);', choices: ['false', 'true', '5', t('에러', 'Error')], answer: 0, explain: t('5 > 3 은 true, 2 > 4 는 false. && 는 둘 다 true 여야 해서 false.', '5 > 3 is true, 2 > 4 is false. && needs both, so false.') },
    fill: {
      prompt: t('3만 원 이상이면 무료 배송, 깨지거나 무거우면 뽁뽁이 포장이에요.', 'Free shipping from 30,000 won; bubble wrap if fragile or heavy.'),
      code: `const price = 35000;\nconst fragile = false;\nconst heavy = true;\nconsole.log("${t('무료 배송', 'Free shipping')}: " + (price {{0}} 30000));\nconsole.log("${t('뽁뽁이', 'Bubble wrap')}: " + (fragile {{1}} heavy));`,
      blanks: [{ size: 3 }, { size: 3 }], expected: t('무료 배송: true\n뽁뽁이: true', 'Free shipping: true\nBubble wrap: true'),
      hints: [t('"이상"은 같은 것도 포함해요. "또는"은 하나만 참이어도 돼요.', '"From" includes equal. "Or" needs just one to be true.'), '>=, ||'], solution: ['>=', '||'],
    },
    write: {
      prompt: t('주문 금액 <code>total</code> 이 28000원이고 쿠폰 <code>hasCoupon</code> 이 있어요(true). 2만 원 이상이면서 쿠폰이 있으면 할인이에요. 할인 여부를 찍어 주세요.', 'The order <code>total</code> is 28000 won and <code>hasCoupon</code> is true. A discount applies if the total is 20000 or more AND there is a coupon. Print whether it applies.'),
      starter: W, expected: t('할인 가능: true', 'Discount: true'),
      mustInclude: [{ re: '&&', msg: t('두 조건을 <code>&&</code> 로 합쳐 주세요.', 'Combine the two conditions with <code>&&</code>.') }, { re: '(let|const)\\s+hasCoupon', msg: t('<code>hasCoupon</code> 변수를 만들어 주세요.', 'Make a <code>hasCoupon</code> variable.') }],
      hints: ['total >= 20000 && hasCoupon', t('console.log("할인 가능: " + (total >= 20000 && hasCoupon));', 'console.log("Discount: " + (total >= 20000 && hasCoupon));')],
      solution: `const total = 28000;\nconst hasCoupon = true;\nconsole.log("${t('할인 가능: ', 'Discount: ')}" + (total >= 20000 && hasCoupon));`,
    },
    learned: [t('비교 결과는 <code>true</code>/<code>false</code>', 'Comparisons give <code>true</code>/<code>false</code>'), t('같다 <code>===</code>, 다르다 <code>!==</code>', 'equal <code>===</code>, not equal <code>!==</code>'), t('<code>&&</code> 그리고, <code>||</code> 또는, <code>!</code> 반대', '<code>&&</code> and, <code>||</code> or, <code>!</code> not')],
  },

  // ───────────── 피킹 · 정사원 · 조건문 ─────────────
  {
    id: 'pick-if', stage: 'picking', npc: 'jung',
    title: t('재고 확인하고 피킹하기', 'Check stock before picking'),
    request: [t('김사원님, 주문 들어온 만큼 재고가 있는지 보고 피킹해야 해요.', 'Kim, we need to check there\'s enough stock before picking an order.'), t('재고에 따라 다른 말을 찍어 줄래요?', 'Could you print a different message depending on stock?')],
    thanks: t('이제 재고 없는 걸 헛걸음 안 하겠어요!', 'No more walking to empty shelves!'),
    concepts: [
      {
        title: t('<code>if</code> 와 <code>else</code>', '<code>if</code> and <code>else</code>'),
        body: t('<code>if (조건) { … }</code> 는 조건이 true 일 때만 실행해요. <code>else { … }</code> 는 false 일 때 실행돼요.', '<code>if (condition) { … }</code> runs only when the condition is true. <code>else { … }</code> runs when it\'s false.'),
        code: `const stock = 3;\nconst order = 5;\nif (stock >= order) {\n  console.log("${t('피킹 가능', 'Ready to pick')}");\n} else {\n  console.log("${t('재고 부족', 'Not enough stock')}");\n}`,
      },
      {
        title: t('여러 갈래 <code>else if</code>', 'Many branches <code>else if</code>'),
        body: t('조건을 위에서부터 차례로 보고, <b>처음 맞는 것 하나만</b> 실행해요.', 'Conditions are checked from the top, and <b>only the first match</b> runs.'),
        code: `const weight = 7;\nif (weight < 2) {\n  console.log("${t('소형', 'Small')}");\n} else if (weight < 10) {\n  console.log("${t('중형', 'Medium')}");\n} else {\n  console.log("${t('대형', 'Large')}");\n}`,
      },
    ],
    predict: { prompt: t('이 코드를 실행하면 어떻게 찍힐까요?', 'What will this code print?'), code: 'const n = 15;\nif (n > 10) {\n  console.log("A");\n} else if (n > 5) {\n  console.log("B");\n} else {\n  console.log("C");\n}', choices: ['A', 'B', 'A\nB', 'C'], answer: 0, explain: t('15 > 10 이 먼저 맞아서 A 만 찍고 끝나요. 아래 조건은 보지 않아요.', '15 > 10 matches first, so only A prints. The rest are skipped.') },
    fill: {
      prompt: t('재고가 주문 수량 이상이면 "피킹 가능", 아니면 "재고 부족"이 찍히게 하세요.', 'Print "Ready to pick" if stock covers the order, otherwise "Not enough stock".'),
      code: `const stock = 8;\nconst order = 5;\n{{0}} (stock >= order) {\n  console.log("${t('피킹 가능', 'Ready to pick')}");\n} {{1}} {\n  console.log("${t('재고 부족', 'Not enough stock')}");\n}`,
      blanks: [{ size: 3 }, { size: 5 }], expected: t('피킹 가능', 'Ready to pick'),
      hints: [t('"만약"과 "아니면"에 해당하는 단어예요.', 'The words for "if" and "otherwise".'), 'if, else'], solution: ['if', 'else'],
    },
    write: {
      prompt: t('랙 번호 <code>rack</code> 이 12예요. 10 이하는 "A구역", 20 이하는 "B구역", 그 외는 "C구역"을 찍어 주세요.', 'The <code>rack</code> number is 12. Print "Zone A" for 10 or less, "Zone B" for 20 or less, otherwise "Zone C".'),
      starter: W, expected: t('B구역', 'Zone B'),
      mustInclude: [{ re: 'else\\s+if', msg: t('<code>else if</code> 를 써 주세요.', 'Use <code>else if</code>.') }],
      hints: ['if (rack <= 10) … else if (rack <= 20) … else …', t('위 순서대로 세 갈래를 만들면 12 는 두 번째에 걸려요.', 'Make three branches in that order; 12 lands in the second.')],
      solution: `const rack = 12;\nif (rack <= 10) {\n  console.log("${t('A구역', 'Zone A')}");\n} else if (rack <= 20) {\n  console.log("${t('B구역', 'Zone B')}");\n} else {\n  console.log("${t('C구역', 'Zone C')}");\n}`,
    },
    learned: [t('<code>if (조건) { }</code> → 참일 때만', '<code>if (condition) { }</code> → only when true'), t('<code>else</code> → 아닐 때', '<code>else</code> → otherwise'), t('<code>else if</code> → 처음 맞는 하나만', '<code>else if</code> → only the first match')],
  },
  {
    id: 'pick-string-cond', stage: 'picking', npc: 'jung',
    title: t('구역 이름으로 고르기', 'Pick by zone name'),
    request: [t('이번엔 구역 이름이 글자로 와요. "A" 구역이면서 수량이 있을 때만 피킹이에요.', 'This time the zone comes as text. We pick only from zone "A" and only if there\'s quantity.'), t('글자도 비교할 수 있어요?', 'Can you compare text too?')],
    thanks: t('글자 비교도 문제없네요!', 'Comparing text is no problem either!'),
    concepts: [
      {
        title: t('문자열 비교', 'Comparing strings'),
        body: t('문자열도 <code>===</code> 로 같은지 비교해요. 대소문자가 다르면 다른 글자예요. 무시하고 싶으면 둘 다 <code>toLowerCase()</code> 로 바꿔서 비교해요.', 'Compare strings with <code>===</code> too. Different case means different text. To ignore case, turn both into <code>toLowerCase()</code> first.'),
        code: 'const zone = "A";\nconsole.log(zone === "A");\nconsole.log(zone === "a");\nconsole.log(zone.toLowerCase() === "a");',
      },
      {
        title: t('조건 합치기', 'Combining conditions'),
        body: t('<code>if</code> 안에서도 <code>&&</code>, <code>||</code> 로 조건을 합칠 수 있어요.', 'You can combine conditions with <code>&&</code> and <code>||</code> inside an <code>if</code>.'),
        code: `const zone = "A";\nconst qty = 0;\nif (zone === "A" && qty > 0) {\n  console.log("${t('피킹', 'Pick')}");\n} else {\n  console.log("${t('건너뛰기', 'Skip')}");\n}`,
      },
    ],
    predict: { prompt: t('이 코드를 실행하면 어떻게 찍힐까요?', 'What will this code print?'), code: 'const c = "B";\nif (c === "A" || c === "B") {\n  console.log("OK");\n} else {\n  console.log("NO");\n}', choices: ['OK', 'NO', 'OK\nNO', t('에러', 'Error')], answer: 0, explain: t('c 는 "B" 라서 두 번째 조건이 true. || 는 하나만 맞아도 돼요.', 'c is "B", so the second check is true. || needs just one.') },
    fill: {
      prompt: t('구역이 "A" 이고 수량이 0보다 크면 "A구역 피킹"이 찍히게 하세요.', 'Print "Picking zone A" when the zone is "A" and quantity is above 0.'),
      code: `const zone = "A";\nconst qty = 4;\nif (zone {{0}} "A" {{1}} qty > 0) {\n  console.log("${t('A구역 피킹', 'Picking zone A')}");\n}`,
      blanks: [{ size: 4 }, { size: 3 }], expected: t('A구역 피킹', 'Picking zone A'),
      hints: [t('같은지 보는 기호(등호 세 개)와 "그리고" 기호예요.', 'The equals check (three signs) and the "and" symbol.'), '===, &&'], solution: ['===', '&&'],
    },
    write: {
      prompt: t('택배사 <code>courier</code> 가 "번개택배"이고 무게 <code>weight</code> 가 12예요. 번개택배이면서 10kg 넘으면 "추가 요금", 아니면 "기본 요금"을 찍어 주세요.', 'The <code>courier</code> is "Lightning" and <code>weight</code> is 12. Print "Extra fee" if it\'s Lightning and over 10kg, otherwise "Base fee".'),
      starter: W, expected: t('추가 요금', 'Extra fee'),
      mustInclude: [{ re: '===', msg: t('<code>===</code> 로 비교해 주세요.', 'Compare with <code>===</code>.') }, { re: '&&', msg: t('두 조건을 <code>&&</code> 로 합쳐 주세요.', 'Combine with <code>&&</code>.') }],
      hints: [t('courier === "번개택배" && weight > 10', 'courier === "Lightning" && weight > 10'), t('if 와 else 로 두 갈래를 만들어요.', 'Make two branches with if and else.')],
      solution: `const courier = "${t('번개택배', 'Lightning')}";\nconst weight = 12;\nif (courier === "${t('번개택배', 'Lightning')}" && weight > 10) {\n  console.log("${t('추가 요금', 'Extra fee')}");\n} else {\n  console.log("${t('기본 요금', 'Base fee')}");\n}`,
    },
    learned: [t('문자열도 <code>===</code> 로 비교', 'Compare strings with <code>===</code>'), t('대소문자 무시: 둘 다 <code>toLowerCase()</code>', 'Ignore case: <code>toLowerCase()</code> both'), t('<code>if</code> 안에서 <code>&&</code> <code>||</code>', '<code>&&</code> <code>||</code> inside <code>if</code>')],
  },
  {
    id: 'pick-switch', stage: 'picking', npc: 'jung',
    title: t('구역 코드로 층 안내하기', 'Floor guide by zone code'),
    request: [t('구역 코드마다 몇 층인지 안내해야 해요.', 'We need to tell people which floor each zone code is on.'), t('if 를 길게 늘어놓기보다 깔끔한 방법이 있대요!', 'There\'s apparently a cleaner way than a long chain of ifs!')],
    thanks: t('switch 로 쓰니까 표처럼 보이네요!', 'With switch it reads like a table!'),
    concepts: [
      {
        title: '<code>switch</code>',
        body: t('값 하나를 여러 경우와 비교할 때 써요. 맞는 <code>case</code> 부터 실행하고, <code>break</code> 에서 멈춰요. 맞는 게 없으면 <code>default</code>.', 'Use it to compare one value against many cases. It runs from the matching <code>case</code> and stops at <code>break</code>. If nothing matches, <code>default</code> runs.'),
        code: `const zone = "B";\nswitch (zone) {\n  case "A":\n    console.log("${t('1층', '1st floor')}");\n    break;\n  case "B":\n    console.log("${t('2층', '2nd floor')}");\n    break;\n  default:\n    console.log("${t('모르는 구역', 'Unknown zone')}");\n}`,
      },
      {
        title: t('<code>break</code> 를 빼면?', 'What if you leave out <code>break</code>?'),
        body: t('<code>break</code> 가 없으면 아래 case 까지 이어서 실행돼요. 실수하기 쉬운 부분이에요.', 'Without <code>break</code>, it keeps running into the next cases. An easy mistake.'),
        code: 'const n = 1;\nswitch (n) {\n  case 1:\n    console.log("one");\n  case 2:\n    console.log("two");\n    break;\n  case 3:\n    console.log("three");\n}',
      },
    ],
    predict: { prompt: t('이 코드를 실행하면 어떻게 찍힐까요?', 'What will this code print?'), code: 'const day = 3;\nswitch (day) {\n  case 1:\n    console.log("Mon");\n    break;\n  case 3:\n    console.log("Wed");\n    break;\n  default:\n    console.log("?");\n}', choices: ['Wed', 'Mon', '?', 'Wed\n?'], answer: 0, explain: t('day 가 3 이라 case 3 을 실행하고 break 에서 멈춰요.', 'day is 3, so case 3 runs and break stops it.') },
    fill: {
      prompt: t('구역 코드가 "C" 일 때 "3층"이 찍히게 빈칸을 채우세요.', 'Fill in the blanks so zone "C" prints "3rd floor".'),
      code: `const zone = "C";\n{{0}} (zone) {\n  case "A":\n    console.log("${t('1층', '1st floor')}");\n    break;\n  {{1}} "C":\n    console.log("${t('3층', '3rd floor')}");\n    break;\n}`,
      blanks: [{ size: 6 }, { size: 4 }], expected: t('3층', '3rd floor'),
      hints: [t('값을 여러 경우와 비교하는 문장과, 각 경우 앞에 붙는 단어예요.', 'The statement that compares against cases, and the word before each case.'), 'switch, case'], solution: ['switch', 'case'],
    },
    write: {
      prompt: t('등급 <code>grade</code> 가 "B" 예요. A 는 "특급 배송", B 는 "일반 배송", 그 외는 "확인 필요"를 switch 로 찍어 주세요.', 'The <code>grade</code> is "B". Use switch: A → "Express", B → "Standard", anything else → "Check needed".'),
      starter: W, expected: t('일반 배송', 'Standard'),
      mustInclude: [{ re: 'switch\\s*\\(', msg: t('<code>switch</code> 를 써 주세요.', 'Use <code>switch</code>.') }, { re: 'break', msg: t('각 case 끝에 <code>break</code> 를 잊지 마세요.', 'Don\'t forget <code>break</code> after each case.') }],
      hints: ['switch (grade) { case "A": … break; case "B": … break; default: … }', t('case 뒤에 비교할 값을 쓰고 콜론 : 을 붙여요.', 'Write the value after case, then a colon.')],
      solution: `const grade = "B";\nswitch (grade) {\n  case "A":\n    console.log("${t('특급 배송', 'Express')}");\n    break;\n  case "B":\n    console.log("${t('일반 배송', 'Standard')}");\n    break;\n  default:\n    console.log("${t('확인 필요', 'Check needed')}");\n}`,
    },
    learned: [t('<code>switch (값) { case …: }</code>', '<code>switch (value) { case …: }</code>'), t('각 case 끝에 <code>break</code>', '<code>break</code> after each case'), t('맞는 게 없으면 <code>default</code>', '<code>default</code> when nothing matches')],
  },

  // ───────────── 패킹 · 송사원 · 반복문 ─────────────
  {
    id: 'pack-for', stage: 'packing', npc: 'song',
    title: t('박스 번호 붙이기', 'Number the boxes'),
    request: [t('김사원님, 박스마다 번호를 붙여야 하는데 하나하나 쓰려니 끝이 없어요.', 'Kim, every box needs a number, and writing them one by one takes forever.'), t('반복해서 찍는 방법 없을까요?', 'Is there a way to print them in a loop?')],
    thanks: t('100개도 금방이겠네요! 고마워요~', 'Even 100 boxes would be quick now! Thanks!'),
    concepts: [
      {
        title: t('<code>for</code> 반복문', 'The <code>for</code> loop'),
        body: t('<code>for (시작; 조건; 변화)</code>. i 를 1 부터 시작해서, 조건이 참인 동안 반복하고, 한 번 돌 때마다 i++ 해요.', '<code>for (start; condition; change)</code>. Start i at 1, repeat while the condition is true, and do i++ after each round.'),
        code: `for (let i = 1; i <= 3; i++) {\n  console.log("${t('박스', 'Box')} " + i);\n}`,
      },
      {
        title: t('반복하면서 더하기 (누적)', 'Adding up in a loop'),
        body: t('반복문 밖에 합계 변수를 0 으로 만들고, 안에서 계속 더해요.', 'Make a total variable set to 0 outside the loop, then keep adding to it inside.'),
        code: 'let sum = 0;\nfor (let i = 1; i <= 4; i++) {\n  sum += i;\n}\nconsole.log(sum);',
      },
    ],
    predict: { prompt: t('이 코드를 실행하면 어떻게 찍힐까요?', 'What will this code print?'), code: 'for (let i = 0; i < 3; i++) {\n  console.log(i);\n}', choices: ['0\n1\n2', '1\n2\n3', '0\n1\n2\n3', '3'], answer: 0, explain: t('i 는 0 에서 시작하고, i < 3 이라 2 까지만 돌아요.', 'i starts at 0 and i < 3 stops after 2.') },
    fill: {
      prompt: t('"박스 1" 부터 "박스 3" 까지 찍히게 빈칸을 채우세요.', 'Fill in the blanks to print "Box 1" through "Box 3".'),
      code: `for (let i = 1; i <= {{0}}; {{1}}) {\n  console.log("${t('박스', 'Box')} " + i);\n}`,
      blanks: [{ size: 2 }, { size: 4 }], expected: t('박스 1\n박스 2\n박스 3', 'Box 1\nBox 2\nBox 3'),
      hints: [t('3까지 돌고, 한 번 돌 때마다 1 씩 늘어나요.', 'Go up to 3, adding 1 each round.'), '3, i++'], solution: ['3', 'i++'],
    },
    write: {
      prompt: t('1번 박스엔 테이프 1m, 2번엔 2m … 5번엔 5m 를 써요. for 로 다 더해서 찍어 주세요.', 'Box 1 uses 1m of tape, box 2 uses 2m … box 5 uses 5m. Add them up with a for loop and print it.'),
      starter: W, expected: t('총 테이프: 15m', 'Total tape: 15m'),
      mustInclude: [{ re: 'for\\s*\\(', msg: t('<code>for</code> 반복문을 써 주세요.', 'Use a <code>for</code> loop.') }],
      hints: ['let sum = 0; for (let i = 1; i <= 5; i++) { sum += i; }', t('console.log("총 테이프: " + sum + "m");', 'console.log("Total tape: " + sum + "m");')],
      solution: `let sum = 0;\nfor (let i = 1; i <= 5; i++) {\n  sum += i;\n}\nconsole.log("${t('총 테이프: ', 'Total tape: ')}" + sum + "m");`,
    },
    learned: ['<code>for (let i = 1; i <= n; i++)</code>', t('<code>i < 3</code> 은 3 을 빼고', '<code>i < 3</code> stops before 3'), t('합계는 밖에서 0, 안에서 <code>+=</code>', 'Total: 0 outside, <code>+=</code> inside')],
  },
  {
    id: 'pack-while', stage: 'packing', npc: 'song',
    title: t('테이프 다 쓸 때까지 포장하기', 'Pack until the tape runs out'),
    request: [t('테이프 한 롤로 박스를 몇 개나 쌀 수 있는지 궁금해요.', 'I wonder how many boxes one roll of tape can wrap.'), t('몇 번 반복할지 모를 때는 어떻게 해요?', 'What do you do when you don\'t know how many times to repeat?')],
    thanks: t('while 이면 끝날 때까지 알아서 도네요!', 'So while just keeps going until it\'s done!'),
    concepts: [
      {
        title: '<code>while</code>',
        body: t('<code>while (조건)</code> 은 조건이 참인 동안 계속 반복해요. 안에서 조건이 언젠가 거짓이 되게 해야 끝나요.', '<code>while (condition)</code> repeats as long as the condition is true. Something inside must make it false, or it never ends.'),
        code: 'let tape = 10;\nlet count = 0;\nwhile (tape >= 3) {\n  tape -= 3;\n  count++;\n}\nconsole.log(count, tape);',
      },
      {
        title: t('<code>break</code> 와 <code>continue</code>', '<code>break</code> and <code>continue</code>'),
        body: t('<code>break</code> 는 반복을 바로 끝내고, <code>continue</code> 는 이번 차례만 건너뛰고 다음으로 가요.', '<code>break</code> ends the loop right away; <code>continue</code> skips just this round.'),
        code: 'for (let i = 1; i <= 6; i++) {\n  if (i === 3) continue;\n  if (i === 5) break;\n  console.log(i);\n}',
      },
    ],
    predict: { prompt: t('이 코드를 실행하면 어떻게 찍힐까요?', 'What will this code print?'), code: 'let n = 1;\nwhile (n < 10) {\n  n *= 2;\n}\nconsole.log(n);', choices: ['16', '8', '10', '2'], answer: 0, explain: t('1 → 2 → 4 → 8 → 16. 16 이 되면 n < 10 이 거짓이라 멈춰요.', '1 → 2 → 4 → 8 → 16. At 16, n < 10 is false, so it stops.') },
    fill: {
      prompt: t('테이프 10m, 박스 하나에 3m 씩 써요. 포장한 박스와 남은 테이프를 찍게 하세요.', '10m of tape, 3m per box. Print the boxes packed and the tape left.'),
      code: `let tape = 10;\nlet count = 0;\n{{0}} (tape >= 3) {\n  tape -= 3;\n  count{{1}};\n}\nconsole.log("${t('포장한 박스', 'Boxes packed')}: " + count);\nconsole.log("${t('남은 테이프', 'Tape left')}: " + tape + "m");`,
      blanks: [{ size: 5 }, { size: 2 }], expected: t('포장한 박스: 3\n남은 테이프: 1m', 'Boxes packed: 3\nTape left: 1m'),
      hints: [t('조건이 참인 동안 반복하는 단어, 그리고 1 더하기 기호예요.', 'The word that repeats while true, and the add-one symbol.'), 'while, ++'], solution: ['while', '++'],
    },
    write: {
      prompt: t('박스 1번부터 10번 중 <b>짝수 번호만</b> 한 줄씩 찍어 주세요. 홀수는 <code>continue</code> 로 건너뛰어요.', 'Print only the <b>even</b> box numbers from 1 to 10, one per line. Skip odd ones with <code>continue</code>.'),
      starter: W, expected: '2\n4\n6\n8\n10',
      mustInclude: [{ re: 'continue', msg: t('<code>continue</code> 를 써서 홀수를 건너뛰어 주세요.', 'Skip the odd numbers with <code>continue</code>.') }],
      hints: [t('i % 2 !== 0 이면 홀수예요.', 'If i % 2 !== 0, it\'s odd.'), 'for (let i = 1; i <= 10; i++) { if (i % 2 !== 0) continue; console.log(i); }'],
      solution: 'for (let i = 1; i <= 10; i++) {\n  if (i % 2 !== 0) continue;\n  console.log(i);\n}',
    },
    learned: [t('<code>while (조건)</code> → 참인 동안 반복', '<code>while (condition)</code> → repeat while true'), t('<code>break</code> 끝내기, <code>continue</code> 건너뛰기', '<code>break</code> ends, <code>continue</code> skips'), t('조건이 언젠가 거짓이 되게!', 'Make sure the condition turns false!')],
  },
  {
    id: 'pack-nested', stage: 'packing', npc: 'song',
    title: t('팔레트에 박스 쌓기', 'Stack boxes on a pallet'),
    request: [t('팔레트에 박스를 3층, 층마다 4개씩 쌓아요.', 'We stack boxes on a pallet: 3 layers, 4 boxes per layer.'), t('층마다 박스 위치를 다 찍을 수 있을까요?', 'Could you print every box position?')],
    thanks: t('반복 안에 반복이라니, 신기해요!', 'A loop inside a loop, how neat!'),
    concepts: [
      {
        title: t('반복문 안의 반복문', 'A loop inside a loop'),
        body: t('바깥 반복이 한 번 돌 때마다 안쪽 반복이 처음부터 끝까지 다 돌아요.', 'Each time the outer loop goes around once, the inner loop runs all the way through.'),
        code: `for (let floor = 1; floor <= 2; floor++) {\n  for (let n = 1; n <= 3; n++) {\n    console.log(floor + "${t('층', 'F')}-" + n);\n  }\n}`,
      },
      {
        title: t('한 줄 만들어서 찍기', 'Building a line, then printing'),
        body: t('<code>console.log</code> 는 늘 줄을 바꿔요. 한 줄에 여러 개를 찍으려면 문자열 변수에 <code>+=</code> 로 모은 다음 한 번에 찍어요.', '<code>console.log</code> always starts a new line. To put several things on one line, collect them in a string with <code>+=</code>, then print once.'),
        code: 'for (let row = 1; row <= 3; row++) {\n  let line = "";\n  for (let col = 1; col <= 4; col++) {\n    line += "■";\n  }\n  console.log(line);\n}',
      },
    ],
    predict: { prompt: t('이 코드를 실행하면 어떻게 찍힐까요?', 'What will this code print?'), code: 'let s = "";\nfor (let i = 0; i < 3; i++) {\n  for (let j = 0; j < 2; j++) {\n    s += "*";\n  }\n}\nconsole.log(s.length);', choices: ['6', '5', '3', '2'], answer: 0, explain: t('바깥 3번 × 안쪽 2번 = 6번.', 'Outer 3 times × inner 2 times = 6.') },
    fill: {
      prompt: t('2층, 층마다 3개씩 박스 모양이 찍히게 하세요.', 'Print 2 layers of 3 boxes each.'),
      code: 'for (let row = 1; row <= 2; row++) {\n  let line = "";\n  for (let col = 1; col <= {{0}}; col++) {\n    line {{1}} "■";\n  }\n  console.log(line);\n}',
      blanks: [{ size: 2 }, { size: 3 }], expected: '■■■\n■■■',
      hints: [t('한 줄에 3개, 문자열에 이어 붙이는 기호예요.', '3 per line, and the symbol that appends to a string.'), '3, +='], solution: ['3', '+='],
    },
    write: {
      prompt: t('3층 팔레트에 층마다 4개씩 있어요. 층별로 "1층: ■■■■" 처럼 찍어 주세요.', 'A 3-layer pallet with 4 boxes per layer. Print each layer like "Layer 1: ■■■■".'),
      starter: W, expected: t('1층: ■■■■\n2층: ■■■■\n3층: ■■■■', 'Layer 1: ■■■■\nLayer 2: ■■■■\nLayer 3: ■■■■'),
      mustInclude: [{ re: 'for[\\s\\S]*for', msg: t('반복문 안에 반복문을 넣어 주세요.', 'Put a loop inside a loop.') }],
      hints: [t('바깥: 층 1~3, line 을 층 + "층: " 으로 시작. 안쪽: line += "■" 4번.', 'Outer: layers 1–3, start line with "Layer " + layer + ": ". Inner: line += "■" 4 times.'), t('안쪽 반복이 끝나면 console.log(line);', 'After the inner loop, console.log(line);')],
      solution: `for (let floor = 1; floor <= 3; floor++) {\n  let line = ${t('floor + "층: "', '"Layer " + floor + ": "')};\n  for (let n = 1; n <= 4; n++) {\n    line += "■";\n  }\n  console.log(line);\n}`,
    },
    learned: [t('바깥 한 번에 안쪽은 끝까지', 'Inner loop runs fully each outer round'), t('한 줄은 문자열에 모아서 한 번에 찍기', 'Build a line in a string, print once'), t('횟수 = 바깥 × 안쪽', 'Count = outer × inner')],
  },

  // ───────────── 출고장 · 오팀원 · 배열 ─────────────
  {
    id: 'ship-array', stage: 'shipping', npc: 'oh',
    title: t('택배사 목록 만들기', 'List the couriers'),
    request: [t('김사원님, 출고는 택배사별로 나눠요. 택배사가 여러 개라 변수를 하나씩 만들기 힘들어요.', 'Kim, we sort shipments by courier. There are several, so one variable each gets messy.'), t('한 번에 묶어서 담는 방법이 있나요?', 'Is there a way to keep them together?')],
    thanks: t('배열에 담으니까 정리가 쉽네요!', 'Keeping them in an array makes it so tidy!'),
    concepts: [
      {
        title: t('배열 만들기와 번호(인덱스)', 'Arrays and index numbers'),
        body: t('<code>[값, 값, …]</code> 으로 여러 값을 한 번에 담아요. 꺼낼 때는 <code>이름[번호]</code>, 번호는 <b>0 부터</b> 시작해요. 개수는 <code>.length</code>.', '<code>[value, value, …]</code> holds many values at once. Get one with <code>name[index]</code>; indexes start at <b>0</b>. The count is <code>.length</code>.'),
        code: `const couriers = ["${t('번개택배', 'Lightning')}", "${t('하늘택배', 'Sky')}", "${t('바다택배', 'Ocean')}"];\nconsole.log(couriers[0]);\nconsole.log(couriers[2]);\nconsole.log(couriers.length);`,
      },
      {
        title: t('반복문으로 하나씩 보기', 'Going through with a loop'),
        body: t('<code>for (let i = 0; i &lt; 배열.length; i++)</code> 로 돌거나, 값만 필요하면 <code>for (const x of 배열)</code> 로 더 짧게 써요.', 'Loop with <code>for (let i = 0; i &lt; arr.length; i++)</code>, or if you only need values, use the shorter <code>for (const x of arr)</code>.'),
        code: 'const boxes = [12, 7, 9];\nfor (let i = 0; i < boxes.length; i++) {\n  console.log(i + ": " + boxes[i]);\n}\nfor (const b of boxes) {\n  console.log(b);\n}',
      },
    ],
    predict: { prompt: t('이 코드를 실행하면 어떻게 찍힐까요?', 'What will this code print?'), code: 'const a = [3, 5, 7];\nconsole.log(a[1]);', choices: ['5', '3', '7', 'undefined'], answer: 0, explain: t('번호는 0 부터라 a[0]=3, a[1]=5.', 'Indexes start at 0, so a[0]=3 and a[1]=5.') },
    fill: {
      prompt: t('두 번째 택배사와 택배사 수가 찍히게 하세요.', 'Print the second courier and the number of couriers.'),
      code: `const couriers = ["${t('번개택배', 'Lightning')}", "${t('하늘택배', 'Sky')}", "${t('바다택배', 'Ocean')}"];\nconsole.log(couriers[{{0}}]);\nconsole.log("${t('택배사 수', 'Couriers')}: " + couriers.{{1}});`,
      blanks: [{ size: 2 }, { size: 7 }], expected: t('하늘택배\n택배사 수: 3', 'Sky\nCouriers: 3'),
      hints: [t('두 번째는 번호 1 이에요. 개수는 배열 뒤에 붙는 단어예요.', 'The second one is index 1. The count is a word after the array.'), '1, length'], solution: ['1', 'length'],
    },
    write: {
      prompt: t('택배사별 출고 박스가 <code>[12, 7, 9]</code> 예요. 배열 <code>boxes</code> 에 담고 반복문으로 다 더해서 찍어 주세요.', 'Boxes per courier are <code>[12, 7, 9]</code>. Put them in an array <code>boxes</code> and add them up with a loop.'),
      starter: W, expected: t('총 출고 박스: 28개', 'Total boxes shipped: 28'),
      mustInclude: [{ re: '(let|const)\\s+boxes\\s*=\\s*\\[', msg: t('<code>boxes</code> 배열을 만들어 주세요.', 'Make a <code>boxes</code> array.') }, { re: 'for\\s*\\(', msg: t('반복문으로 더해 주세요.', 'Add them with a loop.') }],
      hints: ['let total = 0; for (const b of boxes) { total += b; }', t('console.log("총 출고 박스: " + total + "개");', 'console.log("Total boxes shipped: " + total);')],
      solution: `const boxes = [12, 7, 9];\nlet total = 0;\nfor (const b of boxes) {\n  total += b;\n}\nconsole.log("${t('총 출고 박스: ', 'Total boxes shipped: ')}" + total${t(' + "개"', '')});`,
    },
    learned: ['<code>const a = [1, 2, 3];</code>', t('번호는 0 부터: <code>a[0]</code>', 'Indexes start at 0: <code>a[0]</code>'), t('개수 <code>a.length</code>, 돌기 <code>for (const x of a)</code>', 'Count <code>a.length</code>, loop <code>for (const x of a)</code>')],
  },
  {
    id: 'ship-array-search', stage: 'shipping', npc: 'oh',
    title: t('제일 무거운 박스 찾기', 'Find the heaviest box'),
    request: [t('트럭에 실을 때 무거운 박스부터 알아야 해요.', 'When loading the truck, we need to know the heavy boxes.'), t('제일 무거운 것, 기준 넘는 것 개수… 찾아 줄래요?', 'The heaviest one, how many are over the limit… could you find them?')],
    thanks: t('이제 무거운 박스 걱정 끝!', 'No more worrying about heavy boxes!'),
    concepts: [
      {
        title: t('값 바꾸기', 'Changing a value'),
        body: t('<code>배열[번호] = 새 값;</code> 으로 그 칸의 값을 바꿔요. <code>const</code> 로 만든 배열도 안의 값은 바꿀 수 있어요.', '<code>arr[index] = newValue;</code> changes that slot. Even a <code>const</code> array can have its values changed.'),
        code: 'const w = [4, 9, 2];\nw[2] = 6;\nconsole.log(w);',
      },
      {
        title: t('최댓값 찾기, 개수 세기', 'Finding the max, counting'),
        body: t('첫 값을 최댓값으로 두고, 더 큰 값이 나오면 바꿔요. 개수는 조건이 맞을 때마다 1 씩 더해요.', 'Start with the first value as the max and replace it whenever a bigger one shows up. To count, add 1 each time the condition matches.'),
        code: 'const w = [4, 9, 2, 7];\nlet max = w[0];\nlet over5 = 0;\nfor (const x of w) {\n  if (x > max) max = x;\n  if (x > 5) over5++;\n}\nconsole.log(max);\nconsole.log(over5);',
      },
    ],
    predict: { prompt: t('이 코드를 실행하면 어떻게 찍힐까요?', 'What will this code print?'), code: 'const a = [2, 8, 5];\na[0] = a[1] + 1;\nconsole.log(a[0]);', choices: ['9', '3', '8', '2'], answer: 0, explain: t('a[1] 은 8, 거기에 1 을 더한 9 가 a[0] 에 들어가요.', 'a[1] is 8, plus 1 makes 9, which goes into a[0].') },
    fill: {
      prompt: t('가장 무거운 박스 무게가 찍히게 하세요.', 'Print the heaviest box weight.'),
      code: `const weights = [8, 15, 3, 11];\nlet max = weights[0];\nfor (const w of weights) {\n  if (w {{0}} max) {\n    max = {{1}};\n  }\n}\nconsole.log("${t('최대 무게', 'Heaviest')}: " + max + "kg");`,
      blanks: [{ size: 2 }, { size: 2 }], expected: t('최대 무게: 15kg', 'Heaviest: 15kg'),
      hints: [t('지금 값이 최댓값보다 크면, 최댓값을 지금 값으로 바꿔요.', 'If the current value is bigger than max, set max to it.'), '>, w'], solution: ['>', 'w'],
    },
    write: {
      prompt: t('박스 무게가 <code>[8, 12, 15, 3, 11]</code> 이에요. 10kg 넘는 박스가 몇 개인지 세서 찍어 주세요.', 'Box weights are <code>[8, 12, 15, 3, 11]</code>. Count the boxes over 10kg and print it.'),
      starter: W, expected: t('10kg 넘는 박스: 3개', 'Boxes over 10kg: 3'),
      mustInclude: [{ re: 'for\\s*\\(', msg: t('반복문을 써 주세요.', 'Use a loop.') }, { re: 'if\\s*\\(', msg: t('<code>if</code> 로 조건을 확인해 주세요.', 'Check the condition with <code>if</code>.') }],
      hints: ['let count = 0; for (const w of weights) { if (w > 10) count++; }', t('console.log("10kg 넘는 박스: " + count + "개");', 'console.log("Boxes over 10kg: " + count);')],
      solution: `const weights = [8, 12, 15, 3, 11];\nlet count = 0;\nfor (const w of weights) {\n  if (w > 10) count++;\n}\nconsole.log("${t('10kg 넘는 박스: ', 'Boxes over 10kg: ')}" + count${t(' + "개"', '')});`,
    },
    learned: [t('값 바꾸기 <code>a[i] = 값;</code>', 'Change a value <code>a[i] = value;</code>'), t('최댓값: 첫 값에서 시작해 더 크면 바꾸기', 'Max: start with the first, replace when bigger'), t('개수: 조건 맞으면 <code>count++</code>', 'Count: <code>count++</code> when it matches')],
  },
  {
    id: 'ship-list', stage: 'shipping', npc: 'oh',
    title: t('늘어나는 출고 목록', 'A growing shipping list'),
    request: [t('출고 목록은 하루 종일 늘었다 줄었다 해요.', 'The shipping list grows and shrinks all day.'), t('배열에 넣고 빼는 방법을 알려 줄래요?', 'Can you show me how to add to and remove from an array?')],
    thanks: t('push, shift 로 목록 관리가 편해요!', 'push and shift make managing the list easy!'),
    concepts: [
      {
        title: t('넣고 빼기', 'Adding and removing'),
        body: t('<code>push(값)</code> 은 맨 뒤에 넣고, <code>pop()</code> 은 맨 뒤를 빼요. 맨 앞을 빼려면 <code>shift()</code>. 배열은 크기가 알아서 늘고 줄어요.', '<code>push(value)</code> adds to the end, <code>pop()</code> removes the last. To remove the first, use <code>shift()</code>. Arrays grow and shrink on their own.'),
        code: `const list = [];\nlist.push("${t('토너', 'Toner')}");\nlist.push("${t('립밤', 'Lip balm')}");\nlist.push("${t('쿠션', 'Cushion')}");\nconsole.log(list.length);\nlist.pop();\nconsole.log(list);\nlist.shift();\nconsole.log(list);`,
      },
      {
        title: t('찾기와 중간 빼기', 'Finding and removing from the middle'),
        body: t('<code>includes(값)</code> 은 들어 있는지, <code>indexOf(값)</code> 은 몇 번째인지(없으면 -1). <code>splice(번호, 1)</code> 은 그 번호에서 하나를 빼요.', '<code>includes(value)</code> tells whether it\'s there, <code>indexOf(value)</code> where (-1 if not). <code>splice(index, 1)</code> removes one item at that index.'),
        code: 'const list = ["A", "B", "C"];\nconsole.log(list.includes("C"));\nconsole.log(list.indexOf("B"));\nlist.splice(1, 1);\nconsole.log(list);',
      },
    ],
    predict: { prompt: t('이 코드를 실행하면 어떻게 찍힐까요?', 'What will this code print?'), code: 'const a = [5, 8];\na.push(2);\na.shift();\nconsole.log(a);', choices: ['[ 8, 2 ]', '[ 5, 8 ]', '[ 5, 2 ]', '[ 2 ]'], answer: 0, explain: t('push(2) 로 [5, 8, 2], shift() 로 맨 앞 5 를 빼서 [8, 2].', 'push(2) makes [5, 8, 2], then shift() removes the first (5): [8, 2].') },
    fill: {
      prompt: t('목록에 상품 두 개를 넣고 개수를 찍게 하세요.', 'Add two products to the list and print the count.'),
      code: `const list = [];\nlist.{{0}}("${t('선크림', 'Sunscreen')}");\nlist.push("${t('쿠션', 'Cushion')}");\nconsole.log("${t('출고 대기', 'Waiting')}: " + list.{{1}});`,
      blanks: [{ size: 5 }, { size: 7 }], expected: t('출고 대기: 2', 'Waiting: 2'),
      hints: [t('맨 뒤에 넣는 메서드와 개수예요.', 'The method that adds to the end, and the count.'), 'push, length'], solution: ['push', 'length'],
    },
    write: {
      prompt: t('배열 <code>orders</code> 에 "토너", "립밤", "선크림" 을 push 로 넣고, 첫 번째("토너")는 출고됐으니 빼 주세요. 남은 목록과 개수를 찍어 주세요.', 'Push "Toner", "Lip balm", "Sunscreen" into an array <code>orders</code>. The first ("Toner") has shipped, so remove it. Print what\'s left and the count.'),
      starter: W, expected: t("[ '립밤', '선크림' ]\n남은 주문: 2", "[ 'Lip balm', 'Sunscreen' ]\nOrders left: 2"),
      mustInclude: [{ re: '\\.push\\s*\\(', msg: t('<code>push</code> 로 넣어 주세요.', 'Add with <code>push</code>.') }, { re: '\\.shift\\s*\\(|\\.splice\\s*\\(', msg: t('<code>shift()</code> 로 맨 앞을 빼 주세요.', 'Remove the first with <code>shift()</code>.') }],
      hints: ['const orders = []; orders.push(…) ×3; orders.shift();', t('console.log(orders); console.log("남은 주문: " + orders.length);', 'console.log(orders); console.log("Orders left: " + orders.length);')],
      solution: `const orders = [];\norders.push("${t('토너', 'Toner')}");\norders.push("${t('립밤', 'Lip balm')}");\norders.push("${t('선크림', 'Sunscreen')}");\norders.shift();\nconsole.log(orders);\nconsole.log("${t('남은 주문: ', 'Orders left: ')}" + orders.length);`,
    },
    learned: [t('<code>push</code> 뒤에 넣기, <code>pop</code> 뒤에서 빼기', '<code>push</code> adds to end, <code>pop</code> removes last'), t('<code>shift</code> 앞에서 빼기, <code>splice(i, 1)</code> 중간', '<code>shift</code> removes first, <code>splice(i, 1)</code> middle'), '<code>includes</code>, <code>indexOf</code>'],
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
        body: t('<code>s.length</code> 는 글자 수, <code>s[번호]</code> 는 그 위치의 글자 하나예요. 번호는 0 부터. 맨 끝 글자는 <code>s.at(-1)</code>.', '<code>s.length</code> is the number of characters, <code>s[index]</code> is one character. Indexes start at 0. The last one is <code>s.at(-1)</code>.'),
        code: 'const code = "KR20261112";\nconsole.log(code.length);\nconsole.log(code[0]);\nconsole.log(code.at(-1));',
      },
      {
        title: t('자르기와 대소문자', 'Cutting and case'),
        body: t('<code>slice(시작, 끝)</code> 은 시작부터 끝 <b>바로 앞</b>까지 잘라요. <code>toUpperCase()</code> 대문자, <code>toLowerCase()</code> 소문자, <code>trim()</code> 앞뒤 공백 지우기.', '<code>slice(start, end)</code> cuts from start up to <b>just before</b> end. <code>toUpperCase()</code>, <code>toLowerCase()</code>, and <code>trim()</code> removes spaces at both ends.'),
        code: 'const code = "  kr-778  ";\nconst clean = code.trim().toUpperCase();\nconsole.log(clean);\nconsole.log(clean.slice(0, 2));\nconsole.log(clean.slice(3));',
      },
    ],
    predict: { prompt: t('이 코드를 실행하면 어떻게 찍힐까요?', 'What will this code print?'), code: 'const s = "ABC123";\nconsole.log(s.slice(1, 4));', choices: ['BC1', 'ABC', 'BC12', 'C12'], answer: 0, explain: t('번호 1 (B) 부터 4 바로 앞 (번호 3, 1) 까지라 BC1.', 'From index 1 (B) up to just before 4 (index 3, "1"), so BC1.') },
    fill: {
      prompt: t('송장 번호의 나라 코드와 길이를 찍게 하세요.', 'Print the country code and the length of the tracking number.'),
      code: `const tracking = "KR20261112";\nconsole.log("${t('국가', 'Country')}: " + tracking.{{0}}(0, 2));\nconsole.log("${t('길이', 'Length')}: " + tracking.{{1}});`,
      blanks: [{ size: 5 }, { size: 6 }], expected: t('국가: KR\n길이: 10', 'Country: KR\nLength: 10'),
      hints: [t('잘라 내는 메서드와 글자 수예요.', 'The cutting method and the character count.'), 'slice, length'], solution: ['slice', 'length'],
    },
    write: {
      prompt: t('기사님이 송장을 <code>"  kr-778  "</code> 처럼 받아 왔어요. 앞뒤 공백을 지우고 대문자로 바꿔서 찍어 주세요.', 'The driver got a label like <code>"  kr-778  "</code>. Remove the spaces at both ends, make it uppercase, and print it.'),
      starter: W, expected: t('송장: KR-778', 'Label: KR-778'),
      mustInclude: [{ re: 'trim\\s*\\(', msg: t('<code>trim()</code> 으로 공백을 지워 주세요.', 'Remove the spaces with <code>trim()</code>.') }, { re: 'toUpperCase\\s*\\(', msg: t('<code>toUpperCase()</code> 로 대문자로 바꿔 주세요.', 'Make it uppercase with <code>toUpperCase()</code>.') }],
      hints: ['const raw = "  kr-778  ";', t('console.log("송장: " + raw.trim().toUpperCase());', 'console.log("Label: " + raw.trim().toUpperCase());')],
      solution: `const raw = "  kr-778  ";\nconsole.log("${t('송장: ', 'Label: ')}" + raw.trim().toUpperCase());`,
    },
    learned: [t('<code>length</code> 글자 수, <code>s[i]</code> 한 글자', '<code>length</code> count, <code>s[i]</code> one char'), t('<code>slice(a, b)</code> → b 바로 앞까지', '<code>slice(a, b)</code> → up to just before b'), '<code>trim()</code>, <code>toUpperCase()</code>'],
  },
  {
    id: 'load-string-search', stage: 'loading', npc: 'yoon',
    title: t('배송 경로 나누기', 'Split the delivery route'),
    request: [t('배송 경로가 "부산-대구-광주" 처럼 한 줄로 와요.', 'Delivery routes come in one line, like "Busan-Daegu-Gwangju".'), t('도시별로 나누고, 주소에 특정 동네가 있는지도 봐야 해요.', 'I need them split by city, and to check whether an address has a certain area.')],
    thanks: t('경로가 한눈에 보이네요. 출발합니다~', 'Now I can see the whole route. Off I go!'),
    concepts: [
      {
        title: t('찾기와 바꾸기', 'Finding and replacing'),
        body: t('<code>includes(글자)</code> 는 들어 있는지, <code>indexOf(글자)</code> 는 몇 번째인지(없으면 -1). <code>replace(옛것, 새것)</code> 은 처음 하나만, <code>replaceAll</code> 은 전부 바꿔요.', '<code>includes(text)</code> tells whether it\'s there, <code>indexOf(text)</code> where (-1 if not). <code>replace(old, new)</code> changes the first one, <code>replaceAll</code> changes all.'),
        code: `const addr = "${t('서울시 강남구 테헤란로', 'Teheran-ro, Gangnam, Seoul')}";\nconsole.log(addr.includes("${t('강남', 'Gangnam')}"));\nconsole.log(addr.indexOf("${t('강남', 'Gangnam')}"));\nconsole.log("A-B-C".replace("-", "/"));\nconsole.log("A-B-C".replaceAll("-", "/"));`,
      },
      {
        title: t('나누기 <code>split</code>', 'Splitting with <code>split</code>'),
        body: t('<code>split(기준)</code> 은 기준 글자로 잘라서 <b>배열</b>을 줘요. 반대로 배열을 하나로 붙일 땐 <code>join(기준)</code>.', '<code>split(separator)</code> cuts at the separator and gives an <b>array</b>. To glue an array back together, use <code>join(separator)</code>.'),
        code: 'const parts = "A-B-C".split("-");\nconsole.log(parts.length);\nconsole.log(parts[1]);\nconsole.log(parts.join(" > "));',
      },
    ],
    predict: { prompt: t('이 코드를 실행하면 어떻게 찍힐까요?', 'What will this code print?'), code: 'const s = "a,b,c,d";\nconsole.log(s.split(",").length);', choices: ['4', '3', '7', '1'], answer: 0, explain: t('쉼표로 나누면 a, b, c, d 네 조각이에요.', 'Splitting at commas gives four pieces: a, b, c, d.') },
    fill: {
      prompt: t('주소에 "강남"이 들어 있는지와, "-" 를 모두 "/" 로 바꾼 경로를 찍게 하세요.', 'Print whether the address contains "Gangnam", and the route with every "-" replaced by "/".'),
      code: `const addr = "${t('서울시 강남구', 'Gangnam, Seoul')}";\nconst route = "A-B-C";\nconsole.log(addr.{{0}}("${t('강남', 'Gangnam')}"));\nconsole.log(route.{{1}}("-", "/"));`,
      blanks: [{ size: 8 }, { size: 10 }], expected: 'true\nA/B/C',
      hints: [t('들어 있는지 보는 메서드와 전부 바꾸는 메서드예요.', 'The method that checks, and the one that replaces all.'), 'includes, replaceAll'], solution: ['includes', 'replaceAll'],
    },
    write: {
      prompt: t('경로 <code>"부산-대구-광주"</code> 를 "-" 로 나눠서 도시를 한 줄씩 찍어 주세요.', 'Split the route <code>"Busan-Daegu-Gwangju"</code> at "-" and print each city on its own line.'),
      starter: W, expected: t('부산\n대구\n광주', 'Busan\nDaegu\nGwangju'),
      mustInclude: [{ re: 'split\\s*\\(', msg: t('<code>split</code> 으로 나눠 주세요.', 'Split it with <code>split</code>.') }, { re: 'for\\s*\\(', msg: t('반복문으로 하나씩 찍어 주세요.', 'Print them one by one with a loop.') }],
      hints: ['const cities = route.split("-");', 'for (const c of cities) { console.log(c); }'],
      solution: `const route = "${t('부산-대구-광주', 'Busan-Daegu-Gwangju')}";\nconst cities = route.split("-");\nfor (const c of cities) {\n  console.log(c);\n}`,
    },
    learned: [t('<code>includes</code> 있나?, <code>indexOf</code> 어디?', '<code>includes</code> is it there?, <code>indexOf</code> where?'), t('<code>replace</code> 하나, <code>replaceAll</code> 전부', '<code>replace</code> first, <code>replaceAll</code> all'), t('<code>split</code> → 배열, <code>join</code> → 문자열', '<code>split</code> → array, <code>join</code> → string')],
  },
  {
    id: 'load-format', stage: 'loading', npc: 'yoon',
    title: t('송장 라벨 서식 맞추기', 'Format the shipping label'),
    request: [t('송장 라벨은 칸이 딱 정해져 있어요. 금액엔 쉼표, 번호는 0 으로 채워야 하고요.', 'Labels have fixed layouts. Amounts need commas, and numbers need leading zeros.'), t('예쁘게 맞춰서 찍을 수 있을까요?', 'Can you print them neatly?')],
    thanks: t('라벨이 반듯하네요! 고객님들도 좋아하겠어요.', 'The labels look so neat! Customers will love it.'),
    concepts: [
      {
        title: t('템플릿 문자열', 'Template strings'),
        body: t('백틱 <code>`</code> 으로 감싸고 <code>${값}</code> 을 쓰면 문자열 안에 값이나 계산을 바로 넣을 수 있어요.', 'Wrap text in backticks <code>`</code> and use <code>${value}</code> to drop values or math right into the string.'),
        code: 'const name = "box";\nconst qty = 3;\nconsole.log(`${name}: ${qty}`);\nconsole.log(`${qty * 2} total`);',
      },
      {
        title: t('숫자 서식', 'Number formatting'),
        body: t('<code>n.toLocaleString("en-US")</code> 는 천 단위 쉼표, <code>String(n).padStart(5, "0")</code> 은 5자리로 앞을 0 으로 채워요. <code>toFixed(1)</code> 은 소수 한 자리.', '<code>n.toLocaleString("en-US")</code> adds thousands commas, <code>String(n).padStart(5, "0")</code> pads to 5 digits with zeros. <code>toFixed(1)</code> gives one decimal place.'),
        code: 'console.log((1250000).toLocaleString("en-US"));\nconsole.log(String(42).padStart(5, "0"));\nconsole.log((2.345).toFixed(1));',
      },
    ],
    predict: { prompt: t('이 코드를 실행하면 어떻게 찍힐까요?', 'What will this code print?'), code: 'console.log(String(7).padStart(3, "0"));', choices: ['007', '7', '700', '0007'], answer: 0, explain: t('3자리가 될 때까지 앞을 "0" 으로 채워요.', 'It pads the front with "0" until it\'s 3 long.') },
    fill: {
      prompt: t('금액은 쉼표, 송장 번호는 6자리로 앞을 0 으로 채워 찍게 하세요.', 'Print the amount with commas and the tracking number padded to 6 digits.'),
      code: `const amount = 1250000;\nconst no = 42;\nconsole.log(\`${t('금액', 'Amount')}: \${amount.{{0}}("en-US")}${t('원', ' won')}\`);\nconsole.log(\`${t('번호', 'No.')}: \${String(no).{{1}}(6, "0")}\`);`,
      blanks: [{ size: 14 }, { size: 8 }], expected: t('금액: 1,250,000원\n번호: 000042', 'Amount: 1,250,000 won\nNo.: 000042'),
      hints: [t('쉼표를 넣는 메서드와, 앞을 채우는 메서드예요.', 'The method that adds commas, and the one that pads the front.'), 'toLocaleString, padStart'], solution: ['toLocaleString', 'padStart'],
    },
    write: {
      prompt: t('상품 <code>"토너"</code>, 수량 3, 금액 45000 을 템플릿 문자열로 한 줄에 찍어 주세요. 금액엔 쉼표를 넣어요.', 'Print product <code>"Toner"</code>, quantity 3, and amount 45000 on one line with a template string. Put commas in the amount.'),
      starter: W, expected: t('토너 x3 = 45,000원', 'Toner x3 = 45,000 won'),
      mustInclude: [{ re: '`', msg: t('백틱 <code>`</code> 템플릿 문자열을 써 주세요.', 'Use a backtick <code>`</code> template string.') }, { re: 'toLocaleString', msg: t('금액에 <code>toLocaleString</code> 을 써 주세요.', 'Use <code>toLocaleString</code> for the amount.') }],
      hints: ['`${name} x${qty} = ${amount.toLocaleString("en-US")}…`', t('끝에 "원" 을 붙여요.', 'Add " won" at the end.')],
      solution: `const name = "${t('토너', 'Toner')}";\nconst qty = 3;\nconst amount = 45000;\nconsole.log(\`\${name} x\${qty} = \${amount.toLocaleString("en-US")}${t('원', ' won')}\`);`,
    },
    learned: [t('템플릿: <code>`… ${값} …`</code>', 'Template: <code>`… ${value} …`</code>'), t('쉼표 <code>toLocaleString("en-US")</code>', 'Commas <code>toLocaleString("en-US")</code>'), t('0 채우기 <code>padStart</code>, 소수 <code>toFixed</code>', 'Padding <code>padStart</code>, decimals <code>toFixed</code>')],
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
        body: t('자주 쓰는 코드를 <b>함수</b>로 묶어 이름을 붙여요. <code>function 이름() { … }</code> 로 만들고, <code>이름();</code> 으로 불러요.', 'Bundle code you use often into a <b>function</b> with a name. Write <code>function name() { … }</code> and call it with <code>name();</code>.'),
        code: `function warn() {\n  console.log("${t('지게차 지나갑니다!', 'Forklift coming through!')}");\n}\n\nwarn();\nwarn();`,
      },
      {
        title: t('매개변수: 값 넘겨주기', 'Parameters: passing values in'),
        body: t('괄호 안에 <b>매개변수</b>를 만들면 부를 때마다 다른 값을 넘길 수 있어요.', 'Put a <b>parameter</b> in the parentheses and you can pass a different value each call.'),
        code: `function warn(place) {\n  console.log(place + "${t(' 지게차 통행 중!', ': forklift passing!')}");\n}\n\nwarn("${t('입고장', 'Receiving')}");\nwarn("${t('출고장', 'Shipping')}");`,
      },
    ],
    predict: { prompt: t('이 코드를 실행하면 어떻게 찍힐까요?', 'What will this code print?'), code: 'function hi(name) {\n  console.log("Hi " + name);\n}\n\nhi("Kim");\nhi("Lee");', choices: ['Hi Kim\nHi Lee', 'Hi name\nHi name', 'Hi Kim', 'Hi Lee\nHi Kim'], answer: 0, explain: t('부를 때 넘긴 값이 name 에 들어가요. 부른 순서대로 찍혀요.', 'The value you pass goes into name, in the order you call it.') },
    fill: {
      prompt: t('함수를 만들고 두 번 불러서 방송이 두 번 나오게 하세요.', 'Make the function and call it twice so the announcement plays twice.'),
      code: `{{0}} beep() {\n  console.log("${t('빵빵!', 'Beep beep!')}");\n}\n\nbeep();\n{{1}};`,
      blanks: [{ size: 8 }, { size: 6 }], expected: t('빵빵!\n빵빵!', 'Beep beep!\nBeep beep!'),
      hints: [t('함수를 만드는 단어와, 함수를 부르는 모양이에요.', 'The word that makes a function, and how you call it.'), 'function, beep()'], solution: ['function', 'beep()'],
    },
    write: {
      prompt: t('<code>announce(zone)</code> 함수를 만들어 "[구역] 통행 주의" 를 찍게 하고, "피킹", "패킹" 으로 두 번 불러 주세요.', 'Make a function <code>announce(zone)</code> that prints "[zone] watch out", then call it with "Picking" and "Packing".'),
      starter: t('// 여기에 함수를 만들고 불러 보세요\n', '// Make your function and call it here\n'),
      expected: t('[피킹] 통행 주의\n[패킹] 통행 주의', '[Picking] watch out\n[Packing] watch out'),
      mustInclude: [{ re: 'function\\s+announce\\s*\\(|announce\\s*=\\s*\\(', msg: t('<code>function announce(zone)</code> 을 만들어 주세요.', 'Make <code>function announce(zone)</code>.') }, { re: 'announce\\s*\\(\\s*["\'`]', msg: t('<code>announce("…")</code> 로 불러 주세요.', 'Call it with <code>announce("…")</code>.') }],
      hints: [t('console.log("[" + zone + "] 통행 주의");', 'console.log("[" + zone + "] watch out");'), t('announce("피킹"); announce("패킹");', 'announce("Picking"); announce("Packing");')],
      solution: `function announce(zone) {\n  console.log("[" + zone + "${t('] 통행 주의', '] watch out')}");\n}\n\nannounce("${t('피킹', 'Picking')}");\nannounce("${t('패킹', 'Packing')}");`,
    },
    learned: [t('<code>function 이름() { }</code> 로 만들기', 'Define with <code>function name() { }</code>'), t('<code>이름();</code> 으로 부르기', 'Call with <code>name();</code>'), t('매개변수로 값 넘기기', 'Pass values with parameters')],
  },
  {
    id: 'fork-return', stage: 'forklift', npc: 'choi',
    title: t('적재 무게 계산기', 'Load weight calculator'),
    request: [t('지게차에 실을 무게를 매번 계산해야 해요.', 'I have to work out the load weight every time.'), t('계산해서 결과를 돌려주는 함수도 만들 수 있어요?', 'Can a function work it out and hand back the result?')],
    thanks: t('return 으로 받아 쓰니까 어디서든 쓸 수 있네요!', 'With return I can use the result anywhere!'),
    concepts: [
      {
        title: t('값을 돌려주는 <code>return</code>', 'Handing back a value with <code>return</code>'),
        body: t('<code>return 값;</code> 으로 결과를 돌려줘요. 부른 쪽에서 변수에 담거나 바로 찍을 수 있어요. 짧게 쓰는 <b>화살표 함수</b> <code>(a, b) => a * b</code> 도 있어요.', 'Hand back a result with <code>return value;</code>. The caller can store it or print it. There\'s also the short <b>arrow function</b> <code>(a, b) => a * b</code>.'),
        code: 'function total(boxes, each) {\n  return boxes * each;\n}\nconst twice = (n) => n * 2;\n\nconst w = total(4, 12);\nconsole.log(w);\nconsole.log(twice(5) + 1);',
      },
      {
        title: t('조건에 따라 돌려주기', 'Returning based on a condition'),
        body: t('<code>return</code> 을 만나면 함수는 그 자리에서 끝나요. true/false 를 돌려주면 조건문에 바로 쓸 수 있어요.', 'A function ends right where it hits <code>return</code>. Returning true/false lets you use it in an if right away.'),
        code: 'function canLift(kg) {\n  return kg <= 1000;\n}\n\nconsole.log(canLift(800));\nconsole.log(canLift(1200));',
      },
    ],
    predict: { prompt: t('이 코드를 실행하면 어떻게 찍힐까요?', 'What will this code print?'), code: 'function twice(n) {\n  return n * 2;\n}\n\nconsole.log(twice(twice(3)));', choices: ['12', '6', '9', '3'], answer: 0, explain: t('twice(3) 은 6, twice(6) 은 12.', 'twice(3) is 6, and twice(6) is 12.') },
    fill: {
      prompt: t('박스 수 × 박스 무게를 돌려주는 함수를 완성하세요.', 'Finish the function that returns boxes × weight per box.'),
      code: `function load(boxes, {{0}}) {\n  {{1}} boxes * each;\n}\n\nconsole.log("${t('적재 무게', 'Load')}: " + load(5, 20) + "kg");`,
      blanks: [{ size: 4 }, { size: 7 }], expected: t('적재 무게: 100kg', 'Load: 100kg'),
      hints: [t('두 번째 매개변수 이름은 아래에서 쓰는 이름과 같아야 해요. 돌려주는 단어는?', 'The second parameter must match the name used below. And the word that hands a value back?'), 'each, return'], solution: ['each', 'return'],
    },
    write: {
      prompt: t('<code>fee(kg)</code> 함수를 만들어 kg 당 1.5 를 곱한 운송비를 돌려주게 하고, 40kg 의 운송비를 찍어 주세요.', 'Make a function <code>fee(kg)</code> that returns kg × 1.5, then print the fee for 40kg.'),
      starter: t('// 여기에 함수를 만들고 불러 보세요\n', '// Make your function and call it here\n'),
      expected: t('운송비: 60', 'Fee: 60'),
      mustInclude: [{ re: 'function\\s+fee\\s*\\(|fee\\s*=\\s*\\(?\\s*kg', msg: t('<code>fee(kg)</code> 함수를 만들어 주세요.', 'Make a <code>fee(kg)</code> function.') }, { re: 'return|=>', msg: t('<code>return</code> 으로 돌려주세요.', 'Hand it back with <code>return</code>.') }],
      hints: ['return kg * 1.5;', t('console.log("운송비: " + fee(40));', 'console.log("Fee: " + fee(40));')],
      solution: `function fee(kg) {\n  return kg * 1.5;\n}\n\nconsole.log("${t('운송비: ', 'Fee: ')}" + fee(40));`,
    },
    learned: [t('<code>return 값;</code> → 거기서 끝', '<code>return value;</code> → ends there'), t('화살표 함수 <code>(n) => n * 2</code>', 'Arrow function <code>(n) => n * 2</code>'), t('부른 결과를 변수에 담거나 바로 쓰기', 'Store the result or use it right away')],
  },
  {
    id: 'fork-reuse', stage: 'forklift', npc: 'choi',
    title: t('운행 기록 정리하기', 'Tidy the trip log'),
    request: [t('하루 운행 기록을 정리해야 해요. 배열로 받은 무게를 다 더하고, 제일 무거운 것도 알고 싶어요.', 'I need to tidy up today\'s trip log: add up the weights from an array, and find the heaviest.'), t('함수로 나눠 두면 다음에도 쓸 수 있겠죠?', 'If we split it into functions, we can reuse them, right?')],
    thanks: t('함수로 나누니까 읽기도 쉽고 다시 쓰기도 좋네요!', 'Split into functions, it\'s easy to read and reuse!'),
    concepts: [
      {
        title: t('배열을 받는 함수', 'A function that takes an array'),
        body: t('매개변수로 배열도 받을 수 있어요. 함수 안에서 반복문을 돌리고 결과를 돌려줘요.', 'A parameter can be an array too. Loop inside the function and return the result.'),
        code: 'function sum(arr) {\n  let s = 0;\n  for (const x of arr) s += x;\n  return s;\n}\n\nconst trips = [300, 450, 200];\nconsole.log(sum(trips));',
      },
      {
        title: t('함수끼리 부르기', 'Functions calling functions'),
        body: t('함수 안에서 다른 함수를 불러도 돼요. 작은 함수를 조립해서 큰 일을 해요.', 'A function can call another function. Build big jobs out of small ones.'),
        code: 'function sum(arr) {\n  let s = 0;\n  for (const x of arr) s += x;\n  return s;\n}\n\nfunction average(arr) {\n  return sum(arr) / arr.length;\n}\n\nconsole.log(average([300, 450, 200]));',
      },
    ],
    predict: { prompt: t('이 코드를 실행하면 어떻게 찍힐까요?', 'What will this code print?'), code: 'function add(a, b) {\n  return a + b;\n}\n\nfunction triple(n) {\n  return add(add(n, n), n);\n}\n\nconsole.log(triple(4));', choices: ['12', '8', '16', '4'], answer: 0, explain: t('add(4, 4) = 8, add(8, 4) = 12.', 'add(4, 4) = 8, then add(8, 4) = 12.') },
    fill: {
      prompt: t('배열에서 제일 큰 값을 돌려주는 함수를 완성하세요.', 'Finish the function that returns the biggest value in the array.'),
      code: `function max(arr) {\n  let m = arr[0];\n  for (const x of arr) {\n    if (x > m) m = x;\n  }\n  {{0}} m;\n}\n\nconst trips = [300, 450, 200];\nconsole.log("${t('최대', 'Max')}: " + {{1}}(trips) + "kg");`,
      blanks: [{ size: 7 }, { size: 4 }], expected: t('최대: 450kg', 'Max: 450kg'),
      hints: [t('찾은 값을 돌려주고, 함수 이름으로 불러요.', 'Return what you found, and call it by name.'), 'return, max'], solution: ['return', 'max'],
    },
    write: {
      prompt: t('<code>countOver(arr, limit)</code> 함수를 만들어 limit 보다 무거운 운행 수를 돌려주게 하세요. <code>[300, 1200, 450, 1100]</code> 에서 1000 넘는 횟수를 찍어 주세요.', 'Make <code>countOver(arr, limit)</code> that returns how many trips are heavier than limit. Print the count over 1000 for <code>[300, 1200, 450, 1100]</code>.'),
      starter: t('const trips = [300, 1200, 450, 1100];\n// 여기에 함수를 만들고 불러 보세요\n', 'const trips = [300, 1200, 450, 1100];\n// Make your function and call it here\n'),
      expected: t('과적 운행: 2회', 'Heavy trips: 2'),
      mustInclude: [{ re: 'function\\s+countOver\\s*\\(\\s*\\w+\\s*,\\s*\\w+|countOver\\s*=\\s*\\(\\s*\\w+\\s*,\\s*\\w+', msg: t('<code>countOver(arr, limit)</code> 함수를 만들어 주세요.', 'Make a <code>countOver(arr, limit)</code> function.') }],
      hints: ['let c = 0; for (const x of arr) { if (x > limit) c++; } return c;', t('console.log("과적 운행: " + countOver(trips, 1000) + "회");', 'console.log("Heavy trips: " + countOver(trips, 1000));')],
      solution: `const trips = [300, 1200, 450, 1100];\n\nfunction countOver(arr, limit) {\n  let c = 0;\n  for (const x of arr) {\n    if (x > limit) c++;\n  }\n  return c;\n}\n\nconsole.log("${t('과적 운행: ', 'Heavy trips: ')}" + countOver(trips, 1000)${t(' + "회"', '')});`,
    },
    learned: [t('배열도 매개변수로 받기', 'Arrays can be parameters'), t('매개변수 여러 개: <code>(arr, limit)</code>', 'Several parameters: <code>(arr, limit)</code>'), t('작은 함수를 조립해서 쓰기', 'Build with small functions')],
  },

  // ───────────── 패킹 작업대 · 강군 · 객체(키-값) ─────────────
  {
    id: 'part-map', stage: 'parttime', npc: 'kang',
    title: t('상품별 재고표 만들기', 'Make a stock table'),
    request: [t('김사원님! 상품 이름으로 재고를 바로 찾고 싶은데요,', 'Kim! I want to look up stock by product name,'), t('배열은 번호로만 찾잖아요. 이름으로 찾는 건 없어요?', 'but arrays only go by number. Is there something that goes by name?')],
    thanks: t('이름표 붙인 서랍 같네요! 재고 찾기 쉬워졌어요.', 'It\'s like labelled drawers! Finding stock is easy now.'),
    concepts: [
      {
        title: t('객체: 키로 값 찾기', 'Objects: find values by key'),
        body: t('<code>{ 키: 값, … }</code> 으로 키-값 짝을 담아요. <code>obj[키]</code> 나 <code>obj.키</code> 로 꺼내고, 같은 방법으로 넣거나 바꿔요.', '<code>{ key: value, … }</code> holds key-value pairs. Read with <code>obj[key]</code> or <code>obj.key</code>, and add or change the same way.'),
        code: 'const stock = { toner: 12, lipbalm: 30 };\nconsole.log(stock["toner"]);\nconsole.log(stock.lipbalm);\nstock.toner = 10;\nstock["cushion"] = 8;\nconsole.log(stock);',
      },
      {
        title: t('있는지 확인하기', 'Checking a key'),
        body: t('<code>"키" in obj</code> 로 그 키가 있는지 봐요. 없는 키를 꺼내면 <code>undefined</code> 예요. 개수는 <code>Object.keys(obj).length</code>.', 'Check with <code>"key" in obj</code>. A missing key gives <code>undefined</code>. The count is <code>Object.keys(obj).length</code>.'),
        code: 'const stock = { toner: 12 };\nconsole.log("cushion" in stock);\nconsole.log(stock.cushion);\nconsole.log(Object.keys(stock).length);',
      },
    ],
    predict: { prompt: t('이 코드를 실행하면 어떻게 찍힐까요?', 'What will this code print?'), code: 'const m = { a: 1, b: 2 };\nm.a = 5;\nconsole.log(m.a + m.b);', choices: ['7', '3', '8', '12'], answer: 0, explain: t('a 는 5 로 바뀌었어요. 5 + 2 = 7.', 'a was changed to 5. 5 + 2 = 7.') },
    fill: {
      prompt: t('재고표에 cushion 8개를 넣고 꺼내 찍게 하세요.', 'Put 8 cushions in the stock table and print it.'),
      code: `const stock = {};\nstock{{0}} = 8;\nconsole.log("${t('쿠션 재고', 'Cushion stock')}: " + stock{{1}});`,
      blanks: [{ size: 12 }, { size: 12 }], expected: t('쿠션 재고: 8', 'Cushion stock: 8'),
      hints: [t('대괄호 안에 키 이름을 문자열로 써요.', 'Write the key name as a string inside square brackets.'), '["cushion"], ["cushion"]'], solution: ['["cushion"]', '["cushion"]'],
    },
    write: {
      prompt: t('재고표 <code>stock</code> 에 toner 12, lipbalm 30 을 넣어 주세요. lipbalm 이 5개 팔렸으니 25 로 바꾸고, sunscreen 이 있는지(<code>in</code>)도 찍어 주세요.', 'Put toner 12 and lipbalm 30 into a stock object <code>stock</code>. 5 lip balms sold, so change it to 25. Also print whether sunscreen is there (<code>in</code>).'),
      starter: W, expected: t('립밤: 25\n선크림 있음: false', 'lipbalm: 25\nhas sunscreen: false'),
      mustInclude: [{ re: '\\{[^}]*toner', msg: t('<code>{ toner: 12, … }</code> 객체를 만들어 주세요.', 'Make an object <code>{ toner: 12, … }</code>.') }, { re: '\\bin\\s+stock', msg: t('<code>"sunscreen" in stock</code> 으로 확인해 주세요.', 'Check with <code>"sunscreen" in stock</code>.') }],
      hints: [t('stock.lipbalm = 25; 로 바꿔요.', 'Change it with stock.lipbalm = 25;'), t('console.log("선크림 있음: " + ("sunscreen" in stock));', 'console.log("has sunscreen: " + ("sunscreen" in stock));')],
      solution: `const stock = { toner: 12, lipbalm: 30 };\nstock.lipbalm = 25;\nconsole.log("${t('립밤: ', 'lipbalm: ')}" + stock.lipbalm);\nconsole.log("${t('선크림 있음: ', 'has sunscreen: ')}" + ("sunscreen" in stock));`,
    },
    learned: ['<code>const m = { key: value };</code>', t('<code>m[키]</code>, <code>m.키</code> 로 읽고 쓰기', 'Read/write with <code>m[key]</code>, <code>m.key</code>'), t('<code>"키" in m</code>, <code>Object.keys(m)</code>', '<code>"key" in m</code>, <code>Object.keys(m)</code>')],
  },
  {
    id: 'part-count', stage: 'parttime', npc: 'kang',
    title: t('택배사별 박스 세기', 'Count boxes per courier'),
    request: [t('오늘 포장한 박스가 택배사 이름으로 쭉 적혀 있어요.', 'Today\'s packed boxes are listed by courier name.'), t('택배사마다 몇 개인지 세 줄 수 있어요? 에어캡 하나 드릴게요 ㅎㅎ', 'Can you count how many each courier has? I\'ll give you a bubble wrap sheet, hehe.')],
    thanks: t('딱 맞아요! 에어캡은 비밀로 터뜨려요… 쉿!', 'Spot on! Pop the bubble wrap in secret… shh!'),
    concepts: [
      {
        title: t('객체로 개수 세기', 'Counting with an object'),
        body: t('없으면 0 에서 시작해서 1 씩 더해요. <code>count[k] = (count[k] || 0) + 1</code> 이 흔한 모양이에요. 없는 키는 undefined 라서 <code>|| 0</code> 이 0 으로 바꿔 줘요.', 'Start at 0 if missing and add 1. <code>count[k] = (count[k] || 0) + 1</code> is the usual pattern. A missing key is undefined, and <code>|| 0</code> turns it into 0.'),
        code: 'const picks = ["A", "B", "A", "A"];\nconst count = {};\nfor (const p of picks) {\n  count[p] = (count[p] || 0) + 1;\n}\nconsole.log(count.A);\nconsole.log(count.B);',
      },
      {
        title: t('객체 전체 돌기', 'Going through a whole object'),
        body: t('<code>for (const k in obj)</code> 로 키를 하나씩 돌아요. 이름 순서로 돌고 싶으면 <code>Object.keys(obj).sort()</code> 를 돌아요.', 'Loop over keys with <code>for (const k in obj)</code>. For name order, loop over <code>Object.keys(obj).sort()</code>.'),
        code: 'const m = { b: 2, a: 1, c: 3 };\nfor (const k of Object.keys(m).sort()) {\n  console.log(k + "=" + m[k]);\n}',
      },
    ],
    predict: { prompt: t('이 코드를 실행하면 어떻게 찍힐까요?', 'What will this code print?'), code: 'const s = ["x", "y", "x"];\nconst c = {};\nfor (const k of s) {\n  c[k] = (c[k] || 0) + 1;\n}\nconsole.log(c.x);', choices: ['2', '1', '3', 'undefined'], answer: 0, explain: t('"x" 가 두 번 나와서 0 → 1 → 2.', '"x" appears twice: 0 → 1 → 2.') },
    fill: {
      prompt: t('택배사 이름이 나올 때마다 1 씩 세게 하세요.', 'Count 1 each time a courier name appears.'),
      code: `const boxes = ["${t('번개', 'Bolt')}", "${t('하늘', 'Sky')}", "${t('번개', 'Bolt')}"];\nconst count = {};\nfor (const b of boxes) {\n  count[b] = (count[b] {{0}} 0) + {{1}};\n}\nconsole.log("${t('번개', 'Bolt')}: " + count["${t('번개', 'Bolt')}"]);`,
      blanks: [{ size: 3 }, { size: 2 }], expected: t('번개: 2', 'Bolt: 2'),
      hints: [t('없으면(undefined) 0 을 쓰게 하는 기호, 그리고 하나씩 더하는 수예요.', 'The symbol that falls back to 0 when undefined, and the number to add each time.'), '||, 1'], solution: ['||', '1'],
    },
    write: {
      prompt: t('박스 목록 <code>["번개", "하늘", "번개", "바다", "번개", "하늘"]</code> 을 택배사별로 세서, 이름 순서대로 "이름: 개수" 를 찍어 주세요.', 'Count the box list <code>["Bolt", "Sky", "Bolt", "Ocean", "Bolt", "Sky"]</code> by courier and print "name: count" in name order.'),
      starter: W, expected: t('바다: 1\n번개: 3\n하늘: 2', 'Bolt: 3\nOcean: 1\nSky: 2'),
      mustInclude: [{ re: 'sort\\s*\\(', msg: t('<code>Object.keys(count).sort()</code> 로 이름 순서를 맞춰 주세요.', 'Use <code>Object.keys(count).sort()</code> for name order.') }, { re: 'for\\s*\\(', msg: t('반복문으로 세 주세요.', 'Count with a loop.') }],
      hints: ['const count = {}; for (const b of boxes) count[b] = (count[b] || 0) + 1;', 'for (const k of Object.keys(count).sort()) console.log(k + ": " + count[k]);'],
      solution: `const boxes = ["${t('번개', 'Bolt')}", "${t('하늘', 'Sky')}", "${t('번개', 'Bolt')}", "${t('바다', 'Ocean')}", "${t('번개', 'Bolt')}", "${t('하늘', 'Sky')}"];\nconst count = {};\nfor (const b of boxes) {\n  count[b] = (count[b] || 0) + 1;\n}\nfor (const k of Object.keys(count).sort()) {\n  console.log(k + ": " + count[k]);\n}`,
    },
    learned: [t('세기: <code>c[k] = (c[k] || 0) + 1</code>', 'Counting: <code>c[k] = (c[k] || 0) + 1</code>'), t('키 돌기: <code>for (const k in obj)</code>', 'Keys: <code>for (const k in obj)</code>'), t('이름 순서: <code>Object.keys(obj).sort()</code>', 'Name order: <code>Object.keys(obj).sort()</code>')],
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
        body: t('<b>클래스</b>는 설계도, <b>객체</b>는 설계도로 만든 물건이에요. <code>class 이름 { constructor(…) { this.필드 = 값; } }</code> 로 만들고 <code>new 이름(…)</code> 으로 객체를 만들어요.', 'A <b>class</b> is a blueprint; an <b>object</b> is built from it. Write <code>class Name { constructor(…) { this.field = value; } }</code> and make objects with <code>new Name(…)</code>.'),
        code: `class Product {\n  constructor(name, price) {\n    this.name = name;\n    this.price = price;\n  }\n}\n\nconst p = new Product("${t('토너', 'Toner')}", 15000);\nconsole.log(p.name + " " + p.price);`,
      },
      {
        title: t('객체마다 따로', 'Each object is separate'),
        body: t('같은 클래스로 만든 객체라도 각자 자기 값을 따로 가져요. <code>this</code> 는 "이 객체" 예요.', 'Objects from the same class each keep their own values. <code>this</code> means "this object".'),
        code: `class Product {\n  constructor(name, price) {\n    this.name = name;\n    this.price = price;\n  }\n}\n\nconst a = new Product("${t('토너', 'Toner')}", 15000);\nconst b = new Product("${t('립밤', 'Lip balm')}", 4500);\nconsole.log(a.name + ", " + b.name);`,
      },
    ],
    predict: { prompt: t('이 코드를 실행하면 어떻게 찍힐까요?', 'What will this code print?'), code: 'class Box {\n  constructor(w) {\n    this.w = w;\n  }\n}\n\nconst a = new Box(3);\nconst b = new Box(5);\nconsole.log(a.w + b.w);', choices: ['8', '35', '3', '5'], answer: 0, explain: t('a.w 는 3, b.w 는 5. 각 객체가 자기 값을 따로 가져요.', 'a.w is 3 and b.w is 5. Each object keeps its own value.') },
    fill: {
      prompt: t('생성자로 상품을 만들고 이름과 가격을 찍게 하세요.', 'Make a product with the constructor and print its name and price.'),
      code: `class Product {\n  {{0}}(name, price) {\n    this.name = name;\n    this.price = price;\n  }\n}\n\nconst p = {{1}} Product("${t('쿠션', 'Cushion')}", 22000);\nconsole.log(p.name + ": " + p.price);`,
      blanks: [{ size: 11 }, { size: 3 }], expected: t('쿠션: 22000', 'Cushion: 22000'),
      hints: [t('객체를 만들 때 실행되는 특별한 메서드 이름과, 객체를 만드는 단어예요.', 'The special method that runs when an object is made, and the word that makes it.'), 'constructor, new'], solution: ['constructor', 'new'],
    },
    write: {
      prompt: t('<code>name</code>, <code>stock</code> 을 받는 생성자가 있는 <code>Item</code> 클래스를 만들고, 토너(12개)와 립밤(30개) 객체를 만들어 찍어 주세요.', 'Make a class <code>Item</code> whose constructor takes <code>name</code> and <code>stock</code>. Create toner (12) and lip balm (30) and print them.'),
      starter: W, expected: t('토너: 12개\n립밤: 30개', 'Toner: 12\nLip balm: 30'),
      mustInclude: [{ re: 'class\\s+Item', msg: t('<code>class Item</code> 을 만들어 주세요.', 'Make <code>class Item</code>.') }, { re: 'constructor\\s*\\(', msg: t('<code>constructor(name, stock)</code> 를 만들어 주세요.', 'Make <code>constructor(name, stock)</code>.') }, { re: 'new\\s+Item', msg: t('<code>new Item(…)</code> 으로 객체를 만들어 주세요.', 'Create objects with <code>new Item(…)</code>.') }],
      hints: ['class Item { constructor(name, stock) { this.name = name; this.stock = stock; } }', t('const a = new Item("토너", 12); console.log(a.name + ": " + a.stock + "개");', 'const a = new Item("Toner", 12); console.log(a.name + ": " + a.stock);')],
      solution: `class Item {\n  constructor(name, stock) {\n    this.name = name;\n    this.stock = stock;\n  }\n}\n\nconst a = new Item("${t('토너', 'Toner')}", 12);\nconst b = new Item("${t('립밤', 'Lip balm')}", 30);\nconsole.log(a.name + ": " + a.stock${t(' + "개"', '')});\nconsole.log(b.name + ": " + b.stock${t(' + "개"', '')});`,
    },
    learned: [t('클래스 = 설계도, 객체 = <code>new</code> 로 만든 것', 'Class = blueprint, object = made with <code>new</code>'), t('<code>constructor</code> 에서 <code>this.필드 = 값</code>', '<code>this.field = value</code> in <code>constructor</code>'), t('<code>객체.필드</code> 로 꺼내기', 'Read with <code>object.field</code>')],
  },
  {
    id: 'rest-object-method', stage: 'rest', npc: 'moon',
    title: t('재고가 스스로 줄어들게', 'Let stock update itself'),
    request: [t('상품이 팔리면 재고가 줄어야죠.', 'When a product sells, its stock should go down.'), t('그 일을 상품 객체가 직접 하게 만들 수 있어요.', 'We can make the product object do that itself.')],
    thanks: t('객체가 자기 일을 하니까 코드가 깔끔하네요. 훌륭해요!', 'Objects doing their own work keeps the code tidy. Excellent!'),
    concepts: [
      {
        title: t('객체의 메서드', 'Object methods'),
        body: t('클래스 안에 <code>이름() { … }</code> 으로 메서드를 만들면, <code>this</code> 로 그 객체의 값을 쓰고 바꿀 수 있어요. <code>객체.메서드()</code> 로 불러요.', 'Write <code>name() { … }</code> inside the class to make a method; it can use and change the object\'s values through <code>this</code>. Call it with <code>object.method()</code>.'),
        code: `class Item {\n  constructor(name, stock) {\n    this.name = name;\n    this.stock = stock;\n  }\n  sell(n) {\n    this.stock -= n;\n  }\n  label() {\n    return this.name + " (" + this.stock + ")";\n  }\n}\n\nconst t = new Item("${t('토너', 'Toner')}", 12);\nt.sell(3);\nconsole.log(t.label());`,
      },
      {
        title: t('객체 여러 개를 배열에', 'Many objects in an array'),
        body: t('객체도 배열에 담고, 반복문으로 하나씩 일을 시킬 수 있어요.', 'Objects go into arrays too, and you can loop through them.'),
        code: 'class Item {\n  constructor(name, stock) {\n    this.name = name;\n    this.stock = stock;\n  }\n}\n\nconst items = [new Item("A", 5), new Item("B", 0)];\nfor (const it of items) {\n  console.log(it.name + ": " + it.stock);\n}',
      },
    ],
    predict: { prompt: t('이 코드를 실행하면 어떻게 찍힐까요?', 'What will this code print?'), code: 'class Counter {\n  constructor() {\n    this.n = 0;\n  }\n  up() {\n    this.n++;\n  }\n}\n\nconst a = new Counter();\nconst b = new Counter();\na.up();\na.up();\nb.up();\nconsole.log(a.n + " " + b.n);', choices: ['2 1', '3 3', '1 1', '2 2'], answer: 0, explain: t('a 와 b 는 각자 자기 n 을 가져요. a 는 두 번, b 는 한 번 올렸어요.', 'a and b each have their own n. a went up twice, b once.') },
    fill: {
      prompt: t('판매 메서드를 완성해서 재고가 줄게 하세요.', 'Finish the sell method so stock goes down.'),
      code: `class Item {\n  constructor() {\n    this.stock = 10;\n  }\n  sell(n) {\n    {{0}}.stock {{1}} n;\n  }\n}\n\nconst it = new Item();\nit.sell(4);\nconsole.log("${t('남은 재고', 'Stock left')}: " + it.stock);`,
      blanks: [{ size: 4 }, { size: 2 }], expected: t('남은 재고: 6', 'Stock left: 6'),
      hints: [t('"이 객체의" 를 뜻하는 단어, 그리고 빼서 넣는 줄임 기호예요.', 'The word for "this object\'s", and the subtract-and-store shortcut.'), 'this, -='], solution: ['this', '-='],
    },
    write: {
      prompt: t('<code>Item</code> 에 <code>isEmpty()</code> (재고가 0 이면 true) 메서드를 만들어 주세요. 립밤(재고 2)을 2개 팔고, 비었는지 찍어 주세요.', 'Give <code>Item</code> a method <code>isEmpty()</code> (true when stock is 0). Sell 2 lip balms (stock 2) and print whether it\'s empty.'),
      starter: `class Item {\n  constructor(name, stock) {\n    this.name = name;\n    this.stock = stock;\n  }\n  sell(n) {\n    this.stock -= n;\n  }\n  ${t('// 여기에 isEmpty 를 만드세요', '// Make isEmpty here')}\n}\n\n${t('// 여기서 써 보세요', '// Use it here')}\n`,
      expected: t('립밤 품절: true', 'Lip balm sold out: true'),
      mustInclude: [{ re: 'isEmpty\\s*\\(\\s*\\)\\s*\\{', msg: t('<code>isEmpty() { … }</code> 메서드를 만들어 주세요.', 'Make an <code>isEmpty() { … }</code> method.') }, { re: '\\.isEmpty\\s*\\(\\s*\\)', msg: t('<code>객체.isEmpty()</code> 로 불러 주세요.', 'Call it with <code>object.isEmpty()</code>.') }],
      hints: ['isEmpty() { return this.stock === 0; }', t('const b = new Item("립밤", 2); b.sell(2); console.log("립밤 품절: " + b.isEmpty());', 'const b = new Item("Lip balm", 2); b.sell(2); console.log("Lip balm sold out: " + b.isEmpty());')],
      solution: `class Item {\n  constructor(name, stock) {\n    this.name = name;\n    this.stock = stock;\n  }\n  sell(n) {\n    this.stock -= n;\n  }\n  isEmpty() {\n    return this.stock === 0;\n  }\n}\n\nconst b = new Item("${t('립밤', 'Lip balm')}", 2);\nb.sell(2);\nconsole.log("${t('립밤 품절: ', 'Lip balm sold out: ')}" + b.isEmpty());`,
    },
    learned: [t('클래스 안 메서드: <code>이름() { }</code>', 'Methods in a class: <code>name() { }</code>'), t('<code>this.필드</code> 로 자기 값 쓰기', 'Use its own values with <code>this.field</code>'), t('객체마다 자기 값을 따로 가짐', 'Each object has its own values')],
  },
  {
    id: 'rest-exception', stage: 'rest', npc: 'moon',
    title: t('잘못된 입력 막기', 'Guard against bad input'),
    request: [t('전산에 숫자 칸인데 글자가 들어오는 일이 꼭 있어요.', 'Sometimes letters end up in a number field.'), t('그럴 때 프로그램이 멈추지 않게 할 수 있어요?', 'Can we keep the program from crashing when that happens?')],
    thanks: t('에러가 나도 침착하게 넘어가네요. 든든해요!', 'Even with errors it carries on calmly. Reassuring!'),
    concepts: [
      {
        title: t('<code>try</code> / <code>catch</code>', '<code>try</code> / <code>catch</code>'),
        body: t('에러가 날 수 있는 코드를 <code>try { }</code> 에 넣고, 에러가 나면 <code>catch (e) { }</code> 가 대신 실행돼요. 프로그램은 멈추지 않고 이어져요.', 'Put code that might fail in <code>try { }</code>. If it fails, <code>catch (e) { }</code> runs instead, and the program keeps going.'),
        code: `try {\n  JSON.parse("{${t('잘못된', 'broken')}");\n  console.log("${t('읽기 성공', 'Parsed')}");\n} catch (e) {\n  console.log("${t('읽을 수 없어요', 'Could not read it')}");\n}\nconsole.log("${t('계속 진행', 'Still running')}");`,
      },
      {
        title: t('직접 에러 던지기 <code>throw</code>', 'Throwing your own error'),
        body: t('<code>Number("abc")</code> 는 에러 대신 <code>NaN</code> (숫자 아님)을 줘요. 이럴 땐 <code>Number.isNaN</code> 으로 확인하고 <code>throw new Error("메시지")</code> 로 직접 에러를 던져요. <code>e.message</code> 로 메시지를 읽어요.', '<code>Number("abc")</code> gives <code>NaN</code> (not a number) instead of an error. Check with <code>Number.isNaN</code> and throw your own with <code>throw new Error("message")</code>. Read it with <code>e.message</code>.'),
        code: `function toQty(s) {\n  const n = Number(s);\n  if (Number.isNaN(n)) throw new Error("${t('숫자 아님', 'not a number')}: " + s);\n  return n;\n}\n\ntry {\n  console.log(toQty("12"));\n  console.log(toQty("ab"));\n} catch (e) {\n  console.log(e.message);\n} finally {\n  console.log("${t('확인 끝', 'Check done')}");\n}`,
      },
    ],
    predict: { prompt: t('이 코드를 실행하면 어떻게 찍힐까요?', 'What will this code print?'), code: 'try {\n  console.log("A");\n  throw new Error("x");\n  console.log("B");\n} catch (e) {\n  console.log("C");\n}', choices: ['A\nC', 'A\nB\nC', 'C', 'A\nB'], answer: 0, explain: t('A 를 찍고 throw 에서 에러가 나서 B 는 건너뛰고 catch 의 C 를 찍어요.', 'A prints, then throw raises an error, so B is skipped and catch prints C.') },
    fill: {
      prompt: t('깨진 데이터를 읽다 에러가 나면 "입력 오류" 가 찍히게 하세요.', 'Print "Input error" when reading broken data fails.'),
      code: `{{0}} {\n  const data = JSON.parse("{oops");\n  console.log(data);\n} {{1}} (e) {\n  console.log("${t('입력 오류', 'Input error')}");\n}`,
      blanks: [{ size: 3 }, { size: 5 }], expected: t('입력 오류', 'Input error'),
      hints: [t('시도하는 블록과 에러를 잡는 블록의 단어예요.', 'The words for the trying block and the catching block.'), 'try, catch'], solution: ['try', 'catch'],
    },
    write: {
      prompt: t('수량 칸에 들어온 값들 <code>["3", "x", "5"]</code> 을 숫자로 바꿔서 더해 주세요. 숫자가 아니면 <code>throw</code> 로 에러를 던지고, <code>catch</code> 에서 "건너뜀: x" 를 찍고 넘어가요. 마지막에 합계를 찍어 주세요.', 'Turn the quantity entries <code>["3", "x", "5"]</code> into numbers and add them. If one isn\'t a number, <code>throw</code> an error, and in <code>catch</code> print "Skipped: x" and move on. Print the total at the end.'),
      starter: W, expected: t('건너뜀: x\n합계: 8', 'Skipped: x\nTotal: 8'),
      mustInclude: [{ re: 'try\\s*\\{', msg: t('<code>try</code> 를 써 주세요.', 'Use <code>try</code>.') }, { re: 'catch\\s*\\(', msg: t('<code>catch</code> 로 에러를 잡아 주세요.', 'Catch the error with <code>catch</code>.') }, { re: 'throw', msg: t('숫자가 아니면 <code>throw</code> 로 에러를 던져 주세요.', 'Throw an error with <code>throw</code> when it isn\'t a number.') }],
      hints: [t('for (const s of inputs) { try { const n = Number(s); if (Number.isNaN(n)) throw new Error(s); sum += n; } catch (e) { … } }', 'for (const s of inputs) { try { const n = Number(s); if (Number.isNaN(n)) throw new Error(s); sum += n; } catch (e) { … } }'), t('catch 안에서 console.log("건너뜀: " + s);', 'Inside catch: console.log("Skipped: " + s);')],
      solution: `const inputs = ["3", "x", "5"];\nlet sum = 0;\nfor (const s of inputs) {\n  try {\n    const n = Number(s);\n    if (Number.isNaN(n)) throw new Error(s);\n    sum += n;\n  } catch (e) {\n    console.log("${t('건너뜀: ', 'Skipped: ')}" + s);\n  }\n}\nconsole.log("${t('합계: ', 'Total: ')}" + sum);`,
    },
    learned: [t('<code>try { } catch (e) { }</code>', '<code>try { } catch (e) { }</code>'), t('직접 던지기 <code>throw new Error("…")</code>', 'Throw your own <code>throw new Error("…")</code>'), t('<code>finally</code> 는 항상 마지막에', '<code>finally</code> always runs last')],
  },
  {
    id: 'rest-review', stage: 'rest', npc: 'moon',
    title: t('하루 마감 보고서', 'End-of-day report'),
    request: [t('오늘 하루 수고 많았어요. 마지막으로 마감 보고서를 만들어 볼까요?', 'Great work today. Shall we finish with the end-of-day report?'), t('지금까지 배운 걸 다 써야 할 거예요. 천천히 해 봐요.', 'You\'ll need everything you\'ve learned. Take your time.')],
    thanks: t('완벽한 보고서예요. 김사원님, 1회차 졸업 축하해요! 🎉', 'A perfect report. Kim, congratulations on finishing lap 1! 🎉'),
    concepts: [
      {
        title: t('배운 것 모아 쓰기', 'Putting it all together'),
        body: t('변수, 배열, 반복문, 조건문, 함수를 한 프로그램에 같이 써요. 큰 일은 작은 함수로 나누면 읽기 쉬워요.', 'Use variables, arrays, loops, conditions and functions in one program. Splitting a big job into small functions keeps it readable.'),
        code: 'function isFree(amount) {\n  return amount >= 30000;\n}\n\nconst orders = [12000, 35000, 8000];\nlet free = 0;\nfor (const o of orders) {\n  if (isFree(o)) free++;\n}\nconsole.log(free);',
      },
      {
        title: t('보고서 모양 만들기', 'Shaping the report'),
        body: t('합계·개수 같은 결과를 변수에 모아 두고, 마지막에 템플릿 문자열로 한꺼번에 찍어요.', 'Collect results like totals and counts in variables, then print them with template strings at the end.'),
        code: `const total = 55000;\nconst count = 3;\nconsole.log(\`${t('주문 ${count}건, 합계 ${total.toLocaleString("en-US")}원', '${count} orders, total ${total.toLocaleString("en-US")} won')}\`);`,
      },
    ],
    predict: { prompt: t('이 코드를 실행하면 어떻게 찍힐까요?', 'What will this code print?'), code: 'const a = [5, 12, 7, 20];\nlet sum = 0;\nfor (const x of a) {\n  if (x >= 10) sum += x;\n}\nconsole.log(sum);', choices: ['32', '44', '12', '20'], answer: 0, explain: t('10 이상인 12 와 20 만 더해서 32.', 'Only 12 and 20 are 10 or more: 32.') },
    fill: {
      prompt: t('3만 원 이상 주문만 세는 함수를 완성하세요.', 'Finish the function that counts orders of 30,000 or more.'),
      code: `function countFree(orders) {\n  let c = 0;\n  for (const o of orders) {\n    if (o {{0}} 30000) c++;\n  }\n  {{1}} c;\n}\n\nconsole.log("${t('무료 배송', 'Free shipping')}: " + countFree([12000, 35000, 8000, 50000]));`,
      blanks: [{ size: 3 }, { size: 7 }], expected: t('무료 배송: 2', 'Free shipping: 2'),
      hints: [t('"이상" 비교 기호와, 값을 돌려주는 단어예요.', 'The "or more" comparison, and the word that hands a value back.'), '>=, return'], solution: ['>=', 'return'],
    },
    write: {
      prompt: t('오늘 주문 금액 <code>[12000, 35000, 8000, 50000]</code> 으로 보고서를 찍어 주세요: 총 금액(쉼표), 무료 배송(3만 원 이상) 건수, 가장 큰 주문.', 'Print a report for today\'s orders <code>[12000, 35000, 8000, 50000]</code>: the total (with commas), the number of free-shipping orders (30,000 or more), and the biggest order.'),
      starter: W, expected: t('총 금액: 105,000원\n무료 배송: 2건\n최대 주문: 50,000원', 'Total: 105,000 won\nFree shipping: 2\nBiggest order: 50,000 won'),
      mustInclude: [{ re: 'for\\s*\\(', msg: t('반복문을 써 주세요.', 'Use a loop.') }, { re: 'if\\s*\\(', msg: t('<code>if</code> 로 조건을 확인해 주세요.', 'Check conditions with <code>if</code>.') }],
      hints: [t('total, free, max 세 변수를 반복문 하나에서 같이 계산해요.', 'Work out total, free and max in a single loop.'), t('total.toLocaleString("en-US") 로 쉼표를 넣어요.', 'Add commas with total.toLocaleString("en-US").')],
      solution: `const orders = [12000, 35000, 8000, 50000];\nlet total = 0;\nlet free = 0;\nlet max = orders[0];\nfor (const o of orders) {\n  total += o;\n  if (o >= 30000) free++;\n  if (o > max) max = o;\n}\nconsole.log("${t('총 금액: ', 'Total: ')}" + total.toLocaleString("en-US") + "${t('원', ' won')}");\nconsole.log("${t('무료 배송: ', 'Free shipping: ')}" + free${t(' + "건"', '')});\nconsole.log("${t('최대 주문: ', 'Biggest order: ')}" + max.toLocaleString("en-US") + "${t('원', ' won')}");`,
    },
    learned: [t('반복문 하나로 여러 값 같이 계산', 'Work out several values in one loop'), t('큰 일은 작은 함수로', 'Split big jobs into small functions'), t('마지막에 서식 맞춰 찍기', 'Print neatly at the end')],
  },
];
