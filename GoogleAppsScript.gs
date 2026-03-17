const SHEET_NAME = 'Bookings';

function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents || '{}');
    const sheet = getOrCreateSheet_(SHEET_NAME);

    if (sheet.getLastRow() === 0) {
      sheet.appendRow([
        'Submitted At',
        'Name',
        'Company',
        'Email',
        'Phone',
        'Tier',
        'Modules',
        'Company Size',
        'Industry',
        'Demo Date',
        'Message',
      ]);
    }

    sheet.appendRow([
      data.submittedAt || new Date().toISOString(),
      data.name || '',
      data.company || '',
      data.email || '',
      data.phone || '',
      data.tier || '',
      data.modules || '',
      data.companySize || '',
      data.industry || '',
      data.demoDate || '',
      data.message || '',
    ]);

    return jsonResponse_(200, { success: true, message: 'Saved to Google Sheets.' });
  } catch (error) {
    return jsonResponse_(500, { success: false, message: error.message });
  }
}

function doGet() {
  return jsonResponse_(200, { status: 'ok' });
}

function getOrCreateSheet_(sheetName) {
  const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = spreadsheet.getSheetByName(sheetName);

  if (!sheet) {
    sheet = spreadsheet.insertSheet(sheetName);
  }

  return sheet;
}

function jsonResponse_(statusCode, payload) {
  return ContentService.createTextOutput(JSON.stringify({ statusCode, ...payload })).setMimeType(
    ContentService.MimeType.JSON,
  );
}
