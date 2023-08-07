import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { Themes } from '../../types/Themes';
import { LightTheme } from '../../utils/colors';

const initialState = LightTheme;

export const themeSlice = createSlice({
  initialState,
  name: 'theme',
  reducers: {
    setTheme(state, action: PayloadAction<Themes>) {
      state.dark = action.payload.dark;
      state.colors = action.payload.colors;
    },
  },
});

export const { setTheme } = themeSlice.actions;

export default themeSlice.reducer;
