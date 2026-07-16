const express = require("express");
const cors = require("cors");
const db = require("./config/db");
const authRoutes = require("./routes/authRoutes"); // <-- NEW
const customerRoutes = require("./routes/customerRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");
const productRoutes = require("./routes/productRoutes");
const orderRoutes = require("./routes/orderRoutes");
const reportRoutes = require("./routes/reportRoutes");

const app = express();

app.use(cors());
app.use(express.json());

app.use(authRoutes); // <-- NEW
app.use("/customers", customerRoutes);
app.use("/dashboard", dashboardRoutes);
app.use("/products", productRoutes);
app.use("/orders", orderRoutes);
app.use("/reports", reportRoutes);

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