module.exports = {
  testEnvironment: 'jsdom',
  testMatch: ['<rootDir>/test/**/**.test.js'],
  moduleNameMapper: {
    '\\.(css|scss)$': '<rootDir>/test/__mocks__/styleMock.js',
  },
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
};
