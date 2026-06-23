import { NextRequest, NextResponse } from 'next/server'
import { LeadSubmissionSchema } from '@/lib/lead-schema'
import { appendLeadToSheet } from '@/lib/google-sheets'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    if (body.website_confirm) {
      return NextResponse.json({ success: true })
    }

    const result = LeadSubmissionSchema.safeParse({
      ...body,
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
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('[leads] submission error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
