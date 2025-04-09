// version.js - Version information
import { versionData } from './version-data.js';

export const VERSION = versionData.version;
export const BUILD_DATE = versionData.buildDate;
export const VERSION_INFO = versionData.versionInfo;

// Features included in this version
export const FEATURES = {
  IMPROVED_LOCATION_SELECTOR: true,
  COMMAND_REGIONS: true,
  ENHANCED_SATELLITE_COVERAGE: true,
  CENTRAL_CONFIG_MANAGER: true
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

## Improvements
- Centralized configuration management for better performance
- Optimized storage system with automatic migration from previous versions
- Various UI/UX enhancements for better usability

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
    default:
      return VERSION;
  }
}
