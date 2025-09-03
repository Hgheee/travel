import express from "express";
import cors from "cors";
import axios from "axios";
import dotenv from "dotenv";

import searchRoutes from "./routes/search.js";
import bookmarkRoutes from "./routes/bookmarks.js";
import recommendRoutes from "./routes/recommend.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors({ origin: "http://localhost:5173", credentials: true }));
app.use(express.json());

app.get("/api/health", (_, res) => res.json({ ok: true }));

app.use("/api", searchRoutes);
app.use("/api", bookmarkRoutes);
app.use("/api", recommendRoutes);

app.listen(PORT, () => {
  console.log(`API running on http://localhost:${PORT}`);
});
