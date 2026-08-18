import { NavLink } from "react-router-dom";
import { brandConfig } from "../config/brandConfig";

import {
  Drawer,
  Box,
  Typography,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Avatar,
  Chip,
  Divider,
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
import LanguageOutlinedIcon from "@mui/icons-material/LanguageOutlined";
import OpenInNewOutlinedIcon from "@mui/icons-material/OpenInNewOutlined";

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
          height: "100vh",

          boxSizing: "border-box",

          position: "fixed",
          left: 0,
          top: 0,
          bottom: 0,

          display: "flex",
          flexDirection: "column",

          borderRight: 1,
          borderColor: "divider",
          bgcolor: "background.paper",

          overflow: "hidden",
        },
      }}
    >
      {/* ================= PRODUCT HEADER ================= */}
      <Box
        sx={{
          flexShrink: 0,
          px: 2,
          pt: 1.8,
          pb: 1.2,
        }}
      >
        {/* Product */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 0.8,
            mb: 1.5,
          }}
        >
          <Avatar
            src={brandConfig.logo || undefined}
            alt={brandConfig.appName}
            sx={{
              width: 28,
              height: 28,

              bgcolor: brandConfig.logo ? "transparent" : "primary.main",

              fontSize: "0.72rem",
              fontWeight: 700,
            }}
          >
            {!brandConfig.logo && brandConfig.appName.charAt(0)}
          </Avatar>

          <Typography
            sx={{
              fontSize: "0.82rem",
              fontWeight: 700,
              lineHeight: 1,
            }}
            noWrap
          >
            {brandConfig.appName}
          </Typography>

          <Chip
            label={`v${brandConfig.appVersion}`}
            size="small"
            sx={{
              height: 17,
              ml: "auto",

              fontSize: "0.57rem",

              "& .MuiChip-label": {
                px: 0.65,
              },
            }}
          />
        </Box>

        {/* ================= COMPANY BRAND ================= */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1.2,
          }}
        >
          {/* Company Logo */}
          {brandConfig.companyLogo ? (
            <Box
              component="img"
              src={brandConfig.companyLogo}
              alt={brandConfig.companyName}
              sx={{
                width: 48,
                height: 48,

                objectFit: "contain",

                flexShrink: 0,
              }}
            />
          ) : (
            <Avatar
              sx={{
                width: 48,
                height: 48,

                bgcolor: "primary.main",

                fontSize: "1rem",
                fontWeight: 700,

                flexShrink: 0,
              }}
            >
              {brandConfig.companyName.charAt(0)}
            </Avatar>
          )}

          {/* Company Name + Tagline */}
          <Box
            sx={{
              minWidth: 0,
              overflow: "hidden",
            }}
          >
            <Typography
              sx={{
                fontSize: "0.92rem",
                fontWeight: 800,

                lineHeight: 1.15,
              }}
              noWrap
            >
              {brandConfig.companyName}
            </Typography>

            <Typography
              sx={{
                fontSize: "0.67rem",
                color: "text.secondary",

                lineHeight: 1.2,

                mt: 0.3,
              }}
              noWrap
            >
              {brandConfig.companyTagline}
            </Typography>
          </Box>
        </Box>

        <Divider sx={{ mt: 1.4 }} />
      </Box>

      {/* ================= SCROLLABLE NAVIGATION ================= */}
      <Box
        sx={{
          flex: 1,
          minHeight: 0,

          overflowY: "auto",
          overflowX: "hidden",

          "&::-webkit-scrollbar": {
            width: 4,
          },

          "&::-webkit-scrollbar-thumb": {
            bgcolor: "divider",
            borderRadius: 10,
          },

          "&::-webkit-scrollbar-track": {
            bgcolor: "transparent",
          },
        }}
      >
        <List
          sx={{
            px: 0.8,
            py: 0.2,
          }}
        >
          {menus.map((item) => (
            <ListItemButton
              key={item.path}
              component={NavLink}
              to={item.path}
              sx={{
                minHeight: 38,
                height: 38,

                px: 1.1,
                py: 0,

                borderRadius: 1.7,

                mb: 0.25,

                "& .MuiListItemIcon-root": {
                  minWidth: 31,

                  color: "text.secondary",
                },

                "& .MuiListItemText-primary": {
                  fontSize: "0.78rem",
                  fontWeight: 500,

                  lineHeight: 1,
                },

                "&.active": {
                  bgcolor: "primary.main",
                  color: "#fff",

                  "& .MuiListItemIcon-root": {
                    color: "#fff",
                  },

                  "& .MuiListItemText-primary": {
                    fontWeight: 600,
                  },
                },

                "&:hover": {
                  bgcolor: "action.hover",
                },

                "&.active:hover": {
                  bgcolor: "primary.main",
                },
              }}
            >
              <ListItemIcon>{item.icon}</ListItemIcon>

              <ListItemText primary={item.text} />
            </ListItemButton>
          ))}
        </List>
      </Box>

      {/* ================= COMPANY WEBSITE ================= */}
      {brandConfig.companyWebsite && (
        <Box
          sx={{
            flexShrink: 0,

            p: 1.1,

            borderTop: 1,
            borderColor: "divider",

            bgcolor: "background.paper",
          }}
        >
          <Box
            component="a"
            href={brandConfig.companyWebsite}
            target="_blank"
            rel="noopener noreferrer"
            sx={{
              display: "flex",
              alignItems: "center",

              gap: 1,

              px: 1.1,
              py: 0.85,

              border: 1,
              borderColor: "divider",

              borderRadius: 1.7,

              textDecoration: "none",
              color: "inherit",

              "&:hover": {
                bgcolor: "action.hover",
              },
            }}
          >
            <LanguageOutlinedIcon
              sx={{
                fontSize: 18,
                color: "text.secondary",
              }}
            />

            <Box
              sx={{
                minWidth: 0,
                flex: 1,
              }}
            >
              <Typography
                sx={{
                  fontSize: "0.67rem",
                  fontWeight: 700,

                  lineHeight: 1.2,
                }}
              >
                Visit Website
              </Typography>

              <Typography
                sx={{
                  fontSize: "0.67rem",
                  color: "primary.main",

                  lineHeight: 1.2,

                  mt: 0.2,
                }}
                noWrap
              >
                {brandConfig.companyWebsite
                  .replace(/^https?:\/\//, "")
                  .replace(/\/$/, "")}
              </Typography>
            </Box>

            <OpenInNewOutlinedIcon
              sx={{
                fontSize: 15,
                color: "primary.main",
              }}
            />
          </Box>
        </Box>
      )}
    </Drawer>
  );
}
