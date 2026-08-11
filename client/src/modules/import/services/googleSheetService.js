// Google Sheets API
const GOOGLE_SHEETS_API =
  "https://sheets.googleapis.com/v4/spreadsheets";

// Google OAuth Client ID
const GOOGLE_CLIENT_ID =
  "321108326322-4jku06kh3u967nq7j6bc6h6m4n3mickd.apps.googleusercontent.com";

// Google Sheets permission
const GOOGLE_SHEETS_SCOPE =
  "https://www.googleapis.com/auth/spreadsheets";


// ==========================================
// GOOGLE AUTHORIZATION
// ==========================================

export const authorizeGoogleSheets = () => {
  return new Promise((resolve, reject) => {

    if (!window.google?.accounts?.oauth2) {
      reject(
        new Error(
          "Google Identity Services not loaded"
        )
      );

      return;
    }

    const client =
      window.google.accounts.oauth2.initTokenClient({
        client_id: GOOGLE_CLIENT_ID,

        scope: GOOGLE_SHEETS_SCOPE,

        callback: (response) => {

          if (response.error) {
            reject(response);
            return;
          }

          resolve(response.access_token);
        },
      });

    client.requestAccessToken();
  });
};


// ==========================================
// EXTRACT SPREADSHEET ID
// ==========================================

export const extractSpreadsheetId = (url) => {

  if (!url) {
    return null;
  }

  const match = url.match(
    /spreadsheets\/d\/([a-zA-Z0-9-_]+)/
  );

  return match ? match[1] : null;
};


// ==========================================
// FETCH GOOGLE SHEET DATA
// ==========================================

export const fetchGoogleSheetData = async ({
  spreadsheetId,
  accessToken,
}) => {

  if (!spreadsheetId) {
    throw new Error(
      "Spreadsheet ID is required."
    );
  }

  if (!accessToken) {
    throw new Error(
      "Google access token is required."
    );
  }

  const response = await fetch(
    `${GOOGLE_SHEETS_API}/${spreadsheetId}/values/A:ZZ`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );

  if (!response.ok) {

    const error =
      await response.json().catch(
        () => ({})
      );

    throw new Error(
      error?.error?.message ||
      "Failed to fetch Google Sheet."
    );
  }

  const data =
    await response.json();

  return data.values || [];
};



export const fetchGoogleSheetMetadata = async ({
  spreadsheetId,
  accessToken,
}) => {
  if (!spreadsheetId) {
    throw new Error("Spreadsheet ID is required.");
  }

  if (!accessToken) {
    throw new Error("Google access token is required.");
  }

  const response = await fetch(
    `${GOOGLE_SHEETS_API}/${spreadsheetId}?fields=sheets(properties(sheetId,title))`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));

    throw new Error(
      error?.error?.message ||
        "Failed to fetch Google Sheet metadata."
    );
  }

  const data = await response.json();

  const sheets = data.sheets || [];

  if (sheets.length === 0) {
    throw new Error("No sheets found in this Google Spreadsheet.");
  }

  return sheets.map((sheet) => ({
    sheetId: sheet.properties.sheetId,
    sheetName: sheet.properties.title,
  }));
};



// ==========================================
// SYNC GOOGLE SHEET DATA
// ==========================================

export const syncGoogleSheet = async ({
  spreadsheetId,
  sheetName,
  rows,
}) => {
  if (!spreadsheetId) {
    throw new Error("Spreadsheet ID is required.");
  }

  if (!sheetName) {
    throw new Error("Sheet name is required.");
  }

  if (!Array.isArray(rows)) {
    throw new Error("Rows must be an array.");
  }

  const response = await fetch(
    "http://localhost:5000/api/services/google-sync",
    {
      method: "POST",

      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify({
        spreadsheetId,
        sheetName,
        rows,
      }),
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data?.message ||
        "Google Sheet sync failed."
    );
  }

  return data;
};