import type { CalculatorContent } from './types.ts'

export const gcfLcmContent: CalculatorContent = {
  slug: 'gcf-lcm-calculator',
  seoTitle: 'GCF and LCM Calculator — Common Factor and Multiple',
  seoDescription:
    'Free GCF and LCM calculator. Enter two whole numbers to find their greatest common factor (also called the GCD) and their least common multiple.',
  intro: {
    title: 'About factors and multiples',
    lead: 'Enter two whole numbers to find their greatest common factor and least common multiple.',
    paragraphs: [
      'The greatest common factor is the largest number that divides both values exactly. It also goes by greatest common divisor, or GCD — the two names describe the same thing. It is what you divide by to reduce a fraction to lowest terms.',
      'The least common multiple is the smallest number both values divide into. It is what you need when adding fractions with different denominators, or working out when two repeating cycles line up again.',
      'The two are linked: multiply them together and you always get the product of the original numbers.',
    ],
  },
  howTo: {
    title: 'How to find the GCF and LCM',
    steps: [
      {
        title: 'Enter two whole numbers',
        description:
          'Both must be positive integers. Factors and multiples are not defined for fractions or negatives here.',
      },
      {
        title: 'Read the greatest common factor',
        description:
          'The largest value that divides both exactly. A result of 1 means the numbers share no factors.',
      },
      {
        title: 'Read the least common multiple',
        description: 'The smallest number that both divide into without a remainder.',
      },
      {
        title: 'Check the relationship',
        description:
          'GCF × LCM equals the product of the two numbers, which is a quick way to confirm the answer.',
      },
    ],
  },
  formulasTitle: 'How they are calculated',
  formulas: [
    {
      name: 'Greatest common factor',
      expression: 'repeatedly replace (a, b) with (b, a mod b) until b is zero',
      description:
        'Euclid’s algorithm. For 12 and 18: 18 mod 12 is 6, then 12 mod 6 is 0, so the GCF is 6. It is far faster than listing every factor.',
    },
    {
      name: 'Least common multiple',
      expression: '(a ÷ GCF) × b',
      description:
        'For 12 and 18: (12 ÷ 6) × 18 = 36. Dividing before multiplying keeps the numbers small enough to stay exact.',
    },
    {
      name: 'The identity between them',
      expression: 'GCF × LCM = a × b',
      description: '6 × 36 = 216, and 12 × 18 = 216. This holds for any pair.',
    },
  ],
  examples: [
    {
      title: 'Numbers sharing factors',
      description: 'Twelve and eighteen both divide by six.',
      inputs: [
        { label: 'Number 1', value: '12' },
        { label: 'Number 2', value: '18' },
      ],
      result: 'GCF 6, LCM 36.',
    },
    {
      title: 'Two primes',
      description: 'Primes share no factors beyond one.',
      inputs: [
        { label: 'Number 1', value: '7' },
        { label: 'Number 2', value: '13' },
      ],
      result: 'GCF 1, LCM 91 — the product, since nothing cancels.',
    },
    {
      title: 'One number divides the other',
      description: 'Five goes into twenty exactly.',
      inputs: [
        { label: 'Number 1', value: '5' },
        { label: 'Number 2', value: '20' },
      ],
      result: 'GCF 5, LCM 20.',
    },
  ],
  faqs: [
    {
      question: 'Is the GCF the same as the GCD?',
      answer:
        'Yes. Greatest common factor and greatest common divisor are two names for the same number. GCF is more common in schools, GCD in computing and number theory.',
    },
    {
      question: 'What does a GCF of 1 mean?',
      answer:
        'The two numbers are coprime — they share no factor other than 1. Their least common multiple is then simply the two multiplied together.',
    },
    {
      question: 'What are these actually used for?',
      answer:
        'The GCF reduces fractions to lowest terms and scales ratios down. The LCM gives the common denominator when adding fractions, and answers questions like when two events that repeat every 12 and 18 days next coincide.',
    },
    {
      question: 'Why must the numbers be positive whole numbers?',
      answer:
        'Factors and multiples are defined for integers. Negatives would make "greatest" ambiguous, and fractions have no meaningful factors, so both are rejected rather than guessed at.',
    },
    {
      question: 'Why does it reject very large numbers?',
      answer:
        'Beyond about 9 quadrillion, JavaScript can no longer hold whole numbers exactly, and the multiple would silently lose precision. The calculator reports that instead of returning a wrong answer.',
    },
  ],
  tip: {
    title: 'Use the identity as a check',
    body: 'Multiply the GCF by the LCM. If it does not equal the two original numbers multiplied together, something has gone wrong.',
  },
}
