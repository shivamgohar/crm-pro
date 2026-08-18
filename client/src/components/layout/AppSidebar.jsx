import {
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  Box,
  Avatar,
  Chip,
  Divider,
} from "@mui/material";

import LanguageOutlinedIcon from "@mui/icons-material/LanguageOutlined";
import OpenInNewOutlinedIcon from "@mui/icons-material/OpenInNewOutlined";

import { brandConfig } from "../../config/brandConfig";
import { navigationItems } from "../../config/navigationConfig";
import { NavLink } from "react-router-dom";

export default function AppSidebar() {
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
      {/* ================= PRODUCT + COMPANY ================= */}
      <Box
        sx={{
          flexShrink: 0,
          px: 1.8,
          pt: 1.8,
          pb: 1.3,
        }}
      >
        {/* PRODUCT */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 0.8,
            mb: 1.6,
          }}
        >
          <Avatar
            src={brandConfig.logo || undefined}
            alt={brandConfig.appName}
            sx={{
              width: 28,
              height: 28,
              bgcolor: brandConfig.logo
                ? "transparent"
                : "primary.main",
              fontSize: "0.72rem",
              fontWeight: 700,
            }}
          >
            {!brandConfig.logo &&
              brandConfig.appName.charAt(0)}
          </Avatar>

          <Typography
            sx={{
              fontSize: "0.82rem",
              fontWeight: 700,
              lineHeight: 1,
            }}
          >
            {brandConfig.appName}
          </Typography>

          <Chip
            label={`v${brandConfig.appVersion}`}
            size="small"
            sx={{
              height: 17,
              ml: "auto",
              fontSize: "0.58rem",
              "& .MuiChip-label": {
                px: 0.7,
              },
            }}
          />
        </Box>

        {/* COMPANY */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1.2,
          }}
        >
          {/* COMPANY LOGO */}
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

          {/* COMPANY TEXT */}
          <Box
            sx={{
              minWidth: 0,
              overflow: "hidden",
            }}
          >
            <Typography
              sx={{
                fontSize: "0.95rem",
                fontWeight: 800,
                lineHeight: 1.15,
              }}
              noWrap
            >
              {brandConfig.companyName}
            </Typography>

            <Typography
              sx={{
                fontSize: "0.68rem",
                color: "text.secondary",
                lineHeight: 1.2,
                mt: 0.35,
              }}
              noWrap
            >
              {brandConfig.companyTagline}
            </Typography>
          </Box>
        </Box>

        <Divider sx={{ mt: 1.4 }} />
      </Box>

      {/* ================= NAVIGATION SCROLL AREA ================= */}
      <Box
        sx={{
          flex: 1,
          minHeight: 0,
          overflowY: "auto",

          /* Clean scrollbar */
          "&::-webkit-scrollbar": {
            width: 5,
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
            py: 0.3,
          }}
        >
          {navigationItems.map((item) => {
            const Icon = item.icon;

            return (
              <ListItemButton
                key={item.path}
                component={NavLink}
                to={item.path}
                sx={{
                  minHeight: 38,
                  height: 38,

                  px: 1.2,
                  py: 0,

                  borderRadius: 1.7,
                  mb: 0.3,

                  "& .MuiListItemIcon-root": {
                    minWidth: 32,
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
                <ListItemIcon>
                  <Icon
                    sx={{
                      fontSize: 18,
                    }}
                  />
                </ListItemIcon>

                <ListItemText
                  primary={item.title}
                />
              </ListItemButton>
            );
          })}
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
              py: 0.9,

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
                  fontSize: "0.68rem",
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