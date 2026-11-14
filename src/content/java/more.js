// Java quests for the rest of lap 1 (operators → classes). Korean and English sit side by side:
// t('한국어', 'English') picks the display language. Codes are full Main.java files (Java 8).
// Every example, fill solution and write solution was run for real and matches `expected`.
import { tr as t } from '../../i18n.js';

const main = (body, head = '') => `${head}public class Main {
    public static void main(String[] args) {
${body.split('\n').map((l) => (l ? '        ' + l : l)).join('\n')}
    }
}`;
const UTIL = 'import java.util.*;\n\n';
const W = t('// 여기에 코드를 쓰세요\n', '// Write your code here\n');

export const QUESTS = [
  // ───────────── 주문 출력실 · 이대리 · 연산자 ─────────────
  {
    id: 'print-arith', stage: 'printing', npc: 'lee',
    title: t('송장 금액 계산하기', 'Work out the order total'),
    request: [t('김사원님, 송장에 결제 금액이 찍혀야 하는데 계산이 자꾸 틀려요…', 'Kim, the payment amount on the labels keeps coming out wrong…'), t('자바로 금액 계산 좀 해 줄래요?', 'Could you do the math in Java?')],
    thanks: t('금액이 딱 맞네요! 송장 출력 시작할게요~', 'The totals are spot on! Printing the labels now!'),
    concepts: [
      {
        title: t('사칙연산과 나머지 <code>%</code>', 'Math and remainder <code>%</code>'),
        body: t('<code>+ - * /</code> 로 계산해요. <code>%</code> 는 나눈 <b>나머지</b>예요. 곱하기·나누기가 더하기보다 먼저 계산되고, 괄호가 있으면 괄호부터예요.', 'Use <code>+ - * /</code> for math. <code>%</code> gives the <b>remainder</b> of a division. Multiply and divide come before add, and parentheses come first.'),
        code: main('System.out.println(10 + 3 * 2);\nSystem.out.println((10 + 3) * 2);\nSystem.out.println(23 / 5);\nSystem.out.println(23 % 5);'),
      },
      {
        title: t('줄여 쓰기 <code>+=</code> <code>++</code>', 'Shortcuts <code>+=</code> <code>++</code>'),
        body: t('<code>a += 3</code> 은 <code>a = a + 3</code> 과 같아요. <code>a++</code> 는 1 더하기, <code>a--</code> 는 1 빼기예요.', '<code>a += 3</code> is the same as <code>a = a + 3</code>. <code>a++</code> adds 1, <code>a--</code> subtracts 1.'),
        code: main('int count = 10;\ncount += 5;\ncount++;\ncount -= 2;\nSystem.out.println(count);'),
      },
    ],
    predict: { prompt: t('이 코드를 실행하면 어떻게 찍힐까요?', 'What will this code print?'), code: main('int a = 17;\nSystem.out.println(a % 4);'), choices: ['1', '4', '4.25', '0'], answer: 0, explain: t('17 을 4 로 나누면 몫 4, 나머지 1 이에요. % 는 나머지예요.', '17 divided by 4 is 4 with a remainder of 1. % gives the remainder.') },
    fill: {
      prompt: t('박스 23개를 5개씩 묶었어요. 묶음 수와 남은 박스를 찍어 주세요.', '23 boxes are bundled in fives. Print the bundles and the boxes left over.'),
      code: main(`int boxes = 23;\nSystem.out.println("${t('묶음', 'Bundles')}: " + (boxes {{0}} 5));\nSystem.out.println("${t('남은 박스', 'Left over')}: " + (boxes {{1}} 5));`),
      blanks: [{ size: 2 }, { size: 2 }], expected: t('묶음: 4\n남은 박스: 3', 'Bundles: 4\nLeft over: 3'),
      hints: [t('정수끼리 나누면 몫만 남아요. 나머지는 다른 기호예요.', 'Dividing ints keeps only the whole part. The remainder uses another symbol.'), '/, %'], solution: ['/', '%'],
    },
    write: {
      prompt: t('립밤 한 개 4500원, 3개 주문에 배송비 3000원이에요. 변수 <code>price</code>, <code>qty</code>, <code>shipping</code> 을 만들고 결제 금액을 찍어 주세요.', 'One lip balm is 4500 won, 3 were ordered, and shipping is 3000 won. Make variables <code>price</code>, <code>qty</code>, <code>shipping</code> and print the total.'),
      starter: main(W), expected: t('결제 금액: 16500원', 'Total: 16500 won'),
      mustInclude: [{ re: 'int\\s+price', msg: t('<code>int price</code> 변수를 만들어 주세요.', 'Make an <code>int price</code> variable.') }, { re: 'price\\s*\\*\\s*qty|qty\\s*\\*\\s*price', msg: t('<code>price * qty</code> 로 계산해 주세요.', 'Calculate it with <code>price * qty</code>.') }],
      hints: [t('price * qty + shipping', 'price * qty + shipping'), t('System.out.println("결제 금액: " + (price * qty + shipping) + "원");', 'System.out.println("Total: " + (price * qty + shipping) + " won");')],
      solution: main(`int price = 4500;\nint qty = 3;\nint shipping = 3000;\nSystem.out.println("${t('결제 금액: ', 'Total: ')}" + (price * qty + shipping) + "${t('원', ' won')}");`),
    },
    learned: [t('<code>* /</code> 가 <code>+ -</code> 보다 먼저', '<code>* /</code> before <code>+ -</code>'), t('<code>%</code> 는 나머지', '<code>%</code> is the remainder'), '<code>a += 3</code>, <code>a++</code>'],
  },
  {
    id: 'print-compare', stage: 'printing', npc: 'lee',
    title: t('무료 배송 판별하기', 'Check free shipping'),
    request: [t('3만 원 넘게 사면 무료 배송인데요,', 'Orders of 30,000 won or more ship free,'), t('주문마다 맞는지 true/false 로 찍어 줄래요?', 'could you print true or false for each order?')],
    thanks: t('true, false 로 보니까 한눈에 들어와요!', 'Seeing true and false makes it so clear!'),
    concepts: [
      {
        title: t('비교 연산자', 'Comparison operators'),
        body: t('<code>&gt; &lt; &gt;= &lt;= == !=</code> 로 비교하면 결과는 <code>true</code> 아니면 <code>false</code> 예요. 같다는 <code>==</code> (등호 두 개), 다르다는 <code>!=</code>.', 'Comparing with <code>&gt; &lt; &gt;= &lt;= == !=</code> gives <code>true</code> or <code>false</code>. Equal is <code>==</code> (two signs), not equal is <code>!=</code>.'),
        code: main('int price = 35000;\nSystem.out.println(price >= 30000);\nSystem.out.println(price == 30000);\nSystem.out.println(price != 30000);'),
      },
      {
        title: t('그리고 <code>&&</code>, 또는 <code>||</code>, 아니다 <code>!</code>', 'and <code>&&</code>, or <code>||</code>, not <code>!</code>'),
        body: t('<code>&&</code> 는 둘 다 참일 때만 참, <code>||</code> 는 하나만 참이어도 참, <code>!</code> 는 반대로 바꿔요.', '<code>&&</code> is true only when both are true, <code>||</code> is true when either is, and <code>!</code> flips it.'),
        code: main('boolean fragile = true;\nboolean heavy = false;\nSystem.out.println(fragile && heavy);\nSystem.out.println(fragile || heavy);\nSystem.out.println(!heavy);'),
      },
    ],
    predict: { prompt: t('이 코드를 실행하면 어떻게 찍힐까요?', 'What will this code print?'), code: main('System.out.println(5 > 3 && 2 > 4);'), choices: ['false', 'true', '5', t('에러', 'Error')], answer: 0, explain: t('5 > 3 은 true, 2 > 4 는 false. && 는 둘 다 true 여야 해서 false.', '5 > 3 is true, 2 > 4 is false. && needs both, so false.') },
    fill: {
      prompt: t('3만 원 이상이면 무료 배송, 깨지거나 무거우면 뽁뽁이 포장이에요.', 'Free shipping from 30,000 won; bubble wrap if fragile or heavy.'),
      code: main(`int price = 35000;\nboolean fragile = false;\nboolean heavy = true;\nSystem.out.println("${t('무료 배송', 'Free shipping')}: " + (price {{0}} 30000));\nSystem.out.println("${t('뽁뽁이', 'Bubble wrap')}: " + (fragile {{1}} heavy));`),
      blanks: [{ size: 3 }, { size: 3 }], expected: t('무료 배송: true\n뽁뽁이: true', 'Free shipping: true\nBubble wrap: true'),
      hints: [t('"이상"은 같은 것도 포함해요. "또는"은 하나만 참이어도 돼요.', '"From" includes equal. "Or" needs just one to be true.'), '>=, ||'], solution: ['>=', '||'],
    },
    write: {
      prompt: t('주문 금액 <code>total</code> 이 28000원이고 쿠폰 <code>hasCoupon</code> 이 있어요(true). 2만 원 이상이면서 쿠폰이 있으면 할인이에요. 할인 여부를 찍어 주세요.', 'The order <code>total</code> is 28000 won and <code>hasCoupon</code> is true. A discount applies if the total is 20000 or more AND there is a coupon. Print whether it applies.'),
      starter: main(W), expected: t('할인 가능: true', 'Discount: true'),
      mustInclude: [{ re: '&&', msg: t('두 조건을 <code>&&</code> 로 합쳐 주세요.', 'Combine the two conditions with <code>&&</code>.') }, { re: 'boolean\\s+hasCoupon', msg: t('<code>boolean hasCoupon</code> 변수를 만들어 주세요.', 'Make a <code>boolean hasCoupon</code> variable.') }],
      hints: ['total >= 20000 && hasCoupon', t('System.out.println("할인 가능: " + (total >= 20000 && hasCoupon));', 'System.out.println("Discount: " + (total >= 20000 && hasCoupon));')],
      solution: main(`int total = 28000;\nboolean hasCoupon = true;\nSystem.out.println("${t('할인 가능: ', 'Discount: ')}" + (total >= 20000 && hasCoupon));`),
    },
    learned: [t('비교 결과는 <code>true</code>/<code>false</code>', 'Comparisons give <code>true</code>/<code>false</code>'), t('같다 <code>==</code>, 다르다 <code>!=</code>', 'equal <code>==</code>, not equal <code>!=</code>'), t('<code>&&</code> 그리고, <code>||</code> 또는, <code>!</code> 반대', '<code>&&</code> and, <code>||</code> or, <code>!</code> not')],
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
        code: main(`int stock = 3;\nint order = 5;\nif (stock >= order) {\n    System.out.println("${t('피킹 가능', 'Ready to pick')}");\n} else {\n    System.out.println("${t('재고 부족', 'Not enough stock')}");\n}`),
      },
      {
        title: t('여러 갈래 <code>else if</code>', 'Many branches <code>else if</code>'),
        body: t('조건을 위에서부터 차례로 보고, <b>처음 맞는 것 하나만</b> 실행해요.', 'Conditions are checked from the top, and <b>only the first match</b> runs.'),
        code: main(`int weight = 7;\nif (weight < 2) {\n    System.out.println("${t('소형', 'Small')}");\n} else if (weight < 10) {\n    System.out.println("${t('중형', 'Medium')}");\n} else {\n    System.out.println("${t('대형', 'Large')}");\n}`),
      },
    ],
    predict: { prompt: t('이 코드를 실행하면 어떻게 찍힐까요?', 'What will this code print?'), code: main('int n = 15;\nif (n > 10) {\n    System.out.println("A");\n} else if (n > 5) {\n    System.out.println("B");\n} else {\n    System.out.println("C");\n}'), choices: ['A', 'B', 'A\nB', 'C'], answer: 0, explain: t('15 > 10 이 먼저 맞아서 A 만 찍고 끝나요. 아래 조건은 보지 않아요.', '15 > 10 matches first, so only A prints. The rest are skipped.') },
    fill: {
      prompt: t('재고가 주문 수량 이상이면 "피킹 가능", 아니면 "재고 부족"이 찍히게 하세요.', 'Print "Ready to pick" if stock covers the order, otherwise "Not enough stock".'),
      code: main(`int stock = 8;\nint order = 5;\n{{0}} (stock >= order) {\n    System.out.println("${t('피킹 가능', 'Ready to pick')}");\n} {{1}} {\n    System.out.println("${t('재고 부족', 'Not enough stock')}");\n}`),
      blanks: [{ size: 3 }, { size: 5 }], expected: t('피킹 가능', 'Ready to pick'),
      hints: [t('"만약"과 "아니면"에 해당하는 단어예요.', 'The words for "if" and "otherwise".'), 'if, else'], solution: ['if', 'else'],
    },
    write: {
      prompt: t('랙 번호 <code>rack</code> 이 12예요. 10 이하는 "A구역", 20 이하는 "B구역", 그 외는 "C구역"을 찍어 주세요.', 'The <code>rack</code> number is 12. Print "Zone A" for 10 or less, "Zone B" for 20 or less, otherwise "Zone C".'),
      starter: main(W), expected: t('B구역', 'Zone B'),
      mustInclude: [{ re: 'else\\s+if', msg: t('<code>else if</code> 를 써 주세요.', 'Use <code>else if</code>.') }],
      hints: [t('if (rack <= 10) … else if (rack <= 20) … else …', 'if (rack <= 10) … else if (rack <= 20) … else …'), t('위 순서대로 세 갈래를 만들면 12 는 두 번째에 걸려요.', 'Make three branches in that order; 12 lands in the second.')],
      solution: main(`int rack = 12;\nif (rack <= 10) {\n    System.out.println("${t('A구역', 'Zone A')}");\n} else if (rack <= 20) {\n    System.out.println("${t('B구역', 'Zone B')}");\n} else {\n    System.out.println("${t('C구역', 'Zone C')}");\n}`),
    },
    learned: [t('<code>if (조건) { }</code> → 참일 때만', '<code>if (condition) { }</code> → only when true'), t('<code>else</code> → 아닐 때', '<code>else</code> → otherwise'), t('<code>else if</code> → 처음 맞는 하나만', '<code>else if</code> → only the first match')],
  },
  {
    id: 'pick-string-cond', stage: 'picking', npc: 'jung',
    title: t('구역 이름으로 고르기', 'Pick by zone name'),
    request: [t('이번엔 구역 이름이 글자로 와요. "A" 구역이면서 수량이 있을 때만 피킹이에요.', 'This time the zone comes as text. We pick only from zone "A" and only if there\'s quantity.'), t('글자 비교는 조심해야 한다던데요?', 'I heard comparing text is tricky?')],
    thanks: t('equals 라는 게 있었군요. 배웠어요!', 'So that\'s what equals is for. Learned something!'),
    concepts: [
      {
        title: t('문자열 비교는 <code>equals</code>', 'Compare strings with <code>equals</code>'),
        body: t('문자열이 같은지는 <code>==</code> 가 아니라 <code>a.equals(b)</code> 로 비교해요. <code>==</code> 는 "같은 물건인지"를 봐서 글자가 같아도 false 가 나올 수 있어요.', 'Check whether strings match with <code>a.equals(b)</code>, not <code>==</code>. <code>==</code> checks "the same object", so it can be false even when the text matches.'),
        code: main('String zone = "A";\nSystem.out.println(zone.equals("A"));\nSystem.out.println(zone.equals("B"));\nSystem.out.println("a".equalsIgnoreCase("A"));'),
      },
      {
        title: t('조건 합치기', 'Combining conditions'),
        body: t('<code>if</code> 안에서도 <code>&&</code>, <code>||</code> 로 조건을 합칠 수 있어요.', 'You can combine conditions with <code>&&</code> and <code>||</code> inside an <code>if</code>.'),
        code: main(`String zone = "A";\nint qty = 0;\nif (zone.equals("A") && qty > 0) {\n    System.out.println("${t('피킹', 'Pick')}");\n} else {\n    System.out.println("${t('건너뛰기', 'Skip')}");\n}`),
      },
    ],
    predict: { prompt: t('이 코드를 실행하면 어떻게 찍힐까요?', 'What will this code print?'), code: main('String c = "B";\nif (c.equals("A") || c.equals("B")) {\n    System.out.println("OK");\n} else {\n    System.out.println("NO");\n}'), choices: ['OK', 'NO', 'OK\nNO', t('에러', 'Error')], answer: 0, explain: t('c 는 "B" 라서 두 번째 조건이 true. || 는 하나만 맞아도 돼요.', 'c is "B", so the second check is true. || needs just one.') },
    fill: {
      prompt: t('구역이 "A" 이고 수량이 0보다 크면 "A구역 피킹"이 찍히게 하세요.', 'Print "Picking zone A" when the zone is "A" and quantity is above 0.'),
      code: main(`String zone = "A";\nint qty = 4;\nif (zone.{{0}}("A") {{1}} qty > 0) {\n    System.out.println("${t('A구역 피킹', 'Picking zone A')}");\n}`),
      blanks: [{ size: 6 }, { size: 3 }], expected: t('A구역 피킹', 'Picking zone A'),
      hints: [t('문자열 비교 메서드와 "그리고" 기호예요.', 'The string compare method and the "and" symbol.'), 'equals, &&'], solution: ['equals', '&&'],
    },
    write: {
      prompt: t('택배사 <code>courier</code> 가 "번개택배"이고 무게 <code>weight</code> 가 12예요. 번개택배이면서 10kg 넘으면 "추가 요금", 아니면 "기본 요금"을 찍어 주세요.', 'The <code>courier</code> is "Lightning" and <code>weight</code> is 12. Print "Extra fee" if it\'s Lightning and over 10kg, otherwise "Base fee".'),
      starter: main(W), expected: t('추가 요금', 'Extra fee'),
      mustInclude: [{ re: '\\.equals\\s*\\(', msg: t('문자열은 <code>equals</code> 로 비교해 주세요.', 'Compare strings with <code>equals</code>.') }],
      hints: [t('courier.equals("번개택배") && weight > 10', 'courier.equals("Lightning") && weight > 10'), t('if 와 else 로 두 갈래를 만들어요.', 'Make two branches with if and else.')],
      solution: main(`String courier = "${t('번개택배', 'Lightning')}";\nint weight = 12;\nif (courier.equals("${t('번개택배', 'Lightning')}") && weight > 10) {\n    System.out.println("${t('추가 요금', 'Extra fee')}");\n} else {\n    System.out.println("${t('기본 요금', 'Base fee')}");\n}`),
    },
    learned: [t('문자열 비교: <code>a.equals(b)</code>', 'String compare: <code>a.equals(b)</code>'), t('대소문자 무시: <code>equalsIgnoreCase</code>', 'Ignore case: <code>equalsIgnoreCase</code>'), t('<code>if</code> 안에서 <code>&&</code> <code>||</code>', '<code>&&</code> <code>||</code> inside <code>if</code>')],
  },
  {
    id: 'pick-switch', stage: 'picking', npc: 'jung',
    title: t('구역 코드로 층 안내하기', 'Floor guide by zone code'),
    request: [t('구역 코드마다 몇 층인지 안내해야 해요.', 'We need to tell people which floor each zone code is on.'), t('if 를 길게 늘어놓기보다 깔끔한 방법이 있대요!', 'There\'s apparently a cleaner way than a long chain of ifs!')],
    thanks: t('switch 로 쓰니까 표처럼 보이네요!', 'With switch it reads like a table!'),
    concepts: [
      {
        title: t('<code>switch</code>', '<code>switch</code>'),
        body: t('값 하나를 여러 경우와 비교할 때 써요. 맞는 <code>case</code> 부터 실행하고, <code>break</code> 에서 멈춰요. 맞는 게 없으면 <code>default</code>.', 'Use it to compare one value against many cases. It runs from the matching <code>case</code> and stops at <code>break</code>. If nothing matches, <code>default</code> runs.'),
        code: main(`String zone = "B";\nswitch (zone) {\n    case "A":\n        System.out.println("${t('1층', '1st floor')}");\n        break;\n    case "B":\n        System.out.println("${t('2층', '2nd floor')}");\n        break;\n    default:\n        System.out.println("${t('모르는 구역', 'Unknown zone')}");\n}`),
      },
      {
        title: t('<code>break</code> 를 빼면?', 'What if you leave out <code>break</code>?'),
        body: t('<code>break</code> 가 없으면 아래 case 까지 이어서 실행돼요. 실수하기 쉬운 부분이에요.', 'Without <code>break</code>, it keeps running into the next cases. An easy mistake.'),
        code: main('int n = 1;\nswitch (n) {\n    case 1:\n        System.out.println("one");\n    case 2:\n        System.out.println("two");\n        break;\n    case 3:\n        System.out.println("three");\n}'),
      },
    ],
    predict: { prompt: t('이 코드를 실행하면 어떻게 찍힐까요?', 'What will this code print?'), code: main('int day = 3;\nswitch (day) {\n    case 1:\n        System.out.println("Mon");\n        break;\n    case 3:\n        System.out.println("Wed");\n        break;\n    default:\n        System.out.println("?");\n}'), choices: ['Wed', 'Mon', '?', 'Wed\n?'], answer: 0, explain: t('day 가 3 이라 case 3 을 실행하고 break 에서 멈춰요.', 'day is 3, so case 3 runs and break stops it.') },
    fill: {
      prompt: t('구역 코드가 "C" 일 때 "3층"이 찍히게 빈칸을 채우세요.', 'Fill in the blanks so zone "C" prints "3rd floor".'),
      code: main(`String zone = "C";\n{{0}} (zone) {\n    case "A":\n        System.out.println("${t('1층', '1st floor')}");\n        break;\n    {{1}} "C":\n        System.out.println("${t('3층', '3rd floor')}");\n        break;\n}`),
      blanks: [{ size: 6 }, { size: 4 }], expected: t('3층', '3rd floor'),
      hints: [t('값을 여러 경우와 비교하는 문장과, 각 경우 앞에 붙는 단어예요.', 'The statement that compares against cases, and the word before each case.'), 'switch, case'], solution: ['switch', 'case'],
    },
    write: {
      prompt: t('등급 <code>grade</code> 가 \'B\' 예요(char). A 는 "특급 배송", B 는 "일반 배송", 그 외는 "확인 필요"를 switch 로 찍어 주세요.', 'The <code>grade</code> is \'B\' (char). Use switch: A → "Express", B → "Standard", anything else → "Check needed".'),
      starter: main(W), expected: t('일반 배송', 'Standard'),
      mustInclude: [{ re: 'switch\\s*\\(', msg: t('<code>switch</code> 를 써 주세요.', 'Use <code>switch</code>.') }, { re: 'break', msg: t('각 case 끝에 <code>break</code> 를 잊지 마세요.', 'Don\'t forget <code>break</code> after each case.') }],
      hints: [t("char grade = 'B'; switch (grade) { case 'A': … break; case 'B': … break; default: … }", "char grade = 'B'; switch (grade) { case 'A': … break; case 'B': … break; default: … }"), t("char 는 작은따옴표 'A' 로 비교해요.", "Compare a char with single quotes, like 'A'.")],
      solution: main(`char grade = 'B';\nswitch (grade) {\n    case 'A':\n        System.out.println("${t('특급 배송', 'Express')}");\n        break;\n    case 'B':\n        System.out.println("${t('일반 배송', 'Standard')}");\n        break;\n    default:\n        System.out.println("${t('확인 필요', 'Check needed')}");\n}`),
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
        code: main(`for (int i = 1; i <= 3; i++) {\n    System.out.println("${t('박스', 'Box')} " + i);\n}`),
      },
      {
        title: t('반복하면서 더하기 (누적)', 'Adding up in a loop'),
        body: t('반복문 밖에 합계 변수를 0 으로 만들고, 안에서 계속 더해요.', 'Make a total variable set to 0 outside the loop, then keep adding to it inside.'),
        code: main(`int sum = 0;\nfor (int i = 1; i <= 4; i++) {\n    sum += i;\n}\nSystem.out.println(sum);`),
      },
    ],
    predict: { prompt: t('이 코드를 실행하면 어떻게 찍힐까요?', 'What will this code print?'), code: main('for (int i = 0; i < 3; i++) {\n    System.out.println(i);\n}'), choices: ['0\n1\n2', '1\n2\n3', '0\n1\n2\n3', '3'], answer: 0, explain: t('i 는 0 에서 시작하고, i < 3 이라 2 까지만 돌아요.', 'i starts at 0 and i < 3 stops after 2.') },
    fill: {
      prompt: t('"박스 1" 부터 "박스 3" 까지 찍히게 빈칸을 채우세요.', 'Fill in the blanks to print "Box 1" through "Box 3".'),
      code: main(`for (int i = 1; i <= {{0}}; {{1}}) {\n    System.out.println("${t('박스', 'Box')} " + i);\n}`),
      blanks: [{ size: 2 }, { size: 4 }], expected: t('박스 1\n박스 2\n박스 3', 'Box 1\nBox 2\nBox 3'),
      hints: [t('3까지 돌고, 한 번 돌 때마다 1 씩 늘어나요.', 'Go up to 3, adding 1 each round.'), '3, i++'], solution: ['3', 'i++'],
    },
    write: {
      prompt: t('1번 박스엔 테이프 1m, 2번엔 2m … 5번엔 5m 를 써요. for 로 다 더해서 찍어 주세요.', 'Box 1 uses 1m of tape, box 2 uses 2m … box 5 uses 5m. Add them up with a for loop and print it.'),
      starter: main(W), expected: t('총 테이프: 15m', 'Total tape: 15m'),
      mustInclude: [{ re: 'for\\s*\\(', msg: t('<code>for</code> 반복문을 써 주세요.', 'Use a <code>for</code> loop.') }],
      hints: [t('int sum = 0; for (int i = 1; i <= 5; i++) { sum += i; }', 'int sum = 0; for (int i = 1; i <= 5; i++) { sum += i; }'), t('System.out.println("총 테이프: " + sum + "m");', 'System.out.println("Total tape: " + sum + "m");')],
      solution: main(`int sum = 0;\nfor (int i = 1; i <= 5; i++) {\n    sum += i;\n}\nSystem.out.println("${t('총 테이프: ', 'Total tape: ')}" + sum + "m");`),
    },
    learned: ['<code>for (int i = 1; i <= n; i++)</code>', t('<code>i < 3</code> 은 3 을 빼고', '<code>i < 3</code> stops before 3'), t('합계는 밖에서 0, 안에서 <code>+=</code>', 'Total: 0 outside, <code>+=</code> inside')],
  },
  {
    id: 'pack-while', stage: 'packing', npc: 'song',
    title: t('테이프 다 쓸 때까지 포장하기', 'Pack until the tape runs out'),
    request: [t('테이프 한 롤로 박스를 몇 개나 쌀 수 있는지 궁금해요.', 'I wonder how many boxes one roll of tape can wrap.'), t('몇 번 반복할지 모를 때는 어떻게 해요?', 'What do you do when you don\'t know how many times to repeat?')],
    thanks: t('while 이면 끝날 때까지 알아서 도네요!', 'So while just keeps going until it\'s done!'),
    concepts: [
      {
        title: t('<code>while</code>', '<code>while</code>'),
        body: t('<code>while (조건)</code> 은 조건이 참인 동안 계속 반복해요. 안에서 조건이 언젠가 거짓이 되게 해야 끝나요.', '<code>while (condition)</code> repeats as long as the condition is true. Something inside must make it false, or it never ends.'),
        code: main(`int tape = 10;\nint count = 0;\nwhile (tape >= 3) {\n    tape -= 3;\n    count++;\n}\nSystem.out.println(count + ", " + tape);`),
      },
      {
        title: t('<code>break</code> 와 <code>continue</code>', '<code>break</code> and <code>continue</code>'),
        body: t('<code>break</code> 는 반복을 바로 끝내고, <code>continue</code> 는 이번 차례만 건너뛰고 다음으로 가요.', '<code>break</code> ends the loop right away; <code>continue</code> skips just this round.'),
        code: main('for (int i = 1; i <= 6; i++) {\n    if (i == 3) continue;\n    if (i == 5) break;\n    System.out.println(i);\n}'),
      },
    ],
    predict: { prompt: t('이 코드를 실행하면 어떻게 찍힐까요?', 'What will this code print?'), code: main('int n = 1;\nwhile (n < 10) {\n    n *= 2;\n}\nSystem.out.println(n);'), choices: ['16', '8', '10', '2'], answer: 0, explain: t('1 → 2 → 4 → 8 → 16. 16 이 되면 n < 10 이 거짓이라 멈춰요.', '1 → 2 → 4 → 8 → 16. At 16, n < 10 is false, so it stops.') },
    fill: {
      prompt: t('테이프 10m, 박스 하나에 3m 씩 써요. 포장한 박스와 남은 테이프를 찍게 하세요.', '10m of tape, 3m per box. Print the boxes packed and the tape left.'),
      code: main(`int tape = 10;\nint count = 0;\n{{0}} (tape >= 3) {\n    tape -= 3;\n    count{{1}};\n}\nSystem.out.println("${t('포장한 박스', 'Boxes packed')}: " + count);\nSystem.out.println("${t('남은 테이프', 'Tape left')}: " + tape + "m");`),
      blanks: [{ size: 5 }, { size: 2 }], expected: t('포장한 박스: 3\n남은 테이프: 1m', 'Boxes packed: 3\nTape left: 1m'),
      hints: [t('조건이 참인 동안 반복하는 단어, 그리고 1 더하기 기호예요.', 'The word that repeats while true, and the add-one symbol.'), 'while, ++'], solution: ['while', '++'],
    },
    write: {
      prompt: t('박스 1번부터 10번 중 <b>짝수 번호만</b> 한 줄씩 찍어 주세요. 홀수는 <code>continue</code> 로 건너뛰어요.', 'Print only the <b>even</b> box numbers from 1 to 10, one per line. Skip odd ones with <code>continue</code>.'),
      starter: main(W), expected: '2\n4\n6\n8\n10',
      mustInclude: [{ re: 'continue', msg: t('<code>continue</code> 를 써서 홀수를 건너뛰어 주세요.', 'Skip the odd numbers with <code>continue</code>.') }],
      hints: [t('i % 2 != 0 이면 홀수예요.', 'If i % 2 != 0, it\'s odd.'), 'for (int i = 1; i <= 10; i++) { if (i % 2 != 0) continue; System.out.println(i); }'],
      solution: main('for (int i = 1; i <= 10; i++) {\n    if (i % 2 != 0) continue;\n    System.out.println(i);\n}'),
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
        code: main(`for (int floor = 1; floor <= 2; floor++) {\n    for (int n = 1; n <= 3; n++) {\n        System.out.println(floor + "${t('층', 'F')}-" + n);\n    }\n}`),
      },
      {
        title: t('한 줄에 이어 찍기', 'Printing on one line'),
        body: t('<code>print</code> 로 한 줄에 이어 찍고, 줄 끝에서 <code>println()</code> 으로 줄을 바꿔요.', 'Use <code>print</code> to stay on one line, then <code>println()</code> at the end to move on.'),
        code: main('for (int row = 1; row <= 3; row++) {\n    for (int col = 1; col <= 4; col++) {\n        System.out.print("■");\n    }\n    System.out.println();\n}'),
      },
    ],
    predict: { prompt: t('이 코드를 실행하면 어떻게 찍힐까요?', 'What will this code print?'), code: main('int stars = 0;\nfor (int i = 0; i < 3; i++) {\n    for (int j = 0; j < 2; j++) {\n        stars++;\n    }\n}\nSystem.out.println(stars);'), choices: ['6', '5', '3', '2'], answer: 0, explain: t('바깥 3번 × 안쪽 2번 = 6번.', 'Outer 3 times × inner 2 times = 6.') },
    fill: {
      prompt: t('2층, 층마다 3개씩 박스 모양이 찍히게 하세요.', 'Print 2 layers of 3 boxes each.'),
      code: main('for (int row = 1; row <= 2; row++) {\n    for (int col = 1; col <= {{0}}; col++) {\n        System.out.{{1}}("■");\n    }\n    System.out.println();\n}'),
      blanks: [{ size: 2 }, { size: 6 }], expected: '■■■\n■■■',
      hints: [t('한 줄에 3개, 줄을 바꾸지 않고 이어 찍어요.', '3 per line, printed without a line break.'), '3, print'], solution: ['3', 'print'],
    },
    write: {
      prompt: t('3층 팔레트에 층마다 4개씩 있어요. 층별로 "1층: ■■■■" 처럼 찍어 주세요.', 'A 3-layer pallet with 4 boxes per layer. Print each layer like "Layer 1: ■■■■".'),
      starter: main(W), expected: t('1층: ■■■■\n2층: ■■■■\n3층: ■■■■', 'Layer 1: ■■■■\nLayer 2: ■■■■\nLayer 3: ■■■■'),
      mustInclude: [{ re: 'for[\\s\\S]*for', msg: t('반복문 안에 반복문을 넣어 주세요.', 'Put a loop inside a loop.') }],
      hints: [t('바깥: 층 1~3, 줄 시작에 print(층 + "층: "). 안쪽: print("■") 4번.', 'Outer: layers 1–3, start each line with print("Layer " + layer + ": "). Inner: print("■") 4 times.'), t('안쪽 반복이 끝나면 System.out.println(); 으로 줄을 바꿔요.', 'After the inner loop, move to a new line with System.out.println();')],
      solution: main(`for (int floor = 1; floor <= 3; floor++) {\n    System.out.print(${t('floor + "층: "', '"Layer " + floor + ": "')});\n    for (int n = 1; n <= 4; n++) {\n        System.out.print("■");\n    }\n    System.out.println();\n}`),
    },
    learned: [t('바깥 한 번에 안쪽은 끝까지', 'Inner loop runs fully each outer round'), t('<code>print</code> 이어 찍기, <code>println()</code> 줄 바꾸기', '<code>print</code> stays, <code>println()</code> breaks the line'), t('횟수 = 바깥 × 안쪽', 'Count = outer × inner')],
  },

  // ───────────── 출고장 · 오팀원 · 배열과 리스트 ─────────────
  {
    id: 'ship-array', stage: 'shipping', npc: 'oh',
    title: t('택배사 목록 만들기', 'List the couriers'),
    request: [t('김사원님, 출고는 택배사별로 나눠요. 택배사가 여러 개라 변수를 하나씩 만들기 힘들어요.', 'Kim, we sort shipments by courier. There are several, so one variable each gets messy.'), t('한 번에 묶어서 담는 방법이 있나요?', 'Is there a way to keep them together?')],
    thanks: t('배열에 담으니까 정리가 쉽네요!', 'Keeping them in an array makes it so tidy!'),
    concepts: [
      {
        title: t('배열 만들기와 번호(인덱스)', 'Arrays and index numbers'),
        body: t('<code>타입[] 이름 = {값, 값, …};</code> 으로 여러 값을 한 번에 담아요. 꺼낼 때는 <code>이름[번호]</code>, 번호는 <b>0 부터</b> 시작해요. 개수는 <code>.length</code>.', '<code>type[] name = {value, value, …};</code> holds many values at once. Get one with <code>name[index]</code>; indexes start at <b>0</b>. The count is <code>.length</code>.'),
        code: main(`String[] couriers = {"${t('번개택배', 'Lightning')}", "${t('하늘택배', 'Sky')}", "${t('바다택배', 'Ocean')}"};\nSystem.out.println(couriers[0]);\nSystem.out.println(couriers[2]);\nSystem.out.println(couriers.length);`),
      },
      {
        title: t('반복문으로 하나씩 보기', 'Going through with a loop'),
        body: t('<code>for (int i = 0; i &lt; 배열.length; i++)</code> 로 돌거나, 값만 필요하면 <code>for (타입 x : 배열)</code> 로 더 짧게 써요.', 'Loop with <code>for (int i = 0; i &lt; arr.length; i++)</code>, or if you only need the values, use the shorter <code>for (type x : arr)</code>.'),
        code: main('int[] boxes = {12, 7, 9};\nfor (int i = 0; i < boxes.length; i++) {\n    System.out.println(i + ": " + boxes[i]);\n}\nfor (int b : boxes) {\n    System.out.println(b);\n}'),
      },
    ],
    predict: { prompt: t('이 코드를 실행하면 어떻게 찍힐까요?', 'What will this code print?'), code: main('int[] a = {3, 5, 7};\nSystem.out.println(a[1]);'), choices: ['5', '3', '7', t('에러', 'Error')], answer: 0, explain: t('번호는 0 부터라 a[0]=3, a[1]=5.', 'Indexes start at 0, so a[0]=3 and a[1]=5.') },
    fill: {
      prompt: t('두 번째 택배사와 택배사 수가 찍히게 하세요.', 'Print the second courier and the number of couriers.'),
      code: main(`String[] couriers = {"${t('번개택배', 'Lightning')}", "${t('하늘택배', 'Sky')}", "${t('바다택배', 'Ocean')}"};\nSystem.out.println(couriers[{{0}}]);\nSystem.out.println("${t('택배사 수', 'Couriers')}: " + couriers.{{1}});`),
      blanks: [{ size: 2 }, { size: 7 }], expected: t('하늘택배\n택배사 수: 3', 'Sky\nCouriers: 3'),
      hints: [t('두 번째는 번호 1 이에요. 개수는 배열 뒤에 붙는 단어예요.', 'The second one is index 1. The count is a word after the array.'), '1, length'], solution: ['1', 'length'],
    },
    write: {
      prompt: t('택배사별 출고 박스가 <code>{12, 7, 9}</code> 예요. 배열 <code>boxes</code> 에 담고 반복문으로 다 더해서 찍어 주세요.', 'Boxes per courier are <code>{12, 7, 9}</code>. Put them in an array <code>boxes</code> and add them up with a loop.'),
      starter: main(W), expected: t('총 출고 박스: 28개', 'Total boxes shipped: 28'),
      mustInclude: [{ re: 'int\\s*\\[\\s*\\]\\s*boxes', msg: t('<code>int[] boxes</code> 배열을 만들어 주세요.', 'Make an <code>int[] boxes</code> array.') }, { re: 'for\\s*\\(', msg: t('반복문으로 더해 주세요.', 'Add them with a loop.') }],
      hints: ['int total = 0; for (int b : boxes) { total += b; }', t('System.out.println("총 출고 박스: " + total + "개");', 'System.out.println("Total boxes shipped: " + total);')],
      solution: main(`int[] boxes = {12, 7, 9};\nint total = 0;\nfor (int b : boxes) {\n    total += b;\n}\nSystem.out.println("${t('총 출고 박스: ', 'Total boxes shipped: ')}" + total${t(' + "개"', '')});`),
    },
    learned: [t('<code>int[] a = {1, 2, 3};</code>', '<code>int[] a = {1, 2, 3};</code>'), t('번호는 0 부터: <code>a[0]</code>', 'Indexes start at 0: <code>a[0]</code>'), t('개수 <code>a.length</code>, 돌기 <code>for (int x : a)</code>', 'Count <code>a.length</code>, loop <code>for (int x : a)</code>')],
  },
  {
    id: 'ship-array-search', stage: 'shipping', npc: 'oh',
    title: t('제일 무거운 박스 찾기', 'Find the heaviest box'),
    request: [t('트럭에 실을 때 무거운 박스부터 알아야 해요.', 'When loading the truck, we need to know the heavy boxes.'), t('제일 무거운 것, 기준 넘는 것 개수… 찾아 줄래요?', 'The heaviest one, how many are over the limit… could you find them?')],
    thanks: t('이제 무거운 박스 걱정 끝!', 'No more worrying about heavy boxes!'),
    concepts: [
      {
        title: t('값 바꾸기', 'Changing a value'),
        body: t('<code>배열[번호] = 새 값;</code> 으로 그 칸의 값을 바꿔요.', '<code>arr[index] = newValue;</code> changes that slot.'),
        code: main('int[] w = {4, 9, 2};\nw[2] = 6;\nSystem.out.println(w[0] + ", " + w[1] + ", " + w[2]);'),
      },
      {
        title: t('최댓값 찾기, 개수 세기', 'Finding the max, counting'),
        body: t('첫 값을 최댓값으로 두고, 더 큰 값이 나오면 바꿔요. 개수는 조건이 맞을 때마다 1 씩 더해요.', 'Start with the first value as the max and replace it whenever a bigger one shows up. To count, add 1 each time the condition matches.'),
        code: main('int[] w = {4, 9, 2, 7};\nint max = w[0];\nint over5 = 0;\nfor (int x : w) {\n    if (x > max) max = x;\n    if (x > 5) over5++;\n}\nSystem.out.println(max);\nSystem.out.println(over5);'),
      },
    ],
    predict: { prompt: t('이 코드를 실행하면 어떻게 찍힐까요?', 'What will this code print?'), code: main('int[] a = {2, 8, 5};\na[0] = a[1] + 1;\nSystem.out.println(a[0]);'), choices: ['9', '3', '8', '2'], answer: 0, explain: t('a[1] 은 8, 거기에 1 을 더한 9 가 a[0] 에 들어가요.', 'a[1] is 8, plus 1 makes 9, which goes into a[0].') },
    fill: {
      prompt: t('가장 무거운 박스 무게가 찍히게 하세요.', 'Print the heaviest box weight.'),
      code: main(`int[] weights = {8, 15, 3, 11};\nint max = weights[0];\nfor (int w : weights) {\n    if (w {{0}} max) {\n        max = {{1}};\n    }\n}\nSystem.out.println("${t('최대 무게', 'Heaviest')}: " + max + "kg");`),
      blanks: [{ size: 2 }, { size: 2 }], expected: t('최대 무게: 15kg', 'Heaviest: 15kg'),
      hints: [t('지금 값이 최댓값보다 크면, 최댓값을 지금 값으로 바꿔요.', 'If the current value is bigger than max, set max to it.'), '>, w'], solution: ['>', 'w'],
    },
    write: {
      prompt: t('박스 무게가 <code>{8, 12, 15, 3, 11}</code> 이에요. 10kg 넘는 박스가 몇 개인지 세서 찍어 주세요.', 'Box weights are <code>{8, 12, 15, 3, 11}</code>. Count the boxes over 10kg and print it.'),
      starter: main(W), expected: t('10kg 넘는 박스: 3개', 'Boxes over 10kg: 3'),
      mustInclude: [{ re: 'for\\s*\\(', msg: t('반복문을 써 주세요.', 'Use a loop.') }, { re: 'if\\s*\\(', msg: t('<code>if</code> 로 조건을 확인해 주세요.', 'Check the condition with <code>if</code>.') }],
      hints: ['int count = 0; for (int w : weights) { if (w > 10) count++; }', t('System.out.println("10kg 넘는 박스: " + count + "개");', 'System.out.println("Boxes over 10kg: " + count);')],
      solution: main(`int[] weights = {8, 12, 15, 3, 11};\nint count = 0;\nfor (int w : weights) {\n    if (w > 10) count++;\n}\nSystem.out.println("${t('10kg 넘는 박스: ', 'Boxes over 10kg: ')}" + count${t(' + "개"', '')});`),
    },
    learned: [t('값 바꾸기 <code>a[i] = 값;</code>', 'Change a value <code>a[i] = value;</code>'), t('최댓값: 첫 값에서 시작해 더 크면 바꾸기', 'Max: start with the first, replace when bigger'), t('개수: 조건 맞으면 <code>count++</code>', 'Count: <code>count++</code> when it matches')],
  },
  {
    id: 'ship-list', stage: 'shipping', npc: 'oh',
    title: t('늘어나는 출고 목록', 'A growing shipping list'),
    request: [t('출고 목록은 하루 종일 늘었다 줄었다 해요.', 'The shipping list grows and shrinks all day.'), t('배열은 크기가 정해져 있다던데, 늘릴 수 있는 건 없어요?', 'I heard arrays have a fixed size. Is there something that can grow?')],
    thanks: t('ArrayList 최고! 이제 목록 관리가 편해요.', 'ArrayList is great! Managing the list is easy now.'),
    concepts: [
      {
        title: t('<code>ArrayList</code> 만들고 넣기', 'Making an <code>ArrayList</code> and adding'),
        body: t('<code>ArrayList&lt;String&gt; list = new ArrayList&lt;&gt;();</code> 로 만들고 <code>add</code> 로 넣어요. 개수는 <code>size()</code>, 꺼내기는 <code>get(번호)</code>. 맨 위에 <code>import java.util.*;</code> 가 필요해요.', 'Create it with <code>ArrayList&lt;String&gt; list = new ArrayList&lt;&gt;();</code> and add with <code>add</code>. Count with <code>size()</code>, get with <code>get(index)</code>. You need <code>import java.util.*;</code> at the top.'),
        code: main(`ArrayList<String> list = new ArrayList<>();\nlist.add("${t('토너', 'Toner')}");\nlist.add("${t('립밤', 'Lip balm')}");\nSystem.out.println(list.size());\nSystem.out.println(list.get(1));\nSystem.out.println(list);`, UTIL),
      },
      {
        title: t('빼기와 찾기', 'Removing and finding'),
        body: t('<code>remove(번호)</code> 로 빼고, <code>contains(값)</code> 으로 들어 있는지 봐요. 숫자를 담을 때는 <code>ArrayList&lt;Integer&gt;</code>.', 'Remove with <code>remove(index)</code>, check with <code>contains(value)</code>. For numbers use <code>ArrayList&lt;Integer&gt;</code>.'),
        code: main(`ArrayList<String> list = new ArrayList<>();\nlist.add("A");\nlist.add("B");\nlist.add("C");\nlist.remove(0);\nSystem.out.println(list);\nSystem.out.println(list.contains("C"));`, UTIL),
      },
    ],
    predict: { prompt: t('이 코드를 실행하면 어떻게 찍힐까요?', 'What will this code print?'), code: main('ArrayList<Integer> a = new ArrayList<>();\na.add(5);\na.add(8);\na.add(2);\na.remove(1);\nSystem.out.println(a);', UTIL), choices: ['[5, 2]', '[8, 2]', '[5, 8]', '[2]'], answer: 0, explain: t('remove(1) 은 번호 1 (두 번째 값 8) 을 빼요.', 'remove(1) removes index 1, the second value (8).') },
    fill: {
      prompt: t('목록에 상품 두 개를 넣고 개수를 찍게 하세요.', 'Add two products to the list and print the count.'),
      code: main(`ArrayList<String> list = new ArrayList<>();\nlist.{{0}}("${t('선크림', 'Sunscreen')}");\nlist.add("${t('쿠션', 'Cushion')}");\nSystem.out.println("${t('출고 대기', 'Waiting')}: " + list.{{1}}());`, UTIL),
      blanks: [{ size: 4 }, { size: 5 }], expected: t('출고 대기: 2', 'Waiting: 2'),
      hints: [t('넣기와 개수를 구하는 메서드예요.', 'The methods for adding and counting.'), 'add, size'], solution: ['add', 'size'],
    },
    write: {
      prompt: t('<code>ArrayList&lt;String&gt; orders</code> 에 "토너", "립밤", "선크림" 을 넣고, 첫 번째("토너")는 출고됐으니 빼 주세요. 남은 목록과 개수를 찍어 주세요.', 'Add "Toner", "Lip balm", "Sunscreen" to <code>ArrayList&lt;String&gt; orders</code>. The first one ("Toner") has shipped, so remove it. Print what\'s left and the count.'),
      starter: UTIL + main(W), expected: t('[립밤, 선크림]\n남은 주문: 2', '[Lip balm, Sunscreen]\nOrders left: 2'),
      mustInclude: [{ re: 'ArrayList', msg: t('<code>ArrayList</code> 를 써 주세요.', 'Use an <code>ArrayList</code>.') }, { re: '\\.remove\\s*\\(', msg: t('<code>remove</code> 로 빼 주세요.', 'Remove it with <code>remove</code>.') }],
      hints: ['orders.add(…) ×3, orders.remove(0);', t('System.out.println(orders); System.out.println("남은 주문: " + orders.size());', 'System.out.println(orders); System.out.println("Orders left: " + orders.size());')],
      solution: main(`ArrayList<String> orders = new ArrayList<>();\norders.add("${t('토너', 'Toner')}");\norders.add("${t('립밤', 'Lip balm')}");\norders.add("${t('선크림', 'Sunscreen')}");\norders.remove(0);\nSystem.out.println(orders);\nSystem.out.println("${t('남은 주문: ', 'Orders left: ')}" + orders.size());`, UTIL),
    },
    learned: ['<code>ArrayList&lt;String&gt; a = new ArrayList&lt;&gt;();</code>', '<code>add</code>, <code>get(i)</code>, <code>size()</code>', '<code>remove(i)</code>, <code>contains(x)</code>'],
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
        body: t('<code>s.length()</code> 는 글자 수, <code>s.charAt(번호)</code> 는 그 위치의 글자 하나예요. 번호는 0 부터.', '<code>s.length()</code> is the number of characters, <code>s.charAt(index)</code> is one character at that spot. Indexes start at 0.'),
        code: main('String code = "KR20261112";\nSystem.out.println(code.length());\nSystem.out.println(code.charAt(0));\nSystem.out.println(code.charAt(code.length() - 1));'),
      },
      {
        title: t('자르기와 대소문자', 'Cutting and case'),
        body: t('<code>substring(시작, 끝)</code> 은 시작부터 끝 <b>바로 앞</b>까지 잘라요. <code>toUpperCase()</code> 대문자, <code>toLowerCase()</code> 소문자, <code>trim()</code> 앞뒤 공백 지우기.', '<code>substring(start, end)</code> cuts from start up to <b>just before</b> end. <code>toUpperCase()</code>, <code>toLowerCase()</code>, and <code>trim()</code> removes spaces at both ends.'),
        code: main('String code = "  kr-778  ";\nString clean = code.trim().toUpperCase();\nSystem.out.println(clean);\nSystem.out.println(clean.substring(0, 2));\nSystem.out.println(clean.substring(3));'),
      },
    ],
    predict: { prompt: t('이 코드를 실행하면 어떻게 찍힐까요?', 'What will this code print?'), code: main('String s = "ABC123";\nSystem.out.println(s.substring(1, 4));'), choices: ['BC1', 'ABC', 'BC12', 'C12'], answer: 0, explain: t('번호 1 (B) 부터 4 바로 앞 (번호 3, 1) 까지라 BC1.', 'From index 1 (B) up to just before 4 (index 3, "1"), so BC1.') },
    fill: {
      prompt: t('송장 번호의 나라 코드와 길이를 찍게 하세요.', 'Print the country code and the length of the tracking number.'),
      code: main(`String tracking = "KR20261112";\nSystem.out.println("${t('국가', 'Country')}: " + tracking.{{0}}(0, 2));\nSystem.out.println("${t('길이', 'Length')}: " + tracking.{{1}}());`),
      blanks: [{ size: 9 }, { size: 6 }], expected: t('국가: KR\n길이: 10', 'Country: KR\nLength: 10'),
      hints: [t('잘라 내는 메서드와 글자 수를 세는 메서드예요.', 'The cutting method and the counting method.'), 'substring, length'], solution: ['substring', 'length'],
    },
    write: {
      prompt: t('기사님이 송장을 <code>"  kr-778  "</code> 처럼 받아 왔어요. 앞뒤 공백을 지우고 대문자로 바꿔서 찍어 주세요.', 'The driver got a label like <code>"  kr-778  "</code>. Remove the spaces at both ends, make it uppercase, and print it.'),
      starter: main(W), expected: t('송장: KR-778', 'Label: KR-778'),
      mustInclude: [{ re: 'trim\\s*\\(', msg: t('<code>trim()</code> 으로 공백을 지워 주세요.', 'Remove the spaces with <code>trim()</code>.') }, { re: 'toUpperCase\\s*\\(', msg: t('<code>toUpperCase()</code> 로 대문자로 바꿔 주세요.', 'Make it uppercase with <code>toUpperCase()</code>.') }],
      hints: ['String raw = "  kr-778  ";', t('System.out.println("송장: " + raw.trim().toUpperCase());', 'System.out.println("Label: " + raw.trim().toUpperCase());')],
      solution: main(`String raw = "  kr-778  ";\nSystem.out.println("${t('송장: ', 'Label: ')}" + raw.trim().toUpperCase());`),
    },
    learned: [t('<code>length()</code> 글자 수, <code>charAt(i)</code> 한 글자', '<code>length()</code> count, <code>charAt(i)</code> one char'), t('<code>substring(a, b)</code> → b 바로 앞까지', '<code>substring(a, b)</code> → up to just before b'), '<code>trim()</code>, <code>toUpperCase()</code>'],
  },
  {
    id: 'load-string-search', stage: 'loading', npc: 'yoon',
    title: t('배송 경로 나누기', 'Split the delivery route'),
    request: [t('배송 경로가 "부산-대구-광주" 처럼 한 줄로 와요.', 'Delivery routes come in one line, like "Busan-Daegu-Gwangju".'), t('도시별로 나누고, 주소에 특정 동네가 있는지도 봐야 해요.', 'I need them split by city, and to check whether an address has a certain area.')],
    thanks: t('경로가 한눈에 보이네요. 출발합니다~', 'Now I can see the whole route. Off I go!'),
    concepts: [
      {
        title: t('찾기와 바꾸기', 'Finding and replacing'),
        body: t('<code>contains(글자)</code> 는 들어 있는지(true/false), <code>indexOf(글자)</code> 는 몇 번째에 있는지(없으면 -1), <code>replace(옛것, 새것)</code> 는 바꾼 문자열을 줘요.', '<code>contains(text)</code> tells whether it\'s there (true/false), <code>indexOf(text)</code> where it is (-1 if not), and <code>replace(old, new)</code> gives a new string.'),
        code: main(`String addr = "${t('서울시 강남구 테헤란로', 'Teheran-ro, Gangnam, Seoul')}";\nSystem.out.println(addr.contains("${t('강남', 'Gangnam')}"));\nSystem.out.println(addr.indexOf("${t('강남', 'Gangnam')}"));\nSystem.out.println(addr.replace("${t('서울시', 'Seoul')}", "${t('서울특별시', 'Seoul City')}"));`),
      },
      {
        title: t('나누기 <code>split</code>', 'Splitting with <code>split</code>'),
        body: t('<code>split(기준)</code> 은 기준 글자로 잘라서 <b>문자열 배열</b>을 줘요.', '<code>split(separator)</code> cuts at the separator and gives a <b>String array</b>.'),
        code: main('String route = "A-B-C";\nString[] parts = route.split("-");\nSystem.out.println(parts.length);\nSystem.out.println(parts[1]);'),
      },
    ],
    predict: { prompt: t('이 코드를 실행하면 어떻게 찍힐까요?', 'What will this code print?'), code: main('String s = "a,b,c,d";\nSystem.out.println(s.split(",").length);'), choices: ['4', '3', '7', '1'], answer: 0, explain: t('쉼표로 나누면 a, b, c, d 네 조각이에요.', 'Splitting at commas gives four pieces: a, b, c, d.') },
    fill: {
      prompt: t('주소에 "강남"이 들어 있는지와, "-" 를 "/" 로 바꾼 경로를 찍게 하세요.', 'Print whether the address contains "Gangnam", and the route with "-" replaced by "/".'),
      code: main(`String addr = "${t('서울시 강남구', 'Gangnam, Seoul')}";\nString route = "A-B-C";\nSystem.out.println(addr.{{0}}("${t('강남', 'Gangnam')}"));\nSystem.out.println(route.{{1}}("-", "/"));`),
      blanks: [{ size: 8 }, { size: 7 }], expected: 'true\nA/B/C',
      hints: [t('들어 있는지 보는 메서드와 바꾸는 메서드예요.', 'The method that checks and the one that replaces.'), 'contains, replace'], solution: ['contains', 'replace'],
    },
    write: {
      prompt: t('경로 <code>"부산-대구-광주"</code> 를 "-" 로 나눠서 도시를 한 줄씩 찍어 주세요.', 'Split the route <code>"Busan-Daegu-Gwangju"</code> at "-" and print each city on its own line.'),
      starter: main(W), expected: t('부산\n대구\n광주', 'Busan\nDaegu\nGwangju'),
      mustInclude: [{ re: 'split\\s*\\(', msg: t('<code>split</code> 으로 나눠 주세요.', 'Split it with <code>split</code>.') }, { re: 'for\\s*\\(', msg: t('반복문으로 하나씩 찍어 주세요.', 'Print them one by one with a loop.') }],
      hints: [t('String[] cities = route.split("-");', 'String[] cities = route.split("-");'), 'for (String c : cities) { System.out.println(c); }'],
      solution: main(`String route = "${t('부산-대구-광주', 'Busan-Daegu-Gwangju')}";\nString[] cities = route.split("-");\nfor (String c : cities) {\n    System.out.println(c);\n}`),
    },
    learned: [t('<code>contains</code> 있나?, <code>indexOf</code> 어디?', '<code>contains</code> is it there?, <code>indexOf</code> where?'), t('<code>replace(옛것, 새것)</code>', '<code>replace(old, new)</code>'), t('<code>split("-")</code> → 문자열 배열', '<code>split("-")</code> → String array')],
  },
  {
    id: 'load-format', stage: 'loading', npc: 'yoon',
    title: t('송장 라벨 서식 맞추기', 'Format the shipping label'),
    request: [t('송장 라벨은 칸이 딱 정해져 있어요. 금액엔 쉼표, 번호는 0 으로 채워야 하고요.', 'Labels have fixed layouts. Amounts need commas, and numbers need leading zeros.'), t('예쁘게 맞춰서 찍을 수 있을까요?', 'Can you print them neatly?')],
    thanks: t('라벨이 반듯하네요! 고객님들도 좋아하겠어요.', 'The labels look so neat! Customers will love it.'),
    concepts: [
      {
        title: t('<code>String.format</code>', '<code>String.format</code>'),
        body: t('<code>%s</code> 자리에 문자열, <code>%d</code> 자리에 정수가 들어가요. <code>%,d</code> 는 천 단위 쉼표, <code>%05d</code> 는 5자리로 앞을 0 으로 채워요. <code>%.1f</code> 는 소수 한 자리.', '<code>%s</code> is replaced by a string, <code>%d</code> by an integer. <code>%,d</code> adds thousands commas, <code>%05d</code> pads to 5 digits with zeros. <code>%.1f</code> is one decimal place.'),
        code: main('System.out.println(String.format("%s: %d", "box", 3));\nSystem.out.println(String.format("%,d", 1250000));\nSystem.out.println(String.format("%05d", 42));\nSystem.out.println(String.format("%.1f", 2.345));'),
      },
      {
        title: t('<code>StringBuilder</code> 로 이어 붙이기', 'Joining with <code>StringBuilder</code>'),
        body: t('반복하면서 문자열을 계속 붙일 때는 <code>StringBuilder</code> 의 <code>append</code> 가 빠르고 편해요. 다 붙이면 <code>toString()</code>.', 'When you keep adding to a string in a loop, <code>StringBuilder</code>\'s <code>append</code> is fast and handy. Call <code>toString()</code> at the end.'),
        code: main('StringBuilder sb = new StringBuilder();\nfor (int i = 1; i <= 3; i++) {\n    sb.append(i).append(">");\n}\nSystem.out.println(sb.toString());'),
      },
    ],
    predict: { prompt: t('이 코드를 실행하면 어떻게 찍힐까요?', 'What will this code print?'), code: main('System.out.println(String.format("%03d", 7));'), choices: ['007', '7', '700', '0007'], answer: 0, explain: t('%03d 는 3자리로 맞추고 앞을 0 으로 채워요.', '%03d pads to 3 digits with leading zeros.') },
    fill: {
      prompt: t('금액은 쉼표, 송장 번호는 6자리로 앞을 0 으로 채워 찍게 하세요.', 'Print the amount with commas and the tracking number padded to 6 digits.'),
      code: main(`int amount = 1250000;\nint no = 42;\nSystem.out.println(String.format("${t('금액', 'Amount')}: {{0}}${t('원', ' won')}", amount));\nSystem.out.println(String.format("${t('번호', 'No.')}: {{1}}", no));`),
      blanks: [{ size: 4 }, { size: 5 }], expected: t('금액: 1,250,000원\n번호: 000042', 'Amount: 1,250,000 won\nNo.: 000042'),
      hints: [t('천 단위 쉼표는 %,d, 6자리 0 채우기는 %06d.', 'Thousands commas are %,d; 6-digit zero padding is %06d.'), '%,d, %06d'], solution: ['%,d', '%06d'],
    },
    write: {
      prompt: t('상품 <code>"토너"</code>, 수량 3, 금액 45000 을 <code>String.format</code> 으로 한 줄에 찍어 주세요. 금액엔 쉼표를 넣어요.', 'Print product <code>"Toner"</code>, quantity 3, and amount 45000 on one line with <code>String.format</code>. Put commas in the amount.'),
      starter: main(W), expected: t('토너 x3 = 45,000원', 'Toner x3 = 45,000 won'),
      mustInclude: [{ re: 'String\\.format', msg: t('<code>String.format</code> 을 써 주세요.', 'Use <code>String.format</code>.') }, { re: '%,d', msg: t('금액에 <code>%,d</code> 를 써 주세요.', 'Use <code>%,d</code> for the amount.') }],
      hints: [t('"%s x%d = %,d원"', '"%s x%d = %,d won"'), t('String.format("%s x%d = %,d원", name, qty, amount)', 'String.format("%s x%d = %,d won", name, qty, amount)')],
      solution: main(`String name = "${t('토너', 'Toner')}";\nint qty = 3;\nint amount = 45000;\nSystem.out.println(String.format("%s x%d = %,d${t('원', ' won')}", name, qty, amount));`),
    },
    learned: [t('<code>%s</code> 문자열, <code>%d</code> 정수, <code>%.1f</code> 소수', '<code>%s</code> string, <code>%d</code> int, <code>%.1f</code> decimal'), t('<code>%,d</code> 쉼표, <code>%05d</code> 0 채우기', '<code>%,d</code> commas, <code>%05d</code> zero padding'), t('반복해서 붙일 땐 <code>StringBuilder</code>', '<code>StringBuilder</code> for joining in loops')],
  },

  // ───────────── 지게차 통로 · 최기사 · 메서드 ─────────────
  {
    id: 'fork-method', stage: 'forklift', npc: 'choi',
    title: t('안전 수칙 방송 만들기', 'Make the safety announcement'),
    request: [t('빵빵! 김사원님, 지게차 지나갈 때마다 안전 방송을 해야 하는데요,', 'Beep beep! Kim, I have to make a safety announcement every time the forklift passes,'), t('같은 코드를 매번 쓰기 귀찮아요. 묶어 둘 수 없을까요?', 'and writing the same code each time is a pain. Can we bundle it?')],
    thanks: t('이제 한 줄만 부르면 방송 끝! 편하네요~', 'Now one line does the whole announcement. So handy!'),
    concepts: [
      {
        title: t('메서드 만들고 부르기', 'Making and calling a method'),
        body: t('자주 쓰는 코드를 <b>메서드</b>로 묶어 이름을 붙여요. <code>main</code> 밖, <code>class</code> 안에 <code>static void 이름() { … }</code> 로 만들고, <code>이름();</code> 으로 불러요.', 'Bundle code you use often into a <b>method</b> with a name. Write <code>static void name() { … }</code> inside the class but outside <code>main</code>, and call it with <code>name();</code>.'),
        code: `public class Main {\n    static void warn() {\n        System.out.println("${t('지게차 지나갑니다!', 'Forklift coming through!')}");\n    }\n\n    public static void main(String[] args) {\n        warn();\n        warn();\n    }\n}`,
      },
      {
        title: t('매개변수: 값 넘겨주기', 'Parameters: passing values in'),
        body: t('괄호 안에 <b>매개변수</b>를 만들면 부를 때마다 다른 값을 넘길 수 있어요.', 'Put a <b>parameter</b> in the parentheses and you can pass a different value each call.'),
        code: `public class Main {\n    static void warn(String place) {\n        System.out.println(place + "${t(' 지게차 통행 중!', ': forklift passing!')}");\n    }\n\n    public static void main(String[] args) {\n        warn("${t('입고장', 'Receiving')}");\n        warn("${t('출고장', 'Shipping')}");\n    }\n}`,
      },
    ],
    predict: { prompt: t('이 코드를 실행하면 어떻게 찍힐까요?', 'What will this code print?'), code: 'public class Main {\n    static void hi(String name) {\n        System.out.println("Hi " + name);\n    }\n\n    public static void main(String[] args) {\n        hi("Kim");\n        hi("Lee");\n    }\n}', choices: ['Hi Kim\nHi Lee', 'Hi name\nHi name', 'Hi Kim', 'Hi Lee\nHi Kim'], answer: 0, explain: t('부를 때 넘긴 값이 name 에 들어가요. 부른 순서대로 찍혀요.', 'The value you pass goes into name, in the order you call it.') },
    fill: {
      prompt: t('메서드를 만들고 두 번 불러서 방송이 두 번 나오게 하세요.', 'Make the method and call it twice so the announcement plays twice.'),
      code: `public class Main {\n    static {{0}} beep() {\n        System.out.println("${t('빵빵!', 'Beep beep!')}");\n    }\n\n    public static void main(String[] args) {\n        beep();\n        {{1}};\n    }\n}`,
      blanks: [{ size: 4 }, { size: 6 }], expected: t('빵빵!\n빵빵!', 'Beep beep!\nBeep beep!'),
      hints: [t('돌려줄 값이 없을 때 쓰는 단어, 그리고 메서드를 부르는 모양이에요.', 'The word for "returns nothing", and how you call a method.'), 'void, beep()'], solution: ['void', 'beep()'],
    },
    write: {
      prompt: t('<code>static void announce(String zone)</code> 메서드를 만들어 "[구역] 통행 주의" 를 찍게 하고, "피킹", "패킹" 으로 두 번 불러 주세요.', 'Make a method <code>static void announce(String zone)</code> that prints "[zone] watch out", then call it with "Picking" and "Packing".'),
      starter: `public class Main {\n    ${t('// 여기에 메서드를 만드세요', '// Make your method here')}\n\n    public static void main(String[] args) {\n        ${t('// 여기서 부르세요', '// Call it here')}\n    }\n}`,
      expected: t('[피킹] 통행 주의\n[패킹] 통행 주의', '[Picking] watch out\n[Packing] watch out'),
      mustInclude: [{ re: 'static\\s+void\\s+announce\\s*\\(\\s*String', msg: t('<code>static void announce(String zone)</code> 을 만들어 주세요.', 'Make <code>static void announce(String zone)</code>.') }, { re: 'announce\\s*\\(\\s*"', msg: t('main 에서 <code>announce("…")</code> 로 불러 주세요.', 'Call it from main with <code>announce("…")</code>.') }],
      hints: [t('System.out.println("[" + zone + "] 통행 주의");', 'System.out.println("[" + zone + "] watch out");'), t('main 안에서 announce("피킹"); announce("패킹");', 'In main: announce("Picking"); announce("Packing");')],
      solution: `public class Main {\n    static void announce(String zone) {\n        System.out.println("[" + zone + "${t('] 통행 주의', '] watch out')}");\n    }\n\n    public static void main(String[] args) {\n        announce("${t('피킹', 'Picking')}");\n        announce("${t('패킹', 'Packing')}");\n    }\n}`,
    },
    learned: [t('<code>static void 이름() { }</code> 로 만들기', 'Define with <code>static void name() { }</code>'), t('<code>이름();</code> 으로 부르기', 'Call with <code>name();</code>'), t('매개변수로 값 넘기기', 'Pass values with parameters')],
  },
  {
    id: 'fork-return', stage: 'forklift', npc: 'choi',
    title: t('적재 무게 계산기', 'Load weight calculator'),
    request: [t('지게차에 실을 무게를 매번 계산해야 해요.', 'I have to work out the load weight every time.'), t('계산해서 결과를 돌려주는 메서드도 만들 수 있어요?', 'Can a method work it out and hand back the result?')],
    thanks: t('return 으로 받아 쓰니까 어디서든 쓸 수 있네요!', 'With return I can use the result anywhere!'),
    concepts: [
      {
        title: t('값을 돌려주는 <code>return</code>', 'Handing back a value with <code>return</code>'),
        body: t('<code>void</code> 대신 돌려줄 타입을 쓰고, <code>return 값;</code> 으로 돌려줘요. 부른 쪽에서 변수에 담거나 바로 찍을 수 있어요.', 'Write the return type instead of <code>void</code> and hand back with <code>return value;</code>. The caller can store it or print it.'),
        code: `public class Main {\n    static int total(int boxes, int each) {\n        return boxes * each;\n    }\n\n    public static void main(String[] args) {\n        int w = total(4, 12);\n        System.out.println(w);\n        System.out.println(total(2, 5) + 1);\n    }\n}`,
      },
      {
        title: t('조건에 따라 돌려주기', 'Returning based on a condition'),
        body: t('<code>return</code> 을 만나면 메서드는 그 자리에서 끝나요. boolean 을 돌려주면 조건문에 바로 쓸 수 있어요.', 'A method ends right where it hits <code>return</code>. Returning a boolean lets you use it in an if right away.'),
        code: `public class Main {\n    static boolean canLift(int kg) {\n        return kg <= 1000;\n    }\n\n    public static void main(String[] args) {\n        System.out.println(canLift(800));\n        System.out.println(canLift(1200));\n    }\n}`,
      },
    ],
    predict: { prompt: t('이 코드를 실행하면 어떻게 찍힐까요?', 'What will this code print?'), code: 'public class Main {\n    static int twice(int n) {\n        return n * 2;\n    }\n\n    public static void main(String[] args) {\n        System.out.println(twice(twice(3)));\n    }\n}', choices: ['12', '6', '9', '3'], answer: 0, explain: t('twice(3) 은 6, twice(6) 은 12.', 'twice(3) is 6, and twice(6) is 12.') },
    fill: {
      prompt: t('박스 수 × 박스 무게를 돌려주는 메서드를 완성하세요.', 'Finish the method that returns boxes × weight per box.'),
      code: `public class Main {\n    static {{0}} load(int boxes, int each) {\n        {{1}} boxes * each;\n    }\n\n    public static void main(String[] args) {\n        System.out.println("${t('적재 무게', 'Load')}: " + load(5, 20) + "kg");\n    }\n}`,
      blanks: [{ size: 4 }, { size: 7 }], expected: t('적재 무게: 100kg', 'Load: 100kg'),
      hints: [t('정수를 돌려주니까 돌려줄 타입은 int, 돌려주는 단어는 return.', 'It returns an integer, so the type is int; the word is return.'), 'int, return'], solution: ['int', 'return'],
    },
    write: {
      prompt: t('<code>static double fee(double kg)</code> 메서드를 만들어 kg 당 1.5 를 곱한 운송비를 돌려주게 하고, 40kg 의 운송비를 찍어 주세요.', 'Make <code>static double fee(double kg)</code> that returns kg × 1.5, then print the fee for 40kg.'),
      starter: `public class Main {\n    ${t('// 여기에 메서드를 만드세요', '// Make your method here')}\n\n    public static void main(String[] args) {\n        ${t('// 여기서 부르세요', '// Call it here')}\n    }\n}`,
      expected: t('운송비: 60.0', 'Fee: 60.0'),
      mustInclude: [{ re: 'static\\s+double\\s+fee\\s*\\(', msg: t('<code>static double fee(double kg)</code> 를 만들어 주세요.', 'Make <code>static double fee(double kg)</code>.') }, { re: 'return', msg: t('<code>return</code> 으로 돌려주세요.', 'Hand it back with <code>return</code>.') }],
      hints: [t('return kg * 1.5;', 'return kg * 1.5;'), t('System.out.println("운송비: " + fee(40));', 'System.out.println("Fee: " + fee(40));')],
      solution: `public class Main {\n    static double fee(double kg) {\n        return kg * 1.5;\n    }\n\n    public static void main(String[] args) {\n        System.out.println("${t('운송비: ', 'Fee: ')}" + fee(40));\n    }\n}`,
    },
    learned: [t('돌려줄 타입을 앞에: <code>static int 이름(…)</code>', 'Return type first: <code>static int name(…)</code>'), t('<code>return 값;</code> → 거기서 끝', '<code>return value;</code> → ends there'), t('부른 결과를 변수에 담거나 바로 쓰기', 'Store the result or use it right away')],
  },
  {
    id: 'fork-reuse', stage: 'forklift', npc: 'choi',
    title: t('운행 기록 정리하기', 'Tidy the trip log'),
    request: [t('하루 운행 기록을 정리해야 해요. 배열로 받은 무게를 다 더하고, 제일 무거운 것도 알고 싶어요.', 'I need to tidy up today\'s trip log: add up the weights from an array, and find the heaviest.'), t('메서드로 나눠 두면 다음에도 쓸 수 있겠죠?', 'If we split it into methods, we can reuse them, right?')],
    thanks: t('메서드로 나누니까 읽기도 쉽고 다시 쓰기도 좋네요!', 'Split into methods, it\'s easy to read and reuse!'),
    concepts: [
      {
        title: t('배열을 받는 메서드', 'A method that takes an array'),
        body: t('매개변수로 배열도 받을 수 있어요. 메서드 안에서 반복문을 돌리고 결과를 돌려줘요.', 'A parameter can be an array too. Loop inside the method and return the result.'),
        code: `public class Main {\n    static int sum(int[] arr) {\n        int s = 0;\n        for (int x : arr) s += x;\n        return s;\n    }\n\n    public static void main(String[] args) {\n        int[] trips = {300, 450, 200};\n        System.out.println(sum(trips));\n    }\n}`,
      },
      {
        title: t('메서드끼리 부르기', 'Methods calling methods'),
        body: t('메서드 안에서 다른 메서드를 불러도 돼요. 작은 메서드를 조립해서 큰 일을 해요.', 'A method can call another method. Build big jobs out of small ones.'),
        code: `public class Main {\n    static int sum(int[] arr) {\n        int s = 0;\n        for (int x : arr) s += x;\n        return s;\n    }\n\n    static double average(int[] arr) {\n        return (double) sum(arr) / arr.length;\n    }\n\n    public static void main(String[] args) {\n        int[] trips = {300, 450, 200};\n        System.out.println(average(trips));\n    }\n}`,
      },
    ],
    predict: { prompt: t('이 코드를 실행하면 어떻게 찍힐까요?', 'What will this code print?'), code: 'public class Main {\n    static int add(int a, int b) {\n        return a + b;\n    }\n\n    static int triple(int n) {\n        return add(add(n, n), n);\n    }\n\n    public static void main(String[] args) {\n        System.out.println(triple(4));\n    }\n}', choices: ['12', '8', '16', '4'], answer: 0, explain: t('add(4, 4) = 8, add(8, 4) = 12.', 'add(4, 4) = 8, then add(8, 4) = 12.') },
    fill: {
      prompt: t('배열에서 제일 큰 값을 돌려주는 메서드를 완성하세요.', 'Finish the method that returns the biggest value in the array.'),
      code: `public class Main {\n    static int max(int[] arr) {\n        int m = arr[0];\n        for (int x : arr) {\n            if (x > m) m = x;\n        }\n        {{0}} m;\n    }\n\n    public static void main(String[] args) {\n        int[] trips = {300, 450, 200};\n        System.out.println("${t('최대', 'Max')}: " + {{1}}(trips) + "kg");\n    }\n}`,
      blanks: [{ size: 7 }, { size: 4 }], expected: t('최대: 450kg', 'Max: 450kg'),
      hints: [t('찾은 값을 돌려주고, 메서드 이름으로 불러요.', 'Return what you found, and call it by name.'), 'return, max'], solution: ['return', 'max'],
    },
    write: {
      prompt: t('<code>static int countOver(int[] arr, int limit)</code> 를 만들어 limit 보다 무거운 운행 수를 돌려주게 하세요. <code>{300, 1200, 450, 1100}</code> 에서 1000 넘는 횟수를 찍어 주세요.', 'Make <code>static int countOver(int[] arr, int limit)</code> that returns how many trips are heavier than limit. Print the count over 1000 for <code>{300, 1200, 450, 1100}</code>.'),
      starter: `public class Main {\n    ${t('// 여기에 메서드를 만드세요', '// Make your method here')}\n\n    public static void main(String[] args) {\n        int[] trips = {300, 1200, 450, 1100};\n        ${t('// 여기서 부르세요', '// Call it here')}\n    }\n}`,
      expected: t('과적 운행: 2회', 'Heavy trips: 2'),
      mustInclude: [{ re: 'static\\s+int\\s+countOver\\s*\\(\\s*int\\s*\\[\\s*\\]', msg: t('<code>static int countOver(int[] arr, int limit)</code> 을 만들어 주세요.', 'Make <code>static int countOver(int[] arr, int limit)</code>.') }],
      hints: ['int c = 0; for (int x : arr) { if (x > limit) c++; } return c;', t('System.out.println("과적 운행: " + countOver(trips, 1000) + "회");', 'System.out.println("Heavy trips: " + countOver(trips, 1000));')],
      solution: `public class Main {\n    static int countOver(int[] arr, int limit) {\n        int c = 0;\n        for (int x : arr) {\n            if (x > limit) c++;\n        }\n        return c;\n    }\n\n    public static void main(String[] args) {\n        int[] trips = {300, 1200, 450, 1100};\n        System.out.println("${t('과적 운행: ', 'Heavy trips: ')}" + countOver(trips, 1000)${t(' + "회"', '')});\n    }\n}`,
    },
    learned: [t('배열도 매개변수로 받기', 'Arrays can be parameters'), t('매개변수 여러 개: <code>(int[] a, int limit)</code>', 'Several parameters: <code>(int[] a, int limit)</code>'), t('작은 메서드를 조립해서 쓰기', 'Build with small methods')],
  },

  // ───────────── 패킹 작업대 · 강군 · 맵 ─────────────
  {
    id: 'part-map', stage: 'parttime', npc: 'kang',
    title: t('상품별 재고표 만들기', 'Make a stock table'),
    request: [t('김사원님! 상품 이름으로 재고를 바로 찾고 싶은데요,', 'Kim! I want to look up stock by product name,'), t('배열은 번호로만 찾잖아요. 이름으로 찾는 건 없어요?', 'but arrays only go by number. Is there something that goes by name?')],
    thanks: t('이름표 붙인 서랍 같네요! 재고 찾기 쉬워졌어요.', 'It\'s like labelled drawers! Finding stock is easy now.'),
    concepts: [
      {
        title: t('<code>HashMap</code>: 키로 값 찾기', '<code>HashMap</code>: find values by key'),
        body: t('<code>HashMap&lt;키타입, 값타입&gt;</code> 은 키-값 짝을 담아요. <code>put(키, 값)</code> 으로 넣고 <code>get(키)</code> 로 꺼내요. 같은 키로 다시 넣으면 값이 바뀌어요.', '<code>HashMap&lt;KeyType, ValueType&gt;</code> holds key-value pairs. Add with <code>put(key, value)</code>, read with <code>get(key)</code>. Putting the same key again replaces the value.'),
        code: main(`HashMap<String, Integer> stock = new HashMap<>();\nstock.put("${t('토너', 'toner')}", 12);\nstock.put("${t('립밤', 'lipbalm')}", 30);\nSystem.out.println(stock.get("${t('토너', 'toner')}"));\nstock.put("${t('토너', 'toner')}", 10);\nSystem.out.println(stock.get("${t('토너', 'toner')}"));\nSystem.out.println(stock.size());`, UTIL),
      },
      {
        title: t('있는지 확인하기', 'Checking a key'),
        body: t('<code>containsKey(키)</code> 로 그 키가 있는지 봐요. 없는 키를 <code>get</code> 하면 <code>null</code> 이에요. <code>getOrDefault(키, 기본값)</code> 은 없을 때 기본값을 줘요.', 'Check with <code>containsKey(key)</code>. <code>get</code> on a missing key gives <code>null</code>. <code>getOrDefault(key, default)</code> gives the default instead.'),
        code: main(`HashMap<String, Integer> stock = new HashMap<>();\nstock.put("${t('토너', 'toner')}", 12);\nSystem.out.println(stock.containsKey("${t('쿠션', 'cushion')}"));\nSystem.out.println(stock.get("${t('쿠션', 'cushion')}"));\nSystem.out.println(stock.getOrDefault("${t('쿠션', 'cushion')}", 0));`, UTIL),
      },
    ],
    predict: { prompt: t('이 코드를 실행하면 어떻게 찍힐까요?', 'What will this code print?'), code: main('HashMap<String, Integer> m = new HashMap<>();\nm.put("a", 1);\nm.put("b", 2);\nm.put("a", 5);\nSystem.out.println(m.get("a") + m.get("b"));', UTIL), choices: ['7', '3', '8', '12'], answer: 0, explain: t('"a" 는 5 로 바뀌었어요. 5 + 2 = 7.', '"a" was replaced with 5. 5 + 2 = 7.') },
    fill: {
      prompt: t('재고표에 쿠션 8개를 넣고 꺼내 찍게 하세요.', 'Put 8 cushions in the stock table and print it.'),
      code: main(`HashMap<String, Integer> stock = new HashMap<>();\nstock.{{0}}("${t('쿠션', 'cushion')}", 8);\nSystem.out.println("${t('쿠션 재고', 'Cushion stock')}: " + stock.{{1}}("${t('쿠션', 'cushion')}"));`, UTIL),
      blanks: [{ size: 4 }, { size: 4 }], expected: t('쿠션 재고: 8', 'Cushion stock: 8'),
      hints: [t('넣기와 꺼내기 메서드예요.', 'The methods for putting and getting.'), 'put, get'], solution: ['put', 'get'],
    },
    write: {
      prompt: t('재고표 <code>stock</code> 에 토너 12, 립밤 30 을 넣어 주세요. 립밤이 5개 팔렸으니 25 로 바꾸고, 선크림이 있는지(<code>containsKey</code>)도 찍어 주세요.', 'Put toner 12 and lip balm 30 into a stock map <code>stock</code>. 5 lip balms sold, so change it to 25. Also print whether sunscreen is there (<code>containsKey</code>).'),
      starter: UTIL + main(W), expected: t('립밤: 25\n선크림 있음: false', 'lipbalm: 25\nhas sunscreen: false'),
      mustInclude: [{ re: 'HashMap', msg: t('<code>HashMap</code> 을 써 주세요.', 'Use a <code>HashMap</code>.') }, { re: 'containsKey', msg: t('<code>containsKey</code> 로 확인해 주세요.', 'Check with <code>containsKey</code>.') }],
      hints: [t('stock.put("립밤", 25); 로 덮어써요.', 'Overwrite with stock.put("lipbalm", 25);'), t('System.out.println("선크림 있음: " + stock.containsKey("선크림"));', 'System.out.println("has sunscreen: " + stock.containsKey("sunscreen"));')],
      solution: main(`HashMap<String, Integer> stock = new HashMap<>();\nstock.put("${t('토너', 'toner')}", 12);\nstock.put("${t('립밤', 'lipbalm')}", 30);\nstock.put("${t('립밤', 'lipbalm')}", 25);\nSystem.out.println("${t('립밤: ', 'lipbalm: ')}" + stock.get("${t('립밤', 'lipbalm')}"));\nSystem.out.println("${t('선크림 있음: ', 'has sunscreen: ')}" + stock.containsKey("${t('선크림', 'sunscreen')}"));`, UTIL),
    },
    learned: ['<code>HashMap&lt;String, Integer&gt; m = new HashMap&lt;&gt;();</code>', t('<code>put(키, 값)</code>, <code>get(키)</code>', '<code>put(key, value)</code>, <code>get(key)</code>'), '<code>containsKey</code>, <code>getOrDefault</code>'],
  },
  {
    id: 'part-count', stage: 'parttime', npc: 'kang',
    title: t('택배사별 박스 세기', 'Count boxes per courier'),
    request: [t('오늘 포장한 박스가 택배사 이름으로 쭉 적혀 있어요.', 'Today\'s packed boxes are listed by courier name.'), t('택배사마다 몇 개인지 세 줄 수 있어요? 에어캡 하나 드릴게요 ㅎㅎ', 'Can you count how many each courier has? I\'ll give you a bubble wrap sheet, hehe.')],
    thanks: t('딱 맞아요! 에어캡은 비밀로 터뜨려요… 쉿!', 'Spot on! Pop the bubble wrap in secret… shh!'),
    concepts: [
      {
        title: t('맵으로 개수 세기', 'Counting with a map'),
        body: t('없으면 0 에서 시작해서 1 씩 더해요. <code>getOrDefault(키, 0) + 1</code> 을 다시 <code>put</code> 하는 게 흔한 모양이에요.', 'Start at 0 if missing and add 1. Putting back <code>getOrDefault(key, 0) + 1</code> is the usual pattern.'),
        code: main('String[] picks = {"A", "B", "A", "A"};\nHashMap<String, Integer> count = new HashMap<>();\nfor (String p : picks) {\n    count.put(p, count.getOrDefault(p, 0) + 1);\n}\nSystem.out.println(count.get("A"));\nSystem.out.println(count.get("B"));', UTIL),
      },
      {
        title: t('맵 전체 돌기', 'Going through a whole map'),
        body: t('<code>for (String k : map.keySet())</code> 로 키를 하나씩 돌아요. 순서를 정하고 싶으면 <code>TreeMap</code> 을 쓰면 키 순서(가나다·ABC)로 돌아요.', 'Loop over keys with <code>for (String k : map.keySet())</code>. Use <code>TreeMap</code> to go in key order (alphabetical).'),
        code: main('TreeMap<String, Integer> m = new TreeMap<>();\nm.put("b", 2);\nm.put("a", 1);\nm.put("c", 3);\nfor (String k : m.keySet()) {\n    System.out.println(k + "=" + m.get(k));\n}', UTIL),
      },
    ],
    predict: { prompt: t('이 코드를 실행하면 어떻게 찍힐까요?', 'What will this code print?'), code: main('String[] s = {"x", "y", "x"};\nHashMap<String, Integer> c = new HashMap<>();\nfor (String k : s) {\n    c.put(k, c.getOrDefault(k, 0) + 1);\n}\nSystem.out.println(c.get("x"));', UTIL), choices: ['2', '1', '3', 'null'], answer: 0, explain: t('"x" 가 두 번 나와서 0 → 1 → 2.', '"x" appears twice: 0 → 1 → 2.') },
    fill: {
      prompt: t('택배사 이름이 나올 때마다 1 씩 세게 하세요.', 'Count 1 each time a courier name appears.'),
      code: main(`String[] boxes = {"${t('번개', 'Bolt')}", "${t('하늘', 'Sky')}", "${t('번개', 'Bolt')}"};\nHashMap<String, Integer> count = new HashMap<>();\nfor (String b : boxes) {\n    count.put(b, count.{{0}}(b, 0) + {{1}});\n}\nSystem.out.println("${t('번개', 'Bolt')}: " + count.get("${t('번개', 'Bolt')}"));`, UTIL),
      blanks: [{ size: 12 }, { size: 2 }], expected: t('번개: 2', 'Bolt: 2'),
      hints: [t('없으면 기본값을 주는 메서드, 그리고 하나씩 더하는 수예요.', 'The method that gives a default when missing, and the number to add each time.'), 'getOrDefault, 1'], solution: ['getOrDefault', '1'],
    },
    write: {
      prompt: t('박스 목록 <code>{"번개", "하늘", "번개", "바다", "번개", "하늘"}</code> 을 택배사별로 세서, <code>TreeMap</code> 으로 이름 순서대로 "이름: 개수" 를 찍어 주세요.', 'Count the box list <code>{"Bolt", "Sky", "Bolt", "Ocean", "Bolt", "Sky"}</code> by courier and print "name: count" in name order using a <code>TreeMap</code>.'),
      starter: UTIL + main(W), expected: t('바다: 1\n번개: 3\n하늘: 2', 'Bolt: 3\nOcean: 1\nSky: 2'),
      mustInclude: [{ re: 'TreeMap', msg: t('<code>TreeMap</code> 으로 이름 순서를 맞춰 주세요.', 'Use a <code>TreeMap</code> to keep name order.') }, { re: 'for\\s*\\(', msg: t('반복문으로 세 주세요.', 'Count with a loop.') }],
      hints: ['TreeMap<String, Integer> count = new TreeMap<>(); for (String b : boxes) count.put(b, count.getOrDefault(b, 0) + 1);', 'for (String k : count.keySet()) System.out.println(k + ": " + count.get(k));'],
      solution: main(`String[] boxes = {"${t('번개', 'Bolt')}", "${t('하늘', 'Sky')}", "${t('번개', 'Bolt')}", "${t('바다', 'Ocean')}", "${t('번개', 'Bolt')}", "${t('하늘', 'Sky')}"};\nTreeMap<String, Integer> count = new TreeMap<>();\nfor (String b : boxes) {\n    count.put(b, count.getOrDefault(b, 0) + 1);\n}\nfor (String k : count.keySet()) {\n    System.out.println(k + ": " + count.get(k));\n}`, UTIL),
    },
    learned: [t('세기: <code>put(k, getOrDefault(k, 0) + 1)</code>', 'Counting: <code>put(k, getOrDefault(k, 0) + 1)</code>'), t('키 돌기: <code>for (String k : m.keySet())</code>', 'Keys: <code>for (String k : m.keySet())</code>'), t('<code>TreeMap</code> 은 키 순서대로', '<code>TreeMap</code> keeps key order')],
  },

  // ───────────── 센터장실 · 문센터장 · 클래스, 예외, 복습 ─────────────
  {
    id: 'rest-class', stage: 'rest', npc: 'moon',
    title: t('상품 카드 만들기', 'Make product cards'),
    request: [t('김사원님, 이제 우리 센터 상품을 전산에 제대로 등록해 볼까요?', 'Kim, shall we register our products in the system properly now?'), t('상품마다 이름, 가격, 재고가 있잖아요. 이걸 한 덩어리로 묶는 방법이 있어요.', 'Each product has a name, price and stock. There\'s a way to bundle those together.')],
    thanks: t('클래스까지 하다니, 이제 어엿한 전산 담당이네요!', 'Classes too! You\'re a real systems person now!'),
    concepts: [
      {
        title: t('클래스와 객체', 'Classes and objects'),
        body: t('<b>클래스</b>는 설계도, <b>객체</b>는 설계도로 만든 물건이에요. 클래스 안에 필드(변수)를 두고, <code>new 클래스이름()</code> 으로 객체를 만들어요. <code>객체.필드</code> 로 꺼내요.', 'A <b>class</b> is a blueprint; an <b>object</b> is something built from it. Put fields (variables) in the class, make an object with <code>new ClassName()</code>, and read fields with <code>object.field</code>.'),
        code: `class Product {\n    String name;\n    int price;\n}\n\npublic class Main {\n    public static void main(String[] args) {\n        Product p = new Product();\n        p.name = "${t('토너', 'Toner')}";\n        p.price = 15000;\n        System.out.println(p.name + " " + p.price);\n    }\n}`,
      },
      {
        title: t('생성자', 'Constructors'),
        body: t('<b>생성자</b>는 객체를 만들 때 바로 값을 넣어 주는 특별한 메서드예요. 클래스 이름과 같고, 돌려줄 타입이 없어요. <code>this.name</code> 은 "이 객체의 name" 이에요.', 'A <b>constructor</b> fills in values right when the object is made. It has the class\'s name and no return type. <code>this.name</code> means "this object\'s name".'),
        code: `class Product {\n    String name;\n    int price;\n\n    Product(String name, int price) {\n        this.name = name;\n        this.price = price;\n    }\n}\n\npublic class Main {\n    public static void main(String[] args) {\n        Product a = new Product("${t('토너', 'Toner')}", 15000);\n        Product b = new Product("${t('립밤', 'Lip balm')}", 4500);\n        System.out.println(a.name + ", " + b.name);\n    }\n}`,
      },
    ],
    predict: { prompt: t('이 코드를 실행하면 어떻게 찍힐까요?', 'What will this code print?'), code: 'class Box {\n    int w;\n    Box(int w) {\n        this.w = w;\n    }\n}\n\npublic class Main {\n    public static void main(String[] args) {\n        Box a = new Box(3);\n        Box b = new Box(5);\n        System.out.println(a.w + b.w);\n    }\n}', choices: ['8', '35', '3', '5'], answer: 0, explain: t('a.w 는 3, b.w 는 5. 각 객체가 자기 값을 따로 가져요.', 'a.w is 3 and b.w is 5. Each object keeps its own value.') },
    fill: {
      prompt: t('생성자로 상품을 만들고 이름과 가격을 찍게 하세요.', 'Make a product with the constructor and print its name and price.'),
      code: `class Product {\n    String name;\n    int price;\n\n    Product(String name, int price) {\n        {{0}}.name = name;\n        this.price = price;\n    }\n}\n\npublic class Main {\n    public static void main(String[] args) {\n        Product p = {{1}} Product("${t('쿠션', 'Cushion')}", 22000);\n        System.out.println(p.name + ": " + p.price);\n    }\n}`,
      blanks: [{ size: 4 }, { size: 3 }], expected: t('쿠션: 22000', 'Cushion: 22000'),
      hints: [t('"이 객체의" 를 뜻하는 단어, 그리고 객체를 만드는 단어예요.', 'The word for "this object\'s", and the word that makes an object.'), 'this, new'], solution: ['this', 'new'],
    },
    write: {
      prompt: t('필드 <code>name</code>, <code>stock</code> 과 생성자가 있는 <code>Item</code> 클래스를 만들고, 토너(12개)와 립밤(30개) 객체를 만들어 찍어 주세요.', 'Make a class <code>Item</code> with fields <code>name</code>, <code>stock</code> and a constructor. Create toner (12) and lip balm (30) and print them.'),
      starter: `${t('// 여기에 Item 클래스를 만드세요', '// Make the Item class here')}\n\npublic class Main {\n    public static void main(String[] args) {\n        ${t('// 여기서 객체를 만들고 찍으세요', '// Create the objects and print them here')}\n    }\n}`,
      expected: t('토너: 12개\n립밤: 30개', 'Toner: 12\nLip balm: 30'),
      mustInclude: [{ re: 'class\\s+Item', msg: t('<code>class Item</code> 을 만들어 주세요.', 'Make <code>class Item</code>.') }, { re: 'Item\\s*\\(\\s*String', msg: t('<code>Item(String name, int stock)</code> 생성자를 만들어 주세요.', 'Make the constructor <code>Item(String name, int stock)</code>.') }, { re: 'new\\s+Item', msg: t('<code>new Item(…)</code> 으로 객체를 만들어 주세요.', 'Create objects with <code>new Item(…)</code>.') }],
      hints: ['class Item { String name; int stock; Item(String name, int stock) { this.name = name; this.stock = stock; } }', t('Item a = new Item("토너", 12); System.out.println(a.name + ": " + a.stock + "개");', 'Item a = new Item("Toner", 12); System.out.println(a.name + ": " + a.stock);')],
      solution: `class Item {\n    String name;\n    int stock;\n\n    Item(String name, int stock) {\n        this.name = name;\n        this.stock = stock;\n    }\n}\n\npublic class Main {\n    public static void main(String[] args) {\n        Item a = new Item("${t('토너', 'Toner')}", 12);\n        Item b = new Item("${t('립밤', 'Lip balm')}", 30);\n        System.out.println(a.name + ": " + a.stock${t(' + "개"', '')});\n        System.out.println(b.name + ": " + b.stock${t(' + "개"', '')});\n    }\n}`,
    },
    learned: [t('클래스 = 설계도, 객체 = <code>new</code> 로 만든 것', 'Class = blueprint, object = made with <code>new</code>'), t('<code>객체.필드</code> 로 꺼내기', 'Read with <code>object.field</code>'), t('생성자 + <code>this.필드 = 값</code>', 'Constructor + <code>this.field = value</code>')],
  },
  {
    id: 'rest-object-method', stage: 'rest', npc: 'moon',
    title: t('재고가 스스로 줄어들게', 'Let stock update itself'),
    request: [t('상품이 팔리면 재고가 줄어야죠.', 'When a product sells, its stock should go down.'), t('그 일을 상품 객체가 직접 하게 만들 수 있어요.', 'We can make the product object do that itself.')],
    thanks: t('객체가 자기 일을 하니까 코드가 깔끔하네요. 훌륭해요!', 'Objects doing their own work keeps the code tidy. Excellent!'),
    concepts: [
      {
        title: t('객체의 메서드', 'Object methods'),
        body: t('클래스 안에 <code>static</code> 없이 메서드를 만들면, 그 객체의 필드를 쓰는 메서드가 돼요. <code>객체.메서드()</code> 로 불러요.', 'A method in the class without <code>static</code> works on that object\'s fields. Call it with <code>object.method()</code>.'),
        code: `class Item {\n    String name;\n    int stock;\n\n    Item(String name, int stock) {\n        this.name = name;\n        this.stock = stock;\n    }\n\n    void sell(int n) {\n        stock -= n;\n    }\n\n    String label() {\n        return name + " (" + stock + ")";\n    }\n}\n\npublic class Main {\n    public static void main(String[] args) {\n        Item t = new Item("${t('토너', 'Toner')}", 12);\n        t.sell(3);\n        System.out.println(t.label());\n    }\n}`,
      },
      {
        title: t('객체 여러 개를 리스트에', 'Many objects in a list'),
        body: t('<code>ArrayList&lt;Item&gt;</code> 처럼 객체도 리스트에 담고, 반복문으로 하나씩 일을 시킬 수 있어요.', 'Objects go into lists too, like <code>ArrayList&lt;Item&gt;</code>, and you can loop through them.'),
        code: `import java.util.*;\n\nclass Item {\n    String name;\n    int stock;\n\n    Item(String name, int stock) {\n        this.name = name;\n        this.stock = stock;\n    }\n}\n\npublic class Main {\n    public static void main(String[] args) {\n        ArrayList<Item> items = new ArrayList<>();\n        items.add(new Item("A", 5));\n        items.add(new Item("B", 0));\n        for (Item it : items) {\n            System.out.println(it.name + ": " + it.stock);\n        }\n    }\n}`,
      },
    ],
    predict: { prompt: t('이 코드를 실행하면 어떻게 찍힐까요?', 'What will this code print?'), code: 'class Counter {\n    int n = 0;\n    void up() {\n        n++;\n    }\n}\n\npublic class Main {\n    public static void main(String[] args) {\n        Counter a = new Counter();\n        Counter b = new Counter();\n        a.up();\n        a.up();\n        b.up();\n        System.out.println(a.n + " " + b.n);\n    }\n}', choices: ['2 1', '3 3', '1 1', '2 2'], answer: 0, explain: t('a 와 b 는 각자 자기 n 을 가져요. a 는 두 번, b 는 한 번 올렸어요.', 'a and b each have their own n. a went up twice, b once.') },
    fill: {
      prompt: t('판매 메서드를 완성해서 재고가 줄게 하세요.', 'Finish the sell method so stock goes down.'),
      code: `class Item {\n    int stock = 10;\n\n    {{0}} sell(int n) {\n        stock {{1}} n;\n    }\n}\n\npublic class Main {\n    public static void main(String[] args) {\n        Item it = new Item();\n        it.sell(4);\n        System.out.println("${t('남은 재고', 'Stock left')}: " + it.stock);\n    }\n}`,
      blanks: [{ size: 4 }, { size: 2 }], expected: t('남은 재고: 6', 'Stock left: 6'),
      hints: [t('돌려줄 값이 없는 메서드, 그리고 빼서 넣는 줄임 기호예요.', 'A method that returns nothing, and the subtract-and-store shortcut.'), 'void, -='], solution: ['void', '-='],
    },
    write: {
      prompt: t('<code>Item</code> 에 <code>boolean isEmpty()</code> (재고가 0 이면 true) 메서드를 만들어 주세요. 립밤(재고 2)을 2개 팔고, 비었는지 찍어 주세요.', 'Give <code>Item</code> a method <code>boolean isEmpty()</code> (true when stock is 0). Sell 2 lip balms (stock 2) and print whether it\'s empty.'),
      starter: `class Item {\n    String name;\n    int stock;\n\n    Item(String name, int stock) {\n        this.name = name;\n        this.stock = stock;\n    }\n\n    void sell(int n) {\n        stock -= n;\n    }\n\n    ${t('// 여기에 isEmpty 를 만드세요', '// Make isEmpty here')}\n}\n\npublic class Main {\n    public static void main(String[] args) {\n        ${t('// 여기서 써 보세요', '// Use it here')}\n    }\n}`,
      expected: t('립밤 품절: true', 'Lip balm sold out: true'),
      mustInclude: [{ re: 'boolean\\s+isEmpty\\s*\\(\\s*\\)', msg: t('<code>boolean isEmpty()</code> 를 만들어 주세요.', 'Make <code>boolean isEmpty()</code>.') }, { re: '\\.isEmpty\\s*\\(\\s*\\)', msg: t('<code>객체.isEmpty()</code> 로 불러 주세요.', 'Call it with <code>object.isEmpty()</code>.') }],
      hints: ['boolean isEmpty() { return stock == 0; }', t('Item b = new Item("립밤", 2); b.sell(2); System.out.println("립밤 품절: " + b.isEmpty());', 'Item b = new Item("Lip balm", 2); b.sell(2); System.out.println("Lip balm sold out: " + b.isEmpty());')],
      solution: `class Item {\n    String name;\n    int stock;\n\n    Item(String name, int stock) {\n        this.name = name;\n        this.stock = stock;\n    }\n\n    void sell(int n) {\n        stock -= n;\n    }\n\n    boolean isEmpty() {\n        return stock == 0;\n    }\n}\n\npublic class Main {\n    public static void main(String[] args) {\n        Item b = new Item("${t('립밤', 'Lip balm')}", 2);\n        b.sell(2);\n        System.out.println("${t('립밤 품절: ', 'Lip balm sold out: ')}" + b.isEmpty());\n    }\n}`,
    },
    learned: [t('<code>static</code> 없는 메서드 = 객체의 메서드', 'Methods without <code>static</code> belong to the object'), t('<code>객체.메서드()</code> 로 일 시키기', 'Call with <code>object.method()</code>'), t('객체마다 자기 필드를 따로 가짐', 'Each object has its own fields')],
  },
  {
    id: 'rest-exception', stage: 'rest', npc: 'moon',
    title: t('잘못된 입력 막기', 'Guard against bad input'),
    request: [t('전산에 숫자 칸인데 글자가 들어오는 일이 꼭 있어요.', 'Sometimes letters end up in a number field.'), t('그럴 때 프로그램이 멈추지 않게 할 수 있어요?', 'Can we keep the program from crashing when that happens?')],
    thanks: t('에러가 나도 침착하게 넘어가네요. 든든해요!', 'Even with errors it carries on calmly. Reassuring!'),
    concepts: [
      {
        title: t('<code>try</code> / <code>catch</code>', '<code>try</code> / <code>catch</code>'),
        body: t('에러(예외)가 날 수 있는 코드를 <code>try { }</code> 에 넣고, 에러가 나면 <code>catch (예외종류 e) { }</code> 가 대신 실행돼요. 프로그램은 멈추지 않고 이어져요.', 'Put code that might fail (throw an exception) in <code>try { }</code>. If it fails, <code>catch (ExceptionType e) { }</code> runs instead, and the program keeps going.'),
        code: main(`try {\n    int n = Integer.parseInt("12a");\n    System.out.println(n);\n} catch (NumberFormatException e) {\n    System.out.println("${t('숫자가 아니에요', 'Not a number')}");\n}\nSystem.out.println("${t('계속 진행', 'Still running')}");`),
      },
      {
        title: t('자주 보는 예외들', 'Common exceptions'),
        body: t('<code>ArithmeticException</code> (0 으로 나누기), <code>ArrayIndexOutOfBoundsException</code> (없는 칸), <code>NumberFormatException</code> (숫자로 못 바꿈). <code>finally { }</code> 는 에러가 나든 안 나든 마지막에 실행돼요.', '<code>ArithmeticException</code> (divide by 0), <code>ArrayIndexOutOfBoundsException</code> (no such slot), <code>NumberFormatException</code> (can\'t make a number). <code>finally { }</code> runs at the end either way.'),
        code: main(`int[] a = {1, 2, 3};\ntry {\n    System.out.println(a[5]);\n} catch (ArrayIndexOutOfBoundsException e) {\n    System.out.println("${t('없는 칸이에요', 'No such slot')}");\n} finally {\n    System.out.println("${t('확인 끝', 'Check done')}");\n}`),
      },
    ],
    predict: { prompt: t('이 코드를 실행하면 어떻게 찍힐까요?', 'What will this code print?'), code: main('try {\n    System.out.println("A");\n    int x = 10 / 0;\n    System.out.println("B");\n} catch (ArithmeticException e) {\n    System.out.println("C");\n}'), choices: ['A\nC', 'A\nB\nC', 'C', 'A\nB'], answer: 0, explain: t('A 를 찍고 10 / 0 에서 에러가 나서 B 는 건너뛰고 catch 의 C 를 찍어요.', 'A prints, then 10 / 0 fails, so B is skipped and catch prints C.') },
    fill: {
      prompt: t('글자 "abc" 를 숫자로 바꾸다 에러가 나면 "입력 오류" 가 찍히게 하세요.', 'Print "Input error" when turning "abc" into a number fails.'),
      code: main(`{{0}} {\n    int qty = Integer.parseInt("abc");\n    System.out.println(qty);\n} {{1}} (NumberFormatException e) {\n    System.out.println("${t('입력 오류', 'Input error')}");\n}`),
      blanks: [{ size: 3 }, { size: 5 }], expected: t('입력 오류', 'Input error'),
      hints: [t('시도하는 블록과 에러를 잡는 블록의 단어예요.', 'The words for the trying block and the catching block.'), 'try, catch'], solution: ['try', 'catch'],
    },
    write: {
      prompt: t('수량 칸에 들어온 값들 <code>{"3", "x", "5"}</code> 을 숫자로 바꿔서 더해 주세요. 바꿀 수 없는 값은 "건너뜀: x" 를 찍고 넘어가요. 마지막에 합계를 찍어 주세요.', 'Turn the quantity entries <code>{"3", "x", "5"}</code> into numbers and add them. For one that can\'t be converted, print "Skipped: x" and move on. Print the total at the end.'),
      starter: main(W), expected: t('건너뜀: x\n합계: 8', 'Skipped: x\nTotal: 8'),
      mustInclude: [{ re: 'try\\s*\\{', msg: t('<code>try</code> 를 써 주세요.', 'Use <code>try</code>.') }, { re: 'catch\\s*\\(', msg: t('<code>catch</code> 로 에러를 잡아 주세요.', 'Catch the error with <code>catch</code>.') }],
      hints: [t('for (String s : inputs) { try { sum += Integer.parseInt(s); } catch (NumberFormatException e) { … } }', 'for (String s : inputs) { try { sum += Integer.parseInt(s); } catch (NumberFormatException e) { … } }'), t('catch 안에서 System.out.println("건너뜀: " + s);', 'Inside catch: System.out.println("Skipped: " + s);')],
      solution: main(`String[] inputs = {"3", "x", "5"};\nint sum = 0;\nfor (String s : inputs) {\n    try {\n        sum += Integer.parseInt(s);\n    } catch (NumberFormatException e) {\n        System.out.println("${t('건너뜀: ', 'Skipped: ')}" + s);\n    }\n}\nSystem.out.println("${t('합계: ', 'Total: ')}" + sum);`),
    },
    learned: [t('<code>try { } catch (예외 e) { }</code>', '<code>try { } catch (Exception e) { }</code>'), t('에러가 나도 프로그램은 계속', 'The program keeps going after an error'), t('<code>finally</code> 는 항상 마지막에', '<code>finally</code> always runs last')],
  },
  {
    id: 'rest-review', stage: 'rest', npc: 'moon',
    title: t('하루 마감 보고서', 'End-of-day report'),
    request: [t('오늘 하루 수고 많았어요. 마지막으로 마감 보고서를 만들어 볼까요?', 'Great work today. Shall we finish with the end-of-day report?'), t('지금까지 배운 걸 다 써야 할 거예요. 천천히 해 봐요.', 'You\'ll need everything you\'ve learned. Take your time.')],
    thanks: t('완벽한 보고서예요. 김사원님, 1회차 졸업 축하해요! 🎉', 'A perfect report. Kim, congratulations on finishing lap 1! 🎉'),
    concepts: [
      {
        title: t('배운 것 모아 쓰기', 'Putting it all together'),
        body: t('변수, 배열, 반복문, 조건문, 메서드를 한 프로그램에 같이 써요. 큰 일은 작은 메서드로 나누면 읽기 쉬워요.', 'Use variables, arrays, loops, conditions and methods in one program. Splitting a big job into small methods keeps it readable.'),
        code: `public class Main {\n    static boolean isFree(int amount) {\n        return amount >= 30000;\n    }\n\n    public static void main(String[] args) {\n        int[] orders = {12000, 35000, 8000};\n        int free = 0;\n        for (int o : orders) {\n            if (isFree(o)) free++;\n        }\n        System.out.println(free);\n    }\n}`,
      },
      {
        title: t('보고서 모양 만들기', 'Shaping the report'),
        body: t('합계·개수 같은 결과를 변수에 모아 두고, 마지막에 한꺼번에 서식을 맞춰 찍어요.', 'Collect results like totals and counts in variables, then print them all neatly at the end.'),
        code: main(`int total = 55000;\nint count = 3;\nSystem.out.println(String.format("${t('주문 %d건, 합계 %,d원', '%d orders, total %,d won')}", count, total));`),
      },
    ],
    predict: { prompt: t('이 코드를 실행하면 어떻게 찍힐까요?', 'What will this code print?'), code: main('int[] a = {5, 12, 7, 20};\nint sum = 0;\nfor (int x : a) {\n    if (x >= 10) sum += x;\n}\nSystem.out.println(sum);'), choices: ['32', '44', '12', '20'], answer: 0, explain: t('10 이상인 12 와 20 만 더해서 32.', 'Only 12 and 20 are 10 or more: 32.') },
    fill: {
      prompt: t('3만 원 이상 주문만 세는 메서드를 완성하세요.', 'Finish the method that counts orders of 30,000 or more.'),
      code: `public class Main {\n    static int countFree(int[] orders) {\n        int c = 0;\n        for (int o : orders) {\n            if (o {{0}} 30000) c++;\n        }\n        {{1}} c;\n    }\n\n    public static void main(String[] args) {\n        int[] orders = {12000, 35000, 8000, 50000};\n        System.out.println("${t('무료 배송', 'Free shipping')}: " + countFree(orders));\n    }\n}`,
      blanks: [{ size: 3 }, { size: 7 }], expected: t('무료 배송: 2', 'Free shipping: 2'),
      hints: [t('"이상" 비교 기호와, 값을 돌려주는 단어예요.', 'The "or more" comparison, and the word that hands a value back.'), '>=, return'], solution: ['>=', 'return'],
    },
    write: {
      prompt: t('오늘 주문 금액 <code>{12000, 35000, 8000, 50000}</code> 으로 보고서를 찍어 주세요: 총 금액(쉼표), 무료 배송(3만 원 이상) 건수, 가장 큰 주문.', 'Print a report for today\'s orders <code>{12000, 35000, 8000, 50000}</code>: the total (with commas), the number of free-shipping orders (30,000 or more), and the biggest order.'),
      starter: main(W), expected: t('총 금액: 105,000원\n무료 배송: 2건\n최대 주문: 50,000원', 'Total: 105,000 won\nFree shipping: 2\nBiggest order: 50,000 won'),
      mustInclude: [{ re: 'for\\s*\\(', msg: t('반복문을 써 주세요.', 'Use a loop.') }, { re: 'if\\s*\\(', msg: t('<code>if</code> 로 조건을 확인해 주세요.', 'Check conditions with <code>if</code>.') }],
      hints: [t('total, free, max 세 변수를 반복문 하나에서 같이 계산해요.', 'Work out total, free and max in a single loop.'), t('String.format("총 금액: %,d원", total)', 'String.format("Total: %,d won", total)')],
      solution: main(`int[] orders = {12000, 35000, 8000, 50000};\nint total = 0;\nint free = 0;\nint max = orders[0];\nfor (int o : orders) {\n    total += o;\n    if (o >= 30000) free++;\n    if (o > max) max = o;\n}\nSystem.out.println(String.format("${t('총 금액: %,d원', 'Total: %,d won')}", total));\nSystem.out.println("${t('무료 배송: ', 'Free shipping: ')}" + free${t(' + "건"', '')});\nSystem.out.println(String.format("${t('최대 주문: %,d원', 'Biggest order: %,d won')}", max));`),
    },
    learned: [t('반복문 하나로 여러 값 같이 계산', 'Work out several values in one loop'), t('큰 일은 작은 메서드로', 'Split big jobs into small methods'), t('마지막에 서식 맞춰 찍기', 'Print neatly at the end')],
  },
];
