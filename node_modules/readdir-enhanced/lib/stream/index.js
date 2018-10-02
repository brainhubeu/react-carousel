'use strict';

module.exports = readdirStream;

var DirectoryReader = require('../directory-reader');

var streamFacade = {
  fs: require('../async/fs'),
  forEach: require('../async/for-each'),
};

/**
 * Returns the {@link stream.Readable} of an asynchronous {@link DirectoryReader}.
 *
 * @param {string} dir
 * @param {object} [options]
 * @param {object} internalOptions
 */
function readdirStream (dir, options, internalOptions) {
  internalOptions.facade = streamFacade;

  var reader = new DirectoryReader(dir, options, internalOptions);
  return reader.stream;
}
