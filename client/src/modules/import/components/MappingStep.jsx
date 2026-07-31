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

import { useSnackbar } from "notistack";

const MappingStep = ({ rows, crmFields, mapping, setMapping, selectedFile,
  selectedSheet,
  totalRows, }) => {
    const { enqueueSnackbar } = useSnackbar();

  if (!rows.length) return null;

  const excelColumns = Object.keys(rows[0]);

const handleChange = (excelColumn, crmField) => {

  // User cleared the selection
  if (crmField === "") {
    setMapping((prev) => {
      const updated = {
        ...prev,
        [excelColumn]: "",
      };

      console.log("Updated Mapping:", updated);

      return updated;
    });

    return;
  }

  // Check duplicate mapping
  const alreadyMapped = Object.entries(mapping).find(
    ([column, field]) =>
      column !== excelColumn && field === crmField
  );

  if (alreadyMapped) {
    enqueueSnackbar("This CRM field is already mapped.", {
      variant: "warning",
    });
    return;
  }

  setMapping((prev) => {
    const updated = {
      ...prev,
      [excelColumn]: crmField,
    };

    console.log("Updated Mapping:", updated);

    return updated;
  });
};


  return (
    <Paper sx={{ p: 2, mt: 3 }}>
      <Typography variant="h6" gutterBottom>
        Column Mapping
      </Typography>

      <Typography variant="body2">
  File: {selectedFile?.name}
</Typography>

<Typography variant="body2">
  Sheet: {selectedSheet}
</Typography>

<Typography variant="body2">
  Rows: {totalRows}
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
