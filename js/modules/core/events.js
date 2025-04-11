// events.js - Custom event system and app-wide event handlers
import { updateMapAppearance } from '../ui/map.js';
import { toggleDrawer, closeAllDrawers } from '../ui/drawers.js';
import { togglePolarPlotVisibility } from '../ui/polarPlot.js';
import { showTutorial } from '../ui/tutorial.js';
import { toggleLegend } from '../ui/legend.js';
import { useMyLocation } from '../data/locations.js';

/**
 * App-wide event bus for communication between modules
 */
export const eventBus = {
  _events: {},
  
  /**
   * Subscribe to an event
   * @param {string} event - Event name to subscribe to
   * @param {Function} callback - Function to call when event occurs
   */
  subscribe(event, callback) {
    if (!this._events[event]) {
      this._events[event] = [];
    }
    this._events[event].push(callback);
  },
  
  /**
   * Unsubscribe from an event
   * @param {string} event - Event name to unsubscribe from
   * @param {Function} callback - Function to remove
   */
  unsubscribe(event, callback) {
    if (this._events[event]) {
      this._events[event] = this._events[event].filter(cb => cb !== callback);
    }
  },
  
  /**
   * Publish an event with data
   * @param {string} event - Event name to publish
   * @param {*} data - Data to pass to subscribers
   */
  publish(event, data) {
    if (this._events[event]) {
      this._events[event].forEach(callback => callback(data));
    }
  }
};

/**
 * Initialize global event handlers
 */
export function initEventHandlers() {
  // Dark mode toggle
  const darkModeToggle = document.getElementById("dark-mode-toggle");
  if (darkModeToggle) {
    darkModeToggle.addEventListener("click", handleDarkModeToggle);
  }
  
  // Toggle drawers
  document.getElementById("toggle-location-drawer")?.addEventListener("click", () => {
    toggleDrawer("location-drawer", ["satellite-drawer", "filter-drawer"]);
  });

  document.getElementById("toggle-satellite-drawer")?.addEventListener("click", () => {
    toggleDrawer("satellite-drawer", ["location-drawer", "filter-drawer"]);
  });

  document.getElementById("toggle-filter-drawer")?.addEventListener("click", () => {
    toggleDrawer("filter-drawer", ["location-drawer", "satellite-drawer"]);
  });
  
  // My location button
  const myLocationBtn = document.getElementById("btn-my-location");
  if (myLocationBtn) {
    myLocationBtn.addEventListener("click", useMyLocation);
  }
  
  // Drawer overlay
  const drawerOverlay = document.getElementById("drawer-overlay");
  if (drawerOverlay) {
    drawerOverlay.addEventListener("click", closeAllDrawers);
  }
  
  // Global keyboard shortcuts
  document.addEventListener('keydown', handleKeyDown);
  
  // Polar plot toggle
  document.getElementById("toggle-polar-plot")?.addEventListener("click", () => {
    togglePolarPlotVisibility();
  });
  
  // Legend toggle
  document.getElementById("legend-toggle")?.addEventListener("click", toggleLegend);
  
  // Help tooltip
  const hideHelpBtn = document.getElementById("hide-help-tooltip");
  if (hideHelpBtn) {
    hideHelpBtn.addEventListener("click", hideHelpTooltip);
  }
  
  // Tutorial controls
  const showTutorialBtn = document.getElementById("show-tutorial");
  if (showTutorialBtn) {
    showTutorialBtn.addEventListener("click", handleShowTutorial);
  }
}

/**
 * Handle dark mode toggle
 */
function handleDarkModeToggle() {
  document.body.classList.toggle("dark-mode");
  const isDarkMode = document.body.classList.contains("dark-mode");
  
  // Update button appearance
  const darkModeToggle = document.getElementById("dark-mode-toggle");
  darkModeToggle.title = isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode";
  darkModeToggle.querySelector(".material-icons-round").textContent = isDarkMode ? "light_mode" : "dark_mode";
  
  // Save preference and update map
  localStorage.setItem("darkMode", isDarkMode);
  updateMapAppearance(isDarkMode);
  
  // Notify other components via event bus
  eventBus.publish('darkModeChanged', isDarkMode);
}

/**
 * Handle global keydown events
 * @param {KeyboardEvent} e - The keydown event
 */
function handleKeyDown(e) {
  // Close drawers on Escape key
  if (e.key === 'Escape') {
    closeAllDrawers();
    
    // Also close tutorial if open
    const tutorialOverlay = document.getElementById("tutorial-overlay");
    if (tutorialOverlay && !tutorialOverlay.classList.contains('hidden')) {
      tutorialOverlay.classList.add('hidden');
    }
  }
}

/**
 * Hide the help tooltip and save preference
 */
function hideHelpTooltip() {
  const helpTooltip = document.getElementById("help-tooltip");
  if (helpTooltip) {
    helpTooltip.classList.add("hidden");
    localStorage.setItem("helpDismissed", "true");
  }
}

/**
 * Handle showing tutorial and hide help tooltip
 */
function handleShowTutorial() {
  const helpTooltip = document.getElementById("help-tooltip");
  if (helpTooltip) {
    helpTooltip.classList.add("hidden");
    localStorage.setItem("helpDismissed", "true");
  }
  showTutorial();
}