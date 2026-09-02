import { type CalculatorOutcome, anyBlank, invalid, ok, parseNumbers } from '../calculator-validation.ts'
import { centimetersToMeters, feetAndInchesToCentimeters, poundsToKilograms } from './body-units.ts'

export type MeasurementSystem = 'metric' | 'imperial'

export type BmiCategory = 'underweight' | 'normal' | 'overweight' | 'obesity'

export interface BmiResult {
  bmi: number
  category: BmiCategory
  kilograms: number
  centimeters: number
}

/** Standard adult categories. BMI is a screening measure, not a diagnosis. */
export const BMI_CATEGORY_LABEL: Readonly<Record<BmiCategory, string>> = {
  underweight: 'Underweight',
  normal: 'Normal weight',
  overweight: 'Overweight',
  obesity: 'Obesity',
}

export function categorizeBmi(bmi: number): BmiCategory {
  if (bmi < 18.5) return 'underweight'
  if (bmi < 25) return 'normal'
  if (bmi < 30) return 'overweight'
  return 'obesity'
}

/** BMI = weight(kg) / height(m)^2. */
export function calculateBmi(kilograms: number, centimeters: number): BmiResult {
  const meters = centimetersToMeters(centimeters)
  const bmi = kilograms / (meters * meters)

  return { bmi, category: categorizeBmi(bmi), kilograms, centimeters }
}

/** Guards against values no adult measurement would produce. */
function outOfRange(kilograms: number, centimeters: number): string | null {
  if (kilograms <= 0) return 'Weight must be greater than zero.'
  if (centimeters <= 0) return 'Height must be greater than zero.'
  if (kilograms > 650) return 'That weight looks too large — please check the value.'
  if (centimeters > 300) return 'That height looks too large — please check the value.'
  return null
}

export interface BmiInputs {
  system: MeasurementSystem
  /** Metric: kilograms. Imperial: pounds. */
  weight: string
  /** Metric: centimetres. Imperial: unused. */
  heightCm: string
  /** Imperial only. */
  heightFeet: string
  /** Imperial only; may be left blank and treated as zero. */
  heightInches: string
}

export function evaluateBmi(inputs: BmiInputs): CalculatorOutcome<BmiResult> {
  const { system, weight, heightCm, heightFeet, heightInches } = inputs

  if (system === 'metric') {
    if (anyBlank(weight, heightCm)) return { state: 'empty' }

    const parsed = parseNumbers(weight, heightCm)
    if (!parsed) return invalid('Please enter numbers only.')

    const [kilograms, centimeters] = parsed
    const problem = outOfRange(kilograms, centimeters)
    return problem ? invalid(problem) : ok(calculateBmi(kilograms, centimeters))
  }

  if (anyBlank(weight, heightFeet)) return { state: 'empty' }

  // Inches are optional: 6 ft on its own is a complete height.
  const parsed = parseNumbers(weight, heightFeet, heightInches.trim() === '' ? '0' : heightInches)
  if (!parsed) return invalid('Please enter numbers only.')

  const [pounds, feet, inches] = parsed
  if (inches < 0 || inches >= 12) return invalid('Inches must be between 0 and 11.')

  const kilograms = poundsToKilograms(pounds)
  const centimeters = feetAndInchesToCentimeters(feet, inches)
  const problem = outOfRange(kilograms, centimeters)

  return problem ? invalid(problem) : ok(calculateBmi(kilograms, centimeters))
}
