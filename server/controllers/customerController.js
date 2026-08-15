const db = require("../config/db");
const XLSX = require("xlsx");

const {
  importCustomersService,
} = require("../services/importService");


// const addCustomer = async (req, res) => {

//   try {

//     // const {
//     //   name,
//     //   phone,
//     //   email,
//     //   address,
//     // } = req.body;

//     const { fields } = req.body;

//     // await db.query(
//     //   `INSERT INTO customers
//     //         (name, phone, email, address)
//     //         VALUES ($1, $2, $3, $4)`,
//     //   [name, phone, email, address]
//     // );


//     // Check duplicate customer code
//     const customerCodeExists = await db.query(
//       `
//     SELECT id
//     FROM customers
//     WHERE customer_code = $1
//     `,
//       [fields.customer_code]
//     );

//     if (customerCodeExists.rows.length > 0) {
//       return res.status(400).json({
//         success: false,
//         message: "Customer code already exists."
//       });
//     }

//     // Check duplicate phone
//     const phoneExists = await db.query(
//       `
//     SELECT id
//     FROM customers
//     WHERE phone = $1
//     `,
//       [fields.phone]
//     );

//     if (phoneExists.rows.length > 0) {
//       return res.status(400).json({
//         success: false,
//         message: "Phone number already exists."
//       });
//     }

//     await db.query("BEGIN");

//     const customerResult = await db.query(
//       `
//   INSERT INTO customers
//   (customer_code, name, phone,source)
//   VALUES ($1, $2, $3, $4)
//   RETURNING id
//   `,
//       [
//         fields.customer_code,
//         fields.customer_name,
//         fields.phone,
//         "crm",
//       ]
//     );

//     const customerId = customerResult.rows[0].id;

//     // 1. Pehle database se fields lao
//     const fieldsResult = await db.query(`
//     SELECT id, field_key
//     FROM company_customer_fields
// `);

//     // 2. Phir fieldMap banao
//     const fieldMap = {};

//     fieldsResult.rows.forEach((field) => {
//       fieldMap[field.field_key] = field.id;
//     });

//     // 3. Ab fieldMap use karo
//     for (const [fieldKey, fieldValue] of Object.entries(fields)) {

//       if (
//         fieldKey === "customer_code" ||
//         fieldKey === "customer_name" ||
//         fieldKey === "phone"
//       ) {
//         continue;
//       }

//       if (!fieldMap[fieldKey]) {
//         continue;
//       }

//       await db.query(
//         `
//         INSERT INTO customer_field_values
//         (customer_id, field_id, field_value)
//         VALUES ($1, $2, $3)
//         `,
//         [
//           customerId,
//           fieldMap[fieldKey],
//           fieldValue,
//         ]
//       );
//     }


//     console.log(fieldMap);
//     await db.query("COMMIT");

//     // const customerId = customerResult.rows[0].id;

//     // for (const [fieldKey, fieldValue] of Object.entries(fields)) {

//     //     if (
//     //         fieldKey === "customer_code" ||
//     //         fieldKey === "customer_name" ||
//     //         fieldKey === "phone"
//     //     ) {
//     //         continue;
//     //     }

//     //     if (!fieldMap[fieldKey]) {
//     //         continue;
//     //     }

//     //     await db.query(
//     //         `
//     //         INSERT INTO customer_field_values
//     //         (customer_id, field_id, field_value)
//     //         VALUES ($1, $2, $3)
//     //         `,
//     //         [
//     //             customerId,
//     //             fieldMap[fieldKey],
//     //             fieldValue,
//     //         ]
//     //     );
//     // }

//     // const fieldsResult = await db.query(`
//     //     SELECT id, field_key
//     //     FROM company_customer_fields
//     // `);

//     // const fieldMap = {};

//     // fieldsResult.rows.forEach((field) => {
//     //     fieldMap[field.field_key] = field.id;
//     // });

//     // console.log(fieldMap);

//     // await db.query("COMMIT");

//     res.json({
//       success: true,
//       message: "Customer Added Successfully",
//     });

//   } catch (error) {

//     await db.query("ROLLBACK");

//     console.error(error);

