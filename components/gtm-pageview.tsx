'use client'

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'
import { useLocale } from 'next-intl'
import { trackEvent } from '@/lib/analytics'

export function GtmPageview() {
  const pathname = usePathname()
  const locale = useLocale()

  useEffect(() => {
    trackEvent('virtual_page_view', { page_path: pathname, language: locale })
  }, [locale, pathname])

  return null
}
