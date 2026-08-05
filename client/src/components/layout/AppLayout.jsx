import { Box } from "@mui/material";
import AppNavbar from "./AppNavbar";
import AppSidebar from "./AppSidebar";

export default function AppLayout({ children }) {
  return (
    <Box sx={{ display: "flex" }}>

      <AppSidebar />

      <Box
        sx={{
          flex: 1,
          ml: "250px",
        }}
      >
        <AppNavbar />

        <Box
          sx={{
            mt: "76px",
            p: 3,
            bgcolor: "background.default",
            minHeight: "100vh",
          }}
        >
          {children}
        </Box>

      </Box>

    </Box>
  );
}