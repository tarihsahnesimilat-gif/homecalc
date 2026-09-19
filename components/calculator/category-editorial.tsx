import Link from 'next/link'

import type { CategoryContent } from '@/lib/category-content'
import { getCalculatorBySlug } from '@/lib/calculators'

interface CategoryEditorialProps {
  content: CategoryContent
}

/**
 * The opening paragraph of a category's overview, lifted above the calculator
 * grid.
 *
 * Someone arriving on a category with fourteen cards had to scroll past all of
 * them before meeting a sentence of prose, so the page read as a bare list to
 * a visitor and to anyone reviewing it. This is the same paragraph the overview
 * below used to start with -- taken from it, not copied, so it appears once.
 */
export function CategoryIntro({ content }: CategoryEditorialProps) {
  const [lead] = content.overview.paragraphs
  if (!lead) return null

  return <p className="mt-4 max-w-3xl leading-7 text-muted-foreground">{lead}</p>
}

/**
 * The written half of a category page: what the tools are for, which one
 * answers which question, how to read a result, and what people get wrong.
 *
 * Everything comes from `lib/category-content.ts`, so a category gains content
 * by gaining an entry there rather than by growing new markup. Chooser links
 * resolve through the registry, which means a slug that is missing or planned
 * is skipped rather than rendered as a dead link.
 *
 * The overview picks up from its second paragraph, because `CategoryIntro`
 * renders the first one above the grid.
 */
export function CategoryEditorial({ content }: CategoryEditorialProps) {
  const { overview, chooser, interpreting, mistakes, disclaimer } = content

  /** Everything except the lead, which `CategoryIntro` has already shown. */
  const remainingOverview = overview.paragraphs.slice(1)

  const guides = chooser.items.flatMap((item) => {
    const calculator = getCalculatorBySlug(item.slug)
    if (!calculator || calculator.status !== 'live') return []
    return [{ ...item, calculator }]
  })

  return (
    <article className="mt-12 max-w-none border-t border-border pt-10">
      {remainingOverview.length > 0 && (
        <section aria-labelledby="category-overview-heading">
          <h2 id="category-overview-heading" className="text-2xl font-bold text-primary">
            {overview.title}
          </h2>
          <div className="mt-4 space-y-4">
            {remainingOverview.map((paragraph) => (
              <p key={paragraph} className="max-w-3xl leading-7 text-muted-foreground">
                {paragraph}
              </p>
            ))}
          </div>
        </section>
      )}

      {guides.length > 0 && (
        <section aria-labelledby="category-chooser-heading" className="mt-10">
          <h2 id="category-chooser-heading" className="text-2xl font-bold text-primary">
            {chooser.title}
          </h2>
          <ul className="mt-5 grid gap-4 sm:grid-cols-2">
            {guides.map(({ calculator, text }) => (
              <li
                key={calculator.slug}
                className="rounded-lg border border-border bg-card p-5"
              >
                <h3 className="font-semibold text-primary">
                  <Link href={calculator.href} className="hover:text-accent hover:underline">
                    {calculator.name}
                  </Link>
                </h3>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">{text}</p>
              </li>
            ))}
          </ul>
        </section>
      )}

      <section aria-labelledby="category-interpreting-heading" className="mt-10">
        <h2 id="category-interpreting-heading" className="text-2xl font-bold text-primary">
          {interpreting.title}
        </h2>
        <div className="mt-4 space-y-4">
          {interpreting.paragraphs.map((paragraph) => (
            <p key={paragraph} className="max-w-3xl leading-7 text-muted-foreground">
              {paragraph}
            </p>
          ))}
        </div>
      </section>

      <section aria-labelledby="category-mistakes-heading" className="mt-10">
        <h2 id="category-mistakes-heading" className="text-2xl font-bold text-primary">
          {mistakes.title}
        </h2>
        <ul className="mt-5 space-y-4">
          {mistakes.items.map((mistake, index) => (
            <li key={mistake.title} className="flex gap-4">
              <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-secondary text-sm font-bold text-secondary-foreground">
                {index + 1}
              </span>
              <div>
                <h3 className="font-semibold text-primary">{mistake.title}</h3>
                <p className="mt-1 max-w-3xl leading-7 text-muted-foreground">
                  {mistake.description}
                </p>
              </div>
            </li>
          ))}
        </ul>
      </section>

      {disclaimer && (
        <p className="mt-10 max-w-3xl rounded-lg border border-border bg-muted p-5 text-sm leading-6 text-muted-foreground">
          <span className="font-semibold text-primary">Please note: </span>
          {disclaimer}
        </p>
      )}
    </article>
  )
}
