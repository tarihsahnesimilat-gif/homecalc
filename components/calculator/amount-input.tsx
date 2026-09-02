'use client'

import { NumberInput, type NumberInputProps } from './number-input'

export interface AmountInputProps
  extends Omit<NumberInputProps, 'integer' | 'min' | 'step'> {
  /** Optional code or symbol shown after the label, e.g. "USD" or "£". */
  currency?: string
  /** Amounts default to non-negative; override for figures that may go below zero. */
  allowNegative?: boolean
}

/**
 * A money field: a NumberInput that defaults to non-negative values and can
 * name a currency in its label.
 *
 * The currency is presentation only — it never reaches the calculation layer,
 * which works in plain numbers so the same maths serves any currency.
 */
export function AmountInput({
  label,
  currency,
  allowNegative = false,
  ...props
}: AmountInputProps) {
  return (
    <NumberInput
      {...props}
      label={currency ? `${label} (${currency})` : label}
      min={allowNegative ? undefined : '0'}
      step="any"
    />
  )
}
