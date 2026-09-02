import type { CalculatorContent } from './types.ts'

export const scientificContent: CalculatorContent = {
  slug: 'scientific-calculator',
  seoTitle: 'Scientific Calculator — Powers, Roots and Trigonometry',
  seoDescription:
    'Free online scientific calculator with powers, square roots, trigonometry in degrees or radians, constants and parentheses. Runs entirely in your browser.',
  intro: {
    title: 'About this calculator',
    lead: 'Arithmetic, powers, roots and trigonometry, with parentheses and a degrees or radians mode.',
    paragraphs: [
      'Expressions are evaluated with standard precedence: parentheses first, then powers, then multiplication and division, then addition and subtraction. Powers are right-associative, so 2^3^2 is 2^9 rather than 8^2.',
      'The expression is read by a small purpose-built parser that understands only the operations on the keypad. It deliberately does not use the JavaScript evaluator, so anything outside that set is reported as an error rather than being run.',
      'Everything happens in your browser. Nothing you type is sent anywhere.',
    ],
  },
  howTo: {
    title: 'How to use the calculator',
    steps: [
      {
        title: 'Build the expression',
        description:
          'Use the keypad or type directly. Parentheses can be nested, and functions such as √ and sin open a bracket for you to close.',
      },
      {
        title: 'Choose degrees or radians',
        description:
          'The mode applies to sin, cos and tan. In degrees, sin(30) is 0.5; in radians the same input means something quite different.',
      },
      {
        title: 'Press equals',
        description:
          'The result replaces the display and can be used as the start of the next calculation.',
      },
      {
        title: 'Correct mistakes',
        description: 'Backspace removes the last character; C clears the whole expression.',
      },
    ],
  },
  formulasTitle: 'Supported operations',
  formulas: [
    {
      name: 'Order of operations',
      expression: 'parentheses → powers → × ÷ → + −',
      description: '2 + 3 × 4 is 14. Wrapping the addition, (2 + 3) × 4, gives 20.',
    },
    {
      name: 'Powers and roots',
      expression: 'x^y · √(x) · x² · 1/x',
      description:
        'Powers are right-associative and accept negative or fractional exponents: 9^0.5 is 3, and 2^-1 is 0.5.',
    },
    {
      name: 'Trigonometry',
      expression: 'sin(x) · cos(x) · tan(x)',
      description:
        'Quarter turns are exact in degree mode, so sin(180) is 0 rather than a rounding artefact, and tan(90) is reported as undefined.',
    },
    {
      name: 'Constants and percentage',
      expression: 'π · e · x%',
      description:
        'A trailing % divides by 100, so 50% is 0.5 and 200 × 10% is 20.',
    },
  ],
  examples: [
    {
      title: 'Precedence and parentheses',
      description: 'The same numbers grouped two ways.',
      inputs: [
        { label: 'Expression', value: '2 + 3 × 4' },
        { label: 'Expression', value: '(2 + 3) × 4' },
      ],
      result: '14 and 20.',
    },
    {
      title: 'A right-associative power',
      description: 'Powers group from the right.',
      inputs: [{ label: 'Expression', value: '2^3^2' }],
      result: '512, which is 2^9 — not 64.',
    },
    {
      title: 'Trigonometry in degrees',
      description: 'Common angles return exact values.',
      inputs: [
        { label: 'Expression', value: 'sin(30)' },
        { label: 'Expression', value: 'cos(180)' },
      ],
      result: '0.5 and −1.',
    },
    {
      title: 'A root inside a root',
      description: 'Functions can be nested freely.',
      inputs: [{ label: 'Expression', value: '√(√(16))' }],
      result: '2.',
    },
  ],
  faqs: [
    {
      question: 'Why does 2^3^2 give 512 rather than 64?',
      answer:
        'Powers are right-associative by convention, so the expression is read as 2^(3^2) = 2^9 = 512. Use (2^3)^2 if you want 64.',
    },
    {
      question: 'What does the percent key do?',
      answer:
        'It divides the value before it by 100, so 50% becomes 0.5 and 200 × 10% is 20. It is not the "add a percentage" behaviour some pocket calculators use — for that, try the Percentage Calculator.',
    },
    {
      question: 'Why is tan(90) an error?',
      answer:
        'The tangent of a quarter turn is genuinely undefined: it is a vertical asymptote. Rather than showing a very large number produced by rounding, the calculator says so.',
    },
    {
      question: 'Why does sin(180) give exactly 0?',
      answer:
        'Converting 180 degrees to radians cannot be exact, because π is irrational, so the raw computation returns about 1.2 × 10⁻¹⁶. The calculator uses the exact value at multiples of 90 degrees instead.',
    },
    {
      question: 'Can I type an expression instead of using the keypad?',
      answer:
        'Yes. The input accepts typing, using sqrt, sin, cos, tan, pi and e alongside the usual operators. Anything the parser does not recognise is reported as an error.',
    },
    {
      question: 'Is what I type sent anywhere?',
      answer:
        'No. The parser runs entirely in your browser, and expressions are never transmitted or stored.',
    },
  ],
  tip: {
    title: 'Check the angle mode first',
    body: 'Most surprising trigonometry results come from being in the wrong mode. sin(90) is 1 in degrees but about 0.894 in radians.',
  },
}
