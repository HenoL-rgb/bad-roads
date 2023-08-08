import { PayloadAction, createSlice } from '@reduxjs/toolkit';

import { ThemesType } from '../../types/Themes';
import { LightTheme } from '../../utils/colors';

const initialState = LightTheme;

export const themeSlice = createSlice({
  initialState,
  name: 'theme',
  reducers: {
    setTheme(state, action: PayloadAction<ThemesType>) {
      state.name = action.payload.name;
      state.dark = action.payload.dark;
      state.colors = action.payload.colors;
    },
  },
});

export const { setTheme } = themeSlice.actions;

export default themeSlice.reducer;
