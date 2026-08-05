import {
  AppBar,
  Toolbar,
  Box,
  IconButton,
  Avatar,
  Badge,
  TextField,
  InputAdornment,
  Button,
} from "@mui/material";

import SearchIcon from "@mui/icons-material/Search";
import NotificationsNoneOutlinedIcon from "@mui/icons-material/NotificationsNoneOutlined";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import LogoutOutlinedIcon from "@mui/icons-material/LogoutOutlined";

import { useNavigate } from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
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
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
          />

          {/* Right */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1,
            }}
          >
            <IconButton>
              <Badge badgeContent={2} color="error">
                <NotificationsNoneOutlinedIcon />
              </Badge>
            </IconButton>

            <IconButton>
              <SettingsOutlinedIcon />
            </IconButton>

            <Avatar
              sx={{
                width: 38,
                height: 38,
                bgcolor: "primary.main",
              }}
            >
              S
            </Avatar>

            <Button
              variant="outlined"
              startIcon={<LogoutOutlinedIcon />}
              onClick={handleLogout}
            >
              Logout
            </Button>

          </Box>

        </Box>

      </Toolbar>
    </AppBar>
  );
}

export default Navbar;