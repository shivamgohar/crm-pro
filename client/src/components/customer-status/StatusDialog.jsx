    import { useState,useEffect  } from "react";
    import { useSnackbar } from "notistack";

    import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    TextField,
    FormControlLabel,
    Checkbox,
    } from "@mui/material";

    
   import { addCustomerStatus,updateCustomerStatus, } from "../../services/customerStatusService";

    function StatusDialog({ open, onClose,onSuccess, mode = "add", selectedStatus = null }) {
    const [statusName, setStatusName] = useState("");
   const [statusColor, setStatusColor] = useState("#1976d2");
    const [is_default, setIsDefault] = useState(false);
    const [is_active, setIsActive] = useState(true);
    const { enqueueSnackbar } = useSnackbar();
    const [loading] = useState(false);
const resetForm = () => {
    setStatusName("");
    setStatusColor("#1976d2");
    setIsDefault(false);
    setIsActive(true);
};
    
const handleSave = async () => {
  if (!statusName.trim()) {
    enqueueSnackbar("Status name is required", {
      variant: "warning",
    });
    return;
  }

  try {
  const payload = {
    status_name: statusName.trim(),
    status_color: statusColor,
    is_default,
    is_active,
};

if (mode === "add") {
    await addCustomerStatus(payload);

    enqueueSnackbar("Customer status added successfully", {
        variant: "success",
    });
} else {
    await updateCustomerStatus(selectedStatus.id, payload);

    enqueueSnackbar("Customer status updated successfully", {
        variant: "success",
    });
}



resetForm();

    onClose();

    if (onSuccess) {
      onSuccess();
    }

  } catch (error) {
    console.error(error);

    enqueueSnackbar(
      error.response?.data?.message || "Something went wrong",
      {
        variant: "error",
      }
    );
  }
};

useEffect(() => {
    if (mode === "edit" && selectedStatus) {
        setStatusName(selectedStatus.status_name);
        setStatusColor(selectedStatus.status_color);
        setIsDefault(selectedStatus.is_default);
        setIsActive(selectedStatus.is_active);
    } else {
        resetForm();
    }
}, [mode, selectedStatus]);

    
    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
        <DialogTitle>
            {mode === "add" ? "Add Customer Status" : "Edit Customer Status"}
        </DialogTitle>

        <DialogContent>
            <TextField
            fullWidth
            margin="normal"
            label="Status Name"
            value={statusName}
            onChange={(e) => setStatusName(e.target.value)}
            />
<TextField
    fullWidth
    margin="normal"
    label="Status Color"
    type="color"
    value={statusColor}
    onChange={(e) => setStatusColor(e.target.value)}
     InputLabelProps={{
        shrink: true,
    }}
/>

            <FormControlLabel
            control={
                <Checkbox
                checked={is_default}
                onChange={(e) => setIsDefault(e.target.checked)}
                />
            }
            label="Default Status"
            />

            <FormControlLabel
            control={
                <Checkbox
                checked={is_active}
                onChange={(e) => setIsActive(e.target.checked)}
                />
            }
            label="Active"
            />
        </DialogContent>

        <DialogActions>
          <Button
    onClick={() => {
        resetForm();
        onClose();
    }}
>
    Cancel
</Button>

        
            <Button variant="contained" onClick={handleSave} disabled={loading}>
            {/* {loading ? "Saving..." : "Save"} */}
            {mode === "add" ? "Save" : "Update"}
            </Button>
        </DialogActions>
        </Dialog>
    );
    }

    export default StatusDialog;
