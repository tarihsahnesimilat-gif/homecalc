import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

import { getCategoryName, type CalculatorDefinition } from '@/lib/calculators'

interface CalculatorCardProps {
  calculator: CalculatorDefinition
  /** Hidden on category pages, where every card shares one category. */
  showCategory?: boolean
}

/**
 * A link to one live calculator, matching the cards used elsewhere on the site.
 *
 * Only accepts live calculators — planned ones have no route, so a card that
 * could link to one would be a dead link waiting to happen.
 */
export function CalculatorCard({ calculator, showCategory = true }: CalculatorCardProps) {
  return (
    <Link
      href={calculator.href}
      className="group rounded-lg border border-border bg-card p-5 transition hover:-translate-y-0.5 hover:border-accent"
    >
      <div className="flex items-center justify-between">
        <calculator.icon className="size-5 text-accent" />
        <ArrowRight className="size-4 text-muted-foreground transition group-hover:translate-x-1 group-hover:text-accent" />
      </div>
      <h3 className="mt-5 font-semibold text-primary">{calculator.name}</h3>
      <p className="mt-1 text-sm leading-6 text-muted-foreground">{calculator.description}</p>
      {showCategory && (
        <p className="mt-3 text-xs font-medium text-accent">
          {getCategoryName(calculator.category)}
        </p>
      )}
    </Link>
  )
}
