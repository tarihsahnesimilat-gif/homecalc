import type { CalculatorContent } from './types'

export const averageContent: CalculatorContent = {
  slug: 'average-calculator',
  seoTitle: 'Average Calculator — Mean, Sum and Count of Any Numbers',
  seoDescription:
    'Free average calculator. Enter as many numbers as you need to find the mean, the sum, and how many values you entered. Empty rows are ignored automatically.',
  intro: {
    title: 'About averages',
    lead: 'Enter as many numbers as you need and get the mean, the total, and the count as you type.',
    paragraphs: [
      'The average — more precisely the arithmetic mean — is the sum of a set of numbers divided by how many there are. It answers the question "if these values were all the same, what would each one be?"',
      'The mean is the most familiar average, but it is not the only one, and it is not always the most representative. A single unusually large or small value pulls the mean towards it, which is worth remembering when you are averaging things like prices or response times.',
    ],
  },
  howTo: {
    title: 'How to calculate an average',
    steps: [
      {
        title: 'Enter your values',
        description:
          'Type one number per row. Decimals and negative numbers are both fine.',
      },
      {
        title: 'Add or remove rows',
        description:
          'Use "Add value" for more rows and the remove button on any row you no longer need. Results update as you type.',
      },
      {
        title: 'Leave blanks alone',
        description:
          'Empty rows are ignored rather than counted as zero, so a stray blank row will not drag your average down.',
      },
      {
        title: 'Read the summary',
        description:
          'You get the mean alongside the sum and the count, which makes it easy to check that the calculator used the values you expected.',
      },
    ],
  },
  formulasTitle: 'Average formulas',
  formulas: [
    {
      name: 'Arithmetic mean',
      expression: 'sum of all values ÷ number of values',
      description:
        'The standard average. For 10, 20 and 30: the sum is 60 and the count is 3, so the mean is 20.',
    },
    {
      name: 'Sum',
      expression: 'value₁ + value₂ + … + valueₙ',
      description: 'Every entered value added together. Blank rows contribute nothing.',
    },
    {
      name: 'Count',
      expression: 'number of non-empty values',
      description:
        'How many values went into the calculation. This is the divisor used for the mean.',
    },
  ],
  examples: [
    {
      title: 'Three values',
      description: 'A short list of round numbers.',
      inputs: [
        { label: 'Values', value: '10, 20, 30' },
      ],
      result: 'Sum 60, count 3, average 20.',
    },
    {
      title: 'Four values',
      description: 'Adding one more number changes both the count and the mean.',
      inputs: [
        { label: 'Values', value: '10, 20, 30, 40' },
      ],
      result: 'Sum 100, count 4, average 25.',
    },
    {
      title: 'Test scores',
      description: 'Five marks out of 100 across a term.',
      inputs: [
        { label: 'Values', value: '72, 88, 91, 64, 80' },
      ],
      result: 'Sum 395, count 5, average 79.',
    },
    {
      title: 'A value that skews the mean',
      description: 'Four similar numbers and one much larger one.',
      inputs: [
        { label: 'Values', value: '4, 5, 5, 6, 80' },
      ],
      result: 'Sum 100, count 5, average 20 — well above four of the five values.',
    },
  ],
  faqs: [
    {
      question: 'What is the difference between the mean, the median, and the mode?',
      answer:
        'The mean is the sum divided by the count. The median is the middle value once the numbers are sorted. The mode is the value that appears most often. This calculator works out the mean.',
    },
    {
      question: 'When is the mean a poor summary?',
      answer:
        'When a few extreme values sit far from the rest. In 4, 5, 5, 6, 80 the mean is 20, which is larger than four of the five numbers. The median of 5 describes that set better.',
    },
    {
      question: 'Do empty rows count as zero?',
      answer:
        'No. Blank rows are skipped entirely, so they change neither the sum nor the count. A zero you actually type is counted, because it is a real value.',
    },
    {
      question: 'Can I average negative numbers?',
      answer:
        'Yes. Negative values are added like any other, so a set containing them can produce a negative sum or mean.',
    },
    {
      question: 'How many values can I enter?',
      answer:
        'Add as many rows as you need. Everything runs in your browser, so nothing is sent anywhere and there is no practical limit for ordinary lists.',
    },
    {
      question: 'Why does the average show more decimal places than my inputs?',
      answer:
        'Dividing rarely produces a round result. Results are shown to four decimal places, which is enough precision for most uses without becoming unreadable.',
    },
  ],
  tip: {
    title: 'Check the count first',
    body: 'If an average looks wrong, look at the count before the arithmetic. A blank row you meant to fill in, or a duplicate you meant to delete, is the usual explanation.',
  },
}
