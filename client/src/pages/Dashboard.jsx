import { useEffect, useState } from "react";
import axios from "axios";
import DashboardCard from "../components/DashboardCard";
import PeopleIcon from "@mui/icons-material/People";
import Inventory2Icon from "@mui/icons-material/Inventory2";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import PaidIcon from "@mui/icons-material/Paid";
import { Avatar } from "@mui/material";

import {
  Box,
  Typography,
  Grid,
  Paper,
  List,
  ListItem,
  ListItemText,
  Divider,
} from "@mui/material";

function Dashboard() {
  const [stats, setStats] = useState({
    customers: 0,
    products: 0,
    orders: 0,
    revenue: 0, 
  });
  const [recentOrders, setRecentOrders] = useState([]);
  const [lowStockProducts, setLowStockProducts] = useState([]);
  const [topSellingProducts, setTopSellingProducts] = useState([]);

  const fetchDashboard = async () => {
    try {
      const response = await axios.get("http://localhost:5000/dashboard");

      setStats(response.data);
      setRecentOrders(response.data.recentOrders);
      setLowStockProducts(response.data.lowStockProducts);
      setTopSellingProducts(response.data.topSellingProducts);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  

  return (


    <Box sx={{ p: 4 }}>
      <Typography variant="h4" fontWeight="bold" mb={4}>
       Dashboard
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
            value={`₹ ${Number(stats.revenue).toLocaleString("en-IN")}`}
            icon={<PaidIcon color="secondary" sx={{ fontSize: 30 }} />}
          />
        </Grid>
      </Grid>

      

<Grid container spacing={3}>

<Grid size={{xs:12, md:8}}>

<Box sx={{ mt: 5 }}>
        <Paper sx={{ p: 3 }}>
          <Typography variant="h5" fontWeight="bold" mb={2}>
            Recent Orders
          </Typography>

          <List>
            {recentOrders.length === 0 ? (
              <Typography>No Recent Orders</Typography>
            ) : (
              recentOrders.map((order, index) => (
                <Box key={index}>
                  <ListItem>
                    
  <Avatar sx={{ mr: 2 }}>
    {order.customer_name.charAt(0).toUpperCase()}
  </Avatar>
                    <ListItemText
                      primary={`${order.customer_name} • ${order.product_name}`}
                      secondary={`Qty : ${order.quantity} | ₹ ${Number(order.total).toLocaleString("en-IN")}`}
                    />
                  </ListItem>

                  {index !== recentOrders.length - 1 && <Divider />}
                </Box>
              ))
            )}
          </List>
        </Paper>
      </Box>

</Grid>

<Grid size={{xs:12, md:4}}>


      <Box sx={{ mt: 4 }}>
        <Paper sx={{ p: 3 }}>
          <Typography variant="h5" fontWeight="bold" mb={2}>
            ⚠ Low Stock Products
          </Typography>

          <List>
            {lowStockProducts.length === 0 ? (
              <Typography>No Low Stock Products</Typography>
            ) : (
              lowStockProducts.map((product, index) => (
                <Box key={product.id}>
                  <ListItem>
                    <ListItemText
                      primary={product.name}
                      secondary={`Stock : ${product.stock}`}
                    />
                  </ListItem>

                  {index !== lowStockProducts.length - 1 && <Divider />}
                </Box>
              ))
            )}
          </List>
        </Paper>
        <Paper sx={{ p: 3, mt: 3 }}>

  <Typography
    variant="h5"
    fontWeight="bold"
    mb={2}
  >
    🏆 Top Selling Products
  </Typography>

  <List>

    {

      topSellingProducts.length === 0 ?

      (

        <Typography>

          No Sales Yet

        </Typography>

      )

      :

      (

        topSellingProducts.map((product, index) => (

          <Box key={product.id}>

            <ListItem>

              <ListItemText

                primary={product.name}

                secondary={`${product.total_sold} Sold`}

              />

            </ListItem>

            {

              index !== topSellingProducts.length - 1 &&

              <Divider />

            }

          </Box>

        ))

      )

    }

  </List>

</Paper>

      </Box>


</Grid>

</Grid>

    </Box>
  );
}

export default Dashboard;
