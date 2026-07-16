import { useEffect, useState } from "react";
import axios from "axios";
import DeleteIcon from "@mui/icons-material/Delete";
import Autocomplete from "@mui/material/Autocomplete";

import {
  Box,
  Typography,
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  InputAdornment,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";

import SearchIcon from "@mui/icons-material/Search";
import AddIcon from "@mui/icons-material/Add";

function Orders() {
  const [customers, setCustomers] = useState([]);
  const [products, setProducts] = useState([]);

  const [customerId, setCustomerId] = useState("");
  const [productId, setProductId] = useState("");
  const [quantity, setQuantity] = useState("");
  const [total, setTotal] = useState(0);
  const [orders, setOrders] = useState([]);

  const [search, setSearch] = useState("");

  const [open, setOpen] = useState(false);

  // const [deleteOpen, setDeleteOpen] = useState(false);
  // const [deleteId, setDeleteId] = useState(null);

  const fetchCustomers = async () => {
    const response = await axios.get("http://localhost:5000/customers");

    setCustomers(response.data.customers);
  };

  const fetchProducts = async () => {
    const response = await axios.get("http://localhost:5000/products");

    setProducts(response.data.products);
  };

  const selectedProduct = products.find(
    (product) => product.id === Number(productId),
  );

  const fetchOrders = async () => {
    try {
      const response = await axios.get("http://localhost:5000/orders");

      setOrders(response.data.orders);
    } catch (error) {
      console.error(error);
    }
  };

  const createOrder = async () => {
    try {
      const response = await axios.post("http://localhost:5000/orders", {
        customer_id: customerId,
        product_id: productId,
        quantity,
      });

      alert(`Order Created Successfully\nTotal = ₹${response.data.total}`);

      setCustomerId("");
      setProductId("");
      setQuantity("");

      fetchProducts();
      fetchOrders();
      setOpen(false);
      setTotal(0);
    } catch (error) {
      console.error(error);

      console.log(error.response?.data);

      alert(error.response?.data?.message || "Server Error");
    }
  };

  const deleteOrder = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/orders/${id}`);

      fetchOrders();

      fetchProducts();
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchCustomers();

    fetchProducts();

    fetchOrders();
  }, []);

  useEffect(() => {
    if (selectedProduct && quantity) {
      setTotal(Number(selectedProduct.price) * Number(quantity));
    } else {
      setTotal(0);
    }
  }, [productId, quantity, selectedProduct]);

  return (
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
          Orders
        </Typography>

        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setOpen(true)}
        >
          Create Order
        </Button>
      </Box>

      <TextField
        fullWidth
        placeholder="Search Orders..."
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
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>
                <b>Customer</b>
              </TableCell>

              <TableCell>
                <b>Product</b>
              </TableCell>

              <TableCell>
                <b>Quantity</b>
              </TableCell>

              <TableCell>
                <b>Total</b>
              </TableCell>

              <TableCell>
                <b>Date</b>
              </TableCell>

              <TableCell>
                <b>Actions</b>
              </TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {orders.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} align="center">
                  No Orders Found
                </TableCell>
              </TableRow>
            ) : (
              orders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell>{order.customer_name}</TableCell>

                  <TableCell>{order.product_name}</TableCell>

                  <TableCell>{order.quantity}</TableCell>

                  <TableCell>
                    ₹ {Number(order.total).toLocaleString("en-IN")}
                  </TableCell>

                  <TableCell>
                    {new Date(order.created_at).toLocaleString("en-IN", {
                      day: "2-digit",

                      month: "short",

                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                      hour12: true,
                    })}
                  </TableCell>

                  <TableCell>
                    <Button
                      variant="outlined"
                      color="error"
                      startIcon={<DeleteIcon />}
                      onClick={() => {
                        if (window.confirm("Delete this order?")) {
                          deleteOrder(order.id);
                        }
                      }}
                    >
                      Delete
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog
        open={open}
        fullWidth
        maxWidth="sm"
        onClose={() => {
          setOpen(false);

          setCustomerId("");

          setProductId("");

          setQuantity("");

          setTotal(0);
        }}
      >
        <DialogTitle>Create Order</DialogTitle>

        <DialogContent>
          {/* Customer */}

          <Autocomplete
            options={customers}
            getOptionLabel={(option) => option.name}
            onChange={(event, value) => {
              setCustomerId(value ? value.id : "");
            }}
            renderInput={(params) => (
              <TextField {...params} label="Search Customer" margin="normal" />
            )}
          />

          {/* Product */}

          <Autocomplete
            options={products}
            getOptionLabel={(option) => option.name}
            onChange={(event, value) => {
              setProductId(value ? value.id : "");
            }}
            renderInput={(params) => (
              <TextField {...params} label="Search Product" margin="normal" />
            )}
          />

          {/* Quantity */}

          <TextField
            label="Quantity"
            type="number"
            fullWidth
            margin="normal"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            inputProps={{
              min: 1,
            }}
          />

          {selectedProduct && (
            <>
              <TextField
                label="Price"
                fullWidth
                margin="normal"
                value={`₹ ${selectedProduct.price}`}
                InputProps={{
                  readOnly: true,
                }}
              />

              <TextField
                label="Available Stock"
                fullWidth
                margin="normal"
                value={selectedProduct.stock}
                InputProps={{
                  readOnly: true,
                }}
              />
            </>
          )}

          <TextField
            label="Total"
            fullWidth
            margin="normal"
            value={`₹ ${total.toLocaleString("en-IN")}`}
            InputProps={{
              readOnly: true,
            }}
          />
        </DialogContent>

        <DialogActions>
          <Button
            onClick={() => {
              setOpen(false);

              setCustomerId("");

              setProductId("");

              setQuantity("");

              setTotal(0);
            }}
          >
            Cancel
          </Button>

          <Button
            variant="contained"
            onClick={createOrder}
            disabled={!customerId || !productId || !quantity}
          >
            Create Order
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default Orders;
