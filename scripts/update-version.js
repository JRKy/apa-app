#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Error handling wrapper
function handleError(error, message) {
  console.error(`Error: ${message}`);
  console.error(error);
  process.exit(1);
}

// Validate version format
function validateVersion(version) {
  const semverRegex = /^\d+\.\d+\.\d+$/;
  if (!semverRegex.test(version)) {
    handleError(null, `Invalid version format: ${version}. Must be in format X.Y.Z`);
  }
}

// Get git commit hash
function getGitHash() {
  try {
    return execSync('git rev-parse --short HEAD').toString().trim();
  } catch (error) {
    return 'unknown';
  }
}

// Update file with version
function updateFileVersion(filePath, version, buildInfo) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Update version in file headers
    content = content.replace(/@version\s+\d+\.\d+\.\d+/, `@version ${version}`);
    
    // Update any hardcoded version strings
    content = content.replace(/version\s+\d+\.\d+\.\d+/gi, `version ${version}`);
    content = content.replace(/v\d+\.\d+\.\d+/g, `v${version}`);
    content = content.replace(/\(v\d+\.\d+\.\d+\)/g, `(v${version})`);
    
    // Add build info if not present
    if (!content.includes('@build')) {
      const headerEnd = content.indexOf('*/');
      if (headerEnd !== -1) {
        content = content.slice(0, headerEnd) + 
                 ` * @build ${buildInfo.date} (${buildInfo.hash})\n` +
                 content.slice(headerEnd);
      }
    }
    
    fs.writeFileSync(filePath, content);
  } catch (error) {
    handleError(error, `Failed to update version in ${filePath}`);
  }
}

// Main execution
try {
  // Get version from package.json
  const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
  const version = packageJson.version;
  validateVersion(version);
  
  const buildDate = new Date().toISOString().split('T')[0];
  const gitHash = getGitHash();
  
  // Update version-data.js
  const versionDataPath = path.join('js', 'modules', 'core', 'version-data.js');
  const versionDataContent = `// version-data.js - Version information as a JavaScript module
export const versionData = {
  version: "${version}",
  buildDate: "${buildDate}",
  buildHash: "${gitHash}",
  versionInfo: {
    major: ${version.split('.')[0]},
    minor: ${version.split('.')[1]},
    patch: ${version.split('.')[2]}
  }
};`;
  fs.writeFileSync(versionDataPath, versionDataContent);
  
  // Update manifest.json
  const manifestPath = 'manifest.json';
  const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
  manifest.version = version;
  fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2));
  
  // Update HTML version references
  const indexHtmlPath = 'index.html';
  let indexHtml = fs.readFileSync(indexHtmlPath, 'utf8');
  
  // Update version meta tag
  indexHtml = indexHtml.replace(/<meta name="version" content="[^"]*">/, 
    `<meta name="version" content="${version}">`);
  
  // Update version span
  indexHtml = indexHtml.replace(/<span id="version">Version: [^<]*<\/span>/, 
    `<span id="version">Version: ${version} (${gitHash})</span>`);
  
  // Update cache-busting parameters
  const filesToUpdate = [
    'js/main.js',
    'js/modules/core/events.js',
    'js/modules/core/version.js',
    'js/modules/core/data.js',
    'js/modules/ui/drawers.js',
    'js/modules/ui/map.js',
    'js/modules/ui/notifications.js',
    'js/modules/ui/tutorial.js',
    'js/modules/ui/locationSelector.js',
    'js/modules/ui/satelliteCoverage.js',
    'js/modules/ui/polarPlot.js',
    'css/layout.css',
    'css/modules.css',
    'css/components.css',
    'css/base.css',
    'css/animations.css',
    'css/dark-mode.css',
    'css/responsive.css'
  ];
  
  filesToUpdate.forEach(filePath => {
    if (fs.existsSync(filePath)) {
      updateFileVersion(filePath, version, { date: buildDate, hash: gitHash });
    }
  });
  
  // Update service worker
  const swPath = 'sw.js';
  let swContent = fs.readFileSync(swPath, 'utf8');
  swContent = swContent.replace(/const APP_VERSION = '[^']*'/, 
    `const APP_VERSION = '${version}'`);
  swContent = swContent.replace(/const CACHE_NAME = '[^']*'/, 
    `const CACHE_NAME = 'apa-app-cache-v${version}'`);
  fs.writeFileSync(swPath, swContent);
  
  // Git commit changes
  try {
    execSync('git add .');
    execSync(`git commit -m "chore: update version to ${version}"`);
    execSync('git push');
  } catch (error) {
    console.warn('Warning: Failed to commit version changes to git');
  }
  
  console.log(`Successfully updated version to ${version} (${gitHash})`);
} catch (error) {
  handleError(error, 'Failed to update version');
} 