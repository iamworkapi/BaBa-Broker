import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { api } from '../services/api.js';

export const fetchInvestors = createAsyncThunk('investors/fetch', async (_, { rejectWithValue }) => {
  try {
    const res = await api('/api/investors');
    return res;
  } catch (err) {
    return rejectWithValue(err.message || 'Failed to fetch investors');
  }
});

export const createInvestor = createAsyncThunk('investors/create', async (data, { rejectWithValue }) => {
  try {
    const res = await api('/api/investors', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return res;
  } catch (err) {
    return rejectWithValue(err.message || 'Failed to create investor');
  }
});

export const deleteInvestor = createAsyncThunk('investors/delete', async (id, { rejectWithValue }) => {
  try {
    await api(`/api/investors/${id}`, { method: 'DELETE' });
    return id;
  } catch (err) {
    return rejectWithValue(err.message || 'Failed to delete investor');
  }
});

const investorsSlice = createSlice({
  name: 'investors',
  initialState: { items: [], isLoading: false, error: null },
  extraReducers: (builder) => {
    builder
      .addCase(fetchInvestors.pending, (s) => { s.isLoading = true; s.error = null; })
      .addCase(fetchInvestors.fulfilled, (s, a) => { s.isLoading = false; s.items = a.payload || []; })
      .addCase(fetchInvestors.rejected, (s, a) => { s.isLoading = false; s.error = a.payload; })
      .addCase(createInvestor.fulfilled, (s, a) => { if (a.payload) s.items.push(a.payload); })
      .addCase(deleteInvestor.fulfilled, (s, a) => { s.items = s.items.filter((i) => i._id !== a.payload); });
  },
});

export const selectAllInvestors = (s) => s.investors.items;
export const selectInvestorsLoading = (s) => s.investors.isLoading;
export default investorsSlice.reducer;
