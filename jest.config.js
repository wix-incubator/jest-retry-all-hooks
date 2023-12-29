/** @type {import('jest').Config} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jest-environment-emit/node',
  testEnvironmentOptions: {
    eventListeners: ['.'],
  },
  testMatch: [
    '<rootDir>/src/**/*.test.{js,ts}',
    '<rootDir>/src/__tests__/**/*.{js,ts}'
  ],
};
