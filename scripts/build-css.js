const fs = require('fs-extra');
const path = require('path');
const postcss = require('postcss');
const postcssPresetEnv = require('postcss-preset-env');
const cssMinify = require('css-minify');

// Configuration
const config = {
  inputDir: 'css',
  outputDir: 'dist/css',
  files: [
    'base.css',
    'components.css',
    'layout.css',
    'modules.css',
    'dark-mode.css',
    'animations.css',
    'responsive.css'
  ]
};

// Ensure output directory exists
fs.ensureDirSync(config.outputDir);

// Process each CSS file
config.files.forEach(async file => {
  const inputPath = path.join(config.inputDir, file);
  const outputPath = path.join(config.outputDir, file);
  
  try {
    // Read CSS file
    const css = await fs.readFile(inputPath, 'utf8');
    
    // Process with PostCSS
    const result = await postcss([
      postcssPresetEnv({
        stage: 3,
        features: {
          'nesting-rules': true,
          'custom-properties': true,
          'custom-media-queries': true
        }
      })
    ]).process(css, { from: inputPath });
    
    // Minify CSS
    const minified = cssMinify.minify(result.css);
    
    // Write to output
    await fs.writeFile(outputPath, minified);
    console.log(`Built ${file}`);
  } catch (error) {
    console.error(`Error processing ${file}:`, error);
  }
}); 