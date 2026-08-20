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
      setShowDialog(stored === 'unknown')
    })
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
          aria-modal="true"
          aria-labelledby="tracking-consent-title"
          dir={locale === 'ar' ? 'rtl' : 'ltr'}
          className="fixed inset-x-3 bottom-3 z-[100] mx-auto max-w-2xl rounded-2xl border border-gray-200 bg-white p-5 text-gray-900 shadow-2xl sm:inset-x-6"
        >
          <h2 id="tracking-consent-title" className="text-base font-bold">{t('title')}</h2>
          <p className="mt-2 text-sm leading-6 text-gray-600">{t('description')}</p>
          <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={() => choose('denied')}
              className="rounded-lg border border-gray-300 px-4 py-2.5 text-sm font-semibold hover:bg-gray-50"
            >
              {t('reject')}
            </button>
            <button
              type="button"
              onClick={() => choose('granted')}
              className="rounded-lg bg-panther-red px-4 py-2.5 text-sm font-bold text-white hover:bg-panther-red-dark"
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
          className="fixed bottom-3 left-3 z-[90] rounded-full border border-gray-200 bg-white px-3 py-2 text-xs font-semibold text-gray-700 shadow-lg hover:bg-gray-50"
        >
          {t('settings')}
        </button>
      )}
    </>
  )
}
