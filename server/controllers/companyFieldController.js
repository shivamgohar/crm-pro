const pool = require("../config/db");

// Get All Fields
const getCustomerFields = async (req, res) => {
    try {

        const result = await pool.query(`
            SELECT *
            FROM company_customer_fields
            ORDER BY display_order ASC
        `);

        res.json(result.rows);

    } catch (error) {

        console.error(error);

        res.status(500).json({
            message: "Failed to fetch customer fields"
        });

    }
};




// Add New Field
const addCustomerField = async (req, res) => {
    try {

        const {
            field_label,
            field_type,
            field_group,
            show_in,
            is_required,
            is_visible
        } = req.body;

        // Validation
        if (!field_label) {
            return res.status(400).json({
                message: "Field label is required"
            });
        }

        // Create field_key automatically
        const field_key = field_label
            .trim()
            .toLowerCase()
            .replace(/\s+/g, "_");

        // Check duplicate
        const exists = await pool.query(
            `SELECT id FROM company_customer_fields WHERE field_key=$1`,
            [field_key]
        );

        if (exists.rows.length > 0) {
            return res.status(400).json({
                message: "Field already exists"
            });
        }

        // Next display order
        const orderResult = await pool.query(`
            SELECT COALESCE(MAX(display_order),0)+1 AS next_order
            FROM company_customer_fields
        `);

        const display_order = orderResult.rows[0].next_order;

        // Insert
        const result = await pool.query(
            `
            INSERT INTO company_customer_fields
            (
                 field_key,
    field_label,
    field_type,
    field_group,
    show_in,
    is_required,
    is_visible,
    display_order
)
VALUES
($1,$2,$3,$4,$5,$6,$7,$8)
RETURNING *
            `,
            [
                field_key,
                field_label,
                field_type || "text",
                field_group || "customer",
                JSON.stringify(show_in || {
                    list: true,
                    profile: true,
                    dialog: true,
                    import: true,
                    search: true
                }),
                is_required || false,
                is_visible ?? true,
                display_order
            ]
        );

        res.status(201).json(result.rows[0]);

    } catch (error) {

        console.error(error);

        res.status(500).json({
            message: "Failed to add customer field"
        });

    }
};

// Update Customer Field
const updateCustomerField = async (req, res) => {
    try {

        const { id } = req.params;

        const {
            field_label,
            field_type,
            field_group,
            show_in,
            is_required,
            is_visible
        } = req.body;

        // Check field exists
        const field = await pool.query(
            `SELECT * FROM company_customer_fields WHERE id=$1`,
            [id]
        );

        if (field.rows.length === 0) {
            return res.status(404).json({
                message: "Field not found"
            });
        }

        // System fields protection
        if (
            field.rows[0].is_system &&
            is_visible === false
        ) {
            return res.status(400).json({
                message: "System fields cannot be hidden"
            });
        }

        const result = await pool.query(
            `
          UPDATE company_customer_fields
SET
    field_label = $1,
    field_type = $2,
    field_group = $3,
    show_in = $4,
    is_required = $5,
    is_visible = $6,
    updated_at = NOW()
WHERE id = $7
RETURNING *
            `,
            [
                field_label,
                field_type,
                field_group,
                JSON.stringify(show_in),
                is_required,
                is_visible,
                id
            ]
        );

        res.json(result.rows[0]);

    } catch (error) {

        console.error(error);

        res.status(500).json({
            message: "Failed to update field"
        });

    }
};

// Hide Customer Field
const hideCustomerField = async (req, res) => {
    try {

        const { id } = req.params;

        // Check field exists
        const field = await pool.query(
            `SELECT * FROM company_customer_fields WHERE id=$1`,
            [id]
        );

        if (field.rows.length === 0) {
            return res.status(404).json({
                message: "Field not found"
            });
        }

        // Protect system fields
        if (field.rows[0].is_system) {
            return res.status(400).json({
                message: "System fields cannot be hidden"
            });
        }

        const result = await pool.query(
            `
            UPDATE company_customer_fields
            SET
                is_visible = FALSE,
                updated_at = NOW()
            WHERE id = $1
            RETURNING *
            `,
            [id]
        );

        res.json(result.rows[0]);

    } catch (error) {

        console.error(error);

        res.status(500).json({
            message: "Failed to hide field"
        });

    }
};

