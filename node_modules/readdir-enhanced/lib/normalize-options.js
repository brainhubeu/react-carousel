'use strict';

var path = require('path');
var globToRegExp = require('glob-to-regexp');

module.exports = normalizeOptions;

var isWindows = /^win/.test(process.platform);

/**
 * Validates and normalizes the options argument
 *
 * @param {object} [options] - User-specified options, if any
 * @param {object} internalOptions - Internal options that aren't part of the public API
 *
 * @param {number|boolean|function} [options.deep]
 * The number of directories to recursively traverse. Any falsy value or negative number will
 * default to zero, so only the top-level contents will be returned. Set to `true` or `Infinity`
 * to traverse all subdirectories.  Or provide a function that accepts a {@link fs.Stats} object
 * and returns a truthy value if the directory's contents should be crawled.
 *
 * @param {function|string|RegExp} [options.filter]
 * A function that accepts a {@link fs.Stats} object and returns a truthy value if the data should
 * be returned.  Or a RegExp or glob string pattern, to filter by file name.
 *
 * @param {string} [options.sep]
 * The path separator to use. By default, the OS-specific separator will be used, but this can be
 * set to a specific value to ensure consistency across platforms.
 *
 * @param {string} [options.basePath]
 * The base path to prepend to each result. If empty, then all results will be relative to `dir`.
 *
 * @param {object} [internalOptions.facade]
 * Synchronous or asynchronous facades for underlying Node.js APIs
 *
 * @param {boolean} [internalOptions.emit]
 * Indicates whether the reader should emit "file", "directory", and "symlink" events
 *
 * @param {boolean} [internalOptions.stats]
 * Indicates whether the reader should emit {@link fs.Stats} objects instead of path strings
 *
 * @returns {object}
 */
function normalizeOptions (options, internalOptions) {
  if (options === null || options === undefined) {
    options = {};
  }
  else if (typeof options !== 'object') {
    throw new TypeError('options must be an object');
  }

  var recurseDepth, recurseFn, recurseRegExp, recurseGlob, deep = options.deep;
  if (deep === null || deep === undefined) {
    recurseDepth = 0;
  }
  else if (typeof deep === 'boolean') {
    recurseDepth = deep ? Infinity : 0;
  }
  else if (typeof deep === 'number') {
    if (deep < 0 || isNaN(deep)) {
      throw new Error('options.deep must be a positive number');
    }
    else if (Math.floor(deep) !== deep) {
      throw new Error('options.deep must be an integer');
    }
    else {
      recurseDepth = deep;
    }
  }
  else if (typeof deep === 'function') {
    recurseDepth = Infinity;
    recurseFn = deep;
  }
  else if (deep instanceof RegExp) {
    recurseDepth = Infinity;
    recurseRegExp = deep;
  }
  else if (typeof deep === 'string' && deep.length > 0) {
    recurseDepth = Infinity;
    recurseGlob = globToRegExp(deep, { extended: true, globstar: true });
  }
  else {
    throw new TypeError('options.deep must be a boolean, number, function, regular expression, or glob pattern');
  }

  var filterFn, filterRegExp, filterGlob, filter = options.filter;
  if (filter !== null && filter !== undefined) {
    if (typeof filter === 'function') {
      filterFn = filter;
    }
    else if (filter instanceof RegExp) {
      filterRegExp = filter;
    }
    else if (typeof filter === 'string' && filter.length > 0) {
      filterGlob = globToRegExp(filter, { extended: true, globstar: true });
    }
    else {
      throw new TypeError('options.filter must be a function, regular expression, or glob pattern');
    }
  }

  var sep = options.sep;
  if (sep === null || sep === undefined) {
    sep = path.sep;
  }
  else if (typeof sep !== 'string') {
    throw new TypeError('options.sep must be a string');
  }

  var basePath = options.basePath;
  if (basePath === null || basePath === undefined) {
    basePath = '';
  }
  else if (typeof basePath === 'string') {
    // Append a path separator to the basePath, if necessary
    if (basePath && basePath.substr(-1) !== sep) {
      basePath += sep;
    }
  }
  else {
    throw new TypeError('options.basePath must be a string');
  }

  // Convert the basePath to POSIX (forward slashes)
  // so that glob pattern matching works consistently, even on Windows
  var posixBasePath = basePath;
  if (posixBasePath && sep !== '/') {
    posixBasePath = posixBasePath.replace(new RegExp('\\' + sep, 'g'), '/');

    /* istanbul ignore if */
    if (isWindows) {
      // Convert Windows root paths (C:\) and UNCs (\\) to POSIX root paths
      posixBasePath = posixBasePath.replace(/^([a-zA-Z]\:\/|\/\/)/, '/');
    }
  }

  return {
    recurseDepth: recurseDepth,
    recurseFn: recurseFn,
    recurseRegExp: recurseRegExp,
    recurseGlob: recurseGlob,
    filterFn: filterFn,
    filterRegExp: filterRegExp,
    filterGlob: filterGlob,
    sep: sep,
    basePath: basePath,
    posixBasePath: posixBasePath,
    facade: internalOptions.facade,
    emit: !!internalOptions.emit,
    stats: !!internalOptions.stats,
  };
}
