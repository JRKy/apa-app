// locationSelector.js - Improved location selector functionality
import { getLocations, goToLocation } from '../data/locations.js';
import { getStoredValue, storeValue, showNotification, makeAnnouncement } from '../core/utils.js';
import { eventBus } from '../core/events.js';
import { searchLocation } from './geocoder.js';

const STORAGE_KEY_CUSTOM_LOCATIONS = 'customLocations';
const STORAGE_KEY_EXPANDED_GROUPS = 'expandedLocationGroups';

/**
 * Initialize the improved location selector
 */
export function initLocationSelector() {
  // Load locations and populate groups
  populateLocationGroups();
  
  // Load custom locations
  loadCustomLocations();
  
  // Set up event handlers
  setupEventHandlers();
  
  // Restore expanded state
  restoreExpandedState();
}

/**
 * Populate location groups based on CCMDs
 */
function populateLocationGroups() {
  const locations = getLocations();
  const locationList = document.querySelector('.location-list');
  
  if (!locationList) return;
  
  // Clear existing content
  locationList.innerHTML = '';
  
  // Group locations by CCMD
  const groupedLocations = {};
  
  locations.forEach(location => {
    const category = location.aor || 'Other';
    if (!groupedLocations[category]) {
      groupedLocations[category] = [];
    }
    groupedLocations[category].push(location);
  });
  
  // Sort categories alphabetically
  const sortedCategories = Object.keys(groupedLocations).sort();
  
  // Create group elements
  sortedCategories.forEach(category => {
    const locations = groupedLocations[category];
    const categoryCount = locations.length;
    
    const groupElement = document.createElement('div');
    groupElement.className = 'location-group';
    groupElement.dataset.category = category;
    
    groupElement.innerHTML = `
      <div class="location-group-header" data-category="${category}">
        <span class="location-group-name">${category}</span>
        <span class="location-group-count">${categoryCount}</span>
      </div>
      <div class="location-items">
        ${locations.map(loc => `
          <div class="location-item" data-lat="${loc.latitude}" data-lon="${loc.longitude}" 
               data-country="${loc.country}" data-aor="${loc.aor}" data-name="${loc.name}">
            <span class="location-name">${loc.name}</span>
            <button class="go-to-location-btn" title="Go to ${loc.name}">
              <span class="material-icons-round">navigation</span>
            </button>
          </div>
        `).join('')}
      </div>
    `;
    
    locationList.appendChild(groupElement);
  });
}

/**
 * Load custom locations from localStorage
 */
function loadCustomLocations() {
  const customLocationList = document.querySelector('.custom-location-list');
  const noCustomLocations = document.querySelector('.no-custom-locations');
  
  if (!customLocationList || !noCustomLocations) return;
  
  const customLocations = getStoredValue(STORAGE_KEY_CUSTOM_LOCATIONS, []);
  
  if (customLocations.length === 0) {
    noCustomLocations.style.display = 'block';
    return;
  }
  
  // Hide the "no locations" message
  noCustomLocations.style.display = 'none';
  
  // Clear existing content (except the message)
  const existingItems = customLocationList.querySelectorAll('.location-item');
  existingItems.forEach(item => item.remove());
  
  // Add custom locations
  customLocations.forEach(loc => {
    const itemElement = document.createElement('div');
    itemElement.className = 'location-item';
    itemElement.dataset.lat = loc.latitude;
    itemElement.dataset.lon = loc.longitude;
    itemElement.dataset.name = loc.name;
    itemElement.dataset.custom = 'true';
    
    itemElement.innerHTML = `
      <span class="location-name">${loc.name}</span>
      <div class="location-actions">
        <button class="go-to-location-btn" title="Go to ${loc.name}">
          <span class="material-icons-round">navigation</span>
        </button>
        <button class="delete-location-btn" title="Delete ${loc.name}">
          <span class="material-icons-round">delete</span>
        </button>
      </div>
    `;
    
    customLocationList.appendChild(itemElement);
  });
}

/**
 * Save a custom location
 */
