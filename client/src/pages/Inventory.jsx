import { useEffect, useState } from "react";
import axios from "axios";

import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
} from "@mui/material";

function Inventory() {
  const [products, setProducts] = useState([]);
  const [open, setOpen] = useState(false);

  const [selectedProduct, setSelectedProduct] = useState(null);
  const [removeOpen, setRemoveOpen] = useState(false);

  //   const [newStock, setNewStock] = useState("");

  const [quantity, setQuantity] = useState("");

  const fetchInventory = async () => {
    try {
      const response = await axios.get("http://localhost:5000/inventory");

      setProducts(response.data.products);
    } catch (error) {
      console.error(error);
    }
  };

  //   const updateStock = async () => {
  //     try {
  //       await axios.put(
  //         `http://localhost:5000/inventory/${selectedProduct.id}`,

  //         {
  //           stock: Number(newStock),
  //         },
  //       );

  //       fetchInventory();

  //       setOpen(false);

  //       setSelectedProduct(null);

  //       setNewStock("");
  //     } catch (error) {
  //       console.error(error);
  //     }
  //   };

  const addStock = async () => {
    try {
      await axios.put(
        `http://localhost:5000/inventory/add/${selectedProduct.id}`,

        {
          quantity: Number(quantity),
        },
      );

      fetchInventory();

      setOpen(false);

      setSelectedProduct(null);

      setQuantity("");
    } catch (error) {
      console.error(error);
    }
  };

  const removeStock = async () => {
    try {
      await axios.put(
        `http://localhost:5000/inventory/remove/${selectedProduct.id}`,

        {
          quantity: Number(quantity),
        },
      );

      fetchInventory();

      setRemoveOpen(false);

      setSelectedProduct(null);

      setQuantity("");
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchInventory();
  }, []);

  return (
    <>
      <Box>
        <Typography variant="h4" fontWeight="bold" mb={3}>
          Inventory
        </Typography>

        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>
                  <b>Product</b>
                </TableCell>

                <TableCell>
                  <b>Price</b>
                </TableCell>

                <TableCell>
                  <b>Current Stock</b>
                </TableCell>
                <TableCell>
                  <b>Action</b>
                </TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {products.map((product) => (
                <TableRow key={product.id}>
                  <TableCell>{product.name}</TableCell>

                  <TableCell>₹ {product.price}</TableCell>

                  <TableCell>{product.stock}</TableCell>

                  <TableCell>
                    <Button
                      variant="contained"
                      color="success"
                      size="small"
                      onClick={() => {
                        setSelectedProduct(product);

                        setQuantity("");

                        setOpen(true);
                      }}
                    >
                      + Stock
                    </Button>

                    <Button
                      variant="contained"
                      color="error"
                      size="small"
                      sx={{ ml: 1 }}
                      onClick={() => {
                        setSelectedProduct(product);

                        setQuantity("");

                        setRemoveOpen(true);
                      }}
                    >
                      - Stock
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>

      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>Add Stock</DialogTitle>

        <DialogContent>
          <TextField
            label="Add Quantity"
            fullWidth
            margin="normal"
            type="number"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
          />
        </DialogContent>

        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancel</Button>

          <Button variant="contained" onClick={addStock}>
            Save
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={removeOpen} onClose={() => setRemoveOpen(false)}>
        <DialogTitle>Remove Stock</DialogTitle>
        <DialogContent>
          <TextField
            label="Remove Quantity"
            fullWidth
            margin="normal"
            type="number"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
          />
        </DialogContent>

        <DialogActions>
          <Button  onClick={() => setRemoveOpen(false)}>Cancel</Button>

          <Button variant="contained" onClick={removeStock}>
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

export default Inventory;
