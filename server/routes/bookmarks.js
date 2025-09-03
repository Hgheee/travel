import { Router } from "express";

const router = Router();
let bookmarks = [];

router.get("/bookmarks", (_, res) => {
  res.json({ items: bookmarks });
});

router.post("/bookmarks", (req, res) => {
  const place = req.body;
  if (!bookmarks.some((b) => b.id === place.id)) {
    bookmarks.push(place);
  }
  res.json({ items: bookmarks });
});

export default router;
