import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";

import { AppButton } from ".";

export default function AppDialog({
  open,
  title,
  children,
  onClose,
  onSubmit,
  submitText = "Save",
  cancelText = "Cancel",
  loading = false,
  maxWidth = "md",
}) {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth={maxWidth}
    >
      <DialogTitle>{title}</DialogTitle>

      <DialogContent dividers>
        {children}
      </DialogContent>

      <DialogActions>

        <AppButton
          variant="outlined"
          onClick={onClose}
        >
          {cancelText}
        </AppButton>

        <AppButton
          onClick={onSubmit}
          disabled={loading}
        >
          {loading ? "Saving..." : submitText}
        </AppButton>

      </DialogActions>
    </Dialog>
  );
}