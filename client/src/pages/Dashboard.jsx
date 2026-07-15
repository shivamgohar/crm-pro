import { useEffect, useState } from "react";
import axios from "axios";
import DashboardCard from "../components/DashboardCard";
import PeopleIcon from "@mui/icons-material/People";
import Inventory2Icon from "@mui/icons-material/Inventory2";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import PaidIcon from "@mui/icons-material/Paid";

import { Box, Typography, Grid,  } from "@mui/material";

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
       icon={<PeopleIcon color="primary" sx={{ fontSize: 30 }} />}
    />
  </Grid>

  <Grid size={{ xs: 12, sm: 6, md: 3 }}>
    <DashboardCard
      title="Products"
      value={stats.products}
      icon={<Inventory2Icon color="warning" sx={{ fontSize: 30 }} />}
    />
  </Grid>

  <Grid size={{ xs: 12, sm: 6, md: 3 }}>
    <DashboardCard
      title="Orders"
      value={stats.orders}
      icon={<ShoppingCartIcon color="success" sx={{ fontSize: 30 }} />}
    />
  </Grid>

  <Grid size={{ xs: 12, sm: 6, md: 3 }}>
    <DashboardCard
      title="Revenue"
      value={`₹ ${stats.revenue}`}
      icon={<PaidIcon color="secondary" sx={{ fontSize: 30 }} />}
    />
  </Grid>

</Grid>
    </Box>
  );
}

export default Dashboard;
