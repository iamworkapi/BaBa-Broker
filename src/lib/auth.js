const STORAGE_KEY = 'staffAuth';

export const getAuth = () => {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

export const setAuth = ({ token, role, name, email }) => {
  sessionStorage.setItem(STORAGE_KEY, JSON.stringify({ token, role, name, email }));
};

export const clearAuth = () => {
  sessionStorage.removeItem(STORAGE_KEY);
};

export const authHeaders = () => {
  const auth = getAuth();
  return auth?.token ? { Authorization: `Bearer ${auth.token}` } : {};
};
