import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";

export default function PreviewStep({
  rows,
  selectedFile,
  selectedSheet,
}) {

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

    <Typography sx={{ px: 2, pt: 2 }}>
  <strong>File:</strong> {selectedFile?.name}
</Typography>

<Typography sx={{ px: 2 }}>
  <strong>Sheet:</strong> {selectedSheet}
</Typography>

<Typography sx={{ px: 2 }}>
  <strong>Total Rows:</strong> {rows.length}
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