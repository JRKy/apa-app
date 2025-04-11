// version.js - Version information
import { versionData } from './version-data.js';
import { VERSION_HISTORY, getMigrationPath, getChangesSince } from './version-history.js';

export const VERSION = versionData.version;
export const BUILD_DATE = versionData.buildDate;
export const BUILD_HASH = versionData.buildHash;
export const VERSION_INFO = versionData.versionInfo;

/**
 * Updates version references in the DOM
 * Note: Only updates CSS and display versions, not script versions
 * Script versions must be set in HTML since they load before JS executes
 */
export function updateVersionReferences() {
  // Update version display in header
  const versionElement = document.getElementById('version');
  if (versionElement) {
    versionElement.textContent = `Version: ${VERSION} (${BUILD_HASH})`;
  }

  // Update CSS file versions
  const cssFiles = [
    'base.css',
    'layout.css',
    'components.css',
    'modules.css',
    'dark-mode.css',
    'animations.css',
    'responsive.css'
  ];

  cssFiles.forEach(file => {
    const link = document.querySelector(`link[href^="css/${file}"]`);
    if (link) {
      link.href = `css/${file}?v=${VERSION}`;
    }
  });
}

/**
 * Get detailed version information
 * @returns {Object} Version information object
 */
export function getVersionDetails() {
  return {
    version: VERSION,
    buildDate: BUILD_DATE,
    buildHash: BUILD_HASH,
    ...VERSION_INFO,
    changes: getChangesSince(VERSION_INFO.major + '.0.0')
  };
}

/**
 * Check if an update is available
 * @param {string} currentVersion - Current version to check against
 * @returns {Object|null} Update information or null if no update available
 */
export function checkForUpdate(currentVersion) {
  if (currentVersion === VERSION) return null;
  
  const currentMajor = parseInt(currentVersion.split('.')[0]);
  const currentMinor = parseInt(currentVersion.split('.')[1]);
  const currentPatch = parseInt(currentVersion.split('.')[2]);
  
  const isMajorUpdate = VERSION_INFO.major > currentMajor;
  const isMinorUpdate = VERSION_INFO.major === currentMajor && VERSION_INFO.minor > currentMinor;
  const isPatchUpdate = VERSION_INFO.major === currentMajor && 
                       VERSION_INFO.minor === currentMinor && 
                       VERSION_INFO.patch > currentPatch;
  
  if (isMajorUpdate || isMinorUpdate || isPatchUpdate) {
    return {
      available: true,
      type: isMajorUpdate ? 'major' : isMinorUpdate ? 'minor' : 'patch',
      current: currentVersion,
      latest: VERSION,
      changes: getChangesSince(currentVersion),
      migrationPath: getMigrationPath(currentVersion, VERSION)
    };
  }
  
  return null;
}

// Features included in this version
export const FEATURES = {
  IMPROVED_LOCATION_SELECTOR: true,
  COMMAND_REGIONS: true,
  ENHANCED_SATELLITE_COVERAGE: true,
  CENTRAL_CONFIG_MANAGER: true,
  VERSION_HISTORY: true,
  BUILD_INFO: true
};

// Changelog entry for this version
export const CHANGELOG = {
  version: VERSION,
  date: BUILD_DATE,
  changes: {
    added: [
      "Improved location selector with search and grouping by CCMD",
      "Enhanced satellite coverage visualization",
      "Centralized configuration management",
      "Custom locations can now be saved and managed",
      "Direct location search with geocoding results list"
    ],
    changed: [
      "Restructured location filtering to focus on preset and custom locations",
      "Improved command regions visualization",
      "Optimized storage and retrieval of app settings",
      "Updated UI components for better usability"
    ],
    fixed: [
      "Location persistence issues across sessions",
      "Edge cases with International Date Line satellite visibility",
      "Performance improvements for large datasets"
    ]
  }
};

// What's New message
export const WHATS_NEW = `
# What's New in v${VERSION}

## New Features
- Completely redesigned location selector with search and CCMD grouping
- Enhanced satellite coverage visualization for more accurate footprints
- Custom locations can now be saved and reused
- Improved command regions visualization
- Added version history tracking
- Enhanced build information display

## Improvements
- Centralized configuration management for better performance
- Optimized storage system with automatic migration from previous versions
- Various UI/UX enhancements for better usability
- Better version management and tracking

## Bug Fixes
- Fixed issues with location persistence
- Improved satellite visibility calculation near the International Date Line
`;

// Helper to get version string with optional formatting
export function getVersionString(format = 'full') {
  switch (format) {
    case 'v-prefix':
      return `v${VERSION}`;
    case 'semantic':
      return `${VERSION_INFO.major}.${VERSION_INFO.minor}.${VERSION_INFO.patch}`;
    case 'major-minor':
      return `${VERSION_INFO.major}.${VERSION_INFO.minor}`;
    case 'with-hash':
      return `${VERSION} (${BUILD_HASH})`;
    default:
      return VERSION;
  }
}
