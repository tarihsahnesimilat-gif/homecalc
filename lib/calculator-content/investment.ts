import type { CalculatorContent } from './types.ts'

export const investmentContent: CalculatorContent = {
  slug: 'investment-calculator',
  seoTitle: 'Investment Calculator — Project Growth With Monthly Contributions',
  seoDescription:
    'Free investment calculator. Combine a starting amount, monthly contributions, a rate of return and a time period to project the final value and the growth.',
  intro: {
    title: 'About projecting investment growth',
    lead: 'Combine a starting amount with regular monthly contributions to project how a balance could grow.',
    paragraphs: [
      'Two things drive the outcome: the money you put in, and the growth on top of it. This calculator separates the two, so you can see how much of the final figure came from contributions and how much from compounding.',
      'The projection assumes contributions at the end of each month, growth compounding monthly at a constant rate, and no fees, tax or inflation. Real investments meet all of those, which is why an actual outcome will differ.',
      'This is an arithmetic projection of the assumptions you enter, not a prediction and not financial advice. Real returns vary year to year and can be negative; a fixed rate is a simplification used to illustrate compounding, not a forecast of any market.',
    ],
  },
  howTo: {
    title: 'How to project investment growth',
    steps: [
      {
        title: 'Enter the starting amount',
        description: 'What you are investing today. Zero is fine if you are starting from nothing.',
      },
      {
        title: 'Enter the monthly contribution',
        description:
          'What you add each month. Zero is fine too, but at least one of the two must be above zero.',
      },
      {
        title: 'Enter a rate of return',
        description:
          'An annual percentage. Because no one can know a future return, try a few figures to see a range rather than a single answer.',
      },
      {
        title: 'Set the time period',
        description:
          'In years; decimals are accepted and rounded to whole months. Time is what makes compounding matter.',
      },
    ],
  },
  formulasTitle: 'The model',
  formulas: [
    {
      name: 'Growth on the starting amount',
      expression: 'P × (1 + r)ⁿ',
      description:
        'P is the initial investment, r the monthly rate (annual ÷ 12 ÷ 100), n the number of months.',
    },
    {
      name: 'Growth on the contributions',
      expression: 'PMT × [((1 + r)ⁿ − 1) ÷ r]',
      description:
        'The future value of a series of equal payments. Each contribution compounds for a different length of time, which this term accounts for.',
    },
    {
      name: 'With no growth',
      expression: 'P + (PMT × n)',
      description:
        'At a zero rate the balance is simply everything paid in — and the formula above would divide by zero.',
    },
    {
      name: 'Growth earned',
      expression: 'final value − total contributions',
      description: 'What compounding added, separate from what you put in yourself.',
    },
  ],
  examples: [
    {
      title: 'A lump sum left alone',
      description: '10,000 invested for ten years at 6%, with nothing added.',
      inputs: [
        { label: 'Initial investment', value: '10000' },
        { label: 'Monthly contribution', value: '0' },
        { label: 'Rate of return', value: '6%' },
        { label: 'Period', value: '10 years' },
      ],
      result: 'About 18,194 — roughly 8,194 of growth on 10,000 paid in.',
    },
    {
      title: 'Contributing every month',
      description: 'Starting with 1,000 and adding 200 a month for ten years at 5%.',
      inputs: [
        { label: 'Initial investment', value: '1000' },
        { label: 'Monthly contribution', value: '200' },
        { label: 'Rate of return', value: '5%' },
        { label: 'Period', value: '10 years' },
      ],
      result: 'About 32,700 from 25,000 paid in.',
    },
    {
      title: 'No growth at all',
      description: 'The same contributions with a zero rate, for comparison.',
      inputs: [
        { label: 'Initial investment', value: '1000' },
        { label: 'Monthly contribution', value: '100' },
        { label: 'Rate of return', value: '0%' },
        { label: 'Period', value: '5 years' },
      ],
      result: '7,000 — exactly what was paid in.',
    },
  ],
  faqs: [
    {
      question: 'Is this a prediction of what my investment will do?',
      answer:
        'No. It works out what a constant rate would produce given your figures. Real returns move up and down and can be negative for years at a time. Use it to understand how contributions and time interact, not to forecast an outcome.',
    },
    {
      question: 'What rate of return should I enter?',
      answer:
        'There is no correct answer, which is the point. Rather than one number, try a low, middling and high figure to see the range of outcomes your plan produces.',
    },
    {
      question: 'Are fees, tax and inflation included?',
      answer:
        'No. All three reduce what you actually end up with — fees and tax directly, inflation by reducing what the money buys. The projection is deliberately simple, so treat it as an upper bound rather than a target.',
    },
    {
      question: 'When are contributions assumed to be made?',
      answer:
        'At the end of each month. Contributing at the start of the month gives each payment one extra month of growth, so the real figure would be slightly higher.',
    },
    {
      question: 'How does this differ from the Compound Interest Calculator?',
      answer:
        'Compound Interest projects a single lump sum and lets you choose the compounding frequency. This one adds regular monthly contributions, which is how most people actually save.',
    },
    {
      question: 'Is this financial advice?',
      answer:
        'No. It is a maths tool. Decisions about investing depend on your circumstances, timescale and tolerance for loss — speak to a qualified adviser about those.',
    },
  ],
  tip: {
    title: 'Watch the split, not just the total',
    body: 'The breakdown shows how much came from your contributions versus growth. Early on, contributions dominate; over long periods, growth takes over. That crossover is what compounding really means.',
  },
}
