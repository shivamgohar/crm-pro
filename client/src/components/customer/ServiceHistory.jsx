import {
  Box,
  Typography,
  Button,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  TextField,
  InputAdornment,
   ToggleButton,
  ToggleButtonGroup,
   FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";

// import AddIcon from "@mui/icons-material/Add";

import SearchIcon from "@mui/icons-material/Search";
import { useState  } from "react";

const ServiceHistory = ({ services,onEditService }) => {
  const [search, setSearch] = useState("");
  const [recordType, setRecordType] = useState("ALL");
  const [engineerFilter, setEngineerFilter] = useState("ALL");
  const [serviceFilter, setServiceFilter] = useState("ALL");
  const [sortBy, setSortBy] = useState("NEWEST");
  // const [searchText, setSearchText] = useState("");

  console.log("Services received:", services);

  // const services = [
  //   {
  //     id: 1,
  //     serviceDate: "18 Jul 2026",
  //     serviceType: "Installation",
  //     engineer: "Rohan",
  //     amount: 700,
  //     pending: 0,
  //     status: "Completed",
  //   },
  //   {
  //     id: 2,
  //     serviceDate: "20 Jul 2026",
  //     serviceType: "AMC Service",
  //     engineer: "Amit",
  //     amount: 500,
  //     pending: 200,
  //     status: "Pending",
  //   },
  // ];

  console.log("ServiceHistory props:", services);

const keyword = search.trim().toLowerCase();

const engineers = [
  "ALL",
  ...new Set(
    services
      .map((service) => service.engineer)
      .filter(Boolean)
  ),
];

const serviceTypes = [
  "ALL",
  ...new Set(
    services
      .map((service) => service.service)
      .filter(Boolean)
  ),
];

const filteredServices = services.filter((service) => {

  // Record Type Filter
  if (
    recordType !== "ALL" &&
    service.source !== recordType
  ) {
    return false;
  }

  if (
  engineerFilter !== "ALL" &&
  service.engineer !== engineerFilter
) {
  return false;
}

if (
  serviceFilter !== "ALL" &&
  service.service !== serviceFilter
) {
  return false;
}

  // Search Empty
  if (!keyword) {
    return true;
  }

  // Search Filter
  return (
    String(service.service ?? "")
      .toLowerCase()
      .includes(keyword) ||

    String(service.engineer ?? "")
      .toLowerCase()
      .includes(keyword) ||

    String(service.remark ?? "")
      .toLowerCase()
      .includes(keyword)
  );

});


const sortedServices = [...filteredServices];

sortedServices.sort((a, b) => {

  switch (sortBy) {

    case "NEWEST":
      return new Date(b.service_date) - new Date(a.service_date);

    case "OLDEST":
      return new Date(a.service_date) - new Date(b.service_date);

    case "HIGH_AMOUNT":
      return Number(b.amount) - Number(a.amount);

    case "LOW_AMOUNT":
      return Number(a.amount) - Number(b.amount);

    default:
      return 0;
  }

});



  return (
    <Box>
      {/* Header */}
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={2}
      >
        <Typography variant="h6" fontWeight={600}>
          Service Records
        </Typography>
      </Box>

      <Divider />

      <Box
        mt={2}
        mb={2}
        display="flex"
        justifyContent="space-between"
        alignItems="center"
      >
        <TextField
          size="small"
          placeholder="Search service, engineer, remark..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          sx={{ width: 350 }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon fontSize="small" />
              </InputAdornment>
            ),
          }}
        />
      </Box>

      <Box sx={{ mt: 2, mb: 2 }}>
  <ToggleButtonGroup
    value={recordType}
    exclusive
    onChange={(event, value) => {
      if (value !== null) {
        setRecordType(value);
      }
    }}
    size="small"
  >
    <ToggleButton value="ALL">
      All
    </ToggleButton>

    <ToggleButton value="CRM">
      CRM
    </ToggleButton>

    <ToggleButton value="EXCEL">
      Imported
    </ToggleButton>
    <FormControl
  size="small"
  sx={{ minWidth: 180, ml: 2 }}
>
  <InputLabel>Engineer</InputLabel>

  <Select
    value={engineerFilter}
    label="Engineer"
    onChange={(e) => setEngineerFilter(e.target.value)}
  >
    {engineers.map((engineer) => (
      <MenuItem
        key={engineer}
        value={engineer}
      >
        {engineer}
      </MenuItem>
    ))}
  </Select>
</FormControl>

<FormControl
  size="small"
  sx={{ minWidth: 180, ml: 2 }}
>
  <InputLabel>Service</InputLabel>

  <Select
    value={serviceFilter}
    label="Service"
    onChange={(e) => setServiceFilter(e.target.value)}
  >
    {serviceTypes.map((service) => (
      <MenuItem
        key={service}
        value={service}
      >
        {service}
      </MenuItem>
    ))}
  </Select>
</FormControl>

<FormControl
  size="small"
  sx={{ minWidth: 180, ml: 2 }}
>
  <InputLabel>Sort By</InputLabel>

  <Select
    value={sortBy}
    label="Sort By"
    onChange={(e) => setSortBy(e.target.value)}
  >
    <MenuItem value="NEWEST">Newest First</MenuItem>

    <MenuItem value="OLDEST">Oldest First</MenuItem>

    <MenuItem value="HIGH_AMOUNT">Highest Amount</MenuItem>

    <MenuItem value="LOW_AMOUNT">Lowest Amount</MenuItem>
  </Select>
</FormControl>
  </ToggleButtonGroup>
</Box>

      <TableContainer
        component={Paper}
        elevation={0}
        sx={{ mt: 2, overflowX: "auto" }}
      >
        <Table
          stickyHeader
          sx={{
            minWidth: 1100,
          }}
        >
          <TableHead>
            <TableRow >
              <TableCell>Date</TableCell>
              <TableCell>Service</TableCell>
              <TableCell>Engineer</TableCell>
              <TableCell align="right">Amount</TableCell>
              <TableCell align="right">Pending</TableCell>
              <TableCell>Type</TableCell>
              <TableCell>Status</TableCell>
              <TableCell align="center">Action</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            
   {filteredServices.length === 0 ? (

    <TableRow >
      <TableCell colSpan={8} align="center" sx={{ py: 4 }}>
        <Typography color="text.secondary">
          No service found
        </Typography>
      </TableCell>
    </TableRow>

  ) : (

    sortedServices.map((service) => (
              <TableRow key={`${service.source}-${service.id}-${service.service_date}`}>
                <TableCell>
                  {" "}
                  {new Date(service.service_date).toLocaleDateString("en-IN")}
                </TableCell>

                <TableCell>{service.service}</TableCell>

                <TableCell>{service.engineer}</TableCell>

                <TableCell align="right">
                  ₹{Number(service.amount).toFixed(2)}
                </TableCell>

                <TableCell align="right">₹{service.pending ?? 0}</TableCell>

                <TableCell>
                  {service.source === "CRM" ? (
                    <Chip label="CRM" color="success" size="small" />
                  ) : (
                    <Chip label="Imported" color="default" size="small" />
                  )}
                </TableCell>

                <TableCell>{service.remark}</TableCell>

                <TableCell>
                 <Button
  variant="contained"
  onClick={() => onEditService(service)}
>
  Edit
</Button>
                </TableCell>
              </TableRow>
                      ))
  )}

          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default ServiceHistory;
