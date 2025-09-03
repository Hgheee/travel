// src/components/MapView.jsx
import { useEffect, useRef } from "react";
import { loadKakao } from "../lib/loadKakao";

export default function MapView({ center = { lat: 37.5665, lng: 126.978 } }) {
  const mapContainer = useRef(null);

  useEffect(() => {
    loadKakao().then((kakao) => {
      const options = {
        center: new kakao.maps.LatLng(center.lat, center.lng),
        level: 5, // 숫자 클수록 축소
      };
      new kakao.maps.Map(mapContainer.current, options);
    });
  }, [center]);

  return (
    <div
      ref={mapContainer}
      style={{
        width: "100%",
        height: "70vh",
        borderRadius: "12px",
        background: "#eee",
      }}
    />
  );
}
