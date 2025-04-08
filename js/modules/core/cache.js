// Cache configuration
const CACHE_CONFIG = {
    MAX_SIZE: 1000, // Maximum number of items in cache
    DEFAULT_TTL: 3600000, // Default time-to-live in milliseconds (1 hour)
    CLEANUP_INTERVAL: 300000 // Cleanup interval in milliseconds (5 minutes)
};

// Cache storage
const cache = new Map();
let lastCleanup = Date.now();

// Cache item class
class CacheItem {
    constructor(value, ttl = CACHE_CONFIG.DEFAULT_TTL) {
        this.value = value;
        this.timestamp = Date.now();
        this.ttl = ttl;
    }

    isExpired() {
        return Date.now() - this.timestamp > this.ttl;
    }
}

// Cache management functions
export function getCache(key) {
    const item = cache.get(key);
    if (!item) return null;
    
    if (item.isExpired()) {
        cache.delete(key);
        return null;
    }
    
    return item.value;
}

export function setCache(key, value, ttl = CACHE_CONFIG.DEFAULT_TTL) {
    if (cache.size >= CACHE_CONFIG.MAX_SIZE) {
        cleanupCache();
    }
    
    cache.set(key, new CacheItem(value, ttl));
}

export function deleteCache(key) {
    cache.delete(key);
}

export function clearCache() {
    cache.clear();
}

// Cache cleanup
function cleanupCache() {
    const now = Date.now();
    if (now - lastCleanup < CACHE_CONFIG.CLEANUP_INTERVAL) return;
    
    for (const [key, item] of cache.entries()) {
        if (item.isExpired()) {
            cache.delete(key);
        }
    }
    
    lastCleanup = now;
}

// UI-specific cache functions
export const UICache = {
    getPanelPosition() {
        return getCache('panel_position');
    },
    
    setPanelPosition(position) {
        setCache('panel_position', position);
    },
    
    getPanelMinimized() {
        return getCache('panel_minimized');
    },
    
    setPanelMinimized(minimized) {
        setCache('panel_minimized', minimized);
    },
    
    getLastSearch() {
        return getCache('last_search');
    },
    
    setLastSearch(search) {
        setCache('last_search', search);
    },
    
    clearUICache() {
        deleteCache('panel_position');
        deleteCache('panel_minimized');
        deleteCache('last_search');
    }
};

// Satellite-specific cache functions
export const SatelliteCache = {
    getElevation(lat, lon, satLon) {
        return getCache(`elevation_${lat}_${lon}_${satLon}`);
    },
    
    setElevation(lat, lon, satLon, elevation) {
        setCache(`elevation_${lat}_${lon}_${satLon}`, elevation);
    },
    
    getAzimuth(lat, lon, satLon) {
        return getCache(`azimuth_${lat}_${lon}_${satLon}`);
    },
    
    setAzimuth(lat, lon, satLon, azimuth) {
        setCache(`azimuth_${lat}_${lon}_${satLon}`, azimuth);
    },
    
    getCoverageRadius(elevation) {
        return getCache(`coverage_radius_${elevation}`);
    },
    
    setCoverageRadius(elevation, radius) {
        setCache(`coverage_radius_${elevation}`, radius);
    },
    
    getPolarCoordinates(lat, lon) {
        return getCache(`polar_${lat}_${lon}`);
    },
    
    setPolarCoordinates(lat, lon, coordinates) {
        setCache(`polar_${lat}_${lon}`, coordinates);
    },
    
    clearSatelliteCache() {
        for (const key of cache.keys()) {
            if (key.startsWith('elevation_') || 
                key.startsWith('azimuth_') || 
                key.startsWith('coverage_radius_') || 
                key.startsWith('polar_')) {
                deleteCache(key);
            }
        }
    }
};

// App-wide cache functions
export const AppCache = {
    getAppState() {
        return getCache('app_state');
    },
    
    setAppState(state) {
        setCache('app_state', state);
    },
    
    getLastLocation() {
        return getCache('last_location');
    },
    
    setLastLocation(location) {
        setCache('last_location', location);
    },
    
    clearAppCache() {
        deleteCache('app_state');
        deleteCache('last_location');
    }
}; 