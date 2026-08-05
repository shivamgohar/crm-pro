import {
  Box,
  Typography,
} from "@mui/material";

export default function AppSection({
  title,
  children,
}) {
  return (
    <Box sx={{ mb: 4 }}>
      {title && (
        <Typography
          variant="h6"
          sx={{ mb: 2 }}
        >
          {title}
        </Typography>
      )}

      {children}
    </Box>
  );
}