import { authHeaders, clearAuth, getAuth } from '../store/auth';

const TOAST_MESSAGES = {
  network: 'Network error. Please check your connection.',
  '401': 'Session expired. Please log in again.',
  '500': 'Server error. Please try again later.',
  fallback: 'Something went wrong. Please try again.',
};

export const api = async (path, options = {}, toastFn) => {
  try {
    const response = await fetch(path, {
      ...options,
      headers: { ...authHeaders(), ...(options.headers || {}) },
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
      throw new Error(data.error || msg);
    }

    const body = await response.text();
    let data = {};
    try { data = body ? JSON.parse(body) : {}; } catch { /* ignore */ }
    return data;
  } catch (err) {
    if (err.message !== 'Session expired. Please log in again.') {
      toastFn?.({ type: 'error', message: TOAST_MESSAGES.network, duration: 5000 });
    }
    throw err;
  }
};
