'use strict';

module.exports = readdirAsync;

var maybe = require('call-me-maybe');
var Promise = require('./promise');
var DirectoryReader = require('../directory-reader');

var asyncFacade = {
  fs: require('./fs'),
  forEach: require('./for-each'),
};

/**
 * Returns the buffered output from an asynchronous {@link DirectoryReader},
 * via an error-first callback or a {@link Promise}.
 *
 * @param {string} dir
 * @param {object} [options]
 * @param {function} [callback]
 * @param {object} internalOptions
 */
function readdirAsync (dir, options, callback, internalOptions) {
  if (typeof options === 'function') {
    callback = options;
    options = undefined;
  }

  return maybe(callback, new Promise(function (resolve, reject) {
    var results = [];

    internalOptions.facade = asyncFacade;

    var reader = new DirectoryReader(dir, options, internalOptions);
    var stream = reader.stream;

    stream.on('error', function (err) {
      reject(err);
      stream.pause();
    });
    stream.on('data', function (result) {
      results.push(result);
    });
    stream.on('end', function () {
      resolve(results);
    });
  }));
}
