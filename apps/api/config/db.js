import mongoose from "mongoose";

import { logger } from "../utils/logger.js";
import config from "./index.js";

export async function connectDB() {
  try {
    const conn = await mongoose.connect(config.DB_CONN_STR);
    logger.info(`MongoDB connected: ${conn.connection.host}`);
  }
  catch (error) {
    logger.error("Mongo DB connection failed");
    logger.error(error);
    process.exit(1);
  }
}

mongoose.connection.on("disconnected", () => {
  logger.warn("MongoDB disconnected! Reconnecting...");
  connectDB();
});
