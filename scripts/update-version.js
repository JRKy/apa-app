const fs = require('fs-extra');
const path = require('path');

async function updateVersion(newVersion) {
  // Validate version format
  if (!/^\d+\.\d+\.\d+$/.test(newVersion)) {
    throw new Error('Invalid version format');
  }

  // Update package.json
  const packageJsonPath = path.join(__dirname, '..', 'package.json');
  const packageJson = JSON.parse(await fs.readFile(packageJsonPath, 'utf8'));
  packageJson.version = newVersion;
  await fs.writeFile(packageJsonPath, JSON.stringify(packageJson, null, 2));

  // Update manifest.json
  const manifestPath = path.join(__dirname, '..', 'manifest.json');
  const manifest = JSON.parse(await fs.readFile(manifestPath, 'utf8'));
  manifest.version = newVersion;
  await fs.writeFile(manifestPath, JSON.stringify(manifest, null, 2));

  // Update sw.js
  const swPath = path.join(__dirname, '..', 'sw.js');
  let swContent = await fs.readFile(swPath, 'utf8');
  swContent = swContent.replace(/const CACHE_NAME = "apa-app-cache-v\d+\.\d+\.\d+"/, `const CACHE_NAME = "apa-app-cache-v${newVersion}"`);
  await fs.writeFile(swPath, swContent);

  // Update version.js
  const versionPath = path.join(__dirname, '..', 'js', 'modules', 'core', 'version.js');
  let versionContent = await fs.readFile(versionPath, 'utf8');
  versionContent = versionContent.replace(/export const VERSION = '\d+\.\d+\.\d+'/, `export const VERSION = '${newVersion}'`);
  versionContent = versionContent.replace(/export const BUILD_DATE = '\d{4}-\d{2}-\d{2}'/, `export const BUILD_DATE = '${new Date().toISOString().split('T')[0]}'`);
  versionContent = versionContent.replace(/major: \d+,/, `major: ${newVersion.split('.')[0]},`);
  versionContent = versionContent.replace(/minor: \d+,/, `minor: ${newVersion.split('.')[1]},`);
  versionContent = versionContent.replace(/patch: \d+,/, `patch: ${newVersion.split('.')[2]},`);
  versionContent = versionContent.replace(/fullVersion: '\d+\.\d+\.\d+'/, `fullVersion: '${newVersion}'`);
  await fs.writeFile(versionPath, versionContent);

  // CSS files to update
  const cssFiles = [
    'css/base.css',
    'css/components.css',
    'css/layout.css',
    'css/modules.css',
    'css/dark-mode.css',
    'css/animations.css',
    'css/responsive.css'
  ];

  // Update each CSS file
  for (const file of cssFiles) {
    const filePath = path.join(__dirname, '..', file);
    let content = await fs.readFile(filePath, 'utf8');
    
    // Update version in comment
    content = content.replace(
      /\/\*.*v\d+\.\d+\.\d+\s*\*\//,
      `/* ${path.basename(file, '.css')} - ${file.includes('base') ? 'Base styles and design system variables' : 
        file.includes('components') ? 'Reusable UI component styles' :
        file.includes('layout') ? 'Structural layout and positioning styles' :
        file.includes('modules') ? 'Module-specific styles' :
        file.includes('dark-mode') ? 'Dark mode theme styles' :
        file.includes('animations') ? 'Animation and transition styles' :
        'Responsive design breakpoints and adjustments'} - v${newVersion} */`
    );
    
    // Update version variable in base.css
    if (file === 'css/base.css') {
      content = content.replace(
        /--version:\s*['"]\d+\.\d+\.\d+['"]/,
        `--version: '${newVersion}'`
      );
    }
    
    await fs.writeFile(filePath, content);
  }

  console.log(`Updated version to ${newVersion} in all files`);
}

module.exports = { updateVersion }; 