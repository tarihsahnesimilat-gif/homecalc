import { type CalculatorOutcome, anyBlank, invalid, ok, parseNumbers } from '../calculator-validation.ts'

export interface InvestmentResult {
  finalValue: number
  /** Everything paid in: the initial sum plus every contribution. */
  totalContributions: number
  /** Final value less everything paid in. */
  growth: number
  initialInvestment: number
  monthlyContribution: number
  months: number
}

/**
 * Compound growth with regular monthly contributions.
 *
 * The model makes four simplifications, all of them stated on the page:
 *   - contributions are made at the end of each month
 *   - growth compounds monthly at a constant rate
 *   - no fees, tax or inflation
 *   - the rate never varies
 *
 * It is an arithmetic projection of those assumptions, not a prediction of
 * what any real investment will do.
 */
export function calculateInvestment(
  initialInvestment: number,
  monthlyContribution: number,
  annualRate: number,
  years: number,
): InvestmentResult {
  const months = Math.round(years * 12)
  const monthlyRate = annualRate / 100 / 12

  // With no growth the balance is simply everything paid in, and the annuity
  // term below would divide by zero.
  const finalValue =
    monthlyRate === 0
      ? initialInvestment + monthlyContribution * months
      : initialInvestment * Math.pow(1 + monthlyRate, months) +
        monthlyContribution * ((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate)

  const totalContributions = initialInvestment + monthlyContribution * months

  return {
    finalValue,
    totalContributions,
    growth: finalValue - totalContributions,
    initialInvestment,
    monthlyContribution,
    months,
  }
}

export function evaluateInvestment(
  rawInitial: string,
  rawMonthly: string,
  rawRate: string,
  rawYears: string,
): CalculatorOutcome<InvestmentResult> {
  if (anyBlank(rawInitial, rawMonthly, rawRate, rawYears)) return { state: 'empty' }

  const parsed = parseNumbers(rawInitial, rawMonthly, rawRate, rawYears)
  if (!parsed) return invalid('Please enter numbers only.')

  const [initial, monthly, rate, years] = parsed
  if (initial < 0) return invalid('The initial investment cannot be negative.')
  if (monthly < 0) return invalid('The monthly contribution cannot be negative.')
  if (rate < 0) return invalid('The rate of return cannot be negative.')
  if (years <= 0) return invalid('The time period must be greater than zero.')
  if (initial === 0 && monthly === 0) {
    return invalid('Enter an initial investment, a monthly contribution, or both.')
  }

  return ok(calculateInvestment(initial, monthly, rate, years))
}
