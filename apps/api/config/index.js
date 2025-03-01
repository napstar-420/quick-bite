/* eslint-disable node/no-process-env */
import createConfig from "@quick-bite/app-config/create-config";
import dotenv from "dotenv";
import path, { dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({
  path: [
    path.join(__dirname, "../.env"),
    path.join(__dirname, "../../../.env"),
  ],
});

export default createConfig({
  __dirname,
  DB_CONN_STR: process.env.DB_CONN_STR || "",
  NODE_ENV: process.env.NODE_ENV || "development",
  LOG_LEVEL: process.env.LOG_LEVEL || "info",
});
