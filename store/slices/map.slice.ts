import { PayloadAction, createSlice } from '@reduxjs/toolkit';

const initialState: MapState = {
  mapType: 'vector',
  nightMode: true,
};

interface MapState {
  mapType: MapType;
  nightMode: boolean;
}

type MapType = 'vector' | 'raster';

export const mapSlice = createSlice({
  initialState,
  name: 'map',
  reducers: {
    setNightMode(state, action: PayloadAction<boolean>) {
      state.nightMode = action.payload;
    },
    setMapType(state, action: PayloadAction<MapType>) {
      state.mapType = action.payload;
    },
  },
});

export default mapSlice.reducer;

export const { setNightMode, setMapType } = mapSlice.actions;
