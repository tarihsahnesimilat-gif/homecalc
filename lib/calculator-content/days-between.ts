import type { CalculatorContent } from './types.ts'

export const daysBetweenContent: CalculatorContent = {
  slug: 'days-between-dates-calculator',
  seoTitle: 'Days Between Dates Calculator — Count Days, Weeks and Days',
  seoDescription:
    'Free days between dates calculator. Enter two dates to count the days between them, shown as a total and broken into weeks and remaining days.',
  intro: {
    title: 'About counting days',
    lead: 'Count the days between two dates, as a single total and as whole weeks plus days.',
    paragraphs: [
      'Counting is exclusive: the result is the number of days from one date to the other, so 1 January to 2 January is one day. An inclusive count that includes both endpoints is shown alongside it.',
      'Days are counted through the real calendar rather than estimated, so leap days and differing month lengths are handled without any adjustment, and the answer is the same whatever timezone you are in.',
    ],
  },
  howTo: {
    title: 'How to count days between dates',
    steps: [
      { title: 'Enter the start date', description: 'Any calendar date.' },
      {
        title: 'Enter the end date',
        description: 'Entering it earlier than the start date is fine — the count is the same and is flagged as reversed.',
      },
      {
        title: 'Read the total',
        description:
          'The headline figure is the exclusive day count, with the same span broken into weeks and remaining days.',
      },
      {
        title: 'Use the inclusive count when it fits',
        description:
          'For anything where both dates are part of the span — a trip, a stay, a booking — the inclusive figure is the one you want.',
      },
    ],
  },
  formulasTitle: 'How the calculation works',
  formulas: [
    {
      name: 'Days between (exclusive)',
      expression: 'calendar days from the earlier date to the later date',
      description: '5 May to 12 May is 7 days.',
    },
    {
      name: 'Weeks and remaining days',
      expression: 'total ÷ 7, with the remainder as days',
      description: '17 days is 2 weeks and 3 days.',
    },
    {
      name: 'Inclusive days',
      expression: 'total days + 1',
      description: 'Counts both endpoints, for spans where the dates themselves are included.',
    },
  ],
  examples: [
    {
      title: 'Exactly one week',
      description: 'Two dates seven days apart.',
      inputs: [
        { label: 'Start date', value: '2024-05-05' },
        { label: 'End date', value: '2024-05-12' },
      ],
      result: '7 days — 1 week and 0 days, or 8 days inclusive.',
    },
    {
      title: 'February in a leap year',
      description: 'A month that contains 29 February.',
      inputs: [
        { label: 'Start date', value: '2024-02-01' },
        { label: 'End date', value: '2024-03-01' },
      ],
      result: '29 days, against 28 in a non-leap year.',
    },
    {
      title: 'The same date twice',
      description: 'No gap at all.',
      inputs: [
        { label: 'Start date', value: '2024-05-05' },
        { label: 'End date', value: '2024-05-05' },
      ],
      result: '0 days exclusive, 1 day inclusive.',
    },
  ],
  faqs: [
    {
      question: 'Does the count include both dates?',
      answer:
        'The main total does not — it is the gap between them, so 1 to 2 January is one day. The inclusive figure shown next to it adds the starting day back, giving two.',
    },
    {
      question: 'How many days should I count for a trip?',
      answer:
        'Use the inclusive count for the number of days you are away, and the exclusive count for the number of nights. A trip from 1 to 5 January is five days and four nights.',
    },
    {
      question: 'What if the end date is before the start date?',
      answer:
        'The count is the same size and the result notes that the dates were reversed, so you do not have to re-enter them in order.',
    },
    {
      question: 'Are leap days included?',
      answer:
        'Yes. Days are counted through the calendar, so any 29 February inside the span is counted like any other day.',
    },
    {
      question: 'How does this differ from the Date Difference calculator?',
      answer:
        'Both use the same calendar arithmetic and agree exactly. This page leads with a single day count and its weeks equivalent; the other leads with a years, months and days breakdown.',
    },
  ],
  tip: {
    title: 'Days or nights?',
    body: 'The exclusive count is nights; the inclusive count is days. Choosing the wrong one is the most common source of an off-by-one when booking.',
  },
}
