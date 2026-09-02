import { type CalculatorOutcome, anyBlank, invalid, ok, parseNumbers } from '../calculator-validation.ts'

export type TimeUnit = 'years' | 'months'

export interface InterestResult {
  interest: number
  total: number
  principal: number
  years: number
}

/** Months are converted to years so the annual rate applies correctly. */
export function toYears(time: number, unit: TimeUnit): number {
  return unit === 'months' ? time / 12 : time
}

export function calculateSimpleInterest(
  principal: number,
  rate: number,
  years: number,
): InterestResult {
  const interest = (principal * rate * years) / 100

  return { interest, total: principal + interest, principal, years }
}

export function evaluateSimpleInterest(
  unit: TimeUnit,
  rawPrincipal: string,
  rawRate: string,
  rawTime: string,
): CalculatorOutcome<InterestResult> {
  if (anyBlank(rawPrincipal, rawRate, rawTime)) return { state: 'empty' }

  const parsed = parseNumbers(rawPrincipal, rawRate, rawTime)
  if (!parsed) return invalid('Please enter numbers only.')

  const [principal, rate, time] = parsed
  if (principal < 0) return invalid('The principal cannot be negative.')
  if (rate < 0) return invalid('The interest rate cannot be negative.')
  if (time < 0) return invalid('The time period cannot be negative.')

  return ok(calculateSimpleInterest(principal, rate, toYears(time, unit)))
}
