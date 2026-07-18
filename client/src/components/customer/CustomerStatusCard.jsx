import {
  Card,
  CardContent,
  Typography,
  Divider,
  Chip,
  Stack,
} from "@mui/material";

function CustomerStatusCard() {
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
            label="AMC Pending"
            color="warning"
          />

          <Chip
            label="Payment Clear"
            color="primary"
          />

        </Stack>

        <Divider sx={{ my: 3 }} />

        <Typography>
          Pending Amount
        </Typography>

        <Typography variant="h5">
          ₹0
        </Typography>

        <Divider sx={{ my: 2 }} />

        <Typography>
          Last Service
        </Typography>

        <Typography variant="subtitle1">
          --
        </Typography>

        <Divider sx={{ my: 2 }} />

        <Typography>
          Next Service
        </Typography>

        <Typography variant="subtitle1">
          --
        </Typography>

      </CardContent>
    </Card>
  );
}

export default CustomerStatusCard;