import { Router } from "express";
import axios from "axios";

const router = Router();

router.get("/search", async (req, res) => {
  try {
    const query = req.query.q;
    if (!query) return res.status(400).json({ error: "q is required" });

    const resp = await axios.get(
      "https://dapi.kakao.com/v2/local/search/keyword.json",
      {
        headers: { Authorization: `KakaoAK ${process.env.KAKAO_REST_KEY}` },
        params: { query, size: 15 },
      }
    );

    const places = (resp.data?.documents || []).map((d) => ({
      id: d.id,
      name: d.place_name,
      address: d.road_address_name || d.address_name,
      lat: parseFloat(d.y),
      lng: parseFloat(d.x),
      url: d.place_url,
    }));

    res.json({ places });
  } catch (e) {
    console.error(e?.response?.data || e.message);
    res.status(500).json({ error: "search failed" });
  }
});

export default router;
