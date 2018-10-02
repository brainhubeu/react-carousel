'use strict';

/**
 * Returns a wrapper function that ensures the given callback function is only called once.
 * Subsequent calls are ignored, unless the first argument is an Error, in which case the
 * error is thrown.
 *
 * @param {function} fn
 * @returns {function}
 */
module.exports = function (fn) {
  var fulfilled = false;

  return function once (err) {
    if (!fulfilled) {
      fulfilled = true;
      return fn.apply(this, arguments);
    }
    else if (err) {
      // The callback has already been called, but now an error has occurred
      // (most likely inside the callback function). So re-throw the error,
      // so it gets handled further up the call stack
      throw err;
    }
  };
};
