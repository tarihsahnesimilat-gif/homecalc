import type { CalculatorContent } from './types.ts'

export const fuelCostContent: CalculatorContent = {
  slug: 'fuel-cost-calculator',
  seoTitle: 'Fuel Cost Calculator — Work Out What a Trip Will Cost',
  seoDescription:
    'Free fuel cost calculator. Enter a distance, your fuel efficiency and the fuel price to see how much fuel a trip needs and what it will cost.',
  intro: {
    title: 'About fuel costs',
    lead: 'Enter a distance, your vehicle efficiency and the fuel price to see what a trip costs.',
    paragraphs: [
      'Fuel efficiency is quoted two different ways depending on where you are. Miles per gallon and kilometres per litre say how far you travel on a unit of fuel, so higher is better. Litres per 100 km says how much fuel a fixed distance consumes, so lower is better. The calculator supports both.',
      'The units themselves are yours to choose. Work in miles and gallons, or kilometres and litres — the arithmetic is the same, as long as your efficiency figure and your fuel price use the same volume unit.',
      'Manufacturer efficiency figures come from standardised tests. Real driving — traffic, terrain, speed, load, weather — usually consumes more, so a real trip often costs a little above the estimate.',
    ],
  },
  howTo: {
    title: 'How to work out trip fuel cost',
    steps: [
      {
        title: 'Choose how your efficiency is quoted',
        description:
          'Distance per unit of fuel for mpg or km/L, or fuel per 100 distance for L/100 km.',
      },
      {
        title: 'Enter the distance',
        description:
          'The trip length in whichever unit your efficiency uses — miles with mpg, kilometres with L/100 km.',
      },
      {
        title: 'Enter your efficiency and fuel price',
        description:
          'The price is per unit of volume: per gallon if you are working in gallons, per litre if in litres.',
      },
      {
        title: 'Read the fuel used and the cost',
        description:
          'Both are shown, along with the cost per mile or kilometre, which is handy for comparing routes or vehicles.',
      },
    ],
  },
  formulasTitle: 'Fuel cost formulas',
  formulas: [
    {
      name: 'Distance per unit of fuel (mpg, km/L)',
      expression: 'fuel used = distance ÷ efficiency',
      description: '300 miles at 30 mpg uses 10 gallons.',
    },
    {
      name: 'Fuel per 100 distance (L/100 km)',
      expression: 'fuel used = (distance × efficiency) ÷ 100',
      description: '400 km at 7.5 L/100 km uses 30 litres.',
    },
    {
      name: 'Trip cost',
      expression: 'fuel used × price per unit',
      description: '10 gallons at 4.00 a gallon costs 40.00.',
    },
  ],
  examples: [
    {
      title: 'A trip quoted in mpg',
      description: '300 miles in a car doing 30 miles per gallon, fuel at 4.00 a gallon.',
      inputs: [
        { label: 'Mode', value: 'Distance per unit' },
        { label: 'Distance', value: '300' },
        { label: 'Efficiency', value: '30' },
        { label: 'Fuel price', value: '4.00' },
      ],
      result: '10 units of fuel, costing 40.00.',
    },
    {
      title: 'A trip quoted in L/100 km',
      description: '400 km at 7.5 litres per 100 km, fuel at 1.60 a litre.',
      inputs: [
        { label: 'Mode', value: 'Fuel per 100 distance' },
        { label: 'Distance', value: '400' },
        { label: 'Efficiency', value: '7.5' },
        { label: 'Fuel price', value: '1.60' },
      ],
      result: '30 litres, costing 48.00.',
    },
    {
      title: 'Comparing two cars',
      description: 'The same 250-mile trip at 25 mpg and at 45 mpg.',
      inputs: [
        { label: 'Distance', value: '250' },
        { label: 'Efficiency', value: '25 then 45' },
      ],
      result: '10 units against 5.56 — nearly half the fuel for the same journey.',
    },
  ],
  faqs: [
    {
      question: 'Which efficiency mode should I choose?',
      answer:
        'Match how your figure is written. A number like 30 or 45 that gets better as it rises is distance per unit of fuel. A number like 6 or 8 that gets better as it falls is fuel per 100 km.',
    },
    {
      question: 'Which units should I use?',
      answer:
        'Any consistent set. Miles with gallons and a price per gallon, or kilometres with litres and a price per litre. The calculator does not convert between them — the Unit Converter does that.',
    },
    {
      question: 'Why is my real cost higher than the estimate?',
      answer:
        'Quoted efficiency comes from standardised tests. Traffic, hills, high speeds, cold weather, air conditioning, roof boxes and a loaded car all increase consumption, often by 10 to 20%.',
    },
    {
      question: 'How do I work out the cost of a return trip?',
      answer:
        'Double the distance before entering it, or double the resulting cost. The relationship is linear, so either works.',
    },
    {
      question: 'How do I split the cost between passengers?',
      answer:
        'Divide the trip cost by the number of people sharing. The cost per mile or kilometre shown is also useful for splitting a longer journey by leg.',
    },
    {
      question: 'Does this work for an electric vehicle?',
      answer:
        'The arithmetic does, if you substitute consistently: miles per kWh as efficiency and price per kWh as the fuel price. The labels say fuel, but the model is the same.',
    },
  ],
  tip: {
    title: 'Keep your units consistent',
    body: 'The most common mistake is mixing them — miles with a price per litre, say. Efficiency, distance and price must all refer to the same units for the answer to mean anything.',
  },
}
