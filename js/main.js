// main.js - Main application entry point
import { VERSION, updateVersionReferences } from './modules/core/version.js';
import { initDrawers, toggleDrawer, openDrawer, closeDrawer } from './modules/ui/drawers.js';
import { initMap, getMap, updateMapAppearance } from './modules/ui/map.js';
import { initData } from './modules/data/data.js';
import { initEventHandlers } from './modules/core/events.js';
import ConfigManager from './modules/core/configManager.js';
import { showNotification } from './modules/core/utils.js';
import { initPanels } from './modules/ui/panels.js';
import { initTable } from './modules/ui/table.js';
import { initPolarPlot } from './modules/ui/polarPlot.js';
import { initTutorial, showTutorial } from './modules/ui/tutorial.js';
import { initFilters } from './modules/ui/filters.js';
import { initLegend } from './modules/ui/legend.js';
import { initGeocoder } from './modules/ui/geocoder.js';
import { loadCustomSatellites } from './modules/data/satellites.js';
import { restoreLastLocation, loadLastLocation } from './modules/data/storage.js';
import { initCommandRegions } from './modules/data/commandRegions.js';
import { initLocationSelector } from './modules/ui/locationSelector.js';
import { initSatelliteCoverage } from './modules/ui/satelliteCoverage.js';
import { showWhatsNewDialog } from './modules/ui/whatsNew.js';
import { initMobileNav } from './modules/ui/mobileNav.js';
import { initTooltips } from './modules/ui/tooltips.js';

// Initialize version references first
updateVersionReferences();

console.log(`APA App ${VERSION} initializing...`);

// Initialize core functionality
document.addEventListener('DOMContentLoaded', () => {
  initData();
  initMap();
  initDrawers();
  initEventHandlers();
  initMobileNav(); // Initialize mobile navigation
  
  // Initialize configuration manager
  ConfigManager.init();
  
  // Initialize UI components
  initPanels();
  initTable();
  initPolarPlot();
  initLegend();
  initTutorial();
  initGeocoder();
  
  // Initialize new components
  initCommandRegions();
  initLocationSelector();
  initSatelliteCoverage();
  
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
  
  console.log(`APA App ${VERSION} initialized successfully`);
});

// Initialize the application
function initApp() {
    // Initialize UI components
    initDrawers();
    initTooltips();
    
    // Add event listeners for gesture controls
    setupGestureControls();
}

// Setup gesture controls
function setupGestureControls() {
    const appContainer = document.querySelector('.app-container');
    if (!appContainer) return;

    let touchStartX = 0;
    let touchStartY = 0;

    appContainer.addEventListener('touchstart', (e) => {
        touchStartX = e.touches[0].clientX;
        touchStartY = e.touches[0].clientY;
    });

    appContainer.addEventListener('touchend', (e) => {
        const touchEndX = e.changedTouches[0].clientX;
        const touchEndY = e.changedTouches[0].clientY;
        
        const diffX = touchEndX - touchStartX;
        const diffY = touchEndY - touchStartY;
        
        // Horizontal swipe
        if (Math.abs(diffX) > Math.abs(diffY)) {
            if (Math.abs(diffX) > 50) { // Minimum swipe distance
                if (diffX > 0) {
                    // Swipe right - open menu
                    openDrawer('menu-drawer');
                } else {
                    // Swipe left - close menu
                    closeDrawer('menu-drawer');
                }
            }
        }
    });
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', initApp);
