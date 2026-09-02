import type { CalculatorContent } from './types.ts'

export const concreteContent: CalculatorContent = {
  slug: 'concrete-calculator',
  seoTitle: 'Concrete Calculator — Volume for a Slab in Yards or Metres',
  seoDescription:
    'Free concrete calculator. Enter length, width and depth to estimate the volume needed for a slab, in cubic yards, cubic feet and cubic metres, with a waste allowance.',
  intro: {
    title: 'About estimating concrete',
    lead: 'Estimate the concrete a rectangular slab needs, with an allowance for waste.',
    paragraphs: [
      'The volume of a slab is simply length times width times depth. The awkward part is units: slabs are usually measured in feet and inches but ordered in cubic yards, and a cubic yard is 27 cubic feet, so the conversion trips people up.',
      'The result is given in cubic yards, cubic feet and cubic metres at once, so it matches however your supplier quotes.',
      'Add a waste allowance. Some concrete is always lost to spillage, uneven subgrade, over-excavation and what stays in the truck. Around 5% to 10% is a common margin, though the right figure depends on the site.',
    ],
  },
  howTo: {
    title: 'How to estimate concrete volume',
    steps: [
      {
        title: 'Choose your units',
        description:
          'Imperial takes length and width in feet with the depth in inches. Metric takes metres with the depth in centimetres.',
      },
      {
        title: 'Measure the slab',
        description:
          'Length and width across the area, and the depth of the pour. A typical patio or path slab is 4 inches or about 10 cm.',
      },
      {
        title: 'Add a waste allowance',
        description:
          'Commonly 5% to 10%. Leave it blank for none, though ordering exactly the calculated volume rarely works out.',
      },
      {
        title: 'Order in the supplier’s units',
        description:
          'Ready-mix is usually sold by the cubic yard or cubic metre, and often in fixed increments, so round up to what they will actually deliver.',
      },
    ],
  },
  formulasTitle: 'Concrete formulas',
  formulas: [
    {
      name: 'Volume in imperial units',
      expression: 'length ft × width ft × (depth in ÷ 12) = cubic feet',
      description:
        'A 10 by 10 foot slab at 4 inches is 10 × 10 × 0.333 = 33.33 cubic feet.',
    },
    {
      name: 'Cubic feet to cubic yards',
      expression: 'cubic feet ÷ 27',
      description:
        '33.33 cubic feet is 1.23 cubic yards. A cubic yard is 3 × 3 × 3 feet, which is where the 27 comes from.',
    },
    {
      name: 'Volume in metric units',
      expression: 'length m × width m × (depth cm ÷ 100) = cubic metres',
      description: 'A 4 by 3 metre slab at 10 cm is 4 × 3 × 0.1 = 1.2 cubic metres.',
    },
    {
      name: 'With waste allowance',
      expression: 'volume × (1 + waste ÷ 100)',
      description: '1.2 cubic metres at 10% waste means ordering 1.32.',
    },
  ],
  examples: [
    {
      title: 'A patio slab in feet',
      description: '10 by 10 feet at 4 inches deep.',
      inputs: [
        { label: 'Length', value: '10 ft' },
        { label: 'Width', value: '10 ft' },
        { label: 'Depth', value: '4 in' },
      ],
      result: '33.33 cubic feet, or 1.23 cubic yards.',
    },
    {
      title: 'A metric slab',
      description: '4 by 3 metres at 10 cm deep.',
      inputs: [
        { label: 'Length', value: '4 m' },
        { label: 'Width', value: '3 m' },
        { label: 'Depth', value: '10 cm' },
      ],
      result: '1.2 cubic metres, or 1.57 cubic yards.',
    },
    {
      title: 'With 10% waste',
      description: 'The same metric slab, allowing for losses.',
      inputs: [
        { label: 'Volume', value: '1.2 m³' },
        { label: 'Waste', value: '10%' },
      ],
      result: 'Order 1.32 cubic metres.',
    },
  ],
  faqs: [
    {
      question: 'How much waste should I allow?',
      answer:
        'Between 5% and 10% is common for a straightforward slab. Allow more where the subgrade is uneven, the excavation is rough, or the pour is awkward to reach — under-ordering is far more expensive than over-ordering.',
    },
    {
      question: 'How deep should a slab be?',
      answer:
        'It depends entirely on the load. Paths and patios are often 4 inches or 10 cm; driveways and anything carrying vehicles need more, along with reinforcement. Follow your local building requirements or a contractor’s specification rather than a rule of thumb.',
    },
    {
      question: 'Why is my supplier quoting a different quantity?',
      answer:
        'Ready-mix is usually sold in fixed increments, and suppliers round up to the next one. They may also allow for waste themselves, or adjust for the mix and site access.',
    },
    {
      question: 'Does this handle shapes other than rectangles?',
      answer:
        'Not directly. For an L-shape, split it into rectangles and add the volumes. For a circle, work out the area yourself and multiply by the depth.',
    },
    {
      question: 'Does it account for reinforcement or a sub-base?',
      answer:
        'No. It calculates the volume of the pour itself. Rebar, mesh, hardcore and a sand blinding are all separate materials, and a sub-base changes how deep you need to excavate.',
    },
    {
      question: 'Why show three different units?',
      answer:
        'Because slabs are typically measured in one system and ordered in another. Showing cubic yards, feet and metres together means you can measure however you like and quote whatever your supplier asks for.',
    },
  ],
  tip: {
    title: 'Order slightly over, never under',
    body: 'A short pour that sets before more concrete arrives leaves a cold joint and a weak slab. A little spare costs far less than starting again.',
  },
}
