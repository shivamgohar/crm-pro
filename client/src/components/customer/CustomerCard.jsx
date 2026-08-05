import { Avatar, CardContent, Chip, Grid, Typography } from "@mui/material";

import { AppCard } from "../ui";

const CustomerCard = ({ customer, onClick, fields }) => {
  return (
    <AppCard
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
          transform: "translateY(-4px)",
          transition: "all .25s ease",
        },
      }}
    >
      <CardContent sx={{ py: 2.5, px: 3 }}>
        <Grid container alignItems="center">
          {/* Avatar */}
          <Grid size={{ xs: 1 }}>
            <Avatar
              sx={(theme) => ({
                width: 40,
                height: 40,

                bgcolor: theme.palette.primary.main,

                color: "#fff",

                fontSize: 15,

                fontWeight: 700,

                boxShadow: "0 6px 16px rgba(37,99,235,.25)",

                border: `2px solid ${theme.palette.background.paper}`,
              })}
            >
              {customer?.name?.charAt(0)?.toUpperCase()}
            </Avatar>
          </Grid>

          {/* Customer */}
          <Grid size={{ xs: 3 }}>
            <Typography
              sx={{
                fontSize: 14,
                fontWeight: 800,
                lineHeight: 1.2,
              }}
            >
              {customer?.name}
            </Typography>

            <Chip
              label={`#${customer?.customer_code}`}
              size="small"
              variant="filled"
              sx={{
                mt: 1,
                height: 22,
                fontSize: 11,
                fontWeight: 600,
              }}
            />
          </Grid>

          {fields.map((field) => (
            <Grid key={field.id} size={{ xs: 3 }}>
              <Typography
                sx={{
                  fontSize: 11,
                  fontWeight: 700,
                  textTransform: "uppercase",
                  letterSpacing: 0.5,
                  color: "text.secondary",
                }}
              >
                {field.field_label}
              </Typography>

              <Typography
                variant="subtitle2"
                noWrap
                sx={{
                  fontWeight: 600,
                }}
              >
                {field.field_key === "customer_name"
                  ? customer.name
                  : field.field_key === "location"
                    ? customer.address
                    : customer[field.field_key] || "-"}
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
            <Chip
              label="ACTIVE"
              size="small"
              color="success"
              sx={{
                fontWeight: 700,
              }}
            />
          </Grid>
        </Grid>
      </CardContent>
    </AppCard>
  );
};

export default CustomerCard;
