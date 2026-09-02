import { ImageResponse } from 'next/og'

import { siteConfig } from '@/lib/site'

/**
 * Site-wide social preview card. Every route inherits this unless it exports
 * its own, so one file gives all 61 pages an `og:image` instead of the blank
 * card links previously produced when shared.
 *
 * Rendered at build time with the runtime's default font, so the build needs
 * no network access and the project needs no image assets.
 */
export const alt = `${siteConfig.name} — ${siteConfig.description}`
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

const NAVY = '#1e3a5f'
const TEAL = '#0891b2'

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          padding: '80px',
          background: NAVY,
          color: '#ffffff',
        }}
      >
        <div style={{ fontSize: 40, color: TEAL, letterSpacing: '-0.01em' }}>
          {siteConfig.name}
        </div>
        <div style={{ marginTop: 24, fontSize: 76, lineHeight: 1.1, letterSpacing: '-0.03em' }}>
          Simple calculators for everyday life
        </div>
        <div style={{ marginTop: 32, fontSize: 32, color: '#cbd5e1' }}>
          Free, fast, and no sign-up. Every calculation runs in your browser.
        </div>
        <div style={{ marginTop: 48, height: 8, width: 200, background: TEAL, borderRadius: 4 }} />
      </div>
    ),
    size,
  )
}
