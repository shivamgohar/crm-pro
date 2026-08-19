import { TextField, InputAdornment } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";

export default function SearchBar({
  value,
  onChange,
  placeholder,
}) {
  return (
    <TextField
      fullWidth
      variant="outlined"
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      sx={{
        "& .MuiOutlinedInput-root": {
          borderRadius: 3,
          bgcolor: "background.paper",

          "& fieldset": {
            borderColor: "divider",
          },

          "&:hover fieldset": {
            borderColor: "primary.main",
          },

          "&.Mui-focused fieldset": {
            borderWidth: 2,
            borderColor: "primary.main",
          },
        },

        "& .MuiInputBase-input": {
          color: "text.primary",
        },

        "& .MuiInputBase-input::placeholder": {
          color: "text.secondary",
          opacity: 1,
        },
      }}
      InputProps={{
        startAdornment: (
          <InputAdornment position="start">
            <SearchIcon color="action" />
          </InputAdornment>
        ),
      }}
    />
  );
}