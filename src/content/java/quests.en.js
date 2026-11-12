// English version of ./quests.js (same ids, stages and NPCs). Shown when the display language is English.

const main = (body) => `public class Main {
    public static void main(String[] args) {
${body.split('\n').map((l) => (l ? '        ' + l : l)).join('\n')}
    }
}`;

export const QUESTS = [
  // ───────────── Office · Jiwon · First day ─────────────
  {
    id: 'office-1', stage: 'office', npc: 'han',
    title: 'Print your name on the badge',
    request: [
      'Okay Kim, here\'s your first task!',
      'We need to make your ID badge. Could you print your name in our system? In Java!',
    ],
    thanks: 'Your badge is ready! Keep it around your neck, okay?',
    concepts: [
      {
        title: 'Print to the screen <code>println</code>',
        body: '<code>System.out.println(…)</code> prints what is inside the parentheses and <b>moves to a new line</b>.<br>Text goes inside double quotes <code>" "</code>.',
        code: main('System.out.println("Hello");\nSystem.out.println("I am Kim from logistics");'),
        note: 'Java code goes inside <code>main</code>, inside <code>class Main</code>. For now, keep this frame as it is and only change the middle.',
      },
      {
        title: '<code>print</code> and <code>println</code>',
        body: '<code>print</code> only prints and <b>does not move to a new line</b>. So the next output sticks right next to it.',
        code: main('System.out.print("Logi");\nSystem.out.print("stics");\nSystem.out.println("!");\nSystem.out.println("Done");'),
      },
      {
        title: 'The <code>;</code> at the end',
        body: 'Every Java statement ends with a semicolon <code>;</code>. If one is missing, you get an error before the code even runs.',
        code: main('System.out.println("Semicolons");\nSystem.out.println("Don\'t forget them");'),
        note: 'Upper and lower case matter too. Writing <code>system.out.println</code> is an error. <code>System</code> starts with a capital S.',
      },
    ],
    predict: {
      prompt: 'What will this code print?',
      code: main('System.out.print("A");\nSystem.out.println("B");\nSystem.out.println("C");'),
      choices: ['AB\nC', 'A\nB\nC', 'ABC', 'A B\nC'],
      answer: 0,
      explain: 'print("A") does not start a new line, so B sticks to it. println("B") ends the line, so C comes on the next line.',
    },
    fill: {
      prompt: 'Fill in the blank so it prints these two lines.',
      code: main('System.out.{{0}}("ID BADGE");\nSystem.out.println("Name: Kim");'),
      blanks: [{ size: 7 }],
      expected: 'ID BADGE\nName: Kim',
      hints: ['There should be a new line after "ID BADGE". Which one starts a new line, print or println?', 'Put println in the blank.'],
      solution: ['println'],
    },
    write: {
      prompt: 'Print the three badge lines yourself.',
      starter: main('// Write your code here\n'),
      expected: 'ID BADGE\nName: Kim\nTeam: Logistics',
      hints: ['Write System.out.println("…"); three times.', 'The first line is System.out.println("ID BADGE");'],
      solution: main('System.out.println("ID BADGE");\nSystem.out.println("Name: Kim");\nSystem.out.println("Team: Logistics");'),
    },
    learned: ['<code>System.out.println("text");</code> → print, then new line', '<code>System.out.print("text");</code> → no new line', 'End each statement with <code>;</code>'],
  },
  {
    id: 'office-2', stage: 'office', npc: 'han',
    title: 'Fix the work memo',
    request: [
      'Kim, the person before you left a work memo program on the office computer,',
      'but it gives an error when we run it… Could you read the error message and fix it?',
    ],
    thanks: 'Wow, you can read error messages! Now head to receiving. Park is waiting for you!',
    concepts: [
      {
        title: 'Comments <code>//</code>',
        body: 'Java <b>ignores</b> anything after <code>//</code>. Use it to leave notes for people.<br>You can also put it in front of a line you don\'t want to run.',
        code: main('// To-do for today\nSystem.out.println("Check deliveries");\n// System.out.println("This line does not run");\nSystem.out.println("Help shipping");'),
      },
      {
        title: 'Reading error messages',
        body: 'This example is missing a <code>;</code> on purpose. Try running it.<br><code>Main.java:4: error: \';\' expected</code> means <b>line 4</b> needs a <code>;</code>.',
        code: main('System.out.println("First line");\nSystem.out.println("Second line")'),
        note: 'What to look at first in an error: the <b>number after the file name (the line)</b>, and the text after <code>error:</code>.',
      },
      {
        title: 'Matching <code>{ }</code>',
        body: 'Every opening <code>{</code> needs a closing <code>}</code>. One pair for <code>class</code>, one pair for <code>main</code>.',
        code: main('System.out.println("Matching braces means it runs fine");'),
      },
    ],
    predict: {
      prompt: 'Which line will have the error?',
      code: 'public class Main {\n    public static void main(String[] args) {\n        System.out.println("Box");\n        System.out.println("Tape")\n        System.out.println("Label");\n    }\n}',
      choices: ['Line 3', 'Line 4', 'Line 5', 'No error'],
      answer: 1,
      explain: 'Line 4, System.out.println("Tape"), has no ; at the end.',
    },
    fill: {
      prompt: 'Fill in the blank so the middle line does not run.',
      code: main('System.out.println("Work starts");\n{{0}} System.out.println("Test output");\nSystem.out.println("Work ends");'),
      blanks: [{ size: 3 }],
      expected: 'Work starts\nWork ends',
      hints: ['There was a symbol that makes Java ignore the rest of the line, remember?', 'Put // in the blank.'],
      solution: ['//'],
    },
    write: {
      prompt: 'Run the old memo program, then fix the errors so it prints the lines below.',
      starter: main('// Today\'s work memo\nSystem.out.println("Morning: check deliveries")\nSystem.out.println("Afternoon: help shipping);'),
      expected: 'Morning: check deliveries\nAfternoon: help shipping',
      hints: ['First press ▶ Run and look at the line number in the error message.', 'Line 4 has no ; at the end, and line 5 is missing the closing quote ".'],
      solution: main('// Today\'s work memo\nSystem.out.println("Morning: check deliveries");\nSystem.out.println("Afternoon: help shipping");'),
    },
    learned: ['After <code>//</code> is a note (does not run)', 'The <b>number in an error = the line</b>', '<code>{ }</code> must come in pairs'],
  },

  // ───────────── Cosmetics receiving · Park · Variables and types ─────────────
  {
    id: 'recv-int', stage: 'receiving', npc: 'park',
    title: 'Record the lipstick boxes',
    request: [
      'Kim, it\'s your first day, right? Nice to meet you! I\'m Park, in charge of receiving.',
      '12 boxes of lipstick just came in. Could you record that in the system?',
    ],
    thanks: 'You\'re the best, Kim! Done already?',
    concepts: [
      {
        title: 'Integer variables <code>int</code>',
        body: 'A variable is a <b>name</b> that holds a value. <code>int</code> holds an <b>integer</b> (a number with no decimal point).<br>Make one with <code>int name = value;</code>, and after that use the name to get the value.',
        code: main('int boxCount = 12;\nSystem.out.println(boxCount);'),
        note: 'Variable names start lowercase, and each new word starts with a capital: <code>boxCount</code>',
      },
      {
        title: 'Changing a variable',
        body: 'You can put a new value into a variable you already made. The right side is worked out first, then stored in the variable on the left.',
        code: main('int boxCount = 12;\nSystem.out.println(boxCount);\nboxCount = boxCount + 3;\nSystem.out.println(boxCount);'),
        note: 'Don\'t write <code>int</code> again when you store a new value. If you do, you get an "already defined" error.',
      },
      {
        title: 'Joining text and numbers with <code>+</code>',
        body: 'Use <code>+</code> to attach a number or variable to text (a string). They print together on one line.',
        code: main('int boxCount = 12;\nSystem.out.println("Boxes: " + boxCount);'),
      },
    ],
    predict: {
      prompt: 'What will this code print?',
      code: main('int stock = 30;\nstock = stock - 8;\nSystem.out.println("Stock left: " + stock);'),
      choices: ['Stock left: 22', 'Stock left: stock', 'Stock left: 30 - 8', '22'],
      answer: 0,
      explain: 'stock becomes 30 minus 8, which is 22, and it prints after "Stock left: ". The value of the variable stock goes in, not the word stock.',
    },
    fill: {
      prompt: 'Fill in the blanks so it prints "Lipstick boxes: 12".',
      code: main('{{0}} boxCount = 12;\nSystem.out.println("Lipstick boxes: " + {{1}});'),
      blanks: [{ size: 4 }, { size: 9 }],
      expected: 'Lipstick boxes: 12',
      hints: ['The first blank is the type that holds integers.', 'The second blank is the variable you just made: int, boxCount'],
      solution: ['int', 'boxCount'],
    },
    write: {
      prompt: 'There were 20 boxes of sheet masks, and 5 more came in. Put 20 into a variable <code>maskBox</code>, add 5, then print it like below.',
      starter: main('// Write your code here\n'),
      expected: 'Sheet mask boxes: 25',
      mustInclude: [
        { re: 'int\\s+maskBox\\s*=\\s*20\\s*;', msg: 'First make the variable with <code>int maskBox = 20;</code>.' },
        { re: 'maskBox\\s*=\\s*maskBox\\s*\\+\\s*5|maskBox\\s*\\+=\\s*5', msg: 'You need a line that adds 5 to <code>maskBox</code>.' },
      ],
      hints: ['Order: ① int maskBox = 20; ② maskBox = maskBox + 5; ③ print', 'The last line is System.out.println("Sheet mask boxes: " + maskBox);'],
      solution: main('int maskBox = 20;\nmaskBox = maskBox + 5;\nSystem.out.println("Sheet mask boxes: " + maskBox);'),
    },
    learned: ['<code>int name = value;</code> holds an integer', 'New value: <code>name = newValue;</code> (no int again)', 'Print together with <code>"text" + variable</code>'],
  },
  {
    id: 'recv-long-double', stage: 'receiving', npc: 'park',
    title: 'Barcode and volume',
    request: [
      'This time it\'s barcodes and volumes.',
      'The barcode number is so long it won\'t fit in an int… Could you take a look, Kim?',
    ],
    thanks: 'Oh, so there\'s something called long! Thanks!',
    concepts: [
      {
        title: 'Big integers <code>long</code>',
        body: '<code>int</code> only holds numbers up to about <b>2.1 billion</b>. The barcode <code>8801234567890</code> is bigger than that.<br>Put bigger integers in a <code>long</code>, and add <code>L</code> to the end of the number.',
        code: main('long barcode = 8801234567890L;\nSystem.out.println(barcode);'),
        note: 'Without the <code>L</code> you get an "integer number too large" error, because Java first tries to read the number as an int.',
      },
      {
        title: 'Decimals <code>double</code>',
        body: 'Numbers with a decimal point go in a <code>double</code>. Things like volume, weight, or a discount rate.',
        code: main('double volume = 50.5;\nSystem.out.println(volume);\nSystem.out.println(volume / 2);'),
      },
      {
        title: 'A double always shows the decimal point',
        body: 'Even if you store a whole number in a <code>double</code>, it prints with <code>.0</code>.',
        code: main('double weight = 30;\nSystem.out.println(weight);'),
      },
    ],
    predict: {
      prompt: 'What will this code print?',
      code: main('double weight = 0.5;\nSystem.out.println(weight * 3);'),
      choices: ['1.5', '1', '1.50', 'weight * 3'],
      answer: 0,
      explain: 'Math with a double gives a double. 0.5 × 3 = 1.5',
    },
    fill: {
      prompt: 'Fill in the right types.',
      code: main('{{0}} barcode = 8801234567890L;\n{{1}} volume = 30.5;\nSystem.out.println("Barcode: " + barcode);\nSystem.out.println("Volume: " + volume + "ml");'),
      blanks: [{ size: 6 }, { size: 6 }],
      expected: 'Barcode: 8801234567890\nVolume: 30.5ml',
      hints: ['An integer bigger than 2.1 billion, and a number with a decimal point.', 'long, double'],
      solution: ['long', 'double'],
    },
    write: {
      prompt: 'One sunscreen weighs 0.25kg. How much do 4 in one box weigh? Put 0.25 in a <code>double</code> variable <code>weight</code>, multiply by 4, and print it.',
      starter: main('// Write your code here\n'),
      expected: 'Box weight: 1.0kg',
      mustInclude: [{ re: 'double\\s+weight', msg: 'Make a <code>double weight</code> variable.' }],
      hints: ['Multiply is *. weight * 4', 'Wrap the math in parentheses, like System.out.println("Box weight: " + (weight * 4) + "kg");'],
      solution: main('double weight = 0.25;\nSystem.out.println("Box weight: " + (weight * 4) + "kg");'),
    },
    learned: ['Integers over 2.1 billion: <code>long</code> + <code>L</code> at the end', 'Decimals: <code>double</code>', 'A double prints the decimal point, like <code>1.0</code>'],
  },
  {
    id: 'recv-bool-char-string', stage: 'receiving', npc: 'park',
    title: 'Fill out the inspection sheet',
    request: [
      'We need to log an inspection sheet in the system.',
      'The product name, its grade, and whether it passed the expiry date check!',
    ],
    thanks: 'That inspection sheet looks neat! Please do the next one too!',
    concepts: [
      {
        title: 'True or false <code>boolean</code>',
        body: 'A <code>boolean</code> holds only one of two values: <code>true</code> or <code>false</code>.',
        code: main('boolean passed = true;\nboolean expired = false;\nSystem.out.println(passed);\nSystem.out.println(expired);'),
      },
      {
        title: 'One character <code>char</code>',
        body: 'A <code>char</code> holds <b>one</b> character, wrapped in <b>single quotes</b> <code>\' \'</code>.',
        code: main("char grade = 'A';\nSystem.out.println(grade);"),
        note: '<code>"A"</code> (double quotes) is a String, <code>\'A\'</code> (single quotes) is a char.',
      },
      {
        title: 'Text <code>String</code>',
        body: 'A <code>String</code> holds many characters. The <code>S</code> is uppercase.<br><code>+</code> works from left to right. So if numbers come first they are added, and once text comes first everything is joined.',
        code: main('String name = "Cushion compact";\nSystem.out.println(name + " arrived");\nSystem.out.println(1 + 2 + " boxes");\nSystem.out.println("Box" + 1 + 2);'),
      },
    ],
    predict: {
      prompt: 'What will this code print?',
      code: main('System.out.println("Pallet" + 2 + 3);'),
      choices: ['Pallet23', 'Pallet5', '5Pallet', 'Error'],
      answer: 0,
      explain: '"Pallet" + 2 → "Pallet2", then + 3 → "Pallet23". Once text comes first, everything after is joined.',
    },
    fill: {
      prompt: 'Fill in the blanks so the inspection sheet prints like below.',
      code: main('String name = {{0}};\nchar grade = {{1}};\nboolean passed = {{2}};\nSystem.out.println("Product: " + name);\nSystem.out.println("Grade: " + grade);\nSystem.out.println("Passed: " + passed);'),
      blanks: [{ size: 10 }, { size: 4 }, { size: 5 }],
      expected: 'Product: Lip tint\nGrade: A\nPassed: true',
      hints: ['Wrap a String in double quotes and a char in single quotes.', '"Lip tint", \'A\', true'],
      solution: ['"Lip tint"', "'A'", 'true'],
    },
    write: {
      prompt: 'Print the toner inspection sheet yourself. Make one <code>String</code>, one <code>char</code>, and one <code>boolean</code> variable.',
      starter: main('// Write your code here\n'),
      expected: 'Product: Toner\nGrade: B\nPassed: false',
      mustInclude: [
        { re: 'String\\s+\\w+\\s*=', msg: 'Make a <code>String</code> variable.' },
        { re: 'char\\s+\\w+\\s*=', msg: 'Make a <code>char</code> variable.' },
        { re: 'boolean\\s+\\w+\\s*=', msg: 'Make a <code>boolean</code> variable.' },
      ],
      hints: ['It has the same shape as the fill-in problem. Just change the values to "Toner", \'B\', false.', 'Make String name = "Toner"; char grade = \'B\'; boolean passed = false; and print three lines.'],
      solution: main('String name = "Toner";\nchar grade = \'B\';\nboolean passed = false;\nSystem.out.println("Product: " + name);\nSystem.out.println("Grade: " + grade);\nSystem.out.println("Passed: " + passed);'),
    },
    learned: ['<code>boolean</code>: true / false', "<code>char</code>: one character, <code>'A'</code>", '<code>String</code>: many characters, <code>"Toner"</code>'],
  },
  {
    id: 'recv-cast', stage: 'receiving', npc: 'park',
    title: 'Receiving totals',
    request: [
      'Last one: the receiving totals!',
      'We need the weight cut down to whole kg, and an average too. You can do that in Java, right?',
    ],
    thanks: 'You can handle everything in receiving now! Thank you so much, Kim!',
    concepts: [
      {
        title: 'Integer division drops the decimals',
        body: 'When you divide an <code>int</code> by an <code>int</code>, the result is an <code>int</code> too, so <b>everything after the decimal point is dropped</b>. If either side is a decimal, you get the decimals.',
        code: main('System.out.println(7 / 2);\nSystem.out.println(7.0 / 2);'),
      },
      {
        title: 'Drop decimals with <code>(int)</code>',
        body: 'Putting <code>(int)</code> in front turns a double into an int. It <b>cuts off, it does not round</b>.',
        code: main('double weight = 12.8;\nint kg = (int) weight;\nSystem.out.println(kg);'),
        note: 'Writing just <code>int kg = weight;</code> is an error. Part of the value could be lost, so Java wants you to say so.',
      },
      {
        title: 'Keep decimals with <code>(double)</code>',
        body: 'To see decimals when dividing two integers, turn one side into a <code>(double)</code> before dividing.',
        code: main('int total = 10;\nSystem.out.println(total / 4);\nSystem.out.println((double) total / 4);'),
      },
    ],
    predict: {
      prompt: 'What will this code print?',
      code: main('int boxes = 7;\nSystem.out.println(boxes / 2);'),
      choices: ['3', '3.5', '4', '3.0'],
      answer: 0,
      explain: 'Dividing ints drops the decimals. 7 / 2 = 3',
    },
    fill: {
      prompt: 'Fill in the blank to record the weight as a whole number.',
      code: main('double weight = 12.8;\nint kg = {{0}} weight;\nSystem.out.println("Recorded weight: " + kg + "kg");'),
      blanks: [{ size: 5 }],
      expected: 'Recorded weight: 12kg',
      hints: ['It\'s the cast that turns a double into an int.', '(int)'],
      solution: ['(int)'],
    },
    write: {
      prompt: '10kg in total was split into 4 boxes. Put 10 in an <code>int</code> variable <code>total</code> and 4 in <code>boxes</code>, then print the average weight per box with decimals.',
      starter: main('// Write your code here\n'),
      expected: 'Average per box: 2.5kg',
      mustInclude: [
        { re: 'int\\s+total\\s*=\\s*10', msg: 'You need <code>int total = 10;</code>.' },
        { re: 'int\\s+boxes\\s*=\\s*4', msg: 'You need <code>int boxes = 4;</code>.' },
        { re: '\\(\\s*double\\s*\\)', msg: 'Try the <code>(double)</code> cast. Plain division gives 2.' },
      ],
      hints: ['total / boxes gives 2. How do you keep the decimals?', 'Wrap (double) total / boxes in parentheses and join it to the text: "Average per box: " + ((double) total / boxes) + "kg"'],
      solution: main('int total = 10;\nint boxes = 4;\nSystem.out.println("Average per box: " + ((double) total / boxes) + "kg");'),
    },
    learned: ['<code>int / int</code> → decimals dropped', '<code>(int) 12.8</code> → 12 (cut off)', '<code>(double) a / b</code> → keeps decimals'],
  },
];
