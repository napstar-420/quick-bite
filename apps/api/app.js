import cors from "cors";
import express from "express";
import path, { dirname } from "node:path";
import { fileURLToPath } from "node:url";

import config from "./config/index.js";
import AppRouter from "./router.js";

const app = express();
app.use(cors());
app.use(express.json());
app.use("/api", AppRouter);

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

app.use(express.static(path.join(__dirname, "../public")));
app.get("*", (_, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

const PORT = config.API_PORT;

app.listen(PORT, () => {
  console.log(`Server running on port http://localhost:${PORT}`);
});
