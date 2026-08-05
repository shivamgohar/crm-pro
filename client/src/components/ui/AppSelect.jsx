import { MenuItem, TextField } from "@mui/material";

export default function AppSelect({
  value,
  onChange,
  items,
  sx = {},
}) {
  return (
    <TextField
      select
      size="small"
      value={value}
      onChange={onChange}
      sx={{
        minWidth: 140,
        ...sx,
      }}
    >
      {items.map((item) => (
        <MenuItem
          key={item.value}
          value={item.value}
        >
          {item.label}
        </MenuItem>
      ))}
    </TextField>
  );
}