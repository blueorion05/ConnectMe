const GOOGLE_SHEETS_WEB_APP_URL =
  'https://script.google.com/macros/s/AKfycbzuxjUVrCn4HZy-OK8HYMkYI9rfyiRTtqyId-tx2BSOhhtS-8LcngSUi7KiIWw41iM/exec'

export async function sendToGoogleSheets(formData) {
  const jsonPayload = JSON.stringify(formData)

  try {
    const response = await fetch(GOOGLE_SHEETS_WEB_APP_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: jsonPayload,
    })

    if (!response.ok) {
      throw new Error(`Google Sheets request failed: ${response.status}`)
    }

    return { ok: true, mode: 'cors' }
  } catch (error) {
    // Apps Script endpoints often reject CORS preflight; no-cors still delivers payload.
    if (error instanceof TypeError) {
      await fetch(GOOGLE_SHEETS_WEB_APP_URL, {
        method: 'POST',
        mode: 'no-cors',
        headers: {
          'Content-Type': 'text/plain;charset=utf-8',
        },
        body: jsonPayload,
      })

      return { ok: true, mode: 'no-cors' }
    }

    throw error
  }
}
