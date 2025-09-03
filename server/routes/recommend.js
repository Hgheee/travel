import { Router } from "express";

const router = Router();

router.post("/recommend", (req, res) => {
  const { places = [] } = req.body;
  const shuffled = [...places].sort(() => Math.random() - 0.5);
  res.json({ items: shuffled });
});

export default router;
