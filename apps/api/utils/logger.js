import winston from "winston";
import "winston-daily-rotate-file";

import config from "../config/index.js";

const fileRotateTransport = new winston.transports.DailyRotateFile({
  filename: "logs/combined-%DATE%.log",
  datePattern: "YYYY-MM-DD",
  maxFiles: "14d",
});

const errorFileRotateTransport = new winston.transports.DailyRotateFile({
  filename: "logs/error-%DATE%.log",
  datePattern: "YYYY-MM-DD",
  maxFiles: "14d",
  level: "error",
});

export const logger = winston.createLogger({
  level: config.LOG_LEVEL,
  format: winston.format.combine(
    winston.format.errors({ stack: true }),
    winston.format.timestamp({
      format: "YYYY-MM-DD hh:mm:ss.SSS A",
    }),
    winston.format.json(),
  ),
  transports: [
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple(),
      ),
    }),
    errorFileRotateTransport, // Log errors to a file
    fileRotateTransport, // Log all messages to a file
  ],
});

// If in production, log only to files
if (config.NODE_ENV === "production") {
  logger.add(
    new winston.transports.File({ filename: "logs/app.log" }),
  );
}
