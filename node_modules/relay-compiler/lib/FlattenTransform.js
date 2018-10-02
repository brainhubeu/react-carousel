/**
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @providesModule FlattenTransform
 * @format
 */

'use strict';

var _extends3 = _interopRequireDefault(require('babel-runtime/helpers/extends'));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _require = require('./GraphQLCompilerUserError'),
    createUserError = _require.createUserError;

var _require2 = require('./GraphQLIRPrinter'),
    printField = _require2.printField;

var _require3 = require('graphql'),
    GraphQLNonNull = _require3.GraphQLNonNull,
    GraphQLList = _require3.GraphQLList;

var RELAY = 'relay';

var getRawType = require('./GraphQLSchemaUtils').getRawType,
    isAbstractType = require('./GraphQLSchemaUtils').isAbstractType;

/**
 * Transform that flattens inline fragments, fragment spreads, and conditionals.
 *
 * Inline fragments are inlined (replaced with their selections) when:
 * - The fragment type matches the type of its parent.
 * - The fragment has an abstract type and the `flattenAbstractTypes` option has
 *   been set.
 * - The 'flattenInlineFragments' option has been set.
 *
 * Fragment spreads are inlined when the `flattenFragmentSpreads` option is set.
 * In this case the fragment is converted to an inline fragment, which is
 * then inlined according to the rules above.
 *
 * Conditions are inlined when the `flattenConditions` option is set.
 * In this case the condition is converted to an inline fragment, which is then
 * inlined according to the rules above.
 */
function transform(context, options) {
  var flattenOptions = {
    flattenAbstractTypes: !!(options && options.flattenAbstractTypes),
    flattenFragmentSpreads: !!(options && options.flattenFragmentSpreads),
    flattenInlineFragments: !!(options && options.flattenInlineFragments),
    flattenConditions: !!(options && options.flattenConditions)
  };
  return context.documents().reduce(function (ctx, node) {
    if (flattenOptions.flattenFragmentSpreads && node.kind === 'Fragment') {
      return ctx;
    }
    var state = {
      kind: 'FlattenState',
      node: node,
      selections: {},
      type: node.type
    };
    visitNode(context, flattenOptions, state, node);
    var flattenedNode = buildNode(state);
    require('fbjs/lib/invariant')(flattenedNode.kind === 'Root' || flattenedNode.kind === 'Fragment', 'FlattenTransform: Expected Root `%s` to flatten back to a Root ' + ' or Fragment.', node.name);
    return ctx.add(flattenedNode);
  }, new (require('./GraphQLCompilerContext'))(context.schema));
}

function buildNode(state) {
  return (0, _extends3['default'])({}, state.node, {
    selections: Object.keys(state.selections).map(function (key) {
      var selectionState = state.selections[key];
      if (selectionState.kind === 'FragmentSpread' || selectionState.kind === 'ScalarField') {
        return selectionState;
      } else if (selectionState.kind === 'FlattenState') {
        var _node = buildNode(selectionState);
        require('fbjs/lib/invariant')(_node.kind !== 'Root' && _node.kind !== 'Fragment', 'FlattenTransform: got a `%s`, expected a selection.', _node.kind);
        return _node;
      } else {
        require('fbjs/lib/invariant')(false, 'FlattenTransform: Unexpected kind `%s`.', selectionState.kind);
      }
    })
  });
}

/**
 * @internal
 */
