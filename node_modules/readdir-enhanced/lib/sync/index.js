'use strict';

module.exports = readdirSync;

var DirectoryReader = require('../directory-reader');

var syncFacade = {
  fs: require('./fs'),
  forEach: require('./for-each'),
};

/**
 * Returns the buffered output from a synchronous {@link DirectoryReader}.
 *
 * @param {string} dir
 * @param {object} [options]
 * @param {object} internalOptions
 */
function readdirSync (dir, options, internalOptions) {
  internalOptions.facade = syncFacade;

  var reader = new DirectoryReader(dir, options, internalOptions);
  var stream = reader.stream;

  var results = [];
  var data = stream.read();
  while (data !== null) {
    results.push(data);
    data = stream.read();
  }

  return results;
}