//     res.status(500).json({
//       success: false,
//       message: "Server Error",
//     });

//   }

// };


const addCustomer = async (req, res) => {
  const client = await db.connect();

  try {
    const { fields } = req.body;

    if (!fields || typeof fields !== "object") {
      return res.status(400).json({
        success: false,
        message: "Customer fields are required.",
      });
    }

    // -----------------------------------------
    // 1. Check duplicate customer code
    // -----------------------------------------

    const customerCodeExists = await client.query(
      `
      SELECT id
      FROM customers
      WHERE customer_code = $1
      LIMIT 1
      `,
      [fields.customer_code]
    );

    if (customerCodeExists.rows.length > 0) {
      return res.status(400).json({
        success: false,
        message: "Customer code already exists.",
      });
    }

    // -----------------------------------------
    // 2. Check duplicate phone
    // -----------------------------------------

    const phoneExists = await client.query(
      `
      SELECT id
      FROM customers
      WHERE phone = $1
      LIMIT 1
      `,
      [fields.phone]
    );

    if (phoneExists.rows.length > 0) {
      return res.status(400).json({
        success: false,
        message: "Phone number already exists.",
      });
    }

    // -----------------------------------------
    // 3. Start transaction
    // -----------------------------------------

    await client.query("BEGIN");

    // -----------------------------------------
    // 4. Create main customer record
    // -----------------------------------------

    const customerResult = await client.query(
      `
      INSERT INTO customers
      (
        customer_code,
        name,
        phone,
        source
      )
      VALUES
      ($1, $2, $3, $4)
      RETURNING id
      `,
      [
        fields.customer_code,
        fields.customer_name,
        fields.phone,
        "crm",
      ]
    );

    const customerId = customerResult.rows[0].id;

    // -----------------------------------------
    // 5. Get NEW custom field definitions
    // -----------------------------------------

    const customFieldsResult = await client.query(
      `
      SELECT
        id,
        field_key,
        field_type,
        is_visible
      FROM custom_fields
      WHERE module_key = 'customer'
      `
    );

    // -----------------------------------------
    // 6. Create field map
    // -----------------------------------------

    const fieldMap = {};

    customFieldsResult.rows.forEach((field) => {
      fieldMap[field.field_key] = field;
    });

    // -----------------------------------------
    // 7. Save custom field values
    // -----------------------------------------

    for (const [fieldKey, fieldValue] of Object.entries(fields)) {

      // Core customer fields
      // already stored in customers table
      if (
        fieldKey === "customer_code" ||
        fieldKey === "customer_name" ||
        fieldKey === "phone"
      ) {
        continue;
      }

      const customField = fieldMap[fieldKey];

      // Field CRM definition me exist nahi karta
      if (!customField) {
        continue;
      }

      /*
       * Empty values ko bhi save nahi karenge.
       * Isse unnecessary rows nahi banengi.
       */
      if (
        fieldValue === null ||
        fieldValue === undefined ||
        String(fieldValue).trim() === ""
      ) {
        continue;
      }

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
          customField.id,
          customerId,
          String(fieldValue),
        ]
      );
    }

    // -----------------------------------------
    // 8. Commit everything
    // -----------------------------------------

    await client.query("COMMIT");

    // -----------------------------------------
    // 9. Response
    // -----------------------------------------

    res.json({
      success: true,
      message: "Customer Added Successfully",
      customerId,
    });

  } catch (error) {

    // -----------------------------------------
    // Rollback if anything fails
    // -----------------------------------------

    try {
      await client.query("ROLLBACK");
    } catch (rollbackError) {
      console.error(
        "Customer Add Rollback Error:",
        rollbackError
      );
    }

    console.error(
      "Add Customer Error:",
      error
    );

    res.status(500).json({
      success: false,
      message: "Server Error",
    });

  } finally {

    // Always return connection to pool
    client.release();

  }
};

