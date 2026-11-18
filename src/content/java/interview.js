// HQ job interview (Java): one combined question per stage (see ../stages.js), in stage order.
// Right → that stage (and every easier one) counts as known; see src/ui/hire.js. Types: predict (default),
// bug (errorLine / output), fill. choices[0] is the right answer (the game shuffles them). Every answer was checked by running the code.
// Korean and English side by side via t('한국어', 'English'). See PLAN.md §8.
import { tr as t } from '../../i18n.js';

const main = (body) => `public class Main {
    public static void main(String[] args) {
${body
    .split('\n')
    .map((l) => (l ? '        ' + l : l))
    .join('\n')}
    }
}`;

export const INTERVIEW = [
    {
        stage: 'office',
        title: t('print 와 println 섞어 찍기', 'Mixing print and println'),
        code: main(
            `System.out.print("${t('송장', 'Invoice')}");\nSystem.out.println("${t('번호', 'No')}");\nSystem.out.print("${t('확인', 'OK')}");`,
        ),
        choices: [
            t('송장번호\n확인', 'InvoiceNo\nOK'),
            t('송장\n번호\n확인', 'Invoice\nNo\nOK'),
            t('송장번호확인', 'InvoiceNoOK'),
            t('송장 번호\n확인', 'Invoice No\nOK'),
        ],
    },
    {
        stage: 'receiving',
        title: t('int 를 double 에 담기', 'Putting an int into a double'),
        code: main(
            'int boxes = 5;\ndouble half = boxes;\nSystem.out.println(half);\nSystem.out.println(boxes / 2 + half / 2);',
        ),
        choices: ['5.0\n4.5', '5\n4.5', '5.0\n5.0', '5\n5'],
    },
    {
        stage: 'printing',
        title: t('복합 대입과 나머지', 'Compound assignment and remainder'),
        code: main(
            'int qty = 10;\nqty += 5;\nSystem.out.println(qty % 4);\nqty++;\nqty *= 2;\nSystem.out.println(qty);',
        ),
        choices: ['3\n32', '3\n31', '3.75\n32', '3\n30'],
    },
    {
        stage: 'picking',
        title: t('수량으로 등급 나누기', 'Grading by quantity'),
        code: main(
            `int qty = 15;\nif (qty > 5) {\n    System.out.println("${t('보통', 'Medium')}");\n} else if (qty > 10) {\n    System.out.println("${t('많음', 'Many')}");\n} else {\n    System.out.println("${t('적음', 'Few')}");\n}`,
        ),
        choices: [t('보통', 'Medium'), t('많음', 'Many'), t('많음\n보통', 'Many\nMedium'), t('적음', 'Few')],
    },
    {
        stage: 'packing',
        title: t('3씩 늘어나는 for', 'A for loop stepping by 3'),
        code: main(
            'int total = 0;\nfor (int i = 1; i <= 10; i += 3) {\n    total += i;\n}\nSystem.out.println(total);',
        ),
        choices: ['22', '15', '12', '55'],
    },
    {
        stage: 'shipping',
        title: t('배열 값 바꾸고 길이 보기', 'Changing an array, checking its length'),
        code: main(
            'int[] boxes = {3, 8, 5};\nboxes[1] = boxes[0] + boxes[2];\nSystem.out.println(boxes[1] + " " + boxes.length);',
        ),
        choices: ['8 3', '8 2', '3 3', '5 3'],
    },
    {
        stage: 'loading',
        title: t('indexOf 와 substring', 'indexOf and substring'),
        code: main(
            'String code = "BOX-0417";\nSystem.out.println(code.indexOf("-"));\nSystem.out.println(code.substring(4));',
        ),
        choices: ['3\n0417', '4\n0417', '3\n-0417', '4\nBOX-'],
    },
    {
        stage: 'forklift',
        title: t('메서드 안에서 메서드 부르기', 'A method calling a method'),
        code: `public class Main {
    static int twice(int n) {
        return n * 2;
    }

    public static void main(String[] args) {
        System.out.println(twice(twice(3)) + 1);
    }
}`,
        choices: ['13', '7', '12', '10'],
    },
    {
        stage: 'parttime',
        title: t('HashMap 에 같은 키 두 번', 'The same key twice in a HashMap'),
        code: `import java.util.HashMap;

${main(`HashMap<String, Integer> stock = new HashMap<>();\nstock.put("${t('립밤', 'Lip balm')}", 3);\nstock.put("${t('립밤', 'Lip balm')}", 5);\nstock.put("${t('토너', 'Toner')}", 2);\nSystem.out.println(stock.get("${t('립밤', 'Lip balm')}") + " " + stock.size());`)}`,
        choices: ['5 2', '8 2', '5 3', '3 2'],
    },
    {
        stage: 'rest',
        title: t('배열 칸에 값 넣다가', 'Putting a value into an array slot'),
        code: main(
            'int[] shelf = new int[2];\ntry {\n    shelf[2] = 1;\n    System.out.println("A");\n} catch (ArrayIndexOutOfBoundsException e) {\n    System.out.println("B");\n}\nSystem.out.println("C");',
        ),
        choices: ['B\nC', 'A\nC', 'C', 'A\nB\nC'],
    },
    // ───── beyond the basics (Java-only stages): combined questions of other types ─────
    {
        stage: 'j-oop',
        title: t('재고 클래스 필드', 'A stock class field'),
        type: 'bug',
        errorLine: 8,
        code: `class Stock {
    private int qty = 3;
}

public class Main {
    public static void main(String[] args) {
        Stock s = new Stock();
        s.qty = 10;
        System.out.println(s.qty);
    }
}`,
        choices: [
            t(
                '8번째 줄: private 필드를 클래스 밖에서 바꾸려고 해요',
                'Line 8: it changes a private field from outside the class',
            ),
            t('2번째 줄: 필드에 처음 값을 바로 넣을 수 없어요', "Line 2: a field can't have a starting value"),
            t('7번째 줄: 생성자가 없어서 new 를 못 써요', "Line 7: there's no constructor, so new can't be used"),
            t('틀린 곳이 없어요', 'Nothing is wrong'),
        ],
    },
    {
        stage: 'j-tools',
        title: t('static 개수와 enum 순서', 'A static count and enum order'),
        type: 'predict',
        code: main(
            'for (Step s : Step.values()) new Log();\nnew Log();\nSystem.out.println(Log.count + " " + Step.SHIP.ordinal());',
        ).replace(
            'public class Main',
            `enum Step { PICK, PACK, SHIP }

class Log {
    static int count = 0;

    Log() {
        count++;
    }
}

public class Main`,
        ),
        choices: ['4 2', '3 2', '4 3', '1 2'],
    },
    {
        stage: 'j-collect',
        title: t('제네릭 상자와 구역 Set', 'A generic box and a zone set'),
        type: 'fill',
        code: `import java.util.*;

class Box<{{0}}> {
    private T item;

    Box(T item) {
        this.item = item;
    }

    T get() {
        return item;
    }
}

public class Main {
    public static void main(String[] args) {
        Set<String> zones = new {{1}}<>(Arrays.asList("C", "A", "C"));
        Box<Integer> b = new Box<>(zones.size());
        System.out.println(zones + " " + b.get());
    }
}`,
        blanks: [{ size: 2 }, { size: 7 }],
        expected: '[A, C] 2',
        solution: ['T', 'TreeSet'],
        prompt: t(
            '무엇이든 담는 Box 를 완성하고, 구역 이름을 중복 없이 정렬해서 <code>[A, C] 2</code> 가 찍히게 하세요.',
            'Finish the Box that holds anything, and keep zone names sorted without duplicates so it prints <code>[A, C] 2</code>.',
        ),
    },
    {
        stage: 'j-func',
        title: t('removeIf, 스트림, 정렬', 'removeIf, streams, sorting'),
        type: 'predict',
        code: `import java.util.*;

public class Main {
    public static void main(String[] args) {
        List<Integer> kgs = new ArrayList<>(Arrays.asList(9, 2, 14, 5));
        kgs.removeIf(k -> k < 5);
        int total = kgs.stream().filter(k -> k > 6).mapToInt(k -> k).sum();
        kgs.sort((a, b) -> b - a);
        System.out.println(kgs + " " + total);
    }
}`,
        choices: ['[14, 9, 5] 23', '[14, 9, 5] 28', '[5, 9, 14] 23', '[14, 9, 5, 2] 23'],
    },
    {
        stage: 'j-error',
        title: t('과적 예외', 'An overload exception'),
        type: 'bug',
        output: t('1500kg 실음', '1500kg loaded'),
        code: `class OverException extends Exception {
    OverException(String m) {
        super(m);
    }
}

public class Main {
    static void load(int kg) throws OverException {
        if (kg > 1000) new OverException("${t('과적', 'overload')}");
        System.out.println(kg + "${t('kg 실음', 'kg loaded')}");
    }

    public static void main(String[] args) {
        try {
            load(1500);
        } catch (OverException e) {
            System.out.println("${t('멈춤: ', 'Stopped: ')}" + e.getMessage());
        }
    }
}`,
        prompt: t(
            '1500kg 은 멈춰야 하는데 그냥 실려 버려요. 무엇이 문제일까요?',
            "1500kg should stop, but it gets loaded anyway. What's wrong?",
        ),
        choices: [
            t(
                '9번째 줄: new 앞에 throw 가 없어서 예외가 던져지지 않아요',
                "Line 9: there's no throw before new, so nothing is thrown",
            ),
            t('8번째 줄: throws 를 지워야 해요', 'Line 8: throws must be removed'),
            t('16번째 줄: catch 대신 finally 를 써야 해요', 'Line 16: it should be finally, not catch'),
            t('틀린 곳이 없어요', 'Nothing is wrong'),
        ],
    },
];
