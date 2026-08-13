const db = require("../config/db");

const getFieldDefinitions = async () => {
    const result = await db.query(`
        SELECT
            id,
            field_key,
            field_label,
            field_group,
            field_type,
            storage_key,
            is_required,
            is_visible
        FROM company_customer_fields
        WHERE is_visible = true
        ORDER BY display_order ASC
    `);

    return result.rows;
};

const getFieldByKey = async (fieldKey) => {
    const result = await db.query(
        `
        SELECT
            id,
            field_key,
            field_label,
            field_group,
            field_type,
            storage_key,
            is_required,
            is_visible
        FROM company_customer_fields
        WHERE field_key = $1
          AND is_visible = true
        LIMIT 1
        `,
        [fieldKey]
    );

    return result.rows[0] || null;
};

const getFieldsByKeys = async (fieldKeys) => {
    if (!Array.isArray(fieldKeys) || fieldKeys.length === 0) {
        return [];
    }

    const result = await db.query(
        `
        SELECT
            id,
            field_key,
            field_label,
            field_group,
            field_type,
            storage_key,
            is_required,
            is_visible
        FROM company_customer_fields
        WHERE field_key = ANY($1::text[])
          AND is_visible = true
        `,
        [fieldKeys]
    );

    return result.rows;
};

module.exports = {
    getFieldDefinitions,
    getFieldByKey,
    getFieldsByKeys,
};