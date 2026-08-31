const API_BASE = import.meta.env.VITE_API_BASE_URL || "";

function apiUrl(path) {
  return API_BASE ? `${API_BASE}${path}` : path;
}

function readToken() {
  try {
    const raw = sessionStorage.getItem('staffAuth');
    if (!raw) return null;
    return JSON.parse(raw)?.access || JSON.parse(raw)?.token || null;
  } catch { return null; }
}

export async function api(path, options = {}) {
  const isAuthRoute = /\/api\/auth\/(login|register|refresh)/.test(path);
  const token = isAuthRoute ? null : readToken();

  const res = await fetch(apiUrl(path), {
    ...options,
    headers: {
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(typeof options.body === 'string' && !options.headers?.['Content-Type']
        ? { 'Content-Type': 'application/json' }
        : {}),
      ...(options.headers || {}),
    },
  });

  if (!res.ok) {
    const body = await res.text();
    let data = {};
    try { data = body ? JSON.parse(body) : {}; } catch { /* ignore */ }
    const message = data.error || data.message || `HTTP ${res.status}`;
    const err = new Error(message);
    err.status = res.status;
    err.data = data;
    throw err;
  }

  const text = await res.text();
  if (!text.trim()) return null;
  try { return JSON.parse(text); } catch { return null; }
}