// Reorder Customer Fields
const reorderCustomerFields = async (req, res) => {
    try {

        const { fields } = req.body;

        if (!Array.isArray(fields)) {
            return res.status(400).json({
                message: "Fields array is required"
            });
        }

        for (const field of fields) {
            await pool.query(
                `
                UPDATE company_customer_fields
                SET display_order = $1,
                    updated_at = NOW()
                WHERE id = $2
                `,
                [field.display_order, field.id]
            );
        }

        res.json({
            message: "Display order updated successfully"
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            message: "Failed to update display order"
        });

    }
};

// Get All Fields (Admin)
const getAllCustomerFields = async (req, res) => {

    try {

        const result = await pool.query(`
            SELECT *
            FROM company_customer_fields
            ORDER BY display_order
        `);

        res.json(result.rows);

    } catch (error) {

        console.error(error);

        res.status(500).json({
            message: "Failed to fetch fields"
        });

    }

};


// Restore Field
const restoreCustomerField = async (req, res) => {

    try {

        const { id } = req.params;

        const result = await pool.query(`
            UPDATE company_customer_fields
            SET
                is_visible = TRUE,
                updated_at = NOW()
            WHERE id = $1
            RETURNING *
        `, [id]);

        res.json(result.rows[0]);

    } catch (error) {

        console.error(error);

        res.status(500).json({
            message: "Failed to restore field"
        });

    }

};

const getImportCustomerFields = async (req, res) => {
    try {

        const result = await pool.query(`
     SELECT
        id,
        field_key,
        field_label,
        field_type,
        is_required,
        is_visible,
        display_order,
        is_system
    FROM company_customer_fields
    WHERE is_visible = true
    ORDER BY display_order ASC
    `);

        res.json(result.rows);

    } catch (error) {

        console.error(error);

        res.status(500).json({
            message: "Failed to fetch import fields"
        });

    }
};


// const getDialogCustomerFields = async (req, res) => {
//   try {

//     const result = await pool.query(`
//       SELECT *
//       FROM company_customer_fields
//       WHERE
//         field_group = 'customer'
//         AND is_visible = true
//         AND (show_in->>'dialog')::boolean = true
//       ORDER BY display_order ASC
//     `);

//     res.json(result.rows);

//   } catch (error) {

//     console.error(error);

//     res.status(500).json({
//       message: "Failed to fetch dialog fields",
//     });

//   }
// };

const getDialogCustomerFields = async (req, res) => {
    try {
        const result = await pool.query(`
      SELECT *
      FROM company_customer_fields
      WHERE
        is_visible = true
        AND (show_in->>'dialog')::boolean = true
      ORDER BY display_order ASC
    `);

        res.json(result.rows);

    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Failed to fetch dialog fields"
        });
    }
};

const getListCustomerFields = async (req, res) => {

    const result = await pool.query(`
    SELECT *
    FROM company_customer_fields
   WHERE
    is_visible = true
    AND field_group = 'customer'
    AND show_in->>'list'='true'
    AND field_key NOT IN ('customer_name', 'customer_code')

    ORDER BY display_order
  `);

    res.json(result.rows);

};


const getProfileCustomerFields = async (req, res) => {

    const result = await pool.query(`
        SELECT *
        FROM company_customer_fields
        WHERE
            is_visible = true
            AND show_in->>'profile' = 'true'
        ORDER BY display_order
    `);

    res.json(result.rows);

};

module.exports = {
    getCustomerFields,
    addCustomerField,
    updateCustomerField,
    hideCustomerField,
    reorderCustomerFields,
    getAllCustomerFields,
    restoreCustomerField,
    getImportCustomerFields,
    getDialogCustomerFields,
    getListCustomerFields,
    getProfileCustomerFields
};