const getCustomers = async (req, res) => {

  try {

    const {
      search = "",
      searchBy = "all",
      status = "all",
      area = "all",
      sort = "name",
      page = 1,
      limit = 10,
    } = req.query;


    const currentPage = Number(page);
    const pageSize = Number(limit);

    const offset = (currentPage - 1) * pageSize;

    // const result = await db.query(
    //     "SELECT * FROM customers ORDER BY id DESC"
    // );

    const totalResult = await db.query(
      `
  SELECT COUNT(*) AS total
  FROM customers
  WHERE is_deleted = false
    AND (
      $1 = ''
      OR CAST(id AS TEXT) ILIKE '%' || $1 || '%'
      OR name ILIKE '%' || $1 || '%'
      OR phone ILIKE '%' || $1 || '%'
      OR email ILIKE '%' || $1 || '%'
      OR customer_code ILIKE '%' || $1 || '%'
      OR address ILIKE '%' || $1 || '%'
    )
  `,
      [search]
    );

    const totalRecords = Number(totalResult.rows[0].total);

    // const result = await db.query(


    //     `
    //     SELECT *

    //     FROM customers

    //     WHERE

    //         $1 = ''

    //         OR CAST(id AS TEXT) ILIKE '%' || $1 || '%'

    //         OR name ILIKE '%' || $1 || '%'

    //         OR phone ILIKE '%' || $1 || '%'

    //         OR email ILIKE '%' || $1 || '%'

    //     ORDER BY id DESC
    //     `,

    //     [search || ""]

    // );


    let whereClause = "";
    const values = [];

    if (search === "") {
      whereClause = "TRUE";
    } else {
      values.push(search);

      switch (searchBy) {
        case "customer_code":
          whereClause = `customer_code ILIKE '%' || $1 || '%'`;
          break;

        case "phone":
          whereClause = `phone ILIKE '%' || $1 || '%'`;
          break;

        case "name":
          whereClause = `name ILIKE '%' || $1 || '%'`;
          break;

        case "address":
          whereClause = `address ILIKE '%' || $1 || '%'`;
          break;

        default:
          whereClause = `
        customer_code ILIKE '%' || $1 || '%'
        OR name ILIKE '%' || $1 || '%'
        OR phone ILIKE '%' || $1 || '%'
        OR email ILIKE '%' || $1 || '%'
        OR address ILIKE '%' || $1 || '%'
      `;
      }
    }

    const result = await db.query(
      `
SELECT DISTINCT ON (customer_code) *

FROM customers
WHERE is_deleted = false
AND (${whereClause})

ORDER BY customer_code, id DESC

LIMIT $${values.length + 1}
OFFSET $${values.length + 2}
`,
      [
        ...values,
        pageSize,
        offset,
      ]
    );
    res.json({
      success: true,
      customers: result.rows,

      pagination: {
        currentPage,
        pageSize,
        totalRecords,
        totalPages: Math.ceil(totalRecords / pageSize),
      },
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });

  }

};

// const getCustomerById = async (req, res) => {
//   try {
//     const { id } = req.params;

//     // Main Customer
//     const result = await db.query(
//       `
//       SELECT *
//       FROM customers
//       WHERE id = $1
// AND is_deleted = false
//       LIMIT 1;
//       `,
//       [id]
//     );

//     if (result.rows.length === 0) {
//       return res.status(404).json({
//         success: false,
//         message: "Customer not found",
//       });
//     }

//     const customer = result.rows[0];

//     // Dynamic Fields
//     const fieldValues = await db.query(
//       `
//       SELECT
//           ccf.field_key,
//           cfv.field_value
//       FROM customer_field_values cfv
//       JOIN company_customer_fields ccf
//           ON cfv.field_id = ccf.id
//       WHERE cfv.customer_id = $1
//       `,
//       [id]
//     );

//     // Merge Customer + Dynamic Fields
//     const customerData = {
//       ...customer,
//     };

//     fieldValues.rows.forEach((field) => {
//       customerData[field.field_key] = field.field_value;
//     });

//     res.json({
//       success: true,
//       customer: customerData,
//     });

//   } catch (error) {
//     console.error(error);

//     res.status(500).json({
//       success: false,
//       message: "Server Error",
//     });
//   }
// };

