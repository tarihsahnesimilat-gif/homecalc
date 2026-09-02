import type { CalculatorContent } from './types.ts'

export const percentageOfNumberContent: CalculatorContent = {
  slug: 'percentage-of-number-calculator',
  seoTitle: 'Percentage of a Number Calculator — What is X% of Y?',
  seoDescription:
    'Free calculator for working out a percentage of a number. Enter the percentage and the number to see the amount, with the working shown.',
  intro: {
    title: 'About percentages of a number',
    lead: 'Enter a percentage and a number to see what that percentage comes to.',
    paragraphs: [
      'This is the most common percentage question there is: what is 15% of 200? A percentage is a share out of a hundred, so finding one means scaling the number by that share.',
      'The arithmetic is two steps — divide the percentage by 100, then multiply — and this page does both, showing the working so you can check it or reproduce it by hand.',
    ],
  },
  howTo: {
    title: 'How to find a percentage of a number',
    steps: [
      {
        title: 'Enter the percentage',
        description: 'The share you want, such as 15 for 15%. Decimals like 7.5 work too.',
      },
      {
        title: 'Enter the number',
        description: 'The amount you are taking the percentage of.',
      },
      {
        title: 'Read the answer',
        description:
          'The result updates as you type, alongside the decimal multiplier the calculation used.',
      },
      {
        title: 'Check it in your head',
        description:
          'Find 10% by moving the decimal point one place left, then scale. 15% of 200 is 20 plus half of 20, so 30.',
      },
    ],
  },
  formulasTitle: 'The formula',
  formulas: [
    {
      name: 'Percentage of a number',
      expression: '(percentage ÷ 100) × number',
      description: '15% of 200 is (15 ÷ 100) × 200 = 0.15 × 200 = 30.',
    },
    {
      name: 'The decimal shortcut',
      expression: 'number × decimal multiplier',
      description:
        'Once the percentage is a decimal, one multiplication finishes the job: 7.5% is 0.075, and 0.075 × 480 = 36.',
    },
  ],
  examples: [
    {
      title: 'A straightforward share',
      description: 'Fifteen percent of two hundred.',
      inputs: [
        { label: 'Percentage', value: '15' },
        { label: 'Number', value: '200' },
      ],
      result: '30',
    },
    {
      title: 'A decimal percentage',
      description: 'Rates such as tax and interest are rarely whole numbers.',
      inputs: [
        { label: 'Percentage', value: '7.5' },
        { label: 'Number', value: '480' },
      ],
      result: '36',
    },
    {
      title: 'More than the whole',
      description: 'Percentages above 100 give more than you started with.',
      inputs: [
        { label: 'Percentage', value: '150' },
        { label: 'Number', value: '80' },
      ],
      result: '120',
    },
  ],
  faqs: [
    {
      question: 'How do I work out a percentage in my head?',
      answer:
        'Start from 10%, which is the number with the decimal point moved one place left. 10% of 240 is 24, so 5% is 12 and 15% is 36. Most everyday percentages can be built from 10%, 5% and 1%.',
    },
    {
      question: 'How is this different from the Percentage Calculator?',
      answer:
        'The Percentage Calculator handles five different percentage questions in one place. This page does only this one, which makes it quicker when it is the question you have.',
    },
    {
      question: 'Can I use a percentage above 100?',
      answer:
        'Yes. 150% of 80 is 120. Anything above 100% simply means more than the original number.',
    },
    {
      question: 'What about negative numbers?',
      answer:
        'They work as you would expect: 10% of −200 is −20, and −10% of 200 is also −20. The sign carries through the multiplication.',
    },
    {
      question: 'How do I add the percentage on instead?',
      answer:
        'Add the result to the original number, or use the Percentage Calculator, which has a dedicated increase mode. 15% of 200 is 30, so 200 increased by 15% is 230.',
    },
  ],
  tip: {
    title: 'Percentages commute',
    body: '15% of 200 and 200% of 15 are both 30. When one side is easier to work with mentally, swap them — the answer is the same.',
  },
}
