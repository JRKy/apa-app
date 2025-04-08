const fs = require('fs');
const { execSync } = require('child_process');

// Get the absolute path to the template file
const templatePath = require('path').resolve(__dirname, '../.gitmessage');

// Configure Git to use the template
try {
  execSync(`git config --local commit.template "${templatePath}"`);
  console.log('✅ Git commit template configured successfully');
  
  // Also set up some helpful Git configurations
  execSync('git config --local core.editor "code --wait"');
  execSync('git config --local core.autocrlf input');
  execSync('git config --local core.ignorecase false');
  
  console.log('✅ Additional Git configurations set up');
} catch (error) {
  console.error('❌ Error configuring Git:', error.message);
  process.exit(1);
} 