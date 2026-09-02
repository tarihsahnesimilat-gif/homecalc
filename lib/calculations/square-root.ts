import { type CalculatorOutcome, invalid, isBlank, ok, parseNumbers } from '../calculator-validation.ts'
import { normalizePrecision } from './precision.ts'

export interface SquareRootResult {
  root: number
  value: number
  /** True when the root is a whole number, e.g. 144 gives 12. */
  isPerfectSquare: boolean
}

export function calculateSquareRoot(value: number): SquareRootResult {
  const root = normalizePrecision(Math.sqrt(value))

  return { root, value, isPerfectSquare: Number.isInteger(root) }
}

export function evaluateSquareRoot(rawValue: string): CalculatorOutcome<SquareRootResult> {
  if (isBlank(rawValue)) return { state: 'empty' }

  const parsed = parseNumbers(rawValue)
  if (!parsed) return invalid('Please enter a number.')

  const [value] = parsed
  if (value < 0) {
    return invalid('A negative number has no real square root.')
  }

  return ok(calculateSquareRoot(value))
}
