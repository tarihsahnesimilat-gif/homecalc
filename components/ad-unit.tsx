'use client'

import { useEffect, useRef } from 'react'

import { adsenseClientId } from '@/lib/site'

interface AdUnitProps {
  /** The ad slot id from the AdSense dashboard, e.g. "1234567890". */
  slot: string
  /** `auto` responds to the container width; use `horizontal` for in-article. */
  format?: 'auto' | 'horizontal' | 'rectangle' | 'vertical'
  className?: string
}

/**
 * A single manually placed AdSense unit.
 *
 * Two things here are policy, not preference. The unit is labelled
 * "Advertisement" because an ad must never be mistakable for site content —
 * placing an unlabelled unit directly under a calculator result is one of the
 * fastest ways to get an account limited. And the slot reserves its height
 * before the ad arrives, so the page does not jump as it loads.
 *
 * Renders nothing without a publisher id, which keeps empty grey boxes out of
 * previews and local development.
 */
export function AdUnit({ slot, format = 'auto', className }: AdUnitProps) {
  const pushed = useRef(false)

  useEffect(() => {
    if (!adsenseClientId || pushed.current) {
      return
    }

    pushed.current = true
    try {
      const adsbygoogle = ((window as unknown as { adsbygoogle?: unknown[] }).adsbygoogle ??= [])
      adsbygoogle.push({})
    } catch {
      // A blocked or not-yet-loaded ad script must never break the calculator.
    }
  }, [])

  if (!adsenseClientId) {
    return null
  }

  return (
    <aside
      aria-label="Advertisement"
      className={`my-8 min-h-[280px] overflow-hidden text-center ${className ?? ''}`}
    >
      <p className="mb-2 text-xs uppercase tracking-wide text-muted-foreground">Advertisement</p>
      <ins
        className="adsbygoogle block"
        style={{ display: 'block' }}
        data-ad-client={adsenseClientId}
        data-ad-slot={slot}
        data-ad-format={format}
        data-full-width-responsive="true"
      />
    </aside>
  )
}
