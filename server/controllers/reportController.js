const db = require("../config/db");
const PDFDocument = require("pdfkit");
const ExcelJS = require("exceljs");

const getReportSummary = async (req, res) => {

    try {

        const todayRevenueResult = await db.query(`
      SELECT COALESCE(SUM(total),0) AS revenue
      FROM orders
      WHERE DATE(created_at)=CURRENT_DATE
    `);

        const todayOrdersResult = await db.query(`
      SELECT COUNT(*) AS orders
      FROM orders
      WHERE DATE(created_at)=CURRENT_DATE
    `);

        const monthRevenueResult = await db.query(`
      SELECT COALESCE(SUM(total),0) AS revenue
      FROM orders
      WHERE DATE_TRUNC('month', created_at)
      =
      DATE_TRUNC('month', CURRENT_DATE)
    `);

        const customerResult = await db.query(`
      SELECT COUNT(*) AS customers
      FROM customers
    `);



        res.json({

            success: true,

            todayRevenue: Number(todayRevenueResult.rows[0].revenue),

            todayOrders: Number(todayOrdersResult.rows[0].orders),

            monthRevenue: Number(monthRevenueResult.rows[0].revenue),

            customers: Number(customerResult.rows[0].customers)

        });

    } catch (error) {

        console.error(error);

        res.status(500).json({

            success: false,

            message: "Server Error"

        });

    }

};


const downloadReportPDF = async (req, res) => {
    try {

        // =========================
        // Database Queries
        // =========================

        const todayRevenueResult = await db.query(`
      SELECT COALESCE(SUM(total),0) AS revenue
      FROM orders
      WHERE DATE(created_at)=CURRENT_DATE
    `);

        const todayOrdersResult = await db.query(`
      SELECT COUNT(*) AS orders
      FROM orders
      WHERE DATE(created_at)=CURRENT_DATE
    `);

        const monthRevenueResult = await db.query(`
      SELECT COALESCE(SUM(total),0) AS revenue
      FROM orders
      WHERE DATE_TRUNC('month', created_at)
      =
      DATE_TRUNC('month', CURRENT_DATE)
    `);

        const customerResult = await db.query(`
      SELECT COUNT(*) AS customers
      FROM customers
    `);

        // =========================
        // Create PDF
        // =========================

        const doc = new PDFDocument({
            margin: 50,
        });

        res.setHeader("Content-Type", "application/pdf");

        res.setHeader(
            "Content-Disposition",
            "attachment; filename=SalesReport.pdf"
        );

        doc.pipe(res);

        // =========================
        // Header
        // =========================

        doc
            .fontSize(26)
            .fillColor("#1565c0")
            .text("ACN GROUP CRM", {
                align: "center",
            });

        doc.moveDown(0.5);

        doc
            .fontSize(20)
            .fillColor("black")
            .text("Sales Summary Report", {
                align: "center",
            });

        doc.moveDown();

        doc
            .fontSize(12)
            .fillColor("black")
            .text(
                `Generated : ${new Date().toLocaleString("en-IN", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                    hour12: true,
                })}`
            );

        doc.moveDown();

        // Blue Divider Line

        doc
            .moveTo(50, doc.y)
            .lineTo(550, doc.y)
            .stroke("#1565c0");

        doc.moveDown();

        // =========================
        // Report Summary
        // =========================

        doc
            .fontSize(18)
            .fillColor("#1565c0")
            .text("Report Summary");

        doc.moveDown();

        // Table Header

        doc
            .fontSize(13)
            .fillColor("black");

        doc.text("Metric", 70, doc.y);

        doc.text("Value", 350, doc.y);

        doc.moveDown(0.5);

        doc
            .moveTo(50, doc.y)
            .lineTo(550, doc.y)
            .stroke("#1565c0");

        doc.moveDown();


        // =========================
        // Report Rows
        // =========================

        const reportData = [
            [
                "Today's Revenue",
                `Rs. ${Number(todayRevenueResult.rows[0].revenue).toLocaleString("en-IN")}`,
            ],
            [
                "Today's Orders",
                todayOrdersResult.rows[0].orders.toString(),
            ],
            [
                "Monthly Revenue",
                `Rs. ${Number(monthRevenueResult.rows[0].revenue).toLocaleString("en-IN")}`,
            ],
            [
                "Customers",
                customerResult.rows[0].customers.toString(),
            ],
        ];

        reportData.forEach(([label, value]) => {

            const y = doc.y;

            doc
                .fontSize(12)
                .fillColor("black")
                .text(label, 70, y);

            doc
                .fontSize(12)
                .text(value, 350, y);

            doc.moveDown();

            doc
                .moveTo(60, doc.y)
                .lineTo(540, doc.y)
                .strokeColor("#dddddd")
                .stroke();

            doc.moveDown(0.6);

        });
        // =========================
        // Footer
        // =========================

        doc.y = 720;

        doc
            .moveTo(50, doc.y)
            .lineTo(550, doc.y)
            .stroke("#1565c0");

        doc.moveDown();

        doc
            .fontSize(10)
            .fillColor("gray")
            .text(
                "Generated by ACN GROUP CRM",
                {
                    align: "center",
                }
            );

        doc
            .fontSize(9)
            .text(
                "© 2026 ACN GROUP CRM. All Rights Reserved.",
                {
                    align: "center",
                }
            );

        doc.end();


    } catch (error) {

        console.error(error);

        res.status(500).json({
            success: false,
            message: "PDF Error",
        });

    }

};

