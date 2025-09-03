import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import MapView from "./components/MapView";
import Home from "./pages/Home";
import MapPage from "./pages/Map";
import Favorites from "./pages/Favorites";
import { useEffect, useState } from "react";

export default function App() {
  // 백엔드 연결 테스트 (화면 하단에 표기)
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetch("http://localhost:5000/api/hello")
      .then((res) => res.json())
      .then((data) => setMessage(data.message))
      .catch(() => setMessage("(서버 연결 대기 중)"));
  }, []);

  return (
    <div>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/map" element={<MapPage />} />
        <Route path="/favorites" element={<Favorites />} />
      </Routes>
      <div style={{ padding: 20 }}>
        <h1>여행 지도</h1>
        <MapView />
        <p>서버 메시지: {message}</p>
      </div>
    </div>
  );
}
