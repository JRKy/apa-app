// visibility.js - Satellite visibility calculation and map visualization

import { getMap } from '../ui/map.js';
import { getCoverageStyleClass, LINE_STYLES } from '../core/config.js';
import { calculateElevation, calculateAzimuth, calculateCoverageRadius } from './angles.js';
import { showNotification } from '../core/utils.js';
import { eventBus } from '../core/events.js';

// State tracking
let lineLayers = [];
let satelliteMarkers = [];
let orbitPaths = [];
let coverageCones = [];
let commandLayers = []; // Store displayed command region layers
let commandRegionsVisible = false;

/**
 * Normalize longitude to the range [-180, 180]
 */
function normalizeLon(lon) {
  return ((lon + 180) % 360 + 360) % 360 - 180;
}

/**
 * Clear all satellite visualization elements from the map
 */
export function clearVisualization() {
  const map = getMap();
  if (!map) return;

  lineLayers.forEach(l => map.removeLayer(l.layer));
  lineLayers = [];

  satelliteMarkers.forEach(m => map.removeLayer(m.marker));
  satelliteMarkers = [];

  orbitPaths.forEach(p => map.removeLayer(p));
  orbitPaths = [];

  coverageCones.forEach(c => map.removeLayer(c.circle));
  coverageCones = [];

  clearCommandRegions();
}

/**
 * Draw the equator line on the map
 */
export function drawEquator() {
  const map = getMap();
  if (!map) return;

  const points = [];
  for (let lon = -180; lon <= 180; lon += 5) {
    points.push([0, lon]);
  }

  const equatorLine = L.polyline(points, {
    color: '#888',
    weight: 1,
    opacity: 0.5,
    dashArray: '3,5',
    className: 'satellite-orbit'
  }).addTo(map);

  orbitPaths.push(equatorLine);
}

/**
 * Draw a satellite line and optionally its footprint
 */
export function drawLine(lat, lon, satLon, label, el, id) {
  const map = getMap();
  if (!map) return null;

  const isVisible = el >= 0;
  const style = isVisible ? LINE_STYLES.ABOVE_HORIZON : LINE_STYLES.BELOW_HORIZON;

  // Handle the 180/-180 boundary for the satellite longitude
  let displaySatLon = satLon;
  if (Math.abs(lon - satLon) > 180) {
    if (satLon < 0) {
      displaySatLon += 360;
    } else {
      displaySatLon -= 360;
    }
  }

  const polyline = L.polyline([[lat, lon], [0, displaySatLon]], {
    color: style.color,
    weight: style.weight,
    opacity: style.opacity,
    dashArray: style.dashArray,
    className: style.className
  }).addTo(map);

  polyline.bindTooltip(`${label} (${el.toFixed(1)}°)`, {
    permanent: true,
    direction: "center",
    className: "apa-line-label"
  });

  lineLayers.push({ id, layer: polyline });

  drawCoverageCone(lat, lon, satLon, el, id);

  return polyline;
}

/**
 * Draw a coverage cone
 */
export function drawCoverageCone(lat, lon, satLon, el, id) {
  const map = getMap();
  if (!map) return;

  const coverageRadius = calculateCoverageRadius(el);
  const colorClass = getCoverageStyleClass(el);

  const coverageCircle = L.circle([lat, lon], {
    radius: coverageRadius * 1000,
    className: colorClass,
    interactive: false
  }).addTo(map);

  coverageCones.push({ id, circle: coverageCircle });
}

/**
 * Add satellite marker
 */
export function addSatelliteMarker(satellite, isBelow) {
  const map = getMap();
  if (!map) return null;

  const existingIndex = satelliteMarkers.findIndex(m => m.satellite.name === satellite.name);
  if (existingIndex !== -1) {
    map.removeLayer(satelliteMarkers[existingIndex].marker);
    satelliteMarkers.splice(existingIndex, 1);
  }

  const satIcon = L.divIcon({
    className: isBelow ? 'satellite-marker-below' : 'satellite-marker',
    html: `<div class="satellite-icon"><span class="material-icons-round">${isBelow ? 'satellite_alt' : 'satellite'}</span></div>`,
    iconSize: [24, 24],
    iconAnchor: [12, 12]
  });

  // Get current map center longitude
  const centerLon = map.getCenter().lng;
  let satLon = satellite.longitude;
  if (Math.abs(centerLon - satLon) > 180) {
    if (satLon < 0) {
      satLon += 360;
    } else {
      satLon -= 360;
    }
  }

  const marker = L.marker([0, satLon], {
    icon: satIcon,
    zIndexOffset: isBelow ? 100 : 200
  }).addTo(map);

  satelliteMarkers.push({ satellite, marker, isBelow });

  return marker;
}

