import { useState } from "react";

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Typography,
  Divider,
  Stack,
  Box,
  Paper,
  MenuItem,
  InputAdornment,
  Avatar,
} from "@mui/material";

import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";

import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";

import { DatePicker } from "@mui/x-date-pickers/DatePicker";

import dayjs from "dayjs";

import BuildIcon from "@mui/icons-material/Build";
import EngineeringIcon from "@mui/icons-material/Engineering";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import AssignmentTurnedInIcon from "@mui/icons-material/AssignmentTurnedIn";
// import PaymentsIcon from "@mui/icons-material/Payments";
import NotesIcon from "@mui/icons-material/Notes";

function AddServiceDialog({ open, handleClose, customer }) {
  const [serviceDate, setServiceDate] = useState(dayjs());

  const serviceTypes = ["Installation", "Repair", "AMC", "Filter Change"];
  const serviceStatus = ["Completed", "Pending", "In Progress"];

  const [formData, setFormData] = useState({
    serviceDate: dayjs(),
    serviceType: "",
    engineer: "",
    serviceStatus: "Pending",
    totalAmount: "",
    receivedAmount: "",
    remark: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const pendingAmount =
    (Number(formData.totalAmount) || 0) -
    (Number(formData.receivedAmount) || 0);

  const handleSaveService = () => {
    console.log(formData);
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      fullWidth
      maxWidth="sm"
      PaperProps={{
        sx: {
          borderRadius: 5,
          p: 1,
        },
      }}
    >
      <DialogTitle>
        <Stack direction="row" spacing={2} alignItems="center">
          <BuildIcon color="primary" />

          <Box>
            <Typography variant="h5" fontWeight={700}>
              Add New Service
            </Typography>

            <Typography variant="body2" color="text.secondary">
              Record a new customer service visit.
            </Typography>
          </Box>
        </Stack>
      </DialogTitle>

      <DialogContent dividers>
        <Paper
          elevation={0}
          sx={{
            p: 2.5,
            mb: 3,
            borderRadius: 3,
            bgcolor: "#f8fafc",
            border: "1px solid #e2e8f0",
          }}
        >
          <Stack direction="row" spacing={2} alignItems="center">
            <Avatar
              sx={{
                width: 56,
                height: 56,
                bgcolor: "primary.main",
                fontWeight: 700,
              }}
            >
              {(customer?.name || "?").charAt(0).toUpperCase()}
            </Avatar>

            <Box flex={1}>
              <Typography variant="h6" fontWeight={700}>
                {customer?.name}
              </Typography>

              <Typography variant="body2" color="text.secondary" mt={0.5}>
                Customer Code :<strong> {customer?.customer_code}</strong>
              </Typography>

              <Typography variant="body2" color="text.secondary">
                📞 {customer?.phone}
              </Typography>

              <Typography variant="body2" color="text.secondary">
                📍 {customer?.address}
              </Typography>
            </Box>
          </Stack>
        </Paper>
        <Paper
          variant="outlined"
          sx={{
            p: 3,
            borderRadius: 3,
          }}
        >
          <Stack spacing={3}>
            <Stack direction="row" spacing={1} alignItems="center">
              <BuildIcon color="primary" />

              <Typography variant="h6" fontWeight={700}>
                Service Details
              </Typography>
            </Stack>

            <Divider />

            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                label="Service Date"
                value={serviceDate}
                onChange={(value) => setServiceDate(value)}
                format="DD MMM YYYY"
                slots={{
                  openPickerIcon: CalendarMonthIcon,
                }}
                slotProps={{
                  textField: {
                    fullWidth: true,

                    size: "medium",
                  },
                }}
              />
            </LocalizationProvider>

            <TextField
              fullWidth
              select
              label="Service Type"
              defaultValue=""
              name="serviceType"
              value={formData.serviceType}
              onChange={handleChange}
            >
              <MenuItem value="">Select Service Type</MenuItem>

              {serviceTypes.map((item) => (
                <MenuItem key={item} value={item}>
                  {item}
                </MenuItem>
              ))}
            </TextField>

            <TextField
              fullWidth
              label="Engineer Name"
              name="engineer"
              value={formData.engineer}
              onChange={handleChange}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <EngineeringIcon />
                  </InputAdornment>
                ),
              }}
            />

            <TextField
              fullWidth
              select
              label="Service Status"
              defaultValue="Pending"
              name="serviceStatus"
              value={formData.serviceStatus}
              onChange={handleChange}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <AssignmentTurnedInIcon />
                  </InputAdornment>
                ),
              }}
            >
              {serviceStatus.map((item) => (
                <MenuItem key={item} value={item}>
                  {item}
                </MenuItem>
              ))}
            </TextField>

            <TextField
              fullWidth
              label="Total Amount"
              type="number"
              name="totalAmount"
              value={formData.totalAmount}
              onChange={handleChange}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">₹</InputAdornment>
                ),
              }}
            />

            <TextField
              fullWidth
              label="Received Amount"
              type="number"
              name="receivedAmount"
              value={formData.receivedAmount}
              onChange={handleChange}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">₹</InputAdornment>
                ),
              }}
            />

            <TextField
              fullWidth
              label="Pending Amount"
              value={pendingAmount}
              InputProps={{
                readOnly: true,
                startAdornment: (
                  <InputAdornment position="start">₹</InputAdornment>
                ),
              }}
            />

            <TextField
              fullWidth
              multiline
              rows={4}
              label="Remark"
              name="remark"
              value={formData.remark}
              onChange={handleChange}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <NotesIcon />
                  </InputAdornment>
                ),
              }}
            />
          </Stack>
        </Paper>
      </DialogContent>
      <DialogActions sx={{ px: 3, py: 2 }}>
        <Button variant="outlined" color="inherit" onClick={handleClose}>
          Cancel
        </Button>

        <Button variant="contained" onClick={handleSaveService}>
          Save Service
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default AddServiceDialog;
