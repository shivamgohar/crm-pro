import { Typography } from "@mui/material";
import {
  Box,
  Card,
  CardActionArea,
  CardContent,
  Grid,
 
} from "@mui/material";

import {
  Business,
  People,
  TableChart,
  ManageAccounts,
  Security,
  Backup,
  Palette,
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
      title: "Customer Fields",
      description: "Manage customer fields",
      icon: <People fontSize="large" />,
      path: "/settings/customer-fields",
      disabled: false,
    },
    {
      title: "Excel Mapping",
      description: "Configure Excel import",
      icon: <TableChart fontSize="large" />,
      path: "/settings/excel-mapping",
      disabled: true,
    },
    {
      title: "Users",
      description: "Manage users",
      icon: <ManageAccounts fontSize="large" />,
      path: "/settings/users",
      disabled: true,
    },
    {
      title: "Roles & Permissions",
      description: "Manage access control",
      icon: <Security fontSize="large" />,
      path: "/settings/roles",
      disabled: true,
    },
    {
      title: "Backup",
      description: "Backup & Restore",
      icon: <Backup fontSize="large" />,
      path: "/settings/backup",
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
            <Card>
              <CardActionArea
                disabled={item.disabled}
                onClick={() => {
                  navigate(item.path);
                }}
              >
                <CardContent>
                  <Box mb={2}>{item.icon}</Box>

                  <Typography variant="h6">{item.title}</Typography>

                  <Typography variant="body2" color="text.secondary">
                    {item.description}
                  </Typography>
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
