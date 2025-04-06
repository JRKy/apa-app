// configManager.js - Centralized configuration management
import { getStoredValue, storeValue } from './utils.js';
import { VERSION } from './version.js';

// Default configuration values
const DEFAULT_CONFIG = {
  // App settings
  version: VERSION,
  theme: 'light', // 'light' or 'dark'
  
  // Map settings
  map: {
    center: [20, 0],
    zoom: 2,
    minZoom: 2,
    basemap: 'Map', // 'Map', 'Satellite', 'Terrain', 'Dark'
  },
  
  // UI settings
  ui: {
    showHelp: true,
    tutorialCompleted: false,
    showCommandRegions: false,
    showPolarPlot: false,
    apaPanelMinimized: false,
  },
  
  // APA table settings
  table: {
    sortColumn: null,
    sortDirection: 'none',
  },
  
  // Filter settings
  filters: {
    satelliteMinElevation: -30,
    satelliteType: 'all',
    longitudeRange: [-180, 180],
    showOnlyVisible: false,
  },
  
  // Timestamps
  timestamps: {
    lastVisit: null,
    lastUpdateCheck: null,
  }
};

// Keys for stored configuration objects
const STORAGE_KEYS = {
  CONFIG: 'app_config',
  LAST_LOCATION: 'lastLocation',
  CUSTOM_SATELLITES: 'customSatellites',
  CUSTOM_LOCATIONS: 'customLocations',
  EXPANDED_GROUPS: 'expandedLocationGroups',
};

// Configuration manager
const ConfigManager = {
  /**
   * Current configuration state
   */
  config: { ...DEFAULT_CONFIG },
  
  /**
   * Initialize the configuration manager
   * @returns {Object} The loaded configuration
   */
  init() {
    this.load();
    this.migrateIfNeeded();
    this.updateTimestamp('lastVisit');
    return this.config;
  },
  
  /**
   * Load configuration from localStorage
   */
  load() {
    const storedConfig = getStoredValue(STORAGE_KEYS.CONFIG, null);
    
    if (storedConfig) {
      // Merge stored config with defaults for any missing properties
      this.config = this.mergeConfigs(DEFAULT_CONFIG, storedConfig);
    } else {
      // Use defaults if no stored config
      this.config = { ...DEFAULT_CONFIG };
    }
    
    return this.config;
  },
  
  /**
   * Save current configuration to localStorage
   */
  save() {
    storeValue(STORAGE_KEYS.CONFIG, this.config);
  },
  
  /**
   * Get a configuration value
   * @param {string} path - Dot-notation path to the config value
   * @param {*} defaultValue - Default value if path not found
   * @returns {*} The configuration value or default
   */
  get(path, defaultValue) {
    return this.getValueByPath(this.config, path, defaultValue);
  },
  
  /**
   * Set a configuration value
   * @param {string} path - Dot-notation path to the config value
   * @param {*} value - Value to set
   * @param {boolean} [autoSave=true] - Whether to auto-save after setting
   */
  set(path, value, autoSave = true) {
    this.setValueByPath(this.config, path, value);
    
    if (autoSave) {
      this.save();
    }
  },
  
  /**
   * Update a timestamp value
   * @param {string} key - Timestamp key
   * @param {Date} [date=new Date()] - Date to set (defaults to now)
   */
  updateTimestamp(key, date = new Date()) {
    this.set(`timestamps.${key}`, date.toISOString());
  },
  
  /**
   * Reset configuration to defaults
   * @param {boolean} [save=true] - Whether to save after reset
   */
  reset(save = true) {
    this.config = { ...DEFAULT_CONFIG };
    
    if (save) {
      this.save();
    }
  },
  
  /**
   * Migrate configuration from older versions if needed
   */
  migrateIfNeeded() {
    const storedVersion = this.config.version;
    
    // Only migrate if versions don't match
    if (storedVersion !== VERSION) {
      console.log(`Migrating configuration from ${storedVersion || 'unknown'} to ${VERSION}`);
      
      // For now, just update the version
      this.config.version = VERSION;
      
      // Handle legacy storage keys
      this.migrateLegacySettings();
      
      // Save the migrated config
      this.save();
    }
  },
  
  /**
   * Migrate settings from old localStorage keys
   */
  migrateLegacySettings() {
    // Map legacy keys to new config paths
    const legacyMappings = {
      'darkMode': 'theme',
      'helpDismissed': 'ui.showHelp',
      'tutorialCompleted': 'ui.tutorialCompleted',
      'polarPlotVisible': 'ui.showPolarPlot',
      'apaPanelMinimized': 'ui.apaPanelMinimized',
    };
    
    // Check each legacy key
    Object.entries(legacyMappings).forEach(([legacyKey, configPath]) => {
      const legacyValue = localStorage.getItem(legacyKey);
      
      if (legacyValue !== null) {
        try {
          let value = JSON.parse(legacyValue);
          
          // Special handling for certain keys
          if (legacyKey === 'darkMode') {
            value = value ? 'dark' : 'light';
          } else if (legacyKey === 'helpDismissed') {
            value = !value; // Invert since we now store showHelp
          }
          
          // Set the value in the new config
          this.set(configPath, value, false);
          
          // Optionally remove the legacy key
          // localStorage.removeItem(legacyKey);
        } catch (e) {
          console.error(`Failed to migrate legacy setting ${legacyKey}:`, e);
        }
      }
    });
  },
  
  /**
   * Get a deeply nested value using dot notation
   * @param {Object} obj - Object to get value from
   * @param {string} path - Dot notation path
   * @param {*} defaultValue - Default value if path not found
   * @returns {*} Value or default
   */
  getValueByPath(obj, path, defaultValue) {
    const keys = path.split('.');
    let result = obj;
    
    for (const key of keys) {
      if (result === undefined || result === null || !Object.prototype.hasOwnProperty.call(result, key)) {
        return defaultValue;
      }
      result = result[key];
    }
    
    return result;
  },
  
  /**
   * Set a deeply nested value using dot notation
   * @param {Object} obj - Object to set value in
   * @param {string} path - Dot notation path
   * @param {*} value - Value to set
   */
  setValueByPath(obj, path, value) {
    const keys = path.split('.');
    const lastKey = keys.pop();
    let current = obj;
    
    for (const key of keys) {
      if (!Object.prototype.hasOwnProperty.call(current, key) || current[key] === null) {
        current[key] = {};
      }
      current = current[key];
    }
    
    current[lastKey] = value;
  },
  
  /**
   * Deep merge two config objects
   * @param {Object} target - Target object
   * @param {Object} source - Source object
   * @returns {Object} Merged object
   */
  mergeConfigs(target, source) {
    const result = { ...target };
    
    for (const key in source) {
      if (Object.prototype.hasOwnProperty.call(source, key)) {
        if (source[key] && typeof source[key] === 'object' && !Array.isArray(source[key])) {
          // Recursively merge objects
          result[key] = this.mergeConfigs(target[key] || {}, source[key]);
        } else {
          // Directly assign non-object values
          result[key] = source[key];
        }
      }
    }
    
    return result;
  }
};

export default ConfigManager;
