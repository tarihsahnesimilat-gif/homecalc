import type { CalculatorContent } from './types.ts'

export const compoundInterestContent: CalculatorContent = {
  slug: 'compound-interest-calculator',
  seoTitle: 'Compound Interest Calculator — Growth Over Time',
  seoDescription:
    'Free compound interest calculator. Enter a principal, annual rate, compounding frequency and term to estimate the final amount and the interest earned.',
  intro: {
    title: 'About compound interest',
    lead: 'Estimate how a balance grows when interest is added back and starts earning interest of its own.',
    paragraphs: [
      'Compound interest is interest calculated on the principal plus the interest already added. Each period starts from a slightly larger balance, so growth accelerates the longer the money is left alone.',
      'How often interest is added matters. The same annual rate compounded monthly produces more than compounded once a year, because each addition starts earning sooner. The gap widens with both the rate and the number of years.',
      'This is a mathematical projection at a fixed rate. Real accounts change rates, charge fees and may be taxed, so treat the result as an estimate rather than a promise.',
    ],
  },
  howTo: {
    title: 'How to calculate compound interest',
    steps: [
      {
        title: 'Enter the principal',
        description: 'The starting balance. It must be greater than zero for there to be anything to compound.',
      },
      {
        title: 'Enter the annual rate',
        description:
          'Use the yearly percentage. The calculator divides it across the compounding periods for you, so do not convert it yourself.',
      },
      {
        title: 'Choose the compounding frequency',
        description:
          'How often interest is added: annually, semi-annually, quarterly, monthly or daily.',
      },
      {
        title: 'Enter the term in years',
        description:
          'Decimals are accepted, so 18 months is 1.5. Longer terms are where compounding does most of its work.',
      },
    ],
  },
  formulasTitle: 'Compound interest formulas',
  formulas: [
    {
      name: 'Final amount',
      expression: 'A = P × (1 + r ÷ n)^(n × t)',
      description:
        'P is the principal, r the annual rate as a decimal, n the compounding periods per year and t the years. 1,000 at 5% compounded annually for 10 years gives 1,628.89.',
    },
    {
      name: 'Total interest',
      expression: 'A − P',
      description: 'What the balance gained. On the example above, 628.89.',
    },
    {
      name: 'Periods per year',
      expression: 'annually 1 · semi-annually 2 · quarterly 4 · monthly 12 · daily 365',
      description:
        'The larger n is, the more often interest is added, and the slightly higher the final amount at the same rate.',
    },
  ],
  examples: [
    {
      title: 'Ten years, compounded annually',
      description: 'A balance of 1,000 at 5% left untouched for a decade.',
      inputs: [
        { label: 'Principal', value: '1000' },
        { label: 'Annual rate', value: '5%' },
        { label: 'Frequency', value: 'Annually' },
        { label: 'Time', value: '10 years' },
      ],
      result: 'Final amount 1,628.89, interest earned 628.89.',
    },
    {
      title: 'The same rate, compounded monthly',
      description: 'Identical inputs, but interest is added twelve times a year.',
      inputs: [
        { label: 'Principal', value: '1000' },
        { label: 'Annual rate', value: '5%' },
        { label: 'Frequency', value: 'Monthly' },
        { label: 'Time', value: '10 years' },
      ],
      result: 'Final amount 1,647.01 — about 18 more than annual compounding.',
    },
    {
      title: 'No interest at all',
      description: 'A zero rate, for comparison.',
      inputs: [
        { label: 'Principal', value: '1000' },
        { label: 'Annual rate', value: '0%' },
        { label: 'Time', value: '10 years' },
      ],
      result: 'Final amount 1,000.00 — compounding nothing changes nothing.',
    },
  ],
  faqs: [
    {
      question: 'How is this different from simple interest?',
      answer:
        'Simple interest is always calculated on the original principal, so it adds the same amount every year. Compound interest adds each period’s interest to the balance, so later periods earn more. On 1,000 at 5% for 10 years, simple interest gives 500 and annual compounding gives about 629.',
    },
    {
      question: 'Does compounding frequency make a big difference?',
      answer:
        'Less than people expect at ordinary rates. On 1,000 at 5% for 10 years, moving from annual to monthly compounding adds roughly 18. The rate and the number of years matter far more than the frequency.',
    },
    {
      question: 'What does daily compounding assume?',
      answer:
        'A 365-day year. Some institutions use 360 days for certain products, which changes the result slightly. Check which convention your account uses if the exact figure matters.',
    },
    {
      question: 'Does this account for regular contributions?',
      answer:
        'No. It projects a single lump sum. Adding money over time requires a different formula, since each contribution compounds for a different length of time.',
    },
    {
      question: 'Are fees, tax and inflation included?',
      answer:
        'No. The result is the mathematical growth of the figures you enter. Fees and tax reduce what you keep, and inflation reduces what it buys, so the real outcome is usually lower.',
    },
  ],
  tip: {
    title: 'Time does more than rate',
    body: 'Doubling the term usually adds more than doubling the rate, because the growth is exponential in time. Starting earlier is the single biggest lever in this formula.',
  },
}
