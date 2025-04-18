/**
 * Calculates the azimuth and elevation angles between an observer and a satellite
 * @param observerLat Observer's latitude in degrees
 * @param observerLon Observer's longitude in degrees
 * @param satelliteLat Satellite's latitude in degrees
 * @param satelliteLon Satellite's longitude in degrees
 * @returns Object containing azimuth and elevation angles in degrees
 */
export const calculatePointingAngles = (
  observerLat: number,
  observerLon: number,
  satelliteLat: number,
  satelliteLon: number
): { azimuth: number; elevation: number } => {
  const azimuth = calculateAzimuthAngle(observerLat, observerLon, satelliteLat, satelliteLon);
  const elevation = calculateElevationAngle(observerLat, observerLon, satelliteLat, satelliteLon, 35786);

  return {
    azimuth,
    elevation
  };
};

export const calculateAzimuthAngle = (
  userLat: number,
  userLon: number,
  satLat: number,
  satLon: number
): number => {
  // Convert to radians
  const lat1 = (userLat * Math.PI) / 180;
  const lon1 = (userLon * Math.PI) / 180;
  const lat2 = (satLat * Math.PI) / 180;
  const lon2 = (satLon * Math.PI) / 180;

  // Calculate azimuth
  const y = Math.sin(lon2 - lon1) * Math.cos(lat2);
  const x =
    Math.cos(lat1) * Math.sin(lat2) -
    Math.sin(lat1) * Math.cos(lat2) * Math.cos(lon2 - lon1);
  const azimuth = (Math.atan2(y, x) * 180) / Math.PI;

  return (azimuth + 360) % 360;
};

export const calculateElevationAngle = (
  userLat: number,
  userLon: number,
  satLat: number,
  satLon: number,
  satAlt: number
): number => {
  // Convert to radians
  const lat1 = (userLat * Math.PI) / 180;
  const lon1 = (userLon * Math.PI) / 180;
  const lat2 = (satLat * Math.PI) / 180;
  const lon2 = (satLon * Math.PI) / 180;

  // Earth's radius in km
  const R = 6371;
  // Satellite altitude in km
  const h = satAlt;

  // Calculate the difference in longitude
  const dLon = lon2 - lon1;

  // Calculate the central angle between the two points
  const centralAngle = Math.acos(
    Math.sin(lat1) * Math.sin(lat2) +
    Math.cos(lat1) * Math.cos(lat2) * Math.cos(dLon)
  );

  // Calculate the distance from observer to satellite's sub-point
  const surfaceDistance = R * centralAngle;

  // Calculate the elevation angle using basic trigonometry
  const elevation = Math.atan2(
    Math.cos(centralAngle) * (R + h) - R,
    Math.sin(centralAngle) * (R + h)
  ) * (180 / Math.PI);

  return elevation;
}; 