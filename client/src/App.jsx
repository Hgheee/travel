import { useEffect, useRef, useState } from "react";

// --- Kakao 스크립트 로더 ---
function loadKakaoScript(appKey) {
  return new Promise((resolve, reject) => {
    if (typeof window === "undefined") return resolve();
    if (window.kakao?.maps) return resolve();
    const s = document.createElement("script");
    s.src = `https://dapi.kakao.com/v2/maps/sdk.js?appkey=${appKey}&autoload=false&libraries=services,clusterer`;
    s.async = true;
    s.onload = () => window.kakao.maps.load(() => resolve());
    s.onerror = reject;
    document.head.appendChild(s);
  });
}

const API_BASE = import.meta.env.VITE_API_BASE;

// --- 검색 바 ---
function SearchBar({ onSearch }) {
  const [q, setQ] = useState("");
  return (
    <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
      <input
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder="예: 카페, 전망대, 한식, 야경..."
        style={{
          flex: 1,
          padding: "10px 12px",
          borderRadius: 10,
          border: "1px solid #ddd",
        }}
      />
      <button
        onClick={() => onSearch(q)}
        style={{
          padding: "10px 16px",
          borderRadius: 10,
          border: "1px solid #ddd",
        }}
      >
        검색
      </button>
    </div>
  );
}

// --- 장소 리스트(검색 결과) ---
function PlaceList({ places, onPick, onBookmark, bookmarks, onAddToPlan }) {
  const bookmarked = new Set(bookmarks.map((b) => b.id));
  return (
    <div style={{ display: "grid", gap: 8 }}>
      {places.map((p) => (
        <div
          key={p.id}
          style={{ border: "1px solid #eee", padding: 12, borderRadius: 10 }}
        >
          <div
            style={{ display: "flex", justifyContent: "space-between", gap: 8 }}
          >
            <div style={{ cursor: "pointer" }} onClick={() => onPick(p)}>
              <strong>{p.name}</strong>
              <div style={{ color: "#666", fontSize: 13 }}>{p.address}</div>
            </div>
            <div style={{ display: "flex", gap: 6 }}>
              <button
                onClick={() => onAddToPlan(p)}
                title="일정에 추가"
                style={{ borderRadius: 8 }}
              >
                ➕ 일정
              </button>
              <button
                onClick={() => onBookmark(p)}
                title="즐겨찾기"
                style={{ borderRadius: 8 }}
              >
                {bookmarked.has(p.id) ? "★" : "☆"}
              </button>
            </div>
          </div>
          {p.url && (
            <a
              href={p.url}
              target="_blank"
              rel="noreferrer"
              style={{ fontSize: 12 }}
            >
              카카오 상세
            </a>
          )}
        </div>
      ))}
    </div>
  );
}

// --- 여행 일정 리스트 ---
function ItineraryList({ items, onPick, onRemove, onClear }) {
  return (
    <div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          margin: "6px 0",
        }}
      >
        <h3 style={{ margin: 0 }}>여행 일정</h3>
        <button
          onClick={onClear}
          disabled={items.length === 0}
          style={{ borderRadius: 8, padding: "6px 10px" }}
        >
          전체 비우기
        </button>
      </div>
      {items.length === 0 ? (
        <div style={{ color: "#777", fontSize: 13 }}>
          일정이 비어 있어요. 검색 결과에서 <b>“➕ 일정”</b>을 눌러 추가하세요.
        </div>
      ) : (
        <ol style={{ paddingLeft: 18, display: "grid", gap: 6 }}>
          {items.map((p, idx) => (
            <li
              key={p.id}
              style={{
                display: "flex",
                justifyContent: "space-between",
                gap: 8,
              }}
            >
              <div style={{ cursor: "pointer" }} onClick={() => onPick(p)}>
                <b>
                  {idx + 1}. {p.name}
                </b>
                <div style={{ color: "#666", fontSize: 12 }}>{p.address}</div>
              </div>
              <button
                onClick={() => onRemove(p.id)}
                title="삭제"
                style={{ borderRadius: 8 }}
              >
                삭제
              </button>
            </li>
          ))}
        </ol>
      )}
    </div>
  );
}

