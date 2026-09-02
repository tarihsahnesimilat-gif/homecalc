import { type CalculatorOutcome, anyBlank, invalid, ok, parseNumbers } from '../calculator-validation.ts'
import { normalizePrecision } from './precision.ts'

export interface ExponentResult {
  value: number
  base: number
  exponent: number
}

export function calculateExponent(base: number, exponent: number): number {
  return normalizePrecision(Math.pow(base, exponent))
}

export function evaluateExponent(
  rawBase: string,
  rawExponent: string,
): CalculatorOutcome<ExponentResult> {
  if (anyBlank(rawBase, rawExponent)) return { state: 'empty' }

  const parsed = parseNumbers(rawBase, rawExponent)
  if (!parsed) return invalid('Please enter numbers only.')

  const [base, exponent] = parsed

  // 0^0 has no agreed value — different areas of maths define it differently —
  // so it is reported rather than guessed at.
  if (base === 0 && exponent === 0) {
    return invalid('0 to the power of 0 is undefined.')
  }
  if (base === 0 && exponent < 0) {
    return invalid('A negative power of zero is undefined — it would divide by zero.')
  }
  // A fractional power of a negative base is an even root of a negative
  // number, which has no real answer.
  if (base < 0 && !Number.isInteger(exponent)) {
    return invalid('A fractional power of a negative number has no real answer.')
  }

  const value = calculateExponent(base, exponent)
  if (!Number.isFinite(value)) {
    return invalid('That power is too large to represent.')
  }

  return ok({ value, base, exponent })
}