function saveCustomLocation(name, latitude, longitude) {
  const customLocations = getStoredValue(STORAGE_KEY_CUSTOM_LOCATIONS, []);
  
  // Check for duplicate name
  if (customLocations.some(loc => loc.name === name)) {
    showNotification('A location with this name already exists.', 'error');
    return false;
  }
  
  // Add new location
  customLocations.push({
    name,
    latitude,
    longitude,
    custom: true
  });
  
  // Save to localStorage
  storeValue(STORAGE_KEY_CUSTOM_LOCATIONS, customLocations);
  
  // Reload the list
  loadCustomLocations();
  
  // Show success notification
  showNotification(`Location "${name}" saved successfully.`, 'success');
  
  return true;
}

/**
 * Delete a custom location
 */
function deleteCustomLocation(name) {
  const customLocations = getStoredValue(STORAGE_KEY_CUSTOM_LOCATIONS, []);
  
  // Find the location index
  const index = customLocations.findIndex(loc => loc.name === name);
  
  if (index === -1) {
    showNotification('Location not found.', 'error');
    return false;
  }
  
  // Remove the location
  customLocations.splice(index, 1);
  
  // Save to localStorage
  storeValue(STORAGE_KEY_CUSTOM_LOCATIONS, customLocations);
  
  // Reload the list
  loadCustomLocations();
  
  // Show success notification
  showNotification(`Location "${name}" deleted.`, 'success');
  
  return true;
}

/**
 * Filter locations by search term
 */
function filterLocations(searchTerm) {
  if (!searchTerm) {
    // Reset all visibility
    document.querySelectorAll('.location-group').forEach(group => {
      group.style.display = 'block';
      group.querySelectorAll('.location-item').forEach(item => {
        item.style.display = 'flex';
      });
    });
    return;
  }
  
  searchTerm = searchTerm.toLowerCase();
  
  // Check each location
  document.querySelectorAll('.location-group').forEach(group => {
    let groupHasVisibleItems = false;
    
    group.querySelectorAll('.location-item').forEach(item => {
      const name = item.querySelector('.location-name').textContent.toLowerCase();
      const country = item.dataset.country?.toLowerCase() || '';
      const aor = item.dataset.aor?.toLowerCase() || '';
      
      // Check if any field matches the search term
      const isVisible = 
        name.includes(searchTerm) || 
        country.includes(searchTerm) || 
        aor.includes(searchTerm);
      
      // Set visibility
      item.style.display = isVisible ? 'flex' : 'none';
      
      if (isVisible) {
        groupHasVisibleItems = true;
      }
    });
    
    // Show/hide the group based on whether it has visible items
    group.style.display = groupHasVisibleItems ? 'block' : 'none';
  });
}

/**
 * Set up event handlers for the location selector
 */
function setupEventHandlers() {
  // Group header click (expand/collapse)
  document.querySelectorAll('.location-group-header').forEach(header => {
    header.addEventListener('click', () => {
      const group = header.closest('.location-group');
      group.classList.toggle('expanded');
      
      // Save expanded state
      saveExpandedState();
    });
  });
  
  // Location item click
  document.addEventListener('click', (e) => {
    // Handle go-to-location button
    if (e.target.closest('.go-to-location-btn')) {
      const locationItem = e.target.closest('.location-item');
      if (locationItem) {
        const lat = parseFloat(locationItem.dataset.lat);
        const lon = parseFloat(locationItem.dataset.lon);
        const name = locationItem.dataset.name;
        
        if (!isNaN(lat) && !isNaN(lon)) {
          goToLocation(lat, lon, name);
          document.getElementById('location-drawer')?.classList.remove('visible');
          document.getElementById('drawer-overlay')?.classList.remove('visible');
        }
      }
    }
    
    // Handle delete-location button
    if (e.target.closest('.delete-location-btn')) {
      const locationItem = e.target.closest('.location-item');
      if (locationItem && locationItem.dataset.custom === 'true') {
        const name = locationItem.dataset.name;
        
        if (confirm(`Are you sure you want to delete the location "${name}"?`)) {
          deleteCustomLocation(name);
        }
      }
    }
  });
  
  // Search functionality
  const locationSearch = document.getElementById('location-search');
  if (locationSearch) {
    locationSearch.addEventListener('input', () => {
      filterLocations(locationSearch.value.trim());
    });
    
    // Clear button logic
    const locationSearchBtn = document.getElementById('location-search-btn');
    if (locationSearchBtn) {
      locationSearchBtn.addEventListener('click', () => {
        if (locationSearch.value) {
          locationSearch.value = '';
          filterLocations('');
          locationSearch.focus();
        }
      });
    }
  }
  
  // Add custom location
  const addCustomLocationBtn = document.getElementById('add-custom-location-btn');
  if (addCustomLocationBtn) {
    addCustomLocationBtn.addEventListener('click', () => {
      const nameInput = document.getElementById('custom-loc-name');
      const latInput = document.getElementById('custom-lat');
      const lonInput = document.getElementById('custom-lon');
      
      if (!nameInput || !latInput || !lonInput) return;
      
      const name = nameInput.value.trim();
      const lat = parseFloat(latInput.value);
      const lon = parseFloat(lonInput.value);
      
      if (!name) {
        showNotification('Please enter a location name.', 'error');
        return;
      }
      
      if (isNaN(lat) || isNaN(lon)) {
        showNotification('Please enter valid latitude and longitude values.', 'error');
        return;
      }
      
      if (lat < -90 || lat > 90) {
        showNotification('Latitude must be between -90 and 90 degrees.', 'error');
        return;
      }
      
      if (lon < -180 || lon > 180) {
        showNotification('Longitude must be between -180 and 180 degrees.', 'error');
        return;
      }
      
      // Save the location
      if (saveCustomLocation(name, lat, lon)) {
        // Clear inputs on success
        nameInput.value = '';
        latInput.value = '';
        lonInput.value = '';
      }
    });
  }
  
  // Geocoder search
  const geocoderSearchBtn = document.getElementById('geocoder-search-btn');
  if (geocoderSearchBtn) {
    geocoderSearchBtn.addEventListener('click', handleGeocoderSearch);
    
    // Also enable search on Enter key
    const geocoderInput = document.getElementById('geocoder-input');
    if (geocoderInput) {
      geocoderInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
          handleGeocoderSearch();
        }
      });
    }
  }
}

