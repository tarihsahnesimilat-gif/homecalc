import Link from 'next/link'

import { absoluteUrl } from '@/lib/site'

export interface Crumb {
  label: string
  /** Omitted on the final crumb, which is the current page. */
  href?: string
}

interface BreadcrumbsProps {
  /** Ordered from the site root to the current page. */
  items: readonly Crumb[]
  className?: string
}

/**
 * The one breadcrumb implementation on the site: visible trail plus its
 * BreadcrumbList structured data.
 *
 * Keeping both in one component is what stops the markup and the JSON-LD from
 * drifting apart, and guarantees a page can never emit two BreadcrumbList
 * blocks describing the same trail.
 */
export function Breadcrumbs({ items, className }: BreadcrumbsProps) {
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.label,
      ...(item.href ? { item: absoluteUrl(item.href) } : {}),
    })),
  }

  return (
    <nav aria-label="Breadcrumb" className={className}>
      <ol className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
        {items.map((item, index) => (
          <li key={item.label} className="flex items-center gap-2">
            {index > 0 && <span aria-hidden="true">/</span>}
            {item.href ? (
              <Link href={item.href} className="hover:text-primary">
                {item.label}
              </Link>
            ) : (
              <span className="text-foreground" aria-current="page">
                {item.label}
              </span>
            )}
          </li>
        ))}
      </ol>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
    </nav>
  )
}
