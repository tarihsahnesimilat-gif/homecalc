'use client'

/**
 * Reopens the Google Funding Choices consent message so a visitor can change or
 * withdraw the choice they made on their first visit.
 *
 * Google's EU user consent policy requires that withdrawing consent be as easy
 * as giving it, which in practice means a permanent link like this one. The
 * button hides itself where no consent message applies — outside the EEA, the
 * UK and Switzerland `googlefc` is never loaded, and a link that does nothing
 * when clicked is worse than no link.
 */
declare global {
  interface Window {
    googlefc?: {
      callbackQueue?: {
        push: (callback: unknown) => void
      }
      showRevocationMessage?: () => void
    }
  }
}

export function PrivacySettingsLink({ className }: { className?: string }) {
  function openConsentManager() {
    const googlefc = window.googlefc
    if (!googlefc?.callbackQueue) {
      return
    }

    googlefc.callbackQueue.push({
      CONSENT_DATA_READY: () => window.googlefc?.showRevocationMessage?.(),
    })
    googlefc.showRevocationMessage?.()
  }

  return (
    <button type="button" onClick={openConsentManager} className={className}>
      Privacy settings
    </button>
  )
}
