import {
  Paper,
  Typography,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  FormControl,
  Select,
  MenuItem
} from "@mui/material";

const MappingStep = ({ rows, crmFields, mapping, setMapping }) => {

  if (!rows.length) return null;

  const excelColumns = Object.keys(rows[0]);

  const handleChange = (excelColumn, crmField) => {
    setMapping((prev) => ({
      ...prev,
      [excelColumn]: crmField,
    }));
  };

  return (
    <Paper sx={{ p: 2, mt: 3 }}>
      <Typography variant="h6" gutterBottom>
        Column Mapping
      </Typography>

      <Table>
        <TableHead>
          <TableRow>
            <TableCell><strong>Excel Column</strong></TableCell>
            <TableCell><strong>CRM Field</strong></TableCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {excelColumns.map((column) => (
            <TableRow key={column}>
              <TableCell>{column}</TableCell>

              <TableCell>
                <FormControl fullWidth size="small">
                  <Select
                    value={mapping[column] || ""}
                    onChange={(e) =>
                      handleChange(column, e.target.value)
                    }
                  >
                    <MenuItem value="">
                      -- Select Field --
                    </MenuItem>

                    {crmFields.map((field) => (
                      <MenuItem
                        key={field.id}
                        value={field.field_key}
                      >
                        {field.field_label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Paper>
  );
};

export default MappingStep;
