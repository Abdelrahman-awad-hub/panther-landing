'use client'

import { useEffect, useRef } from 'react'
import { usePathname } from 'next/navigation'
import { useLocale } from 'next-intl'
import { trackEvent } from '@/lib/analytics'
import { captureLeadAttribution } from '@/lib/attribution'

export function GtmPageview() {
  const pathname = usePathname()
  const locale = useLocale()
  const previousPath = useRef<string | null>(null)

  useEffect(() => {
    captureLeadAttribution()

    // The Google tag sends the initial page_view. Only report client-side
    // route changes here so the first page is never counted twice.
    if (previousPath.current === null) {
      previousPath.current = pathname
      return
    }
    if (pathname === previousPath.current) return
    previousPath.current = pathname
    trackEvent('virtual_page_view', { language: locale })
  }, [locale, pathname])

  return null
}
