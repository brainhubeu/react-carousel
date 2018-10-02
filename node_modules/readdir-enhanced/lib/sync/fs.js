'use strict';

var fs = require('fs');
var once = require('../once');

/**
 * A facade around {@link fs.readdirSync} that allows it to be called
 * the same way as {@link fs.readdir}.
 *
 * @param {string} dir
 * @param {function} callback
 */
exports.readdir = function (dir, callback) {
  // Make sure the callback is only called once
  callback = once(callback);

  try {
    var items = fs.readdirSync(dir);
    callback(null, items);
  }
  catch (err) {
    callback(err);
  }
};

/**
 * A facade around {@link fs.statSync} that allows it to be called
 * the same way as {@link fs.stat}.
 *
 * @param {string} path
 * @param {function} callback
 */
exports.stat = function (path, callback) {
  // Make sure the callback is only called once
  callback = once(callback);

  try {
    var stats = fs.statSync(path);
    callback(null, stats);
  }
  catch (err) {
    callback(err);
  }
};

/**
 * A facade around {@link fs.lstatSync} that allows it to be called
 * the same way as {@link fs.lstat}.
 *
 * @param {string} path
 * @param {function} callback
 */
exports.lstat = function (path, callback) {
  // Make sure the callback is only called once
  callback = once(callback);

  try {
    var stats = fs.lstatSync(path);
    callback(null, stats);
  }
  catch (err) {
    callback(err);
  }
};
