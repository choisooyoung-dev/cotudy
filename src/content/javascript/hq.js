// HQ staff coding tests. level 1 = 하 (서다은), 2 = 중 (백승호), 3 = 상 (차미경).
// (JavaScript). One short problem per topic; a test only uses topics you've finished
// (`needs` = the stage that must be done). Korean and English side by side via t('한국어', 'English').
import { tr as t } from '../../i18n.js';

const W = t('// 여기에 코드를 쓰세요\n', '// Write your code here\n');

export const HQ_TESTS = [
  // ───── 하 (서다은) / 중 (백승호): see `level` ─────
  {
    id: 'hq-volume', needs: 'receiving', level: 1,
    title: t('박스 부피 구하기', 'Box volume'),
    prompt: t('박스 가로 30, 세로 20, 높이 10 (cm) 이에요. 변수 세 개를 만들고 부피를 찍어 주세요.', 'A box is 30 wide, 20 deep and 10 high (cm). Make three variables and print the volume.'),
    starter: W, expected: t('부피: 6000', 'Volume: 6000'),
    hints: [t('부피 = 가로 × 세로 × 높이', 'Volume = width × depth × height'), t('console.log("부피: " + w * d * h);', 'console.log("Volume: " + w * d * h);')],
    solution: `const w = 30;\nconst d = 20;\nconst h = 10;\nconsole.log("${t('부피: ', 'Volume: ')}" + w * d * h);`,
  },
  {
    id: 'hq-bundle', needs: 'printing', level: 1,
    title: t('묶음 포장 계산', 'Bundle math'),
    prompt: t('상품 47개를 6개씩 묶어요. 묶음 수와 남는 개수를 찍어 주세요.', '47 items are bundled in sixes. Print the number of bundles and how many are left over.'),
    starter: W, expected: t('묶음: 7\n남음: 5', 'Bundles: 7\nLeft: 5'),
    hints: [t('몫은 Math.floor(a / b), 나머지는 % 예요.', 'Whole part with Math.floor(a / b), remainder with %.'), 'Math.floor(47 / 6), 47 % 6'],
    solution: `const items = 47;\nconsole.log("${t('묶음: ', 'Bundles: ')}" + Math.floor(items / 6));\nconsole.log("${t('남음: ', 'Left: ')}" + items % 6);`,
  },
  {
    id: 'hq-grade', needs: 'picking', level: 1,
    title: t('검수 점수 등급', 'Inspection grade'),
    prompt: t('검수 점수 <code>score</code> 가 82점이에요. 90 이상 "A", 80 이상 "B", 그 외 "C" 를 찍어 주세요.', 'The inspection <code>score</code> is 82. Print "A" for 90 or more, "B" for 80 or more, otherwise "C".'),
    starter: W, expected: 'B',
    hints: ['if (score >= 90) … else if (score >= 80) … else …', t('위에서부터 처음 맞는 하나만 실행돼요.', 'Only the first match from the top runs.')],
    solution: 'const score = 82;\nif (score >= 90) {\n  console.log("A");\n} else if (score >= 80) {\n  console.log("B");\n} else {\n  console.log("C");\n}',
  },
  {
    id: 'hq-loop', needs: 'packing', level: 2,
    title: t('3의 배수 합계', 'Sum of multiples of 3'),
    prompt: t('1부터 10까지 중 3의 배수만 더해서 찍어 주세요.', 'Add up only the multiples of 3 from 1 to 10 and print it.'),
    starter: W, expected: t('합계: 18', 'Sum: 18'),
    hints: [t('i % 3 === 0 이면 3의 배수예요.', 'If i % 3 === 0, it\'s a multiple of 3.'), 'for (let i = 1; i <= 10; i++) { if (i % 3 === 0) sum += i; }'],
    solution: `let sum = 0;\nfor (let i = 1; i <= 10; i++) {\n  if (i % 3 === 0) sum += i;\n}\nconsole.log("${t('합계: ', 'Sum: ')}" + sum);`,
  },
  {
    id: 'hq-min', needs: 'shipping', level: 2,
    title: t('가장 가벼운 박스', 'Lightest box'),
    prompt: t('박스 무게 <code>[5, 12, 8, 20, 3]</code> 중 가장 가벼운 무게를 찍어 주세요.', 'Print the lightest weight among <code>[5, 12, 8, 20, 3]</code>.'),
    starter: W, expected: t('최소: 3', 'Min: 3'),
    hints: [t('첫 값을 최솟값으로 두고, 더 작은 값이 나오면 바꿔요.', 'Start with the first as the min and replace it when a smaller one shows up.'), 'if (w < min) min = w;'],
    solution: `const weights = [5, 12, 8, 20, 3];\nlet min = weights[0];\nfor (const w of weights) {\n  if (w < min) min = w;\n}\nconsole.log("${t('최소: ', 'Min: ')}" + min);`,
  },
  {
    id: 'hq-reverse', needs: 'loading', level: 2,
    title: t('송장 코드 뒤집기', 'Reverse a code'),
    prompt: t('문자열 <code>"cotudy"</code> 를 거꾸로 찍어 주세요.', 'Print the string <code>"cotudy"</code> backwards.'),
    starter: W, expected: 'ydutoc',
    hints: [t('맨 끝 글자부터 하나씩 이어 붙여요.', 'Append characters one by one, starting from the end.'), 'for (let i = s.length - 1; i >= 0; i--) r += s[i];'],
    solution: 'const s = "cotudy";\nlet r = "";\nfor (let i = s.length - 1; i >= 0; i--) {\n  r += s[i];\n}\nconsole.log(r);',
  },
  // ───── 상 (차미경) ─────
  {
    id: 'hq-labels', needs: 'packing', level: 3,
    title: t('박스 라벨 규칙', 'Box label rules'),
    prompt: t('박스 1번부터 15번까지 한 줄씩 찍어 주세요. 3의 배수는 "포장", 5의 배수는 "검수", 둘 다면 "출고", 나머지는 번호를 찍어요.', 'Print boxes 1 to 15, one per line. Multiples of 3 print "Pack", multiples of 5 print "Check", both print "Ship", and the rest print the number.'),
    starter: W, expected: t('1\n2\n포장\n4\n검수\n포장\n7\n8\n포장\n검수\n11\n포장\n13\n14\n출고', '1\n2\nPack\n4\nCheck\nPack\n7\n8\nPack\nCheck\n11\nPack\n13\n14\nShip'),
    hints: [t('둘 다(15의 배수)인 경우를 가장 먼저 확인해야 해요.', 'Check the "both" case (multiple of 15) first.'), 'if (i % 15 === 0) … else if (i % 3 === 0) … else if (i % 5 === 0) … else …'],
    solution: `for (let i = 1; i <= 15; i++) {\n  if (i % 15 === 0) console.log("${t('출고', 'Ship')}");\n  else if (i % 3 === 0) console.log("${t('포장', 'Pack')}");\n  else if (i % 5 === 0) console.log("${t('검수', 'Check')}");\n  else console.log(i);\n}`,
  },
  {
    id: 'hq-fee', needs: 'forklift', level: 3,
    title: t('무게별 배송비 함수', 'Shipping fee by weight'),
    prompt: t('<code>fee(kg)</code> 함수를 만들어 주세요. 5kg 이하 3000원, 20kg 이하 5000원, 그보다 무거우면 5000원에 20kg 넘는 1kg 마다 100원을 더해요. fee(3), fee(12), fee(30) 을 한 줄씩 찍어 주세요.', 'Make a function <code>fee(kg)</code>: 3000 for 5kg or less, 5000 for 20kg or less, and above that 5000 plus 100 for every kg over 20. Print fee(3), fee(12), fee(30), one per line.'),
    starter: W, expected: '3000\n5000\n6000',
    mustInclude: [{ re: 'function\\s+fee\\s*\\(|fee\\s*=\\s*\\(?\\s*kg', msg: t('<code>fee(kg)</code> 함수를 만들어 주세요.', 'Make a <code>fee(kg)</code> function.') }],
    hints: ['if (kg <= 5) return 3000; if (kg <= 20) return 5000; …', 'return 5000 + (kg - 20) * 100;'],
    solution: 'function fee(kg) {\n  if (kg <= 5) return 3000;\n  if (kg <= 20) return 5000;\n  return 5000 + (kg - 20) * 100;\n}\n\nconsole.log(fee(3));\nconsole.log(fee(12));\nconsole.log(fee(30));',
  },
  {
    id: 'hq-wordcount', needs: 'parttime', level: 3,
    title: t('택배사 집계', 'Courier tally'),
    prompt: t('문자열 <code>"번개 하늘 번개 바다 번개"</code> 를 공백으로 나눠서 택배사별 개수를 세고, 이름 순서대로 "이름 개수" 로 찍어 주세요.', 'Split <code>"Bolt Sky Bolt Ocean Bolt"</code> at spaces, count each courier, and print "name count" in name order.'),
    starter: W, expected: t('바다 1\n번개 3\n하늘 1', 'Bolt 3\nOcean 1\nSky 1'),
    mustInclude: [{ re: 'split', msg: t('<code>split(" ")</code> 으로 나눠 주세요.', 'Split with <code>split(" ")</code>.') }, { re: 'sort', msg: t('<code>Object.keys(c).sort()</code> 로 이름 순서를 맞춰 주세요.', 'Use <code>Object.keys(c).sort()</code> for name order.') }],
    hints: ['const c = {}; for (const w of s.split(" ")) c[w] = (c[w] || 0) + 1;', 'for (const k of Object.keys(c).sort()) console.log(k + " " + c[k]);'],
    solution: `const s = "${t('번개 하늘 번개 바다 번개', 'Bolt Sky Bolt Ocean Bolt')}";\nconst c = {};\nfor (const w of s.split(" ")) {\n  c[w] = (c[w] || 0) + 1;\n}\nfor (const k of Object.keys(c).sort()) {\n  console.log(k + " " + c[k]);\n}`,
  },
];
