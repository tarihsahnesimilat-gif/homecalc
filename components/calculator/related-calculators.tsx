import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

import { getCategoryName, type CalculatorDefinition } from '@/lib/calculators'

interface RelatedCalculatorsProps {
  calculators: readonly CalculatorDefinition[]
  title?: string
  /** Shown when nothing live is available yet. */
  emptyMessage?: string
}

/**
 * Renders related calculators as links. Planned calculators are filtered out
 * entirely so this component can never produce a link to a page that does not
 * exist.
 */
export function RelatedCalculators({
  calculators,
  title = 'Related calculators',
  emptyMessage = 'More calculators are on the way. In the meantime, browse everything we have so far.',
}: RelatedCalculatorsProps) {
  const live = calculators.filter((calculator) => calculator.status === 'live')

  return (
    <section aria-labelledby="related-heading" className="mt-12">
      <h2 id="related-heading" className="text-2xl font-bold text-primary">
        {title}
      </h2>

      {live.length === 0 ? (
        <div className="mt-5 rounded-lg border border-dashed border-border bg-card p-6">
          <p className="text-sm leading-6 text-muted-foreground">{emptyMessage}</p>
          <Link
            href="/#calculators"
            className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-primary hover:underline"
          >
            Browse all calculators
            <ArrowRight className="size-4" />
          </Link>
        </div>
      ) : (
        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          {live.map((calculator) => (
            <Link
              key={calculator.slug}
              href={calculator.href}
              className="group rounded-lg border border-border bg-card p-5 transition hover:-translate-y-0.5 hover:border-accent"
            >
              <div className="flex items-center justify-between">
                <calculator.icon className="size-5 text-accent" />
                <ArrowRight className="size-4 text-muted-foreground transition group-hover:translate-x-1 group-hover:text-accent" />
              </div>
              <h3 className="mt-5 font-semibold text-primary">{calculator.name}</h3>
              <p className="mt-1 text-sm leading-6 text-muted-foreground">
                {calculator.description}
              </p>
              <p className="mt-3 text-xs font-medium text-accent">
                {getCategoryName(calculator.category)}
              </p>
            </Link>
          ))}
        </div>
      )}
    </section>
  )
}
