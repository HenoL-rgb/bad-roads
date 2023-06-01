import { DefaultTheme } from '@react-navigation/native';
import { createSlice } from '@reduxjs/toolkit';

const initialState = DefaultTheme;

export const themeSlice = createSlice({
  initialState,
  name: 'theme',
  reducers: {
    setTheme(state, action) {
      state.dark = action.payload.dark;
      state.colors = action.payload.colors;
    },
  },
});

export const { setTheme } = themeSlice.actions;

export default themeSlice.reducer;
