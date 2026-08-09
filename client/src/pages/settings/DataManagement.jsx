import {
  Box,
  Typography,
  Grid,
  Card,
  CardActionArea,
  CardContent,
  Chip,
} from "@mui/material";

import {
  FileUpload,
  FileDownload,
  Backup,
  Restore,
  CleaningServices,
    DeleteSweep,
} from "@mui/icons-material";

import { useNavigate } from "react-router-dom";
import AppBreadcrumb from "../../components/ui/AppBreadcrumb";

function DataManagement() {
  const navigate = useNavigate();

  const menus = [
    {
      title: "Import Data",
      description: "Import customers from Excel",
      icon: <FileUpload fontSize="large" />,
      path: "/customers/import",
      disabled: false,
    },
    {
      title: "Export Data",
      description: "Export CRM data",
      icon: <FileDownload fontSize="large" />,
      disabled: true,
    },
    {
      title: "Backup",
      description: "Backup database",
      icon: <Backup fontSize="large" />,
      disabled: true,
    },
    {
      title: "Restore",
      description: "Restore backup",
      icon: <Restore fontSize="large" />,
      disabled: true,
    },
    {
      title: "Data Cleanup",
      description: "Remove duplicate or invalid data",
      icon: <CleaningServices fontSize="large" />,
      disabled: true,
    },
{
  title: "Clean Imported Data",
  description: "Remove previously imported customer data",
  icon: <DeleteSweep />,
  path: "/settings/data-management/clean-imported",
  disabled: false,
},

  ];

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
    },
  ]}
/>

      <Typography variant="h4" fontWeight={700} mb={3}>
        Data Management
      </Typography>

      <Grid container spacing={3}>
        {menus.map((item) => (
          <Grid item xs={12} sm={6} md={4} key={item.title}>
            <Card sx={{ height: "100%" }}>
              <CardActionArea
                disabled={item.disabled}
                sx={{ height: "100%" }}
                onClick={() => {
                  if (!item.disabled) {
                    navigate(item.path);
                  }
                }}
              >
                <CardContent>
                  <Box mb={2}>{item.icon}</Box>

                  <Typography variant="h6">
                    {item.title}
                  </Typography>

                  <Typography
                    variant="body2"
                    color="text.secondary"
                    mt={1}
                  >
                    {item.description}
                  </Typography>

                  {item.disabled && (
                    <Chip
                      label="Coming Soon"
                      size="small"
                      sx={{ mt: 2 }}
                    />
                  )}
                </CardContent>
              </CardActionArea>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}

export default DataManagement;