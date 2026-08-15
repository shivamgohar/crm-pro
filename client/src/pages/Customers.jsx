import { useEffect, useState } from "react";

import api from "../api/api";

import { useSnackbar } from "notistack";
import LoadingSpinner from "../components/LoadingSpinner";
import useDebounce from "../hooks/useDebounce";
import Pagination from "@mui/material/Pagination";
import { useNavigate } from "react-router-dom";
import CustomerDialog from "../components/customer/CustomerDialog";
import CustomerCard from "../components/customer/CustomerCard";
import CustomerToolbar from "../components/customer/CustomerToolbar";
import AddIcon from "@mui/icons-material/Add";
// import { getListCustomerFields } from "../services/customerFieldService";
import { getCustomFields } from "../services/customFieldService";

import { Box,Typography, Paper } from "@mui/material";
import {
  AppButton,
  AppPage,
  AppHeader,

} from "../components/ui";

function Customers() {
  const [customers, setCustomers] = useState([]);

  const [open, setOpen] = useState(false);


 
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 300);
  const [loading, setLoading] = useState(false);


  const [searchBy, setSearchBy] = useState("all");

const [status, setStatus] = useState("all");

const [area, setArea] = useState("all");

const [sort, setSort] = useState("name");

  const [page, setPage] = useState(1);
  const navigate = useNavigate();

  const [pagination, setPagination] = useState({
    currentPage: 1,
    pageSize: 10,
    totalPages: 1,
    totalRecords: 0,
  });

  const { enqueueSnackbar } = useSnackbar();

  const [listFields, setListFields] = useState([]);

  const fetchCustomers = async () => {
    setLoading(true);

    try {
     const response = await api.get(
  `/customers?search=${debouncedSearch}&searchBy=${searchBy}&status=${status}&area=${area}&sort=${sort}&page=${page}&limit=10`
);
      setCustomers(response.data.customers);
      setPagination(response.data.pagination);
    } catch (error) {
      console.error(error);
      enqueueSnackbar("Failed to load customers", {
        variant: "error",
      });
    } finally {
      setLoading(false);
    }
  };


// const loadListFields = async () => {
//   try {
//     const data = await getListCustomerFields();
//     setListFields(data);
//   } catch (error) {
//     console.error(error);
//   }
// };

const loadListFields = async () => {
  try {
    const data = await getCustomFields("customer");

    setListFields(
      (data || []).filter(
        (field) => field.show_in?.list === true
      )
    );

  } catch (error) {
    console.error("Load customer list fields error:", error);
  }
};


useEffect(() => {
  fetchCustomers();
  loadListFields();
}, [
  debouncedSearch,
  page,
  searchBy,
  status,
  area,
  sort,
]);
  return (
   <AppPage>
      <LoadingSpinner open={loading} />
     


       <AppHeader
  title="Customers"
  subtitle={`${pagination.totalRecords || 0} Customers`}
  actions={
    <AppButton
      startIcon={<AddIcon />}
      onClick={() => setOpen(true)}
    >
      Add Customer
    </AppButton>
  }
/>

     

<CustomerToolbar
  search={search}
  onSearch={(e) => {
    setSearch(e.target.value);
    setPage(1);
  }}
  searchBy={searchBy}
  setSearchBy={setSearchBy}
  status={status}
  setStatus={setStatus}
  area={area}
  setArea={setArea}
  sort={sort}
  setSort={setSort}
/>



      {customers.length === 0 ? (
  <Paper
    elevation={0}
    sx={{
      py: 8,
      textAlign: "center",
      border: "1px dashed",
      borderColor: "divider",
      borderRadius: 3,
      bgcolor: "#fafafa",
    }}
  >
    <Typography variant="h6" fontWeight={600}>
      No Customers Found
    </Typography>

    <Typography
      variant="body2"
      color="text.secondary"
      sx={{ mt: 1 }}
    >
      Try changing your search or filters.
    </Typography>
  </Paper>
) : (
  customers.map((customer) => (
    <CustomerCard
      key={customer.id}
      customer={customer}
      fields={listFields}
      onClick={() => navigate(`/customers/${customer.id}`)}
    />
  ))
)}

        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            mt: 3,
          }}
        >
          <Pagination
            page={page}
            count={pagination.totalPages}
            color="primary"
            onChange={(event, value) => setPage(value)}
          />
        </Box>

        <CustomerDialog
          open={open}
          onClose={() => setOpen(false)}
          onSuccess={fetchCustomers}
        />

      
   </AppPage>
  );
}

export default Customers;
