import { createHash, timingSafeEqual } from 'node:crypto'
import { NextRequest, NextResponse } from 'next/server'
import { sendMetaLeadOutcome } from '@/lib/conversions-api'
import { LeadOutcomeUpdateSchema, META_OUTCOME_EVENTS } from '@/lib/lead-outcome'
import { sendGa4LeadOutcome } from '@/lib/ga4-measurement-protocol'

export const runtime = 'nodejs'

function secureEquals(left: string, right: string) {
  const leftHash = createHash('sha256').update(left).digest()
  const rightHash = createHash('sha256').update(right).digest()
  return timingSafeEqual(leftHash, rightHash)
}

export async function POST(request: NextRequest) {
  const configuredSecret = process.env.CRM_WEBHOOK_SECRET
  const providedSecret = request.headers.get('x-crm-webhook-secret') ?? ''

  if (!configuredSecret || !providedSecret || !secureEquals(configuredSecret, providedSecret)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const parsed = LeadOutcomeUpdateSchema.safeParse(await request.json())
    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Validation failed', issues: parsed.error.flatten() },
        { status: 400 }
      )
    }

    const [metaResult, ga4Result] = await Promise.allSettled([
      sendMetaLeadOutcome(parsed.data),
      sendGa4LeadOutcome(parsed.data),
    ])
    if (metaResult.status === 'rejected') console.error('[lead-outcome] Meta delivery failed:', metaResult.reason)
    if (ga4Result.status === 'rejected') console.error('[lead-outcome] GA4 delivery failed:', ga4Result.reason)
    const delivery = {
      meta: metaResult.status === 'fulfilled' ? metaResult.value : 'failed',
      ga4: ga4Result.status === 'fulfilled' ? ga4Result.value : 'failed',
    }
    return NextResponse.json({
      success: true,
      delivery,
      events: delivery.meta === 'sent' ? META_OUTCOME_EVENTS[parsed.data.outcome] : [],
    })
  } catch (error) {
    console.error('[lead-outcome] outcome delivery failed:', error)
    return NextResponse.json({ error: 'Outcome delivery failed' }, { status: 502 })
  }
}
