// mobileNav.js - Mobile navigation functionality

import { showNotification } from '../core/utils.js';
import { eventBus } from '../core/events.js';

let currentNav = 'map';

/**
 * Initialize mobile navigation
 */
export function initMobileNav() {
  if (window.innerWidth > 768) return; // Only initialize on mobile

  const navItems = document.querySelectorAll('.mobile-nav-item');
  
  navItems.forEach(item => {
    item.addEventListener('click', (e) => {
      e.preventDefault();
      const target = e.currentTarget.dataset.nav;
      
      if (target === currentNav) return;
      
      // Update active state
      navItems.forEach(nav => nav.classList.remove('active'));
      item.classList.add('active');
      
      // Handle navigation
      handleNavigation(target);
    });
  });

  // Set initial active state
  document.querySelector(`.mobile-nav-item[data-nav="map"]`).classList.add('active');
}

/**
 * Handle navigation between different sections
 * @param {string} target - Target section to navigate to
 */
function handleNavigation(target) {
  currentNav = target;
  
  switch (target) {
    case 'map':
      // Show map and hide other panels
      eventBus.publish('showMap');
      break;
      
    case 'satellites':
      // Show satellite drawer
      eventBus.publish('showSatelliteDrawer');
      break;
      
    case 'locations':
      // Show location drawer
      eventBus.publish('showLocationDrawer');
      break;
      
    case 'settings':
      // Show settings drawer
      eventBus.publish('showSettingsDrawer');
      break;
  }
  
  // Show notification for screen readers
  showNotification(`Switched to ${target} view`, 'info');
}

/**
 * Update navigation state based on current view
 * @param {string} view - Current view to set as active
 */
export function updateNavState(view) {
  if (window.innerWidth > 768) return;
  
  const navItems = document.querySelectorAll('.mobile-nav-item');
  navItems.forEach(nav => nav.classList.remove('active'));
  
  const activeNav = document.querySelector(`.mobile-nav-item[data-nav="${view}"]`);
  if (activeNav) {
    activeNav.classList.add('active');
    currentNav = view;
  }
} 