/**
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * 
 * @providesModule getIdentifierForSelection
 * @format
 */

'use strict';

/**
 * Generates an identifier that is unique to a given selection: the alias for
 * fields, the type for inline fragments, and a summary of the condition
 * variable and passing value for conditions.
 */
function getIdentifierForSelection(node) {
  var obj = void 0;
  switch (node.kind) {
    case 'LinkedField':
    case 'ScalarField':
      obj = {
        directives: node.directives,
        field: node.alias || node.name
      };
      break;
    case 'InlineFragment':
      obj = {
        inlineFragment: node.typeCondition.toString()
      };
      break;
    case 'Condition':
      obj = {
        condition: node.condition,
        passingValue: node.passingValue
      };
      break;
    case 'FragmentSpread':
      obj = {
        fragmentSpread: node.name,
        args: node.args
      };
      break;
    default:
      require('fbjs/lib/invariant')(false, 'getIdentifierForSelection: Unexpected kind `%s`.', node.kind);
  }
  return require('./stableJSONStringifyOSS')(obj);
}

module.exports = getIdentifierForSelection;