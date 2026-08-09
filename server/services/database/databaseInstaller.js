const { getSchemaSQL } = require("./databaseBootstrap");

async function installDatabase() {
  const schema = getSchemaSQL();

  console.log("Schema loaded successfully.");
  console.log(`Schema Size: ${schema.length} bytes`);

  // Yahin future me:
  // CREATE DATABASE
  // Execute schema.sql
  // Execute seed.sql
}

module.exports = {
  installDatabase,
};