'use strict';

var once = require('./once');

module.exports = stat;

/**
 * Retrieves the {@link fs.Stats} for the given path. If the path is a symbolic link,
 * then the Stats of the symlink's target are returned instead.  If the symlink is broken,
 * then the Stats of the symlink itself are returned.
 *
 * @param {object} fs - Synchronous or Asynchronouse facade for the "fs" module
 * @param {string} path - The path to return stats for
 * @param {function} callback
 */
function stat (fs, path, callback) {
  // Make sure the callback is only called once
  callback = once(callback);

  fs.lstat(path, function (err, lstats) {
    if (err) {
      return callback(err);
    }

    if (lstats.isSymbolicLink()) {
      // Try to resolve the symlink
      fs.stat(path, function (err, stats) {   // eslint-disable-line no-shadow
        if (err) {
          // The symlink is broken, so return the stats for the link itself
          callback(null, lstats);
        }
        else {
          // Return the stats for the resolved symlink target,
          // and override the `isSymbolicLink` method to indicate that it's a symlink
          stats.isSymbolicLink = function () { return true; };
          callback(null, stats);
        }
      });
    }
    else {
      // It's not a symlink, so return the stats as-is
      callback(null, lstats);
    }
  });
}
