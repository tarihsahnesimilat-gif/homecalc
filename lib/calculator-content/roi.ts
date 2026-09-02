import type { CalculatorContent } from './types.ts'

export const roiContent: CalculatorContent = {
  slug: 'roi-calculator',
  seoTitle: 'ROI Calculator — Return on Investment Percentage',
  seoDescription:
    'Free ROI calculator. Enter what you put in and what it is worth now to see the profit or loss and the return on investment as a percentage.',
  intro: {
    title: 'About return on investment',
    lead: 'Enter what you put in and what came out to see the gain or loss and the return as a percentage.',
    paragraphs: [
      'Return on investment expresses a gain as a share of what was invested. That is what makes a 500 gain on 1,000 comparable with a 5,000 gain on 100,000 — the first is a 50% return, the second only 5%.',
      'ROI says nothing about how long the money was tied up. A 50% return over one year and the same return over ten are very different outcomes, so compare periods as well as percentages.',
    ],
  },
  howTo: {
    title: 'How to calculate ROI',
    steps: [
      {
        title: 'Enter the initial investment',
        description:
          'Everything you put in, including costs that were necessary to make the investment. It must be greater than zero, since ROI is a share of it.',
      },
      {
        title: 'Enter the final value',
        description:
          'What the investment is worth now, or what it sold for. Zero is allowed and represents a total loss.',
      },
      {
        title: 'Read the gain and the percentage',
        description:
          'A negative result is a loss and is labelled as one. Losing everything is −100%, the floor for this calculation.',
      },
      {
        title: 'Consider the time period',
        description:
          'ROI is not annualised. To compare investments held for different lengths of time, work out the return per year as well.',
      },
    ],
  },
  formulasTitle: 'ROI formulas',
  formulas: [
    {
      name: 'Return on investment',
      expression: 'ROI% = ((final value − initial investment) ÷ initial investment) × 100',
      description: '1,000 growing to 1,500 is ((1,500 − 1,000) ÷ 1,000) × 100 = 50%.',
    },
    {
      name: 'Gain or loss',
      expression: 'final value − initial investment',
      description: 'The absolute amount made or lost, before expressing it as a percentage.',
    },
  ],
  examples: [
    {
      title: 'A profitable investment',
      description: '1,000 invested, now worth 1,500.',
      inputs: [
        { label: 'Initial investment', value: '1000' },
        { label: 'Final value', value: '1500' },
      ],
      result: 'Gain 500.00, ROI 50%.',
    },
    {
      title: 'A loss',
      description: 'The same 1,000, now worth 800.',
      inputs: [
        { label: 'Initial investment', value: '1000' },
        { label: 'Final value', value: '800' },
      ],
      result: 'Loss 200.00, ROI −20%.',
    },
    {
      title: 'Breaking even',
      description: 'Getting back exactly what went in.',
      inputs: [
        { label: 'Initial investment', value: '1000' },
        { label: 'Final value', value: '1000' },
      ],
      result: 'Gain 0.00, ROI 0%.',
    },
  ],
  faqs: [
    {
      question: 'What counts as the initial investment?',
      answer:
        'Everything you had to spend to hold the investment: the purchase price plus fees, commissions and any costs required to make it. Leaving those out overstates the return.',
    },
    {
      question: 'What is a good ROI?',
      answer:
        'There is no universal figure. It depends on the risk taken, how long the money was invested and what else it could have been doing. A percentage on its own does not tell you whether an investment was worthwhile.',
    },
    {
      question: 'How do I annualise ROI?',
      answer:
        'Use the compound formula rather than dividing by the number of years: annualised return = ((final ÷ initial)^(1 ÷ years) − 1) × 100. Simply dividing overstates longer holdings.',
    },
    {
      question: 'Can ROI be below −100%?',
      answer:
        'Not with this calculator, which requires a final value of zero or more. Losing everything is −100%. Going beyond that would mean owing more than you invested, which needs a different model.',
    },
    {
      question: 'How does ROI differ from profit margin?',
      answer:
        'ROI divides profit by what was invested; profit margin divides it by revenue. ROI measures how hard your capital worked, margin measures how much of each sale you keep.',
    },
  ],
  tip: {
    title: 'A percentage without a period is incomplete',
    body: 'Always note how long the money was invested. Two identical ROI figures over one year and ten years describe very different results.',
  },
}
