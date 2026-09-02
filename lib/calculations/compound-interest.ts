import { type CalculatorOutcome, anyBlank, invalid, ok, parseNumbers } from '../calculator-validation.ts'

/** How many times a year interest is added to the balance. */
export type CompoundingFrequency = 'annually' | 'semi-annually' | 'quarterly' | 'monthly' | 'daily'

export const COMPOUNDING_PERIODS: Readonly<Record<CompoundingFrequency, number>> = {
  annually: 1,
  'semi-annually': 2,
  quarterly: 4,
  monthly: 12,
  daily: 365,
}

export interface CompoundInterestResult {
  principal: number
  finalAmount: number
  totalInterest: number
  periodsPerYear: number
}

/**
 * The standard compound interest model, A = P(1 + r/n)^(nt).
 *
 * A mathematical projection at a fixed rate — real accounts vary with rate
 * changes, fees and tax.
 */
export function calculateCompoundInterest(
  principal: number,
  annualRate: number,
  frequency: CompoundingFrequency,
  years: number,
): CompoundInterestResult {
  const periodsPerYear = COMPOUNDING_PERIODS[frequency]
  const finalAmount =
    principal * Math.pow(1 + annualRate / 100 / periodsPerYear, periodsPerYear * years)

  return {
    principal,
    finalAmount,
    totalInterest: finalAmount - principal,
    periodsPerYear,
  }
}

export function isCompoundingFrequency(value: string): value is CompoundingFrequency {
  return Object.prototype.hasOwnProperty.call(COMPOUNDING_PERIODS, value)
}

export function evaluateCompoundInterest(
  rawPrincipal: string,
  rawRate: string,
  frequency: string,
  rawYears: string,
): CalculatorOutcome<CompoundInterestResult> {
  if (anyBlank(rawPrincipal, rawRate, rawYears)) return { state: 'empty' }

  if (!isCompoundingFrequency(frequency)) {
    return invalid('Choose how often the interest compounds.')
  }

  const parsed = parseNumbers(rawPrincipal, rawRate, rawYears)
  if (!parsed) return invalid('Please enter numbers only.')

  const [principal, rate, years] = parsed
  if (principal <= 0) return invalid('The principal must be greater than zero.')
  if (rate < 0) return invalid('The interest rate cannot be negative.')
  if (years <= 0) return invalid('The time period must be greater than zero.')

  return ok(calculateCompoundInterest(principal, rate, frequency, years))
}
