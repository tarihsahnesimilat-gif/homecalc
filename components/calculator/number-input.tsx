'use client'

import { useId } from 'react'

import { cn } from '@/lib/utils'

export interface NumberInputProps {
  label: string
  value: string
  onChange: (value: string) => void
  /** Small note under the field explaining what to enter. */
  hint?: string
  placeholder?: string
  min?: string
  max?: string
  step?: string
  /** Whole numbers only — switches the on-screen keyboard to numeric. */
  integer?: boolean
  /** Marks the field as part of an invalid submission for assistive tech. */
  invalid?: boolean
  /** `compact` matches the smaller secondary labels used inside field groups. */
  labelSize?: 'default' | 'compact'
  className?: string
}

/**
 * The labelled numeric field used by every calculator.
 *
 * Generates its own id so the label is always programmatically associated with
 * the input, which is what previously had to be wired up by hand in each form.
 */
export function NumberInput({
  label,
  value,
  onChange,
  hint,
  placeholder,
  min,
  max,
  step = 'any',
  integer = false,
  invalid = false,
  labelSize = 'default',
  className,
}: NumberInputProps) {
  const id = useId()
  const hintId = `${id}-hint`

  return (
    <div className={cn('grid', labelSize === 'compact' ? 'gap-1.5' : 'gap-2', className)}>
      <label
        htmlFor={id}
        className={
          labelSize === 'compact'
            ? 'text-xs font-medium text-muted-foreground'
            : 'text-sm font-semibold text-primary'
        }
      >
        {label}
      </label>
      <input
        id={id}
        type="number"
        inputMode={integer ? 'numeric' : 'decimal'}
        min={min}
        max={max}
        step={integer ? (step === 'any' ? '1' : step) : step}
        placeholder={placeholder}
        value={value}
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
