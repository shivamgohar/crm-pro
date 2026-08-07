// const appConfig = require("../../config/appConfig");


import {
  AppBar,
  Toolbar,
  Box,
  IconButton,
  Avatar,
  Badge,
  TextField,
  // InputAdornment,
  Typography,

  // Button,
    Menu,
  MenuItem,
  Divider,
  ListItemIcon,
} from "@mui/material";

// import SearchIcon from "@mui/icons-material/Search";
import NotificationsNoneOutlinedIcon from "@mui/icons-material/NotificationsNoneOutlined";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import LogoutOutlinedIcon from "@mui/icons-material/LogoutOutlined";
// import NotificationsActiveOutlinedIcon from "@mui/icons-material/NotificationsActiveOutlined";

import { useNavigate } from "react-router-dom";
import { useState } from "react";


// import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import AccountCircleOutlinedIcon from "@mui/icons-material/AccountCircleOutlined";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";


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
        zIndex: (theme) => theme.zIndex.drawer + 1,
        borderBottom: 1,
        borderColor: "divider",
        bgcolor: "background.paper",
      }}
    >
      <Toolbar sx={{ minHeight: 72 }}>
        <Box
          sx={{
            width: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 3,
          }}
        >
          {/* Search */}
          <TextField
            placeholder="Search customers..."
            size="small"
            sx={{
              width: 320,
              maxWidth: "30%",
            }}
            // InputProps={{
            //   startAdornment: (
            //     <InputAdornment position="start">
            //       <SearchIcon />
            //     </InputAdornment>
            //   ),
            // }}
          />

          {/* Right */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1,
            }}
          >
          <IconButton onClick={handleNotificationOpen}>
              <Badge badgeContent={0} color="error">
                <NotificationsNoneOutlinedIcon /> 
              </Badge>
            </IconButton>

       <IconButton onClick={handleSettingsOpen}>
  <SettingsOutlinedIcon />
</IconButton>

         <Box
  sx={{
    display: "flex",
    alignItems: "center",
    gap: 1.5,
  }}
>
  <Avatar
    sx={{
      width: 40,
      height: 40,
      bgcolor: "primary.main",
      fontWeight: 600,
    }}
  >
    {initials}
  </Avatar>

  <Box>
    <Typography
      variant="body2"
      fontWeight={600}
      lineHeight={1.2}
    >
      {user?.fullName}
    </Typography>

    <Typography
      variant="caption"
      color="text.secondary"
    >
      {user?.role}
    </Typography>
  </Box>
</Box>

          </Box>
        </Box>
      </Toolbar>
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