/**
 * Update all satellite lines
 */
export function updateSatelliteLines(lat, lon) {
  const map = getMap();
  if (!map) return;

  if (lineLayers.length > 0) {
    clearVisualization();
    drawEquator();

    document.querySelectorAll("input[type=checkbox][data-satlon]:checked").forEach(cb => {
      const satLon = parseFloat(cb.dataset.satlon);
      const name = cb.dataset.name;
      const el = calculateElevation(lat, lon, satLon);
      drawLine(lat, lon, satLon, name, el, cb.id);
    });

    // Add satellite markers
    if (typeof getSatellites === 'function') {
      // Import dynamically to prevent circular dependency
      import('../data/satellites.js').then(module => {
        const satellites = module.getSatellites();
        if (satellites && satellites.length) {
          satellites.forEach((sat) => {
            const el = calculateElevation(lat, lon, sat.longitude);
            addSatelliteMarker(sat, el < 0);
          });
        }
      }).catch(err => {
        console.error('Failed to import satellites module:', err);
      });
    }
    
    // Redraw command regions if they were visible
    if (commandRegionsVisible) {
      drawCommandRegions();
    }
  }
}

/**
 * Remove a satellite line and its footprint
 */
export function removeLine(id) {
  const map = getMap();
  if (!map) return;

  const existing = lineLayers.find(l => l.id === id);
  if (existing) {
    map.removeLayer(existing.layer);
    lineLayers = lineLayers.filter(l => l.id !== id);

    coverageCones
      .filter(c => c.id === id)
      .forEach(c => map.removeLayer(c.circle));
    coverageCones = coverageCones.filter(c => c.id !== id);
  }
}

/**
 * Toggle command region display
 */
export function toggleCommandRegions() {
  const lastLocation = document.getElementById('current-location-indicator');
  if (!lastLocation || lastLocation.classList.contains('hidden')) {
    showNotification("Please select a location first", "error");
    return false;
  }

  // Toggle visibility state
  commandRegionsVisible = !commandRegionsVisible;

  if (commandRegionsVisible) {
    drawCommandRegions();
    showNotification("Command regions displayed", "info");
  } else {
    clearCommandRegions();
    showNotification("Command regions hidden", "info");
  }

  // Publish event
  eventBus.publish('commandRegionsVisibilityChanged', commandRegionsVisible);

  return commandRegionsVisible;
}

/**
 * Draw command regions on the map
 * Note: This function imports the region data dynamically to avoid circular dependencies
 */
export function drawCommandRegions() {
  const map = getMap();
  if (!map) return;
  
  // Clear any existing regions first
  clearCommandRegions();
  
  // Import command regions data dynamically to avoid circular dependencies
  import('../data/commandRegions.js').then(module => {
    const { COMMAND_REGIONS } = module;
    
    if (COMMAND_REGIONS && COMMAND_REGIONS.features) {
      // Draw each command region
      COMMAND_REGIONS.features.forEach((feature) => {
        const { name, color, description } = feature.properties;
        
        const layer = L.geoJSON(feature, {
          style: {
            color: color || "#1a73e8",
            weight: 2,
            opacity: 0.6,
            fillColor: color || "#1a73e8",
            fillOpacity: 0.15,
            className: 'command-region'
          }
        }).addTo(map);
        
        // Add a tooltip
        layer.bindTooltip(`${name}: ${description}`, {
          permanent: false,
          className: "command-region-label"
        });
        
        commandLayers.push({ name, layer });
      });
    }
  }).catch(err => {
    console.error('Failed to import command regions:', err);
    showNotification("Failed to display command regions", "error");
  });
}

/**
 * Clear all command regions from the map
 */
export function clearCommandRegions() {
  const map = getMap();
  if (!map) return;
  
  commandLayers.forEach(c => map.removeLayer(c.layer));
  commandLayers = [];
}

// Export additional functions for completeness
export function isCommandRegionsVisible() {
  return commandRegionsVisible;
}

// Local helper function to get satellites - to be imported dynamically
function getSatellites() {
  // This is just a stub - the actual function is imported dynamically
  return [];
}
