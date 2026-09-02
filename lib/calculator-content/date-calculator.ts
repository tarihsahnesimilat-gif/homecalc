import type { CalculatorContent } from './types.ts'

export const dateCalculatorContent: CalculatorContent = {
  slug: 'date-calculator',
  seoTitle: 'Date Calculator — Add or Subtract Days From a Date',
  seoDescription:
    'Free date calculator. Add or subtract any number of days from a date to find the result, with the weekday shown and leap years handled correctly.',
  intro: {
    title: 'About adding and subtracting days',
    lead: 'Add or subtract days from a date to find where you land.',
    paragraphs: [
      'Counting days forward by hand is easy to get wrong. Months are different lengths, February changes between years, and a 90-day deadline crossing a year boundary is exactly the sort of thing that produces an off-by-one.',
      'This works in whole calendar days, so leap years and month lengths are handled by the arithmetic itself. The weekday of the result is shown too, which is usually what you actually want to know about a deadline.',
      'Because it works on calendar dates rather than timestamps, the answer never depends on your timezone.',
    ],
  },
  howTo: {
    title: 'How to calculate a date',
    steps: [
      {
        title: 'Enter the start date',
        description: 'Any calendar date, past or future.',
      },
      {
        title: 'Choose add or subtract',
        description:
          'Add to count forward, subtract to count back. Enter the number of days as a positive figure either way.',
      },
      {
        title: 'Enter the number of days',
        description: 'Whole days only. Zero simply returns the date you started on.',
      },
      {
        title: 'Read the result and its weekday',
        description:
          'The date is shown in ISO format, ready to paste into a calendar, along with the day of the week.',
      },
    ],
  },
  formulasTitle: 'How the calculation works',
  formulas: [
    {
      name: 'Convert to a day number',
      expression: 'days since 1 January 1970',
      description:
        'The date becomes a single integer, which turns date arithmetic into ordinary addition.',
    },
    {
      name: 'Add or subtract',
      expression: 'day number ± days',
      description: 'Adding 30 to a day number simply moves it 30 days along.',
    },
    {
      name: 'Convert back to a calendar date',
      expression: 'the inverse of the same conversion',
      description:
        'Month lengths, leap years and the century rules fall out of the conversion rather than needing special cases.',
    },
  ],
  examples: [
    {
      title: 'A 30-day deadline',
      description: 'Thirty days from the first of January.',
      inputs: [
        { label: 'Start date', value: '2024-01-01' },
        { label: 'Direction', value: 'Add' },
        { label: 'Days', value: '30' },
      ],
      result: '31 January 2024, a Wednesday.',
    },
    {
      title: 'Counting back across a leap day',
      description: 'Ten days before 10 March in a leap year.',
      inputs: [
        { label: 'Start date', value: '2024-03-10' },
        { label: 'Direction', value: 'Subtract' },
        { label: 'Days', value: '10' },
      ],
      result: '29 February 2024 — the leap day is counted.',
    },
    {
      title: 'Across a year boundary',
      description: 'Ten days before the fifth of January.',
      inputs: [
        { label: 'Start date', value: '2024-01-05' },
        { label: 'Direction', value: 'Subtract' },
        { label: 'Days', value: '10' },
      ],
      result: '26 December 2023.',
    },
  ],
  faqs: [
    {
      question: 'Are leap years handled?',
      answer:
        'Yes, including the century rule. 2024 is a leap year and 1900 was not, and both come out correctly because the calculation converts through a day number rather than assuming a year length.',
    },
    {
      question: 'Does it count only working days?',
      answer:
        'No. Every day counts, including weekends and public holidays. The weekday of the result is shown so you can adjust if a deadline lands on a Saturday.',
    },
    {
      question: 'How do I count months instead of days?',
      answer:
        'This works in days. For a span in months, the Date Difference calculator gives years, months and days between two dates, which is the more natural way to express it.',
    },
    {
      question: 'Why enter a positive number to subtract?',
      answer:
        'Because the direction is chosen separately, which is harder to misread than a minus sign. A negative day count is rejected rather than silently reversing your choice.',
    },
    {
      question: 'Will I get the same answer in a different timezone?',
      answer:
        'Yes. The calculation works on calendar dates rather than timestamps, so no offset or daylight-saving change can shift the result by a day.',
    },
  ],
  tip: {
    title: 'Check the weekday on deadlines',
    body: 'A date 90 days out is often a weekend. The weekday is shown alongside the result precisely so you can spot that before committing to it.',
  },
}
