import {
  AppBar,
  Toolbar,
  Box,
  IconButton,
  Avatar,
  Badge,
  TextField,
  InputAdornment,
  Typography,
} from "@mui/material";

import SearchIcon from "@mui/icons-material/Search";
import NotificationsNoneOutlinedIcon from "@mui/icons-material/NotificationsNoneOutlined";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";

import { useNavigate } from "react-router-dom";
import { useState } from "react";

export default function AppNavbar() {
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user"));

  const [notificationAnchor, setNotificationAnchor] =
    useState(null);

  const initials =
    user?.fullName
      ?.split(" ")
      .map((word) => word[0])
      .join("")
      .toUpperCase() || "U";

  return (
    <AppBar
      position="fixed"
      elevation={0}
      color="inherit"
      sx={{
        left: 250,
        width: "calc(100% - 250px)",
        height: 64,

        borderBottom: 1,
        borderColor: "divider",

        bgcolor: "background.paper",

        zIndex: (theme) =>
          theme.zIndex.drawer + 1,
      }}
    >

      <Toolbar
        sx={{
          minHeight: "64px !important",
          px: 2.5,
        }}
      >

        <Box
          sx={{
            width: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >

          {/* SEARCH */}
          <TextField
            placeholder="Search customers..."
            size="small"
            sx={{
              width: 280,

              "& .MuiOutlinedInput-root": {
                height: 38,
                borderRadius: 2.5,
                fontSize: "0.8rem",
              },

              "& .MuiInputBase-input": {
                py: 1,
              },
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon
                    sx={{
                      fontSize: 19,
                      color: "text.secondary",
                    }}
                  />
                </InputAdornment>
              ),
            }}
          />


          {/* RIGHT SIDE */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 0.7,
            }}
          >

            {/* NOTIFICATIONS */}
            <IconButton
              size="small"
              onClick={(event) =>
                setNotificationAnchor(
                  event.currentTarget
                )
              }
            >
              <Badge
                badgeContent={0}
                color="error"
              >
                <NotificationsNoneOutlinedIcon
                  sx={{ fontSize: 21 }}
                />
              </Badge>
            </IconButton>


            {/* SETTINGS */}
            <IconButton
              size="small"
              onClick={() =>
                navigate("/settings")
              }
            >
              <SettingsOutlinedIcon
                sx={{ fontSize: 21 }}
              />
            </IconButton>


            {/* USER */}
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1,
                ml: 1,
              }}
            >

              <Avatar
                sx={{
                  width: 36,
                  height: 36,
                  bgcolor: "primary.main",
                  fontSize: "0.85rem",
                  fontWeight: 700,
                }}
              >
                {initials}
              </Avatar>

              <Box>
                <Typography
                  sx={{
                    fontSize: "0.78rem",
                    fontWeight: 600,
                    lineHeight: 1.2,
                  }}
                >
                  {user?.fullName || "User"}
                </Typography>

                <Typography
                  sx={{
                    fontSize: "0.68rem",
                    color: "text.secondary",
                    lineHeight: 1.2,
                  }}
                >
                  {user?.role || "User"}
                </Typography>
              </Box>

            </Box>

          </Box>

        </Box>

      </Toolbar>

    </AppBar>
  );
}