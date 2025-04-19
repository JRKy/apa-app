import { Satellite } from '../types/satellite';

export const calculateSatellitePosition = (
  observerLat: number,
  observerLon: number,
  satellite: Satellite
): { elevation: number; azimuth: number } => {
  // Convert degrees to radians
  const toRad = (deg: number) => (deg * Math.PI) / 180;
  const toDeg = (rad: number) => (rad * 180) / Math.PI;

  const lat1 = toRad(observerLat);
  const lon1 = toRad(observerLon);
  const lat2 = toRad(satellite.latitude);
  const lon2 = toRad(satellite.longitude);

  // Calculate the distance between the observer and the satellite
  const d = Math.acos(
    Math.sin(lat1) * Math.sin(lat2) +
    Math.cos(lat1) * Math.cos(lat2) * Math.cos(lon2 - lon1)
  );

  // Calculate the elevation angle
  const elevation = toDeg(
    Math.atan2(
      Math.cos(d) - 0.1512,
      Math.sin(d)
    )
  );

  // Calculate the azimuth angle
  const y = Math.sin(lon2 - lon1) * Math.cos(lat2);
  const x = Math.cos(lat1) * Math.sin(lat2) -
    Math.sin(lat1) * Math.cos(lat2) * Math.cos(lon2 - lon1);
  const azimuth = toDeg(Math.atan2(y, x));

  return {
    elevation: elevation < 0 ? 0 : elevation,
    azimuth: azimuth < 0 ? azimuth + 360 : azimuth,
  };
}; 