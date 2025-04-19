import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export type Theme = 'light' | 'dark' | 'system';
export type ContrastMode = 'normal' | 'high';

interface UIState {
  showSatelliteInfo: boolean;
  helpOpen: boolean;
  showSatellitePlotLines: boolean;
  theme: Theme;
  contrastMode: ContrastMode;
  satelliteWindow: {
    position: { x: number; y: number };
    size: { width: number; height: number };
  };
}

const loadInitialTheme = (): Theme => {
  const savedTheme = localStorage.getItem('theme') as Theme | null;
  return savedTheme || 'system';
};

const loadInitialContrastMode = (): ContrastMode => {
  const savedContrastMode = localStorage.getItem('contrastMode') as ContrastMode | null;
  return savedContrastMode || 'normal';
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
  contrastMode: loadInitialContrastMode(),
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
    setContrastMode: (state, action: PayloadAction<ContrastMode>) => {
      state.contrastMode = action.payload;
      localStorage.setItem('contrastMode', action.payload);
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
  setContrastMode,
  setSatelliteWindow,
} = uiSlice.actions;

export default uiSlice.reducer; 