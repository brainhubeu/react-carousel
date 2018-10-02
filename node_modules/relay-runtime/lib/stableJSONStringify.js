/**
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * 
 * @providesModule stableJSONStringify
 * @format
 */

'use strict';

/**
 * Simple recursive stringifier that produces a stable JSON string suitable for
 * use as a cache key. Does not handle corner-cases such as circular references
 * or exotic types.
 */

function stableJSONStringify(obj) {
  if (Array.isArray(obj)) {
    var result = [];
    for (var ii = 0; ii < obj.length; ii++) {
      var value = obj[ii] !== undefined ? obj[ii] : null;
      result.push(stableJSONStringify(value));
    }
    return '[' + result.join(',') + ']';
  } else if (typeof obj === 'object' && obj) {
    var _result = [];
    var keys = Object.keys(obj);
    keys.sort();
    for (var _ii = 0; _ii < keys.length; _ii++) {
      var key = keys[_ii];
      var _value = stableJSONStringify(obj[key]);
      _result.push('"' + key + '":' + _value);
    }
    return '{' + _result.join(',') + '}';
  } else {
    return JSON.stringify(obj);
  }
}

module.exports = stableJSONStringify;