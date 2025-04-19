import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Satellite } from '../types/satellite';

interface SatelliteState {
  satellites: Satellite[];
  selectedSatellite: Satellite | null;
}

const initialState: SatelliteState = {
  satellites: [],
  selectedSatellite: null,
};

const satelliteSlice = createSlice({
  name: 'satellites',
  initialState,
  reducers: {
    setSatellites: (state, action: PayloadAction<Satellite[]>) => {
      state.satellites = action.payload;
    },
    setSelectedSatellite: (state, action: PayloadAction<Satellite | null>) => {
      state.selectedSatellite = action.payload;
    },
  },
});

export const { setSatellites, setSelectedSatellite } = satelliteSlice.actions;
export const selectSatellites = (state: { satellites: SatelliteState }) => state.satellites.satellites;
export const selectSelectedSatellite = (state: { satellites: SatelliteState }) => state.satellites.selectedSatellite;

export default satelliteSlice.reducer; 