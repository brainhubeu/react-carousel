/**
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * 
 * @providesModule RelayConcreteVariables
 * @format
 */

'use strict';

var _extends3 = _interopRequireDefault(require('babel-runtime/helpers/extends'));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

/**
 * Determines the variables that are in scope for a fragment given the variables
 * in scope at the root query as well as any arguments applied at the fragment
 * spread via `@arguments`.
 *
 * Note that this is analagous to determining function arguments given a function call.
 */
function getFragmentVariables(fragment, rootVariables, argumentVariables) {
  var variables = void 0;
  fragment.argumentDefinitions.forEach(function (definition) {
    if (argumentVariables.hasOwnProperty(definition.name)) {
      return;
    }
    variables = variables || (0, _extends3['default'])({}, argumentVariables);
    switch (definition.kind) {
      case 'LocalArgument':
        variables[definition.name] = definition.defaultValue;
        break;
      case 'RootArgument':
        require('fbjs/lib/invariant')(rootVariables.hasOwnProperty(definition.name), 'RelayConcreteVariables: Expected a defined query variable for `$%s` ' + 'in fragment `%s`.', definition.name, fragment.name);
        variables[definition.name] = rootVariables[definition.name];
        break;
      default:
        require('fbjs/lib/invariant')(false, 'RelayConcreteVariables: Unexpected node kind `%s` in fragment `%s`.', definition.kind, fragment.name);
    }
  });
  return variables || argumentVariables;
}

/**
 * Determines the variables that are in scope for a given operation given values
 * for some/all of its arguments. Extraneous input variables are filtered from
 * the output, and missing variables are set to default values (if given in the
 * operation's definition).
 */
function getOperationVariables(operation, variables) {
  var operationVariables = {};
  operation.query.argumentDefinitions.forEach(function (def) {
    var value = def.defaultValue;
    if (variables[def.name] != null) {
      value = variables[def.name];
    }
    operationVariables[def.name] = value;
    if (process.env.NODE_ENV !== 'production') {
      require('fbjs/lib/warning')(value != null || def.type[def.type.length - 1] !== '!', 'RelayConcreteVariables: Expected a value for non-nullable variable ' + '`$%s: %s` on operation `%s`, got `%s`. Make sure you supply a ' + 'value for all non-nullable arguments.', def.name, def.type, operation.name, JSON.stringify(value));
    }
  });
  return operationVariables;
}

module.exports = {
  getFragmentVariables: getFragmentVariables,
  getOperationVariables: getOperationVariables
};