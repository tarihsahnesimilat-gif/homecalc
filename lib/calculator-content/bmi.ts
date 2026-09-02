import type { CalculatorContent } from './types.ts'

export const bmiContent: CalculatorContent = {
  slug: 'bmi-calculator',
  seoTitle: 'BMI Calculator — Body Mass Index in Metric or Imperial',
  seoDescription:
    'Free BMI calculator. Enter height and weight in metric or imperial units to find your body mass index and the standard adult category it falls in.',
  intro: {
    title: 'About body mass index',
    lead: 'Find your body mass index from your height and weight, in metric or imperial units.',
    paragraphs: [
      'Body mass index compares weight to height on a single scale. It was designed to describe populations, and it is used as a quick screening measure rather than a diagnosis.',
      'BMI does not distinguish muscle from fat, or say where weight is carried. A muscular athlete and someone carrying more body fat can share a BMI, and the standard adult categories do not apply to children, pregnancy, or every ethnic group in the same way.',
      'This calculator is informational only. It cannot assess your health, and it is not a substitute for advice from a qualified healthcare professional who knows your circumstances.',
    ],
  },
  howTo: {
    title: 'How to calculate BMI',
    steps: [
      {
        title: 'Choose your units',
        description:
          'Metric takes kilograms and centimetres; imperial takes pounds with feet and inches. Both produce the same BMI.',
      },
      {
        title: 'Enter your height',
        description:
          'In imperial, inches are optional — 6 ft on its own is a complete height and is treated as 6 ft 0 in.',
      },
      { title: 'Enter your weight', description: 'Decimals are accepted for both units.' },
      {
        title: 'Read the number and the category',
        description:
          'The category uses the standard adult ranges. Treat it as one rough indicator among many, not a verdict.',
      },
    ],
  },
  formulasTitle: 'BMI formulas',
  formulas: [
    {
      name: 'Body mass index',
      expression: 'BMI = weight (kg) ÷ height (m)²',
      description: '70 kg at 1.75 m is 70 ÷ 3.0625 = 22.9.',
    },
    {
      name: 'From imperial units',
      expression: 'pounds × 0.45359237 → kg · (feet × 12 + inches) × 2.54 → cm',
      description:
        'Imperial input is converted to metric and put through the same formula, so both routes agree exactly.',
    },
    {
      name: 'Standard adult categories',
      expression: 'under 18.5 · 18.5 to 24.9 · 25 to 29.9 · 30 and above',
      description:
        'Underweight, normal weight, overweight and obesity. The boundaries are conventions, not thresholds where anything changes suddenly.',
    },
  ],
  examples: [
    {
      title: 'A metric measurement',
      description: '70 kg at 175 cm.',
      inputs: [
        { label: 'Weight', value: '70 kg' },
        { label: 'Height', value: '175 cm' },
      ],
      result: 'BMI 22.9 — normal weight.',
    },
    {
      title: 'The same person in imperial units',
      description: 'About 154 lb at 5 ft 9 in.',
      inputs: [
        { label: 'Weight', value: '154 lb' },
        { label: 'Height', value: '5 ft 9 in' },
      ],
      result: 'BMI 22.7 — normal weight.',
    },
    {
      title: 'At a category boundary',
      description: '100 kg at 200 cm sits exactly on a boundary.',
      inputs: [
        { label: 'Weight', value: '100 kg' },
        { label: 'Height', value: '200 cm' },
      ],
      result: 'BMI 25.0 — the first value in the overweight range.',
    },
  ],
  faqs: [
    {
      question: 'Does BMI measure body fat?',
      answer:
        'No. It compares weight to height and cannot tell muscle, bone and fat apart. Someone very muscular may have a high BMI with little body fat, which is one reason it is a screening measure rather than a diagnostic one.',
    },
    {
      question: 'Does BMI apply to everyone?',
      answer:
        'The standard adult categories were derived from general adult populations. They are not applied the same way to children and teenagers, during pregnancy, to older adults, or across every ethnic group, where different thresholds are sometimes used.',
    },
    {
      question: 'What should I do with the result?',
      answer:
        'Treat it as one piece of context. If you have questions about your weight or health, discuss them with a qualified healthcare professional who can consider your full situation — this calculator cannot.',
    },
    {
      question: 'Why do the categories have gaps like 24.9 and 25?',
      answer:
        'They are usually written to one decimal place but are continuous underneath: below 25 is the normal range and 25 and above is overweight. A BMI of 24.97 falls in the normal range.',
    },
    {
      question: 'Do metric and imperial give the same answer?',
      answer:
        'Yes. Imperial input is converted using the exact definitions — a pound is 0.45359237 kg and an inch is 2.54 cm — and then run through the same formula, so any difference is only rounding in what you entered.',
    },
  ],
  tip: {
    title: 'One number, limited context',
    body: 'BMI is a rough screening measure. It cannot see body composition, fitness, or where weight is carried, so it is most useful alongside other information rather than on its own.',
  },
}
