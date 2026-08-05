import {
  Paper,
  Table,
  TableContainer,
} from "@mui/material";

export default function AppTable({
  children,
}) {
  return (
    <TableContainer
      component={Paper}
      elevation={0}
    >
      <Table>
        {children}
      </Table>
    </TableContainer>
  );
}