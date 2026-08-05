import { TextField } from "@mui/material";

export default function AppTextField(props) {
  return (
    <TextField
      fullWidth
      size="small"
      variant="outlined"
      {...props}
    />
  );
}