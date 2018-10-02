/**
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * 
 * @providesModule getRelayHandleKey
 * @format
 */

'use strict';

var _require = require('./RelayDefaultHandleKey'),
    DEFAULT_HANDLE_KEY = _require.DEFAULT_HANDLE_KEY;

/**
 * @internal
 *
 * Helper to create a unique name for a handle field based on the handle name, handle key and
 * source field.
 */


function getRelayHandleKey(handleName, key, fieldName) {
  if (key && key !== DEFAULT_HANDLE_KEY) {
    return '__' + key + '_' + handleName;
  }

  require('fbjs/lib/invariant')(fieldName != null, 'getRelayHandleKey: Expected either `fieldName` or `key` in `handle` to be provided');
  return '__' + fieldName + '_' + handleName;
}

module.exports = getRelayHandleKey;