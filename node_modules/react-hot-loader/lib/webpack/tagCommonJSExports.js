'use strict';

/* global __FILENAME__ */

;(function register() {
  // eslint-disable-line no-extra-semi
  /* react-hot-loader/webpack */
  if (process.env.NODE_ENV !== 'production') {
    if (typeof __REACT_HOT_LOADER__ === 'undefined') {
      return;
    }

    /* eslint-disable camelcase, no-undef */
    var webpackExports = typeof __webpack_exports__ !== 'undefined' ? __webpack_exports__ : module.exports;
    /* eslint-enable camelcase, no-undef */

    if (typeof webpackExports === 'function') {
      __REACT_HOT_LOADER__.register(webpackExports, 'module.exports', __FILENAME__);
      return;
    }

    /* eslint-disable no-restricted-syntax */
    for (var key in webpackExports) {
      /* eslint-enable no-restricted-syntax */
      if (!Object.prototype.hasOwnProperty.call(webpackExports, key)) {
        continue;
      }

      var namedExport = void 0;
      try {
        namedExport = webpackExports[key];
      } catch (err) {
        continue;
      }

      __REACT_HOT_LOADER__.register(namedExport, key, __FILENAME__);
    }
  }
})();