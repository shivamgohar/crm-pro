const db = require("../config/db");

// Generate a safe field key from label
const generateFieldKey = (label) => {
  return String(label)
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "");
};


// Get all custom fields
const getCustomFields = async (req, res) => {
  try {
    const { module } = req.query;

    let query = `
      SELECT
        id,
        module_key,
        field_key,
        field_label,
        field_type,
        is_required,
        is_unique,
        is_identifier,
        is_searchable,
        is_importable,
        is_visible,
        show_in,
        options,
        display_order,
        is_system,
        created_at,
        updated_at
      FROM custom_fields
    `;

    const params = [];

    if (module) {
      query += ` WHERE module_key = $1`;
      params.push(module);
    }

    query += `
      ORDER BY module_key ASC, display_order ASC, id ASC
    `;

    const result = await db.query(query, params);

    res.json({
      success: true,
      fields: result.rows,
    });

  } catch (error) {
    console.error("Get Custom Fields Error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch custom fields.",
    });
  }
};


// Add custom field
const addCustomField = async (req, res) => {
  try {
    const {
      module_key,
      field_label,
      field_type = "text",
      is_required = false,
      is_unique = false,
      is_identifier = false,
      is_searchable = true,
      is_importable = true,
      is_visible = true,
      show_in,
      options,
    } = req.body;

    if (!module_key) {
      return res.status(400).json({
        success: false,
        message: "Module is required.",
      });
    }

    if (!field_label || !field_label.trim()) {
      return res.status(400).json({
        success: false,
        message: "Field label is required.",
      });
    }

    const allowedTypes = [
      "text",
      "textarea",
      "number",
      "date",
      "datetime",
      "email",
      "phone",
      "dropdown",
      "checkbox",
      "currency",
      "url",
    ];

    if (!allowedTypes.includes(field_type)) {
      return res.status(400).json({
        success: false,
        message: "Invalid field type.",
      });
    }

    if (field_type === "dropdown") {
      if (!Array.isArray(options) || options.length === 0) {
        return res.status(400).json({
          success: false,
          message: "Dropdown options are required.",
        });
      }
    }

    let fieldKey = generateFieldKey(field_label);

    if (!fieldKey) {
      return res.status(400).json({
        success: false,
        message: "Invalid field label.",
      });
    }

    // Make field key unique inside module
    const existingKeyResult = await db.query(
      `
      SELECT field_key
      FROM custom_fields
      WHERE module_key = $1
        AND field_key LIKE $2
      ORDER BY id DESC
      `,
      [module_key, `${fieldKey}%`]
    );

    if (existingKeyResult.rows.length > 0) {
      const existingKeys = new Set(
        existingKeyResult.rows.map((row) => row.field_key)
      );

      if (existingKeys.has(fieldKey)) {
        let counter = 2;

        while (existingKeys.has(`${fieldKey}_${counter}`)) {
          counter++;
        }

        fieldKey = `${fieldKey}_${counter}`;
      }
    }

    // Next display order
    const orderResult = await db.query(
      `
      SELECT COALESCE(MAX(display_order), 0) + 1 AS next_order
      FROM custom_fields
      WHERE module_key = $1
      `,
      [module_key]
    );

    const displayOrder = Number(
      orderResult.rows[0].next_order
    );

    const defaultShowIn = {
      form: true,
      list: true,
      import: true,
      search: true,
      profile: true,
    };

    const finalShowIn = {
      ...defaultShowIn,
      ...(show_in || {}),
    };

    const result = await db.query(
      `
      INSERT INTO custom_fields
      (
        module_key,
        field_key,
        field_label,
        field_type,
        is_required,
        is_unique,
        is_identifier,
        is_searchable,
        is_importable,
        is_visible,
        show_in,
        options,
        display_order,
        is_system
      )
      VALUES
      (
        $1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,false
      )
      RETURNING *
      `,
      [
        module_key,
        fieldKey,
        field_label.trim(),
        field_type,
        Boolean(is_required),
        Boolean(is_unique),
        Boolean(is_identifier),
        Boolean(is_searchable),
        Boolean(is_importable),
        Boolean(is_visible),
        JSON.stringify(finalShowIn),
        options ? JSON.stringify(options) : null,
        displayOrder,
      ]
    );

    res.status(201).json({
      success: true,
      message: "Custom field created successfully.",
      field: result.rows[0],
    });

  } catch (error) {
    console.error("Add Custom Field Error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to create custom field.",
    });
  }
};


