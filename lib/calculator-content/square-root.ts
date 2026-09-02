import type { CalculatorContent } from './types.ts'

export const squareRootContent: CalculatorContent = {
  slug: 'square-root-calculator',
  seoTitle: 'Square Root Calculator — Find the Root of Any Number',
  seoDescription:
    'Free square root calculator. Enter any positive number to find its square root, with perfect squares identified and negative input rejected clearly.',
  intro: {
    title: 'About square roots',
    lead: 'Enter a positive number to find its square root.',
    paragraphs: [
      'The square root of a number is the value that, multiplied by itself, gives that number. The square root of 16 is 4, because 4 × 4 = 16.',
      'Most numbers do not have a tidy root. The square root of 2 is 1.41421356…, a decimal that never repeats and never ends. Results here are shown to enough places for practical use, and the calculator points out when a root is exact.',
    ],
  },
  howTo: {
    title: 'How to use the square root calculator',
    steps: [
      {
        title: 'Enter a number',
        description: 'Any value of zero or above. Decimals are fine.',
      },
      {
        title: 'Read the root',
        description: 'The result appears as you type, along with whether the root is exact.',
      },
      {
        title: 'Check it by squaring',
        description:
          'Multiply the answer by itself; you should get back the number you started with, give or take rounding on non-exact roots.',
      },
    ],
  },
  formulasTitle: 'How it works',
  formulas: [
    {
      name: 'Square root',
      expression: '√n = the value r where r × r = n',
      description: '√144 = 12, because 12 × 12 = 144.',
    },
    {
      name: 'As an exponent',
      expression: '√n = n^0.5',
      description:
        'A square root is a power of one half, which is why the Exponent Calculator gives the same answer for 9^0.5.',
    },
    {
      name: 'Perfect squares',
      expression: '1, 4, 9, 16, 25, 36, 49, 64, 81, 100 …',
      description:
        'Numbers whose roots are whole. Recognising them makes mental estimates much easier.',
    },
  ],
  examples: [
    {
      title: 'A perfect square',
      description: 'A root that comes out whole.',
      inputs: [{ label: 'Number', value: '144' }],
      result: '12 — an exact root.',
    },
    {
      title: 'An irrational root',
      description: 'Most numbers give a non-terminating decimal.',
      inputs: [{ label: 'Number', value: '2' }],
      result: '1.4142135624 — not exact, and never will be.',
    },
    {
      title: 'A decimal input',
      description: 'Roots of decimals work the same way.',
      inputs: [{ label: 'Number', value: '2.25' }],
      result: '1.5 — exact.',
    },
  ],
  faqs: [
    {
      question: 'Why can I not take the square root of a negative number?',
      answer:
        'No real number multiplied by itself gives a negative result: a positive times a positive is positive, and so is a negative times a negative. Roots of negatives exist only as imaginary numbers, which this calculator does not handle.',
    },
    {
      question: 'What about the negative root?',
      answer:
        'Every positive number technically has two square roots — 4 and −4 both square to 16. The symbol √ conventionally means the positive one, which is what is shown here.',
    },
    {
      question: 'What is a perfect square?',
      answer:
        'A number whose square root is a whole number, such as 25, 81 or 144. The calculator flags these, which is useful when simplifying surds or checking work by hand.',
    },
    {
      question: 'How do I estimate a square root mentally?',
      answer:
        'Find the nearest perfect squares either side. √50 sits between √49 = 7 and √64 = 8, and much closer to 7, so about 7.1. The true value is 7.07.',
    },
    {
      question: 'How is this different from the Scientific Calculator?',
      answer:
        'They use the same maths. This page does one thing with a single field; the Scientific Calculator handles roots inside longer expressions.',
    },
  ],
  tip: {
    title: 'Square the answer to check',
    body: 'Multiplying the result by itself should return your input. On an exact root it will match precisely; on an irrational one it lands a rounding step away.',
  },
}
