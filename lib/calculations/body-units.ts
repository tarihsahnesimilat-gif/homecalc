/**
 * Unit conversions shared by the BMI, BMR and Calorie calculators.
 *
 * All three accept metric or imperial input and calculate in metric, so the
 * conversions live in one place rather than in each calculator.
 */

/** Exact international definition. */
const KILOGRAMS_PER_POUND = 0.45359237
const CENTIMETERS_PER_INCH = 2.54
const INCHES_PER_FOOT = 12

export function poundsToKilograms(pounds: number): number {
  return pounds * KILOGRAMS_PER_POUND
}

export function feetAndInchesToCentimeters(feet: number, inches: number): number {
  return (feet * INCHES_PER_FOOT + inches) * CENTIMETERS_PER_INCH
}

export function centimetersToMeters(centimeters: number): number {
  return centimeters / 100
}
