import { useState, useEffect } from "react";
import { useSnackbar } from "notistack";

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormControlLabel,
  Checkbox,
} from "@mui/material";
import {
    addCustomerField,
    updateCustomerField
} from "../../services/customerFieldService";

function FieldDialog({ open, onClose, onSuccess, mode = "add", field = null }) {
  const [fieldLabel, setFieldLabel] = useState("");
  const [fieldType, setFieldType] = useState("text");
  const [required, setRequired] = useState(false);
  const [visible, setVisible] = useState(true);
  const { enqueueSnackbar } = useSnackbar();
  const [loading] = useState(false);

  const handleSave = async () => {
    if (!fieldLabel.trim()) {
      enqueueSnackbar("Field Name is required", {
        variant: "warning",
      });
      return;
    }

    try {
    if (mode === "add") {

    await addCustomerField({
        field_label: fieldLabel,
        field_type: fieldType,
        is_required: required,
        is_visible: visible
    });

} else {

    await updateCustomerField(field.id, {
        field_label: fieldLabel,
        field_type: fieldType,
        is_required: required,
        is_visible: visible
    });

}

      setFieldLabel("");
      setFieldType("text");
      setRequired(false);
      setVisible(true);

      onSuccess();
      onClose();
     enqueueSnackbar(
    mode === "add"
        ? "Customer field added successfully"
        : "Customer field updated successfully",
    {
        variant: "success"
    }
);
    } catch (error) {
      console.error(error);
      enqueueSnackbar(error.response?.data?.message || "Something went wrong", {
        variant: "error",
      });
    }
  };

  useEffect(() => {
    if (mode === "edit" && field) {
      setFieldLabel(field.field_label);
      setFieldType(field.field_type);
      setRequired(field.is_required);
      setVisible(field.is_visible);
    } else {
      setFieldLabel("");
      setFieldType("text");
      setRequired(false);
      setVisible(true);
    }
  }, [mode, field, open]);

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>
        {mode === "add" ? "Add Customer Field" : "Edit Customer Field"}
      </DialogTitle>

      <DialogContent>
        <TextField
          fullWidth
          margin="normal"
          label="Field Name"
          value={fieldLabel}
          onChange={(e) => setFieldLabel(e.target.value)}
        />

        <FormControl fullWidth margin="normal">
          <InputLabel>Field Type</InputLabel>

          <Select
            value={fieldType}
            label="Field Type"
            onChange={(e) => setFieldType(e.target.value)}
          >
            <MenuItem value="text">Text</MenuItem>

            <MenuItem value="textarea">Textarea</MenuItem>

            <MenuItem value="number">Number</MenuItem>

            <MenuItem value="date">Date</MenuItem>

            <MenuItem value="dropdown">Dropdown</MenuItem>

            <MenuItem value="email">Email</MenuItem>

            <MenuItem value="phone">Phone</MenuItem>

            <MenuItem value="checkbox">Checkbox</MenuItem>
          </Select>
        </FormControl>

        <FormControlLabel
          control={
            <Checkbox
              checked={required}
              onChange={(e) => setRequired(e.target.checked)}
            />
          }
          label="Required"
        />

        <FormControlLabel
          control={
            <Checkbox
              checked={visible}
              onChange={(e) => setVisible(e.target.checked)}
            />
          }
          label="Visible"
        />
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>

        <Button variant="contained" onClick={handleSave} disabled={loading}>
          {/* {loading ? "Saving..." : "Save"} */}
          {mode === "add" ? "Save" : "Update"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default FieldDialog;
