const pool = require("../config/db");
const PDFDocument = require("pdfkit");

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

    const doc = new PDFDocument({
      margin: 50
    });

    res.setHeader("Content-Type", "application/pdf");

    res.setHeader(
      "Content-Disposition",
      `attachment; filename=Invoice-${invoice.id}.pdf`
    );




    doc.pipe(res);


    //================ HEADER =================

    doc
      .font("Helvetica-Bold")
      .fontSize(24)
      .text("CRM PRO", { align: "center" });

    doc
      .font("Helvetica")
      .fontSize(11)
      .text("Customer Relationship Management System", {
        align: "center",
      });

    doc.moveDown(0.5);

    doc
      .font("Helvetica-Bold")
      .fontSize(20)
      .text("INVOICE", {
        align: "center",
      });

   

    doc.moveDown(1);
    doc.moveTo(50, 110)
      .lineTo(550, 110)
      .stroke();


    doc
      .font("Helvetica")
      .fontSize(10)
      .text("Phone : +91 XXXXX XXXXX", { align: "center" });

    doc.text("Email : support@crmpro.com", {
      align: "center",
    });

    //================ INVOICE INFO =================

    doc
      .font("Helvetica")
      .fontSize(11);

    doc.text(
      `Invoice No : INV-${invoice.id.toString().padStart(4, "0")}`,
      50,
      135
    );

    doc.text(
      `Date : ${new Date(invoice.created_at).toLocaleDateString("en-IN")}`,
      50,
      155
    );

    doc
      .font("Helvetica-Bold")
      .text("Status : PAID", 430, 145);

    //================ CUSTOMER BOX =================

    doc
      .rect(45, 190, 510, 120)
      .stroke();

    doc
      .font("Helvetica-Bold")
      .fontSize(15)
      .text("Customer Information", 60, 205);

    doc
      .font("Helvetica")
      .fontSize(11);

    doc.text(`Name`, 60, 235);
    doc.text(`: ${invoice.customer_name}`, 140, 235);

    doc.text(`Phone`, 60, 255);
    doc.text(`: ${invoice.phone}`, 140, 255);

    doc.text(`Email`, 60, 275);
    doc.text(`: ${invoice.email}`, 140, 275);

    doc.text(`Address`, 60, 295);
    doc.text(`: ${invoice.address}`, 140, 295);

    //================ PRODUCT TABLE =================

    const tableTop = 340;

    doc
      .font("Helvetica-Bold")
      .fontSize(12);

    doc.text("Product", 60, tableTop);

    doc.text("Category", 250, tableTop);

    doc.text("Price", 355, tableTop);

    doc.text("Qty", 430, tableTop);

    doc.text("Total", 495, tableTop);

    doc.moveTo(50, tableTop + 20)
      .lineTo(550, tableTop + 20)
      .stroke();

    doc
      .font("Helvetica")
      .fontSize(11);

    const row = tableTop + 35;

    doc.text(invoice.product_name, 60, row);

    doc.text(invoice.category, 250, row);

    doc.text(`Rs. ${invoice.price}`, 355, row);

    doc.text(invoice.quantity.toString(), 430, row);

    doc.text(`Rs. ${invoice.total}`, 495, row);

    doc.moveTo(50, row + 22)
      .lineTo(550, row + 22)
      .stroke();


    //================ GRAND TOTAL BOX =================

    const totalBoxX = 350;
    const totalBoxY = 405;
    const totalBoxWidth = 180;
    const totalBoxHeight = 70;

    doc
      .rect(totalBoxX, totalBoxY, totalBoxWidth, totalBoxHeight)
      .stroke();

    doc
      .font("Helvetica-Bold")
      .fontSize(14)
      .text("Grand Total", totalBoxX + 15, totalBoxY + 15);

    doc
      .font("Helvetica-Bold")
      .fontSize(20)
      .text(`Rs. ${invoice.total}`, totalBoxX + 15, totalBoxY + 38);

    //================ THANK YOU =================

    doc
      .font("Helvetica")
      .fontSize(12)
      .text(
        "Thank you for your business!",
        50,
        520,
        {
          align: "center",
        }
      );

    //================ SIGNATURE =================

    doc
      .moveTo(390, 600)
      .lineTo(530, 600)
      .stroke();

    doc
      .font("Helvetica")
      .fontSize(11)
      .text(
        "Authorized Signature",
        390,
        608
      );

    //================ FOOTER =================

    doc
      .moveTo(50, 700)
      .lineTo(550, 700)
      .stroke();

    doc
      .font("Helvetica")
      .fontSize(9)
      .text(
        "This is a computer generated invoice. No signature is required.",
        50,
        710,
        {
          width: 500,
          align: "center",
        }
      );




    doc.end();

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