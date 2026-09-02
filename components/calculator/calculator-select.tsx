'use client'

import { useId } from 'react'

import { cn } from '@/lib/utils'
import type { SelectOption } from './types'

export interface CalculatorSelectProps {
  label: string
  value: string
  onChange: (value: string) => void
  options: readonly SelectOption[]
  className?: string
}

/** A labelled native select — keyboard and screen-reader behaviour comes free. */
export function CalculatorSelect({
  label,
  value,
  onChange,
  options,
  className,
}: CalculatorSelectProps) {
  const id = useId()

  return (
    <div className={cn('grid gap-2', className)}>
      <label htmlFor={id} className="text-sm font-semibold text-primary">
        {label}
      </label>
      <select
        id={id}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="h-12 w-full rounded-md border border-input bg-background px-3 text-base outline-none ring-accent focus:ring-2"
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  )
}
