import type { CalculatorContent } from './types.ts'

export const profitMarginContent: CalculatorContent = {
  slug: 'profit-margin-calculator',
  seoTitle: 'Profit Margin Calculator — Profit and Margin from Revenue and Cost',
  seoDescription:
    'Free profit margin calculator. Enter revenue and cost to see the profit and the profit margin as a percentage, including negative margins when cost exceeds revenue.',
  intro: {
    title: 'About profit margin',
    lead: 'Enter what you take in and what it cost you to see the profit and the margin behind it.',
    paragraphs: [
      'Profit is the plain difference between revenue and cost. Margin turns that difference into a percentage of revenue, which is what makes it comparable between a small sale and a large one.',
      'Two products can produce identical profit on very different revenue. Earning 40 on a sale of 100 is a 40% margin; earning the same 40 on a sale of 1,000 is only 4%. The percentage is what tells you how much room a price has before it stops being worthwhile.',
    ],
  },
  howTo: {
    title: 'How to calculate profit margin',
    steps: [
      {
        title: 'Enter your revenue',
        description:
          'The selling price, or the total taken in. It must be above zero, since margin is expressed as a share of revenue.',
      },
      {
        title: 'Enter your cost',
        description:
          'What the item or service cost you to provide. Zero is allowed, which gives a 100% margin.',
      },
      {
        title: 'Read the profit and margin',
        description:
          'Profit is the difference; margin is that difference as a percentage of revenue. Both update as you type.',
      },
      {
        title: 'Watch for negative results',
        description:
          'If cost exceeds revenue, the profit and margin are negative and are labelled as a loss rather than hidden. That is a legitimate answer, not an error.',
      },
    ],
  },
  formulasTitle: 'Profit and margin formulas',
  formulas: [
    {
      name: 'Profit',
      expression: 'revenue − cost',
      description:
        'The absolute amount left over. Revenue of 1,000 against a cost of 600 leaves a profit of 400.',
    },
    {
      name: 'Profit margin',
      expression: '(profit ÷ revenue) × 100',
      description:
        'Profit as a percentage of revenue. A profit of 400 on revenue of 1,000 is a 40% margin.',
    },
    {
      name: 'Negative margin',
      expression: 'the same formula, giving a result below zero',
      description:
        'Revenue of 1,000 against a cost of 1,200 gives a profit of −200 and a margin of −20%: a loss of a fifth of revenue.',
    },
  ],
  examples: [
    {
      title: 'A healthy margin',
      description: 'A product sold for 1,000 that cost 600 to provide.',
      inputs: [
        { label: 'Revenue', value: '1000' },
        { label: 'Cost', value: '600' },
      ],
      result: 'Profit 400.00, margin 40%.',
    },
    {
      title: 'Selling at a loss',
      description: 'The same revenue, but the cost has risen above it.',
      inputs: [
        { label: 'Revenue', value: '1000' },
        { label: 'Cost', value: '1200' },
      ],
      result: 'Profit −200.00, margin −20%.',
    },
    {
      title: 'Breaking even',
      description: 'Revenue exactly matches cost.',
      inputs: [
        { label: 'Revenue', value: '500' },
        { label: 'Cost', value: '500' },
      ],
      result: 'Profit 0.00, margin 0%.',
    },
    {
      title: 'No cost of goods',
      description: 'Something with no direct cost attached, such as a resold digital licence.',
      inputs: [
        { label: 'Revenue', value: '250' },
        { label: 'Cost', value: '0' },
      ],
      result: 'Profit 250.00, margin 100%.',
    },
  ],
  faqs: [
    {
      question: 'What is the difference between margin and markup?',
      answer:
        'Margin divides profit by revenue; markup divides the same profit by cost. Revenue of 1,000 on a cost of 600 is a 40% margin but a 66.7% markup. Margin is always the smaller of the two.',
    },
    {
      question: 'Why is margin a share of revenue rather than cost?',
      answer:
        'Because it answers how much of every unit taken in you keep. That makes it directly comparable between products and against the percentages used in reporting.',
    },
    {
      question: 'Can the margin be more than 100%?',
      answer:
        'No. Profit can never exceed revenue when cost is zero or positive, so the ceiling is 100%, reached only when cost is zero. There is no floor: a large enough cost pushes the margin arbitrarily far below zero.',
    },
    {
      question: 'Is this gross margin or net margin?',
      answer:
        'That depends on the cost you enter. Enter only the direct cost of goods and you get gross margin; include overheads, tax, and other expenses and you get something closer to net margin.',
    },
    {
      question: 'Why must revenue be greater than zero?',
      answer:
        'Margin divides by revenue, so zero revenue would mean dividing by zero. With nothing taken in there is also no meaningful share to express a profit against.',
    },
    {
      question: 'How do I work out the price I need for a target margin?',
      answer:
        'Divide your cost by one minus the margin as a decimal. For a 40% margin on a cost of 600: 600 ÷ 0.6 = 1,000. Note that you divide rather than adding 40% to the cost, which would give a different figure.',
    },
  ],
  tip: {
    title: 'Do not add your margin to the cost',
    body: 'Adding 40% to a cost of 600 gives 840, which is a 28.6% margin, not 40%. To hit a target margin, divide the cost by one minus that margin instead.',
  },
}
