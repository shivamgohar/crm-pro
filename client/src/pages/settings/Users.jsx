import {
  Box,
  Typography,
  Button,
  Divider,
  Paper,
  TextField,
  InputAdornment,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
} from "@mui/material";

import SearchIcon from "@mui/icons-material/Search";
import PersonAddAlt1Icon from "@mui/icons-material/PersonAddAlt1";

function Users() {
  return (
    <Box>
      {/* Header */}
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={2}
      >
        <Box>
          <Typography variant="h5" fontWeight={700}>
            User Management
          </Typography>

          <Typography
            variant="body2"
            color="text.secondary"
          >
            Manage system users
          </Typography>
        </Box>

        <Button
          variant="contained"
          startIcon={<PersonAddAlt1Icon />}
        >
          Add User
        </Button>
      </Box>

      <Divider sx={{ mb: 3 }} />

      {/* Search */}
      <TextField
        placeholder="Search users..."
        size="small"
        sx={{ width: 350, mb: 3 }}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon fontSize="small" />
            </InputAdornment>
          ),
        }}
      />

      {/* Table */}
      <Paper elevation={0}>
        <Table>

          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Mobile</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Role</TableCell>
              <TableCell>Status</TableCell>
              <TableCell align="center">
                Action
              </TableCell>
            </TableRow>
          </TableHead>

          <TableBody>

            <TableRow>

              <TableCell
                colSpan={6}
                align="center"
                sx={{ py: 6 }}
              >
                <Typography color="text.secondary">
                  No users found
                </Typography>
              </TableCell>

            </TableRow>

          </TableBody>

        </Table>
      </Paper>
    </Box>
  );
}

export default Users;