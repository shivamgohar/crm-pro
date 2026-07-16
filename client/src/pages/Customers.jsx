import { useEffect, useState } from "react";
import axios from "axios";
import CustomSnackbar from "../components/CustomSnackbar";
import { useSnackbar } from "notistack";
import LoadingSpinner from "../components/LoadingSpinner";

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
import InputAdornment from "@mui/material/InputAdornment";

import SearchIcon from "@mui/icons-material/Search";
import AddIcon from "@mui/icons-material/Add";

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
  const [loading, setLoading] = useState(false);

  const { enqueueSnackbar } = useSnackbar();

  const fetchCustomers = async () => {
    setLoading(true);

    try {
      // loading Testing
      // await new Promise((resolve) => setTimeout(resolve, 2000));

      const response = await axios.get("http://localhost:5000/customers");

      setCustomers(response.data.customers);
    } catch (error) {
      console.error(error);
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

  const filteredCustomers = customers.filter((customer) => {
    const keyword = search.toLowerCase();

    return (
      customer.name.toLowerCase().includes(keyword) ||
      customer.phone.toLowerCase().includes(keyword) ||
      customer.email.toLowerCase().includes(keyword) ||
      customer.address.toLowerCase().includes(keyword)
    );
  });

  useEffect(() => {
    fetchCustomers();
  }, []);

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

          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => setOpen(true)}
          >
            Add Customer
          </Button>
        </Box>

        <TextField
          fullWidth
          placeholder="Search Customer..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          sx={{ mb: 3 }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />

        {filteredCustomers.length === 0 ? (
          <Typography align="center" sx={{ mt: 4 }}>
            No Customers Found
          </Typography>
        ) : (
          filteredCustomers.map((customer) => (
            <div
              key={customer.id}
              style={{
                border: "1px solid #ccc",
                padding: "15px",
                marginBottom: "10px",
                borderRadius: "8px",
              }}
            >
              <h3>{customer.name}</h3>

              <Button
                onClick={() => {
                  setEditingId(customer.id);

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
                onClick={() => {
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
