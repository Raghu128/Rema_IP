// themeSlice.js
import { createSlice } from '@reduxjs/toolkit';

// Helper function to detect system preference
const getSystemTheme = () => {
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
};

// Check localStorage for saved preference or fall back to system preference
const getInitialTheme = () => {
  const savedTheme = localStorage.getItem('theme');
  return savedTheme || getSystemTheme();
};

const initialState = {
  currentTheme: getInitialTheme(),
  systemTheme: getSystemTheme()
};

const themeSlice = createSlice({
  name: 'theme',
  initialState,
  reducers: {
    toggleTheme(state) {
      const newTheme = state.currentTheme === 'dark' ? 'light' : 'dark';
      state.currentTheme = newTheme;
      localStorage.setItem('theme', newTheme);
    },
    setTheme(state, action) {
      state.currentTheme = action.payload;
      localStorage.setItem('theme', action.payload);
    },
    syncWithSystem(state) {
      state.currentTheme = state.systemTheme;
      localStorage.removeItem('theme'); // Clear saved preference to use system
    },
    updateSystemTheme(state) {
      state.systemTheme = getSystemTheme();
      // If no user preference is set, follow system
      if (!localStorage.getItem('theme')) {
        state.currentTheme = state.systemTheme;
      }
    }
  }
});

export const { toggleTheme, setTheme, syncWithSystem, updateSystemTheme } = themeSlice.actions;

// Selectors
export const selectCurrentTheme = (state) => state.theme.currentTheme;
export const selectSystemTheme = (state) => state.theme.systemTheme;

export default themeSlice.reducer;