import { createHash } from 'node:crypto'
import type { LeadSubmission } from '@/lib/lead-schema'
import { META_OUTCOME_EVENTS, type LeadOutcomeUpdate } from '@/lib/lead-outcome'

type ProviderResult = 'sent' | 'skipped' | 'failed'

export type ConversionDelivery = {
  meta: ProviderResult
  tiktok: ProviderResult
}

function sha256(value: string) {
  return createHash('sha256').update(value.trim().toLowerCase()).digest('hex')
}

function normalizeEgyptianPhone(phone: string) {
  let digits = phone.replace(/\D/g, '')
  if (digits.startsWith('0020')) digits = digits.slice(2)
  else if (digits.startsWith('0')) digits = `20${digits.slice(1)}`
  else if (digits.startsWith('1')) digits = `20${digits}`
  return digits
}

function metaConfig() {
  const pixelId = process.env.META_PIXEL_ID
  const accessToken = process.env.META_CAPI_ACCESS_TOKEN
  if (!pixelId || !accessToken) return null

  const apiVersion = process.env.META_GRAPH_API_VERSION || 'v23.0'
  const url = new URL(`https://graph.facebook.com/${apiVersion}/${encodeURIComponent(pixelId)}/events`)
  url.searchParams.set('access_token', accessToken)
  return { url }
}

async function postMetaEvents(events: Record<string, unknown>[]): Promise<ProviderResult> {
  const config = metaConfig()
  if (!config) return 'skipped'

  const body: Record<string, unknown> = { data: events }
  const metaTestEventCode = testEventCode(process.env.META_TEST_EVENT_CODE)
  if (metaTestEventCode) body.test_event_code = metaTestEventCode

  const response = await fetch(config.url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
    signal: AbortSignal.timeout(5000),
  })
  if (!response.ok) throw new Error(`Meta CAPI returned ${response.status}`)
  return 'sent'
}

function eventTimestamp(data: LeadSubmission) {
  const timestamp = data.submittedAt ? Date.parse(data.submittedAt) : Date.now()
  return Number.isFinite(timestamp) ? Math.floor(timestamp / 1000) : Math.floor(Date.now() / 1000)
}

function testEventCode(configuredCode: string | undefined) {
  const deploymentEnvironment = process.env.VERCEL_ENV ?? process.env.NODE_ENV
  return deploymentEnvironment === 'production' ? undefined : configuredCode
}

function metaFbc(data: LeadSubmission) {
  if (!data.fbclid) return undefined
  return `fb.1.${eventTimestamp(data) * 1000}.${data.fbclid}`
}

async function sendMetaLead(data: LeadSubmission): Promise<ProviderResult> {
  const userData: Record<string, string | string[]> = {
    ph: [sha256(normalizeEgyptianPhone(data.phone))],
    external_id: [sha256(data.leadId)],
  }
  if (data.userAgent) userData.client_user_agent = data.userAgent
  if (data.clientIp) userData.client_ip_address = data.clientIp
  if (data.fbp) userData.fbp = data.fbp
  const fbc = metaFbc(data)
  if (fbc) userData.fbc = fbc

  return postMetaEvents([{
    event_name: 'Lead',
    event_time: eventTimestamp(data),
    event_id: data.leadId,
    action_source: 'website',
    event_source_url: data.landingUrl || 'https://landing.panther-express.com/',
    user_data: userData,
    custom_data: {
      form_name: 'seller_application',
      form_source: data.formSource,
      volume_category: data.volumeCategory,
      lead_qualification: data.leadQualification,
      warehouse_interest: data.warehouseInterest,
    },
  }])
}

/**
 * Sends sales-qualified and contracted milestones back to Meta. The event IDs
 * are deterministic, so retries or repeated sheet edits are deduplicated.
 * A disqualified lead is a separate custom event and can never inflate Lead,
 * QualifiedLead, or CompleteRegistration reporting.
 */
