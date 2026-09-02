import { cn } from '@/lib/utils'
import type { BreakdownItem } from './types'

export interface ResultBreakdownProps {
  items: readonly BreakdownItem[]
  /** Number of columns from the `sm` breakpoint up. */
  columns?: 2 | 3
  className?: string
}

/**
 * The supporting figures shown under a calculator's headline result.
 *
 * Deliberately not a live region — the headline CalculatorResult announces
 * changes, and a second announcer would talk over it.
 */
export function ResultBreakdown({ items, columns = 3, className }: ResultBreakdownProps) {
  return (
    <dl
      className={cn(
        'mt-5 grid gap-3',
        columns === 2 ? 'sm:grid-cols-2' : 'sm:grid-cols-3',
        className,
      )}
    >
      {items.map((item) => (
        <div key={item.term} className="rounded-lg border border-border bg-background p-4">
          <dt className="text-xs font-medium text-muted-foreground">{item.term}</dt>
          <dd
            className={cn(
              'mt-1 text-xl font-bold break-words',
              item.negative ? 'text-destructive' : 'text-primary',
            )}
          >
            {item.value ?? '—'}
          </dd>
        </div>
      ))}
    </dl>
  )
}
