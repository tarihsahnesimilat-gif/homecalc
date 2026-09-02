import type { CalculatorContent } from './types.ts'

export const markupContent: CalculatorContent = {
  slug: 'markup-calculator',
  seoTitle: 'Markup Calculator — Price From Cost, and the Margin It Gives',
  seoDescription:
    'Free markup calculator. Add a markup percentage to your cost to find the selling price and profit, with the equivalent profit margin shown alongside.',
  intro: {
    title: 'About markup',
    lead: 'Add a markup to your cost to find a selling price — and see the margin it actually gives.',
    paragraphs: [
      'Markup is profit expressed as a percentage of what something cost you. Add 50% to a cost of 100 and you sell at 150.',
      'Margin is the same profit expressed as a percentage of the selling price. That 50 of profit on a 150 sale is a 33.3% margin — not 50%. The two numbers describe the identical sale and are never equal, which is why this calculator shows both.',
      'Getting them confused is the classic pricing mistake. A business aiming for a 40% margin that applies a 40% markup ends up with a 28.6% margin and wonders where the money went.',
    ],
  },
  howTo: {
    title: 'How to calculate markup',
    steps: [
      {
        title: 'Enter your cost',
        description: 'What the item costs you: materials, manufacture, wholesale price.',
      },
      {
        title: 'Enter the markup percentage',
        description: 'How much you are adding on top, as a percentage of that cost.',
      },
      {
        title: 'Read the selling price and profit',
        description: 'The price you would charge, and what you keep from it.',
      },
      {
        title: 'Check the equivalent margin',
        description:
          'Shown alongside, because it is almost always lower than the markup and it is the figure most reporting uses.',
      },
    ],
  },
  formulasTitle: 'Markup formulas',
  formulas: [
    {
      name: 'Selling price',
      expression: 'cost × (1 + markup ÷ 100)',
      description: 'A cost of 100 with a 50% markup sells at 150.',
    },
    {
      name: 'Profit',
      expression: 'selling price − cost',
      description: '50 on the example above.',
    },
    {
      name: 'The equivalent margin',
      expression: '(profit ÷ selling price) × 100',
      description:
        '50 ÷ 150 = 33.3%. The same profit, measured against the price rather than the cost.',
    },
    {
      name: 'Markup needed for a target margin',
      expression: 'margin ÷ (100 − margin) × 100',
      description:
        'For a 40% margin you need a 66.7% markup. Applying a 40% markup instead gives only a 28.6% margin.',
    },
  ],
  examples: [
    {
      title: 'A 50% markup',
      description: 'Adding half the cost again.',
      inputs: [
        { label: 'Cost', value: '100' },
        { label: 'Markup', value: '50%' },
      ],
      result: 'Sells at 150.00, profit 50.00 — a 33.3% margin.',
    },
    {
      title: 'Doubling the price',
      description: 'A 100% markup is often called keystone pricing.',
      inputs: [
        { label: 'Cost', value: '25' },
        { label: 'Markup', value: '100%' },
      ],
      result: 'Sells at 50.00, profit 25.00 — a 50% margin.',
    },
    {
      title: 'Selling at cost',
      description: 'No markup at all.',
      inputs: [
        { label: 'Cost', value: '100' },
        { label: 'Markup', value: '0%' },
      ],
      result: 'Sells at 100.00, no profit, 0% margin.',
    },
  ],
  faqs: [
    {
      question: 'What is the difference between markup and margin?',
      answer:
        'Markup measures profit against cost; margin measures the same profit against the selling price. A 50% markup is a 33.3% margin. Markup is always the larger of the two.',
    },
    {
      question: 'What markup do I need for a particular margin?',
      answer:
        'Divide the target margin by 100 minus the margin. For a 40% margin: 40 ÷ 60 = 66.7% markup. This is where most pricing errors come from, since applying a 40% markup gives only a 28.6% margin.',
    },
    {
      question: 'Which should I use when pricing?',
      answer:
        'Markup is easier to apply — you have the cost in front of you. Margin is what accounts and investors look at. Price with markup, report with margin, and know how to convert between them.',
    },
    {
      question: 'Can markup be more than 100%?',
      answer:
        'Yes, and it often is. A 200% markup triples the price. Margin, by contrast, can never reach 100% unless the item cost nothing.',
    },
    {
      question: 'Does this include tax?',
      answer:
        'No. Work out your price here, then add sales tax or VAT separately with the Sales Tax calculator — tax is normally applied to the final price, not built into the markup.',
    },
  ],
  tip: {
    title: 'Markup is always the bigger number',
    body: 'If someone quotes a percentage without saying which they mean, assume it flatters them. A 50% markup sounds like a 50% margin and is really 33.3%.',
  },
}
