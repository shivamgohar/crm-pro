
const appConfig = require("../../config/appConfig");


const PDFDocument = require("pdfkit");


const drawHeader = (doc) => {

  doc
    .font("Helvetica-Bold")
    .fontSize(24)
    .text(appConfig.company, {
      align: "center",
    });

  doc
    .font("Helvetica")
    .fontSize(11)
    .text(appConfig.appName, {
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

  doc
    .moveTo(50, 120)
    .lineTo(550, 120)
    .stroke();

};


const drawInvoiceInfo = (doc, invoice) => {

  doc
    .font("Helvetica")
    .fontSize(11);

  doc.text(
    `Invoice No : INV-${invoice.id
      .toString()
      .padStart(4, "0")}`,
    50,
    135
  );

  doc.text(
    `Date : ${new Date(
      invoice.created_at
    ).toLocaleDateString("en-IN")}`,
    50,
    155
  );

  doc
    .font("Helvetica-Bold")
    .fillColor("#2E7D32")
    .text(
      "Status : PAID",
      420,
      145
    );

  doc.fillColor("black");
};

const drawCustomerInfo = (doc, invoice) => {

  doc
    .rect(45, 190, 510, 120)
    .stroke();

  doc
    .font("Helvetica-Bold")
    .fontSize(15)
    .text(
      "Customer Information",
      60,
      205
    );

  doc
    .font("Helvetica")
    .fontSize(11);

  doc.text("Customer", 60, 235);
  doc.text(`: ${invoice.customer_name}`, 160, 235);

  doc.text("Phone", 60, 255);
  doc.text(`: ${invoice.phone}`, 160, 255);

  //   doc.text("Email", 60, 275);
  //   doc.text(`: ${invoice.email}`, 160, 275);

  doc.text("Address", 60, 275);
  doc.text(`: ${invoice.address}`, 160, 275);

};


const drawProductTable = (doc, invoice) => {

  const tableTop = 340;

  // Header
  doc
    .font("Helvetica-Bold")
    .fontSize(12);

  doc.text("#", 60, tableTop);

  doc.text("Product", 85, tableTop);

  doc.text("Category", 250, tableTop);

  doc.text("Unit Price", 345, tableTop);

  doc.text("Qty", 445, tableTop);

  doc.text("Amount", 490, tableTop);

  doc
    .moveTo(50, tableTop + 20)
    .lineTo(550, tableTop + 20)
    .stroke();

  // Row
  doc
    .font("Helvetica")
    .fontSize(11);

  const row = tableTop + 35;

  doc.text("1", 60, row);

  doc.text(invoice.product_name, 85, row);

  doc.text(invoice.category, 250, row);

  doc.text(`Rs. ${invoice.price}`, 345, row);

  doc.text(invoice.quantity.toString(), 445, row);

  doc.text(`Rs. ${invoice.total}`, 490, row);

  doc
    .moveTo(50, row + 22)
    .lineTo(550, row + 22)
    .stroke();

};

const drawGrandTotal = (doc, invoice) => {

  const boxX = 350;
  const boxY = 405;
  const boxWidth = 180;
  const boxHeight = 70;

  doc
    .roundedRect(boxX, boxY, boxWidth, boxHeight, 5)
    .fillAndStroke("#F5F5F5", "#D0D0D0");

  doc
    .fillColor("#000")
    .font("Helvetica-Bold")
    .fontSize(13)
    .text("Grand Total", boxX + 15, boxY + 15);

  doc
    .fontSize(22)
    .fillColor("#1565C0")
    .text(`Rs. ${invoice.total}`, boxX + 15, boxY + 38);

  // Reset
  doc.fillColor("#000");

};


const drawFooter = (doc) => {

  // Signature Lines

  doc
    .moveTo(60, 600)
    .lineTo(200, 600)
    .stroke();

  doc
    .moveTo(350, 600)
    .lineTo(520, 600)
    .stroke();

  doc
    .font("Helvetica")
    .fontSize(11);

  doc.text(
    "Customer Signature",
    60,
    608
  );

  doc.text(
    "Authorized Signature",
    350,
    608
  );

  // Footer Line

  doc
    .moveTo(50, 690)
    .lineTo(550, 690)
    .stroke();

  // Footer Text

  doc
    .font("Helvetica")
    .fontSize(10)
    .text(
      "Thank you for choosing ACN GROUP",
      50,
      705,
      {
        width: 500,
        align: "center",
      }
    );

  doc
    .fontSize(9)
    .fillColor("gray")
    .text(
      `${appConfig.supportEmail} | ${appConfig.website}`,
      {
        width: 500,
        align: "center",
      }
    );

  doc.moveDown(0.5);

  doc
    .text(
      "This is a computer generated invoice.",
      {
        width: 500,
        align: "center",
      }
    );

  doc.fillColor("black");

};


const generateInvoicePDF = (invoice, res) => {
  const doc = new PDFDocument({
    margin: 50,
  });

  res.setHeader("Content-Type", "application/pdf");

  res.setHeader(
    "Content-Disposition",
    `attachment; filename=Invoice-${invoice.id}.pdf`
  );

  doc.pipe(res);

  drawHeader(doc);
  drawInvoiceInfo(doc, invoice);
  drawCustomerInfo(doc, invoice);
  drawProductTable(doc, invoice);
  drawGrandTotal(doc, invoice);
  drawFooter(doc);

  doc.end();

  // console.log(appConfig);

};

module.exports = {
  generateInvoicePDF,
};