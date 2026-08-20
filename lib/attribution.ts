'use client'

export type LeadAttribution = {
  referrerUrl: string
  landingUrl: string
  utmSource: string
  utmMedium: string
  utmCampaign: string
  utmTerm: string
  utmContent: string
  gclid: string
  fbclid: string
  ttclid: string
}

const STORAGE_KEY = 'panther_lead_attribution_v1'

function fromCurrentPage(): LeadAttribution {
  const params = new URLSearchParams(window.location.search)
  return {
    referrerUrl: document.referrer,
    landingUrl: window.location.href,
    utmSource: params.get('utm_source') ?? '',
    utmMedium: params.get('utm_medium') ?? '',
    utmCampaign: params.get('utm_campaign') ?? '',
    utmTerm: params.get('utm_term') ?? '',
    utmContent: params.get('utm_content') ?? '',
    gclid: params.get('gclid') ?? '',
    fbclid: params.get('fbclid') ?? '',
    ttclid: params.get('ttclid') ?? '',
  }
}

/** Keeps the session's original acquisition data across internal navigation. */
export function captureLeadAttribution(): LeadAttribution {
  const current = fromCurrentPage()

  try {
    const stored = window.sessionStorage.getItem(STORAGE_KEY)
    if (stored) return JSON.parse(stored) as LeadAttribution
    window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify(current))
  } catch {
    // Storage can be unavailable in strict privacy modes; current-page data is
    // still a safe fallback and the form must remain fully functional.
  }

  return current
}

