import {
  Card,
  CardContent,
  Typography,
} from "@mui/material";

function DashboardCard({ title, value, icon }) {
  return (
    <Card
      elevation={3}
      sx={{
        borderRadius: 3,
        height: 180,
      }}
    >
      <CardContent>

        <Typography variant="h6">
          {icon} {title}
        </Typography>

        <Typography
          variant="h3"
          color="primary"
          align="center"
          mt={4}
          fontWeight="bold"
        >
          {value}
        </Typography>

      </CardContent>
    </Card>
  );
}

export default DashboardCard;