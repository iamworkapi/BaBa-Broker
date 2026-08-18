const STORAGE_KEY = 'staffAuth';

const SESSION_DURATION_MS = 4 * 60 * 60 * 1000; // 4 hours

export const getAuth = () => {
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
};

export const setAuth = ({ token, role, name, email }) => {
  const session = {
    token,
    role,
    name,
    email,
    expiresAt: Date.now() + SESSION_DURATION_MS,
  };
  sessionStorage.setItem(STORAGE_KEY, JSON.stringify(session));
};

export const clearAuth = () => {
  sessionStorage.removeItem(STORAGE_KEY);
};

export const isLoggedIn = () => getAuth() !== null;

export const authHeaders = () => {
  const auth = getAuth();
  return auth?.token ? { Authorization: `Bearer ${auth.token}` } : {};
};
