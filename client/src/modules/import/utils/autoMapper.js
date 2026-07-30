import { FIELD_DICTIONARY } from "./fieldDictionary";




export const autoMapColumns = (excelColumns, crmFields) => {

    const mapping = {};

    excelColumns.forEach((excelColumn) => {

        const normalizedExcel = excelColumn
            .toLowerCase()
            .replace(/[_\s-]/g, "");

        const matchedField = crmFields.find((field) => {

            const key = field.field_key.toLowerCase();

            const label = field.field_label
                .toLowerCase()
                .replace(/[_\s-]/g, "");

            if (
                normalizedExcel === key ||
                normalizedExcel === label
            ) {
                return true;
            }

            const synonyms = FIELD_DICTIONARY[key] || [];

            return synonyms.some((word) => {

                return word.replace(/[_\s-]/g, "") === normalizedExcel;

            });

        });

        if (matchedField) {

            mapping[excelColumn] = matchedField.field_key;

        }

    });

    return mapping;

};