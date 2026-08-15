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

// const saveDynamicFields = async (
//   customerId,
//   row,
//   fieldMap
// ) => {
//   for (const [fieldKey, fieldValue] of Object.entries(row)) {

//     // Standard fields skip
//     if (
//       [
//         "customer_code",
//         "customer_name",
//         "phone",
//         "email",
//       ].includes(fieldKey)
//     ) {
//       continue;
//     }

//     // Google Sheet metadata skip
//     if (fieldKey === "__google_row") {
//       continue;
//     }

//     const fieldId = fieldMap[fieldKey];

//     if (!fieldId) {
//       continue;
//     }

//     const value = [
//       "date",
//       "last_service",
//       "date_of_instalation",
//     ].includes(fieldKey)
//       ? convertExcelDate(fieldValue)
//       : String(fieldValue ?? "");

//     console.log(
//       fieldKey,
//       fieldValue,
//       value
//     );

//     await db.query(
//       `
//       INSERT INTO customer_field_values
//       (
//         customer_id,
//         field_id,
//         field_value
//       )
//       VALUES
//       (
//         $1,
//         $2,
//         $3
//       )
//       ON CONFLICT (customer_id, field_id)
//       DO UPDATE
//       SET
//         field_value = EXCLUDED.field_value,
//         updated_at = CURRENT_TIMESTAMP
//       `,
//       [
//         customerId,
//         fieldId,
//         value,
//       ]
//     );
//   }
// };

const saveDynamicFields = async (
  customerId,
  row,
  companyFieldMap,
  customFieldMap
) => {
  for (const [fieldKey, fieldValue] of Object.entries(row)) {

    // Standard customer fields
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

    // Google Sheet metadata
    if (fieldKey === "__google_row") {
      continue;
    }

    // -----------------------------------------
    // CUSTOM FIELD
    // -----------------------------------------

    if (customFieldMap[fieldKey]) {
      const fieldId = customFieldMap[fieldKey];

      const value = [
        "date",
        "last_service",
        "date_of_instalation",
      ].includes(fieldKey)
        ? convertExcelDate(fieldValue)
        : String(fieldValue ?? "");

      await db.query(
        `
        INSERT INTO custom_field_values
        (
          field_id,
          record_id,
          field_value
        )
        VALUES
        (
          $1,
          $2,
          $3
        )
        ON CONFLICT (field_id, record_id)
        DO UPDATE
        SET
          field_value = EXCLUDED.field_value,
          updated_at = CURRENT_TIMESTAMP
        `,
        [
          fieldId,
          customerId,
          value,
        ]
      );

      continue;
    }

    // -----------------------------------------
    // EXISTING COMPANY FIELD
    // -----------------------------------------

    if (companyFieldMap[fieldKey]) {
      const fieldId = companyFieldMap[fieldKey];

      const value = [
        "date",
        "last_service",
        "date_of_instalation",
      ].includes(fieldKey)
        ? convertExcelDate(fieldValue)
        : String(fieldValue ?? "");

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

      continue;
    }
  }
};

// ==========================================
// SAVE DYNAMIC SERVICE FIELDS
// ==========================================
const saveDynamicServiceFields = async (
  serviceId,
  row,
  fieldMap
) => {

  if (!serviceId || !row) {
    return;
  }

  for (const [fieldKey, fieldValue] of Object.entries(row)) {

    if (fieldKey === "__google_row") {
      continue;
    }

    const field = fieldMap[fieldKey];

    if (!field) {
      continue;
    }

    // Sirf service fields
    if (field.field_group !== "service") {
      continue;
    }

    // Core DB field hai
    // Isko service_field_values me save nahi karna
    if (field.storage_key) {
      continue;
    }

    if (
      fieldValue === undefined ||
      fieldValue === null ||
      fieldValue === ""
    ) {
      continue;
    }

    let value = String(fieldValue);

    if (field.field_type === "date") {
      value = convertExcelDate(fieldValue);
    }

    await db.query(
      `
      INSERT INTO service_field_values
      (
        service_id,
        field_id,
        field_value
      )
      VALUES
      ($1, $2, $3)
      ON CONFLICT (service_id, field_id)
      DO UPDATE SET
        field_value = EXCLUDED.field_value,
        updated_at = CURRENT_TIMESTAMP
      `,
      [
        serviceId,
        field.id,
        value,
      ]
    );
  }
};


