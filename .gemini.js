module.exports = {
  rootUrl: 'http://localhost:3000',
  gridUrl: 'http://127.0.0.1:4444/wd/hub',

  browsers: {
    chrome: {
      desiredCapabilities: {
        browserName: 'chrome',
        chromeOptions: {
          args: ["disable-gpu", "no-sandbox"],
        },
      }
    },
  }
};
