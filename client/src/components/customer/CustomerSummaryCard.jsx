import {
  Card,
  CardContent,
  Typography,
  Grid,
  Divider,
  Chip,
} from "@mui/material";

function CustomerSummaryCard({ customer ,fields,}) {
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

        {/* <Grid container spacing={3}>

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

        </Grid> */}


        <Grid container spacing={3}>
  {fields.map((field) => (
    <Grid
      item
      xs={12}
      md={6}
      key={field.id}
    >
      <Typography color="text.secondary">
        {field.field_label}
      </Typography>

      <Typography variant="h6">
        {
          customer[
            field.field_key === "customer_name"
              ? "name"
              : field.field_key
          ] || "-"
        }
      </Typography>
    </Grid>
  ))}
</Grid>

      </CardContent>
    </Card>
  );
}

export default CustomerSummaryCard;