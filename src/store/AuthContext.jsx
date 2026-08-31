import React, { createContext, useContext, useState } from 'react';
import { getAuth, clearAuth, isLoggedIn, authHeaders, setAuth } from './auth';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [session, setSession] = React.useState(getAuth());

  const login = (credentials) => {
    setAuth(credentials);
    setSession(getAuth());
  };

  const logout = () => {
    clearAuth();
    setSession(null);
  };

  const refresh = () => {
    setSession(getAuth());
  };

  return (
    <AuthContext.Provider value={{ session, login, logout, refresh, isLoggedIn: Boolean(session), getAuth, setAuth, clearAuth, authHeaders }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuthStore() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuthStore must be used within <AuthProvider>');
  return ctx;
}
