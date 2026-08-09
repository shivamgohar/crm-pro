const pool = require("../../config/db");

async function checkDatabaseConnection() {
  try {
    await pool.query("SELECT NOW()");
    return true;
  } catch (error) {
    return false;
  }
}

module.exports = {
  checkDatabaseConnection,
};
