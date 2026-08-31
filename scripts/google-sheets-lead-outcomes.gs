/**
 * Panther sales outcome -> Meta feedback loop.
 *
 * Works as a standalone Apps Script project so the current website-leads
 * sheet can remain untouched. Set the three required Script Properties,
 * save this file, then run configurePantherOutcomeSync() once.
 */

const PANTHER_OUTCOME_MAP = Object.freeze({
  'مؤهل': 'qualified',
  'غير مناسب': 'not_quality',
  'تم التعاقد': 'contracted',
});

const PANTHER_OUTCOME_HEADERS = Object.freeze([
  'leadQualification', 'warehouseInterest', 'fbp', 'ttp', 'leadOutcome',
  'outcomeReason', 'outcomeUpdatedAt', 'metaOutcomeStatus',
]);

function onOpen() {
  SpreadsheetApp.getUi()
    .createMenu('Panther Tracking')
    .addItem('تفعيل مزامنة جودة العملاء', 'configurePantherOutcomeSync')
    .addToUi();
}

function configurePantherOutcomeSync() {
  const properties = PropertiesService.getScriptProperties();
  const spreadsheetId = properties.getProperty('PANTHER_SPREADSHEET_ID');
  const webhookUrl = properties.getProperty('PANTHER_OUTCOME_WEBHOOK_URL');
  const secret = properties.getProperty('CRM_WEBHOOK_SECRET');
  if (!spreadsheetId || !/^https:\/\//.test(webhookUrl || '') || !secret || secret.length < 24) {
    throw new Error('Set PANTHER_SPREADSHEET_ID, PANTHER_OUTCOME_WEBHOOK_URL, and CRM_WEBHOOK_SECRET first.');
  }

  const spreadsheet = SpreadsheetApp.openById(spreadsheetId);
  ensurePantherOutcomeColumns_(spreadsheet);

  const triggerExists = ScriptApp.getProjectTriggers().some(function (trigger) {
    return trigger.getHandlerFunction() === 'handlePantherLeadOutcomeEdit';
  });
  if (!triggerExists) {
    ScriptApp.newTrigger('handlePantherLeadOutcomeEdit')
      .forSpreadsheet(spreadsheet)
      .onEdit()
      .create();
  }

  console.log('Panther lead-outcome sync is active.');
}

function ensurePantherOutcomeColumns_(spreadsheet) {
  const sheet = spreadsheet.getSheetByName('Sheet1');
  if (!sheet) throw new Error('Sheet1 was not found');

  // A:V is the live website-leads schema. Append outcome fields without
  // renaming or moving any existing column or historical value.
  sheet.getRange(1, 23, 1, PANTHER_OUTCOME_HEADERS.length)
    .setValues([PANTHER_OUTCOME_HEADERS]);
  const validation = SpreadsheetApp.newDataValidation()
    .requireValueInList(Object.keys(PANTHER_OUTCOME_MAP), true)
    .setAllowInvalid(false)
    .build();
  sheet.getRange(2, 27, Math.max(sheet.getMaxRows() - 1, 1), 1)
    .setDataValidation(validation);
}

function pantherHeaderIndex_(headers, name) {
  const normalized = String(name).toLowerCase().replace(/[^a-z0-9]/g, '');
  return headers.findIndex(function (header) {
    return String(header).toLowerCase().replace(/[^a-z0-9]/g, '') === normalized;
  });
}

function handlePantherLeadOutcomeEdit(event) {
  if (!event || !event.range || event.range.getRow() < 2) return;

  const sheet = event.range.getSheet();
  if (sheet.getName() !== 'Sheet1') return;

  const lastColumn = sheet.getLastColumn();
  const headers = sheet.getRange(1, 1, 1, lastColumn).getDisplayValues()[0];
  const outcomeColumn = pantherHeaderIndex_(headers, 'leadOutcome') + 1;
  if (!outcomeColumn || event.range.getColumn() !== outcomeColumn) return;

  const statusColumn = pantherHeaderIndex_(headers, 'metaOutcomeStatus') + 1;
  const updatedAtColumn = pantherHeaderIndex_(headers, 'outcomeUpdatedAt') + 1;
  const outcome = PANTHER_OUTCOME_MAP[String(event.value || '').trim()];
  if (!outcome) {
    if (statusColumn) sheet.getRange(event.range.getRow(), statusColumn).clearContent();
    if (updatedAtColumn) sheet.getRange(event.range.getRow(), updatedAtColumn).clearContent();
    return;
  }

  const row = sheet.getRange(event.range.getRow(), 1, 1, lastColumn).getValues()[0];
  const displayRow = sheet.getRange(event.range.getRow(), 1, 1, lastColumn).getDisplayValues()[0];
  const valueFor = function (header) {
    const index = pantherHeaderIndex_(headers, header);
    return index >= 0 ? displayRow[index] : '';
  };
  const rawValueFor = function (header) {
    const index = pantherHeaderIndex_(headers, header);
    return index >= 0 ? row[index] : '';
  };
  const isoDate = function (value) {
    if (value instanceof Date && !isNaN(value.getTime())) return value.toISOString();
    const parsed = new Date(value);
    return isNaN(parsed.getTime()) ? undefined : parsed.toISOString();
  };

  const properties = PropertiesService.getScriptProperties();
  const webhookUrl = properties.getProperty('PANTHER_OUTCOME_WEBHOOK_URL');
  const webhookSecret = properties.getProperty('CRM_WEBHOOK_SECRET');
  if (!webhookUrl || !webhookSecret) {
    if (statusColumn) sheet.getRange(event.range.getRow(), statusColumn).setValue('غير مفعّل');
    return;
  }

  const leadIdColumn = pantherHeaderIndex_(headers, 'leadId') + 1;
  let leadId = String(valueFor('leadId') || '').trim();
  if (!leadId && leadIdColumn) {
    // Historical rows created before server IDs were stored still need a
    // stable identifier for deduplication. Persist it once and reuse it.
    leadId = Utilities.getUuid();
    sheet.getRange(event.range.getRow(), leadIdColumn).setValue(leadId);
  }

  const occurredAt = new Date().toISOString();
  const payload = {
    leadId: leadId,
    phone: valueFor('phone') || displayRow[2],
    outcome: outcome,
    outcomeReason: valueFor('outcomeReason'),
    landingUrl: valueFor('landingUrl'),
    fbclid: valueFor('fbclid'),
    fbp: valueFor('fbp'),
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
      : 'لم يُرسل: إعدادات ميتا ناقصة';
    if (updatedAtColumn) sheet.getRange(event.range.getRow(), updatedAtColumn).setValue(occurredAt);
    if (statusColumn) sheet.getRange(event.range.getRow(), statusColumn).setValue(status);
  } catch (error) {
    if (statusColumn) {
      sheet.getRange(event.range.getRow(), statusColumn).setValue('فشل الإرسال — أعد اختيار الحالة');
    }
    console.error('Panther outcome sync failed', error);
  }
}
