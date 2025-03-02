/* eslint-disable node/no-process-env */
const createConfig = require("@quick-bite/app-config/create-config");
const dotenv = require("dotenv");
const path = require("node:path");

dotenv.config({
  path: [
    path.join(__dirname, "../env"),
    path.join(__dirname, "../../../.env"),
  ],
});

module.exports = createConfig.default({
  DB_URI: process.env.DB_URI || "",
  NODE_ENV: process.env.NODE_ENV || "development",
  LOG_LEVEL: process.env.LOG_LEVEL || "info",
  USER_PASS_MIN_LENGTH: 8,
  AUTH_SECRET: process.env.AUTH_SECRET || "secret",
  SALT_ROUNDS: 10,
});
