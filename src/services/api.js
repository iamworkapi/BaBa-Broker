import { authHeaders, clearAuth, getAuth, refreshAccessToken } from '../store/auth';

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

async function requestWithRefresh(path, options = {}, toastFn, depth = 0) {
  const isAuthRoute = path.includes('/api/auth/login') || path.includes('/api/auth/register') || path.includes('/api/auth/refresh');

  const response = await fetch(apiUrl(path), {
    ...options,
    headers: {
      ...(typeof options.body === 'string' && !options.headers?.['Content-Type']
        ? { 'Content-Type': 'application/json' }
        : {}),
      ...authHeaders(),
      ...(options.headers || {}),
    },
  });

  if (response.status === 401 && !isAuthRoute && depth === 0) {
    const refreshed = await refreshAccessToken();
    if (refreshed) {
      return requestWithRefresh(path, options, toastFn, depth + 1);
    }
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
    const body = await response.text();
    let data = {};
    try { data = body ? JSON.parse(body) : {}; } catch { /* ignore */ }
    const errorMsg = data.error || data.message || (response.status === 500 ? TOAST_MESSAGES['500'] : TOAST_MESSAGES.fallback);
    toastFn?.({ type: 'error', message: errorMsg, duration: 5000 });
    throw new Error(errorMsg);
  }

  return response;
}

export async function api(path, options = {}, toastFn) {
  try {
    const response = await requestWithRefresh(path, options, toastFn, 0);
    const body = await response.text();
    let data = {};
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

