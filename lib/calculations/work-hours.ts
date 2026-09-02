import { type CalculatorOutcome, anyBlank, invalid, ok, parseNumbers } from '../calculator-validation.ts'
import { type DurationParts, minutesBetween, parseTimeInput, toDurationParts } from './time-utils.ts'

export interface WorkHoursResult {
  /** Clock-in to clock-out, before the break is taken off. */
  gross: DurationParts
  /** What is actually worked, once the break is deducted. */
  net: DurationParts
  breakMinutes: number
}

/**
 * Hours worked in a shift, minus an unpaid break.
 *
 * Overnight shifts need no special handling: an end time earlier than the
 * start rolls over midnight, so 22:00 to 06:00 is eight hours.
 */
export function evaluateWorkHours(
  rawStart: string,
  rawEnd: string,
  rawBreakMinutes: string,
): CalculatorOutcome<WorkHoursResult> {
  if (anyBlank(rawStart, rawEnd, rawBreakMinutes)) return { state: 'empty' }

  const start = parseTimeInput(rawStart)
  if (start === null) return invalid('Enter a valid start time.')

  const end = parseTimeInput(rawEnd)
  if (end === null) return invalid('Enter a valid end time.')

  const parsed = parseNumbers(rawBreakMinutes)
  if (!parsed) return invalid('Enter the break as a number of minutes.')

  const breakMinutes = parsed[0]
  if (breakMinutes < 0) return invalid('The break cannot be negative.')
  if (!Number.isInteger(breakMinutes)) return invalid('Enter the break as whole minutes.')

  const grossMinutes = minutesBetween(start, end)
  if (breakMinutes > grossMinutes) {
    return invalid('The break is longer than the shift itself.')
  }

  return ok({
    gross: toDurationParts(grossMinutes, end < start),
    net: toDurationParts(grossMinutes - breakMinutes, end < start),
    breakMinutes,
  })
}
