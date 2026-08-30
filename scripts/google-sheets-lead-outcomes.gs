/**
 * Panther sales outcome -> Meta feedback loop.
 *
 * Paste this file into Extensions > Apps Script for the leads spreadsheet,
 * save it, then run configurePantherOutcomeSync() once as the sheet owner.
 */

const PANTHER_OUTCOME_MAP = Object.freeze({
  'مؤهل': 'qualified',
  'غير مناسب': 'not_quality',
  'تم التعاقد': 'contracted',
});

const PANTHER_TRACKING_HEADERS = Object.freeze([
  'leadId', 'formSource', 'locale', 'leadQualification', 'warehouseInterest',
  'referrerUrl', 'landingUrl', 'utmSource', 'utmMedium', 'utmCampaign',
  'utmTerm', 'utmContent', 'gclid', 'fbclid', 'ttclid', 'marketingConsent',
  'userAgent', 'fbp', 'ttp', 'leadOutcome', 'outcomeReason',
  'outcomeUpdatedAt', 'metaOutcomeStatus',
]);

function onOpen() {
  SpreadsheetApp.getUi()
    .createMenu('Panther Tracking')
    .addItem('تفعيل مزامنة جودة العملاء', 'configurePantherOutcomeSync')
    .addToUi();
}

function configurePantherOutcomeSync() {
  const ui = SpreadsheetApp.getUi();
  const urlPrompt = ui.prompt(
    'Panther Tracking',
    'اكتب رابط الموقع المنشور، مثال: https://landing.panther-express.com',
    ui.ButtonSet.OK_CANCEL
  );
  if (urlPrompt.getSelectedButton() !== ui.Button.OK) return;

  const secretPrompt = ui.prompt(
    'Panther Tracking',
    'اكتب نفس CRM_WEBHOOK_SECRET الموجود في إعدادات المشروع.',
    ui.ButtonSet.OK_CANCEL
  );
  if (secretPrompt.getSelectedButton() !== ui.Button.OK) return;

  const baseUrl = urlPrompt.getResponseText().trim().replace(/\/$/, '');
  const secret = secretPrompt.getResponseText().trim();
  if (!/^https:\/\//.test(baseUrl) || secret.length < 24) {
    ui.alert('الرابط لازم يبدأ بـ https والرمز السري لازم يكون 24 حرف على الأقل.');
    return;
  }

  PropertiesService.getScriptProperties().setProperties({
    PANTHER_OUTCOME_WEBHOOK_URL: baseUrl + '/api/lead-outcome',
    PANTHER_OUTCOME_WEBHOOK_SECRET: secret,
  });

  ensurePantherOutcomeColumns_();

  const spreadsheet = SpreadsheetApp.getActive();
  const triggerExists = ScriptApp.getProjectTriggers().some(function (trigger) {
    return trigger.getHandlerFunction() === 'handlePantherLeadOutcomeEdit';
  });
  if (!triggerExists) {
    ScriptApp.newTrigger('handlePantherLeadOutcomeEdit')
      .forSpreadsheet(spreadsheet)
      .onEdit()
      .create();
  }

  ui.alert('تم تفعيل مزامنة جودة العملاء مع ميتا.');
}

function ensurePantherOutcomeColumns_() {
  const sheet = SpreadsheetApp.getActive().getSheetByName('Sheet1');
  if (!sheet) throw new Error('Sheet1 was not found');

  // A:N remains untouched because it belongs to the sales workflow.
  sheet.getRange(1, 15, 1, PANTHER_TRACKING_HEADERS.length)
    .setValues([PANTHER_TRACKING_HEADERS]);
  const validation = SpreadsheetApp.newDataValidation()
    .requireValueInList(Object.keys(PANTHER_OUTCOME_MAP), true)
    .setAllowInvalid(false)
    .build();
  sheet.getRange(2, 34, 4999, 1).setDataValidation(validation);
}

