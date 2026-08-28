import { useState, useCallback } from 'react';
import { createContext, useContext } from 'react';
import { getAuth, setAuth, clearAuth, isLoggedIn, authHeaders } from './auth';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [session, setSession] = useState(getAuth());

  const login = useCallback((credentials) => {
    setAuth(credentials);
    setSession(credentials);
  }, []);

  const logout = useCallback(() => {
    clearAuth();
    setSession(null);
  }, []);

  const refresh = useCallback(() => {
    setSession(getAuth());
  }, []);

  return (
    <AuthContext.Provider value={{ session, login, logout, refresh, isLoggedIn: isLoggedIn(), getAuth, setAuth, clearAuth, authHeaders }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuthStore() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuthStore must be used within <AuthProvider>');
  return ctx;
}
