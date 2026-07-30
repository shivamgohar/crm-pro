import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
} from "@mui/material";

import { useEffect, useState } from "react";
import { getCustomerFields } from "../../services/customerFieldService";
import { createCustomer } from "../../services/customerService";
import { useSnackbar } from "notistack";

function CustomerDialog({
  open,
  onClose,
  onSuccess,
  
}) {

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

    fields.forEach((field) => {
      console.log(fields);

        const value = formData[field.field_key]?.trim() || "";

        // Required Validation
        if (field.is_required && value === "") {
            newErrors[field.field_key] =
                `${field.field_label} is required.`;
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

    await createCustomer(formData);

    enqueueSnackbar("Customer Added Successfully", {
      variant: "success",
    });

    onSuccess();

    setFormData({});

    onClose();

  } catch (error) {

    console.error(error);

    const message =
      error.response?.data?.message ||
      "Something went wrong.";

    enqueueSnackbar(message, {
      variant: "error",
    });

  }
};

const loadFields = async () => {
  try {
    const data = await getCustomerFields();

    setFields(data);
  } catch (error) {
    console.error(error);
  }
};


useEffect(() => {
  loadFields();
}, []);

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="md"
    >
      <DialogTitle>
        Add Customer
      </DialogTitle>

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
        <Button onClick={onClose}>
          Cancel
        </Button>

       <Button
  variant="contained"
  onClick={handleSave}
>
  Save
</Button>
      </DialogActions>
    </Dialog>
  );
}

export default CustomerDialog;