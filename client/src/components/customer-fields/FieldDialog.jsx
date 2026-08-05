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
  Typography,
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

  const [fieldGroup, setFieldGroup] = useState("customer");

const [showIn, setShowIn] = useState({
  list: true,
  profile: true,
  dialog: true,
  import: true,
  search: true,
});

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
    field_group: fieldGroup,
    show_in: showIn,
    is_required: required,
    is_visible: visible
});

} else {

 await updateCustomerField(field.id,{
    field_label: fieldLabel,
    field_type: fieldType,
    field_group: fieldGroup,
    show_in: showIn,
    is_required: required,
    is_visible: visible
});

}

      setFieldLabel("");
      setFieldType("text");
      setRequired(false);
      setVisible(true);
      setFieldGroup("customer");

setShowIn({
  list: true,
  profile: true,
  dialog: true,
  import: true,
  search: true,
});

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
      setFieldGroup(field.field_group || "customer");

setShowIn(
  field.show_in || {
    list: true,
    profile: true,
    dialog: true,
    import: true,
    search: true,
  }
);
    } else {
      setFieldLabel("");
      setFieldType("text");
      setRequired(false);
      setVisible(true);
      setFieldGroup("customer");

setShowIn({
  list: true,
  profile: true,
  dialog: true,
  import: true,
  search: true,
});
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
          <FormControl fullWidth margin="normal">
  <InputLabel>Field Group</InputLabel>

  <Select
    value={fieldGroup}
    label="Field Group"
    onChange={(e)=>setFieldGroup(e.target.value)}
  >
    <MenuItem value="customer">
      Customer Information
    </MenuItem>

    <MenuItem value="service">
      Service Information
    </MenuItem>
  </Select>
</FormControl>

<Typography sx={{ mt:2,fontWeight:600 }}>
  Show In
</Typography>

<FormControlLabel
  control={
    <Checkbox
      checked={showIn.list}
      onChange={(e)=>
        setShowIn({
          ...showIn,
          list:e.target.checked
        })
      }
    />
  }
  label="Customer List"
/>

<FormControlLabel
  control={
    <Checkbox
      checked={showIn.profile}
      onChange={(e)=>
        setShowIn({
          ...showIn,
          profile:e.target.checked
        })
      }
    />
  }
  label="Customer Profile"
/>

<FormControlLabel
  control={
    <Checkbox
      checked={showIn.dialog}
      onChange={(e)=>
        setShowIn({
          ...showIn,
          dialog:e.target.checked
        })
      }
    />
  }
  label="Add/Edit Customer"
/>

<FormControlLabel
  control={
    <Checkbox
      checked={showIn.import}
      onChange={(e)=>
        setShowIn({
          ...showIn,
          import:e.target.checked
        })
      }
    />
  }
  label="Import"
/>

<FormControlLabel
  control={
    <Checkbox
      checked={showIn.search}
      onChange={(e)=>
        setShowIn({
          ...showIn,
          search:e.target.checked
        })
      }
    />
  }
  label="Search"
/>



<Typography sx={{ mt:2,fontWeight:600 }}>
  
</Typography>
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
