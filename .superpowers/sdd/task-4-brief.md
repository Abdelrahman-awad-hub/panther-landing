### Task 4: Google Sheets Integration + Leads API Route

**Files:**
- Create: `lib/lead-schema.ts`
- Create: `lib/google-sheets.ts`
- Create: `app/api/leads/route.ts`

**Interfaces:**
- Produces: `LeadSubmission` Zod type; `appendLeadToSheet(data: LeadSubmission): Promise<void>`; `POST /api/leads` returning `{ success: true }` or `{ error: string, status: 400|500 }`

- [ ] **Step 1: Create lead validation schema**

Create `lib/lead-schema.ts`:

```typescript
import { z } from 'zod'

export const LeadSubmissionSchema = z.object({
  brandName: z.string().min(1),
  phone: z
    .string()
    .min(1)
    .regex(/^(\+20|0020|0)?1[0125][0-9]{8}$/, 'Invalid Egyptian phone number'),
  volumeCategory: z.enum(['300', '1000', '5000', '5000plus']),
  socialLink:  z.union([z.string().url(), z.literal('')]).optional(),
  websiteUrl:  z.union([z.string().url(), z.literal('')]).optional(),
  referrerUrl: z.string().optional().default(''),
  landingUrl:  z.string().optional().default(''),
  utmSource:   z.string().optional().default(''),
  utmMedium:   z.string().optional().default(''),
  utmCampaign: z.string().optional().default(''),
  utmTerm:     z.string().optional().default(''),
  utmContent:  z.string().optional().default(''),
  userAgent:   z.string().optional().default(''),
  submittedAt: z.string().optional(),
  website_confirm: z.string().max(0).optional(),
})

export type LeadSubmission = z.infer<typeof LeadSubmissionSchema>
```

- [ ] **Step 2: Create Google Sheets utility**

Create `lib/google-sheets.ts`:

```typescript
import { google } from 'googleapis'
import { env } from './env'
import type { LeadSubmission } from './lead-schema'

async function getSheetsClient() {
  const auth = new google.auth.GoogleAuth({
    credentials: {
      client_email: env.google.serviceAccountEmail,
      private_key: env.google.privateKey,
    },
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
  })
  const authClient = await auth.getClient()
  return google.sheets({ version: 'v4', auth: authClient as Parameters<typeof google.sheets>[0]['auth'] })
}

export async function appendLeadToSheet(data: LeadSubmission): Promise<void> {
  const sheets = await getSheetsClient()
  const row = [
    data.submittedAt ?? new Date().toISOString(),
    data.brandName,
    data.phone,
    data.volumeCategory,
    data.socialLink  ?? '',
    data.websiteUrl  ?? '',
    data.referrerUrl ?? '',
    data.landingUrl  ?? '',
    data.utmSource   ?? '',
    data.utmMedium   ?? '',
    data.utmCampaign ?? '',
    data.utmTerm     ?? '',
    data.utmContent  ?? '',
    data.userAgent   ?? '',
  ]
  await sheets.spreadsheets.values.append({
    spreadsheetId: env.google.sheetId,
    range: 'Sheet1!A:N',
    valueInputOption: 'USER_ENTERED',
    requestBody: { values: [row] },
  })
}
```

- [ ] **Step 3: Create Leads API route**

Create `app/api/leads/route.ts`:

```typescript
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
```

- [ ] **Step 4: Commit backend**

```bash
git add -A
git commit -m "feat: add Google Sheets integration, lead validation schema, and leads API route"
```

---

