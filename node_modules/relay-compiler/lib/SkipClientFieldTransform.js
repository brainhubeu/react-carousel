/**
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * 
 * @providesModule SkipClientFieldTransform
 * @format
 */

'use strict';

var _extends3 = _interopRequireDefault(require('babel-runtime/helpers/extends'));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _require = require('./GraphQLSchemaUtils'),
    assertTypeWithFields = _require.assertTypeWithFields,
    canHaveSelections = _require.canHaveSelections,
    getRawType = _require.getRawType;

var _require2 = require('graphql'),
    SchemaMetaFieldDef = _require2.SchemaMetaFieldDef,
    TypeMetaFieldDef = _require2.TypeMetaFieldDef,
    TypeNameMetaFieldDef = _require2.TypeNameMetaFieldDef;

/**
 * A transform that removes any selections that are not valid relative to the
 * given schema. The primary use case is for fields added via client
 * `extend type ...` definitions and for inline fragments / fragment spreads
 * whose types are added with client `type ...` type extensions.
 *
 * Given a base schema:
 *
 * ```
 * # Note: full schema definition elided for clarity
 * interface Viewer {
 *   name: String
 * }
 * type User implements Viewer {
 *   name: String
 * }
 * ```
 *
 * And a fragment:
 *
 * ```
 * fragment on Viewer {
 *   name
 *   ... on User {
 *     clientField # (1)
 *   }
 *   ... on ClientType { # (2)
 *     clientField
 *   }
 * }
 * extend type User {
 *   clientField: String
 * }
 * type ClientType implements Viewer {
 *   name: String
 *   clientField: String
 * }
 * ```
 *
 * This transform will output:
 *
 * ```
 * fragment on Viewer {
 *   name
 * }
 * ```
 *
 * Note that (1) is removed because this field does not exist on the base `User`
 * type, and (2) is removed because the `ClientType` type does not exist in the
 * base schema.
 */
function transform(context, schema) {
  return require('./GraphQLIRTransformer').transform(context, {
    FragmentSpread: visitFragmentSpread,
    InlineFragment: visitInlineFragment,
    LinkedField: visitField,
    ScalarField: visitField
  }, buildState.bind(null, schema));
}

/**
 * @internal
 *
 * Build the initial state, returning null for fragments whose type is not
 * defined in the original schema.
 */
function buildState(schema, node) {
  var parentType = void 0;
  if (node.kind === 'Fragment') {
    parentType = schema.getType(node.type.name);
  } else {
    switch (node.operation) {
      case 'query':
        parentType = schema.getQueryType();
        break;
      case 'mutation':
        parentType = schema.getMutationType();
        break;
      case 'subscription':
        parentType = schema.getSubscriptionType();
        break;
    }
  }
  if (parentType) {
    return {
      schema: schema,
      parentType: parentType
    };
  } else {
    return null;
  }
}

/**
 * @internal
 *
 * Skip fields that were added via `extend type ...`.
 */
function visitField(field, state) {
  if (
  // Field is defined in the original parent type definition:
  canHaveSelections(state.parentType) && assertTypeWithFields(state.parentType).getFields()[field.name] ||
  // Allow metadata fields and fields defined on classic "fat" interfaces
  field.name === SchemaMetaFieldDef.name || field.name === TypeMetaFieldDef.name || field.name === TypeNameMetaFieldDef.name || field.directives.some(function (_ref) {
    var name = _ref.name;
    return name === 'fixme_fat_interface';
  })) {
    var rawType = getRawType(field.type);
    var type = state.schema.getType(rawType.name);
    require('fbjs/lib/invariant')(type, 'SkipClientFieldTransform: Expected type `%s` to be defined in ' + 'the original schema.', rawType.name);
    return this.traverse(field, (0, _extends3['default'])({}, state, {
      parentType: type
    }));
  }
  return null;
}

/**
 * @internal
 *
 * Skip fragment spreads where the referenced fragment is not defined in the
 * original schema.
 */
function visitFragmentSpread(spread, state) {
  var context = this.getContext();
  var fragment = context.get(spread.name);
  require('fbjs/lib/invariant')(fragment && fragment.kind === 'Fragment', 'SkipClientFieldTransform: Expected a fragment named `%s` to be defined.', spread.name);
  if (state.schema.getType(fragment.type.name)) {
    return this.traverse(spread, state);
  }
  return null;
}

/**
 * @internal
 *
 * Skip inline fragments where the type is not in the schema.
 */
function visitInlineFragment(fragment, state) {
  var type = state.schema.getType(fragment.typeCondition.name);
  if (type) {
    return this.traverse(fragment, (0, _extends3['default'])({}, state, {
      parentType: type
    }));
  }
  return null;
}

module.exports = { transform: transform };