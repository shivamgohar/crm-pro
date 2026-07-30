const db = require("../config/db");
const XLSX = require("xlsx");

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
  (customer_code, name, phone)
  VALUES ($1, $2, $3)
  RETURNING id
  `,
  [
    fields.customer_code,
    fields.customer_name,
    fields.phone,
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
      page = 1,
      limit = 10
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

    const result = await db.query(
      `
SELECT DISTINCT ON (customer_code) *

FROM customers

WHERE

    $1 = ''

    OR customer_code ILIKE '%' || $1 || '%'

    OR name ILIKE '%' || $1 || '%'

    OR phone ILIKE '%' || $1 || '%'

    OR email ILIKE '%' || $1 || '%'

ORDER BY customer_code, id DESC

LIMIT $2
OFFSET $3


`,
      [
        search,
        pageSize,
        offset
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

   const { customerCode } = req.params;

    const result = await db.query(
      `
      SELECT *
      FROM customers
      WHERE customer_code  = $1
      ORDER BY id DESC
      LIMIT 1;
      `,
      [customerCode]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Customer not found",
      });
    }

    res.json({
      success: true,
      customer: result.rows[0],
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

    const { name, phone, email, address } = req.body;

    await db.query(
      `UPDATE customers
       SET name=$1,
           phone=$2,
           email=$3,
           address=$4
       WHERE id=$5`,
      [name, phone, email, address, id]
    );

    res.json({
      success: true,
      message: "Customer Updated Successfully",
    });

  } catch (error) {

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

const importCustomers = async (req, res) => {
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

    } }

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

module.exports = {
  addCustomer,
  getCustomers,
  getCustomerById,
  updateCustomer,
  deleteCustomer,
  importCustomers,
};