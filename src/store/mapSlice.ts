import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface MapState {
  center: [number, number]
  zoom: number
  selectedLocation: [number, number] | null
}

const initialState: MapState = {
  center: [0, 0], // Default center
  zoom: 2,
  selectedLocation: null,
}

const mapSlice = createSlice({
  name: 'map',
  initialState,
  reducers: {
    setCenter: (state, action: PayloadAction<[number, number]>) => {
      state.center = action.payload
    },
    setZoom: (state, action: PayloadAction<number>) => {
      state.zoom = action.payload
    },
    setSelectedLocation: (state, action: PayloadAction<[number, number] | null>) => {
      state.selectedLocation = action.payload
    },
  },
})

export const { setCenter, setZoom, setSelectedLocation } = mapSlice.actions
export default mapSlice.reducer 