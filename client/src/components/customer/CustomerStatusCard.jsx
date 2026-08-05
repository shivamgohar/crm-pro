import {
  Card,
  CardContent,
  Typography,
  Divider,
  Chip,
  Stack,
} from "@mui/material";

function CustomerStatusCard({
  summary,
}) {
  return (
    <Card elevation={3}>
      <CardContent>

        <Typography
          variant="h6"
          gutterBottom
        >
          Customer Status
        </Typography>

        <Divider sx={{ mb: 2 }} />

        <Stack spacing={2}>

          <Chip
            label="Customer Active"
            color="success"
          />

     <Chip
label={
summary?.amcActive
? "AMC Active"
: "AMC Expired"
}
color={
summary?.amcActive
? "success"
: "error"
}
/>

       <Chip
label={
summary?.pendingAmount > 0
? "Payment Pending"
: "Payment Clear"
}
color={
summary?.pendingAmount > 0
? "warning"
: "success"
}
/>

        </Stack>

        <Divider sx={{ my: 3 }} />

        <Typography>
          Pending Amount
        </Typography>

        <Typography variant="h5">
        ₹{summary?.pendingAmount ?? 0}
        </Typography>

        <Divider sx={{ my: 2 }} />

        <Typography>
          Last Service
        </Typography>

        <Typography variant="subtitle1">
         {summary?.lastService || "--"}
        </Typography>

        <Divider sx={{ my: 2 }} />

        <Typography>
          Next Service
        </Typography>

        <Typography variant="subtitle1">
       {
summary?.nextService
  ? new Date(summary.nextService)
      .toLocaleDateString("en-IN")
  : "--"
}
        </Typography>

      </CardContent>
    </Card>
  );
}

export default CustomerStatusCard;