import { type CalculatorOutcome, anyBlank, invalid, ok, parseNumbers } from '../calculator-validation.ts'

/**
 * `imperial` takes length and width in feet with the depth in inches — how
 * slabs are usually specified in the US. `metric` takes metres with the depth
 * in centimetres.
 */
export type ConcreteUnits = 'imperial' | 'metric'

/** Exact definitions, so the three volume figures always agree. */
const CUBIC_METRES_PER_CUBIC_FOOT = 0.028316846592
const CUBIC_METRES_PER_CUBIC_YARD = 0.764554857984

export interface ConcreteResult {
  /** Volume before any waste allowance, in each unit. */
  cubicMeters: number
  cubicFeet: number
  cubicYards: number
  /** The same volume with the waste allowance added. */
  withWasteCubicMeters: number
  withWasteCubicFeet: number
  withWasteCubicYards: number
  wastePercent: number
}

/**
 * Volume of a rectangular slab.
 *
 * Everything is computed once in cubic metres and then converted, rather than
 * running three parallel calculations that could drift apart. Only two exact
 * constants are needed, so this does not duplicate the Unit Converter.
 */
export function calculateConcrete(
  units: ConcreteUnits,
  length: number,
  width: number,
  depth: number,
  wastePercent: number,
): ConcreteResult {
  const cubicMeters =
    units === 'metric'
      ? length * width * (depth / 100)
      : // Feet and inches: the depth becomes a fraction of a foot first.
        length * width * (depth / 12) * CUBIC_METRES_PER_CUBIC_FOOT

  const wasteFactor = 1 + wastePercent / 100

  return {
    cubicMeters,
    cubicFeet: cubicMeters / CUBIC_METRES_PER_CUBIC_FOOT,
    cubicYards: cubicMeters / CUBIC_METRES_PER_CUBIC_YARD,
    withWasteCubicMeters: cubicMeters * wasteFactor,
    withWasteCubicFeet: (cubicMeters * wasteFactor) / CUBIC_METRES_PER_CUBIC_FOOT,
    withWasteCubicYards: (cubicMeters * wasteFactor) / CUBIC_METRES_PER_CUBIC_YARD,
    wastePercent,
  }
}

export function evaluateConcrete(
  units: ConcreteUnits,
  rawLength: string,
  rawWidth: string,
  rawDepth: string,
  rawWaste: string,
): CalculatorOutcome<ConcreteResult> {
  if (anyBlank(rawLength, rawWidth, rawDepth)) return { state: 'empty' }

  // The waste allowance is optional; leaving it blank means none.
  const parsed = parseNumbers(rawLength, rawWidth, rawDepth, rawWaste.trim() === '' ? '0' : rawWaste)
  if (!parsed) return invalid('Please enter numbers only.')

  const [length, width, depth, waste] = parsed
  if (length <= 0 || width <= 0 || depth <= 0) {
    return invalid('Length, width and depth must all be greater than zero.')
  }
  if (waste < 0) return invalid('The waste allowance cannot be negative.')
  if (waste > 100) return invalid('A waste allowance above 100% would more than double the order.')

  return ok(calculateConcrete(units, length, width, depth, waste))
}
