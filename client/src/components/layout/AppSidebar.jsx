import {
  Drawer,
  Toolbar,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  Box,
  Avatar,
} from "@mui/material";


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
  boxSizing: "border-box",
  borderRight: 1,
  borderColor: "divider",
  bgcolor: "background.paper",
}
      }}
    >
      <Toolbar />

    <Box
  sx={{
    p: 3,
    display: "flex",
    alignItems: "center",
    gap: 2,
  }}
>
     <Avatar
  sx={{
    bgcolor: "primary.main",
    width: 42,
    height: 42,
  }}
>
  C
</Avatar>

<Box>

  <Typography
    fontWeight={700}
  >
    CRM PROoo
  </Typography>

  <Typography
    variant="caption"
    color="text.secondary"
  >
    Water Experts
  </Typography>

</Box>

        
      </Box>

     <List sx={{ px: 1 }}>

  {navigationItems.map((item) => {

    const Icon = item.icon;

    return (

      <ListItemButton
        key={item.path}
        component={NavLink}
        to={item.path}
        sx={{
          borderRadius: 2,
          mb: 0.5,

          "&.active": {
            bgcolor: "primary.main",
            color: "#fff",

            "& .MuiListItemIcon-root": {
              color: "#fff",
            },
          },

          "&:hover": {
            bgcolor: "primary.light",
            color: "#fff",

            "& .MuiListItemIcon-root": {
              color: "#fff",
            },
          },
        }}
      >

        <ListItemIcon>
          <Icon />
        </ListItemIcon>

        <ListItemText primary={item.title} />

      </ListItemButton>

    );

  })}

</List> 

    </Drawer>
  );
}   