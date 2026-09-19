import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { Children, type ReactNode } from 'react'

import type { CalculatorContent } from '@/lib/calculator-content/types'
import {
  CALCULATORS_DIRECTORY_PATH,
  categoryHref,
  getCategoryName,
  type CalculatorDefinition,
} from '@/lib/calculators'
import { absoluteUrl } from '@/lib/site'
import { Breadcrumbs } from './breadcrumbs'
import { CalculatorDisclaimer } from './calculator-disclaimer'

interface CalculatorShellProps {
  calculator: CalculatorDefinition
  content: CalculatorContent
  /**
   * The interactive calculator first, then its supporting article content.
   * That order is what lets the disclaimer land directly under the results
   * rather than at the bottom of the page.
   */
  children: ReactNode
  /** Optional extra sidebar content rendered below the tip card. */
  aside?: ReactNode
}

/**
 * Page chrome shared by every calculator: breadcrumb, heading, lead paragraph
 * and the two-column layout with the sidebar.
 */
export function CalculatorShell({ calculator, content, children, aside }: CalculatorShellProps) {
  /**
   * Every calculator page passes its form as the first child, so splitting
   * here puts the disclaimer immediately below the results without each page
   * having to place it — and without the 50 pages that need no disclaimer
   * changing at all.
   */
  const [interactive, ...supporting] = Children.toArray(children)

  /**
   * Each calculator genuinely is a free browser tool, so WebApplication
   * describes it accurately. Every field below is derived from the registry or
   * the content file — no ratings, reviews, prices, authors or organisations
   * are asserted, because none of those exist to assert.
   *
   * Emitted here rather than per page so there can only ever be one such block
   * per calculator.
   */
  const applicationSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: calculator.name,
    description: content.seoDescription,
    url: absoluteUrl(calculator.href),
    applicationCategory: 'UtilitiesApplication',
    operatingSystem: 'Any',
    browserRequirements: 'Requires JavaScript',
    isAccessibleForFree: true,
  }

  return (
    <main className="mx-auto max-w-6xl px-5 py-10 lg:px-8">
      <Breadcrumbs
        className="mb-8"
        items={[
          { label: 'Home', href: '/' },
          { label: 'Calculators', href: CALCULATORS_DIRECTORY_PATH },
          {
            label: getCategoryName(calculator.category),
            href: categoryHref(calculator.category),
          },
          { label: calculator.name },
        ]}
      />

      <div className="grid gap-10 lg:grid-cols-[1fr_360px]">
        <div className="min-w-0">
          <h1 className="text-4xl font-bold tracking-tight text-primary md:text-5xl">
            {calculator.name}
          </h1>
          <p className="mt-4 max-w-2xl text-lg leading-8 text-muted-foreground">
            {content.intro.lead}
          </p>
          {interactive}
          {content.disclaimer && <CalculatorDisclaimer body={content.disclaimer} />}
          {supporting}
        </div>

        <aside className="space-y-6 lg:sticky lg:top-6 lg:h-fit">
          {content.tip && (
            <div className="rounded-xl border border-border bg-muted p-6">
              <p className="text-sm font-semibold text-accent">HomeCalc tip</p>
              <h2 className="mt-2 text-xl font-bold text-primary">{content.tip.title}</h2>
              <p className="mt-3 text-sm leading-6 text-muted-foreground">{content.tip.body}</p>
              <Link
                href={CALCULATORS_DIRECTORY_PATH}
                className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-primary hover:underline"
              >
                <ArrowLeft className="size-4" />
                Browse all calculators
              </Link>
            </div>
          )}
          {aside}
        </aside>
      </div>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(applicationSchema) }}
      />
    </main>
  )
}