function visitNode(context, options, state, node) {
  node.selections.forEach(function (selection) {
    if (selection.kind === 'FragmentSpread' && shouldFlattenFragmentSpread(selection, options)) {
      require('fbjs/lib/invariant')(!selection.args.length, 'FlattenTransform: Cannot flatten fragment spread `%s` with ' + 'arguments. Use the `ApplyFragmentArgumentTransform` before flattening', selection.name);
      var fragment = context.get(selection.name);
      require('fbjs/lib/invariant')(fragment && fragment.kind === 'Fragment', 'FlattenTransform: Unknown fragment `%s`.', selection.name);
      // Replace the spread with an inline fragment containing the fragment's
      // contents
      selection = {
        directives: selection.directives,
        kind: 'InlineFragment',
        metadata: {},
        selections: fragment.selections,
        typeCondition: fragment.type
      };
    }
    if (selection.kind === 'Condition' && options.flattenConditions) {
      selection = {
        directives: [],
        kind: 'InlineFragment',
        metadata: {},
        selections: selection.selections,
        typeCondition: state.type
      };
    }
    if (selection.kind === 'InlineFragment' && shouldFlattenInlineFragment(selection, options, state)) {
      visitNode(context, options, state, selection);
      return;
    }
    var nodeIdentifier = require('./getIdentifierForSelection')(selection);
    if (selection.kind === 'Condition' || selection.kind === 'InlineFragment') {
      var selectionState = state.selections[nodeIdentifier];
      if (!selectionState) {
        selectionState = state.selections[nodeIdentifier] = {
          kind: 'FlattenState',
          node: selection,
          selections: {},
          type: selection.kind === 'InlineFragment' ? selection.typeCondition : state.type
        };
      }
      visitNode(context, options, selectionState, selection);
    } else if (selection.kind === 'FragmentSpread') {
      state.selections[nodeIdentifier] = selection;
    } else if (selection.kind === 'LinkedField') {
      var _selectionState = state.selections[nodeIdentifier];
      if (!_selectionState) {
        _selectionState = state.selections[nodeIdentifier] = {
          kind: 'FlattenState',
          node: selection,
          selections: {},
          type: selection.type
        };
      } else {
        require('fbjs/lib/invariant')(_selectionState.node.kind === 'LinkedField' || _selectionState.node.kind === 'ScalarField', 'FlattenTransform: Expected a Field, got %s.', _selectionState.node.kind);
        var prevField = _selectionState.node;
        assertUniqueArgsForAlias(selection, prevField);
        // merge fields
        var handles = dedupe(prevField.handles, selection.handles);
        _selectionState.node = (0, _extends3['default'])({}, selection, {
          handles: handles
        });
      }
      visitNode(context, options, _selectionState, selection);
    } else if (selection.kind === 'ScalarField') {
      var field = selection;
      var prevSelection = state.selections[nodeIdentifier];
      if (prevSelection && (prevSelection.kind === 'ScalarField' || prevSelection.kind === 'LinkedField')) {
        var _prevField = prevSelection;
        assertUniqueArgsForAlias(field, _prevField);
        if (field.handles || _prevField.handles) {
          var _handles = dedupe(field.handles, _prevField.handles);
          field = (0, _extends3['default'])({}, selection, {
            handles: _handles
          });
        }
      }
      state.selections[nodeIdentifier] = field;
    } else {
      require('fbjs/lib/invariant')(false, 'FlattenTransform: Unknown kind `%s`.', selection.kind);
    }
  });
}

/**
 * @internal
 */
function assertUniqueArgsForAlias(field, otherField) {
  if (!areEqualFields(field, otherField)) {
    throw createUserError('Expected all fields on the same parent with the name or alias `%s` ' + 'to have the same name and arguments. Got `%s` and `%s`.', field.alias || field.name, printField(field), printField(otherField));
  }
}

/**
 * @internal
 */
function shouldFlattenFragmentSpread(fragment, options) {
  if (options.flattenFragmentSpreads) {
    return true;
  }
  var relayDirective = fragment.directives.find(function (_ref) {
    var name = _ref.name;
    return name === RELAY;
  });
  if (!relayDirective) {
    return false;
  }

  var _getLiteralArgumentVa = require('./getLiteralArgumentValues')(relayDirective.args),
      mask = _getLiteralArgumentVa.mask;

  return mask === false;
}

/**
 * @internal
 */
function shouldFlattenInlineFragment(fragment, options, state) {
  return !!(isEquivalentType(fragment.typeCondition, state.type) || options.flattenInlineFragments || options.flattenAbstractTypes && isAbstractType(getRawType(fragment.typeCondition)));
}

/**
 * @internal
 *
 * Verify that two fields are equal in all properties other than their
 * selections.
 */
function areEqualFields(thisField, thatField) {
  return thisField.kind === thatField.kind && thisField.name === thatField.name && thisField.alias === thatField.alias && require('./areEqualOSS')(thisField.args, thatField.args);
}

/**
 * @internal
 */
function dedupe() {
  var uniqueItems = new Map();

  for (var _len = arguments.length, arrays = Array(_len), _key = 0; _key < _len; _key++) {
    arrays[_key] = arguments[_key];
  }

  arrays.forEach(function (items) {
    items && items.forEach(function (item) {
      uniqueItems.set(require('./stableJSONStringifyOSS')(item), item);
    });
  });
  return Array.from(uniqueItems.values());
}

/**
 *
 * @internal
 * Determine if a type is the same type (same name and class) as another type.
 * Needed if we're comparing IRs created at different times: we don't yet have
 * an IR schema, so the type we assign to an IR field could be !== than
 * what we assign to it after adding some schema definitions or extensions.
 */
function isEquivalentType(typeA, typeB) {
  // Easy short-circuit: equal types are equal.
  if (typeA === typeB) {
    return true;
  }

  // If either type is non-null, the other must also be non-null.
  if (typeA instanceof GraphQLNonNull && typeB instanceof GraphQLNonNull) {
    return isEquivalentType(typeA.ofType, typeB.ofType);
  }

  // If either type is a list, the other must also be a list.
  if (typeA instanceof GraphQLList && typeB instanceof GraphQLList) {
    return isEquivalentType(typeA.ofType, typeB.ofType);
  }

  // Make sure the two types are of the same class
  if (typeA.constructor.name === typeB.constructor.name) {
    var rawA = getRawType(typeA);
    var rawB = getRawType(typeB);

    // And they must have the exact same name
    return rawA.name === rawB.name;
  }

  // Otherwise the types are not equal.
  return false;
}

module.exports = {
  transform: transform
};