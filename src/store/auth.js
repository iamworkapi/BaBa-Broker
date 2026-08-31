const STORAGE_KEY = 'staffAuth';

function readSession() {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const session = JSON.parse(raw);
    if (session.expiresAt && Date.now() > session.expiresAt) {
      sessionStorage.removeItem(STORAGE_KEY);
      return null;
    }
    return session;
  } catch { return null; }
}

export function getAuth() {
  return readSession();
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

export function setAuth(payload) {
  if (!payload) return;
  const token = payload.token || {};
  const user = payload.user || payload;
  const access = typeof token === 'string' ? token : token.access || payload.access || '';
  const session = {
    token: access,
    access,
    refresh: typeof token === 'object' ? token.refresh || payload.refresh || '' : payload.refresh || '',
    name: user?.name || payload.name || '',
    email: user?.email || payload.email || '',
    role: user?.role || payload.role || '',
    id: user?.id || user?._id || payload.id || '',
    phone: user?.phone || payload.phone || '',
    expiresAt: Date.now() + 7 * 24 * 60 * 60 * 1000,
    lastRefresh: Date.now(),
  };
  sessionStorage.setItem(STORAGE_KEY, JSON.stringify(session));
}
