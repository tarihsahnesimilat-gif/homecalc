import type { CalculatorContent } from './types.ts'

export const timeDurationContent: CalculatorContent = {
  slug: 'time-duration-calculator',
  seoTitle: 'Time Duration Calculator — Hours Between Two Times',
  seoDescription:
    'Free time duration calculator. Enter a start and end time to see the elapsed hours and minutes, with times crossing midnight handled correctly.',
  intro: {
    title: 'About elapsed time',
    lead: 'Enter two clock times to see how much time passed between them.',
    paragraphs: [
      'Subtracting clock times by hand is awkward because they are not decimal. From 09:45 to 14:20 is four hours and thirty-five minutes, not 4.75 — the minutes roll over at 60, not 100.',
      'Times crossing midnight are handled automatically. When the end time is earlier than the start, the calculator assumes the span rolls into the next day, so 23:00 to 01:30 is two and a half hours rather than a negative number.',
      'The calculation works on wall-clock times, not dates, so it never depends on your timezone. For spans covering more than a day, the Date Difference calculator is the right tool.',
    ],
  },
  howTo: {
    title: 'How to calculate elapsed time',
    steps: [
      { title: 'Enter the start time', description: 'On a 24-hour clock, such as 09:00 or 23:15.' },
      {
        title: 'Enter the end time',
        description:
          'If it is earlier than the start, the span is treated as crossing midnight into the next day.',
      },
      {
        title: 'Read the duration',
        description:
          'Shown as hours and minutes, with the total in minutes for timesheets and billing.',
      },
    ],
  },
  formulasTitle: 'How the calculation works',
  formulas: [
    {
      name: 'Convert to minutes',
      expression: '(hours × 60) + minutes',
      description:
        'Both times become minutes past midnight — 09:30 is 570 — which makes subtraction straightforward.',
    },
    {
      name: 'Subtract, rolling over midnight',
      expression: 'end − start, plus 1440 if the result is negative',
      description:
        '23:00 is 1380 and 01:30 is 90. 90 − 1380 is −1290, and adding a day of 1440 minutes gives 150, or 2 hours 30 minutes.',
    },
    {
      name: 'Back to hours and minutes',
      expression: 'hours = total ÷ 60 rounded down, minutes = the remainder',
      description: '150 minutes is 2 hours with 30 left over.',
    },
  ],
  examples: [
    {
      title: 'A working day',
      description: 'Nine in the morning until five in the afternoon.',
      inputs: [
        { label: 'Start time', value: '09:00' },
        { label: 'End time', value: '17:00' },
      ],
      result: '8 hours 0 minutes — 480 minutes.',
    },
    {
      title: 'Crossing midnight',
      description: 'An evening that runs into the small hours.',
      inputs: [
        { label: 'Start time', value: '23:00' },
        { label: 'End time', value: '01:30' },
      ],
      result: '2 hours 30 minutes — 150 minutes.',
    },
    {
      title: 'A short gap',
      description: 'Minute-level spans work the same way.',
      inputs: [
        { label: 'Start time', value: '10:15' },
        { label: 'End time', value: '10:45' },
      ],
      result: '0 hours 30 minutes.',
    },
  ],
  faqs: [
    {
      question: 'How are times crossing midnight handled?',
      answer:
        'When the end time is earlier than the start, a full day is added, so the span is read as continuing into the next day. That makes 22:00 to 02:00 four hours rather than minus twenty.',
    },
    {
      question: 'What if I enter the same time twice?',
      answer:
        'The result is zero, not twenty-four hours. Entering one time twice means no time has passed; for a full day, use 00:00 to 00:00 on consecutive dates with the Date Difference calculator.',
    },
    {
      question: 'Why is the total in minutes useful?',
      answer:
        'Timesheets, billing and pay are often calculated per minute or converted to decimal hours. The total minutes divided by 60 gives the decimal figure — 150 minutes is 2.5 hours.',
    },
    {
      question: 'Can I measure a span longer than 24 hours?',
      answer:
        'Not here — clock times carry no date, so anything past a day is ambiguous. Use the Date Difference or Days Between Dates calculators for longer spans.',
    },
    {
      question: 'Does daylight saving affect the result?',
      answer:
        'No. The calculation is pure arithmetic on the times you type and never consults a timezone or a calendar. On a real clock-change day the actual elapsed time can differ by an hour.',
    },
  ],
  tip: {
    title: 'Divide the minutes for decimal hours',
    body: 'Payroll usually wants decimal hours. Take the total minutes and divide by 60: 450 minutes is 7.5 hours, not 7.30.',
  },
}
