import type { CalculatorContent } from './types.ts'

export const simpleInterestContent: CalculatorContent = {
  slug: 'simple-interest-calculator',
  seoTitle: 'Simple Interest Calculator — Interest and Total Amount',
  seoDescription:
    'Free simple interest calculator. Enter a principal, an annual rate, and a period in years or months to see the interest earned and the total owed or held.',
  intro: {
    title: 'About simple interest',
    lead: 'Enter a principal, an annual rate, and a period to see the interest and the total amount.',
    paragraphs: [
      'Simple interest is charged on the original principal only. The amount added each year stays the same, because previous interest never becomes part of the balance the rate is applied to.',
      'That is what separates it from compound interest, where each period’s interest joins the principal and earns interest of its own. Simple interest is the more common arrangement for short-term loans and some fixed instalment products; longer-term savings and mortgages usually compound.',
    ],
  },
  howTo: {
    title: 'How to calculate simple interest',
    steps: [
      {
        title: 'Enter the principal',
        description:
          'The starting amount — what was borrowed or invested. Interest is always calculated on this figure alone.',
      },
      {
        title: 'Enter the annual rate',
        description:
          'Use the yearly percentage, not a monthly one. If you only have a monthly rate, multiply it by 12 first.',
      },
      {
        title: 'Set the time and its unit',
        description:
          'Enter the period and choose years or months. Months are divided by 12 internally, so 18 months is treated as 1.5 years.',
      },
      {
        title: 'Read the interest and total',
        description:
          'The interest is what the rate produces over that period; the total is the principal plus that interest.',
      },
    ],
  },
  formulasTitle: 'Simple interest formulas',
  formulas: [
    {
      name: 'Simple interest',
      expression: 'principal × (rate ÷ 100) × time in years',
      description:
        'The standard formula, often written I = PRT. A principal of 1,000 at 5% for 2 years earns 1,000 × 0.05 × 2 = 100.',
    },
    {
      name: 'Total amount',
      expression: 'principal + interest',
      description:
        'What you end up with, or owe. A principal of 1,000 earning 100 in interest gives a total of 1,100.',
    },
    {
      name: 'Converting months to years',
      expression: 'months ÷ 12',
      description:
        'The rate is annual, so the period must be too. 12 months is 1 year, and 18 months is 1.5 years.',
    },
  ],
  examples: [
    {
      title: 'Two years at 5%',
      description: 'A principal of 1,000 held for two full years.',
      inputs: [
        { label: 'Principal', value: '1000' },
        { label: 'Annual rate', value: '5%' },
        { label: 'Time', value: '2 years' },
      ],
      result: 'Interest 100.00, total 1,100.00.',
    },
    {
      title: 'The same rate over months',
      description: 'The same principal and rate, entered as 12 months.',
      inputs: [
        { label: 'Principal', value: '1000' },
        { label: 'Annual rate', value: '5%' },
        { label: 'Time', value: '12 months' },
      ],
      result: 'Interest 50.00, total 1,050.00 — 12 months is one year.',
    },
    {
      title: 'A part-year loan',
      description: 'A short-term loan of 2,500 at 8% for six months.',
      inputs: [
        { label: 'Principal', value: '2500' },
        { label: 'Annual rate', value: '8%' },
        { label: 'Time', value: '6 months' },
      ],
      result: 'Interest 100.00, total 2,600.00.',
    },
    {
      title: 'No interest at all',
      description: 'An interest-free arrangement.',
      inputs: [
        { label: 'Principal', value: '1200' },
        { label: 'Annual rate', value: '0%' },
        { label: 'Time', value: '3 years' },
      ],
      result: 'Interest 0.00, total 1,200.00.',
    },
  ],
  faqs: [
    {
      question: 'What is the difference between simple and compound interest?',
      answer:
        'Simple interest is always calculated on the original principal. Compound interest adds each period’s interest to the balance, so later periods earn interest on earlier interest. Over long periods compounding produces noticeably more.',
    },
    {
      question: 'How much more does compounding produce?',
      answer:
        'On 1,000 at 5% for 10 years, simple interest gives 500. Compounding annually over the same period gives about 629. The gap widens with both the rate and the length of time.',
    },
    {
      question: 'Do I use the monthly or the annual rate?',
      answer:
        'The annual one. The formula expects a yearly rate paired with a period measured in years, which is why entering months converts them by dividing by 12.',
    },
    {
      question: 'Can I use this for a loan repayment schedule?',
      answer:
        'Only for the total interest. Instalment loans reduce the balance as you pay, so the interest actually charged is usually lower than a flat simple interest figure on the full principal.',
    },
    {
      question: 'What happens with a zero rate or zero time?',
      answer:
        'Either produces zero interest, and the total equals the principal. Both are accepted, since an interest-free period is a perfectly ordinary situation.',
    },
    {
      question: 'Does this account for inflation, fees, or tax?',
      answer:
        'No. It calculates interest on the figures you enter. Fees, tax on interest, and the effect of inflation on what the money is worth all sit outside the formula.',
    },
  ],
  tip: {
    title: 'Match the rate to the period',
    body: 'The most common mistake is pairing an annual rate with a period in months. Choose the Months unit and the conversion is handled for you.',
  },
}
