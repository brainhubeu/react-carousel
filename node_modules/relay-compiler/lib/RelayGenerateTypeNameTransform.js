/**
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * 
 * @providesModule RelayGenerateTypeNameTransform
 */

'use strict';

var _extends3 = _interopRequireDefault(require('babel-runtime/helpers/extends'));

var _toConsumableArray3 = _interopRequireDefault(require('babel-runtime/helpers/toConsumableArray'));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _require = require('./GraphQLCompilerPublic'),
    CompilerContext = _require.CompilerContext,
    SchemaUtils = _require.SchemaUtils;

var _require2 = require('./RelayTransformUtils'),
    hasUnaliasedSelection = _require2.hasUnaliasedSelection;

var _require3 = require('graphql'),
    assertLeafType = _require3.assertLeafType;

var isAbstractType = SchemaUtils.isAbstractType;


var TYPENAME_KEY = '__typename';
var STRING_TYPE = 'String';

/**
 * A transform that adds `__typename` field on any `LinkedField` of a union/interface type where
 * there is no unaliased `__typename` selection. The `__typename` field is guaranteed to be put in
 * the first place of the selections.
 */

function transform(context) {
  var documents = context.documents();
  return documents.reduce(function (ctx, node) {
    var transformedNode = transformNode(context, node);
    return ctx.add(transformedNode);
  }, new CompilerContext(context.schema));
}

function transformNode(context, node) {
  var selections = node.selections.map(function (selection) {
    if (selection.kind === 'LinkedField') {
      return transformField(context, selection);
    } else if (selection.kind === 'InlineFragment' || selection.kind === 'Condition') {
      return transformNode(context, selection);
    } else {
      return selection;
    }
  });
  return (0, _extends3['default'])({}, node, {
    selections: sortSelections(selections)
  });
}

function transformField(context, field) {
  var transformedNode = transformNode(context, field);
  var type = field.type;

  var generatedSelections = [].concat((0, _toConsumableArray3['default'])(transformedNode.selections));
  if (isAbstractType(type) && !hasUnaliasedSelection(field, TYPENAME_KEY)) {
    var stringType = assertLeafType(context.schema.getType(STRING_TYPE));
    generatedSelections.push({
      kind: 'ScalarField',
      alias: null,
      args: [],
      directives: [],
      handles: null,
      metadata: null,
      name: TYPENAME_KEY,
      type: stringType
    });
  }
  var selections = sortSelections(generatedSelections);
  return (0, _extends3['default'])({}, transformedNode, {
    selections: selections
  });
}

/**
 * @internal
 *
 * For interoperability with classic systems, sort `__typename` first.
 */
function sortSelections(selections) {
  return [].concat((0, _toConsumableArray3['default'])(selections)).sort(function (a, b) {
    return a.kind === 'ScalarField' && a.name === TYPENAME_KEY ? -1 : b.kind === 'ScalarField' && b.name === TYPENAME_KEY ? 1 : 0;
  });
}

module.exports = { transform: transform };