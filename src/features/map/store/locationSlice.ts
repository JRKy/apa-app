import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Location } from '../types/location';

interface LocationState {
  currentLocation: Location | null;
  searchResults: Location[];
}

const initialState: LocationState = {
  currentLocation: null,
  searchResults: [],
};

const locationSlice = createSlice({
  name: 'location',
  initialState,
  reducers: {
    setCurrentLocation: (state, action: PayloadAction<Location | null>) => {
      state.currentLocation = action.payload;
    },
    setSearchResults: (state, action: PayloadAction<Location[]>) => {
      state.searchResults = action.payload;
    },
  },
});

export const { setCurrentLocation, setSearchResults } = locationSlice.actions;
export const selectLocation = (state: { location: LocationState }) => state.location.currentLocation;
export const selectSearchResults = (state: { location: LocationState }) => state.location.searchResults;

export default locationSlice.reducer; 