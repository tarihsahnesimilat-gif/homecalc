import { type CalculatorOutcome, anyBlank, invalid, ok, parseNumbers } from '../calculator-validation.ts'

export interface Currency {
  code: string
  name: string
}

/**
 * Currency codes offered in the dropdowns.
 *
 * Codes and names only — no rate is ever stored here. Rates are fetched per
 * pair at the moment they are needed (see `lib/rates.ts`), because a figure
 * baked into the source would be wrong within a day while still looking
 * authoritative. Every code below is one Frankfurter publishes.
 */
export const CURRENCIES: readonly Currency[] = [
  { code: 'USD', name: 'US Dollar' },
  { code: 'EUR', name: 'Euro' },
  { code: 'GBP', name: 'British Pound' },
  { code: 'JPY', name: 'Japanese Yen' },
  { code: 'CAD', name: 'Canadian Dollar' },
  { code: 'AUD', name: 'Australian Dollar' },
  { code: 'CHF', name: 'Swiss Franc' },
  { code: 'CNY', name: 'Chinese Yuan' },
  { code: 'INR', name: 'Indian Rupee' },
  { code: 'TRY', name: 'Turkish Lira' },
  { code: 'BRL', name: 'Brazilian Real' },
  { code: 'ZAR', name: 'South African Rand' },
]

export interface CurrencyResult {
  convertedAmount: number
  /** The rate actually applied — always 1 when both currencies match. */
  rate: number
  inverseRate: number
  amount: number
  from: string
  to: string
  /** True when the two currencies are the same and the rate was forced to 1. */
  sameCurrency: boolean
}

export function calculateCurrency(
  amount: number,
  from: string,
  to: string,
  rate: number,
): CurrencyResult {
  // Converting a currency into itself is always 1:1, whatever was typed.
  const sameCurrency = from === to
  const effectiveRate = sameCurrency ? 1 : rate

  return {
    convertedAmount: amount * effectiveRate,
    rate: effectiveRate,
    inverseRate: 1 / effectiveRate,
    amount,
    from,
    to,
    sameCurrency,
  }
}

/**
 * Turns the raw amount and a fetched rate into a result.
 *
 * `rate` is null while the rate is still being fetched, or after a fetch
 * failed. Both cases are `empty` — the form reports the failure itself, and no
 * substitute rate is ever invented to fill the gap.
 */
export function evaluateCurrency(
  rawAmount: string,
  from: string,
  to: string,
  rate: number | null,
): CalculatorOutcome<CurrencyResult> {
  if (anyBlank(rawAmount)) return { state: 'empty' }

  const parsedAmount = parseNumbers(rawAmount)
  if (!parsedAmount) return invalid('Please enter a number.')

  const [amount] = parsedAmount
  if (amount < 0) return invalid('The amount cannot be negative.')

  if (from === to) return ok(calculateCurrency(amount, from, to, 1))

  if (rate === null) return { state: 'empty' }
  if (!Number.isFinite(rate) || rate <= 0) {
    return invalid('The exchange rate is not usable.')
  }

  return ok(calculateCurrency(amount, from, to, rate))
}
