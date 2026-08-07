const fs = require("fs");
const path = require("path");

function getSchemaSQL() {
  return fs.readFileSync(
    path.join(
      __dirname,
      "../../../database/schema.sql"
    ),
    "utf8"
  );
}

module.exports = {
  getSchemaSQL,
};