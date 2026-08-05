import { TextField, InputAdornment } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";

export default function SearchBar({ value, onChange, placeholder }) {
  return (
    <TextField
      fullWidth
      variant="outlined"
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      sx={{
        mb: 3,

        "& .MuiOutlinedInput-root": {
          borderRadius: 3,
          backgroundColor: "#fff",

          "& fieldset": {
            borderColor: "#E5E7EB",
          },

          "&:hover fieldset": {
            borderColor: "#1976d2",
          },

          "&.Mui-focused fieldset": {
            borderWidth: 2,
          },
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
