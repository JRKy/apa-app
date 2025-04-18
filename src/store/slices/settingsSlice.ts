import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface SettingsState {
  units: 'metric' | 'imperial';
  language: string;
  autoUpdate: boolean;
  notifications: boolean;
}

const initialState: SettingsState = {
  units: 'metric',
  language: 'en',
  autoUpdate: true,
  notifications: true,
};

const settingsSlice = createSlice({
  name: 'settings',
  initialState,
  reducers: {
    setUnits: (state, action: PayloadAction<'metric' | 'imperial'>) => {
      console.log('Setting units to:', action.payload);
      state.units = action.payload;
    },
    setLanguage: (state, action: PayloadAction<string>) => {
      state.language = action.payload;
    },
    setAutoUpdate: (state, action: PayloadAction<boolean>) => {
      state.autoUpdate = action.payload;
    },
    setNotifications: (state, action: PayloadAction<boolean>) => {
      state.notifications = action.payload;
    },
  },
});

export const { setUnits, setLanguage, setAutoUpdate, setNotifications } = settingsSlice.actions;
export default settingsSlice.reducer; 