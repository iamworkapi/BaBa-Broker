import { createSlice } from '@reduxjs/toolkit';

const uiSlice = createSlice({
  name: 'ui',
  initialState: { sidebarOpen: false, toasts: [] },
  reducers: {
    toggleSidebar(state) { state.sidebarOpen = !state.sidebarOpen; },
    addToast(state, action) {
      const toast = { id: Date.now() + Math.random(), ...action.payload };
      state.toasts.push(toast);
    },
    removeToast(state, action) {
      state.toasts = state.toasts.filter((t) => t.id !== action.payload);
    },
  },
});

export const { toggleSidebar, addToast, removeToast } = uiSlice.actions;
export const selectToasts = (s) => s.ui.toasts;
export default uiSlice.reducer;
