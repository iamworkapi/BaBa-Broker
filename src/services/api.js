import { authHeaders, clearAuth, getAuth } from '../store/auth';

const API_BASE = import.meta.env.VITE_API_BASE_URL || "";

function apiUrl(path) {
  return API_BASE ? `${API_BASE}${path}` : path;
}

const TOAST_MESSAGES = {
  network: 'Network error. Please check your connection.',
  '401': 'Session expired. Please log in again.',
  '500': 'Server error. Please try again later.',
  fallback: 'Something went wrong. Please try again.',
};

export async function api(path, options = {}, toastFn) {
  try {
    const response = await fetch(apiUrl(path), {
      ...options,
      headers: {
        ...authHeaders(),
        ...(options.headers || {}),
      },
    });

    if (response.status === 401) {
      const auth = getAuth();
      const redirectPath =
        auth?.role === 'salesman'
          ? '/salesman/login'
          : auth?.role === 'employee'
            ? '/employee/login'
            : '/admin/login';
      clearAuth();
      if (!window.location.pathname.includes('/login')) {
        window.location.href = redirectPath;
      }
      toastFn?.({ type: 'error', message: TOAST_MESSAGES['401'], duration: 5000 });
      throw new Error('Session expired. Please log in again.');
    }

    if (!response.ok) {
      const msg = response.status === 500 ? TOAST_MESSAGES['500'] : TOAST_MESSAGES.fallback;
      toastFn?.({ type: 'error', message: msg, duration: 5000 });
      const body = await response.text();
      let data = {};
      try { data = body ? JSON.parse(body) : {}; } catch { /* ignore */ }
      throw new Error(data.error || data.message || msg);
    }

    const body = await response.text();
    let data = {};
    // Accept empty 200 responses (some endpoints return no body on success)
    if (body && body.trim()) {
      try { data = JSON.parse(body); } catch { /* ignore */ }
    }
    return data;
  } catch (err) {
    if (err.message !== 'Session expired. Please log in again.') {
      toastFn?.({ type: 'error', message: TOAST_MESSAGES.network, duration: 5000 });
    }
    throw err;
  }
}
