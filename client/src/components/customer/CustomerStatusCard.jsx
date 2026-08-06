import {
  CardContent,
  Typography,
  Divider,
  Chip,
 
  Box,
} from "@mui/material";

// import { AppCard } from "../ui";

function InfoRow({ title, value }) {
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        py: 1,
      }}
    >
      <Typography
        variant="body2"
        color="text.secondary"
      >
        {title}
      </Typography>

      <Typography
        variant="body2"
        fontWeight={600}
      >
        {value}
      </Typography>
    </Box>
  );
}

export default function CustomerStatusCard({ summary }) {

const formatDate = (date) => {
  if (!date) return "--";

  return new Date(date).toLocaleDateString("en-IN");
};

  return (
    <>

      <CardContent>

        <Typography
          variant="h6"
          fontWeight={700}
          mb={2}
        >
          Customer Status
        </Typography>

        <Chip
          label="Customer Active"
          color="success"
          size="small"
          sx={{ mb: 2 }}
        />

        <Divider />

        <InfoRow
          title="AMC"
          value={
            summary?.amcActive
              ? "Active"
              : "Expired"
          }
        />

        <Divider />

        <InfoRow
          title="Pending"
          value={`₹${summary?.pendingAmount ?? 0}`}
        />

        <Divider />

        <InfoRow
          title="Last Service"
          value={formatDate(summary?.lastService)}
        />

        <Divider />

        <InfoRow
          title="Next Service"
          value={formatDate(summary?.nextService)}
          
        />

      </CardContent>

    </>
  );
}