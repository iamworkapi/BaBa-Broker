import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { api } from '../services/api.js';

export const fetchShares = createAsyncThunk('shares/fetch', async (_, { rejectWithValue }) => {
  try {
    const res = await api('/api/shares/list');
    return res;
  } catch (err) {
    return rejectWithValue(err.message || 'Failed to fetch shares');
  }
});

export const createShare = createAsyncThunk('shares/create', async (data, { rejectWithValue }) => {
  try {
    const res = await api('/api/shares', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return res;
  } catch (err) {
    return rejectWithValue(err.message || 'Failed to create share');
  }
});

const sharesSlice = createSlice({
  name: 'shares',
  initialState: { items: [], isLoading: false, error: null },
  extraReducers: (builder) => {
    builder
      .addCase(fetchShares.pending, (s) => { s.isLoading = true; })
      .addCase(fetchShares.fulfilled, (s, a) => { s.isLoading = false; s.items = a.payload || []; })
      .addCase(fetchShares.rejected, (s, a) => { s.isLoading = false; s.error = a.payload; })

      .addCase(createShare.fulfilled, (s) => { /* increment or refetch */ });
  },
});

export const selectShares = (s) => s.shares.items;
export const selectSharesLoading = (s) => s.shares.isLoading;
export default sharesSlice.reducer;
