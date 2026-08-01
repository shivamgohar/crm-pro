import {
  Paper,
  Typography,
  Button,
  Divider,
  Stack,
} from "@mui/material";

export default function ImportStep({
  selectedFile,
  selectedSheet,
  totalRows,
  totalMappedFields,
  importing,
  onImport,
  importResult,
  onFinish,
}) {

  // Import Complete Screen
  if (importResult) {
    return (
      <Paper sx={{ p: 3, mt: 3 }}>

        <Typography
          variant="h5"
          color="success.main"
          gutterBottom
        >
          ✅ Import Completed
        </Typography>

        <Divider sx={{ mb: 3 }} />

        <Stack spacing={2}>

          <Typography>
            <strong>Total Rows :</strong> {importResult.total}
          </Typography>

          <Typography>
            <strong>Imported :</strong> {importResult.imported}
          </Typography>

          <Typography>
           <strong>Updated :</strong> {importResult.updated}
          </Typography>

          <Typography>
            <strong>Failed :</strong> {importResult.failed}
          </Typography>

        </Stack>

        <Button
          sx={{ mt: 4 }}
          fullWidth
          variant="contained"
          color="success"
          onClick={onFinish}
        >
          Finish
        </Button>

      </Paper>
    );
  }

  // Ready To Import Screen
  return (
    <Paper sx={{ p: 3, mt: 3 }}>

      <Typography variant="h6" gutterBottom>
        Ready to Import
      </Typography>

      <Divider sx={{ mb: 3 }} />

      <Stack spacing={2}>

        <Typography>
          <strong>File :</strong> {selectedFile?.name}
        </Typography>

        <Typography>
          <strong>Sheet :</strong> {selectedSheet}
        </Typography>

        <Typography>
          <strong>Total Rows :</strong> {totalRows}
        </Typography>

        <Typography>
          <strong>Mapped Fields :</strong> {totalMappedFields}
        </Typography>

      </Stack>

      <Button
        sx={{ mt: 4 }}
        fullWidth
        variant="contained"
        color="success"
        onClick={onImport}
        disabled={importing}
      >
        {importing ? "Importing..." : "Start Import"}
      </Button>

    </Paper>
  );
}