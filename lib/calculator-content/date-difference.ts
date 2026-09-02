import type { CalculatorContent } from './types.ts'

export const dateDifferenceContent: CalculatorContent = {
  slug: 'date-difference-calculator',
  seoTitle: 'Date Difference Calculator — Years, Months and Days Between Dates',
  seoDescription:
    'Free date difference calculator. Enter two dates to see the gap in years, months and days, plus the total days, weeks and an inclusive day count.',
  intro: {
    title: 'About measuring between dates',
    lead: 'Enter two dates to see the gap in years, months and days, along with the total in days.',
    paragraphs: [
      'Counting is exclusive: the result is the distance from one date to the other, so 1 January to 2 January is one day. This is the usual convention when you ask how far apart two dates are.',
      'An inclusive total is shown alongside it, counting both endpoints. That is the figure you want when counting how many days something covers — a booking from 1 to 2 January occupies two days even though the gap is one.',
      'All arithmetic follows the calendar, so leap days and differing month lengths are handled automatically, and the answer does not depend on your timezone.',
    ],
  },
  howTo: {
    title: 'How to measure between two dates',
    steps: [
      { title: 'Enter the start date', description: 'Any calendar date.' },
      {
        title: 'Enter the end date',
        description:
          'It may be earlier than the start date — the calculator measures the gap and tells you the dates were reversed rather than refusing.',
      },
      {
        title: 'Read the breakdown',
        description:
          'Years, months and days show the gap as people describe it; the totals show the same gap as a single number.',
      },
      {
        title: 'Pick the right total',
        description:
          'Use the total days for the gap between dates, and the inclusive count when both endpoints are part of what you are counting.',
      },
    ],
  },
  formulasTitle: 'How the calculation works',
  formulas: [
    {
      name: 'Total days (exclusive)',
      expression: 'calendar days from the earlier date to the later date',
      description: '1 January to 2 January is 1. Leap days are counted as they occur.',
    },
    {
      name: 'Inclusive days',
      expression: 'total days + 1',
      description: 'Counts both endpoints, for when the dates themselves are part of the span.',
    },
    {
      name: 'Years, months and days',
      expression: 'whole calendar months, then the remaining days',
      description:
        'Months are counted from the same day number, so the breakdown matches how the gap would be described out loud.',
    },
  ],
  examples: [
    {
      title: 'Consecutive days',
      description: 'The smallest non-zero gap.',
      inputs: [
        { label: 'Start date', value: '2024-03-10' },
        { label: 'End date', value: '2024-03-11' },
      ],
      result: '1 day exclusive, 2 days inclusive.',
    },
    {
      title: 'Across a leap year',
      description: 'A full year that contains 29 February.',
      inputs: [
        { label: 'Start date', value: '2024-01-01' },
        { label: 'End date', value: '2025-01-01' },
      ],
      result: '1 year, 0 months, 0 days — 366 total days.',
    },
    {
      title: 'Reversed dates',
      description: 'The later date entered first.',
      inputs: [
        { label: 'Start date', value: '2024-03-01' },
        { label: 'End date', value: '2024-01-01' },
      ],
      result: 'The same gap as the forward order, flagged as reversed.',
    },
  ],
  faqs: [
    {
      question: 'Is the count inclusive or exclusive?',
      answer:
        'The main total is exclusive: it measures the gap between the dates, so 1 to 2 January is one day. An inclusive count, which adds the starting day back, is shown next to it.',
    },
    {
      question: 'What happens if I enter the dates the wrong way round?',
      answer:
        'The calculator measures the gap and notes that the dates were reversed. The size of the answer is the same either way — only the direction differs.',
    },
    {
      question: 'How are leap years handled?',
      answer:
        'Automatically. Days are counted through the real calendar, so a span containing 29 February includes it. 2024 to 2025 is 366 days; 2023 to 2024 is 365.',
    },
    {
      question: 'Why can the months look uneven?',
      answer:
        'Because calendar months are uneven. A month from 31 January lands on 28 or 29 February, so the leftover days depend on which months the span crosses.',
    },
    {
      question: 'How is this different from the Days Between Dates calculator?',
      answer:
        'They share the same calendar arithmetic. This page leads with the years, months and days breakdown; the other leads with a single day count and its weeks equivalent.',
    },
  ],
  tip: {
    title: 'Decide which total you need',
    body: 'For a deadline or a gap, use the exclusive total. For how many days something covers — a stay, a trip, a rental — use the inclusive count.',
  },
}