// ==========================================
// SAVE IMPORTED SERVICE
// ==========================================
// ==========================================
// SAVE IMPORTED SERVICE
// ==========================================
const saveImportedService = async ({
  customerCode,
  row,
  sourceMeta,
}) => {

  if (!row) {
    throw new Error("Import row is required");
  }


  // ========================================
  // LOAD FIELD DEFINITIONS
  // ========================================

  const fieldKeys = Object.keys(row).filter(
    (key) => key !== "__google_row"
  );


  const fieldsResult = await db.query(
    `
    SELECT
      id,
      field_key,
      field_label,
      field_type,
      field_group,
      storage_key,
      is_visible
    FROM company_customer_fields
    WHERE field_key = ANY($1::text[])
      AND is_visible = true
    `,
    [fieldKeys]
  );


  const fieldMap = {};

  fieldsResult.rows.forEach((field) => {
    fieldMap[field.field_key] = field;
  });


  // ========================================
  // SERVICE CORE VALUES
  // ========================================

  const serviceValues = {};


  for (const field of fieldsResult.rows) {

    if (field.field_group !== "service") {
      continue;
    }

    if (!field.storage_key) {
      continue;
    }

    if (!row.hasOwnProperty(field.field_key)) {
      continue;
    }

    const rawValue =
      row[field.field_key];


    if (
      rawValue === undefined ||
      rawValue === null ||
      rawValue === ""
    ) {
      continue;
    }


    let value = rawValue;


    // Date field
    if (
      field.field_type === "date" ||
      field.storage_key === "service_date"
    ) {

      value = convertExcelDate(
        rawValue
      );

    }


    // Number field
    if (
      field.field_type === "number"
    ) {

      value = Number(rawValue);

      if (Number.isNaN(value)) {
        value = 0;
      }

    }


    serviceValues[field.storage_key] =
      value;
  }


  // ========================================
  // AMOUNT
  // ========================================

  const amount =
    serviceValues.amount !== undefined
      ? Number(serviceValues.amount || 0)
      : null;


  // ========================================
  // GOOGLE SHEET → EXISTING SERVICE
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


      // ====================================
      // GET PAYMENT INFORMATION
      // ====================================

      const existingService =
        await db.query(
          `
          SELECT
            received_amount,
            amount,
            pending_amount,
            status
          FROM services
          WHERE id = $1
          LIMIT 1
          `,
          [serviceId]
        );


      if (
        existingService.rows.length === 0
      ) {
        throw new Error(
          `Service ${serviceId} not found`
        );
      }


      const existing =
        existingService.rows[0];


      const receivedAmount =
        Number(
          existing.received_amount || 0
        );


      // Agar sheet me amount mapped hai
      // tabhi payment calculation update karo
      const finalAmount =
        amount !== null
          ? amount
          : Number(existing.amount || 0);


      let pendingAmount =
        Number(
          existing.pending_amount || 0
        );


      let status =
        existing.status || "Pending";


      if (amount !== null) {

        if (finalAmount > 0) {

          pendingAmount =
            Math.max(
              finalAmount -
                receivedAmount,
              0
            );


          status =
            receivedAmount >=
            finalAmount
              ? "Completed"
              : "Pending";

        } else {

          pendingAmount = 0;
          status = "Pending";

        }

      }


      // ====================================
      // BUILD DYNAMIC UPDATE
      // ====================================

      const updateFields = [];
      const updateValues = [];

      let parameterIndex = 1;


      for (
        const [
          storageKey,
          value
        ]
        of Object.entries(serviceValues)
      ) {

        // Security:
        // storage_key sirf actual services
        // table column hona chahiye
        const columnCheck =
          await db.query(
            `
            SELECT 1
            FROM information_schema.columns
            WHERE table_schema = 'public'
              AND table_name = 'services'
              AND column_name = $1
            LIMIT 1
            `,
            [storageKey]
          );


        if (
          columnCheck.rows.length === 0
        ) {
          continue;
        }


        updateFields.push(
          `"${storageKey.replace(
            /"/g,
            '""'
          )}" = $${parameterIndex}`
        );


        updateValues.push(value);

        parameterIndex++;
      }


      // Customer code relationship
      updateFields.push(
        `customer_code = $${parameterIndex}`
      );

      updateValues.push(
        customerCode
      );

      parameterIndex++;


      // Payment fields
      if (amount !== null) {

        updateFields.push(
          `pending_amount = $${parameterIndex}`
        );

        updateValues.push(
          pendingAmount
        );

        parameterIndex++;


        updateFields.push(
          `status = $${parameterIndex}`
        );

        updateValues.push(
          status
        );

        parameterIndex++;
      }


      updateFields.push(
        "updated_at = CURRENT_TIMESTAMP"
      );


      updateValues.push(
        serviceId
      );


      await db.query(
        `
        UPDATE services
        SET
          ${updateFields.join(", ")}
        WHERE id = $${parameterIndex}
        `,
        updateValues
      );


      // ====================================
      // SAVE CUSTOM SERVICE FIELDS
      // ====================================

      await saveDynamicServiceFields(
        serviceId,
        row,
        fieldMap
      );


      console.log(
        "Google Service Updated:",
        {
          googleRow:
            row.__google_row,

          serviceId,

          amount:
            finalAmount,

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
// LEGACY SERVICE DUPLICATE CHECK
// ========================================
// Google mapping nahi mili to check karo ki
// same customer ka purana imported service
// already exist karta hai ya nahi.
//
// Typical case:
// Old imported record:
//   service = ""
//
// Google Sheet:
//   service = "Home Cleaning"
//
// Baaki fields same hain.
// Aise case me NEW service create nahi karna.
// Existing service ko update + Google mapping karna hai.

if (
  sourceMeta?.source === "google_sheet" &&
  sourceMeta?.spreadsheetId &&
  row.__google_row
) {

  const legacyServiceResult =
    await db.query(
      `
      SELECT
        id,
        service,
        service_date,
        engineer,
        amount,
        remark,
        received_amount,
        pending_amount,
        status
      FROM services
      WHERE customer_code = $1
        AND COALESCE(service, '') = ''
        AND COALESCE(engineer, '') = $2
        AND COALESCE(remark, '') = $3
        AND COALESCE(amount, 0) = $4
        AND (
          service_date = $5
          OR (
            service_date IS NULL
            AND $5 IS NULL
          )
        )
      ORDER BY id ASC
      LIMIT 1
      `,
      [
        customerCode,
        String(row.engineer || "").trim(),
        String(row.remark || "").trim(),
        amount !== null ? amount : 0,
        serviceValues.service_date || null,
      ]
    );

  if (legacyServiceResult.rows.length > 0) {

    const legacyService =
      legacyServiceResult.rows[0];

    const serviceId =
      legacyService.id;

    // ====================================
    // BUILD UPDATE
    // ====================================

    const updateFields = [];
    const updateValues = [];

    let parameterIndex = 1;

    for (
      const [
        storageKey,
        value
      ] of Object.entries(serviceValues)
    ) {

      const columnCheck =
        await db.query(
          `
          SELECT 1
          FROM information_schema.columns
          WHERE table_schema = 'public'
            AND table_name = 'services'
            AND column_name = $1
          LIMIT 1
          `,
          [storageKey]
        );

      if (
        columnCheck.rows.length === 0
      ) {
        continue;
      }

      updateFields.push(
        `"${storageKey.replace(
          /"/g,
          '""'
        )}" = $${parameterIndex}`
      );

      updateValues.push(value);

      parameterIndex++;
    }

    // Customer relationship
    updateFields.push(
      `customer_code = $${parameterIndex}`
    );

    updateValues.push(
      customerCode
    );

    parameterIndex++;

    // ====================================
    // PAYMENT CALCULATION
    // ====================================

    if (amount !== null) {

      const receivedAmount =
        Number(
          legacyService.received_amount || 0
        );

      const finalAmount =
        Number(amount);

      const pendingAmount =
        Math.max(
          finalAmount - receivedAmount,
          0
        );

      const status =
        receivedAmount >= finalAmount &&
        finalAmount > 0
          ? "Completed"
          : "Pending";

      updateFields.push(
        `pending_amount = $${parameterIndex}`
      );

      updateValues.push(
        pendingAmount
      );

      parameterIndex++;

      updateFields.push(
        `status = $${parameterIndex}`
      );

      updateValues.push(
        status
      );

      parameterIndex++;
    }

    updateFields.push(
      "updated_at = CURRENT_TIMESTAMP"
    );

    updateValues.push(
      serviceId
    );

    await db.query(
      `
      UPDATE services
      SET
        ${updateFields.join(", ")}
      WHERE id = $${parameterIndex}
      `,
      updateValues
    );

    // ====================================
    // SAVE DYNAMIC SERVICE FIELDS
    // ====================================

    await saveDynamicServiceFields(
      serviceId,
      row,
      fieldMap
    );

    console.log(
      "LEGACY SERVICE REUSED:",
      {
        googleRow:
          row.__google_row,

        serviceId,

        customerCode,

        service:
          serviceValues.service,

        amount,
      }
    );

    return {
      serviceId,
      created: false,
      updated: true,
      reusedLegacy: true,
    };
  }
}



  // ========================================
  // NEW SERVICE → INSERT
  // ========================================

  const coreColumns = [];
  const coreValues = [];
  const placeholders = [];


  let parameterIndex = 1;


  for (
    const [
      storageKey,
      value
    ]
    of Object.entries(serviceValues)
  ) {

    const columnCheck =
      await db.query(
        `
        SELECT 1
        FROM information_schema.columns
        WHERE table_schema = 'public'
          AND table_name = 'services'
          AND column_name = $1
        LIMIT 1
        `,
        [storageKey]
      );


    if (
      columnCheck.rows.length === 0
    ) {
      continue;
    }


    coreColumns.push(
      `"${storageKey.replace(
        /"/g,
        '""'
      )}"`
    );


    coreValues.push(value);


    placeholders.push(
      `$${parameterIndex}`
    );


    parameterIndex++;
  }


  // Customer relationship
  coreColumns.push(
    "customer_code"
  );

  coreValues.push(
    customerCode
  );

  placeholders.push(
    `$${parameterIndex}`
  );

  parameterIndex++;


  // ========================================
// PAYMENT DEFAULTS
// ========================================

// received_amount
coreColumns.push(
  "received_amount"
);

coreValues.push(0);

placeholders.push(
  `$${parameterIndex}`
);

parameterIndex++;


// pending_amount
coreColumns.push(
  "pending_amount"
);

coreValues.push(
  amount !== null
    ? Math.max(amount, 0)
    : 0
);

placeholders.push(
  `$${parameterIndex}`
);

parameterIndex++;


// status
coreColumns.push(
  "status"
);

coreValues.push(
  "Pending"
);

placeholders.push(
  `$${parameterIndex}`
);

parameterIndex++;

  const serviceResult =
    await db.query(
      `
      INSERT INTO services
      (
        ${coreColumns.join(", ")}
      )
      VALUES
      (
        ${placeholders.join(", ")}
      )
      RETURNING id
      `,
      coreValues
    );


  const serviceId =
    serviceResult.rows[0].id;


  // ========================================
  // SAVE CUSTOM SERVICE FIELDS
  // ========================================

  await saveDynamicServiceFields(
    serviceId,
    row,
    fieldMap
  );


  console.log(
    "Google Service Created:",
    {
      googleRow:
        row.__google_row,

      serviceId,

      amount:
        amount !== null
          ? amount
          : 0,
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
  // HELPER: FIND VALUE FROM DIFFERENT
  // COLUMN NAME VARIATIONS
  // ========================================

  const getRowValue = (row, possibleKeys) => {
    if (!row || typeof row !== "object") {
      return null;
    }

    // 1. Direct match first
    for (const key of possibleKeys) {
      if (
        row[key] !== undefined &&
        row[key] !== null &&
        String(row[key]).trim() !== ""
      ) {
        return row[key];
      }
    }

    // 2. Case/space-insensitive match
    const normalizedKeys = Object.keys(row);

    for (const possibleKey of possibleKeys) {
      const target = String(possibleKey)
        .trim()
        .toLowerCase();

      const foundKey = normalizedKeys.find(
        (actualKey) =>
          String(actualKey)
            .trim()
            .toLowerCase() === target
      );

      if (
        foundKey &&
        row[foundKey] !== undefined &&
        row[foundKey] !== null &&
        String(row[foundKey]).trim() !== ""
      ) {
        return row[foundKey];
      }
    }

    return null;
  };

  // ========================================
  // CREATE IMPORT BATCH
  // ========================================

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
      sourceMeta?.source || "excel",

      sourceMeta?.source === "google_sheet"
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

  // const companyFields =
  //   await db.query(
  //     `
  //     SELECT
  //       id,
  //       field_key
  //     FROM company_customer_fields
  //     `
  //   );

  // const fieldMap = {};

  // companyFields.rows.forEach((field) => {
  //   fieldMap[field.field_key] = field.id;
  // });

  const companyFields = await db.query(`
    SELECT
        id,
        field_key
    FROM company_customer_fields
`);

const customFields = await db.query(`
    SELECT
        id,
        field_key
    FROM custom_fields
    WHERE module_key = 'customer'
      AND is_visible = true
      AND is_importable = true
`);

const companyFieldMap = {};
const customFieldMap = {};

companyFields.rows.forEach((field) => {
    companyFieldMap[field.field_key] = field.id;
});

customFields.rows.forEach((field) => {
    customFieldMap[field.field_key] = field.id;
});

  // ========================================
  // PROCESS ROWS
  // ========================================

  for (const originalRow of rows) {
    try {

      // ====================================
      // NORMALIZE CUSTOMER DATA
      // ====================================

      const row = {
        ...originalRow,

        customer_code:
          getRowValue(
            originalRow,
            [
              "customer_code",
              "Customer ID",
              "customer id",
              "Customer Code",
              "customer code",
            ]
          ),

        customer_name:
          getRowValue(
            originalRow,
            [
              "customer_name",
              "Customer Name",
              "customer name",
              "Name",
              "Customer",
            ]
          ),

        phone:
          getRowValue(
            originalRow,
            [
              "phone",
              "Phone",
              "Contact",
              "contact",
              "Mobile",
              "mobile",
            ]
          ),

        location:
          getRowValue(
            originalRow,
            [
              "location",
              "Location",
              "Address",
              "address",
            ]
          ),
      };

      console.log(
        "========================================"
      );

      console.log(
        "GOOGLE/IMPORT ORIGINAL ROW:",
        originalRow
      );

      console.log(
        "NORMALIZED CUSTOMER:",
        {
          customer_code:
            row.customer_code,

          customer_name:
            row.customer_name,

          phone:
            row.phone,

          location:
            row.location,

          google_row:
            row.__google_row,
        }
      );

      // ====================================
      // CUSTOMER NAME VALIDATION
      // ====================================

      if (
        row.customer_name === null ||
        row.customer_name === undefined ||
        String(row.customer_name)
          .trim() === ""
      ) {
        throw new Error(
          "Customer name is missing."
        );
      }

      // ====================================
      // CUSTOMER CODE
      // ====================================

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
          existingCustomer.rows.length > 0
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
            existingCustomer.rows.length > 0
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
              String(
                row.customer_name
              ).trim(),

              String(
                row.phone || ""
              ).trim(),

              String(
                row.location || ""
              ).trim(),

              customerCode,

              sourceMeta?.source ||
                "excel",

              importBatchId,
            ]
          );

        customerId =
          customer.rows[0].id;

        importedCount++;

        console.log(
          "CUSTOMER CREATED:",
          {
            customerId,
            customerCode,
            name: row.customer_name,
          }
        );

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
            String(
              row.customer_name
            ).trim(),

            String(
              row.phone || ""
            ).trim(),

            String(
              row.location || ""
            ).trim(),

            customerId,
          ]
        );

        updatedCount++;

        console.log(
          "CUSTOMER UPDATED:",
          {
            customerId,
            customerCode,
            name: row.customer_name,
          }
        );
      }

      // ====================================
      // 5. SAVE DYNAMIC CUSTOMER FIELDS
      // ====================================

      // await saveDynamicFields(
      //   customerId,
      //   row,
      //   fieldMap
      // );

      await saveDynamicFields(
  customerId,
  row,
  companyFieldMap,
  customFieldMap
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

          customerId,

          customerCode,
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

        console.log(
          "GOOGLE SERVICE RESULT:",
          serviceResult
        );
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

        console.log(
          "GOOGLE SOURCE LINK CREATED:",
          {
            customerId,
            serviceId:
              serviceResult?.serviceId ||
              null,
            googleRow:
              row.__google_row,
          }
        );
      }

    } catch (error) {

      failedCount++;

      console.error(
        "========================================"
      );

      console.error(
        "IMPORT ROW FAILED"
      );

      console.error(
        "Google Row:",
        originalRow?.__google_row
      );

      console.error(
        "Customer:",
        getRowValue(
          originalRow,
          [
            "customer_name",
            "Customer Name",
            "customer name",
            "Name",
            "Customer",
          ]
        )
      );

      console.error(
        "Error:",
        error.message
      );

      console.error(
        "========================================"
      );

      errors.push({
        customer_code:
          getRowValue(
            originalRow,
            [
              "customer_code",
              "Customer ID",
              "Customer Code",
              "customer code",
            ]
          ),

        customer_name:
          getRowValue(
            originalRow,
            [
              "customer_name",
              "Customer Name",
              "customer name",
              "Name",
              "Customer",
            ]
          ),

        google_row:
          originalRow?.__google_row ||
          null,

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

    skipped: skippedCount,

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