import type { CalculatorContent } from './types'

export const percentageContent: CalculatorContent = {
  slug: 'percentage-calculator',
  seoTitle: 'Percentage Calculator — Percent, Change, Increase & Decrease',
  seoDescription:
    'Free percentage calculator. Work out what X% of Y is, what percentage one number is of another, percentage change, and percentage increases or decreases.',
  intro: {
    title: 'About percentages',
    lead: 'Calculate percentages quickly and accurately. Find a percentage of a number, percentage change, increases, decreases, and more.',
    paragraphs: [
      'A percentage is a number expressed as a fraction of 100. The word comes from the Latin per centum — "by the hundred" — so 15% simply means 15 out of every 100.',
      'Percentages let you compare quantities of very different sizes on the same scale. Saving 3 on a 12 lunch and saving 300 on a 1,200 laptop are both 25% off, which is why percentages show up everywhere from discounts and tips to interest rates and exam grades.',
    ],
  },
  howTo: {
    title: 'How to calculate percentages',
    steps: [
      {
        title: 'Pick the question you are answering',
        description:
          'Choose one of the five modes above. Each one maps to a different everyday question, so you never have to rearrange a formula yourself.',
      },
      {
        title: 'Enter your two numbers',
        description:
          'Every mode needs exactly two values. Enter them in the order the field labels describe — for percentage change and increases, the original value always comes first.',
      },
      {
        title: 'Read the result',
        description:
          'The result updates as you type. Modes that answer "what percentage?" show a % sign; modes that answer "how much?" show a plain number.',
      },
      {
        title: 'Check the baseline',
        description:
          'If a result looks surprising, confirm which number you treated as the baseline. Going from 50 to 75 is a 50% increase, but going from 75 back to 50 is a 33.33% decrease.',
      },
    ],
  },
  formulasTitle: 'Percentage formulas',
  formulas: [
    {
      name: 'Percentage of a number',
      expression: '(percentage ÷ 100) × number',
      description:
        'Converts the percentage to a decimal, then scales the number by it. 15% of 240 = (15 ÷ 100) × 240 = 36.',
    },
    {
      name: 'One number as a percentage of another',
      expression: '(part ÷ whole) × 100',
      description:
        'Divides the part by the whole and rescales to 100. 36 out of 240 = (36 ÷ 240) × 100 = 15%.',
    },
    {
      name: 'Percentage change',
      expression: '((new value − original value) ÷ original value) × 100',
      description:
        'A positive answer is an increase, a negative answer is a decrease. The original value is always the denominator.',
    },
    {
      name: 'Increase by a percentage',
      expression: 'original value × (1 + percentage ÷ 100)',
      description:
        'Adds the percentage on top in a single step. 240 increased by 15% = 240 × 1.15 = 276.',
    },
    {
      name: 'Decrease by a percentage',
      expression: 'original value × (1 − percentage ÷ 100)',
      description:
        'Takes the percentage off in a single step. 240 decreased by 15% = 240 × 0.85 = 204.',
    },
  ],
  examples: [
    {
      title: 'A 15% discount',
      description: 'A jacket costs 240. The sale takes 15% off the price.',
      inputs: [
        { label: 'Original value', value: '240' },
        { label: 'Decrease percentage', value: '15' },
      ],
      result: '204 — you save 36.',
    },
    {
      title: 'A tip on a restaurant bill',
      description: 'The bill comes to 86 and you want to leave an 18% tip.',
      inputs: [
        { label: 'Percentage', value: '18' },
        { label: 'Number', value: '86' },
      ],
      result: '15.48 — a total of 101.48.',
    },
    {
      title: 'A pay rise as a percentage',
      description: 'Your salary goes from 48,000 to 52,000. How big is the rise?',
      inputs: [
        { label: 'Original value', value: '48000' },
        { label: 'New value', value: '52000' },
      ],
      result: '8.3333% increase.',
    },
    {
      title: 'A test score',
      description: 'You scored 47 marks out of a possible 60.',
      inputs: [
        { label: 'First number', value: '47' },
        { label: 'Second number', value: '60' },
      ],
      result: '78.3333%.',
    },
  ],
  faqs: [
    {
      question: 'How do I find X% of a number?',
      answer:
        'Divide the percentage by 100, then multiply by the number. For 15% of 240: 15 ÷ 100 = 0.15, and 0.15 × 240 = 36. The "What is X% of Y?" mode does both steps for you.',
    },
    {
      question: 'What is the difference between percentage change and percentage difference?',
      answer:
        'Percentage change compares a new value against a known starting point, so the original value is the denominator. Percentage difference compares two values with no natural starting point and divides by their average instead. This calculator works out percentage change.',
    },
    {
      question: 'Why is a 20% decrease not undone by a 20% increase?',
      answer:
        'Each percentage is applied to a different baseline. 100 decreased by 20% is 80, but 80 increased by 20% is only 96, because the second 20% is taken from 80 rather than from 100. To reverse a 20% decrease you need a 25% increase.',
    },
    {
      question: 'Can a percentage be more than 100%?',
      answer:
        'Yes. Any value larger than the whole gives a result above 100% — 300 is 150% of 200. Percentage increases are unbounded, while a percentage decrease of more than 100% would take the value below zero.',
    },
    {
      question: 'What happens if the original value is zero?',
      answer:
        'Percentage change and "X is what % of Y?" both divide by that value, and division by zero is undefined. The calculator detects this and tells you instead of showing a misleading result.',
    },
    {
      question: 'How do I convert a percentage to a decimal or a fraction?',
      answer:
        'Divide by 100 for the decimal: 45% becomes 0.45. For a fraction, put the percentage over 100 and simplify: 45% is 45/100, which reduces to 9/20.',
    },
  ],
  tip: {
    title: 'Use the right starting value',
    body: 'For percentage change, the original value is always the baseline. This keeps increases and decreases consistent and comparable.',
  },
}
