import type { CalculatorContent } from './types.ts'

export const percentagePointContent: CalculatorContent = {
  slug: 'percentage-point-calculator',
  seoTitle: 'Percentage Point Calculator — Points vs Percentage Change',
  seoDescription:
    'Free percentage point calculator. Compare two percentages to see the change in percentage points and the relative percentage change side by side.',
  intro: {
    title: 'About percentage points',
    lead: 'Compare two percentages and see both ways of describing the move.',
    paragraphs: [
      'When a rate moves from 5% to 6%, it has risen by one percentage point — and by 20%. Both statements are true, they describe the same move, and they are wildly different numbers.',
      'The distinction matters whenever the thing changing is itself a percentage: interest rates, unemployment, tax bands, conversion rates, poll numbers. Reporting the larger figure without saying which you mean is one of the most common ways statistics mislead, usually without anyone intending it.',
      'This calculator gives you both, labelled, so you can quote the right one and recognise which you are being given.',
    ],
  },
  howTo: {
    title: 'How to compare two percentages',
    steps: [
      {
        title: 'Enter the starting percentage',
        description: 'The rate before the change. Enter 5 for 5%.',
      },
      {
        title: 'Enter the new percentage',
        description: 'The rate afterwards.',
      },
      {
        title: 'Read both figures',
        description:
          'The percentage point change is the plain gap. The relative change expresses that gap against where it started.',
      },
      {
        title: 'Quote the one you mean',
        description:
          'Percentage points for the size of the move, relative change for how big it is compared with the original rate.',
      },
    ],
  },
  formulasTitle: 'The two measures',
  formulas: [
    {
      name: 'Percentage point change',
      expression: 'new rate − old rate',
      description: 'From 5% to 6% is a change of 1 percentage point. Plain subtraction.',
    },
    {
      name: 'Relative percentage change',
      expression: '((new − old) ÷ old) × 100',
      description:
        'The same move is a 20% increase, because 1 is a fifth of the original 5.',
    },
    {
      name: 'Basis points',
      expression: '1 percentage point = 100 basis points',
      description:
        'Finance often uses basis points precisely to avoid this ambiguity. A 0.25 point rate rise is 25 basis points.',
    },
  ],
  examples: [
    {
      title: 'An interest rate rise',
      description: 'A central bank moving the base rate.',
      inputs: [
        { label: 'From', value: '5%' },
        { label: 'To', value: '6%' },
      ],
      result: '1 percentage point — a 20% relative increase.',
    },
    {
      title: 'A falling rate',
      description: 'A conversion rate dropping.',
      inputs: [
        { label: 'From', value: '8%' },
        { label: 'To', value: '6%' },
      ],
      result: '−2 percentage points — a 25% relative decrease.',
    },
    {
      title: 'Starting from zero',
      description: 'A rate that was previously nil.',
      inputs: [
        { label: 'From', value: '0%' },
        { label: 'To', value: '5%' },
      ],
      result: '5 percentage points. No relative change exists to report.',
    },
  ],
  faqs: [
    {
      question: 'What exactly is a percentage point?',
      answer:
        'The arithmetic difference between two percentages. Going from 5% to 6% is one percentage point, regardless of how large that is relative to the starting figure.',
    },
    {
      question: 'Why does this distinction matter?',
      answer:
        'Because the two numbers can differ enormously. A rate moving from 1% to 2% is one percentage point but a 100% increase. Quoting the larger figure without saying which you mean overstates the change dramatically.',
    },
    {
      question: 'Which should I use?',
      answer:
        'Percentage points when the absolute size of the move matters, such as a tax rate or an interest rate. Relative change when the question is how much something grew compared with where it was.',
    },
    {
      question: 'What are basis points?',
      answer:
        'One hundredth of a percentage point, used in finance to remove the ambiguity entirely. A rise of 25 basis points is 0.25 percentage points, and cannot be misread as a percentage change.',
    },
    {
      question: 'Why is there no relative change from zero?',
      answer:
        'Because the calculation divides by the starting rate. Any move away from zero is infinitely large in relative terms, so only the percentage point change is meaningful.',
    },
  ],
  tip: {
    title: 'Ask which number you are being shown',
    body: 'When a headline says a rate rose by 20%, check whether that is 20 percentage points or a fifth of the original. The difference is often the whole story.',
  },
}
