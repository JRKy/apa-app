import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface MapState {
  center: [number, number];
  zoom: number;
  selectedLocation: [number, number] | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: MapState = {
  center: [0, 0],
  zoom: 2,
  selectedLocation: null,
  isLoading: false,
  error: null,
};

const mapSlice = createSlice({
  name: 'map',
  initialState,
  reducers: {
    setCenter: (state, action: PayloadAction<[number, number]>) => {
      state.center = action.payload;
    },
    setZoom: (state, action: PayloadAction<number>) => {
      state.zoom = action.payload;
    },
    setSelectedLocation: (state, action: PayloadAction<[number, number] | null>) => {
      state.selectedLocation = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
  },
});

export const { setCenter, setZoom, setSelectedLocation, setLoading, setError } = mapSlice.actions;
export default mapSlice.reducer; 