const downloadReportExcel = async (req, res) => {

  try {

    const todayRevenueResult = await db.query(`
      SELECT COALESCE(SUM(total),0) AS revenue
      FROM orders
      WHERE DATE(created_at)=CURRENT_DATE
    `);

    const todayOrdersResult = await db.query(`
      SELECT COUNT(*) AS orders
      FROM orders
      WHERE DATE(created_at)=CURRENT_DATE
    `);

    const monthRevenueResult = await db.query(`
      SELECT COALESCE(SUM(total),0) AS revenue
      FROM orders
      WHERE DATE_TRUNC('month', created_at)
      =
      DATE_TRUNC('month', CURRENT_DATE)
    `);

    const customerResult = await db.query(`
      SELECT COUNT(*) AS customers
      FROM customers
    `);

    const workbook = new ExcelJS.Workbook();

    const worksheet = workbook.addWorksheet("Sales Report");

        // =========================
    // Title
    // =========================

    worksheet.mergeCells("A1:B1");

    worksheet.getCell("A1").value = "ACN GROUP CRM";

    worksheet.getCell("A1").font = {
      size: 18,
      bold: true,
    };

    worksheet.getCell("A1").alignment = {
      horizontal: "center",
    };

    worksheet.mergeCells("A2:B2");

    worksheet.getCell("A2").value = "Sales Summary Report";

    worksheet.getCell("A2").font = {
      size: 14,
      bold: true,
    };

    worksheet.getCell("A2").alignment = {
      horizontal: "center",
    };

    worksheet.addRow([]);

    // =========================
    // Table Header
    // =========================

    worksheet.columns = [
      {
        header: "Metric",
        key: "metric",
        width: 30,
      },
      {
        header: "Value",
        key: "value",
        width: 25,
      },
    ];

        worksheet.addRow({
      metric: "Today's Revenue",
      value: `Rs. ${Number(todayRevenueResult.rows[0].revenue).toLocaleString("en-IN")}`,
    });

    worksheet.addRow({
      metric: "Today's Orders",
      value: todayOrdersResult.rows[0].orders,
    });

    worksheet.addRow({
      metric: "Monthly Revenue",
      value: `Rs. ${Number(monthRevenueResult.rows[0].revenue).toLocaleString("en-IN")}`,
    });

    worksheet.addRow({
      metric: "Customers",
      value: customerResult.rows[0].customers,
    });

        // =========================
    // Download Excel
    // =========================

    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );

    res.setHeader(
      "Content-Disposition",
      "attachment; filename=SalesReport.xlsx"
    );

    await workbook.xlsx.write(res);

    res.end();

      } catch (error) {

    console.error(error);

    res.status(500).json({
      success: false,
      message: "Excel Generation Failed",
    });

  }

};

module.exports = {
    getReportSummary,
    downloadReportPDF,
    downloadReportExcel,

};