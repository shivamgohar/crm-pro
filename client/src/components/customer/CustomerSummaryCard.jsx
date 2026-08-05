import {
  Paper,
  Box,
  Typography,
  Grid,
  Divider,
  
} from "@mui/material";

// import { AppCard } from "../ui";

function CustomerSummaryCard({ customer ,fields,}) {
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
          variant="body2"
          color="text.secondary"
          sx={{ mt: .5 }}
        >
        Contact no. : {customer.phone}
        </Typography>
          <Typography
          variant="body2"
          color="text.secondary"
          sx={{ mt: .5 }}
        >
        Address : {customer.address}
        </Typography>

      </Box>

   

    </Box>

    <Divider sx={{ mb: 3 }} />

    <Grid
      container
      spacing={3}
    >

      {fields.map((field) => (

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

  </Paper>
);
}

export default CustomerSummaryCard;