/**
 * Clock-time helpers shared by the Time Duration and Work Hours calculators.
 *
 * Times are held as minutes past midnight rather than as Date objects. A Date
 * carries a calendar day and a timezone, neither of which a wall-clock time
 * has, and both of which cause off-by-one errors across daylight saving.
 */

export const MINUTES_PER_DAY = 24 * 60

/** Parses the `HH:MM` value produced by an `input type="time"`. */
export function parseTimeInput(raw: string): number | null {
  const match = /^(\d{1,2}):(\d{2})$/.exec(raw.trim())
  if (!match) return null

  const hours = Number(match[1])
  const minutes = Number(match[2])
  if (hours < 0 || hours > 23 || minutes < 0 || minutes > 59) return null

  return hours * 60 + minutes
}

/**
 * Minutes from `start` to `end`, rolling over midnight when the end time is
 * earlier than the start.
 *
 * Equal times give zero rather than a full day: entering the same time twice
 * means no elapsed time, not a 24-hour shift.
 */
export function minutesBetween(startMinutes: number, endMinutes: number): number {
  const difference = endMinutes - startMinutes
  return difference < 0 ? difference + MINUTES_PER_DAY : difference
}

export interface DurationParts {
  hours: number
  minutes: number
  totalMinutes: number
  /** True when the span rolls past midnight. */
  crossesMidnight: boolean
}

export function toDurationParts(totalMinutes: number, crossesMidnight = false): DurationParts {
  return {
    hours: Math.floor(totalMinutes / 60),
    minutes: totalMinutes % 60,
    totalMinutes,
    crossesMidnight,
  }
}
