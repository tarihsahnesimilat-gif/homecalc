import { type CalculatorOutcome, anyBlank, invalid, ok, parseNumbers } from '../calculator-validation.ts'

/**
 * The commonly cited energy content of body fat. Both are rounded rules of
 * thumb rather than precise constants — real weight change also involves water,
 * glycogen and lean tissue, and the body adapts as intake falls.
 */
const CALORIES_PER_KILOGRAM = 7700
const CALORIES_PER_POUND = 3500

/** Below this, intake is low enough that it should not be self-prescribed. */
const LOW_INTAKE_THRESHOLD = 1200

export interface CalorieDeficitResult {
  targetIntake: number
  dailyDeficit: number
  weeklyDeficit: number
  /** Projected change, on the rule-of-thumb constants above. */
  weeklyLossKg: number
  weeklyLossLb: number
  maintenanceCalories: number
  /** True when the target falls below a level generally considered very low. */
  isVeryLowIntake: boolean
}

export function calculateCalorieDeficit(
  maintenanceCalories: number,
  dailyDeficit: number,
): CalorieDeficitResult {
  const weeklyDeficit = dailyDeficit * 7
  const targetIntake = maintenanceCalories - dailyDeficit

  return {
    targetIntake,
    dailyDeficit,
    weeklyDeficit,
    weeklyLossKg: weeklyDeficit / CALORIES_PER_KILOGRAM,
    weeklyLossLb: weeklyDeficit / CALORIES_PER_POUND,
    maintenanceCalories,
    isVeryLowIntake: targetIntake < LOW_INTAKE_THRESHOLD,
  }
}

export function evaluateCalorieDeficit(
  rawMaintenance: string,
  rawDeficit: string,
): CalculatorOutcome<CalorieDeficitResult> {
  if (anyBlank(rawMaintenance, rawDeficit)) return { state: 'empty' }

  const parsed = parseNumbers(rawMaintenance, rawDeficit)
  if (!parsed) return invalid('Please enter numbers only.')

  const [maintenance, deficit] = parsed
  if (maintenance <= 0) return invalid('Maintenance calories must be greater than zero.')
  if (deficit < 0) return invalid('The deficit cannot be negative.')
  if (deficit >= maintenance) {
    return invalid('That deficit would leave nothing to eat. It must be below your maintenance level.')
  }

  return ok(calculateCalorieDeficit(maintenance, deficit))
}
