const fs = require('fs-extra');
const path = require('path');
const { updateVersion } = require('../scripts/update-version');

describe('Version Management', () => {
  const testFiles = [
    'package.json',
    'manifest.json',
    'src/sw.js',
    'src/js/version.js'
  ];

  beforeEach(() => {
    // Create test files with initial content
    testFiles.forEach(file => {
      const content = file.includes('package.json') 
        ? JSON.stringify({ version: '2.4.0' })
        : file.includes('manifest.json')
        ? JSON.stringify({ version: '2.4.0' })
        : file.includes('sw.js')
        ? `const VERSION = '2.4.0';`
        : `export const VERSION = '2.4.0';`;
      
      fs.outputFileSync(path.join(__dirname, '..', file), content);
    });
  });

  afterEach(() => {
    // Clean up test files
    testFiles.forEach(file => {
      fs.removeSync(path.join(__dirname, '..', file));
    });
  });

  test('should update version in all files', async () => {
    const newVersion = '2.5.0';
    await updateVersion(newVersion);

    // Check package.json
    const packageJson = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'package.json'), 'utf8'));
    expect(packageJson.version).toBe(newVersion);

    // Check manifest.json
    const manifestJson = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'manifest.json'), 'utf8'));
    expect(manifestJson.version).toBe(newVersion);

    // Check sw.js
    const swContent = fs.readFileSync(path.join(__dirname, '..', 'src/sw.js'), 'utf8');
    expect(swContent).toContain(`const VERSION = '${newVersion}';`);

    // Check version.js
    const versionContent = fs.readFileSync(path.join(__dirname, '..', 'src/js/version.js'), 'utf8');
    expect(versionContent).toContain(`export const VERSION = '${newVersion}';`);
  });

  test('should handle invalid version format', async () => {
    const invalidVersion = 'invalid';
    await expect(updateVersion(invalidVersion)).rejects.toThrow('Invalid version format');
  });
}); 