import { type CalculatorOutcome, anyBlank, invalid, ok, parseNumbers } from '../calculator-validation.ts'

export type AreaShape = 'rectangle' | 'circle' | 'triangle'

/** `metric` measures in metres, `imperial` in feet. */
export type AreaUnits = 'metric' | 'imperial'

/** Exact definitions, so the reported units always agree with one another. */
const SQUARE_METRES_PER_SQUARE_FOOT = 0.09290304
const SQUARE_METRES_PER_SQUARE_YARD = 0.83612736

export interface AreaResult {
  squareMeters: number
  squareFeet: number
  squareYards: number
  shape: AreaShape
  /** The dimension the shape was built from, for showing the working. */
  perimeterOrCircumference: number
}

/**
 * Area of the three shapes that cover most household jobs: a rectangular room
 * or plot, a circular patio or pond, and a triangular gable or offcut.
 *
 * As with the Concrete calculator, everything is computed once in square metres
 * and converted from there, so the three unit figures cannot drift apart.
 */
export function calculateArea(
  shape: AreaShape,
  units: AreaUnits,
  first: number,
  second: number,
): AreaResult {
  // Work in the entered unit, then convert the finished area once.
  let area: number
  let edge: number

  if (shape === 'rectangle') {
    area = first * second
    edge = 2 * (first + second)
  } else if (shape === 'circle') {
    // `first` is the radius; the second dimension is unused.
    area = Math.PI * first * first
    edge = 2 * Math.PI * first
  } else {
    // Triangle from base and perpendicular height.
    area = (first * second) / 2
    edge = 0
  }

  const squareMeters = units === 'metric' ? area : area * SQUARE_METRES_PER_SQUARE_FOOT

  return {
    squareMeters,
    squareFeet: squareMeters / SQUARE_METRES_PER_SQUARE_FOOT,
    squareYards: squareMeters / SQUARE_METRES_PER_SQUARE_YARD,
    shape,
    perimeterOrCircumference: edge,
  }
}

export function evaluateArea(
  shape: AreaShape,
  units: AreaUnits,
  rawFirst: string,
  rawSecond: string,
): CalculatorOutcome<AreaResult> {
  // A circle needs only its radius.
  const needsSecond = shape !== 'circle'

  if (anyBlank(rawFirst)) return { state: 'empty' }
  if (needsSecond && anyBlank(rawSecond)) return { state: 'empty' }

  const parsed = parseNumbers(rawFirst, needsSecond ? rawSecond : '0')
  if (!parsed) return invalid('Please enter numbers only.')

  const [first, second] = parsed
  if (first <= 0) return invalid('Dimensions must be greater than zero.')
  if (needsSecond && second <= 0) return invalid('Dimensions must be greater than zero.')

  return ok(calculateArea(shape, units, first, second))
}
