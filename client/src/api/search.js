const API_BASE = import.meta.env.VITE_API_BASE;

export async function searchPlaces(q) {
  if (!q) return [];
  const res = await fetch(`${API_BASE}/api/search?q=${encodeURIComponent(q)}`);
  const data = await res.json();
  return data.places || [];
}