function handlePantherLeadOutcomeEdit(event) {
  if (!event || !event.range || event.range.getRow() < 2) return;

  const sheet = event.range.getSheet();
  if (sheet.getName() !== 'Sheet1') return;

  const lastColumn = sheet.getLastColumn();
  const headers = sheet.getRange(1, 1, 1, lastColumn).getDisplayValues()[0];
  const outcomeColumn = headers.indexOf('leadOutcome') + 1;
  if (!outcomeColumn || event.range.getColumn() !== outcomeColumn) return;

  const statusColumn = headers.indexOf('metaOutcomeStatus') + 1;
  const updatedAtColumn = headers.indexOf('outcomeUpdatedAt') + 1;
  const outcome = PANTHER_OUTCOME_MAP[String(event.value || '').trim()];
  if (!outcome) {
    if (statusColumn) sheet.getRange(event.range.getRow(), statusColumn).clearContent();
    if (updatedAtColumn) sheet.getRange(event.range.getRow(), updatedAtColumn).clearContent();
    return;
  }

  const row = sheet.getRange(event.range.getRow(), 1, 1, lastColumn).getValues()[0];
  const displayRow = sheet.getRange(event.range.getRow(), 1, 1, lastColumn).getDisplayValues()[0];
  const valueFor = function (header) {
    const index = headers.indexOf(header);
    return index >= 0 ? displayRow[index] : '';
  };
  const rawValueFor = function (header) {
    const index = headers.indexOf(header);
    return index >= 0 ? row[index] : '';
  };
  const isoDate = function (value) {
    if (value instanceof Date && !isNaN(value.getTime())) return value.toISOString();
    const parsed = new Date(value);
    return isNaN(parsed.getTime()) ? undefined : parsed.toISOString();
  };

  const properties = PropertiesService.getScriptProperties();
  const webhookUrl = properties.getProperty('PANTHER_OUTCOME_WEBHOOK_URL');
  const webhookSecret = properties.getProperty('PANTHER_OUTCOME_WEBHOOK_SECRET');
  if (!webhookUrl || !webhookSecret) {
    if (statusColumn) sheet.getRange(event.range.getRow(), statusColumn).setValue('غير مفعّل');
    return;
  }

  const occurredAt = new Date().toISOString();
  const payload = {
    leadId: valueFor('leadId'),
    phone: valueFor('phone') || displayRow[2],
    outcome: outcome,
    outcomeReason: valueFor('outcomeReason'),
    landingUrl: valueFor('landingUrl'),
    fbclid: valueFor('fbclid'),
    fbp: valueFor('fbp'),
    marketingConsent: valueFor('marketingConsent').toLowerCase() === 'granted',
    submittedAt: isoDate(rawValueFor('submittedAt') || row[0]),
    occurredAt: occurredAt,
  };

  try {
    if (statusColumn) sheet.getRange(event.range.getRow(), statusColumn).setValue('جاري الإرسال…');
    const response = UrlFetchApp.fetch(webhookUrl, {
      method: 'post',
      contentType: 'application/json',
      headers: { 'X-CRM-Webhook-Secret': webhookSecret },
      payload: JSON.stringify(payload),
      muteHttpExceptions: true,
    });
    const responseCode = response.getResponseCode();
    const responseBody = JSON.parse(response.getContentText() || '{}');
    if (responseCode < 200 || responseCode >= 300 || !responseBody.success) {
      throw new Error('HTTP ' + responseCode);
    }

    const status = responseBody.delivery === 'sent'
      ? 'تم الإرسال: ' + (responseBody.events || []).join(' + ')
      : 'لم يُرسل: لا توجد موافقة تسويقية أو إعدادات ميتا ناقصة';
    if (updatedAtColumn) sheet.getRange(event.range.getRow(), updatedAtColumn).setValue(occurredAt);
    if (statusColumn) sheet.getRange(event.range.getRow(), statusColumn).setValue(status);
  } catch (error) {
    if (statusColumn) {
      sheet.getRange(event.range.getRow(), statusColumn).setValue('فشل الإرسال — أعد اختيار الحالة');
    }
    console.error('Panther outcome sync failed', error);
  }
}
