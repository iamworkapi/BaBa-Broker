import { createSlice, createAsyncThunk, createAction } from '@reduxjs/toolkit';
import { api } from '../services/api.js';

export const login = createAsyncThunk('auth/login', async (credentials, { rejectWithValue }) => {
  try {
    const res = await api('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: credentials.identifier, identifier: credentials.identifier, password: credentials.password, role: credentials.role }),
    });
    return res;
  } catch (err) {
    return rejectWithValue(err.message || 'Login failed');
  }
});

export const register = createAsyncThunk('auth/register', async (data, { rejectWithValue }) => {
  try {
    const res = await api('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return res;
  } catch (err) {
    return rejectWithValue(err.message || 'Registration failed');
  }
});

export const refreshToken = createAsyncThunk('auth/refresh', async (_, { getState, rejectWithValue }) => {
  try {
    const { refreshToken: rt } = getState().auth;
    if (!rt) return rejectWithValue('No refresh token');
    const res = await api('/api/auth/refresh', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refresh: rt }),
    });
    return res;
  } catch (err) {
    return rejectWithValue(err.message || 'Refresh failed');
  }
});

export const logoutAction = createAsyncThunk('auth/logout', async (_, { getState }) => {
  try {
    const { accessToken } = getState().auth;
    await api('/api/auth/logout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token: accessToken }),
    });
  } catch { /* best-effort */ }
  return null;
});

export const fetchMe = createAsyncThunk('auth/fetchMe', async (_, { rejectWithValue }) => {
  try {
    const res = await api('/api/auth/me');
    return res;
  } catch (err) {
    return rejectWithValue(err.message || 'Failed to fetch user');
  }
});

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: null,
    accessToken: null,
    refreshToken: null,
    isAuthenticated: false,
    isLoading: false,
    error: null,
  },
  reducers: {
    clearError(state) { state.error = null; },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (s) => { s.isLoading = true; s.error = null; })
      .addCase(login.fulfilled, (s, a) => {
        s.isLoading = false;
        s.accessToken = a.payload.token.access;
        s.refreshToken = a.payload.token.refresh;
        s.user = a.payload.user;
        s.isAuthenticated = true;
        s.error = null;
      })
      .addCase(login.rejected, (s, a) => {
        s.isLoading = false;
        s.error = a.payload || a.error.message;
      })
      .addCase(register.fulfilled, (s, a) => {
        s.accessToken = a.payload.token.access;
        s.refreshToken = a.payload.token.refresh;
        s.user = a.payload.user;
        s.isAuthenticated = true;
      })
      .addCase(refreshToken.fulfilled, (s, a) => {
        s.accessToken = a.payload.token.access;
        if (a.payload.token.refresh) s.refreshToken = a.payload.token.refresh;
      })
      .addCase(refreshToken.rejected, (s) => {
        s.accessToken = null;
        s.refreshToken = null;
        s.user = null;
        s.isAuthenticated = false;
      })
      .addCase(logoutAction.fulfilled, (s) => {
        s.user = null;
        s.accessToken = null;
        s.refreshToken = null;
        s.isAuthenticated = false;
      })
      .addCase(fetchMe.fulfilled, (s, a) => {
        s.user = a.payload.user || a.payload;
        s.isAuthenticated = true;
      })
      .addCase(fetchMe.rejected, (s) => {
        s.user = null;
        s.accessToken = null;
        s.refreshToken = null;
        s.isAuthenticated = false;
      });
  },
});

export const { clearError } = authSlice.actions;
export const selectUser = (s) => s.auth.user;
export const selectAccessToken = (s) => s.auth.accessToken;
export const selectIsAuthenticated = (s) => s.auth.isAuthenticated;
export const selectAuthLoading = (s) => s.auth.isLoading;
export const selectAuthError = (s) => s.auth.error;
export default authSlice.reducer;