export default function App() {
  const mapDiv = useRef(null);
  const [map, setMap] = useState(null);
  const [places, setPlaces] = useState([]);
  const [markers, setMarkers] = useState([]);
  const [bookmarks, setBookmarks] = useState([]);

  // --- 신규: 여행 일정 & 폴리라인 상태 ---
  const [itinerary, setItinerary] = useState([]); // [{id,name,address,lat,lng,url}]
  const [polyline, setPolyline] = useState(null); // kakao.maps.Polyline

  // 지도 초기화
  useEffect(() => {
    const key = import.meta.env.VITE_KAKAO_JS_KEY;
    loadKakaoScript(key).then(() => {
      const kakao = window.kakao;
      const m = new kakao.maps.Map(mapDiv.current, {
        center: new kakao.maps.LatLng(37.5665, 126.978),
        level: 5,
      });
      setMap(m);
    });
  }, []);

  // 북마크 초기 로드
  useEffect(() => {
    fetch(`${API_BASE}/api/bookmarks`)
      .then((r) => r.json())
      .then((d) => setBookmarks(d.items || []));
  }, []);

  const clearMarkers = () => {
    markers.forEach((m) => m.setMap(null));
    setMarkers([]);
  };

  const drawMarkers = (arr) => {
    if (!map) return;
    const kakao = window.kakao;
    const bounds = new kakao.maps.LatLngBounds();
    const mm = [];

    arr.forEach((p) => {
      const pos = new kakao.maps.LatLng(p.lat, p.lng);
      const m = new kakao.maps.Marker({ map, position: pos, title: p.name });
      const iw = new kakao.maps.InfoWindow({
        content: `<div style="padding:6px 8px">${p.name}</div>`,
      });
      kakao.maps.event.addListener(m, "click", () => iw.open(map, m));
      bounds.extend(pos);
      mm.push(m);
    });

    setMarkers(mm);
    if (arr.length) map.setBounds(bounds);
  };

  const onSearch = async (q) => {
    if (!q) return;
    clearMarkers();
    const res = await fetch(
      `${API_BASE}/api/search?q=${encodeURIComponent(q)}`
    );
    const data = await res.json();
    setPlaces(data.places || []);
    drawMarkers(data.places || []);
  };

  const onPick = (p) => {
    if (!map) return;
    const kakao = window.kakao;
    const latlng = new kakao.maps.LatLng(p.lat, p.lng);
    map.panTo(latlng);
  };

  const onBookmark = async (p) => {
    await fetch(`${API_BASE}/api/bookmarks`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(p),
    });
    const list = await (await fetch(`${API_BASE}/api/bookmarks`)).json();
    setBookmarks(list.items || []);
  };

  // --- 여행 일정: 추가/삭제/초기화 ---
  const addToPlan = (p) => {
    setItinerary((prev) =>
      prev.some((x) => x.id === p.id) ? prev : [...prev, p]
    );
  };
  const removeFromPlan = (id) => {
    setItinerary((prev) => prev.filter((p) => p.id !== id));
  };
  const clearPlan = () => setItinerary([]);

  // --- 폴리라인 초기화(지도 준비 후 1회) ---
  useEffect(() => {
    if (!map || polyline) return;
    const kakao = window.kakao;
    const pl = new kakao.maps.Polyline({
      map,
      path: [],
      strokeWeight: 5,
      strokeColor: "#3b82f6", // 파란색
      strokeOpacity: 0.85,
      strokeStyle: "solid",
    });
    setPolyline(pl);
    return () => pl.setMap(null);
  }, [map, polyline]);

  // --- 일정 변경 시: 폴리라인 경로 업데이트 & 보기 영역 맞춤 ---
  useEffect(() => {
    if (!map || !polyline) return;
    const kakao = window.kakao;
    const path = itinerary.map((p) => new kakao.maps.LatLng(p.lat, p.lng));
    polyline.setPath(path);
    if (path.length > 0) {
      const bounds = new kakao.maps.LatLngBounds();
      path.forEach((pos) => bounds.extend(pos));
      map.setBounds(bounds);
    }
  }, [itinerary, map, polyline]);

  // --- 추천(기존 기능) ---
  const onRecommend = async () => {
    if (!map) return;
    const center = map.getCenter();
    const body = {
      places,
      center: { lat: center.getLat(), lng: center.getLng() },
    };
    const res = await fetch(`${API_BASE}/api/recommend`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    const data = await res.json();
    setPlaces(data.items || []);
    clearMarkers();
    drawMarkers(data.items || []);
  };

  return (
    <main style={{ maxWidth: 1080, margin: "24px auto", padding: 16 }}>
      <h1 style={{ marginBottom: 8 }}>여행지 추천 맵 (Express + React)</h1>
      <SearchBar onSearch={onSearch} />
      <div
        style={{ display: "grid", gridTemplateColumns: "1.2fr 0.8fr", gap: 16 }}
      >
        {/* 지도 영역 */}
        <div>
          <div
            ref={mapDiv}
            style={{ width: "100%", height: "62vh", borderRadius: 12 }}
          />
          <div style={{ marginTop: 8, display: "flex", gap: 8 }}>
            <button
              onClick={onRecommend}
              style={{ padding: "8px 12px", borderRadius: 8 }}
            >
              추천 정렬
            </button>
            <a
              href={`${API_BASE}/api/health`}
              target="_blank"
              rel="noreferrer"
              style={{ fontSize: 12, color: "#555" }}
            >
              API 상태 확인
            </a>
          </div>
        </div>

        {/* 사이드 패널 */}
        <div
          style={{
            maxHeight: "62vh",
            overflow: "auto",
            display: "grid",
            gap: 14,
          }}
        >
          <ItineraryList
            items={itinerary}
            onPick={onPick}
            onRemove={removeFromPlan}
            onClear={clearPlan}
          />
          <div>
            <h3 style={{ margin: "6px 0" }}>검색 결과</h3>
            <PlaceList
              places={places}
              onPick={onPick}
              onBookmark={onBookmark}
              bookmarks={bookmarks}
              onAddToPlan={addToPlan}
            />
          </div>
          <div>
            <h3 style={{ margin: "12px 0 6px" }}>즐겨찾기</h3>
            <ul style={{ paddingLeft: 18 }}>
              {bookmarks.map((b) => (
                <li key={b.id}>
                  <a href={b.url} target="_blank" rel="noreferrer">
                    {b.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </main>
  );
}
