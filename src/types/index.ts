export interface LatLng {
  lat: number;
  lng: number;
}

export interface Settings {
  units: 'metric' | 'imperial';
  theme: 'light' | 'dark';
  showAllSatellites: boolean;
  elevationThreshold: number;
} 