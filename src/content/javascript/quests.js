// JavaScript quests for 1회차. Same stages, NPCs and story as the Java quests; the code is JavaScript.
// Code runs in a Web Worker; console.log output is compared with `expected`.
// In `fill.code`, {{0}} {{1}} … are blanks.

export const QUESTS = [
  // ───────────── 사무실 · 한지원 · 첫 출근 ─────────────
  {
    id: 'office-1', stage: 'office', npc: 'han',
    title: '출입증에 이름 찍기',
    request: [
      '자, 김사원님 첫 번째 일이에요!',
      '출입증을 만들어야 하는데요, 전산에 이름을 한번 찍어 줄래요? 자바스크립트로요!',
    ],
    thanks: '출입증 나왔어요! 목에 꼭 걸고 다니세요~',
    concepts: [
      {
        title: '화면에 찍기 <code>console.log</code>',
        body: '<code>console.log(…)</code> 는 괄호 안의 내용을 찍고 <b>줄을 바꿔요</b>.<br>글자(문자열)는 따옴표로 감싸요. 큰따옴표 <code>" "</code>, 작은따옴표 <code>\' \'</code> 둘 다 돼요.',
        code: 'console.log("안녕하세요");\nconsole.log(\'물류팀 김사원입니다\');',
        note: '코드는 <b>위에서부터 한 줄씩</b> 차례대로 실행돼요.',
      },
      {
        title: '여러 값을 한 번에 찍기',
        body: '<code>console.log</code> 에 값을 쉼표 <code>,</code> 로 여러 개 넣으면 <b>사이에 띄어쓰기</b>를 넣어서 한 줄로 찍어요.',
        code: 'console.log("박스", 12, "개");\nconsole.log("끝");',
      },
      {
        title: '문장 끝의 <code>;</code>',
        body: '자바스크립트는 문장 끝의 세미콜론 <code>;</code> 를 빼도 대부분 돌아가요. 그래도 붙이는 습관을 들이면 헷갈릴 일이 줄어요.',
        code: 'console.log("세미콜론 붙이기");\nconsole.log("안 붙여도 돌아가요")',
        note: '대소문자는 구분해요. <code>Console.log</code> 나 <code>console.Log</code> 는 에러가 나요.',
      },
    ],
    predict: {
      prompt: '이 코드를 실행하면 어떻게 찍힐까요?',
      code: 'console.log("A", "B");\nconsole.log("C");',
      choices: ['A B\nC', 'AB\nC', 'A\nB\nC', 'A, B\nC'],
      answer: 0,
      explain: '쉼표로 넣은 값은 띄어쓰기로 이어 붙여 한 줄에 찍혀요. 그다음 console.log 는 다음 줄이에요.',
    },
    fill: {
      prompt: '빈칸을 채워서 아래처럼 두 줄이 찍히게 하세요.',
      code: 'console.{{0}}("출입증");\nconsole.log("이름: 김사원");',
      blanks: [{ size: 4 }],
      expected: '출입증\n이름: 김사원',
      hints: ['아래 줄과 같은 모양이에요.', '빈칸에 log 를 넣어 보세요.'],
      solution: ['log'],
    },
    write: {
      prompt: '출입증 세 줄을 직접 찍어 주세요.',
      starter: '// 여기에 코드를 쓰세요\n',
      expected: '출입증\n이름: 김사원\n소속: 물류팀',
      hints: ['console.log("…"); 을 세 번 쓰면 돼요.', '첫 줄은 console.log("출입증"); 이에요.'],
      solution: 'console.log("출입증");\nconsole.log("이름: 김사원");\nconsole.log("소속: 물류팀");',
    },
    learned: ['<code>console.log("글자");</code> → 찍고 줄 바꿈', '<code>console.log(a, b)</code> → 띄어서 한 줄에', '문장 끝 <code>;</code> 는 붙이는 습관'],
  },
  {
    id: 'office-2', stage: 'office', npc: 'han',
    title: '업무 메모 고치기',
    request: [
      '김사원님, 전산실 컴퓨터에 전임자가 남긴 업무 메모 코드가 있는데요,',
      '실행하면 에러가 나요… 에러 메시지를 읽고 고쳐 줄래요?',
    ],
    thanks: '와, 에러 메시지 읽을 줄 아시네요! 이제 입고장에 가 보세요. 박주임님이 기다려요~',
    concepts: [
      {
        title: '주석 <code>//</code>',
        body: '<code>//</code> 뒤에 쓴 글은 <b>실행되지 않아요</b>. 사람이 읽을 메모를 남길 때 써요.<br>실행하고 싶지 않은 줄 앞에 붙여도 돼요.',
        code: '// 오늘 할 일 메모\nconsole.log("입고 검수");\n// console.log("이 줄은 실행 안 돼요");\nconsole.log("출고 지원");',
      },
      {
        title: '에러 메시지 읽기',
        body: '이 예제는 일부러 <code>console</code> 을 <code>consol</code> 로 잘못 썼어요. 실행해 보세요.<br><code>consol is not defined</code> 는 "<b>consol 이라는 이름을 모른다</b>"는 뜻이에요. 앞의 숫자는 몇 번째 줄인지예요.',
        code: 'console.log("첫째 줄");\nconsol.log("둘째 줄");',
        note: '에러가 난 줄 <b>앞의 줄은 이미 실행돼요</b>. 하지만 미션 창은 에러가 나면 에러를 먼저 보여 줘요.',
      },
      {
        title: '괄호와 따옴표 짝 맞추기',
        body: '여는 <code>(</code> 마다 닫는 <code>)</code>, 여는 따옴표마다 닫는 따옴표가 있어야 해요. 짝이 안 맞으면 <b>한 줄도 실행되지 않고</b> 에러가 나요.',
        code: 'console.log("괄호 짝이 맞으면 잘 돌아가요");',
      },
    ],
    predict: {
      prompt: '이 코드는 몇 번째 줄에서 에러가 날까요?',
      code: 'console.log("박스");\nconsole.log("테이프");\nconsole.lg("송장");',
      choices: ['1번째 줄', '2번째 줄', '3번째 줄', '에러 없음'],
      answer: 2,
      explain: '3번째 줄의 console.lg 는 오타예요. console 에는 lg 라는 함수가 없어요.',
    },
    fill: {
      prompt: '빈칸을 채워서 가운데 줄이 실행되지 않게 하세요.',
      code: 'console.log("업무 시작");\n{{0}} console.log("테스트 출력");\nconsole.log("업무 끝");',
      blanks: [{ size: 3 }],
      expected: '업무 시작\n업무 끝',
      hints: ['실행되지 않게 만드는 기호가 있었죠?', '빈칸에 // 를 넣어 보세요.'],
      solution: ['//'],
    },
    write: {
      prompt: '전임자의 메모 코드를 실행해 보고, 에러를 고쳐서 아래처럼 찍히게 하세요.',
      starter: '// 오늘 업무 메모\nconsol.log("오전: 입고 검수");\nconsole.log("오후: 출고 지원);',
      expected: '오전: 입고 검수\n오후: 출고 지원',
      hints: ['먼저 ▶ 실행을 눌러 에러 메시지를 보세요. 따옴표 에러가 먼저 나와요.', '3번째 줄은 닫는 따옴표 " 가 없고, 2번째 줄은 consol → console 이에요.'],
      solution: '// 오늘 업무 메모\nconsole.log("오전: 입고 검수");\nconsole.log("오후: 출고 지원");',
    },
    learned: ['<code>//</code> 뒤는 메모 (실행 안 됨)', '<code>… is not defined</code> → 모르는 이름 (오타 확인)', '괄호·따옴표는 짝이 맞아야 해요'],
  },

  // ───────────── 화장품 입고장 · 박주임 · 변수와 타입 ─────────────
  {
    id: 'recv-int', stage: 'receiving', npc: 'park',
    title: '립스틱 박스 수 찍기',
    request: [
      '김사원님, 첫날이죠? 반가워요! 입고 담당 박주임이에요.',
      '립스틱 박스가 12개 들어왔는데요, 전산에 한번 찍어 줄래요?',
    ],
    thanks: '김사원님 최고! 벌써 끝났어요?',
    concepts: [
      {
        title: '변수 만들기 <code>let</code>',
        body: '변수는 값을 담아 두는 <b>이름</b>이에요. <code>let 이름 = 값;</code> 으로 만들고, 그다음부터는 이름으로 값을 꺼내 써요.',
        code: 'let boxCount = 12;\nconsole.log(boxCount);',
        note: '변수 이름은 소문자로 시작하고, 단어가 바뀌면 대문자로 써요: <code>boxCount</code>',
      },
      {
        title: '변수 값 바꾸기, 그리고 <code>const</code>',
        body: '<code>let</code> 변수에는 새 값을 넣을 수 있어요. 오른쪽을 먼저 계산해서 왼쪽에 넣어요.<br>값이 <b>바뀌지 않을</b> 변수는 <code>const</code> 로 만들어요. const 에 새 값을 넣으면 에러가 나요.',
        code: 'let boxCount = 12;\nboxCount = boxCount + 3;\nconsole.log(boxCount);\nconst center = "화장품 센터";\nconsole.log(center);',
        note: '새 값을 넣을 때는 <code>let</code> 을 다시 쓰지 않아요. 다시 쓰면 "이미 있는 변수" 에러가 나요.',
      },
      {
        title: '글자와 숫자 이어 붙이기 <code>+</code>',
        body: '문자열 옆에 <code>+</code> 로 숫자나 변수를 붙이면 한 줄로 이어져요.<br>백틱 <code>`</code> 으로 감싸고 <code>${변수}</code> 를 쓰면 문자열 안에 값을 바로 넣을 수도 있어요.',
        code: 'let boxCount = 12;\nconsole.log("박스: " + boxCount + "개");\nconsole.log(`박스: ${boxCount}개`);',
      },
    ],
    predict: {
      prompt: '이 코드를 실행하면 어떻게 찍힐까요?',
      code: 'let stock = 30;\nstock = stock - 8;\nconsole.log("남은 재고: " + stock);',
      choices: ['남은 재고: 22', '남은 재고: stock', '남은 재고: 30 - 8', '22'],
      answer: 0,
      explain: 'stock 은 30 에서 8 을 뺀 22 가 되고, "남은 재고: " 뒤에 붙어서 찍혀요.',
    },
    fill: {
      prompt: '빈칸을 채워서 "립스틱 박스: 12개" 가 찍히게 하세요.',
      code: '{{0}} boxCount = 12;\nconsole.log("립스틱 박스: " + {{1}} + "개");',
      blanks: [{ size: 5 }, { size: 9 }],
      expected: '립스틱 박스: 12개',
      hints: ['첫 번째 빈칸은 변수를 만드는 단어예요. (let 또는 const)', '두 번째 빈칸은 방금 만든 변수 이름이에요: let, boxCount'],
      solution: ['let', 'boxCount'],
    },
    write: {
      prompt: '마스크팩 박스가 20개 있었는데 5개가 더 들어왔어요. 변수 <code>maskBox</code> 에 20 을 넣고, 5 를 더한 다음 아래처럼 찍어 주세요.',
      starter: '// 여기에 코드를 쓰세요\n',
      expected: '마스크팩 박스: 25개',
      mustInclude: [
        { re: 'let\\s+maskBox\\s*=\\s*20', msg: '<code>let maskBox = 20;</code> 으로 변수를 먼저 만들어 주세요.' },
        { re: 'maskBox\\s*=\\s*maskBox\\s*\\+\\s*5|maskBox\\s*\\+=\\s*5', msg: '<code>maskBox</code> 에 5 를 더하는 줄이 필요해요.' },
      ],
      hints: ['순서: ① let maskBox = 20; ② maskBox = maskBox + 5; ③ 찍기', '마지막 줄은 console.log("마스크팩 박스: " + maskBox + "개"); 예요.'],
      solution: 'let maskBox = 20;\nmaskBox = maskBox + 5;\nconsole.log("마스크팩 박스: " + maskBox + "개");',
    },
    learned: ['<code>let 이름 = 값;</code> 으로 변수 만들기', '바뀌지 않는 값은 <code>const</code>', '<code>"글자" + 변수</code>, <code>`글자 ${변수}`</code>'],
  },
  {
    id: 'recv-long-double', stage: 'receiving', npc: 'park',
    title: '바코드와 용량 적기',
    request: [
      '이번엔 바코드랑 용량이에요.',
      '바코드 숫자가 엄청 길고, 용량은 소수점이 있는데… 자바스크립트는 이걸 어떻게 담아요?',
    ],
    thanks: '숫자 타입이 하나라니, 편하네요! 고마워요~',
    concepts: [
      {
        title: '숫자는 <code>number</code> 하나',
        body: '자바스크립트는 정수와 소수를 구분하지 않아요. 바코드 같은 큰 정수도, 용량 같은 소수도 모두 <b>number</b> 예요.<br><code>typeof</code> 로 값의 타입을 볼 수 있어요.',
        code: 'let barcode = 8801234567890;\nlet volume = 50.5;\nconsole.log(barcode);\nconsole.log(volume / 2);\nconsole.log(typeof barcode, typeof volume);',
        note: '아주 큰 수(약 9천조 이상)는 정확하지 않게 돼요. 바코드 정도는 괜찮아요.',
      },
      {
        title: '정수처럼 보이면 <code>.0</code> 이 안 붙어요',
        body: '계산 결과가 딱 떨어지면 소수점 없이 찍혀요. <code>0.25 * 4</code> 는 <code>1.0</code> 이 아니라 <code>1</code> 로 찍혀요.',
        code: 'console.log(0.25 * 4);\nconsole.log(30.0);',
      },
      {
        title: '소수점 자리 맞추기 <code>toFixed</code>',
        body: '<code>숫자.toFixed(자리수)</code> 는 소수점 아래를 정해진 자리까지 맞춘 <b>문자열</b>을 만들어요.',
        code: 'let weight = 1;\nconsole.log(weight.toFixed(1));\nconsole.log((2 / 3).toFixed(2));',
      },
    ],
    predict: {
      prompt: '이 코드를 실행하면 어떻게 찍힐까요?',
      code: 'let weight = 0.5;\nconsole.log(weight * 4);',
      choices: ['2', '2.0', '2.00', 'weight * 4'],
      answer: 0,
      explain: '0.5 × 4 = 2. 딱 떨어지는 수는 소수점 없이 2 로 찍혀요.',
    },
    fill: {
      prompt: '빈칸을 채워서 아래처럼 찍히게 하세요.',
      code: 'let barcode = 8801234567890;\nlet volume = {{0}};\nconsole.log("바코드: " + barcode);\nconsole.log("용량: " + volume + "ml");',
      blanks: [{ size: 5 }],
      expected: '바코드: 8801234567890\n용량: 30.5ml',
      hints: ['기대 출력에서 용량 숫자를 찾아보세요.', '30.5'],
      solution: ['30.5'],
    },
    write: {
      prompt: '선크림 한 개는 0.25kg 이에요. 4개를 한 박스에 담으면? 변수 <code>weight</code> 에 0.25 를 넣고, 4 를 곱해서 <b>소수점 한 자리까지</b> 찍어 주세요.',
      starter: '// 여기에 코드를 쓰세요\n',
      expected: '박스 무게: 1.0kg',
      mustInclude: [
        { re: '(let|const)\\s+weight\\s*=\\s*0\\.25', msg: '<code>let weight = 0.25;</code> 로 변수를 만들어 주세요.' },
        { re: 'toFixed\\s*\\(\\s*1\\s*\\)', msg: '그냥 곱하면 1 로 찍혀요. <code>toFixed(1)</code> 을 써 보세요.' },
      ],
      hints: ['weight * 4 는 1 이에요. 1.0 으로 찍으려면?', '(weight * 4).toFixed(1) 을 문자열에 붙여요: "박스 무게: " + (weight * 4).toFixed(1) + "kg"'],
      solution: 'let weight = 0.25;\nconsole.log("박스 무게: " + (weight * 4).toFixed(1) + "kg");',
    },
    learned: ['정수·소수 모두 <code>number</code>', '딱 떨어지면 <code>1</code> 로 찍혀요', '<code>숫자.toFixed(1)</code> → 소수점 한 자리 문자열'],
  },
  {
    id: 'recv-bool-char-string', stage: 'receiving', npc: 'park',
    title: '검수표 남기기',
    request: [
      '검수표를 전산에 남겨야 해요.',
      '상품명, 등급, 유통기한 검수를 통과했는지까지요!',
    ],
    thanks: '검수표 깔끔하네요! 다음 것도 부탁해요~',
    concepts: [
      {
        title: '참/거짓 <code>boolean</code>',
        body: '<code>true</code>(참) 아니면 <code>false</code>(거짓) 둘 중 하나예요. 따옴표 없이 써요.',
        code: 'let passed = true;\nlet expired = false;\nconsole.log(passed);\nconsole.log(expired);',
      },
      {
        title: '문자열 <code>string</code>',
        body: '글자는 한 글자든 여러 글자든 모두 문자열이에요. <code>"A"</code> 도 <code>\'A\'</code> 도 문자열이에요.',
        code: 'let grade = \'A\';\nlet name = "쿠션 팩트";\nconsole.log(grade, typeof grade);\nconsole.log(name + " 입고");',
      },
      {
        title: '<code>+</code> 는 왼쪽부터',
        body: '<code>+</code> 는 왼쪽부터 차례로 계산해요. 숫자끼리면 더하기, 하나라도 문자열이면 그때부터 이어 붙이기예요.',
        code: 'console.log(1 + 2 + "박스");\nconsole.log("박스" + 1 + 2);',
      },
    ],
    predict: {
      prompt: '이 코드를 실행하면 어떻게 찍힐까요?',
      code: 'console.log("팔레트" + 2 + 3);',
      choices: ['팔레트23', '팔레트5', '5팔레트', '에러'],
      answer: 0,
      explain: '"팔레트" + 2 → "팔레트2", 거기에 + 3 → "팔레트23". 문자열이 먼저 나오면 계속 이어 붙여요.',
    },
    fill: {
      prompt: '빈칸을 채워서 검수표가 아래처럼 찍히게 하세요.',
      code: 'let name = {{0}};\nlet grade = {{1}};\nlet passed = {{2}};\nconsole.log("상품: " + name);\nconsole.log("등급: " + grade);\nconsole.log("통과: " + passed);',
      blanks: [{ size: 7 }, { size: 4 }, { size: 5 }],
      expected: '상품: 립틴트\n등급: A\n통과: true',
      hints: ['문자열은 따옴표로 감싸고, true 는 따옴표 없이 써요.', '"립틴트", "A", true'],
      solution: ['"립틴트"', '"A"', 'true'],
    },
    write: {
      prompt: '토너 검수표를 직접 찍어 주세요. 상품명·등급·통과 여부를 변수로 하나씩 만들어서 쓰세요.',
      starter: '// 여기에 코드를 쓰세요\n',
      expected: '상품: 토너\n등급: B\n통과: false',
      mustInclude: [
        { re: '(let|const)\\s+\\w+\\s*=\\s*["\'`]토너', msg: '상품명 "토너" 를 변수에 담아 주세요.' },
        { re: '(let|const)\\s+\\w+\\s*=\\s*false', msg: '통과 여부 <code>false</code> 를 변수에 담아 주세요. (따옴표 없이)' },
      ],
      hints: ['빈칸 문제와 같은 모양이에요. 값만 "토너", "B", false 로 바꿔요.', 'let name = "토너"; let grade = "B"; let passed = false; 를 만들고 세 줄을 찍어요.'],
      solution: 'let name = "토너";\nlet grade = "B";\nlet passed = false;\nconsole.log("상품: " + name);\nconsole.log("등급: " + grade);\nconsole.log("통과: " + passed);',
    },
    learned: ['<code>true</code> / <code>false</code> 는 따옴표 없이', '글자는 모두 문자열', '<code>+</code> 는 왼쪽부터: 문자열이 나오면 이어 붙이기'],
  },
  {
    id: 'recv-cast', stage: 'receiving', npc: 'park',
    title: '입고 정산',
    request: [
      '마지막으로 입고 정산이에요!',
      '무게를 정수 kg 로 잘라서 적어야 하고, 평균도 내야 해요. 자바스크립트로 할 수 있죠?',
    ],
    thanks: '입고장 일은 이제 다 할 줄 아시네요! 정말 고마워요, 김사원님!',
    concepts: [
      {
        title: '나누기는 소수점까지 나와요',
        body: '정수끼리 나눠도 결과는 <b>소수점까지</b> 나와요.',
        code: 'console.log(7 / 2);\nconsole.log(10 / 4);',
      },
      {
        title: '소수점 버리기 <code>Math.floor</code>',
        body: '<code>Math.floor(숫자)</code> 는 소수점 아래를 버려요. (정확히는 그 수보다 크지 않은 가장 큰 정수)<br>반올림은 <code>Math.round</code> 예요.',
        code: 'console.log(Math.floor(12.8));\nconsole.log(Math.round(12.8));\nconsole.log(Math.floor(7 / 2));',
      },
      {
        title: '문자열 ↔ 숫자 바꾸기',
        body: '전산에서 받은 값이 문자열 <code>"12"</code> 이면 더하기가 이어 붙이기가 돼요. <code>Number("12")</code> 로 숫자로 바꿔요. 반대는 <code>String(12)</code>.',
        code: 'let input = "12";\nconsole.log(input + 3);\nconsole.log(Number(input) + 3);',
      },
    ],
    predict: {
      prompt: '이 코드를 실행하면 어떻게 찍힐까요?',
      code: 'let boxes = 7;\nconsole.log(boxes / 2);',
      choices: ['3.5', '3', '4', '3.0'],
      answer: 0,
      explain: '나누기 결과는 소수점까지 나와요. 7 / 2 = 3.5',
    },
    fill: {
      prompt: '빈칸을 채워서 무게를 정수로 정산하세요.',
      code: 'let weight = 12.8;\nlet kg = {{0}}(weight);\nconsole.log("정산 무게: " + kg + "kg");',
      blanks: [{ size: 10 }],
      expected: '정산 무게: 12kg',
      hints: ['소수점 아래를 버리는 함수예요. 반올림이 아니에요!', 'Math.floor'],
      solution: ['Math.floor'],
    },
    write: {
      prompt: '전산에서 총 무게가 문자열 <code>"10"</code> 으로 왔어요. <code>total</code> 에 <code>"10"</code>, <code>boxes</code> 에 4 를 넣고, 숫자로 바꿔서 박스당 평균 무게를 찍어 주세요.',
      starter: '// 여기에 코드를 쓰세요\nlet total = "10";\nlet boxes = 4;\n',
      expected: '박스당 평균: 2.5kg',
      mustInclude: [
        { re: 'total\\s*=\\s*["\'`]10["\'`]', msg: '<code>total</code> 은 문자열 <code>"10"</code> 그대로 두세요.' },
        { re: 'Number\\s*\\(\\s*total\\s*\\)', msg: '<code>Number(total)</code> 로 숫자로 바꿔 보세요.' },
      ],
      hints: ['"10" / 4 도 사실 2.5 가 나와요. 하지만 + 는 이어 붙이기가 되니, 숫자로 바꾸는 습관을 들여요.', 'console.log("박스당 평균: " + Number(total) / boxes + "kg"); 처럼 Number(total) 을 써요.'],
      solution: 'let total = "10";\nlet boxes = 4;\nconsole.log("박스당 평균: " + Number(total) / boxes + "kg");',
    },
    learned: ['나누기는 소수점까지: <code>7 / 2</code> → 3.5', '<code>Math.floor(12.8)</code> → 12 (버림)', '<code>Number("12")</code> 문자열 → 숫자'],
  },
];
