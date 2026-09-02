/**
 * Single place for the canonical site origin used by metadata, robots and the
 * sitemap.
 *
 * `NEXT_PUBLIC_SITE_URL` lets a deployment set its real domain without any code
 * change — set it in the hosting provider's environment settings before going
 * live, or canonical URLs and the sitemap will point at the placeholder below.
 * It is read at build time, contains no secret, and is optional: local
 * development and the test suite work without it.
 */
const FALLBACK_URL = 'https://calculatorhub.example.com'

function resolveSiteUrl(): string {
  const configured = process.env.NEXT_PUBLIC_SITE_URL?.trim()
  if (!configured) return FALLBACK_URL

  // A trailing slash would produce doubled slashes once paths are appended.
  return configured.replace(/\/+$/, '')
}

export const siteConfig = {
  name: 'CalculatorHub',
  url: resolveSiteUrl(),
  description:
    'Free, fast, and easy-to-use calculators for math, money, health, home, and education.',
} as const

export function absoluteUrl(path = '/'): string {
  return new URL(path, siteConfig.url).toString()
}
