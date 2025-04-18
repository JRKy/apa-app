import { RootState } from '../index';

export const selectShowSatelliteInfo = (state: RootState) => state.ui.showSatelliteInfo;
export const selectSettingsOpen = (state: RootState) => state.ui.settingsOpen;
export const selectHelpOpen = (state: RootState) => state.ui.helpOpen;

export const selectAllUIState = (state: RootState) => state.ui; 