'use client'

import { useId } from 'react'

import { cn } from '@/lib/utils'

export interface DateInputProps {
  label: string
  /** An ISO `YYYY-MM-DD` value, as produced by the native date input. */
  value: string
  onChange: (value: string) => void
  hint?: string
  min?: string
  max?: string
  invalid?: boolean
  className?: string
}

/**
 * A labelled native date field.
 *
 * The native control brings its own calendar, keyboard handling and locale
 * display for free, and always reports `YYYY-MM-DD` regardless of how it is
 * shown — which is exactly the format the calendar helpers parse.
 */
export function DateInput({
  label,
  value,
  onChange,
  hint,
  min,
  max,
  invalid = false,
  className,
}: DateInputProps) {
  const id = useId()
  const hintId = `${id}-hint`

  return (
    <div className={cn('grid gap-2', className)}>
      <label htmlFor={id} className="text-sm font-semibold text-primary">
        {label}
      </label>
      <input
        id={id}
        type="date"
        value={value}
        min={min}
        max={max}
        aria-invalid={invalid || undefined}
        aria-describedby={hint ? hintId : undefined}
        onChange={(event) => onChange(event.target.value)}
        className="h-12 rounded-md border border-input bg-background px-3 text-lg outline-none ring-accent focus:ring-2"
      />
      {hint && (
        <p id={hintId} className="text-xs text-muted-foreground">
          {hint}
        </p>
      )}
    </div>
  )
}
