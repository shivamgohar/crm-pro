import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
} from "@mui/material";

import { useEffect, useState } from "react";
// import { getCustomerFields, } from "../../services/customerFieldService";
import {
    getDialogCustomerFields
} from "../../services/customerFieldService";
import { createCustomer, updateCustomer } from "../../services/customerService";
import { useSnackbar } from "notistack";

function CustomerDialog({ open, onClose, customer, onSuccess }) {
  const [fields, setFields] = useState([]);
  const [formData, setFormData] = useState({});
  const [errors, setErrors] = useState({});
  const { enqueueSnackbar } = useSnackbar();

  const handleChange = (fieldKey, value) => {
    setFormData((prev) => ({
      ...prev,
      [fieldKey]: value,
    }));
  };

  const validateForm = () => {
    const newErrors = {};

    // fields.forEach((field) => {
      // console.log(fields);
customerFields.forEach((field) => {
      const value = formData[field.field_key]?.trim() || "";

      // Required Validation
      if (field.is_required && value === "") {
        newErrors[field.field_key] = `${field.field_label} is required.`;
      }
    });

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };
  const handleSave = async () => {
    if (!validateForm()) {
      return;
    }

    try {
      if (customer) {
        console.log("Updating customer:", customer.id);
        console.log(formData);

        await updateCustomer(customer.id, formData);

        enqueueSnackbar("Customer Updated Successfully", {
          variant: "success",
        });
      } else {
        await createCustomer(formData);

        enqueueSnackbar("Customer Added Successfully", {
          variant: "success",
        });
      }

      onSuccess();

      setFormData({});

      onClose();
    } catch (error) {
      console.error(error);

      const message = error.response?.data?.message || "Something went wrong.";

      enqueueSnackbar(message, {
        variant: "error",
      });
    }
  };
  const loadFields = async () => {
    try {
      const data = await getDialogCustomerFields();
      console.log(data);
      setFields(data);
    } catch (error) {
      console.error(error);
    }
  };

// const filteredFields = fields;
const customerFields = fields.filter(
  (field) => field.field_group === "customer"
);

  useEffect(() => {
    loadFields();
  }, []);

  useEffect(() => {
    if (customer) {
      setFormData({
        ...customer,
        customer_name: customer.name,
      });
    } else {
      setFormData({});
    }
  }, [customer, open]);

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
      <DialogTitle>{customer ? "Edit Customer" : "Add Customer"}</DialogTitle>

    <DialogContent>
 {fields.map((field) => (
    <TextField
      key={field.id}
      label={field.field_label}
      fullWidth
      margin="normal"
      value={formData[field.field_key] || ""}
      onChange={(e) =>
        handleChange(field.field_key, e.target.value)
      }
      error={!!errors[field.field_key]}
      helperText={errors[field.field_key] || ""}
    />
  ))}
</DialogContent>

      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>

        <Button variant="contained" onClick={handleSave}>
          {customer ? "Update Customer" : "Save Customer"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default CustomerDialog;
