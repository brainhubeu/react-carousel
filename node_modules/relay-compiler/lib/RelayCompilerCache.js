/**
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @providesModule RelayCompilerCache
 * 
 * @format
 */

'use strict';

var _classCallCheck3 = _interopRequireDefault(require('babel-runtime/helpers/classCallCheck'));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

/**
 * A file backed cache. Values are JSON encoded on disk, so only JSON
 * serializable values should be used.
 */
var RelayCompilerCache = function () {

  /**
   * @param name         Human readable identifier for the cache
   * @param cacheBreaker This should be changed in order to invalidate existing
   *                     caches.
   */
  function RelayCompilerCache(name, cacheBreaker) {
    (0, _classCallCheck3['default'])(this, RelayCompilerCache);

    // Include username in the cache dir to avoid issues with directories being
    // owned by a different user.
    var username = require('os').userInfo().username;
    var cacheID = require('crypto').createHash('md5').update(cacheBreaker).update(username).digest('hex');
    this._dir = require('path').join(require('os').tmpdir(), name + '-' + cacheID);
    if (!require('fs').existsSync(this._dir)) {
      require('fs').mkdirSync(this._dir);
    }
  }

  RelayCompilerCache.prototype.getOrCompute = function getOrCompute(key, compute) {
    var cacheFile = require('path').join(this._dir, key);
    if (require('fs').existsSync(cacheFile)) {
      return JSON.parse(require('fs').readFileSync(cacheFile, 'utf8'));
    }
    var value = compute();
    require('fs').writeFileSync(cacheFile, JSON.stringify(value), 'utf8');
    return value;
  };

  return RelayCompilerCache;
}();

module.exports = RelayCompilerCache;