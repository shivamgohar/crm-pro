import {
  Card,
  CardContent,
  Typography,
  Box,
  Chip,
} from "@mui/material";

function DashboardCard({
  title,
  value,
  icon,
  color = "primary.main",
  change = "+0%",
}) {
  return (
    <Card
      elevation={0}
      sx={{
        height: 180,
        borderRadius: 2,
        
        border: "1px solid",
        borderColor: "divider",
        transition: "all .25s ease",

        "&:hover": {
          transform: "translateY(-5px)",
          boxShadow: 6,
          borderColor: color,
        },
      }}
    >
      <CardContent
        sx={{
          height: "100%",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* Top */}

        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Box
            sx={{
              width: 52,
              height: 52,
              borderRadius: 3,
              bgcolor: `${color}15`,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            {icon}
          </Box>

          <Chip
            label={change}
            color="success"
            size="small"
          />
        </Box>

        {/* Title */}

        <Typography
          sx={{
            mt: 2,
            color: "text.secondary",
            fontWeight: 500,
          }}
        >
          {title}
        </Typography>

        {/* Value */}

        <Typography
          sx={{
            mt: 1,
            fontSize: 24,
            fontWeight: 700,
            color: color,
          }}
        >
          {value}
        </Typography>

        <Box sx={{ flexGrow: 1 }} />

        <Typography
          variant="body2"
          color="text.secondary"
        >
          Updated Today
        </Typography>
      </CardContent>
    </Card>
  );
}

export default DashboardCard;