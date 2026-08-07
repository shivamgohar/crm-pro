import { useEffect, useState } from "react";
// import axios from "axios";
import api from "../api/api";
// import { Divider } from "@mui/material";

import {
  Box,
  Button,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";

function Invoice() {
  const [invoices, setInvoices] = useState([]);
  const [open, setOpen] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState(null);

  const fetchInvoices = async () => {
    try {
      const response = await api.get("/invoice");

      setInvoices(response.data.invoices);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchInvoices();
  }, []);

  return (
    <>
      <Box>
        <Typography variant="h4" fontWeight="bold" mb={3}>
          Invoice
        </Typography>

        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>
                  <b>ID</b>
                </TableCell>
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
                  <b>Action</b>
                </TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {invoices.map((invoice) => (
                <TableRow key={invoice.id}>
                  <TableCell>{invoice.id}</TableCell>
                  <TableCell>{invoice.customer_name}</TableCell>
                  <TableCell>{invoice.product_name}</TableCell>
                  <TableCell>{invoice.quantity}</TableCell>
                  <TableCell>₹ {invoice.total}</TableCell>
                  <TableCell>
                    {new Date(invoice.created_at).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="contained"
                      onClick={() => {
                        setSelectedInvoice(invoice);
                        setOpen(true);
                      }}
                    >
                      View
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>

    <Dialog
  open={open}
  onClose={() => setOpen(false)}
  maxWidth="sm"
  fullWidth
>
  <DialogTitle sx={{ textAlign: "center", py: 3 }}>
    <Typography variant="h5" fontWeight={700}>
      ACN GROUP
    </Typography>

    <Typography variant="body2" color="text.secondary">
      CRM Management System
    </Typography>

    <Typography variant="h6" fontWeight={700} mt={2}>
      INVOICE
    </Typography>
  </DialogTitle>

  <DialogContent>
    {selectedInvoice && (
      <Box>

        {/* Invoice Info */}

        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            mb: 3,
          }}
        >
          <Box>
            <Typography variant="body2" color="text.secondary">
              Invoice Number
            </Typography>

            <Typography fontWeight={600}>
              INV-{selectedInvoice.id.toString().padStart(4, "0")}
            </Typography>
          </Box>

          <Box textAlign="right">
            <Typography variant="body2" color="text.secondary">
              Invoice Date
            </Typography>

            <Typography fontWeight={600}>
              {new Date(
                selectedInvoice.created_at
              ).toLocaleDateString("en-IN")}
            </Typography>
          </Box>
        </Box>

        {/* Customer */}

        <Paper
          variant="outlined"
          sx={{
            p: 2,
            borderRadius: 2,
            mb: 2,
          }}
        >
          <Typography
            variant="h6"
            fontWeight={600}
            mb={2}
          >
            Customer Information
          </Typography>

          <Typography>
            <b>Name :</b> {selectedInvoice.customer_name}
          </Typography>

          <Typography>
            <b>Phone :</b> {selectedInvoice.phone}
          </Typography>

          <Typography>
            <b>Email :</b> {selectedInvoice.email}
          </Typography>

          <Typography>
            <b>Address :</b> {selectedInvoice.address}
          </Typography>
        </Paper>

        {/* Product */}

        <Paper
          variant="outlined"
          sx={{
            p: 2,
            borderRadius: 2,
            mb: 2,
          }}
        >
          <Typography
            variant="h6"
            fontWeight={600}
            mb={2}
          >
            Product Information
          </Typography>

          <Typography>
            <b>Product :</b> {selectedInvoice.product_name}
          </Typography>

          <Typography>
            <b>Category :</b> {selectedInvoice.category}
          </Typography>

          <Typography>
            <b>Unit Price :</b> ₹ {selectedInvoice.price}
          </Typography>

          <Typography>
            <b>Quantity :</b> {selectedInvoice.quantity}
          </Typography>

          <Typography>
            <b>Total :</b> ₹ {selectedInvoice.total}
          </Typography>
        </Paper>

        {/* Grand Total */}

        <Paper
          sx={{
            mt: 2,
            p: 2,
            bgcolor: "primary.main",
            color: "#fff",
            textAlign: "right",
            borderRadius: 2,
          }}
        >
          <Typography variant="body2">
            Grand Total
          </Typography>

          <Typography
            variant="h5"
            fontWeight={700}
          >
            ₹ {selectedInvoice.total}
          </Typography>
        </Paper>

      </Box>
    )}
  </DialogContent>

  <DialogActions>
    <Button
      variant="contained"
      onClick={() =>
        window.open(
          `http://localhost:5000/invoice/pdf/${selectedInvoice.id}`,
          "_blank"
        )
      }
    >
      Download PDF
    </Button>

    <Button
      variant="contained"
      onClick={() => {
        const printWindow = window.open(
          `http://localhost:5000/invoice/pdf/${selectedInvoice.id}`,
          "_blank"
        );

        printWindow.onload = () => {
          printWindow.print();
        };
      }}
    >
      Print
    </Button>

    <Button onClick={() => setOpen(false)}>
      Close
    </Button>
  </DialogActions>
</Dialog>
    </>
  );
}

export default Invoice;
