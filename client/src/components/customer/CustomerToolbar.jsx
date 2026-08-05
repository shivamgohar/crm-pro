import { Box, MenuItem, TextField } from "@mui/material";
import SearchBar from "../SearchBar";

export default function CustomerToolbar({
  search,
  onSearch,

  searchBy,
  setSearchBy,

  status,
  setStatus,

  area,
  setArea,

  sort,
  setSort,
}) {
  return (


    

    <Box
      sx={{
        display: "flex",
        gap: 2,
        mb: 3,
        flexWrap: "wrap",
        alignItems: "center",
      }}
    >
      <Box sx={{ flex: 1, minWidth: 300 }}>
        <SearchBar
          value={search}
          onChange={onSearch}
          placeholder="Search customer..."
        />
      </Box>

      <TextField
        select
        size="small"
        value={searchBy}
        onChange={(e) => setSearchBy(e.target.value)}
      >
        <MenuItem value="all">All</MenuItem>
        <MenuItem value="name">Name</MenuItem>
        <MenuItem value="customer_code">Customer Code</MenuItem>
        <MenuItem value="phone">Phone</MenuItem>
        <MenuItem value="address">Address</MenuItem>
      </TextField>

      <TextField
        select
        size="small"
        value={status}
        onChange={(e) => setStatus(e.target.value)}
      >
        <MenuItem value="all">All Status</MenuItem>
        <MenuItem value="active">Active</MenuItem>
      </TextField>

      <TextField
        select
        size="small"
        value={area}
        onChange={(e) => setArea(e.target.value)}
      >
        <MenuItem value="all">All Area</MenuItem>
      </TextField>

      <TextField
        select
        size="small"
        value={sort}
        onChange={(e) => setSort(e.target.value)}
      >
        <MenuItem value="name">A-Z</MenuItem>
        <MenuItem value="latest">Newest</MenuItem>
        <MenuItem value="oldest">Oldest</MenuItem>
      </TextField>
    </Box>
  );
}