import { Button, Paper, Stack, Typography } from "@mui/material";
import UploadFileIcon from "@mui/icons-material/UploadFile";

export default function UploadStep({
  selectedFile,
  onFileSelect,
}) {
  const handleChange = (event) => {
    const file = event.target.files[0];

    if (!file) return;

    onFileSelect(file);
  };

  return (
    <Paper
      variant="outlined"
      sx={{
        p: 5,
        mt: 4,
        textAlign: "center",
        borderStyle: "dashed",
      }}
    >
      <Stack spacing={2} alignItems="center">

        <UploadFileIcon sx={{ fontSize: 60 }} />

        <Typography variant="h6">
          Upload Customer Excel
        </Typography>

        <Typography color="text.secondary">
          Supported formats: .xlsx, .xls
        </Typography>

        <Button
          component="label"
          variant="contained"
        >
          Browse File

          <input
            hidden
            type="file"
            accept=".xlsx,.xls"
            onChange={handleChange}
          />

        </Button>

        {selectedFile && (
          <Paper
            variant="outlined"
            sx={{
              p: 2,
              width: 350,
            }}
          >
            <Typography>
              <strong>File:</strong> {selectedFile.name}
            </Typography>

            <Typography>
              <strong>Size:</strong>{" "}
              {(selectedFile.size / 1024).toFixed(2)} KB
            </Typography>
          </Paper>
        )}

      </Stack>
    </Paper>
  );
}

