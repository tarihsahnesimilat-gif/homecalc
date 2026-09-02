import { type CalculatorOutcome, invalid, isBlank, ok, parseNumbers } from '../calculator-validation.ts'
import { minutesBetween, parseTimeInput } from './time-utils.ts'

export interface HoursEntry {
  start: string
  end: string
}

export interface HoursEntryResult {
  start: string
  end: string
  minutes: number
  crossesMidnight: boolean
}

export interface HoursResult {
  entries: readonly HoursEntryResult[]
  totalMinutes: number
  hours: number
  minutes: number
  /** Total as a decimal, which is what payroll systems expect. */
  decimalHours: number
  /** Pay for the total, when an hourly rate was supplied. */
  pay: number | null
  hourlyRate: number | null
}

/**
 * Adds up several start-and-end pairs — a week of shifts, or a set of billable
 * sessions.
 *
 * Time Duration measures one span and Work Hours handles a single shift with a
 * break; this totals many entries at once, which is the timesheet case neither
 * covers. Each row rolls over midnight independently, so an overnight shift
 * sits happily alongside day ones.
 *
 * Rows left blank are skipped rather than counted as zero.
 */
export function evaluateHours(
  entries: readonly HoursEntry[],
  rawHourlyRate: string,
): CalculatorOutcome<HoursResult> {
  const filled = entries.filter((entry) => !isBlank(entry.start) || !isBlank(entry.end))
  if (filled.length === 0) return { state: 'empty' }

  // A half-filled row is a mistake worth reporting rather than quietly ignoring.
  if (filled.some((entry) => isBlank(entry.start) || isBlank(entry.end))) {
    return invalid('Every row needs both a start and an end time.')
  }

  const results: HoursEntryResult[] = []
  for (const entry of filled) {
    const start = parseTimeInput(entry.start)
    const end = parseTimeInput(entry.end)
    if (start === null || end === null) return invalid('Enter valid times in every row.')

    results.push({
      start: entry.start,
      end: entry.end,
      minutes: minutesBetween(start, end),
      crossesMidnight: end < start,
    })
  }

  let hourlyRate: number | null = null
  if (!isBlank(rawHourlyRate)) {
    const parsed = parseNumbers(rawHourlyRate)
    if (!parsed) return invalid('Enter the hourly rate as a number.')
    if (parsed[0] < 0) return invalid('The hourly rate cannot be negative.')
    hourlyRate = parsed[0]
  }

  const totalMinutes = results.reduce((total, entry) => total + entry.minutes, 0)
  const decimalHours = totalMinutes / 60

  return ok({
    entries: results,
    totalMinutes,
    hours: Math.floor(totalMinutes / 60),
    minutes: totalMinutes % 60,
    decimalHours,
    pay: hourlyRate === null ? null : decimalHours * hourlyRate,
    hourlyRate,
  })
}
