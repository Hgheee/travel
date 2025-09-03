const API_BASE = import.meta.env.VITE_API_BASE;

export async function getBookmarks() {
  const res = await fetch(`${API_BASE}/api/bookmarks`);
  const data = await res.json();
  return data.items || [];
}

export async function addBookmark(place) {
  await fetch(`${API_BASE}/api/bookmarks`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(place),
  });
  return getBookmarks(); // 추가 후 최신 목록 반환
}