/**
 * Handle geocoder search
 */
function handleGeocoderSearch() {
  const geocoderInput = document.getElementById('geocoder-input');
  if (!geocoderInput || !geocoderInput.value.trim()) {
    showNotification('Please enter a location to search', 'error');
    return;
  }
  
  // Show loading state
  const searchBtn = document.getElementById('geocoder-search-btn');
  if (searchBtn) {
    searchBtn.innerHTML = '<span class="material-icons-round loading">sync</span>';
    searchBtn.disabled = true;
  }
  
  searchLocation(geocoderInput.value.trim())
    .then(results => {
      if (results.length > 0) {
        const result = results[0];
        
        // Auto-fill the custom location form
        const nameInput = document.getElementById('custom-loc-name');
        const latInput = document.getElementById('custom-lat');
        const lonInput = document.getElementById('custom-lon');
        
        if (nameInput && latInput && lonInput) {
          nameInput.value = result.name;
          latInput.value = result.lat.toFixed(6);
          lonInput.value = result.lon.toFixed(6);
          
          // Show success notification
          showNotification(`Found location: ${result.name}`, 'success');
          
          // Scroll to the add location section
          document.querySelector('.add-custom-location').scrollIntoView({
            behavior: 'smooth',
            block: 'start'
          });
        }
      } else {
        showNotification('No results found for your search', 'error');
      }
    })
    .catch(error => {
      showNotification(error.message, 'error');
    })
    .finally(() => {
      // Reset button
      if (searchBtn) {
        searchBtn.innerHTML = '<span class="material-icons-round">search</span> Find';
        searchBtn.disabled = false;
      }
    });
}

/**
 * Save which groups are expanded
 */
function saveExpandedState() {
  const expandedGroups = [];
  
  document.querySelectorAll('.location-group.expanded').forEach(group => {
    expandedGroups.push(group.dataset.category);
  });
  
  storeValue(STORAGE_KEY_EXPANDED_GROUPS, expandedGroups);
}

/**
 * Restore expanded state from localStorage
 */
function restoreExpandedState() {
  const expandedGroups = getStoredValue(STORAGE_KEY_EXPANDED_GROUPS, []);
  
  expandedGroups.forEach(category => {
    const group = document.querySelector(`.location-group[data-category="${category}"]`);
    if (group) {
      group.classList.add('expanded');
    }
  });
}

// Export for use in main.js
export default {
  init: initLocationSelector,
  saveCustomLocation,
  deleteCustomLocation,
  filterLocations
};
