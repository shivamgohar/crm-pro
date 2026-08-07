const path = require("path");

const isDevelopment =
  process.env.NODE_ENV !== "production";

module.exports = {
  isDevelopment,

  rootPath: path.join(__dirname, "../../"),

  configPath: path.join(
    __dirname,
    "../../config"
  ),

  uploadsPath: path.join(
    __dirname,
    "../../uploads"
  ),
};