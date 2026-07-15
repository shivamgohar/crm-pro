import { Card, CardContent, Typography, Box } from "@mui/material";

function DashboardCard({ title, value, icon }) {
  return (
    <Card
      elevation={3}
      sx={{
        borderRadius: 4,
        height: 200,
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        transition: "0.3s",

        "&:hover": {
          transform: "translateY(-6px)",
          boxShadow: 8,
        },
      }}
    >
      <CardContent
        sx={{
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1,
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: 50,
              height: 50,
              borderRadius: "50%",
              bgcolor: "#f4f7fe",
            }}
          >
            {icon}
          </Box>

          <Typography variant="h6" fontWeight={600}>
            {title}
          </Typography>
        </Box>

        <Typography
          variant="h4"
          fontWeight="bold"
          color="primary"
          align="center"
        >
          {value}
        </Typography>

        <Typography variant="body2" color="text.secondary" align="center">
          Updated Today
        </Typography>
      </CardContent>
    </Card>
  );
}

export default DashboardCard;
