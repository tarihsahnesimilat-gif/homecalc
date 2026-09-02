import type { CalculatorContent } from './types.ts'

export const percentageDifferenceContent: CalculatorContent = {
  slug: 'percentage-difference-calculator',
  seoTitle: 'Percentage Difference Calculator — Compare Two Numbers',
  seoDescription:
    'Free percentage difference calculator. Compare two numbers where neither is the baseline, using the standard absolute difference over average formula.',
  intro: {
    title: 'About percentage difference',
    lead: 'Compare two numbers where neither one is the starting point.',
    paragraphs: [
      'Percentage difference measures how far apart two values are relative to their average. It is the right tool when neither number came first — two suppliers quoting for the same job, two thermometers in the same room, two measurements of the same thing.',
      'That is what separates it from percentage change, which has a clear before and after and divides by the earlier value. Because percentage difference divides by the average of the two, it gives the same answer whichever order you enter them in.',
    ],
  },
  howTo: {
    title: 'How to calculate percentage difference',
    steps: [
      {
        title: 'Enter both numbers',
        description: 'Order does not matter here, which is rather the point of this measure.',
      },
      {
        title: 'Read the percentage',
        description:
          'The result is always positive: it describes the size of the gap, not a direction.',
      },
      {
        title: 'Check the working',
        description:
          'The absolute difference and the average are shown too, so you can follow how the percentage was reached.',
      },
      {
        title: 'Use change instead when there is a baseline',
        description:
          'If one value genuinely came before the other, percentage change is the more meaningful figure.',
      },
    ],
  },
  formulasTitle: 'The formula',
  formulas: [
    {
      name: 'Percentage difference',
      expression: '|a − b| ÷ ((a + b) ÷ 2) × 100',
      description: 'The gap divided by the average. For 40 and 60: 20 ÷ 50 × 100 = 40%.',
    },
    {
      name: 'Why divide by the average',
      expression: 'neither value is privileged',
      description:
        'Dividing by either one would make the answer depend on which you happened to pick first. The average treats them equally.',
    },
    {
      name: 'Compared with percentage change',
      expression: '((new − old) ÷ old) × 100',
      description:
        'From 40 to 60 is a 50% increase, but the percentage difference between them is 40%. Both are correct answers to different questions.',
    },
  ],
  examples: [
    {
      title: 'Two quotes for the same job',
      description: 'Neither figure is the baseline.',
      inputs: [
        { label: 'Number A', value: '40' },
        { label: 'Number B', value: '60' },
      ],
      result: '40% difference.',
    },
    {
      title: 'A small gap',
      description: 'Two close readings.',
      inputs: [
        { label: 'Number A', value: '100' },
        { label: 'Number B', value: '110' },
      ],
      result: '9.5238% difference.',
    },
    {
      title: 'Identical values',
      description: 'Nothing separates them.',
      inputs: [
        { label: 'Number A', value: '50' },
        { label: 'Number B', value: '50' },
      ],
      result: '0% difference.',
    },
  ],
  faqs: [
    {
      question: 'How is this different from percentage change?',
      answer:
        'Percentage change has a before and an after, and divides by the earlier value. Percentage difference has no baseline and divides by the average, so it is symmetric: swapping the inputs does not change the answer.',
    },
    {
      question: 'Why is the result never negative?',
      answer:
        'It measures the size of a gap, not a direction. If you need to know which value is larger and by how much, percentage change is the better measure.',
    },
    {
      question: 'Which one should I use?',
      answer:
        'Use change when time or sequence is involved — a price then and now. Use difference when comparing two things that simply coexist, such as two quotes or two instruments.',
    },
    {
      question: 'Why are values that average zero rejected?',
      answer:
        'The formula divides by the average. If the two numbers cancel out, such as 5 and −5, the average is zero and the calculation is undefined, so the calculator says so rather than returning infinity.',
    },
    {
      question: 'Can one of the numbers be zero?',
      answer:
        'Yes, as long as the other is not. Comparing 0 and 20 gives 200%, because the gap of 20 is twice their average of 10.',
    },
  ],
  tip: {
    title: 'Symmetry is the giveaway',
    body: 'If swapping your two numbers should not change the answer, you want percentage difference. If it should, you want percentage change.',
  },
}
