// Basic test script that always passes
// TODO: Implement actual tests

const { spawn } = require('child_process');
const path = require('path');

console.log('Running tests with Jest...');

const jest = spawn('jest', ['--config', path.join(__dirname, '../jest.config.js')], {
  stdio: 'inherit',
  shell: true,
});

jest.on('close', (code) => {
  process.exit(code);
}); 