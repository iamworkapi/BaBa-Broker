import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { api } from '../services/api.js';

export const fetchProperties = createAsyncThunk('properties/fetch', async (_, { rejectWithValue }) => {
  try {
    const res = await api('/api/properties');
    return res;
  } catch (err) {
    return rejectWithValue(err.message || 'Failed to fetch properties');
  }
});

export const fetchFeaturedProperties = createAsyncThunk('properties/fetchFeatured', async (_, { rejectWithValue }) => {
  try {
    const res = await api('/api/properties/featured');
    return res;
  } catch (err) {
    return rejectWithValue(err.message || 'Failed to fetch featured properties');
  }
});

export const fetchPortfolios = createAsyncThunk('properties/fetchPortfolios', async (_, { rejectWithValue }) => {
  try {
    const res = await api('/api/properties/portfolios');
    return res;
  } catch (err) {
    return rejectWithValue(err.message || 'Failed to fetch portfolios');
  }
});

export const createProperty = createAsyncThunk('properties/create', async (formData, { rejectWithValue }) => {
  try {
    const res = await api('/api/properties', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    });
    return res;
  } catch (err) {
    return rejectWithValue(err.message || 'Failed to create property');
  }
});

export const updateProperty = createAsyncThunk('properties/update', async ({ id, data }, { rejectWithValue }) => {
  try {
    const res = await api(`/api/properties/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return { id, ...res };
  } catch (err) {
    return rejectWithValue(err.message || 'Failed to update property');
  }
});

export const deleteProperty = createAsyncThunk('properties/delete', async (id, { rejectWithValue }) => {
  try {
    await api(`/api/properties/${id}`, { method: 'DELETE' });
    return id;
  } catch (err) {
    return rejectWithValue(err.message || 'Failed to delete property');
  }
});

const propertiesSlice = createSlice({
  name: 'properties',
  initialState: {
    items: [],
    featured: [],
    portfolios: [],
    currentItem: null,
    isLoading: false,
    isSaving: false,
    error: null,
  },
  reducers: {
    setCurrentProperty(state, action) {
      state.currentItem = action.payload;
    },
    clearCurrentProperty(state) {
      state.currentItem = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProperties.pending, (s) => { s.isLoading = true; s.error = null; })
      .addCase(fetchProperties.fulfilled, (s, a) => {
        s.isLoading = false;
        s.items = a.payload || [];
      })
      .addCase(fetchProperties.rejected, (s, a) => { s.isLoading = false; s.error = a.payload; })

      .addCase(fetchFeaturedProperties.fulfilled, (s, a) => {
        s.featured = a.payload || [];
      })

      .addCase(fetchPortfolios.fulfilled, (s, a) => {
        s.portfolios = a.payload || [];
      })

      .addCase(createProperty.pending, (s) => { s.isSaving = true; s.error = null; })
      .addCase(createProperty.fulfilled, (s, a) => {
        s.isSaving = false;
        if (a.payload?.property) s.items.unshift(a.payload.property);
      })
      .addCase(createProperty.rejected, (s, a) => { s.isSaving = false; s.error = a.payload; })

      .addCase(updateProperty.fulfilled, (s, a) => {
        const idx = s.items.findIndex((p) => p._id === a.payload.id || p._id === a.payload._id);
        if (idx >= 0) s.items[idx] = a.payload;
      })

      .addCase(deleteProperty.fulfilled, (s, a) => {
        s.items = s.items.filter((p) => p._id !== a.payload);
      });
  },
});

export const { setCurrentProperty, clearCurrentProperty } = propertiesSlice.actions;
export const selectAllProperties = (s) => s.properties.items;
export const selectPropertyById = (id) => (s) => s.properties.items.find((p) => p._id === id);
export const selectFeaturedProperties = (s) => s.properties.featured;
export const selectPropertiesLoading = (s) => s.properties.isLoading;
export default propertiesSlice.reducer;
