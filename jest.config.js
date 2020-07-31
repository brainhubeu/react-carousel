module.exports = {
  testEnvironment: 'jsdom',
  testMatch: ['<rootDir>/test/unit/**.test.js'],
  moduleNameMapper: { '\\.(css|scss)$': '<rootDir>/test/unit/__mocks__/styleMock.js' },
  setupFilesAfterEnv: [
    '<rootDir>/jest.setup.js',
  ],
  coverageReporters: [
    'text',
    ['lcov', {
      projectRoot: './',
    }]],
};
