'use client'

type AttributionTouch = {
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

export type LeadAttribution = AttributionTouch & {
  firstTouchReferrerUrl: string
  firstTouchLandingUrl: string
  firstTouchUtmSource: string
  firstTouchUtmMedium: string
  firstTouchUtmCampaign: string
  firstTouchUtmTerm: string
  firstTouchUtmContent: string
  firstTouchGclid: string
  firstTouchFbclid: string
  firstTouchTtclid: string
  lastTouchReferrerUrl: string
  lastTouchLandingUrl: string
  lastTouchUtmSource: string
  lastTouchUtmMedium: string
  lastTouchUtmCampaign: string
  lastTouchUtmTerm: string
  lastTouchUtmContent: string
  lastTouchGclid: string
  lastTouchFbclid: string
  lastTouchTtclid: string
  clientId: string
  sessionId: string
  fbp: string
  ttp: string
}

type StoredAttribution = { firstTouch: AttributionTouch; lastTouch: AttributionTouch }

const STORAGE_KEY = 'panther_lead_attribution_v2'

function readCookie(name: string): string {
  if (typeof document === 'undefined') return ''

  const prefix = `${encodeURIComponent(name)}=`
  const match = document.cookie
    .split(';')
    .map((part) => part.trim())
    .find((part) => part.startsWith(prefix))

  return match ? decodeURIComponent(match.slice(prefix.length)) : ''
}

function gaClientId() {
  const parts = readCookie('_ga').split('.')
  return parts.length >= 4 ? `${parts[2]}.${parts[3]}` : ''
}

function gaSessionId() {
  const cookie = document.cookie.split(';').map((part) => part.trim()).find((part) => part.startsWith('_ga_'))
  if (!cookie) return ''
  const parts = decodeURIComponent(cookie.slice(cookie.indexOf('=') + 1)).split('.')
  return parts.length >= 3 ? parts[2] : ''
}

function fromCurrentPage(): AttributionTouch {
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

function flatten(firstTouch: AttributionTouch, lastTouch: AttributionTouch): LeadAttribution {
  return {
    ...firstTouch,
    firstTouchReferrerUrl: firstTouch.referrerUrl,
    firstTouchLandingUrl: firstTouch.landingUrl,
    firstTouchUtmSource: firstTouch.utmSource,
    firstTouchUtmMedium: firstTouch.utmMedium,
    firstTouchUtmCampaign: firstTouch.utmCampaign,
    firstTouchUtmTerm: firstTouch.utmTerm,
    firstTouchUtmContent: firstTouch.utmContent,
    firstTouchGclid: firstTouch.gclid,
    firstTouchFbclid: firstTouch.fbclid,
    firstTouchTtclid: firstTouch.ttclid,
    lastTouchReferrerUrl: lastTouch.referrerUrl,
    lastTouchLandingUrl: lastTouch.landingUrl,
    lastTouchUtmSource: lastTouch.utmSource,
    lastTouchUtmMedium: lastTouch.utmMedium,
    lastTouchUtmCampaign: lastTouch.utmCampaign,
    lastTouchUtmTerm: lastTouch.utmTerm,
    lastTouchUtmContent: lastTouch.utmContent,
    lastTouchGclid: lastTouch.gclid,
    lastTouchFbclid: lastTouch.fbclid,
    lastTouchTtclid: lastTouch.ttclid,
    clientId: gaClientId(),
    sessionId: gaSessionId(),
    fbp: readCookie('_fbp'),
    ttp: readCookie('_ttp'),
  }
}

/** Keeps original and latest acquisition data separate across visits. */
export function captureLeadAttribution(): LeadAttribution {
  const current = fromCurrentPage()
  let firstTouch = current
  let lastTouch = current

  try {
    const stored = window.localStorage.getItem(STORAGE_KEY)
    if (stored) firstTouch = (JSON.parse(stored) as StoredAttribution).firstTouch
    lastTouch = current
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify({ firstTouch, lastTouch }))
  } catch {
    // Storage can be unavailable in strict privacy modes; current-page data remains the fallback.
  }

  return flatten(firstTouch, lastTouch)
}
