// version-history.js - Version history and migration tracking
import { versionData } from './version-data.js';

export const VERSION_HISTORY = {
  '2.4.8': {
    date: '2025-04-11',
    changes: [
      'Added tooltips and gesture controls',
      'Improved user experience'
    ],
    migrations: [
      {
        from: '2.4.7',
        steps: [
          'Update tooltip styles',
          'Add gesture control handlers'
        ]
      }
    ]
  },
  '2.4.7': {
    date: '2025-04-10',
    changes: [
      'Enhanced satellite coverage visualization',
      'Improved location selector'
    ],
    migrations: [
      {
        from: '2.4.6',
        steps: [
          'Update satellite coverage calculations',
          'Migrate location data format'
        ]
      }
    ]
  }
};

/**
 * Get migration path between two versions
 * @param {string} fromVersion - Starting version
 * @param {string} toVersion - Target version
 * @returns {Array} Array of migration steps
 */
export function getMigrationPath(fromVersion, toVersion) {
  const path = [];
  let currentVersion = fromVersion;
  
  while (currentVersion !== toVersion && VERSION_HISTORY[currentVersion]) {
    const versionInfo = VERSION_HISTORY[currentVersion];
    const migration = versionInfo.migrations.find(m => m.from === currentVersion);
    if (migration) {
      path.push(...migration.steps);
    }
    currentVersion = versionInfo.migrations[0].from;
  }
  
  return path;
}

/**
 * Check if version exists in history
 * @param {string} version - Version to check
 * @returns {boolean} True if version exists in history
 */
export function isValidVersion(version) {
  return version in VERSION_HISTORY;
}

/**
 * Get all changes since a specific version
 * @param {string} sinceVersion - Version to start from
 * @returns {Array} Array of changes
 */
export function getChangesSince(sinceVersion) {
  const changes = [];
  let currentVersion = versionData.version;
  
  while (currentVersion !== sinceVersion && VERSION_HISTORY[currentVersion]) {
    changes.push(...VERSION_HISTORY[currentVersion].changes);
    currentVersion = VERSION_HISTORY[currentVersion].migrations[0].from;
  }
  
  return changes;
} 