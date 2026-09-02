import type { CalculatorContent } from './types.ts'

export const hoursContent: CalculatorContent = {
  slug: 'hours-calculator',
  seoTitle: 'Hours Calculator — Add Up Multiple Time Entries',
  seoDescription:
    'Free hours calculator. Add up several start and end times into a weekly total, with decimal hours for payroll and optional pay from an hourly rate.',
  intro: {
    title: 'About totalling hours',
    lead: 'Add up several start and end times into one total.',
    paragraphs: [
      'A week of shifts, a set of billable sessions, a run of study blocks — all of them need the same thing: several spans added together without the arithmetic going wrong at the sixty-minute boundary.',
      'Each row is measured independently and rolls over midnight on its own, so an overnight shift sits happily in a list of day ones. Rows you leave blank are skipped rather than counted as zero.',
      'The total is given in hours and minutes and as a decimal, because payroll almost always wants the decimal — and converting 7 hours 30 minutes to 7.30 instead of 7.5 is the single most expensive typo on a timesheet.',
    ],
  },
  howTo: {
    title: 'How to total your hours',
    steps: [
      {
        title: 'Enter a start and end time for each entry',
        description:
          'One row per shift or session. An end time earlier than the start is treated as overnight.',
      },
      {
        title: 'Add or remove rows as needed',
        description: 'Blank rows are ignored, so there is no harm in leaving spares.',
      },
      {
        title: 'Add an hourly rate if you want pay',
        description: 'Optional. Leave it blank and only the hours are shown.',
      },
      {
        title: 'Use the decimal total for payroll',
        description:
          'Seven and a half hours is 7.5, not 7.30 — the decimal figure is given so you never have to convert it yourself.',
      },
    ],
  },
  formulasTitle: 'How the total is worked out',
  formulas: [
    {
      name: 'Each entry',
      expression: 'end − start, plus 24 hours if the end is earlier',
      description:
        '22:00 to 06:00 gives a negative result, so a day is added: eight hours.',
    },
    {
      name: 'The total',
      expression: 'the sum of every entry, in minutes',
      description:
        'Keeping everything in minutes until the end avoids rounding on each individual row.',
    },
    {
      name: 'Decimal hours',
      expression: 'total minutes ÷ 60',
      description: '930 minutes is 15.5 hours, not 15.30.',
    },
    {
      name: 'Pay',
      expression: 'decimal hours × hourly rate',
      description: '8.5 hours at 20 an hour is 170.00.',
    },
  ],
  examples: [
    {
      title: 'Three sessions in a day',
      description: 'A full day plus two shorter blocks.',
      inputs: [
        { label: 'Entry 1', value: '09:00 – 17:00' },
        { label: 'Entry 2', value: '09:00 – 12:30' },
        { label: 'Entry 3', value: '13:00 – 17:00' },
      ],
      result: '15 hours 30 minutes — 15.5 decimal hours.',
    },
    {
      title: 'A day shift and a night shift',
      description: 'One entry crosses midnight.',
      inputs: [
        { label: 'Entry 1', value: '09:00 – 17:00' },
        { label: 'Entry 2', value: '22:00 – 06:00' },
      ],
      result: '16 hours in total; the overnight row counts as eight.',
    },
    {
      title: 'With an hourly rate',
      description: 'A single shift, priced.',
      inputs: [
        { label: 'Entry 1', value: '09:00 – 17:30' },
        { label: 'Hourly rate', value: '20' },
      ],
      result: '8.5 hours — 170.00 of pay.',
    },
  ],
  faqs: [
    {
      question: 'How is this different from the Work Hours calculator?',
      answer:
        'Work Hours handles one shift and subtracts a break. This adds up as many entries as you like, which is the timesheet case. Use Work Hours for a single shift with an unpaid break, and this to total a week.',
    },
    {
      question: 'Do overnight entries work?',
      answer:
        'Yes. Any row whose end time is earlier than its start is treated as running into the next day, so 22:00 to 06:00 counts as eight hours. Rows are handled independently, so mixing day and night shifts is fine.',
    },
    {
      question: 'Why does payroll want decimal hours?',
      answer:
        'Because pay is hours multiplied by a rate, and minutes do not multiply cleanly. Seven hours thirty minutes is 7.5 hours. Writing 7.30 understates it by twelve minutes on every entry.',
    },
    {
      question: 'Can I subtract breaks?',
      answer:
        'Not within a row. Either enter the periods either side of the break as separate rows, or use the Work Hours calculator, which deducts a break from a single shift.',
    },
    {
      question: 'What if I leave a row half-filled?',
      answer:
        'That is reported rather than ignored, since a row with only a start time is almost always an oversight. Completely empty rows are skipped silently.',
    },
  ],
  tip: {
    title: 'Total in minutes, convert once',
    body: 'Rounding each entry to decimal hours before adding introduces error on every row. Add the minutes first and convert at the very end, which is what this does.',
  },
}
