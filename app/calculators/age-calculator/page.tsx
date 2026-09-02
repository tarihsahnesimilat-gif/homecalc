import type { Metadata } from 'next'
import { notFound } from 'next/navigation'

import { CalculatorArticle } from '@/components/calculator/calculator-article'
import { CalculatorFaq } from '@/components/calculator/calculator-faq'
import { CalculatorShell } from '@/components/calculator/calculator-shell'
import { RelatedCalculators } from '@/components/calculator/related-calculators'
import { SiteHeader } from '@/components/site-header'
import { getCalculatorContent } from '@/lib/calculator-content'
import { calculatorHref, getCalculatorBySlug, getRelatedCalculators } from '@/lib/calculators'

import { AgeForm } from './age-form'

const SLUG = 'age-calculator'

const calculator = getCalculatorBySlug(SLUG)
const content = getCalculatorContent(SLUG)
const canonicalPath = calculatorHref(SLUG)

export const metadata: Metadata = content
  ? {
      title: content.seoTitle,
      description: content.seoDescription,
      alternates: { canonical: canonicalPath },
      openGraph: {
        title: content.seoTitle,
        description: content.seoDescription,
        url: canonicalPath,
        type: 'article',
      },
    }
  : {}

export default function AgeCalculatorPage() {
  if (!calculator || !content) notFound()

  return (
    <>
      <SiteHeader />
      <CalculatorShell calculator={calculator} content={content}>
        <AgeForm />
        <CalculatorArticle content={content} />
        <CalculatorFaq faqs={content.faqs} />
        <RelatedCalculators calculators={getRelatedCalculators(SLUG)} />
      </CalculatorShell>
    </>
  )
}
