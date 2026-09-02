'use client'

import { captureLeadAttribution } from './attribution'

type AnalyticsValue = string | number | boolean | null
type AnalyticsPayload = Record<string, AnalyticsValue>

const EVENT_FIELDS = [
  'cta_name',
  'cta_location',
  'contact_method',
  'contact_location',
  'form_name',
  'form_source',
  'lead_id',
  'event_id',
  'language',
  'link_url',
  'lead_source',
  'tracking_outcome',
  'track_status',
  'error_type',
  'error_fields',
  'volume_category',
  'lead_qualification',
  'warehouse_interest',
  'engagement_seconds',
  'scroll_percent',
  'story_id',
  'story_name',
  'audience_signal',
  'form_id',
  'field_name',
  'service_type',
  'expected_shipments',
  'city',
  'event_time',
  'page_type',
  'landing_page',
  'referrer',
  'utm_source',
  'utm_medium',
  'utm_campaign',
  'utm_term',
  'utm_content',
  'gclid',
  'fbclid',
  'ttclid',
  'client_id',
  'session_id',
] as const

function eventId() {
  return typeof crypto.randomUUID === 'function'
    ? crypto.randomUUID()
    : `${Date.now()}-${Math.random().toString(36).slice(2)}`
}

/**
 * Pushes a clean, event-specific payload to GTM.
 * Resetting shared fields prevents values from an earlier event being reused
 * by later tags through GTM's persistent data model.
 */
export function trackEvent(event: string, payload: AnalyticsPayload = {}) {
  if (typeof window === 'undefined') return

  const resetFields = Object.fromEntries(EVENT_FIELDS.map((field) => [field, null]))
  const attribution = captureLeadAttribution()
  const pageContext = {
    page_path: window.location.pathname,
    page_location: window.location.href,
    page_title: document.title,
    page_type: window.location.pathname === '/' || /^\/(ar|en)\/?$/.test(window.location.pathname)
      ? 'landing_page'
      : 'content_page',
    landing_page: attribution.firstTouchLandingUrl,
    referrer: attribution.firstTouchReferrerUrl,
    utm_source: attribution.lastTouchUtmSource || attribution.firstTouchUtmSource,
    utm_medium: attribution.lastTouchUtmMedium || attribution.firstTouchUtmMedium,
    utm_campaign: attribution.lastTouchUtmCampaign || attribution.firstTouchUtmCampaign,
    utm_term: attribution.lastTouchUtmTerm || attribution.firstTouchUtmTerm,
    utm_content: attribution.lastTouchUtmContent || attribution.firstTouchUtmContent,
    gclid: attribution.lastTouchGclid || attribution.firstTouchGclid,
    fbclid: attribution.lastTouchFbclid || attribution.firstTouchFbclid,
    ttclid: attribution.lastTouchTtclid || attribution.firstTouchTtclid,
    client_id: attribution.clientId,
    session_id: attribution.sessionId,
    event_time: new Date().toISOString(),
  }
  window.dataLayer = window.dataLayer ?? []
  window.dataLayer.push({ ...resetFields, ...pageContext, event_id: eventId(), ...payload, event })
}
