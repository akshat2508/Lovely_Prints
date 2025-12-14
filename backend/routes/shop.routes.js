import express from "express";
const router = express.Router();

router.get("/", (req, res) => {
  res.json({ message: "SHOP dashboard data" });
});

export default router;
