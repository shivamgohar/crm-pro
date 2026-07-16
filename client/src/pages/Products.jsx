import { useEffect, useState } from "react";
import axios from "axios";

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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  InputAdornment,
  Chip,
} from "@mui/material";

import SearchIcon from "@mui/icons-material/Search";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

function Products() {
  const [products, setProducts] = useState([]);

  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("");

  const [editingId, setEditingId] = useState(null);

  const [search, setSearch] = useState("");

  const [open, setOpen] = useState(false);

  // const [deleteOpen, setDeleteOpen] = useState(false);
  // const [deleteId, setDeleteId] = useState(null);

  const fetchProducts = async () => {
    try {
      const response = await axios.get("http://localhost:5000/products");

      setProducts(response.data.products);
    } catch (error) {
      console.error(error);
    }
  };

  const addProduct = async () => {
    if (!validateProduct()) return;
    try {
      await axios.post("http://localhost:5000/products", {
        name,
        category,
        price,
        stock,
      });

      setName("");
      setCategory("");
      setPrice("");
      setStock("");

      fetchProducts();
      setOpen(false);

      alert("Product Added Successfully");
    } catch (error) {
      console.error(error);

      alert("Error");
    }
  };

  const updateProduct = async () => {
    if (!validateProduct()) return;
    try {
      await axios.put(`http://localhost:5000/products/${editingId}`, {
        name,
        category,
        price,
        stock,
      });

      setEditingId(null);

      setName("");
      setCategory("");
      setPrice("");
      setStock("");

      fetchProducts();
      setOpen(false);

      alert("Product Updated Successfully");
    } catch (error) {
      console.error(error);

      alert("Error Updating Product");
    }
  };

const deleteProduct = async (id) => {
  try {

    await axios.delete(
      `http://localhost:5000/products/${id}`
    );

    fetchProducts();

    alert("Product Deleted Successfully");

  } catch (error) {

    console.error(error);

    alert("Error Deleting Product");

  }
};

  const cancelEdit = () => {
    setEditingId(null);
    setName("");
    setCategory("");
    setPrice("");
    setStock("");
  };


  const validateProduct = () => {
    if (name.trim().length < 3) {
      alert("Product name must be at least 3 characters");

      return false;
    }

    if (!category) {
      alert("Select Category");

      return false;
    }

    if (Number(price) <= 0) {
      alert("Price must be greater than 0");

      return false;
    }

    if (Number(stock) < 0) {
      alert("Stock cannot be negative");

      return false;
    }

    return true;
  };


  const filteredProducts = products.filter((product) => {
    const keyword = search.toLowerCase();

    return (
      product.name.toLowerCase().includes(keyword) ||
      product.category.toLowerCase().includes(keyword)
    );
  });

  useEffect(() => {
    fetchProducts();
  }, []);

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
          Products
        </Typography>

        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setOpen(true)}
        >
          Add Product
        </Button>
      </Box>
      <TextField
        fullWidth
        placeholder="Search Product..."
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
                <b>Name</b>
              </TableCell>

              <TableCell>
                <b>Category</b>
              </TableCell>

              <TableCell>
                <b>Price</b>
              </TableCell>

              <TableCell>
                <b>Stock</b>
              </TableCell>

              <TableCell>
                <b>Status</b>
              </TableCell>

              <TableCell>
                <b>Actions</b>
              </TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {filteredProducts.map((product) => (
              <TableRow
                key={product.id}
                sx={{
                  backgroundColor: product.stock <= 20 ? "#fff8e1" : "inherit",
                }}
              >
                <TableCell>{product.name}</TableCell>

                <TableCell>{product.category}</TableCell>

                <TableCell>₹ {product.price}</TableCell>

                <TableCell>{product.stock}</TableCell>

                <TableCell>
                  {product.stock == 0 ? (
                    <Chip label="Out of Stock" color="error" size="small" />
                  ) : product.stock <= 20 ? (
                    <Chip label="Low Stock" color="warning" size="small" />
                  ) : (
                    <Chip label="In Stock" color="success" size="small" />
                  )}
                </TableCell>

                <TableCell>
                  <Button
                    size="small"
                    startIcon={<EditIcon />}
                    onClick={() => {
                      setEditingId(product.id);

                      setName(product.name);

                      setCategory(product.category);

                      setPrice(product.price);

                      setStock(product.stock);

                      setOpen(true);
                    }}
                  >
                    Edit
                  </Button>

               <Button
  size="small"
  color="error"
  startIcon={<DeleteIcon />}
  onClick={() => {
    if (window.confirm("Delete Product?")) {
      deleteProduct(product.id);
    }
  }}
>
  Delete
</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>{editingId ? "Edit Product" : "Add Product"}</DialogTitle>

        <DialogContent>
          <TextField
            label="Product Name"
            fullWidth
            margin="normal"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <FormControl fullWidth margin="normal">
            <InputLabel>Category</InputLabel>

            <Select
              value={category}
              label="Category"
              onChange={(e) => setCategory(e.target.value)}
            >
              <MenuItem value="Filter">Filter</MenuItem>
              <MenuItem value="Pump">Pump</MenuItem>
              <MenuItem value="Chemical">Chemical</MenuItem>
              <MenuItem value="Membrane">Membrane</MenuItem>
              <MenuItem value="Accessories">Accessories</MenuItem>
            </Select>
          </FormControl>

          <TextField
            label="Price"
            type="number"
            fullWidth
            margin="normal"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
          />

          <TextField
            label="Stock"
            type="number"
            fullWidth
            margin="normal"
            value={stock}
            onChange={(e) => setStock(e.target.value)}
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
            onClick={editingId ? updateProduct : addProduct}
          >
            {editingId ? "Update" : "Save"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default Products;
