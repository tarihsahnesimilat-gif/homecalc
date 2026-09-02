import type { CalculatorContent } from './types.ts'

export const currencyContent: CalculatorContent = {
  slug: 'currency-converter',
  seoTitle: 'Currency Converter — Convert Using Your Own Exchange Rate',
  seoDescription:
    'Free currency converter. Enter an amount and the exchange rate from a source you trust to convert between currencies. No stored or live rates are used.',
  intro: {
    title: 'About converting currency',
    lead: 'Convert an amount between currencies using an exchange rate you supply.',
    paragraphs: [
      'This converter does not fetch live rates, and it does not store any. That is a deliberate choice rather than a limitation to work around. Exchange rates move constantly, and a rate baked into a static page would be wrong within hours while still looking authoritative — which is worse than no rate at all.',
      'Instead, you supply the rate from a source you trust: your bank, your card provider, or a live market quote. The calculator does the arithmetic and shows the inverse rate so you can sanity-check the direction.',
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
          'These are labels for the result. Picking the same currency twice converts at 1:1.',
      },
      {
        title: 'Enter the exchange rate',
        description:
          'How much of the target currency one unit of the source buys. If 1 USD buys 0.92 EUR, enter 0.92.',
      },
      {
        title: 'Check the inverse',
        description:
          'The inverse rate is shown alongside. If it looks wrong, the rate is probably the wrong way round.',
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
      description: 'Converting 100 USD at a rate of 0.92.',
      inputs: [
        { label: 'Amount', value: '100' },
        { label: 'From', value: 'USD' },
        { label: 'To', value: 'EUR' },
        { label: 'Rate', value: '0.92' },
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
      result: '100.00 — converted at 1:1 whatever rate is entered.',
    },
    {
      title: 'A large rate',
      description: 'Currencies with very different unit values.',
      inputs: [
        { label: 'Amount', value: '50' },
        { label: 'From', value: 'GBP' },
        { label: 'To', value: 'JPY' },
        { label: 'Rate', value: '188.45' },
      ],
      result: '9,422.50 JPY.',
    },
  ],
  faqs: [
    {
      question: 'Why does this not fetch live exchange rates?',
      answer:
        'Because a static page cannot keep them current, and a stale rate presented as live is misleading. Rates move continuously, so the honest design is to let you supply one from a source you trust and can check.',
    },
    {
      question: 'Where should I get a rate?',
      answer:
        'For a rough figure, any major search engine or financial site gives the current mid-market rate. For what you will actually pay, check your own bank or card provider, since their rate includes a margin.',
    },
    {
      question: 'Why is the rate I get worse than the one I looked up?',
      answer:
        'Published rates are usually mid-market — the midpoint between buying and selling. Retail providers add a margin, often 1% to 4%, and may add a fixed fee as well. Cash exchange at an airport is typically worse still.',
    },
    {
      question: 'Which way round should the rate go?',
      answer:
        'Enter how much of the target currency one unit of the source buys. Converting USD to EUR at 0.92 means one dollar buys 0.92 euros. The inverse shown beneath is the quickest way to confirm you have it the right way round.',
    },
    {
      question: 'Are any rates stored in this site?',
      answer:
        'None. The currency list holds codes and names only. Nothing about exchange rates is stored, cached or fetched anywhere in the project.',
    },
  ],
  tip: {
    title: 'Check the inverse before you trust the answer',
    body: 'An inverted rate is the most common mistake in currency conversion, and it produces an answer that looks perfectly reasonable. The inverse shown beneath the result catches it in a second.',
  },
}
