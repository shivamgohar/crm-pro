import { NavLink } from "react-router-dom";

import {
  Drawer,
  Toolbar,
  Box,
  Typography,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Avatar,
} from "@mui/material";

import DashboardOutlinedIcon from "@mui/icons-material/DashboardOutlined";
import PeopleAltOutlinedIcon from "@mui/icons-material/PeopleAltOutlined";
import Inventory2OutlinedIcon from "@mui/icons-material/Inventory2Outlined";
import ShoppingCartOutlinedIcon from "@mui/icons-material/ShoppingCartOutlined";
import AssessmentOutlinedIcon from "@mui/icons-material/AssessmentOutlined";
import WarehouseOutlinedIcon from "@mui/icons-material/WarehouseOutlined";
import ReceiptLongOutlinedIcon from "@mui/icons-material/ReceiptLongOutlined";
import PaymentsOutlinedIcon from "@mui/icons-material/PaymentsOutlined";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";

const menus = [
  { text: "Dashboard", icon: <DashboardOutlinedIcon />, path: "/" },
  { text: "Customers", icon: <PeopleAltOutlinedIcon />, path: "/customers" },
  { text: "Products", icon: <Inventory2OutlinedIcon />, path: "/products" },
  { text: "Orders", icon: <ShoppingCartOutlinedIcon />, path: "/orders" },
  { text: "Reports", icon: <AssessmentOutlinedIcon />, path: "/reports" },
  { text: "Inventory", icon: <WarehouseOutlinedIcon />, path: "/inventory" },
  { text: "Invoice", icon: <ReceiptLongOutlinedIcon />, path: "/invoice" },
  { text: "Payments", icon: <PaymentsOutlinedIcon />, path: "/payments" },
  { text: "Settings", icon: <SettingsOutlinedIcon />, path: "/settings" },
];

export default function Sidebar() {
  return (
    <Drawer
      variant="permanent"
      sx={{
        width: 250,
        flexShrink: 0,

        "& .MuiDrawer-paper": {
          width: 250,
          boxSizing: "border-box",
          borderRight: 1,
          borderColor: "divider",
        },
      }}
    >
      <Toolbar />

      <Box
        sx={{
          px: 3,
          py: 2,
          display: "flex",
          alignItems: "center",
          gap: 2,
        }}
      >
        <Avatar
          sx={{
            bgcolor: "primary.main",
          }}
        >
          C
        </Avatar>

        <Box>
          <Typography fontWeight={700}>
            CRM PRO
          </Typography>

          <Typography
            variant="caption"
            color="text.secondary"
          >
            ACN GROUP
          </Typography>
        </Box>
      </Box>

      <List sx={{ px: 1 }}>

        {menus.map((item) => (

          <ListItemButton
            key={item.path}
            component={NavLink}
            to={item.path}
            sx={{
              borderRadius: 2,
              mb: .5,

              "&.active": {
                bgcolor: "primary.main",
                color: "#fff",

                "& .MuiListItemIcon-root": {
                  color: "#fff",
                },
              },
            }}
          >
            <ListItemIcon>

              {item.icon}

            </ListItemIcon>

            <ListItemText primary={item.text} />

          </ListItemButton>

        ))}

      </List>

    </Drawer>
  );
}