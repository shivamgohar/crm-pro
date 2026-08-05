import { Box,  } from "@mui/material";
// import SearchBar from "../SearchBar";
// import AppToolbar from "../ui/AppToolbar";
import {
  AppToolbar,
  AppSearch,
  AppSelect,
} from "../ui";

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
  <AppToolbar>
<Box
 sx={{
      flex: 1,
      mr: 2,
    }}
>
    <AppSearch
      value={search}
      onChange={onSearch} 
      placeholder="Search customer..."
    />
</Box>

<Box   sx={{
      display: "flex",
      alignItems: "center",
      gap: 1,
      flexShrink: 0,
    }} >
    <AppSelect
      value={searchBy}
      onChange={(e) => setSearchBy(e.target.value)}
      items={[
        { value: "all", label: "All" },
        { value: "name", label: "Name" },
        { value: "customer_code", label: "Customer Code" },
        { value: "phone", label: "Phone" },
        { value: "address", label: "Address" },
      ]}
    />

    <AppSelect
      value={status}
      onChange={(e) => setStatus(e.target.value)}
      items={[
        { value: "all", label: "All Status" },
        { value: "active", label: "Active" },
      ]}
    />

    <AppSelect
      value={area}
      onChange={(e) => setArea(e.target.value)}
      items={[
        { value: "all", label: "All Area" },
      ]}
    />

    <AppSelect
      value={sort}
      onChange={(e) => setSort(e.target.value)}
      items={[
        { value: "name", label: "A-Z" },
        { value: "latest", label: "Newest" },
        { value: "oldest", label: "Oldest" },
      ]}
    />

    </Box>

  </AppToolbar>
);
}