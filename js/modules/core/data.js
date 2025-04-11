// data.js - Data management module
import { versionData } from './version-data.js';

// Initialize data
export function initData() {
  console.log(`Data module initialized with version ${versionData.version}`);
  loadData();
}

function loadData() {
  // Load satellites and locations
  const satellites = getSatellites();
  const locations = getLocations();
  console.log(`Data Loaded: ${satellites.length} satellites, ${locations.length} locations (v${versionData.version})`);
} 