// Update custom field
const updateCustomField = async (req, res) => {
  try {
    const { id } = req.params;

    const {
      field_label,
      field_type,
      is_required,
      is_unique,
      is_identifier,
      is_searchable,
      is_importable,
      is_visible,
      show_in,
      options,
    } = req.body;

    const existingResult = await db.query(
      `
      SELECT *
      FROM custom_fields
      WHERE id = $1
      LIMIT 1
      `,
      [id]
    );

    if (existingResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Custom field not found.",
      });
    }

    const existing = existingResult.rows[0];

    if (existing.is_system) {
      return res.status(400).json({
        success: false,
        message: "System fields cannot be modified.",
      });
    }

    if (!field_label || !field_label.trim()) {
      return res.status(400).json({
        success: false,
        message: "Field label is required.",
      });
    }

    if (field_type === "dropdown") {
      if (!Array.isArray(options) || options.length === 0) {
        return res.status(400).json({
          success: false,
          message: "Dropdown options are required.",
        });
      }
    }

    const result = await db.query(
      `
      UPDATE custom_fields
      SET
        field_label = $1,
        field_type = $2,
        is_required = $3,
        is_unique = $4,
        is_identifier = $5,
        is_searchable = $6,
        is_importable = $7,
        is_visible = $8,
        show_in = $9,
        options = $10,
        updated_at = NOW()
      WHERE id = $11
      RETURNING *
      `,
      [
        field_label.trim(),
        field_type || existing.field_type,
        Boolean(is_required),
        Boolean(is_unique),
        Boolean(is_identifier),
        Boolean(is_searchable),
        Boolean(is_importable),
        Boolean(is_visible),
        JSON.stringify(
          show_in || existing.show_in
        ),
        options
          ? JSON.stringify(options)
          : existing.options,
        id,
      ]
    );

    res.json({
      success: true,
      message: "Custom field updated successfully.",
      field: result.rows[0],
    });

  } catch (error) {
    console.error("Update Custom Field Error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to update custom field.",
    });
  }
};


// Archive custom field
const archiveCustomField = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await db.query(
      `
      UPDATE custom_fields
      SET
        is_visible = false,
        updated_at = NOW()
      WHERE id = $1
        AND is_system = false
      RETURNING *
      `,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Custom field not found or cannot be archived.",
      });
    }

    res.json({
      success: true,
      message: "Custom field archived successfully.",
      field: result.rows[0],
    });

  } catch (error) {
    console.error("Archive Custom Field Error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to archive custom field.",
    });
  }
};


// Restore custom field
const restoreCustomField = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await db.query(
      `
      UPDATE custom_fields
      SET
        is_visible = true,
        updated_at = NOW()
      WHERE id = $1
        AND is_system = false
      RETURNING *
      `,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Custom field not found or cannot be restored.",
      });
    }

    res.json({
      success: true,
      message: "Custom field restored successfully.",
      field: result.rows[0],
    });

  } catch (error) {
    console.error("Restore Custom Field Error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to restore custom field.",
    });
  }
};


// Reorder fields
// Reorder custom fields
const reorderCustomFields = async (req, res) => {
  const client = await db.connect();

  try {
    const { fields } = req.body;

    if (!Array.isArray(fields)) {
      return res.status(400).json({
        success: false,
        message: "Fields must be an array.",
      });
    }

    if (fields.length === 0) {
      return res.json({
        success: true,
        message: "No fields to reorder.",
      });
    }

    // Validate incoming field IDs and display orders
    for (const item of fields) {
      if (
        !Number.isInteger(Number(item.id)) ||
        !Number.isInteger(Number(item.display_order)) ||
        Number(item.display_order) < 1
      ) {
        return res.status(400).json({
          success: false,
          message: "Invalid field reorder data.",
        });
      }
    }

    await client.query("BEGIN");

    /*
     * First verify that all requested fields exist
     * and belong to the same module.
     */
    const ids = fields.map((item) => Number(item.id));

    const existingResult = await client.query(
      `
      SELECT
        id,
        module_key,
        is_system
      FROM custom_fields
      WHERE id = ANY($1::int[])
      FOR UPDATE
      `,
      [ids]
    );

    if (existingResult.rows.length !== fields.length) {
      await client.query("ROLLBACK");

      return res.status(400).json({
        success: false,
        message: "One or more custom fields were not found.",
      });
    }

    const modules = new Set(
      existingResult.rows.map((row) => row.module_key)
    );

    if (modules.size !== 1) {
      await client.query("ROLLBACK");

      return res.status(400).json({
        success: false,
        message: "Fields from different modules cannot be reordered together.",
      });
    }

    /*
     * System fields cannot be reordered through this endpoint.
     */
    const hasSystemField = existingResult.rows.some(
      (row) => row.is_system
    );

    if (hasSystemField) {
      await client.query("ROLLBACK");

      return res.status(400).json({
        success: false,
        message: "System fields cannot be reordered.",
      });
    }

    /*
     * Update all fields using the same PostgreSQL connection.
     */
    for (const item of fields) {
      await client.query(
        `
        UPDATE custom_fields
        SET
          display_order = $1,
          updated_at = NOW()
        WHERE id = $2
          AND is_system = false
        `,
        [
          Number(item.display_order),
          Number(item.id),
        ]
      );
    }

    await client.query("COMMIT");

    res.json({
      success: true,
      message: "Custom fields reordered successfully.",
    });

  } catch (error) {
    try {
      await client.query("ROLLBACK");
    } catch (rollbackError) {
      console.error(
        "Custom field reorder rollback error:",
        rollbackError
      );
    }

    console.error(
      "Reorder Custom Fields Error:",
      error
    );

    res.status(500).json({
      success: false,
      message: "Failed to reorder custom fields.",
    });

  } finally {
    client.release();
  }
};


