import type { CalculatorContent } from './types'

export const fractionContent: CalculatorContent = {
  slug: 'fraction-calculator',
  seoTitle: 'Fraction Calculator — Add, Subtract, Multiply and Divide Fractions',
  seoDescription:
    'Free fraction calculator. Add, subtract, multiply, or divide two fractions and get the answer in lowest terms, as a mixed number, and as a decimal.',
  intro: {
    title: 'About fractions',
    lead: 'Add, subtract, multiply, or divide two fractions and get the answer in lowest terms.',
    paragraphs: [
      'A fraction represents a part of a whole. The number below the line, the denominator, says how many equal pieces the whole is divided into; the number above it, the numerator, says how many of those pieces you have.',
      'This calculator works with whole-number numerators and denominators and does the arithmetic exactly, without converting to decimals first. That matters for values like a third, which has no exact decimal form — a third plus a third is reported as two thirds rather than 0.6666666666666666.',
    ],
  },
  howTo: {
    title: 'How to calculate with fractions',
    steps: [
      {
        title: 'Choose an operation',
        description:
          'Pick add, subtract, multiply, or divide. The formula changes with the operation, so this decides how the two fractions are combined.',
      },
      {
        title: 'Enter both fractions',
        description:
          'Type a whole number into each numerator and denominator. Negative numerators are fine; a denominator of zero is not, since dividing a whole into zero pieces is meaningless.',
      },
      {
        title: 'Read the simplified answer',
        description:
          'The result is automatically reduced to lowest terms by dividing the top and bottom by their greatest common divisor.',
      },
      {
        title: 'Check the other forms',
        description:
          'The same answer is shown as a mixed number when it is bigger than one, and as a decimal, so you can use whichever form suits your work.',
      },
    ],
  },
  formulasTitle: 'Fraction formulas',
  formulas: [
    {
      name: 'Addition',
      expression: '(a/b) + (c/d) = (a×d + c×b) / (b×d)',
      description:
        'Put both fractions over a common denominator, then add the numerators. 1/2 + 1/4 = (1×4 + 1×2)/8 = 6/8, which reduces to 3/4.',
    },
    {
      name: 'Subtraction',
      expression: '(a/b) − (c/d) = (a×d − c×b) / (b×d)',
      description:
        'The same common denominator, with the numerators subtracted. 3/4 − 1/4 = 2/4, which reduces to 1/2.',
    },
    {
      name: 'Multiplication',
      expression: '(a/b) × (c/d) = (a×c) / (b×d)',
      description:
        'Multiply straight across, top by top and bottom by bottom. 2/3 × 3/4 = 6/12, which reduces to 1/2.',
    },
    {
      name: 'Division',
      expression: '(a/b) ÷ (c/d) = (a×d) / (b×c)',
      description:
        'Flip the second fraction and multiply. 1/2 ÷ 1/4 = 1/2 × 4/1 = 4/2, which reduces to 2.',
    },
    {
      name: 'Simplifying',
      expression: 'divide the numerator and denominator by their GCD',
      description:
        'The greatest common divisor of 6 and 8 is 2, so 6/8 becomes 3/4. Dividing both parts by the same number leaves the value unchanged.',
    },
  ],
  examples: [
    {
      title: 'Adding halves and quarters',
      description: 'A classic common-denominator problem.',
      inputs: [
        { label: 'First fraction', value: '1/2' },
        { label: 'Operation', value: 'Add' },
        { label: 'Second fraction', value: '1/4' },
      ],
      result: '3/4 (0.75)',
    },
    {
      title: 'Subtracting a quarter',
      description: 'Both fractions already share a denominator.',
      inputs: [
        { label: 'First fraction', value: '3/4' },
        { label: 'Operation', value: 'Subtract' },
        { label: 'Second fraction', value: '1/4' },
      ],
      result: '1/2 (0.5)',
    },
    {
      title: 'Multiplying two fractions',
      description: 'Multiplying by a fraction below one always makes the result smaller.',
      inputs: [
        { label: 'First fraction', value: '2/3' },
        { label: 'Operation', value: 'Multiply' },
        { label: 'Second fraction', value: '3/4' },
      ],
      result: '1/2 (0.5)',
    },
    {
      title: 'Dividing by a quarter',
      description: 'Asking how many quarters fit into a half.',
      inputs: [
        { label: 'First fraction', value: '1/2' },
        { label: 'Operation', value: 'Divide' },
        { label: 'Second fraction', value: '1/4' },
      ],
      result: '2',
    },
  ],
  faqs: [
    {
      question: 'How do I add fractions with different denominators?',
      answer:
        'Rewrite both over a shared denominator before adding. Multiplying the two denominators together always gives one that works: for 1/2 + 1/4 that is 8, giving 4/8 + 2/8 = 6/8, which simplifies to 3/4.',
    },
    {
      question: 'Why does dividing by a fraction make the answer bigger?',
      answer:
        'Dividing asks how many of the second fraction fit into the first. Two quarters fit into a half, so 1/2 ÷ 1/4 = 2. Whenever you divide by a value below one, the result grows.',
    },
    {
      question: 'What is an improper fraction?',
      answer:
        'One where the numerator is at least as large as the denominator, such as 5/4. It is perfectly valid, and the calculator also shows it as the mixed number 1 1/4.',
    },
    {
      question: 'Why can a denominator never be zero?',
      answer:
        'The denominator says how many pieces the whole is split into, and splitting something into zero pieces has no meaning. In arithmetic terms it would be division by zero, which is undefined, so the calculator rejects it.',
    },
    {
      question: 'How does the calculator handle negative fractions?',
      answer:
        'Enter a negative numerator. Results carry the sign on the numerator, so a negative answer appears as −1/2 rather than 1/−2, which is the conventional way to write it.',
    },
    {
      question: 'Are the results exact?',
      answer:
        'Yes, for the fraction itself. All four operations use whole-number arithmetic rather than decimals, so no rounding creeps in. Only the decimal shown alongside is approximate, since some fractions have no exact decimal form.',
    },
  ],
  tip: {
    title: 'Simplify before you multiply',
    body: 'When multiplying, cancel any common factor between one numerator and the other denominator first. 2/3 × 3/4 becomes 1/1 × 1/2 once the threes cancel, which keeps the numbers small.',
  },
}
