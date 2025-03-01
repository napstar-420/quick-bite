import cors from "cors";
import express from "express";
import path from "node:path";

import { connectDB } from "./config/db.js";
import config from "./config/index.js";
import { morganMiddleware } from "./middlewares/morgan.middleware.js";
import AppRouter from "./router.js";
import { logger } from "./utils/logger.js";

const app = express();
app.use(cors());
app.use(express.json());
app.use(morganMiddleware);

await connectDB();

app.use("/api", AppRouter);

app.use(express.static(path.join(config.__dirname, "./public")));
app.get("*", (_, res) => {
  res.sendFile(path.join(config.__dirname, "public", "index.html"));
});

const PORT = config.API_PORT;

app.listen(PORT, () => {
  logger.info(`Server running on port http://localhost:${PORT}`);
});