// Get custom field values for a record
const getCustomFieldValues = async (req, res) => {
  try {
    const { module, recordId } = req.params;

    if (!module || !recordId) {
      return res.status(400).json({
        success: false,
        message: "Module and record ID are required.",
      });
    }

    const result = await db.query(
      `
      SELECT
        cf.id AS field_id,
        cf.module_key,
        cf.field_key,
        cf.field_label,
        cf.field_type,
        cf.is_required,
        cf.is_unique,
        cf.is_identifier,
        cf.show_in,
        cfv.record_id,
        cfv.field_value
      FROM custom_fields cf
      LEFT JOIN custom_field_values cfv
        ON cfv.field_id = cf.id
       AND cfv.record_id = $2
      WHERE cf.module_key = $1
        AND cf.is_visible = true
      ORDER BY cf.display_order ASC, cf.id ASC
      `,
      [module, Number(recordId)]
    );

    res.json({
      success: true,
      values: result.rows,
    });

  } catch (error) {
    console.error(
      "Get Custom Field Values Error:",
      error
    );

    res.status(500).json({
      success: false,
      message: "Failed to fetch custom field values.",
    });
  }
};


// Save / update custom field values for a record
const saveCustomFieldValues = async (req, res) => {
  try {
    const { module, recordId } = req.params;
    const { values } = req.body;

    if (!module || !recordId) {
      return res.status(400).json({
        success: false,
        message: "Module and record ID are required.",
      });
    }

    if (!Array.isArray(values)) {
      return res.status(400).json({
        success: false,
        message: "Values must be an array.",
      });
    }

    const recordIdNumber = Number(recordId);

    if (!Number.isInteger(recordIdNumber)) {
      return res.status(400).json({
        success: false,
        message: "Invalid record ID.",
      });
    }

    const client = await db.connect();

    try {
      await client.query("BEGIN");

      // Validate all fields belong to requested module
      const fieldIds = values
        .map((item) => Number(item.field_id))
        .filter((id) => Number.isInteger(id));

      if (fieldIds.length > 0) {
        const fieldResult = await client.query(
          `
          SELECT
            id,
            field_type,
            is_visible
          FROM custom_fields
          WHERE id = ANY($1::int[])
            AND module_key = $2
          `,
          [fieldIds, module]
        );

        if (fieldResult.rows.length !== fieldIds.length) {
          await client.query("ROLLBACK");

          return res.status(400).json({
            success: false,
            message: "One or more custom fields are invalid for this module.",
          });
        }
      }

      for (const item of values) {
        const fieldId = Number(item.field_id);

        if (!Number.isInteger(fieldId)) {
          continue;
        }

        const fieldValue =
          item.field_value === null ||
          item.field_value === undefined
            ? null
            : String(item.field_value);

        await client.query(
          `
          INSERT INTO custom_field_values
          (
            field_id,
            record_id,
            field_value,
            updated_at
          )
          VALUES
          ($1, $2, $3, NOW())
          ON CONFLICT (field_id, record_id)
          DO UPDATE SET
            field_value = EXCLUDED.field_value,
            updated_at = NOW()
          `,
          [
            fieldId,
            recordIdNumber,
            fieldValue,
          ]
        );
      }

      await client.query("COMMIT");

      res.json({
        success: true,
        message: "Custom field values saved successfully.",
      });

    } catch (error) {
      await client.query("ROLLBACK");
      throw error;

    } finally {
      client.release();
    }

  } catch (error) {
    console.error(
      "Save Custom Field Values Error:",
      error
    );

    res.status(500).json({
      success: false,
      message: "Failed to save custom field values.",
    });
  }
};


module.exports = {
  getCustomFields,
  addCustomField,
  updateCustomField,
  archiveCustomField,
  restoreCustomField,
  reorderCustomFields,
  getCustomFieldValues,
  saveCustomFieldValues,
};