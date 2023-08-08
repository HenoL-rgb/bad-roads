import { PayloadAction, createSlice } from '@reduxjs/toolkit';

const initialState: LangState = {
  lang: 'en',
};

interface LangState {
  lang: string;
}

export const mapSlice = createSlice({
  initialState,
  name: 'language',
  reducers: {
    setLanguage(state, action: PayloadAction<string>) {
      state.lang = action.payload;
    },
  },
});

export default mapSlice.reducer;

export const { setLanguage } = mapSlice.actions;
