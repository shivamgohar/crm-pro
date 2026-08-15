import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  Alert,
  Divider,
} from "@mui/material";

import {
  DeleteSweep,
  People,
  Tune,
  Sync,
  ArrowBack,
} from "@mui/icons-material";

import { useNavigate } from "react-router-dom";
import AppBreadcrumb from "../../components/ui/AppBreadcrumb";

function DataCleanup() {
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
            label: "Data Cleanup",
          },
        ]}
      />

      <Typography
        variant="h4"
        fontWeight={700}
        mb={1}
      >
        Data Cleanup
      </Typography>

      <Typography
        variant="body1"
        color="text.secondary"
        mb={3}
      >
        Manage imported data, customer data, field values and
        synchronization data.
      </Typography>

      <Card>
        <CardContent sx={{ p: 3 }}>

          <Alert
            severity="warning"
            sx={{ mb: 3 }}
          >
            Cleanup actions can permanently remove CRM data.
            Please verify the data before continuing.
          </Alert>

          {/* IMPORTED DATA */}

          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 2,
              mb: 2,
            }}
          >
            <DeleteSweep />

            <Box>
              <Typography
                variant="h6"
                fontWeight={600}
              >
                Imported Data
              </Typography>

              <Typography
                variant="body2"
                color="text.secondary"
              >
                Remove previously imported customer and service
                data.
              </Typography>
            </Box>
          </Box>

          <Button
            variant="outlined"
            color="error"
            onClick={() =>
              navigate(
                "/settings/data-management/clean-imported"
              )
            }
          >
            Clean Imported Data
          </Button>

          <Divider sx={{ my: 3 }} />

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

            <Box>
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
                Manage active customers, deleted customers,
                restore and permanent deletion.
              </Typography>
            </Box>
          </Box>

          <Button
            variant="outlined"
            onClick={() =>
              navigate("/settings/trash")
            }
          >
            Manage Customer Data
          </Button>

          <Divider sx={{ my: 3 }} />

          {/* FIELD DATA */}

          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 2,
              mb: 2,
            }}
          >
            <Tune />

            <Box>
              <Typography
                variant="h6"
                fontWeight={600}
              >
                Field Data
              </Typography>

              <Typography
                variant="body2"
                color="text.secondary"
              >
                Reset stored custom field values without removing
                field definitions.
              </Typography>
            </Box>
          </Box>

          <Button
            variant="outlined"
            color="warning"
            disabled
          >
            Reset Field Data
          </Button>

          <Divider sx={{ my: 3 }} />

          {/* GOOGLE SYNC DATA */}

          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 2,
              mb: 2,
            }}
          >
            <Sync />

            <Box>
              <Typography
                variant="h6"
                fontWeight={600}
              >
                Google Sheet Sync Data
              </Typography>

              <Typography
                variant="body2"
                color="text.secondary"
              >
                Manage Google Sheet mappings and synchronization
                links.
              </Typography>
            </Box>
          </Box>

          <Button
            variant="outlined"
            onClick={() =>
              navigate(
                "/settings/data-management/google-sync"
              )
            }
          >
            Manage Google Sync
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

export default DataCleanup;