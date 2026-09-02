import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import type { ReactNode } from 'react'

import type { CalculatorContent } from '@/lib/calculator-content/types'
import { getCategoryName, type CalculatorDefinition } from '@/lib/calculators'

interface CalculatorShellProps {
  calculator: CalculatorDefinition
  content: CalculatorContent
  /** The interactive calculator plus its supporting article content. */
  children: ReactNode
  /** Optional extra sidebar content rendered below the tip card. */
  aside?: ReactNode
}

/**
 * Page chrome shared by every calculator: breadcrumb, heading, lead paragraph
 * and the two-column layout with the sidebar.
 */
export function CalculatorShell({ calculator, content, children, aside }: CalculatorShellProps) {
  return (
    <main className="mx-auto max-w-6xl px-5 py-10 lg:px-8">
      <nav aria-label="Breadcrumb" className="mb-8">
        <ol className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
          <li>
            <Link href="/" className="hover:text-primary">
              Home
            </Link>
          </li>
          <li aria-hidden="true">/</li>
          <li>
            <Link href="/#categories" className="hover:text-primary">
              {getCategoryName(calculator.category)}
            </Link>
          </li>
          <li aria-hidden="true">/</li>
          <li className="text-foreground">{calculator.name}</li>
        </ol>
      </nav>

      <div className="grid gap-10 lg:grid-cols-[1fr_360px]">
        <div className="min-w-0">
          <h1 className="text-4xl font-bold tracking-tight text-primary md:text-5xl">
            {calculator.name}
          </h1>
          <p className="mt-4 max-w-2xl text-lg leading-8 text-muted-foreground">
            {content.intro.lead}
          </p>
          {children}
        </div>

        <aside className="space-y-6 lg:sticky lg:top-6 lg:h-fit">
          {content.tip && (
            <div className="rounded-xl border border-border bg-muted p-6">
              <p className="text-sm font-semibold text-accent">CalculatorHub tip</p>
              <h2 className="mt-2 text-xl font-bold text-primary">{content.tip.title}</h2>
              <p className="mt-3 text-sm leading-6 text-muted-foreground">{content.tip.body}</p>
              <Link
                href="/#calculators"
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
    </main>
  )
}
