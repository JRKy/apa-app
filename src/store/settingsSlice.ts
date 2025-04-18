import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface SettingsState {
  isDarkMode: boolean
  units: 'metric' | 'imperial'
  language: string
  autoUpdate: boolean
  notifications: boolean
}

const initialState: SettingsState = {
  isDarkMode: false,
  units: 'metric',
  language: 'en',
  autoUpdate: true,
  notifications: true,
}

const settingsSlice = createSlice({
  name: 'settings',
  initialState,
  reducers: {
    toggleDarkMode: (state) => {
      state.isDarkMode = !state.isDarkMode
    },
    setUnits: (state, action: PayloadAction<'metric' | 'imperial'>) => {
      state.units = action.payload
    },
    setLanguage: (state, action: PayloadAction<string>) => {
      state.language = action.payload
    },
    toggleAutoUpdate: (state) => {
      state.autoUpdate = !state.autoUpdate
    },
    toggleNotifications: (state) => {
      state.notifications = !state.notifications
    },
  },
})

export const {
  toggleDarkMode,
  setUnits,
  setLanguage,
  toggleAutoUpdate,
  toggleNotifications,
} = settingsSlice.actions

export default settingsSlice.reducer 