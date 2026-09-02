import { cn } from '@/lib/utils'

interface CalculatorResultProps {
  /** Describes what was calculated, e.g. "15% of 240". */
  label: string
  /** The formatted result, or an error message when `isError` is set. */
  value: string
  /** Optional supporting line under the result. */
  hint?: string
  isError?: boolean
  className?: string
}

/**
 * Result panel shared by all calculators. Announces changes politely so screen
 * reader users hear the new answer as they type.
 */
export function CalculatorResult({
  label,
  value,
  hint,
  isError = false,
  className,
}: CalculatorResultProps) {
  return (
    <div className={cn('rounded-lg bg-secondary p-5', className)}>
      <p className="text-sm font-medium text-secondary-foreground">{label}</p>
      <p
        aria-live="polite"
        aria-atomic="true"
        className={cn(
          'mt-1 text-3xl font-bold break-words',
          isError ? 'text-destructive' : 'text-primary',
        )}
      >
        {value}
      </p>
      {hint && <p className="mt-2 text-sm leading-6 text-secondary-foreground/80">{hint}</p>}
    </div>
  )
}
