import {
  CardContent,
  Typography,
} from "@mui/material";

import AppCard from "./AppCard";

export default function AppStatCard({
  title,
  value,
}) {
  return (
    <AppCard>
      <CardContent>
        <Typography
          variant="body2"
          color="text.secondary"
        >
          {title}
        </Typography>

        <Typography
          variant="h5"
          fontWeight={700}
        >
          {value}
        </Typography>
      </CardContent>
    </AppCard>
  );
}