#!/usr/bin/env node

/**
 * This script helps verify that sourcemaps are being properly generated
 * and configured for Sentry. It checks the .next directory for sourcemaps
 * and verifies they contain the necessary Debug IDs.
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Configuration
const nextDir = path.resolve(__dirname, '../.next');
const clientDir = path.join(nextDir, 'static');

console.log('🔍 Verifying Sentry sourcemap configuration...');

// Check if .next directory exists
if (!fs.existsSync(nextDir)) {
  console.error('❌ .next directory not found. Please run a build first.');
  process.exit(1);
}

// Check if client directory exists
if (!fs.existsSync(clientDir)) {
  console.error('❌ Client directory not found in .next/static.');
  process.exit(1);
}

// Function to recursively find files with a specific extension
function findFiles(dir, ext) {
  let results = [];
  const files = fs.readdirSync(dir);

  for (const file of files) {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);

    if (stat.isDirectory()) {
      results = results.concat(findFiles(filePath, ext));
    } else if (file.endsWith(ext)) {
      results.push(filePath);
    }
  }

  return results;
}

// Find all JS files and their sourcemaps
const jsFiles = findFiles(clientDir, '.js');
console.log(`📊 Found ${jsFiles.length} JavaScript files`);

const mapFiles = findFiles(clientDir, '.js.map');
console.log(`📊 Found ${mapFiles.length} sourcemap files`);

if (mapFiles.length === 0) {
  console.error('❌ No sourcemap files found. Check your webpack configuration.');
  process.exit(1);
}

// Check if sourcemaps contain source content
let hasSourceContent = false;
let hasDebugId = false;

for (let i = 0; i < Math.min(5, mapFiles.length); i++) {
  const mapFile = mapFiles[i];
  console.log(`\n📝 Checking sourcemap: ${path.basename(mapFile)}`);

  try {
    const mapContent = JSON.parse(fs.readFileSync(mapFile, 'utf8'));

    // Check for source content
    if (mapContent.sourcesContent && mapContent.sourcesContent.length > 0) {
      console.log('✅ Sourcemap contains source content');
      hasSourceContent = true;
    } else {
      console.log('❌ Sourcemap does not contain source content');
    }

    // Check for Debug ID
    if (mapContent.debugId) {
      console.log(`✅ Sourcemap has Debug ID: ${mapContent.debugId}`);
      hasDebugId = true;
    } else {
      console.log('❌ Sourcemap does not have a Debug ID');
    }

    // Check sources
    if (mapContent.sources && mapContent.sources.length > 0) {
      console.log(`✅ Sourcemap references ${mapContent.sources.length} source files`);
    } else {
      console.log('❌ Sourcemap does not reference any source files');
    }
  } catch (error) {
    console.error(`❌ Error parsing sourcemap: ${error.message}`);
  }
}

// Summary
console.log('\n📋 Summary:');
console.log(`- JavaScript files: ${jsFiles.length}`);
console.log(`- Sourcemap files: ${mapFiles.length}`);
console.log(`- Contains source content: ${hasSourceContent ? 'Yes' : 'No'}`);
console.log(`- Contains Debug IDs: ${hasDebugId ? 'Yes' : 'No'}`);

// Check Sentry CLI version
try {
  console.log('\n🔧 Checking Sentry CLI:');
  const sentryVersion = execSync('npx @sentry/cli --version').toString().trim();
  console.log(`✅ Sentry CLI version: ${sentryVersion}`);
} catch (error) {
  console.log('❌ Sentry CLI not available or error running it');
}

// Recommendations
console.log('\n💡 Recommendations:');

if (!hasSourceContent) {
  console.log('- Ensure webpack is configured with devtool: "hidden-source-map" for production');
  console.log('- Make sure terserOptions.sourceMap.includeSources is set to true');
}

if (!hasDebugId) {
  console.log('- Ensure injectClientSideDebugIds is set to true in Sentry config');
  console.log('- Make sure you are using the latest version of @sentry/nextjs');
}

console.log('- Verify that uploadSourceMaps is set to true in Sentry config');
console.log('- Check that hideSourceMaps is set to false in Sentry config');
console.log('- Ensure your build process is not stripping sourcemaps');

console.log('\n✨ Verification complete!');
