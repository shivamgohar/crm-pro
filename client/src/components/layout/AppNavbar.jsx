import {
  AppBar,
  Toolbar,
  Box,
  Typography,
  IconButton,
  Avatar,
  Badge,
  TextField,
  InputAdornment,
} from "@mui/material";

import SearchIcon from "@mui/icons-material/Search";
import NotificationsNoneOutlinedIcon from "@mui/icons-material/NotificationsNoneOutlined";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";

export default function AppNavbar() {
  return (

 <AppBar
        position="fixed"
        color="inherit"
        elevation={0}
        sx={(theme) => ({
          height: 76,
          borderBottom: 1,
          borderColor: "divider",
          backgroundColor: "background.paper",
          zIndex: theme.zIndex.drawer + 1,
        })}
      >
        <Toolbar sx={{ height: 76 }}>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            width: "100%",
            justifyContent: "space-between",
          }}
        >
          {" "}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 2,
            }}
          >
            <Avatar
              sx={{
                bgcolor: "primary.main",
                fontWeight: 700,
              }}
            >
              C
            </Avatar>

            <Box>
              <Typography variant="h6" fontWeight={700}>
                CRM PRO
              </Typography>

              <Typography variant="caption" color="text.secondary">
                ACN GROUP Water Experts
              </Typography>
            </Box>
          </Box>
          <TextField
  placeholder="Search customers..."
  size="small"
  sx={{
    width: 420,
    "& .MuiOutlinedInput-root": {
      borderRadius: 3,
    },
  }}
  InputProps={{
    startAdornment: (
      <InputAdornment position="start">
        <SearchIcon />
      </InputAdornment>
    ),
  }}
/>
          <Box
            sx={{
              display: "flex",

              alignItems: "center",

              gap: 1,
            }}
          >
            <IconButton>
              <Badge badgeContent={4} color="error">
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

            <Typography>Steve</Typography>

            <KeyboardArrowDownIcon />
          </Box>
        </Box>
      </Toolbar>
    </AppBar>
  );
}
