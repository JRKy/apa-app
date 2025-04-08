// satelliteCoverage.js - Enhanced satellite coverage visualization
import { getMap } from '../ui/map.js';
import { getCoverageStyleClass } from '../core/config.js';
import { calculateElevation, calculateAzimuth, calculateCoverageRadius } from '../calculations/angles.js';
import { showNotification } from '../core/utils.js';
import { eventBus } from '../core/events.js';
import { showError } from '../core/errorHandler.js';
import { UICache } from '../core/cache.js';
import { SatelliteCache } from '../core/cache.js';

// State variables
let coverageElements = [];
let coverageVisible = true;
let coverageData = null;
let lastUpdate = null;

/**
 * Initialize satellite coverage visualization
 */
export function initSatelliteCoverage() {
  try {
    if (coverageData) return coverageData;
    
    // Restore from cache
    const cachedData = UICache.getCoverageData();
    if (cachedData) {
      coverageData = cachedData;
      lastUpdate = cachedData.timestamp;
    }
    
    return coverageData;
  } catch (error) {
    showError(error, 'SatelliteCoverage');
    return null;
  }
}

/**
 * Set up event handlers for satellite coverage
 */
function setupEventHandlers() {
  // Listen for satellite visibility changes
  eventBus.subscribe('satelliteVisibilityChanged', (data) => {
    if (data.visible) {
      // Add coverage for this satellite
      updateCoverageForSatellite(data.id);
    } else {
      // Remove coverage for this satellite
      removeCoverageForSatellite(data.id);
    }
  });
  
  // Listen for location changes
  eventBus.subscribe('locationChanged', () => {
    // Clear all coverage elements
    clearAllCoverage();
  });
}

/**
 * Draw coverage cone for a satellite
 * @param {number} lat - Observer latitude
 * @param {number} lon - Observer longitude
 * @param {number} satLon - Satellite longitude
 * @param {number} el - Elevation angle
 * @param {string} id - Satellite ID
 */
export function drawCoverageCone(lat, lon, satLon, el, id) {
  if (!coverageVisible) return null;
  
  const map = getMap();
  if (!map) return null;
  
  // Calculate coverage radius based on elevation
  const coverageRadius = calculateCoverageRadius(el);
  
  // Get style class based on elevation
  const styleClass = getCoverageStyleClass(el);
  
  // Create a circle for the coverage area
  const coverageCircle = L.circle([lat, lon], {
    radius: coverageRadius * 1000, // Convert to meters
    className: styleClass,
    interactive: false,
    weight: 1,
    fillOpacity: 0.1,
    opacity: 0.3
  }).addTo(map);
  
  // Store the coverage element with its ID
  coverageElements.push({
    id,
    element: coverageCircle,
    type: 'circle'
  });
  
  return coverageCircle;
}

/**
 * Draw enhanced satellite coverage using a more accurate model
 * @param {number} lat - Observer latitude
 * @param {number} lon - Observer longitude
 * @param {number} satLon - Satellite longitude
 * @param {number} el - Elevation angle
 * @param {string} id - Satellite ID
 */
export function drawEnhancedCoverage(lat, lon, satLon, el, id) {
  if (!coverageVisible) return null;
  
  const map = getMap();
  if (!map) return null;
  
  // For satellites below the horizon, don't show coverage
  if (el < 0) return null;
  
  // Earth radius in km
  const earthRadius = 6378.137;
  
  // Geostationary orbit height in km
  const orbitHeight = 35786;
  
  // Calculate the satellite's actual position in 3D space
  // Convert all angles to radians
  const latRad = lat * Math.PI / 180;
  const lonRad = lon * Math.PI / 180;
  const satLonRad = satLon * Math.PI / 180;
  
  // Calculate the Earth-centered coordinates of the location
  const locationX = earthRadius * Math.cos(latRad) * Math.cos(lonRad);
  const locationY = earthRadius * Math.cos(latRad) * Math.sin(lonRad);
  const locationZ = earthRadius * Math.sin(latRad);
  
  // Calculate the Earth-centered coordinates of the satellite
  // For geostationary satellites, they're always above the equator
  const satR = earthRadius + orbitHeight;
  const satX = satR * Math.cos(0) * Math.cos(satLonRad);
  const satY = satR * Math.cos(0) * Math.sin(satLonRad);
  const satZ = satR * Math.sin(0); // 0 for geostationary (on equator)
  
  // Calculate the vector from the location to the satellite
  const vecX = satX - locationX;
  const vecY = satY - locationY;
  const vecZ = satZ - locationZ;
  
  // Calculate the distance to the satellite
  const distance = Math.sqrt(vecX * vecX + vecY * vecY + vecZ * vecZ);
  
  // Get the look angle (elevation angle) in radians
  const elRad = Math.asin((orbitHeight) / distance);
  
  // Calculate the maximum coverage radius based on elevation
  let coverageRadius;
  if (el > 30) {
    // For high elevation, use a more generous coverage
    coverageRadius = 3000; // 3000 km
  } else if (el > 10) {
    // Medium elevation
    coverageRadius = 2000; // 2000 km
  } else if (el > 5) {
    // Low but usable elevation
    coverageRadius = 1000; // 1000 km
  } else {
    // Very low elevation, minimal coverage
    coverageRadius = 500; // 500 km
  }
  
  // Get style class based on elevation
  const styleClass = getCoverageStyleClass(el);
  
  // Create the coverage circle
  const coverageCircle = L.circle([lat, lon], {
    radius: coverageRadius * 1000, // Convert to meters
    className: styleClass,
    interactive: false,
    weight: 1,
    fillOpacity: 0.1,
    opacity: 0.3
  }).addTo(map);
  
  // Store the coverage element with its ID
  coverageElements.push({
    id,
    element: coverageCircle,
    type: 'enhanced'
  });
  
  return coverageCircle;
}

