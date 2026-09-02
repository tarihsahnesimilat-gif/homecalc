import type { CalculatorContent } from './types'

export const ratioContent: CalculatorContent = {
  slug: 'ratio-calculator',
  seoTitle: 'Ratio Calculator — Scale a Ratio and Simplify It',
  seoDescription:
    'Free ratio calculator. Enter a ratio and one known value to find the matching value on the other side, and see the ratio reduced to its simplest form.',
  intro: {
    title: 'About ratios',
    lead: 'Enter a ratio and one known value to find the other, and see the ratio in its simplest form.',
    paragraphs: [
      'A ratio compares two quantities by division. Writing 2 : 3 says that for every two of the first thing there are three of the second — it fixes the relationship without fixing the sizes.',
      'That is what makes ratios useful for scaling. A recipe, a mix, or a set of drawing dimensions written as a ratio can be scaled to any size, as long as both sides grow by the same factor.',
    ],
  },
  howTo: {
    title: 'How to scale and simplify a ratio',
    steps: [
      {
        title: 'Enter the ratio',
        description:
          'Put the two terms into A and B. Both must be greater than zero, since a ratio with a zero term cannot be scaled in both directions.',
      },
      {
        title: 'Say which side you know',
        description:
          'Choose whether your real-world value belongs to A or to B. This decides which way the calculation runs.',
      },
      {
        title: 'Enter the known value',
        description:
          'Type the actual quantity you have. The calculator scales the ratio to match it and gives you the other side.',
      },
      {
        title: 'Check the simplified form',
        description:
          'The simplified ratio is shown alongside. Whole-number ratios reduce using their greatest common divisor, so 12 : 18 becomes 2 : 3.',
      },
    ],
  },
  formulasTitle: 'Ratio formulas',
  formulas: [
    {
      name: 'Finding B when you know A',
      expression: 'B = known A × (term B ÷ term A)',
      description:
        'Scales the ratio up or down to fit your value. For 2 : 3 with A = 10, B = 10 × (3 ÷ 2) = 15.',
    },
    {
      name: 'Finding A when you know B',
      expression: 'A = known B × (term A ÷ term B)',
      description:
        'The same relationship read in the other direction. For 2 : 3 with B = 15, A = 15 × (2 ÷ 3) = 10.',
    },
    {
      name: 'Simplifying a ratio',
      expression: 'divide both terms by their GCD',
      description:
        'The greatest common divisor of 12 and 18 is 6, so 12 : 18 reduces to 2 : 3. Both terms shrink by the same factor, so the relationship is unchanged.',
    },
  ],
  examples: [
    {
      title: 'Scaling up from A',
      description: 'A 2 : 3 mix where you have 10 units of the first ingredient.',
      inputs: [
        { label: 'Ratio', value: '2 : 3' },
        { label: 'Known side', value: 'A' },
        { label: 'Known value', value: '10' },
      ],
      result: 'B = 15, giving the pair 10 : 15.',
    },
    {
      title: 'Working backwards from B',
      description: 'The same ratio, but this time you know the second quantity.',
      inputs: [
        { label: 'Ratio', value: '2 : 3' },
        { label: 'Known side', value: 'B' },
        { label: 'Known value', value: '15' },
      ],
      result: 'A = 10, giving the pair 10 : 15.',
    },
    {
      title: 'Simplifying a larger ratio',
      description: 'Reducing 12 : 18 to its smallest whole-number form.',
      inputs: [{ label: 'Ratio', value: '12 : 18' }],
      result: 'Simplifies to 2 : 3.',
    },
    {
      title: 'A screen aspect ratio',
      description: 'A 16 : 9 display that is 1920 pixels wide.',
      inputs: [
        { label: 'Ratio', value: '16 : 9' },
        { label: 'Known side', value: 'A' },
        { label: 'Known value', value: '1920' },
      ],
      result: 'B = 1080, the familiar 1920 × 1080.',
    },
  ],
  faqs: [
    {
      question: 'What is the difference between a ratio and a fraction?',
      answer:
        'A fraction compares a part to the whole; a ratio compares two parts to each other. In a 2 : 3 mix there are five parts in total, so the first ingredient is 2/5 of the mixture, not 2/3.',
    },
    {
      question: 'How do I simplify a ratio?',
      answer:
        'Divide both terms by their greatest common divisor. For 12 : 18 that is 6, leaving 2 : 3. The two ratios describe exactly the same relationship.',
    },
    {
      question: 'Can a ratio term be zero?',
      answer:
        'Not usefully here. A term of zero means one quantity is always absent, and scaling from that side would require dividing by zero. The calculator asks for two positive terms instead.',
    },
    {
      question: 'Can I use decimals in a ratio?',
      answer:
        'Yes. Decimal terms are scaled the same way. They cannot be reduced with a greatest common divisor, so the simplified form is shown scaled against the smaller term instead — 2.5 : 5 appears as 1 : 2.',
    },
    {
      question: 'How do I extend a ratio to three or more parts?',
      answer:
        'Scale each part by the same factor. For 2 : 3 : 5 with the first part at 10, the factor is 5, giving 10 : 15 : 25. This calculator handles two terms, so apply the factor to any extra parts yourself.',
    },
  ],
  tip: {
    title: 'Keep the order straight',
    body: 'A ratio is not symmetrical: 2 : 3 and 3 : 2 describe different mixes. Check that the value you enter belongs to the side you selected before trusting the result.',
  },
}
