// tutorial.js - Enhanced tutorial system
import { TUTORIAL_STEPS } from '../core/config.js';
import { saveTutorialCompleted } from '../data/storage.js';
import { eventBus } from '../core/events.js';
import { makeAnnouncement } from '../core/utils.js';

let currentStep = 0;
let isActive = false;

/**
 * Initialize the tutorial system
 */
export function initTutorial() {
  const tutorialOverlay = document.getElementById("tutorial-overlay");
  const tutorialContent = document.getElementById("tutorial-content");
  const tutorialPrev = document.getElementById("tutorial-prev");
  const tutorialNext = document.getElementById("tutorial-next");
  const tutorialProgress = document.getElementById("tutorial-progress");
  
  if (!tutorialOverlay || !tutorialContent || !tutorialPrev || !tutorialNext || !tutorialProgress) return;
  
  // Set up event handlers for tutorial navigation
  tutorialPrev.addEventListener("click", () => {
    if (currentStep > 0) {
      currentStep--;
      updateTutorial();
      
      // Announce navigation for screen readers
      makeAnnouncement(`Previous step. ${currentStep + 1} of ${TUTORIAL_STEPS.length}`, 'polite');
    }
  });

  tutorialNext.addEventListener("click", () => {
    if (currentStep < TUTORIAL_STEPS.length - 1) {
      currentStep++;
      updateTutorial();
      
      // Announce navigation for screen readers
      makeAnnouncement(`Next step. ${currentStep + 1} of ${TUTORIAL_STEPS.length}`, 'polite');
    } else {
      // End of tutorial
      completeTutorial();
    }
  });
  
  // Keyboard navigation
  document.addEventListener('keydown', (e) => {
    if (!isActive) return;
    
    if (e.key === 'ArrowLeft' && currentStep > 0) {
      currentStep--;
      updateTutorial();
    } else if (e.key === 'ArrowRight' && currentStep < TUTORIAL_STEPS.length - 1) {
      currentStep++;
      updateTutorial();
    } else if (e.key === 'Escape') {
      completeTutorial();
    }
  });
  
  // Close tutorial on ESC key or when clicking outside
  tutorialOverlay.addEventListener('click', (e) => {
    // Only close if clicking on the overlay itself, not the tutorial card
    if (e.target === tutorialOverlay) {
      completeTutorial();
    }
  });
}

/**
 * Start the tutorial
 */
export function showTutorial() {
  const tutorialOverlay = document.getElementById("tutorial-overlay");
  if (!tutorialOverlay) return;
  
  currentStep = 0;
  isActive = true;
  tutorialOverlay.classList.remove('hidden');
  updateTutorial();
  
  // Announce tutorial start for screen readers
  makeAnnouncement('Tutorial started. Use arrow keys to navigate.', 'assertive');
  
  // Publish event
  eventBus.publish('tutorialStarted');
}

/**
 * Complete the tutorial
 */
function completeTutorial() {
  const tutorialOverlay = document.getElementById("tutorial-overlay");
  if (!tutorialOverlay) return;
  
  tutorialOverlay.classList.add("hidden");
  isActive = false;
  saveTutorialCompleted(true);
  
  // Remove any highlights
  removeHighlight();
  
  // Announce tutorial completion for screen readers
  makeAnnouncement('Tutorial completed. You can restart it anytime from the help menu.', 'polite');
  
  // Publish event
  eventBus.publish('tutorialCompleted');
}

/**
 * Update the tutorial content based on current step
 */
function updateTutorial() {
  const tutorialOverlay = document.getElementById("tutorial-overlay");
  const tutorialContent = document.getElementById("tutorial-content");
  const tutorialPrev = document.getElementById("tutorial-prev");
  const tutorialNext = document.getElementById("tutorial-next");
  const tutorialProgress = document.getElementById("tutorial-progress");
  
  if (!tutorialOverlay || !tutorialContent || !tutorialPrev || !tutorialNext || !tutorialProgress) return;
  
  // Get current step
  const step = TUTORIAL_STEPS[currentStep];
  if (!step) return;
  
  // Update content
  document.querySelector('.tutorial-header').textContent = step.title;
  tutorialContent.textContent = step.content;
  
  // Update progress indicator
  tutorialProgress.textContent = `${currentStep + 1}/${TUTORIAL_STEPS.length}`;
  
  // Enable/disable previous button
  tutorialPrev.disabled = currentStep <= 0;
  
  // Update next button text
  if (currentStep >= TUTORIAL_STEPS.length - 1) {
    tutorialNext.textContent = 'Finish';
  } else {
    tutorialNext.textContent = 'Next';
  }
  
  // Add highlight if specified
  if (step.highlight) {
    highlightElement(step.highlight);
  } else {
    removeHighlight();
  }
  
  // Publish step change event
  eventBus.publish('tutorialStepChanged', {
    currentStep: currentStep + 1,
    totalSteps: TUTORIAL_STEPS.length,
    title: step.title
  });
}

/**
 * Highlight an element in the tutorial
 * @param {string} elementId - ID of the element to highlight
 */
function highlightElement(elementId) {
  // Remove any existing highlights
  removeHighlight();
  
  // Find the element to highlight
  const element = document.getElementById(elementId);
  if (!element) {
    console.warn(`Tutorial highlight element with ID "${elementId}" not found`);
    return;
  }
  
  // Get element position and size
  const rect = element.getBoundingClientRect();
  
  // Create highlight overlay
  const highlight = document.createElement('div');
  highlight.className = 'tutorial-highlight';
  highlight.style.top = rect.top + 'px';
  highlight.style.left = rect.left + 'px';
  highlight.style.width = rect.width + 'px';
  highlight.style.height = rect.height + 'px';
  
  // Add pulse animation for better visibility
  highlight.style.animation = 'pulse 2s infinite';
  
  // Add to document
  document.body.appendChild(highlight);
  
  // Make sure the element is visible (scroll into view if needed)
  element.scrollIntoView({ behavior: 'smooth', block: 'center' });
}

/**
 * Remove tutorial highlight
 */
function removeHighlight() {
  const existingHighlight = document.querySelector('.tutorial-highlight');
  if (existingHighlight) {
    existingHighlight.remove();
  }
}

/**
 * Check if the tutorial is active
 * @returns {boolean} Whether the tutorial is currently active
 */
export function isTutorialActive() {
  return isActive;
}
