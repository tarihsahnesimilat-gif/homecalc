import type { CalculatorContent } from './types.ts'

export const percentageChangeContent: CalculatorContent = {
  slug: 'percentage-change-calculator',
  seoTitle: 'Percentage Change Calculator — Increase or Decrease',
  seoDescription:
    'Free percentage change calculator. Enter an original and a new value to see the percentage increase or decrease, the direction, and the absolute difference.',
  intro: {
    title: 'About percentage change',
    lead: 'Enter where you started and where you ended up to see the percentage increase or decrease between them.',
    paragraphs: [
      'Percentage change measures how much a value has moved relative to where it began. The original value is always the baseline, which is what makes the result comparable across quantities of very different sizes.',
      'Because the baseline sits in the denominator, the same absolute movement produces different percentages depending on the direction. Going from 100 to 120 is a 20% increase, but coming back from 120 to 100 is a 16.6667% decrease — the gap is 20 either way, yet it is measured against a different starting point.',
    ],
  },
  howTo: {
    title: 'How to calculate percentage change',
    steps: [
      {
        title: 'Identify the original value',
        description:
          'This is the earlier figure, or the one you are comparing against. It becomes the baseline the change is measured from.',
      },
      {
        title: 'Enter the new value',
        description:
          'The later figure, or the one you want to assess. It can be larger or smaller than the original.',
      },
      {
        title: 'Read the percentage and direction',
        description:
          'A positive result is an increase, a negative one a decrease, and zero means nothing moved. The direction is labelled explicitly so there is no sign to misread.',
      },
      {
        title: 'Sanity-check with the difference',
        description:
          'The absolute difference is shown too. If the percentage looks surprising, that raw gap usually explains why — small baselines produce large percentages.',
      },
    ],
  },
  formulasTitle: 'Percentage change formulas',
  formulas: [
    {
      name: 'Percentage change',
      expression: '((new value − original value) ÷ original value) × 100',
      description:
        'The core formula. From 100 to 120: ((120 − 100) ÷ 100) × 100 = 20%.',
    },
    {
      name: 'Percentage decrease',
      expression: 'the same formula, giving a negative result',
      description:
        'No separate formula is needed. From 120 to 100: ((100 − 120) ÷ 120) × 100 = −16.6667%.',
    },
    {
      name: 'Absolute difference',
      expression: 'new value − original value',
      description:
        'The raw movement before it is expressed as a proportion. Useful for checking that a large percentage is not hiding a tiny change.',
    },
  ],
  examples: [
    {
      title: 'A price rise',
      description: 'Something that cost 100 now costs 120.',
      inputs: [
        { label: 'Original value', value: '100' },
        { label: 'New value', value: '120' },
      ],
      result: '20% increase.',
    },
    {
      title: 'The same move, reversed',
      description: 'Coming back down from 120 to 100.',
      inputs: [
        { label: 'Original value', value: '120' },
        { label: 'New value', value: '100' },
      ],
      result: '16.6667% decrease — not 20%, because the baseline changed.',
    },
    {
      title: 'No change at all',
      description: 'The two values are identical.',
      inputs: [
        { label: 'Original value', value: '100' },
        { label: 'New value', value: '100' },
      ],
      result: '0% — no change.',
    },
    {
      title: 'A salary increase',
      description: 'Pay moving from 48,000 to 52,000.',
      inputs: [
        { label: 'Original value', value: '48000' },
        { label: 'New value', value: '52000' },
      ],
      result: '8.3333% increase, a difference of 4,000.',
    },
  ],
  faqs: [
    {
      question: 'Why is a 20% rise not cancelled by a 20% fall?',
      answer:
        'Each percentage applies to a different baseline. 100 rising 20% gives 120, but 120 falling 20% gives 96, because the second calculation measures against 120. To return to 100 from 120 you need a 16.6667% fall.',
    },
    {
      question: 'What is the difference between percentage change and percentage difference?',
      answer:
        'Percentage change has a clear starting point and divides by it. Percentage difference compares two values with no natural order and divides by their average instead. This calculator works out percentage change.',
    },
    {
      question: 'Why can the original value not be zero?',
      answer:
        'The formula divides by the original value, and division by zero is undefined. There is also no meaningful answer: any movement away from zero is infinitely large in proportional terms.',
    },
    {
      question: 'Can the result be more than 100%?',
      answer:
        'An increase can be any size — going from 10 to 50 is a 400% increase. A decrease cannot pass −100%, since that point represents the value falling all the way to zero.',
    },
    {
      question: 'What about percentage point changes?',
      answer:
        'They are different. If a rate moves from 5% to 6%, that is a rise of one percentage point but a 20% increase. Use percentage points when the values are themselves percentages.',
    },
    {
      question: 'How is this different from the Percentage Calculator?',
      answer:
        'The Percentage Calculator covers five percentage questions in one place, including this one. This page is focused solely on change between two values, adding the direction and the absolute difference.',
    },
  ],
  tip: {
    title: 'The baseline decides everything',
    body: 'Before reading a percentage change, check which value sits in the denominator. Swapping the two figures changes the answer, not just its sign.',
  },
}
