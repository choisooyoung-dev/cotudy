// English version of ./quests.js (same ids, stages and NPCs). Shown when the display language is English.

export const QUESTS = [
  // ───────────── Office · Jiwon · First day ─────────────
  {
    id: 'office-1', stage: 'office', npc: 'han',
    title: 'Print your name on the badge',
    request: [
      'Okay Kim, here\'s your first task!',
      'We need to make your ID badge. Could you print your name in our system? In Python!',
    ],
    thanks: 'Your badge is ready! Keep it around your neck, okay?',
    concepts: [
      {
        title: 'Print to the screen <code>print</code>',
        body: '<code>print(…)</code> prints what is inside the parentheses and <b>moves to a new line</b>.<br>Text (a string) goes inside quotes. Double quotes <code>" "</code> and single quotes <code>\' \'</code> both work.',
        code: 'print("Hello")\nprint(\'I am Kim from logistics\')',
        note: 'Code runs <b>one line at a time, from the top</b>.',
      },
      {
        title: 'Printing several values at once',
        body: 'Put several values in <code>print</code>, separated by commas <code>,</code>, and they print on one line <b>with spaces between them</b>.',
        code: 'print("Boxes:", 12)\nprint("Done")',
      },
      {
        title: 'One line, one statement',
        body: 'In Python, <b>one line is one statement</b>. You don\'t put a symbol at the end.<br>But adding spaces at the start of a line where they don\'t belong is an error. Spaces at the start of a line are used later, for if statements and loops.',
        code: 'print("One per line")\nprint("No spaces at the start")',
        note: 'Upper and lower case matter. <code>Print</code> or <code>PRINT</code> is an error.',
      },
    ],
    predict: {
      prompt: 'What will this code print?',
      code: 'print("A", "B")\nprint("C")',
      choices: ['A B\nC', 'AB\nC', 'A\nB\nC', 'A, B\nC'],
      answer: 0,
      explain: 'Values separated by commas print on one line with a space between them. The next print starts a new line.',
    },
    fill: {
      prompt: 'Fill in the blank so it prints these two lines.',
      code: '{{0}}("ID BADGE")\nprint("Name: Kim")',
      blanks: [{ size: 6 }],
      expected: 'ID BADGE\nName: Kim',
      hints: ['It looks just like the line below it.', 'Put print in the blank.'],
      solution: ['print'],
    },
    write: {
      prompt: 'Print the three badge lines yourself.',
      starter: '# Write your code here\n',
      expected: 'ID BADGE\nName: Kim\nTeam: Logistics',
      hints: ['Write print("…") three times.', 'The first line is print("ID BADGE")'],
      solution: 'print("ID BADGE")\nprint("Name: Kim")\nprint("Team: Logistics")',
    },
    learned: ['<code>print("text")</code> → print, then new line', '<code>print(a, b)</code> → one line, spaced', 'One line is one statement, no spaces at the start'],
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
        title: 'Comments <code>#</code>',
        body: 'Anything after <code>#</code> <b>does not run</b>. Use it to leave notes for people.<br>You can also put it in front of a line you don\'t want to run.',
        code: '# To-do for today\nprint("Check deliveries")\n# print("This line does not run")\nprint("Help shipping")',
      },
      {
        title: 'Reading error messages',
        body: 'This example misspells <code>print</code> as <code>prnt</code> on purpose. Try running it.<br><code>line 2</code> means <b>the 2nd line</b>, and <code>NameError: name \'prnt\' is not defined</code> means "<b>I don\'t know the name prnt</b>".',
        code: 'print("First line")\nprnt("Second line")',
        note: 'Read error messages from the <b>bottom line</b> up. That\'s where the error type and the reason are.',
      },
      {
        title: 'Matching parentheses and quotes',
        body: 'Every opening <code>(</code> needs a closing <code>)</code>, and every opening quote needs a closing quote. If they don\'t match, <b>not a single line runs</b> and you get a <code>SyntaxError</code>.',
        code: 'print("Matching pairs means it runs fine")',
      },
    ],
    predict: {
      prompt: 'Which line will have the error?',
      code: 'print("Box")\nprint("Tape")\npirnt("Label")',
      choices: ['Line 1', 'Line 2', 'Line 3', 'No error'],
      answer: 2,
      explain: 'pirnt on line 3 is a typo. Python doesn\'t know the name pirnt, so you get a NameError.',
    },
    fill: {
      prompt: 'Fill in the blank so the middle line does not run.',
      code: 'print("Work starts")\n{{0}} print("Test output")\nprint("Work ends")',
      blanks: [{ size: 2 }],
      expected: 'Work starts\nWork ends',
      hints: ['There was a symbol that stops a line from running, remember?', 'Put # in the blank.'],
      solution: ['#'],
    },
    write: {
      prompt: 'Run the old memo program, then fix the errors so it prints the lines below.',
      starter: '# Today\'s work memo\nprnt("Morning: check deliveries")\nprint("Afternoon: help shipping)',
      expected: 'Morning: check deliveries\nAfternoon: help shipping',
      hints: ['First press ▶ Run and read the error. The quote error shows up first.', 'Line 3 is missing the closing quote ", and on line 2 prnt should be print.'],
      solution: '# Today\'s work memo\nprint("Morning: check deliveries")\nprint("Afternoon: help shipping")',
    },
    learned: ['After <code>#</code> is a note (does not run)', 'Read errors from the bottom: <code>line N</code> = the line', 'Parentheses and quotes must come in pairs'],
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
        title: 'Making a variable',
        body: 'A variable is a <b>name</b> that holds a value. Make one with <code>name = value</code>, and after that use the name to get the value.',
        code: 'box_count = 12\nprint(box_count)',
        note: 'Python variable names are usually lowercase, with underscores <code>_</code> between words: <code>box_count</code>',
      },
      {
        title: 'Changing a variable',
        body: 'When you put a new value into a variable, the old value is gone. The right side is worked out first, then stored on the left.',
        code: 'box_count = 12\nprint(box_count)\nbox_count = box_count + 3\nprint(box_count)',
      },
      {
        title: 'Putting values inside text <code>f"…{variable}…"</code>',
        body: 'Put <code>f</code> before the quotes, and each <code>{variable}</code> inside the string is replaced by its value. (An f-string)<br>You can also print with commas, but commas add a space in between.',
        code: 'box_count = 12\nprint(f"Boxes: {box_count}")\nprint("Boxes:", box_count)',
        note: 'Joining a string and a number with <code>+</code>, like <code>"Boxes: " + box_count</code>, is an error. Use an f-string instead.',
      },
    ],
    predict: {
      prompt: 'What will this code print?',
      code: 'stock = 30\nstock = stock - 8\nprint(f"Stock left: {stock}")',
      choices: ['Stock left: 22', 'Stock left: {stock}', 'Stock left: 30 - 8', '22'],
      answer: 0,
      explain: 'stock becomes 30 minus 8, which is 22, and 22 goes into the {stock} spot of the f-string.',
    },
    fill: {
      prompt: 'Fill in the blanks so it prints "Lipstick boxes: 12".',
      code: 'box_count = {{0}}\nprint({{1}}"Lipstick boxes: {box_count}")',
      blanks: [{ size: 3 }, { size: 2 }],
      expected: 'Lipstick boxes: 12',
      hints: ['The first blank is the number of boxes. The second is the letter that turns {variable} into its value.', '12, f'],
      solution: ['12', 'f'],
    },
    write: {
      prompt: 'There were 20 boxes of sheet masks, and 5 more came in. Put 20 into a variable <code>mask_box</code>, add 5, then print it like below.',
      starter: '# Write your code here\n',
      expected: 'Sheet mask boxes: 25',
      mustInclude: [
        { re: 'mask_box\\s*=\\s*20', msg: 'First make the variable with <code>mask_box = 20</code>.' },
        { re: 'mask_box\\s*=\\s*mask_box\\s*\\+\\s*5|mask_box\\s*\\+=\\s*5', msg: 'You need a line that adds 5 to <code>mask_box</code>.' },
      ],
      hints: ['Order: ① mask_box = 20 ② mask_box = mask_box + 5 ③ print', 'The last line is print(f"Sheet mask boxes: {mask_box}")'],
      solution: 'mask_box = 20\nmask_box = mask_box + 5\nprint(f"Sheet mask boxes: {mask_box}")',
    },
    learned: ['Make a variable with <code>name = value</code>', 'New value: <code>name = newValue</code>', 'Print values with <code>f"text {variable}"</code>'],
  },
  {
    id: 'recv-long-double', stage: 'receiving', npc: 'park',
    title: 'Barcode and volume',
    request: [
      'This time it\'s barcodes and volumes.',
      'The barcode number is really long, and the volume has a decimal point… How does Python hold these?',
    ],
    thanks: 'Integers and floats, got it now! Thanks!',
    concepts: [
      {
        title: 'Integers <code>int</code>',
        body: 'A number with no decimal point is an <b>int</b> (integer). Even a very long one like a barcode fits as it is.<br>Use <code>type(value)</code> to see the type of a value.',
        code: 'barcode = 8801234567890\nprint(barcode)\nprint(type(barcode))',
      },
      {
        title: 'Decimals <code>float</code>',
        body: 'A number with a decimal point is a <b>float</b>. Things like volume, weight, or a discount rate.<br>A float shows the decimal point even when it comes out even, like <code>1.0</code>.',
        code: 'volume = 50.5\nprint(volume / 2)\nprint(type(volume))\nprint(0.25 * 4)',
      },
      {
        title: 'Division <code>/</code> always gives a float',
        body: 'Dividing with <code>/</code> gives a <b>float</b>, even when it comes out even.',
        code: 'print(30 / 2)\nprint(7 / 2)',
      },
    ],
    predict: {
      prompt: 'What will this code print?',
      code: 'weight = 0.5\nprint(weight * 4)',
      choices: ['2.0', '2', '2.00', 'weight * 4'],
      answer: 0,
      explain: '0.5 is a float, so the result is a float too. 0.5 × 4 = 2.0',
    },
    fill: {
      prompt: 'Fill in the blank so it prints like below.',
      code: 'barcode = 8801234567890\nvolume = {{0}}\nprint(f"Barcode: {barcode}")\nprint(f"Volume: {volume}ml")',
      blanks: [{ size: 5 }],
      expected: 'Barcode: 8801234567890\nVolume: 30.5ml',
      hints: ['Find the volume number in the expected output.', '30.5'],
      solution: ['30.5'],
    },
    write: {
      prompt: 'One sunscreen weighs 0.25kg. How much do 4 in one box weigh? Put 0.25 in a variable <code>weight</code>, multiply by 4, and print it.',
      starter: '# Write your code here\n',
      expected: 'Box weight: 1.0kg',
      mustInclude: [{ re: 'weight\\s*=\\s*0\\.25', msg: 'Make the variable with <code>weight = 0.25</code>.' }],
      hints: ['Multiply is *. weight * 4', 'You can do the math right inside {}, like print(f"Box weight: {weight * 4}kg")'],
      solution: 'weight = 0.25\nprint(f"Box weight: {weight * 4}kg")',
    },
    learned: ['No decimal point: <code>int</code>', 'With a decimal point: <code>float</code> (prints like 1.0)', '<code>/</code> division always gives a float'],
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
        title: 'True or false <code>bool</code>',
        body: 'It\'s one of two values: <code>True</code> or <code>False</code>. <b>Capital first letter</b>, no quotes.',
        code: 'passed = True\nexpired = False\nprint(passed)\nprint(expired)',
      },
      {
        title: 'Text <code>str</code>',
        body: 'Text is a <b>str</b> (string), whether it\'s one character or many. Join strings with <code>+</code>.',
        code: 'grade = "A"\nname = "Cushion compact"\nprint(grade, type(grade))\nprint(name + " arrived")',
      },
      {
        title: 'Repeat with <code>*</code>, numbers to text with <code>str()</code>',
        body: 'A string <code>*</code> a number repeats it that many times. To join a number to a string with <code>+</code>, turn it into text with <code>str(number)</code>.',
        code: 'print("Box" * 3)\nprint("Pallet" + str(2))',
      },
    ],
    predict: {
      prompt: 'What will this code print?',
      code: 'print("Pallet" + str(2) + str(3))',
      choices: ['Pallet23', 'Pallet5', '5Pallet', 'Error'],
      answer: 0,
      explain: 'str(2) is the string "2" and str(3) is "3". + between strings joins them, so you get "Pallet23".',
    },
    fill: {
      prompt: 'Fill in the blanks so the inspection sheet prints like below.',
      code: 'name = {{0}}\ngrade = {{1}}\npassed = {{2}}\nprint(f"Product: {name}")\nprint(f"Grade: {grade}")\nprint(f"Passed: {passed}")',
      blanks: [{ size: 10 }, { size: 4 }, { size: 5 }],
      expected: 'Product: Lip tint\nGrade: A\nPassed: True',
      hints: ['Wrap strings in quotes. True has no quotes and a capital first letter.', '"Lip tint", "A", True'],
      solution: ['"Lip tint"', '"A"', 'True'],
    },
    write: {
      prompt: 'Print the toner inspection sheet yourself. Make a variable for each: product name, grade, and passed.',
      starter: '# Write your code here\n',
      expected: 'Product: Toner\nGrade: B\nPassed: False',
      mustInclude: [
        { re: '\\w+\\s*=\\s*["\']Toner', msg: 'Put the product name "Toner" in a variable.' },
        { re: '\\w+\\s*=\\s*False', msg: 'Put the passed value <code>False</code> in a variable (no quotes, capital F).' },
      ],
      hints: ['It has the same shape as the fill-in problem. Just change the values to "Toner", "B", False.', 'Make name = "Toner", grade = "B", passed = False and print three lines with f-strings.'],
      solution: 'name = "Toner"\ngrade = "B"\npassed = False\nprint(f"Product: {name}")\nprint(f"Grade: {grade}")\nprint(f"Passed: {passed}")',
    },
    learned: ['<code>True</code> / <code>False</code> (capital first letter)', 'All text is <code>str</code>', '<code>"text" * 3</code> repeats, <code>str(number)</code> makes text'],
  },
  {
    id: 'recv-cast', stage: 'receiving', npc: 'park',
    title: 'Receiving totals',
    request: [
      'Last one: the receiving totals!',
      'We need the weight cut down to whole kg, and an average too. You can do that in Python, right?',
    ],
    thanks: 'You can handle everything in receiving now! Thank you so much, Kim!',
    concepts: [
      {
        title: 'Floor division <code>//</code>',
        body: '<code>/</code> divides with decimals, and <code>//</code> gives <b>only the whole part (decimals dropped)</b>.',
        code: 'print(7 / 2)\nprint(7 // 2)',
      },
      {
        title: 'Drop decimals with <code>int()</code>',
        body: '<code>int(float)</code> <b>drops</b> the decimals and turns it into an integer. To round, use <code>round()</code>.',
        code: 'print(int(12.8))\nprint(round(12.8))',
      },
      {
        title: 'String → number <code>int("10")</code>',
        body: 'If a value from the system comes in as the string <code>"10"</code>, you can\'t do math with it like a number. Turn it into an integer with <code>int("10")</code>. For text with a decimal point, use <code>float("2.5")</code>.',
        code: 'total = "10"\nprint(total * 2)\nprint(int(total) * 2)',
      },
    ],
    predict: {
      prompt: 'What will this code print?',
      code: 'boxes = 7\nprint(boxes // 2)',
      choices: ['3', '3.5', '4', '3.0'],
      answer: 0,
      explain: '// gives only the whole part. 7 // 2 = 3',
    },
    fill: {
      prompt: 'Fill in the blank to record the weight as a whole number.',
      code: 'weight = 12.8\nkg = {{0}}(weight)\nprint(f"Recorded weight: {kg}kg")',
      blanks: [{ size: 4 }],
      expected: 'Recorded weight: 12kg',
      hints: ['It\'s the function that turns a float into an integer. It cuts off, it doesn\'t round!', 'int'],
      solution: ['int'],
    },
    write: {
      prompt: 'The system sent the total weight as the string <code>"10"</code>. Turn it into a number and print the average weight of 4 boxes.',
      starter: '# Write your code here\ntotal = "10"\nboxes = 4\n',
      expected: 'Average per box: 2.5kg',
      mustInclude: [
        { re: 'total\\s*=\\s*["\']10["\']', msg: 'Leave <code>total</code> as the string <code>"10"</code>.' },
        { re: 'int\\s*\\(\\s*total\\s*\\)|float\\s*\\(\\s*total\\s*\\)', msg: 'Try turning it into a number with <code>int(total)</code>.' },
      ],
      hints: ['total / boxes is an error. You can\'t divide a string.', 'print(f"Average per box: {int(total) / boxes}kg")'],
      solution: 'total = "10"\nboxes = 4\nprint(f"Average per box: {int(total) / boxes}kg")',
    },
    learned: ['<code>7 // 2</code> → 3 (whole part)', '<code>int(12.8)</code> → 12 (cut off)', '<code>int("10")</code> string → integer'],
  },
];
