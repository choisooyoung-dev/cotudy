// English version of ./quests.js (same ids, stages and NPCs). Shown when the display language is English.

export const QUESTS = [
  // ───────────── Office · Jiwon · First day ─────────────
  {
    id: 'office-1', stage: 'office', npc: 'han',
    title: 'Print your name on the badge',
    request: [
      'Okay Kim, here\'s your first task!',
      'We need to make your ID badge. Could you print your name in our system? In JavaScript!',
    ],
    thanks: 'Your badge is ready! Keep it around your neck, okay?',
    concepts: [
      {
        title: 'Print to the screen <code>console.log</code>',
        body: '<code>console.log(…)</code> prints what is inside the parentheses and <b>moves to a new line</b>.<br>Text (a string) goes inside quotes. Double quotes <code>" "</code> and single quotes <code>\' \'</code> both work.',
        code: 'console.log("Hello");\nconsole.log(\'I am Kim from logistics\');',
        note: 'Code runs <b>one line at a time, from the top</b>.',
      },
      {
        title: 'Printing several values at once',
        body: 'Put several values in <code>console.log</code>, separated by commas <code>,</code>, and they print on one line <b>with spaces between them</b>.',
        code: 'console.log("Boxes:", 12);\nconsole.log("Done");',
      },
      {
        title: 'The <code>;</code> at the end',
        body: 'JavaScript usually still runs if you leave out the semicolon <code>;</code> at the end. Still, getting used to adding it saves you confusion later.',
        code: 'console.log("With a semicolon");\nconsole.log("Runs without one too")',
        note: 'Upper and lower case matter. <code>Console.log</code> or <code>console.Log</code> is an error.',
      },
    ],
    predict: {
      prompt: 'What will this code print?',
      code: 'console.log("A", "B");\nconsole.log("C");',
      choices: ['A B\nC', 'AB\nC', 'A\nB\nC', 'A, B\nC'],
      answer: 0,
      explain: 'Values separated by commas print on one line with a space between them. The next console.log starts a new line.',
    },
    fill: {
      prompt: 'Fill in the blank so it prints these two lines.',
      code: 'console.{{0}}("ID BADGE");\nconsole.log("Name: Kim");',
      blanks: [{ size: 4 }],
      expected: 'ID BADGE\nName: Kim',
      hints: ['It looks just like the line below it.', 'Put log in the blank.'],
      solution: ['log'],
    },
    write: {
      prompt: 'Print the three badge lines yourself.',
      starter: '// Write your code here\n',
      expected: 'ID BADGE\nName: Kim\nTeam: Logistics',
      hints: ['Write console.log("…"); three times.', 'The first line is console.log("ID BADGE");'],
      solution: 'console.log("ID BADGE");\nconsole.log("Name: Kim");\nconsole.log("Team: Logistics");',
    },
    learned: ['<code>console.log("text");</code> → print, then new line', '<code>console.log(a, b)</code> → one line, spaced', 'Get used to ending lines with <code>;</code>'],
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
        body: 'Anything after <code>//</code> <b>does not run</b>. Use it to leave notes for people.<br>You can also put it in front of a line you don\'t want to run.',
        code: '// To-do for today\nconsole.log("Check deliveries");\n// console.log("This line does not run");\nconsole.log("Help shipping");',
      },
      {
        title: 'Reading error messages',
        body: 'This example misspells <code>console</code> as <code>consol</code> on purpose. Try running it.<br><code>consol is not defined</code> means "<b>I don\'t know the name consol</b>". The number in front tells you the line.',
        code: 'console.log("First line");\nconsol.log("Second line");',
        note: 'Lines <b>before the error still run</b>. But the mission window shows the error first when there is one.',
      },
      {
        title: 'Matching parentheses and quotes',
        body: 'Every opening <code>(</code> needs a closing <code>)</code>, and every opening quote needs a closing quote. If they don\'t match, <b>not a single line runs</b> and you get an error.',
        code: 'console.log("Matching pairs means it runs fine");',
      },
    ],
    predict: {
      prompt: 'Which line will have the error?',
      code: 'console.log("Box");\nconsole.log("Tape");\nconsole.lg("Label");',
      choices: ['Line 1', 'Line 2', 'Line 3', 'No error'],
      answer: 2,
      explain: 'console.lg on line 3 is a typo. console has no function called lg.',
    },
    fill: {
      prompt: 'Fill in the blank so the middle line does not run.',
      code: 'console.log("Work starts");\n{{0}} console.log("Test output");\nconsole.log("Work ends");',
      blanks: [{ size: 3 }],
      expected: 'Work starts\nWork ends',
      hints: ['There was a symbol that stops a line from running, remember?', 'Put // in the blank.'],
      solution: ['//'],
    },
    write: {
      prompt: 'Run the old memo program, then fix the errors so it prints the lines below.',
      starter: '// Today\'s work memo\nconsol.log("Morning: check deliveries");\nconsole.log("Afternoon: help shipping);',
      expected: 'Morning: check deliveries\nAfternoon: help shipping',
      hints: ['First press ▶ Run and read the error. The quote error shows up first.', 'Line 3 is missing the closing quote ", and on line 2 consol should be console.'],
      solution: '// Today\'s work memo\nconsole.log("Morning: check deliveries");\nconsole.log("Afternoon: help shipping");',
    },
    learned: ['After <code>//</code> is a note (does not run)', '<code>… is not defined</code> → unknown name (check for typos)', 'Parentheses and quotes must come in pairs'],
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
        title: 'Making a variable <code>let</code>',
        body: 'A variable is a <b>name</b> that holds a value. Make one with <code>let name = value;</code>, and after that use the name to get the value.',
        code: 'let boxCount = 12;\nconsole.log(boxCount);',
        note: 'Variable names start lowercase, and each new word starts with a capital: <code>boxCount</code>',
      },
      {
        title: 'Changing a variable, and <code>const</code>',
        body: 'You can put a new value into a <code>let</code> variable. The right side is worked out first, then stored on the left.<br>For a variable that <b>won\'t change</b>, use <code>const</code>. Putting a new value into a const is an error.',
        code: 'let boxCount = 12;\nboxCount = boxCount + 3;\nconsole.log(boxCount);\nconst center = "Cosmetics center";\nconsole.log(center);',
        note: 'Don\'t write <code>let</code> again when you store a new value. If you do, you get an "already declared" error.',
      },
      {
        title: 'Joining text and numbers with <code>+</code>',
        body: 'Use <code>+</code> to attach a number or variable to a string, and they join into one line.<br>You can also wrap text in backticks <code>`</code> and use <code>${variable}</code> to put a value right inside the string.',
        code: 'let boxCount = 12;\nconsole.log("Boxes: " + boxCount);\nconsole.log(`Boxes: ${boxCount}`);',
      },
    ],
    predict: {
      prompt: 'What will this code print?',
      code: 'let stock = 30;\nstock = stock - 8;\nconsole.log("Stock left: " + stock);',
      choices: ['Stock left: 22', 'Stock left: stock', 'Stock left: 30 - 8', '22'],
      answer: 0,
      explain: 'stock becomes 30 minus 8, which is 22, and it prints after "Stock left: ".',
    },
    fill: {
      prompt: 'Fill in the blanks so it prints "Lipstick boxes: 12".',
      code: '{{0}} boxCount = 12;\nconsole.log("Lipstick boxes: " + {{1}});',
      blanks: [{ size: 5 }, { size: 9 }],
      expected: 'Lipstick boxes: 12',
      hints: ['The first blank is the word that makes a variable (let or const).', 'The second blank is the variable you just made: let, boxCount'],
      solution: ['let', 'boxCount'],
    },
    write: {
      prompt: 'There were 20 boxes of sheet masks, and 5 more came in. Put 20 into a variable <code>maskBox</code>, add 5, then print it like below.',
      starter: '// Write your code here\n',
      expected: 'Sheet mask boxes: 25',
      mustInclude: [
        { re: 'let\\s+maskBox\\s*=\\s*20', msg: 'First make the variable with <code>let maskBox = 20;</code>.' },
        { re: 'maskBox\\s*=\\s*maskBox\\s*\\+\\s*5|maskBox\\s*\\+=\\s*5', msg: 'You need a line that adds 5 to <code>maskBox</code>.' },
      ],
      hints: ['Order: ① let maskBox = 20; ② maskBox = maskBox + 5; ③ print', 'The last line is console.log("Sheet mask boxes: " + maskBox);'],
      solution: 'let maskBox = 20;\nmaskBox = maskBox + 5;\nconsole.log("Sheet mask boxes: " + maskBox);',
    },
    learned: ['Make a variable with <code>let name = value;</code>', 'Values that don\'t change: <code>const</code>', '<code>"text" + variable</code>, <code>`text ${variable}`</code>'],
  },
  {
    id: 'recv-long-double', stage: 'receiving', npc: 'park',
    title: 'Barcode and volume',
    request: [
      'This time it\'s barcodes and volumes.',
      'The barcode number is really long, and the volume has a decimal point… How does JavaScript hold these?',
    ],
    thanks: 'Just one number type? That\'s handy! Thanks!',
    concepts: [
      {
        title: 'Numbers are just <code>number</code>',
        body: 'JavaScript doesn\'t separate whole numbers and decimals. A big integer like a barcode and a decimal like a volume are both a <b>number</b>.<br>Use <code>typeof</code> to see the type of a value.',
        code: 'let barcode = 8801234567890;\nlet volume = 50.5;\nconsole.log(barcode);\nconsole.log(volume / 2);\nconsole.log(typeof barcode, typeof volume);',
        note: 'Very big numbers (over about 9 quadrillion) stop being exact. A barcode is fine.',
      },
      {
        title: 'Whole results print without <code>.0</code>',
        body: 'If a result comes out even, it prints with no decimal point. <code>0.25 * 4</code> prints <code>1</code>, not <code>1.0</code>.',
        code: 'console.log(0.25 * 4);\nconsole.log(30.0);',
      },
      {
        title: 'Fixing decimal places <code>toFixed</code>',
        body: '<code>number.toFixed(digits)</code> makes a <b>string</b> with exactly that many digits after the decimal point.',
        code: 'let weight = 1;\nconsole.log(weight.toFixed(1));\nconsole.log((2 / 3).toFixed(2));',
      },
    ],
    predict: {
      prompt: 'What will this code print?',
      code: 'let weight = 0.5;\nconsole.log(weight * 4);',
      choices: ['2', '2.0', '2.00', 'weight * 4'],
      answer: 0,
      explain: '0.5 × 4 = 2. An even result prints as 2, without a decimal point.',
    },
    fill: {
      prompt: 'Fill in the blank so it prints like below.',
      code: 'let barcode = 8801234567890;\nlet volume = {{0}};\nconsole.log("Barcode: " + barcode);\nconsole.log("Volume: " + volume + "ml");',
      blanks: [{ size: 5 }],
      expected: 'Barcode: 8801234567890\nVolume: 30.5ml',
      hints: ['Find the volume number in the expected output.', '30.5'],
      solution: ['30.5'],
    },
    write: {
      prompt: 'One sunscreen weighs 0.25kg. How much do 4 in one box weigh? Put 0.25 in a variable <code>weight</code>, multiply by 4, and print it <b>with one decimal place</b>.',
      starter: '// Write your code here\n',
      expected: 'Box weight: 1.0kg',
      mustInclude: [
        { re: '(let|const)\\s+weight\\s*=\\s*0\\.25', msg: 'Make the variable with <code>let weight = 0.25;</code>.' },
        { re: 'toFixed\\s*\\(\\s*1\\s*\\)', msg: 'Plain multiplying prints 1. Try <code>toFixed(1)</code>.' },
      ],
      hints: ['weight * 4 is 1. How do you print it as 1.0?', 'Join (weight * 4).toFixed(1) to the text: "Box weight: " + (weight * 4).toFixed(1) + "kg"'],
      solution: 'let weight = 0.25;\nconsole.log("Box weight: " + (weight * 4).toFixed(1) + "kg");',
    },
    learned: ['Whole numbers and decimals are both <code>number</code>', 'Even results print as <code>1</code>', '<code>number.toFixed(1)</code> → string with one decimal place'],
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
        body: 'It\'s one of two values: <code>true</code> or <code>false</code>. Write them without quotes.',
        code: 'let passed = true;\nlet expired = false;\nconsole.log(passed);\nconsole.log(expired);',
      },
      {
        title: 'Text <code>string</code>',
        body: 'Text is a string, whether it\'s one character or many. <code>"A"</code> and <code>\'A\'</code> are both strings.',
        code: 'let grade = \'A\';\nlet name = "Cushion compact";\nconsole.log(grade, typeof grade);\nconsole.log(name + " arrived");',
      },
      {
        title: '<code>+</code> works from the left',
        body: '<code>+</code> works from left to right. Numbers together are added, and as soon as a string shows up, everything after is joined.',
        code: 'console.log(1 + 2 + " boxes");\nconsole.log("Box" + 1 + 2);',
      },
    ],
    predict: {
      prompt: 'What will this code print?',
      code: 'console.log("Pallet" + 2 + 3);',
      choices: ['Pallet23', 'Pallet5', '5Pallet', 'Error'],
      answer: 0,
      explain: '"Pallet" + 2 → "Pallet2", then + 3 → "Pallet23". Once a string comes first, everything after is joined.',
    },
    fill: {
      prompt: 'Fill in the blanks so the inspection sheet prints like below.',
      code: 'let name = {{0}};\nlet grade = {{1}};\nlet passed = {{2}};\nconsole.log("Product: " + name);\nconsole.log("Grade: " + grade);\nconsole.log("Passed: " + passed);',
      blanks: [{ size: 10 }, { size: 4 }, { size: 5 }],
      expected: 'Product: Lip tint\nGrade: A\nPassed: true',
      hints: ['Wrap strings in quotes, and write true without quotes.', '"Lip tint", "A", true'],
      solution: ['"Lip tint"', '"A"', 'true'],
    },
    write: {
      prompt: 'Print the toner inspection sheet yourself. Make a variable for each: product name, grade, and passed.',
      starter: '// Write your code here\n',
      expected: 'Product: Toner\nGrade: B\nPassed: false',
      mustInclude: [
        { re: '(let|const)\\s+\\w+\\s*=\\s*["\'`]Toner', msg: 'Put the product name "Toner" in a variable.' },
        { re: '(let|const)\\s+\\w+\\s*=\\s*false', msg: 'Put the passed value <code>false</code> in a variable (no quotes).' },
      ],
      hints: ['It has the same shape as the fill-in problem. Just change the values to "Toner", "B", false.', 'Make let name = "Toner"; let grade = "B"; let passed = false; and print three lines.'],
      solution: 'let name = "Toner";\nlet grade = "B";\nlet passed = false;\nconsole.log("Product: " + name);\nconsole.log("Grade: " + grade);\nconsole.log("Passed: " + passed);',
    },
    learned: ['<code>true</code> / <code>false</code> without quotes', 'All text is a string', '<code>+</code> works from the left: after a string, it joins'],
  },
  {
    id: 'recv-cast', stage: 'receiving', npc: 'park',
    title: 'Receiving totals',
    request: [
      'Last one: the receiving totals!',
      'We need the weight cut down to whole kg, and an average too. You can do that in JavaScript, right?',
    ],
    thanks: 'You can handle everything in receiving now! Thank you so much, Kim!',
    concepts: [
      {
        title: 'Division keeps the decimals',
        body: 'Even when you divide two whole numbers, the result <b>keeps the decimals</b>.',
        code: 'console.log(7 / 2);\nconsole.log(10 / 4);',
      },
      {
        title: 'Drop decimals with <code>Math.floor</code>',
        body: '<code>Math.floor(number)</code> drops everything after the decimal point. (Strictly, it gives the biggest whole number not larger than it.)<br>To round, use <code>Math.round</code>.',
        code: 'console.log(Math.floor(12.8));\nconsole.log(Math.round(12.8));\nconsole.log(Math.floor(7 / 2));',
      },
      {
        title: 'Turning strings into numbers and back',
        body: 'If a value from the system comes in as the string <code>"12"</code>, + joins instead of adding. Turn it into a number with <code>Number("12")</code>. The other way is <code>String(12)</code>.',
        code: 'let input = "12";\nconsole.log(input + 3);\nconsole.log(Number(input) + 3);',
      },
    ],
    predict: {
      prompt: 'What will this code print?',
      code: 'let boxes = 7;\nconsole.log(boxes / 2);',
      choices: ['3.5', '3', '4', '3.0'],
      answer: 0,
      explain: 'Division keeps the decimals. 7 / 2 = 3.5',
    },
    fill: {
      prompt: 'Fill in the blank to record the weight as a whole number.',
      code: 'let weight = 12.8;\nlet kg = {{0}}(weight);\nconsole.log("Recorded weight: " + kg + "kg");',
      blanks: [{ size: 10 }],
      expected: 'Recorded weight: 12kg',
      hints: ['It\'s the function that drops the decimals. Not rounding!', 'Math.floor'],
      solution: ['Math.floor'],
    },
    write: {
      prompt: 'The system sent the total weight as the string <code>"10"</code>. Put <code>"10"</code> in <code>total</code> and 4 in <code>boxes</code>, turn it into a number, and print the average weight per box.',
      starter: '// Write your code here\nlet total = "10";\nlet boxes = 4;\n',
      expected: 'Average per box: 2.5kg',
      mustInclude: [
        { re: 'total\\s*=\\s*["\'`]10["\'`]', msg: 'Leave <code>total</code> as the string <code>"10"</code>.' },
        { re: 'Number\\s*\\(\\s*total\\s*\\)', msg: 'Try turning it into a number with <code>Number(total)</code>.' },
      ],
      hints: ['"10" / 4 actually gives 2.5 too. But + would join, so get used to converting to a number.', 'Use Number(total), like console.log("Average per box: " + Number(total) / boxes + "kg");'],
      solution: 'let total = "10";\nlet boxes = 4;\nconsole.log("Average per box: " + Number(total) / boxes + "kg");',
    },
    learned: ['Division keeps decimals: <code>7 / 2</code> → 3.5', '<code>Math.floor(12.8)</code> → 12 (cut off)', '<code>Number("12")</code> string → number'],
  },
];
