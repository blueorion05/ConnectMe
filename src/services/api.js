const GOOGLE_SHEETS_WEB_APP_URL =
  'https://script.google.com/macros/s/AKfycbzuxjUVrCn4HZy-OK8HYMkYI9rfyiRTtqyId-tx2BSOhhtS-8LcngSUi7KiIWw41iM/exec'

export async function sendToGoogleSheets(formData) {
  const response = await fetch(GOOGLE_SHEETS_WEB_APP_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(formData),
  })

  if (!response.ok) {
    throw new Error(`Google Sheets request failed: ${response.status}`)
  }

  return response
}
