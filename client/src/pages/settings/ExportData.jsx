import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  Alert,
  Divider,
  Chip,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";

import {
  FileDownload,
  People,
  MiscellaneousServices,
  ArrowBack,
} from "@mui/icons-material";

import { useNavigate } from "react-router-dom";
import AppBreadcrumb from "../../components/ui/AppBreadcrumb";

function ExportData() {
  const navigate = useNavigate();

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
            label: "Export Data",
          },
        ]}
      />

      <Typography
        variant="h4"
        fontWeight={700}
        mb={1}
      >
        Export Data
      </Typography>

      <Typography
        variant="body1"
        color="text.secondary"
        mb={3}
      >
        Export CRM data into Excel or CSV files.
      </Typography>

      <Card>
        <CardContent sx={{ p: 3 }}>

          <Alert
            severity="info"
            sx={{ mb: 3 }}
          >
            Select the data you want to export. Exported files
            will contain only the data available in the CRM.
          </Alert>

          {/* CUSTOMER DATA */}

          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 2,
              mb: 2,
            }}
          >
            <People />

            <Box sx={{ flex: 1 }}>
              <Typography
                variant="h6"
                fontWeight={600}
              >
                Customer Data
              </Typography>

              <Typography
                variant="body2"
                color="text.secondary"
              >
                Export customer information and custom fields.
              </Typography>
            </Box>

            <Chip
              label="Available"
              color="success"
              size="small"
            />
          </Box>

          <FormControl
            fullWidth
            sx={{ mb: 2 }}
          >
            <InputLabel>
              Export Format
            </InputLabel>

            <Select
              value="xlsx"
              label="Export Format"
              disabled
            >
              <MenuItem value="xlsx">
                Excel (.xlsx)
              </MenuItem>

              <MenuItem value="csv">
                CSV (.csv)
              </MenuItem>
            </Select>
          </FormControl>

          <Button
            variant="contained"
            startIcon={<FileDownload />}
            disabled
          >
            Export Customers
          </Button>

          <Divider sx={{ my: 3 }} />

          {/* SERVICE DATA */}

          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 2,
              mb: 2,
            }}
          >
            <MiscellaneousServices />

            <Box sx={{ flex: 1 }}>
              <Typography
                variant="h6"
                fontWeight={600}
              >
                Service Data
              </Typography>

              <Typography
                variant="body2"
                color="text.secondary"
              >
                Export customer service history with service
                details.
              </Typography>
            </Box>

            <Chip
              label="Available"
              color="success"
              size="small"
            />
          </Box>

          <Button
            variant="outlined"
            startIcon={<FileDownload />}
            disabled
          >
            Export Services
          </Button>

          <Divider sx={{ my: 3 }} />

          {/* FULL CRM */}

          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 2,
              mb: 2,
            }}
          >
            <FileDownload />

            <Box sx={{ flex: 1 }}>
              <Typography
                variant="h6"
                fontWeight={600}
              >
                Full CRM Export
              </Typography>

              <Typography
                variant="body2"
                color="text.secondary"
              >
                Export customers, services and custom field
                data together.
              </Typography>
            </Box>

            <Chip
              label="Coming Soon"
              size="small"
            />
          </Box>

          <Button
            variant="outlined"
            disabled
          >
            Export Full CRM
          </Button>

        </CardContent>
      </Card>

      <Button
        sx={{ mt: 2 }}
        startIcon={<ArrowBack />}
        onClick={() =>
          navigate("/settings/data-management")
        }
      >
        Back
      </Button>
    </Box>
  );
}

export default ExportData;