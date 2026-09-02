import type { CalculatorContent } from './types.ts'

export const paceContent: CalculatorContent = {
  slug: 'pace-calculator',
  seoTitle: 'Pace Calculator — Running Pace per Mile or Kilometre',
  seoDescription:
    'Free pace calculator. Enter a distance and a time to find your pace per kilometre or mile, written the way runners use it, plus your average speed.',
  intro: {
    title: 'About pace',
    lead: 'Enter a distance and a time to find your pace per kilometre or mile.',
    paragraphs: [
      'Pace is time per unit of distance — five minutes per kilometre, say — and it is how runners think, because it is what you can hold in your head and check against a watch mid-run.',
      'Speed is the same information inverted: distance per unit of time. Treadmills, bikes and road signs use it. Both are shown, since converting between them mentally is awkward and rarely worth the effort.',
      'Pace is written as minutes and seconds, so 5:30 means five minutes thirty seconds per unit — not five and a half in decimal, which would be 5:18.',
    ],
  },
  howTo: {
    title: 'How to calculate pace',
    steps: [
      {
        title: 'Choose kilometres or miles',
        description: 'The pace and speed are both reported in whichever you pick.',
      },
      {
        title: 'Enter the distance',
        description: 'Decimals are fine — a marathon is 42.195 km or 26.219 miles.',
      },
      {
        title: 'Enter the time',
        description:
          'Hours, minutes and seconds. Leave any of them blank and they count as zero.',
      },
      {
        title: 'Read the pace and speed',
        description:
          'Pace in minutes and seconds per unit, and average speed in units per hour.',
      },
    ],
  },
  formulasTitle: 'Pace formulas',
  formulas: [
    {
      name: 'Pace',
      expression: 'total time ÷ distance',
      description: '25 minutes over 5 km is 5 minutes per kilometre — written 5:00.',
    },
    {
      name: 'Speed',
      expression: 'distance ÷ time in hours',
      description: '5 km in 25 minutes is 12 km/h.',
    },
    {
      name: 'Converting between them',
      expression: 'speed = 60 ÷ pace in minutes',
      description:
        'A 5:00 pace is 60 ÷ 5 = 12 km/h. A 6:00 pace is 10 km/h.',
    },
    {
      name: 'Estimating a race time',
      expression: 'pace × race distance',
      description:
        'A 5:41 per km pace over 42.195 km is roughly a four-hour marathon.',
    },
  ],
  examples: [
    {
      title: 'A 5 km run',
      description: 'Five kilometres in twenty-five minutes.',
      inputs: [
        { label: 'Distance', value: '5 km' },
        { label: 'Time', value: '25:00' },
      ],
      result: '5:00 per km, or 12 km/h.',
    },
    {
      title: 'A four-hour marathon',
      description: '42.195 km in exactly four hours.',
      inputs: [
        { label: 'Distance', value: '42.195 km' },
        { label: 'Time', value: '4:00:00' },
      ],
      result: '5:41 per km.',
    },
    {
      title: 'A ten-mile training run',
      description: 'Working in miles instead.',
      inputs: [
        { label: 'Distance', value: '10 mi' },
        { label: 'Time', value: '1:25:00' },
      ],
      result: '8:30 per mile.',
    },
  ],
  faqs: [
    {
      question: 'What is the difference between pace and speed?',
      answer:
        'They are inverses. Pace is time per distance, so lower is faster. Speed is distance per time, so higher is faster. A 5:00 per km pace and 12 km/h describe the same run.',
    },
    {
      question: 'Why is pace written as 5:30 rather than 5.5?',
      answer:
        'Because the second part is seconds, not a decimal fraction. 5:30 is five minutes thirty seconds; 5.5 minutes would be written 5:30 too, but 5.3 minutes is 5:18. Reading pace as a decimal is a common source of error.',
    },
    {
      question: 'How do I convert between pace per km and per mile?',
      answer:
        'A mile is about 1.609 km, so a per-mile pace is roughly 1.609 times the per-km pace. A 5:00 per km pace is about 8:03 per mile. Switching the unit here does it exactly.',
    },
    {
      question: 'Can I use this to predict a race time?',
      answer:
        'For a rough target, multiply your pace by the race distance. Bear in mind that pace usually slows over longer distances, so a 5 km pace held across a marathon is optimistic.',
    },
    {
      question: 'Does this account for hills or conditions?',
      answer:
        'No. It divides the time you ran by the distance you covered. Terrain, wind, heat and altitude all affect the effort behind a given pace but not the arithmetic.',
    },
  ],
  tip: {
    title: 'Lower pace, higher speed',
    body: 'Getting faster means your pace number goes down and your speed number goes up. Mixing the two up is the quickest way to misread your own training log.',
  },
}