export async function sendMetaLeadOutcome(data: LeadOutcomeUpdate): Promise<ProviderResult> {
  if (!data.marketingConsent) return 'skipped'

  const occurredAt = data.occurredAt ? Date.parse(data.occurredAt) : Date.now()
  const eventTime = Number.isFinite(occurredAt)
    ? Math.floor(occurredAt / 1000)
    : Math.floor(Date.now() / 1000)
  const userData: Record<string, string | string[]> = {
    ph: [sha256(normalizeEgyptianPhone(data.phone))],
    external_id: [sha256(data.leadId)],
  }
  if (data.fbp) userData.fbp = data.fbp
  if (data.fbclid) {
    const submittedAt = data.submittedAt ? Date.parse(data.submittedAt) : occurredAt
    const clickTimestamp = Number.isFinite(submittedAt) ? submittedAt : occurredAt
    userData.fbc = `fb.1.${clickTimestamp}.${data.fbclid}`
  }
  const events = META_OUTCOME_EVENTS[data.outcome].map((eventName) => ({
    event_name: eventName,
    event_time: eventTime,
    event_id: `${data.leadId}:${eventName}`,
    action_source: 'system_generated',
    user_data: userData,
    custom_data: {
      lead_event_source: 'panther_google_sheets_crm',
      lead_status: data.outcome,
    },
  }))

  return postMetaEvents(events)
}

async function sendTikTokLead(data: LeadSubmission): Promise<ProviderResult> {
  const pixelCode = process.env.TIKTOK_PIXEL_CODE
  const accessToken = process.env.TIKTOK_EVENTS_API_ACCESS_TOKEN
  if (!pixelCode || !accessToken) return 'skipped'

  const user: Record<string, string | string[]> = {
    phone: [sha256(normalizeEgyptianPhone(data.phone))],
    external_id: [sha256(data.leadId)],
  }
  if (data.userAgent) user.user_agent = data.userAgent
  if (data.clientIp) user.ip = data.clientIp
  if (data.ttclid) user.ttclid = data.ttclid
  if (data.ttp) user.ttp = data.ttp

  const body: Record<string, unknown> = {
    event_source: 'web',
    event_source_id: pixelCode,
    data: [{
      event: 'Lead',
      event_time: eventTimestamp(data),
      event_id: data.leadId,
      user,
      page: {
        url: data.landingUrl || 'https://landing.panther-express.com/',
        referrer: data.referrerUrl || undefined,
      },
      properties: {
        form_name: 'seller_application',
        form_source: data.formSource,
        volume_category: data.volumeCategory,
        lead_qualification: data.leadQualification,
        warehouse_interest: data.warehouseInterest,
      },
    }],
  }
  const tiktokTestEventCode = testEventCode(process.env.TIKTOK_TEST_EVENT_CODE)
  if (tiktokTestEventCode) body.test_event_code = tiktokTestEventCode

  const response = await fetch(
    process.env.TIKTOK_EVENTS_API_URL || 'https://business-api.tiktok.com/open_api/v1.3/event/track/',
    {
      method: 'POST',
      headers: {
        'Access-Token': accessToken,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
      signal: AbortSignal.timeout(5000),
    }
  )
  const responseBody = await response.json().catch(() => null) as {
    code?: number
    message?: string
    request_id?: string
  } | null
  if (!response.ok || responseBody?.code !== 0) {
    const details = responseBody
      ? `code=${responseBody.code ?? 'unknown'} message=${responseBody.message ?? 'unknown'} request_id=${responseBody.request_id ?? 'unknown'}`
      : 'invalid JSON response'
    throw new Error(`TikTok Events API returned HTTP ${response.status}: ${details}`)
  }
  return 'sent'
}

/**
 * Sends only a stored lead and only after explicit marketing consent. Provider
 * failures never roll back the lead or expose credentials to the browser.
 */
export async function sendLeadConversions(data: LeadSubmission): Promise<ConversionDelivery> {
  if (!data.marketingConsent) return { meta: 'skipped', tiktok: 'skipped' }

  const [meta, tiktok] = await Promise.allSettled([sendMetaLead(data), sendTikTokLead(data)])
  if (meta.status === 'rejected') console.error('[conversions] Meta delivery failed:', meta.reason)
  if (tiktok.status === 'rejected') console.error('[conversions] TikTok delivery failed:', tiktok.reason)

  return {
    meta: meta.status === 'fulfilled' ? meta.value : 'failed',
    tiktok: tiktok.status === 'fulfilled' ? tiktok.value : 'failed',
  }
}
