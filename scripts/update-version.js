#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Get version from package.json
const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
const version = packageJson.version;

// Update version-data.js
const versionDataPath = path.join('js', 'modules', 'core', 'version-data.js');
const versionDataContent = `// version-data.js - Version information as a JavaScript module
export const versionData = {
  version: "${version}",
  buildDate: "${new Date().toISOString().split('T')[0]}",
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

// Update HTML version in index.html
const indexHtmlPath = 'index.html';
let indexHtml = fs.readFileSync(indexHtmlPath, 'utf8');
indexHtml = indexHtml.replace(/<meta name="version" content="[^"]*">/, `<meta name="version" content="${version}">`);
fs.writeFileSync(indexHtmlPath, indexHtml);

// Update version in file headers
const filesToUpdate = [
    'js/main.js',
    'js/modules/core/events.js',
    'js/modules/core/version.js',
    'js/modules/ui/drawers.js',
    'js/modules/ui/map.js',
    'js/modules/ui/notifications.js',
    'js/modules/ui/tutorial.js',
    'css/layout.css',
    'css/modules.css',
    'css/components.css'
];

filesToUpdate.forEach(filePath => {
    if (fs.existsSync(filePath)) {
        let content = fs.readFileSync(filePath, 'utf8');
        // Update version in file headers
        content = content.replace(/@version\s+\d+\.\d+\.\d+/, `@version ${version}`);
        fs.writeFileSync(filePath, content);
    }
});

console.log(`Updated version to ${version} in all files`); 