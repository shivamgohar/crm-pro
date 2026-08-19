import {
  Box,
  Paper,
  Typography,
  Avatar,
  Chip,
} from "@mui/material";

function StatCard({
  title,
  value,
  change,
  icon,
  color,
}) {
  return (
    <Paper
      elevation={0}
      sx={{
        p: 2.5,
        height: "100%",
        border: "1px solid",
        borderColor: "divider",
        borderRadius: 3,
        bgcolor: "background.paper",
      }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
        }}
      >
        <Avatar
          sx={{
            width: 56,
            height: 56,
            backgroundColor: `${color}12`,
          }}
        >
          {icon}
        </Avatar>

        {change && (
          <Chip
            label={change}
            size="small"
            sx={{
              bgcolor: "success.main",
              color: "success.contrastText",
              fontWeight: 600,
            }}
          />
        )}
      </Box>

      <Typography
        sx={{
          mt: 2,
          color: "text.secondary",
          fontSize: 16,
        }}
      >
        {title}
      </Typography>

      <Typography
        sx={{
          mt: 0.5,
          fontSize: 30,
          fontWeight: 700,
          color,
        }}
      >
        {value}
      </Typography>

      <Typography
        sx={{
          mt: 0.5,
          fontSize: 14,
          color: "text.secondary",
        }}
      >
        Updated Today
      </Typography>
    </Paper>
  );
}

export default StatCard;