const getCustomerById = async (req, res) => {
  try {
    const { id } = req.params;

    // -----------------------------------------
    // 1. Main Customer
    // -----------------------------------------

    const result = await db.query(
      `
      SELECT *
      FROM customers
      WHERE id = $1
        AND is_deleted = false
      LIMIT 1
      `,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Customer not found",
      });
    }

    const customer = result.rows[0];

    // -----------------------------------------
    // 2. Dynamic Custom Fields
    // -----------------------------------------

    const fieldValues = await db.query(
      `
      SELECT
        cf.field_key,
        cf.field_label,
        cf.field_type,
        cf.is_required,
        cf.is_visible,
        cf.show_in,
        cfv.field_value
      FROM custom_field_values cfv

      INNER JOIN custom_fields cf
        ON cfv.field_id = cf.id

      WHERE cf.module_key = 'customer'
        AND cfv.record_id = $1

      ORDER BY cf.display_order ASC, cf.id ASC
      `,
      [id]
    );

    // -----------------------------------------
    // 3. Merge Customer + Custom Fields
    // -----------------------------------------

    const customerData = {
      ...customer,
    };

    fieldValues.rows.forEach((field) => {
      customerData[field.field_key] = field.field_value;
    });

    // -----------------------------------------
    // 4. Response
    // -----------------------------------------

    res.json({
      success: true,
      customer: customerData,
    });

  } catch (error) {

    console.error(
      "Get Customer By ID Error:",
      error
    );

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

// const updateCustomer = async (req, res) => {
//   try {

//     const { id } = req.params;

//     // const { name, phone, email, address } = req.body;
//     const { fields } = req.body;

//     await db.query("BEGIN");

//     await db.query(
//       `
//   UPDATE customers
//   SET
//     customer_code = $1,
//     name = $2,
//     phone = $3
//   WHERE id = $4
//     AND is_deleted = false
//   `,
//       [
//         fields.customer_code,
//         fields.customer_name,
//         fields.phone,
//         id,
//       ]
//     );

//     const fieldsResult = await db.query(`
//   SELECT id, field_key
//   FROM company_customer_fields
// `);

//     const fieldMap = {};

//     fieldsResult.rows.forEach((field) => {
//       fieldMap[field.field_key] = field.id;
//     });


//     await db.query(
//       `
//   DELETE FROM customer_field_values
//   WHERE customer_id = $1
//   `,
//       [id]
//     );

//     for (const [fieldKey, fieldValue] of Object.entries(fields)) {

//       if (
//         fieldKey === "customer_code" ||
//         fieldKey === "customer_name" ||
//         fieldKey === "phone"
//       ) {
//         continue;
//       }

//       if (!fieldMap[fieldKey]) {
//         continue;
//       }

//       await db.query(
//         `
//     INSERT INTO customer_field_values
//     (customer_id, field_id, field_value)
//     VALUES ($1, $2, $3)
//     `,
//         [
//           id,
//           fieldMap[fieldKey],
//           fieldValue,
//         ]
//       );
//     }

//     await db.query("COMMIT");

//     res.json({
//       success: true,
//       message: "Customer Updated Successfully",
//     });

//   } catch (error) {
//     await db.query("ROLLBACK");

//     console.error(error);

//     res.status(500).json({
//       success: false,
//       message: "Server Error",
//     });

//   }
// };

const updateCustomer = async (req, res) => {
  const client = await db.connect();

  try {
    const { id } = req.params;
    const { fields } = req.body;

    if (!fields || typeof fields !== "object") {
      return res.status(400).json({
        success: false,
        message: "Customer fields are required.",
      });
    }

    // -----------------------------------------
    // 1. Check customer exists
    // -----------------------------------------

    const customerExists = await client.query(
      `
      SELECT id
      FROM customers
      WHERE id = $1
        AND is_deleted = false
      LIMIT 1
      `,
      [id]
    );

    if (customerExists.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Customer not found.",
      });
    }

    // -----------------------------------------
    // 2. Check duplicate customer code
    // -----------------------------------------

    const customerCodeExists = await client.query(
      `
      SELECT id
      FROM customers
      WHERE customer_code = $1
        AND id <> $2
      LIMIT 1
      `,
      [
        fields.customer_code,
        id,
      ]
    );

    if (customerCodeExists.rows.length > 0) {
      return res.status(400).json({
        success: false,
        message: "Customer code already exists.",
      });
    }

    // -----------------------------------------
    // 3. Check duplicate phone
    // -----------------------------------------

    const phoneExists = await client.query(
      `
      SELECT id
      FROM customers
      WHERE phone = $1
        AND id <> $2
      LIMIT 1
      `,
      [
        fields.phone,
        id,
      ]
    );

    if (phoneExists.rows.length > 0) {
      return res.status(400).json({
        success: false,
        message: "Phone number already exists.",
      });
    }

    // -----------------------------------------
    // 4. Start transaction
    // -----------------------------------------

    await client.query("BEGIN");

    // -----------------------------------------
    // 5. Update main customer record
    // -----------------------------------------

    await client.query(
      `
      UPDATE customers
      SET
        customer_code = $1,
        name = $2,
        phone = $3
      WHERE id = $4
        AND is_deleted = false
      `,
      [
        fields.customer_code,
        fields.customer_name,
        fields.phone,
        id,
      ]
    );

    // -----------------------------------------
    // 6. Get NEW custom field definitions
    // -----------------------------------------

    const customFieldsResult = await client.query(
      `
      SELECT
        id,
        field_key,
        field_type,
        is_visible
      FROM custom_fields
      WHERE module_key = 'customer'
      `
    );

    // -----------------------------------------
    // 7. Create field map
    // -----------------------------------------

    const fieldMap = {};

    customFieldsResult.rows.forEach((field) => {
      fieldMap[field.field_key] = field;
    });

    // -----------------------------------------
    // 8. Update custom field values
    // -----------------------------------------

    for (const [fieldKey, fieldValue] of Object.entries(fields)) {

      // Core customer fields
      if (
        fieldKey === "customer_code" ||
        fieldKey === "customer_name" ||
        fieldKey === "phone"
      ) {
        continue;
      }

      const customField = fieldMap[fieldKey];

      // CRM me field definition nahi hai
      if (!customField) {
        continue;
      }

      // Empty value
      if (
        fieldValue === null ||
        fieldValue === undefined ||
        String(fieldValue).trim() === ""
      ) {
        // Existing value ko NULL/blank ke saath update karne ke
        // bajay row remove kar rahe hain.
        // Isse unnecessary empty rows nahi rahengi.

        await client.query(
          `
          DELETE FROM custom_field_values
          WHERE field_id = $1
            AND record_id = $2
          `,
          [
            customField.id,
            id,
          ]
        );

        continue;
      }

      // -----------------------------------------
      // UPSERT
      // -----------------------------------------

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
          customField.id,
          id,
          String(fieldValue),
        ]
      );
    }

    // -----------------------------------------
    // 9. Commit
    // -----------------------------------------

    await client.query("COMMIT");

    res.json({
      success: true,
      message: "Customer Updated Successfully",
    });

  } catch (error) {

    // -----------------------------------------
    // Rollback
    // -----------------------------------------

    try {
      await client.query("ROLLBACK");
    } catch (rollbackError) {
      console.error(
        "Customer Update Rollback Error:",
        rollbackError
      );
    }

    console.error(
      "Update Customer Error:",
      error
    );

    res.status(500).json({
      success: false,
      message: "Server Error",
    });

  } finally {

    client.release();

  }
};

