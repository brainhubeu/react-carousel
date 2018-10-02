/**
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @providesModule RelayRuntime
 * 
 * @format
 */

'use strict';

// As early as possible, check for the existence of the JavaScript globals which
// Relay Runtime relies upon, and produce a clear message if they do not exist.
if (process.env.NODE_ENV !== 'production') {
  if (typeof Map !== 'function' || typeof Set !== 'function' || typeof Promise !== 'function' || typeof Object.assign !== 'function') {
    throw new Error('relay-runtime requires Map, Set, Promise, and Object.assign to exist. ' + 'Use a polyfill to provide these for older browsers.');
  }
}

/**
 * The public interface to Relay Runtime.
 */
module.exports = {
  // Core API
  Environment: require('./RelayModernEnvironment'),
  Network: require('./RelayNetwork'),
  Observable: require('./RelayObservable'),
  QueryResponseCache: require('./RelayQueryResponseCache'),
  RecordSource: require('./RelayInMemoryRecordSource'),
  Store: require('./RelayMarkSweepStore'),

  areEqualSelectors: require('./RelayCore').areEqualSelectors,
  createFragmentSpecResolver: require('./RelayCore').createFragmentSpecResolver,
  createOperationSelector: require('./RelayCore').createOperationSelector,
  getDataIDsFromObject: require('./RelayCore').getDataIDsFromObject,
  getFragment: require('./RelayModernGraphQLTag').getFragment,
  getOperation: require('./RelayModernGraphQLTag').getOperation,
  getSelector: require('./RelayCore').getSelector,
  getSelectorList: require('./RelayCore').getSelectorList,
  getSelectorsFromObject: require('./RelayCore').getSelectorsFromObject,
  getVariablesFromObject: require('./RelayCore').getVariablesFromObject,
  graphql: require('./RelayModernGraphQLTag').graphql,

  // Extensions
  ConnectionHandler: require('./RelayConnectionHandler'),
  ViewerHandler: require('./RelayViewerHandler'),

  // Helpers (can be implemented via the above API)
  applyOptimisticMutation: require('./applyRelayModernOptimisticMutation'),
  commitLocalUpdate: require('./commitLocalUpdate'),
  commitMutation: require('./commitRelayModernMutation'),
  fetchQuery: require('./fetchRelayModernQuery'),
  isRelayModernEnvironment: require('./isRelayModernEnvironment'),
  requestSubscription: require('./requestRelaySubscription'),

  // Configuration interface for legacy or special uses
  ConnectionInterface: require('./RelayConnectionInterface')
};

if (process.env.NODE_ENV !== 'production') {
  var RelayRecordSourceInspector = require('./RelayRecordSourceInspector');

  // Debugging-related symbols exposed only in development
  Object.assign(module.exports, {
    RecordSourceInspector: RelayRecordSourceInspector
  });
}