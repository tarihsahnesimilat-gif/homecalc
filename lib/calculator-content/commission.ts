import type { CalculatorContent } from './types.ts'

export const commissionContent: CalculatorContent = {
  slug: 'commission-calculator',
  seoTitle: 'Commission Calculator — Work Out Sales Commission',
  seoDescription:
    'Free commission calculator. Enter a sale amount and a commission rate to see the commission, what is left after it, and the total when it is added on top.',
  intro: {
    title: 'About commission',
    lead: 'Work out the commission on a sale and what is left once it is paid.',
    paragraphs: [
      'Commission is a percentage of a sale paid to whoever made it happen. The arithmetic is simple, but the direction matters: sometimes the commission comes out of the sale price, and sometimes it is added on top.',
      'An estate agent or sales rep is usually paid out of the sale, so the seller receives less than the headline figure. A buyer’s premium at auction works the other way, adding to what the buyer pays. Both figures are shown, since the commission itself is the same either way.',
    ],
  },
  howTo: {
    title: 'How to calculate commission',
    steps: [
      {
        title: 'Enter the sale amount',
        description: 'The value the commission is calculated on.',
      },
      {
        title: 'Enter the commission rate',
        description: 'As a percentage. Decimals such as 2.5 are fine.',
      },
      {
        title: 'Read the right figure for your arrangement',
        description:
          'Use the amount after commission when the fee comes out of the sale, and the total with commission when it is added on top.',
      },
    ],
  },
  formulasTitle: 'Commission formulas',
  formulas: [
    {
      name: 'Commission',
      expression: 'sale amount × (rate ÷ 100)',
      description: '10% on a 5,000 sale is 500.',
    },
    {
      name: 'Amount after commission',
      expression: 'sale amount − commission',
      description: 'What the seller keeps when the fee is deducted: 4,500 on the example above.',
    },
    {
      name: 'Total with commission',
      expression: 'sale amount + commission',
      description:
        'What the buyer pays when the fee is added on top instead: 5,500 on the same sale.',
    },
  ],
  examples: [
    {
      title: 'A standard sales commission',
      description: '10% on a 5,000 sale.',
      inputs: [
        { label: 'Sale amount', value: '5000' },
        { label: 'Commission rate', value: '10%' },
      ],
      result: 'Commission 500.00, seller keeps 4,500.00.',
    },
    {
      title: 'A property sale',
      description: 'A 3% fee on a 250,000 sale.',
      inputs: [
        { label: 'Sale amount', value: '250000' },
        { label: 'Commission rate', value: '3%' },
      ],
      result: 'Commission 7,500.00, seller keeps 242,500.00.',
    },
    {
      title: 'No commission',
      description: 'A direct sale with no agent.',
      inputs: [
        { label: 'Sale amount', value: '5000' },
        { label: 'Commission rate', value: '0%' },
      ],
      result: 'Commission 0.00, the full 5,000.00 retained.',
    },
  ],
  faqs: [
    {
      question: 'Is commission taken out of the sale or added to it?',
      answer:
        'It depends on the agreement. Sales and estate agency commission normally comes out of the sale price, so the seller nets less. A buyer’s premium is added on top of the hammer price instead. Both figures are shown so you can pick the right one.',
    },
    {
      question: 'How do I handle a tiered or split commission?',
      answer:
        'Run each tier separately and add the results. A rate that rises above a threshold means calculating the lower rate on the first slice and the higher rate on the remainder.',
    },
    {
      question: 'What about a base salary plus commission?',
      answer:
        'Calculate the commission here and add your base separately. This works out the commission portion only.',
    },
    {
      question: 'Is the commission taxable?',
      answer:
        'Commission is normally treated as income and taxed accordingly, but the rules depend on your country and how you are engaged. The figures here are gross, before any tax or deductions.',
    },
    {
      question: 'What if the commission is split between people?',
      answer:
        'Work out the total commission here, then divide it by the agreed split. A 50/50 split on 500 gives 250 each.',
    },
  ],
  tip: {
    title: 'Confirm what the rate applies to',
    body: 'A percentage of the sale price and a percentage of the profit are very different numbers. Check which one your agreement means before relying on a figure.',
  },
}
