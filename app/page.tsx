import Link from 'next/link'
import { ArrowRight, Check, Sparkles } from 'lucide-react'

import { CalculatorSearch } from '@/components/calculator-search'
import { SiteHeader } from '@/components/site-header'
import {
  CALCULATORS_DIRECTORY_PATH,
  activeCategories,
  categoryHref,
  getCategoryName,
  liveCalculators,
  plannedCalculators,
  popularCalculators,
  type CalculatorDefinition,
} from '@/lib/calculators'

const featuredCalculator = liveCalculators[0]

/** Every live calculator, then popular planned ones shown as "Coming soon". */
const showcase: readonly CalculatorDefinition[] = [
  ...liveCalculators,
  ...popularCalculators.filter((calculator) => calculator.status === 'planned'),
]

const heroPopular = popularCalculators.slice(0, 4)

const homepageFaqs: readonly { question: string; answer: string }[] = [
  {
    question: 'Are CalculatorHub calculators free?',
    answer: 'Yes. Every calculator is free to use, with no sign-up required.',
  },
  {
    question: 'How accurate are the results?',
    answer:
      'Our calculators use standard mathematical formulas and explain how each result is calculated.',
  },
  {
    question: 'Can I suggest a calculator?',
    answer:
      'Absolutely. We are always looking for useful tools to add to the collection.',
  },
]

