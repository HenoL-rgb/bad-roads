import { DefaultTheme, Theme } from '@react-navigation/native';
import { PayloadAction, createSlice } from '@reduxjs/toolkit';

const initialState = DefaultTheme;

export const themeSlice = createSlice({
  initialState,
  name: 'theme',
  reducers: {
    setTheme(state, action: PayloadAction<Theme>) {
      state.dark = action.payload.dark;
      state.colors = action.payload.colors;
    },
  },
});

export const { setTheme } = themeSlice.actions;

export default themeSlice.reducer;
