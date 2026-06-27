'use client'

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'

export function GtmPageview() {
  const pathname = usePathname()

  useEffect(() => {
    window.dataLayer?.push({ event: 'pageview', page: pathname })
  }, [pathname])

  return null
}
