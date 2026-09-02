import type { CalculatorContent } from './types.ts'

export const futureValueContent: CalculatorContent = {
  slug: 'future-value-calculator',
  seoTitle: 'Future Value Calculator — Future and Present Value of Money',
  seoDescription:
    'Free future value calculator. Grow a sum forward at a given rate, or discount a future amount back to what it is worth in today’s money.',
  intro: {
    title: 'About the time value of money',
    lead: 'Grow a sum forward in time, or discount a future sum back to today.',
    paragraphs: [
      'Money has a different value depending on when you receive it. A thousand today can be invested and become more; a thousand in ten years cannot. That gap is the time value of money, and it is what makes amounts at different dates impossible to compare directly.',
      'This works in both directions. Forward gives you future value: what a sum becomes. Backward gives you present value: what a future amount is worth in today’s terms — the direction people need more often and reach for less.',
      'The rate you choose is doing all the work. For future value it is an assumed return; for present value it is a discount rate reflecting what you could otherwise earn. Neither is a fact about the world, so treat the output as a comparison tool rather than a forecast.',
    ],
  },
  howTo: {
    title: 'How to use the calculator',
    steps: [
      {
        title: 'Choose a direction',
        description:
          'Future value grows an amount forward. Present value discounts a future amount back to today.',
      },
      {
        title: 'Enter the amount',
        description:
          'For future value, the sum you have now. For present value, the sum you expect later.',
      },
      {
        title: 'Enter the rate and period',
        description:
          'An annual percentage and a number of years. Compounding is annual, which is the convention for discounting.',
      },
      {
        title: 'Read the result and the factor',
        description:
          'The factor shows how much one unit grows or shrinks over the period, which makes it easy to apply to other amounts.',
      },
    ],
  },
  formulasTitle: 'Time value formulas',
  formulas: [
    {
      name: 'Future value',
      expression: 'FV = PV × (1 + r)ⁿ',
      description:
        'r is the annual rate as a decimal and n the number of years. 1,000 at 5% for 10 years becomes 1,628.89.',
    },
    {
      name: 'Present value',
      expression: 'PV = FV ÷ (1 + r)ⁿ',
      description:
        'The same relationship rearranged. 1,628.89 in ten years, discounted at 5%, is worth 1,000 today.',
    },
    {
      name: 'The factor',
      expression: '(1 + r)ⁿ',
      description:
        'At 5% over 10 years the factor is 1.6289. Multiply by it going forward, divide by it coming back.',
    },
  ],
  examples: [
    {
      title: 'Growing a sum',
      description: '1,000 at 5% for ten years.',
      inputs: [
        { label: 'Direction', value: 'Future value' },
        { label: 'Amount', value: '1000' },
        { label: 'Rate', value: '5%' },
        { label: 'Years', value: '10' },
      ],
      result: '1,628.89.',
    },
    {
      title: 'Discounting back',
      description: 'What that same future sum is worth today.',
      inputs: [
        { label: 'Direction', value: 'Present value' },
        { label: 'Amount', value: '1628.89' },
        { label: 'Rate', value: '5%' },
        { label: 'Years', value: '10' },
      ],
      result: '1,000.00 — the exact inverse.',
    },
    {
      title: 'Judging a future payout',
      description: 'An offer of 50,000 in five years, at a 6% discount rate.',
      inputs: [
        { label: 'Direction', value: 'Present value' },
        { label: 'Amount', value: '50000' },
        { label: 'Rate', value: '6%' },
        { label: 'Years', value: '5' },
      ],
      result: 'About 37,363 in today’s money.',
    },
  ],
  faqs: [
    {
      question: 'How is this different from the Compound Interest calculator?',
      answer:
        'Compound Interest focuses on interest earned and lets you choose a compounding frequency. This is about comparing sums across time, and adds the reverse direction — discounting a future amount back to today, which the other does not do.',
    },
    {
      question: 'What is present value actually for?',
      answer:
        'Comparing money that arrives at different times. If you are offered 50,000 in five years or 40,000 now, discounting the future figure tells you which is genuinely worth more given what you could otherwise earn.',
    },
    {
      question: 'What discount rate should I use?',
      answer:
        'Conventionally, what you could earn elsewhere at similar risk. A higher rate discounts future money more heavily. There is no single correct figure, so try a range and see whether the decision actually changes.',
    },
    {
      question: 'Does this account for inflation?',
      answer:
        'Not separately. If you want a result in today’s purchasing power, use a real rate — your nominal rate minus expected inflation — rather than the nominal one.',
    },
    {
      question: 'Why annual compounding?',
      answer:
        'It is the standard convention for discounting, and it keeps the two directions exact inverses. For a specific compounding frequency, the Compound Interest calculator handles annual through to daily.',
    },
  ],
  tip: {
    title: 'Compare at the same date',
    body: 'Never compare an amount today with an amount years away as they stand. Bring both to the same point in time first — that is the whole purpose of discounting.',
  },
}
