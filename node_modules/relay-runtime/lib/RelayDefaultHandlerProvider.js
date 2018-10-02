/**
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @providesModule RelayDefaultHandlerProvider
 * 
 * @format
 */

'use strict';

function RelayDefaultHandlerProvider(handle) {
  switch (handle) {
    case 'connection':
      return require('./RelayConnectionHandler');
    case 'viewer':
      return require('./RelayViewerHandler');
  }
  require('fbjs/lib/invariant')(false, 'RelayDefaultHandlerProvider: No handler provided for `%s`.', handle);
}

module.exports = RelayDefaultHandlerProvider;