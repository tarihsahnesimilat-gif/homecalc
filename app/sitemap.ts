import type { MetadataRoute } from 'next'

import { liveCalculators } from '@/lib/calculators'
import { absoluteUrl } from '@/lib/site'

/**
 * Built from the calculator registry. Planned calculators have no route, so
 * they are never listed here.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date()

  return [
    {
      url: absoluteUrl('/'),
      lastModified,
      changeFrequency: 'weekly',
      priority: 1,
    },
    ...liveCalculators.map((calculator) => ({
      url: absoluteUrl(calculator.href),
      lastModified,
      changeFrequency: 'monthly' as const,
      priority: calculator.popular ? 0.9 : 0.7,
    })),
  ]
}
