/**
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @providesModule RelayNetwork
 * 
 * @format
 */

'use strict';

var _require = require('./ConvertToExecuteFunction'),
    convertFetch = _require.convertFetch,
    convertSubscribe = _require.convertSubscribe;

/**
 * Creates an implementation of the `Network` interface defined in
 * `RelayNetworkTypes` given `fetch` and `subscribe` functions.
 */
function create(fetchFn, subscribeFn) {
  // Convert to functions that returns RelayObservable.
  var observeFetch = convertFetch(fetchFn);
  var observeSubscribe = subscribeFn ? convertSubscribe(subscribeFn) : undefined;

  function execute(operation, variables, cacheConfig, uploadables) {
    if (operation.query.operation === 'subscription') {
      require('fbjs/lib/invariant')(observeSubscribe, 'RelayNetwork: This network layer does not support Subscriptions. ' + 'To use Subscriptions, provide a custom network layer.');

      require('fbjs/lib/invariant')(!uploadables, 'RelayNetwork: Cannot provide uploadables while subscribing.');
      return observeSubscribe(operation, variables, cacheConfig);
    }

    var pollInterval = cacheConfig.poll;
    if (pollInterval != null) {
      require('fbjs/lib/invariant')(!uploadables, 'RelayNetwork: Cannot provide uploadables while polling.');
      return observeFetch(operation, variables, { force: true }).poll(pollInterval);
    }

    return observeFetch(operation, variables, cacheConfig, uploadables);
  }

  return { execute: execute };
}

module.exports = { create: create };