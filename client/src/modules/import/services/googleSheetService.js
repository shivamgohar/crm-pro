import api from "../../../api/api";


// ==========================================
// CONFIG
// ==========================================

const GOOGLE_SHEETS_API =
  "https://sheets.googleapis.com/v4/spreadsheets";

const GOOGLE_CLIENT_ID =
  import.meta.env.VITE_GOOGLE_CLIENT_ID;

const GOOGLE_SHEETS_SCOPE =
  "https://www.googleapis.com/auth/spreadsheets";


// ==========================================
// GOOGLE AUTHORIZATION
// ==========================================

export const authorizeGoogleSheets = (prompt = "") => {
  return new Promise((resolve, reject) => {

    if (!GOOGLE_CLIENT_ID) {
      reject(
        new Error(
          "Google Client ID is not configured. Check client/.env"
        )
      );

      return;
    }

    if (!window.google?.accounts?.oauth2) {
      reject(
        new Error(
          "Google Identity Services not loaded. Please refresh the page and try again."
        )
      );

      return;
    }

    const client =
      window.google.accounts.oauth2.initTokenClient({

        client_id: GOOGLE_CLIENT_ID,

        scope: GOOGLE_SHEETS_SCOPE,

        include_granted_scopes: true,

        callback: (response) => {

          if (response.error) {

            console.error(
              "Google OAuth error:",
              response
            );

            reject(
              new Error(
                response.error_description ||
                response.error ||
                "Google authorization failed."
              )
            );

            return;
          }

          if (!response.access_token) {
            reject(
              new Error(
                "Google did not return an access token."
              )
            );

            return;
          }

          resolve(response.access_token);
        },

      });

   client.requestAccessToken({
  prompt,
});

  });
};



// ==========================================
// ENSURE GOOGLE ACCESS TOKEN
// ==========================================

export const ensureGoogleAccessToken = async (
  currentToken
) => {
  if (currentToken) {
    return currentToken;
  }

  return await authorizeGoogleSheets();
};

// ==========================================
// EXTRACT SPREADSHEET ID
// ==========================================

export const extractSpreadsheetId = (url) => {

  if (!url) {
    return null;
  }

  const match = url.match(
    /\/spreadsheets\/d\/([a-zA-Z0-9_-]+)/
  );

  return match ? match[1] : null;
};


// ==========================================
// FETCH GOOGLE SHEET DATA
// ==========================================

export const fetchGoogleSheetData = async ({
  spreadsheetId,
  accessToken,
  sheetName = "Sheet1",
  onTokenRefreshed,
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

  const range = `${sheetName}!A:ZZ`;

  const makeRequest = async (token) => {
    return fetch(
      `${GOOGLE_SHEETS_API}/${spreadsheetId}/values/${encodeURIComponent(
        range
      )}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
  };

  let response = await makeRequest(accessToken);

  // ==========================================
  // GOOGLE TOKEN EXPIRED
  // ==========================================

 if (response.status === 401) {
  console.log("GOOGLE TOKEN EXPIRED - REFRESHING TOKEN");

  try {
    const newAccessToken =
      await authorizeGoogleSheets("none");

    try {
      const savedConnection =
        localStorage.getItem("google_sheet_connection");

      if (savedConnection) {
        const connection =
          JSON.parse(savedConnection);

        connection.accessToken =
          newAccessToken;

        localStorage.setItem(
          "google_sheet_connection",
          JSON.stringify(connection)
        );
      }
    } catch (error) {
      console.error(
        "Failed to save refreshed Google token:",
        error
      );
    }

    if (onTokenRefreshed) {
      onTokenRefreshed(newAccessToken);
    }

    response = await makeRequest(newAccessToken);

  } catch (error) {
    const tokenError =
      new Error("Google authorization expired. Reconnect required.");

    tokenError.code =
      "GOOGLE_RECONNECT_REQUIRED";

    throw tokenError;
  }
}

  if (!response.ok) {

    const error = await response
      .json()
      .catch(() => ({}));

    throw new Error(
      error?.error?.message ||
      "Failed to fetch Google Sheet."
    );
  }

  const data =
    await response.json();

  return data.values || [];
};

// ==========================================
// FETCH GOOGLE SHEET METADATA
// ==========================================

export const fetchGoogleSheetMetadata = async ({
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
    `${GOOGLE_SHEETS_API}/${spreadsheetId}?fields=sheets(properties(sheetId,title))`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );

  if (!response.ok) {

    const error = await response
      .json()
      .catch(() => ({}));

    throw new Error(
      error?.error?.message ||
      "Failed to fetch Google Sheet metadata."
    );
  }

  const data = await response.json();

  const sheets = data.sheets || [];

  if (sheets.length === 0) {
    throw new Error(
      "No sheets found in this Google Spreadsheet."
    );
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
    throw new Error(
      "Spreadsheet ID is required."
    );
  }

  if (!sheetName) {
    throw new Error(
      "Sheet name is required."
    );
  }

  if (!Array.isArray(rows)) {
    throw new Error(
      "Rows must be an array."
    );
  }

  const apiUrl =
    import.meta.env.VITE_API_URL ||
    "http://localhost:5000/api";

  const response = await fetch(
    `${apiUrl}/services/google-sync`,
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

  const data = await response
    .json()
    .catch(() => ({}));

  if (!response.ok) {
    throw new Error(
      data?.message ||
      "Google Sheet sync failed."
    );
  }

  return data;
};





// ==========================================
// PUSH CRM DATA → GOOGLE SHEET
// ==========================================

export const pushCrmToGoogleSheet = async ({
  spreadsheetId,
  sheetName,
  accessToken,
}) => {

  if (!spreadsheetId) {
    throw new Error(
      "Spreadsheet ID is required."
    );
  }

  if (!sheetName) {
    throw new Error(
      "Sheet name is required."
    );
  }

  if (!accessToken) {
    throw new Error(
      "Google access token is required."
    );
  }

  const apiUrl =
    import.meta.env.VITE_API_URL ||
    "http://localhost:5000/api";

  const response = await fetch(
    `${apiUrl}/services/google-push`,
    {
      method: "POST",

      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify({
        spreadsheetId,
        sheetName,
        accessToken,
      }),
    }
  );

  const data =
    await response
      .json()
      .catch(() => ({}));

  if (!response.ok) {
    console.error(
      "CRM → Google Push Error:",
      data
    );

    throw new Error(
      data?.message ||
      data?.error ||
      "CRM to Google Sheet sync failed."
    );
  }

  return data;
};