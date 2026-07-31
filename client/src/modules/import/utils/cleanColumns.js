export function cleanColumns(rows) {
  return rows.map((row) => {
    const cleanedRow = {};

    Object.entries(row).forEach(([key, value]) => {
      // Remove __EMPTY columns
      if (key.startsWith("__EMPTY")) {
        return;
      }

      // Remove blank column names
      if (!key.trim()) {
        return;
      }

      cleanedRow[key] = value;
    });

    return cleanedRow;
  });
}