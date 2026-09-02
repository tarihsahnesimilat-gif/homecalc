import { type CalculatorOutcome, anyBlank, invalid, ok, parseNumbers } from '../calculator-validation.ts'

export interface PercentageOfResult {
  amount: number
  percent: number
  number: number
}

/** X% of Y — the most common percentage question, on its own page. */
export function calculatePercentageOf(percent: number, value: number): PercentageOfResult {
  return { amount: (percent / 100) * value, percent, number: value }
}

export function evaluatePercentageOf(
  rawPercent: string,
  rawNumber: string,
): CalculatorOutcome<PercentageOfResult> {
  if (anyBlank(rawPercent, rawNumber)) return { state: 'empty' }

  const parsed = parseNumbers(rawPercent, rawNumber)
  if (!parsed) return invalid('Please enter numbers only.')

  return ok(calculatePercentageOf(parsed[0], parsed[1]))
}
