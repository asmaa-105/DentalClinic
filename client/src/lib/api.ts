// client/src/lib/api.ts

const API_BASE_URL = import.meta.env.VITE_API_URL;

export function apiUrl(path: string) {
  // Ensures no double slashes and always prepends the base URL
  if (path.startsWith("http")) return path; // absolute URLs (for external APIs)
  return `${API_BASE_URL}${path.startsWith("/") ? "" : "/"}${path}`;
}

// Optionally, a fetch wrapper:
export async function apiFetch(input: string, init?: RequestInit) {
  return fetch(apiUrl(input), init);
}