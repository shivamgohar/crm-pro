import { useEffect, useState } from "react";
import axios from "axios";
import api from "../api/api";
import CustomSnackbar from "../components/CustomSnackbar";
import { useSnackbar } from "notistack";
import LoadingSpinner from "../components/LoadingSpinner";
import SearchBar from "../components/SearchBar";
import useDebounce from "../hooks/useDebounce";
import Pagination from "@mui/material/Pagination";
import { useNavigate } from "react-router-dom";

import {
  Box,
  Typography,
  Button,
  // Table,
  // TableHead,
  // TableBody,
  // TableRow,
  // TableCell,
  // TableContainer,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";

import TextField from "@mui/material/TextField";
// import InputAdornment from "@mui/material/InputAdornment";

// import SearchIcon from "@mui/icons-material/Search";
import AddIcon from "@mui/icons-material/Add";
import UploadFileIcon from "@mui/icons-material/UploadFile";

function Customers() {
  const [customers, setCustomers] = useState([]);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [open, setOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 300);
  const [loading, setLoading] = useState(false);
  const [importLoading, setImportLoading] = useState(false);
  const [page, setPage] = useState(1);
  const navigate = useNavigate();

  const [pagination, setPagination] = useState({
    currentPage: 1,
    pageSize: 10,
    totalPages: 1,
    totalRecords: 0,
  });

  const { enqueueSnackbar } = useSnackbar();

  const fetchCustomers = async () => {
    setLoading(true);

    try {
      // loading Testing
      // await new Promise((resolve) => setTimeout(resolve, 2000));

      // const response = await axios.get(
      //   `http://localhost:5000/customers?search=${search}`,
      // );
      const response = await api.get(
        `/customers?search=${debouncedSearch}&page=${page}&limit=10`,
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

  const addCustomer = async () => {
    if (!validateCustomer()) return;
    try {
      await axios.post("http://localhost:5000/customers", {
        name,
        phone,
        email,
        address,
      });

      setName("");
      setPhone("");
      setEmail("");
      setAddress("");

      fetchCustomers();

      setSnackbarMessage("Customer Added Successfully");

      setSnackbarSeverity("success");

      setSnackbarOpen(true);
    } catch (error) {
      console.error(error);
      setSnackbarMessage("Error Adding Customer");

      setSnackbarSeverity("error");

      setSnackbarOpen(true);
    }
  };

  const updateCustomer = async () => {
    if (!validateCustomer()) return;
    try {
      await axios.put(`http://localhost:5000/customers/${editingId}`, {
        name,
        phone,
        email,
        address,
      });

      setEditingId(null);

      setName("");
      setPhone("");
      setEmail("");
      setAddress("");

      fetchCustomers();
      setOpen(false);
      enqueueSnackbar("Customer Added Successfully", {
        variant: "success",
      });
    } catch (error) {
      console.error(error);

      setSnackbarMessage("Error Update Customer");

      setSnackbarSeverity("error");

      setSnackbarOpen(true);
    }
  };

  const cancelEdit = () => {
    setEditingId(null);

    setName("");
    setPhone("");
    setEmail("");
    setAddress("");
  };

  const deleteCustomer = async () => {
    try {
      await axios.delete(`http://localhost:5000/customers/${deleteId}`);

      fetchCustomers();
      setSnackbarMessage("Delete Customer Successfully");

      setSnackbarSeverity("success");

      setSnackbarOpen(true);
      setDeleteOpen(false);

      setDeleteId(null);
    } catch (error) {
      console.error(error);
      setSnackbarMessage("Error Delete Customer");

      setSnackbarSeverity("error");

      setSnackbarOpen(true);
    }
  };

  const importCustomers = async (event) => {
    const file = event.target.files[0];

    if (!file) return;

    const formData = new FormData();

    formData.append("file", file);

    try {
      setImportLoading(true);

      const response = await api.post("/customers/import", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      enqueueSnackbar(response.data.message, {
        variant: "success",
      });

      fetchCustomers();
    } catch (error) {
      console.error(error);

      enqueueSnackbar("Excel Import Failed", {
        variant: "error",
      });
    } finally {
      setImportLoading(false);

      event.target.value = "";
    }
  };

  const validateCustomer = () => {
    if (name.trim().length < 3) {
      setSnackbarMessage("Name must contain at least 3 characters");
      setSnackbarSeverity("warning");
      setSnackbarOpen(true);

      return false;
    }

    if (!/^\d{10}$/.test(phone)) {
      setSnackbarMessage("Phone must be exactly 10 digits");
      setSnackbarSeverity("warning");
      setSnackbarOpen(true);

      return false;
    }

    if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(email)) {
      setSnackbarMessage("Enter a valid email address");
      setSnackbarSeverity("warning");
      setSnackbarOpen(true);

      return false;
    }

    if (address.trim().length < 5) {
      setSnackbarMessage("Address is too short");
      setSnackbarSeverity("warning");
      setSnackbarOpen(true);

      return false;
    }

    return true;
  };

  // const filteredCustomers = customers.filter((customer) => {
  //   const keyword = search.toLowerCase();

  //   return (
  //     customer.name.toLowerCase().includes(keyword) ||
  //     customer.phone.toLowerCase().includes(keyword) ||
  //     customer.email.toLowerCase().includes(keyword) ||
  //     customer.address.toLowerCase().includes(keyword)
  //   );
  // });

  useEffect(() => {
    fetchCustomers();
  }, [debouncedSearch, page]);

  return (
    <>
      <LoadingSpinner open={loading} />
      <Box>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 3,
          }}
        >
          <Typography variant="h4" fontWeight="bold">
            Customers
          </Typography>

          <Box sx={{ display: "flex", gap: 2 }}>
            <Button
              component="label"
              variant="outlined"
              startIcon={<UploadFileIcon />}
              disabled={importLoading}
            >
              {importLoading ? "Importing..." : "Import Excel"}

              <input
                hidden
                type="file"
                accept=".xlsx,.xls"
                onChange={importCustomers}
              />
            </Button>

            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => setOpen(true)}
            >
              Add Customer
            </Button>
          </Box>
        </Box>

        <SearchBar
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
          placeholder="Search by ID, Name, Phone or Email..."
        />

        {customers.length === 0 ? (
          <Typography align="center" sx={{ mt: 4 }}>
            No Customers Found
          </Typography>
        ) : (
          customers.map((customer) => (
            <div
              key={customer.id}
              onClick={() => navigate(`/customers/${customer.customer_code }`)}
              style={{
                border: "1px solid #ccc",
                padding: "15px",
                marginBottom: "10px",
                borderRadius: "8px",
                cursor: "pointer",  
              }}
            >
              <h3>{customer.name}</h3>

              <Button
                onClick={(event) => {
                  event.stopPropagation();

                  setEditingId(customer.customer_code );

                  setName(customer.name);

                  setPhone(customer.phone);

                  setEmail(customer.email);

                  setAddress(customer.address);

                  setOpen(true);
                }}
              >
                Edit
              </Button>

              <Button
                color="error"
                variant="outlined"
                onClick={(event) => {
                  event.stopPropagation();

                  setDeleteId(customer.id);

                  setDeleteOpen(true);
                }}
              >
                Delete
              </Button>
              <p>
                <strong>Phone:</strong> {customer.phone}
              </p>
              <p>
                <strong>Email:</strong> {customer.email}
              </p>
              <p>
                <strong>Address:</strong> {customer.address}
              </p>
            </div>
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
        <Dialog
          open={open}
          onClose={() => setOpen(false)}
          fullWidth
          maxWidth="sm"
        >
          <DialogTitle>
            {editingId ? "Edit Customer" : "Add Customer"}
          </DialogTitle>

          <DialogContent>
            <TextField
              fullWidth
              label="Name"
              margin="normal"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />

            <TextField
              fullWidth
              label="Phone"
              margin="normal"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />

            <TextField
              fullWidth
              label="Email"
              margin="normal"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <TextField
              fullWidth
              label="Address"
              margin="normal"
              multiline
              rows={3}
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            />
          </DialogContent>

          <DialogActions>
            <Button
              onClick={() => {
                setOpen(false);

                cancelEdit();
              }}
            >
              Cancel
            </Button>

            <Button
              variant="contained"
              onClick={editingId ? updateCustomer : addCustomer}
            >
              {editingId ? "Update" : "Save"}
            </Button>
          </DialogActions>
        </Dialog>

        <Dialog open={deleteOpen} onClose={() => setDeleteOpen(false)}>
          <DialogTitle>Delete Customer</DialogTitle>

          <DialogContent>
            <Typography>
              Are you sure you want to delete this customer?
            </Typography>
          </DialogContent>

          <DialogActions>
            <Button onClick={() => setDeleteOpen(false)}>Cancel</Button>

            <Button color="error" variant="contained" onClick={deleteCustomer}>
              Delete
            </Button>
          </DialogActions>
        </Dialog>

        <CustomSnackbar
          open={snackbarOpen}
          message={snackbarMessage}
          severity={snackbarSeverity}
          onClose={() => setSnackbarOpen(false)}
        />
      </Box>
    </>
  );
}

export default Customers;
