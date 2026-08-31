import { createHash, timingSafeEqual } from 'node:crypto'
import { NextRequest, NextResponse } from 'next/server'
import { sendMetaLeadOutcome } from '@/lib/conversions-api'
import { LeadOutcomeUpdateSchema, META_OUTCOME_EVENTS } from '@/lib/lead-outcome'

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

    const delivery = await sendMetaLeadOutcome(parsed.data)
    return NextResponse.json({
      success: true,
      delivery,
      events: delivery === 'sent' ? META_OUTCOME_EVENTS[parsed.data.outcome] : [],
      reason: delivery === 'skipped' ? 'meta_not_configured' : undefined,
    })
  } catch (error) {
    console.error('[lead-outcome] Meta delivery failed:', error)
    return NextResponse.json({ error: 'Outcome delivery failed' }, { status: 502 })
  }
}
