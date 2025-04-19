import { Satellite } from '@/constants/satellites';

export const formatAngle = (angle: number, precision: number = 1): string => {
  const formattedValue = angle.toFixed(precision);
  // Add a leading space for positive numbers to align with negative signs
  return angle >= 0 ? ` ${formattedValue}°` : `${formattedValue}°`;
};

export const formatDistance = (distance: number, units: 'metric' | 'imperial', precision: number = 0): string => {
  const unit = units === 'metric' ? 'km' : 'mi';
  return `${distance.toFixed(precision)} ${unit}`;
};

export const isGoodElevation = (elevation: number | null, threshold: number = 10): boolean => {
  return elevation !== null && elevation >= threshold;
};

export const getSatelliteStatus = (_satellite: Satellite, elevation: number | null): 'good' | 'poor' | 'below' => {
  if (elevation === null) return 'below';
  if (elevation >= 10) return 'good';
  if (elevation >= 0) return 'poor';
  return 'below';
};

// Calculate elevation angle between observer and satellite
export const calculateElevationAngle = (
  observerLat: number,
  observerLon: number,
  satLat: number,
  satLon: number,
  satAlt: number
): number => {
  // Convert to radians
  const lat1 = (observerLat * Math.PI) / 180;
  const lon1 = (observerLon * Math.PI) / 180;
  const lat2 = (satLat * Math.PI) / 180;
  const lon2 = (satLon * Math.PI) / 180;

  // Calculate great circle distance
  const dLon = lon2 - lon1;
  const dLat = lat2 - lat1;

  const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
           Math.cos(lat1) * Math.cos(lat2) * 
           Math.sin(dLon/2) * Math.sin(dLon/2);
  
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  const R = 6371; // Earth's radius in km

  // Calculate elevation angle using more accurate spherical geometry
  const h = satAlt; // Satellite altitude in km
  const elevation = Math.atan2(
    Math.cos(c) * (R + h) - R,
    Math.sin(c) * (R + h)
  );

  return (elevation * 180) / Math.PI; // Convert to degrees
};

export const formatSatelliteAngles = (name: string, elevation: number, azimuth: number): string => {
  return `${name} ${formatAngle(elevation)} ${formatAngle(azimuth)}`;
}; 