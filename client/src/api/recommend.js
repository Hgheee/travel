const API_BASE = import.meta.env.VITE_API_BASE;

export async function recommendPlaces(places, center) {
  const res = await fetch(`${API_BASE}/api/recommend`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ places, center }),
  });
  const data = await res.json();
  return data.items || [];
}
