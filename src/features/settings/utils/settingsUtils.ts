import { Settings } from '@/types';

export const defaultSettings: Settings = {
  units: 'metric',
  theme: 'light',
  showAllSatellites: true,
  elevationThreshold: 10,
};

export const saveSettings = (settings: Settings): void => {
  localStorage.setItem('settings', JSON.stringify(settings));
};

export const loadSettings = (): Settings => {
  const savedSettings = localStorage.getItem('settings');
  if (savedSettings) {
    try {
      return JSON.parse(savedSettings);
    } catch (e) {
      console.error('Error loading settings:', e);
    }
  }
  return defaultSettings;
};

export const validateSettings = (settings: Settings): boolean => {
  return (
    typeof settings.units === 'string' &&
    ['metric', 'imperial'].includes(settings.units) &&
    typeof settings.theme === 'string' &&
    ['light', 'dark'].includes(settings.theme) &&
    typeof settings.showAllSatellites === 'boolean' &&
    typeof settings.elevationThreshold === 'number' &&
    settings.elevationThreshold >= 0 &&
    settings.elevationThreshold <= 90
  );
}; 