#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Get version from package.json
const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
const version = packageJson.version;

// Files to update with their version patterns
const filesToUpdate = [
  {
    path: 'manifest.json',
    pattern: /"version": ".*"/,
    replacement: `"version": "${version}"`
  },
  {
    path: 'sw.js',
    pattern: /const CACHE_NAME = "apa-app-cache-v.*"/,
    replacement: `const CACHE_NAME = "apa-app-cache-v${version}"`
  },
  {
    path: 'index.html',
    pattern: /<span id="version">Version: .*<\/span>/,
    replacement: `<span id="version">Version: ${version}</span>`
  },
  {
    path: 'js/modules/core/version.js',
    pattern: /export const VERSION = '.*'/,
    replacement: `export const VERSION = '${version}'`
  }
];

// Update each file
filesToUpdate.forEach(file => {
  const filePath = path.join(process.cwd(), file.path);
  let content = fs.readFileSync(filePath, 'utf8');
  content = content.replace(file.pattern, file.replacement);
  fs.writeFileSync(filePath, content, 'utf8');
  console.log(`Updated version in ${file.path}`);
});

// Update CSS and JS file references in index.html
const indexHtmlPath = path.join(process.cwd(), 'index.html');
let indexHtml = fs.readFileSync(indexHtmlPath, 'utf8');
indexHtml = indexHtml.replace(/v=\d+\.\d+\.\d+/g, `v=${version}`);
fs.writeFileSync(indexHtmlPath, indexHtml, 'utf8');
console.log('Updated version in CSS/JS file references');

// Update service worker cache paths
const swPath = path.join(process.cwd(), 'sw.js');
let swContent = fs.readFileSync(swPath, 'utf8');
swContent = swContent.replace(/v=\d+\.\d+\.\d+/g, `v=${version}`);
fs.writeFileSync(swPath, swContent, 'utf8');
console.log('Updated version in service worker cache paths');

console.log(`Version updated to ${version} across all files`); 