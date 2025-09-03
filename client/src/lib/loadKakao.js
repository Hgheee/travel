// src/lib/loadKakao.js
let kakaoReady;
export function loadKakao() {
  if (window.kakao && window.kakao.maps) return Promise.resolve(window.kakao);
  if (!kakaoReady) {
    kakaoReady = new Promise((resolve, reject) => {
      const script = document.createElement("script");
      script.src = `https://dapi.kakao.com/v2/maps/sdk.js?appkey=${
        import.meta.env.VITE_KAKAO_MAP_KEY
      }&autoload=false`;
      script.async = true;
      script.onload = () => {
        window.kakao.maps.load(() => resolve(window.kakao));
      };
      script.onerror = reject;
      document.head.appendChild(script);
    });
  }
  return kakaoReady;
}
