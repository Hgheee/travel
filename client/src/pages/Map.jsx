import { useEffect } from "react";

export default function MapPage() {
  useEffect(() => {
    const script = document.createElement("script");
    script.src =
      "https://dapi.kakao.com/v2/maps/sdk.js?appkey=23d1c2e1e97864099c56b9475db784ae&autoload=false";
    script.async = true;

    script.onload = () => {
      if (window.kakao) {
        window.kakao.maps.load(() => {
          const container = document.getElementById("map");
          const options = {
            center: new window.kakao.maps.LatLng(37.5665, 126.978),
            level: 3,
          };
          new window.kakao.maps.Map(container, options);
        });
      }
    };

    script.onerror = () => {};

    document.head.appendChild(script);

    return () => {
      document.head.removeChild(script);
    };
  }, []);

  return (
    <div style={{ width: "100%", height: "600px" }}>
      <div id="map" style={{ width: "100%", height: "100%" }} />
    </div>
  );
}
