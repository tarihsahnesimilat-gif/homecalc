'use client'

import { useId } from 'react'

import { cn } from '@/lib/utils'

export interface TimeInputProps {
  label: string
  /** An `HH:MM` value on a 24-hour clock, as produced by the native input. */
  value: string
  onChange: (value: string) => void
  hint?: string
  min?: string
  max?: string
  invalid?: boolean
  className?: string
}

/**
 * A labelled native time field.
 *
 * The native control handles keyboard entry and locale display — including
 * showing AM/PM where that is the convention — while always reporting a
 * 24-hour `HH:MM` value, which is what `parseTimeInput` expects.
 */
export function TimeInput({
  label,
  value,
  onChange,
  hint,
  min,
  max,
  invalid = false,
  className,
}: TimeInputProps) {
  const id = useId()
  const hintId = `${id}-hint`

  return (
    <div className={cn('grid gap-2', className)}>
      <label htmlFor={id} className="text-sm font-semibold text-primary">
        {label}
      </label>
      <input
        id={id}
        type="time"
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
