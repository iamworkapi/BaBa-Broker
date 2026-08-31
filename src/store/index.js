import { configureStore } from '@reduxjs/toolkit';
import { useDispatch, useSelector } from 'react-redux';
import authReducer from './authSlice.js';
import propertiesReducer from './propertiesSlice.js';
import contactsReducer from './contactsSlice.js';
import sharesReducer from './sharesSlice.js';
import investorsReducer from './investorsSlice.js';
import flatListingsReducer from './flatListingsSlice.js';
import uiReducer from './uiSlice.js';

function readPersistedAuth() {
  try {
    const raw = sessionStorage.getItem('staffAuth');
    if (!raw) return null;
    const session = JSON.parse(raw);
    if (session.expiresAt && Date.now() > session.expiresAt) return null;
    return session;
  } catch { return null; }
}

export const store = configureStore({
  preloadedState: (() => {
    const s = readPersistedAuth();
    return s
      ? {
          auth: {
            accessToken: s.access,
            refreshToken: s.refresh,
            user: { id: s.id, name: s.name, email: s.email, phone: s.phone, role: s.role },
            isAuthenticated: true,
          },
        }
      : undefined;
  })(),
  reducer: {
    auth: authReducer,
    properties: propertiesReducer,
    contacts: contactsReducer,
    shares: sharesReducer,
    investors: investorsReducer,
    flatListings: flatListingsReducer,
    ui: uiReducer,
  },
});

store.subscribe(() => {
  const auth = store.getState().auth;
  const session = {
    access: auth.accessToken,
    refresh: auth.refreshToken,
    id: auth.user?.id,
    name: auth.user?.name,
    email: auth.user?.email,
    phone: auth.user?.phone,
    role: auth.user?.role,
    expiresAt: Date.now() + 7 * 24 * 60 * 60 * 1000,
    lastRefresh: Date.now(),
  };
  if (session.access) {
    sessionStorage.setItem('staffAuth', JSON.stringify(session));
  } else {
    sessionStorage.removeItem('staffAuth');
  }
});

export const useAppDispatch = useDispatch;
export const useAppSelector = useSelector;