export default function Page() {
  return (
    <>
      <SiteHeader />
      <main>
        <section className="border-b border-border bg-card">
          <div className="mx-auto grid max-w-6xl gap-12 px-5 py-20 lg:grid-cols-[1.05fr_.95fr] lg:items-center lg:px-8 lg:py-28">
            <div>
              <p className="mb-5 flex items-center gap-2 text-sm font-semibold text-accent">
                <Sparkles className="size-4" />
                Simple tools. Clear answers.
              </p>
              <h1 className="max-w-2xl text-balance text-5xl font-bold leading-[1.05] tracking-tight text-primary md:text-7xl">
                Numbers made <span className="text-accent">simple.</span>
              </h1>
              <p className="mt-6 max-w-xl text-pretty text-lg leading-8 text-muted-foreground">
                Free, fast, and easy-to-use calculators for everyday life. No sign-up required, no
                confusing formulas.
              </p>
              <CalculatorSearch
                variant="hero"
                label="Find a calculator"
                placeholder="What do you need to calculate?"
                className="mt-8 max-w-xl"
              />
              <p className="mt-4 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-muted-foreground">
                <span>Popular:</span>
                {heroPopular.map((calculator, index) => (
                  <span key={calculator.slug} className="flex items-center gap-2">
                    {index > 0 && <span aria-hidden="true">·</span>}
                    {calculator.status === 'live' ? (
                      <Link
                        href={calculator.href}
                        className="font-medium text-primary hover:underline"
                      >
                        {calculator.name.replace(' Calculator', '')}
                      </Link>
                    ) : (
                      <span title="Coming soon">
                        {calculator.name.replace(' Calculator', '')}
                      </span>
                    )}
                  </span>
                ))}
              </p>
            </div>

            {featuredCalculator && (
              <div className="relative rounded-xl border border-border bg-background p-5 shadow-sm">
                <div className="mb-5 flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold text-primary">{featuredCalculator.name}</p>
                    <p className="text-xs text-muted-foreground">Quick calculation</p>
                  </div>
                  {featuredCalculator.popular && (
                    <span className="rounded-md bg-secondary px-2 py-1 text-xs font-semibold text-secondary-foreground">
                      Popular
                    </span>
                  )}
                </div>
                <div className="space-y-3">
                  <div className="flex items-center justify-between rounded-md bg-card px-4 py-3">
                    <span className="text-sm text-muted-foreground">15% of 240</span>
                    <span className="text-lg font-bold text-primary">36</span>
                  </div>
                  <div className="flex items-center justify-between rounded-md bg-card px-4 py-3">
                    <span className="text-sm text-muted-foreground">240 increased by 15%</span>
                    <span className="text-lg font-bold text-accent">276</span>
                  </div>
                </div>
                <Link
                  href={featuredCalculator.href}
                  className="mt-5 flex items-center justify-center gap-2 rounded-md border border-border py-3 text-sm font-semibold text-primary hover:bg-muted"
                >
                  Open calculator <ArrowRight className="size-4" />
                </Link>
              </div>
            )}
          </div>
        </section>

        <section id="categories" className="mx-auto max-w-6xl px-5 py-20 lg:px-8">
          <div className="flex items-end justify-between gap-4">
            <div>
              <p className="text-sm font-semibold text-accent">Explore by category</p>
              <h2 className="mt-2 text-3xl font-bold tracking-tight text-primary">
                Find the right tool
              </h2>
            </div>
            <Link
              href={CALCULATORS_DIRECTORY_PATH}
              className="hidden text-sm font-semibold text-primary sm:block"
            >
              View all <ArrowRight className="ml-1 inline size-4" />
            </Link>
          </div>
          <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {activeCategories.map((category) => {
              const cardClassName =
                'rounded-lg border border-border bg-card p-5 transition hover:-translate-y-0.5 hover:border-accent'
              const body = (
                <>
                  <category.icon className="size-5 text-accent" />
                  <h3 className="mt-5 font-semibold text-primary">{category.name}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">{category.description}</p>
                  <p
                    className={
                      category.liveCount > 0
                        ? 'mt-4 text-xs font-medium text-accent'
                        : 'mt-4 text-xs font-medium text-muted-foreground'
                    }
                  >
                    {category.countLabel}
                  </p>
                </>
              )

              return category.liveCount > 0 ? (
                <Link key={category.id} href={categoryHref(category.id)} className={cardClassName}>
                  {body}
                </Link>
              ) : (
                <div key={category.id} className={cardClassName}>
                  {body}
                </div>
              )
            })}
          </div>
        </section>

        <section id="calculators" className="bg-primary">
          <div className="mx-auto max-w-6xl px-5 py-20 lg:px-8">
            <div className="flex items-end justify-between">
              <div>
                <p className="text-sm font-semibold text-secondary">All calculators</p>
                <h2 className="mt-2 text-3xl font-bold tracking-tight text-primary-foreground">
                  Start calculating
                </h2>
              </div>
              <Link
                href={CALCULATORS_DIRECTORY_PATH}
                className="hidden text-sm font-semibold text-secondary hover:underline sm:block"
              >
                Browse the directory <ArrowRight className="ml-1 inline size-4" />
              </Link>
            </div>
            <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {showcase.map((calculator) =>
                calculator.status === 'live' ? (
                  <Link
                    key={calculator.slug}
                    href={calculator.href}
                    className="group rounded-lg bg-card p-5 transition hover:-translate-y-0.5"
                  >
                    <div className="flex items-center justify-between">
                      <calculator.icon className="size-5 text-accent" />
                      <ArrowRight className="size-4 text-muted-foreground transition group-hover:translate-x-1 group-hover:text-accent" />
                    </div>
                    <h3 className="mt-7 font-semibold text-primary">{calculator.name}</h3>
                    <p className="mt-2 text-sm leading-6 text-muted-foreground">
                      {calculator.description}
                    </p>
                    <p className="mt-3 text-xs font-medium text-accent">
                      {getCategoryName(calculator.category)}
                    </p>
                  </Link>
                ) : (
                  <div
                    key={calculator.slug}
                    aria-disabled="true"
                    className="rounded-lg border border-dashed border-border bg-card/60 p-5"
                  >
                    <div className="flex items-center justify-between">
                      <calculator.icon className="size-5 text-muted-foreground" />
                      <span className="rounded bg-muted px-1.5 py-0.5 text-xs font-medium text-muted-foreground">
                        Coming soon
                      </span>
                    </div>
                    <h3 className="mt-7 font-semibold text-muted-foreground">{calculator.name}</h3>
                    <p className="mt-2 text-sm leading-6 text-muted-foreground">
                      {calculator.description}
                    </p>
                    <p className="mt-3 text-xs font-medium text-muted-foreground">
                      {getCategoryName(calculator.category)}
                    </p>
                  </div>
                ),
              )}
            </div>
            <p className="mt-8 text-sm text-primary-foreground/70">
              {`${liveCalculators.length} calculator${liveCalculators.length === 1 ? '' : 's'} available now`}
              {plannedCalculators.length > 0 && `, ${plannedCalculators.length} on the way`}.
            </p>
          </div>
        </section>

        <section id="about" className="mx-auto max-w-6xl px-5 py-20 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-2">
            <div>
              <p className="text-sm font-semibold text-accent">Why CalculatorHub?</p>
              <h2 className="mt-2 text-3xl font-bold tracking-tight text-primary">
                Useful by design.
              </h2>
              <p className="mt-5 max-w-lg leading-7 text-muted-foreground">
                We believe everyday math should be accessible to everyone. Each tool is built to be
                quick to understand, accurate to use, and helpful beyond a single answer.
              </p>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              {[
                'Always free to use',
                'Clear, accurate formulas',
                'Works on every device',
                'No account or sign-up',
              ].map((text) => (
                <div
                  key={text}
                  className="flex items-center gap-3 rounded-lg border border-border bg-card p-4"
                >
                  <span className="flex size-7 items-center justify-center rounded-full bg-secondary">
                    <Check className="size-4 text-accent" />
                  </span>
                  <span className="text-sm font-medium text-primary">{text}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="faq" className="border-t border-border bg-card">
          <div className="mx-auto max-w-3xl px-5 py-20 text-center">
            <h2 className="text-3xl font-bold tracking-tight text-primary">
              Questions? We keep it clear.
            </h2>
            <div className="mt-8 space-y-3 text-left">
              {homepageFaqs.map((faq) => (
                <details
                  key={faq.question}
                  className="group rounded-lg border border-border bg-background p-5"
                >
                  <summary className="cursor-pointer list-none font-semibold text-primary">
                    {faq.question}
                    <span aria-hidden="true" className="float-right text-accent group-open:hidden">
                      +
                    </span>
                    <span
                      aria-hidden="true"
                      className="float-right hidden text-accent group-open:block"
                    >
                      −
                    </span>
                  </summary>
                  <p className="mt-3 text-sm leading-6 text-muted-foreground">{faq.answer}</p>
                </details>
              ))}
            </div>
          </div>
        </section>
      </main>

    </>
  )
}
