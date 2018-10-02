/**
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @providesModule RelayModernGraphQLTag
 * 
 * @format
 */

'use strict';

/**
 * Runtime function to correspond to the `graphql` tagged template function.
 * All calls to this function should be transformed by the plugin.
 */


// The type of a graphql`...` tagged template expression.
function graphql(strings) {
  require('fbjs/lib/invariant')(false, 'graphql: Unexpected invocation at runtime. Either the Babel transform ' + 'was not set up, or it failed to identify this call site. Make sure it ' + 'is being used verbatim as `graphql`.');
}

/**
 * Variant of the `graphql` tag that enables experimental features.
 */
graphql.experimental = function (strings) {
  require('fbjs/lib/invariant')(false, 'graphql.experimental: Unexpected invocation at runtime. Either the ' + 'Babel transform was not set up, or it failed to identify this call ' + 'site. Make sure it is being used verbatim as `graphql`.');
};

function getNode(taggedNode) {
  var fn = typeof taggedNode === 'function' ? taggedNode : taggedNode.modern;
  // Support for classic raw nodes (used in test mock)
  if (typeof fn !== 'function') {
    return taggedNode;
  }
  return fn();
}

function getFragment(taggedNode) {
  var fragment = getNode(taggedNode);
  require('fbjs/lib/invariant')(typeof fragment === 'object' && fragment !== null && fragment.kind === 'Fragment', 'RelayModernGraphQLTag: Expected a fragment, got `%s`.', JSON.stringify(fragment));
  return fragment;
}

function getOperation(taggedNode) {
  var operation = getNode(taggedNode);
  require('fbjs/lib/invariant')(typeof operation === 'object' && operation !== null && operation.kind === 'Batch', 'RelayModernGraphQLTag: Expected an operation, got `%s`.', JSON.stringify(operation));
  return operation;
}

module.exports = {
  getFragment: getFragment,
  getOperation: getOperation,
  graphql: graphql
};