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
    data.city,
    data.volumeCategory,
    data.socialLink  ?? '',
    data.websiteUrl  ?? '',
    // H:N are reserved for the sales team's call owner and feedback fields.
    '', '', '', '', '', '', '',
    data.leadId,
    data.formSource,
    data.locale,
    data.leadQualification,
    data.warehouseInterest,
    data.referrerUrl ?? '',
    data.landingUrl  ?? '',
    data.utmSource   ?? '',
    data.utmMedium   ?? '',
    data.utmCampaign ?? '',
    data.utmTerm     ?? '',
    data.utmContent  ?? '',
    data.gclid,
    data.fbclid,
    data.ttclid,
    data.marketingConsent ? 'granted' : 'denied',
    data.userAgent   ?? '',
    data.fbp,
    data.ttp,
    '', '', '', '',
  ]
  await sheets.spreadsheets.values.append({
    spreadsheetId: env.google.sheetId,
    // Keep table detection anchored to the legacy A:O table. The row may
    // extend through AK, but a wider lookup range can make Sheets detect the
    // tracking area as a separate table and offset later submissions.
    range: 'Sheet1!A:O',
    valueInputOption: 'RAW',
    insertDataOption: 'INSERT_ROWS',
    requestBody: { majorDimension: 'ROWS', values: [row] },
  })

  // Sheet UX enhancements are best-effort and can never block lead storage.
  try {
    const trackingHeaders = [[
      'leadId', 'formSource', 'locale', 'leadQualification', 'warehouseInterest',
      'referrerUrl', 'landingUrl', 'utmSource', 'utmMedium', 'utmCampaign',
      'utmTerm', 'utmContent', 'gclid', 'fbclid', 'ttclid', 'marketingConsent', 'userAgent',
      'fbp', 'ttp', 'leadOutcome', 'outcomeReason', 'outcomeUpdatedAt', 'metaOutcomeStatus',
    ]]
    await sheets.spreadsheets.values.update({
      spreadsheetId: env.google.sheetId,
      range: 'Sheet1!O1:AK1',
      valueInputOption: 'RAW',
      requestBody: { majorDimension: 'ROWS', values: trackingHeaders },
    })
    const spreadsheet = await sheets.spreadsheets.get({
      spreadsheetId: env.google.sheetId,
      fields: 'sheets.properties(sheetId,title)',
    })
    const leadSheet = spreadsheet.data.sheets?.find((sheet) => sheet.properties?.title === 'Sheet1')
    if (leadSheet?.properties?.sheetId !== undefined) {
      await sheets.spreadsheets.batchUpdate({
        spreadsheetId: env.google.sheetId,
        requestBody: {
          requests: [{
            setDataValidation: {
              range: {
                sheetId: leadSheet.properties.sheetId,
                startRowIndex: 1,
                endRowIndex: 5000,
                startColumnIndex: 33,
                endColumnIndex: 34,
              },
              rule: {
                condition: {
                  type: 'ONE_OF_LIST',
                  values: [
                    { userEnteredValue: 'مؤهل' },
                    { userEnteredValue: 'غير مناسب' },
                    { userEnteredValue: 'تم التعاقد' },
                  ],
                },
                strict: true,
                showCustomUi: true,
              },
            },
          }],
        },
      })
    }
  } catch (error) {
    console.error('[sheets] outcome columns setup failed:', error instanceof Error ? error.message : 'unknown')
  }
}
