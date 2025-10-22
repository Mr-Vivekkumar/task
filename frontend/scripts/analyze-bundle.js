#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

/**
 * Bundle Analysis Script
 * Analyzes the Angular build output and provides optimization recommendations
 */

const DIST_PATH = path.join(__dirname, '../dist/frontend');
const BUNDLE_ANALYZER_PATH = path.join(__dirname, '../node_modules/.bin/webpack-bundle-analyzer');

function analyzeBundle() {
  console.log('🔍 Analyzing bundle size...\n');

  if (!fs.existsSync(DIST_PATH)) {
    console.error('❌ Build directory not found. Please run "ng build" first.');
    process.exit(1);
  }

  const files = fs.readdirSync(DIST_PATH);
  const jsFiles = files.filter(file => file.endsWith('.js'));
  const cssFiles = files.filter(file => file.endsWith('.css'));

  let totalSize = 0;
  let gzippedSize = 0;

  console.log('📦 Bundle Analysis Results:\n');

  // Analyze JavaScript files
  jsFiles.forEach(file => {
    const filePath = path.join(DIST_PATH, file);
    const stats = fs.statSync(filePath);
    const sizeKB = (stats.size / 1024).toFixed(2);
    const gzippedKB = estimateGzippedSize(stats.size);
    
    totalSize += stats.size;
    gzippedSize += gzippedKB;

    console.log(`📄 ${file}:`);
    console.log(`   Raw: ${sizeKB} KB`);
    console.log(`   Gzipped: ${gzippedKB.toFixed(2)} KB`);
    console.log('');
  });

  // Analyze CSS files
  cssFiles.forEach(file => {
    const filePath = path.join(DIST_PATH, file);
    const stats = fs.statSync(filePath);
    const sizeKB = (stats.size / 1024).toFixed(2);
    const gzippedKB = estimateGzippedSize(stats.size);
    
    totalSize += stats.size;
    gzippedSize += gzippedKB;

    console.log(`🎨 ${file}:`);
    console.log(`   Raw: ${sizeKB} KB`);
    console.log(`   Gzipped: ${gzippedKB.toFixed(2)} KB`);
    console.log('');
  });

  const totalSizeKB = (totalSize / 1024).toFixed(2);
  const totalGzippedKB = gzippedSize.toFixed(2);

  console.log('📊 Summary:');
  console.log(`   Total Raw Size: ${totalSizeKB} KB`);
  console.log(`   Total Gzipped Size: ${totalGzippedKB} KB`);
  console.log(`   Budget: 500 KB`);
  console.log(`   Status: ${totalGzippedKB > 500 ? '❌ OVER BUDGET' : '✅ WITHIN BUDGET'}`);

  if (totalGzippedKB > 500) {
    console.log('\n💡 Optimization Recommendations:');
    console.log('   1. Enable lazy loading for routes');
    console.log('   2. Use OnPush change detection strategy');
    console.log('   3. Implement tree shaking for unused code');
    console.log('   4. Optimize Bootstrap CSS imports');
    console.log('   5. Use Angular Material CDK instead of full Material');
    console.log('   6. Implement code splitting for large components');
  }

  console.log('\n🚀 Performance Tips:');
  console.log('   - Use Angular CLI build optimizer');
  console.log('   - Enable AOT compilation');
  console.log('   - Implement service workers for caching');
  console.log('   - Use CDN for third-party libraries');
  console.log('   - Optimize images and assets');
}

function estimateGzippedSize(originalSize) {
  // Rough estimation: gzip typically reduces size by 60-80%
  return originalSize * 0.3;
}

function checkDependencies() {
  const packageJsonPath = path.join(__dirname, '../package.json');
  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
  
  console.log('\n📋 Dependency Analysis:');
  
  const dependencies = Object.keys(packageJson.dependencies || {});
  const devDependencies = Object.keys(packageJson.devDependencies || {});
  
  console.log(`   Production Dependencies: ${dependencies.length}`);
  console.log(`   Development Dependencies: ${devDependencies.length}`);
  
  // Check for large dependencies
  const largeDeps = ['@angular/material', 'bootstrap', 'rxjs'];
  const foundLargeDeps = dependencies.filter(dep => largeDeps.some(large => dep.includes(large)));
  
  if (foundLargeDeps.length > 0) {
    console.log('\n⚠️  Large Dependencies Found:');
    foundLargeDeps.forEach(dep => {
      console.log(`   - ${dep}`);
    });
    console.log('\n💡 Consider:');
    console.log('   - Using Angular CDK instead of full Material');
    console.log('   - Importing only needed Bootstrap components');
    console.log('   - Using tree-shakable RxJS operators');
  }
}

// Main execution
if (require.main === module) {
  analyzeBundle();
  checkDependencies();
}

module.exports = { analyzeBundle, checkDependencies };
