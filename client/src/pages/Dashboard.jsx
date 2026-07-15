import { useEffect, useState } from "react";
import axios from "axios";
import DashboardCard from "../components/DashboardCard";

import { Box, Typography, Grid, Card, CardContent } from "@mui/material";

function Dashboard() {
  const [stats, setStats] = useState({
  customers: 0,
  products: 0,
  orders: 0,
  revenue: 0,
  });

  const fetchDashboard = async () => {
    try {
      const response = await axios.get("http://localhost:5000/dashboard");
       

      setStats(response.data);
    } catch (error) {
      console.error(error);
    }
  };  

  useEffect(() => {
    fetchDashboard();
  }, []);

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h3" fontWeight="bold" mb={4}>
        CRM Dashboard
      </Typography>
<Grid container spacing={3}>

  <Grid size={{ xs: 12, sm: 6, md: 3 }}>
    <DashboardCard
      title="Customers"
      value={stats.customers}
      icon="👥"
    />
  </Grid>

  <Grid size={{ xs: 12, sm: 6, md: 3 }}>
    <DashboardCard
      title="Products"
      value={stats.products}
      icon="📦"
    />
  </Grid>

  <Grid size={{ xs: 12, sm: 6, md: 3 }}>
    <DashboardCard
      title="Orders"
      value={stats.orders}
      icon="🛒"
    />
  </Grid>

  <Grid size={{ xs: 12, sm: 6, md: 3 }}>
    <DashboardCard
      title="Revenue"
      value={`₹ ${stats.revenue}`}
      icon="💰"
    />
  </Grid>

</Grid>
    </Box>
  );
}

export default Dashboard;
