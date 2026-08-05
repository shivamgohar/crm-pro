import { Box } from "@mui/material";

export default function AppToolbar({ children }) {
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        gap: 2,
        mb: 3,
        flexWrap: "wrap",
      }}
    >
      {children}
    </Box>
  );
}