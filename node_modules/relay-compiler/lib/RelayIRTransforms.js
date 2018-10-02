/**
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @providesModule RelayIRTransforms
 * 
 * @format
 */

'use strict';

var _toConsumableArray3 = _interopRequireDefault(require('babel-runtime/helpers/toConsumableArray'));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _require = require('./GraphQLCompilerPublic'),
    FilterDirectivesTransform = _require.FilterDirectivesTransform,
    FlattenTransform = _require.FlattenTransform,
    IRTransforms = _require.IRTransforms,
    SkipRedundantNodesTransform = _require.SkipRedundantNodesTransform;

var fragmentTransforms = IRTransforms.fragmentTransforms,
    queryTransforms = IRTransforms.queryTransforms;

// Transforms applied to the code used to process a query response.

var relaySchemaExtensions = [require('./RelayConnectionTransform').SCHEMA_EXTENSION, require('./RelayRelayDirectiveTransform').SCHEMA_EXTENSION];

// Transforms applied to fragments used for reading data from a store
var relayFragmentTransforms = [function (ctx) {
  return require('./RelayConnectionTransform').transform(ctx);
}, require('./RelayViewerHandleTransform').transform, require('./RelayRelayDirectiveTransform').transform, require('./RelayFieldHandleTransform').transform].concat((0, _toConsumableArray3['default'])(fragmentTransforms));

// Transforms applied to queries/mutations/subscriptions that are used for
// fetching data from the server and parsing those responses.
var relayQueryTransforms = [function (ctx) {
  return require('./RelayConnectionTransform').transform(ctx);
}, require('./RelayViewerHandleTransform').transform, require('./RelayApplyFragmentArgumentTransform').transform].concat((0, _toConsumableArray3['default'])(queryTransforms), [require('./RelayRelayDirectiveTransform').transform, require('./RelayGenerateIDFieldTransform').transform]);

// Transforms applied to the code used to process a query response.
var relayCodegenTransforms = [function (ctx) {
  return FlattenTransform.transform(ctx, {
    flattenAbstractTypes: true,
    flattenFragmentSpreads: true
  });
}, SkipRedundantNodesTransform.transform,
// Must be put after `SkipRedundantNodesTransform` which could shuffle the order.
require('./RelayGenerateTypeNameTransform').transform, FilterDirectivesTransform.transform];

// Transforms applied before printing the query sent to the server.
var relayPrintTransforms = [function (ctx) {
  return FlattenTransform.transform(ctx, {});
}, require('./RelayGenerateTypeNameTransform').transform, require('./RelaySkipHandleFieldTransform').transform, FilterDirectivesTransform.transform];

module.exports = {
  codegenTransforms: relayCodegenTransforms,
  fragmentTransforms: relayFragmentTransforms,
  printTransforms: relayPrintTransforms,
  queryTransforms: relayQueryTransforms,
  schemaExtensions: relaySchemaExtensions
};