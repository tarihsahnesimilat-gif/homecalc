import type { CalculatorContent } from './types.ts'

export const workHoursContent: CalculatorContent = {
  slug: 'work-hours-calculator',
  seoTitle: 'Work Hours Calculator — Hours Worked After Breaks',
  seoDescription:
    'Free work hours calculator. Enter a shift start, end and break to see gross and net hours worked, with overnight shifts handled correctly.',
  intro: {
    title: 'About calculating hours worked',
    lead: 'Enter a shift start and end plus an unpaid break to see the hours actually worked.',
    paragraphs: [
      'Hours worked are the time between clocking in and clocking out, minus any unpaid break. The calculator shows both figures: the gross span on site, and the net time that is actually paid.',
      'Overnight shifts need no special handling. When the end time is earlier than the start, the shift is read as running into the next day, so 22:00 to 06:00 is eight hours rather than a negative number.',
      'The result is a timesheet aid rather than a payroll system. Overtime rules, rounding conventions and paid-break policies vary by employer and jurisdiction, and none of them are applied here.',
    ],
  },
  howTo: {
    title: 'How to calculate hours worked',
    steps: [
      { title: 'Enter the start time', description: 'When the shift began, on a 24-hour clock.' },
      {
        title: 'Enter the end time',
        description:
          'When it finished. An earlier time than the start is treated as an overnight shift.',
      },
      {
        title: 'Enter the break in minutes',
        description:
          'Unpaid break time only. Enter 0 if breaks are paid or none was taken.',
      },
      {
        title: 'Read gross and net',
        description:
          'Gross is clock-in to clock-out; net is what remains after the break, which is usually the payable figure.',
      },
    ],
  },
  formulasTitle: 'How the calculation works',
  formulas: [
    {
      name: 'Gross shift length',
      expression: 'end − start, plus 24 hours if the end is earlier',
      description:
        '22:00 to 06:00 gives a negative result, so a day is added: eight hours.',
    },
    {
      name: 'Net hours worked',
      expression: 'gross minutes − break minutes',
      description: 'An eight-hour shift with a 30-minute break is 7 hours 30 minutes worked.',
    },
    {
      name: 'Decimal hours for payroll',
      expression: 'net minutes ÷ 60',
      description: '450 minutes is 7.5 hours — the form most payroll systems expect.',
    },
  ],
  examples: [
    {
      title: 'A standard day',
      description: 'Nine to half past five with an hour for lunch.',
      inputs: [
        { label: 'Start', value: '09:00' },
        { label: 'End', value: '17:30' },
        { label: 'Break', value: '60 minutes' },
      ],
      result: 'Gross 8 h 30 m, net 7 h 30 m.',
    },
    {
      title: 'An overnight shift',
      description: 'Ten at night until six in the morning with a half-hour break.',
      inputs: [
        { label: 'Start', value: '22:00' },
        { label: 'End', value: '06:00' },
        { label: 'Break', value: '30 minutes' },
      ],
      result: 'Gross 8 h 0 m, net 7 h 30 m.',
    },
    {
      title: 'No unpaid break',
      description: 'A short shift where breaks are paid.',
      inputs: [
        { label: 'Start', value: '09:00' },
        { label: 'End', value: '13:00' },
        { label: 'Break', value: '0 minutes' },
      ],
      result: 'Gross and net both 4 hours.',
    },
  ],
  faqs: [
    {
      question: 'How are overnight shifts handled?',
      answer:
        'An end time earlier than the start is read as the next day, so 22:00 to 06:00 is eight hours. No date is needed, which keeps the result free of timezone effects.',
    },
    {
      question: 'Should I include paid breaks?',
      answer:
        'No. Enter only unpaid break time. Paid breaks are already part of the hours you are compensated for, so subtracting them would understate your pay.',
    },
    {
      question: 'What if my break is longer than the shift?',
      answer:
        'That is rejected, since it would give negative hours worked. Check whether the times were entered the right way round, or whether the break is in the units you meant.',
    },
    {
      question: 'How do I convert the result for payroll?',
      answer:
        'Divide the net minutes by 60. Seven hours thirty minutes is 7.5 hours, not 7.30 — a common and expensive typo on timesheets.',
    },
    {
      question: 'Does this handle overtime or rounding rules?',
      answer:
        'No. Overtime thresholds, rounding to the nearest quarter hour and premium rates are set by employers and local law. This gives the underlying hours those rules would be applied to.',
    },
    {
      question: 'Can I total a whole week?',
      answer:
        'Run each shift separately and add the net minutes, then divide by 60 at the end. Adding decimal hours along the way introduces rounding on every line.',
    },
  ],
  tip: {
    title: 'Add minutes, convert once',
    body: 'When totalling a week, keep everything in minutes and convert to decimal hours only at the very end. Rounding each shift first is what makes weekly totals drift.',
  },
}
