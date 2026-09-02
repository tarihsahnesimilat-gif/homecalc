'use client'

import type { ToggleOption } from './types'

export interface CalculatorToggleProps<T extends string> {
  /** Names the group for assistive technology. */
  label: string
  value: T
  onChange: (value: T) => void
  options: readonly ToggleOption<T>[]
  /** Adds the divider used when the toggle sits at the top of a card. */
  bordered?: boolean
}

/**
 * The segmented control used for calculator modes — percentage modes, fraction
 * operations, ratio sides, interest time units.
 */
export function CalculatorToggle<T extends string>({
  label,
  value,
  onChange,
  options,
  bordered = false,
}: CalculatorToggleProps<T>) {
  return (
    <div
      role="tablist"
      aria-label={label}
      className={
        bordered
          ? 'flex flex-wrap gap-2 border-b border-border pb-5'
          : 'flex flex-wrap gap-2'
      }
    >
      {options.map((option) => (
        <button
          key={option.id}
          type="button"
          role="tab"
          aria-selected={value === option.id}
          onClick={() => onChange(option.id)}
          className={`rounded-md px-3 py-2 text-sm font-semibold transition ${
            value === option.id
              ? 'bg-primary text-primary-foreground'
              : 'text-muted-foreground hover:bg-muted hover:text-primary'
          }`}
        >
          {option.label}
          {option.symbol && <span aria-hidden="true"> {option.symbol}</span>}
        </button>
      ))}
    </div>
  )
}
