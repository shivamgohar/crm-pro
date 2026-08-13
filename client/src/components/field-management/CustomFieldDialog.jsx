import { useEffect, useState } from "react";
import { useSnackbar } from "notistack";
import {
  addCustomField,
  updateCustomField,
} from "../../services/customFieldService";

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
  Divider,
  Box,
} from "@mui/material";

function CustomFieldDialog({
  open,
  onClose,
  onSuccess,
  mode = "add",
  field = null,
}) {
  const { enqueueSnackbar } = useSnackbar();

  const [fieldLabel, setFieldLabel] = useState("");
  const [module, setModule] = useState("customer");
  const [fieldType, setFieldType] = useState("text");

  const [required, setRequired] = useState(false);
  const [unique, setUnique] = useState(false);
  const [identifier, setIdentifier] = useState(false);
  const [searchable, setSearchable] = useState(true);
  const [importable, setImportable] = useState(true);

  const [showIn, setShowIn] = useState({
    list: true,
    form: true,
    profile: true,
    search: true,
    import: true,
  });

  useEffect(() => {
    if (mode === "edit" && field) {
      setFieldLabel(field.field_label || "");
      setModule(field.module || "customer");
      setFieldType(field.field_type || "text");

      setRequired(Boolean(field.is_required));
      setUnique(Boolean(field.is_unique));
      setIdentifier(Boolean(field.is_identifier));
      setSearchable(Boolean(field.is_searchable));
      setImportable(Boolean(field.is_importable));

      setShowIn(
        field.show_in || {
          list: true,
          form: true,
          profile: true,
          search: true,
          import: true,
        }
      );
    } else {
      resetForm();
    }
  }, [open, mode, field]);

  const resetForm = () => {
    setFieldLabel("");
    setModule("customer");
    setFieldType("text");

    setRequired(false);
    setUnique(false);
    setIdentifier(false);
    setSearchable(true);
    setImportable(true);

    setShowIn({
      list: true,
      form: true,
      profile: true,
      search: true,
      import: true,
    });
  };

  const handleSave = async () => {
    if (!fieldLabel.trim()) {
      enqueueSnackbar("Field Label is required", {
        variant: "warning",
      });
      return;
    }

    // if (identifier && !unique) {
    //   enqueueSnackbar(
    //     "Record Identifier should also be Unique",
    //     {
    //       variant: "warning",
    //     }
    //   );
    //   return;
    // }

    /*
      API/database integration will be added after
      the universal field structure is finalized.
    */

  const fieldData = {
  module_key: module,
  field_label: fieldLabel.trim(),
  field_type: fieldType,

  is_required: required,
  is_unique: unique,
  is_identifier: identifier,
  is_searchable: searchable,
  is_importable: importable,
  is_visible: true,

  show_in: showIn,
};

try {
  if (mode === "edit" && field?.id) {
    await updateCustomField(
      field.id,
      fieldData
    );
  } else {
    await addCustomField(fieldData);
  }

  enqueueSnackbar(
    mode === "edit"
      ? "Custom field updated successfully"
      : "Custom field created successfully",
    {
      variant: "success",
    }
  );

  onSuccess?.();
  onClose();

} catch (error) {
  console.error(error);

  enqueueSnackbar(
    error.response?.data?.message ||
      "Failed to save custom field",
    {
      variant: "error",
    }
  );
}

    enqueueSnackbar(
      mode === "add"
        ? "Field configuration ready"
        : "Field configuration updated",
      {
        variant: "success",
      }
    );

    onSuccess?.();
    onClose();
  };

  const updateShowIn = (key, value) => {
    setShowIn((previous) => ({
      ...previous,
      [key]: value,
    }));
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="sm"
    >
      <DialogTitle>
        {mode === "add"
          ? "Add Custom Field"
          : "Edit Custom Field"}
      </DialogTitle>

      <DialogContent dividers>
        <TextField
          fullWidth
          margin="normal"
          label="Field Label"
          placeholder="e.g. GST Number"
          value={fieldLabel}
          onChange={(e) => setFieldLabel(e.target.value)}
        />

        <FormControl fullWidth margin="normal">
          <InputLabel>Module</InputLabel>

          <Select
            value={module}
            label="Module"
            onChange={(e) => setModule(e.target.value)}
          >
            <MenuItem value="customer">
              Customer
            </MenuItem>

            <MenuItem value="service">
              Service
            </MenuItem>

            <MenuItem value="product">
              Product
            </MenuItem>

            <MenuItem value="order">
              Order
            </MenuItem>

            <MenuItem value="payment">
              Payment
            </MenuItem>
          </Select>
        </FormControl>

        <FormControl fullWidth margin="normal">
          <InputLabel>Field Type</InputLabel>

          <Select
            value={fieldType}
            label="Field Type"
            onChange={(e) => setFieldType(e.target.value)}
          >
            <MenuItem value="text">
              Text
            </MenuItem>

            <MenuItem value="textarea">
              Long Text
            </MenuItem>

            <MenuItem value="number">
              Number
            </MenuItem>

            <MenuItem value="currency">
              Currency
            </MenuItem>

            <MenuItem value="date">
              Date
            </MenuItem>

            <MenuItem value="datetime">
              Date & Time
            </MenuItem>

            <MenuItem value="email">
              Email
            </MenuItem>

            <MenuItem value="phone">
              Phone
            </MenuItem>

            <MenuItem value="dropdown">
              Select
            </MenuItem>

            <MenuItem value="multiselect">
              Multi Select
            </MenuItem>

            <MenuItem value="checkbox">
              Checkbox
            </MenuItem>
          </Select>
        </FormControl>

        <Divider sx={{ my: 2 }} />

        <Typography
          variant="subtitle1"
          fontWeight={600}
          mb={1}
        >
          Field Rules
        </Typography>

        <Box>
          <FormControlLabel
            control={
              <Checkbox
                checked={required}
                onChange={(e) =>
                  setRequired(e.target.checked)
                }
              />
            }
            label="Required"
          />

          <FormControlLabel
            control={
              <Checkbox
                checked={unique}
                onChange={(e) =>
                  setUnique(e.target.checked)
                }
              />
            }
            label="Unique"
          />

          <FormControlLabel
            control={
              <Checkbox
                checked={identifier}
                onChange={(e) =>
                  setIdentifier(e.target.checked)
                }
              />
            }
            label="Record Identifier"
          />

          <FormControlLabel
            control={
              <Checkbox
                checked={searchable}
                onChange={(e) =>
                  setSearchable(e.target.checked)
                }
              />
            }
            label="Searchable"
          />

          <FormControlLabel
            control={
              <Checkbox
                checked={importable}
                onChange={(e) =>
                  setImportable(e.target.checked)
                }
              />
            }
            label="Available for Import"
          />
        </Box>

        <Divider sx={{ my: 2 }} />

        <Typography
          variant="subtitle1"
          fontWeight={600}
          mb={1}
        >
          Show In
        </Typography>

        <FormControlLabel
          control={
            <Checkbox
              checked={showIn.list}
              onChange={(e) =>
                updateShowIn("list", e.target.checked)
              }
            />
          }
          label="List"
        />

        <FormControlLabel
          control={
            <Checkbox
              checked={showIn.form}
              onChange={(e) =>
                updateShowIn("form", e.target.checked)
              }
            />
          }
          label="Form"
        />

        <FormControlLabel
          control={
            <Checkbox
              checked={showIn.profile}
              onChange={(e) =>
                updateShowIn("profile", e.target.checked)
              }
            />
          }
          label="Profile"
        />

        <FormControlLabel
          control={
            <Checkbox
              checked={showIn.search}
              onChange={(e) =>
                updateShowIn("search", e.target.checked)
              }
            />
          }
          label="Search"
        />

        <FormControlLabel
          control={
            <Checkbox
              checked={showIn.import}
              onChange={(e) =>
                updateShowIn("import", e.target.checked)
              }
            />
          }
          label="Import"
        />
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>
          Cancel
        </Button>

        <Button
          variant="contained"
          onClick={handleSave}
        >
          {mode === "add"
            ? "Save Field"
            : "Update Field"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default CustomFieldDialog;