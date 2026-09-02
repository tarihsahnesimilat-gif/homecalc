import { type CalculatorOutcome, anyBlank, invalid, ok, parseNumbers } from '../calculator-validation.ts'
import {
  type CalendarDate,
  addDays,
  formatDateInput,
  parseDateInput,
  weekdayName,
} from './date-utils.ts'

export type DateDirection = 'add' | 'subtract'

export interface DateCalculatorResult {
  resultDate: CalendarDate
  /** `YYYY-MM-DD`, ready for a date input or a link. */
  formatted: string
  weekday: string
  startDate: CalendarDate
  startWeekday: string
  days: number
  direction: DateDirection
}

/**
 * Adds or subtracts whole days from a date.
 *
 * The arithmetic goes through the day-number helpers in `date-utils`, so leap
 * years, month lengths and century rules are handled by the calendar
 * conversion itself rather than by special cases here.
 */
export function shiftDate(
  startDate: CalendarDate,
  days: number,
  direction: DateDirection,
): DateCalculatorResult {
  const offset = direction === 'subtract' ? -days : days
  const resultDate = addDays(startDate, offset)

  return {
    resultDate,
    formatted: formatDateInput(resultDate),
    weekday: weekdayName(resultDate),
    startDate,
    startWeekday: weekdayName(startDate),
    days,
    direction,
  }
}

export function evaluateDateCalculator(
  rawStartDate: string,
  rawDays: string,
  direction: DateDirection,
): CalculatorOutcome<DateCalculatorResult> {
  if (anyBlank(rawStartDate, rawDays)) return { state: 'empty' }

  const startDate = parseDateInput(rawStartDate)
  if (!startDate) return invalid('Enter a valid start date.')

  const parsed = parseNumbers(rawDays)
  if (!parsed) return invalid('Enter the number of days.')

  const days = parsed[0]
  if (!Number.isInteger(days)) return invalid('Enter a whole number of days.')
  if (days < 0) {
    return invalid('Enter a positive number of days and choose whether to add or subtract.')
  }

  return ok(shiftDate(startDate, days, direction))
}
