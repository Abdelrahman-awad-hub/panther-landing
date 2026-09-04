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
    data.referrerUrl ?? '',
    data.landingUrl  ?? '',
    data.utmSource   ?? '',
    data.utmMedium   ?? '',
    data.utmCampaign ?? '',
    data.utmTerm     ?? '',
    data.utmContent  ?? '',
    data.userAgent   ?? '',
    data.leadId,
    data.formSource,
    data.locale,
    data.gclid,
    data.fbclid,
    data.ttclid,
    data.marketingConsent ? 'granted' : 'denied',
    data.leadQualification,
    data.warehouseInterest,
    data.fbp,
    data.ttp,
    '', '', '', '',
    data.firstTouchReferrerUrl, data.firstTouchLandingUrl,
    data.firstTouchUtmSource, data.firstTouchUtmMedium, data.firstTouchUtmCampaign,
    data.firstTouchUtmTerm, data.firstTouchUtmContent,
    data.firstTouchGclid, data.firstTouchFbclid, data.firstTouchTtclid,
    data.lastTouchReferrerUrl, data.lastTouchLandingUrl,
    data.lastTouchUtmSource, data.lastTouchUtmMedium, data.lastTouchUtmCampaign,
    data.lastTouchUtmTerm, data.lastTouchUtmContent,
    data.lastTouchGclid, data.lastTouchFbclid, data.lastTouchTtclid,
    data.clientId, data.sessionId,
  ]
  await sheets.spreadsheets.values.append({
    spreadsheetId: env.google.sheetId,
    // Keep table detection anchored to the existing A:V website-leads table.
    // The row may extend through AD, but a wider lookup range can make Sheets
    // detect the tracking area as a separate table and offset later submissions.
    range: 'Sheet1!A:V',
    valueInputOption: 'RAW',
    insertDataOption: 'INSERT_ROWS',
    requestBody: { majorDimension: 'ROWS', values: [row] },
  })

  // Sheet UX enhancements are best-effort and can never block lead storage.
  try {
    const trackingHeaders = [[
      'leadQualification', 'warehouseInterest', 'fbp', 'ttp',
      'leadOutcome', 'outcomeReason', 'outcomeUpdatedAt', 'metaOutcomeStatus',
    ]]
    await sheets.spreadsheets.values.update({
      spreadsheetId: env.google.sheetId,
      range: 'Sheet1!W1:AD1',
      valueInputOption: 'RAW',
      requestBody: { majorDimension: 'ROWS', values: trackingHeaders },
    })
    await sheets.spreadsheets.values.update({
      spreadsheetId: env.google.sheetId,
      range: 'Sheet1!AE1:AZ1',
      valueInputOption: 'RAW',
      requestBody: { majorDimension: 'ROWS', values: [[
        'firstTouchReferrerUrl', 'firstTouchLandingUrl', 'firstTouchUtmSource',
        'firstTouchUtmMedium', 'firstTouchUtmCampaign', 'firstTouchUtmTerm',
        'firstTouchUtmContent', 'firstTouchGclid', 'firstTouchFbclid', 'firstTouchTtclid',
        'lastTouchReferrerUrl', 'lastTouchLandingUrl', 'lastTouchUtmSource',
        'lastTouchUtmMedium', 'lastTouchUtmCampaign', 'lastTouchUtmTerm',
        'lastTouchUtmContent', 'lastTouchGclid', 'lastTouchFbclid', 'lastTouchTtclid',
        'clientId', 'sessionId',
      ]] },
    })
    const spreadsheet = await sheets.spreadsheets.get({
      spreadsheetId: env.google.sheetId,
      fields: 'sheets.properties(sheetId,title,gridProperties.rowCount)',
    })
    const leadSheet = spreadsheet.data.sheets?.find((sheet) => sheet.properties?.title === 'Sheet1')
    if (leadSheet?.properties?.sheetId !== undefined) {
      const rowCount = Math.max(leadSheet.properties.gridProperties?.rowCount ?? 1000, 2)
      await sheets.spreadsheets.batchUpdate({
        spreadsheetId: env.google.sheetId,
        requestBody: {
          requests: [{
            setDataValidation: {
              range: {
                sheetId: leadSheet.properties.sheetId,
                startRowIndex: 1,
                endRowIndex: rowCount,
                startColumnIndex: 26,
                endColumnIndex: 27,
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
