export function safeParseLocalStorage(key) {
  const raw = localStorage.getItem(key);

  if (!raw || raw === "undefined" || raw === "null") return null;

  try {
    const parsed = JSON.parse(raw);
    return parsed;
  } catch (e) {
    return raw;
  }
}
