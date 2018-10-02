/**
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @providesModule RelayQueryResponseCache
 * 
 * @format
 */

'use strict';

var _classCallCheck3 = _interopRequireDefault(require('babel-runtime/helpers/classCallCheck'));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

/**
 * A cache for storing query responses, featuring:
 * - `get` with TTL
 * - cache size limiting, with least-recently *updated* entries purged first
 */
var RelayQueryResponseCache = function () {
  function RelayQueryResponseCache(_ref) {
    var size = _ref.size,
        ttl = _ref.ttl;
    (0, _classCallCheck3['default'])(this, RelayQueryResponseCache);

    require('fbjs/lib/invariant')(size > 0, 'RelayQueryResponseCache: Expected the max cache size to be > 0, got ' + '`%s`.', size);
    require('fbjs/lib/invariant')(ttl > 0, 'RelayQueryResponseCache: Expected the max ttl to be > 0, got `%s`.', ttl);
    this._responses = new Map();
    this._size = size;
    this._ttl = ttl;
  }

  RelayQueryResponseCache.prototype.clear = function clear() {
    this._responses.clear();
  };

  RelayQueryResponseCache.prototype.get = function get(queryID, variables) {
    var _this = this;

    var cacheKey = getCacheKey(queryID, variables);
    this._responses.forEach(function (response, key) {
      if (!isCurrent(response.fetchTime, _this._ttl)) {
        _this._responses['delete'](key);
      }
    });
    var response = this._responses.get(cacheKey);
    return response != null ? response.payload : null;
  };

  RelayQueryResponseCache.prototype.set = function set(queryID, variables, payload) {
    var fetchTime = Date.now();
    var cacheKey = getCacheKey(queryID, variables);
    this._responses['delete'](cacheKey); // deletion resets key ordering
    this._responses.set(cacheKey, {
      fetchTime: fetchTime,
      payload: payload
    });
    // Purge least-recently updated key when max size reached
    if (this._responses.size > this._size) {
      var firstKey = this._responses.keys().next();
      if (!firstKey.done) {
        this._responses['delete'](firstKey.value);
      }
    }
  };

  return RelayQueryResponseCache;
}();

function getCacheKey(queryID, variables) {
  return require('./stableJSONStringify')({ queryID: queryID, variables: variables });
}

/**
 * Determine whether a response fetched at `fetchTime` is still valid given
 * some `ttl`.
 */
function isCurrent(fetchTime, ttl) {
  return fetchTime + ttl >= Date.now();
}

module.exports = RelayQueryResponseCache;