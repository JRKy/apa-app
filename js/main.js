// main.js - Application entry point - v2.5.0
import ConfigManager from './modules/core/configManager.js';
import { showNotification } from './modules/core/utils.js';
import { initEventListeners } from './modules/core/events.js';
import { initMap, updateMapAppearance, getMap } from './modules/ui/map.js';
import { initPanels, updatePanelState } from './modules/ui/panels.js';
import { initDrawers } from './modules/ui/drawers.js';
import { initTable, updateTable } from './modules/ui/table.js';
import { initPolarPlot, updatePolarPlot } from './modules/ui/polarPlot.js';
import { initTutorial, showTutorial } from './modules/ui/tutorial.js';
import { initFilters } from './modules/ui/filters.js';
import { initLegend } from './modules/ui/legend.js';
import { initGeocoder, geocodeAddress } from './modules/ui/geocoder.js';
import { loadCustomSatellites } from './modules/data/satellites.js';
import { restoreLastLocation, loadLastLocation } from './modules/data/storage.js';
import { initCommandRegions } from './modules/data/commandRegions.js';
import { initLocationSelector } from './modules/ui/locationSelector.js';
import { initSatelliteCoverage, updateSatelliteCoverage } from './modules/ui/satelliteCoverage.js';
import { VERSION } from './modules/core/version.js';
import { showWhatsNewDialog } from './modules/ui/whatsNew.js';
import { showError } from './modules/core/errorHandler.js';
import { UICache } from './modules/core/cache.js';

let appState = null;
let lastUpdate = null;

export function initApp() {
    try {
        if (appState) return appState;
        
        // Restore app state from cache
        const cachedState = UICache.getAppState();
        if (cachedState) {
            appState = cachedState;
            lastUpdate = cachedState.timestamp;
        }
        
        // Initialize all components
        initMap();
        initGeocoder();
        initTable();
        initPolarPlot();
        initSatelliteCoverage();
        initPanels();
        
        return appState;
    } catch (error) {
        showError(error, 'App');
        return null;
    }
}

export function updateAppState(state) {
    try {
        // Update state
        appState = {
            ...state,
            timestamp: Date.now()
        };
        
        // Cache the state
        UICache.setAppState(appState);
        
        lastUpdate = Date.now();
        
        return appState;
    } catch (error) {
        showError(error, 'App');
        throw error;
    }
}

export function getAppState() {
    return appState;
}

export function getLastUpdate() {
    return lastUpdate;
}

export function clearAppState() {
    try {
        appState = null;
        lastUpdate = null;
        UICache.clearAppCache();
    } catch (error) {
        showError(error, 'App');
    }
}

document.addEventListener("DOMContentLoaded", () => {
  // Initialize configuration manager
  ConfigManager.init();
  
  // Initialize map
  initMap();
  
  // Initialize UI components
  initPanels();
  initDrawers();
  initTable();
  initPolarPlot();
  initLegend();
  initTutorial();
  initGeocoder();
  
  // Initialize new components
  initCommandRegions();
  initLocationSelector();
  initSatelliteCoverage();
  
  // Set up event listeners
  initEventListeners();
  
  // Initialize filters
  initFilters();
  
  // Load saved data
  loadCustomSatellites();
  
  // Check dark mode preference from config
  const theme = ConfigManager.get('theme', 'light');
  if (theme === 'dark') {
    document.body.classList.add("dark-mode");
    updateMapAppearance(true);
    
    // Update dark mode toggle button
    const darkModeToggle = document.getElementById("dark-mode-toggle");
    if (darkModeToggle) {
      darkModeToggle.title = "Switch to Light Mode";
      darkModeToggle.querySelector(".material-icons-round").textContent = "light_mode";
    }
  }
  
  // Check for command regions visibility from config
  const showCommandRegions = ConfigManager.get('ui.showCommandRegions', false);
  if (showCommandRegions) {
    // Import dynamically to avoid circular dependencies
    import('./modules/data/commandRegions.js').then(module => {
      module.toggleCommandRegions();
    });
  }
  
  // Check for polar plot visibility from config
  const showPolarPlot = ConfigManager.get('ui.showPolarPlot', false);
  if (showPolarPlot) {
    // Import dynamically to avoid circular dependencies
    import('./modules/ui/polarPlot.js').then(module => {
      module.togglePolarPlotVisibility(true);
    });
  }
  
  // Restore last location or set a world view
  setTimeout(() => {
    const lastLocation = loadLastLocation();
    
    if (!lastLocation) {
      // Set a world view centered on (0, 0) with a lower zoom level
      const map = getMap();
      if (map) {
        map.setView([20, 0], 2); // Centered view of the world
      }
      
      // Show a notification about global view
      showNotification("Explore global satellite positions", "info");
    } else {
      restoreLastLocation();
    }
    
    // Show tutorial if first time
    const tutorialCompleted = ConfigManager.get('ui.tutorialCompleted', false);
    const showHelp = ConfigManager.get('ui.showHelp', true);
    
    if (!tutorialCompleted && !showHelp) {
      setTimeout(() => showTutorial(), 1000);
    }
    
    // Show What's New dialog if version changed
    setTimeout(() => showWhatsNewDialog(), 1500);
  }, 500);
  
  // Announce app is ready for screen readers
  setTimeout(() => {
    const announcement = document.createElement('div');
    announcement.className = 'sr-only';
    announcement.setAttribute('aria-live', 'assertive');
    announcement.textContent = 'APA App is ready. Use the buttons to select a location and view satellite pointing angles.';
    document.body.appendChild(announcement);
    
    setTimeout(() => {
      document.body.removeChild(announcement);
    }, 1000);
  }, 1000);

  try {
    initApp();
  } catch (error) {
    showError(error, 'App');
  }
});
