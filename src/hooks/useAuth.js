import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/AuthContext';

export function useAuth() {
  const { session, login, logout, refresh, isLoggedIn, getAuth, setAuth, clearAuth, authHeaders } = useAuthStore();
  const navigate = useNavigate();

  const doLogin = useCallback((credentials) => {
    login(credentials);
  }, [login]);

  const doLogout = useCallback((redirectTo = '/admin/login') => {
    logout();
    navigate(redirectTo, { replace: true });
  }, [logout, navigate]);

  return {
    user: session,
    isLoggedIn: isLoggedIn(),
    login: doLogin,
    logout: doLogout,
    refresh,
    getAuth,
    setAuth,
    clearAuth,
    authHeaders,
  };
}
