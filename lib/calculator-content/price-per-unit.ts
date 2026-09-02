import type { CalculatorContent } from './types.ts'

export const pricePerUnitContent: CalculatorContent = {
  slug: 'price-per-unit-calculator',
  seoTitle: 'Price per Unit Calculator — Compare Pack Sizes for Value',
  seoDescription:
    'Free price per unit calculator. Compare two pack sizes to see which is genuinely better value, with the unit price and the saving as a percentage.',
  intro: {
    title: 'About comparing unit prices',
    lead: 'Compare two sizes of the same product to see which is actually better value.',
    paragraphs: [
      'Comparing pack sizes in your head is harder than it looks, and shelves are not laid out to make it easier. Reducing both to a price per single unit — per gram, per sheet, per litre — is the only reliable way to tell.',
      'The larger pack is usually cheaper per unit, but not always. Promotions on small sizes, premium packaging on large ones, and plain inconsistent pricing all reverse it often enough to be worth checking.',
      'One rule: both quantities must be in the same unit. Comparing a price per 500 g against a price per 1 kg will give an answer, and it will be wrong by a factor of two.',
    ],
  },
  howTo: {
    title: 'How to compare unit prices',
    steps: [
      {
        title: 'Enter the first price and quantity',
        description: 'The price of the pack, and how much is in it.',
      },
      {
        title: 'Enter the second price and quantity',
        description:
          'Use the same unit for both. If one is in grams, convert the other to grams too.',
      },
      {
        title: 'Read the unit prices',
        description:
          'Each pack reduced to a price per single unit, which is directly comparable.',
      },
      {
        title: 'Check the saving',
        description:
          'The percentage shows how much cheaper the better option is per unit — useful for deciding whether the difference is worth the bigger pack.',
      },
    ],
  },
  formulasTitle: 'How the comparison works',
  formulas: [
    {
      name: 'Price per unit',
      expression: 'price ÷ quantity',
      description: '2.00 for 500 grams is 0.004 per gram.',
    },
    {
      name: 'The saving',
      expression: '((higher unit price − lower) ÷ higher) × 100',
      description:
        '0.004 against 0.0035 per gram is a 12.5% saving on the cheaper option.',
    },
    {
      name: 'Converting units first',
      expression: '1 kg = 1000 g · 1 litre = 1000 ml',
      description:
        'Both quantities must share a unit before the comparison means anything. Convert one if they differ.',
    },
  ],
  examples: [
    {
      title: 'The bigger pack wins',
      description: '2.00 for 500 g against 3.50 for 1 kg.',
      inputs: [
        { label: 'Price A / quantity', value: '2.00 / 500' },
        { label: 'Price B / quantity', value: '3.50 / 1000' },
      ],
      result: 'B at 0.0035 per gram — 12.5% cheaper.',
    },
    {
      title: 'The smaller pack wins',
      description: 'A promotion on the small size.',
      inputs: [
        { label: 'Price A / quantity', value: '1.00 / 500' },
        { label: 'Price B / quantity', value: '2.50 / 1000' },
      ],
      result: 'A at 0.002 per gram — 20% cheaper.',
    },
    {
      title: 'Identical value',
      description: 'Double the size for double the price.',
      inputs: [
        { label: 'Price A / quantity', value: '2 / 100' },
        { label: 'Price B / quantity', value: '4 / 200' },
      ],
      result: 'Exactly the same per unit.',
    },
  ],
  faqs: [
    {
      question: 'Do the two quantities have to use the same unit?',
      answer:
        'Yes, and this is the one thing that will silently give you a wrong answer. Convert first: 1 kg is 1000 g, 1 litre is 1000 ml. The Unit Converter handles anything less obvious.',
    },
    {
      question: 'Is the bigger pack always better value?',
      answer:
        'No. It usually is, but promotions, premium sizes and inconsistent pricing reverse it often enough that checking is worthwhile — which is the entire reason shelf labels carry unit prices.',
    },
    {
      question: 'Should I always buy the cheaper unit price?',
      answer:
        'Only if you will use it. A larger pack that spoils, expires or sits unused is not a saving. Unit price answers value per unit, not whether the purchase makes sense.',
    },
    {
      question: 'Can I compare more than two options?',
      answer:
        'Compare them in pairs: run the best against each new candidate. The winner of each round carries forward.',
    },
    {
      question: 'Does this work for anything other than groceries?',
      answer:
        'Yes. Anything sold in varying quantities — printer paper, cable by the metre, subscriptions per month against per year — works the same way, as long as the quantities share a unit.',
    },
  ],
  tip: {
    title: 'Convert before you compare',
    body: 'Mismatched units are the only way this calculation goes wrong, and the answer still looks perfectly plausible. Put both quantities in the same unit first.',
  },
}
