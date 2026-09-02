import type { CalculatorContent } from './types.ts'

export const bmrContent: CalculatorContent = {
  slug: 'bmr-calculator',
  seoTitle: 'BMR Calculator — Basal Metabolic Rate Estimate',
  seoDescription:
    'Free BMR calculator using the Mifflin-St Jeor equation. Enter age, sex, height and weight to estimate the calories your body uses at complete rest.',
  intro: {
    title: 'About basal metabolic rate',
    lead: 'Estimate the energy your body uses at complete rest, using the Mifflin-St Jeor equation.',
    paragraphs: [
      'Basal metabolic rate is the energy needed to keep the body running while doing nothing at all — breathing, circulation, temperature regulation and cell repair. For most people it accounts for the majority of daily energy use.',
      'The Mifflin-St Jeor equation estimates BMR from height, weight, age and sex. It is a formula fitted to population data, so it describes a typical person with those measurements rather than measuring you specifically.',
      'Individual metabolism varies with body composition, genetics, hormones, medication and health conditions, none of which appear in the formula. Treat the result as a rough estimate for informational purposes, not a measurement or medical advice.',
    ],
  },
  howTo: {
    title: 'How to estimate BMR',
    steps: [
      {
        title: 'Choose your units',
        description: 'Metric takes kilograms and centimetres; imperial takes pounds with feet and inches.',
      },
      {
        title: 'Enter age and sex',
        description:
          'The equation uses age in years, and has separate constants for male and female bodies as defined in the original study.',
      },
      { title: 'Enter height and weight', description: 'Decimals are accepted in both unit systems.' },
      {
        title: 'Read the estimate',
        description:
          'The result is calories per day at complete rest. It is not a daily calorie target — everyday activity adds to it.',
      },
    ],
  },
  formulasTitle: 'Mifflin-St Jeor equation',
  formulas: [
    {
      name: 'Male',
      expression: 'BMR = (10 × weight kg) + (6.25 × height cm) − (5 × age) + 5',
      description: '80 kg, 180 cm, 30 years: 800 + 1,125 − 150 + 5 = 1,780 calories a day.',
    },
    {
      name: 'Female',
      expression: 'BMR = (10 × weight kg) + (6.25 × height cm) − (5 × age) − 161',
      description: 'The same measurements: 800 + 1,125 − 150 − 161 = 1,614 calories a day.',
    },
    {
      name: 'From imperial units',
      expression: 'pounds × 0.45359237 → kg · (feet × 12 + inches) × 2.54 → cm',
      description: 'Imperial input is converted to metric and then put through the same equation.',
    },
  ],
  examples: [
    {
      title: 'Male, metric',
      description: '80 kg, 180 cm, 30 years old.',
      inputs: [
        { label: 'Weight', value: '80 kg' },
        { label: 'Height', value: '180 cm' },
        { label: 'Age', value: '30' },
        { label: 'Sex', value: 'Male' },
      ],
      result: 'About 1,780 calories a day at rest.',
    },
    {
      title: 'Female, metric',
      description: 'The same measurements, female constants.',
      inputs: [
        { label: 'Weight', value: '80 kg' },
        { label: 'Height', value: '180 cm' },
        { label: 'Age', value: '30' },
        { label: 'Sex', value: 'Female' },
      ],
      result: 'About 1,614 calories a day at rest.',
    },
    {
      title: 'Imperial input',
      description: '154 lb at 5 ft 9 in, 30 years old.',
      inputs: [
        { label: 'Weight', value: '154 lb' },
        { label: 'Height', value: '5 ft 9 in' },
        { label: 'Age', value: '30' },
      ],
      result: 'Converted to 69.9 kg and 175.3 cm before the equation is applied.',
    },
  ],
  faqs: [
    {
      question: 'Is BMR the same as my daily calorie needs?',
      answer:
        'No. BMR is what the body uses at complete rest. Everything you do on top of that — moving, working, exercising, digesting — adds more. The Calorie Calculator applies an activity multiplier to estimate the daily total.',
    },
    {
      question: 'How accurate is the Mifflin-St Jeor equation?',
      answer:
        'It is one of the better-performing formulas for the general population, but it is still an estimate fitted to averages. Individual results can differ meaningfully, and only laboratory measurement gives a true figure.',
    },
    {
      question: 'Why does the equation use sex?',
      answer:
        'The original study fitted separate constants for male and female participants, largely reflecting average differences in body composition. It is a simplification of a more complex picture, not a statement about any individual.',
    },
    {
      question: 'Why does BMR fall with age?',
      answer:
        'The equation subtracts five calories per year of age, reflecting the average decline in resting energy use across a population. How much any one person changes with age varies considerably.',
    },
    {
      question: 'Should I use this to plan what I eat?',
      answer:
        'Not on its own. This is an informational estimate, not nutritional or medical guidance. Speak to a qualified professional about anything that affects your health or diet.',
    },
  ],
  tip: {
    title: 'An estimate, not a measurement',
    body: 'The equation describes a typical person with your measurements. Body composition, genetics and health all shift real metabolism away from the average.',
  },
}
