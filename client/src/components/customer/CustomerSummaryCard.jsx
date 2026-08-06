import {
  Paper,
  Box,
  Typography,
  Grid,
  Divider,
  
} from "@mui/material";

// import { AppCard } from "../ui";

function CustomerSummaryCard({ customer ,fields,}) {

const getFieldValue = (field) => {

  switch (field.field_key) {

    case "customer_name":
      return customer.name;

    case "customer_code":
      return customer.customer_code;

    case "location":
      return customer.address;

    default:
      return customer[field.field_key] || "-";

  }

};

// const PROFILE_EXCLUDED_FIELDS = [
//   "customer_name",
//   "customer_code",
// ];



return (
  <Paper
    elevation={0}
    sx={{
      p: 3,
      borderRadius: 3,
      border: "1px solid",
      borderColor: "divider",
      bgcolor: "background.paper",
    }}
  >
    <Box
      sx={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "flex-start",
        flexWrap: "wrap",
        gap: 2,
        mb: 3,
      }}
    >
      <Box>

       

<Typography
  variant="h6"
  fontWeight={600}
>
  Customer Information
</Typography>


      </Box>

   

    </Box>

    <Divider sx={{ mb: 3 }} />

    <Grid
      container
      spacing={3}
    >

      {fields
  .filter((field) => {
      return (
          field.show_in?.profile &&
          // !PROFILE_EXCLUDED_FIELDS.includes(field.field_key)
          field.field_key !== "customer_name" &&
          field.field_key !== "customer_code"
      );
  })
  .map((field) => (

        <Grid
          size={{ xs: 12, sm: 6 }}
          key={field.id}
        >

          <Typography
            variant="caption"
            color="text.secondary"
            sx={{
              textTransform: "uppercase",
              letterSpacing: 1,
            }}
          >
            {field.field_label}
          </Typography>

          <Typography
            variant="body1"
            fontWeight={600}
            sx={{ mt: .5 }}
          >
            {
getFieldValue(field)
            }
          </Typography>

        </Grid>

      ))}

    </Grid>

  </Paper>
);
}

export default CustomerSummaryCard;