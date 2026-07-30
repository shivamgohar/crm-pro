import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../api/api";
import CustomerSummaryCard from "../components/customer/CustomerSummaryCard";
import CustomerStatusCard from "../components/customer/CustomerStatusCard";
import QuickActionBar from "../components/customer/QuickActionBar";
import AddServiceDialog from "../components/customer/AddServiceDialog";
import ServiceHistory from "../components/customer/ServiceHistory";

import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useNavigate } from "react-router-dom";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
// import VisibilityIcon from "@mui/icons-material/Visibility";
// import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
// import AddIcon from "@mui/icons-material/Add";


import {
  Box,
  Typography,
  Button,
  Grid,
  Stack,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from "@mui/material";

function CustomerProfile() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [customer, setCustomer] = useState(null);

  const [services, setServices] = useState([]);
  const [openServiceDialog, setOpenServiceDialog] = useState(false);

  const fetchCustomer = async () => {
    try {
      const response = await api.get(`/customers/code/${id}`);

      setCustomer(response.data.customer);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchServices = async () => {

    
    try {
      // const response = await api.get(`/services/customer/${id}`);
      const response = await api.get(`/services/customer-code/${id}`);

      setServices(response.data);
      console.log("API Response:", response.data);
      console.log("Fetched:", response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleOpenServiceDialog = () => {
    setOpenServiceDialog(true);
  };

  const handleCloseServiceDialog = () => {
    setOpenServiceDialog(false);
  };

  useEffect(() => {
    fetchCustomer();
    fetchServices();
  }, [id]);

  if (!customer) {
    return <h2>Loading...</h2>;
  }
  return (
    <Box sx={{ p: 3, bgcolor: "#f5f7fb", minHeight: "100vh" }}>
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        sx={{ mb: 3 }}
      >
        <Button
          startIcon={<ArrowBackIcon />}
          variant="outlined"
          onClick={() => navigate("/customers")}
        >
          Back
        </Button>
      </Stack>

      <QuickActionBar onAddService={handleOpenServiceDialog} />

      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <CustomerSummaryCard customer={customer} />
        </Grid>

        <Grid item xs={12} md={4}>
          <CustomerStatusCard />
        </Grid>
      </Grid>

      <Box sx={{ mt: 4 }}>
        <ServiceHistory services={services} />
        <Accordion>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography variant="h6">Payment History</Typography>
          </AccordionSummary>

          <AccordionDetails>
            <Typography color="text.secondary">
              No payment records available.
            </Typography>
          </AccordionDetails>
        </Accordion>

        <Accordion>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography variant="h6">Contact History</Typography>
          </AccordionSummary>

          <AccordionDetails>
            <Typography color="text.secondary">
              Contact history will appear here.
            </Typography>
          </AccordionDetails>
        </Accordion>

        <Accordion>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography variant="h6">Address History</Typography>
          </AccordionSummary>

          <AccordionDetails>
            <Typography color="text.secondary">
              Address history will appear here.
            </Typography>
          </AccordionDetails>
        </Accordion>

        <Accordion>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography variant="h6">Notes & Documents</Typography>
          </AccordionSummary>

          <AccordionDetails>
            <Typography color="text.secondary">
              Notes and documents will appear here.
            </Typography>
          </AccordionDetails>
        </Accordion>
      </Box>

      <AddServiceDialog
        open={openServiceDialog}
        handleClose={handleCloseServiceDialog}
        customer={customer}
        onServiceAdded={fetchServices}
      />
    </Box>
  );
}

export default CustomerProfile;
