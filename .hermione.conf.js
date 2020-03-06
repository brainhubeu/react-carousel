module.exports = {
  sets: {
    desktop: {
      files: 'test/regression'
    }
  },
  tolerance: 40,
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
      windowSize: '5200x3600',
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
