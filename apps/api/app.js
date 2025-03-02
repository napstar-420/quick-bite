const cors = require("cors");
const express = require("express");
const path = require("node:path");

const { connectDB } = require("./config/db.js");
const config = require("./config");
const { errorHandler, errorNotFoundHandler } = require("./middlewares/error.middleware.js");
const { morganMiddleware } = require("./middlewares/morgan.middleware.js");
const AppRouter = require("./router.js");
const { logger } = require("./utils/logger.js");

const app = express();
app.use(cors());

// Trust Proxy for Proxies
app.set("trust proxy", true);

// Parse incoming requests data
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Log incoming requests
app.use(morganMiddleware);

// Connect to database
connectDB();

// Serve static files
app.use(express.static(path.join(__dirname, "./public")));

app.use((req, res, next) => {
  // If url doesn't contain "/api" serve react app from public folder
  if (req.originalUrl.startsWith("/api")) {
    return next();
  }

  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// Set app router
app.use("/api", AppRouter);

// Error Handlers
app.use(errorNotFoundHandler);
app.use(errorHandler);

const PORT = config.API_PORT;

// Start app
app.listen(PORT, () => {
  logger.info(`Server running on port http://localhost:${PORT}`);
});
