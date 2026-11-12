// Python quests for 1회차. Same stages, NPCs and story as the other languages; explained only in Python terms.
// Code runs with Pyodide in a Web Worker; print output is compared with `expected`.
// In `fill.code`, {{0}} {{1}} … are blanks. (Single braces like f"{name}" are normal Python.)

export const QUESTS = [
  // ───────────── 사무실 · 한지원 · 첫 출근 ─────────────
  {
    id: 'office-1', stage: 'office', npc: 'han',
    title: '출입증에 이름 찍기',
    request: [
      '자, 김사원님 첫 번째 일이에요!',
      '출입증을 만들어야 하는데요, 전산에 이름을 한번 찍어 줄래요? 파이썬으로요!',
    ],
    thanks: '출입증 나왔어요! 목에 꼭 걸고 다니세요~',
    concepts: [
      {
        title: '화면에 찍기 <code>print</code>',
        body: '<code>print(…)</code> 는 괄호 안의 내용을 찍고 <b>줄을 바꿔요</b>.<br>글자(문자열)는 따옴표로 감싸요. 큰따옴표 <code>" "</code>, 작은따옴표 <code>\' \'</code> 둘 다 돼요.',
        code: 'print("안녕하세요")\nprint(\'물류팀 김사원입니다\')',
        note: '코드는 <b>위에서부터 한 줄씩</b> 차례대로 실행돼요.',
      },
      {
        title: '여러 값을 한 번에 찍기',
        body: '<code>print</code> 에 값을 쉼표 <code>,</code> 로 여러 개 넣으면 <b>사이에 띄어쓰기</b>를 넣어서 한 줄로 찍어요.',
        code: 'print("박스", 12, "개")\nprint("끝")',
      },
      {
        title: '한 줄이 한 문장',
        body: '파이썬은 <b>한 줄이 한 문장</b>이에요. 문장 끝에 따로 기호를 붙이지 않아요.<br>대신 줄 맨 앞에 띄어쓰기를 함부로 넣으면 에러가 나요. 줄 앞 띄어쓰기는 나중에 배울 조건문·반복문에서 쓰여요.',
        code: 'print("한 줄에 하나씩")\nprint("줄 앞은 붙여서 써요")',
        note: '대소문자를 구분해요. <code>Print</code> 나 <code>PRINT</code> 는 에러가 나요.',
      },
    ],
    predict: {
      prompt: '이 코드를 실행하면 어떻게 찍힐까요?',
      code: 'print("A", "B")\nprint("C")',
      choices: ['A B\nC', 'AB\nC', 'A\nB\nC', 'A, B\nC'],
      answer: 0,
      explain: '쉼표로 넣은 값은 띄어쓰기로 이어 붙여 한 줄에 찍혀요. 그다음 print 는 다음 줄이에요.',
    },
    fill: {
      prompt: '빈칸을 채워서 아래처럼 두 줄이 찍히게 하세요.',
      code: '{{0}}("출입증")\nprint("이름: 김사원")',
      blanks: [{ size: 6 }],
      expected: '출입증\n이름: 김사원',
      hints: ['아래 줄과 같은 모양이에요.', '빈칸에 print 를 넣어 보세요.'],
      solution: ['print'],
    },
    write: {
      prompt: '출입증 세 줄을 직접 찍어 주세요.',
      starter: '# 여기에 코드를 쓰세요\n',
      expected: '출입증\n이름: 김사원\n소속: 물류팀',
      hints: ['print("…") 를 세 번 쓰면 돼요.', '첫 줄은 print("출입증") 이에요.'],
      solution: 'print("출입증")\nprint("이름: 김사원")\nprint("소속: 물류팀")',
    },
    learned: ['<code>print("글자")</code> → 찍고 줄 바꿈', '<code>print(a, b)</code> → 띄어서 한 줄에', '한 줄이 한 문장, 줄 앞은 붙여 쓰기'],
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
        title: '주석 <code>#</code>',
        body: '<code>#</code> 뒤에 쓴 글은 <b>실행되지 않아요</b>. 사람이 읽을 메모를 남길 때 써요.<br>실행하고 싶지 않은 줄 앞에 붙여도 돼요.',
        code: '# 오늘 할 일 메모\nprint("입고 검수")\n# print("이 줄은 실행 안 돼요")\nprint("출고 지원")',
      },
      {
        title: '에러 메시지 읽기',
        body: '이 예제는 일부러 <code>print</code> 를 <code>prnt</code> 로 잘못 썼어요. 실행해 보세요.<br><code>line 2</code> 는 <b>2번째 줄</b>, <code>NameError: name \'prnt\' is not defined</code> 는 "<b>prnt 라는 이름을 모른다</b>"는 뜻이에요.',
        code: 'print("첫째 줄")\nprnt("둘째 줄")',
        note: '에러 메시지는 <b>맨 아래 줄</b>부터 읽어요. 거기에 에러 종류와 이유가 있어요.',
      },
      {
        title: '괄호와 따옴표 짝 맞추기',
        body: '여는 <code>(</code> 마다 닫는 <code>)</code>, 여는 따옴표마다 닫는 따옴표가 있어야 해요. 짝이 안 맞으면 <b>한 줄도 실행되지 않고</b> <code>SyntaxError</code> 가 나요.',
        code: 'print("괄호 짝이 맞으면 잘 돌아가요")',
      },
    ],
    predict: {
      prompt: '이 코드는 몇 번째 줄에서 에러가 날까요?',
      code: 'print("박스")\nprint("테이프")\npirnt("송장")',
      choices: ['1번째 줄', '2번째 줄', '3번째 줄', '에러 없음'],
      answer: 2,
      explain: '3번째 줄의 pirnt 는 오타예요. 파이썬은 pirnt 라는 이름을 몰라서 NameError 가 나요.',
    },
    fill: {
      prompt: '빈칸을 채워서 가운데 줄이 실행되지 않게 하세요.',
      code: 'print("업무 시작")\n{{0}} print("테스트 출력")\nprint("업무 끝")',
      blanks: [{ size: 2 }],
      expected: '업무 시작\n업무 끝',
      hints: ['실행되지 않게 만드는 기호가 있었죠?', '빈칸에 # 을 넣어 보세요.'],
      solution: ['#'],
    },
    write: {
      prompt: '전임자의 메모 코드를 실행해 보고, 에러를 고쳐서 아래처럼 찍히게 하세요.',
      starter: '# 오늘 업무 메모\nprnt("오전: 입고 검수")\nprint("오후: 출고 지원)',
      expected: '오전: 입고 검수\n오후: 출고 지원',
      hints: ['먼저 ▶ 실행을 눌러 에러 메시지를 보세요. 따옴표 에러가 먼저 나와요.', '3번째 줄은 닫는 따옴표 " 가 없고, 2번째 줄은 prnt → print 예요.'],
      solution: '# 오늘 업무 메모\nprint("오전: 입고 검수")\nprint("오후: 출고 지원")',
    },
    learned: ['<code>#</code> 뒤는 메모 (실행 안 됨)', '에러는 맨 아래 줄부터: <code>line 숫자</code> = 줄 번호', '괄호·따옴표는 짝이 맞아야 해요'],
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
        title: '변수 만들기',
        body: '변수는 값을 담아 두는 <b>이름</b>이에요. <code>이름 = 값</code> 으로 만들고, 그다음부터는 이름으로 값을 꺼내 써요.',
        code: 'box_count = 12\nprint(box_count)',
        note: '파이썬 변수 이름은 보통 소문자로 쓰고, 단어 사이는 밑줄 <code>_</code> 로 이어요: <code>box_count</code>',
      },
      {
        title: '변수 값 바꾸기',
        body: '변수에 새 값을 넣으면 앞의 값은 사라져요. 오른쪽을 먼저 계산해서 왼쪽에 넣어요.',
        code: 'box_count = 12\nprint(box_count)\nbox_count = box_count + 3\nprint(box_count)',
      },
      {
        title: '글자 안에 값 넣기 <code>f"…{변수}…"</code>',
        body: '따옴표 앞에 <code>f</code> 를 붙이면 문자열 안의 <code>{변수}</code> 자리에 값이 들어가요. (f-문자열)<br>쉼표로 이어서 찍어도 돼요. 다만 쉼표는 사이에 띄어쓰기가 들어가요.',
        code: 'box_count = 12\nprint(f"박스: {box_count}개")\nprint("박스:", box_count, "개")',
        note: '<code>"박스: " + box_count</code> 처럼 문자열과 숫자를 <code>+</code> 로 붙이면 에러가 나요. 그럴 땐 f-문자열을 써요.',
      },
    ],
    predict: {
      prompt: '이 코드를 실행하면 어떻게 찍힐까요?',
      code: 'stock = 30\nstock = stock - 8\nprint(f"남은 재고: {stock}")',
      choices: ['남은 재고: 22', '남은 재고: {stock}', '남은 재고: 30 - 8', '22'],
      answer: 0,
      explain: 'stock 은 30 에서 8 을 뺀 22 가 되고, f-문자열의 {stock} 자리에 22 가 들어가요.',
    },
    fill: {
      prompt: '빈칸을 채워서 "립스틱 박스: 12개" 가 찍히게 하세요.',
      code: 'box_count = {{0}}\nprint({{1}}"립스틱 박스: {box_count}개")',
      blanks: [{ size: 3 }, { size: 2 }],
      expected: '립스틱 박스: 12개',
      hints: ['첫 번째 빈칸은 박스 수, 두 번째 빈칸은 {변수} 를 값으로 바꿔 주는 글자예요.', '12, f'],
      solution: ['12', 'f'],
    },
    write: {
      prompt: '마스크팩 박스가 20개 있었는데 5개가 더 들어왔어요. 변수 <code>mask_box</code> 에 20 을 넣고, 5 를 더한 다음 아래처럼 찍어 주세요.',
      starter: '# 여기에 코드를 쓰세요\n',
      expected: '마스크팩 박스: 25개',
      mustInclude: [
        { re: 'mask_box\\s*=\\s*20', msg: '<code>mask_box = 20</code> 으로 변수를 먼저 만들어 주세요.' },
        { re: 'mask_box\\s*=\\s*mask_box\\s*\\+\\s*5|mask_box\\s*\\+=\\s*5', msg: '<code>mask_box</code> 에 5 를 더하는 줄이 필요해요.' },
      ],
      hints: ['순서: ① mask_box = 20 ② mask_box = mask_box + 5 ③ 찍기', '마지막 줄은 print(f"마스크팩 박스: {mask_box}개") 예요.'],
      solution: 'mask_box = 20\nmask_box = mask_box + 5\nprint(f"마스크팩 박스: {mask_box}개")',
    },
    learned: ['<code>이름 = 값</code> 으로 변수 만들기', '새 값 넣기: <code>이름 = 새 값</code>', '<code>f"글자 {변수}"</code> 로 값 넣어 찍기'],
  },
  {
    id: 'recv-long-double', stage: 'receiving', npc: 'park',
    title: '바코드와 용량 적기',
    request: [
      '이번엔 바코드랑 용량이에요.',
      '바코드 숫자가 엄청 길고, 용량은 소수점이 있는데… 파이썬은 이걸 어떻게 담아요?',
    ],
    thanks: '정수랑 실수, 이제 알겠어요! 고마워요~',
    concepts: [
      {
        title: '정수 <code>int</code>',
        body: '소수점 없는 수는 <b>int</b>(정수)예요. 바코드처럼 아주 긴 정수도 그대로 담을 수 있어요.<br><code>type(값)</code> 으로 값의 타입을 볼 수 있어요.',
        code: 'barcode = 8801234567890\nprint(barcode)\nprint(type(barcode))',
      },
      {
        title: '실수 <code>float</code>',
        body: '소수점 있는 수는 <b>float</b>(실수)예요. 용량, 무게, 할인율 같은 값이에요.<br>float 은 딱 떨어져도 <code>1.0</code> 처럼 소수점을 보여 줘요.',
        code: 'volume = 50.5\nprint(volume / 2)\nprint(type(volume))\nprint(0.25 * 4)',
      },
      {
        title: '나누기 <code>/</code> 는 항상 실수',
        body: '<code>/</code> 로 나누면 딱 떨어져도 결과는 <b>float</b> 이에요.',
        code: 'print(30 / 2)\nprint(7 / 2)',
      },
    ],
    predict: {
      prompt: '이 코드를 실행하면 어떻게 찍힐까요?',
      code: 'weight = 0.5\nprint(weight * 4)',
      choices: ['2.0', '2', '2.00', 'weight * 4'],
      answer: 0,
      explain: '0.5 는 float 이라서 계산 결과도 float 이에요. 0.5 × 4 = 2.0',
    },
    fill: {
      prompt: '빈칸을 채워서 아래처럼 찍히게 하세요.',
      code: 'barcode = 8801234567890\nvolume = {{0}}\nprint(f"바코드: {barcode}")\nprint(f"용량: {volume}ml")',
      blanks: [{ size: 5 }],
      expected: '바코드: 8801234567890\n용량: 30.5ml',
      hints: ['기대 출력에서 용량 숫자를 찾아보세요.', '30.5'],
      solution: ['30.5'],
    },
    write: {
      prompt: '선크림 한 개는 0.25kg 이에요. 4개를 한 박스에 담으면? 변수 <code>weight</code> 에 0.25 를 넣고, 4 를 곱해서 찍어 주세요.',
      starter: '# 여기에 코드를 쓰세요\n',
      expected: '박스 무게: 1.0kg',
      mustInclude: [{ re: 'weight\\s*=\\s*0\\.25', msg: '<code>weight = 0.25</code> 로 변수를 만들어 주세요.' }],
      hints: ['곱하기는 * 예요. weight * 4', 'print(f"박스 무게: {weight * 4}kg") 처럼 {} 안에서 바로 계산할 수 있어요.'],
      solution: 'weight = 0.25\nprint(f"박스 무게: {weight * 4}kg")',
    },
    learned: ['소수점 없는 수: <code>int</code>', '소수점 있는 수: <code>float</code> (1.0 처럼 찍힘)', '<code>/</code> 나누기 결과는 항상 float'],
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
        title: '참/거짓 <code>bool</code>',
        body: '<code>True</code>(참) 아니면 <code>False</code>(거짓) 둘 중 하나예요. <b>첫 글자는 대문자</b>, 따옴표 없이 써요.',
        code: 'passed = True\nexpired = False\nprint(passed)\nprint(expired)',
      },
      {
        title: '문자열 <code>str</code>',
        body: '글자는 한 글자든 여러 글자든 모두 <b>str</b>(문자열)이에요. 문자열끼리는 <code>+</code> 로 이어 붙여요.',
        code: 'grade = "A"\nname = "쿠션 팩트"\nprint(grade, type(grade))\nprint(name + " 입고")',
      },
      {
        title: '문자열 반복 <code>*</code>, 숫자를 글자로 <code>str()</code>',
        body: '문자열에 <code>*</code> 숫자를 하면 그만큼 반복해요. 숫자를 문자열에 <code>+</code> 로 붙이려면 <code>str(숫자)</code> 로 바꿔요.',
        code: 'print("박스" * 3)\nprint("팔레트" + str(2))',
      },
    ],
    predict: {
      prompt: '이 코드를 실행하면 어떻게 찍힐까요?',
      code: 'print("팔레트" + str(2) + str(3))',
      choices: ['팔레트23', '팔레트5', '5팔레트', '에러'],
      answer: 0,
      explain: 'str(2) 는 문자열 "2", str(3) 은 "3" 이에요. 문자열끼리 + 는 이어 붙이기라서 "팔레트23".',
    },
    fill: {
      prompt: '빈칸을 채워서 검수표가 아래처럼 찍히게 하세요.',
      code: 'name = {{0}}\ngrade = {{1}}\npassed = {{2}}\nprint(f"상품: {name}")\nprint(f"등급: {grade}")\nprint(f"통과: {passed}")',
      blanks: [{ size: 7 }, { size: 4 }, { size: 5 }],
      expected: '상품: 립틴트\n등급: A\n통과: True',
      hints: ['문자열은 따옴표로 감싸고, True 는 따옴표 없이 첫 글자 대문자로 써요.', '"립틴트", "A", True'],
      solution: ['"립틴트"', '"A"', 'True'],
    },
    write: {
      prompt: '토너 검수표를 직접 찍어 주세요. 상품명·등급·통과 여부를 변수로 하나씩 만들어서 쓰세요.',
      starter: '# 여기에 코드를 쓰세요\n',
      expected: '상품: 토너\n등급: B\n통과: False',
      mustInclude: [
        { re: '\\w+\\s*=\\s*["\']토너', msg: '상품명 "토너" 를 변수에 담아 주세요.' },
        { re: '\\w+\\s*=\\s*False', msg: '통과 여부 <code>False</code> 를 변수에 담아 주세요. (따옴표 없이, F 는 대문자)' },
      ],
      hints: ['빈칸 문제와 같은 모양이에요. 값만 "토너", "B", False 로 바꿔요.', 'name = "토너", grade = "B", passed = False 를 만들고 f-문자열로 세 줄을 찍어요.'],
      solution: 'name = "토너"\ngrade = "B"\npassed = False\nprint(f"상품: {name}")\nprint(f"등급: {grade}")\nprint(f"통과: {passed}")',
    },
    learned: ['<code>True</code> / <code>False</code> (첫 글자 대문자)', '글자는 모두 <code>str</code>', '<code>"글자" * 3</code> 반복, <code>str(숫자)</code> 로 글자 만들기'],
  },
  {
    id: 'recv-cast', stage: 'receiving', npc: 'park',
    title: '입고 정산',
    request: [
      '마지막으로 입고 정산이에요!',
      '무게를 정수 kg 로 잘라서 적어야 하고, 평균도 내야 해요. 파이썬으로 할 수 있죠?',
    ],
    thanks: '입고장 일은 이제 다 할 줄 아시네요! 정말 고마워요, 김사원님!',
    concepts: [
      {
        title: '몫 <code>//</code>',
        body: '<code>/</code> 는 소수점까지 나누고, <code>//</code> 는 <b>몫(소수점 아래를 버린 정수)</b>만 구해요.',
        code: 'print(7 / 2)\nprint(7 // 2)',
      },
      {
        title: '<code>int()</code> 로 소수점 버리기',
        body: '<code>int(실수)</code> 는 소수점 아래를 <b>버리고</b> 정수로 바꿔요. 반올림은 <code>round()</code> 예요.',
        code: 'print(int(12.8))\nprint(round(12.8))',
      },
      {
        title: '문자열 → 숫자 <code>int("10")</code>',
        body: '전산에서 받은 값이 문자열 <code>"10"</code> 이면 숫자처럼 계산할 수 없어요. <code>int("10")</code> 으로 정수로 바꿔요. 소수가 있는 글자는 <code>float("2.5")</code>.',
        code: 'total = "10"\nprint(total * 2)\nprint(int(total) * 2)',
      },
    ],
    predict: {
      prompt: '이 코드를 실행하면 어떻게 찍힐까요?',
      code: 'boxes = 7\nprint(boxes // 2)',
      choices: ['3', '3.5', '4', '3.0'],
      answer: 0,
      explain: '// 는 몫만 구해요. 7 // 2 = 3',
    },
    fill: {
      prompt: '빈칸을 채워서 무게를 정수로 정산하세요.',
      code: 'weight = 12.8\nkg = {{0}}(weight)\nprint(f"정산 무게: {kg}kg")',
      blanks: [{ size: 4 }],
      expected: '정산 무게: 12kg',
      hints: ['실수를 정수로 바꾸는 함수예요. 반올림이 아니라 버림이에요!', 'int'],
      solution: ['int'],
    },
    write: {
      prompt: '전산에서 총 무게가 문자열 <code>"10"</code> 으로 왔어요. 숫자로 바꿔서 박스 4개의 평균 무게를 찍어 주세요.',
      starter: '# 여기에 코드를 쓰세요\ntotal = "10"\nboxes = 4\n',
      expected: '박스당 평균: 2.5kg',
      mustInclude: [
        { re: 'total\\s*=\\s*["\']10["\']', msg: '<code>total</code> 은 문자열 <code>"10"</code> 그대로 두세요.' },
        { re: 'int\\s*\\(\\s*total\\s*\\)|float\\s*\\(\\s*total\\s*\\)', msg: '<code>int(total)</code> 로 숫자로 바꿔 보세요.' },
      ],
      hints: ['total / boxes 는 에러가 나요. 문자열은 나눌 수 없어요.', 'print(f"박스당 평균: {int(total) / boxes}kg")'],
      solution: 'total = "10"\nboxes = 4\nprint(f"박스당 평균: {int(total) / boxes}kg")',
    },
    learned: ['<code>7 // 2</code> → 3 (몫)', '<code>int(12.8)</code> → 12 (버림)', '<code>int("10")</code> 문자열 → 정수'],
  },
];
