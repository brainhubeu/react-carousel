/**
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @providesModule ConvertToExecuteFunction
 * 
 * @format
 */

'use strict';

/**
 * Converts a FetchFunction into an ExecuteFunction for use by RelayNetwork.
 */
function convertFetch(fn) {
  return function fetch(operation, variables, cacheConfig, uploadables) {
    var result = fn(operation, variables, cacheConfig, uploadables);
    // Note: We allow FetchFunction to directly return Error to indicate
    // a failure to fetch. To avoid handling this special case throughout the
    // Relay codebase, it is explicitly handled here.
    if (result instanceof Error) {
      return new (require('./RelayObservable'))(function (sink) {
        return sink.error(result);
      });
    }
    return require('./RelayObservable').from(result);
  };
}

/**
 * Converts a SubscribeFunction into an ExecuteFunction for use by RelayNetwork.
 */
function convertSubscribe(fn) {
  return function subscribe(operation, variables, cacheConfig) {
    return require('./RelayObservable').fromLegacy(function (observer) {
      return fn(operation, variables, cacheConfig, observer);
    });
  };
}

module.exports = {
  convertFetch: convertFetch,
  convertSubscribe: convertSubscribe
};