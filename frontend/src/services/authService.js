const API_BASE = process.env.REACT_APP_API_URL || "http://localhost:8080";
const STORAGE_KEY = "codetrack_user";

export async function loginOrSignup(email) {
  const res = await fetch(`${API_BASE}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email }),
  });

  if (!res.ok) {
    const message = await res.text();
    throw new Error(message || "login failed");
  }

  const data = await res.json();
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  return data;
}

export function getCurrentUser() {
  const raw = localStorage.getItem(STORAGE_KEY);
  return raw ? JSON.parse(raw) : null;
}

export function logout() {
  localStorage.removeItem(STORAGE_KEY);
}

// Convenience helper for other services (progressService, aiService, etc.)
// so every authenticated request can pull the token the same way.
export function getSessionToken() {
  const user = getCurrentUser();
  return user ? user.sessionToken : null;
}