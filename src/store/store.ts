import { configureStore } from '@reduxjs/toolkit';
import uiReducer from './uiSlice';
import satelliteReducer from '../features/map/store/satelliteSlice';
import locationReducer from '../features/map/store/locationSlice';

export const store = configureStore({
  reducer: {
    ui: uiReducer,
    satellites: satelliteReducer,
    location: locationReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch; 