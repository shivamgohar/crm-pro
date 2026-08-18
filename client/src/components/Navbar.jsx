import {
  AppBar,
  Toolbar,
  Box,
  IconButton,
  Avatar,
  Badge,
  TextField,
  Typography,
  Menu,
  MenuItem,
  Divider,
  ListItemIcon,
} from "@mui/material";

import NotificationsNoneOutlinedIcon from "@mui/icons-material/NotificationsNoneOutlined";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import LogoutOutlinedIcon from "@mui/icons-material/LogoutOutlined";
import AccountCircleOutlinedIcon from "@mui/icons-material/AccountCircleOutlined";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";

import { useNavigate } from "react-router-dom";
import { useState } from "react";

const SIDEBAR_WIDTH = 284;
const NAVBAR_HEIGHT = 64;

function Navbar() {
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user"));

  const [settingsAnchor, setSettingsAnchor] = useState(null);
  const [notificationAnchor, setNotificationAnchor] = useState(null);

  const initials =
    user?.fullName
      ?.split(" ")
      .map((word) => word[0])
      .join("")
      .toUpperCase() || "U";

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    navigate("/login");
  };

  const handleSettingsOpen = (event) => {
    setSettingsAnchor(event.currentTarget);
  };

  const handleSettingsClose = () => {
    setSettingsAnchor(null);
  };

  const handleNotificationOpen = (event) => {
    setNotificationAnchor(event.currentTarget);
  };

  const handleNotificationClose = () => {
    setNotificationAnchor(null);
  };

  return (
    <AppBar
      position="fixed"
      elevation={0}
      color="inherit"
      sx={{
        left: `${SIDEBAR_WIDTH}px`,
        width: `calc(100% - ${SIDEBAR_WIDTH}px)`,
        height: `${NAVBAR_HEIGHT}px`,
        borderBottom: 1,
        borderColor: "divider",
        bgcolor: "background.paper",
        zIndex: (theme) => theme.zIndex.drawer + 1,
        boxShadow: "none",
      }}
    >
      <Toolbar
        sx={{
          minHeight: `${NAVBAR_HEIGHT}px !important`,
          height: `${NAVBAR_HEIGHT}px`,
          px: 2.5,
        }}
      >
        <Box
          sx={{
            width: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 2,
          }}
        >
          {/* SEARCH */}

          <TextField
            placeholder="Search customers..."
            size="small"
            sx={{
              width: 320,

              "& .MuiOutlinedInput-root": {
                height: 40,
                borderRadius: 2,
              },

              "& input": {
                fontSize: "0.82rem",
              },
            }}
          />

          {/* RIGHT SIDE */}

          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 0.75,
            }}
          >
            {/* Notifications */}

            <IconButton
              size="small"
              onClick={handleNotificationOpen}
            >
              <Badge
                badgeContent={0}
                color="error"
              >
                <NotificationsNoneOutlinedIcon
                  sx={{ fontSize: 22 }}
                />
              </Badge>
            </IconButton>

            {/* Settings */}

            <IconButton
              size="small"
              onClick={handleSettingsOpen}
            >
              <SettingsOutlinedIcon
                sx={{ fontSize: 22 }}
              />
            </IconButton>

            {/* User */}

            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1,
                ml: 0.75,
              }}
            >
              <Avatar
                sx={{
                  width: 38,
                  height: 38,
                  bgcolor: "primary.main",
                  fontSize: "0.85rem",
                  fontWeight: 600,
                }}
              >
                {initials}
              </Avatar>

              <Box
                sx={{
                  minWidth: 0,
                }}
              >
                <Typography
                  fontSize="0.8rem"
                  fontWeight={600}
                  noWrap
                  sx={{
                    lineHeight: 1.2,
                  }}
                >
                  {user?.fullName}
                </Typography>

                <Typography
                  fontSize="0.7rem"
                  color="text.secondary"
                  noWrap
                  sx={{
                    lineHeight: 1.4,
                  }}
                >
                  {user?.role}
                </Typography>
              </Box>
            </Box>
          </Box>
        </Box>
      </Toolbar>

      {/* SETTINGS MENU */}

      <Menu
        anchorEl={settingsAnchor}
        open={Boolean(settingsAnchor)}
        onClose={handleSettingsClose}
      >
        <MenuItem onClick={handleSettingsClose}>
          <ListItemIcon>
            <AccountCircleOutlinedIcon fontSize="small" />
          </ListItemIcon>

          My Profile
        </MenuItem>

        <MenuItem onClick={handleSettingsClose}>
          <ListItemIcon>
            <SettingsOutlinedIcon fontSize="small" />
          </ListItemIcon>

          Account Settings
        </MenuItem>

        <MenuItem onClick={handleSettingsClose}>
          <ListItemIcon>
            <LockOutlinedIcon fontSize="small" />
          </ListItemIcon>

          Change Password
        </MenuItem>

        <Divider />

        <MenuItem
          onClick={() => {
            handleSettingsClose();
            handleLogout();
          }}
        >
          <ListItemIcon>
            <LogoutOutlinedIcon fontSize="small" />
          </ListItemIcon>

          Logout
        </MenuItem>
      </Menu>

      {/* NOTIFICATION MENU */}

      <Menu
        anchorEl={notificationAnchor}
        open={Boolean(notificationAnchor)}
        onClose={handleNotificationClose}
      >
        <MenuItem onClick={handleNotificationClose}>
          <ListItemIcon>
            <NotificationsNoneOutlinedIcon fontSize="small" />
          </ListItemIcon>

          No Notifications
        </MenuItem>
      </Menu>
    </AppBar>
  );
}

export default Navbar;