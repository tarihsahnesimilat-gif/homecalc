import type { CalculatorContent } from './types.ts'

export const areaContent: CalculatorContent = {
  slug: 'area-calculator',
  seoTitle: 'Area Calculator — Square Footage for Rooms, Circles and Triangles',
  seoDescription:
    'Free area calculator. Find the area of a rectangle, circle or triangle in square feet, square metres and square yards, for flooring, paint and materials.',
  intro: {
    title: 'About calculating area',
    lead: 'Find the area of a rectangle, circle or triangle for a room or a plot.',
    paragraphs: [
      'Area is what you need before ordering almost any material that covers a surface: flooring, turf, paint, tiles, decking. Nearly every household job comes down to one of three shapes, or a combination of them.',
      'The result is given in square metres, square feet and square yards at once, because suppliers quote in different units and converting by hand is where mistakes creep in. Note that a square yard is nine square feet, not three — squaring a unit squares the conversion factor too.',
      'For an irregular room, split it into rectangles, work out each one and add the results. An L-shaped space is two rectangles, and a bay is usually a rectangle plus a part-circle.',
    ],
  },
  howTo: {
    title: 'How to calculate area',
    steps: [
      {
        title: 'Choose the shape',
        description:
          'Rectangle for a room or plot, circle for a patio or pond, triangle for a gable or offcut.',
      },
      {
        title: 'Choose your units',
        description:
          'Metres or feet. Whichever you pick, the result is converted into all three units.',
      },
      {
        title: 'Enter the dimensions',
        description:
          'Length and width for a rectangle, the radius for a circle, base and perpendicular height for a triangle.',
      },
      {
        title: 'Add a margin before ordering',
        description:
          'Flooring and tiles need extra for cuts and waste — commonly around 10%, more for diagonal or patterned layouts.',
      },
    ],
  },
  formulasTitle: 'Area formulas',
  formulas: [
    {
      name: 'Rectangle',
      expression: 'length × width',
      description: 'A 5 by 4 metre room is 20 square metres.',
    },
    {
      name: 'Circle',
      expression: 'π × radius²',
      description:
        'A circle of radius 3 metres is about 28.3 square metres. The radius is half the width across.',
    },
    {
      name: 'Triangle',
      expression: '(base × height) ÷ 2',
      description:
        'Exactly half the rectangle it sits inside. The height must be perpendicular to the base, not the sloping side.',
    },
    {
      name: 'Converting square units',
      expression: '1 yd² = 9 ft² · 1 m² = 10.764 ft²',
      description:
        'Squaring a unit squares the factor. Three feet make a yard, so nine square feet make a square yard.',
    },
  ],
  examples: [
    {
      title: 'A rectangular room',
      description: 'Five metres by four.',
      inputs: [
        { label: 'Shape', value: 'Rectangle' },
        { label: 'Length', value: '5 m' },
        { label: 'Width', value: '4 m' },
      ],
      result: '20 m², or about 215.3 ft².',
    },
    {
      title: 'A circular patio',
      description: 'Three metres from the centre to the edge.',
      inputs: [
        { label: 'Shape', value: 'Circle' },
        { label: 'Radius', value: '3 m' },
      ],
      result: 'About 28.27 m².',
    },
    {
      title: 'A gable end',
      description: 'A triangle six metres across and four high.',
      inputs: [
        { label: 'Shape', value: 'Triangle' },
        { label: 'Base', value: '6 m' },
        { label: 'Height', value: '4 m' },
      ],
      result: '12 m² — half of the 24 m² rectangle around it.',
    },
  ],
  faqs: [
    {
      question: 'How do I work out an irregular room?',
      answer:
        'Divide it into rectangles, calculate each and add them together. An L-shape is two rectangles; an alcove is one more. Splitting a plan into simple shapes is almost always easier than finding a formula for the whole thing.',
    },
    {
      question: 'Why is a square yard nine square feet, not three?',
      answer:
        'Because both dimensions convert. A yard is three feet each way, and three times three is nine. The same applies to every squared unit, and forgetting it is a classic ordering error.',
    },
    {
      question: 'Do I need the radius or the diameter for a circle?',
      answer:
        'The radius — the distance from the centre to the edge, which is half the width across. Using the diameter by mistake gives four times the real area.',
    },
    {
      question: 'How much extra should I order?',
      answer:
        'For flooring and tiles, around 10% is a common allowance for cuts and breakages, and more for diagonal or patterned layouts. Check what your supplier or fitter recommends for the specific material.',
    },
    {
      question: 'Which height do I use for a triangle?',
      answer:
        'The perpendicular height — straight up from the base to the opposite point, at a right angle. Using the sloping edge instead overstates the area.',
    },
    {
      question: 'How do I get the volume of concrete from this?',
      answer:
        'Multiply the area by the depth of the pour, or use the Concrete calculator, which does it and adds a waste allowance.',
    },
  ],
  tip: {
    title: 'Measure twice, at both ends',
    body: 'Rooms are rarely square. Measure each wall at both ends and use the larger figure, or you will come up short exactly where the material runs out.',
  },
}
