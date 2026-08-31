const STORAGE_KEY = 'staffAuth';

const ACCESS_TTL_MS = 15 * 60 * 1000;
const SESSION_DURATION_MS = 7 * 24 * 60 * 60 * 1000; // 7 days

export function getAuth() {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const session = JSON.parse(raw);
    if (session.expiresAt && Date.now() > session.expiresAt) {
      clearAuth();
      return null;
    }
    return session;
  } catch {
    return null;
  }
}

export function setAuth(payload) {
  if (!payload) return;
  const token = payload.token || {};
  const user = payload.user || payload;

  const access = typeof token === 'string' ? token : token.access || payload.access || '';
  const refresh = typeof token === 'object' ? token.refresh : payload.refresh || '';

  const session = {
    token: access,
    access,
    refresh,
    name: user?.name || payload.name || '',
    email: user?.email || payload.email || '',
    role: user?.role || payload.role || '',
    id: user?.id || user?._id || payload.id || '',
    phone: user?.phone || payload.phone || '',
    expiresAt: Date.now() + SESSION_DURATION_MS,
    lastRefresh: Date.now(),
  };
  sessionStorage.setItem(STORAGE_KEY, JSON.stringify(session));
}

export function updateAccessToken(access) {
  const session = getAuth();
  if (session) {
    session.token = access;
    session.access = access;
    session.lastRefresh = Date.now();
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(session));
  }
}

export function clearAuth() {
  sessionStorage.removeItem(STORAGE_KEY);
}

export function isLoggedIn() {
  const auth = getAuth();
  return Boolean(auth && (auth.token || auth.access));
}

export function authHeaders() {
  const auth = getAuth();
  const token = auth?.access || auth?.token;
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export async function refreshAccessToken() {
  const auth = getAuth();
  if (!auth?.refresh) return false;

  try {
    const res = await fetch(`/api/auth/refresh`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refresh: auth.refresh }),
    });

    if (!res.ok) {
      clearAuth();
      return false;
    }

    const data = await res.json();
    if (data.token?.access) {
      updateAccessToken(data.token.access);
      if (data.token?.refresh) {
        const session = getAuth();
        if (session) {
          session.refresh = data.token.refresh;
          sessionStorage.setItem(STORAGE_KEY, JSON.stringify(session));
        }
      }
      return true;
    }
  } catch {
    clearAuth();
  }
  return false;
}

export async function logout() {
  const auth = getAuth();
  try {
    await fetch('/api/auth/logout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token: auth?.access }),
    });
  } catch {
    // best-effort; still clear local session
  }
  clearAuth();
}

export { api } from '../services/api';
