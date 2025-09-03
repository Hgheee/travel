const express = require("express");
const cors = require("cors");
const axios = require("axios");
require("dotenv").config();
console.log("Loaded PORT from env:", process.env.PORT);

const app = express();

// 프론트 개발서버(5173)에서 호출 허용
app.use(cors({ origin: "http://localhost:5173", credentials: true }));
app.use(express.json());

const PORT = process.env.PORT || 3001;

// 헬스체크(동작 확인용)
app.get("/api/health", (_, res) => res.json({ ok: true }));

// 키워드 검색 프록시 (브라우저 → 내 서버 → 카카오 Local API)
app.get("/api/search", async (req, res) => {
  try {
    const query = req.query.q;
    if (!query) {
      return res.status(400).json({ error: "q is required" });
    }

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

app.listen(PORT, () => {
  console.log(`API running on http://localhost:${PORT}`);
});
