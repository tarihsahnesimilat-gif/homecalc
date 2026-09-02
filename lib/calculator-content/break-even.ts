import type { CalculatorContent } from './types.ts'

export const breakEvenContent: CalculatorContent = {
  slug: 'break-even-calculator',
  seoTitle: 'Break-Even Calculator — Units and Revenue to Cover Costs',
  seoDescription:
    'Free break-even calculator. Enter fixed costs, variable cost per unit and selling price to find how many units you must sell before you start making a profit.',
  intro: {
    title: 'About the break-even point',
    lead: 'Find how many units you need to sell before the fixed costs are covered.',
    paragraphs: [
      'Costs split into two kinds. Fixed costs — rent, salaries, software — stay the same whether you sell one unit or a thousand. Variable costs — materials, packaging, payment fees — are incurred per sale.',
      'What matters is the contribution margin: the selling price minus the variable cost. That is what each sale contributes towards the fixed costs. Once enough sales have accumulated to cover them, every further sale becomes profit.',
      'This is a planning model, not a forecast of demand. It tells you the number you need to hit, not whether you will hit it.',
    ],
  },
  howTo: {
    title: 'How to calculate a break-even point',
    steps: [
      {
        title: 'Enter your fixed costs',
        description:
          'Everything you pay regardless of volume, over the period you are analysing — a month, a quarter, a year.',
      },
      {
        title: 'Enter the variable cost per unit',
        description:
          'What one additional sale costs you: materials, shipping, transaction fees.',
      },
      {
        title: 'Enter the selling price per unit',
        description:
          'What the customer pays. It must be above the variable cost, or no number of sales ever covers the fixed costs.',
      },
      {
        title: 'Read the break-even figures',
        description:
          'Units and the revenue they represent, plus the contribution margin driving them.',
      },
    ],
  },
  formulasTitle: 'Break-even formulas',
  formulas: [
    {
      name: 'Contribution margin',
      expression: 'selling price − variable cost per unit',
      description:
        'What each sale leaves towards fixed costs. At a price of 10 with a variable cost of 6, it is 4.',
    },
    {
      name: 'Break-even units',
      expression: 'fixed costs ÷ contribution margin',
      description: '10,000 of fixed costs at a margin of 4 breaks even at 2,500 units.',
    },
    {
      name: 'Break-even revenue',
      expression: 'break-even units × selling price',
      description: '2,500 units at 10 each is 25,000 of revenue.',
    },
    {
      name: 'Contribution margin ratio',
      expression: '(contribution margin ÷ selling price) × 100',
      description:
        'The share of each sale available for fixed costs and profit — 40% in the example above.',
    },
  ],
  examples: [
    {
      title: 'A straightforward product',
      description: '10,000 of fixed costs, 6 to make each unit, sold at 10.',
      inputs: [
        { label: 'Fixed costs', value: '10000' },
        { label: 'Variable cost per unit', value: '6' },
        { label: 'Selling price per unit', value: '10' },
      ],
      result: '2,500 units, 25,000 of revenue, a 40% contribution margin.',
    },
    {
      title: 'A thinner margin',
      description: 'The same fixed costs but only 1 of margin per unit.',
      inputs: [
        { label: 'Fixed costs', value: '10000' },
        { label: 'Variable cost per unit', value: '9' },
        { label: 'Selling price per unit', value: '10' },
      ],
      result: '10,000 units — four times as many for the same costs.',
    },
    {
      title: 'No margin at all',
      description: 'Price equal to the variable cost.',
      inputs: [
        { label: 'Variable cost per unit', value: '10' },
        { label: 'Selling price per unit', value: '10' },
      ],
      result: 'Rejected — each sale covers only itself, so fixed costs are never repaid.',
    },
  ],
  faqs: [
    {
      question: 'What counts as a fixed cost?',
      answer:
        'Anything you pay whether or not you sell: rent, salaries, insurance, subscriptions, equipment. If the bill is the same at zero sales and a thousand, it is fixed.',
    },
    {
      question: 'What counts as a variable cost?',
      answer:
        'Costs that arrive with each sale: raw materials, manufacturing, packaging, shipping, payment processing, per-unit commission. If it disappears when the sale does not happen, it is variable.',
    },
    {
      question: 'Why does the price have to exceed the variable cost?',
      answer:
        'Because the fixed costs are paid out of what is left over from each sale. If nothing is left, selling more never gets you there — and if the price is below the variable cost, more sales make things worse.',
    },
    {
      question: 'Why is the answer rounded up?',
      answer:
        'You cannot sell part of a unit. If the exact figure is 2,500.4, you need 2,501 sales to be genuinely past break-even. Both figures are shown.',
    },
    {
      question: 'How do I break even on a target profit rather than zero?',
      answer:
        'Add the profit you want to the fixed costs and run it again. To make 5,000 on top of 10,000 of fixed costs, enter 15,000.',
    },
    {
      question: 'Does this account for tax or a sales mix?',
      answer:
        'No. It models one product at one price, before tax. Businesses selling several products at different margins need a weighted calculation this page does not attempt.',
    },
  ],
  tip: {
    title: 'Margin moves the number faster than price',
    body: 'Cutting the variable cost by 1 and raising the price by 1 both add 1 to the contribution margin — and either can change the break-even point far more than trimming fixed costs.',
  },
}
