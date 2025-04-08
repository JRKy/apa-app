// Memoization configuration
const MEMO_CONFIG = {
    MAX_SIZE: 1000, // Maximum number of cached results
    DEFAULT_TTL: 3600000, // Default time-to-live in milliseconds (1 hour)
    CLEANUP_INTERVAL: 300000 // Cleanup interval in milliseconds (5 minutes)
};

// Memoization cache
const memoCache = new Map();
let lastCleanup = Date.now();

// Memoized result class
class MemoizedResult {
    constructor(value, ttl = MEMO_CONFIG.DEFAULT_TTL) {
        this.value = value;
        this.timestamp = Date.now();
        this.ttl = ttl;
    }

    isExpired() {
        return Date.now() - this.timestamp > this.ttl;
    }
}

// Memoization function
export function memoize(fn, options = {}) {
    const {
        maxSize = MEMO_CONFIG.MAX_SIZE,
        ttl = MEMO_CONFIG.DEFAULT_TTL,
        keyFn = (...args) => JSON.stringify(args)
    } = options;

    return function(...args) {
        const key = keyFn(...args);
        const cached = memoCache.get(key);

        if (cached && !cached.isExpired()) {
            return cached.value;
        }

        if (memoCache.size >= maxSize) {
            cleanupMemoCache();
        }

        const result = fn.apply(this, args);
        memoCache.set(key, new MemoizedResult(result, ttl));

        return result;
    };
}

// Cache cleanup
function cleanupMemoCache() {
    const now = Date.now();
    if (now - lastCleanup < MEMO_CONFIG.CLEANUP_INTERVAL) return;

    for (const [key, result] of memoCache.entries()) {
        if (result.isExpired()) {
            memoCache.delete(key);
        }
    }

    lastCleanup = now;
}

// Clear memoization cache
export function clearMemoCache() {
    memoCache.clear();
    lastCleanup = Date.now();
}

// Example usage:
/*
const expensiveCalculation = memoize((a, b) => {
    // Expensive calculation here
    return a + b;
}, {
    maxSize: 100,
    ttl: 60000, // 1 minute
    keyFn: (a, b) => `${a}_${b}` // Custom key function
});
*/ 