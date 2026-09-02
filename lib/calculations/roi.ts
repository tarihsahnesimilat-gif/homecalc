import { type CalculatorOutcome, anyBlank, invalid, ok, parseNumbers } from '../calculator-validation.ts'

export interface RoiResult {
  /** Negative when the investment lost money — a valid outcome, not an error. */
  gain: number
  roiPercent: number
  initialInvestment: number
  finalValue: number
}

/** ROI% = ((final - initial) / initial) x 100. */
export function calculateRoi(initialInvestment: number, finalValue: number): RoiResult {
  const gain = finalValue - initialInvestment

  return {
    gain,
    roiPercent: (gain / initialInvestment) * 100,
    initialInvestment,
    finalValue,
  }
}

export function evaluateRoi(
  rawInitial: string,
  rawFinal: string,
): CalculatorOutcome<RoiResult> {
  if (anyBlank(rawInitial, rawFinal)) return { state: 'empty' }

  const parsed = parseNumbers(rawInitial, rawFinal)
  if (!parsed) return invalid('Please enter numbers only.')

  const [initialInvestment, finalValue] = parsed
  if (initialInvestment <= 0) {
    return invalid('The initial investment must be greater than zero — ROI is a share of it.')
  }
  if (finalValue < 0) return invalid('The final value cannot be negative.')

  return ok(calculateRoi(initialInvestment, finalValue))
}
