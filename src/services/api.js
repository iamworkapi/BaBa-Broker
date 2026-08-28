import { authHeaders, clearAuth, getAuth } from '../store/auth';

export const api = async (path, options = {}) => {
  try {
    const response = await fetch(path, {
      ...options,
      headers: { ...authHeaders(), ...(options.headers || {}) },
    });

    if (response.status === 401) {
      const auth = getAuth();
      const redirectPath = auth?.role === 'salesman' ? '/salesman/login' : auth?.role === 'employee' ? '/employee/login' : '/admin/login';
      clearAuth();
      if (!window.location.pathname.includes('/login')) {
        window.location.href = redirectPath;
      }
      throw new Error('Session expired. Please log in again.');
    }

    const body = await response.text();
    let data = {};
    try {
      data = body ? JSON.parse(body) : {};
    } catch {
      data = {};
    }
    if (!response.ok) throw new Error(data.error || 'Request failed.');
    return data;
  } catch (err) {
    throw err;
  }
};
