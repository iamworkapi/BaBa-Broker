import { useState, useCallback } from 'react';
import { createContext, useContext } from 'react';
import { getAuth, setAuth, clearAuth, isLoggedIn, authHeaders } from './auth';
import { useToast } from '../hooks/useToast.jsx';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [session, setSession] = useState(getAuth());
  const toast = useToast();

  const login = useCallback((credentials) => {
    setAuth(credentials);
    setSession(getAuth());
    toast({ type: 'success', message: 'Login successful! Welcome back.', duration: 3000 });
  }, [toast]);

  const logout = useCallback(() => {
    clearAuth();
    setSession(null);
    toast({ type: 'info', message: 'You have been logged out.', duration: 3000 });
  }, [toast]);

  const refresh = useCallback(() => {
    setSession(getAuth());
  }, []);

  return (
    <AuthContext.Provider value={{ session, login, logout, refresh, isLoggedIn: Boolean(session), getAuth, setAuth, clearAuth, authHeaders, toast }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuthStore() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuthStore must be used within <AuthProvider>');
  return ctx;
}
