const db = require("../config/db");

// ==========================================
// AUTO IDENTIFIER
// ==========================================

const formatIdentifier = (number) => {
  const numericPart = number % 100000;
  const prefixNumber = Math.floor(number / 100000);

  let value = prefixNumber;
  let letters = "";

  do {
    letters =
      String.fromCharCode(65 + (value % 26)) +
      letters;

    value = Math.floor(value / 26) - 1;
  } while (value >= 0);

  // Minimum 2 letters
  while (letters.length < 2) {
    letters = "A" + letters;
  }

  return `${letters}-${String(numericPart).padStart(5, "0")}`;
};

const generateIdentifier = async () => {
  const result = await db.query(
    `
    UPDATE identifier_generators
    SET
      current_number = current_number + 1,
      updated_at = CURRENT_TIMESTAMP
    WHERE generator_key = 'default'
    RETURNING current_number
    `
  );

  if (result.rows.length === 0) {
    throw new Error(
      "Identifier generator not configured"
    );
  }

  const number =
    Number(result.rows[0].current_number) - 1;

  return formatIdentifier(number);
};

// ==========================================
// EXCEL DATE CONVERTER
// ==========================================

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

// ==========================================
// SAVE DYNAMIC CUSTOMER FIELDS
// ==========================================

const saveDynamicFields = async (
  customerId,
  row,
  fieldMap
) => {
  for (const [fieldKey, fieldValue] of Object.entries(row)) {

    // Standard fields skip
    if (
      [
        "customer_code",
        "customer_name",
        "phone",
        "email",
      ].includes(fieldKey)
    ) {
      continue;
    }

    // Google Sheet metadata skip
    if (fieldKey === "__google_row") {
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

    console.log(
      fieldKey,
      fieldValue,
      value
    );

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

// ==========================================
// SAVE IMPORTED SERVICE
// ==========================================
const saveImportedService = async ({
  customerCode,
  row,
  sourceMeta,
}) => {

  const serviceDate = convertExcelDate(
    row.date
  );

  const serviceName = String(
    row.date_of_instalation || ""
  ).trim();

  const engineer = String(
    row.engineer || ""
  ).trim();

  const remark = String(
    row.remark || ""
  ).trim();

  const amount = Number(
    row.amount || 0
  );

  // ========================================
  // GOOGLE SHEET → CHECK EXISTING ROW
  // ========================================

  if (
    sourceMeta?.source === "google_sheet" &&
    sourceMeta?.spreadsheetId &&
    row.__google_row
  ) {

    const existingMapping =
      await db.query(
        `
        SELECT
          service_id
        FROM customer_external_sources
        WHERE source_type = $1
          AND external_id = $2
          AND sheet_name = $3
          AND external_row = $4
        LIMIT 1
        `,
        [
          "google_sheet",
          sourceMeta.spreadsheetId,
          sourceMeta.sheetName || "Sheet1",
          row.__google_row,
        ]
      );

    // ======================================
    // EXISTING SERVICE → UPDATE
    // ======================================

    if (
      existingMapping.rows.length > 0 &&
      existingMapping.rows[0].service_id
    ) {

      const serviceId =
        existingMapping.rows[0].service_id;

      // Get existing payment information.
      // We must NOT overwrite CRM payments.
      const existingService =
        await db.query(
          `
          SELECT
            received_amount
          FROM services
          WHERE id = $1
          LIMIT 1
          `,
          [serviceId]
        );

      if (existingService.rows.length === 0) {
        throw new Error(
          `Service ${serviceId} not found`
        );
      }

      const receivedAmount =
        Number(
          existingService.rows[0]
            .received_amount || 0
        );

      // ====================================
      // CALCULATE PAYMENT STATUS
      // ====================================

      let pendingAmount = 0;
      let status = "Pending";

      if (amount > 0) {

        pendingAmount = Math.max(
          amount - receivedAmount,
          0
        );

        if (receivedAmount >= amount) {
          status = "Completed";
        }

      } else {

        // Do not mark zero-value
        // imported services as Completed.
        pendingAmount = 0;
        status = "Pending";
      }

      // ====================================
      // UPDATE EXISTING SERVICE
      // ====================================

      await db.query(
        `
        UPDATE services
        SET
          service_date = $1,
          service = $2,
          engineer = $3,
          remark = $4,
          amount = $5,
          customer_code = $6,
          pending_amount = $7,
          status = $8,
          updated_at = CURRENT_TIMESTAMP
        WHERE id = $9
        `,
        [
          serviceDate || null,
          serviceName,
          engineer,
          remark,
          amount,
          customerCode,
          pendingAmount,
          status,
          serviceId,
        ]
      );

      console.log(
        "Google Service Updated:",
        {
          googleRow:
            row.__google_row,

          serviceId,

          amount,

          receivedAmount,

          pendingAmount,

          status,
        }
      );

      return {
        serviceId,
        created: false,
        updated: true,
      };
    }
  }

  // ========================================
  // NEW SERVICE → INSERT
  // ========================================

  const serviceResult =
    await db.query(
      `
      INSERT INTO services
      (
        service_date,
        service,
        engineer,
        remark,
        amount,
        customer_code,
        received_amount,
        pending_amount,
        status
      )
      VALUES
      (
        $1,
        $2,
        $3,
        $4,
        $5,
        $6,
        0,
        CASE
          WHEN $5 > 0 THEN $5
          ELSE 0
        END,
        'Pending'
      )
      RETURNING id
      `,
      [
        serviceDate || null,
        serviceName,
        engineer,
        remark,
        amount,
        customerCode,
      ]
    );

  const serviceId =
    serviceResult.rows[0].id;

  console.log(
    "Google Service Created:",
    {
      googleRow:
        row.__google_row,

      serviceId,

      amount,
    }
  );

  return {
    serviceId,
    created: true,
    updated: false,
  };
};
// ==========================================
// IMPORT CUSTOMERS
// ==========================================

const importCustomersService = async (
  rows,
  sourceMeta = null
) => {

  let importedCount = 0;
  let updatedCount = 0;
  let skippedCount = 0;
  let failedCount = 0;

  const errors = [];

  // ========================================
  // CREATE IMPORT BATCH
  // ========================================

  const batchResult =
    await db.query(
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
        sourceMeta?.source || "excel",

        sourceMeta?.source ===
        "google_sheet"
          ? "Google Sheet Import"
          : "Excel Import",

        rows.length,
      ]
    );

  const importBatchId =
    batchResult.rows[0].id;

  console.log(
    "Import Batch ID:",
    importBatchId
  );

  console.log(
    "Total Rows :",
    rows.length
  );

  // ========================================
  // COMPANY FIELDS
  // ========================================

  const companyFields =
    await db.query(
      `
      SELECT
        id,
        field_key
      FROM company_customer_fields
      `
    );

  const fieldMap = {};

  companyFields.rows.forEach(
    (field) => {
      fieldMap[field.field_key] =
        field.id;
    }
  );

  // ========================================
  // PROCESS ROWS
  // ========================================

  for (const row of rows) {

    try {

      let customerCode =
        String(
          row.customer_code || ""
        ).trim();

      let customerId = null;

      // ====================================
      // 1. CUSTOMER CODE AVAILABLE
      // ====================================

      if (customerCode) {

        const existingCustomer =
          await db.query(
            `
            SELECT id
            FROM customers
            WHERE customer_code = $1
            LIMIT 1
            `,
            [customerCode]
          );

        if (
          existingCustomer.rows.length >
          0
        ) {
          customerId =
            existingCustomer.rows[0].id;
        }
      }

      // ====================================
      // 2. CUSTOMER CODE MISSING
      //    CHECK DUPLICATE BY PHONE
      // ====================================

      if (
        !customerId &&
        !customerCode
      ) {

        const phone =
          String(
            row.phone || ""
          ).trim();

        if (phone) {

          const existingCustomer =
            await db.query(
              `
              SELECT
                id,
                customer_code
              FROM customers
              WHERE phone = $1
                AND is_deleted = false
              LIMIT 1
              `,
              [phone]
            );

          if (
            existingCustomer.rows.length >
            0
          ) {

            customerId =
              existingCustomer.rows[0].id;

            customerCode =
              existingCustomer.rows[0]
                .customer_code;
          }
        }
      }

      // ====================================
      // 3. NEW CUSTOMER
      // ====================================

      if (!customerId) {

        // Generate code ONLY when
        // actually creating a customer
        if (!customerCode) {
          customerCode =
            await generateIdentifier();
        }

        const customer =
          await db.query(
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

              String(
                row.phone || ""
              ),

              row.location || "",

              customerCode,

              sourceMeta?.source ||
                "excel",

              importBatchId,
            ]
          );

        customerId =
          customer.rows[0].id;

        importedCount++;

      } else {

        // ==================================
        // 4. EXISTING CUSTOMER → UPDATE
        // ==================================

        await db.query(
          `
          UPDATE customers
          SET
            name = $1,
            phone = $2,
            address = $3
          WHERE id = $4
          `,
          [
            row.customer_name,

            String(
              row.phone || ""
            ),

            row.location || "",

            customerId,
          ]
        );

        updatedCount++;
      }

      // ====================================
      // 5. SAVE DYNAMIC CUSTOMER FIELDS
      // ====================================

      await saveDynamicFields(
        customerId,
        row,
        fieldMap
      );

      // ====================================
      // 6. GOOGLE MAPPING CHECK
      // ====================================

      console.log(
        "GOOGLE MAPPING CHECK:",
        {
          source:
            sourceMeta?.source,

          spreadsheetId:
            sourceMeta?.spreadsheetId,

          sheetName:
            sourceMeta?.sheetName,

          googleRow:
            row.__google_row,
        }
      );

      // ====================================
      // 7. GOOGLE SHEET SERVICE
      // ====================================

      let serviceResult = null;

      if (
        sourceMeta?.source ===
          "google_sheet" &&
        sourceMeta?.spreadsheetId &&
        row.__google_row
      ) {

        serviceResult =
          await saveImportedService({
            customerCode,
            row,
            sourceMeta,
          });
      }

      // ====================================
      // 8. GOOGLE SOURCE MAPPING
      // ====================================

      if (
        sourceMeta?.source ===
          "google_sheet" &&
        sourceMeta?.spreadsheetId &&
        row.__google_row
      ) {

        await db.query(
          `
          INSERT INTO customer_external_sources
          (
            customer_id,
            service_id,
            source_type,
            external_id,
            external_row,
            sheet_name
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
          ON CONFLICT DO NOTHING
          `,
          [
            customerId,

            serviceResult?.serviceId ||
              null,

            "google_sheet",

            sourceMeta.spreadsheetId,

            row.__google_row,

            sourceMeta.sheetName ||
              "Sheet1",
          ]
        );
      }

    } catch (error) {

      failedCount++;

      console.error(
        "Customer:",
        row.customer_code ||
          row.customer_name
      );

      console.error(
        error.message
      );

      errors.push({
        customer_code:
          row.customer_code ||
          null,

        customer_name:
          row.customer_name,

        error:
          error.message,
      });
    }
  }

  // ========================================
  // RESULT
  // ========================================

  return {

    success: true,

    total: rows.length,

    imported: importedCount,

    updated: updatedCount,

    failed: failedCount,

    errors,
  };
};

// ==========================================
// EXPORTS
// ==========================================

module.exports = {
  importCustomersService,
  saveDynamicFields,
  saveImportedService,
  convertExcelDate,
};