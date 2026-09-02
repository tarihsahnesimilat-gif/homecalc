import type { CalculatorContent } from './types.ts'

export const calorieDeficitContent: CalculatorContent = {
  slug: 'calorie-deficit-calculator',
  seoTitle: 'Calorie Deficit Calculator — Daily Target and Weekly Projection',
  seoDescription:
    'Free calorie deficit calculator. Turn a daily deficit into a target intake and an estimated weekly change, using the standard rule-of-thumb constants.',
  intro: {
    title: 'About calorie deficits',
    lead: 'Turn a daily deficit into a target intake and an estimated weekly change.',
    paragraphs: [
      'A calorie deficit means eating less energy than you use. The arithmetic is simple: subtract the deficit from your maintenance level to get a daily target, and multiply by seven for the weekly figure.',
      'Turning that into weight uses a rule of thumb — roughly 7,700 calories per kilogram, or 3,500 per pound, of body fat. Those constants are approximations. Real change also involves water, glycogen and lean tissue, and the body adapts as intake falls, so actual results are lumpier and usually slower than the arithmetic suggests.',
      'This is an informational estimate, not a diet plan or medical guidance. Energy needs vary between people with identical measurements, and anyone with a health condition, or considering a substantial change to what they eat, should speak to a qualified professional.',
    ],
  },
  howTo: {
    title: 'How to use a calorie deficit',
    steps: [
      {
        title: 'Find your maintenance calories',
        description:
          'What you use in a typical day. The Calorie Calculator estimates it from your measurements and activity level.',
      },
      {
        title: 'Choose a daily deficit',
        description:
          'A deficit of 300 to 500 a day is commonly described as moderate. Larger deficits are harder to sustain.',
      },
      {
        title: 'Read the target and the projection',
        description:
          'Your daily intake target, the weekly deficit it produces, and the change that implies on the standard constants.',
      },
      {
        title: 'Treat it as a starting point',
        description:
          'If your actual results differ, your real maintenance level is probably not what the estimate suggested.',
      },
    ],
  },
  formulasTitle: 'The arithmetic',
  formulas: [
    {
      name: 'Daily target intake',
      expression: 'maintenance calories − daily deficit',
      description: 'A maintenance of 2,500 with a 500 deficit gives a 2,000 target.',
    },
    {
      name: 'Weekly deficit',
      expression: 'daily deficit × 7',
      description: '500 a day is 3,500 across a week.',
    },
    {
      name: 'Projected weight change',
      expression: 'weekly deficit ÷ 7,700 per kg, or ÷ 3,500 per lb',
      description:
        'A 3,500 weekly deficit projects to about 1 lb, or 0.45 kg. These constants are approximations, not physical laws.',
    },
  ],
  examples: [
    {
      title: 'A moderate deficit',
      description: 'Maintenance of 2,500 with 500 a day removed.',
      inputs: [
        { label: 'Maintenance', value: '2500' },
        { label: 'Daily deficit', value: '500' },
      ],
      result: 'Target 2,000 a day; about 0.45 kg (1 lb) a week.',
    },
    {
      title: 'A gentler approach',
      description: 'A smaller deficit, easier to sustain.',
      inputs: [
        { label: 'Maintenance', value: '2200' },
        { label: 'Daily deficit', value: '250' },
      ],
      result: 'Target 1,950 a day; about 0.23 kg (0.5 lb) a week.',
    },
    {
      title: 'Maintaining',
      description: 'No deficit at all.',
      inputs: [
        { label: 'Maintenance', value: '2200' },
        { label: 'Daily deficit', value: '0' },
      ],
      result: 'Target 2,200 — no projected change.',
    },
  ],
  faqs: [
    {
      question: 'How accurate is the weekly projection?',
      answer:
        'It is a rule of thumb built on a rule of thumb. Your maintenance figure is itself an estimate, and the calories-per-kilogram constant is an approximation. Expect real results to be uneven week to week and often slower than projected.',
    },
    {
      question: 'Why does weight not fall as predicted?',
      answer:
        'Day-to-day weight moves with water, food volume and glycogen, which can easily mask a real change. Metabolism also adapts as intake falls. Trends over several weeks are far more informative than any single weigh-in.',
    },
    {
      question: 'What size deficit is reasonable?',
      answer:
        'Moderate deficits are generally described as more sustainable than aggressive ones, but the right figure depends on the individual. This is a question for a qualified professional rather than a calculator.',
    },
    {
      question: 'Why is a very low target flagged?',
      answer:
        'Because intakes below roughly 1,200 calories a day are widely considered low enough to warrant professional supervision. The calculator flags it as information — it does not make a recommendation either way.',
    },
    {
      question: 'Where do I get my maintenance number?',
      answer:
        'The Calorie Calculator estimates it from your age, sex, height, weight and activity level. If you have tracked your intake at a stable weight, your own average is likely to be more accurate than any formula.',
    },
    {
      question: 'Is this medical or nutritional advice?',
      answer:
        'No. It is arithmetic on the figures you enter, provided for information. Decisions about diet and health should involve a qualified professional who knows your circumstances.',
    },
  ],
  tip: {
    title: 'The maintenance figure drives everything',
    body: 'Every number here depends on a maintenance estimate that could easily be a few hundred calories out. Treat the projection as a direction rather than a schedule.',
  },
}
