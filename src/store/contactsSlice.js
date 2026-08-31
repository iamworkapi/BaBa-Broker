import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { api } from '../services/api.js';

export const fetchContacts = createAsyncThunk('contacts/fetch', async (_, { rejectWithValue }) => {
  try {
    const res = await api('/api/contacts');
    return res;
  } catch (err) {
    return rejectWithValue(err.message || 'Failed to fetch contacts');
  }
});

export const createContact = createAsyncThunk('contacts/create', async (data, { rejectWithValue }) => {
  try {
    const res = await api('/api/contacts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return res;
  } catch (err) {
    return rejectWithValue(err.message || 'Failed to create contact');
  }
});

export const deleteContact = createAsyncThunk('contacts/delete', async (id, { rejectWithValue }) => {
  try {
    await api(`/api/contacts/${id}`, { method: 'DELETE' });
    return id;
  } catch (err) {
    return rejectWithValue(err.message || 'Failed to delete contact');
  }
});

const contactsSlice = createSlice({
  name: 'contacts',
  initialState: { items: [], isLoading: false, error: null },
  extraReducers: (builder) => {
    builder
      .addCase(fetchContacts.pending, (s) => { s.isLoading = true; s.error = null; })
      .addCase(fetchContacts.fulfilled, (s, a) => { s.isLoading = false; s.items = a.payload || []; })
      .addCase(fetchContacts.rejected, (s, a) => { s.isLoading = false; s.error = a.payload; })

      .addCase(createContact.fulfilled, (s, a) => { s.items.push(a.payload); })
      .addCase(deleteContact.fulfilled, (s, a) => { s.items = s.items.filter((c) => c._id !== a.payload); });
  },
});

export const selectContacts = (s) => s.contacts.items;
export const selectContactsLoading = (s) => s.contacts.isLoading;
export default contactsSlice.reducer;
