const pool = require("../config/db");
// const PDFDocument = require("pdfkit");
const {
  generateInvoicePDF,
} = require("../services/pdf/invoicePdfService");

const getInvoices = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT
    orders.id,

    customers.name AS customer_name,
    customers.phone,
    customers.email,
    customers.address,

    products.name AS product_name,
    products.category,
    products.price,

    orders.quantity,
    orders.total,

    orders.created_at

FROM orders

JOIN customers
ON orders.customer_id = customers.id

JOIN products
ON orders.product_id = products.id

ORDER BY orders.id DESC;
    `);

    res.json({
      success: true,
      invoices: result.rows,
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};


const downloadInvoicePDF = async (req, res) => {

  try {

    const { id } = req.params;

    const result = await pool.query(

      `

            SELECT

                orders.id,

                customers.name AS customer_name,
                customers.phone,
                customers.email,
                customers.address,

                products.name AS product_name,
                products.category,
                products.price,

                orders.quantity,
                orders.total,

                orders.created_at

            FROM orders

            JOIN customers
            ON orders.customer_id = customers.id

            JOIN products
            ON orders.product_id = products.id

            WHERE orders.id = $1

            `,

      [id]

    );

    if (result.rows.length === 0) {

      return res.status(404).json({

        success: false,

        message: "Invoice Not Found"

      });

    }
    // console.log(result.rows);

    // return res.json(result.rows);

    const invoice = result.rows[0];

   
    return generateInvoicePDF(invoice, res);


    res.setHeader("Content-Type", "application/pdf");

    res.setHeader(
      "Content-Disposition",
      `attachment; filename=Invoice-${invoice.id}.pdf`
    );

  } catch (error) {

    console.error(error);

    res.status(500).json({

      success: false,
      message: "Server Error"

    });

  }

};

module.exports = {
  getInvoices,
  downloadInvoicePDF,
};