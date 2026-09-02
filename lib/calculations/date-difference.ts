import { type CalculatorOutcome, anyBlank, invalid, ok } from '../calculator-validation.ts'
import {
  type CalendarDate,
  type CalendarSpan,
  calendarSpan,
  differenceInDays,
  parseDateInput,
} from './date-utils.ts'

/**
 * The difference between two dates.
 *
 * Counting is **exclusive**: the span is the distance from one date to the
 * other, so 1 January to 2 January is one day. `inclusiveDays` adds the
 * starting day back for callers that need to count both endpoints, as you
 * would when counting how many days a booking covers.
 */
export interface DateDifferenceResult {
  span: CalendarSpan
  totalDays: number
  totalWeeks: number
  remainingDays: number
  /** Both endpoints counted, always `totalDays + 1`. */
  inclusiveDays: number
  /** True when the end date was earlier than the start date. */
  reversed: boolean
  earlier: CalendarDate
  later: CalendarDate
}

/**
 * Dates given in reverse order are accepted and measured by magnitude, with
 * `reversed` set so the UI can say so. Nobody entering two dates wants an
 * error simply because they typed them the other way round.
 */
export function calculateDateDifference(
  start: CalendarDate,
  end: CalendarDate,
): DateDifferenceResult {
  const reversed = differenceInDays(start, end) < 0
  const earlier = reversed ? end : start
  const later = reversed ? start : end
  const totalDays = differenceInDays(earlier, later)

  return {
    span: calendarSpan(earlier, later),
    totalDays,
    totalWeeks: Math.floor(totalDays / 7),
    remainingDays: totalDays % 7,
    inclusiveDays: totalDays + 1,
    reversed,
    earlier,
    later,
  }
}

export function evaluateDateDifference(
  rawStart: string,
  rawEnd: string,
): CalculatorOutcome<DateDifferenceResult> {
  if (anyBlank(rawStart, rawEnd)) return { state: 'empty' }

  const start = parseDateInput(rawStart)
  if (!start) return invalid('Enter a valid start date.')

  const end = parseDateInput(rawEnd)
  if (!end) return invalid('Enter a valid end date.')

  return ok(calculateDateDifference(start, end))
}
