'use strict';

var fs = require('fs');
var once = require('../once');

/**
 * A safe wrapper around {@link fs.readdir}
 *
 * @param {string} dir
 * @param {function} callback
 */
exports.readdir = function (dir, callback) {
  // Make sure the callback is only called once
  callback = once(callback);

  try {
    fs.readdir(dir, callback);
  }
  catch (err) {
    callback(err);
  }
};

/**
 * A safe wrapper around {@link fs.stat}
 *
 * @param {string} path
 * @param {function} callback
 */
exports.stat = function (path, callback) {
  // Make sure the callback is only called once
  callback = once(callback);

  try {
    fs.stat(path, callback);
  }
  catch (err) {
    callback(err);
  }
};

/**
 * A safe wrapper around {@link fs.lstat}
 *
 * @param {string} path
 * @param {function} callback
 */
exports.lstat = function (path, callback) {
  // Make sure the callback is only called once
  callback = once(callback);

  try {
    fs.lstat(path, callback);
  }
  catch (err) {
    callback(err);
  }
};
