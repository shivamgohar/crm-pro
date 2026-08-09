import {
  Box,
  Paper,
  Typography,
  Button,
  Checkbox,
  TextField,
  Stack,
  Divider,
  CircularProgress,
  Alert,
  Tabs,
  Tab,
  InputAdornment,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  TableContainer,
  IconButton,
  Tooltip,
  Chip,
} from "@mui/material";

import {
  RestoreFromTrash,
  DeleteForever,
  DeleteSweep,
  Search,
  ChevronLeft,
  ChevronRight,
} from "@mui/icons-material";

import { useEffect, useState } from "react";

import AppBreadcrumb from "../../components/ui/AppBreadcrumb";

import {
  getTrashedCustomers,
  moveCustomersToTrash,
  restoreCustomers,
  permanentlyDeleteCustomers,
  getActiveCustomersForTrash,
} from "../../services/trashService";

function Trash() {
  const [customers, setCustomers] = useState([]);

  // const [selectedIds, setSelectedIds] = useState([]);
  const [selectedCustomers, setSelectedCustomers] = useState([]);
  const selectedIds = selectedCustomers.map((customer) => customer.id);

  const [tab, setTab] = useState(0);

  const [search, setSearch] = useState("");

  const [page, setPage] = useState(1);

  const [pagination, setPagination] = useState({
    currentPage: 1,
    pageSize: 20,
    totalRecords: 0,
    totalPages: 0,
  });

  const [loading, setLoading] = useState(false);

  const [errorMessage, setErrorMessage] = useState("");

  const [successMessage, setSuccessMessage] = useState("");

  const loadCustomers = async () => {
    try {
      setLoading(true);
      setErrorMessage("");

      const params = {
        search,
        page,
        limit: 20,
      };

      const data =
        tab === 0
          ? await getActiveCustomersForTrash(params)
          : await getTrashedCustomers(params);

      setCustomers(data.customers || []);

      setPagination(
        data.pagination || {
          currentPage: 1,
          pageSize: 20,
          totalRecords: 0,
          totalPages: 0,
        },
      );
    } catch (error) {
      console.error(error);

      setErrorMessage(
        error.response?.data?.message || "Failed to load customers",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCustomers();
  }, [tab, page]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setPage(1);
      // setSelectedIds([]);
      loadCustomers();
    }, 400);

    return () => clearTimeout(timer);
  }, [search]);

  const handleTabChange = (_, newValue) => {
    setTab(newValue);
    setPage(1);
    setSearch("");
    // setSelectedIds([]);
    setErrorMessage("");
    setSuccessMessage("");
  };

  const handleSelectAll = (event) => {
    if (event.target.checked) {
      setSelectedCustomers((previous) => {
        const existingIds = new Set(previous.map((customer) => customer.id));

        const newCustomers = customers.filter(
          (customer) => !existingIds.has(customer.id),
        );

        return [...previous, ...newCustomers];
      });
    } else {
      const currentPageIds = new Set(customers.map((customer) => customer.id));

      setSelectedCustomers((previous) =>
        previous.filter((customer) => !currentPageIds.has(customer.id)),
      );
    }
  };

  const handleSelectCustomer = (customer) => {
    setSelectedCustomers((previous) => {
      const alreadySelected = previous.some((item) => item.id === customer.id);

      if (alreadySelected) {
        return previous.filter((item) => item.id !== customer.id);
      }

      return [...previous, customer];
    });
  };

  const handleRemoveSelected = (id) => {
    setSelectedCustomers((previous) =>
      previous.filter((customer) => customer.id !== id),
    );
  };

  const allSelected =
    customers.length > 0 &&
    customers.every((customer) =>
      selectedCustomers.some((selected) => selected.id === customer.id),
    );
  const handleMoveToTrash = async () => {
    if (selectedIds.length === 0) {
      return;
    }

    const confirmed = window.confirm(
      `Move ${selectedIds.length} customer(s) to Trash?`,
    );

    if (!confirmed) {
      return;
    }

    try {
      const response = await moveCustomersToTrash(selectedIds);

      setSuccessMessage(
        response.message || "Customers moved to trash successfully",
      );

      setSelectedCustomers([]);

      await loadCustomers();
    } catch (error) {
      console.error(error);

      setErrorMessage(
        error.response?.data?.message || "Failed to move customers to trash",
      );
    }
  };

  const handleRestore = async () => {
    if (selectedIds.length === 0) {
      return;
    }

    try {
      const response = await restoreCustomers(selectedIds);

      setSuccessMessage(response.message || "Customers restored successfully");

      setSelectedCustomers([]);

      await loadCustomers();
    } catch (error) {
      console.error(error);

      setErrorMessage(
        error.response?.data?.message || "Failed to restore customers",
      );
    }
  };

  const handlePermanentDelete = async () => {
    if (selectedIds.length === 0) {
      return;
    }

    const confirmed = window.confirm(
      `PERMANENTLY delete ${selectedIds.length} customer(s)? This action cannot be undone.`,
    );

    if (!confirmed) {
      return;
    }

    try {
      const response = await permanentlyDeleteCustomers(selectedIds);

      setSuccessMessage(response.message || "Customers permanently deleted");

      setSelectedCustomers([]);

      await loadCustomers();
    } catch (error) {
      console.error(error);

      setErrorMessage(
        error.response?.data?.message ||
          "Failed to permanently delete customers",
      );
    }
  };

  const handlePreviousPage = () => {
    if (page > 1) {
      setPage((previous) => previous - 1);
    }
  };

  const handleNextPage = () => {
    if (page < pagination.totalPages) {
      setPage((previous) => previous + 1);
    }
  };

  return (
    <Box>
      <AppBreadcrumb
        items={[
          {
            label: "Settings",
            path: "/settings",
          },
          {
            label: "Data Management",
            path: "/settings/data-management",
          },
          {
            label: "Trash",
          },
        ]}
      />

      <Typography variant="h4" fontWeight={700} mb={3}>
        Trash
      </Typography>

      <Paper sx={{ p: 3 }}>
        <Typography variant="h6" mb={1}>
          Customer Data
        </Typography>

        <Typography variant="body2" color="text.secondary" mb={3}>
          Manage active and deleted customers safely.
        </Typography>

        <Tabs value={tab} onChange={handleTabChange} sx={{ mb: 3 }}>
          <Tab label="Active Customers" />
          <Tab label="Trash" />
        </Tabs>

        {errorMessage && (
          <Alert
            severity="error"
            sx={{ mb: 2 }}
            onClose={() => setErrorMessage("")}
          >
            {errorMessage}
          </Alert>
        )}

        {successMessage && (
          <Alert
            severity="success"
            sx={{ mb: 2 }}
            onClose={() => setSuccessMessage("")}
          >
            {successMessage}
          </Alert>
        )}

        <TextField
          fullWidth
          size="small"
          placeholder="Search customer, code, phone..."
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          sx={{ mb: 3 }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search fontSize="small" />
              </InputAdornment>
            ),
          }}
        />

        {selectedIds.length > 0 && (
          <Box
            sx={{
              mb: 2,
              p: 2,
              bgcolor: "action.hover",
              borderRadius: 2,
            }}
          >
            <Stack direction="row" spacing={2} alignItems="stretch">
              {/* Selected Customers */}
              <Box
                sx={{
                  flex: 1,
                  minWidth: 0,
                }}
              >
                <Typography fontWeight={600} mb={1}>
                  {selectedIds.length} selected
                </Typography>

                <Box
                  sx={{
                    display: "flex",
                    flexWrap: "wrap",
                    gap: 1,
                    maxHeight: 110,
                    overflowY: "auto",
                    pr: 1,

                    "&::-webkit-scrollbar": {
                      width: 6,
                    },

                    "&::-webkit-scrollbar-thumb": {
                      borderRadius: 3,
                      backgroundColor: "rgba(0,0,0,0.25)",
                    },
                  }}
                >
                  {selectedCustomers.map((customer) => (
                    <Chip
                      key={customer.id}
                      label={customer.name}
                      size="small"
                      onDelete={() => handleRemoveSelected(customer.id)}
                      sx={{
                        maxWidth: 220,
                      }}
                    />
                  ))}
                </Box>
              </Box>

              {/* Action Buttons */}
              <Box
                sx={{
                  display: "flex",
                  alignItems: "flex-start",
                  flexShrink: 0,
                  pt: 0.5,
                }}
              >
                {tab === 0 ? (
                  <Button
                    variant="contained"
                    color="error"
                    startIcon={<DeleteSweep />}
                    onClick={handleMoveToTrash}
                    sx={{
                      flexShrink: 0,
                      whiteSpace: "nowrap",
                    }}
                  >
                    Move to Trash
                  </Button>
                ) : (
                  <Stack
                    direction="row"
                    spacing={1}
                    sx={{
                      flexShrink: 0,
                    }}
                  >
                    <Button
                      variant="outlined"
                      color="success"
                      startIcon={<RestoreFromTrash />}
                      onClick={handleRestore}
                      sx={{
                        whiteSpace: "nowrap",
                      }}
                    >
                      Restore
                    </Button>

                    <Button
                      variant="contained"
                      color="error"
                      startIcon={<DeleteForever />}
                      onClick={handlePermanentDelete}
                      sx={{
                        whiteSpace: "nowrap",
                      }}
                    >
                      Permanently Delete
                    </Button>
                  </Stack>
                )}
              </Box>
            </Stack>
          </Box>
        )}
        <Divider />

        {loading ? (
          <Box display="flex" justifyContent="center" py={6}>
            <CircularProgress />
          </Box>
        ) : customers.length === 0 ? (
          <Box textAlign="center" py={6}>
            <Typography variant="h6" color="text.secondary">
              {tab === 0 ? "No customers found" : "Trash is empty"}
            </Typography>
          </Box>
        ) : (
          <>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell padding="checkbox">
                      <Checkbox
                        checked={allSelected}
                        onChange={handleSelectAll}
                      />
                    </TableCell>

                    <TableCell>
                      <strong>Customer</strong>
                    </TableCell>

                    <TableCell>
                      <strong>Code</strong>
                    </TableCell>

                    <TableCell>
                      <strong>Phone</strong>
                    </TableCell>

                    {tab === 1 && (
                      <TableCell>
                        <strong>Deleted At</strong>
                      </TableCell>
                    )}
                  </TableRow>
                </TableHead>

                <TableBody>
                  {customers.map((customer) => (
                    <TableRow key={customer.id} hover>
                      <TableCell padding="checkbox">
                        <Checkbox
                          checked={selectedIds.includes(customer.id)}
                          onChange={() => handleSelectCustomer(customer)}
                        />
                      </TableCell>

                      <TableCell>
                        <Typography fontWeight={600}>
                          {customer.name}
                        </Typography>
                      </TableCell>

                      <TableCell>{customer.customer_code || "-"}</TableCell>

                      <TableCell>{customer.phone || "-"}</TableCell>

                      {tab === 1 && (
                        <TableCell>
                          {customer.deleted_at
                            ? new Date(customer.deleted_at).toLocaleString()
                            : "-"}
                        </TableCell>
                      )}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>

            <Divider />

            <Stack
              direction="row"
              justifyContent="space-between"
              alignItems="center"
              sx={{ mt: 2 }}
            >
              <Typography variant="body2" color="text.secondary">
                {pagination.totalRecords} total
              </Typography>

              <Stack direction="row" alignItems="center" spacing={1}>
                <Tooltip title="Previous page">
                  <span>
                    <IconButton
                      onClick={handlePreviousPage}
                      disabled={page <= 1}
                    >
                      <ChevronLeft />
                    </IconButton>
                  </span>
                </Tooltip>

                <Typography variant="body2" fontWeight={600}>
                  Page {pagination.currentPage} of {pagination.totalPages || 1}
                </Typography>

                <Tooltip title="Next page">
                  <span>
                    <IconButton
                      onClick={handleNextPage}
                      disabled={page >= pagination.totalPages}
                    >
                      <ChevronRight />
                    </IconButton>
                  </span>
                </Tooltip>
              </Stack>
            </Stack>
          </>
        )}
      </Paper>
    </Box>
  );
}

export default Trash;
