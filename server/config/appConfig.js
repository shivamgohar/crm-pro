const path = require("path");
const fs = require("fs");

const configPath = path.join(
  __dirname,
  "../../config/app.config.json"
);

const appConfig = JSON.parse(
  fs.readFileSync(configPath, "utf8")
);

module.exports = appConfig;