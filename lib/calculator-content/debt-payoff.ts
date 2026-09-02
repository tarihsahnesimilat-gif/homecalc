import type { CalculatorContent } from './types.ts'

export const debtPayoffContent: CalculatorContent = {
  slug: 'debt-payoff-calculator',
  seoTitle: 'Debt Payoff Calculator — How Long to Clear a Balance',
  seoDescription:
    'Free debt payoff calculator. Enter a balance, interest rate and monthly payment to estimate how long it takes to clear and how much interest it costs.',
  intro: {
    title: 'About paying off debt',
    lead: 'Estimate how long a balance takes to clear, and what the interest adds up to.',
    paragraphs: [
      'Each month, interest is added to the balance and your payment is taken off. Whatever is left carries forward. Only the part of your payment above the interest actually reduces the debt, which is why a payment barely above the interest takes so long to get anywhere.',
      'That also explains why increasing a payment slightly can shorten the term dramatically: every extra pound or dollar goes entirely against the principal.',
      'This is a mathematical estimate. It assumes a fixed rate, a fixed payment, and no new spending on the account. Real cards add fees, change rates, and charge interest daily rather than monthly, so treat the answer as a guide rather than a statement.',
    ],
  },
  howTo: {
    title: 'How to estimate a payoff',
    steps: [
      {
        title: 'Enter your current balance',
        description: 'What you owe today.',
      },
      {
        title: 'Enter the annual interest rate',
        description:
          'The APR on the account. Credit cards commonly sit between 18% and 30%.',
      },
      {
        title: 'Enter your monthly payment',
        description:
          'What you pay each month. It must exceed the monthly interest, or the balance never falls.',
      },
      {
        title: 'Try a larger payment',
        description:
          'Increase it and watch the term and total interest drop — usually by far more than the increase itself.',
      },
    ],
  },
  formulasTitle: 'How the calculation works',
  formulas: [
    {
      name: 'Monthly interest',
      expression: 'balance × (annual rate ÷ 12 ÷ 100)',
      description: '5,000 at 18% is charged 75 in interest in the first month.',
    },
    {
      name: 'Each month',
      expression: 'new balance = balance + interest − payment',
      description:
        'The calculator steps through month by month, trimming the final payment to whatever is left, so the totals are exact rather than estimated.',
    },
    {
      name: 'The minimum viable payment',
      expression: 'payment must exceed the monthly interest',
      description:
        'At or below it, the balance never falls. On 5,000 at 18%, anything up to 75 a month makes no progress at all.',
    },
    {
      name: 'Total interest',
      expression: 'total paid − original balance',
      description: 'Everything above the debt itself went to interest.',
    },
  ],
  examples: [
    {
      title: 'A credit card balance',
      description: '5,000 at 18% with 200 a month.',
      inputs: [
        { label: 'Balance', value: '5000' },
        { label: 'Rate', value: '18%' },
        { label: 'Monthly payment', value: '200' },
      ],
      result: 'About 32 months, with roughly 1,300 of interest.',
    },
    {
      title: 'The same debt, paid harder',
      description: 'Raising the payment to 400 a month.',
      inputs: [
        { label: 'Monthly payment', value: '400' },
      ],
      result: 'Around 14 months and far less interest — the term more than halves.',
    },
    {
      title: 'An interest-free balance',
      description: '1,200 on a 0% offer with 100 a month.',
      inputs: [
        { label: 'Balance', value: '1200' },
        { label: 'Rate', value: '0%' },
        { label: 'Monthly payment', value: '100' },
      ],
      result: 'Exactly 12 months, no interest.',
    },
  ],
  faqs: [
    {
      question: 'Why is my payment rejected as too low?',
      answer:
        'Because it does not cover the interest charged each month, so the balance would grow rather than shrink. On 5,000 at 18%, the first month alone adds 75 — a payment of 75 or less never makes progress.',
    },
    {
      question: 'Why does a small increase help so much?',
      answer:
        'Interest takes the same slice each month regardless. Everything above that goes straight against the principal, so raising a payment from 100 to 150 can more than double the amount actually clearing the debt.',
    },
    {
      question: 'Does this account for fees or new spending?',
      answer:
        'No. It assumes nothing else is added to the balance. Annual fees, late charges or continued spending all extend the payoff beyond what is shown here.',
    },
    {
      question: 'Why might my card issuer quote something different?',
      answer:
        'Most cards calculate interest daily and apply it monthly, and some allocate payments across balances at different rates. Those details shift the figure slightly. The shape of the answer is the same.',
    },
    {
      question: 'What about the minimum payment?',
      answer:
        'Card minimums are usually a small percentage of the balance, so they fall as the balance does — which stretches repayment over many years. Enter a fixed amount here to see what a steady payment achieves instead.',
    },
    {
      question: 'Is this financial advice?',
      answer:
        'No. It is arithmetic on the figures you enter. For help with debt you are struggling with, speak to a qualified adviser or a non-profit debt charity.',
    },
  ],
  tip: {
    title: 'Pay the highest rate first',
    body: 'With several debts, putting every spare pound against the highest-rate balance costs the least overall. Run each one here to see which is costing you most.',
  },
}
