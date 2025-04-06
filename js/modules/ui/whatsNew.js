// whatsNew.js - What's New dialog
import { WHATS_NEW, VERSION } from '../core/version.js';
import ConfigManager from '../core/configManager.js';
import { makeAnnouncement } from '../core/utils.js';
import { eventBus } from '../core/events.js';

/**
 * Show the What's New dialog
 * @param {boolean} [force=false] - Whether to show regardless of version check
 */
export function showWhatsNewDialog(force = false) {
  // Check if we should show the dialog
  if (!force) {
    const lastSeenVersion = ConfigManager.get('lastSeenVersion', '');
    
    // Only show if the version has changed
    if (lastSeenVersion === VERSION) {
      return;
    }
  }
  
  // Create dialog if it doesn't exist
  let dialog = document.getElementById('whats-new-dialog');
  
  if (!dialog) {
    dialog = document.createElement('div');
    dialog.id = 'whats-new-dialog';
    dialog.className = 'modal-overlay';
    
    // Convert markdown to HTML
    const content = markdownToHtml(WHATS_NEW);
    
    dialog.innerHTML = `
      <div class="modal-content">
        <div class="modal-header">
          <h2>What's New in APA App</h2>
          <button id="close-whats-new" class="modal-close" aria-label="Close dialog">
            <span class="material-icons-round">close</span>
          </button>
        </div>
        <div class="modal-body">
          ${content}
        </div>
        <div class="modal-footer">
          <button id="dismiss-whats-new" class="primary-btn">Got it!</button>
        </div>
      </div>
    `;
    
    document.body.appendChild(dialog);
    
    // Set up close handlers
    const closeBtn = document.getElementById('close-whats-new');
    const dismissBtn = document.getElementById('dismiss-whats-new');
    
    if (closeBtn) {
      closeBtn.addEventListener('click', hideWhatsNewDialog);
    }
    
    if (dismissBtn) {
      dismissBtn.addEventListener('click', hideWhatsNewDialog);
    }
    
    // Close on ESC or outside click
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && dialog.style.display !== 'none') {
        hideWhatsNewDialog();
      }
    });
    
    dialog.addEventListener('click', (e) => {
      if (e.target === dialog) {
        hideWhatsNewDialog();
      }
    });
    
    // Make announcement for screen readers
    makeAnnouncement('What\'s new dialog opened. Press Escape to close.', 'assertive');
  }
  
  // Show the dialog
  dialog.style.display = 'flex';
  
  // Update the last seen version
  ConfigManager.set('lastSeenVersion', VERSION);
  
  // Publish event
  eventBus.publish('whatsNewDialogShown');
}

/**
 * Hide the What's New dialog
 */
export function hideWhatsNewDialog() {
  const dialog = document.getElementById('whats-new-dialog');
  
  if (dialog) {
    dialog.style.display = 'none';
    
    // Make announcement for screen readers
    makeAnnouncement('What\'s new dialog closed.', 'assertive');
    
    // Publish event
    eventBus.publish('whatsNewDialogClosed');
  }
}

/**
 * Check if the What's New dialog should be shown
 * @returns {boolean} Whether to show the dialog
 */
export function shouldShowWhatsNewDialog() {
  const lastSeenVersion = ConfigManager.get('lastSeenVersion', '');
  return lastSeenVersion !== VERSION;
}

/**
 * Simple markdown to HTML converter
 * @param {string} markdown - Markdown content
 * @returns {string} HTML content
 */
function markdownToHtml(markdown) {
  // Split into lines
  const lines = markdown.trim().split('\n');
  
  // Process line by line
  const htmlLines = lines.map(line => {
    // Headers
    if (line.startsWith('# ')) {
      return `<h2>${line.substring(2)}</h2>`;
    } else if (line.startsWith('## ')) {
      return `<h3>${line.substring(3)}</h3>`;
    } else if (line.startsWith('### ')) {
      return `<h4>${line.substring(4)}</h4>`;
    }
    
    // Lists
    else if (line.startsWith('- ')) {
      return `<li>${line.substring(2)}</li>`;
    }
    
    // Blank lines
    else if (line.trim() === '') {
      return '</ul><br>';
    }
    
    // Regular text
    else {
      return `<p>${line}</p>`;
    }
  });
  
  // Join and fix any unclosed lists
  let html = htmlLines.join('\n')
    .replace(/<li>/g, '<ul><li>')
    .replace(/<\/li>\n<li>/g, '</li><li>')
    .replace(/<\/li>\n<\/ul>/g, '</li></ul>')
    .replace(/<\/ul><br><ul>/g, '<br>');
  
  // Make sure all lists are closed
  if (html.includes('<ul>') && !html.includes('</ul>')) {
    html += '</ul>';
  }
  
  return html;
}

// Export for use in main.js
export default {
  show: showWhatsNewDialog,
  hide: hideWhatsNewDialog,
  shouldShow: shouldShowWhatsNewDialog
};
