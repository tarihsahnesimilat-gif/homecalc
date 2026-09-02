'use client'

import { RotateCcw } from 'lucide-react'

export interface CalculatorResetProps {
  onReset: () => void
  /** Defaults to "Reset values"; the Unit Converter clears a single field. */
  label?: string
}

/**
 * The reset control shared by every calculator.
 *
 * Each calculator still owns what resetting means — clearing fields, dropping
 * dynamic rows — so only the button itself is shared.
 */
export function CalculatorReset({ onReset, label = 'Reset values' }: CalculatorResetProps) {
  return (
    <button
      type="button"
      onClick={onReset}
      className="mt-5 flex items-center gap-2 text-sm font-semibold text-muted-foreground hover:text-primary"
    >
      <RotateCcw className="size-4" />
      {label}
    </button>
  )
}
