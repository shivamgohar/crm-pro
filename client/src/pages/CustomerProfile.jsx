import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../api/api";
import CustomerSummaryCard from "../components/customer/CustomerSummaryCard";
import CustomerStatusCard from "../components/customer/CustomerStatusCard";
import QuickActionBar from "../components/customer/QuickActionBar";
import AddServiceDialog from "../components/customer/AddServiceDialog";
import ServiceHistory from "../components/customer/ServiceHistory";
import CustomerDialog from "../components/customer/CustomerDialog";

import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useNavigate } from "react-router-dom";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
// import { AppPage } from "../components/ui";

import {
  getProfileCustomerFields,
} from "../services/customerFieldService";

import {
  getCustomFields,
} from "../services/customFieldService";


import {
  Box,
  Typography,
  Button,
  Grid,
 
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
  const [openCustomerDialog, setOpenCustomerDialog] = useState(false);
  const [profileFields, setProfileFields] = useState([]);
  const [summary, setSummary] = useState(null);
  const [selectedService, setSelectedService] = useState(null);
  const [serviceFields, setServiceFields] = useState([]);
 

  const fetchCustomer = async () => {
    try {
      // const response = await api.get(`/customers/code/${id}`);
        const response = await api.get(`/customers/${id}`);

      setCustomer(response.data.customer);
    } catch (error) {
      console.error(error);
    }
  };


const fetchServices = async () => {
  try {
    const response = await api.get(
      `/services/customer-code/${customer.customer_code}`
    );

    setServices(response.data);

  } catch (error) {
    console.error(error);
  }
};

const fetchCustomerSummary = async () => {
  try {

    const response = await api.get(
      `/services/customer-summary/${customer.customer_code}`
    );

    setSummary(response.data);

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

  const handleEditCustomer = () => {
  setOpenCustomerDialog(true);
};


const handleEditService = (service) => {
  setSelectedService(service);
  setOpenServiceDialog(true);
};




// const loadFields = async () => {
//   try {
//     const data = await getProfileCustomerFields();

//     setProfileFields(
//       data.filter((field) => field.field_group === "customer")
//     );

//     setServiceFields(
//       data.filter((field) => field.field_group === "service")
//     );

//   } catch (error) {
//     console.error(error);
//   }
// };

const loadFields = async () => {
  try {
    // NEW system — Customer fields
    const customerFields = await getCustomFields("customer");

    setProfileFields(customerFields || []);

    // OLD system — Service fields
    const oldFields = await getProfileCustomerFields();

    setServiceFields(
      oldFields.filter(
        (field) => field.field_group === "service"
      )
    );

  } catch (error) {
    console.error("Load profile fields error:", error);
  }
};



useEffect(() => {
  fetchCustomer();
  // loadProfileFields();
  loadFields();
}, [id]);


useEffect(() => {
  if (customer?.customer_code) {
    fetchServices();
    fetchCustomerSummary();
  }
}, [customer]);

    
  if (!customer) {
    return <h2>Loading...</h2>;
  }
  return (
 <>


<Box
  sx={{
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    mb: 3,
    flexWrap: "wrap",
    gap: 2,
  }}
>

  <Box>

    <Button
      startIcon={<ArrowBackIcon />}
      variant="text"
      sx={{ mb: 1 }}
      onClick={() => navigate("/customers")}
    >
      Customers
    </Button>

    <Typography
      variant="h4"
      fontWeight={700}
    >
      {customer.name}
    </Typography>

    <Typography
      color="text.secondary"
      variant="body2"
    >
      Customer ID : {customer.customer_code}
    </Typography>

  </Box>

  <QuickActionBar
    onAddService={handleOpenServiceDialog}
    onEditCustomer={handleEditCustomer}
  />

</Box>

     <Grid
  container
  spacing={2}
  alignItems="stretch"
>
<Grid size={{ xs: 12, lg: 8 }}>
          
          <CustomerSummaryCard
    customer={customer}
    fields={profileFields}
/>
        </Grid>

     <Grid size={{ xs: 12, lg: 4 }}>
         <CustomerStatusCard
  summary={summary}
/>
        </Grid>
      </Grid>

      <Box sx={{ mt: 4 }}>
       <ServiceHistory
  services={services}
  onEditService={handleEditService}
  serviceFields={serviceFields}

/>
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
  service={selectedService}
  onServiceAdded={() => {
    fetchServices();
    fetchCustomerSummary();
    setSelectedService(null);
  }}
/>

      <CustomerDialog
  open={openCustomerDialog}
  onClose={() => setOpenCustomerDialog(false)}
  customer={customer}
  onSuccess={() => {
    fetchCustomer();
    setOpenCustomerDialog(false);
  }}
/>
   </>
  );
}

export default CustomerProfile;
