import type { CalculatorFaq as CalculatorFaqEntry } from '@/lib/calculator-content/types'

interface CalculatorFaqProps {
  faqs: CalculatorFaqEntry[]
  title?: string
  /** Emits FAQPage structured data alongside the visible list. */
  includeStructuredData?: boolean
}

export function CalculatorFaq({
  faqs,
  title = 'Frequently asked questions',
  includeStructuredData = true,
}: CalculatorFaqProps) {
  if (faqs.length === 0) return null

  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: { '@type': 'Answer', text: faq.answer },
    })),
  }

  return (
    <section aria-labelledby="faq-heading" className="mt-12">
      <h2 id="faq-heading" className="text-2xl font-bold text-primary">
        {title}
      </h2>
      <div className="mt-5 space-y-3">
        {faqs.map((faq) => (
          <details
            key={faq.question}
            className="group rounded-lg border border-border bg-card p-5"
          >
            <summary className="cursor-pointer list-none font-semibold text-primary">
              {faq.question}
              <span aria-hidden="true" className="float-right text-accent group-open:hidden">
                +
              </span>
              <span aria-hidden="true" className="float-right hidden text-accent group-open:block">
                −
              </span>
            </summary>
            <p className="mt-3 text-sm leading-6 text-muted-foreground">{faq.answer}</p>
          </details>
        ))}
      </div>
      {includeStructuredData && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
      )}
    </section>
  )
}
