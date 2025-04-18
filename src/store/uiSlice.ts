import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface UIState {
  showSatelliteInfo: boolean;
  settingsOpen: boolean;
  helpOpen: boolean;
  showSatellitePlotLines: boolean;
}

const initialState: UIState = {
  showSatelliteInfo: false,
  settingsOpen: false,
  helpOpen: false,
  showSatellitePlotLines: false,
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    toggleSatelliteInfo: (state) => {
      state.showSatelliteInfo = !state.showSatelliteInfo;
    },
    setSettingsOpen: (state, action: PayloadAction<boolean>) => {
      state.settingsOpen = action.payload;
    },
    setHelpOpen: (state, action: PayloadAction<boolean>) => {
      state.helpOpen = action.payload;
    },
    toggleSatellitePlotLines: (state) => {
      state.showSatellitePlotLines = !state.showSatellitePlotLines;
    },
  },
});

export const {
  toggleSatelliteInfo,
  setSettingsOpen,
  setHelpOpen,
  toggleSatellitePlotLines,
} = uiSlice.actions;

export default uiSlice.reducer; 