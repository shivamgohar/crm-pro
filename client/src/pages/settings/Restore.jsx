import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  Alert,
  Divider,
  Chip,
} from "@mui/material";

import {
  Restore as RestoreIcon,
  Backup,
  DeleteForever,
  ArrowBack,
} from "@mui/icons-material";

import { useNavigate } from "react-router-dom";
import AppBreadcrumb from "../../components/ui/AppBreadcrumb";

function Restore() {
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
            label: "Restore",
          },
        ]}
      />

      <Typography
        variant="h4"
        fontWeight={700}
        mb={1}
      >
        Restore
      </Typography>

      <Typography
        variant="body1"
        color="text.secondary"
        mb={3}
      >
        Restore previously deleted or backed-up CRM data.
      </Typography>

      <Card>
        <CardContent sx={{ p: 3 }}>

          <Alert
            severity="info"
            sx={{ mb: 3 }}
          >
            Restore operations will be available after backup
            and recovery functionality is enabled.
          </Alert>

          {/* BACKUP RESTORE */}

          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 2,
              mb: 2,
            }}
          >
            <Backup />

            <Box>
              <Typography
                variant="h6"
                fontWeight={600}
              >
                Database Backup
              </Typography>

              <Typography
                variant="body2"
                color="text.secondary"
              >
                Restore CRM data from a previously created
                database backup.
              </Typography>
            </Box>

            <Chip
              label="Coming Soon"
              size="small"
              sx={{ ml: "auto" }}
            />
          </Box>

          <Button
            variant="outlined"
            disabled
          >
            Select Backup
          </Button>

          <Divider sx={{ my: 3 }} />

          {/* CUSTOMER TRASH */}

          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 2,
              mb: 2,
            }}
          >
            <RestoreIcon />

            <Box>
              <Typography
                variant="h6"
                fontWeight={600}
              >
                Customer Trash
              </Typography>

              <Typography
                variant="body2"
                color="text.secondary"
              >
                Restore customers that were moved to the trash.
              </Typography>
            </Box>
          </Box>

          <Button
            variant="outlined"
            onClick={() =>
              navigate("/settings/customer-trash")
            }
          >
            Open Customer Trash
          </Button>

          <Divider sx={{ my: 3 }} />

          {/* PERMANENT DELETE */}

          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 2,
              mb: 2,
            }}
          >
            <DeleteForever />

            <Box>
              <Typography
                variant="h6"
                fontWeight={600}
              >
                Permanent Deletion
              </Typography>

              <Typography
                variant="body2"
                color="text.secondary"
              >
                Permanently delete data from the trash.
                This action cannot be undone.
              </Typography>
            </Box>
          </Box>

          <Button
            variant="outlined"
            color="error"
            onClick={() =>
              navigate("/settings/customer-trash")
            }
          >
            Manage Deleted Data
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

export default Restore;