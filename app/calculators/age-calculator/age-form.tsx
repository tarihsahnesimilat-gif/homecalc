'use client'

import { useEffect, useMemo, useState } from 'react'

import {
  CalculatorReset,
  CalculatorResult,
  DateInput,
  ResultBreakdown,
} from '@/components/calculator'
import { evaluateAge } from '@/lib/calculations/age'
import { formatDateInput } from '@/lib/calculations/date-utils'
import { outcomeValue } from '@/lib/calculator-validation'
import { formatNumber } from '@/lib/format'

const DEFAULT_BIRTH_DATE = '1990-06-15'

/** Today in the visitor's own calendar, read from local time rather than UTC. */
function todayInputValue(): string {
  const now = new Date()
  return formatDateInput({
    year: now.getFullYear(),
    month: now.getMonth() + 1,
    day: now.getDate(),
  })
}

export function AgeForm() {
  const [birthDate, setBirthDate] = useState(DEFAULT_BIRTH_DATE)
  // Filled in after mount: reading the clock during render would make the
  // server and client markup differ and trigger a hydration mismatch.
  const [targetDate, setTargetDate] = useState('')

  useEffect(() => {
    setTargetDate(todayInputValue())
  }, [])

  const outcome = useMemo(() => evaluateAge(birthDate, targetDate), [birthDate, targetDate])
  const result = outcomeValue(outcome)

  return (
    <div className="mt-8 rounded-xl border border-border bg-card p-5 shadow-sm sm:p-8">
      <div className="grid gap-5 sm:grid-cols-2">
        <DateInput
          label="Date of birth"
          hint="Any date in the past."
          value={birthDate}
          onChange={setBirthDate}
        />
        <DateInput
          label="Age at this date"
          hint="Starts as today; change it to any later date."
          value={targetDate}
          onChange={setTargetDate}
        />
      </div>

      <CalculatorResult
        className="mt-7"
        label={result ? (result.isBirthday ? 'Happy birthday — exact age' : 'Exact age') : 'Your result'}
        value={
          outcome.state === 'invalid'
            ? outcome.message
            : result === null
              ? '—'
              : `${formatNumber(result.span.years)} years, ${formatNumber(result.span.months)} months, ${formatNumber(result.span.days)} days`
        }
        hint={
          result
            ? `That is ${formatNumber(result.totalDays)} days in total.`
            : undefined
        }
        isError={outcome.state === 'invalid'}
      />

      <ResultBreakdown
        items={[
          { term: 'Total months', value: result && formatNumber(result.totalMonths) },
          { term: 'Total weeks', value: result && formatNumber(result.totalWeeks) },
          { term: 'Total days', value: result && formatNumber(result.totalDays) },
        ]}
      />

      <CalculatorReset
        onReset={() => {
          setBirthDate('')
          setTargetDate(todayInputValue())
        }}
      />
    </div>
  )
}
