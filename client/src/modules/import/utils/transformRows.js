export const transformRows = (rows, mapping) => {

    return rows.map((row) => {

        const transformed = {};

        Object.entries(mapping).forEach(([excelColumn, crmField]) => {

            transformed[crmField] = row[excelColumn];

        });

        return transformed;

    });

};