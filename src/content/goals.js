// 퀘스트마다 「🎯 이번에 배우는 개념」 카드. 미션 창 개념 공부 화면 왼쪽에 보인다.
// 개념의 이름(HashMap, 조건문, 클로저 …)과 그 개념이 무엇인지 한두 문장으로 쓴다.
// 퀘스트에서 할 일(문제의 의도)이 아니라 배우는 개념 자체를 쓴다 (2026-11-19 사용자 피드백:
// 「해시맵인지 뭔지 개념을 알려 줘야지, 문제 의도를 쓰면 안 된다」).
// 1~10번 공간은 세 언어가 같은 id 를 쓴다. 언어마다 개념 이름이 다르면 { Java, JavaScript, Python } 로 나눠 쓴다.
// 각 언어 설명에는 그 언어만 쓴다 (다른 언어와 비교하지 않는다).
import { tr as t } from '../i18n.js';

const c = (s) => `<code>${s}</code>`;
const g = (name, what) => ({ name, what });

/** t() 가 지금 언어를 고르도록, 부를 때마다 새로 만든다 (미션 창을 열 때 한 번). */
function build() {
    return {
        // ---------- 1회차: 세 언어 공통 id ----------
        'office-1': {
            Java: g(
                t(`출력 ${c('System.out.println')}`, `Output with ${c('System.out.println')}`),
                t(
                    '괄호 안의 값을 콘솔(화면)에 찍는 명령이에요. println 은 찍고 줄을 바꾸고, print 는 줄을 바꾸지 않아요.',
                    'A command that prints the value in the brackets to the console. println moves to a new line after printing; print does not.',
                ),
            ),
            JavaScript: g(
                t(`출력 ${c('console.log')}`, `Output with ${c('console.log')}`),
                t(
                    '괄호 안의 값을 콘솔(화면)에 찍는 명령이에요. 쉼표로 여러 값을 넘기면 한 줄에 띄어서 찍어요.',
                    'A command that prints the value in the brackets to the console. Pass several values with commas and they print on one line with spaces.',
                ),
            ),
            Python: g(
                t(`출력 ${c('print()')}`, `Output with ${c('print()')}`),
                t(
                    '괄호 안의 값을 콘솔(화면)에 찍는 함수예요. 쉼표로 여러 값을 넘기면 한 줄에 띄어서 찍어요.',
                    'A function that prints the value in the brackets to the console. Pass several values with commas and they print on one line with spaces.',
                ),
            ),
        },
        'office-2': {
            Java: g(
                t(`주석 ${c('//')} · 컴파일 에러`, `Comments ${c('//')} · compile errors`),
                t(
                    '주석은 실행되지 않고 사람만 읽는 메모예요. 컴파일 에러는 실행 전에 문법이 틀린 곳을 줄 번호와 이유로 알려 줘요.',
                    'A comment is a note for people that is never run. A compile error points out broken syntax, with the line number and the reason, before the program runs.',
                ),
            ),
            JavaScript: g(
                t(`주석 ${c('//')} · 에러 메시지`, `Comments ${c('//')} · error messages`),
                t(
                    '주석은 실행되지 않고 사람만 읽는 메모예요. 에러 메시지는 몇 번째 줄이 어떤 이유로 틀렸는지 알려 줘요.',
                    'A comment is a note for people that is never run. An error message tells you which line is wrong and why.',
                ),
            ),
            Python: g(
                t(`주석 ${c('#')} · 에러 메시지`, `Comments ${c('#')} · error messages`),
                t(
                    '주석은 실행되지 않고 사람만 읽는 메모예요. 에러 메시지(Traceback)는 몇 번째 줄이 어떤 이유로 틀렸는지 알려 줘요.',
                    'A comment is a note for people that is never run. An error message (traceback) tells you which line is wrong and why.',
                ),
            ),
        },
        'recv-int': {
            Java: g(
                t(`변수 · 정수 타입 ${c('int')}`, `Variables · the ${c('int')} type`),
                t(
                    '변수는 값에 이름을 붙여 저장해 두는 칸이에요. 이름으로 값을 꺼내 쓰고 바꿀 수 있어요. int 는 정수만 담는 타입이에요.',
                    'A variable is a named slot that stores a value. You read and change the value by its name. int is the type for whole numbers.',
                ),
            ),
            JavaScript: g(
                t(`변수 ${c('let')} · ${c('const')}`, `Variables ${c('let')} · ${c('const')}`),
                t(
                    '변수는 값에 이름을 붙여 저장해 두는 칸이에요. let 으로 만든 변수는 값을 바꿀 수 있고, const 로 만든 변수는 바꿀 수 없어요.',
                    'A variable is a named slot that stores a value. A let variable can be changed; a const variable cannot.',
                ),
            ),
            Python: g(
                t('변수', 'Variables'),
                t(
                    '변수는 값에 이름을 붙여 저장해 두는 칸이에요. 이름 = 값 으로 만들고, 이름으로 값을 꺼내 쓰고 바꿀 수 있어요.',
                    'A variable is a named slot that stores a value. You make it with name = value, then read and change it by name.',
                ),
            ),
        },
        'recv-long-double': {
            Java: g(
                t(`자료형 ${c('long')} · ${c('double')}`, `The ${c('long')} and ${c('double')} types`),
                t(
                    'long 은 int 보다 훨씬 큰 정수를 담는 타입이고, double 은 소수점이 있는 수를 담는 타입이에요.',
                    'long holds whole numbers far bigger than int can, and double holds numbers with a decimal point.',
                ),
            ),
            JavaScript: g(
                t(`숫자 타입 ${c('number')} · ${c('toFixed')}`, `The ${c('number')} type · ${c('toFixed')}`),
                t(
                    '정수와 소수를 모두 number 타입 하나로 다뤄요. toFixed(자리 수) 는 소수점 자리를 맞춘 문자열을 돌려줘요.',
                    'Whole numbers and decimals are both the number type. toFixed(digits) gives back a string with that many decimal places.',
                ),
            ),
            Python: g(
                t(`자료형 ${c('int')} · ${c('float')}`, `The ${c('int')} and ${c('float')} types`),
                t(
                    'int 는 정수, float 는 소수점이 있는 수예요. / 로 나누면 결과는 항상 float 예요.',
                    'int is a whole number and float is a number with a decimal point. Dividing with / always gives a float.',
                ),
            ),
        },
        'recv-bool-char-string': {
            Java: g(
                t(`${c('boolean')} · ${c('char')} · ${c('String')}`, `${c('boolean')} · ${c('char')} · ${c('String')}`),
                t(
                    'boolean 은 true 와 false 둘 중 하나, char 는 글자 하나(작은따옴표), String 은 글자 여러 개를 이은 문자열(큰따옴표)을 담는 타입이에요.',
                    'boolean is either true or false, char is one character (single quotes), and String is a run of characters (double quotes).',
                ),
            ),
            JavaScript: g(
                t(`${c('boolean')} · 문자열 ${c('string')}`, `${c('boolean')} · ${c('string')}`),
                t(
                    'boolean 은 true 와 false 둘 중 하나, string 은 글자 여러 개를 이은 문자열이에요. + 는 왼쪽부터 계산해서, 앞에 문자열이 있으면 그 뒤는 이어 붙이기가 돼요.',
                    'A boolean is either true or false, and a string is a run of characters. + works left to right, so once a string appears everything after it is joined as text.',
                ),
            ),
            Python: g(
                t(`${c('bool')} · 문자열 ${c('str')}`, `${c('bool')} · ${c('str')}`),
                t(
                    'bool 은 True 와 False 둘 중 하나, str 은 글자 여러 개를 이은 문자열이에요. str() 은 숫자를 문자열로 바꿔요.',
                    'A bool is either True or False, and a str is a run of characters. str() turns a number into a string.',
                ),
            ),
        },
        'recv-cast': {
            Java: g(
                t(`형변환 ${c('(int)')} · ${c('(double)')}`, `Casting ${c('(int)')} · ${c('(double)')}`),
                t(
                    '형변환은 값을 다른 타입으로 바꾸는 거예요. 정수끼리 나누면 소수점이 버려지고, 한쪽을 (double) 로 바꾸면 소수점까지 나와요. (int) 는 소수점을 버려요.',
                    'Casting turns a value into another type. Dividing two ints drops the decimals; cast one to (double) to keep them. (int) drops the decimals.',
                ),
            ),
            JavaScript: g(
                t(
                    `타입 변환 ${c('Number()')} · ${c('String()')} · ${c('Math.floor')}`,
                    `Type conversion ${c('Number()')} · ${c('String()')} · ${c('Math.floor')}`,
                ),
                t(
                    'Number() 는 문자열을 숫자로, String() 은 숫자를 문자열로 바꿔요. 나누기는 소수점까지 나오고, Math.floor 는 소수점을 버려요.',
                    'Number() turns a string into a number and String() turns a number into a string. Division keeps the decimals; Math.floor drops them.',
                ),
            ),
            Python: g(
                t(`형변환 ${c('int()')} · 몫 ${c('//')}`, `Conversion ${c('int()')} · floor division ${c('//')}`),
                t(
                    'int() 는 소수점을 버리거나 "10" 같은 문자열을 정수로 바꿔요. // 는 나눈 몫만 구해요.',
                    'int() drops the decimals, or turns a string like "10" into an int. // gives only the whole part of a division.',
                ),
            ),
        },
        'print-arith': {
            Java: g(
                t(
                    `산술 연산자 ${c('%')} · 복합 대입 ${c('+=')} ${c('++')}`,
                    `Arithmetic ${c('%')} · compound assignment ${c('+=')} ${c('++')}`,
                ),
                t(
                    '+ - * / 는 사칙연산, % 는 나눈 나머지예요. a += 3 은 a = a + 3 을 줄인 것이고, a++ 는 1 을 더해요.',
                    '+ - * / do the four operations, and % gives the remainder. a += 3 is short for a = a + 3, and a++ adds 1.',
                ),
            ),
            JavaScript: g(
                t(
                    `산술 연산자 ${c('%')} · 복합 대입 ${c('+=')} ${c('++')}`,
                    `Arithmetic ${c('%')} · compound assignment ${c('+=')} ${c('++')}`,
                ),
                t(
                    '+ - * / 는 사칙연산, % 는 나눈 나머지예요. a += 3 은 a = a + 3 을 줄인 것이고, a++ 는 1 을 더해요.',
                    '+ - * / do the four operations, and % gives the remainder. a += 3 is short for a = a + 3, and a++ adds 1.',
                ),
            ),
            Python: g(
                t(
                    `산술 연산자 ${c('%')} ${c('**')} · 복합 대입 ${c('+=')}`,
                    `Arithmetic ${c('%')} ${c('**')} · compound assignment ${c('+=')}`,
                ),
                t(
                    '+ - * / 는 사칙연산, % 는 나눈 나머지, ** 는 거듭제곱이에요. a += 3 은 a = a + 3 을 줄인 것이에요.',
                    '+ - * / do the four operations, % gives the remainder and ** is a power. a += 3 is short for a = a + 3.',
                ),
            ),
        },
        'print-compare': {
            Java: g(
                t(
                    `비교 연산자 · 논리 연산자 ${c('&&')} ${c('||')} ${c('!')}`,
                    `Comparison and logical operators ${c('&&')} ${c('||')} ${c('!')}`,
                ),
                t(
                    '== != > < >= <= 는 두 값을 비교해서 true 나 false 를 돌려줘요. && 는 "그리고", || 는 "또는", ! 는 "반대" 예요.',
                    '== != > < >= <= compare two values and give true or false. && means "and", || means "or", ! means "not".',
                ),
            ),
            JavaScript: g(
                t(
                    `비교 연산자 ${c('===')} · 논리 연산자 ${c('&&')} ${c('||')} ${c('!')}`,
                    `Comparison ${c('===')} and logical operators ${c('&&')} ${c('||')} ${c('!')}`,
                ),
                t(
                    '=== !== > < >= <= 는 두 값을 비교해서 true 나 false 를 돌려줘요. && 는 "그리고", || 는 "또는", ! 는 "반대" 예요.',
                    '=== !== > < >= <= compare two values and give true or false. && means "and", || means "or", ! means "not".',
                ),
            ),
            Python: g(
                t(
                    `비교 연산자 · 논리 연산자 ${c('and')} ${c('or')} ${c('not')}`,
                    `Comparison and logical operators ${c('and')} ${c('or')} ${c('not')}`,
                ),
                t(
                    '== != > < >= <= 는 두 값을 비교해서 True 나 False 를 돌려줘요. and 는 "그리고", or 는 "또는", not 은 "반대" 예요.',
                    '== != > < >= <= compare two values and give True or False. and, or and not combine them.',
                ),
            ),
        },
        'pick-if': {
            Java: g(
                t(
                    `조건문 ${c('if')} · ${c('else if')} · ${c('else')}`,
                    `Conditionals ${c('if')} · ${c('else if')} · ${c('else')}`,
                ),
                t(
                    '조건이 true 일 때만 그 { } 블록을 실행해요. 위에서부터 차례로 보고 처음 맞는 갈래 하나만 실행하고, 아무것도 안 맞으면 else 를 실행해요.',
                    'Runs a { } block only when its condition is true. Branches are checked top to bottom, only the first match runs, and else runs if none match.',
                ),
            ),
            JavaScript: g(
                t(
                    `조건문 ${c('if')} · ${c('else if')} · ${c('else')}`,
                    `Conditionals ${c('if')} · ${c('else if')} · ${c('else')}`,
                ),
                t(
                    '조건이 true 일 때만 그 { } 블록을 실행해요. 위에서부터 차례로 보고 처음 맞는 갈래 하나만 실행하고, 아무것도 안 맞으면 else 를 실행해요.',
                    'Runs a { } block only when its condition is true. Branches are checked top to bottom, only the first match runs, and else runs if none match.',
                ),
            ),
            Python: g(
                t(
                    `조건문 ${c('if')} · ${c('elif')} · ${c('else')}`,
                    `Conditionals ${c('if')} · ${c('elif')} · ${c('else')}`,
                ),
                t(
                    '조건이 True 일 때만 그 아래 들여쓴 줄들을 실행해요. 위에서부터 차례로 보고 처음 맞는 갈래 하나만 실행하고, 아무것도 안 맞으면 else 를 실행해요.',
                    'Runs the indented lines below only when the condition is True. Branches are checked top to bottom, only the first match runs, and else runs if none match.',
                ),
            ),
        },
        'pick-string-cond': {
            Java: g(
                t(
                    `문자열 비교 ${c('equals')} · 조건 합치기`,
                    `Comparing strings with ${c('equals')} · combining conditions`,
                ),
                t(
                    'String 은 == 가 아니라 equals 로 글자 내용이 같은지 비교해요. 여러 조건은 && 와 || 로 하나로 합쳐요.',
                    'Compare String contents with equals, not ==. Join several conditions into one with && and ||.',
                ),
            ),
            JavaScript: g(
                t(`문자열 비교 ${c('===')} · 조건 합치기`, `Comparing strings with ${c('===')} · combining conditions`),
                t(
                    '=== 로 두 문자열의 글자가 똑같은지 비교해요(대소문자도 구분해요). 여러 조건은 && 와 || 로 하나로 합쳐요.',
                    '=== checks whether two strings are exactly the same (case matters). Join several conditions into one with && and ||.',
                ),
            ),
            Python: g(
                t(`문자열 비교 ${c('==')} · 조건 합치기`, `Comparing strings with ${c('==')} · combining conditions`),
                t(
                    '== 로 두 문자열의 글자가 똑같은지 비교해요(대소문자도 구분해요). 여러 조건은 and 와 or 로 하나로 합쳐요.',
                    '== checks whether two strings are exactly the same (case matters). Join several conditions into one with and and or.',
                ),
            ),
        },
        'pick-switch': {
            Java: g(
                t(`${c('switch')} 문`, `The ${c('switch')} statement`),
                t(
                    '값 하나를 여러 case 와 차례로 맞춰 보고, 맞는 case 부터 실행해요. break 가 없으면 다음 case 까지 이어서 실행돼요.',
                    'Matches one value against several cases and runs from the matching case. Without break it carries on into the next case.',
                ),
            ),
            JavaScript: g(
                t(`${c('switch')} 문`, `The ${c('switch')} statement`),
                t(
                    '값 하나를 여러 case 와 차례로 맞춰 보고, 맞는 case 부터 실행해요. break 가 없으면 다음 case 까지 이어서 실행돼요.',
                    'Matches one value against several cases and runs from the matching case. Without break it carries on into the next case.',
                ),
            ),
            Python: g(
                t(`${c('match')} / ${c('case')} 문`, `The ${c('match')} / ${c('case')} statement`),
                t(
                    '값 하나를 여러 case 와 차례로 맞춰 보고, 처음 맞는 case 하나만 실행해요. | 로 여러 값을 한 case 에 묶고, case _ 는 나머지 전부예요.',
                    'Matches one value against several cases and runs only the first match. | groups values in one case, and case _ catches everything else.',
                ),
            ),
        },
        'pack-for': {
            Java: g(
                t(`반복문 ${c('for')} · 누적`, `The ${c('for')} loop · running totals`),
                t(
                    'for (시작; 조건; 증가) 로 같은 코드를 여러 번 실행해요. 반복 바깥에 만든 변수에 값을 계속 더하면 합계(누적)가 돼요.',
                    'for (start; condition; step) runs the same code many times. Keep adding to a variable made outside the loop to get a running total.',
                ),
            ),
            JavaScript: g(
                t(`반복문 ${c('for')} · 누적`, `The ${c('for')} loop · running totals`),
                t(
                    'for (시작; 조건; 증가) 로 같은 코드를 여러 번 실행해요. 반복 바깥에 만든 변수에 값을 계속 더하면 합계(누적)가 돼요.',
                    'for (start; condition; step) runs the same code many times. Keep adding to a variable made outside the loop to get a running total.',
                ),
            ),
            Python: g(
                t(`반복문 ${c('for')} · ${c('range')} · 누적`, `The ${c('for')} loop · ${c('range')} · running totals`),
                t(
                    'range(1, 6) 은 1부터 5까지 수를 차례로 내주고, for 는 그 수를 하나씩 받아 반복해요. 반복 바깥에 만든 변수에 계속 더하면 합계(누적)가 돼요.',
                    'range(1, 6) hands out 1 to 5 in turn, and for takes them one by one. Keep adding to a variable made outside the loop to get a running total.',
                ),
            ),
        },
        'pack-while': g(
            t(
                `반복문 ${c('while')} · ${c('break')} · ${c('continue')}`,
                `The ${c('while')} loop · ${c('break')} · ${c('continue')}`,
            ),
            t(
                'while 은 조건이 참인 동안 계속 반복해요. break 는 반복을 바로 끝내고, continue 는 이번 차례만 건너뛰고 다음 차례로 가요.',
                'while repeats as long as its condition is true. break ends the loop at once; continue skips the rest of this round and moves to the next.',
            ),
        ),
        'pack-nested': g(
            t('중첩 반복문', 'Nested loops'),
            t(
                '반복문 안에 반복문을 넣으면, 바깥 반복이 한 번 돌 때 안쪽 반복이 처음부터 끝까지 다 돌아요. 줄 × 칸 모양을 만들 때 써요.',
                'With a loop inside a loop, the inner loop runs all the way through for each single round of the outer one. Used for rows × columns.',
            ),
        ),
        'ship-array': {
            Java: g(
                t('배열 · 인덱스', 'Arrays · indexes'),
                t(
                    '배열은 같은 타입의 값 여러 개를 순서대로 담는 자료구조예요. 칸 번호(인덱스)는 0 부터 시작하고, 칸 수는 .length 로 알아요. 한번 만든 배열은 칸 수가 바뀌지 않아요.',
                    'An array is a data structure holding many values of one type in order. Indexes start at 0 and .length gives the size. An array never changes size once made.',
                ),
            ),
            JavaScript: g(
                t('배열 · 인덱스', 'Arrays · indexes'),
                t(
                    '배열은 값 여러 개를 [ ] 안에 순서대로 담는 자료구조예요. 칸 번호(인덱스)는 0 부터 시작하고, 칸 수는 .length 로 알아요.',
                    'An array is a data structure holding many values in order inside [ ]. Indexes start at 0 and .length gives the size.',
                ),
            ),
            Python: g(
                t('리스트 · 인덱스', 'Lists · indexes'),
                t(
                    '리스트는 값 여러 개를 [ ] 안에 순서대로 담는 자료구조예요. 칸 번호(인덱스)는 0 부터 시작하고, 칸 수는 len() 으로 알아요. -1 은 마지막 칸이에요.',
                    'A list is a data structure holding many values in order inside [ ]. Indexes start at 0 and len() gives the size. -1 is the last item.',
                ),
            ),
        },
        'ship-array-search': {
            Java: g(
                t('배열 순회 · 최댓값 · 개수 세기', 'Walking an array · max · counting'),
                t(
                    '반복문으로 배열 칸을 하나씩 보면서, 지금까지 가장 큰 값이나 조건에 맞은 개수를 변수에 저장해 두는 방법이에요. 칸에 새 값을 넣으면 그 칸 값이 바뀌어요.',
                    'Go through the array with a loop and keep the biggest value so far, or the number of matches, in a variable. Assigning to a slot replaces its value.',
                ),
            ),
            JavaScript: g(
                t('배열 순회 · 최댓값 · 개수 세기', 'Walking an array · max · counting'),
                t(
                    '반복문으로 배열 칸을 하나씩 보면서, 지금까지 가장 큰 값이나 조건에 맞은 개수를 변수에 저장해 두는 방법이에요. 칸에 새 값을 넣으면 그 칸 값이 바뀌어요.',
                    'Go through the array with a loop and keep the biggest value so far, or the number of matches, in a variable. Assigning to a slot replaces its value.',
                ),
            ),
            Python: g(
                t(
                    `리스트 순회 · ${c('max')} ${c('sum')} · 개수 세기`,
                    `Walking a list · ${c('max')} ${c('sum')} · counting`,
                ),
                t(
                    'max · min · sum 은 리스트의 최댓값·최솟값·합계를 바로 구하는 기본 함수예요. 조건에 맞는 개수는 반복문으로 하나씩 보면서 변수에 세어요.',
                    "max, min and sum are built-in functions that give a list's largest, smallest and total. To count matches, loop through and count in a variable.",
                ),
            ),
        },
        'ship-list': {
            Java: g(
                t(`${c('ArrayList')}`, `${c('ArrayList')}`),
                t(
                    '값을 넣으면(add) 늘고 빼면(remove) 줄어드는, 크기가 바뀌는 리스트예요. get(번호) 로 꺼내고, contains · indexOf 로 들어 있는지 찾아요.',
                    'A list that grows when you add and shrinks when you remove. get(index) reads a value; contains and indexOf look for one.',
                ),
            ),
            JavaScript: g(
                t(
                    `배열 메서드 ${c('push')} · ${c('pop')} · ${c('splice')} · ${c('includes')}`,
                    `Array methods ${c('push')} · ${c('pop')} · ${c('splice')} · ${c('includes')}`,
                ),
                t(
                    '배열은 크기가 바뀌어요. push 는 끝에 넣고, pop 은 끝에서 빼고, splice(번호, 1) 은 중간 한 칸을 빼요. includes · indexOf 로 들어 있는지 찾아요.',
                    'Arrays change size. push adds to the end, pop removes from the end, splice(index, 1) removes one from the middle. includes and indexOf look for a value.',
                ),
            ),
            Python: g(
                t(
                    `리스트 메서드 ${c('append')} · ${c('pop')} · ${c('remove')} · ${c('in')}`,
                    `List methods ${c('append')} · ${c('pop')} · ${c('remove')} · ${c('in')}`,
                ),
                t(
                    '리스트는 크기가 바뀌어요. append 는 끝에 넣고, pop 은 번호로 빼고, remove 는 값으로 빼요. 값 in 리스트 로 들어 있는지 확인해요.',
                    'Lists change size. append adds to the end, pop removes by index and remove removes by value. value in list checks membership.',
                ),
            ),
        },
        'load-string': {
            Java: g(
                t(
                    `${c('String')} 메서드 ${c('length')} · ${c('charAt')} · ${c('substring')} · ${c('trim')}`,
                    `${c('String')} methods ${c('length')} · ${c('charAt')} · ${c('substring')} · ${c('trim')}`,
                ),
                t(
                    '문자열은 글자가 0 번부터 순서대로 놓인 값이라 번호로 글자를 꺼내고(charAt) 잘라낼(substring) 수 있어요. 메서드는 원래 문자열을 바꾸지 않고 새 문자열을 돌려줘요.',
                    'A string is characters in order from index 0, so you can read one (charAt) or cut out part (substring). These methods return a new string and leave the original alone.',
                ),
            ),
            JavaScript: g(
                t(
                    `문자열 ${c('length')} · ${c('slice')} · ${c('trim')} · ${c('toUpperCase')}`,
                    `Strings ${c('length')} · ${c('slice')} · ${c('trim')} · ${c('toUpperCase')}`,
                ),
                t(
                    '문자열은 글자가 0 번부터 순서대로 놓인 값이라 번호로 글자를 꺼내고 slice 로 잘라낼 수 있어요. 메서드는 원래 문자열을 바꾸지 않고 새 문자열을 돌려줘요.',
                    'A string is characters in order from index 0, so you can read one by index or cut out part with slice. These methods return a new string and leave the original alone.',
                ),
            ),
            Python: g(
                t(
                    `문자열 ${c('len')} · 슬라이스 ${c('[a:b]')} · ${c('strip')} · ${c('upper')}`,
                    `Strings ${c('len')} · slicing ${c('[a:b]')} · ${c('strip')} · ${c('upper')}`,
                ),
                t(
                    '문자열은 글자가 0 번부터 순서대로 놓인 값이라 s[번호] 로 글자를 꺼내고 s[a:b] 로 잘라낼 수 있어요. 메서드는 원래 문자열을 바꾸지 않고 새 문자열을 돌려줘요.',
                    'A string is characters in order from index 0, so s[i] reads one and s[a:b] cuts out part. These methods return a new string and leave the original alone.',
                ),
            ),
        },
        'load-string-search': {
            Java: g(
                t(
                    `${c('indexOf')} · ${c('contains')} · ${c('replace')} · ${c('split')}`,
                    `${c('indexOf')} · ${c('contains')} · ${c('replace')} · ${c('split')}`,
                ),
                t(
                    'indexOf 는 글자가 몇 번째에 있는지(없으면 -1), contains 는 들어 있는지 알려 줘요. replace 는 바꾼 새 문자열을, split 은 기호로 잘라 만든 배열을 돌려줘요.',
                    'indexOf gives where text is (-1 if missing) and contains says whether it is there. replace returns a changed copy, and split returns an array cut at a symbol.',
                ),
            ),
            JavaScript: g(
                t(
                    `${c('indexOf')} · ${c('includes')} · ${c('replace')} · ${c('split')}`,
                    `${c('indexOf')} · ${c('includes')} · ${c('replace')} · ${c('split')}`,
                ),
                t(
                    'indexOf 는 글자가 몇 번째에 있는지(없으면 -1), includes 는 들어 있는지 알려 줘요. replace 는 바꾼 새 문자열을, split 은 기호로 잘라 만든 배열을 돌려줘요.',
                    'indexOf gives where text is (-1 if missing) and includes says whether it is there. replace returns a changed copy, and split returns an array cut at a symbol.',
                ),
            ),
            Python: g(
                t(
                    `${c('find')} · ${c('in')} · ${c('replace')} · ${c('split')}`,
                    `${c('find')} · ${c('in')} · ${c('replace')} · ${c('split')}`,
                ),
                t(
                    'find 는 글자가 몇 번째에 있는지(없으면 -1), "글자" in s 는 들어 있는지 알려 줘요. replace 는 바꾼 새 문자열을, split 은 기호로 잘라 만든 리스트를 돌려줘요.',
                    'find gives where text is (-1 if missing) and "text" in s says whether it is there. replace returns a changed copy, and split returns a list cut at a symbol.',
                ),
            ),
        },
        'load-format': {
            Java: g(
                t(
                    `서식 출력 ${c('String.format')} · ${c('printf')}`,
                    `Formatting with ${c('String.format')} · ${c('printf')}`,
                ),
                t(
                    '서식 기호 자리에 값을 넣어 모양을 맞춰요. %d 정수, %s 문자열, %.2f 소수 둘째 자리, %,d 천 단위 쉼표, %05d 0 으로 다섯 자리 채우기.',
                    'Values go into format codes to shape them: %d whole number, %s string, %.2f two decimals, %,d thousands commas, %05d zero-pad to five digits.',
                ),
            ),
            JavaScript: g(
                t(
                    `템플릿 문자열 · ${c('toLocaleString')} · ${c('padStart')}`,
                    `Template strings · ${c('toLocaleString')} · ${c('padStart')}`,
                ),
                t(
                    '백틱(`) 문자열 안의 ${ } 자리에 값이 들어가요. toLocaleString 은 천 단위 쉼표를, padStart(5, "0") 은 앞을 0 으로 채워 다섯 자리를, toFixed 는 소수점 자리를 맞춰요.',
                    'Inside a backtick (`) string, values go into ${ } slots. toLocaleString adds thousands commas, padStart(5, "0") zero-pads to five, toFixed sets decimal places.',
                ),
            ),
            Python: g(
                t('f-문자열 서식', 'f-string formatting'),
                t(
                    'f"…{값:서식}…" 으로 값의 모양을 맞춰요. {n:,} 천 단위 쉼표, {n:.2f} 소수 둘째 자리, {n:05} 0 으로 다섯 자리, {s:<6} {n:>5} 칸 맞추기.',
                    'f"…{value:spec}…" shapes a value: {n:,} thousands commas, {n:.2f} two decimals, {n:05} zero-pad to five, {s:<6} {n:>5} line up columns.',
                ),
            ),
        },
        'fork-method': {
            Java: g(
                t('메서드 · 매개변수', 'Methods · parameters'),
                t(
                    '메서드는 코드 묶음에 이름을 붙인 거예요. 이름으로 부르면 그 코드가 실행되고, 매개변수로 값을 넘겨서 부를 때마다 다르게 쓸 수 있어요.',
                    'A method is a named block of code. Calling the name runs it, and parameters let you pass in different values each time.',
                ),
            ),
            JavaScript: g(
                t('함수 · 매개변수', 'Functions · parameters'),
                t(
                    '함수는 코드 묶음에 이름을 붙인 거예요. 이름으로 부르면 그 코드가 실행되고, 매개변수로 값을 넘겨서 부를 때마다 다르게 쓸 수 있어요.',
                    'A function is a named block of code. Calling the name runs it, and parameters let you pass in different values each time.',
                ),
            ),
            Python: g(
                t(`함수 ${c('def')} · 매개변수`, `Functions ${c('def')} · parameters`),
                t(
                    '함수는 코드 묶음에 이름을 붙인 거예요. def 로 만들고 이름으로 부르면 그 코드가 실행되고, 매개변수로 값을 넘겨서 부를 때마다 다르게 쓸 수 있어요.',
                    'A function is a named block of code made with def. Calling the name runs it, and parameters let you pass in different values each time.',
                ),
            ),
        },
        'fork-return': {
            Java: g(
                t(`반환값 ${c('return')} · 반환 타입`, `Return values ${c('return')} · return types`),
                t(
                    'return 은 계산한 값을 부른 곳에 돌려주고 메서드를 끝내요. 무엇을 돌려줄지는 메서드 이름 앞의 타입(int, double …)으로 정하고, 돌려주지 않으면 void 예요.',
                    'return hands a value back to the caller and ends the method. The type before the name (int, double …) says what comes back; void means nothing does.',
                ),
            ),
            JavaScript: g(
                t(`반환값 ${c('return')}`, `Return values ${c('return')}`),
                t(
                    'return 은 계산한 값을 부른 곳에 돌려주고 함수를 끝내요. 돌려받은 값은 변수에 담거나 바로 계산에 써요. return 이 없으면 undefined 가 돌아와요.',
                    'return hands a value back to the caller and ends the function. Store it or use it right away. Without return you get undefined.',
                ),
            ),
            Python: g(
                t(`반환값 ${c('return')}`, `Return values ${c('return')}`),
                t(
                    'return 은 계산한 값을 부른 곳에 돌려주고 함수를 끝내요. 돌려받은 값은 변수에 담거나 바로 계산에 써요. return 이 없으면 None 이 돌아와요.',
                    'return hands a value back to the caller and ends the function. Store it or use it right away. Without return you get None.',
                ),
            ),
        },
        'fork-reuse': {
            Java: g(
                t('배열을 받는 메서드 · 메서드끼리 부르기', 'Methods that take arrays · methods calling methods'),
                t(
                    '매개변수 타입을 int[] 처럼 쓰면 배열을 통째로 넘겨받아요. 메서드 안에서 다른 메서드를 불러, 작은 메서드들을 조립해 큰 일을 해요.',
                    'A parameter typed like int[] takes a whole array. A method can call other methods, so small methods combine into a bigger job.',
                ),
            ),
            JavaScript: g(
                t('배열을 받는 함수 · 함수끼리 부르기', 'Functions that take arrays · functions calling functions'),
                t(
                    '매개변수로 배열을 통째로 넘겨받을 수 있어요. 함수 안에서 다른 함수를 불러, 작은 함수들을 조립해 큰 일을 해요.',
                    'A parameter can take a whole array. A function can call other functions, so small functions combine into a bigger job.',
                ),
            ),
            Python: g(
                t('리스트를 받는 함수 · 함수끼리 부르기', 'Functions that take lists · functions calling functions'),
                t(
                    '매개변수로 리스트를 통째로 넘겨받을 수 있어요. 함수 안에서 다른 함수를 불러, 작은 함수들을 조립해 큰 일을 해요.',
                    'A parameter can take a whole list. A function can call other functions, so small functions combine into a bigger job.',
                ),
            ),
        },
        'part-map': {
            Java: g(
                t(`${c('HashMap')} (해시맵)`, `${c('HashMap')}`),
                t(
                    '키와 값을 짝지어 저장하는 자료구조예요. 배열처럼 번호로 찾는 게 아니라 키로 값을 바로 찾아요. 같은 키는 하나만 있어요. put 넣기·바꾸기, get 꺼내기, containsKey 있는지 확인.',
                    'A data structure that stores key–value pairs. You find a value by its key instead of by an index number, and each key appears once. put adds or replaces, get reads, containsKey checks.',
                ),
            ),
            JavaScript: g(
                t('객체 { 키: 값 }', 'Objects { key: value }'),
                t(
                    '키와 값을 짝지어 저장하는 자료구조예요. 번호가 아니라 키로 값을 바로 찾아요. 같은 키는 하나만 있어요. obj[키] 로 꺼내고 바꾸고, 키 in obj 로 있는지 확인해요.',
                    'A data structure that stores key–value pairs. You find a value by its key, not by a number, and each key appears once. obj[key] reads or changes it; key in obj checks.',
                ),
            ),
            Python: g(
                t(`딕셔너리 ${c('dict')}`, `Dictionaries ${c('dict')}`),
                t(
                    '키와 값을 짝지어 저장하는 자료구조예요. 번호가 아니라 키로 값을 바로 찾아요. 같은 키는 하나만 있어요. d[키] 로 꺼내고 바꾸고, 키 in d 로 있는지 확인해요.',
                    'A data structure that stores key–value pairs. You find a value by its key, not by a number, and each key appears once. d[key] reads or changes it; key in d checks.',
                ),
            ),
        },
        'part-count': {
            Java: g(
                t(
                    `${c('HashMap')} 으로 개수 세기 · ${c('getOrDefault')}`,
                    `Counting with a ${c('HashMap')} · ${c('getOrDefault')}`,
                ),
                t(
                    'HashMap 은 키마다 값이 하나라서, 키를 이름으로 값을 개수로 쓰면 이름별 개수표가 돼요. getOrDefault(키, 0) 은 키가 아직 없으면 0 을 돌려줘요. keySet 으로 모든 키를 돌아요.',
                    'A HashMap keeps one value per key, so names as keys and counts as values make a tally. getOrDefault(key, 0) returns 0 when the key is not there yet. keySet goes through every key.',
                ),
            ),
            JavaScript: g(
                t(`객체로 개수 세기 · ${c('for...in')}`, `Counting with an object · ${c('for...in')}`),
                t(
                    '객체는 키마다 값이 하나라서, 키를 이름으로 값을 개수로 쓰면 이름별 개수표가 돼요. (count[키] || 0) 은 키가 아직 없으면 0 을 써요. for...in 으로 모든 키를 돌아요.',
                    'An object keeps one value per key, so names as keys and counts as values make a tally. (count[key] || 0) uses 0 when the key is not there yet. for...in goes through every key.',
                ),
            ),
            Python: g(
                t(
                    `딕셔너리로 개수 세기 · ${c('get')} · ${c('items')}`,
                    `Counting with a dict · ${c('get')} · ${c('items')}`,
                ),
                t(
                    '딕셔너리는 키마다 값이 하나라서, 키를 이름으로 값을 개수로 쓰면 이름별 개수표가 돼요. d.get(키, 0) 은 키가 아직 없으면 0 을 돌려줘요. items() 로 키와 값을 같이 돌아요.',
                    'A dict keeps one value per key, so names as keys and counts as values make a tally. d.get(key, 0) returns 0 when the key is not there yet. items() goes through keys and values together.',
                ),
            ),
        },
        'rest-class': {
            Java: g(
                t('클래스 · 객체 · 생성자', 'Classes · objects · constructors'),
                t(
                    '클래스는 어떤 값(필드)을 가질지 정한 설계도이고, 객체는 new 로 그 설계도에서 만든 실제 하나예요. 생성자는 객체를 만들 때 필드를 채워요. 객체마다 필드 값은 따로예요.',
                    'A class is a blueprint that lists the values (fields) an object has; an object is one real thing made from it with new. The constructor fills the fields. Each object has its own values.',
                ),
            ),
            JavaScript: g(
                t(`클래스 · 객체 · ${c('constructor')}`, `Classes · objects · ${c('constructor')}`),
                t(
                    '클래스는 어떤 값을 가질지 정한 설계도이고, 객체는 new 로 그 설계도에서 만든 실제 하나예요. constructor 는 객체를 만들 때 this.이름 에 값을 채워요. 객체마다 값은 따로예요.',
                    'A class is a blueprint for what values an object has; an object is one real thing made from it with new. The constructor fills this.name and friends. Each object has its own values.',
                ),
            ),
            Python: g(
                t(`클래스 · 객체 · ${c('__init__')}`, `Classes · objects · ${c('__init__')}`),
                t(
                    '클래스는 어떤 값을 가질지 정한 설계도이고, 객체는 클래스이름() 으로 만든 실제 하나예요. __init__ 은 객체를 만들 때 self.이름 에 값을 채워요. 객체마다 값은 따로예요.',
                    'A class is a blueprint for what values an object has; an object is one real thing made by calling ClassName(). __init__ fills self.name and friends. Each object has its own values.',
                ),
            ),
        },
        'rest-object-method': {
            Java: g(
                t(`인스턴스 메서드 · ${c('this')}`, `Instance methods · ${c('this')}`),
                t(
                    '클래스 안에 만든 메서드는 그 객체의 필드를 읽고 바꿔요. this 는 "지금 이 메서드를 부른 객체 자신" 이에요. 객체 여러 개를 배열이나 리스트에 담아 함께 다룰 수 있어요.',
                    'A method inside a class reads and changes that object\'s fields. this means "the object this method was called on". Many objects can sit in an array or list together.',
                ),
            ),
            JavaScript: g(
                t(`객체의 메서드 · ${c('this')}`, `Object methods · ${c('this')}`),
                t(
                    '클래스 안에 만든 메서드는 그 객체의 값을 읽고 바꿔요. this 는 "지금 이 메서드를 부른 객체 자신" 이에요. 객체 여러 개를 배열에 담아 함께 다룰 수 있어요.',
                    'A method inside a class reads and changes that object\'s values. this means "the object this method was called on". Many objects can sit in an array together.',
                ),
            ),
            Python: g(
                t(`객체의 메서드 · ${c('self')}`, `Object methods · ${c('self')}`),
                t(
                    '클래스 안에 만든 메서드는 그 객체의 값을 읽고 바꿔요. 첫 매개변수 self 는 "지금 이 메서드를 부른 객체 자신" 이에요. 객체 여러 개를 리스트에 담아 함께 다룰 수 있어요.',
                    'A method inside a class reads and changes that object\'s values. Its first parameter, self, is "the object this method was called on". Many objects can sit in a list together.',
                ),
            ),
        },
        'rest-exception': {
            Java: g(
                t(`예외 처리 ${c('try')} / ${c('catch')}`, `Exception handling ${c('try')} / ${c('catch')}`),
                t(
                    '실행 중에 생긴 에러를 예외라고 해요. try 블록에서 예외가 나면 catch 블록이 잡아서, 프로그램이 멈추지 않고 다음 줄로 넘어가요. 예: Integer.parseInt("x") 의 NumberFormatException',
                    'An error raised while running is an exception. If one happens in try, catch handles it and the program carries on. E.g. NumberFormatException from Integer.parseInt("x")',
                ),
            ),
            JavaScript: g(
                t(
                    `에러 처리 ${c('try')} / ${c('catch')} · ${c('throw')}`,
                    `Error handling ${c('try')} / ${c('catch')} · ${c('throw')}`,
                ),
                t(
                    'try 블록에서 에러가 나면 catch 블록이 잡아서, 프로그램이 멈추지 않고 다음 줄로 넘어가요. throw new Error("…") 로 에러를 직접 일으킬 수 있어요.',
                    'If an error happens in try, catch handles it and the program carries on. throw new Error("…") raises an error yourself.',
                ),
            ),
            Python: g(
                t(`예외 처리 ${c('try')} / ${c('except')}`, `Exception handling ${c('try')} / ${c('except')}`),
                t(
                    '실행 중에 생긴 에러를 예외라고 해요. try 블록에서 예외가 나면 except 블록이 잡아서, 프로그램이 멈추지 않고 다음 줄로 넘어가요. 예: int("x") 의 ValueError',
                    'An error raised while running is an exception. If one happens in try, except handles it and the program carries on. E.g. ValueError from int("x")',
                ),
            ),
        },
        'rest-review': g(
            t('종합 복습: 반복문 · 조건문 · 서식 출력', 'Review: loops · conditionals · formatted output'),
            t(
                '새 개념은 없어요. 지금까지 배운 반복문, 조건문, 자료구조, 서식 출력을 한 프로그램 안에서 같이 써요.',
                'No new concept. You use the loops, conditionals, data structures and formatted output learned so far together in one program.',
            ),
        ),

        // ---------- Java 고급 ----------
        'j-encap': g(
            t(`캡슐화 · ${c('private')} · getter / setter`, `Encapsulation · ${c('private')} · getters / setters`),
            t(
                '필드를 private 으로 숨겨 클래스 밖에서 직접 못 바꾸게 하고, getter·setter 메서드로만 읽고 바꾸게 하는 거예요. setter 안에서 잘못된 값을 검사해 막을 수 있어요.',
                'Hide fields with private so code outside the class cannot touch them, and allow reading and changing only through getter and setter methods. A setter can check for bad values.',
            ),
        ),
        'j-inherit': g(
            t(`상속 ${c('extends')} · ${c('@Override')}`, `Inheritance ${c('extends')} · ${c('@Override')}`),
            t(
                '부모 클래스의 필드와 메서드를 그대로 물려받는 자식 클래스를 만드는 거예요. super 로 부모 생성자를 부르고, @Override 로 물려받은 메서드를 새로 덮어써요.',
                "Make a child class that inherits the parent's fields and methods. super calls the parent constructor, and @Override replaces an inherited method.",
            ),
        ),
        'j-interface': g(
            t(`인터페이스 ${c('interface')} · 다형성`, `Interfaces ${c('interface')} · polymorphism`),
            t(
                '인터페이스는 "이 메서드들을 반드시 가진다" 는 약속이에요. 여러 클래스가 같은 인터페이스를 implements 하면, 한 타입의 변수로 다루면서도 클래스마다 다르게 동작해요(다형성).',
                'An interface is a promise that a class has certain methods. When several classes implement it, one variable type can hold any of them, and each behaves its own way (polymorphism).',
            ),
        ),
        'j-static': g(
            t(`${c('static')} 필드 · ${c('static')} 메서드`, `${c('static')} fields · ${c('static')} methods`),
            t(
                'static 은 객체마다 따로 있는 게 아니라 클래스에 하나만 있는 값·메서드예요. 모든 객체가 같은 값을 함께 쓰고, 객체를 만들지 않고 클래스이름.이름 으로 써요.',
                'static means one value or method for the whole class instead of one per object. Every object shares it, and you use it as ClassName.name without making an object.',
            ),
        ),
        'j-enum': g(
            t(`열거형 ${c('enum')}`, `Enums ${c('enum')}`),
            t(
                '정해진 상수 몇 개만 값으로 가질 수 있는 타입이에요. 그 밖의 값은 컴파일 단계에서 막혀요. values() 로 전부 돌고, ordinal() 로 몇 번째인지 알아요.',
                'A type that can only hold a fixed set of constants; anything else is stopped at compile time. values() lists them all and ordinal() gives the position.',
            ),
        ),
        'j-generic': g(
            t(`제네릭 ${c('&lt;T&gt;')}`, `Generics ${c('&lt;T&gt;')}`),
            t(
                '클래스나 메서드를 만들 때 타입 자리를 T 로 비워 두고, 쓸 때 Box&lt;Integer&gt; 처럼 정해요. 코드 하나로 여러 타입을 다루면서, 잘못된 타입은 컴파일 단계에서 막아요.',
                'Leave the type as T when writing a class or method, and fill it in when using it, like Box&lt;Integer&gt;. One piece of code handles many types, and wrong types are caught at compile time.',
            ),
        ),
        'j-collections': g(
            t(`${c('Collections')} 도구 · ${c('Set')}`, `${c('Collections')} helpers · ${c('Set')}`),
            t(
                'Collections.sort · max · reverse 는 리스트를 정렬하고 최댓값을 구하는 도구 메서드예요. Set(HashSet) 은 같은 값을 한 번만 담는 자료구조라 중복이 저절로 빠져요.',
                'Collections.sort, max and reverse are helper methods for sorting a list and finding its max. A Set (HashSet) holds each value only once, so duplicates drop out.',
            ),
        ),
        'j-lambda': g(
            t(`람다식 ${c('x -&gt; …')}`, `Lambdas ${c('x -&gt; …')}`),
            t(
                '이름 없는 짧은 함수예요. removeIf, sort 같은 메서드에 "어떻게 할지" 규칙을 값처럼 넘길 때 써요. 예: b -&gt; b &lt; 5 는 "5 보다 작은가?" 라는 규칙이에요.',
                'A short function with no name, used to pass a "how to do it" rule into methods like removeIf or sort. E.g. b -&gt; b &lt; 5 is the rule "is it under 5?".',
            ),
        ),
        'j-stream': g(
            t(`스트림 ${c('Stream')}`, `Streams ${c('Stream')}`),
            t(
                '리스트의 값들을 filter(고르기) → map(바꾸기) → count · sum · collect(모으기) 단계로 이어서 처리하는 방법이에요. 반복문 없이 무엇을 할지만 차례로 적어요.',
                "A way to process a list's values in chained steps: filter (keep some) → map (change each) → count, sum or collect (gather). You write what to do, step by step, without a loop.",
            ),
        ),
        'j-custom-exception': g(
            t(
                `사용자 정의 예외 · ${c('throw')} · ${c('finally')}`,
                `Custom exceptions · ${c('throw')} · ${c('finally')}`,
            ),
            t(
                'Exception 을 상속해서 내 상황에 맞는 예외 클래스를 만들고, throw 로 던져서 catch 로 잡아요. finally 블록은 예외가 나든 안 나든 항상 실행돼요.',
                'Extend Exception to make an exception class for your situation, throw it, and catch it. A finally block always runs, exception or not.',
            ),
        ),

        // ---------- JavaScript 고급 ----------
        'js-scope': g(
            t('스코프 · 블록 스코프', 'Scope · block scope'),
            t(
                '스코프는 변수가 보이는 범위예요. let · const 변수는 만든 { } 블록 안에서만 보이고, 함수 안에서 만든 변수는 함수가 끝나면 사라져요. 계속 쌓을 값은 바깥에 만들어야 해요.',
                "Scope is where a variable can be seen. let and const live only inside the { } block they were made in, and a function's variables vanish when it ends. A value that keeps adding up must live outside.",
            ),
        ),
        'js-closure': g(
            t('클로저', 'Closures'),
            t(
                '함수가 자기가 만들어진 곳의 변수를 기억하고 계속 쓰는 거예요. 함수를 돌려주는 함수를 부를 때마다, 돌려받은 함수는 자기만의 변수를 따로 갖고 있어요.',
                'A function remembers and keeps using the variables from where it was made. Each time you call a function that returns a function, the returned one has its own separate variables.',
            ),
        ),
        'js-callback': g(
            t('콜백 함수', 'Callback functions'),
            t(
                '다른 함수에 인자로 넘겨서, 그 함수가 필요할 때 대신 불러 주는 함수예요. 함수도 숫자나 문자열처럼 변수에 담고 넘길 수 있는 값이에요.',
                'A function you pass to another function so that it calls yours when needed. Functions are values too, so they can be stored in variables and passed around like numbers or strings.',
            ),
        ),
        'js-map-filter': g(
            t(`배열 메서드 ${c('map')} · ${c('filter')}`, `Array methods ${c('map')} · ${c('filter')}`),
            t(
                'filter 는 함수가 true 를 돌려준 칸만 모은 새 배열을, map 은 칸마다 함수를 적용한 결과로 새 배열을 돌려줘요. 원래 배열은 그대로예요.',
                "filter returns a new array of the items your function returned true for; map returns a new array of your function's result for each item. The original array is untouched.",
            ),
        ),
        'js-reduce-sort': g(
            t(`${c('reduce')} · ${c('sort')}`, `${c('reduce')} · ${c('sort')}`),
            t(
                'reduce 는 배열을 돌면서 값 하나(합계 등)로 모아요. sort 는 (a, b) =&gt; b - a 같은 비교 함수를 받아 그 규칙대로 배열을 줄 세워요. sort 는 원래 배열을 바꿔요.',
                'reduce walks the array and gathers it into one value, like a total. sort takes a compare function such as (a, b) =&gt; b - a and orders the array by it. sort changes the original array.',
            ),
        ),
        'js-destructure': g(
            t('구조 분해 할당 · 스프레드 ...', 'Destructuring · spread ...'),
            t(
                'const { name, weight } = box 처럼 객체·배열에서 필요한 값만 바로 변수로 꺼내요. { ...box, weight: 5 } 는 box 의 키를 모두 펼쳐 복사하고 weight 만 바꾼 새 객체예요.',
                'const { name, weight } = box pulls just the values you need out of an object or array. { ...box, weight: 5 } copies every key of box into a new object and changes only weight.',
            ),
        ),
        'js-json': g(
            t(
                `JSON · ${c('JSON.stringify')} / ${c('JSON.parse')}`,
                `JSON · ${c('JSON.stringify')} / ${c('JSON.parse')}`,
            ),
            t(
                'JSON 은 객체를 주고받기 위한 문자열 형식이에요. JSON.stringify 는 객체 → 문자열, JSON.parse 는 문자열 → 객체로 바꿔요.',
                'JSON is a text format for sending objects around. JSON.stringify turns an object into a string, and JSON.parse turns the string back into an object.',
            ),
        ),
        'js-extends': g(
            t(`상속 ${c('extends')} · ${c('super')}`, `Inheritance ${c('extends')} · ${c('super')}`),
            t(
                '부모 클래스의 값과 메서드를 그대로 물려받는 자식 클래스를 만드는 거예요. super(…) 로 부모의 constructor 를 부르고, 같은 이름의 메서드를 만들면 덮어써요.',
                "Make a child class that inherits the parent's values and methods. super(…) calls the parent constructor, and a method with the same name replaces the inherited one.",
            ),
        ),
        'js-promise': g(
            t(`${c('Promise')} · ${c('then')}`, `${c('Promise')} · ${c('then')}`),
            t(
                'Promise 는 시간이 걸리는 작업의 "나중에 나올 결과" 를 나타내는 객체예요. then 에 넘긴 함수는 작업이 끝난 뒤에 실행되고, catch 는 실패를 잡아요.',
                'A Promise is an object standing for the "result that comes later" of a slow task. The function given to then runs after it finishes, and catch handles failure.',
            ),
        ),
        'js-async': g(
            t(`${c('async')} / ${c('await')}`, `${c('async')} / ${c('await')}`),
            t(
                'await 는 Promise 가 끝날 때까지 기다렸다가 결과를 꺼내요. 그래서 비동기 코드를 위에서 아래로 순서대로 쓸 수 있어요. await 는 async 함수 안에서 쓰고, 실패는 try / catch 로 잡아요.',
                'await waits for a Promise to finish and gives you its result, so async code reads top to bottom. Use await inside an async function, and catch failures with try / catch.',
            ),
        ),

        // ---------- Python 고급 ----------
        'py-comprehension': g(
            t('리스트 · 딕셔너리 컴프리헨션', 'List and dict comprehensions'),
            t(
                '[식 for 변수 in 목록 if 조건] 모양으로, 반복하면서 새 리스트를 한 줄로 만들어요. {키: 값 for …} 는 딕셔너리를 만들어요.',
                '[expr for x in items if cond] builds a new list in one line while looping. {key: value for …} builds a dict.',
            ),
        ),
        'py-lambda-sort': g(
            t(`${c('lambda')} · ${c('sorted(key=)')}`, `${c('lambda')} · ${c('sorted(key=)')}`),
            t(
                'lambda 는 이름 없는 한 줄 함수예요. sorted 의 key 에 넘기면 그 함수가 돌려준 값을 기준으로 정렬하고, reverse=True 면 큰 순서예요.',
                "lambda is a one-line function with no name. Pass it as sorted's key and the list is sorted by what it returns; reverse=True puts the largest first.",
            ),
        ),
        'py-zip': g(
            t(`${c('enumerate')} · ${c('zip')}`, `${c('enumerate')} · ${c('zip')}`),
            t(
                'enumerate 는 (번호, 값) 짝을, zip 은 두 리스트에서 같은 자리 값끼리 짝을 차례로 내줘요. for 에서 두 변수로 바로 받아요.',
                'enumerate hands out (index, value) pairs, and zip hands out pairs of values at the same position in two lists. A for loop takes them straight into two variables.',
            ),
        ),
        'py-args': g(
            t(
                `기본값 · 키워드 인자 · ${c('*args')} / ${c('**kwargs')}`,
                `Defaults · keyword arguments · ${c('*args')} / ${c('**kwargs')}`,
            ),
            t(
                '매개변수에 기본값을 주면 안 넘겨도 돼요. 이름=값 으로 넘기면 순서와 상관없어요. *args 는 남은 인자를 튜플로, **kwargs 는 남은 이름=값 인자를 딕셔너리로 받아요.',
                'A parameter with a default can be left out. Passing name=value ignores order. *args collects extra arguments into a tuple, and **kwargs collects extra name=value ones into a dict.',
            ),
        ),
        'py-closure': g(
            t(`클로저 · ${c('nonlocal')}`, `Closures · ${c('nonlocal')}`),
            t(
                '안쪽 함수가 바깥 함수의 변수를 기억하고 계속 쓰는 거예요. 그 변수를 안쪽에서 바꾸려면 nonlocal 로 알려야 해요. 바깥 함수를 부를 때마다 따로 기억하는 변수가 생겨요.',
                "An inner function remembers and keeps using the outer function's variables. To change one from inside, declare it nonlocal. Each call of the outer function gives a separate set.",
            ),
        ),
        'py-decorator': g(
            t(`데코레이터 ${c('@')}`, `Decorators ${c('@')}`),
            t(
                '함수를 받아서 앞뒤에 기능을 덧붙인 새 함수를 돌려주는 함수예요. 함수 정의 위에 @이름 을 쓰면 그 함수가 데코레이터로 감싸져요.',
                'A function that takes a function and returns a new one with extra behavior around it. Writing @name above a function definition wraps it.',
            ),
        ),
        'py-generator': g(
            t(`제너레이터 ${c('yield')}`, `Generators ${c('yield')}`),
            t(
                'yield 가 들어 있는 함수예요. 값을 하나 내주고 그 자리에서 멈췄다가, 다음 값을 달라고 하면 이어서 실행해요. 값을 한꺼번에 만들어 두지 않아요.',
                'A function containing yield. It hands out one value and pauses there, then carries on when the next value is asked for. Values are not all made up front.',
            ),
        ),
        'py-inherit': g(
            t(`상속 · ${c('super()')}`, `Inheritance · ${c('super()')}`),
            t(
                'class 자식(부모) 로 부모 클래스의 값과 메서드를 그대로 물려받아요. super().__init__(…) 로 부모의 __init__ 을 부르고, 같은 이름의 메서드를 만들면 덮어써요.',
                "class Child(Parent) inherits the parent's values and methods. super().__init__(…) calls the parent's __init__, and a method with the same name replaces the inherited one.",
            ),
        ),
        'py-dunder': g(
            t(
                `특별 메서드 ${c('__str__')} · ${c('__len__')} · ${c('__eq__')}`,
                `Special methods ${c('__str__')} · ${c('__len__')} · ${c('__eq__')}`,
            ),
            t(
                '이름 앞뒤에 __ 가 붙은 메서드예요. 내 클래스에 만들어 두면 print 는 __str__, len 은 __len__, == 는 __eq__ 를 불러서 그 결과를 써요.',
                'Methods with __ on both sides of the name. Define them in your class and print uses __str__, len uses __len__, and == uses __eq__.',
            ),
        ),
        'py-raise': g(
            t(`사용자 정의 예외 · ${c('raise')}`, `Custom exceptions · ${c('raise')}`),
            t(
                'Exception 을 상속해서 내 상황에 맞는 예외 클래스를 만들고, raise 로 일으켜요. except 내예외: 로 그 예외만 골라 잡을 수 있어요.',
                'Inherit from Exception to make an exception class for your situation, and raise it. except MyError: catches just that one.',
            ),
        ),
    };
}

/** 이 퀘스트의 개념 { name, what } (없으면 null). langName: 'Java' | 'JavaScript' | 'Python'. */
export function goalOf(questId, langName) {
    const e = build()[questId];
    if (!e) return null;
    return e.name ? e : e[langName] || e.Java || null;
}

/** 점검용: 개념이 적힌 퀘스트 id 들. */
export const GOAL_IDS = Object.keys(build());
