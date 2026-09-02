import type { CalculatorContent } from './types.ts'

export const calorieContent: CalculatorContent = {
  slug: 'calorie-calculator',
  seoTitle: 'Calorie Calculator — Estimated Daily Energy Needs',
  seoDescription:
    'Free calorie calculator. Combines a Mifflin-St Jeor BMR estimate with an activity multiplier to estimate the calories your body uses in a day.',
  intro: {
    title: 'About daily calorie estimates',
    lead: 'Estimate the calories your body uses in a day, from your resting rate and how active you are.',
    paragraphs: [
      'Daily energy use starts with basal metabolic rate — what the body needs at complete rest — and adds everything else: moving around, working, exercising and digesting food. The total is often called total daily energy expenditure.',
      'This calculator estimates BMR with the Mifflin-St Jeor equation and multiplies it by a standard activity factor. Both parts are approximations fitted to population averages, and the activity factor in particular is a broad band rather than a precise measure of what you did today.',
      'Real energy needs vary between individuals with similar measurements, and they change from day to day. Treat the result as informational context, not a nutritional prescription or medical advice.',
    ],
  },
  howTo: {
    title: 'How to estimate daily calories',
    steps: [
      {
        title: 'Enter your measurements',
        description: 'Age, sex, height and weight, in metric or imperial units.',
      },
      {
        title: 'Choose an activity level',
        description:
          'Pick the band that best describes a typical week overall, including work and daily movement rather than exercise alone.',
      },
      {
        title: 'Read both figures',
        description:
          'The BMR is what the body uses at rest; the daily total applies the activity multiplier on top.',
      },
      {
        title: 'Treat it as a starting point',
        description:
          'If the estimate does not match your experience, your real activity level or metabolism likely sits between the bands.',
      },
    ],
  },
  formulasTitle: 'Calorie formulas',
  formulas: [
    {
      name: 'Total daily energy expenditure',
      expression: 'TDEE = BMR × activity multiplier',
      description: 'A BMR of 1,780 at a moderately active multiplier of 1.55 gives about 2,759 calories a day.',
    },
    {
      name: 'Basal metabolic rate',
      expression: '(10 × weight kg) + (6.25 × height cm) − (5 × age) + 5 male / − 161 female',
      description:
        'The Mifflin-St Jeor equation, the same calculation used by the BMR Calculator.',
    },
    {
      name: 'Activity multipliers',
      expression: 'sedentary 1.2 · lightly active 1.375 · moderately active 1.55 · very active 1.725 · extra active 1.9',
      description:
        'Widely used bands covering little movement through to hard physical work or training most days.',
    },
  ],
  examples: [
    {
      title: 'Moderately active',
      description: 'Male, 80 kg, 180 cm, 30 years, exercising a few times a week.',
      inputs: [
        { label: 'BMR', value: '1,780' },
        { label: 'Activity', value: 'Moderately active (1.55)' },
      ],
      result: 'About 2,759 calories a day.',
    },
    {
      title: 'Sedentary',
      description: 'The same person with a desk job and little exercise.',
      inputs: [
        { label: 'BMR', value: '1,780' },
        { label: 'Activity', value: 'Sedentary (1.2)' },
      ],
      result: 'About 2,136 calories a day.',
    },
    {
      title: 'Very active',
      description: 'The same person training most days.',
      inputs: [
        { label: 'BMR', value: '1,780' },
        { label: 'Activity', value: 'Very active (1.725)' },
      ],
      result: 'About 3,071 calories a day.',
    },
  ],
  faqs: [
    {
      question: 'How accurate is this estimate?',
      answer:
        'It combines two approximations, so the margin is wide. People with identical measurements can differ by several hundred calories a day because of body composition, genetics and how much they move without noticing.',
    },
    {
      question: 'Which activity level should I choose?',
      answer:
        'Think about a typical week as a whole, not your best day. Most people overestimate: a desk job with a few gym sessions usually sits at lightly or moderately active rather than very active.',
    },
    {
      question: 'How is this different from the BMR Calculator?',
      answer:
        'The BMR Calculator gives resting energy use only. This one takes the same BMR estimate and multiplies it by an activity factor to estimate the full day.',
    },
    {
      question: 'Should I use this to set a calorie target?',
      answer:
        'This tool provides an informational estimate, not a nutritional plan. Anyone changing what they eat for health reasons should speak to a qualified professional who can account for their circumstances.',
    },
    {
      question: 'Does it account for exercise on a specific day?',
      answer:
        'No. The multiplier describes an average week rather than individual sessions. A single hard workout is already included if it is part of your typical pattern.',
    },
  ],
  tip: {
    title: 'A band, not a number',
    body: 'Two estimates that differ by a few hundred calories describe roughly the same person. Use the figure as a starting range rather than a precise target.',
  },
}
