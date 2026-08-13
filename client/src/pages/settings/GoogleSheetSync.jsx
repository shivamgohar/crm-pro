import { useEffect, useState } from "react";
import api from "../../api/api";

import {
  Box,
  Typography,
  Paper,
  TextField,
  Button,
  MenuItem,
  Alert,
  Chip,
  Divider,
  Stack,
} from "@mui/material";

// import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import CloudSyncOutlinedIcon from "@mui/icons-material/CloudSyncOutlined";
import RefreshOutlinedIcon from "@mui/icons-material/RefreshOutlined";
import LinkOutlinedIcon from "@mui/icons-material/LinkOutlined";

import AppBreadcrumb from "../../components/ui/AppBreadcrumb";

import {
  authorizeGoogleSheets,
  extractSpreadsheetId,
  fetchGoogleSheetMetadata,
  fetchGoogleSheetData,
} from "../../modules/import/services/googleSheetService";

import { getGoogleSheetMapping } from "../../modules/import/services/importService";

import { transformRows } from "../../modules/import/utils/transformRows";

function GoogleSheetSync() {
  const [sheetUrl, setSheetUrl] = useState("");
  const [accessToken, setAccessToken] = useState("");
  const [spreadsheetId, setSpreadsheetId] = useState("");
  const [sheets, setSheets] = useState([]);
  const [selectedSheet, setSelectedSheet] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [rows, setRows] = useState([]);
  const [fetching, setFetching] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [syncResult, setSyncResult] = useState(null);
  const [lastSynced, setLastSynced] = useState(null);
  const [syncStatus, setSyncStatus] = useState("connected");

  const isConnected = spreadsheetId && accessToken && sheets.length > 0;

  useEffect(() => {
    const savedConnection = localStorage.getItem("google_sheet_connection");

    if (!savedConnection) {
      return;
    }

    try {
      const connection = JSON.parse(savedConnection);

      setSheetUrl(connection.sheetUrl || "");
      setSpreadsheetId(connection.spreadsheetId || "");
      setAccessToken(connection.accessToken || "");
      setSelectedSheet(connection.selectedSheet || "");
      setSheets(connection.sheets || []);
    } catch (error) {
      console.error("Failed to restore Google Sheet connection:", error);

      localStorage.removeItem("google_sheet_connection");
    }
  }, []);

  const handleConnect = async () => {
    try {
      setLoading(true);
      setError("");

      const id = extractSpreadsheetId(sheetUrl);

      if (!id) {
        throw new Error("Invalid Google Sheet URL.");
      }

      const token = await authorizeGoogleSheets();

      const metadata = await fetchGoogleSheetMetadata({
        spreadsheetId: id,
        accessToken: token,
      });

      const defaultSheet = metadata.length > 0 ? metadata[0].sheetName : "";

      setSpreadsheetId(id);
      setAccessToken(token);
      setSheets(metadata);
      setSelectedSheet(defaultSheet);

      localStorage.setItem(
        "google_sheet_connection",
        JSON.stringify({
          sheetUrl,
          spreadsheetId: id,
          accessToken: token,
          selectedSheet: defaultSheet,
          sheets: metadata,
        }),
      );
    } catch (error) {
      console.error("Google Sheet connection failed:", error);

      setError(error.message || "Failed to connect Google Sheet.");
    } finally {
      setLoading(false);
    }
  };

  const handleDisconnect = () => {
    localStorage.removeItem("google_sheet_connection");

    setSheetUrl("");
    setAccessToken("");
    setSpreadsheetId("");
    setSheets([]);
    setSelectedSheet("");
    setRows([]);
    setSyncResult(null);
    setError("");
  };

  const handleFetchData = async () => {
    try {
      setFetching(true);
      setError("");

      const rawRows = await fetchGoogleSheetData({
        spreadsheetId,
        accessToken,
        sheetName: selectedSheet,
      });

      if (rawRows.length < 2) {
        throw new Error("Google Sheet me data rows nahi mili.");
      }

      const headers = rawRows[0];

      const formattedRows = rawRows.slice(1).map((row, index) => {
        const formatted = {};

        headers.forEach((header, columnIndex) => {
          formatted[header] = row[columnIndex] ?? "";
        });

        formatted.__google_row = index + 2;

        return formatted;
      });

      setRows(formattedRows);
    } catch (error) {
      console.error("Google Sheet fetch failed:", error);

      setError(error.message || "Failed to fetch Google Sheet data.");
    } finally {
      setFetching(false);
    }
  };

  const handleSync = async () => {
    try {
      setSyncing(true);
      setError("");
      setSyncResult(null);

      const mappingResponse = await getGoogleSheetMapping({
        spreadsheetId,
        sheetName: selectedSheet,
      });

      const savedMapping = mappingResponse?.mapping?.mapping;

      if (!savedMapping || Object.keys(savedMapping).length === 0) {
        throw new Error("No saved mapping found for this Google Sheet.");
      }

      console.log("SAVED GOOGLE SHEET MAPPING:", savedMapping);

      const syncRows = transformRows(rows, savedMapping);

      console.log("DYNAMIC GOOGLE SYNC ROWS:", syncRows);

      const response = await api.post("/services/google-sync", {
        spreadsheetId,
        sheetName: selectedSheet,
        rows: syncRows,
      });

      console.log("GOOGLE SYNC RESULT:", response.data);

      setSyncResult(response.data);
    } catch (error) {
      console.error("Google Sheet sync failed:", error);

      setError(
        error.response?.data?.message ||
          error.message ||
          "Google Sheet sync failed.",
      );
    } finally {
      setSyncing(false);
    }
  };

  useEffect(() => {
    if (!isConnected) {
      return;
    }

    let cancelled = false;

    const autoSync = async () => {
      try {
        if (fetching || syncing) {
          return;
        }

        console.log("GOOGLE AUTO SYNC CHECK");

        const rawRows = await fetchGoogleSheetData({
          spreadsheetId,
          accessToken,
          sheetName: selectedSheet,

          onTokenRefreshed: (newAccessToken) => {
            setAccessToken(newAccessToken);
          },
        });

        if (rawRows.length < 2) {
          return;
        }

        const headers = rawRows[0];

        const formattedRows = rawRows.slice(1).map((row, index) => {
          const formatted = {};

          headers.forEach((header, columnIndex) => {
            formatted[header] = row[columnIndex] ?? "";
          });

          formatted.__google_row = index + 2;

          return formatted;
        });

        const mappingResponse = await getGoogleSheetMapping({
          spreadsheetId,
          sheetName: selectedSheet,
        });

        const savedMapping = mappingResponse?.mapping?.mapping;

        if (!savedMapping || Object.keys(savedMapping).length === 0) {
          console.log("AUTO SYNC: No mapping found");

          return;
        }

        const syncRows = transformRows(formattedRows, savedMapping);

        const response = await api.post("/services/google-sync", {
          spreadsheetId,
          sheetName: selectedSheet,
          rows: syncRows,
        });

        if (!cancelled) {
          console.log("GOOGLE AUTO SYNC RESULT:", response.data);
          setLastSynced(new Date());
          setSyncStatus("connected");
        }
  } catch (error) {
  if (!cancelled) {
    console.error("Google Auto Sync failed:", error);

    if (error.code === "GOOGLE_RECONNECT_REQUIRED") {
      setSyncStatus("reconnect");
    } else {
      setSyncStatus("error");
    }
  }
}
    };

    // First sync immediately
    autoSync();

    // Then every 1 minute
    const intervalId = setInterval(autoSync, 60 * 1000);

    return () => {
      cancelled = true;
      clearInterval(intervalId);
    };
  }, [isConnected, spreadsheetId, accessToken, selectedSheet]);

  return (
    <Box>
      <AppBreadcrumb
        items={[
          {
            label: "Settings",
            path: "/settings",
          },
          {
            label: "Data Management",
            path: "/settings/data-management",
          },
          {
            label: "Google Sheet Sync",
          },
        ]}
      />

      {/* =========================================
          HEADER
      ========================================= */}

      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: {
            xs: "flex-start",
            sm: "center",
          },
          gap: 2,
          mb: 3,
          flexWrap: "wrap",
        }}
      >
        <Box>
          <Typography variant="h4" fontWeight={700}>
            Google Sheet Sync
          </Typography>

          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
            Connect and synchronize your Google Sheet data with CRM.
          </Typography>
        </Box>

        {isConnected && (
          <Stack direction="row" spacing={1.5} alignItems="center">
            <Chip
              icon={
                syncStatus === "connected" ? (
                  <CloudSyncOutlinedIcon />
                ) : (
                  <RefreshOutlinedIcon />
                )
              }
              label={
                syncStatus === "connected"
                  ? "Google Sheet Connected"
                  : "Sync temporarily unavailable"
              }
              color={syncStatus === "connected" ? "success" : "warning"}
              variant="outlined"
            />

            {lastSynced && (
              <Typography variant="body2" color="text.secondary">
                Last synced:{" "}
                {lastSynced.toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </Typography>
            )}
          </Stack>
        )}
      </Box>

      {/* =========================================
          ERROR
      ========================================= */}

      {error && (
        <Alert
          severity="error"
          sx={{
            mb: 3,
            borderRadius: 2,
          }}
        >
          {error}
        </Alert>
      )}

      {/* =========================================
          CONNECTION CARD
      ========================================= */}

      <Paper
        elevation={0}
        sx={{
          p: {
            xs: 2,
            sm: 3,
          },
          border: "1px solid",
          borderColor: "divider",
          borderRadius: 3,
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1.5,
            mb: 1,
          }}
        >
          <LinkOutlinedIcon color="primary" />

          <Typography variant="h6" fontWeight={700}>
            Connect Google Sheet
          </Typography>
        </Box>

        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          Enter your Google Sheet URL to connect the spreadsheet with CRM.
        </Typography>

        <TextField
          fullWidth
          label="Google Sheet URL"
          placeholder="https://docs.google.com/spreadsheets/d/..."
          value={sheetUrl}
          onChange={(e) => setSheetUrl(e.target.value)}
          size="small"
        />

        <Box sx={{ mt: 2.5 }}>
          <Button
            variant="contained"
            onClick={handleConnect}
            disabled={loading || !sheetUrl.trim()}
            startIcon={<LinkOutlinedIcon />}
            sx={{
              minWidth: 190,
              height: 42,
              borderRadius: 2,
              textTransform: "none",
              fontWeight: 600,
            }}
          >
            {loading ? "Connecting..." : "Connect Google Sheet"}
          </Button>
          {isConnected && (
            <Button
              variant="outlined"
              color="error"
              onClick={handleDisconnect}
              sx={{
                ml: 2,
                minWidth: 180,
                height: 42,
                borderRadius: 2,
                textTransform: "none",
                fontWeight: 600,
              }}
            >
              Disconnect Google Sheet
            </Button>
          )}
        </Box>

        {/* =====================================
            CONNECTED SHEET AREA
        ===================================== */}

        {sheets.length > 0 && (
          <>
            <Divider sx={{ my: 3 }} />

            <Box>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  gap: 2,
                  mb: 2,
                  flexWrap: "wrap",
                }}
              >
                <Box>
                  <Typography variant="subtitle1" fontWeight={700}>
                    Sheet Configuration
                  </Typography>

                  <Typography variant="body2" color="text.secondary">
                    Select the worksheet you want to synchronize.
                  </Typography>
                </Box>

                <Chip
                  icon={<CloudSyncOutlinedIcon />}
                  label="Connected"
                  color="success"
                  size="small"
                />
              </Box>

              <TextField
                select
                fullWidth
                size="small"
                label="Select Sheet"
                value={selectedSheet}
                onChange={(e) => setSelectedSheet(e.target.value)}
              >
                {sheets.map((sheet) => (
                  <MenuItem key={sheet.sheetId} value={sheet.sheetName}>
                    {sheet.sheetName}
                  </MenuItem>
                ))}
              </TextField>

              {/* =================================
                  ACTION BUTTONS
              ================================= */}

              <Stack
                direction={{
                  xs: "column",
                  sm: "row",
                }}
                spacing={2}
                sx={{ mt: 2.5 }}
              >
                <Button
                  variant="outlined"
                  onClick={handleFetchData}
                  disabled={
                    !spreadsheetId || !accessToken || !selectedSheet || fetching
                  }
                  startIcon={<RefreshOutlinedIcon />}
                  sx={{
                    minWidth: 190,
                    height: 42,
                    borderRadius: 2,
                    textTransform: "none",
                    fontWeight: 600,
                  }}
                >
                  {fetching ? "Fetching..." : "Fetch Latest Data"}
                </Button>

                <Button
                  variant="contained"
                  color="success"
                  onClick={handleSync}
                  disabled={rows.length === 0 || syncing}
                  startIcon={<CloudSyncOutlinedIcon />}
                  sx={{
                    minWidth: 160,
                    height: 42,
                    borderRadius: 2,
                    textTransform: "none",
                    fontWeight: 600,
                  }}
                >
                  {syncing ? "Syncing..." : "Sync Changes"}
                </Button>
              </Stack>
            </Box>
          </>
        )}
      </Paper>

      {/* =========================================
          SYNC RESULT
      ========================================= */}

      {syncResult && (
        <Paper
          elevation={0}
          sx={{
            mt: 3,
            p: 3,
            border: "1px solid",
            borderColor: "success.light",
            borderRadius: 3,
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1,
              mb: 2,
            }}
          >
            <CloudSyncOutlinedIcon color="success" />

            <Typography variant="h6" fontWeight={700}>
              Google Sheet Sync Completed
            </Typography>
          </Box>

          <Stack
            direction={{
              xs: "column",
              sm: "row",
            }}
            spacing={2}
            flexWrap="wrap"
          >
            <Chip label={`Total: ${syncResult.total}`} variant="outlined" />

            <Chip
              label={`Updated: ${syncResult.updated}`}
              color="success"
              variant="outlined"
            />

            <Chip label={`Skipped: ${syncResult.skipped}`} variant="outlined" />

            <Chip
              label={`Failed: ${syncResult.failed}`}
              color={syncResult.failed > 0 ? "error" : "default"}
              variant="outlined"
            />
          </Stack>
        </Paper>
      )}

      {/* =========================================
          LATEST DATA
      ========================================= */}

      {rows.length > 0 && (
        <Paper
          elevation={0}
          sx={{
            mt: 3,
            p: {
              xs: 2,
              sm: 3,
            },
            border: "1px solid",
            borderColor: "divider",
            borderRadius: 3,
          }}
        >
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              gap: 2,
              mb: 2,
              flexWrap: "wrap",
            }}
          >
            <Box>
              <Typography variant="h6" fontWeight={700}>
                Latest Google Sheet Data
              </Typography>

              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ mt: 0.5 }}
              >
                Preview of the latest fetched records.
              </Typography>
            </Box>

            <Chip
              label={`${rows.length} rows fetched`}
              variant="outlined"
              size="small"
            />
          </Box>

          <Paper
            variant="outlined"
            sx={{
              p: 1.5,
              maxHeight: 400,
              overflow: "auto",
              borderRadius: 2,
              backgroundColor: "background.default",
            }}
          >
            {rows.slice(0, 10).map((row) => (
              <Box
                key={row.__google_row}
                sx={{
                  p: 2,
                  mb: 1,
                  border: "1px solid",
                  borderColor: "divider",
                  borderRadius: 2,
                  backgroundColor: "background.paper",
                  "&:last-child": {
                    mb: 0,
                  },
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                    mb: 1,
                  }}
                >
                  <Chip
                    label={`Google Row ${row.__google_row}`}
                    size="small"
                    color="primary"
                    variant="outlined"
                  />
                </Box>

                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{
                    lineHeight: 1.8,
                    wordBreak: "break-word",
                  }}
                >
                  {Object.entries(row)
                    .filter(([key]) => key !== "__google_row")
                    .map(([key, value]) => `${key}: ${value}`)
                    .join("  |  ")}
                </Typography>
              </Box>
            ))}
          </Paper>
        </Paper>
      )}
    </Box>
  );
}

export default GoogleSheetSync;
