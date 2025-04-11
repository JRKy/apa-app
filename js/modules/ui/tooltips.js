// tooltips.js - Tooltip functionality

import { eventBus } from '../core/events.js';

let tooltipElement = null;

/**
 * Initialize tooltips
 */
export function initTooltips() {
  // Create tooltip element
  tooltipElement = document.createElement('div');
  tooltipElement.className = 'tooltip';
  tooltipElement.setAttribute('role', 'tooltip');
  tooltipElement.setAttribute('aria-hidden', 'true');
  document.body.appendChild(tooltipElement);

  // Add event listeners for tooltip triggers
  document.addEventListener('mouseover', handleMouseOver);
  document.addEventListener('mouseout', handleMouseOut);
  document.addEventListener('focus', handleFocus, true);
  document.addEventListener('blur', handleBlur, true);
}

/**
 * Handle mouseover events for tooltips
 */
function handleMouseOver(e) {
  const target = e.target;
  const tooltipText = target.getAttribute('data-tooltip');
  
  if (tooltipText) {
    showTooltip(target, tooltipText);
  }
}

/**
 * Handle mouseout events for tooltips
 */
function handleMouseOut(e) {
  const target = e.target;
  if (target.getAttribute('data-tooltip')) {
    hideTooltip();
  }
}

/**
 * Handle focus events for tooltips
 */
function handleFocus(e) {
  const target = e.target;
  const tooltipText = target.getAttribute('data-tooltip');
  
  if (tooltipText) {
    showTooltip(target, tooltipText);
  }
}

/**
 * Handle blur events for tooltips
 */
function handleBlur(e) {
  const target = e.target;
  if (target.getAttribute('data-tooltip')) {
    hideTooltip();
  }
}

/**
 * Show tooltip
 */
function showTooltip(target, text) {
  if (!tooltipElement) return;
  
  tooltipElement.textContent = text;
  tooltipElement.style.display = 'block';
  tooltipElement.setAttribute('aria-hidden', 'false');
  
  const rect = target.getBoundingClientRect();
  const tooltipRect = tooltipElement.getBoundingClientRect();
  
  // Position tooltip above the element
  let top = rect.top - tooltipRect.height - 10;
  let left = rect.left + (rect.width - tooltipRect.width) / 2;
  
  // Adjust if tooltip would go off screen
  if (top < 0) {
    top = rect.bottom + 10;
  }
  
  if (left < 0) {
    left = 10;
  } else if (left + tooltipRect.width > window.innerWidth) {
    left = window.innerWidth - tooltipRect.width - 10;
  }
  
  tooltipElement.style.top = `${top}px`;
  tooltipElement.style.left = `${left}px`;
}

/**
 * Hide tooltip
 */
function hideTooltip() {
  if (!tooltipElement) return;
  
  tooltipElement.style.display = 'none';
  tooltipElement.setAttribute('aria-hidden', 'true');
}

/**
 * Add tooltip to element
 */
export function addTooltip(element, text) {
  element.setAttribute('data-tooltip', text);
  element.setAttribute('aria-label', text);
}

/**
 * Remove tooltip from element
 */
export function removeTooltip(element) {
  element.removeAttribute('data-tooltip');
  element.removeAttribute('aria-label');
} 