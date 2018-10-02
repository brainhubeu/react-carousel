/**
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * 
 * @providesModule RelayGenerateIDFieldTransform
 * @format
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
    assertAbstractType = _require3.assertAbstractType,
    assertCompositeType = _require3.assertCompositeType,
    assertLeafType = _require3.assertLeafType;

var canHaveSelections = SchemaUtils.canHaveSelections,
    getRawType = SchemaUtils.getRawType,
    hasID = SchemaUtils.hasID,
    implementsInterface = SchemaUtils.implementsInterface,
    isAbstractType = SchemaUtils.isAbstractType,
    mayImplement = SchemaUtils.mayImplement;


var ID = 'id';
var ID_TYPE = 'ID';
var NODE_TYPE = 'Node';

/**
 * A transform that adds "requisite" fields to all nodes:
 * - Adds an `id` selection on any `LinkedField` of type that implements `Node`
 *   or has an id field but where there is no unaliased `id` selection.
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
    selections: selections
  });
}

function transformField(context, field) {
  var transformedNode = transformNode(context, field);
  var selections = [].concat((0, _toConsumableArray3['default'])(transformedNode.selections));
  var idSelections = generateIDSelections(context, field, field.type);
  if (idSelections) {
    selections.push.apply(selections, (0, _toConsumableArray3['default'])(idSelections));
  }

  return (0, _extends3['default'])({}, transformedNode, {
    selections: selections
  });
}

/**
 * @internal
 *
 * Returns an array of zero or more selections to fetch `id` depending on the
 * type of the given field:
 * - If the field already has an unaliased `id` field, do nothing
 * - If the field type has an `id` subfield, return an `id` selection
 * - If the field type is abstract, then generate a `... on Node { id }`
 *   fragment if *any* concrete type implements Node. Then generate a
 *   `... on PossibleType { id }` for every concrete type that does *not*
 *   implement `Node`
 */
function generateIDSelections(context, field, type) {
  if (hasUnaliasedSelection(field, ID)) {
    return null;
  }
  var unmodifiedType = assertCompositeType(getRawType(type));
  var generatedSelections = [];
  // Object or  Interface type that has `id` field
  if (canHaveSelections(unmodifiedType) && hasID(context.schema, unmodifiedType)) {
    var idType = assertLeafType(context.schema.getType(ID_TYPE));
    generatedSelections.push({
      kind: 'ScalarField',
      alias: null,
      args: [],
      directives: [],
      handles: null,
      metadata: null,
      name: ID,
      type: idType
    });
  } else if (isAbstractType(unmodifiedType)) {
    // Union or interface: concrete types may implement `Node` or have an `id`
    // field
    var _idType = assertLeafType(context.schema.getType(ID_TYPE));
    if (mayImplement(context.schema, unmodifiedType, NODE_TYPE)) {
      var nodeType = assertCompositeType(context.schema.getType(NODE_TYPE));
      generatedSelections.push(buildIdFragment(nodeType, _idType));
    }
    var abstractType = assertAbstractType(unmodifiedType);
    context.schema.getPossibleTypes(abstractType).forEach(function (possibleType) {
      if (!implementsInterface(possibleType, NODE_TYPE) && hasID(context.schema, possibleType)) {
        generatedSelections.push(buildIdFragment(possibleType, _idType));
      }
    });
  }
  return generatedSelections;
}

/**
 * @internal
 */
function buildIdFragment(fragmentType, idType) {
  return {
    kind: 'InlineFragment',
    directives: [],
    metadata: null,
    typeCondition: fragmentType,
    selections: [{
      kind: 'ScalarField',
      alias: null,
      args: [],
      directives: [],
      handles: null,
      metadata: null,
      name: ID,
      type: idType
    }]
  };
}

module.exports = { transform: transform };