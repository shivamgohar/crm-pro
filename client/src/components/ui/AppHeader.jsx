import { Box, Typography } from "@mui/material";

export default function AppHeader({
  title,
  subtitle,
  actions,
}) {
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        mb: 3,
        flexWrap: "wrap",
        gap: 2,
      }}
    >
      <Box>
        <Typography
          variant="h4"
          fontWeight={700}
        >
          {title}
        </Typography>

        {subtitle && (
          <Typography
            variant="body2"
            color="text.secondary"
          >
            {subtitle}
          </Typography>
        )}
      </Box>

      <Box
        sx={{
          display: "flex",
          gap: 1,
        }}
      >
        {actions}
      </Box>
    </Box>
  );
}