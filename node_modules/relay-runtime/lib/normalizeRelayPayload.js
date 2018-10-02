/**
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @providesModule normalizeRelayPayload
 * 
 * @format
 */

'use strict';

var _require = require('./RelayStoreUtils'),
    ROOT_ID = _require.ROOT_ID,
    ROOT_TYPE = _require.ROOT_TYPE;

function normalizeRelayPayload(selector, payload, errors) {
  var options = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : { handleStrippedNulls: false };

  var source = new (require('./RelayInMemoryRecordSource'))();
  source.set(ROOT_ID, require('./RelayModernRecord').create(ROOT_ID, ROOT_TYPE));
  var fieldPayloads = require('./RelayResponseNormalizer').normalize(source, selector, payload, options);
  return {
    errors: errors,
    fieldPayloads: fieldPayloads,
    source: source
  };
}

module.exports = normalizeRelayPayload;