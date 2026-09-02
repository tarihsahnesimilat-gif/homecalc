import type { CalculatorContent } from './types.ts'

export const timeZoneContent: CalculatorContent = {
  slug: 'time-zone-converter',
  seoTitle: 'Time Zone Converter — Convert Times Between World Cities',
  seoDescription:
    'Free time zone converter. Enter a date and time in one zone to see it in another, with daylight saving applied and date changes shown clearly.',
  intro: {
    title: 'About converting time zones',
    lead: 'Enter a date and time in one zone to see what it is in another.',
    paragraphs: [
      'Time zone conversion is not simply adding hours. Offsets change through the year as regions move on and off daylight saving, and they change on different dates in different places — so the gap between London and New York is five hours for most of the year but four for a couple of weeks each spring.',
      'That is why the date matters as much as the time. This converter takes both, works out the actual instant your wall-clock time refers to, and reports it in the target zone with the correct offset for that date.',
      'When a conversion crosses midnight, the resulting date is shown along with whether it moved forward or back a day — the detail most often missed when arranging a call across continents.',
    ],
  },
  howTo: {
    title: 'How to convert between time zones',
    steps: [
      {
        title: 'Enter the date and time',
        description:
          'The date matters: daylight saving means the same clock time converts differently in January and July.',
      },
      {
        title: 'Choose the source zone',
        description: 'The zone the time you entered belongs to.',
      },
      {
        title: 'Choose the target zone',
        description: 'Where you want to know the equivalent local time.',
      },
      {
        title: 'Check whether the date moved',
        description:
          'Conversions across many hours often land on the previous or next day, which is flagged in the result.',
      },
    ],
  },
  formulasTitle: 'How the conversion works',
  formulas: [
    {
      name: 'Find the instant',
      expression: 'wall-clock time + source zone offset → a moment in time',
      description:
        'A wall-clock time is meaningless without a zone. The first step is working out which actual instant it refers to.',
    },
    {
      name: 'Express it elsewhere',
      expression: 'instant → target zone local time',
      description:
        'The same instant is then formatted using the target zone offset for that date, which is what daylight saving affects.',
    },
    {
      name: 'Offsets are not fixed',
      expression: 'New York is UTC−5 in winter and UTC−4 in summer',
      description:
        'Regions switch on different dates, and some do not switch at all, which is why the date is required.',
    },
  ],
  examples: [
    {
      title: 'Winter, standard time',
      description: 'Midday UTC in January.',
      inputs: [
        { label: 'Date and time', value: '2024-01-15 12:00' },
        { label: 'From', value: 'UTC' },
        { label: 'To', value: 'New York' },
      ],
      result: '07:00 EST — five hours behind.',
    },
    {
      title: 'Summer, daylight time',
      description: 'The same clock time in July.',
      inputs: [
        { label: 'Date and time', value: '2024-07-15 12:00' },
        { label: 'From', value: 'UTC' },
        { label: 'To', value: 'New York' },
      ],
      result: '08:00 EDT — only four hours behind.',
    },
    {
      title: 'Crossing the date',
      description: 'A late evening call from New York to London.',
      inputs: [
        { label: 'Date and time', value: '2024-01-15 23:00' },
        { label: 'From', value: 'New York' },
        { label: 'To', value: 'London' },
      ],
      result: '04:00 on 16 January — the next day.',
    },
  ],
  faqs: [
    {
      question: 'Is daylight saving handled?',
      answer:
        'Yes. The conversion uses your browser or server’s own time zone data, which tracks when each region switches. That is why the date is required — the same clock time converts differently in winter and summer.',
    },
    {
      question: 'How accurate is this for historical dates?',
      answer:
        'It is as accurate as the time zone data the runtime ships, which covers recent decades well. Very old dates, or regions that changed their rules unusually, may not be exact — time zone history is genuinely messy.',
    },
    {
      question: 'What happens to times that daylight saving skips?',
      answer:
        'When clocks jump forward, an hour of wall-clock time does not exist. Entering a time inside that gap resolves to the nearest valid instant rather than producing an error.',
    },
    {
      question: 'Why does the date sometimes change?',
      answer:
        'Because zones can be most of a day apart. Tokyo is 17 hours ahead of Los Angeles, so an early Tokyo morning is the previous afternoon in California. The shift is shown so you do not have to work it out.',
    },
    {
      question: 'Why are only some cities listed?',
      answer:
        'There are hundreds of zone identifiers, and a dropdown containing all of them is unusable. This is a curated list covering the most commonly needed zones.',
    },
    {
      question: 'Why do some zones show odd offsets?',
      answer:
        'Not every zone is a whole number of hours from UTC. India is five and a half hours ahead, and a few places use 45-minute offsets. Those are handled correctly.',
    },
  ],
  tip: {
    title: 'Always convert with a date',
    body: 'A time zone difference quoted without a date is unreliable for anything near a clock change. The gap between two cities can differ by an hour for a few weeks each spring and autumn.',
  },
}
