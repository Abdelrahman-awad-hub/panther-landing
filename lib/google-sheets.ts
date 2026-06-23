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
    valueInputOption: 'RAW',
    requestBody: { values: [row] },
  })
}
