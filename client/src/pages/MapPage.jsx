import { useEffect, useRef, useState } from "react";
import { searchPlaces } from "../api/search";
import { getBookmarks, addBookmark } from "../api/bookmarks";
import { recommendPlaces } from "../api/recommend";
import PlaceList from "../components/PlaceList";
import ItineraryList from "../components/ItineraryList";

// Kakao SDK 로더
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

export default function MapPage() {
  const mapDiv = useRef(null);
  const [map, setMap] = useState(null);
  const [places, setPlaces] = useState([]);
  const [markers, setMarkers] = useState([]);
  const [bookmarks, setBookmarks] = useState([]);
  const [itinerary, setItinerary] = useState([]);
  const [polyline, setPolyline] = useState(null);

  // --- 지도 초기화
  useEffect(() => {
    const key = import.meta.env.VITE_KAKAO_MAP_KEY;
    loadKakaoScript(key).then(() => {
      const kakao = window.kakao;
      const m = new kakao.maps.Map(mapDiv.current, {
        center: new kakao.maps.LatLng(37.5665, 126.978),
        level: 5,
      });
      setMap(m);
    });
  }, []);

  // --- 북마크 초기 로드
  useEffect(() => {
    getBookmarks().then(setBookmarks);
  }, []);

  // --- 지도 위 마커 관리
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

  // --- 검색
  const onSearch = async (q) => {
    clearMarkers();
    const results = await searchPlaces(q);
    setPlaces(results);
    drawMarkers(results);
  };

  // --- 장소 선택 (지도로 이동)
  const onPick = (p) => {
    if (!map) return;
    const kakao = window.kakao;
    const latlng = new kakao.maps.LatLng(p.lat, p.lng);
    map.panTo(latlng);
  };

  // --- 즐겨찾기
  const onBookmark = async (p) => {
    const list = await addBookmark(p);
    setBookmarks(list);
  };

  // --- 일정 관리
  const addToPlan = (p) => {
    setItinerary((prev) =>
      prev.some((x) => x.id === p.id) ? prev : [...prev, p]
    );
  };

  const removeFromPlan = (id) => {
    setItinerary((prev) => prev.filter((p) => p.id !== id));
  };

  const clearPlan = () => setItinerary([]);

  // --- 폴리라인 초기화
  useEffect(() => {
    if (!map || polyline) return;
    const kakao = window.kakao;
    const pl = new kakao.maps.Polyline({
      map,
      path: [],
      strokeWeight: 5,
      strokeColor: "#3b82f6",
      strokeOpacity: 0.85,
      strokeStyle: "solid",
    });
    setPolyline(pl);
    return () => pl.setMap(null);
  }, [map, polyline]);

  // --- 일정 변경 시 폴리라인 갱신
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

  // --- 추천
  const onRecommend = async () => {
    if (!map) return;
    const center = map.getCenter();
    const results = await recommendPlaces(places, {
      lat: center.getLat(),
      lng: center.getLng(),
    });
    setPlaces(results);
    clearMarkers();
    drawMarkers(results);
  };

  return (
    <main style={{ maxWidth: 1080, margin: "24px auto", padding: 16 }}>
      <h1 style={{ marginBottom: 8 }}>여행지 추천 맵</h1>

      {/* 검색 입력 */}
      <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
        <input
          placeholder="예: 카페, 전망대, 한식, 야경..."
          onKeyDown={(e) => e.key === "Enter" && onSearch(e.target.value)}
          style={{
            flex: 1,
            padding: "10px 12px",
            borderRadius: 10,
            border: "1px solid #ddd",
          }}
        />
        <button
          onClick={(e) => onSearch(e.currentTarget.previousSibling.value)}
          style={{
            padding: "10px 16px",
            borderRadius: 10,
            border: "1px solid #ddd",
          }}
        >
          검색
        </button>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1.2fr 0.8fr",
          gap: 16,
        }}
      >
        {/* 지도 */}
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
              href={`${import.meta.env.VITE_API_BASE}/api/health`}
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
