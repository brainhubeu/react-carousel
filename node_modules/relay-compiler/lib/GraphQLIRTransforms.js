/**
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @providesModule GraphQLIRTransforms
 * 
 * @format
 */

'use strict';

// Transforms applied to fragments used for reading data from a store
var FRAGMENT_TRANSFORMS = [function (ctx) {
  return require('./FlattenTransform').transform(ctx, {
    flattenAbstractTypes: true
  });
}, require('./SkipRedundantNodesTransform').transform];

// Transforms applied to queries/mutations/subscriptions that are used for
// fetching data from the server and parsing those responses.
var QUERY_TRANSFORMS = [require('./SkipClientFieldTransform').transform, require('./SkipUnreachableNodeTransform').transform];

// Transforms applied to the code used to process a query response.
var CODEGEN_TRANSFORMS = [function (ctx) {
  return require('./FlattenTransform').transform(ctx, {
    flattenAbstractTypes: true,
    flattenFragmentSpreads: true
  });
}, require('./SkipRedundantNodesTransform').transform, require('./FilterDirectivesTransform').transform];

module.exports = {
  codegenTransforms: CODEGEN_TRANSFORMS,
  fragmentTransforms: FRAGMENT_TRANSFORMS,
  queryTransforms: QUERY_TRANSFORMS
};