const { createDefaultPreset } = require('ts-jest');

const presetConfig = createDefaultPreset({
  tsconfig: {
    target: 'esnext',
    module: 'commonjs',
    esModuleInterop: true,
    skipLibCheck: true,
    outDir: './dist',
    types: ['jest'],
  },
});

/**
 * @type {import('jest').Config}
 */
const config = {
  testEnvironment: 'jsdom',
  moduleFileExtensions: ['ts', 'js', 'json'],
  testMatch: ['**/__tests__/**/*.test.ts', '**/?(*.)+(spec|test).ts'],
  ...presetConfig,
};

module.exports = config;
