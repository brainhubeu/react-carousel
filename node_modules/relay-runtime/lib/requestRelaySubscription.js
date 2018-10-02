/**
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @providesModule requestRelaySubscription
 * 
 * @format
 */

'use strict';

function requestRelaySubscription(environment, config) {
  var _environment$unstable = environment.unstable_internal,
      createOperationSelector = _environment$unstable.createOperationSelector,
      getOperation = _environment$unstable.getOperation;

  var subscription = getOperation(config.subscription);
  var configs = config.configs,
      onCompleted = config.onCompleted,
      onError = config.onError,
      onNext = config.onNext,
      variables = config.variables;

  var operation = createOperationSelector(subscription, variables);

  require('fbjs/lib/warning')(!(config.updater && configs), 'requestRelaySubscription: Expected only one of `updater` and `configs` to be provided');

  var _ref = configs ? require('./setRelayModernMutationConfigs')(configs, subscription, null /* optimisticUpdater */
  , config.updater) : config,
      updater = _ref.updater;

  return environment.execute({
    operation: operation,
    updater: updater,
    cacheConfig: { force: true }
  }).map(function () {
    return environment.lookup(operation.fragment).data;
  }).subscribeLegacy({
    onNext: onNext,
    onError: onError,
    onCompleted: onCompleted
  });
}

module.exports = requestRelaySubscription;