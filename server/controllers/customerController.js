const db = require("../config/db");
const XLSX = require("xlsx");

const {
    importCustomersService,
} = require("../services/importService");

const addCustomer = async (req, res) => {

  try {

    // const {
    //   name,
    //   phone,
    //   email,
    //   address,
    // } = req.body;

    const { fields } = req.body;

    // await db.query(
    //   `INSERT INTO customers
    //         (name, phone, email, address)
    //         VALUES ($1, $2, $3, $4)`,
    //   [name, phone, email, address]
    // );


    // Check duplicate customer code
    const customerCodeExists = await db.query(
      `
    SELECT id
    FROM customers
    WHERE customer_code = $1
    `,
      [fields.customer_code]
    );

    if (customerCodeExists.rows.length > 0) {
      return res.status(400).json({
        success: false,
        message: "Customer code already exists."
      });
    }

    // Check duplicate phone
    const phoneExists = await db.query(
      `
    SELECT id
    FROM customers
    WHERE phone = $1
    `,
      [fields.phone]
    );

    if (phoneExists.rows.length > 0) {
      return res.status(400).json({
        success: false,
        message: "Phone number already exists."
      });
    }

    await db.query("BEGIN");

    const customerResult = await db.query(
      `
  INSERT INTO customers
  (customer_code, name, phone,source)
  VALUES ($1, $2, $3, $5)
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

    // 1. Pehle database se fields lao
    const fieldsResult = await db.query(`
    SELECT id, field_key
    FROM company_customer_fields
`);

    // 2. Phir fieldMap banao
    const fieldMap = {};

    fieldsResult.rows.forEach((field) => {
      fieldMap[field.field_key] = field.id;
    });

    // 3. Ab fieldMap use karo
    for (const [fieldKey, fieldValue] of Object.entries(fields)) {

      if (
        fieldKey === "customer_code" ||
        fieldKey === "customer_name" ||
        fieldKey === "phone"
      ) {
        continue;
      }

      if (!fieldMap[fieldKey]) {
        continue;
      }

      await db.query(
        `
        INSERT INTO customer_field_values
        (customer_id, field_id, field_value)
        VALUES ($1, $2, $3)
        `,
        [
          customerId,
          fieldMap[fieldKey],
          fieldValue,
        ]
      );
    }


    console.log(fieldMap);
    await db.query("COMMIT");

    // const customerId = customerResult.rows[0].id;

    // for (const [fieldKey, fieldValue] of Object.entries(fields)) {

    //     if (
    //         fieldKey === "customer_code" ||
    //         fieldKey === "customer_name" ||
    //         fieldKey === "phone"
    //     ) {
    //         continue;
    //     }

    //     if (!fieldMap[fieldKey]) {
    //         continue;
    //     }

    //     await db.query(
    //         `
    //         INSERT INTO customer_field_values
    //         (customer_id, field_id, field_value)
    //         VALUES ($1, $2, $3)
    //         `,
    //         [
    //             customerId,
    //             fieldMap[fieldKey],
    //             fieldValue,
    //         ]
    //     );
    // }

    // const fieldsResult = await db.query(`
    //     SELECT id, field_key
    //     FROM company_customer_fields
    // `);

    // const fieldMap = {};

    // fieldsResult.rows.forEach((field) => {
    //     fieldMap[field.field_key] = field.id;
    // });

    // console.log(fieldMap);

    // await db.query("COMMIT");

    res.json({
      success: true,
      message: "Customer Added Successfully",
    });

  } catch (error) {

    await db.query("ROLLBACK");

    console.error(error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });

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

WHERE

    $1 = ''

    OR CAST(id AS TEXT) ILIKE '%' || $1 || '%'

    OR name ILIKE '%' || $1 || '%'

    OR phone ILIKE '%' || $1 || '%'

    OR email ILIKE '%' || $1 || '%'
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

WHERE ${whereClause}

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

const getCustomerById = async (req, res) => {
  try {
    const { id } = req.params;

    // Main Customer
    const result = await db.query(
      `
      SELECT *
      FROM customers
      WHERE id = $1
      LIMIT 1;
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

    // Dynamic Fields
    const fieldValues = await db.query(
      `
      SELECT
          ccf.field_key,
          cfv.field_value
      FROM customer_field_values cfv
      JOIN company_customer_fields ccf
          ON cfv.field_id = ccf.id
      WHERE cfv.customer_id = $1
      `,
      [id]
    );

    // Merge Customer + Dynamic Fields
    const customerData = {
      ...customer,
    };

    fieldValues.rows.forEach((field) => {
      customerData[field.field_key] = field.field_value;
    });

    res.json({
      success: true,
      customer: customerData,
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};
const updateCustomer = async (req, res) => {
  try {

    const { id } = req.params;

    // const { name, phone, email, address } = req.body;
    const { fields } = req.body;

    await db.query("BEGIN");

    await db.query(
      `UPDATE customers

SET

customer_code=$1,

name=$2,

phone=$3

WHERE id=$4`,
      [
 fields.customer_code,
 fields.customer_name,
 fields.phone,
 id
]
    );

    const fieldsResult = await db.query(`
  SELECT id, field_key
  FROM company_customer_fields
`);

const fieldMap = {};

fieldsResult.rows.forEach((field) => {
  fieldMap[field.field_key] = field.id;
});


await db.query(
  `
  DELETE FROM customer_field_values
  WHERE customer_id = $1
  `,
  [id]
);

for (const [fieldKey, fieldValue] of Object.entries(fields)) {

  if (
    fieldKey === "customer_code" ||
    fieldKey === "customer_name" ||
    fieldKey === "phone"
  ) {
    continue;
  }

  if (!fieldMap[fieldKey]) {
    continue;
  }

  await db.query(
    `
    INSERT INTO customer_field_values
    (customer_id, field_id, field_value)
    VALUES ($1, $2, $3)
    `,
    [
      id,
      fieldMap[fieldKey],
      fieldValue,
    ]
  );
}

await db.query("COMMIT");

    res.json({
      success: true,
      message: "Customer Updated Successfully",
    });

  } catch (error) {
    await db.query("ROLLBACK");

    console.error(error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });

  }
};

const deleteCustomer = async (req, res) => {

  try {

    const { id } = req.params;

    await db.query(
      "DELETE FROM customers WHERE id = $1",
      [id]
    );

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


// Legacy Excel importer (old ACN format)
// Keep only for reference until new importer is complete.

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

// const importCustomers = async (req, res) => {
//   try {

//     console.log("NEW JSON IMPORT");

//     const rows = req.body.rows;

//     const result = await importCustomersService(rows);

// return res.json(result);

//     let importedCount = 0;
//     let skippedCount = 0;
//     let failedCount = 0;

//     console.log("Total Rows :", rows.length);

//     for (const row of rows) {

//       try {

//         console.log(row.customer_code, row.customer_name);

//         const existingCustomer = await db.query(
//           `
//           SELECT id
//           FROM customers
//           WHERE customer_code = $1
//           LIMIT 1
//           `,
//           [
//             String(row.customer_code || "")
//           ]
//         );

//         if (existingCustomer.rows.length === 0) {

//           await db.query(
//             `
//             INSERT INTO customers
//             (
//               name,
//               phone,
//               address,
//               customer_code
//             )
//             VALUES
//             (
//               $1,
//               $2,
//               $3,
//               $4
//             )
//             `,
//             [
//               row.customer_name,
//               String(row.phone || ""),
//               row.location || "",
//               String(row.customer_code || ""),
//             ]
//           );

//           importedCount++;

//         } else {

//           skippedCount++;

//         }

//       } catch (error) {

//         failedCount++;

//         console.error(
//           `Failed Row: ${row.customer_code}`,
//           error.message
//         );

//       }

//     }

//     return res.json({
//       success: true,
//       total: rows.length,
//       imported: importedCount,
//       skipped: skippedCount,
//       failed: failedCount,
//     });

//   } catch (error) {

//     console.error(error);

//     return res.status(500).json({
//       success: false,
//       message: "Import Failed",
//     });

//   }
// };


const importCustomers = async (req, res) => {

    try {

        console.log("NEW JSON IMPORT");

        const rows = req.body.rows;

        const result = await importCustomersService(rows);

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
};