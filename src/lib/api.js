import { authHeaders, clearAuth, isLoggedIn } from './auth';

export const api = async (path, options = {}) => {
  const response = await fetch(path, {
    ...options,
    headers: { ...authHeaders(), ...(options.headers || {}) },
  });

  if (response.status === 401) {
    clearAuth();
    window.location.href = '/admin/login';
    throw new Error('Session expired. Please log in again.');
  }

  const body = await response.text();
  const data = body ? JSON.parse(body) : {};
  if (!response.ok) throw new Error(data.error || 'Request failed.');
  return data;
};

export { isLoggedIn };
