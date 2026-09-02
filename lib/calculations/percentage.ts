import { type CalculatorOutcome, anyBlank, invalid, ok, parseNumbers } from '../calculator-validation.ts'

export type PercentageMode = 'of' | 'what' | 'change' | 'increase' | 'decrease'

export interface PercentageResult {
  /** `null` when the calculation is undefined, e.g. division by zero. */
  value: number | null
  /** Set when `value` is null, explaining why. */
  error?: string
  /** True when the answer is itself a percentage. */
  isPercent: boolean
}

/**
 * `a` is always the first field and `b` the second, matching the field labels
 * shown for each mode.
 */
export function calculatePercentage(
  mode: PercentageMode,
  a: number,
  b: number,
): PercentageResult {
  switch (mode) {
    case 'of':
      return { value: (a / 100) * b, isPercent: false }
    case 'what':
      return b === 0
        ? {
            value: null,
            error: 'The second number cannot be zero — nothing can be a percentage of zero.',
            isPercent: true,
          }
        : { value: (a / b) * 100, isPercent: true }
    case 'change':
      return a === 0
        ? {
            value: null,
            error: 'The original value cannot be zero — percentage change needs a baseline.',
            isPercent: true,
          }
        : { value: ((b - a) / a) * 100, isPercent: true }
    case 'increase':
      return { value: a * (1 + b / 100), isPercent: false }
    case 'decrease':
      return { value: a * (1 - b / 100), isPercent: false }
  }
}

export function evaluatePercentage(
  mode: PercentageMode,
  rawA: string,
  rawB: string,
): CalculatorOutcome<PercentageResult> {
  if (anyBlank(rawA, rawB)) return { state: 'empty' }

  const parsed = parseNumbers(rawA, rawB)
  if (!parsed) return invalid('Please enter numbers only.')

  return ok(calculatePercentage(mode, parsed[0], parsed[1]))
}
