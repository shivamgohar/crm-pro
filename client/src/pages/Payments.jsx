import { useEffect, useState } from "react";
import axios from "axios";

import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  MenuItem,
} from "@mui/material";

export default function Payments() {
  const [payments, setPayments] = useState([]);
  const [open, setOpen] = useState(false);

  const [formData, setFormData] = useState({
    order_id: "",

    amount: "",

    payment_method: "Cash",

    payment_status: "PAID",
  });

  useEffect(() => {
    fetchPayments();
  }, []);

  const fetchPayments = async () => {
    try {
      const res = await axios.get("http://localhost:5000/payments");

      setPayments(res.data);
    } catch (error) {
      console.error(error);
    }
  };

  const savePayment = async () => {
    try {
      await axios.post("http://localhost:5000/payments", formData);

      fetchPayments();

      setOpen(false);

      setFormData({
        order_id: "",

        amount: "",

        payment_method: "Cash",

        payment_status: "PAID",
      });
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: 20,
        }}
      >
        <Typography variant="h4">Payments</Typography>

        <Button variant="contained" onClick={() => setOpen(true)}>
          Add Payment
        </Button>
      </div>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Customer</TableCell>
              <TableCell>Order ID</TableCell>
              <TableCell>Amount</TableCell>
              <TableCell>Method</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Date</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {payments.map((payment) => (
              <TableRow key={payment.id}>
                <TableCell>{payment.id}</TableCell>

                <TableCell>{payment.customer_name}</TableCell>

                <TableCell>{payment.order_id}</TableCell>

                <TableCell>Rs. {payment.amount}</TableCell>

                <TableCell>{payment.payment_method}</TableCell>

                <TableCell>{payment.payment_status}</TableCell>

                <TableCell>
                  {new Date(payment.payment_date).toLocaleDateString("en-IN")}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>Add Payment</DialogTitle>

        <DialogContent>
          <TextField
            label="Order ID"
            fullWidth
            margin="normal"
            value={formData.order_id}
            onChange={(e) =>
              setFormData({
                ...formData,
                order_id: e.target.value,
              })
            }
          />

          <TextField
            label="Amount"
            fullWidth
            margin="normal"
            value={formData.amount}
            onChange={(e) =>
              setFormData({
                ...formData,
                amount: e.target.value,
              })
            }
          />

          <TextField
            select
            label="Payment Method"
            fullWidth
            margin="normal"
            value={formData.payment_method}
            onChange={(e) =>
              setFormData({
                ...formData,
                payment_method: e.target.value,
              })
            }
          >
            <MenuItem value="Cash">Cash</MenuItem>

            <MenuItem value="UPI">UPI</MenuItem>

            <MenuItem value="Card">Card</MenuItem>

            <MenuItem value="Bank">Bank</MenuItem>
          </TextField>
        </DialogContent>

        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancel</Button>

          <Button variant="contained" onClick={savePayment}>
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
