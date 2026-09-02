/** Single place for the canonical site origin used by metadata, robots and sitemap. */
export const siteConfig = {
  name: 'CalculatorHub',
  url: 'https://calculatorhub.example.com',
  description:
    'Free, fast, and easy-to-use calculators for math, money, health, home, and education.',
} as const

export function absoluteUrl(path = '/'): string {
  return new URL(path, siteConfig.url).toString()
}
