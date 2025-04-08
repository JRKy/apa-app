// geocoder.js - Simple geocoder functionality for location search
import { getMap } from './map.js';
import { goToLocation } from '../data/locations.js';
import { showNotification } from '../core/utils.js';
import { eventBus } from '../core/events.js';
import { showError } from '../core/errorHandler.js';
import { UICache } from '../core/cache.js';

let geocoder = null;
let lastSearch = null;

/**
 * Initialize the geocoder control
 */
export function initGeocoder() {
  try {
    if (geocoder) return geocoder;
    
    geocoder = new google.maps.Geocoder();
    
    // Restore last search from cache
    const cachedSearch = UICache.getLastSearch();
    if (cachedSearch) {
      lastSearch = cachedSearch;
    }
    
    return geocoder;
  } catch (error) {
    showError(error, 'Geocoder');
    return null;
  }
}

export function getGeocoder() {
  if (!geocoder) {
    return initGeocoder();
  }
  return geocoder;
}

export function geocodeAddress(address) {
  try {
    const geocoder = getGeocoder();
    if (!geocoder) {
      throw new Error('Geocoder not initialized');
    }
    
    // Check cache for address
    const cacheKey = `geocode_${address}`;
    let cachedResult = UICache.getGeocodeResult(cacheKey);
    
    if (cachedResult !== null) {
      lastSearch = cachedResult;
      return cachedResult;
    }
    
    return new Promise((resolve, reject) => {
      geocoder.geocode({ address }, (results, status) => {
        if (status === 'OK' && results[0]) {
          const location = {
            lat: results[0].geometry.location.lat(),
            lng: results[0].geometry.location.lng()
          };
          
          // Cache the result
          UICache.setGeocodeResult(cacheKey, location);
          lastSearch = location;
          
          resolve(location);
        } else {
          const error = new Error(`Geocoding failed: ${status}`);
          showError(error, 'Geocoder');
          reject(error);
        }
      });
    });
  } catch (error) {
    showError(error, 'Geocoder');
    throw error;
  }
}

export function getLastSearch() {
  return lastSearch;
}

export function clearGeocoder() {
  try {
    lastSearch = null;
    UICache.clearGeocodeCache();
  } catch (error) {
    showError(error, 'Geocoder');
  }
}

/**
 * Programmatically search for a location by name using Nominatim
 * @param {string} query - Location name or address to search for
 * @returns {Promise} Promise that resolves with geocoding results
 */
export function searchLocation(query) {
  return new Promise((resolve, reject) => {
    if (!query) {
      reject(new Error("Please enter a location to search"));
      return;
    }
    
    // Use OpenStreetMap Nominatim API
    const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=5`;
    
    fetch(url)
      .then(response => {
        if (!response.ok) {
          throw new Error("Failed to search for location");
        }
        return response.json();
      })
      .then(data => {
        if (data.length === 0) {
          reject(new Error("No locations found"));
          return;
        }
        
        // Format results
        const results = data.map(item => ({
          name: item.display_name,
          lat: parseFloat(item.lat),
          lon: parseFloat(item.lon)
        }));
        
        resolve(results);
      })
      .catch(error => {
        showNotification("Failed to search for location", "error");
        reject(error);
      });
  });
}
