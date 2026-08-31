import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { api } from '../services/api.js';

export const fetchFlatListings = createAsyncThunk('flatListings/fetch', async (_, { rejectWithValue }) => {
  try {
    const res = await api('/api/flat-listings');
    return res;
  } catch (err) {
    return rejectWithValue(err.message || 'Failed to fetch flat listings');
  }
});

export const createFlatListing = createAsyncThunk('flatListings/create', async (data, { rejectWithValue }) => {
  try {
    const res = await api('/api/flat-listings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return res;
  } catch (err) {
    return rejectWithValue(err.message || 'Failed to create listing');
  }
});

export const updateFlatListing = createAsyncThunk('flatListings/update', async ({ id, data }, { rejectWithValue }) => {
  try {
    const res = await api(`/api/flat-listings/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return { id, ...res };
  } catch (err) {
    return rejectWithValue(err.message || 'Failed to update listing');
  }
});

export const deleteFlatListing = createAsyncThunk('flatListings/delete', async (id, { rejectWithValue }) => {
  try {
    await api(`/api/flat-listings/${id}`, { method: 'DELETE' });
    return id;
  } catch (err) {
    return rejectWithValue(err.message || 'Failed to delete listing');
  }
});

export const updateDealStatus = createAsyncThunk('flatListings/updateDealStatus', async ({ id, dealStatus }, { rejectWithValue }) => {
  try {
    const res = await api(`/api/flat-listings/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ dealStatus }),
    });
    return { id, dealStatus, ...res };
  } catch (err) {
    return rejectWithValue(err.message || 'Failed to update deal status');
  }
});

const flatListingsSlice = createSlice({
  name: 'flatListings',
  initialState: { items: [], isLoading: false, error: null },
  extraReducers: (builder) => {
    builder
      .addCase(fetchFlatListings.pending, (s) => { s.isLoading = true; s.error = null; })
      .addCase(fetchFlatListings.fulfilled, (s, a) => { s.isLoading = false; s.items = a.payload || []; })
      .addCase(fetchFlatListings.rejected, (s, a) => { s.isLoading = false; s.error = a.payload; })
      .addCase(createFlatListing.fulfilled, (s, a) => { if (a.payload?.listing) s.items.unshift(a.payload.listing); })
      .addCase(updateFlatListing.fulfilled, (s, a) => {
        const idx = s.items.findIndex((l) => l._id === a.payload.id || l._id === a.payload._id);
        if (idx >= 0) s.items[idx] = a.payload;
      })
      .addCase(deleteFlatListing.fulfilled, (s, a) => { s.items = s.items.filter((l) => l._id !== a.payload); })
      .addCase(updateDealStatus.fulfilled, (s, a) => {
        const idx = s.items.findIndex((l) => l._id === a.payload.id);
        if (idx >= 0) s.items[idx] = { ...s.items[idx], ...a.payload };
      });
  },
});

export const selectAllFlatListings = (s) => s.flatListings.items;
export const selectFlatListingById = (id) => (s) => s.flatListings.items.find((l) => l._id === id);
export const selectFlatListingsLoading = (s) => s.flatListings.isLoading;
export default flatListingsSlice.reducer;
