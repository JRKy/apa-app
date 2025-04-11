// notifications.js - Notification management module
import { versionData } from '../core/version-data.js';

/**
 * Initialize the notifications module
 */
export function initNotifications() {
    console.log('Notifications module initialized');
}

/**
 * Show a notification message
 * @param {string} message - The message to display
 * @param {string} type - The type of notification (info, success, warning, error)
 * @param {number} duration - How long to show the notification in milliseconds
 */
export function showNotification(message, type = 'info', duration = 3000) {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    
    // Add to DOM
    document.body.appendChild(notification);
    
    // Show notification
    setTimeout(() => {
        notification.classList.add('show');
    }, 10);
    
    // Remove after duration
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, duration);
}

/**
 * Show an error notification
 * @param {string} message - The error message to display
 */
export function showError(message) {
    showNotification(message, 'error', 5000);
}

/**
 * Show a success notification
 * @param {string} message - The success message to display
 */
export function showSuccess(message) {
    showNotification(message, 'success', 3000);
}

/**
 * Show a warning notification
 * @param {string} message - The warning message to display
 */
export function showWarning(message) {
    showNotification(message, 'warning', 4000);
}

/**
 * Show an info notification
 * @param {string} message - The info message to display
 */
export function showInfo(message) {
    showNotification(message, 'info', 3000);
} 