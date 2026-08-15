import { useEffect, useState } from "react";

import api from "../../api/api";

import CustomerStats from "./components/CustomerStats";
import ProductStats from "./components/ProductStats";
import OrderStats from "./components/OrderStats";
import RevenueStats from "./components/RevenueStats";
import RecentOrders from "./components/RecentOrders";
import LowStockProducts from "./components/LowStockProducts";
import TopSellingProducts from "./components/TopSellingProducts";
import { useNavigate } from "react-router-dom";
import NotificationCenter from "../../components/notifications/NotificationCenter";


import {
  Box,
  Typography,
  Grid,
} from "@mui/material";

function Dashboard() {
    const navigate = useNavigate();
  const [stats, setStats] = useState({
    customers: 0,
    products: 0,
    orders: 0,
    revenue: 0,
  });

  const [recentOrders, setRecentOrders] = useState([]);
  const [lowStockProducts, setLowStockProducts] = useState([]);
  const [topSellingProducts, setTopSellingProducts] = useState([]);

  // ==========================================
  // DASHBOARD WIDGET SETTINGS
  // ==========================================

  const [widgetSettings, setWidgetSettings] = useState({});

  // ==========================================
  // FETCH DASHBOARD DATA
  // ==========================================

  const fetchDashboard = async () => {
    try {
      const response = await api.get("/dashboard");

      setStats(response.data);

      setRecentOrders(
        response.data.recentOrders || []
      );

      setLowStockProducts(
        response.data.lowStockProducts || []
      );

      setTopSellingProducts(
        response.data.topSellingProducts || []
      );
    } catch (error) {
      console.error(
        "Dashboard fetch error:",
        error
      );
    }
  };

  // ==========================================
  // FETCH WIDGET SETTINGS
  // ==========================================

  const fetchWidgetSettings = async () => {
    try {
      const response = await api.get(
        "/dashboard/widgets"
      );

      const settings = {};

      (
        response.data.settings || []
      ).forEach((item) => {
        settings[item.widget_id] =
          item.enabled;
      });

      setWidgetSettings(settings);

    } catch (error) {
      console.error(
        "Dashboard widget settings load error:",
        error
      );
    }
  };

  // ==========================================
  // LOAD DASHBOARD
  // ==========================================

  useEffect(() => {
    fetchDashboard();
    fetchWidgetSettings();
  }, []);

  // ==========================================
  // WIDGET CONTROL
  // ==========================================

  const isWidgetEnabled = (widgetId) => {
    return widgetSettings[widgetId] ?? true;
  };

  const hasEnabledWidgets = Object.values(
  widgetSettings
).some((value) => value === true);



  // ==========================================
  // RENDER
  // ==========================================

  return (
    <Box sx={{ p: 4 }}>

      {/* ======================================
          HEADER
      ====================================== */}

{/* ======================================
    DASHBOARD HEADER
====================================== */}

<Box
  sx={{
    mb: 4,
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 3,
    flexWrap: "wrap",
  }}
>
  <Box>
    <Typography
      variant="h3"
      fontWeight={700}
      gutterBottom
    >
      Dashboard
    </Typography>

    <Typography color="text.secondary">
      Welcome back! Here's an overview of your business.
    </Typography>
  </Box>

  <Box
    sx={{
      px: 2,
      py: 1,
      borderRadius: 2,
      backgroundColor: "background.paper",
      border: "1px solid",
      borderColor: "divider",
    }}
  >
    <Typography
      variant="body2"
      color="text.secondary"
    >
      Dashboard Status
    </Typography>

    <Typography
      variant="body2"
      fontWeight={600}
    >
      Live
    </Typography>
  </Box>
</Box>

{/* ======================================
    QUICK ACTIONS
====================================== */}

<Box
  sx={{
    mb: 4,
    p: 3,
    borderRadius: 3,
    backgroundColor: "background.paper",
    border: "1px solid",
    borderColor: "divider",
  }}
>
  <Typography
    variant="h6"
    fontWeight={700}
    mb={2}
    
  >
    Quick Actions
  </Typography>

  <Grid container spacing={2}>

    <Grid size={{ xs: 12, sm: 6, md: 3 }}>
      <Box
      onClick={() => navigate("/customers")}
        sx={{
          p: 2,
          borderRadius: 2,
          border: "1px solid",
          borderColor: "divider",
          cursor: "pointer",
          transition: "0.2s",
          "&:hover": {
            boxShadow: 2,
            transform: "translateY(-2px)",

          },
        }}
      >
        <Typography fontWeight={600}>
          Add Customer
        </Typography>

        <Typography
          variant="body2"
          color="text.secondary"
        >
          Create a new customer
        </Typography>
      </Box>
    </Grid>

    <Grid size={{ xs: 12, sm: 6, md: 3 }}>
      <Box
      onClick={() => navigate("/products")}
        sx={{
          p: 2,
          borderRadius: 2,
          border: "1px solid",
          borderColor: "divider",
          cursor: "pointer",
          transition: "0.2s",
          "&:hover": {
            boxShadow: 2,
            transform: "translateY(-2px)",
          },
        }}
      >
        <Typography fontWeight={600}>
          Add Product
        </Typography>

        <Typography
          variant="body2"
          color="text.secondary"
        >
          Add a new product
        </Typography>
      </Box>
    </Grid>

    <Grid size={{ xs: 12, sm: 6, md: 3 }}>
      <Box
      onClick={() => navigate("/orders")}
        sx={{
          p: 2,
          borderRadius: 2,
          border: "1px solid",
          borderColor: "divider",
          cursor: "pointer",
          transition: "0.2s",
          "&:hover": {
            boxShadow: 2,
            transform: "translateY(-2px)",
          },
        }}
      >
        <Typography fontWeight={600}>
          Create Order
        </Typography>

        <Typography
          variant="body2"
          color="text.secondary"
        >
          Create a new order
        </Typography>
      </Box>
    </Grid>

    <Grid size={{ xs: 12, sm: 6, md: 3 }}>
      <Box
      onClick={() => navigate("/reports")}
        sx={{
          p: 2,
          borderRadius: 2,
          border: "1px solid",
          borderColor: "divider",
          cursor: "pointer",
          transition: "0.2s",
          "&:hover": {
            boxShadow: 2,
            transform: "translateY(-2px)",
          },
        }}
      >
        <Typography fontWeight={600}>
          Reports
        </Typography>

        <Typography
          variant="body2"
          color="text.secondary"
        >
          View business reports
        </Typography>
      </Box>
    </Grid>

  </Grid>
</Box>

<Box sx={{ mb: 4 }}>
  <NotificationCenter
    mode="dashboard"
    limit={5}
  />
</Box>
      {/* ======================================
          STAT WIDGETS
      ====================================== */}

      <Grid
        container
        spacing={3}
      >

        {isWidgetEnabled("customers") && (
          <Grid
            onClick={() => navigate("/customers")}
            size={{
              xs: 12,
              sm: 6,
              md: 3,
            }}
          >
            <CustomerStats
              value={stats.customers}
            />
          </Grid>
        )}


        {isWidgetEnabled("products") && (
          <Grid
            onClick={() => navigate("/products")}
            size={{
              xs: 12,
              sm: 6,
              md: 3,
            }}
          >
            <ProductStats
              value={stats.products}
            />
          </Grid>
        )}


        {isWidgetEnabled("orders") && (
          <Grid
          onClick={() => navigate("/orders")}
            size={{
              xs: 12,
              sm: 6,
              md: 3,
            }}
          >
            <OrderStats
              value={stats.orders}
            />
          </Grid>
        )}


        {isWidgetEnabled("revenue") && (
          <Grid
          onClick={() => navigate("/revenue")}
            size={{
              xs: 12,
              sm: 6,
              md: 3,
            }}
          >
            <RevenueStats
              value={stats.revenue}
            />
          </Grid>
        )}

      </Grid>


      {/* ======================================
          LIST WIDGETS
      ====================================== */}

      <Grid
        container
        spacing={3}
        sx={{ mt: 1 }}
      >

        {/* ====================================
            RECENT ORDERS
        ==================================== */}

        {isWidgetEnabled("recentOrders") && (
          <Grid
            size={{
              xs: 12,
              md: 8,
            }}
          >
            <Box sx={{ mt: 4 }}>
              <RecentOrders
                orders={recentOrders}
              />
            </Box>
          </Grid>
        )}


        {/* ====================================
            RIGHT SIDE WIDGETS
        ==================================== */}

        <Grid
          size={{
            xs: 12,
            md: 4,
          }}
        >

          {isWidgetEnabled(
            "lowStockProducts"
          ) && (
            <Box sx={{ mt: 4 }}>
              <LowStockProducts
                products={lowStockProducts}
              />
            </Box>
          )}


          {isWidgetEnabled(
            "topSellingProducts"
          ) && (
            <Box sx={{ mt: 3 }}>
              <TopSellingProducts
                products={topSellingProducts}
              />
            </Box>
          )}

        </Grid>

      </Grid>
      {Object.keys(widgetSettings).length > 0 &&
  !hasEnabledWidgets && (
    <Box
      sx={{
        mt: 4,
        p: 6,
        textAlign: "center",
        borderRadius: 3,
        border: "1px dashed",
        borderColor: "divider",
        backgroundColor: "background.paper",
      }}
    >
      <Typography
        variant="h5"
        fontWeight={700}
        gutterBottom
      >
        Your Dashboard is Empty
      </Typography>

      <Typography
        color="text.secondary"
        sx={{
          maxWidth: 520,
          mx: "auto",
        }}
      >
        No dashboard widgets are currently enabled.
        You can enable widgets from Dashboard Control
        in Settings.
      </Typography>
    </Box>
  )}

    </Box>
  );
}

export default Dashboard;