/**
 * Update coverage visualization for a satellite
 * @param {string} id - Satellite ID
 */
function updateCoverageForSatellite(id) {
  // Find the checkbox for this satellite to get its data
  const checkbox = document.getElementById(id);
  if (!checkbox) return;
  
  // Remove any existing coverage for this satellite
  removeCoverageForSatellite(id);
  
  // Get satellite data from the checkbox
  const lat = parseFloat(checkbox.dataset.lat);
  const lon = parseFloat(checkbox.dataset.lon);
  const satLon = parseFloat(checkbox.dataset.satlon);
  const name = checkbox.dataset.name;
  
  // Calculate the elevation angle - using imported function
  const el = calculateElevation(lat, lon, satLon);
  
  // Draw the coverage cone
  drawEnhancedCoverage(lat, lon, satLon, el, id);
}

/**
 * Remove coverage visualization for a satellite
 * @param {string} id - Satellite ID
 */
function removeCoverageForSatellite(id) {
  const map = getMap();
  if (!map) return;
  
  // Find coverage elements for this satellite
  const elements = coverageElements.filter(ce => ce.id === id);
  
  // Remove them from the map
  elements.forEach(ce => {
    map.removeLayer(ce.element);
  });
  
  // Remove from the array
  coverageElements = coverageElements.filter(ce => ce.id !== id);
}

/**
 * Clear all coverage elements from the map
 */
export function clearAllCoverage() {
  const map = getMap();
  if (!map) return;
  
  // Remove all coverage elements from the map
  coverageElements.forEach(ce => {
    map.removeLayer(ce.element);
  });
  
  // Clear the array
  coverageElements = [];
}

/**
 * Toggle visibility of coverage visualization
 * @returns {boolean} New visibility state
 */
export function toggleCoverageVisibility() {
  coverageVisible = !coverageVisible;
  
  const map = getMap();
  if (!map) return coverageVisible;
  
  if (coverageVisible) {
    // Re-add all coverage for checked satellites
    document.querySelectorAll("input[type=checkbox][data-satlon]:checked").forEach(cb => {
      updateCoverageForSatellite(cb.id);
    });
    
    showNotification("Satellite coverage displayed", "info");
  } else {
    // Remove all coverage
    clearAllCoverage();
    
    showNotification("Satellite coverage hidden", "info");
  }
  
  // Publish event
  eventBus.publish('coverageVisibilityChanged', coverageVisible);
  
  return coverageVisible;
}

export function updateSatelliteCoverage(lat, lon) {
  try {
    // Check cache for coverage data
    const cacheKey = `coverage_${lat}_${lon}`;
    let cachedResult = SatelliteCache.getCoverageData(cacheKey);
    
    if (cachedResult !== null) {
      coverageData = cachedResult;
      lastUpdate = Date.now();
      return coverageData;
    }
    
    // Calculate new coverage data
    const satellites = getSatellites();
    const newCoverageData = calculateCoverageData(lat, lon, satellites);
    
    // Cache the result
    SatelliteCache.setCoverageData(cacheKey, newCoverageData);
    UICache.setCoverageData({
      data: newCoverageData,
      timestamp: Date.now()
    });
    
    coverageData = newCoverageData;
    lastUpdate = Date.now();
    
    return coverageData;
  } catch (error) {
    showError(error, 'SatelliteCoverage');
    throw error;
  }
}

export function getCoverageData() {
  return coverageData;
}

export function getLastUpdate() {
  return lastUpdate;
}

export function clearCoverageData() {
  try {
    coverageData = null;
    lastUpdate = null;
    UICache.clearCoverageCache();
  } catch (error) {
    showError(error, 'SatelliteCoverage');
  }
}

// Export for use in main.js
export default {
  init: initSatelliteCoverage,
  drawCoverage: drawEnhancedCoverage,
  clearAll: clearAllCoverage,
  toggle: toggleCoverageVisibility
};
