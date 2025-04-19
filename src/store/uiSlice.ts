import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export type Theme = 'light' | 'dark' | 'system';

interface UIState {
  showSatelliteInfo: boolean;
  helpOpen: boolean;
  showSatellitePlotLines: boolean;
  theme: Theme;
  satelliteWindow: {
    position: { x: number; y: number };
    size: { width: number; height: number };
  };
}

const loadInitialTheme = (): Theme => {
  const savedTheme = localStorage.getItem('theme') as Theme | null;
  return savedTheme || 'system';
};

const loadSatelliteWindow = () => {
  const savedWindow = localStorage.getItem('satelliteWindow');
  if (savedWindow) {
    return JSON.parse(savedWindow);
  }
  return {
    position: { x: 20, y: 84 },
    size: { width: 600, height: 400 }
  };
};

const initialState: UIState = {
  showSatelliteInfo: false,
  helpOpen: false,
  showSatellitePlotLines: false,
  theme: loadInitialTheme(),
  satelliteWindow: loadSatelliteWindow(),
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    toggleSatelliteInfo: (state) => {
      state.showSatelliteInfo = !state.showSatelliteInfo;
    },
    setHelpOpen: (state, action: PayloadAction<boolean>) => {
      state.helpOpen = action.payload;
    },
    toggleSatellitePlotLines: (state) => {
      state.showSatellitePlotLines = !state.showSatellitePlotLines;
    },
    setTheme: (state, action: PayloadAction<Theme>) => {
      state.theme = action.payload;
      localStorage.setItem('theme', action.payload);
    },
    setSatelliteWindow: (state, action: PayloadAction<UIState['satelliteWindow']>) => {
      state.satelliteWindow = action.payload;
      localStorage.setItem('satelliteWindow', JSON.stringify(action.payload));
    },
  },
});

export const {
  toggleSatelliteInfo,
  setHelpOpen,
  toggleSatellitePlotLines,
  setTheme,
  setSatelliteWindow,
} = uiSlice.actions;

export default uiSlice.reducer; 