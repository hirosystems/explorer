// jest.config.js
const nextJest = require('next/jest');

const createJestConfig = nextJest({
  // Provide the path to your Next.js app to load next.config.js and .env files in your test environment
  dir: './',
});

// Add any custom config to be passed to Jest
/** @type {import('jest').Config} */
const customJestConfig = {
  // Add more setup options before each test is run
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],

  rootDir: '',
  testEnvironment: 'jest-environment-jsdom',
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
  collectCoverageFrom: ['src/**/*.{ts,tsx}', '!src/**/*.d.ts'],
  coveragePathIgnorePatterns: ['<rootDir>/node_modules/', '<rootDir>/.next/'],
  testPathIgnorePatterns: ['<rootDir>/e2e/', '<rootDir>/node_modules/', '<rootDir>/.next/'],
  setupFiles: ['<rootDir>/setup-jest.js'],
  // transformIgnorePatterns: [
  //   // Change the default pattern to transform react-leaflet
  //   '/node_modules/(?!(react-leaflet|@react-leaflet|leaflet)/)'
  // ],
  // transform: {
  //   '^.+\\.(ts|tsx)$': 'ts-jest',
  // },
};

// createJestConfig is exported this way to ensure that next/jest can load the Next.js config which is async
module.exports = createJestConfig(customJestConfig);
