import express from "express";
const router = express.Router();

router.get("/", (req, res) => {
  res.json({ message: "ORDER  data" });
});

export default router;
