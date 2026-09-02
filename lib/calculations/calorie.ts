import { type CalculatorOutcome, ok } from '../calculator-validation.ts'
import { type BmrResult, type BodyInputs, calculateBmr, normalizeBodyInputs } from './bmr.ts'

export type ActivityLevel =
  | 'sedentary'
  | 'lightly-active'
  | 'moderately-active'
  | 'very-active'
  | 'extra-active'

/** Widely used activity multipliers applied to BMR to estimate daily needs. */
export const ACTIVITY_MULTIPLIERS: Readonly<Record<ActivityLevel, number>> = {
  sedentary: 1.2,
  'lightly-active': 1.375,
  'moderately-active': 1.55,
  'very-active': 1.725,
  'extra-active': 1.9,
}

export const ACTIVITY_LABEL: Readonly<Record<ActivityLevel, string>> = {
  sedentary: 'Sedentary',
  'lightly-active': 'Lightly active',
  'moderately-active': 'Moderately active',
  'very-active': 'Very active',
  'extra-active': 'Extra active',
}

export interface CalorieResult {
  /** The same BMR the BMR calculator produces, reused rather than recalculated. */
  bmr: BmrResult
  multiplier: number
  /** Total daily energy expenditure — an estimate, not a prescription. */
  dailyCalories: number
  activityLevel: ActivityLevel
}

export function calculateCalories(bmr: BmrResult, activityLevel: ActivityLevel): CalorieResult {
  const multiplier = ACTIVITY_MULTIPLIERS[activityLevel]

  return {
    bmr,
    multiplier,
    dailyCalories: bmr.bmr * multiplier,
    activityLevel,
  }
}

export function evaluateCalories(
  inputs: BodyInputs,
  activityLevel: ActivityLevel,
): CalculatorOutcome<CalorieResult> {
  const normalized = normalizeBodyInputs(inputs)
  if (normalized.state !== 'ok') return normalized

  const { kilograms, centimeters, age } = normalized.value
  const bmr = calculateBmr(kilograms, centimeters, age, inputs.sex)

  return ok(calculateCalories(bmr, activityLevel))
}
