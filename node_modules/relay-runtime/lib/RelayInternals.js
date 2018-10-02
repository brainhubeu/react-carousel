/**
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @providesModule RelayInternals
 * 
 * @format
 */

'use strict';

/**
 * This module contains internal Relay modules that we expose for development
 * tools. They should be considered private APIs.
 *
 * @internal
 */
var RelayInternals = {
  NetworkLayer: require('./RelayStore').getStoreData().getNetworkLayer(),
  DefaultStoreData: require('./RelayStore').getStoreData(),
  flattenRelayQuery: require('./flattenRelayQuery'),
  printRelayQuery: require('./printRelayQuery')
};

module.exports = RelayInternals;