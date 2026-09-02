import { type CalculatorOutcome, anyBlank, invalid, ok, parseNumbers } from '../calculator-validation.ts'
import { calculateInvestment } from './investment.ts'

export interface SavingsResult {
  finalBalance: number
  totalContributions: number
  interestEarned: number
  startingBalance: number
  monthlyContribution: number
  months: number
}

/**
 * Savings growth with regular monthly deposits.
 *
 * The maths is identical to the Investment Calculator — a starting sum plus a
 * monthly annuity, compounded monthly — so it delegates rather than repeating
 * the formula. What differs is the framing: a savings rate is usually a known,
 * quoted figure, where an investment return is an assumption.
 *
 * Assumptions: deposits at the end of each month, monthly compounding, a rate
 * that never changes, and no fees or tax.
 */
export function calculateSavings(
  startingBalance: number,
  monthlyContribution: number,
  annualRate: number,
  years: number,
): SavingsResult {
  const projection = calculateInvestment(startingBalance, monthlyContribution, annualRate, years)

  return {
    finalBalance: projection.finalValue,
    totalContributions: projection.totalContributions,
    interestEarned: projection.growth,
    startingBalance,
    monthlyContribution,
    months: projection.months,
  }
}

export function evaluateSavings(
  rawStarting: string,
  rawMonthly: string,
  rawRate: string,
  rawYears: string,
): CalculatorOutcome<SavingsResult> {
  if (anyBlank(rawStarting, rawMonthly, rawRate, rawYears)) return { state: 'empty' }

  const parsed = parseNumbers(rawStarting, rawMonthly, rawRate, rawYears)
  if (!parsed) return invalid('Please enter numbers only.')

  const [starting, monthly, rate, years] = parsed
  if (starting < 0) return invalid('The starting balance cannot be negative.')
  if (monthly < 0) return invalid('The monthly contribution cannot be negative.')
  if (rate < 0) return invalid('The interest rate cannot be negative.')
  if (years <= 0) return invalid('The time period must be greater than zero.')
  if (starting === 0 && monthly === 0) {
    return invalid('Enter a starting balance, a monthly contribution, or both.')
  }

  return ok(calculateSavings(starting, monthly, rate, years))
}
