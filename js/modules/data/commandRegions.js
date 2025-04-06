// commandRegions.js - Command regions visualization functionality
import { getMap } from '../ui/map.js';
import { showNotification } from '../core/utils.js';
import { eventBus } from '../core/events.js';

// State variables
let commandLayers = [];
let commandRegionsVisible = false;

// Command regions data structure
export const COMMAND_REGIONS = {
  "type": "FeatureCollection",
  "features": [
    {
      "type": "Feature",
      "properties": {
        "name": "NORTHCOM",
        "description": "United States Northern Command",
        "color": "#9c27b0"
      },
      "geometry": {
        "type": "Polygon",
        "coordinates": [[
          [-169, 73], [-50, 73], [-50, 15], [-169, 15], [-169, 73]
        ]]
      }
    },
    {
      "type": "Feature",
      "properties": {
        "name": "SOUTHCOM",
        "description": "United States Southern Command",
        "color": "#ffeb3b"
      },
      "geometry": {
        "type": "Polygon",
        "coordinates": [[
          [-120, 15], [-30, 15], [-30, -60], [-120, -60], [-120, 15]
        ]]
      }
    },
    {
      "type": "Feature",
      "properties": {
        "name": "EUCOM",
        "description": "United States European Command",
        "color": "#2196f3"
      },
      "geometry": {
        "type": "Polygon",
        "coordinates": [[
          [-30, 75], [40, 75], [40, 30], [-30, 30], [-30, 75]
        ]]
      }
    },
    {
      "type": "Feature",
      "properties": {
        "name": "AFRICOM",
        "description": "United States Africa Command",
        "color": "#ff9800"
      },
      "geometry": {
        "type": "Polygon",
        "coordinates": [[
          [-30, 30], [55, 30], [55, -40], [-30, -40], [-30, 30]
        ]]
      }
    },
    {
      "type": "Feature",
      "properties": {
        "name": "CENTCOM",
        "description": "United States Central Command",
        "color": "#ff5722"
      },
      "geometry": {
        "type": "Polygon",
        "coordinates": [[
          [40, 50], [90, 50], [90, 15], [40, 15], [40, 50]
        ]]
      }
    },
    {
      "type": "Feature",
      "properties": {
        "name": "INDOPACOM",
        "description": "United States Indo-Pacific Command",
        "color": "#4caf50"
      },
      "geometry": {
        "type": "Polygon",
        "coordinates": [[
          [90, 50], [180, 50], [180, -60], [90, -60], [90, 50]
        ]]
      }
    },
    {
      "type": "Feature",
      "properties": {
        "name": "INDOPACOM",
        "description": "United States Indo-Pacific Command (West)",
        "color": "#4caf50"
      },
      "geometry": {
        "type": "Polygon",
        "coordinates": [[
          [-180, 50], [-169, 50], [-169, -60], [-180, -60], [-180, 50]
        ]]
      }
    }
  ]
};

/**
 * Initialize command regions functionality
 */
export function initCommandRegions() {
  // Set up event handlers
  const commandRegionsBtn = document.getElementById('toggle-polar-plot');
  
  if (commandRegionsBtn) {
    // Update tooltip and icon
    commandRegionsBtn.title = "Toggle Command Regions";
    commandRegionsBtn.setAttribute("aria-label", "Toggle combatant command regions");
    commandRegionsBtn.querySelector(".material-icons-round").textContent = "map";
    
    // Update event listener
    commandRegionsBtn.addEventListener("click", toggleCommandRegions);
  }
  
  // Subscribe to events
  eventBus.subscribe('mapReady', () => {
    // Initialize command regions if they should be visible by default
    if (commandRegionsVisible) {
      drawCommandRegions();
    }
  });
}

/**
 * Toggle command region display
 * @returns {boolean} Whether command regions are now visible
 */
export function toggleCommandRegions() {
  const lastLocation = document.getElementById('current-location-indicator');
  
  // If no location is selected, still allow toggling the regions
  // This is different from the old behavior which required a location
  
  // Toggle state
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
 * Draw all combatant command regions on the map
 */
export function drawCommandRegions() {
  const map = getMap();
  if (!map) return;
  
  // Clear any existing regions first
  clearCommandRegions();
  
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

/**
 * Clear all command regions from the map
 */
export function clearCommandRegions() {
  const map = getMap();
  if (!map) return;
  
  commandLayers.forEach(c => map.removeLayer(c.layer));
  commandLayers = [];
}

/**
 * Check if command regions are currently visible
 * @returns {boolean} Whether command regions are visible
 */
export function areCommandRegionsVisible() {
  return commandRegionsVisible;
}

// Export for use in main.js
export default {
  init: initCommandRegions,
  toggle: toggleCommandRegions,
  draw: drawCommandRegions,
  clear: clearCommandRegions,
  isVisible: areCommandRegionsVisible
};
