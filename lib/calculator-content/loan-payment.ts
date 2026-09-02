import type { CalculatorContent } from './types.ts'

export const loanPaymentContent: CalculatorContent = {
  slug: 'loan-payment-calculator',
  seoTitle: 'Loan Payment Calculator — Monthly Repayment Estimate',
  seoDescription:
    'Free loan payment calculator. Enter the amount, annual rate and term to estimate the monthly repayment, the total repaid, and the total interest.',
  intro: {
    title: 'About loan repayments',
    lead: 'Estimate the monthly repayment on a fixed-rate loan, and what it adds up to over the full term.',
    paragraphs: [
      'A fixed-payment loan is arranged so every instalment is the same size. Early payments are mostly interest, because interest is charged on a large outstanding balance; as the balance falls, more of each payment goes to the principal.',
      'This calculator covers principal and interest only. Actual repayments often include fees, taxes, insurance and lender-specific terms, so the figure your lender quotes may be higher. Treat the result as an estimate for comparing options rather than a quote.',
    ],
  },
  howTo: {
    title: 'How to estimate a loan payment',
    steps: [
      {
        title: 'Enter the loan amount',
        description: 'The sum borrowed, after any deposit and before fees.',
      },
      {
        title: 'Enter the annual interest rate',
        description:
          'The yearly rate. The calculator converts it to a monthly rate itself, so enter the annual figure even for a monthly repayment.',
      },
      {
        title: 'Set the term',
        description: 'Enter the length and choose years or months. Longer terms lower the payment but raise the total interest.',
      },
      {
        title: 'Compare the totals',
        description:
          'Look at the total interest as well as the monthly figure. Two loans with similar payments can differ substantially over the full term.',
      },
    ],
  },
  formulasTitle: 'Loan payment formulas',
  formulas: [
    {
      name: 'Monthly payment',
      expression: 'M = P × [r(1 + r)^n] ÷ [(1 + r)^n − 1]',
      description:
        'P is the principal, r the monthly rate (annual ÷ 12 ÷ 100) and n the number of monthly payments. 200,000 at 6% over 30 years gives about 1,199.10 a month.',
    },
    {
      name: 'Zero interest',
      expression: 'M = P ÷ n',
      description:
        'With no interest the loan simply divides evenly. The general formula cannot be used, because it would divide by zero.',
    },
    {
      name: 'Total interest',
      expression: '(M × n) − P',
      description: 'Everything paid over the term, less the amount originally borrowed.',
    },
  ],
  examples: [
    {
      title: 'A 30-year loan',
      description: 'Borrowing 200,000 at 6% over thirty years.',
      inputs: [
        { label: 'Loan amount', value: '200000' },
        { label: 'Annual rate', value: '6%' },
        { label: 'Term', value: '30 years' },
      ],
      result: 'About 1,199.10 a month, roughly 231,676 of interest over the term.',
    },
    {
      title: 'The same loan over 15 years',
      description: 'A shorter term on identical borrowing.',
      inputs: [
        { label: 'Loan amount', value: '200000' },
        { label: 'Annual rate', value: '6%' },
        { label: 'Term', value: '15 years' },
      ],
      result: 'A higher monthly payment, but far less interest overall.',
    },
    {
      title: 'An interest-free arrangement',
      description: 'A 12,000 balance spread over two years at 0%.',
      inputs: [
        { label: 'Loan amount', value: '12000' },
        { label: 'Annual rate', value: '0%' },
        { label: 'Term', value: '24 months' },
      ],
      result: '500.00 a month, 12,000.00 total, no interest.',
    },
  ],
  faqs: [
    {
      question: 'Why is the payment my lender quotes higher?',
      answer:
        'This calculator covers principal and interest only. A real quote may add arrangement fees, property taxes, insurance, or mandatory products, all of which sit outside the formula.',
    },
    {
      question: 'Why does a longer term cost more overall?',
      answer:
        'Interest is charged on the outstanding balance each month. Repaying more slowly means a larger balance for longer, so more interest accrues even though each payment is smaller.',
    },
    {
      question: 'Does this work for a mortgage or a car loan?',
      answer:
        'The formula is the same for any fixed-rate, fixed-term loan with equal instalments. What differs between products is the fees and conditions around it, not the arithmetic.',
    },
    {
      question: 'What if my rate changes?',
      answer:
        'The calculation assumes one fixed rate for the whole term. On a variable-rate loan you can only estimate: run the calculation at the rates you want to compare and treat the answers as a range.',
    },
    {
      question: 'Can I see how much of each payment is interest?',
      answer:
        'Not here — this gives the payment and the totals rather than a full amortisation schedule. As a rule, early payments are mostly interest and later ones mostly principal.',
    },
  ],
  tip: {
    title: 'Compare total interest, not just the monthly figure',
    body: 'A lower monthly payment usually means a longer term and more interest overall. The total repaid is the number that tells you what the loan actually costs.',
  },
}
