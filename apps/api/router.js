const express = require("express");

const authRouter = require("./routes/auth.route.js");

const router = express.Router();

router.get("/", (_, res) => {
  res.json({ message: "Hi from QuickBite" });
});

router.use("/auth", authRouter);

module.exports = router;
