import type { CalculatorContent } from './types.ts'

export const currencyContent: CalculatorContent = {
  slug: 'currency-converter',
  seoTitle: 'Currency Converter — Latest Published Rates',
  seoDescription:
    'Free currency converter using the latest published European Central Bank rates from Frankfurter. Shows the rate, the date it was set, and why bank rates differ.',
  intro: {
    title: 'About converting currency',
    lead: 'Convert an amount between currencies at the latest published exchange rate.',
    paragraphs: [
      'Rates come from Frankfurter, a free service that publishes the European Central Bank reference rates. Pick a pair and the rate for it is fetched and applied, with both the rate and the date it was published shown under the result.',
      'Those reference rates are set once per working day rather than continuously, so this is the latest available figure rather than a live market quote. On a quiet day the difference is small; around news or over a weekend it can be larger, which is why the date is on the page rather than hidden behind it.',
      'Bear in mind that the rate you actually receive is rarely the mid-market rate. Banks and card providers add a margin, and may charge a separate fee on top, so budget a little above whatever this shows.',
    ],
  },
  howTo: {
    title: 'How to convert a currency',
    steps: [
      {
        title: 'Enter the amount',
        description: 'How much you want to convert.',
      },
      {
        title: 'Choose the two currencies',
        description:
          'The rate for that pair is looked up as soon as you pick it. Selecting the same currency twice converts at 1:1 with no lookup at all.',
      },
      {
        title: 'Check the rate and its date',
        description:
          'Both sit under the result. The date tells you which daily publication the figure came from, which matters most over weekends and holidays.',
      },
      {
        title: 'Check the inverse',
        description:
          'The inverse rate is shown alongside. If it looks wrong, the pair is probably the wrong way round.',
      },
    ],
  },
  formulasTitle: 'How conversion works',
  formulas: [
    {
      name: 'Converted amount',
      expression: 'amount × exchange rate',
      description: '100 USD at a rate of 0.92 gives 92 EUR.',
    },
    {
      name: 'The inverse rate',
      expression: '1 ÷ exchange rate',
      description:
        'A rate of 0.92 USD to EUR means roughly 1.087 EUR to USD. Checking this catches an inverted rate immediately.',
    },
    {
      name: 'The rate you actually get',
      expression: 'mid-market rate ± the provider margin',
      description:
        'Published rates are usually mid-market. Retail conversion typically costs a percentage above that, plus any fixed fee.',
    },
  ],
  examples: [
    {
      title: 'Dollars to euros',
      description: 'Converting 100 USD at a published rate of 0.92.',
      inputs: [
        { label: 'Amount', value: '100' },
        { label: 'From', value: 'USD' },
        { label: 'To', value: 'EUR' },
        { label: 'Rate applied', value: '0.92' },
      ],
      result: '92.00 EUR.',
    },
    {
      title: 'The same currency',
      description: 'Selecting one currency on both sides.',
      inputs: [
        { label: 'Amount', value: '100' },
        { label: 'From', value: 'USD' },
        { label: 'To', value: 'USD' },
      ],
      result: '100.00 — converted at 1:1, with no rate involved.',
    },
    {
      title: 'A large rate',
      description: 'Currencies with very different unit values.',
      inputs: [
        { label: 'Amount', value: '50' },
        { label: 'From', value: 'GBP' },
        { label: 'To', value: 'JPY' },
        { label: 'Rate applied', value: '188.45' },
      ],
      result: '9,422.50 JPY.',
    },
  ],
  faqs: [
    {
      question: 'Where do these exchange rates come from?',
      answer:
        'From Frankfurter, a free service built on the European Central Bank reference rates. The rate applied and the date it was published are both shown under the result, so how current the figure is stays visible.',
    },
    {
      question: 'Is this a live, real-time rate?',
      answer:
        'No. The reference rates are published once per working day, so this is the latest available figure rather than a market quote. Movement during the day, and over weekends and holidays, is not reflected in it.',
    },
    {
      question: 'Why is the rate I get worse than the one I looked up?',
      answer:
        'Published rates are usually mid-market — the midpoint between buying and selling. Retail providers add a margin, often 1% to 4%, and may add a fixed fee as well. Cash exchange at an airport is typically worse still.',
    },
    {
      question: 'Which way round is the rate applied?',
      answer:
        'It is how much of the target currency one unit of the source buys. Converting USD to EUR at 0.92 means one dollar buys 0.92 euros. The inverse shown beneath the result is the quickest way to confirm the direction.',
    },
    {
      question: 'What happens if the rate cannot be loaded?',
      answer:
        'The calculator says so and shows no result. It never falls back to a stored or estimated rate, because a plausible-looking figure from an unknown moment is worse than no figure at all.',
    },
  ],
  tip: {
    title: 'Check the inverse before you trust the answer',
    body: 'An inverted rate is the most common mistake in currency conversion, and it produces an answer that looks perfectly reasonable. The inverse shown beneath the result catches it in a second.',
  },
}
