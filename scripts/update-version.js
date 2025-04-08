const fs = require('fs');
const path = require('path');

// Get new version from package.json
const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
const newVersion = packageJson.version;

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
cssFiles.forEach(file => {
  const filePath = path.join(process.cwd(), file);
  let content = fs.readFileSync(filePath, 'utf8');
  
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
  
  fs.writeFileSync(filePath, content);
});

console.log(`Updated version to ${newVersion} in all CSS files`); 