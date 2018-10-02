/**
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @providesModule getIdentifierForArgumentValue
 * 
 * @format
 */

'use strict';

/**
 * Generates an identifier for an argument value. The identifier is based on the
 * structure/order of items and keys in the value.
 */
function getIdentifierForArgumentValue(value) {
  switch (value.kind) {
    case 'Variable':
      return { variable: value.variableName };
    case 'Literal':
      return { value: value.value };
    case 'ListValue':
      return {
        list: value.items.map(function (item) {
          return getIdentifierForArgumentValue(item);
        })
      };
    case 'ObjectValue':
      return {
        object: value.fields.map(function (field) {
          return {
            name: field.name,
            value: getIdentifierForArgumentValue(field.value)
          };
        })
      };
    default:
      require('fbjs/lib/invariant')(false, 'getIdentifierForArgumentValue(): Unsupported AST kind `%s`.', value.kind);
  }
}

module.exports = getIdentifierForArgumentValue;