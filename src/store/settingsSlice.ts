import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface SettingsState {
  isDarkMode: boolean
  units: 'metric' | 'imperial'
}

const initialState: SettingsState = {
  isDarkMode: false,
  units: 'metric',
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
  },
})

export const {
  toggleDarkMode,
  setUnits,
} = settingsSlice.actions

export default settingsSlice.reducer 