const deleteCustomer = async (req, res) => {

  try {

    const { id } = req.params;

    const result = await db.query(
      `
  UPDATE customers
  SET
    is_deleted = true,
    deleted_at = CURRENT_TIMESTAMP,
    deleted_by = $2
  WHERE id = $1
    AND is_deleted = false
  RETURNING id
  `,
      [id, req.user.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Customer not found",
      });
    }

    res.json({
      success: true,
      message: "Customer Deleted Successfully",
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });

  }

};

const getTrashedCustomers = async (req, res) => {
  try {
    const {
      search = "",
      page = 1,
      limit = 20,
    } = req.query;

    const currentPage = Number(page);
    const pageSize = Number(limit);
    const offset = (currentPage - 1) * pageSize;

    const searchValue = search.trim();

    const countResult = await db.query(
      `
      SELECT COUNT(*) AS total
      FROM customers
      WHERE is_deleted = true
        AND (
          $1 = ''
          OR customer_code ILIKE '%' || $1 || '%'
          OR name ILIKE '%' || $1 || '%'
          OR phone ILIKE '%' || $1 || '%'
          OR email ILIKE '%' || $1 || '%'
          OR address ILIKE '%' || $1 || '%'
        )
      `,
      [searchValue]
    );

    const totalRecords = Number(
      countResult.rows[0].total
    );

    const result = await db.query(
      `
      SELECT
        id,
        customer_code,
        name,
        phone,
        email,
        address,
        deleted_at,
        deleted_by
      FROM customers
      WHERE is_deleted = true
        AND (
          $1 = ''
          OR customer_code ILIKE '%' || $1 || '%'
          OR name ILIKE '%' || $1 || '%'
          OR phone ILIKE '%' || $1 || '%'
          OR email ILIKE '%' || $1 || '%'
          OR address ILIKE '%' || $1 || '%'
        )
      ORDER BY deleted_at DESC
      LIMIT $2
      OFFSET $3
      `,
      [
        searchValue,
        pageSize,
        offset,
      ]
    );

    res.json({
      success: true,
      customers: result.rows,
      pagination: {
        currentPage,
        pageSize,
        totalRecords,
        totalPages: Math.ceil(
          totalRecords / pageSize
        ),
      },
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

const getActiveCustomersForTrash = async (req, res) => {
  try {
    const {
      search = "",
      page = 1,
      limit = 20,
    } = req.query;

    const currentPage = Number(page);
    const pageSize = Number(limit);
    const offset = (currentPage - 1) * pageSize;

    const searchValue = search.trim();

    const countResult = await db.query(
      `
      SELECT COUNT(*) AS total
      FROM customers
      WHERE is_deleted = false
        AND (
          $1 = ''
          OR customer_code ILIKE '%' || $1 || '%'
          OR name ILIKE '%' || $1 || '%'
          OR phone ILIKE '%' || $1 || '%'
          OR email ILIKE '%' || $1 || '%'
          OR address ILIKE '%' || $1 || '%'
        )
      `,
      [searchValue]
    );

    const totalRecords = Number(
      countResult.rows[0].total
    );

    const result = await db.query(
      `
      SELECT
        id,
        customer_code,
        name,
        phone,
        email,
        address,
        created_at
      FROM customers
      WHERE is_deleted = false
        AND (
          $1 = ''
          OR customer_code ILIKE '%' || $1 || '%'
          OR name ILIKE '%' || $1 || '%'
          OR phone ILIKE '%' || $1 || '%'
          OR email ILIKE '%' || $1 || '%'
          OR address ILIKE '%' || $1 || '%'
        )
      ORDER BY name ASC
      LIMIT $2
      OFFSET $3
      `,
      [
        searchValue,
        pageSize,
        offset,
      ]
    );

    res.json({
      success: true,
      customers: result.rows,
      pagination: {
        currentPage,
        pageSize,
        totalRecords,
        totalPages: Math.ceil(
          totalRecords / pageSize
        ),
      },
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

const restoreCustomers = async (req, res) => {
  try {
    const { ids } = req.body;

    if (!Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({
        success: false,
        message: "No customers selected",
      });
    }

    const customerIds = ids
      .map(Number)
      .filter(Number.isInteger);

    if (customerIds.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid customer IDs",
      });
    }

    const result = await db.query(
      `
      UPDATE customers
      SET
        is_deleted = false,
        deleted_at = NULL,
        deleted_by = NULL
      WHERE id = ANY($1::int[])
        AND is_deleted = true
      RETURNING id
      `,
      [customerIds]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Customers not found in trash",
      });
    }

    res.json({
      success: true,
      message: `${result.rows.length} customer(s) restored successfully`,
      restored: result.rows.length,
    });

  } catch (error) {
    console.error("Restore Customers Error:", error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

const permanentlyDeleteCustomer = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await db.query(
      `
      DELETE FROM customers
      WHERE id = $1
        AND is_deleted = true
      RETURNING id
      `,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Customer not found in trash",
      });
    }

    res.json({
      success: true,
      message: "Customer Permanently Deleted",
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

const moveCustomersToTrash = async (req, res) => {
  try {
    const { ids } = req.body;

    if (!Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({
        success: false,
        message: "No customers selected",
      });
    }

    const result = await db.query(
      `
      UPDATE customers
      SET
        is_deleted = true,
        deleted_at = CURRENT_TIMESTAMP,
        deleted_by = $2
      WHERE id = ANY($1::int[])
        AND is_deleted = false
      RETURNING id
      `,
      [ids, req.user.id]
    );

    res.json({
      success: true,
      message: "Customers moved to trash",
      affected: result.rowCount,
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};


const permanentlyDeleteCustomers = async (req, res) => {
  try {
    const { ids } = req.body;

    if (!Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({
        success: false,
        message: "No customers selected",
      });
    }

    const customerIds = ids
      .map(Number)
      .filter(Number.isInteger);

    if (customerIds.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid customer IDs",
      });
    }

    const result = await db.query(
      `
      DELETE FROM customers
      WHERE id = ANY($1::int[])
        AND is_deleted = true
      RETURNING id
      `,
      [customerIds]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Customers not found in trash",
      });
    }

    res.json({
      success: true,
      message: `${result.rows.length} customer(s) permanently deleted`,
      deleted: result.rows.length,
    });

  } catch (error) {
    console.error(
      "Permanent Delete Customers Error:",
      error
    );

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

const importCustomersLegacy = async (req, res) => {
  console.log("NEW IMPORT FUNCTION RUNNING");
  try {

    if (!req.file) {

      return res.status(400).json({
        success: false,
        message: "No file uploaded"
      });

    }

    const workbook = XLSX.readFile(req.file.path);

    const sheetName = workbook.SheetNames[0];

    const worksheet = workbook.Sheets[sheetName];

    const data = XLSX.utils.sheet_to_json(worksheet);

    for (const row of data) {

      let serviceDate = null;

      if (row["Date"]) {

        const excelDate = XLSX.SSF.parse_date_code(row["Date"]);

        serviceDate = `${excelDate.y}-${String(excelDate.m).padStart(2, "0")}-${String(excelDate.d).padStart(2, "0")}`;

      }


      const existing = await db.query(
        `
  SELECT id
  FROM customers
  WHERE customer_code = $1
    AND service_date = $2
    AND service = $3
  LIMIT 1
  `,
        [
          String(row["Customer ID"] || ""),
          serviceDate,
          row["Services"] || ""
        ]
      );

      if (existing.rows.length === 0) {

        await db.query(

          `INSERT INTO customers
        (
            customer_code,
            name,
            phone,
            address,
            service_date,
            service,
            engineer,
            remark,
            amount
        )
        VALUES
        (
            $1,$2,$3,$4,$5,$6,$7,$8,$9
        )`,

          [
            String(row["Customer ID"] || ""),
            row["Customer Name"] || "",
            String(row["Contact"] || ""),
            row["Address"] || "",
            serviceDate,
            row["Services"] || "",
            row["Engineer"] || "",
            row["Remark"] || "",
            row["Amount"] || 0
          ]

        );

      }
    }

    res.json({
      success: true,
      message: `${data.length} customers imported successfully.`,
      totalRows: data.length
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({

      success: false,

      message: "Excel Import Failed"

    });

  }

};

const importCustomers = async (req, res) => {

  try {

    console.log("NEW JSON IMPORT");

const rows = req.body.rows;
const sourceMeta = req.body.sourceMeta || null;

console.log("SOURCE META:", sourceMeta);
console.log("FIRST ROW:", rows?.[0]);

const result = await importCustomersService(
  rows,
  sourceMeta
);



    return res.json(result);

  } catch (error) {

    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Import Failed",
    });

  }

};

module.exports = {
  addCustomer,
  getCustomers,
  getCustomerById,
  updateCustomer,
  deleteCustomer,
  importCustomersLegacy,
  importCustomers,
  getTrashedCustomers,
  permanentlyDeleteCustomer,
  moveCustomersToTrash,
  restoreCustomers,
  permanentlyDeleteCustomers,
  getActiveCustomersForTrash,
};