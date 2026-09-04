import { NextRequest, NextResponse } from 'next/server'
import { LeadSubmissionSchema } from '@/lib/lead-schema'
import { appendLeadToSheet } from '@/lib/google-sheets'
import { sendLeadConversions } from '@/lib/conversions-api'
import { classifyLead, needsWarehouseQuestion } from '@/lib/lead-qualification'

export const runtime = 'nodejs'

function getClientIp(request: NextRequest) {
  const forwardedFor = request.headers.get('x-forwarded-for')
  return (forwardedFor?.split(',')[0] || request.headers.get('x-real-ip') || '').trim()
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    if (body.website_confirm) {
      return NextResponse.json({ success: true })
    }

    const leadId = crypto.randomUUID()
    const warehouseInterest = needsWarehouseQuestion(body.city, body.volumeCategory)
      ? body.warehouseInterest
      : 'not_applicable'
    const leadQualification = classifyLead({ ...body, warehouseInterest })
    const result = LeadSubmissionSchema.safeParse({
      ...body,
      warehouseInterest,
      leadQualification,
      marketingConsent: true,
      leadId,
      userAgent:   request.headers.get('user-agent') ?? '',
      clientIp:    getClientIp(request),
      submittedAt: new Date().toISOString(),
    })

    if (!result.success) {
      const errorMessages = result.error.issues.map(issue => `${issue.path.join('.')}: ${issue.message}`).join(', ')
      console.error('[leads] validation failed:', errorMessages)
      return NextResponse.json(
        { error: 'Validation failed', issues: errorMessages },
        { status: 400 }
      )
    }

    try {
      await appendLeadToSheet(result.data)
    } catch (sheetError) {
      console.error('[leads] sheet append failed:', sheetError instanceof Error ? sheetError.message : 'unknown')
      throw sheetError
    }

    try {
      const conversionDelivery = await sendLeadConversions(result.data)
      console.info('[leads] conversion delivery:', conversionDelivery)
    } catch (conversionError) {
      console.error('[leads] conversion delivery failed:', conversionError instanceof Error ? conversionError.message : 'unknown')
    }

    return NextResponse.json({ success: true, leadId })
  } catch (error) {
    console.error('[leads] submission error:', error instanceof Error ? error.message : 'unknown')
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : 'unknown' },
      { status: 500 }
    )
  }
}
