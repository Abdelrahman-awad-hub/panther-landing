'use client'

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
] as const

/**
 * Pushes a clean, event-specific payload to GTM.
 * Resetting shared fields prevents values from an earlier event being reused
 * by later tags through GTM's persistent data model.
 */
export function trackEvent(event: string, payload: AnalyticsPayload = {}) {
  if (typeof window === 'undefined') return

  const resetFields = Object.fromEntries(EVENT_FIELDS.map((field) => [field, null]))
  const pageContext = {
    page_path: window.location.pathname,
    page_location: window.location.href,
    page_title: document.title,
  }
  window.dataLayer = window.dataLayer ?? []
  window.dataLayer.push({ ...resetFields, ...pageContext, ...payload, event })
}
