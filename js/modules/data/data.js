// data.js - Data module initialization
import { VERSION } from '../core/version.js';

export function initData() {
  // The actual data is loaded from the root data.js file
  // This module just handles initialization and provides a clean interface
  
  // Verify data is loaded
  if (typeof SATELLITES === 'undefined' || typeof LOCATIONS === 'undefined') {
    console.error('Data not loaded properly');
    return;
  }
  
  console.log(`Data module initialized with version ${VERSION}`);
}

// Export data from global scope
export function getSatellites() {
  return window.SATELLITES || [];
}

export function getLocations() {
  return window.LOCATIONS || [];
} 