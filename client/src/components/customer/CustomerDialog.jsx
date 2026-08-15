// import api from "../../api/api";


import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  MenuItem,
} from "@mui/material";

import { useEffect, useState } from "react";

import { getCustomFields } from "../../services/customFieldService";
import {
  createCustomer,
  updateCustomer,
} from "../../services/customerService";

import { useSnackbar } from "notistack";

function CustomerDialog({ open, onClose, customer, onSuccess }) {
  const [fields, setFields] = useState([]);
  const [formData, setFormData] = useState({});
  const [errors, setErrors] = useState({});

  const { enqueueSnackbar } = useSnackbar();

  // -----------------------------------------
  // Handle field change
  // -----------------------------------------

  const handleChange = (fieldKey, value) => {
    setFormData((prev) => ({
      ...prev,
      [fieldKey]: value,
    }));
  };

  // -----------------------------------------
  // Load NEW custom fields
  // -----------------------------------------

  const loadFields = async () => {
    try {
      const data = await getCustomFields("customer");

      setFields(data || []);
    } catch (error) {
      console.error("Load custom customer fields error:", error);
    }
  };

  // -----------------------------------------
  // Validation
  // -----------------------------------------

  const validateForm = () => {
    const newErrors = {};

    // Core fields
    if (!String(formData.customer_name || "").trim()) {
      newErrors.customer_name = "Customer Name is required.";
    }

    if (!String(formData.customer_code || "").trim()) {
      newErrors.customer_code = "Customer Code is required.";
    }

    if (!String(formData.phone || "").trim()) {
      newErrors.phone = "Mobile Number is required.";
    }

    // Custom fields
    fields.forEach((field) => {
      if (!field.is_required) {
        return;
      }

      const value = formData[field.field_key];

      if (
        value === undefined ||
        value === null ||
        String(value).trim() === ""
      ) {
        newErrors[field.field_key] =
          `${field.field_label} is required.`;
      }
    });

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  // -----------------------------------------
  // Save Customer
  // -----------------------------------------

  const handleSave = async () => {
    if (!validateForm()) {
      return;
    }

    try {
      if (customer) {
        console.log("Updating customer:", customer.id);
        console.log("Customer data:", formData);

        await updateCustomer(customer.id, formData);

        enqueueSnackbar("Customer Updated Successfully", {
          variant: "success",
        });
      } else {
        console.log("Creating customer:", formData);

        await createCustomer(formData);

        enqueueSnackbar("Customer Added Successfully", {
          variant: "success",
        });
      }

      onSuccess();

      setFormData({});
      setErrors({});

      onClose();

    } catch (error) {
      console.error("Customer save error:", error);

      const message =
        error.response?.data?.message ||
        "Something went wrong.";

      enqueueSnackbar(message, {
        variant: "error",
      });
    }
  };

  // -----------------------------------------
  // Load fields when dialog opens
  // -----------------------------------------

  useEffect(() => {
    if (open) {
      loadFields();
    }
  }, [open]);

  // -----------------------------------------
  // Load customer data for Edit
  // -----------------------------------------

  useEffect(() => {
    if (customer) {
      setFormData({
        ...customer,

        // Existing DB column
        customer_name: customer.name || "",
      });
    } else {
      setFormData({});
    }

    setErrors({});
  }, [customer, open]);

  // -----------------------------------------
  // Render dynamic custom field
  // -----------------------------------------

  const renderCustomField = (field) => {
    const value = formData[field.field_key] || "";

    const commonProps = {
      key: field.id,
      label: field.field_label,
      fullWidth: true,
      margin: "normal",
      value,
      onChange: (e) =>
        handleChange(field.field_key, e.target.value),
      error: !!errors[field.field_key],
      helperText: errors[field.field_key] || "",
    };

    switch (field.field_type) {
      case "textarea":
        return (
          <TextField
            {...commonProps}
            multiline
            minRows={3}
          />
        );

      case "number":
        return (
          <TextField
            {...commonProps}
            type="number"
          />
        );

      case "email":
        return (
          <TextField
            {...commonProps}
            type="email"
          />
        );

      case "date":
        return (
          <TextField
            {...commonProps}
            type="date"
            InputLabelProps={{
              shrink: true,
            }}
          />
        );

      case "dropdown":
        return (
          <TextField
            {...commonProps}
            select
          >
            {(field.options || []).map((option) => (
              <MenuItem
                key={option}
                value={option}
              >
                {option}
              </MenuItem>
            ))}
          </TextField>
        );

      case "checkbox":
        return (
          <TextField
            {...commonProps}
            select
          >
            <MenuItem value="true">
              Yes
            </MenuItem>

            <MenuItem value="false">
              No
            </MenuItem>
          </TextField>
        );

      case "phone":
        return (
          <TextField
            {...commonProps}
            type="tel"
          />
        );

      default:
        return (
          <TextField
            {...commonProps}
            type="text"
          />
        );
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="md"
    >
      <DialogTitle>
        {customer
          ? "Edit Customer"
          : "Add Customer"}
      </DialogTitle>

      <DialogContent>

        {/* -------------------------------- */}
        {/* CORE CUSTOMER FIELDS             */}
        {/* -------------------------------- */}

        <TextField
          fullWidth
          margin="normal"
          label="Customer Name"
          value={formData.customer_name || ""}
          onChange={(e) =>
            handleChange(
              "customer_name",
              e.target.value
            )
          }
          error={!!errors.customer_name}
          helperText={errors.customer_name || ""}
        />

        <TextField
          fullWidth
          margin="normal"
          label="Customer Code"
          value={formData.customer_code || ""}
          onChange={(e) =>
            handleChange(
              "customer_code",
              e.target.value
            )
          }
          error={!!errors.customer_code}
          helperText={errors.customer_code || ""}
        />

        <TextField
          fullWidth
          margin="normal"
          label="Mobile Number"
          value={formData.phone || ""}
          onChange={(e) =>
            handleChange(
              "phone",
              e.target.value
            )
          }
          error={!!errors.phone}
          helperText={errors.phone || ""}
        />

        <TextField
          fullWidth
          margin="normal"
          label="Address"
          value={formData.address || ""}
          onChange={(e) =>
            handleChange(
              "address",
              e.target.value
            )
          }
        />

        {/* -------------------------------- */}
        {/* CUSTOM FIELDS                    */}
        {/* -------------------------------- */}

        {fields
          .filter((field) => field.is_visible)
          .filter(
            (field) =>
              field.show_in?.form !== false
          )
          .map((field) =>
            renderCustomField(field)
          )}

      </DialogContent>

      <DialogActions>

        <Button onClick={onClose}>
          Cancel
        </Button>

        <Button
          variant="contained"
          onClick={handleSave}
        >
          {customer
            ? "Update Customer"
            : "Save Customer"}
        </Button>

      </DialogActions>
    </Dialog>
  );
}

export default CustomerDialog;