import { Typography } from "@mui/material";
import {
  Box,
  Card,
  CardActionArea,
  CardContent,
  Grid,
  Chip,
} from "@mui/material";

import {
  Business,
  People,
  Storage,
  ManageAccounts,
  Security,
  Palette,
  Tune,
} from "@mui/icons-material";

import { useNavigate } from "react-router-dom";

function Settings() {
  const navigate = useNavigate();

  const settings = [
    {
      title: "Company Information",
      description: "Manage company details",
      icon: <Business fontSize="large" />,
      path: "/settings/company",
      disabled: true,
    },
{
  title: "Field Management",
  description: "Manage custom fields across CRM modules",
  icon: <Tune fontSize="large" />,
  path: "/settings/field-management",
  disabled: false,
},

    {
      title: "Customer Fields",
      description: "Manage customer fields",
      icon: <People fontSize="large" />,
      path: "/settings/customer-fields",
      disabled: false,
    },
    {
      title: "Customer Status",
      description: "Manage customer status",
      icon: <People fontSize="large" />,
      path: "/settings/customer-status",
      disabled: false,
    },
    {
      title: "Data Management",
      description: "Import, export, backup and restore data",
      icon: <Storage fontSize="large" />,
      path: "/settings/data-management",
      disabled: false,
    },
    {
      title: "Users",
      description: "Manage users",
      icon: <ManageAccounts fontSize="large" />,
      path: "/settings/users",
      disabled: false,
    },
    {
      title: "Roles & Permissions",
      description: "Manage access control",
      icon: <Security fontSize="large" />,
      path: "/settings/roles",
      disabled: true,
    },
    {
      title: "Branding",
      description: "Customize logo and theme",
      icon: <Palette fontSize="large" />,
      path: "/settings/branding",
      disabled: true,
    },
  ];

  return (
    <Box>
      <Typography variant="h4" fontWeight="bold" mb={3}>
        Settings
      </Typography>

      <Grid container spacing={3}>
        {settings.map((item) => (
          <Grid item xs={12} sm={6} md={4} key={item.title}>
            <Card sx={{ height: "100%" }}>
              <CardActionArea
                sx={{ height: "100%" }}
                disabled={item.disabled}
                onClick={() => navigate(item.path)}
              >
                <CardContent>
                  <Box mb={2}>{item.icon}</Box>

                  <Typography variant="h6" gutterBottom>
                    {item.title}
                  </Typography>

                  <Typography variant="body2" color="text.secondary">
                    {item.description}
                  </Typography>
                  {item.disabled && (
                    <Chip label="Coming Soon" size="small" sx={{ mt: 2 }} />
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

export default Settings;
