import { showNotification } from './utils.js';

// Error types
export const ErrorType = {
    VALIDATION: 'validation',
    CALCULATION: 'calculation',
    NETWORK: 'network',
    UI: 'ui',
    STORAGE: 'storage',
    GENERAL: 'general'
};

// Error messages
export const ErrorMessage = {
    INVALID_COORDINATES: 'Invalid coordinates provided',
    CALCULATION_FAILED: 'Calculation failed',
    NETWORK_ERROR: 'Network request failed',
    UI_ERROR: 'UI operation failed',
    STORAGE_ERROR: 'Storage operation failed',
    GENERAL_ERROR: 'An error occurred'
};

// Error severity levels
export const ErrorSeverity = {
    INFO: 'info',
    WARNING: 'warning',
    ERROR: 'error',
    CRITICAL: 'critical'
};

// Custom error class
export class AppError extends Error {
    constructor(message, type = ErrorType.GENERAL, severity = ErrorSeverity.ERROR) {
        super(message);
        this.name = 'AppError';
        this.type = type;
        this.severity = severity;
        this.timestamp = new Date();
    }
}

// Error handler function
export function handleError(error, context = 'App') {
    if (error instanceof AppError) {
        showNotification(`${context}: ${error.message}`, error.severity);
    } else {
        showNotification(`${context}: ${error.message || ErrorMessage.GENERAL_ERROR}`, ErrorSeverity.ERROR);
    }
    
    // Log error for debugging
    console.error(`[${context}] ${error.message}`, error);
    
    // Return error for further handling if needed
    return error;
}

// Error display function
export function showError(error, context = 'App') {
    return handleError(error, context);
}

// Error validation function
export function validateError(error) {
    if (!error) {
        return new AppError(ErrorMessage.GENERAL_ERROR);
    }
    
    if (typeof error === 'string') {
        return new AppError(error);
    }
    
    return error;
}

// Error type checkers
export function isValidationError(error) {
    return error instanceof AppError && error.type === ErrorType.VALIDATION;
}

export function isCalculationError(error) {
    return error instanceof AppError && error.type === ErrorType.CALCULATION;
}

export function isNetworkError(error) {
    return error instanceof AppError && error.type === ErrorType.NETWORK;
}

export function isUIError(error) {
    return error instanceof AppError && error.type === ErrorType.UI;
}

export function isStorageError(error) {
    return error instanceof AppError && error.type === ErrorType.STORAGE;
}

// Error severity checkers
export function isInfoError(error) {
    return error instanceof AppError && error.severity === ErrorSeverity.INFO;
}

export function isWarningError(error) {
    return error instanceof AppError && error.severity === ErrorSeverity.WARNING;
}

export function isErrorError(error) {
    return error instanceof AppError && error.severity === ErrorSeverity.ERROR;
}

export function isCriticalError(error) {
    return error instanceof AppError && error.severity === ErrorSeverity.CRITICAL;
} 