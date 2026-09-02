import type { CalculatorContent } from './types.ts'

export const mortgageContent: CalculatorContent = {
  slug: 'mortgage-calculator',
  seoTitle: 'Mortgage Calculator — Estimate Your Monthly Payment',
  seoDescription:
    'Free mortgage calculator. Enter a home price, deposit, rate and term to estimate the monthly principal and interest, the total repaid and the total interest.',
  intro: {
    title: 'About mortgage payments',
    lead: 'Estimate the monthly payment on a fixed-rate mortgage after your deposit.',
    paragraphs: [
      'A mortgage is a fixed-payment amortising loan. Every instalment is the same size, but its makeup shifts: early payments are mostly interest, because interest is charged on a large outstanding balance, and later ones are mostly principal.',
      'The amount borrowed is the price less your deposit, so a larger deposit reduces both the monthly payment and the total interest — often by more than people expect.',
      'This covers principal and interest only. A real mortgage payment usually also carries property tax, buildings insurance, HOA or service charges, and mortgage insurance where the deposit is small. Lender fees sit on top of that again. Treat the figure here as the loan portion, not the quote.',
    ],
  },
  howTo: {
    title: 'How to estimate a mortgage payment',
    steps: [
      {
        title: 'Enter the home price',
        description: 'The agreed purchase price, before fees.',
      },
      {
        title: 'Enter your deposit',
        description:
          'What you are putting down. The calculator shows what percentage of the price that is, which lenders care about.',
      },
      {
        title: 'Enter the interest rate and term',
        description:
          'The annual rate and the length in years. A longer term lowers the payment and raises the total interest.',
      },
      {
        title: 'Compare the totals, not just the monthly figure',
        description:
          'Two mortgages with similar payments can differ enormously over 25 or 30 years.',
      },
    ],
  },
  formulasTitle: 'Mortgage formulas',
  formulas: [
    {
      name: 'Amount borrowed',
      expression: 'home price − deposit',
      description: 'A 300,000 home with 60,000 down means borrowing 240,000.',
    },
    {
      name: 'Monthly payment',
      expression: 'M = P × [r(1 + r)ⁿ] ÷ [(1 + r)ⁿ − 1]',
      description:
        'P is the amount borrowed, r the monthly rate (annual ÷ 12 ÷ 100) and n the number of monthly payments. 240,000 at 6% over 30 years is about 1,438.92 a month.',
    },
    {
      name: 'With no interest',
      expression: 'M = P ÷ n',
      description:
        'At a zero rate the loan simply divides evenly, and the general formula would divide by zero.',
    },
    {
      name: 'Total interest',
      expression: '(M × n) − amount borrowed',
      description: 'Everything paid across the term, less what was originally lent.',
    },
  ],
  examples: [
    {
      title: 'A 30-year mortgage with 20% down',
      description: 'A 300,000 home with 60,000 down at 6%.',
      inputs: [
        { label: 'Home price', value: '300000' },
        { label: 'Deposit', value: '60000' },
        { label: 'Rate', value: '6%' },
        { label: 'Term', value: '30 years' },
      ],
      result: 'Borrowing 240,000, about 1,438.92 a month.',
    },
    {
      title: 'The same home over 15 years',
      description: 'A shorter term on identical borrowing.',
      inputs: [
        { label: 'Term', value: '15 years' },
      ],
      result: 'A higher monthly payment, but far less interest across the term.',
    },
    {
      title: 'A larger deposit',
      description: '90,000 down instead of 60,000.',
      inputs: [
        { label: 'Home price', value: '300000' },
        { label: 'Deposit', value: '90000' },
      ],
      result: 'Borrowing 210,000, which lowers both the payment and the total interest.',
    },
  ],
  faqs: [
    {
      question: 'Why is my lender quoting a higher payment?',
      answer:
        'This is principal and interest only. A real payment usually bundles property tax, insurance, and mortgage insurance where the deposit is under 20%, plus any HOA or service charge. Those can add a substantial amount each month.',
    },
    {
      question: 'How much difference does a larger deposit make?',
      answer:
        'It reduces the amount borrowed directly, so both the payment and the total interest fall. It can also unlock a better rate and remove mortgage insurance, which compounds the saving.',
    },
    {
      question: 'Why does a longer term cost so much more overall?',
      answer:
        'Interest is charged on the outstanding balance every month. Repaying more slowly means a larger balance for longer, so the total interest grows even though each payment is smaller.',
    },
    {
      question: 'Does this work for a variable-rate mortgage?',
      answer:
        'Only as a snapshot. The calculation assumes one fixed rate for the whole term. On a variable or tracker mortgage, run it at several rates to see the range you might face.',
    },
    {
      question: 'Can I see how much of each payment is interest?',
      answer:
        'Not here — this gives the payment and the totals rather than a full amortisation schedule. As a rule, early payments are mostly interest and later ones mostly principal.',
    },
    {
      question: 'Is this financial advice?',
      answer:
        'No. It is a maths tool for comparing scenarios. What you can afford depends on your income, other commitments and circumstances — speak to a qualified mortgage adviser about those.',
    },
  ],
  tip: {
    title: 'Budget above the calculator',
    body: 'Whatever this shows, plan for more. Tax, insurance, maintenance and service charges are real monthly costs that the loan payment alone never captures.',
  },
}
