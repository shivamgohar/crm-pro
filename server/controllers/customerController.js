const db = require("../config/db");
const XLSX = require("xlsx");

const addCustomer = async (req, res) => {

  try {

    const {
      name,
      phone,
      email,
      address,
    } = req.body;

    await db.query(
      `INSERT INTO customers
            (name, phone, email, address)
            VALUES ($1, $2, $3, $4)`,
      [name, phone, email, address]
    );

    res.json({
      success: true,
      message: "Customer Added Successfully",
    });

  } catch (error) {

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
SELECT *

FROM customers

WHERE

    $1 = ''

    OR CAST(id AS TEXT) ILIKE '%' || $1 || '%'

    OR name ILIKE '%' || $1 || '%'

    OR phone ILIKE '%' || $1 || '%'

    OR email ILIKE '%' || $1 || '%'

ORDER BY id DESC

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
  updateCustomer,
  deleteCustomer,
  importCustomers
};