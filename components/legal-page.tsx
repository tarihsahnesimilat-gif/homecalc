import type { ReactNode } from 'react'

import { Breadcrumbs } from '@/components/calculator/breadcrumbs'
import { SiteHeader } from '@/components/site-header'

interface LegalPageProps {
  title: string
  /** Shown as the lead paragraph under the heading. */
  description: string
  children: ReactNode
}

/**
 * Shared chrome for the privacy, terms and disclaimer pages.
 *
 * The prose styling is applied here so those pages contain only their text —
 * headings and paragraphs — rather than repeating layout classes three times.
 */
export function LegalPage({ title, description, children }: LegalPageProps) {
  return (
    <>
      <SiteHeader />
      <main className="mx-auto max-w-3xl px-5 py-10 lg:px-8">
        <Breadcrumbs className="mb-8" items={[{ label: 'Home', href: '/' }, { label: title }]} />

        <h1 className="text-4xl font-bold tracking-tight text-primary md:text-5xl">{title}</h1>
        <p className="mt-4 text-lg leading-8 text-muted-foreground">{description}</p>

        <div className="mt-10 space-y-4 leading-7 text-muted-foreground [&>h2]:mt-10 [&>h2]:text-2xl [&>h2]:font-bold [&>h2]:text-primary [&>ul]:list-disc [&>ul]:space-y-2 [&>ul]:pl-6">
          {children}
        </div>
      </main>
    </>
  )
}
