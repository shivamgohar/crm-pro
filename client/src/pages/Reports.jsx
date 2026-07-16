import { useEffect, useState } from "react";
import axios from "axios";

import { Box, Typography, Grid, Button } from "@mui/material";

import DashboardCard from "../components/DashboardCard";

import PaidIcon from "@mui/icons-material/Paid";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import PeopleIcon from "@mui/icons-material/People";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import DownloadIcon from "@mui/icons-material/Download";
import PrintIcon from "@mui/icons-material/Print";

function Reports() {
  const [report, setReport] = useState({
    todayRevenue: 0,

    todayOrders: 0,

    monthRevenue: 0,

    customers: 0,
  });

  const fetchReports = async () => {
    try {
      const response = await axios.get("http://localhost:5000/reports");

      setReport(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const downloadPDF = () => {
    window.open("http://localhost:5000/reports/pdf", "_blank");
  };

  const downloadExcel = () => {
    window.open("http://localhost:5000/reports/excel", "_blank");
  };

  const printReport = () => {
    window.print();
  };

  useEffect(() => {
    fetchReports();
  }, []);

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" fontWeight="bold" mb={4}>
        Reports
      </Typography>

      <Grid container spacing={3}>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <DashboardCard
            title="Today's Revenue"
            value={`₹ ${Number(report.todayRevenue).toLocaleString("en-IN")}`}
            icon={<PaidIcon color="success" />}
          />
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <DashboardCard
            title="Today's Orders"
            value={report.todayOrders}
            icon={<ShoppingCartIcon color="primary" />}
          />
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <DashboardCard
            title="Monthly Revenue"
            value={`₹ ${Number(report.monthRevenue).toLocaleString("en-IN")}`}
            icon={<CalendarMonthIcon color="warning" />}
          />
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <DashboardCard
            title="Customers"
            value={report.customers}
            icon={<PeopleIcon color="secondary" />}
          />
        </Grid>
        <Box
          sx={{
            display: "flex",
            justifyContent: "flex-end",
            gap: 2,
            mt: 4,
            mb: 4,
          }}
        >
          <Button
            variant="contained"
            startIcon={<DownloadIcon />}
            onClick={downloadPDF}
            sx={{ mb: 3 }}
          >
            Download PDF
          </Button>
          <Button
            variant="outlined"
            startIcon={<DownloadIcon />}
            onClick={downloadExcel}
            sx={{ mb: 3 }}
          >
            Download Excel
          </Button>
          <Button
  variant="outlined"
  color="secondary"
  startIcon={<PrintIcon />}
  onClick={printReport}
  sx={{ mb: 3 }}
>
  Print Report
</Button>
        </Box>
      </Grid>
    </Box>
  );
}

export default Reports;
