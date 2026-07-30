import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";

export default function PreviewStep({ rows }) {

  if (!rows.length) {
    return (
      <Typography mt={3}>
        No data found.
      </Typography>
    );
  }

  const columns = Object.keys(rows[0]);

  return (
    <Paper sx={{ mt: 4, overflow: "auto" }}>

      <Typography sx={{ p: 2 }}>
        Total Rows : {rows.length}
      </Typography>

      <Table size="small">

        <TableHead>
          <TableRow>

            {columns.map((column) => (
              <TableCell key={column}>
                <strong>{column}</strong>
              </TableCell>
            ))}

          </TableRow>
        </TableHead>

        <TableBody>

          {rows.slice(0, 10).map((row, index) => (

            <TableRow key={index}>

              {columns.map((column) => (

                <TableCell key={column}>
                  {row[column]}
                </TableCell>

              ))}

            </TableRow>

          ))}

        </TableBody>

      </Table>

    </Paper>
  );
}