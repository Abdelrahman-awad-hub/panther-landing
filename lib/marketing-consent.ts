'use client'

export type MarketingConsent = 'granted' | 'denied' | 'unknown'

const STORAGE_KEY = 'panther_marketing_consent_v1'

export function getMarketingConsent(): MarketingConsent {
  if (typeof window === 'undefined') return 'unknown'

  try {
    const value = window.localStorage.getItem(STORAGE_KEY)
    return value === 'granted' || value === 'denied' ? value : 'unknown'
  } catch {
    return 'unknown'
  }
}

export function setMarketingConsent(value: Exclude<MarketingConsent, 'unknown'>) {
  try {
    window.localStorage.setItem(STORAGE_KEY, value)
  } catch {
    // Consent remains limited to the current page when storage is unavailable.
  }
}

export function readCookie(name: string): string {
  if (typeof document === 'undefined') return ''

  const prefix = `${encodeURIComponent(name)}=`
  const match = document.cookie
    .split(';')
    .map((part) => part.trim())
    .find((part) => part.startsWith(prefix))

  return match ? decodeURIComponent(match.slice(prefix.length)) : ''
}
