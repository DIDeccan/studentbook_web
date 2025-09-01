export function safeParseLocalStorage(key) {
  const raw = localStorage.getItem(key);
  if (!raw || raw === "undefined" || raw === "null") return null;
  try {
    return JSON.parse(raw);
  } catch (e) {
    console.error(`safeParseLocalStorage error for key "${key}":`, e);
    return null;
  }
}
