export const transformRows = (rows, mapping) => {

    return rows.map((row) => {

        const transformed = {};

        Object.entries(mapping).forEach(([excelColumn, crmField]) => {


             // Skip unmapped columns
      if (!crmField) return;

            transformed[crmField] = row[excelColumn];

        });

        return transformed;

    });

};  