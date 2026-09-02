import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'

import { SiteFooter } from '@/components/site-footer'
import { siteConfig } from '@/lib/site'
import './globals.css'

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: 'CalculatorHub — Simple calculators for everyday life',
    template: '%s | CalculatorHub',
  },
  description: siteConfig.description,
  generator: 'CalculatorHub',
  alternates: { canonical: '/' },
  openGraph: {
    title: 'CalculatorHub — Numbers made simple',
    description: 'Free, fast, and easy-to-use calculators for everyday life.',
    url: '/',
    siteName: siteConfig.name,
    type: 'website',
  },
  icons: {
    icon: [
      {
        url: '/icon-light-32x32.png',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: '/icon-dark-32x32.png',
        media: '(prefers-color-scheme: dark)',
      },
      {
        url: '/icon.svg',
        type: 'image/svg+xml',
      },
    ],
    apple: '/apple-icon.png',
  },
}

export const viewport: Viewport = {
  colorScheme: 'light dark',
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: 'white' },
    { media: '(prefers-color-scheme: dark)', color: 'black' },
  ],
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="bg-background">
      <body className="flex min-h-screen flex-col font-sans antialiased">
        <div className="flex-1">{children}</div>
        <SiteFooter />
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
