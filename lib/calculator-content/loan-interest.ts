import type { CalculatorContent } from './types.ts'

export const loanInterestContent: CalculatorContent = {
  slug: 'loan-interest-calculator',
  seoTitle: 'Loan Interest Calculator — What a Loan Really Costs',
  seoDescription:
    'Free loan interest calculator. See the total interest on a loan, how much of the first payment is interest, and what the borrowing costs as a share of the amount.',
  intro: {
    title: 'About the interest on a loan',
    lead: 'See what a loan costs in interest, and why the balance barely moves at first.',
    paragraphs: [
      'Interest is charged on whatever is still outstanding. Early in a loan that is nearly the whole amount, so most of each payment goes to interest and very little to the debt itself. As the balance falls the split reverses, and by the end almost every penny reduces the principal.',
      'That is why a loan can feel stuck for the first few years. This calculator shows the split explicitly: what the first payment buys, what the last one does, and what the interest totals across the term.',
      'Where the Loan Payment calculator answers "what will I pay each month?", this one answers "what is the interest costing me?" — the same loan, viewed from the other side.',
    ],
  },
  howTo: {
    title: 'How to work out loan interest',
    steps: [
      {
        title: 'Enter the amount borrowed',
        description: 'The principal, after any deposit.',
      },
      {
        title: 'Enter the annual rate',
        description: 'The yearly rate. It is converted to a monthly rate internally.',
      },
      {
        title: 'Enter the term in years',
        description: 'How long you have to repay.',
      },
      {
        title: 'Compare the first and last payments',
        description:
          'The gap between them is the clearest illustration of how amortisation actually works.',
      },
    ],
  },
  formulasTitle: 'How the interest is worked out',
  formulas: [
    {
      name: 'Interest in any month',
      expression: 'outstanding balance × (annual rate ÷ 12 ÷ 100)',
      description:
        '200,000 at 6% is charged 1,000 in the first month, because the balance is still the full amount.',
    },
    {
      name: 'Principal in that payment',
      expression: 'monthly payment − that month’s interest',
      description:
        'On a 30-year loan at 6%, the first payment of about 1,199 puts only 199 against the debt.',
    },
    {
      name: 'Total interest',
      expression: '(monthly payment × number of payments) − amount borrowed',
      description: 'Everything paid across the term, less what was actually lent.',
    },
    {
      name: 'Interest as a share of the loan',
      expression: '(total interest ÷ amount borrowed) × 100',
      description:
        'Over 100% means you repay more in interest than you borrowed — common on long terms at higher rates.',
    },
  ],
  examples: [
    {
      title: 'A five-year car loan',
      description: '20,000 at 7% over five years.',
      inputs: [
        { label: 'Amount', value: '20000' },
        { label: 'Rate', value: '7%' },
        { label: 'Term', value: '5 years' },
      ],
      result: 'About 3,761 of interest — roughly 19% of the amount borrowed.',
    },
    {
      title: 'A 30-year mortgage',
      description: '200,000 at 6% over thirty years.',
      inputs: [
        { label: 'Amount', value: '200000' },
        { label: 'Rate', value: '6%' },
        { label: 'Term', value: '30 years' },
      ],
      result: 'The first payment is 1,000 interest against 199 principal.',
    },
    {
      title: 'An interest-free loan',
      description: 'Nothing charged for borrowing.',
      inputs: [
        { label: 'Rate', value: '0%' },
      ],
      result: 'No interest at all — every payment is principal.',
    },
  ],
  faqs: [
    {
      question: 'Why is so much of my early payment interest?',
      answer:
        'Because interest is charged on the outstanding balance, which is at its largest right at the start. The payment is fixed, so whatever is left after interest goes to the debt — and early on that is very little.',
    },
    {
      question: 'How does this differ from the Loan Payment calculator?',
      answer:
        'They model the same loan. Loan Payment tells you the monthly figure; this focuses on the interest — the total, the share of the amount borrowed, and how the split between interest and principal shifts across the term.',
    },
    {
      question: 'Can the total interest exceed the amount I borrowed?',
      answer:
        'Easily, on a long term at a moderate rate. A 30-year loan at 6% repays well over 100% of the principal in interest, which the percentage shown here makes obvious.',
    },
    {
      question: 'Does paying extra reduce the interest?',
      answer:
        'Substantially, because anything above the required payment comes straight off the principal, and every future month’s interest is then charged on a smaller balance. This calculator assumes the scheduled payment only.',
    },
    {
      question: 'Are fees included?',
      answer:
        'No. Arrangement fees, early repayment charges and insurance sit outside the interest calculation. An APR quoted by a lender usually folds some of those in, which is why it can exceed the headline rate.',
    },
  ],
  tip: {
    title: 'Shortening the term beats chasing the rate',
    body: 'Cutting years off a loan usually saves more interest than a small rate reduction, because interest accrues for fewer months on a faster-falling balance.',
  },
}
