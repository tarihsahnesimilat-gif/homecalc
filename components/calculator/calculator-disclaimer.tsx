import { Info } from 'lucide-react'

interface CalculatorDisclaimerProps {
  /** One short paragraph from the calculator's content file. */
  body: string
}

/**
 * The note that sits directly under the results on calculators where a number
 * could be mistaken for advice — health estimates and anything involving
 * borrowing, saving or investing.
 *
 * Deliberately quiet: a bordered muted panel rather than a warning colour, so
 * it reads as context rather than alarm. It states what the result is and what
 * it is not, and claims no authority of its own.
 */
export function CalculatorDisclaimer({ body }: CalculatorDisclaimerProps) {
  return (
    <aside
      aria-label="About these results"
      className="mt-6 flex gap-3 rounded-lg border border-border bg-muted p-5"
    >
      <Info aria-hidden="true" className="mt-0.5 size-5 shrink-0 text-accent" />
      <div>
        <p className="text-sm font-semibold text-primary">About these results</p>
        <p className="mt-1 text-sm leading-6 text-muted-foreground">{body}</p>
      </div>
    </aside>
  )
}
