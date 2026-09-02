import type { CalculatorContent } from './types'

export const unitConverterContent: CalculatorContent = {
  slug: 'unit-converter',
  seoTitle: 'Unit Converter — Length, Weight, Temperature and Volume',
  seoDescription:
    'Free unit converter for length, weight, temperature, and volume. Convert meters, feet, kilograms, pounds, Celsius, Fahrenheit, liters, gallons, and more instantly.',
  intro: {
    title: 'About unit conversion',
    lead: 'Convert between metric and imperial units for length, weight, temperature, and volume.',
    paragraphs: [
      'Every conversion here routes through a single base unit for its category — meters for length, kilograms for weight, liters for volume, and degrees Celsius for temperature. Converting into the base and back out again means every pair of units is consistent with every other.',
      'The factors are the internationally agreed definitions rather than approximations: an inch is exactly 0.0254 meters and a pound is exactly 0.45359237 kilograms. Volume uses US liquid measures, so a gallon is 3.785411784 liters.',
    ],
  },
  howTo: {
    title: 'How to convert units',
    steps: [
      {
        title: 'Pick a category',
        description:
          'Choose length, weight, temperature, or volume. The unit lists update to match, since converting a meter into a kilogram is not meaningful.',
      },
      {
        title: 'Choose your units',
        description:
          'Set what you are converting from and what you want it in. The swap button reverses the two without retyping.',
      },
      {
        title: 'Enter a value',
        description:
          'The result appears as you type. Negative values are rejected for length, weight, and volume, and temperatures below absolute zero are rejected too.',
      },
      {
        title: 'Read the result',
        description:
          'Results are shown to six decimal places, which keeps exact conversions clean while preserving precision on awkward ones.',
      },
    ],
  },
  formulasTitle: 'Conversion formulas',
  formulas: [
    {
      name: 'Length, weight, and volume',
      expression: 'value × (factor of source unit) ÷ (factor of target unit)',
      description:
        'Each unit has a fixed size relative to the base. To convert 1 foot to inches: 1 × 0.3048 ÷ 0.0254 = 12.',
    },
    {
      name: 'Celsius to Fahrenheit',
      expression: '(°C × 9 ÷ 5) + 32',
      description:
        'Temperature scales have different zero points, so a multiplier alone is not enough. 100°C × 1.8 + 32 = 212°F.',
    },
    {
      name: 'Fahrenheit to Celsius',
      expression: '(°F − 32) × 5 ÷ 9',
      description: 'The offset is removed before scaling. (32 − 32) × 5 ÷ 9 = 0°C.',
    },
    {
      name: 'Celsius and Kelvin',
      expression: 'K = °C + 273.15',
      description:
        'Kelvin uses the same degree size as Celsius but starts at absolute zero, so only an offset is needed.',
    },
  ],
  examples: [
    {
      title: 'Meters to centimeters',
      description: 'A straightforward metric step.',
      inputs: [
        { label: 'Value', value: '1' },
        { label: 'From', value: 'Meter' },
        { label: 'To', value: 'Centimeter' },
      ],
      result: '100 cm',
    },
    {
      title: 'Feet to inches',
      description: 'An imperial conversion with an exact whole-number answer.',
      inputs: [
        { label: 'Value', value: '1' },
        { label: 'From', value: 'Foot' },
        { label: 'To', value: 'Inch' },
      ],
      result: '12 in',
    },
    {
      title: 'Water boiling point',
      description: 'Celsius to Fahrenheit at the top of the scale.',
      inputs: [
        { label: 'Value', value: '100' },
        { label: 'From', value: 'Celsius' },
        { label: 'To', value: 'Fahrenheit' },
      ],
      result: '212 °F',
    },
    {
      title: 'Kilograms to pounds',
      description: 'A common metric-to-imperial weight conversion.',
      inputs: [
        { label: 'Value', value: '5' },
        { label: 'From', value: 'Kilogram' },
        { label: 'To', value: 'Pound' },
      ],
      result: '11.023113 lb',
    },
  ],
  faqs: [
    {
      question: 'Why does temperature need a different formula?',
      answer:
        'Because the scales do not share a zero point. Zero Celsius is 32 Fahrenheit, so converting requires shifting by an offset as well as scaling by 9/5. Length and weight units all start at zero, so a single multiplier is enough.',
    },
    {
      question: 'Are these US or imperial gallons?',
      answer:
        'US liquid measures. A US gallon is 3.785411784 liters, while an imperial gallon used in the UK is about 4.546 liters — roughly 20% larger, which is worth checking against recipes and fuel figures.',
    },
    {
      question: 'How exact are the conversions?',
      answer:
        'The factors are the defined values, so conversions such as 1 foot to 12 inches are exact. Results are displayed to six decimal places, which is beyond the precision of most everyday measurements.',
    },
    {
      question: 'What is absolute zero and why is it rejected?',
      answer:
        'Absolute zero is the lowest possible temperature: 0 K, −273.15°C, or −459.67°F. Nothing can be colder, so a value below it is an input error rather than a temperature worth converting.',
    },
    {
      question: 'Why can I not enter a negative length or weight?',
      answer:
        'Those quantities have a true zero and cannot go below it. Temperature is the exception, which is why negative values are accepted there.',
    },
    {
      question: 'Why are ounces of weight and fluid ounces different?',
      answer:
        'They measure different things. An ounce of weight is about 28.35 grams; a US fluid ounce is a volume of about 29.57 milliliters. They are listed under Weight and Volume respectively and are never interchangeable.',
    },
  ],
  tip: {
    title: 'Check which gallon you mean',
    body: 'US and imperial gallons differ by about 20%. This converter uses US liquid measures, so figures from UK sources may need converting separately.',
  },
}
