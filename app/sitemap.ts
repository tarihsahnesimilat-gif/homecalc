import type { MetadataRoute } from 'next'

import { publicRoutes } from '@/lib/routes'
import { absoluteUrl } from '@/lib/site'

/**
 * Built entirely from the calculator registry via `publicRoutes()`: the
 * homepage, the directory, one page per category that has live calculators,
 * and one page per live calculator.
 *
 * Nothing here is hand-written, so a planned calculator can never leak in.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date()

  return publicRoutes().map((route) => ({
    url: absoluteUrl(route.path),
    lastModified,
    changeFrequency: route.changeFrequency,
    priority: route.priority,
  }))
}
