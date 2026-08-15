const db = require("../config/db");

const {
  getFieldsByKeys,
} = require("../services/fieldResolver");

const { google } = require("googleapis");



const saveDynamicServiceFields = async (
  serviceId,
  row
) => {

  if (!serviceId || !row) {
    return;
  }

  const fieldKeys = Object.keys(row).filter(
    (key) => key !== "__google_row"
  );

  if (fieldKeys.length === 0) {
    return;
  }

  const fieldsResult = await getFieldsByKeys(fieldKeys);

  for (const field of fieldsResult) {

    // Core database field hai
    // Isko service_field_values me nahi dalna
    if (field.storage_key) {
      continue;
    }

    // Sirf service custom fields
    if (field.field_group !== "service") {
      continue;
    }

    const value = row[field.field_key];

    if (
      value === undefined ||
      value === null ||
      value === ""
    ) {
      continue;
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
                updated_at = NOW()
            `,
      [
        serviceId,
        field.id,
        String(value),
      ]
    );
  }
};

// Add Service
const addService = async (req, res) => {
  try {

    // 1. Sabse pehle request se data lo
    const {
      customer_code,
      service_date,
      service,
      engineer,
      remark,
      amount,
      received_amount,
      pending_amount,
      status,
      products,
    } = req.body;


    // Duplicate product check
    const productIds = products.map(product => product.productId);

    if (new Set(productIds).size !== productIds.length) {
      return res.status(400).json({
        success: false,
        message: "Duplicate products are not allowed."
      });
    }

    // 2. Transaction start
    await db.query("BEGIN");

    // 3. Service insert
    const serviceResult = await db.query(
      `
      INSERT INTO services
      (
        customer_code,
        service_date,
        service,
        engineer,
        remark,
        amount,
        received_amount,
        pending_amount,
        status
      )
      VALUES
      (
        $1,$2,$3,$4,$5,$6,$7,$8,$9
      )
      RETURNING id
      `,
      [
        customer_code,
        service_date,
        service,
        engineer,
        remark,
        amount,
        received_amount,
        pending_amount,
        status,
      ]
    );

    const serviceId = serviceResult.rows[0].id;

    // console.log(serviceId);
    console.log("Service ID:", serviceId);

    for (const product of products) {

      // Product ki price nikalo
      const productResult = await db.query(
        `
    SELECT name, price, stock
    FROM products
    WHERE id = $1
    `,
        [product.productId]
      );

      if (productResult.rows.length === 0) {
        throw new Error(`Product not found: ${product.productId}`);
      }
      const productName = productResult.rows[0].name;
      const unitPrice = productResult.rows[0].price;

      console.log({
        productId: product.productId,
        unitPrice,
      });

      const availableStock = Number(productResult.rows[0].stock);
      const requestedQty = Number(product.quantity);

      if (requestedQty > availableStock) {
        throw new Error(
          `${productName} has only ${availableStock} item(s) in stock.`
        );
      }



      await db.query(
        `
    INSERT INTO service_products
    (
        service_id,
        product_id,
        quantity,
        unit_price
    )
    VALUES
    ($1,$2,$3,$4)
    `,
        [
          serviceId,
          product.productId,
          Number(product.quantity),
          unitPrice,
        ]
      );

      console.log("Inserted Product:", product.productId);

      const updateResult = await db.query(
        `
  UPDATE products
  SET stock = stock - $1
  WHERE id = $2
  RETURNING id, stock
  `,
        [
          Number(product.quantity),
          product.productId,
        ]
      );

      console.log("Stock Updated:", updateResult.rows);

    }

    await db.query("COMMIT");
    console.log("COMMIT SUCCESS");

    res.status(201).json({
      success: true,
      message: "Service added successfully",
      serviceId,
    });


    // console.log(req.body);

  } catch (error) {

    await db.query("ROLLBACK");

    console.error(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


const updateService = async (req, res) => {

  try {

    const { id } = req.params;

    const {

      service_date,
      service,
      engineer,
      remark,
      amount,
      received_amount,
      pending_amount,
      status,

    } = req.body;

    await db.query(
      `
            UPDATE services
            SET

                service_date = $1,
                service = $2,
                engineer = $3,
                remark = $4,
                amount = $5,
                received_amount = $6,
                pending_amount = $7,
                status = $8

            WHERE id = $9
            `,
      [
        service_date,
        service,
        engineer,
        remark,
        amount,
        received_amount,
        pending_amount,
        status,
        id,
      ]
    );

    res.json({
      success: true,
      message: "Service Updated Successfully",
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });

  }

};

const getCustomerSummary = async (req, res) => {
  try {

    const { customerCode } = req.params;

    // console.log("Customer Code:", customerCode);

    const result = await db.query(
      `
      SELECT
        COALESCE(SUM(pending_amount),0) AS pending_amount,
        MAX(service_date) AS last_service,
        COUNT(*) AS total_services
      FROM services
      WHERE customer_code = $1
      `,
      [customerCode]
    );

    // console.log(result.rows);

    const data = result.rows[0];


    const lastService = data.last_service;

    let nextService = null;

    if (lastService) {
      nextService = new Date(lastService);
      nextService.setDate(nextService.getDate() + 90);
    }

    const today = new Date();

    const amcActive = nextService ? nextService >= today : false;

    res.json({
      pendingAmount: Number(data.pending_amount),

      lastService: data.last_service,

      totalServices: Number(data.total_services),

      nextService,

      customerActive: true,

      amcActive,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Server Error",
    });
  }
};


// const syncGoogleSheet = async (req, res) => {
//   try {
//     const {
//       spreadsheetId,
//       sheetName,
//       rows,
//     } = req.body;

//     if (!spreadsheetId) {
//       return res.status(400).json({
//         success: false,
//         message: "Spreadsheet ID is required.",
//       });
//     }

//     if (!sheetName) {
//       return res.status(400).json({
//         success: false,
//         message: "Sheet name is required.",
//       });
//     }

//     if (!Array.isArray(rows)) {
//       return res.status(400).json({
//         success: false,
//         message: "Rows must be an array.",
//       });
//     }

//     let updatedCount = 0;
//     let skippedCount = 0;
//     let failedCount = 0;

//     const errors = [];

//     for (const row of rows) {
//       try {
//         const googleRow = Number(row.__google_row);

//         // Google row number missing
//         if (!googleRow) {
//           skippedCount++;
//           continue;
//         }

//         // Find existing Google → CRM service mapping
//         const mappingResult = await db.query(
//           `
//           SELECT
//             customer_id,
//             service_id
//           FROM customer_external_sources
//           WHERE source_type = 'google_sheet'
//             AND external_id = $1
//             AND sheet_name = $2
//             AND external_row = $3
//           LIMIT 1
//           `,
//           [
//             spreadsheetId,
//             sheetName,
//             googleRow,
//           ]
//         );

//         // No mapping = don't create anything
//         if (mappingResult.rows.length === 0) {
//           skippedCount++;
//           continue;
//         }

//         const serviceId =
//           mappingResult.rows[0].service_id;

//         if (!serviceId) {
//           skippedCount++;
//           continue;
//         }

//         // Update existing service
//         await db.query(
//           `
//           UPDATE services
//           SET
//             service_date = $1,
//             service = $2,
//             engineer = $3,
//             remark = $4,
//             amount = $5
//           WHERE id = $6
//           `,
//           [
//             row.date || null,
//             row.date_of_instalation || null,
//             row.engineer || null,
//             row.remark || null,
//             Number(row.amount || 0),
//             serviceId,
//           ]
//         );

//         updatedCount++;

//       } catch (error) {
//         failedCount++;

//         errors.push({
//           google_row: row.__google_row || null,
//           error: error.message,
//         });
//       }
//     }

//     return res.json({
//       success: true,
//       total: rows.length,
//       updated: updatedCount,
//       skipped: skippedCount,
//       failed: failedCount,
//       errors,
//     });

//   } catch (error) {
//     console.error(
//       "Google Sheet Sync Error:",
//       error
//     );

//     return res.status(500).json({
//       success: false,
//       message: "Google Sheet Sync Failed",
//     });
//   }
// };

const syncGoogleSheet = async (req, res) => {
  try {
    const {
      spreadsheetId,
      sheetName,
      rows,
    } = req.body;

    if (!spreadsheetId) {
      return res.status(400).json({
        success: false,
        message: "Spreadsheet ID is required.",
      });
    }

    if (!sheetName) {
      return res.status(400).json({
        success: false,
        message: "Sheet name is required.",
      });
    }

    if (!Array.isArray(rows)) {
      return res.status(400).json({
        success: false,
        message: "Rows must be an array.",
      });
    }

    // ==========================================
    // 1. LOAD SAVED GOOGLE MAPPING
    // ==========================================

    const mappingResult = await db.query(
      `
      SELECT mapping
      FROM google_sheet_mappings
      WHERE spreadsheet_id = $1
        AND sheet_name = $2
      LIMIT 1
      `,
      [
        spreadsheetId,
        sheetName,
      ]
    );

    if (mappingResult.rows.length === 0) {
      return res.status(400).json({
        success: false,
        message: "No mapping found for this Google Sheet.",
      });
    }

    const googleMapping =
      mappingResult.rows[0].mapping || {};

    // ==========================================
    // 2. CRM FIELD DEFINITIONS
    // ==========================================

    const crmFieldKeys = [
      ...new Set(
        Object.values(googleMapping)
          .filter(Boolean)
      ),
    ];

    if (crmFieldKeys.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Google Sheet mapping is empty.",
      });
    }

    const fields =
      await getFieldsByKeys(crmFieldKeys);

    const fieldMap = new Map(
      fields.map((field) => [
        field.field_key,
        field,
      ])
    );

    // ==========================================
    // 3. COUNTERS
    // ==========================================

    let createdCount = 0;
    let updatedCount = 0;
    let skippedCount = 0;
    let failedCount = 0;

    const errors = [];

    // ==========================================
    // 4. PROCESS EACH GOOGLE ROW
    // ==========================================

    for (const row of rows) {
      try {
        const googleRow =
          Number(row.__google_row);

        if (!googleRow) {
          skippedCount++;
          continue;
        }


        // ======================================
        // GOOGLE ROW → CRM ROW MAPPING
        // ======================================

        const crmRow = row;

        // ======================================
        // FIND GOOGLE → CRM LINK
        // ======================================

        const mappingResult =
          await db.query(
            `
            SELECT
              customer_id,
              service_id
            FROM customer_external_sources
            WHERE source_type = 'google_sheet'
              AND external_id = $1
              AND sheet_name = $2
              AND external_row = $3
            LIMIT 1
            `,
            [
              spreadsheetId,
              sheetName,
              googleRow,
            ]
          );

        // ======================================
        // NEW GOOGLE ROW
        // ======================================

        if (mappingResult.rows.length === 0) {
          console.log(
            "GOOGLE SYNC CREATE:",
            googleRow
          );

          /*
           * Existing import system ko reuse kar rahe hain.
           * Ye customer + service + external mapping
           * create karega.
           */

          const result =
            await require("../services/importService")
              .importCustomersService(
                [crmRow],
                {
                  source: "google_sheet",
                  spreadsheetId,
                  sheetName,
                }
              );

          if (
            result.failed &&
            result.failed > 0
          ) {
            failedCount += result.failed;

            if (result.errors) {
              errors.push(...result.errors);
            }

            continue;
          }

          createdCount++;

          continue;
        }

        // ======================================
        // EXISTING GOOGLE ROW
        // ======================================

        const externalRecord =
          mappingResult.rows[0];

        const customerId =
          externalRecord.customer_id;

        const serviceId =
          externalRecord.service_id;

        if (!customerId && !serviceId) {
          skippedCount++;
          continue;
        }

        // ======================================
        // CRM ROW
        // ======================================
        // ======================================
        // CHECK WHETHER ANYTHING CHANGED
        // ======================================

        let hasChanges = false;

        // --------------------------------------
        // CUSTOMER FIELDS
        // --------------------------------------

        if (customerId) {
          const customerResult =
            await db.query(
              `
              SELECT *
              FROM customers
              WHERE id = $1
              LIMIT 1
              `,
              [customerId]
            );

          if (customerResult.rows.length > 0) {
            const customer =
              customerResult.rows[0];

            for (
              const [fieldKey, value]
              of Object.entries(crmRow)
            ) {
              const field =
                fieldMap.get(fieldKey);

              if (!field) {
                continue;
              }

              if (
                value === undefined ||
                value === null ||
                value === ""
              ) {
                continue;
              }

              if (
                field.storage_key &&
                field.field_group === "customer"
              ) {
                const oldValue =
                  customer[field.storage_key];

                if (
                  String(oldValue ?? "") !==
                  String(value)
                ) {
                  hasChanges = true;
                  break;
                }
              }
            }
          }
        }

        // --------------------------------------
        // SERVICE FIELDS
        // --------------------------------------

        if (!hasChanges && serviceId) {
          const serviceResult =
            await db.query(
              `
              SELECT *
              FROM services
              WHERE id = $1
              LIMIT 1
              `,
              [serviceId]
            );

          if (serviceResult.rows.length > 0) {
            const service =
              serviceResult.rows[0];

            for (
              const [fieldKey, value]
              of Object.entries(crmRow)
            ) {
              const field =
                fieldMap.get(fieldKey);

              if (!field) {
                continue;
              }

              if (
                value === undefined ||
                value === null ||
                value === ""
              ) {
                continue;
              }

              if (
                field.storage_key &&
                field.field_group === "service"
              ) {
                let oldValue =
                  service[field.storage_key];

                let newValue = value;

                if (
                  field.field_type === "number"
                ) {
                  oldValue =
                    Number(oldValue || 0);

                  newValue =
                    Number(value || 0);
                } else {
                  oldValue =
                    String(oldValue ?? "");

                  newValue =
                    String(value);
                }

                if (
                  oldValue !== newValue
                ) {
                  hasChanges = true;
                  break;
                }
              }
            }
          }
        }

        // ======================================
        // DYNAMIC FIELD CHECK
        // ======================================

        if (!hasChanges) {
          for (
            const [fieldKey, value]
            of Object.entries(crmRow)
          ) {
            const field =
              fieldMap.get(fieldKey);

            if (!field) {
              continue;
            }

            if (
              value === undefined ||
              value === null ||
              value === ""
            ) {
              continue;
            }

            if (
              !field.storage_key &&
              field.field_group === "service" &&
              serviceId
            ) {
              const dynamicResult =
                await db.query(
                  `
                  SELECT field_value
                  FROM service_field_values
                  WHERE service_id = $1
                    AND field_id = $2
                  LIMIT 1
                  `,
                  [
                    serviceId,
                    field.id,
                  ]
                );

              const oldValue =
                dynamicResult.rows.length > 0
                  ? dynamicResult.rows[0].field_value
                  : "";

              if (
                String(oldValue ?? "") !==
                String(value)
              ) {
                hasChanges = true;
                break;
              }
            }

            if (
              !field.storage_key &&
              field.field_group === "customer" &&
              customerId
            ) {
              const dynamicResult =
                await db.query(
                  `
                  SELECT field_value
                  FROM customer_field_values
                  WHERE customer_id = $1
                    AND field_id = $2
                  LIMIT 1
                  `,
                  [
                    customerId,
                    field.id,
                  ]
                );

              const oldValue =
                dynamicResult.rows.length > 0
                  ? dynamicResult.rows[0].field_value
                  : "";

              if (
                String(oldValue ?? "") !==
                String(value)
              ) {
                hasChanges = true;
                break;
              }
            }
          }
        }

        // ======================================
        // NOTHING CHANGED
        // ======================================

        if (!hasChanges) {
          console.log(
            "GOOGLE SYNC SKIP:",
            googleRow
          );

          skippedCount++;
          continue;
        }

        // ======================================
        // UPDATE CHANGED RECORD
        // ======================================

        console.log(
          "GOOGLE SYNC UPDATE:",
          googleRow
        );

        for (
          const [fieldKey, value]
          of Object.entries(crmRow)
        ) {
          const field =
            fieldMap.get(fieldKey);

          if (!field) {
            continue;
          }

          if (
            value === undefined ||
            value === null ||
            value === ""
          ) {
            continue;
          }

          // ------------------------------------
          // CUSTOMER CORE FIELD
          // ------------------------------------

          if (
            field.storage_key &&
            field.field_group === "customer" &&
            customerId
          ) {
            const columnCheck =
              await db.query(
                `
                SELECT 1
                FROM information_schema.columns
                WHERE table_schema = 'public'
                  AND table_name = 'customers'
                  AND column_name = $1
                LIMIT 1
                `,
                [field.storage_key]
              );

            if (
              columnCheck.rows.length === 0
            ) {
              continue;
            }

            const safeColumn =
              `"${field.storage_key.replace(
                /"/g,
                '""'
              )}"`;

            await db.query(
              `
              UPDATE customers
              SET ${safeColumn} = $1
              WHERE id = $2
              `,
              [
                String(value),
                customerId,
              ]
            );

            continue;
          }

          // ------------------------------------
          // SERVICE CORE FIELD
          // ------------------------------------

          if (
            field.storage_key &&
            field.field_group === "service" &&
            serviceId
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
                [field.storage_key]
              );

            if (
              columnCheck.rows.length === 0
            ) {
              continue;
            }

            const safeColumn =
              `"${field.storage_key.replace(
                /"/g,
                '""'
              )}"`;

            let dbValue =
              String(value);

            if (
              field.field_type === "number"
            ) {
              dbValue =
                Number(value);
            }

            await db.query(
              `
              UPDATE services
              SET
                ${safeColumn} = $1,
                updated_at = NOW()
              WHERE id = $2
              `,
              [
                dbValue,
                serviceId,
              ]
            );

            continue;
          }

          // ------------------------------------
          // CUSTOMER DYNAMIC FIELD
          // ------------------------------------

          if (
            !field.storage_key &&
            field.field_group === "customer" &&
            customerId
          ) {
            await db.query(
              `
              INSERT INTO customer_field_values
              (
                customer_id,
                field_id,
                field_value
              )
              VALUES
              ($1, $2, $3)
              ON CONFLICT
              (
                customer_id,
                field_id
              )
              DO UPDATE SET
                field_value =
                  EXCLUDED.field_value,
                updated_at = NOW()
              `,
              [
                customerId,
                field.id,
                String(value),
              ]
            );

            continue;
          }

          // ------------------------------------
          // SERVICE DYNAMIC FIELD
          // ------------------------------------

          if (
            !field.storage_key &&
            field.field_group === "service" &&
            serviceId
          ) {
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
              ON CONFLICT
              (
                service_id,
                field_id
              )
              DO UPDATE SET
                field_value =
                  EXCLUDED.field_value,
                updated_at = NOW()
              `,
              [
                serviceId,
                field.id,
                String(value),
              ]
            );
          }
        }

        updatedCount++;

      } catch (error) {
        failedCount++;

        console.error(
          "Google Sync Row Error:",
          row.__google_row,
          error
        );

        errors.push({
          google_row:
            row.__google_row || null,
          error: error.message,
        });
      }
    }

    // ==========================================
    // FINAL RESULT
    // ==========================================

    return res.json({
      success: true,
      total: rows.length,
      created: createdCount,
      updated: updatedCount,
      skipped: skippedCount,
      failed: failedCount,
      errors,
    });

  } catch (error) {
    console.error(
      "Google Sheet Sync Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Google Sheet Sync Failed",
      error: error.message,
    });
  }
};


const resolveCrmFieldValue = ({
  fieldKey,
  customer,
  service,
  customFields,
}) => {
  if (!fieldKey) {
    return "";
  }

  // -----------------------------------------
  // CUSTOMER DATA
  // -----------------------------------------

  if (customer) {
    if (
      Object.prototype.hasOwnProperty.call(
        customer,
        fieldKey
      )
    ) {
      return customer[fieldKey] ?? "";
    }

    // CRM form ka logical customer_name
    // customers table me actual column "name" hai
    if (
      fieldKey === "customer_name" &&
      Object.prototype.hasOwnProperty.call(
        customer,
        "name"
      )
    ) {
      return customer.name ?? "";
    }
  }

  // -----------------------------------------
  // SERVICE DATA
  // -----------------------------------------

  if (service) {
    if (
      Object.prototype.hasOwnProperty.call(
        service,
        fieldKey
      )
    ) {
      return service[fieldKey] ?? "";
    }
  }

  // -----------------------------------------
  // CUSTOM FIELD DATA
  // -----------------------------------------

  if (
    customFields &&
    Object.prototype.hasOwnProperty.call(
      customFields,
      fieldKey
    )
  ) {
    return customFields[fieldKey] ?? "";
  }

  return "";
};

const getGoogleColumnLetter = (number) => {
  let result = "";

  while (number > 0) {
    const remainder =
      (number - 1) % 26;

    result =
      String.fromCharCode(
        65 + remainder
      ) + result;

    number =
      Math.floor(
        (number - 1) / 26
      );
  }

  return result;
};

const pushCrmToGoogleSheet = async (req, res) => {
  try {
    const {
      spreadsheetId,
      sheetName,
      accessToken,
    } = req.body;

    // ==========================================
    // VALIDATION
    // ==========================================

    if (!spreadsheetId || !sheetName || !accessToken) {
      return res.status(400).json({
        success: false,
        message:
          "Spreadsheet ID, sheet name and access token are required.",
      });
    }

    // ==========================================
    // LOAD SAVED MAPPING
    // ==========================================

const mappingResult = await db.query(
  `
  SELECT export_mapping
  FROM google_sheet_mappings
  WHERE spreadsheet_id = $1
    AND sheet_name = $2
  LIMIT 1
  `,
  [spreadsheetId, sheetName]
);

    if (mappingResult.rows.length === 0) {
      return res.status(400).json({
        success: false,
        message: "No mapping found for this Google Sheet.",
      });
    }

  const googleMapping =
  mappingResult.rows[0].export_mapping || {};

    const mappingEntries =
      Object.entries(googleMapping);

    if (mappingEntries.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Google Sheet mapping is empty.",
      });
    }

    // ==========================================
    // GET GOOGLE ↔ CRM LINKS
    // ==========================================

    const linksResult = await db.query(
      `
      SELECT
        ces.id,
        ces.customer_id,
        ces.service_id,
        ces.external_row
      FROM customer_external_sources ces
      WHERE ces.source_type = 'google_sheet'
        AND ces.external_id = $1
        AND ces.sheet_name = $2
        AND ces.external_row IS NOT NULL
      ORDER BY ces.external_row ASC
      `,
      [spreadsheetId, sheetName]
    );

    const links = linksResult.rows;

    if (links.length === 0) {
      return res.json({
        success: true,
        message: "No linked Google Sheet rows found.",
        total: 0,
        updated: 0,
        skipped: 0,
      });
    }

    // ==========================================
    // GOOGLE AUTH
    // ==========================================

    const auth = new google.auth.OAuth2();

    auth.setCredentials({
      access_token: accessToken,
    });

    const sheets = google.sheets({
      version: "v4",
      auth,
    });

    // ==========================================
    // PREPARE BATCH DATA
    // ==========================================

    const batchData = [];
    const preparedRows = [];

    let skipped = 0;

    for (const link of links) {

      // ----------------------------------------
      // CUSTOMER
      // ----------------------------------------

      const customerResult = await db.query(
        `
        SELECT *
        FROM customers
        WHERE id = $1
        LIMIT 1
        `,
        [link.customer_id]
      );

      if (customerResult.rows.length === 0) {
        skipped++;
        continue;
      }

      const customer =
        customerResult.rows[0];

      // ----------------------------------------
      // SERVICE
      // ----------------------------------------

      let service = null;

      if (link.service_id) {
        const serviceResult = await db.query(
          `
          SELECT *
          FROM services
          WHERE id = $1
          LIMIT 1
          `,
          [link.service_id]
        );

        if (serviceResult.rows.length > 0) {
          service =
            serviceResult.rows[0];
        }
      }

      // ----------------------------------------
      // CUSTOM FIELDS
      // ----------------------------------------

      const customFields = {};

      const customResult = await db.query(
        `
        SELECT
          cf.field_key,
          cfv.field_value
        FROM custom_field_values cfv
        JOIN custom_fields cf
          ON cf.id = cfv.field_id
        WHERE cfv.record_id = $1
        `,
        [link.customer_id]
      );

      customResult.rows.forEach((field) => {
        customFields[field.field_key] =
          field.field_value;
      });

      // ----------------------------------------
      // BUILD ROW FROM SAVED MAPPING
      // ----------------------------------------

      const googleValues =
        mappingEntries.map(
          ([googleColumn, crmFieldKey]) => {

            return resolveCrmFieldValue({
              fieldKey: crmFieldKey,
              customer,
              service,
              customFields,
            });
          }
        );

      // ----------------------------------------
      // GOOGLE ROW
      // ----------------------------------------

      const rowNumber =
        Number(link.external_row);

      const endColumn =
        getGoogleColumnLetter(
          mappingEntries.length
        );

      batchData.push({
        range:
          `${sheetName}!A${rowNumber}:${endColumn}${rowNumber}`,

        values: [
          googleValues,
        ],
      });

      preparedRows.push({
        rowNumber,
        data: googleValues,
      });
    }

    // ==========================================
    // NOTHING TO UPDATE
    // ==========================================

    if (batchData.length === 0) {
      return res.json({
        success: true,
        message: "No valid CRM rows found.",
        total: links.length,
        updated: 0,
        skipped,
      });
    }

    // ==========================================
    // ONE BATCH REQUEST TO GOOGLE
    // ==========================================

    const googleResponse =
      await sheets.spreadsheets.values.batchUpdate({
        spreadsheetId,

        requestBody: {
          valueInputOption: "USER_ENTERED",
          data: batchData,
        },
      });

    const updated =
      batchData.length;

    console.log(
      "CRM → GOOGLE BATCH UPDATE:",
      {
        totalRows: batchData.length,
        updatedRows:
          googleResponse.data?.totalUpdatedRows,
        updatedCells:
          googleResponse.data?.totalUpdatedCells,
      }
    );

    // ==========================================
    // RESPONSE
    // ==========================================

    return res.json({
      success: true,

      message:
        "CRM data successfully synced to Google Sheet.",

      total: links.length,

      updated,

      skipped,

      updatedRows:
        googleResponse.data?.totalUpdatedRows ||
        updated,

      updatedCells:
        googleResponse.data?.totalUpdatedCells ||
        0,

      rows: preparedRows,
    });

  } catch (error) {

    console.error(
      "CRM → Google Sync Error:",
      error.response?.data || error
    );

    return res.status(500).json({
      success: false,

      message:
        "CRM to Google Sheet sync failed.",

      error:
        error.response?.data?.error?.message ||
        error.message,
    });
  }
};



// const pushCrmToGoogleSheet = async (req, res) => {
//   try {
//     const {
//       spreadsheetId,
//       sheetName,
//       accessToken,
//     } = req.body;

//     // ==========================================
//     // 1. VALIDATION
//     // ==========================================

//     if (!spreadsheetId) {
//       return res.status(400).json({
//         success: false,
//         message: "Spreadsheet ID is required.",
//       });
//     }

//     if (!sheetName) {
//       return res.status(400).json({
//         success: false,
//         message: "Sheet name is required.",
//       });
//     }

//     if (!accessToken) {
//       return res.status(401).json({
//         success: false,
//         message: "Google access token is required.",
//       });
//     }

//     // ==========================================
//     // 2. LOAD GOOGLE SHEET MAPPING
//     // ==========================================

//     const mappingResult = await db.query(
//       `
//       SELECT mapping
//       FROM google_sheet_mappings
//       WHERE spreadsheet_id = $1
//         AND sheet_name = $2
//       LIMIT 1
//       `,
//       [
//         spreadsheetId,
//         sheetName,
//       ]
//     );

//     if (mappingResult.rows.length === 0) {
//       return res.status(400).json({
//         success: false,
//         message: "No mapping found for this Google Sheet.",
//       });
//     }

//     const googleMapping =
//       mappingResult.rows[0].mapping || {};

//     const mappingEntries =
//       Object.entries(googleMapping);

//     if (mappingEntries.length === 0) {
//       return res.status(400).json({
//         success: false,
//         message: "Google Sheet mapping is empty.",
//       });
//     }

//     // ==========================================
//     // 3. GET GOOGLE ↔ CRM ROW LINKS
//     // ==========================================

//     const links = await db.query(
//       `
//       SELECT
//         id,
//         customer_id,
//         service_id,
//         external_row
//       FROM customer_external_sources
//       WHERE source_type = 'google_sheet'
//         AND external_id = $1
//         AND sheet_name = $2
//         AND external_row IS NOT NULL
//       ORDER BY external_row
//       `,
//       [
//         spreadsheetId,
//         sheetName,
//       ]
//     );

//     let updated = 0;
//     let skipped = 0;

//     const preparedRows = [];

//     // ==========================================
//     // 4. BUILD CRM → GOOGLE DATA
//     // ==========================================

//     for (const link of links.rows) {

//       const customerResult = await db.query(
//         `
//         SELECT *
//         FROM customers
//         WHERE id = $1
//         LIMIT 1
//         `,
//         [link.customer_id]
//       );

//       if (customerResult.rows.length === 0) {
//         skipped++;
//         continue;
//       }

//       const customer =
//         customerResult.rows[0];

//       // ========================================
//       // CUSTOMER DYNAMIC FIELDS
//       // ========================================

//       const dynamicResult =
//         await db.query(
//           `
//           SELECT
//             cf.field_key,
//             cfv.field_value
//           FROM custom_field_values cfv
//           JOIN custom_fields cf
//             ON cf.id = cfv.field_id
//           WHERE cfv.record_id = $1
//           `,
//           [link.customer_id]
//         );

//       const dynamicValues = {};

//       dynamicResult.rows.forEach(
//         (field) => {
//           dynamicValues[field.field_key] =
//             field.field_value;
//         }
//       );

//       // ========================================
//       // BUILD GOOGLE ROW
//       // ========================================

//       const googleRow = {};

//       for (
//         const [
//           googleColumn,
//           crmFieldKey,
//         ]
//         of mappingEntries
//       ) {

//         if (
//           dynamicValues[crmFieldKey] !==
//           undefined
//         ) {
//           googleRow[googleColumn] =
//             dynamicValues[crmFieldKey];
//         } else {
//           googleRow[googleColumn] =
//             customer[crmFieldKey] ?? "";
//         }
//       }

//       preparedRows.push({
//         rowNumber: Number(
//           link.external_row
//         ),
//         data: googleRow,
//       });
//     }

//     // ==========================================
//     // 5. NOTHING TO UPDATE
//     // ==========================================

//     if (preparedRows.length === 0) {
//       return res.json({
//         success: true,
//         message: "No CRM rows available for Google sync.",
//         total: links.rows.length,
//         updated: 0,
//         skipped,
//         rows: [],
//       });
//     }

//     // ==========================================
//     // 6. GOOGLE AUTH
//     // ==========================================

//     const auth =
//       new google.auth.OAuth2();

//     auth.setCredentials({
//       access_token: accessToken,
//     });

//     const sheets =
//       google.sheets({
//         version: "v4",
//         auth,
//       });

//     // ==========================================
//     // 7. FIND GOOGLE COLUMN RANGE
//     // ==========================================

//     const columnLetters =
//       mappingEntries.map(
//         ([googleColumn]) =>
//           googleColumn
//       );

//     const columnNumber = (letters) => {
//       let number = 0;

//       for (const char of letters) {
//         number =
//           number * 26 +
//           (char.charCodeAt(0) - 64);
//       }

//       return number;
//     };

//     const columnName = (number) => {
//       let result = "";

//       while (number > 0) {
//         const remainder =
//           (number - 1) % 26;

//         result =
//           String.fromCharCode(
//             65 + remainder
//           ) + result;

//         number =
//           Math.floor(
//             (number - 1) / 26
//           );
//       }

//       return result;
//     };

//     const columnNumbers =
//       columnLetters.map(
//         columnNumber
//       );

//     const startColumnNumber =
//       Math.min(...columnNumbers);

//     const endColumnNumber =
//       Math.max(...columnNumbers);

//     const startColumn =
//       columnName(
//         startColumnNumber
//       );

//     const endColumn =
//       columnName(
//         endColumnNumber
//       );

//     // ==========================================
//     // 8. PREPARE BATCH UPDATE
//     // ==========================================

//     const batchData =
//       preparedRows.map(
//         (row) => {

//           const values = [];

//           for (
//             let column =
//               startColumnNumber;
//             column <=
//               endColumnNumber;
//             column++
//           ) {

//             const columnLetter =
//               columnName(column);

//             values.push(
//               row.data[columnLetter] ??
//               ""
//             );
//           }

//           return {
//             range:
//               `${sheetName}!${startColumn}${row.rowNumber}:${endColumn}${row.rowNumber}`,

//             values: [
//               values,
//             ],
//           };
//         }
//       );

//     console.log(
//       "CRM → GOOGLE BATCH UPDATE:",
//       {
//         rows: batchData.length,
//         range:
//           `${startColumn}:${endColumn}`,
//       }
//     );

//     // ==========================================
//     // 9. ONE GOOGLE API WRITE REQUEST
//     // ==========================================

//     const googleResult =
//       await sheets.spreadsheets.values.batchUpdate(
//         {
//           spreadsheetId,

//           requestBody: {
//             valueInputOption:
//               "USER_ENTERED",

//             data: batchData,
//           },
//         }
//       );

//     console.log(
//       "CRM → GOOGLE BATCH RESULT:",
//       googleResult.data
//     );

//     updated =
//       preparedRows.length;

//     // ==========================================
//     // 10. FINAL RESPONSE
//     // ==========================================

//     return res.json({
//       success: true,

//       message:
//         "CRM data successfully synced to Google Sheet.",

//       total:
//         links.rows.length,

//       updated,

//       skipped,

//       failed: 0,

//       rows:
//         preparedRows,

//       googleUpdatedCells:
//         googleResult.data
//           ?.totalUpdatedCells || 0,
//     });

//   } catch (error) {

//     console.error(
//       "CRM → Google Sync Error:",
//       error.response?.data ||
//       error
//     );

//     return res.status(500).json({
//       success: false,

//       message:
//         "CRM to Google Sheet sync failed.",

//       error:
//         error.response?.data
//           ?.error?.message ||
//         error.message,
//     });
//   }
// };

module.exports = {
  addService,
  updateService,
  getCustomerSummary,
  syncGoogleSheet,
  saveDynamicServiceFields,
  pushCrmToGoogleSheet
};