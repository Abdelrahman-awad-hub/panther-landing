import { createHash } from 'node:crypto'
import { GA4_OUTCOME_EVENTS, type LeadOutcomeUpdate } from './lead-outcome'

export type Ga4Delivery = 'sent' | 'skipped' | 'failed'

function stableUserId(leadId: string) {
  return createHash('sha256').update(leadId).digest('hex')
}

/** Sends CRM milestones to GA4 without names, phone numbers, or free text. */
export async function sendGa4LeadOutcome(data: LeadOutcomeUpdate): Promise<Ga4Delivery> {
  const measurementId = process.env.GA4_MEASUREMENT_ID
  const apiSecret = process.env.GA4_API_SECRET
  if (!measurementId || !apiSecret || !data.clientId) return 'skipped'

  const url = new URL('https://www.google-analytics.com/mp/collect')
  url.searchParams.set('measurement_id', measurementId)
  url.searchParams.set('api_secret', apiSecret)

  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      client_id: data.clientId,
      user_id: stableUserId(data.leadId),
      timestamp_micros: data.occurredAt
        ? Math.floor(Date.parse(data.occurredAt) * 1000).toString()
        : undefined,
      events: [{
        name: GA4_OUTCOME_EVENTS[data.outcome],
        params: {
          lead_id: data.leadId,
          lead_status: data.outcome,
          lead_event_source: 'panther_google_sheets_crm',
          session_id: data.sessionId || undefined,
          engagement_time_msec: 1,
        },
      }],
    }),
    signal: AbortSignal.timeout(5000),
  })
  if (!response.ok) throw new Error(`GA4 Measurement Protocol returned ${response.status}`)
  return 'sent'
}
