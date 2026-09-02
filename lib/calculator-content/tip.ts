import type { CalculatorContent } from './types.ts'

export const tipContent: CalculatorContent = {
  slug: 'tip-calculator',
  seoTitle: 'Tip Calculator — Work Out a Tip and Split the Bill',
  seoDescription:
    'Free tip calculator. Enter the bill, choose a tip percentage, and split the total between any number of people. See the tip, the total, and the amount each person owes.',
  intro: {
    title: 'About tipping and splitting bills',
    lead: 'Work out the tip on any bill and split the total between however many people are paying.',
    paragraphs: [
      'A tip is a percentage of the bill added on top of what you already owe. The arithmetic is simple, but doing it in your head after a long meal — and then dividing by five — is where mistakes creep in.',
      'Tipping customs vary widely between countries and even between types of venue, so this calculator does not assume a "correct" percentage. Pick the rate that fits where you are, and the calculator handles the rest.',
    ],
  },
  howTo: {
    title: 'How to calculate a tip',
    steps: [
      {
        title: 'Enter the bill amount',
        description:
          'Use the total before the tip. If the bill already includes a service charge, decide whether you want to tip on top of it before entering the figure.',
      },
      {
        title: 'Choose a tip percentage',
        description:
          'Type any rate you like. The calculator accepts decimals, so 12.5% works just as well as 15%.',
      },
      {
        title: 'Set the number of people',
        description:
          'Leave it at 1 if you are paying alone, or enter the size of the group to split the total evenly.',
      },
      {
        title: 'Read the breakdown',
        description:
          'You get the tip on its own, the total including the tip, and the amount each person owes. Rounding the per-person figure up to the nearest whole unit is a common courtesy when splitting.',
      },
    ],
  },
  formulasTitle: 'Tip formulas',
  formulas: [
    {
      name: 'Tip amount',
      expression: 'bill × (tip percentage ÷ 100)',
      description:
        'Converts the percentage to a decimal and applies it to the bill. A 15% tip on 100 is 100 × 0.15 = 15.',
    },
    {
      name: 'Total bill',
      expression: 'bill + tip amount',
      description: 'What actually leaves your account once the tip is added.',
    },
    {
      name: 'Amount per person',
      expression: 'total bill ÷ number of people',
      description:
        'An even split. If the group did not order equally, split the bill by what each person had first, then tip on each share.',
    },
  ],
  examples: [
    {
      title: 'Dinner for one',
      description: 'A 100 bill with a standard 15% tip, paid by a single person.',
      inputs: [
        { label: 'Bill amount', value: '100' },
        { label: 'Tip percentage', value: '15' },
        { label: 'Number of people', value: '1' },
      ],
      result: 'Tip 15.00, total 115.00, and 115.00 per person.',
    },
    {
      title: 'Splitting between four',
      description: 'A 100 bill with a 20% tip, divided evenly across a table of four.',
      inputs: [
        { label: 'Bill amount', value: '100' },
        { label: 'Tip percentage', value: '20' },
        { label: 'Number of people', value: '4' },
      ],
      result: 'Tip 20.00, total 120.00, and 30.00 each.',
    },
    {
      title: 'A modest tip on a large bill',
      description: 'A 250 bill with a 10% tip shared between two people.',
      inputs: [
        { label: 'Bill amount', value: '250' },
        { label: 'Tip percentage', value: '10' },
        { label: 'Number of people', value: '2' },
      ],
      result: 'Tip 25.00, total 275.00, and 137.50 each.',
    },
    {
      title: 'No tip at all',
      description: 'Somewhere tipping is not customary, or service was already included.',
      inputs: [
        { label: 'Bill amount', value: '80' },
        { label: 'Tip percentage', value: '0' },
        { label: 'Number of people', value: '2' },
      ],
      result: 'Tip 0.00, total 80.00, and 40.00 each.',
    },
  ],
  faqs: [
    {
      question: 'Should I tip on the amount before or after tax?',
      answer:
        'Both are common, and tipping on the pre-tax amount is the more conservative choice. This calculator applies the percentage to whatever figure you enter, so you decide which one to use.',
    },
    {
      question: 'What if a service charge is already on the bill?',
      answer:
        'A service charge is usually a tip that has been added for you. If one appears on your bill, you generally do not need to add another — check whether it is described as optional before deciding.',
    },
    {
      question: 'How do I split a bill when people ordered different things?',
      answer:
        'An even split is only fair when everyone ordered similarly. Otherwise, total each person’s items separately, apply the same tip percentage to each share, and the amounts will still add up to the full total.',
    },
    {
      question: 'Why does the per-person amount have fractions of a unit?',
      answer:
        'Dividing a total between people rarely lands on a round number. Rounding each share up slightly is normal, and it means the tip ends up marginally larger rather than the bill coming up short.',
    },
    {
      question: 'Can I enter a tip percentage above 100%?',
      answer:
        'Yes. There is no upper limit, which is useful for very small bills where a percentage-based tip would feel too low. Negative percentages are rejected, since a tip cannot reduce the bill.',
    },
  ],
  tip: {
    title: 'Round up when you split',
    body: 'When an even split lands on an awkward figure, round each share up to the nearest whole unit. The few units of difference cover the rounding and keep the total from falling short.',
  },
}
