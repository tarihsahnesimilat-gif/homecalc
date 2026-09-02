/**
 * Rounds away floating-point noise without touching real precision.
 *
 * Chained arithmetic can turn an exact result into something like
 * 12.000000000000002. A double carries 15 to 17 significant digits, so rounding
 * to 12 discards only the accumulated error while keeping far more precision
 * than any displayed result needs.
 */
export function normalizePrecision(value: number): number {
  return Number.isFinite(value) ? Number(value.toPrecision(12)) : value
}
