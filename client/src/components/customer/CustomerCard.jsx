import {
  Avatar,
  // Box,
  Card,
  CardContent,
  Chip,
  Grid,
  // Stack,
  Typography,
} from "@mui/material";

const CustomerCard = ({ customer, onClick, fields }) => {

  console.log(customer);
  console.log(fields);
  return (
    <Card
  onClick={onClick}
  sx={{
    mb: 1.5,
    borderRadius: 3,
    cursor: "pointer",
    border: "1px solid",
    borderColor: "divider",
    transition: "all .2s",

    "&:hover": {
      boxShadow: 5,
      borderColor: "primary.main",
      transform: "translateY(-2px)",
    },
  }}
>
    <CardContent sx={{ py: 1.5, px: 2 }}>
      <Grid container alignItems="center">
        {/* Avatar */}
        <Grid size={{ xs: 1 }}>
          <Avatar
            sx={{
              width: 42,
              height: 42,
              bgcolor: "primary.main",
              fontSize: 16,
              fontWeight: 600,
            }}
          >
            {customer?.name?.charAt(0)?.toUpperCase()}
          </Avatar>
        </Grid>

        {/* Customer */}
        <Grid size={{ xs: 3 }}>
          <Typography
            sx={{
              fontSize: 16,
              fontWeight: 600,
              lineHeight: 1.2,
            }}
          >
            {customer?.name}
          </Typography>

          <Chip
            label={`#${customer?.customer_code}`}
            size="small"
            variant="outlined"
            sx={{
              mt: 0.5,
              height: 22,
              fontSize: 11,
            }}
          />
        </Grid>


{fields.map((field) => (
  <Grid
    key={field.id}
    size={{ xs: 3 }}
  >
    <Typography
      variant="caption"
      color="text.secondary"
    >
      {field.field_label}
    </Typography>

    <Typography
      variant="body2"
      noWrap
    >
   {
field.field_key === "customer_name"
  ? customer.name
  : field.field_key === "location"
  ? customer.address
  : customer[field.field_key] || "-"
}
    </Typography>
  </Grid>
))}

        {/* Status */}
        <Grid
          size={{ xs: 1 }}
          sx={{
            display: "flex",
            justifyContent: "flex-end",
          }}
        >
          <Chip label="Active" color="success" size="small" />
        </Grid>
      </Grid>
    </CardContent>
    </Card>
  );
};

export default CustomerCard;
