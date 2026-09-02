import { type CalculatorOutcome, anyBlank, invalid, ok, parseNumbers } from '../calculator-validation.ts'
import { type MeasurementSystem } from './bmi.ts'
import { feetAndInchesToCentimeters, poundsToKilograms } from './body-units.ts'

export type Sex = 'male' | 'female'

export interface BmrResult {
  /** Estimated resting energy expenditure in calories per day. */
  bmr: number
  kilograms: number
  centimeters: number
  age: number
  sex: Sex
}

/**
 * Mifflin-St Jeor:
 *   male:   10W + 6.25H - 5A + 5
 *   female: 10W + 6.25H - 5A - 161
 *
 * W in kilograms, H in centimetres, A in years. This is a population-level
 * estimate rather than a measurement of any one person's metabolism.
 */
export function calculateBmr(
  kilograms: number,
  centimeters: number,
  age: number,
  sex: Sex,
): BmrResult {
  const base = 10 * kilograms + 6.25 * centimeters - 5 * age
  const bmr = sex === 'male' ? base + 5 : base - 161

  return { bmr, kilograms, centimeters, age, sex }
}

export interface BodyInputs {
  system: MeasurementSystem
  sex: Sex
  age: string
  /** Metric: kilograms. Imperial: pounds. */
  weight: string
  /** Metric: centimetres. Imperial: unused. */
  heightCm: string
  heightFeet: string
  heightInches: string
}

/** Metric or imperial input reduced to kilograms, centimetres and years. */
export interface NormalizedBody {
  kilograms: number
  centimeters: number
  age: number
}

function validateBody(body: NormalizedBody): CalculatorOutcome<NormalizedBody> {
  if (body.age <= 0) return invalid('Age must be greater than zero.')
  if (body.age > 120) return invalid('That age looks too large — please check the value.')
  if (body.kilograms <= 0) return invalid('Weight must be greater than zero.')
  if (body.centimeters <= 0) return invalid('Height must be greater than zero.')
  if (body.kilograms > 650) return invalid('That weight looks too large — please check the value.')
  if (body.centimeters > 300) return invalid('That height looks too large — please check the value.')

  return ok(body)
}

/**
 * Shared input handling for the BMR and Calorie calculators, so the two agree
 * on units and validation instead of each keeping a copy.
 */
export function normalizeBodyInputs(inputs: BodyInputs): CalculatorOutcome<NormalizedBody> {
  const { system, age, weight, heightCm, heightFeet, heightInches } = inputs

  if (system === 'metric') {
    if (anyBlank(age, weight, heightCm)) return { state: 'empty' }

    const parsed = parseNumbers(age, weight, heightCm)
    if (!parsed) return invalid('Please enter numbers only.')

    const [years, kilograms, centimeters] = parsed
    return validateBody({ kilograms, centimeters, age: years })
  }

  if (anyBlank(age, weight, heightFeet)) return { state: 'empty' }

  const parsed = parseNumbers(
    age,
    weight,
    heightFeet,
    heightInches.trim() === '' ? '0' : heightInches,
  )
  if (!parsed) return invalid('Please enter numbers only.')

  const [years, pounds, feet, inches] = parsed
  if (inches < 0 || inches >= 12) return invalid('Inches must be between 0 and 11.')

  return validateBody({
    kilograms: poundsToKilograms(pounds),
    centimeters: feetAndInchesToCentimeters(feet, inches),
    age: years,
  })
}

export function evaluateBmr(inputs: BodyInputs): CalculatorOutcome<BmrResult> {
  const normalized = normalizeBodyInputs(inputs)
  if (normalized.state !== 'ok') return normalized

  const { kilograms, centimeters, age } = normalized.value
  return ok(calculateBmr(kilograms, centimeters, age, inputs.sex))
}
