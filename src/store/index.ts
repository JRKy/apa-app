import { configureStore } from '@reduxjs/toolkit';
import settingsReducer from './settingsSlice';
import mapReducer from './mapSlice';
import uiReducer from './uiSlice';

export const store = configureStore({
  reducer: {
    settings: settingsReducer,
    map: mapReducer,
    ui: uiReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch; 