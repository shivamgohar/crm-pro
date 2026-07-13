const express = require("express");
const cors = require("cors");
const db = require("./config/db");
const authRoutes = require("./routes/authRoutes"); // <-- NEW

const app = express();

app.use(cors());
app.use(express.json());

app.use(authRoutes); // <-- NEW

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