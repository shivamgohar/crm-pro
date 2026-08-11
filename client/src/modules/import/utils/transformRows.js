export const transformRows = (rows, mapping) => {
  return rows.map((row) => {
    const transformed = {};

    Object.entries(mapping).forEach(
      ([excelColumn, crmField]) => {
        if (!crmField) return;

        transformed[crmField] =
          row[excelColumn];
      }
    );

    // Preserve Google Sheet row number
    if (row.__google_row) {
      transformed.__google_row =
        row.__google_row;
    }

    return transformed;
  });
};