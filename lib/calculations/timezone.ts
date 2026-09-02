import { type CalculatorOutcome, anyBlank, invalid, ok } from '../calculator-validation.ts'
import { parseDateInput } from './date-utils.ts'
import { parseTimeInput } from './time-utils.ts'

export interface TimeZoneOption {
  /** IANA zone identifier, which is what Intl understands. */
  id: string
  label: string
}

/**
 * A curated set of common zones rather than the full IANA list, which runs to
 * hundreds of entries and would make the dropdown unusable.
 */
export const TIME_ZONES: readonly TimeZoneOption[] = [
  { id: 'UTC', label: 'UTC' },
  { id: 'America/Los_Angeles', label: 'Los Angeles' },
  { id: 'America/Denver', label: 'Denver' },
  { id: 'America/Chicago', label: 'Chicago' },
  { id: 'America/New_York', label: 'New York' },
  { id: 'America/Sao_Paulo', label: 'São Paulo' },
  { id: 'Europe/London', label: 'London' },
  { id: 'Europe/Paris', label: 'Paris' },
  { id: 'Europe/Istanbul', label: 'Istanbul' },
  { id: 'Africa/Johannesburg', label: 'Johannesburg' },
  { id: 'Asia/Dubai', label: 'Dubai' },
  { id: 'Asia/Kolkata', label: 'Kolkata' },
  { id: 'Asia/Shanghai', label: 'Shanghai' },
  { id: 'Asia/Tokyo', label: 'Tokyo' },
  { id: 'Australia/Sydney', label: 'Sydney' },
  { id: 'Pacific/Auckland', label: 'Auckland' },
]

export interface TimeZoneResult {
  /** `YYYY-MM-DD` in the target zone. */
  date: string
  /** `HH:MM` on a 24-hour clock in the target zone. */
  time: string
  /** Short zone name for the converted instant, e.g. "EST" or "GMT+2". */
  abbreviation: string
  /** −1, 0 or +1: whether the calendar date moved relative to the source. */
  dayShift: number
  from: string
  to: string
  /** Offset of the target zone from UTC, in minutes, at that instant. */
  offsetMinutes: number
}

/** The parts a zone reports for a given instant. */
interface ZonedParts {
  year: number
  month: number
  day: number
  hour: number
  minute: number
}

function partsInZone(instant: number, timeZone: string): ZonedParts {
  const formatter = new Intl.DateTimeFormat('en-US', {
    timeZone,
    hour12: false,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  })

  const parts: Record<string, string> = {}
  for (const part of formatter.formatToParts(new Date(instant))) {
    if (part.type !== 'literal') parts[part.type] = part.value
  }

  return {
    year: Number(parts.year),
    month: Number(parts.month),
    day: Number(parts.day),
    // Some locales render midnight as hour 24; normalise it to 0.
    hour: Number(parts.hour) % 24,
    minute: Number(parts.minute),
  }
}

/** How far `timeZone` sits from UTC at a given instant, in minutes. */
function offsetAt(instant: number, timeZone: string): number {
  const parts = partsInZone(instant, timeZone)
  const asUtc = Date.UTC(parts.year, parts.month - 1, parts.day, parts.hour, parts.minute)

  return (asUtc - Math.floor(instant / 60000) * 60000) / 60000
}

/**
 * Finds the UTC instant for a wall-clock time in a given zone.
 *
 * The offset depends on the instant, and the instant is what we are solving
 * for, so this guesses once and then corrects: treat the wall time as UTC, see
 * what offset the zone had around then, and re-check in case the first guess
 * landed on the other side of a daylight-saving change.
 */
function zonedTimeToInstant(parts: ZonedParts, timeZone: string): number {
  const naive = Date.UTC(parts.year, parts.month - 1, parts.day, parts.hour, parts.minute)
  const firstGuess = naive - offsetAt(naive, timeZone) * 60000
  const corrected = naive - offsetAt(firstGuess, timeZone) * 60000

  return corrected
}

function shortZoneName(instant: number, timeZone: string): string {
  const formatter = new Intl.DateTimeFormat('en-US', { timeZone, timeZoneName: 'short' })
  const part = formatter.formatToParts(new Date(instant)).find((p) => p.type === 'timeZoneName')

  return part?.value ?? timeZone
}

const pad = (value: number) => String(value).padStart(2, '0')

export function isSupportedTimeZone(id: string): boolean {
  return TIME_ZONES.some((zone) => zone.id === id)
}

/**
 * Converts a wall-clock date and time from one zone to another.
 *
 * Daylight saving is handled by the runtime's own time-zone data through
 * `Intl`, so current and recent rules are correct. Two caveats worth stating:
 * historical accuracy depends on the data the runtime ships, and a wall-clock
 * time that a DST jump skips over does not exist, so it resolves to the
 * adjacent valid instant rather than erroring.
 */
export function convertTimeZone(
  parts: ZonedParts,
  from: string,
  to: string,
): TimeZoneResult {
  const instant = zonedTimeToInstant(parts, from)
  const target = partsInZone(instant, to)

  // Compare calendar days to report whether the date moved.
  const sourceDay = Date.UTC(parts.year, parts.month - 1, parts.day)
  const targetDay = Date.UTC(target.year, target.month - 1, target.day)
  const dayShift = Math.round((targetDay - sourceDay) / 86400000)

  return {
    date: `${target.year}-${pad(target.month)}-${pad(target.day)}`,
    time: `${pad(target.hour)}:${pad(target.minute)}`,
    abbreviation: shortZoneName(instant, to),
    dayShift,
    from,
    to,
    offsetMinutes: offsetAt(instant, to),
  }
}

export function evaluateTimeZone(
  rawDate: string,
  rawTime: string,
  from: string,
  to: string,
): CalculatorOutcome<TimeZoneResult> {
  if (anyBlank(rawDate, rawTime)) return { state: 'empty' }

  const date = parseDateInput(rawDate)
  if (!date) return invalid('Enter a valid date.')

  const minutes = parseTimeInput(rawTime)
  if (minutes === null) return invalid('Enter a valid time.')

  if (!isSupportedTimeZone(from) || !isSupportedTimeZone(to)) {
    return invalid('Choose a time zone from the list.')
  }

  return ok(
    convertTimeZone(
      {
        year: date.year,
        month: date.month,
        day: date.day,
        hour: Math.floor(minutes / 60),
        minute: minutes % 60,
      },
      from,
      to,
    ),
  )
}
