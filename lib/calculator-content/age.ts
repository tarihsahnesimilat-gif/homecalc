import type { CalculatorContent } from './types.ts'

export const ageContent: CalculatorContent = {
  slug: 'age-calculator',
  seoTitle: 'Age Calculator — Exact Age in Years, Months and Days',
  seoDescription:
    'Free age calculator. Enter a date of birth to find an exact age in years, months and days, plus the total months, weeks and days lived.',
  intro: {
    title: 'About calculating age',
    lead: 'Find an exact age in years, months and days between a date of birth and any other date.',
    paragraphs: [
      'Age is counted the way people say it: whole years first, then whole months, then the days left over. You turn a year older on your birthday, not when a fixed number of days has passed.',
      'That is why age cannot be found by dividing days by 365. Months have different lengths and leap years add a day, so the arithmetic has to follow the calendar. This calculator counts whole months from your birth date and measures the remainder in real days.',
    ],
  },
  howTo: {
    title: 'How to calculate an exact age',
    steps: [
      {
        title: 'Enter the date of birth',
        description: 'Any past date. A date in the future is rejected, since nobody has been born yet.',
      },
      {
        title: 'Set the date to measure against',
        description:
          'This starts as today and can be changed to any later date — useful for working out how old someone will be at a particular event.',
      },
      {
        title: 'Read the exact age',
        description:
          'Years, months and days. The months are complete calendar months, so the day-of-month has to be reached before one counts.',
      },
      {
        title: 'Check the totals',
        description:
          'The same age is also shown as total months, total weeks and total days, which are easier to compare between people.',
      },
    ],
  },
  formulasTitle: 'How the calculation works',
  formulas: [
    {
      name: 'Whole years and months',
      expression: 'count complete calendar months from the birth date',
      description:
        'A month only counts once the day of the month is reached. From 15 June to 14 June the following year is 11 months, not 12.',
    },
    {
      name: 'Leftover days',
      expression: 'days from the anchor date to the target date',
      description:
        'The anchor is the birth date advanced by the whole years and months. Measuring from there gives the correct remainder whatever the month lengths.',
    },
    {
      name: 'Total days',
      expression: 'calendar days between the two dates',
      description:
        'Counted day by day through the calendar, so leap days are included automatically.',
    },
  ],
  examples: [
    {
      title: 'On a birthday',
      description: 'Born 15 June 1990, measured on 15 June 2024.',
      inputs: [
        { label: 'Date of birth', value: '1990-06-15' },
        { label: 'Target date', value: '2024-06-15' },
      ],
      result: 'Exactly 34 years, 0 months, 0 days.',
    },
    {
      title: 'The day before',
      description: 'The same person, one day earlier.',
      inputs: [
        { label: 'Date of birth', value: '1990-06-15' },
        { label: 'Target date', value: '2024-06-14' },
      ],
      result: '33 years, 11 months, 30 days — still 33.',
    },
    {
      title: 'A 29 February birthday',
      description: 'Born on a leap day, measured in a non-leap year.',
      inputs: [
        { label: 'Date of birth', value: '2000-02-29' },
        { label: 'Target date', value: '2023-02-28' },
      ],
      result: '22 years, 11 months, 30 days — 1 March is the first day of the new year of age.',
    },
  ],
  faqs: [
    {
      question: 'Why not just divide the number of days by 365?',
      answer:
        'Because years are not all 365 days. Leap years add a day, so dividing drifts by roughly a day every four years and gives the wrong age near a birthday.',
    },
    {
      question: 'How is a 29 February birthday handled?',
      answer:
        'In leap years the birthday falls on 29 February as normal. In other years the calculator treats 1 March as the first day of the new year of age, so 28 February still counts as the previous year.',
    },
    {
      question: 'Can I work out an age on a future date?',
      answer:
        'Yes. Change the target date to any date after the birth date. The date of birth itself cannot be in the future.',
    },
    {
      question: 'Will I get the same answer in a different timezone?',
      answer:
        'Yes. The calculation works on calendar dates rather than timestamps, so no offset or daylight-saving change can move the result by a day.',
    },
    {
      question: 'Why do the total months and the years-and-months disagree?',
      answer:
        'They do not — they are the same figure expressed differently. 34 years and 2 months is 410 total months; one is easier to say and the other easier to compare.',
    },
  ],
  tip: {
    title: 'Months are counted, not averaged',
    body: 'A month here means a real calendar month from the same day number, so a span crossing February behaves differently from one crossing July. That is what makes the answer match how people actually count age.',
  },
}
