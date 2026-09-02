import type { CalculatorContent } from './types.ts'

export const salesTaxContent: CalculatorContent = {
  slug: 'sales-tax-calculator',
  seoTitle: 'Sales Tax Calculator — Add Tax or Work Back From a Total',
  seoDescription:
    'Free sales tax calculator. Add tax to a price to get the total, or start from a tax-inclusive price and recover the pre-tax amount and the tax paid.',
  intro: {
    title: 'About sales tax',
    lead: 'Add tax to a price, or start from a total and work out how much of it was tax.',
    paragraphs: [
      'Sales tax is a percentage added to the price of goods and services. In some places it is shown separately at the till; in others it is already inside the advertised price. This calculator handles both directions.',
      'Working backwards is not simply subtracting the percentage. A total of 120 that includes 20% tax started at 100, not 96 — because the tax was calculated on 100, not on 120. The extract mode divides by the tax factor instead, which is the step people most often get wrong.',
      'Rates vary by country, state and product. Enter whichever rate applies to your purchase; the calculator does not assume one.',
    ],
  },
  howTo: {
    title: 'How to calculate sales tax',
    steps: [
      {
        title: 'Choose a direction',
        description:
          'Add tax to a pre-tax price, or extract the tax already contained in a total.',
      },
      {
        title: 'Enter the price',
        description:
          'In add mode this is the price before tax. In extract mode it is the price including tax.',
      },
      { title: 'Enter the tax rate', description: 'As a percentage, such as 8.25 or 20.' },
      {
        title: 'Read the breakdown',
        description: 'The pre-tax price, the tax itself and the final total are all shown.',
      },
    ],
  },
  formulasTitle: 'Sales tax formulas',
  formulas: [
    {
      name: 'Adding tax',
      expression: 'tax = price × (rate ÷ 100), total = price + tax',
      description: '100 at 8.25% gives 8.25 of tax and a total of 108.25.',
    },
    {
      name: 'Extracting tax from a total',
      expression: 'pre-tax = total ÷ (1 + rate ÷ 100)',
      description:
        '120 including 20% tax divides by 1.2 to give 100, so the tax was 20.',
    },
    {
      name: 'Why subtraction does not work',
      expression: 'total − (total × rate ÷ 100) is not the pre-tax price',
      description:
        'Taking 20% off 120 gives 96, but the true pre-tax price is 100. The tax was a share of the smaller figure, not the larger one.',
    },
  ],
  examples: [
    {
      title: 'Adding tax at the till',
      description: 'A 100 item in a region with 8.25% sales tax.',
      inputs: [
        { label: 'Mode', value: 'Add tax' },
        { label: 'Price', value: '100' },
        { label: 'Tax rate', value: '8.25%' },
      ],
      result: 'Tax 8.25, total 108.25.',
    },
    {
      title: 'Working back from a receipt',
      description: 'A total of 120 that already includes 20% tax.',
      inputs: [
        { label: 'Mode', value: 'Extract tax' },
        { label: 'Price including tax', value: '120' },
        { label: 'Tax rate', value: '20%' },
      ],
      result: 'Pre-tax 100.00, tax 20.00.',
    },
    {
      title: 'A tax-free item',
      description: 'Some goods are zero-rated.',
      inputs: [
        { label: 'Price', value: '100' },
        { label: 'Tax rate', value: '0%' },
      ],
      result: 'Tax 0.00, total 100.00.',
    },
  ],
  faqs: [
    {
      question: 'Why can I not just subtract the percentage to remove tax?',
      answer:
        'Because the tax was worked out on the smaller pre-tax figure. Removing 20% from a 120 total gives 96, but the real pre-tax price is 100. You have to divide by 1.20 rather than subtract.',
    },
    {
      question: 'What rate should I use?',
      answer:
        'Whichever applies where you are buying. Rates differ by country, and in the US by state, county and city, with some categories taxed differently. The calculator applies the rate you enter rather than assuming one.',
    },
    {
      question: 'Does this work for VAT or GST?',
      answer:
        'Yes. The arithmetic is identical for any single-rate tax added as a percentage of price. Only the name and the rate change.',
    },
    {
      question: 'How do I handle a discount and tax together?',
      answer:
        'Apply the discount first, then the tax on the reduced price — that is the normal order at checkout. Use the Discount Calculator for the first step and bring the result here.',
    },
    {
      question: 'Why does the final penny sometimes look off?',
      answer:
        'Tax is calculated at full precision and then displayed to two decimals. Retailers round each line differently, so a receipt can differ by a penny from a single-line calculation.',
    },
  ],
  tip: {
    title: 'Divide, do not subtract',
    body: 'To pull tax out of a total, divide by 1 plus the rate as a decimal. Subtracting the percentage always understates the original price.',
  },
}
