import { type CalculatorOutcome, invalid, isBlank, ok } from '../calculator-validation.ts'

export interface AverageSummary {
  sum: number
  count: number
  average: number
}

export function calculateAverage(values: readonly number[]): AverageSummary {
  const sum = values.reduce((total, value) => total + value, 0)

  return { sum, count: values.length, average: sum / values.length }
}

/**
 * Blank rows are skipped rather than counted as zero; a typed `0` is a real
 * value and does count.
 */
export function evaluateAverage(rawValues: readonly string[]): CalculatorOutcome<AverageSummary> {
  const filled = rawValues.filter((value) => !isBlank(value))
  if (filled.length === 0) return { state: 'empty' }

  const numbers = filled.map(Number)
  if (numbers.some((value) => !Number.isFinite(value))) {
    return invalid('Please enter numbers only.')
  }

  return ok(calculateAverage(numbers))
}
