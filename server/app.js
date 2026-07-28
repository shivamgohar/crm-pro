const express = require("express");
const cors = require("cors");
const db = require("./config/db");
const authRoutes = require("./routes/authRoutes"); // <-- NEW
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
const app = express();

app.use(cors());
app.use(express.json());

// app.use((req, res, next) => {
//     const start = Date.now();

//     res.on("finish", () => {
//         console.log(
//             `${req.method} ${req.originalUrl} -> ${res.statusCode} (${Date.now() - start}ms)`
//         );
//     });

//     next();
// });

app.use(authRoutes); // <-- NEW
app.use("/api/customers", customerRoutes);
app.use("/dashboard", dashboardRoutes);
app.use("/products", productRoutes);
app.use("/orders", orderRoutes);
app.use("/reports", reportRoutes);
app.use("/inventory", inventoryRoutes);
app.use("/invoice", invoiceRoutes);
app.use("/payments", paymentRoutes);
app.use("/api/services", serviceRoutes);
app.use("/api/company/customer-fields", companyFieldRoutes);
app.use("/api/company/customer-status", companyStatusRoutes);

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

module.exports = app;