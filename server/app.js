const express = require("express");
const cors = require("cors");
const db = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const protectedActionRoutes = require("./routes/protectedActionRoutes");
const customerRoutes = require("./routes/customerRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");
const productRoutes = require("./routes/productRoutes");
const orderRoutes = require("./routes/orderRoutes");
const reportRoutes = require("./routes/reportRoutes");
const inventoryRoutes = require("./routes/inventoryRoutes");
const invoiceRoutes = require("./routes/invoiceRoutes");
const paymentRoutes = require("./routes/paymentRoutes");
const serviceRoutes = require("./routes/serviceRoutes");
const companyFieldRoutes = require("./routes/companyFieldRoutes");
const companyStatusRoutes = require("./routes/companyStatusRoutes");
const customFieldRoutes = require("./routes/customFieldRoutes");
const app = express();

app.use(cors());
// app.use(express.json());

app.use(express.json({
  limit: "50mb"
}));

app.use(express.urlencoded({
  extended: true,
  limit: "50mb"
}));

// app.use((req, res, next) => {
//     const start = Date.now();

//     res.on("finish", () => {
//         console.log(
//             `${req.method} ${req.originalUrl} -> ${res.statusCode} (${Date.now() - start}ms)`
//         );
//     });

//     next();
// });

app.use(authRoutes); 
app.use("/api/protected-actions", protectedActionRoutes);
app.use("/api/customers", customerRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/reports", reportRoutes);
app.use("/api/inventory", inventoryRoutes);
app.use("/api/invoice", invoiceRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/services", serviceRoutes);
app.use("/api/company/customer-fields", companyFieldRoutes);
app.use("/api/company/customer-status", companyStatusRoutes);
app.use("/api/custom-fields", customFieldRoutes);






app.get("/", async (req, res) => {
  try {
    const result = await db.query("SELECT * FROM users");

    res.json(result.rows);

  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Database Error",
    });
  }
});



app.get("/health", (req, res) => {
  res.json({
    status: "ok",
    app: "CRM PRO",
    version: "1.0.0",
    timestamp: new Date().toISOString(),
  });
});

module.exports = app;