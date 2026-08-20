import { NextRequest, NextResponse } from 'next/server'
import { LeadSubmissionSchema } from '@/lib/lead-schema'
import { appendLeadToSheet } from '@/lib/google-sheets'
import { sendLeadConversions } from '@/lib/conversions-api'

export const runtime = 'nodejs'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    if (body.website_confirm) {
      return NextResponse.json({ success: true })
    }

    const leadId = crypto.randomUUID()
    const result = LeadSubmissionSchema.safeParse({
      ...body,
      leadId,
      userAgent:   request.headers.get('user-agent') ?? '',
      submittedAt: new Date().toISOString(),
    })

    if (!result.success) {
      return NextResponse.json(
        { error: 'Validation failed', issues: result.error.flatten() },
        { status: 400 }
      )
    }

    await appendLeadToSheet(result.data)
    const conversionDelivery = await sendLeadConversions(result.data)
    console.info('[leads] conversion delivery:', conversionDelivery)
    return NextResponse.json({ success: true, leadId })
  } catch (error) {
    console.error('[leads] submission error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
