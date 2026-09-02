import { type CalculatorOutcome, anyBlank, invalid, ok } from '../calculator-validation.ts'
import { type CalendarDate, differenceInDays, parseDateInput } from './date-utils.ts'

/**
 * Days between two dates.
 *
 * Counting is **exclusive**, matching the Date Difference calculator: 1 January
 * to 2 January is one day. `inclusiveDays` counts both endpoints for cases
 * where that is what you want, such as the number of days a stay covers.
 */
export interface DaysBetweenResult {
  totalDays: number
  weeks: number
  remainingDays: number
  inclusiveDays: number
  reversed: boolean
  earlier: CalendarDate
  later: CalendarDate
}

/**
 * Deliberately thin: the calendar arithmetic lives in `date-utils`, shared with
 * the Age and Date Difference calculators, so the three can never disagree.
 */
export function calculateDaysBetween(
  start: CalendarDate,
  end: CalendarDate,
): DaysBetweenResult {
  const signedDays = differenceInDays(start, end)
  const reversed = signedDays < 0
  const totalDays = Math.abs(signedDays)

  return {
    totalDays,
    weeks: Math.floor(totalDays / 7),
    remainingDays: totalDays % 7,
    inclusiveDays: totalDays + 1,
    reversed,
    earlier: reversed ? end : start,
    later: reversed ? start : end,
  }
}

export function evaluateDaysBetween(
  rawStart: string,
  rawEnd: string,
): CalculatorOutcome<DaysBetweenResult> {
  if (anyBlank(rawStart, rawEnd)) return { state: 'empty' }

  const start = parseDateInput(rawStart)
  if (!start) return invalid('Enter a valid start date.')

  const end = parseDateInput(rawEnd)
  if (!end) return invalid('Enter a valid end date.')

  return ok(calculateDaysBetween(start, end))
}
