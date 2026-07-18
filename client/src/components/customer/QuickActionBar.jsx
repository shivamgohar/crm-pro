import { Stack, Button } from "@mui/material";

import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import PaymentsIcon from "@mui/icons-material/Payments";
import PrintIcon from "@mui/icons-material/Print";
import FileDownloadIcon from "@mui/icons-material/FileDownload";

function QuickActionBar({
    onAddService
}) {


  return (
    <Stack
      direction="row"
      spacing={2}
      justifyContent="flex-end"
      sx={{ mb: 3 }}
    >
     <Button
variant="contained"
startIcon={<AddIcon />}
onClick={onAddService}
>
        Add Service
      </Button>

      <Button
        variant="contained"
        color="success"
        startIcon={<PaymentsIcon />}
      >
        Receive Payment
      </Button>

      <Button
        variant="outlined"
        startIcon={<EditIcon />}
      >
        Edit Customer
      </Button>

      <Button
        variant="outlined"
        startIcon={<PrintIcon />}
      >
        Print
      </Button>

      <Button
        variant="outlined"
        startIcon={<FileDownloadIcon />}
      >
        Export
      </Button>
    </Stack>
  );
}

export default QuickActionBar;