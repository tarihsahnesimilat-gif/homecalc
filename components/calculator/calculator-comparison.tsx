import Link from 'next/link'

import type { CalculatorComparison } from '@/lib/calculator-content/types'
import { getCalculatorBySlug } from '@/lib/calculators'

interface CalculatorComparisonsProps {
  comparisons: CalculatorComparison[]
}

/**
 * "Is this the right calculator?" — the section that separates a calculator
 * from its nearest neighbour.
 *
 * Only a few calculators have one. It sits under the intro, where someone who
 * arrived from a search for the other tool is still deciding whether to stay,
 * and it links across so leaving is one click rather than another search.
 * The sibling's name and href come from the registry, so neither can go stale.
 */
export function CalculatorComparisons({ comparisons }: CalculatorComparisonsProps) {
  const resolved = comparisons.flatMap((comparison) => {
    const other = getCalculatorBySlug(comparison.slug)
    if (!other || other.status !== 'live') return []
    return [{ ...comparison, other }]
  })

  if (resolved.length === 0) return null

  return (
    <section aria-labelledby="comparison-heading" className="mt-10">
      <h2 id="comparison-heading" className="text-2xl font-bold text-primary">
        Is this the right calculator?
      </h2>

      <div className="mt-5 space-y-4">
        {resolved.map(({ other, summary, useThisWhen, useOtherWhen }) => (
          <div key={other.slug} className="rounded-lg border border-border bg-card p-5">
            <h3 className="font-semibold text-primary">
              This or the{' '}
              <Link href={other.href} className="text-accent hover:underline">
                {other.name}
              </Link>
              ?
            </h3>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">{summary}</p>
            <dl className="mt-4 space-y-2 text-sm leading-6">
              <div>
                <dt className="inline font-semibold text-primary">Use this calculator when </dt>
                <dd className="inline text-muted-foreground">{useThisWhen}</dd>
              </div>
              <div>
                <dt className="inline font-semibold text-primary">
                  Use the{' '}
                  <Link href={other.href} className="text-accent hover:underline">
                    {other.name}
                  </Link>{' '}
                  when{' '}
                </dt>
                <dd className="inline text-muted-foreground">{useOtherWhen}</dd>
              </div>
            </dl>
          </div>
        ))}
      </div>
    </section>
  )
}
