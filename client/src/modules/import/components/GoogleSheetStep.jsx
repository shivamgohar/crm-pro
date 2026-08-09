import { authorizeGoogleSheets } from "../services/googleSheetService";

import {
  Box,
  TextField,
  Typography,
  Button,
} from "@mui/material";

export default function GoogleSheetStep({
  sheetUrl,
  setSheetUrl,
  onAuthorized,
}) {

  const handleGoogleAuth = async () => {

    try {

      const token =
        await authorizeGoogleSheets();

      console.log(
        "GOOGLE ACCESS TOKEN:",
        token
      );

      onAuthorized(token);

    } catch (error) {

      console.error(
        "Google authorization failed:",
        error
      );

    }
  };

  return (
    <Box>

      <Typography
        variant="h6"
        fontWeight={600}
        mb={1}
      >
        Get Data from Google Sheet
      </Typography>

      <Typography
        variant="body2"
        color="text.secondary"
        mb={3}
      >
        Connect your Google account and enter
        the Google Sheet URL.
      </Typography>

      <TextField
        fullWidth
        label="Google Sheet URL"
        placeholder="https://docs.google.com/spreadsheets/d/..."
        value={sheetUrl}
        onChange={(e) =>
          setSheetUrl(e.target.value)
        }
        sx={{ mb: 2 }}
      />

      <Button
        variant="contained"
        onClick={handleGoogleAuth}
      >
        Connect Google
      </Button>

    </Box>
  );
}