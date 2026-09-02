import type { CalculatorContent } from './types'

export const discountContent: CalculatorContent = {
  slug: 'discount-calculator',
  seoTitle: 'Discount Calculator — Sale Price and How Much You Save',
  seoDescription:
    'Free discount calculator. Enter the original price and the percentage off to see the discount amount, the final sale price, and exactly how much you save.',
  intro: {
    title: 'About discounts',
    lead: 'Enter a price and a percentage off to see the sale price and exactly how much you save.',
    paragraphs: [
      'A discount is a percentage taken off a price. Shops advertise the percentage because it sounds generous, but what you actually care about is the two numbers it hides: how much comes off, and what you end up paying.',
      'The two are the same figure viewed from opposite ends. The discount amount is what the shop gives up; the amount saved is what stays in your pocket. This calculator shows both alongside the final price so you can compare offers quickly.',
    ],
  },
  howTo: {
    title: 'How to calculate a discount',
    steps: [
      {
        title: 'Enter the original price',
        description:
          'Use the full price before any reduction — the higher, crossed-out figure on the label.',
      },
      {
        title: 'Enter the percentage off',
        description:
          'Type the advertised discount. Decimals are fine, so 12.5% works as well as 25%.',
      },
      {
        title: 'Read the final price',
        description:
          'The calculator shows what you pay, how much comes off, and the amount saved, which is the same figure as the discount.',
      },
      {
        title: 'Compare offers',
        description:
          'To compare two deals on different items, look at the final prices rather than the percentages. A larger percentage off a higher price is not always the better buy.',
      },
    ],
  },
  formulasTitle: 'Discount formulas',
  formulas: [
    {
      name: 'Discount amount',
      expression: 'original price × (discount percentage ÷ 100)',
      description:
        'How much comes off the price. 20% off 100 is 100 × 0.20 = 20.',
    },
    {
      name: 'Final price',
      expression: 'original price − discount amount',
      description:
        'What you actually pay. It can also be found in one step: price × (1 − percentage ÷ 100).',
    },
    {
      name: 'Amount saved',
      expression: 'discount amount',
      description:
        'The saving is the same number as the discount — one describes what the shop takes off, the other what you keep.',
    },
  ],
  examples: [
    {
      title: 'A fifth off',
      description: 'An item priced at 100 with 20% off.',
      inputs: [
        { label: 'Original price', value: '100' },
        { label: 'Discount percentage', value: '20' },
      ],
      result: 'Discount 20.00, final price 80.00, saving 20.00.',
    },
    {
      title: 'A modest reduction',
      description: 'A 250 item reduced by 10%.',
      inputs: [
        { label: 'Original price', value: '250' },
        { label: 'Discount percentage', value: '10' },
      ],
      result: 'Discount 25.00, final price 225.00, saving 25.00.',
    },
    {
      title: 'No discount applied',
      description: 'Checking a full-price item, or a "sale" that turns out not to be one.',
      inputs: [
        { label: 'Original price', value: '100' },
        { label: 'Discount percentage', value: '0' },
      ],
      result: 'Discount 0.00, final price 100.00, saving 0.00.',
    },
    {
      title: 'Half price',
      description: 'A 79.99 item at 50% off.',
      inputs: [
        { label: 'Original price', value: '79.99' },
        { label: 'Discount percentage', value: '50' },
      ],
      result: 'Discount 40.00, final price 40.00, saving 40.00 (rounded to two decimals).',
    },
  ],
  faqs: [
    {
      question: 'How do I work out a discount in my head?',
      answer:
        'Find 10% by moving the decimal point one place left, then scale it. For 30% off 60: 10% is 6, so 30% is 18, leaving 42. Halving works well for 50%, and combining the two covers most advertised rates.',
    },
    {
      question: 'Are two stacked discounts the same as adding them together?',
      answer:
        'No. Taking 20% off and then a further 10% off is not 30% off, because the second reduction applies to the already-reduced price. 100 becomes 80, then 72 — a 28% total reduction, not 30%.',
    },
    {
      question: 'What is the difference between the discount amount and the amount saved?',
      answer:
        'Nothing — they are the same number. Both are shown because people look for them under different names depending on whether they are thinking about the price tag or their budget.',
    },
    {
      question: 'Can a discount be more than 100%?',
      answer:
        'Not meaningfully. A 100% discount makes the item free, and anything beyond that would mean being paid to take it. The calculator rejects percentages above 100 rather than showing a negative price.',
    },
    {
      question: 'Does this calculator include sales tax or VAT?',
      answer:
        'No. It works purely on the price you enter. If you need the after-tax figure, apply the discount first and then add tax to the final price.',
    },
  ],
  tip: {
    title: 'Compare final prices, not percentages',
    body: 'A bigger percentage off is not automatically the better deal. Work out the final price for each option and compare those — that is the number you actually pay.',
  },
}
