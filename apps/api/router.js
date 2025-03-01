import express from "express";

const router = express.Router();

router.get("/", (_, res) => {
  res.json({ message: "Hi from QuickBite" });
});

export default router;
