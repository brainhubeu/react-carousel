/**
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @providesModule RelayCore
 * 
 * @format
 */

'use strict';

var _require = require('./RelayModernGraphQLTag'),
    getFragment = _require.getFragment,
    getOperation = _require.getOperation;

var _require2 = require('./RelayModernOperationSelector'),
    createOperationSelector = _require2.createOperationSelector;

var _require3 = require('./RelayModernSelector'),
    areEqualSelectors = _require3.areEqualSelectors,
    getDataIDsFromObject = _require3.getDataIDsFromObject,
    getSelector = _require3.getSelector,
    getSelectorList = _require3.getSelectorList,
    getSelectorsFromObject = _require3.getSelectorsFromObject,
    getVariablesFromObject = _require3.getVariablesFromObject;

function createFragmentSpecResolver(context, containerName, fragments, props, callback) {
  if (process.env.NODE_ENV !== 'production') {
    var fragmentNames = Object.keys(fragments);
    fragmentNames.forEach(function (fragmentName) {
      var propValue = props[fragmentName];
      require('fbjs/lib/warning')(propValue !== undefined, 'createFragmentSpecResolver: Expected prop `%s` to be supplied to `%s`, but ' + 'got `undefined`. Pass an explicit `null` if this is intentional.', fragmentName, containerName);
    });
  }

  return new (require('./RelayModernFragmentSpecResolver'))(context, fragments, props, callback);
}

module.exports = {
  areEqualSelectors: areEqualSelectors,
  createFragmentSpecResolver: createFragmentSpecResolver,
  createOperationSelector: createOperationSelector,
  getDataIDsFromObject: getDataIDsFromObject,
  getFragment: getFragment,
  getOperation: getOperation,
  getSelector: getSelector,
  getSelectorList: getSelectorList,
  getSelectorsFromObject: getSelectorsFromObject,
  getVariablesFromObject: getVariablesFromObject
};