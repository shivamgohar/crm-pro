const { Pool } = require("pg");

const pool = new Pool({
  host: "localhost",
  port: 5432,
  user: "postgres",
  password: "admin123",
  database: "crm_pro",
});

module.exports = pool;