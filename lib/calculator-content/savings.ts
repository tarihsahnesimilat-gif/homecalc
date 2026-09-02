import type { CalculatorContent } from './types.ts'

export const savingsContent: CalculatorContent = {
  slug: 'savings-calculator',
  seoTitle: 'Savings Calculator — Growth With Regular Deposits',
  seoDescription:
    'Free savings calculator. Combine a starting balance, monthly deposits and an interest rate to see the total saved, the interest earned and the final balance.',
  intro: {
    title: 'About saving over time',
    lead: 'See what a balance grows to when you add to it every month.',
    paragraphs: [
      'Two things build a savings balance: the money you put in, and the interest it earns. This separates the two, so you can see how much of the final figure you contributed and how much the account added.',
      'Over short periods the deposits dominate almost entirely. Interest only becomes the larger share after many years, which is why the time period matters more than most people expect.',
      'The projection assumes deposits at the end of each month, interest compounding monthly, and a rate that never changes — with no fees or tax. Real accounts vary their rates, so treat this as an illustration of the arithmetic rather than a promise.',
    ],
  },
  howTo: {
    title: 'How to project savings growth',
    steps: [
      {
        title: 'Enter your starting balance',
        description: 'What is already in the account. Zero is fine if you are starting fresh.',
      },
      {
        title: 'Enter your monthly deposit',
        description:
          'What you add each month. This can be zero, but you need either a balance or a deposit.',
      },
      {
        title: 'Enter the interest rate',
        description:
          'The annual rate the account pays. Unlike an investment return, this is usually a quoted figure you can look up.',
      },
      {
        title: 'Set the time period',
        description: 'In years. Decimals are rounded to the nearest whole month.',
      },
    ],
  },
  formulasTitle: 'Savings formulas',
  formulas: [
    {
      name: 'Growth on the starting balance',
      expression: 'P × (1 + r)ⁿ',
      description:
        'P is the opening balance, r the monthly rate (annual ÷ 12 ÷ 100), n the number of months.',
    },
    {
      name: 'Growth on the deposits',
      expression: 'D × [((1 + r)ⁿ − 1) ÷ r]',
      description:
        'Each deposit compounds for a different length of time, and this term accounts for all of them at once.',
    },
    {
      name: 'With no interest',
      expression: 'P + (D × n)',
      description:
        'At a zero rate the balance is simply everything paid in — and the formula above would divide by zero.',
    },
    {
      name: 'Interest earned',
      expression: 'final balance − total paid in',
      description: 'What the account added, separate from what you contributed yourself.',
    },
  ],
  examples: [
    {
      title: 'Saving steadily',
      description: 'Starting with 1,000 and adding 200 a month for ten years at 4%.',
      inputs: [
        { label: 'Starting balance', value: '1000' },
        { label: 'Monthly deposit', value: '200' },
        { label: 'Rate', value: '4%' },
        { label: 'Period', value: '10 years' },
      ],
      result: 'About 30,970 from 25,000 paid in.',
    },
    {
      title: 'A lump sum left alone',
      description: '10,000 with no further deposits at 5% for ten years.',
      inputs: [
        { label: 'Starting balance', value: '10000' },
        { label: 'Monthly deposit', value: '0' },
        { label: 'Rate', value: '5%' },
      ],
      result: 'About 16,470, all of the growth from interest.',
    },
    {
      title: 'No interest at all',
      description: 'The same deposits into an account paying nothing.',
      inputs: [
        { label: 'Starting balance', value: '500' },
        { label: 'Monthly deposit', value: '100' },
        { label: 'Rate', value: '0%' },
        { label: 'Period', value: '5 years' },
      ],
      result: '6,500 — exactly what was paid in.',
    },
  ],
  faqs: [
    {
      question: 'How is this different from the Investment Calculator?',
      answer:
        'The maths is the same, and this page shares that calculation. The difference is what the rate means: a savings rate is usually quoted and known, while an investment return is an assumption that may not hold.',
    },
    {
      question: 'Are tax and inflation included?',
      answer:
        'No. Interest may be taxable depending on your country and account type, and inflation reduces what the final balance buys. Both make the real outcome lower than the figure shown.',
    },
    {
      question: 'When are deposits assumed to be made?',
      answer:
        'At the end of each month. Paying in at the start gives every deposit one extra month of interest, so the real figure would be a little higher.',
    },
    {
      question: 'What if my rate changes?',
      answer:
        'Savings rates move often, especially on variable accounts. Run the calculation at a few rates to see the range rather than treating one figure as fixed.',
    },
    {
      question: 'Why does interest matter so little at first?',
      answer:
        'Because it is earned on a small balance. In year one your deposits dwarf it. The crossover, where interest starts adding more than you do, usually takes many years — which is the argument for starting early.',
    },
  ],
  tip: {
    title: 'Watch the split, not just the total',
    body: 'The breakdown shows how much you paid in against how much the interest added. Watching that ratio shift over longer periods is the clearest illustration of compounding.',
  },
}
