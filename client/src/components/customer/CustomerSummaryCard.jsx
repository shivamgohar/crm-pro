import {
  Card,
  CardContent,
  Typography,
  Grid,
  Divider,
  Chip,
} from "@mui/material";

function CustomerSummaryCard({ customer }) {
  return (
    <Card elevation={3}>
      <CardContent>

        <Typography
          variant="h4"
          gutterBottom
        >
          {customer.name}
        </Typography>

        <Chip
          label="Active Customer"
          color="success"
          sx={{ mb: 3 }}
        />

        <Divider sx={{ mb: 3 }} />

        <Grid container spacing={3}>

          <Grid item xs={6}>

            <Typography color="text.secondary">
              Customer Code
            </Typography>

            <Typography variant="h6">
              {customer.customer_code}
            </Typography>

          </Grid>

          <Grid item xs={6}>

            <Typography color="text.secondary">
              Mobile
            </Typography>

            <Typography variant="h6">
              {customer.phone}
            </Typography>

          </Grid>

          <Grid item xs={6}>

            <Typography color="text.secondary">
              Email
            </Typography>

            <Typography variant="h6">
              {customer.email || "-"}
            </Typography>

          </Grid>

          <Grid item xs={12}>

            <Typography color="text.secondary">
              Current Address
            </Typography>

            <Typography variant="h6">
              {customer.address}
            </Typography>

          </Grid>

        </Grid>

      </CardContent>
    </Card>
  );
}

export default CustomerSummaryCard;