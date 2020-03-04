module.exports = {
  sets: {
    desktop: {
      files: 'test/regression'
    }
  },
  baseUrl: 'http://localhost:8000',
  gridUrl: 'http://localhost:4444/wd/hub',
  compositeImage: true,
  browsers: {
    chromeXL: {
      desiredCapabilities: {
        browserName: 'chrome',
        chromeOptions: {
          args: ['--headless'],
        },
      },
      windowSize: '1300x900',
    },
  },
  plugins: {
    'html-reporter/hermione': {
      enabled: true,
      path: 'hermione-reports',
      defaultView: 'all',
    }
  }
};
