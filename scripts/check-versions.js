const fs = require('fs');
const path = require('path');

// Get version from package.json
const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
const expectedVersion = packageJson.version;

// Files to check
const filesToCheck = [
  'css/base.css',
  'css/components.css',
  'css/layout.css',
  'css/modules.css',
  'css/dark-mode.css',
  'css/animations.css',
  'css/responsive.css'
];

let hasErrors = false;

// Check each file
filesToCheck.forEach(file => {
  const content = fs.readFileSync(file, 'utf8');
  
  // Check version in comment
  const versionMatch = content.match(/v(\d+\.\d+\.\d+)/);
  if (!versionMatch || versionMatch[1] !== expectedVersion) {
    console.error(`❌ Version mismatch in ${file}`);
    console.error(`   Expected: v${expectedVersion}`);
    console.error(`   Found: ${versionMatch ? versionMatch[0] : 'No version found'}`);
    hasErrors = true;
  }
  
  // Check version variable in base.css
  if (file === 'css/base.css') {
    const varMatch = content.match(/--version:\s*['"](\d+\.\d+\.\d+)['"]/);
    if (!varMatch || varMatch[1] !== expectedVersion) {
      console.error('❌ Version variable mismatch in base.css');
      console.error(`   Expected: --version: '${expectedVersion}'`);
      console.error(`   Found: ${varMatch ? varMatch[0] : 'No version variable found'}`);
      hasErrors = true;
    }
  }
});

if (hasErrors) {
  console.error('\nVersion consistency check failed!');
  process.exit(1);
} else {
  console.log('✅ All versions are consistent!');
} 