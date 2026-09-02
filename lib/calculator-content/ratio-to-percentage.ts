import type { CalculatorContent } from './types.ts'

export const ratioToPercentageContent: CalculatorContent = {
  slug: 'ratio-to-percentage-calculator',
  seoTitle: 'Ratio to Percentage Calculator — Convert Any Ratio',
  seoDescription:
    'Free ratio to percentage calculator. Turn a ratio into each part’s share of the whole, and see one part as a percentage of the other.',
  intro: {
    title: 'About converting ratios',
    lead: 'Turn a ratio into the percentage share held by each part.',
    paragraphs: [
      'A ratio of 2 : 3 describes five parts in total. The first is two of those five, which is 40% of the whole — not 40% of the second part, and not 66.7% of the whole either.',
      'That is the trap. There are two sensible percentages hiding in any ratio: each part as a share of the total, and one part measured against the other. Both are useful and they are easy to mix up, so this returns both.',
      'The shares of the whole always add up to 100. If your two percentages do not, you have calculated the other measure.',
    ],
  },
  howTo: {
    title: 'How to convert a ratio to a percentage',
    steps: [
      {
        title: 'Enter both parts of the ratio',
        description: 'For 2 : 3, enter 2 and 3. Decimals work too.',
      },
      {
        title: 'Read the share of the whole',
        description:
          'Each part divided by the total of both. These are the figures that add to 100%.',
      },
      {
        title: 'Check the part-to-part figure',
        description:
          'Shown separately: the first part expressed as a percentage of the second, which is a different question.',
      },
    ],
  },
  formulasTitle: 'The two conversions',
  formulas: [
    {
      name: 'Each part as a share of the whole',
      expression: '(part ÷ (a + b)) × 100',
      description: 'In 2 : 3 the total is 5, so the parts are 40% and 60%.',
    },
    {
      name: 'One part as a percentage of the other',
      expression: '(a ÷ b) × 100',
      description: '2 ÷ 3 = 66.7%. The first part is two thirds the size of the second.',
    },
    {
      name: 'A useful check',
      expression: 'the two shares must total 100%',
      description:
        'If yours do not add up, you have calculated part-to-part rather than share of the whole.',
    },
  ],
  examples: [
    {
      title: 'A two-part mix',
      description: 'Two parts of one thing to three of another.',
      inputs: [
        { label: 'First part', value: '2' },
        { label: 'Second part', value: '3' },
      ],
      result: '40% and 60% of the whole; the first is 66.7% of the second.',
    },
    {
      title: 'An even split',
      description: 'Equal parts.',
      inputs: [
        { label: 'First part', value: '1' },
        { label: 'Second part', value: '1' },
      ],
      result: '50% each, and 100% of one another.',
    },
    {
      title: 'A wide gap',
      description: 'One part much larger than the other.',
      inputs: [
        { label: 'First part', value: '1' },
        { label: 'Second part', value: '9' },
      ],
      result: '10% and 90% of the whole.',
    },
  ],
  faqs: [
    {
      question: 'Why does 2 : 3 give 40% and not 66.7%?',
      answer:
        'Because 40% is the share of the whole: two parts out of five. 66.7% is the first part measured against the second, which answers a different question. Both are shown so you can pick the right one.',
    },
    {
      question: 'How do I convert a three-part ratio?',
      answer:
        'The principle is the same: divide each part by the total of all parts. For 2 : 3 : 5 the total is 10, giving 20%, 30% and 50%. This page handles two parts, so add the extra parts yourself.',
    },
    {
      question: 'How is this different from the Ratio Calculator?',
      answer:
        'The Ratio Calculator scales a ratio to a known value and reduces it to its simplest form. This one converts it into percentages — a different output from the same starting point.',
    },
    {
      question: 'Can a part be zero?',
      answer:
        'Yes, as long as the other is not. A ratio of 3 : 0 makes the first part 100% of the whole, though it cannot be expressed as a percentage of the second — nothing can be a percentage of zero.',
    },
    {
      question: 'Is a ratio the same as a fraction?',
      answer:
        'Related but not identical. A fraction compares a part to the whole, a ratio compares parts to each other. In a 2 : 3 mix the first part is the fraction 2/5 of the total, not 2/3.',
    },
  ],
  tip: {
    title: 'Count the parts first',
    body: 'Add both sides before dividing. Most errors here come from dividing by the other part instead of by the total.',
  },
}
