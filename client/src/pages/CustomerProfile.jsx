import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../api/api";
import CustomerSummaryCard from "../components/customer/CustomerSummaryCard";
import CustomerStatusCard from "../components/customer/CustomerStatusCard";
import QuickActionBar from "../components/customer/QuickActionBar";
import AddServiceDialog from "../components/customer/AddServiceDialog";

import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useNavigate } from "react-router-dom";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
// import VisibilityIcon from "@mui/icons-material/Visibility";
// import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import AddIcon from "@mui/icons-material/Add";

import {
  Box,
  // Card,
  // CardContent,
  Typography,
  Button,
  // Divider,
  Grid,
  // Chip,
  Stack,
  Paper,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  // IconButton,
} from "@mui/material";

function CustomerProfile() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [customer, setCustomer] = useState(null);
  const [openServiceDialog, setOpenServiceDialog] = useState(false);

  const fetchCustomer = async () => {
    try {
      const response = await api.get(`/customers/${id}`);

      setCustomer(response.data.customer);
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

   <QuickActionBar
onAddService={handleOpenServiceDialog}
/>

<Grid container spacing={3}>

<Grid item xs={12} md={8}>

<CustomerSummaryCard
customer={customer}
/>

</Grid>

<Grid item xs={12} md={4}>

<CustomerStatusCard />

</Grid>

</Grid>
      

      <Box sx={{ mt: 4 }}>
        <Accordion defaultExpanded>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography variant="h6">Service History</Typography>
          </AccordionSummary>

          <AccordionDetails>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                mb: 2,
              }}
            >
              <Typography variant="h6">Service Records</Typography>

              <Button variant="contained" startIcon={<AddIcon  />}>
                Add First Service
              </Button>
            </Box>

            <TableContainer component={Paper} elevation={0}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>
                      <strong>Date</strong>
                    </TableCell>

                    <TableCell>
                      <strong>Service</strong>
                    </TableCell>

                    <TableCell>
                      <strong>Engineer</strong>
                    </TableCell>

                    <TableCell align="right">
                      <strong>Amount</strong>
                    </TableCell>

                    <TableCell align="right">
                      <strong>Pending</strong>
                    </TableCell>

                    <TableCell>
                      <strong>Status</strong>
                    </TableCell>

                    <TableCell align="center">
                      <strong>Action</strong>
                    </TableCell>
                  </TableRow>
                </TableHead>

                <TableBody>
                  <TableRow>
                    <TableCell colSpan={7} align="center" sx={{ py: 6 }}>
                      <Typography variant="h6" color="text.secondary">
                        No service records found
                      </Typography>

                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ mb: 2 }}
                      >
                        Add the customer's first service record.
                      </Typography>

                      <Button
                        variant="contained"
                        startIcon={<AddIcon  />}
                      >
                        Add Service
                      </Button>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
          </AccordionDetails>
        </Accordion>

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
/>
    </Box>
  );
}

export default CustomerProfile;
