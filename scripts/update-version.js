#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Get version from package.json
const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
const version = packageJson.version;
const buildDate = new Date().toISOString().split('T')[0];

// Update version-data.js
const versionDataPath = path.join('js', 'modules', 'core', 'version-data.js');
const versionDataContent = `// version-data.js - Version information as a JavaScript module
export const versionData = {
  version: "${version}",
  buildDate: "${buildDate}",
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

// Update HTML version references and script/css query parameters
const indexHtmlPath = 'index.html';
let indexHtml = fs.readFileSync(indexHtmlPath, 'utf8');

// Update version meta tag
indexHtml = indexHtml.replace(/<meta name="version" content="[^"]*">/, `<meta name="version" content="${version}">`);

// Update version span
indexHtml = indexHtml.replace(/<span id="version">Version: [^<]*<\/span>/, `<span id="version">Version: ${version}</span>`);

// Remove all existing version query parameters
indexHtml = indexHtml.replace(/\?v=\d+\.\d+\.\d+/g, '');

// Add version query parameters to all script and css files in index.html
const scripts = indexHtml.match(/<script[^>]*src="[^"]*"[^>]*>/g) || [];
const styles = indexHtml.match(/<link[^>]*href="[^"]*"[^>]*>/g) || [];

[...scripts, ...styles].forEach(tag => {
    const file = tag.match(/(src|href)="([^"?]*)/)[2];
    if (file.startsWith('js/') || file.startsWith('css/')) {
        const newTag = tag.replace(file, `${file}?v=${version}`);
        indexHtml = indexHtml.replace(tag, newTag);
    }
});

fs.writeFileSync(indexHtmlPath, indexHtml);

// Update service worker version
const swPath = 'sw.js';
let swContent = fs.readFileSync(swPath, 'utf8');
swContent = swContent.replace(/const APP_VERSION = '[^']*'/, `const APP_VERSION = '${version}'`);
swContent = swContent.replace(/const CACHE_NAME = '[^']*'/, `const CACHE_NAME = 'apa-app-cache-v${version}'`);
fs.writeFileSync(swPath, swContent);

// Update version in file headers and hardcoded versions
const filesToUpdate = [
    'js/main.js',
    'js/modules/core/events.js',
    'js/modules/core/version.js',
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
        let content = fs.readFileSync(filePath, 'utf8');
        // Update version in file headers
        content = content.replace(/@version\s+\d+\.\d+\.\d+/, `@version ${version}`);
        // Update any hardcoded version strings in the file
        content = content.replace(/version\s+\d+\.\d+\.\d+/gi, `version ${version}`);
        content = content.replace(/v\d+\.\d+\.\d+/g, `v${version}`);
        content = content.replace(/\(v\d+\.\d+\.\d+\)/g, `(v${version})`);
        fs.writeFileSync(filePath, content);
    }
});

console.log(`Updated version to ${version} in all files`); 