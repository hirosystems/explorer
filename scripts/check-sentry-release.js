#!/usr/bin/env node

/**
 * This script helps diagnose issues with Sentry releases and sourcemaps
 * by checking the Docker build process and CI configuration
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🔍 Analyzing Sentry release configuration in CI/Docker...');

// Check if Dockerfile exists
const dockerfilePath = path.resolve(__dirname, '../Dockerfile');
let dockerfileContent = '';

if (fs.existsSync(dockerfilePath)) {
  console.log('✅ Dockerfile found');
  dockerfileContent = fs.readFileSync(dockerfilePath, 'utf8');

  // Check if Dockerfile preserves sourcemaps
  console.log('\n📋 Analyzing Dockerfile for sourcemap handling:');

  if (dockerfileContent.includes('.next')) {
    console.log('✅ Dockerfile copies .next directory');

    // Check how .next is copied
    if (
      dockerfileContent.includes('COPY .next .next') ||
      dockerfileContent.includes('COPY .next/ .next/')
    ) {
      console.log('✅ Dockerfile directly copies .next directory');
    } else {
      console.log('⚠️ .next directory might be copied as part of a larger directory');
    }
  } else {
    console.log('❌ Could not find .next directory being copied in Dockerfile');
    console.log('   This may mean sourcemaps are not being preserved in the Docker image');
  }

  // Check for build steps that might regenerate code
  if (
    dockerfileContent.includes('npm run build') ||
    dockerfileContent.includes('yarn build') ||
    dockerfileContent.includes('pnpm build') ||
    dockerfileContent.includes('next build')
  ) {
    console.log('⚠️ WARNING: Dockerfile contains a build step that might regenerate code');
    console.log(
      '   This could create new sourcemaps with different Debug IDs than what was uploaded to Sentry'
    );
  } else {
    console.log('✅ Dockerfile does not appear to rebuild the application');
  }

  // Check for environment variables
  console.log('\n🔑 Checking for Sentry environment variables in Dockerfile:');
  if (dockerfileContent.includes('SENTRY_') || dockerfileContent.includes('NEXT_PUBLIC_SENTRY_')) {
    console.log('✅ Dockerfile contains Sentry environment variables');
  } else {
    console.log('⚠️ No Sentry environment variables found in Dockerfile');
  }

  // Check for ARGs that might be used for Sentry
  if (
    dockerfileContent.includes('ARG SENTRY_') ||
    dockerfileContent.includes('ARG NEXT_PUBLIC_SENTRY_') ||
    dockerfileContent.includes('ARG RELEASE_TAG_NAME')
  ) {
    console.log('✅ Dockerfile accepts build arguments for Sentry configuration');
  }
} else {
  console.log('❌ Dockerfile not found');
}

// Check CI configuration
console.log('\n🚀 Analyzing CI configuration for Sentry integration:');

// Check if CI file exists
const ciFilePath = path.resolve(__dirname, '../.github/workflows/ci.yml');
let ciFileContent = '';

if (fs.existsSync(ciFilePath)) {
  console.log('✅ CI configuration file found');
  ciFileContent = fs.readFileSync(ciFilePath, 'utf8');

  // Check for Sentry-related steps
  if (ciFileContent.includes('SENTRY_AUTH_TOKEN')) {
    console.log('✅ CI configuration includes Sentry authentication token');
  } else {
    console.log('❌ CI configuration does not include SENTRY_AUTH_TOKEN');
  }

  if (ciFileContent.includes('NEXT_PUBLIC_SENTRY_DSN')) {
    console.log('✅ CI configuration includes Sentry DSN');
  } else {
    console.log('❌ CI configuration does not include NEXT_PUBLIC_SENTRY_DSN');
  }

  // Check for explicit Sentry release creation
  if (
    ciFileContent.includes('@sentry/cli') ||
    ciFileContent.includes('sentry-cli') ||
    ciFileContent.includes('releases new')
  ) {
    console.log('✅ CI configuration includes explicit Sentry release creation');
  } else {
    console.log('❌ CI configuration does not include explicit Sentry release creation');
    console.log(
      '   This may cause sourcemaps to be uploaded without being properly associated with a release'
    );
  }

  // Check for build args in Docker build
  if (ciFileContent.includes('RELEASE_TAG_NAME=') || ciFileContent.includes('SENTRY_AUTH_TOKEN=')) {
    console.log('✅ CI passes Sentry-related build args to Docker');
  } else {
    console.log('⚠️ CI might not pass all necessary Sentry configuration to Docker build');
  }
} else {
  console.log('❌ CI configuration file not found');
}

// Recommendations
console.log('\n💡 Recommendations to fix Sentry sourcemap issues:');

console.log('1. Add explicit Sentry release creation to CI workflow:');
console.log(`   - Add before deployment:
      - name: Create Sentry Release
        run: |
          npx @sentry/cli releases new \${RELEASE_VERSION}
          npx @sentry/cli releases set-commits \${RELEASE_VERSION} --auto
          npx @sentry/cli releases finalize \${RELEASE_VERSION}
        env:
          SENTRY_AUTH_TOKEN: \${{ secrets.SENTRY_AUTH_TOKEN }}
          SENTRY_ORG: hirosystems
          SENTRY_PROJECT: explorer
          RELEASE_VERSION: \${{ steps.semantic.outputs.new_release_version || github.sha }}`);

console.log('\n2. Ensure Docker build preserves sourcemaps:');
console.log('   - Make sure your Dockerfile does not rebuild the application');
console.log('   - Ensure .next directory is copied directly into the Docker image');

console.log('\n3. Set consistent release version across environments:');
console.log('   - Add to CI workflow: NEXT_PUBLIC_SENTRY_RELEASE=${RELEASE_VERSION}');
console.log('   - Pass to Docker build: --build-arg NEXT_PUBLIC_SENTRY_RELEASE=${RELEASE_VERSION}');

console.log('\n4. Verify sourcemap uploads in CI logs:');
console.log('   - Add debug: true to Sentry webpack plugin config');
console.log('   - Check CI logs for successful sourcemap uploads');

console.log('\n✨ Analysis complete!');
