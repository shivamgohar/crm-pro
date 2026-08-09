const db = require("../config/db");

const importCustomersService = async (rows) => {

  let importedCount = 0;
  let updatedCount = 0;
  let skippedCount = 0;
  let failedCount = 0;
  const errors = [];

  const batchResult = await db.query(
    `
  INSERT INTO import_batches
  (
    source,
    file_name,
    total_rows
  )
  VALUES
  (
    $1,
    $2,
    $3
  )
  RETURNING id
  `,
    [
      "excel",
      "Excel Import",
      rows.length,
    ]
  );

  const importBatchId = batchResult.rows[0].id;

  console.log(
    "Import Batch ID:",
    importBatchId
  );

  console.log("Total Rows :", rows.length);

  const companyFields = await db.query(`
    SELECT id, field_key
    FROM company_customer_fields
`);

  const fieldMap = {};

  companyFields.rows.forEach((field) => {
    fieldMap[field.field_key] = field.id;
  });

  for (const row of rows) {

    try {

      const existingCustomer = await db.query(
        `
                SELECT id
                FROM customers
                WHERE customer_code = $1
                LIMIT 1
                `,
        [
          String(row.customer_code || "")
        ]
      );

      if (existingCustomer.rows.length === 0) {

        // New Customer
        const customer = await db.query(
          `
    INSERT INTO customers
    (
      name,
      phone,
      address,
      customer_code,
      source,
      import_batch_id
    )
    VALUES
    (
      $1,
      $2,
      $3,
      $4,
      $5,
      $6
    )

     RETURNING id
    `,
          [
            row.customer_name,
            String(row.phone || ""),
            row.location || "",
            String(row.customer_code || ""),
            "excel",
             importBatchId,
          ]
        );

        const customerId = customer.rows[0].id;
        await saveDynamicFields(customerId, row, fieldMap);

        importedCount++;

      } else {

        // Existing Customer → Update
        const customer = await db.query(
          `
    UPDATE customers
    SET
      name = $1,
      phone = $2,
      address = $3
    WHERE customer_code = $4
      RETURNING id  
    `,
          [
            row.customer_name,
            String(row.phone || ""),
            row.location || "",
            String(row.customer_code || ""),
          ]
        );
        const customerId = customer.rows[0].id;
        await saveDynamicFields(customerId, row, fieldMap);
        updatedCount++;

        console.log(customerId);
      }

    } catch (error) {

      failedCount++;

      console.error("Customer:", row.customer_code);
      console.error(error.message);

      errors.push({
        customer_code: row.customer_code,
        customer_name: row.customer_name,
        error: error.message,
      });

    }

  }

  return {

    success: true,

    total: rows.length,

    imported: importedCount,

    updated: updatedCount,

    failed: failedCount,

    errors,

  };

};

const convertExcelDate = (value) => {

  if (typeof value !== "number") {
    return value;
  }

  if (!value || value < 1000) {
    return "";
  }

  const date = new Date(
    (value - 25569) * 86400 * 1000
  );

  return date.toISOString().split("T")[0];

};

const saveDynamicFields = async (
  customerId,
  row,
  fieldMap
) => {

  for (const [fieldKey, fieldValue] of Object.entries(row)) {

    // Standard fields skip
    if (
      ["customer_code", "customer_name", "phone", "email"].includes(fieldKey)
    ) {
      continue;
    }

    const fieldId = fieldMap[fieldKey];

    if (!fieldId) {
      continue;
    }

    const value = [
      "date",
      "last_service",
      "date_of_instalation",
    ].includes(fieldKey)
      ? convertExcelDate(fieldValue)
      : String(fieldValue ?? "");

    console.log(fieldKey, fieldValue, value);

    await db.query(
      `
  INSERT INTO customer_field_values
  (
    customer_id,
    field_id,
    field_value
  )
  VALUES
  (
    $1,
    $2,
    $3
  )
  ON CONFLICT (customer_id, field_id)
  DO UPDATE
  SET
    field_value = EXCLUDED.field_value,
    updated_at = CURRENT_TIMESTAMP
  `,
      [
        customerId,
        fieldId,
        value,
      ]
    );

  }

};

module.exports = {
  importCustomersService,
  saveDynamicFields,
  convertExcelDate,
};