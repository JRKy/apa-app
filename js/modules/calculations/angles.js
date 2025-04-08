// angles.js - Antenna angle calculation functions

import { showError } from '../core/errorHandler.js';
import { SatelliteCache } from '../core/cache.js';
import { memoize } from '../core/memoize.js';

// Memoize expensive calculations
const memoizedCalculateElevation = memoize(calculateElevationRaw);
const memoizedCalculateAzimuth = memoize(calculateAzimuthRaw);

/**
 * Calculate elevation angle to a geostationary satellite using proper spherical geometry
 * @param {number} lat - Observer latitude in degrees
 * @param {number} lon - Observer longitude in degrees
 * @param {number} satLon - Satellite longitude in degrees
 * @returns {number} Elevation angle in degrees
 */
export function calculateElevation(lat, lon, satLon) {
  try {
    // Check cache first
    const cachedElevation = SatelliteCache.getElevation(lat, lon, satLon);
    if (cachedElevation !== null) {
      return cachedElevation;
    }

    // Calculate new elevation
    const elevation = calculateElevationRaw(lat, lon, satLon);

    // Cache the result
    SatelliteCache.setElevation(lat, lon, satLon, elevation);

    return elevation;
  } catch (error) {
    showError(error, 'Angles');
    throw error;
  }
}

/**
 * Calculate azimuth angle to a geostationary satellite using proper spherical geometry
 * @param {number} lat - Observer latitude in degrees
 * @param {number} lon - Observer longitude in degrees
 * @param {number} satLon - Satellite longitude in degrees
 * @returns {number} Azimuth angle in degrees (0-360, where 0 is North)
 */
export function calculateAzimuth(lat, lon, satLon) {
  try {
    // Check cache first
    const cachedAzimuth = SatelliteCache.getAzimuth(lat, lon, satLon);
    if (cachedAzimuth !== null) {
      return cachedAzimuth;
    }

    // Calculate new azimuth
    const azimuth = calculateAzimuthRaw(lat, lon, satLon);

    // Cache the result
    SatelliteCache.setAzimuth(lat, lon, satLon, azimuth);

    return azimuth;
  } catch (error) {
    showError(error, 'Angles');
    throw error;
  }
}

/**
 * Calculate satellite visibility
 * @param {number} elevation - Elevation angle in degrees
 * @returns {boolean} True if satellite is visible
 */
export function isSatelliteVisible(elevation) {
  return elevation >= 0;
}

/**
 * Calculate look angles for polar plot
 * @param {number} lat - Observer latitude in degrees
 * @param {number} lon - Observer longitude in degrees
 * @param {Array} satellites - Array of satellite objects
 * @returns {Array} Array of satellite objects with polar coordinates
 */
export function calculatePolarCoordinates(lat, lon, satellites) {
  try {
    // Check cache first
    const cachedCoordinates = SatelliteCache.getPolarCoordinates(lat, lon);
    if (cachedCoordinates !== null) {
      return cachedCoordinates;
    }

    // Calculate new coordinates
    const coordinates = satellites.map(sat => ({
      name: sat.name,
      longitude: sat.longitude,
      elevation: calculateElevation(lat, lon, sat.longitude),
      azimuth: calculateAzimuth(lat, lon, sat.longitude)
    }));

    // Cache the result
    SatelliteCache.setPolarCoordinates(lat, lon, coordinates);

    return coordinates;
  } catch (error) {
    showError(error, 'Angles');
    throw error;
  }
}

/**
 * Calculate coverage radius based on elevation
 * @param {number} elevation - Elevation angle in degrees
 * @returns {number} Coverage radius in kilometers
 */
export function calculateCoverageRadius(elevation) {
  try {
    // Check cache first
    const cachedRadius = SatelliteCache.getCoverageRadius(elevation);
    if (cachedRadius !== null) {
      return cachedRadius;
    }

    // Calculate new radius
    const radius = calculateCoverageRadiusRaw(elevation);

    // Cache the result
    SatelliteCache.setCoverageRadius(elevation, radius);

    return radius;
  } catch (error) {
    showError(error, 'Angles');
    throw error;
  }
}

// Raw calculation functions (private)
function calculateElevationRaw(lat, lon, satLon) {
  // Convert to radians
  const latRad = lat * Math.PI / 180;
  
  // Handle the 180/-180 boundary
  let lonDiff = satLon - lon;
  if (lonDiff > 180) {
    lonDiff -= 360;
  } else if (lonDiff < -180) {
    lonDiff += 360;
  }
  
  const lonDiffRad = lonDiff * Math.PI / 180;
  
  // Earth radius in km
  const R = 6378.137;
  
  // Geostationary orbit altitude (km)
  const h = 35786;
  
  // Calculate the geocentric angle between observer and satellite nadir point
  const geocentricAngle = Math.acos(
    Math.cos(latRad) * Math.cos(lonDiffRad)
  );
  
  // Calculate the distance from observer to satellite
  const d = Math.sqrt(
    Math.pow(R, 2) + Math.pow(R + h, 2) - 
    2 * R * (R + h) * Math.cos(geocentricAngle)
  );
  
  // Calculate elevation angle
  const elevRad = Math.asin(
    ((R + h) * Math.cos(geocentricAngle) - R) / d
  );
  
  // Convert to degrees
  return elevRad * 180 / Math.PI;
}

function calculateAzimuthRaw(lat, lon, satLon) {
  // Convert to radians
  const latRad = lat * Math.PI / 180;
  
  // Handle the 180/-180 boundary
  let lonDiff = satLon - lon;
  if (lonDiff > 180) {
    lonDiff -= 360;
  } else if (lonDiff < -180) {
    lonDiff += 360;
  }
  
  const lonDiffRad = lonDiff * Math.PI / 180;
  
  // Calculate azimuth angle
  let azRad;
  
  // Special case for observers at poles
  if (Math.abs(lat) > 89.99) {
    // At poles, all directions are either North or South
    azRad = (lat > 0) ? Math.PI : 0; // North pole: South, South pole: North
  } else {
    // Standard case
    azRad = Math.atan2(
      Math.sin(lonDiffRad),
      Math.tan(0) * Math.cos(latRad) - Math.sin(latRad) * Math.cos(lonDiffRad)
    );
  }
  
  // Convert to degrees and normalize to 0-360 range
  let azDeg = azRad * 180 / Math.PI;
  
  // Normalize to 0-360 range (0 = North, 90 = East, 180 = South, 270 = West)
  if (azDeg < 0) {
    azDeg += 360;
  }
  
  return azDeg;
}

function calculateCoverageRadiusRaw(elevation) {
  // Calculate the coverage radius based on elevation angle
  // This is a simplified model that assumes a spherical Earth
  const earthRadius = 6371; // km
  const satelliteAltitude = 35786; // km (GEO)
  
  // Calculate the angle between the satellite and the coverage edge
  const coverageAngle = Math.asin(earthRadius / (earthRadius + satelliteAltitude));
  
  // Calculate the ground distance to the coverage edge
  const groundDistance = earthRadius * coverageAngle;
  
  // Adjust for elevation angle
  const adjustedDistance = groundDistance * Math.cos(elevation * Math.PI / 180);
  
  return adjustedDistance;
}

// Clear all cached calculations
export function clearCalculations() {
  try {
    SatelliteCache.clearSatelliteCache();
    clearMemoCache();
  } catch (error) {
    showError(error, 'Angles');
  }
}
