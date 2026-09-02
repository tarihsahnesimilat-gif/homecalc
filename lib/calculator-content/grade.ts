import type { CalculatorContent } from './types.ts'

export const gradeContent: CalculatorContent = {
  slug: 'grade-calculator',
  seoTitle: 'Grade Calculator — Percentage and Letter Grade From Points',
  seoDescription:
    'Free grade calculator. Enter points earned and total points to get the percentage and a letter grade, using a published scale you can check against your own.',
  intro: {
    title: 'About grading',
    lead: 'Turn points earned out of a total into a percentage and a letter grade.',
    paragraphs: [
      'A grade starts as a percentage: the points you scored divided by the points available. That part is universal.',
      'The letter attached to it is not. Grading scales are set by individual schools, departments and sometimes individual instructors. Some use plus and minus grades and some do not, some set the pass mark at 60 and others higher, and some curve results across a class.',
      'The scale used here is a widely used US convention, published in full below so you can compare it against the one on your syllabus. Where they differ, the percentage is the figure that travels.',
    ],
  },
  howTo: {
    title: 'How to calculate a grade',
    steps: [
      {
        title: 'Enter the points you earned',
        description:
          'The marks awarded. Scores above the total are accepted, since extra credit is real.',
      },
      {
        title: 'Enter the total points available',
        description: 'What the work was marked out of. It must be greater than zero.',
      },
      {
        title: 'Read the percentage',
        description:
          'The exact figure, before any rounding your institution might apply to it.',
      },
      {
        title: 'Check the letter against your syllabus',
        description:
          'The letter uses the scale published below. If your course grades differently, rely on the percentage.',
      },
    ],
  },
  formulasTitle: 'How the grade is worked out',
  formulas: [
    {
      name: 'Percentage',
      expression: '(points earned ÷ total points) × 100',
      description: '45 out of 50 is (45 ÷ 50) × 100 = 90%.',
    },
    {
      name: 'Letter grade',
      expression: 'the highest band the percentage reaches',
      description:
        '90% reaches the A− band but not the A band at 93%, so it is an A−.',
    },
    {
      name: 'The scale used here',
      expression: 'A+ 97 · A 93 · A− 90 · B+ 87 · B 83 · B− 80 · C+ 77 · C 73 · C− 70 · D+ 67 · D 63 · D− 60 · F below 60',
      description:
        'One common US scale. Many institutions use different thresholds, and plenty do not use plus and minus grades at all.',
    },
  ],
  examples: [
    {
      title: 'A strong result',
      description: '45 marks out of a possible 50.',
      inputs: [
        { label: 'Points earned', value: '45' },
        { label: 'Total points', value: '50' },
      ],
      result: '90% — an A− on this scale.',
    },
    {
      title: 'Full marks',
      description: 'Everything correct.',
      inputs: [
        { label: 'Points earned', value: '50' },
        { label: 'Total points', value: '50' },
      ],
      result: '100% — an A+.',
    },
    {
      title: 'With extra credit',
      description: 'Bonus marks take the score past the total.',
      inputs: [
        { label: 'Points earned', value: '55' },
        { label: 'Total points', value: '50' },
      ],
      result: '110% — reported in full and flagged as extra credit.',
    },
  ],
  faqs: [
    {
      question: 'Does every school use this grading scale?',
      answer:
        'No, and that matters. The scale here is one common US convention, published in full so you can compare it. Thresholds, pass marks, plus and minus grades and curving all vary by institution — check your syllabus.',
    },
    {
      question: 'Can I score more than 100%?',
      answer:
        'Yes. Extra credit can take you above the total, and the calculator reports the real percentage and flags it rather than capping the result at 100.',
    },
    {
      question: 'How do I work out what I need on a final?',
      answer:
        'Work from the whole course rather than one paper. Add the points you already hold to the points still available, then try target scores here until the overall percentage reaches the grade you want.',
    },
    {
      question: 'Is this a GPA calculator?',
      answer:
        'No. GPA converts letter grades into grade points and averages them across courses, usually weighted by credit hours. This grades a single piece of work.',
    },
    {
      question: 'Why does 89.9% show as a B+?',
      answer:
        'Because the A− band begins at 90 on this scale. Some institutions round before assigning a letter, which would make 89.5 an A−. The exact percentage is shown so you can apply your own rounding rule.',
    },
  ],
  tip: {
    title: 'The percentage travels, the letter does not',
    body: 'When comparing results across institutions, compare percentages. The same letter can mean noticeably different things in different places.',
  },
}
