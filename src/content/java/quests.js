// Java quests for 1회차. One quest = request → concepts → predict → fill → write.
// Codes are full Main.java files (Java 8). In `fill.code`, {{0}} {{1}} … are blanks.
// Grading runs the code for real and compares the output with `expected`.
//
// Add a quest: copy one object below, give it a new `id`, set `stage` (see ../stages.js) and `npc` (see ../npcs.js).
// Quests of the same stage are played in the order they appear here.

const main = (body) => `public class Main {
    public static void main(String[] args) {
${body.split('\n').map((l) => (l ? '        ' + l : l)).join('\n')}
    }
}`;

export const QUESTS = [
  // ───────────── 사무실 · 한지원 · 첫 출근 ─────────────
  {
    id: 'office-1', stage: 'office', npc: 'han',
    title: '출입증에 이름 찍기',
    request: [
      '김사원님, 첫 출근 환영해요! 저는 인사팀 한지원이에요.',
      '출입증을 만들어야 하는데요, 전산에 이름을 한번 찍어 줄래요? 자바로요!',
    ],
    thanks: '출입증 나왔어요! 목에 꼭 걸고 다니세요~',
    concepts: [
      {
        title: '화면에 찍기 <code>println</code>',
        body: '<code>System.out.println(…)</code> 은 괄호 안의 내용을 화면에 찍고 <b>줄을 바꿔요</b>.<br>글자는 큰따옴표 <code>" "</code> 로 감싸요.',
        code: main('System.out.println("안녕하세요");\nSystem.out.println("물류팀 김사원입니다");'),
        note: '자바 코드는 <code>class Main</code> 안의 <code>main</code> 안에 써요. 지금은 이 뼈대를 그대로 두고 가운데만 바꾸면 돼요.',
      },
      {
        title: '<code>print</code> 와 <code>println</code>',
        body: '<code>print</code> 는 찍기만 하고 <b>줄을 바꾸지 않아요</b>. 그래서 다음 출력이 바로 옆에 붙어요.',
        code: main('System.out.print("물류");\nSystem.out.print("팀");\nSystem.out.println("!");\nSystem.out.println("끝");'),
      },
      {
        title: '문장 끝의 <code>;</code>',
        body: '자바는 문장이 끝날 때마다 세미콜론 <code>;</code> 를 붙여요. 빠지면 실행 전에 에러가 나요.',
        code: main('System.out.println("세미콜론");\nSystem.out.println("잊지 마세요");'),
        note: '대소문자도 구분해요. <code>system.out.println</code> 처럼 쓰면 에러가 나요. <code>System</code> 은 대문자 S.',
      },
    ],
    predict: {
      prompt: '이 코드를 실행하면 어떻게 찍힐까요?',
      code: main('System.out.print("A");\nSystem.out.println("B");\nSystem.out.println("C");'),
      choices: ['AB\nC', 'A\nB\nC', 'ABC', 'A B\nC'],
      answer: 0,
      explain: 'print("A") 는 줄을 안 바꿔서 B 가 옆에 붙고, println("B") 에서 줄이 바뀌어 C 는 다음 줄에 나와요.',
    },
    fill: {
      prompt: '빈칸을 채워서 아래처럼 두 줄이 찍히게 하세요.',
      code: main('System.out.{{0}}("출입증");\nSystem.out.println("이름: 김사원");'),
      blanks: [{ size: 7 }],
      expected: '출입증\n이름: 김사원',
      hints: ['"출입증" 다음에 줄이 바뀌어야 해요. 줄을 바꾸는 건 print 일까요, println 일까요?', '빈칸에 println 을 넣어 보세요.'],
      solution: ['println'],
    },
    write: {
      prompt: '출입증 세 줄을 직접 찍어 주세요.',
      starter: main('// 여기에 코드를 쓰세요\n'),
      expected: '출입증\n이름: 김사원\n소속: 물류팀',
      hints: ['System.out.println("…"); 을 세 번 쓰면 돼요.', '첫 줄은 System.out.println("출입증"); 이에요.'],
      solution: main('System.out.println("출입증");\nSystem.out.println("이름: 김사원");\nSystem.out.println("소속: 물류팀");'),
    },
    learned: ['<code>System.out.println("글자");</code> → 찍고 줄 바꿈', '<code>System.out.print("글자");</code> → 줄 안 바꿈', '문장 끝에는 <code>;</code>'],
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
        body: '<code>//</code> 뒤에 쓴 글은 자바가 <b>무시해요</b>. 사람이 읽을 메모를 남길 때 써요.<br>실행하고 싶지 않은 줄 앞에 붙여도 돼요.',
        code: main('// 오늘 할 일 메모\nSystem.out.println("입고 검수");\n// System.out.println("이 줄은 실행 안 돼요");\nSystem.out.println("출고 지원");'),
      },
      {
        title: '에러 메시지 읽기',
        body: '이 예제는 일부러 <code>;</code> 를 하나 뺐어요. 실행해 보세요.<br><code>Main.java:4: error: \';\' expected</code> 는 <b>4번째 줄</b>에 <code>;</code> 가 필요하다는 뜻이에요.',
        code: main('System.out.println("첫째 줄");\nSystem.out.println("둘째 줄")'),
        note: '에러 메시지에서 먼저 볼 것: 파일 이름 뒤의 <b>숫자(몇 번째 줄)</b>, 그리고 <code>error:</code> 뒤의 내용.',
      },
      {
        title: '<code>{ }</code> 짝 맞추기',
        body: '여는 <code>{</code> 마다 닫는 <code>}</code> 가 있어야 해요. <code>class</code> 에 한 쌍, <code>main</code> 에 한 쌍이에요.',
        code: main('System.out.println("괄호 짝이 맞으면 잘 돌아가요");'),
      },
    ],
    predict: {
      prompt: '이 코드는 몇 번째 줄에서 에러가 날까요?',
      code: 'public class Main {\n    public static void main(String[] args) {\n        System.out.println("박스");\n        System.out.println("테이프")\n        System.out.println("송장");\n    }\n}',
      choices: ['3번째 줄', '4번째 줄', '5번째 줄', '에러 없음'],
      answer: 1,
      explain: '4번째 줄 System.out.println("테이프") 끝에 ; 가 없어요.',
    },
    fill: {
      prompt: '빈칸을 채워서 가운데 줄이 실행되지 않게 하세요.',
      code: main('System.out.println("업무 시작");\n{{0}} System.out.println("테스트 출력");\nSystem.out.println("업무 끝");'),
      blanks: [{ size: 3 }],
      expected: '업무 시작\n업무 끝',
      hints: ['자바가 무시하게 만드는 기호가 있었죠?', '빈칸에 // 를 넣어 보세요.'],
      solution: ['//'],
    },
    write: {
      prompt: '전임자의 메모 코드를 실행해 보고, 에러를 고쳐서 아래처럼 찍히게 하세요.',
      starter: main('// 오늘 업무 메모\nSystem.out.println("오전: 입고 검수")\nSystem.out.println("오후: 출고 지원);'),
      expected: '오전: 입고 검수\n오후: 출고 지원',
      hints: ['먼저 ▶ 실행을 눌러 에러 메시지의 줄 번호를 보세요.', '4번째 줄 끝에 ; 가 없고, 5번째 줄은 닫는 따옴표 " 가 없어요.'],
      solution: main('// 오늘 업무 메모\nSystem.out.println("오전: 입고 검수");\nSystem.out.println("오후: 출고 지원");'),
    },
    learned: ['<code>//</code> 뒤는 메모 (실행 안 됨)', '에러 메시지의 <b>숫자 = 줄 번호</b>', '<code>{ }</code> 는 짝이 맞아야 해요'],
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
        title: '정수 변수 <code>int</code>',
        body: '변수는 값을 담아 두는 <b>이름</b>이에요. <code>int</code> 는 <b>정수</b>(소수점 없는 수)를 담아요.<br><code>int 이름 = 값;</code> 으로 만들고, 그다음부터는 이름으로 값을 꺼내 써요.',
        code: main('int boxCount = 12;\nSystem.out.println(boxCount);'),
        note: '변수 이름은 소문자로 시작하고, 단어가 바뀌면 대문자로 써요: <code>boxCount</code>',
      },
      {
        title: '변수 값 바꾸기',
        body: '이미 만든 변수에 새 값을 넣을 수 있어요. 오른쪽을 먼저 계산해서 왼쪽 변수에 넣어요.',
        code: main('int boxCount = 12;\nSystem.out.println(boxCount);\nboxCount = boxCount + 3;\nSystem.out.println(boxCount);'),
        note: '새 값을 넣을 때는 <code>int</code> 를 다시 쓰지 않아요. 다시 쓰면 "이미 있는 변수" 에러가 나요.',
      },
      {
        title: '글자와 숫자 이어 붙이기 <code>+</code>',
        body: '글자(문자열) 옆에 <code>+</code> 로 숫자나 변수를 붙이면 한 줄로 이어서 찍혀요.',
        code: main('int boxCount = 12;\nSystem.out.println("박스: " + boxCount + "개");'),
      },
    ],
    predict: {
      prompt: '이 코드를 실행하면 어떻게 찍힐까요?',
      code: main('int stock = 30;\nstock = stock - 8;\nSystem.out.println("남은 재고: " + stock);'),
      choices: ['남은 재고: 22', '남은 재고: stock', '남은 재고: 30 - 8', '22'],
      answer: 0,
      explain: 'stock 은 30 에서 8 을 뺀 22 가 되고, "남은 재고: " 뒤에 붙어서 찍혀요. 따옴표 안의 stock 이 아니라 변수 stock 의 값이 들어가요.',
    },
    fill: {
      prompt: '빈칸을 채워서 "립스틱 박스: 12개" 가 찍히게 하세요.',
      code: main('{{0}} boxCount = 12;\nSystem.out.println("립스틱 박스: " + {{1}} + "개");'),
      blanks: [{ size: 4 }, { size: 9 }],
      expected: '립스틱 박스: 12개',
      hints: ['첫 번째 빈칸은 정수를 담는 타입이에요.', '두 번째 빈칸에는 방금 만든 변수 이름이 들어가요: int, boxCount'],
      solution: ['int', 'boxCount'],
    },
    write: {
      prompt: '마스크팩 박스가 20개 있었는데 5개가 더 들어왔어요. 변수 <code>maskBox</code> 에 20 을 넣고, 5 를 더한 다음 아래처럼 찍어 주세요.',
      starter: main('// 여기에 코드를 쓰세요\n'),
      expected: '마스크팩 박스: 25개',
      mustInclude: [
        { re: 'int\\s+maskBox\\s*=\\s*20\\s*;', msg: '<code>int maskBox = 20;</code> 으로 변수를 먼저 만들어 주세요.' },
        { re: 'maskBox\\s*=\\s*maskBox\\s*\\+\\s*5|maskBox\\s*\\+=\\s*5', msg: '<code>maskBox</code> 에 5 를 더하는 줄이 필요해요.' },
      ],
      hints: ['순서: ① int maskBox = 20; ② maskBox = maskBox + 5; ③ 찍기', '마지막 줄은 System.out.println("마스크팩 박스: " + maskBox + "개"); 예요.'],
      solution: main('int maskBox = 20;\nmaskBox = maskBox + 5;\nSystem.out.println("마스크팩 박스: " + maskBox + "개");'),
    },
    learned: ['<code>int 이름 = 값;</code> 으로 정수를 담아요', '새 값 넣기: <code>이름 = 새 값;</code> (int 다시 안 씀)', '<code>"글자" + 변수</code> 로 이어서 찍어요'],
  },
  {
    id: 'recv-long-double', stage: 'receiving', npc: 'park',
    title: '바코드와 용량 적기',
    request: [
      '이번엔 바코드랑 용량이에요.',
      '바코드 숫자가 엄청 길어서 int 로는 안 들어가더라고요… 김사원님이 한번 봐 줄래요?',
    ],
    thanks: '오, long 이라는 게 있었군요! 고마워요~',
    concepts: [
      {
        title: '큰 정수 <code>long</code>',
        body: '<code>int</code> 는 약 <b>21억</b>까지만 담을 수 있어요. 바코드 <code>8801234567890</code> 은 그보다 커요.<br>더 큰 정수는 <code>long</code> 에 담고, 숫자 끝에 <code>L</code> 을 붙여요.',
        code: main('long barcode = 8801234567890L;\nSystem.out.println(barcode);'),
        note: '<code>L</code> 을 빼면 "integer number too large" 에러가 나요. 숫자를 먼저 int 로 읽으려고 해서예요.',
      },
      {
        title: '소수 <code>double</code>',
        body: '소수점이 있는 수는 <code>double</code> 에 담아요. 용량, 무게, 할인율 같은 값이요.',
        code: main('double volume = 50.5;\nSystem.out.println(volume);\nSystem.out.println(volume / 2);'),
      },
      {
        title: 'double 은 항상 소수점을 보여 줘요',
        body: '정수 값을 <code>double</code> 에 넣어도 찍으면 <code>.0</code> 이 붙어요.',
        code: main('double weight = 30;\nSystem.out.println(weight);'),
      },
    ],
    predict: {
      prompt: '이 코드를 실행하면 어떻게 찍힐까요?',
      code: main('double weight = 0.5;\nSystem.out.println(weight * 3);'),
      choices: ['1.5', '1', '1.50', 'weight * 3'],
      answer: 0,
      explain: 'double 끼리 계산하면 결과도 double 이에요. 0.5 × 3 = 1.5',
    },
    fill: {
      prompt: '빈칸에 알맞은 타입을 채우세요.',
      code: main('{{0}} barcode = 8801234567890L;\n{{1}} volume = 30.5;\nSystem.out.println("바코드: " + barcode);\nSystem.out.println("용량: " + volume + "ml");'),
      blanks: [{ size: 6 }, { size: 6 }],
      expected: '바코드: 8801234567890\n용량: 30.5ml',
      hints: ['21억보다 큰 정수, 그리고 소수점이 있는 수예요.', 'long, double'],
      solution: ['long', 'double'],
    },
    write: {
      prompt: '선크림 한 개는 0.25kg 이에요. 4개를 한 박스에 담으면? <code>double</code> 변수 <code>weight</code> 에 0.25 를 넣고, 4 를 곱해서 찍어 주세요.',
      starter: main('// 여기에 코드를 쓰세요\n'),
      expected: '박스 무게: 1.0kg',
      mustInclude: [{ re: 'double\\s+weight', msg: '<code>double weight</code> 변수를 만들어 주세요.' }],
      hints: ['곱하기는 * 예요. weight * 4', 'System.out.println("박스 무게: " + (weight * 4) + "kg"); 처럼 계산을 괄호로 묶어 보세요.'],
      solution: main('double weight = 0.25;\nSystem.out.println("박스 무게: " + (weight * 4) + "kg");'),
    },
    learned: ['21억보다 큰 정수: <code>long</code> + 숫자 끝 <code>L</code>', '소수: <code>double</code>', 'double 은 <code>1.0</code> 처럼 소수점까지 찍혀요'],
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
        body: '<code>boolean</code> 은 <code>true</code>(참) 아니면 <code>false</code>(거짓) 둘 중 하나만 담아요.',
        code: main('boolean passed = true;\nboolean expired = false;\nSystem.out.println(passed);\nSystem.out.println(expired);'),
      },
      {
        title: '글자 하나 <code>char</code>',
        body: '<code>char</code> 는 글자 <b>하나</b>를 담고, <b>작은따옴표</b> <code>\' \'</code> 로 감싸요.',
        code: main("char grade = 'A';\nSystem.out.println(grade);"),
        note: '<code>"A"</code> (큰따옴표) 는 String, <code>\'A\'</code> (작은따옴표) 는 char 예요.',
      },
      {
        title: '문자열 <code>String</code>',
        body: '<code>String</code> 은 글자 여러 개를 담아요. <code>S</code> 는 대문자예요.<br><code>+</code> 는 왼쪽부터 차례로 계산해요. 그래서 숫자가 먼저 나오면 더하기, 글자가 먼저 나오면 이어 붙이기가 돼요.',
        code: main('String name = "쿠션 팩트";\nSystem.out.println(name + " 입고");\nSystem.out.println(1 + 2 + "박스");\nSystem.out.println("박스" + 1 + 2);'),
      },
    ],
    predict: {
      prompt: '이 코드를 실행하면 어떻게 찍힐까요?',
      code: main('System.out.println("팔레트" + 2 + 3);'),
      choices: ['팔레트23', '팔레트5', '5팔레트', '에러'],
      answer: 0,
      explain: '"팔레트" + 2 → "팔레트2", 거기에 + 3 → "팔레트23". 글자가 먼저 나오면 계속 이어 붙여요.',
    },
    fill: {
      prompt: '빈칸을 채워서 검수표가 아래처럼 찍히게 하세요.',
      code: main('String name = {{0}};\nchar grade = {{1}};\nboolean passed = {{2}};\nSystem.out.println("상품: " + name);\nSystem.out.println("등급: " + grade);\nSystem.out.println("통과: " + passed);'),
      blanks: [{ size: 7 }, { size: 4 }, { size: 5 }],
      expected: '상품: 립틴트\n등급: A\n통과: true',
      hints: ['String 은 큰따옴표, char 는 작은따옴표로 감싸요.', '"립틴트", \'A\', true'],
      solution: ['"립틴트"', "'A'", 'true'],
    },
    write: {
      prompt: '토너 검수표를 직접 찍어 주세요. <code>String</code>, <code>char</code>, <code>boolean</code> 변수를 하나씩 만들어서 쓰세요.',
      starter: main('// 여기에 코드를 쓰세요\n'),
      expected: '상품: 토너\n등급: B\n통과: false',
      mustInclude: [
        { re: 'String\\s+\\w+\\s*=', msg: '<code>String</code> 변수를 만들어 주세요.' },
        { re: 'char\\s+\\w+\\s*=', msg: '<code>char</code> 변수를 만들어 주세요.' },
        { re: 'boolean\\s+\\w+\\s*=', msg: '<code>boolean</code> 변수를 만들어 주세요.' },
      ],
      hints: ['빈칸 문제와 같은 모양이에요. 값만 "토너", \'B\', false 로 바꿔요.', 'String name = "토너"; char grade = \'B\'; boolean passed = false; 를 만들고 세 줄을 찍어요.'],
      solution: main('String name = "토너";\nchar grade = \'B\';\nboolean passed = false;\nSystem.out.println("상품: " + name);\nSystem.out.println("등급: " + grade);\nSystem.out.println("통과: " + passed);'),
    },
    learned: ['<code>boolean</code>: true / false', "<code>char</code>: 글자 하나, <code>'A'</code>", '<code>String</code>: 글자 여러 개, <code>"토너"</code>'],
  },
  {
    id: 'recv-cast', stage: 'receiving', npc: 'park',
    title: '입고 정산',
    request: [
      '마지막으로 입고 정산이에요!',
      '무게를 정수 kg 로 잘라서 적어야 하고, 평균도 내야 해요. 자바로 할 수 있죠?',
    ],
    thanks: '입고장 일은 이제 다 할 줄 아시네요! 정말 고마워요, 김사원님!',
    concepts: [
      {
        title: '정수끼리 나누면 소수점은 버려요',
        body: '<code>int</code> 끼리 나누면 결과도 <code>int</code> 라서 <b>소수점 아래가 버려져요</b>. 한쪽이라도 소수면 소수점까지 나와요.',
        code: main('System.out.println(7 / 2);\nSystem.out.println(7.0 / 2);'),
      },
      {
        title: '<code>(int)</code> 로 소수점 버리기',
        body: '<code>(int)</code> 를 앞에 붙이면 double 을 int 로 바꿔요. <b>반올림이 아니라 버림</b>이에요.',
        code: main('double weight = 12.8;\nint kg = (int) weight;\nSystem.out.println(kg);'),
        note: '<code>int kg = weight;</code> 처럼 그냥 넣으면 에러가 나요. 값이 잘릴 수 있어서 자바가 확인을 요구해요.',
      },
      {
        title: '<code>(double)</code> 로 소수점까지 나누기',
        body: '정수끼리 나눌 때 소수점까지 보고 싶으면, 나누기 전에 한쪽을 <code>(double)</code> 로 바꿔요.',
        code: main('int total = 10;\nSystem.out.println(total / 4);\nSystem.out.println((double) total / 4);'),
      },
    ],
    predict: {
      prompt: '이 코드를 실행하면 어떻게 찍힐까요?',
      code: main('int boxes = 7;\nSystem.out.println(boxes / 2);'),
      choices: ['3', '3.5', '4', '3.0'],
      answer: 0,
      explain: 'int 끼리 나누면 소수점 아래를 버려요. 7 / 2 = 3',
    },
    fill: {
      prompt: '빈칸을 채워서 무게를 정수로 정산하세요.',
      code: main('double weight = 12.8;\nint kg = {{0}} weight;\nSystem.out.println("정산 무게: " + kg + "kg");'),
      blanks: [{ size: 5 }],
      expected: '정산 무게: 12kg',
      hints: ['double 을 int 로 바꾸는 형변환이에요.', '(int)'],
      solution: ['(int)'],
    },
    write: {
      prompt: '총 10kg 를 박스 4개에 나눠 담았어요. <code>int</code> 변수 <code>total</code> 에 10, <code>boxes</code> 에 4 를 넣고, 박스당 평균 무게를 소수점까지 찍어 주세요.',
      starter: main('// 여기에 코드를 쓰세요\n'),
      expected: '박스당 평균: 2.5kg',
      mustInclude: [
        { re: 'int\\s+total\\s*=\\s*10', msg: '<code>int total = 10;</code> 이 필요해요.' },
        { re: 'int\\s+boxes\\s*=\\s*4', msg: '<code>int boxes = 4;</code> 가 필요해요.' },
        { re: '\\(\\s*double\\s*\\)', msg: '<code>(double)</code> 형변환을 써 보세요. 그냥 나누면 2 가 나와요.' },
      ],
      hints: ['total / boxes 는 2 가 나와요. 소수점까지 보려면?', '(double) total / boxes 를 괄호로 묶어서 문자열에 붙여요: "박스당 평균: " + ((double) total / boxes) + "kg"'],
      solution: main('int total = 10;\nint boxes = 4;\nSystem.out.println("박스당 평균: " + ((double) total / boxes) + "kg");'),
    },
    learned: ['<code>int / int</code> → 소수점 버림', '<code>(int) 12.8</code> → 12 (버림)', '<code>(double) a / b</code> → 소수점까지'],
  },
];
