import {
  CALCULATORS_DIRECTORY_PATH,
  categoriesWithLiveCalculators,
  categoryHref,
  liveCalculators,
} from './calculators.ts'

export type ChangeFrequency = 'weekly' | 'monthly'

export interface PublicRoute {
  path: string
  changeFrequency: ChangeFrequency
  priority: number
}

/**
 * The trust pages: who runs the site, how to reach them, and the terms.
 *
 * AdSense and every other ad network look for these, so they are indexable and
 * listed in the sitemap even though they change rarely and rank for nothing.
 * `/about` and `/contact` sit above the pure legal pages in priority because
 * they carry real content a reader might actually want.
 */
export const INFO_ROUTES = ['/about', '/contact'] as const
export const LEGAL_ROUTES = ['/privacy', '/cookies', '/terms', '/disclaimer'] as const

/**
 * Every public route, derived from the calculator registry.
 *
 * This is what the sitemap is built from, which keeps the sitemap and the site
 * in step: a calculator that goes live appears here automatically, and one that
 * is still planned cannot, because it has no route. Categories holding only
 * planned calculators have no page and so are absent too.
 */
export function publicRoutes(): readonly PublicRoute[] {
  return [
    { path: '/', changeFrequency: 'weekly', priority: 1 },
    { path: CALCULATORS_DIRECTORY_PATH, changeFrequency: 'weekly', priority: 0.9 },
    ...categoriesWithLiveCalculators.map((category) => ({
      path: categoryHref(category.id),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    })),
    ...liveCalculators.map((calculator) => ({
      path: calculator.href,
      changeFrequency: 'monthly' as const,
      priority: calculator.popular ? 0.9 : 0.7,
    })),
    ...INFO_ROUTES.map((path) => ({
      path,
      changeFrequency: 'monthly' as const,
      priority: 0.5,
    })),
    ...LEGAL_ROUTES.map((path) => ({
      path,
      changeFrequency: 'monthly' as const,
      priority: 0.3,
    })),
  ]
}
