/**
 * Shared number formatting for calculator results.
 *
 * The locale is fixed so the server and client render identical markup and
 * React never reports a hydration mismatch.
 */
const LOCALE = 'en-US'

/** General-purpose result formatting, e.g. percentages and plain numbers. */
export function formatNumber(value: number, maximumFractionDigits = 4): string {
  return value.toLocaleString(LOCALE, { maximumFractionDigits })
}

/**
 * Money-style formatting: grouped thousands and exactly two decimals.
 *
 * Deliberately currency-neutral — no symbol is baked in, so the same helper
 * works whatever currency a user has in mind. When the registry gains a
 * currency concept, only this function needs to change.
 */
export function formatAmount(value: number): string {
  return value.toLocaleString(LOCALE, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })
}
