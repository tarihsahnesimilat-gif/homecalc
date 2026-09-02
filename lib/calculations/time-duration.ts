import { type CalculatorOutcome, anyBlank, invalid, ok } from '../calculator-validation.ts'
import { type DurationParts, minutesBetween, parseTimeInput, toDurationParts } from './time-utils.ts'

export type TimeDurationResult = DurationParts

/**
 * Elapsed time between two clock times, rolling over midnight when the end
 * time is earlier than the start: 23:00 to 01:30 is 2 hours 30 minutes.
 */
export function evaluateTimeDuration(
  rawStart: string,
  rawEnd: string,
): CalculatorOutcome<TimeDurationResult> {
  if (anyBlank(rawStart, rawEnd)) return { state: 'empty' }

  const start = parseTimeInput(rawStart)
  if (start === null) return invalid('Enter a valid start time.')

  const end = parseTimeInput(rawEnd)
  if (end === null) return invalid('Enter a valid end time.')

  return ok(toDurationParts(minutesBetween(start, end), end < start))
}
