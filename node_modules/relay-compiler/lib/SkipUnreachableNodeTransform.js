/**
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @providesModule SkipUnreachableNodeTransform
 * 
 * @format
 */

'use strict';

var _extends3 = _interopRequireDefault(require('babel-runtime/helpers/extends'));

var _toConsumableArray3 = _interopRequireDefault(require('babel-runtime/helpers/toConsumableArray'));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var FAIL = 'fail';
var PASS = 'pass';
var VARIABLE = 'variable';

/**
 * A tranform that removes unreachable IR nodes from all documents in a corpus.
 * The following nodes are removed:
 * - Any node with `@include(if: false)`
 * - Any node with `@skip(if: true)`
 * - Any node with empty `selections`
 */
function transform(context) {
  var documents = context.documents();
  var fragments = new Map();
  var nextContext = documents.reduce(function (ctx, node) {
    if (node.kind === 'Root') {
      var transformedNode = transformNode(context, fragments, node);
      if (transformedNode) {
        return ctx.add(transformedNode);
      }
    }
    return ctx;
  }, new (require('./GraphQLCompilerContext'))(context.schema));
  return Array.from(fragments.values()).reduce(function (ctx, fragment) {
    return fragment ? ctx.add(fragment) : ctx;
  }, nextContext);
}

function transformNode(context, fragments, node) {
  var queue = [].concat((0, _toConsumableArray3['default'])(node.selections));
  var selections = void 0;
  while (queue.length) {
    var selection = queue.shift();
    var nextSelection = void 0;
    if (selection.kind === 'Condition') {
      var match = testCondition(selection);
      if (match === PASS) {
        queue.unshift.apply(queue, (0, _toConsumableArray3['default'])(selection.selections));
      } else if (match === VARIABLE) {
        nextSelection = transformNode(context, fragments, selection);
      }
    } else if (selection.kind === 'FragmentSpread') {
      // Skip fragment spreads if the referenced fragment is empty
      if (!fragments.has(selection.name)) {
        var fragment = context.get(selection.name);
        require('fbjs/lib/invariant')(fragment && fragment.kind === 'Fragment', 'SkipUnreachableNodeTransform: Found a reference to undefined ' + 'fragment `%s`.', selection.name);
        var nextFragment = transformNode(context, fragments, fragment);
        fragments.set(selection.name, nextFragment);
      }
      if (fragments.get(selection.name)) {
        nextSelection = selection;
      }
    } else if (selection.kind === 'LinkedField' || selection.kind === 'InlineFragment') {
      nextSelection = transformNode(context, fragments, selection);
    } else {
      // scalar field
      nextSelection = selection;
    }
    if (nextSelection) {
      selections = selections || [];
      selections.push(nextSelection);
    }
  }
  if (selections) {
    return (0, _extends3['default'])({}, node, {
      selections: selections
    });
  }
  return null;
}

/**
 * Determines whether a condition statically passes/fails or is unknown
 * (variable).
 */
function testCondition(condition) {
  if (condition.condition.kind === 'Variable') {
    return VARIABLE;
  }
  return condition.condition.value === condition.passingValue ? PASS : FAIL;
}

module.exports = { transform: transform };