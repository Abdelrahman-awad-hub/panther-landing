'use client'

import { useEffect, useState } from 'react'
import { useLocale, useTranslations } from 'next-intl'
import { getMarketingConsent, setMarketingConsent, type MarketingConsent } from '@/lib/marketing-consent'

type ConsentAwareGtmProps = {
  gtmId?: string
}

const GTM_SCRIPT_ID = 'panther-gtm-script'

function applyGoogleConsent(command: 'default' | 'update', granted: boolean) {
  window.dataLayer = window.dataLayer ?? []

  function gtag(...args: unknown[]) {
    window.dataLayer?.push(args)
  }

  gtag('consent', command, {
    analytics_storage: granted ? 'granted' : 'denied',
    ad_storage: granted ? 'granted' : 'denied',
    ad_user_data: granted ? 'granted' : 'denied',
    ad_personalization: granted ? 'granted' : 'denied',
    wait_for_update: command === 'default' ? 500 : undefined,
  })
  gtag('set', 'ads_data_redaction', !granted)
}

function loadGtm(gtmId: string) {
  if (document.getElementById(GTM_SCRIPT_ID)) return

  window.dataLayer = window.dataLayer ?? []
  window.dataLayer.push({ 'gtm.start': Date.now(), event: 'gtm.js' })

  const script = document.createElement('script')
  script.id = GTM_SCRIPT_ID
  script.async = true
  script.src = `https://www.googletagmanager.com/gtm.js?id=${encodeURIComponent(gtmId)}`
  document.head.appendChild(script)
}

function clearFirstPartyMarketingCookies() {
  for (const name of ['_fbp', '_ttp']) {
    document.cookie = `${name}=; Max-Age=0; path=/; SameSite=Lax`
  }
}

export function ConsentAwareGtm({ gtmId }: ConsentAwareGtmProps) {
  const t = useTranslations('consent')
  const locale = useLocale()
  const [consent, setConsentState] = useState<MarketingConsent>('unknown')
  const [showDialog, setShowDialog] = useState(false)

  useEffect(() => {
    const stored = getMarketingConsent()
    applyGoogleConsent('default', stored === 'granted')
    if (stored === 'granted' && gtmId) loadGtm(gtmId)

    queueMicrotask(() => {
      setConsentState(stored)
      if (stored !== 'unknown') setShowDialog(false)
    })

    if (stored !== 'unknown') return

    // Keep the first visit focused on the offer. The choice remains explicit,
    // but appears after the visitor has had time to understand the page.
    const dialogTimer = window.setTimeout(() => setShowDialog(true), 3500)
    return () => window.clearTimeout(dialogTimer)
  }, [gtmId])

  const choose = (value: Exclude<MarketingConsent, 'unknown'>) => {
    const hadLoadedGtm = Boolean(document.getElementById(GTM_SCRIPT_ID))
    setMarketingConsent(value)
    setConsentState(value)
    setShowDialog(false)
    applyGoogleConsent('update', value === 'granted')
    window.dataLayer?.push({ event: 'consent_update', marketing_consent: value, language: locale })

    if (value === 'granted' && gtmId) loadGtm(gtmId)
    if (value === 'denied') {
      clearFirstPartyMarketingCookies()
      if (hadLoadedGtm) window.location.reload()
    }
  }

  return (
    <>
      {showDialog && (
        <section
          role="dialog"
          aria-modal="false"
          aria-labelledby="tracking-consent-title"
          dir={locale === 'ar' ? 'rtl' : 'ltr'}
          className="fixed inset-x-3 bottom-3 z-[100] mx-auto max-w-3xl rounded-xl border border-gray-200 bg-white/95 p-3 text-gray-900 shadow-xl backdrop-blur sm:inset-x-6 sm:flex sm:items-center sm:gap-4 sm:px-4"
        >
          <div className="min-w-0 flex-1">
            <h2 id="tracking-consent-title" className="text-sm font-bold">{t('title')}</h2>
            <p className="mt-1 text-xs leading-5 text-gray-600">{t('description')}</p>
          </div>
          <div className="mt-3 flex shrink-0 gap-2 sm:mt-0 sm:justify-end">
            <button
              type="button"
              onClick={() => choose('denied')}
              className="flex-1 rounded-lg border border-gray-300 px-3 py-2 text-xs font-semibold hover:bg-gray-50 sm:flex-none"
            >
              {t('reject')}
            </button>
            <button
              type="button"
              onClick={() => choose('granted')}
              className="flex-1 rounded-lg bg-panther-red px-3 py-2 text-xs font-bold text-white hover:bg-panther-red-dark sm:flex-none"
            >
              {t('accept')}
            </button>
          </div>
        </section>
      )}

      {consent !== 'unknown' && !showDialog && (
        <button
          type="button"
          onClick={() => setShowDialog(true)}
          className="fixed bottom-3 left-1/2 z-[90] -translate-x-1/2 rounded-full border border-gray-200 bg-white px-2.5 py-1.5 text-[11px] font-semibold text-gray-700 shadow-md hover:bg-gray-50"
        >
          {t('settings')}
        </button>
      )}
    </>
  )
}
