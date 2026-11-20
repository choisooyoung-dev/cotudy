// Java quests beyond the basics (after 1회차): encapsulation, inheritance, interfaces, static, enum, generics,
// collections, lambdas, streams, custom exceptions. One quest = one concept. Stages are the Java-only ones in
// ../stages.js. Codes are full Main.java files (run on Java 21; these avoid var / List.of / records).
// Korean and English side by side via t('한국어', 'English'). Explained only in Java terms.
// Every example, predict, fill and write solution was run for real (scripts/daily-check.mjs checks them daily).
import { tr as t } from '../../i18n.js';

/** A Main.java: `head` (imports, other classes) above Main, `body` inside main(). */
const prog = (body, head = '') => `${head ? head + '\n\n' : ''}public class Main {
    public static void main(String[] args) {
${body
    .split('\n')
    .map((l) => (l ? '        ' + l : l))
    .join('\n')}
    }
}`;
const UTIL = 'import java.util.*;';
const STREAM = 'import java.util.*;\nimport java.util.stream.*;';
const P = () => t('이 코드를 실행하면 어떻게 찍힐까요?', 'What will this code print?');

export const QUESTS = [
    // ───────────── 센터장실 · 문센터장 · 객체지향 ─────────────
    {
        id: 'j-encap',
        stage: 'j-oop',
        npc: 'moon',
        title: t('재고를 함부로 못 바꾸게', 'Guarding the stock count'),
        request: [
            t(
                '김사원님, 누가 실수로 재고 수량을 음수로 바꿔 버렸어요.',
                'Kim, someone accidentally set a stock count to a negative number.',
            ),
            t(
                '아무나 바로 못 바꾸고, 정해진 길로만 바꾸게 할 수 있을까요?',
                'Can we make it so nobody changes it directly, only through a set path?',
            ),
        ],
        thanks: t(
            '이제 잘못된 값은 아예 안 들어가네요. 든든해요!',
            "Now bad values can't get in at all. That's reassuring!",
        ),
        concepts: [
            {
                title: t('<code>private</code> 와 getter', '<code>private</code> and a getter'),
                body: t(
                    '필드를 <code>private</code> 으로 숨기고, 읽는 메서드(getter)만 열어 두는 방법이에요. 어디에 무엇을 쓰는지는 예제 주석을 보세요.',
                    'Hide a field with <code>private</code> and open only a method that reads it (a getter). See the comments for what goes where.',
                ),
                code: t(
                    prog(
                        `Stock s = new Stock(12);
// s.qty 를 쓰면 컴파일 에러 (private 이라서)
System.out.println(s.getQty()); // getter 로 읽기 → 12`,
                        `class Stock {
    // private: 이 클래스 안에서만 쓸 수 있어요
    private int qty;

    Stock(int qty) {
        this.qty = qty;
    }

    // getter: 밖에서 읽을 수 있게 열어 둔 메서드
    int getQty() {
        return qty;
    }
}`,
                    ),
                    prog(
                        `Stock s = new Stock(12);
// writing s.qty here is a compile error (it is private)
// read it through the getter → 12
System.out.println(s.getQty());`,
                        `class Stock {
    // private: only usable inside this class
    private int qty;

    Stock(int qty) {
        this.qty = qty;
    }

    // getter: a method opened so others can read it
    int getQty() {
        return qty;
    }
}`,
                    ),
                ),
            },
            {
                title: t('setter 로 검사하고 바꾸기', 'Checking in a setter'),
                body: t(
                    '바꾸는 메서드(setter)를 두면, 바꾸기 전에 값을 <b>검사</b>할 수 있어요. 이렇게 필드를 숨기고 메서드로만 다루는 걸 <b>캡슐화</b>라고 해요.',
                    'With a method that changes the value (a setter), you can <b>check</b> the value first. Hiding fields and handling them only through methods is called <b>encapsulation</b>.',
                ),
                code: prog(
                    'Stock s = new Stock();\ns.setQty(10);\ns.setQty(-3);\nSystem.out.println(s.getQty());',
                    `class Stock {
    private int qty;

    void setQty(int qty) {
        if (qty < 0) {
            System.out.println("${t('음수는 안 돼요', 'No negatives')}");
            return;
        }
        this.qty = qty;
    }

    int getQty() {
        return qty;
    }
}`,
                ),
            },
        ],
        predict: {
            prompt: P(),
            code: prog(
                'Box b = new Box();\nb.add(3);\nb.add(-10);\nSystem.out.println(b.getKg());',
                `class Box {
    private int kg = 5;

    void add(int n) {
        if (n > 0) kg += n;
    }

    int getKg() {
        return kg;
    }
}`,
            ),
            choices: ['8', '-2', '5', '18'],
            answer: 0,
            explain: t(
                'add(3) 은 5 + 3 = 8. add(-10) 은 0 보다 작아서 무시돼요.',
                "add(3) makes 5 + 3 = 8. add(-10) is below 0, so it's ignored.",
            ),
        },
        fill: {
            prompt: t(
                '적재량을 밖에서 바로 못 바꾸게 숨기고, 읽는 메서드를 완성하세요.',
                "Hide the load so it can't be changed directly, and finish the method that reads it.",
            ),
            code: prog(
                `Truck t = new Truck();
t.setLoad(800);
t.setLoad(1500);
System.out.println("${t('적재: ', 'Load: ')}" + t.getLoad() + "kg");`,
                `class Truck {
    {{0}} int load;

    void setLoad(int load) {
        if (load <= 1000) this.load = load;
    }

    int {{1}}() {
        return load;
    }
}`,
            ),
            blanks: [{ size: 7 }, { size: 7 }],
            expected: t('적재: 800kg', 'Load: 800kg'),
            hints: [
                t(
                    '클래스 안에서만 쓰게 하는 키워드, 그리고 아래에서 부르는 메서드 이름.',
                    'The keyword for "inside this class only", and the method name called below.',
                ),
                'private, getLoad',
            ],
            solution: ['private', 'getLoad'],
        },
        write: {
            prompt: t(
                '<code>Price</code> 클래스를 만들어 주세요. <code>private int won</code> 필드, 음수면 무시하는 <code>setWon(int)</code>, 값을 돌려주는 <code>getWon()</code> 이 있어야 해요.',
                'Make a <code>Price</code> class with a <code>private int won</code> field, a <code>setWon(int)</code> that ignores negatives, and a <code>getWon()</code> that returns the value.',
            ),
            starter: prog(
                `Price p = new Price();
p.setWon(3000);
p.setWon(-100);
System.out.println("${t('가격: ', 'Price: ')}" + p.getWon());`,
                `// ${t('Price 클래스를 여기에 만드세요', 'Make the Price class here')}`,
            ),
            expected: t('가격: 3000', 'Price: 3000'),
            mustInclude: [
                {
                    re: 'private\\s+int\\s+won',
                    msg: t(
                        '<code>private int won</code> 필드를 만들어 주세요.',
                        'Make a <code>private int won</code> field.',
                    ),
                },
                {
                    re: 'int\\s+getWon\\s*\\(',
                    msg: t('<code>getWon()</code> 메서드를 만들어 주세요.', 'Make a <code>getWon()</code> method.'),
                },
            ],
            hints: ['void setWon(int won) { if (won >= 0) this.won = won; }', 'int getWon() { return won; }'],
            solution: prog(
                `Price p = new Price();
p.setWon(3000);
p.setWon(-100);
System.out.println("${t('가격: ', 'Price: ')}" + p.getWon());`,
                `class Price {
    private int won;

    void setWon(int won) {
        if (won >= 0) this.won = won;
    }

    int getWon() {
        return won;
    }
}`,
            ),
        },
        learned: [
            t('<code>private</code> → 그 클래스 안에서만', '<code>private</code> → inside that class only'),
            t('getter 로 읽고, setter 로 검사하며 바꾸기', 'Read with a getter, change with a checking setter'),
            t('캡슐화: 필드는 숨기고 메서드로 다루기', 'Encapsulation: hide fields, use methods'),
        ],
    },
    {
        id: 'j-inherit',
        stage: 'j-oop',
        npc: 'moon',
        title: t('파손주의 상품 카드', 'Fragile product cards'),
        request: [
            t(
                '상품 카드에 "파손주의" 상품만 따로 표시하고 싶어요.',
                'I want product cards to mark "fragile" products separately.',
            ),
            t(
                '기존 Item 클래스는 그대로 두고 기능만 더할 수 있을까요?',
                'Can we add that without touching the existing Item class?',
            ),
        ],
        thanks: t(
            '물려받아서 늘리니까 기존 코드는 손댈 필요가 없네요!',
            'Building on it by inheritance means no touching the old code!',
        ),
        concepts: [
            {
                title: t(
                    '<code>extends</code> 와 <code>super(…)</code>',
                    '<code>extends</code> and <code>super(…)</code>',
                ),
                body: t(
                    '<code>class 자식 extends 부모</code> 로 만들면 부모의 필드와 메서드를 물려받아요. 부모에 생성자가 있으면, 자식 생성자 첫 줄에서 <code>super(…)</code> 로 불러 줘야 해요.',
                    "Declare <code>class Child extends Parent</code> to inherit the parent's fields and methods. If the parent has a constructor, call it with <code>super(…)</code> on the first line of the child's constructor.",
                ),
                code: prog(
                    `Fragile f = new Fragile("${t('유리병 토너', 'Glass toner')}");
System.out.println(f.label());`,
                    `class Item {
    String name;

    Item(String name) {
        this.name = name;
    }

    String label() {
        return "[${t('상품', 'Item')}] " + name;
    }
}

class Fragile extends Item {
    Fragile(String name) {
        super(name);
    }
}`,
                ),
            },
            {
                title: t('<code>@Override</code>: 덮어쓰기', '<code>@Override</code>: overriding'),
                body: t(
                    '자식에서 부모와 같은 메서드를 다시 만들면 <b>덮어써요</b>. <code>@Override</code> 를 붙이면 이름이 틀렸을 때 컴파일러가 알려 줘요. 변수 타입이 <code>Item</code> 이어도, 실제 객체가 Fragile 이면 Fragile 의 메서드가 불려요.',
                    "Writing the same method again in the child <b>overrides</b> it. Add <code>@Override</code> and the compiler tells you if the name is wrong. Even if the variable type is <code>Item</code>, a real Fragile object runs Fragile's method.",
                ),
                code: prog(
                    `Item a = new Item("${t('립밤', 'Lip balm')}");
Item b = new Fragile("${t('유리병 토너', 'Glass toner')}", 3);
System.out.println(a.label());
System.out.println(b.label());`,
                    `class Item {
    String name;

    Item(String name) {
        this.name = name;
    }

    String label() {
        return "[${t('상품', 'Item')}] " + name;
    }
}

class Fragile extends Item {
    int level;

    Fragile(String name, int level) {
        super(name);
        this.level = level;
    }

    @Override
    String label() {
        return super.label() + " (${t('파손주의', 'fragile')} " + level + ")";
    }
}`,
                ),
            },
        ],
        predict: {
            prompt: P(),
            code: prog(
                'Box a = new Box();\nBox b = new BigBox();\nSystem.out.println(a.size() + "/" + b.size());',
                `class Box {
    String size() {
        return "${t('보통', 'medium')}";
    }
}

class BigBox extends Box {
    @Override
    String size() {
        return "${t('큼', 'big')}";
    }
}`,
            ),
            choices: [
                t('보통/큼', 'medium/big'),
                t('보통/보통', 'medium/medium'),
                t('큼/큼', 'big/big'),
                t('큼/보통', 'big/medium'),
            ],
            answer: 0,
            explain: t(
                'b 의 타입은 Box 지만 실제 객체는 BigBox 라서, 덮어쓴 size() 가 불려요.',
                "b's type is Box, but the real object is a BigBox, so the overriding size() runs.",
            ),
        },
        fill: {
            prompt: t('냉장 트럭이 트럭을 물려받게 하세요.', 'Make the cold truck inherit from Truck.'),
            code: prog(
                `ColdTruck t = new ColdTruck("${t('냉장 1호', 'Cold 1')}", -5);
System.out.println(t.no + " " + t.temp + "${t('도', '°C')}");`,
                `class Truck {
    String no;

    Truck(String no) {
        this.no = no;
    }
}

class ColdTruck {{0}} Truck {
    int temp;

    ColdTruck(String no, int temp) {
        {{1}}(no);
        this.temp = temp;
    }
}`,
            ),
            blanks: [{ size: 7 }, { size: 5 }],
            expected: t('냉장 1호 -5도', 'Cold 1 -5°C'),
            hints: [
                t(
                    '물려받는 키워드, 부모 생성자를 부르는 키워드.',
                    'The keyword to inherit, and the one that calls the parent constructor.',
                ),
                'extends, super',
            ],
            solution: ['extends', 'super'],
        },
        write: {
            prompt: t(
                '<code>Staff</code> 클래스(이름 name, <code>hello()</code> 는 "안녕하세요, 이름")를 만들고, 물려받은 <code>Driver</code>(차 car 추가, hello 는 부모 인사 뒤에 " (차)")를 만들어 윤기사(1톤)의 인사를 찍어 주세요.',
                'Make a <code>Staff</code> class (name; <code>hello()</code> returns "Hello, name") and a <code>Driver</code> that inherits it (adds car; hello is the parent greeting plus " (car)"). Print the greeting of Yoon (1-ton).',
            ),
            starter: prog(
                `System.out.println(new Driver("${t('윤기사', 'Yoon')}", "${t('1톤', '1-ton')}").hello());`,
                `// ${t('Staff 와 Driver 를 여기에 만드세요', 'Make Staff and Driver here')}`,
            ),
            expected: t('안녕하세요, 윤기사 (1톤)', 'Hello, Yoon (1-ton)'),
            mustInclude: [
                {
                    re: 'class\\s+Driver\\s+extends\\s+Staff',
                    msg: t(
                        '<code>class Driver extends Staff</code> 로 물려받아 주세요.',
                        'Inherit with <code>class Driver extends Staff</code>.',
                    ),
                },
                {
                    re: 'super',
                    msg: t('<code>super</code> 로 부모를 불러 주세요.', 'Call the parent with <code>super</code>.'),
                },
            ],
            hints: [
                t('Driver 생성자: super(name); this.car = car;', 'Driver constructor: super(name); this.car = car;'),
                'return super.hello() + " (" + car + ")";',
            ],
            solution: prog(
                `System.out.println(new Driver("${t('윤기사', 'Yoon')}", "${t('1톤', '1-ton')}").hello());`,
                `class Staff {
    String name;

    Staff(String name) {
        this.name = name;
    }

    String hello() {
        return "${t('안녕하세요, ', 'Hello, ')}" + name;
    }
}

class Driver extends Staff {
    String car;

    Driver(String name, String car) {
        super(name);
        this.car = car;
    }

    @Override
    String hello() {
        return super.hello() + " (" + car + ")";
    }
}`,
            ),
        },
        learned: [
            t('<code>class 자식 extends 부모</code>', '<code>class Child extends Parent</code>'),
            t(
                '자식 생성자 첫 줄에 <code>super(…)</code>',
                "<code>super(…)</code> on the child constructor's first line",
            ),
            t(
                '<code>@Override</code> 로 덮어쓰기, <code>super.메서드()</code>',
                'Override with <code>@Override</code>; <code>super.method()</code>',
            ),
        ],
    },
    {
        id: 'j-interface',
        stage: 'j-oop',
        npc: 'moon',
        title: t('포장 방법 갈아 끼우기', 'Swappable packing methods'),
        request: [
            t(
                '상품마다 포장 방법이 달라요. 뽁뽁이, 상자, 냉매…',
                'Each product packs differently: bubble wrap, a box, ice packs…',
            ),
            t(
                '"포장한다"는 약속만 정해 두고, 방법은 갈아 끼울 수 있게 해 주세요.',
                'Set just the promise "it packs" and let the method be swapped in.',
            ),
        ],
        thanks: t('새 포장 방법이 생겨도 클래스 하나만 더하면 되네요!', 'A new packing method is just one more class!'),
        concepts: [
            {
                title: t(
                    '<code>interface</code> 와 <code>implements</code>',
                    '<code>interface</code> and <code>implements</code>',
                ),
                body: t(
                    '<code>interface</code> 는 "이런 메서드가 있다" 는 <b>약속</b>만 적어요. 약속을 채우는 법은 예제 주석을 보세요.',
                    'An <code>interface</code> only writes a <b>promise</b>: "these methods exist". See the comments for how a class fills in the promise.',
                ),
                code: t(
                    prog(
                        `// 인터페이스 타입 변수에 채운 클래스의 객체를 담아요
Packer p = new BubblePacker();
System.out.println(p.pack("유리병"));`,
                        `interface Packer {
    // 약속: { } 몸통 없이 메서드 모양만
    String pack(String item);
}

// implements: 이 약속을 채우겠다
class BubblePacker implements Packer {
    // 인터페이스 메서드는 public 이라 public 을 붙여요
    public String pack(String item) {
        return item + " → 뽁뽁이";
    }
}`,
                    ),
                    prog(
                        `// an interface-type variable holds an object of the class that fills it in
Packer p = new BubblePacker();
System.out.println(p.pack("Glass bottle"));`,
                        `interface Packer {
    // the promise: just the method shape, no { } body
    String pack(String item);
}

// implements: this class fills in the promise
class BubblePacker implements Packer {
    // interface methods are public, so add public
    public String pack(String item) {
        return item + " → bubble wrap";
    }
}`,
                    ),
                ),
            },
            {
                title: t('여러 구현을 한 타입으로', 'Many implementations, one type'),
                body: t(
                    '인터페이스 타입의 리스트에는 그 약속을 지킨 객체라면 무엇이든 넣을 수 있어요. 같은 <code>p.pack(…)</code> 인데 객체마다 다르게 동작해요. 이걸 <b>다형성</b>이라고 해요.',
                    'A list of the interface type can hold any object that keeps the promise. The same <code>p.pack(…)</code> behaves differently for each object. This is <b>polymorphism</b>.',
                ),
                code: prog(
                    `List<Packer> list = new ArrayList<>();
list.add(new BubblePacker());
list.add(new BoxPacker());
for (Packer p : list) {
    System.out.println(p.pack("${t('토너', 'Toner')}"));
}`,
                    `${UTIL}

interface Packer {
    String pack(String item);
}

class BubblePacker implements Packer {
    public String pack(String item) {
        return item + " → ${t('뽁뽁이', 'bubble wrap')}";
    }
}

class BoxPacker implements Packer {
    public String pack(String item) {
        return item + " → ${t('상자', 'box')}";
    }
}`,
                ),
            },
        ],
        predict: {
            prompt: P(),
            code: prog(
                `Fee[] fees = { new Normal(), new Express() };
int sum = 0;
for (Fee f : fees) sum += f.of(10);
System.out.println(sum);`,
                `interface Fee {
    int of(int kg);
}

class Normal implements Fee {
    public int of(int kg) {
        return kg * 100;
    }
}

class Express implements Fee {
    public int of(int kg) {
        return kg * 100 + 3000;
    }
}`,
            ),
            choices: ['5000', '2000', '4000', '3000'],
            answer: 0,
            explain: t(
                'Normal 은 10 × 100 = 1000, Express 는 1000 + 3000 = 4000. 합쳐서 5000.',
                'Normal gives 10 × 100 = 1000, Express gives 1000 + 3000 = 4000. Together 5000.',
            ),
        },
        fill: {
            prompt: t('Bell 이 Alarm 약속을 지키게 하세요.', 'Make Bell keep the Alarm promise.'),
            code: prog(
                'Alarm a = new Bell();\nSystem.out.println(a.ring());',
                `interface Alarm {
    String ring();
}

class Bell {{0}} Alarm {
    {{1}} String ring() {
        return "${t('띵동', 'Ding-dong')}";
    }
}`,
            ),
            blanks: [{ size: 10 }, { size: 6 }],
            expected: t('띵동', 'Ding-dong'),
            hints: [
                t(
                    '인터페이스를 채우는 키워드, 그리고 인터페이스 메서드는 항상…?',
                    'The keyword that fills an interface; and interface methods are always…?',
                ),
                'implements, public',
            ],
            solution: ['implements', 'public'],
        },
        write: {
            prompt: t(
                '<code>interface Shipper</code> (메서드 <code>String send(String box)</code>) 를 만들고, <code>Truck</code>("트럭: 상자")과 <code>Bike</code>("오토바이: 상자")가 이를 지키게 한 뒤, 둘 다 "A-1" 을 보내 찍어 주세요.',
                'Make <code>interface Shipper</code> (method <code>String send(String box)</code>), have <code>Truck</code> ("Truck: box") and <code>Bike</code> ("Bike: box") implement it, then send "A-1" with both and print it.',
            ),
            starter: prog(
                `Shipper[] list = { new Truck(), new Bike() };
for (Shipper s : list) {
    System.out.println(s.send("A-1"));
}`,
                `// ${t('Shipper, Truck, Bike 를 여기에 만드세요', 'Make Shipper, Truck and Bike here')}`,
            ),
            expected: t('트럭: A-1\n오토바이: A-1', 'Truck: A-1\nBike: A-1'),
            mustInclude: [
                {
                    re: 'interface\\s+Shipper',
                    msg: t('<code>interface Shipper</code> 를 만들어 주세요.', 'Make <code>interface Shipper</code>.'),
                },
                {
                    re: 'implements\\s+Shipper',
                    msg: t(
                        '<code>implements Shipper</code> 로 약속을 지켜 주세요.',
                        'Keep the promise with <code>implements Shipper</code>.',
                    ),
                },
            ],
            hints: [
                'interface Shipper { String send(String box); }',
                t(
                    'class Truck implements Shipper { public String send(String box) { return "트럭: " + box; } }',
                    'class Truck implements Shipper { public String send(String box) { return "Truck: " + box; } }',
                ),
            ],
            solution: prog(
                `Shipper[] list = { new Truck(), new Bike() };
for (Shipper s : list) {
    System.out.println(s.send("A-1"));
}`,
                `interface Shipper {
    String send(String box);
}

class Truck implements Shipper {
    public String send(String box) {
        return "${t('트럭: ', 'Truck: ')}" + box;
    }
}

class Bike implements Shipper {
    public String send(String box) {
        return "${t('오토바이: ', 'Bike: ')}" + box;
    }
}`,
            ),
        },
        learned: [
            t('<code>interface</code> = 메서드 약속', '<code>interface</code> = a promise of methods'),
            t(
                '<code>implements</code> 로 채우기, 메서드는 <code>public</code>',
                'Fill it with <code>implements</code>; methods are <code>public</code>',
            ),
            t('다형성: 같은 호출, 객체마다 다른 동작', 'Polymorphism: same call, different behavior per object'),
        ],
    },

    // ───────────── 지게차 통로 · 최기사 · static · enum ─────────────
    {
        id: 'j-static',
        stage: 'j-tools',
        npc: 'choi',
        title: t('모든 지게차가 함께 쓰는 운행 기록', 'A trip log shared by every forklift'),
        request: [
            t(
                '지게차마다 자기 운행 횟수도 세고, 센터 전체 횟수도 세고 싶어요.',
                "I want each forklift's own trip count, and also the whole center's.",
            ),
            t(
                '전체 횟수는 모든 지게차가 하나를 같이 써야겠죠?',
                'The total should be one number they all share, right?',
            ),
        ],
        thanks: t(
            '각자 것과 다 같이 쓰는 것이 깔끔하게 나뉘었어요!',
            'Their own and the shared one are cleanly split!',
        ),
        concepts: [
            {
                title: t('<code>static</code> 필드: 다 같이 쓰는 값', '<code>static</code> fields: one value for all'),
                body: t(
                    '그냥 필드는 객체마다 따로 있어요. <code>static</code> 필드는 <b>클래스에 하나</b>만 있어서 모든 객체가 같이 써요. <code>클래스이름.필드</code> 로 읽어요.',
                    'A normal field exists separately in every object. A <code>static</code> field exists <b>once, in the class</b>, shared by all objects. Read it with <code>ClassName.field</code>.',
                ),
                code: prog(
                    `Forklift a = new Forklift();
Forklift b = new Forklift();
a.drive();
a.drive();
b.drive();
System.out.println(a.mine + " " + b.mine + " " + Forklift.total);`,
                    `class Forklift {
    static int total = 0;
    int mine = 0;

    void drive() {
        mine++;
        total++;
    }
}`,
                ),
            },
            {
                title: t(
                    '<code>static</code> 메서드: 객체 없이 부르기',
                    '<code>static</code> methods: calling without an object',
                ),
                body: t(
                    '<code>static</code> 메서드는 객체를 만들지 않고 클래스 이름으로 불러요. static 메서드 안에서는 static 이 아닌 필드를 바로 못 써요.',
                    'A <code>static</code> method is called through the class name, without making an object. A static method can not use non-static fields directly.',
                ),
                code: t(
                    prog(
                        `// 클래스이름.메서드(), new 없이 → 1500
System.out.println(Calc.fee(10));
// Math.max 도 static 메서드 (main 도 static) → 7
System.out.println(Math.max(3, 7));`,
                        `class Calc {
    static int fee(int kg) { // static 메서드
        return kg * 150;
    }
}`,
                    ),
                    prog(
                        `// ClassName.method(), no new → 1500
System.out.println(Calc.fee(10));
// Math.max is a static method too (so is main) → 7
System.out.println(Math.max(3, 7));`,
                        `class Calc {
    static int fee(int kg) { // a static method
        return kg * 150;
    }
}`,
                    ),
                ),
            },
        ],
        predict: {
            prompt: P(),
            code: prog(
                'new Counter();\nnew Counter();\nCounter c = new Counter();\nSystem.out.println(c.n + Counter.n);',
                `class Counter {
    static int n = 0;

    Counter() {
        n++;
    }
}`,
            ),
            choices: ['6', '3', '1', '2'],
            answer: 0,
            explain: t(
                '객체를 3개 만들어 n 은 3. c.n 과 Counter.n 은 같은 하나의 값이라 3 + 3 = 6.',
                'Three objects make n 3. c.n and Counter.n are the same single value, so 3 + 3 = 6.',
            ),
        },
        fill: {
            prompt: t(
                '라벨 출력 수를 모두 같이 세고, 객체 없이 라벨을 만드세요.',
                'Count labels printed in one shared number, and make labels without an object.',
            ),
            code: prog(
                `System.out.println(Label.{{1}}("A1"));
System.out.println(Label.make("A2"));
System.out.println("${t('출력: ', 'Printed: ')}" + Label.printed${t(' + "장"', '')});`,
                `class Label {
    {{0}} int printed = 0;

    static String make(String code) {
        printed++;
        return "[" + code + "]";
    }
}`,
            ),
            blanks: [{ size: 6 }, { size: 4 }],
            expected: t('[A1]\n[A2]\n출력: 2장', '[A1]\n[A2]\nPrinted: 2'),
            hints: [
                t(
                    'static 메서드 안에서 쓰는 필드도 static 이어야 해요. 부를 메서드 이름은?',
                    'A field used in a static method must be static too. Which method do you call?',
                ),
                'static, make',
            ],
            solution: ['static', 'make'],
        },
        write: {
            prompt: t(
                '<code>Trip</code> 클래스에 <code>static int count</code> 를 두고 생성자에서 1씩 늘리세요. <code>static String report()</code> 는 "운행 N회" 를 돌려줘요. Trip 을 3번 만든 뒤 report() 를 찍어 주세요.',
                'Give <code>Trip</code> a <code>static int count</code> that the constructor increases by 1. <code>static String report()</code> returns "N trips". Make 3 Trips, then print report().',
            ),
            starter: prog(
                'new Trip();\nnew Trip();\nnew Trip();\nSystem.out.println(Trip.report());',
                `// ${t('Trip 클래스를 여기에 만드세요', 'Make the Trip class here')}`,
            ),
            expected: t('운행 3회', '3 trips'),
            mustInclude: [
                {
                    re: 'static\\s+int\\s+count',
                    msg: t('<code>static int count</code> 를 만들어 주세요.', 'Make <code>static int count</code>.'),
                },
                {
                    re: 'static\\s+String\\s+report',
                    msg: t(
                        '<code>static String report()</code> 를 만들어 주세요.',
                        'Make <code>static String report()</code>.',
                    ),
                },
            ],
            hints: [
                'Trip() { count++; }',
                t(
                    'static String report() { return "운행 " + count + "회"; }',
                    'static String report() { return count + " trips"; }',
                ),
            ],
            solution: prog(
                'new Trip();\nnew Trip();\nnew Trip();\nSystem.out.println(Trip.report());',
                `class Trip {
    static int count = 0;

    Trip() {
        count++;
    }

    static String report() {
        return ${t('"운행 " + count + "회"', 'count + " trips"')};
    }
}`,
            ),
        },
        learned: [
            t(
                '<code>static</code> 필드 = 클래스에 하나, 다 같이 씀',
                '<code>static</code> field = one per class, shared',
            ),
            t('<code>클래스.메서드()</code> 로 부르는 static 메서드', 'Static methods: <code>Class.method()</code>'),
            t('static 메서드에선 static 필드만 바로 씀', 'Static methods use only static fields directly'),
        ],
    },
    {
        id: 'j-enum',
        stage: 'j-tools',
        npc: 'choi',
        title: t('배송 단계 정해 두기', 'Fixed shipping steps'),
        request: [
            t(
                '작업 단계를 문자열로 적었더니 "PAK", "pack" 처럼 오타가 자꾸 나요.',
                'Writing work steps as strings keeps causing typos like "PAK" and "pack".',
            ),
            t('정해진 값만 쓸 수 있게 할 수 없을까요?', 'Can we allow only a fixed set of values?'),
        ],
        thanks: t('정해진 값만 쓰니까 오타가 날 일이 없네요!', "With a fixed set, there's no room for typos!"),
        concepts: [
            {
                title: t('<code>enum</code>: 정해진 값들', '<code>enum</code>: a fixed set of values'),
                body: t(
                    '<code>enum</code> 은 쓸 수 있는 값을 정해 둔 타입이에요. 정해 두지 않은 값을 쓰면 컴파일 에러가 나요.',
                    'An <code>enum</code> is a type with a fixed set of values. Using a value that is not in the set is a compile error.',
                ),
                code: t(
                    prog(
                        `Status s = Status.LOADING;
System.out.println(s); // → LOADING
// enum 비교는 == → true
System.out.println(s == Status.LOADING);
// ordinal(): 0 부터 센 순서 → 1
System.out.println(s.ordinal());`,
                        '// enum 이름 { 값, 값, 값 }\nenum Status { READY, LOADING, DONE }',
                    ),
                    prog(
                        `Status s = Status.LOADING;
System.out.println(s); // → LOADING
// compare enums with == → true
System.out.println(s == Status.LOADING);
// ordinal(): position counted from 0 → 1
System.out.println(s.ordinal());`,
                        '// enum Name { value, value, value }\nenum Status { READY, LOADING, DONE }',
                    ),
                ),
            },
            {
                title: t(
                    '<code>values()</code> 와 <code>switch</code>',
                    '<code>values()</code> and <code>switch</code>',
                ),
                body: t(
                    'enum 의 값을 모두 돌면서 <code>switch</code> 로 나눠요. 쓰는 법은 예제 주석을 보세요.',
                    'Go through every value of an enum and branch with <code>switch</code>. See the comments for how.',
                ),
                code: t(
                    prog(
                        `// values(): 모든 값을 순서대로 담은 배열
for (Status s : Status.values()) {
    switch (s) {
        case READY: // case 에는 Status. 없이 값 이름만
            System.out.println(s + ": 대기");
            break;
        case LOADING:
            System.out.println(s + ": 싣는 중");
            break;
        default:
            System.out.println(s + ": 끝");
    }
}`,
                        'enum Status { READY, LOADING, DONE }',
                    ),
                    prog(
                        `// values(): an array of every value in order
for (Status s : Status.values()) {
    switch (s) {
        // case labels use just the value name, no Status.
        case READY:
            System.out.println(s + ": waiting");
            break;
        case LOADING:
            System.out.println(s + ": loading");
            break;
        default:
            System.out.println(s + ": done");
    }
}`,
                        'enum Status { READY, LOADING, DONE }',
                    ),
                ),
            },
        ],
        predict: {
            prompt: P(),
            code: prog(
                'Size a = Size.M;\nSystem.out.println(a.ordinal() + " " + Size.values().length);',
                'enum Size { S, M, L }',
            ),
            choices: ['1 3', '2 3', 'M 3', '1 2'],
            answer: 0,
            explain: t(
                'ordinal 은 0 부터라 S=0, M=1. 값은 모두 3개.',
                'ordinal starts at 0, so S=0 and M=1. There are 3 values.',
            ),
        },
        fill: {
            prompt: t(
                'B 구역으로 정하고, 구역이 모두 몇 개인지 찍으세요.',
                'Set the zone to B, then print how many zones there are.',
            ),
            code: prog(
                `Zone z = Zone.{{0}};
switch (z) {
    case A:
        System.out.println("${t('1층', '1F')}");
        break;
    case B:
        System.out.println("${t('2층', '2F')}");
        break;
    default:
        System.out.println("${t('3층', '3F')}");
}
System.out.println(Zone.{{1}}().length + "${t('개 구역', ' zones')}");`,
                'enum Zone { A, B, C }',
            ),
            blanks: [{ size: 2 }, { size: 6 }],
            expected: t('2층\n3개 구역', '2F\n3 zones'),
            hints: [
                t(
                    '2층이 나오는 값, 모든 값을 배열로 주는 메서드.',
                    'The value that prints 2F, and the method that gives every value as an array.',
                ),
                'B, values',
            ],
            solution: ['B', 'values'],
        },
        write: {
            prompt: t(
                '<code>enum Step { PICK, PACK, SHIP }</code> 를 만들고, <code>values()</code> 로 돌면서 "번호. 이름" 을 찍어 주세요 (번호는 ordinal + 1).',
                'Make <code>enum Step { PICK, PACK, SHIP }</code> and loop with <code>values()</code>, printing "number. name" (number = ordinal + 1).',
            ),
            starter: prog(
                `// ${t('여기에 코드를 쓰세요', 'Write your code here')}`,
                `// ${t('enum Step 을 여기에 만드세요', 'Make enum Step here')}`,
            ),
            expected: '1. PICK\n2. PACK\n3. SHIP',
            mustInclude: [
                {
                    re: 'enum\\s+Step',
                    msg: t('<code>enum Step</code> 을 만들어 주세요.', 'Make <code>enum Step</code>.'),
                },
                {
                    re: 'values\\s*\\(',
                    msg: t('<code>Step.values()</code> 로 돌아 주세요.', 'Loop with <code>Step.values()</code>.'),
                },
            ],
            hints: ['for (Step s : Step.values()) { … }', 'System.out.println((s.ordinal() + 1) + ". " + s);'],
            solution: prog(
                'for (Step s : Step.values()) {\n    System.out.println((s.ordinal() + 1) + ". " + s);\n}',
                'enum Step { PICK, PACK, SHIP }',
            ),
        },
        learned: [
            t('<code>enum</code> = 정해진 값만 쓰는 타입', '<code>enum</code> = a type with fixed values'),
            t(
                '<code>==</code> 비교, <code>ordinal()</code> 은 0 부터',
                'Compare with <code>==</code>; <code>ordinal()</code> starts at 0',
            ),
            t(
                '<code>values()</code> 로 돌기, switch 에는 값 이름만',
                'Loop with <code>values()</code>; switch uses bare names',
            ),
        ],
    },

    // ───────────── 출고장 · 오팀원 · 제네릭 · 컬렉션 ─────────────
    {
        id: 'j-generic',
        stage: 'j-collect',
        npc: 'oh',
        title: t('무엇이든 담는 상자', 'A box for anything'),
        request: [
            t(
                '송장 번호 상자, 무게 상자… 담는 것만 다르고 똑같은 클래스를 자꾸 만들고 있어요.',
                'An invoice box, a weight box… I keep making the same class with only the contents different.',
            ),
            t('하나로 다 담을 수 없을까요?', 'Can one class hold them all?'),
        ],
        thanks: t(
            '타입만 꽂아 주면 되니까 클래스 하나로 끝이네요!',
            'Just plug in the type, and one class does it all!',
        ),
        concepts: [
            {
                title: t('제네릭 클래스 <code>Box&lt;T&gt;</code>', 'Generic class <code>Box&lt;T&gt;</code>'),
                body: t(
                    '<code>&lt;T&gt;</code> 는 "아직 정하지 않은 타입" 자리예요. 정하는 법은 예제 주석을 보세요.',
                    '<code>&lt;T&gt;</code> is a slot for "a type not decided yet". See the comments for how to decide it.',
                ),
                code: t(
                    prog(
                        `// T 를 String 으로 정하기 (뒤쪽 <> 는 비워도 돼요)
Box<String> a = new Box<>();
a.put("립밤");
Box<Integer> b = new Box<>(); // 숫자는 int 대신 Integer
b.put(12);
// → 립밤 13
System.out.println(a.get() + " " + (b.get() + 1));`,
                        `class Box<T> { // T: 아직 정하지 않은 타입 자리
    private T item;

    void put(T item) {
        this.item = item;
    }

    T get() {
        return item;
    }
}`,
                    ),
                    prog(
                        `// T is String here (the <> on the right can stay empty)
Box<String> a = new Box<>();
a.put("Lip balm");
// numbers use Integer, not int
Box<Integer> b = new Box<>();
b.put(12);
// → Lip balm 13
System.out.println(a.get() + " " + (b.get() + 1));`,
                        `class Box<T> { // T: a slot for a type not decided yet
    private T item;

    void put(T item) {
        this.item = item;
    }

    T get() {
        return item;
    }
}`,
                    ),
                ),
            },
            {
                title: t('제네릭 메서드', 'Generic methods'),
                body: t(
                    '메서드에도 <code>&lt;T&gt;</code> 를 붙일 수 있어요. <code>ArrayList&lt;String&gt;</code> 도 이렇게 만든 제네릭이에요.',
                    'Methods can have <code>&lt;T&gt;</code> too. <code>ArrayList&lt;String&gt;</code> is a generic built the same way.',
                ),
                code: t(
                    `${UTIL}

public class Main {
    // <T> T last(List<T> list): 어떤 타입의 리스트든 받아서, 그 타입으로 돌려줘요
    static <T> T last(List<T> list) {
        return list.get(list.size() - 1);
    }

    public static void main(String[] args) {
        List<String> names = new ArrayList<>();
        names.add("A");
        names.add("B");
        List<Integer> kgs = Arrays.asList(3, 8, 5);
        // T 가 String, Integer 로 정해져요 → B 5
        System.out.println(last(names) + " " + last(kgs));
    }
}`,
                    `${UTIL}

public class Main {
    // <T> T last(List<T> list): takes a list of any type and returns that type
    static <T> T last(List<T> list) {
        return list.get(list.size() - 1);
    }

    public static void main(String[] args) {
        List<String> names = new ArrayList<>();
        names.add("A");
        names.add("B");
        List<Integer> kgs = Arrays.asList(3, 8, 5);
        // T becomes String, then Integer → B 5
        System.out.println(last(names) + " " + last(kgs));
    }
}`,
                ),
            },
        ],
        predict: {
            prompt: P(),
            code: prog(
                `Pair<String, Integer> p = new Pair<>("${t('토너', 'Toner')}", 3);
System.out.println(p.left + (p.right * 2));`,
                `class Pair<A, B> {
    A left;
    B right;

    Pair(A left, B right) {
        this.left = left;
        this.right = right;
    }
}`,
            ),
            choices: [t('토너6', 'Toner6'), t('토너32', 'Toner32'), t('토너 6', 'Toner 6'), t('6토너', '6Toner')],
            answer: 0,
            explain: t(
                'right 는 Integer 라서 3 * 2 = 6 이 먼저 계산되고, 문자열 뒤에 붙어요.',
                'right is an Integer, so 3 * 2 = 6 is computed first and then joined to the string.',
            ),
        },
        fill: {
            prompt: t(
                '무엇이든 담는 선반을 완성하고, 문자열 선반으로 써 보세요.',
                'Finish the shelf that holds anything, then use it as a shelf of strings.',
            ),
            code: prog(
                `Shelf<String> s = new Shelf<{{1}}>();
s.add("${t('립밤', 'Lip balm')}");
s.add("${t('토너', 'Toner')}");
System.out.println(s.count() + "${t('개', ' items')}");`,
                `${UTIL}

class Shelf<{{0}}> {
    private List<T> items = new ArrayList<>();

    void add(T x) {
        items.add(x);
    }

    int count() {
        return items.size();
    }
}`,
            ),
            blanks: [{ size: 2 }, { size: 7 }],
            expected: t('2개', '2 items'),
            hints: [
                t(
                    '아래에서 쓰는 타입 자리 이름은? 문자열 선반이니까…',
                    "What's the type slot's name used below? And it's a shelf of strings…",
                ),
                'T, String',
            ],
            solution: ['T', 'String'],
        },
        write: {
            prompt: t(
                '<code>class Tag&lt;T&gt;</code> 를 만들어 주세요. 생성자로 값을 받아 <code>private T value</code> 에 담고, <code>show()</code> 는 "[값]" 을 돌려줘요.',
                'Make <code>class Tag&lt;T&gt;</code>. The constructor stores a value in <code>private T value</code>, and <code>show()</code> returns "[value]".',
            ),
            starter: prog(
                'System.out.println(new Tag<String>("A-1").show());\nSystem.out.println(new Tag<Integer>(42).show());',
                `// ${t('Tag 클래스를 여기에 만드세요', 'Make the Tag class here')}`,
            ),
            expected: '[A-1]\n[42]',
            mustInclude: [
                {
                    re: 'class\\s+Tag\\s*<\\s*T\\s*>',
                    msg: t(
                        '<code>class Tag&lt;T&gt;</code> 로 만들어 주세요.',
                        'Make it as <code>class Tag&lt;T&gt;</code>.',
                    ),
                },
                {
                    re: 'private\\s+T\\s+value',
                    msg: t(
                        '<code>private T value</code> 필드를 만들어 주세요.',
                        'Make a <code>private T value</code> field.',
                    ),
                },
            ],
            hints: ['Tag(T value) { this.value = value; }', 'String show() { return "[" + value + "]"; }'],
            solution: prog(
                'System.out.println(new Tag<String>("A-1").show());\nSystem.out.println(new Tag<Integer>(42).show());',
                `class Tag<T> {
    private T value;

    Tag(T value) {
        this.value = value;
    }

    String show() {
        return "[" + value + "]";
    }
}`,
            ),
        },
        learned: [
            t(
                '<code>class 이름&lt;T&gt;</code>: 타입을 나중에 정함',
                '<code>class Name&lt;T&gt;</code>: the type is decided later',
            ),
            t(
                '숫자는 <code>Integer</code>, 뒤쪽 <code>&lt;&gt;</code> 는 비워도 됨',
                'Numbers use <code>Integer</code>; the right <code>&lt;&gt;</code> can be empty',
            ),
            t('<code>static &lt;T&gt; T 메서드(…)</code>', '<code>static &lt;T&gt; T method(…)</code>'),
        ],
    },
    {
        id: 'j-collections',
        stage: 'j-collect',
        npc: 'oh',
        title: t('출고 목록 줄 세우고 중복 빼기', 'Sorting and de-duplicating the shipping list'),
        request: [
            t(
                '출고 목록을 무게순으로 세우고, 겹치는 택배사 이름도 빼야 해요.',
                'I need the shipping list in weight order, and the repeated courier names removed.',
            ),
            t('반복문으로 하나하나 하긴 너무 길어요.', 'Doing it one by one with loops is too long.'),
        ],
        thanks: t(
            '도우미 메서드 한 줄씩이면 되네요. 시간 많이 아꼈어요!',
            'One helper line each! That saved a lot of time!',
        ),
        concepts: [
            {
                title: t('<code>Collections</code> 도우미', '<code>Collections</code> helpers'),
                body: t(
                    '<code>Collections</code> 는 리스트를 다루는 도우미 메서드를 모아 둔 클래스예요. 메서드마다 하는 일은 예제 주석에 있어요.',
                    '<code>Collections</code> is a class full of helper methods for lists. What each one does is in the comments.',
                ),
                code: t(
                    prog(
                        `// 값이 든 리스트를 바로 만들기
List<Integer> kgs = new ArrayList<>(Arrays.asList(12, 3, 25, 8));
Collections.sort(kgs); // 작은 순으로 줄 세우기
System.out.println(kgs); // → [3, 8, 12, 25]
// 가장 큰 값, 작은 값 → 25 3
System.out.println(Collections.max(kgs) + " " + Collections.min(kgs));
Collections.reverse(kgs); // 순서 뒤집기
System.out.println(kgs); // → [25, 12, 8, 3]`,
                        UTIL,
                    ),
                    prog(
                        `// a list with values right away
List<Integer> kgs = new ArrayList<>(Arrays.asList(12, 3, 25, 8));
Collections.sort(kgs); // sort smallest first
System.out.println(kgs); // → [3, 8, 12, 25]
// largest, smallest → 25 3
System.out.println(Collections.max(kgs) + " " + Collections.min(kgs));
Collections.reverse(kgs); // flip the order
System.out.println(kgs); // → [25, 12, 8, 3]`,
                        UTIL,
                    ),
                ),
            },
            {
                title: t('<code>Set</code>: 중복 없는 모음', '<code>Set</code>: a collection without duplicates'),
                body: t(
                    '<code>Set</code> 은 같은 값을 두 번 넣어도 하나만 남는 모음이에요. (<code>HashSet</code> 은 더 빠르지만 순서가 정해져 있지 않아요.)',
                    'A <code>Set</code> keeps only one copy even if you add a value twice. (<code>HashSet</code> is faster but has no fixed order.)',
                ),
                code: t(
                    prog(
                        `// TreeSet: 작은 순서로 정렬해서 보관
Set<String> zones = new TreeSet<>();
zones.add("B");
zones.add("A");
zones.add("B"); // 이미 있는 값이라 안 늘어나요
System.out.println(zones); // → [A, B]
// → 2 false
System.out.println(zones.size() + " " + zones.contains("C"));`,
                        UTIL,
                    ),
                    prog(
                        `// TreeSet: keeps values sorted
Set<String> zones = new TreeSet<>();
zones.add("B");
zones.add("A");
zones.add("B"); // already there, so nothing is added
System.out.println(zones); // → [A, B]
// → 2 false
System.out.println(zones.size() + " " + zones.contains("C"));`,
                        UTIL,
                    ),
                ),
            },
        ],
        predict: {
            prompt: P(),
            code: prog(
                `List<String> codes = new ArrayList<>(Arrays.asList("C", "A", "C", "B"));
Set<String> uniq = new TreeSet<>(codes);
Collections.sort(codes);
System.out.println(codes.size() + " " + uniq.size() + " " + codes.get(0));`,
                UTIL,
            ),
            choices: ['4 3 A', '3 3 A', '4 4 C', '4 3 C'],
            answer: 0,
            explain: t(
                '리스트는 중복을 그대로 두어 4개, Set 은 C 가 하나로 합쳐져 3개. 정렬하면 맨 앞은 A.',
                'The list keeps duplicates (4), the Set merges the two Cs (3). After sorting, A is first.',
            ),
        },
        fill: {
            prompt: t(
                '무게를 줄 세우고, 중복 없이 몇 종류인지 세세요.',
                'Sort the weights, and count how many distinct ones there are.',
            ),
            code: prog(
                `List<Integer> kgs = new ArrayList<>(Arrays.asList(7, 2, 9));
Collections.{{0}}(kgs);
Set<Integer> seen = new {{1}}<>(kgs);
seen.add(2);
System.out.println(kgs + " " + seen.size());`,
                UTIL,
            ),
            blanks: [{ size: 4 }, { size: 7 }],
            expected: '[2, 7, 9] 3',
            hints: [
                t('작은 순 정렬 메서드, 그리고 정렬된 Set.', 'The sort method, and a sorted Set.'),
                'sort, TreeSet',
            ],
            solution: ['sort', 'TreeSet'],
        },
        write: {
            prompt: t(
                '택배사 이름 목록에서 중복을 빼고 정렬해서(<code>TreeSet</code>) 몇 곳인지와 함께 찍어 주세요.',
                'Remove duplicates from the courier list and sort it (<code>TreeSet</code>), then print it with the count.',
            ),
            starter: prog(
                `List<String> names = Arrays.asList(${t('"번개", "한빛", "번개", "새벽", "한빛"', '"Lightning", "Hanbit", "Lightning", "Dawn", "Hanbit"')});
// ${t('여기에 코드를 쓰세요', 'Write your code here')}`,
                UTIL,
            ),
            expected: t('택배사 3곳: [번개, 새벽, 한빛]', 'Couriers 3: [Dawn, Hanbit, Lightning]'),
            mustInclude: [
                {
                    re: 'TreeSet',
                    msg: t(
                        '<code>TreeSet</code> 으로 중복을 빼고 정렬해 주세요.',
                        'Remove duplicates and sort with a <code>TreeSet</code>.',
                    ),
                },
            ],
            hints: [
                'Set<String> uniq = new TreeSet<>(names);',
                t(
                    'System.out.println("택배사 " + uniq.size() + "곳: " + uniq);',
                    'System.out.println("Couriers " + uniq.size() + ": " + uniq);',
                ),
            ],
            solution: prog(
                `List<String> names = Arrays.asList(${t('"번개", "한빛", "번개", "새벽", "한빛"', '"Lightning", "Hanbit", "Lightning", "Dawn", "Hanbit"')});
Set<String> uniq = new TreeSet<>(names);
System.out.println(${t('"택배사 " + uniq.size() + "곳: " + uniq', '"Couriers " + uniq.size() + ": " + uniq')});`,
                UTIL,
            ),
        },
        learned: [
            t(
                '<code>Collections.sort / max / min / reverse</code>',
                '<code>Collections.sort / max / min / reverse</code>',
            ),
            t(
                '<code>Set</code> 은 중복 없음, <code>TreeSet</code> 은 정렬됨',
                '<code>Set</code> has no duplicates; <code>TreeSet</code> is sorted',
            ),
            t(
                '<code>new ArrayList&lt;&gt;(Arrays.asList(…))</code>',
                '<code>new ArrayList&lt;&gt;(Arrays.asList(…))</code>',
            ),
        ],
    },

    // ───────────── 패킹 작업대 · 강군 · 람다 · 스트림 ─────────────
    {
        id: 'j-lambda',
        stage: 'j-func',
        npc: 'kang',
        title: t('줄 세우는 규칙 넘겨주기', 'Passing a sorting rule'),
        request: [
            t(
                '김사원님, 포장할 목록을 그때그때 다른 규칙으로 줄 세우고 걸러야 해요.',
                'Kim, I need to sort and filter the packing list by a different rule each time.',
            ),
            t('규칙만 짧게 넘겨줄 수 있다던데 그게 뭐예요?', "I heard you can pass just the rule, short. What's that?"),
        ],
        thanks: t('규칙을 한 줄로 넘기니까 진짜 편해요!', 'Passing the rule in one line is so easy!'),
        concepts: [
            {
                title: t('람다 <code>x -> …</code>', 'Lambdas <code>x -> …</code>'),
                body: t(
                    '람다 <code>(매개변수) -> 결과</code> 는 이름 없는 짧은 메서드예요. 어디에 쓰는지는 예제 주석을 보세요.',
                    'A lambda <code>(params) -> result</code> is a short method with no name. See the comments for where it is used.',
                ),
                code: t(
                    prog(
                        `List<String> items = new ArrayList<>(Arrays.asList("토너", "립밤", "쿠션팩트"));
// forEach: 칸마다 람다 부르기
items.forEach(x -> System.out.println("- " + x));
// removeIf: 람다가 true 인 칸 빼기 (3글자 이상)
items.removeIf(x -> x.length() > 2);
System.out.println(items); // → [토너, 립밤]`,
                        UTIL,
                    ),
                    prog(
                        `List<String> items = new ArrayList<>(Arrays.asList("Toner", "Balm", "Cushion"));
// forEach: calls the lambda for each item
items.forEach(x -> System.out.println("- " + x));
// removeIf: removes items where the lambda is true (over 5 letters)
items.removeIf(x -> x.length() > 5);
System.out.println(items); // → [Toner, Balm]`,
                        UTIL,
                    ),
                ),
            },
            {
                title: t('정렬 규칙을 람다로', 'A sorting rule as a lambda'),
                body: t(
                    '<code>sort</code> 에 넘기는 람다는 두 값 a, b 를 받아서, a 가 앞이면 음수, 뒤면 양수를 돌려줘요.',
                    'The lambda given to <code>sort</code> takes two values a and b, and returns a negative number if a goes first, positive if after.',
                ),
                code: t(
                    prog(
                        `List<Integer> kgs = new ArrayList<>(Arrays.asList(12, 3, 25));
kgs.sort((a, b) -> b - a); // b - a: 숫자 큰 순
System.out.println(kgs); // → [25, 12, 3]
List<String> names = new ArrayList<>(Arrays.asList("한빛로지스", "번개", "새벽배송"));
// 글자 수 적은 순
names.sort((a, b) -> a.length() - b.length());
// → [번개, 새벽배송, 한빛로지스]
System.out.println(names);`,
                        UTIL,
                    ),
                    prog(
                        `List<Integer> kgs = new ArrayList<>(Arrays.asList(12, 3, 25));
kgs.sort((a, b) -> b - a); // b - a: largest first
System.out.println(kgs); // → [25, 12, 3]
List<String> names = new ArrayList<>(Arrays.asList("Lightning", "Dawn", "Hanbit"));
// shortest name first
names.sort((a, b) -> a.length() - b.length());
// → [Dawn, Hanbit, Lightning]
System.out.println(names);`,
                        UTIL,
                    ),
                ),
            },
        ],
        predict: {
            prompt: P(),
            code: prog(
                `List<Integer> nums = new ArrayList<>(Arrays.asList(5, 1, 4, 2));
nums.removeIf(n -> n % 2 == 1);
nums.sort((a, b) -> b - a);
System.out.println(nums);`,
                UTIL,
            ),
            choices: ['[4, 2]', '[2, 4]', '[5, 1]', '[5, 4, 2, 1]'],
            answer: 0,
            explain: t(
                'removeIf 로 홀수 5, 1 이 빠지고, 큰 순으로 정렬해서 [4, 2].',
                'removeIf drops the odd 5 and 1, then sorting largest first gives [4, 2].',
            ),
        },
        fill: {
            prompt: t(
                'B 로 시작하는 주문을 빼고, 남은 주문을 하나씩 찍으세요.',
                'Remove the orders starting with B, then print the rest one by one.',
            ),
            code: prog(
                `List<String> orders = new ArrayList<>(Arrays.asList("A-12", "B-3", "C-7"));
orders.removeIf(o {{0}} o.startsWith("B"));
orders.{{1}}(o -> System.out.println(o));`,
                UTIL,
            ),
            blanks: [{ size: 2 }, { size: 7 }],
            expected: 'A-12\nC-7',
            hints: [
                t(
                    '람다의 화살표, 그리고 칸마다 람다를 부르는 메서드.',
                    'The lambda arrow, and the method that calls a lambda for each item.',
                ),
                '->, forEach',
            ],
            solution: ['->', 'forEach'],
        },
        write: {
            prompt: t(
                '<code>removeIf</code> 로 5kg 미만을 빼고, 람다로 큰 순 정렬한 뒤 리스트를 찍어 주세요.',
                'Remove items under 5kg with <code>removeIf</code>, sort largest first with a lambda, then print the list.',
            ),
            starter: prog(
                `List<Integer> kgs = new ArrayList<>(Arrays.asList(8, 15, 3, 22));
// ${t('여기에 코드를 쓰세요', 'Write your code here')}`,
                UTIL,
            ),
            expected: '[22, 15, 8]',
            mustInclude: [
                {
                    re: 'removeIf\\s*\\(',
                    msg: t('<code>removeIf</code> 로 빼 주세요.', 'Remove them with <code>removeIf</code>.'),
                },
                { re: '->', msg: t('람다 <code>-></code> 를 써 주세요.', 'Use a lambda <code>-></code>.') },
            ],
            hints: ['kgs.removeIf(k -> k < 5);', 'kgs.sort((a, b) -> b - a);'],
            solution: prog(
                `List<Integer> kgs = new ArrayList<>(Arrays.asList(8, 15, 3, 22));
kgs.removeIf(k -> k < 5);
kgs.sort((a, b) -> b - a);
System.out.println(kgs);`,
                UTIL,
            ),
        },
        learned: [
            t('람다 <code>(x) -> 결과</code>', 'Lambda <code>(x) -> result</code>'),
            t(
                '<code>forEach</code>, <code>removeIf</code> 에 람다 넘기기',
                'Pass lambdas to <code>forEach</code>, <code>removeIf</code>',
            ),
            t('정렬 규칙 <code>(a, b) -> b - a</code>', 'Sort rule <code>(a, b) -> b - a</code>'),
        ],
    },
    {
        id: 'j-stream',
        stage: 'j-func',
        npc: 'kang',
        title: t('스트림으로 한 번에 계산', 'Calculating in one go with streams'),
        request: [
            t(
                '무거운 박스만 골라서 요금도 매기고, 개수랑 합계도 내야 해요.',
                'I need to pick the heavy boxes, price them, and get the count and total.',
            ),
            t(
                '리스트를 몇 번씩 돌지 않고 한 줄로 할 수 있을까요?',
                'Can I do it in one line without looping the list several times?',
            ),
        ],
        thanks: t('고르고, 바꾸고, 더하고… 한 줄에 다 되네요!', 'Pick, change, add up… all in one line!'),
        concepts: [
            {
                title: t(
                    '스트림 <code>filter</code> · <code>count</code> · <code>sum</code>',
                    'Streams: <code>filter</code> · <code>count</code> · <code>sum</code>',
                ),
                body: t(
                    '스트림은 리스트의 값을 흘려보내며 차례로 처리해요. 원래 리스트는 바뀌지 않아요.',
                    'A stream processes a list by letting its values flow through steps. The original list does not change.',
                ),
                code: t(
                    prog(
                        `List<Integer> kgs = Arrays.asList(4, 18, 7, 25);
// stream(): 흘려보내기, filter: 조건에 맞는 것만 통과, count(): 개수 (long)
// 18, 25 → 2
long heavy = kgs.stream().filter(k -> k >= 10).count();
// mapToInt(…).sum(): 합계
// 4 + 18 + 7 + 25 → 54
int total = kgs.stream().mapToInt(k -> k).sum();
System.out.println(heavy + " " + total); // → 2 54`,
                        UTIL,
                    ),
                    prog(
                        `List<Integer> kgs = Arrays.asList(4, 18, 7, 25);
// stream(): let values flow, filter: only matching ones pass, count(): how many (a long)
// 18, 25 → 2
long heavy = kgs.stream().filter(k -> k >= 10).count();
// mapToInt(…).sum(): the total
// 4 + 18 + 7 + 25 → 54
int total = kgs.stream().mapToInt(k -> k).sum();
System.out.println(heavy + " " + total); // → 2 54`,
                        UTIL,
                    ),
                ),
            },
            {
                title: t('<code>map</code> 과 <code>collect</code>', '<code>map</code> and <code>collect</code>'),
                body: t(
                    '스트림에서 값을 바꾸고 다시 리스트로 모으는 법이에요. <code>import java.util.stream.*;</code> 이 필요해요.',
                    'Changing values in a stream and gathering them back into a list. It needs <code>import java.util.stream.*;</code>.',
                ),
                code: t(
                    prog(
                        `List<String> ids = Arrays.asList("a1", "b2", "c3");
// map: 값을 바꿔서 흘려보내기, collect(Collectors.toList()): 다시 리스트로 모으기
List<String> big = ids.stream().map(s -> s.toUpperCase()).collect(Collectors.toList());
System.out.println(big); // → [A1, B2, C3]
// String.join: 사이에 ", " 를 넣어 붙이기 → A1, B2, C3
System.out.println(String.join(", ", big));`,
                        STREAM,
                    ),
                    prog(
                        `List<String> ids = Arrays.asList("a1", "b2", "c3");
// map: change each value as it flows, collect(Collectors.toList()): gather back into a list
List<String> big = ids.stream().map(s -> s.toUpperCase()).collect(Collectors.toList());
System.out.println(big); // → [A1, B2, C3]
// String.join: joins with ", " in between → A1, B2, C3
System.out.println(String.join(", ", big));`,
                        STREAM,
                    ),
                ),
            },
        ],
        predict: {
            prompt: P(),
            code: prog(
                `List<Integer> nums = Arrays.asList(1, 2, 3, 4, 5);
int r = nums.stream().filter(n -> n > 2).mapToInt(n -> n * 10).sum();
System.out.println(r);`,
                UTIL,
            ),
            choices: ['120', '150', '12', '30'],
            answer: 0,
            explain: t(
                '2 보다 큰 3, 4, 5 만 남고, 10 을 곱해 30 + 40 + 50 = 120.',
                'Only 3, 4 and 5 (over 2) remain; times 10 gives 30 + 40 + 50 = 120.',
            ),
        },
        fill: {
            prompt: t(
                '8kg 이상만 골라 kg × 500 요금 리스트로 만드세요.',
                'Pick the boxes of 8kg or more and make a list of fees, kg × 500.',
            ),
            code: prog(
                `List<Integer> kgs = Arrays.asList(3, 12, 8, 20);
List<Integer> fees = kgs.stream()
        .{{0}}(k -> k >= 8)
        .{{1}}(k -> k * 500)
        .collect(Collectors.toList());
System.out.println(fees);`,
                STREAM,
            ),
            blanks: [{ size: 6 }, { size: 3 }],
            expected: '[6000, 4000, 10000]',
            hints: [t('먼저 고르고, 그다음 바꿔요.', 'Pick first, then change.'), 'filter, map'],
            solution: ['filter', 'map'],
        },
        write: {
            prompt: t(
                '스트림으로 1만 원 이상 주문의 건수와 합계를 구해서 찍어 주세요.',
                'Use streams to get the count and total of orders of 10000 or more, and print them.',
            ),
            starter: prog(
                `List<Integer> amounts = Arrays.asList(12000, 8000, 30000, 4000);
// ${t('여기에 코드를 쓰세요', 'Write your code here')}`,
                UTIL,
            ),
            expected: t('1만 원 이상: 2건, 42000원', '10000+: 2 orders, 42000'),
            mustInclude: [
                {
                    re: '\\.stream\\s*\\(\\s*\\)',
                    msg: t('<code>.stream()</code> 을 써 주세요.', 'Use <code>.stream()</code>.'),
                },
                {
                    re: '\\.filter\\s*\\(',
                    msg: t('<code>filter</code> 로 골라 주세요.', 'Pick with <code>filter</code>.'),
                },
            ],
            hints: [
                'long n = amounts.stream().filter(a -> a >= 10000).count();',
                'int sum = amounts.stream().filter(a -> a >= 10000).mapToInt(a -> a).sum();',
            ],
            solution: prog(
                `List<Integer> amounts = Arrays.asList(12000, 8000, 30000, 4000);
long n = amounts.stream().filter(a -> a >= 10000).count();
int sum = amounts.stream().filter(a -> a >= 10000).mapToInt(a -> a).sum();
System.out.println(${t('"1만 원 이상: " + n + "건, " + sum + "원"', '"10000+: " + n + " orders, " + sum')});`,
                UTIL,
            ),
        },
        learned: [
            t('<code>리스트.stream()</code> 으로 흘려보내기', 'Flow with <code>list.stream()</code>'),
            t(
                '<code>filter</code> · <code>map</code> · <code>count</code> · <code>mapToInt(…).sum()</code>',
                '<code>filter</code> · <code>map</code> · <code>count</code> · <code>mapToInt(…).sum()</code>',
            ),
            t(
                '<code>collect(Collectors.toList())</code> 로 모으기',
                'Gather with <code>collect(Collectors.toList())</code>',
            ),
        ],
    },

    // ───────────── 택배 상차장 · 윤기사님 · 직접 만든 예외 ─────────────
    {
        id: 'j-custom-exception',
        stage: 'j-error',
        npc: 'yoon',
        title: t('트럭 과적 막기', 'Stopping an overloaded truck'),
        request: [
            t('1톤 트럭에 1톤 넘게 실으면 큰일 나요.', 'Loading over a ton onto a 1-ton truck is dangerous.'),
            t(
                '"과적"이라는 우리만의 오류를 만들어서 확실히 멈추게 할 수 있을까요?',
                'Can we make our own "overload" error so it definitely stops?',
            ),
        ],
        thanks: t(
            '과적이면 딱 멈추고 이유도 알려 주네요. 안전 최고!',
            'It stops right at an overload and says why. Safety first!',
        ),
        concepts: [
            {
                title: t(
                    '예외 클래스 만들기, <code>throw</code> · <code>throws</code>',
                    'Making an exception class, <code>throw</code> · <code>throws</code>',
                ),
                body: t(
                    '<code>Exception</code> 을 상속해서 우리만의 예외를 만들어요. 던지고 받는 법은 예제 주석을 보세요.',
                    'Extend <code>Exception</code> to make your own exception. See the comments for how to throw and catch it.',
                ),
                code: t(
                    `// extends Exception: 우리만의 예외
class OverloadException extends Exception {
    OverloadException(String msg) {
        super(msg);
    }
}

public class Main {
    // throws: 이 메서드가 이 예외를 던질 수 있다고 적기
    static void load(int kg) throws OverloadException {
        // throw: 예외 던지기
        if (kg > 1000) throw new OverloadException(kg + "kg 은 너무 무거워요");
        System.out.println(kg + "kg 실음");
    }

    public static void main(String[] args) {
        try {
            load(800);
            // 여기서 예외 → 바로 catch 로 가서 load(500) 은 실행 안 돼요
            load(1200);
            load(500);
        // 던진 예외 받기
        } catch (OverloadException e) {
            System.out.println("멈춤: " + e.getMessage());
        }
    }
}`,
                    `// extends Exception: our own exception
class OverloadException extends Exception {
    OverloadException(String msg) {
        super(msg);
    }
}

public class Main {
    // throws: says this method may throw this exception
    static void load(int kg) throws OverloadException {
        // throw: throw the exception
        if (kg > 1000) throw new OverloadException(kg + "kg is too heavy");
        System.out.println(kg + "kg loaded");
    }

    public static void main(String[] args) {
        try {
            load(800);
            // exception here → jumps straight to catch, so load(500) never runs
            load(1200);
            load(500);
        // catch the thrown exception
        } catch (OverloadException e) {
            System.out.println("Stopped: " + e.getMessage());
        }
    }
}`,
                ),
            },
            {
                title: t('<code>finally</code>: 무슨 일이 있어도', '<code>finally</code>: no matter what'),
                body: t(
                    '<code>finally</code> 블록은 예외가 나든 안 나든 <b>항상</b> 실행돼요. 문 닫기, 기록 남기기처럼 꼭 해야 하는 마무리를 둬요.',
                    'A <code>finally</code> block runs <b>always</b>, whether or not an exception happened. Put must-do wrap-ups there, like closing the door or writing a log.',
                ),
                code: prog(`try {
    System.out.println("${t('상차 시작', 'Loading starts')}");
    int[] slots = new int[2];
    slots[5] = 1;
} catch (ArrayIndexOutOfBoundsException e) {
    System.out.println("${t('자리 없음', 'No slot')}");
} finally {
    System.out.println("${t('문 닫기', 'Close the door')}");
}`),
            },
        ],
        predict: {
            prompt: P(),
            code: `class BadCode extends Exception {
    BadCode(String m) {
        super(m);
    }
}

public class Main {
    static String check(String code) throws BadCode {
        if (!code.startsWith("A")) throw new BadCode(code);
        return code + " OK";
    }

    public static void main(String[] args) {
        String[] codes = { "A1", "B2", "A3" };
        for (String c : codes) {
            try {
                System.out.println(check(c));
            } catch (BadCode e) {
                System.out.println("${t('오류 ', 'error ')}" + e.getMessage());
            }
        }
    }
}`,
            choices: [
                t('A1 OK\n오류 B2\nA3 OK', 'A1 OK\nerror B2\nA3 OK'),
                t('A1 OK\n오류 B2', 'A1 OK\nerror B2'),
                'A1 OK\nA3 OK',
                t('오류 B2', 'error B2'),
            ],
            answer: 0,
            explain: t(
                'try 가 반복문 안에 있어서 B2 에서 잡고 나서도 다음 A3 로 계속 가요.',
                'The try is inside the loop, so after catching B2 it carries on to A3.',
            ),
        },
        fill: {
            prompt: t('재고가 없으면 우리만의 예외를 던지게 하세요.', "Throw our own exception when there's no stock."),
            code: `class EmptyException {{0}} Exception {
    EmptyException(String m) {
        super(m);
    }
}

public class Main {
    static int pick(int stock) {{1}} EmptyException {
        if (stock == 0) throw new EmptyException("${t('재고 없음', 'Out of stock')}");
        return stock - 1;
    }

    public static void main(String[] args) {
        try {
            System.out.println(pick(2));
            System.out.println(pick(0));
        } catch (EmptyException e) {
            System.out.println(e.getMessage());
        }
    }
}`,
            blanks: [{ size: 7 }, { size: 6 }],
            expected: t('1\n재고 없음', '1\nOut of stock'),
            hints: [
                t(
                    'Exception 을 물려받는 키워드, 던질 수 있다고 알리는 키워드.',
                    'The keyword to inherit from Exception, and the one that says a method may throw.',
                ),
                'extends, throws',
            ],
            solution: ['extends', 'throws'],
        },
        write: {
            prompt: t(
                '<code>LateException</code> 을 만들고, <code>arrive(int min)</code> 은 30 분 넘게 늦으면 "N분 늦음" 으로 던지고 아니면 "정시 도착" 을 찍게 하세요. main 에서 10분, 45분 순서로 부르고, 잡으면 "지연: 메시지", 마지막엔 꼭 "기록 완료" 를 찍어 주세요.',
                'Make <code>LateException</code>; <code>arrive(int min)</code> throws "N min late" if it\'s over 30 minutes late, else prints "On time". In main call it with 10 then 45, print "Delay: message" when caught, and always print "Logged" at the end.',
            ),
            starter: `// ${t('LateException 을 여기에 만드세요', 'Make LateException here')}

public class Main {
    // ${t('arrive 메서드를 여기에 만드세요', 'Make the arrive method here')}

    public static void main(String[] args) {
        // ${t('여기에 코드를 쓰세요', 'Write your code here')}
    }
}`,
            expected: t('정시 도착\n지연: 45분 늦음\n기록 완료', 'On time\nDelay: 45 min late\nLogged'),
            mustInclude: [
                {
                    re: 'extends\\s+Exception',
                    msg: t(
                        '<code>extends Exception</code> 으로 예외를 만들어 주세요.',
                        'Make the exception with <code>extends Exception</code>.',
                    ),
                },
                {
                    re: 'throws\\s+LateException',
                    msg: t(
                        'arrive 에 <code>throws LateException</code> 을 적어 주세요.',
                        'Add <code>throws LateException</code> to arrive.',
                    ),
                },
                {
                    re: 'finally',
                    msg: t(
                        '"기록 완료" 는 <code>finally</code> 에서 찍어 주세요.',
                        'Print "Logged" in <code>finally</code>.',
                    ),
                },
            ],
            hints: [
                t(
                    'if (min > 30) throw new LateException(min + "분 늦음");',
                    'if (min > 30) throw new LateException(min + " min late");',
                ),
                'try { arrive(10); arrive(45); } catch (LateException e) { … } finally { … }',
            ],
            solution: `class LateException extends Exception {
    LateException(String m) {
        super(m);
    }
}

public class Main {
    static void arrive(int min) throws LateException {
        if (min > 30) throw new LateException(min + "${t('분 늦음', ' min late')}");
        System.out.println("${t('정시 도착', 'On time')}");
    }

    public static void main(String[] args) {
        try {
            arrive(10);
            arrive(45);
        } catch (LateException e) {
            System.out.println("${t('지연: ', 'Delay: ')}" + e.getMessage());
        } finally {
            System.out.println("${t('기록 완료', 'Logged')}");
        }
    }
}`,
        },
        learned: [
            t('<code>class 이름 extends Exception</code>', '<code>class Name extends Exception</code>'),
            t(
                '<code>throw new …</code> 던지기, 메서드에 <code>throws …</code>',
                'Throw with <code>throw new …</code>; mark methods <code>throws …</code>',
            ),
            t('<code>finally</code> 는 항상 실행', '<code>finally</code> always runs'),
        ],
    },
];
