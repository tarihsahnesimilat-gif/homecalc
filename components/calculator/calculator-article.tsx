import type { CalculatorContent } from '@/lib/calculator-content/types'

interface CalculatorArticleProps {
  content: CalculatorContent
}

/**
 * Renders the explanatory sections of a calculator page straight from its
 * content configuration, so a new calculator needs a content file rather than
 * new markup.
 */
export function CalculatorArticle({ content }: CalculatorArticleProps) {
  const { intro, howTo, formulas, examples } = content

  return (
    <article className="mt-12 max-w-none">
      {intro.paragraphs.length > 0 && (
        <section aria-labelledby="about-heading">
          <h2 id="about-heading" className="text-2xl font-bold text-primary">
            {intro.title ?? 'About this calculator'}
          </h2>
          <div className="mt-4 space-y-4">
            {intro.paragraphs.map((paragraph) => (
              <p key={paragraph} className="leading-7 text-muted-foreground">
                {paragraph}
              </p>
            ))}
          </div>
        </section>
      )}

      {howTo.steps.length > 0 && (
        <section aria-labelledby="howto-heading" className="mt-10">
          <h2 id="howto-heading" className="text-2xl font-bold text-primary">
            {howTo.title}
          </h2>
          <ol className="mt-5 space-y-4">
            {howTo.steps.map((step, index) => (
              <li key={step.title} className="flex gap-4">
                <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-secondary text-sm font-bold text-secondary-foreground">
                  {index + 1}
                </span>
                <div>
                  <h3 className="font-semibold text-primary">{step.title}</h3>
                  <p className="mt-1 leading-7 text-muted-foreground">{step.description}</p>
                </div>
              </li>
            ))}
          </ol>
        </section>
      )}

      {formulas.length > 0 && (
        <section aria-labelledby="formulas-heading" className="mt-10">
          <h2 id="formulas-heading" className="text-2xl font-bold text-primary">
            {content.formulasTitle ?? 'Formulas'}
          </h2>
          <div className="mt-5 space-y-3">
            {formulas.map((formula) => (
              <div key={formula.name} className="rounded-lg border border-border bg-card p-5">
                <h3 className="font-semibold text-primary">{formula.name}</h3>
                <p className="mt-2 overflow-x-auto rounded-md bg-muted px-3 py-2 font-mono text-sm text-primary">
                  {formula.expression}
                </p>
                <p className="mt-3 text-sm leading-6 text-muted-foreground">
                  {formula.description}
                </p>
              </div>
            ))}
          </div>
        </section>
      )}

      {examples.length > 0 && (
        <section aria-labelledby="examples-heading" className="mt-10">
          <h2 id="examples-heading" className="text-2xl font-bold text-primary">
            Worked examples
          </h2>
          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            {examples.map((example) => (
              <div key={example.title} className="rounded-lg border border-border bg-card p-5">
                <h3 className="font-semibold text-primary">{example.title}</h3>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                  {example.description}
                </p>
                <dl className="mt-4 space-y-1.5">
                  {example.inputs.map((input) => (
                    <div key={input.label} className="flex justify-between gap-4 text-sm">
                      <dt className="text-muted-foreground">{input.label}</dt>
                      <dd className="font-medium text-primary">{input.value}</dd>
                    </div>
                  ))}
                </dl>
                <p className="mt-4 border-t border-border pt-3 text-sm font-semibold text-accent">
                  {example.result}
                </p>
              </div>
            ))}
          </div>
        </section>
      )}
    </article>
  )
}
