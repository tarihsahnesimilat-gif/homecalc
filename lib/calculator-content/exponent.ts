import type { CalculatorContent } from './types.ts'

export const exponentContent: CalculatorContent = {
  slug: 'exponent-calculator',
  seoTitle: 'Exponent Calculator — Raise a Number to Any Power',
  seoDescription:
    'Free exponent calculator. Raise any base to a power, including negative and fractional exponents, with undefined cases reported rather than guessed.',
  intro: {
    title: 'About exponents',
    lead: 'Raise any number to a power, including negative and fractional exponents.',
    paragraphs: [
      'An exponent says how many times to multiply a number by itself: 2³ is 2 × 2 × 2 = 8. The number being multiplied is the base, and the small raised number is the exponent or power.',
      'The idea extends beyond whole numbers. A negative exponent means one divided by the positive power, so 5⁻² is 1 ÷ 25 = 0.04. A fractional exponent is a root: raising to the power of 0.5 is the same as taking the square root.',
    ],
  },
  howTo: {
    title: 'How to use the exponent calculator',
    steps: [
      { title: 'Enter the base', description: 'The number being raised. It may be negative.' },
      {
        title: 'Enter the exponent',
        description: 'Whole, negative or fractional. Zero gives 1 for any base other than zero.',
      },
      {
        title: 'Read the result',
        description: 'Shown to full precision, with the calculation written out beneath it.',
      },
      {
        title: 'Watch for undefined cases',
        description:
          'Some combinations have no real answer and are reported rather than approximated. The FAQ explains which and why.',
      },
    ],
  },
  formulasTitle: 'Exponent rules',
  formulas: [
    {
      name: 'Whole-number exponent',
      expression: 'bⁿ = b × b × … × b, n times',
      description: '2³ = 2 × 2 × 2 = 8, and 10² = 100.',
    },
    {
      name: 'Zero exponent',
      expression: 'b⁰ = 1, for any b other than 0',
      description: 'It follows from dividing a power by itself: b² ÷ b² is both 1 and b⁰.',
    },
    {
      name: 'Negative exponent',
      expression: 'b⁻ⁿ = 1 ÷ bⁿ',
      description: '5⁻² is 1 ÷ 5² = 1 ÷ 25 = 0.04.',
    },
    {
      name: 'Fractional exponent',
      expression: 'b^(1/n) = the nth root of b',
      description: '9^0.5 is the square root of 9, which is 3. 16^0.25 is the fourth root, 2.',
    },
  ],
  examples: [
    {
      title: 'A whole power',
      description: 'Two cubed.',
      inputs: [
        { label: 'Base', value: '2' },
        { label: 'Exponent', value: '3' },
      ],
      result: '8',
    },
    {
      title: 'A negative exponent',
      description: 'Negative powers give the reciprocal.',
      inputs: [
        { label: 'Base', value: '5' },
        { label: 'Exponent', value: '-2' },
      ],
      result: '0.04',
    },
    {
      title: 'A fractional exponent',
      description: 'Raising to a half is taking the square root.',
      inputs: [
        { label: 'Base', value: '9' },
        { label: 'Exponent', value: '0.5' },
      ],
      result: '3',
    },
  ],
  faqs: [
    {
      question: 'Why is anything to the power of zero equal to one?',
      answer:
        'Because dividing a power by itself gives 1, and the exponent rules say it also gives b⁰. Both must be true, so b⁰ is 1 for every base except zero.',
    },
    {
      question: 'Why is 0⁰ rejected?',
      answer:
        'It has no single agreed value. Following the rule that anything to the power of zero is 1 argues for 1; following the rule that zero to any power is 0 argues for 0. Rather than pick one silently, the calculator says it is undefined.',
    },
    {
      question: 'Why can a negative base not have a fractional exponent?',
      answer:
        'A fractional exponent is a root, and even roots of negative numbers have no real answer — nothing multiplied by itself gives −4. Such values exist only in complex numbers, which this calculator does not cover.',
    },
    {
      question: 'What does a negative exponent really mean?',
      answer:
        'It flips the number: b⁻ⁿ is 1 ÷ bⁿ. That is why 2⁻¹ is 0.5 and 10⁻³ is 0.001. Zero has no reciprocal, which is why a negative power of zero is rejected.',
    },
    {
      question: 'Why does a very large power give an error?',
      answer:
        'Beyond roughly 10³⁰⁸ a result exceeds what a double-precision number can represent and becomes infinity. The calculator reports that rather than showing a meaningless value.',
    },
  ],
  tip: {
    title: 'Powers beat multiplication',
    body: 'In any expression, powers are evaluated before multiplication and division. −2² is −4, because the power applies to the 2 before the sign; (−2)² is 4.',
  },
}
