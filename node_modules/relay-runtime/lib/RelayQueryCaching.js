/**
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @providesModule RelayQueryCaching
 * 
 * @format
 */

'use strict';

var queryCachingEnabled = true;

/**
 * Methods for configuring caching of Relay queries.
 */
var RelayQueryCaching = {
  /**
   * `disable` turns off caching of queries for `getRelayQueries` and
   * `buildRQL`.
   */
  disable: function disable() {
    queryCachingEnabled = false;
  },


  /**
   * @internal
   */
  getEnabled: function getEnabled() {
    return queryCachingEnabled;
  }
};

module.exports = RelayQueryCaching;