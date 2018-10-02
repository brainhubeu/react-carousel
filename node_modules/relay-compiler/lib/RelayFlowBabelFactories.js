/**
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @providesModule RelayFlowBabelFactories
 * 
 * @format
 */

'use strict';

/**
 * {|
 *   PROPS
 * |}
 */
function exactObjectTypeAnnotation(props) {
  var typeAnnotation = require('babel-types').objectTypeAnnotation(props);
  typeAnnotation.exact = true;
  return typeAnnotation;
}

/**
 * export type NAME = TYPE
 */
function exportType(name, type) {
  return require('babel-types').exportNamedDeclaration(require('babel-types').typeAlias(require('babel-types').identifier(name), null, type), [], null);
}

function lineComments() {
  for (var _len = arguments.length, lines = Array(_len), _key = 0; _key < _len; _key++) {
    lines[_key] = arguments[_key];
  }

  return lines.map(function (line) {
    return { type: 'CommentLine', value: ' ' + line };
  });
}

/**
 * $ReadOnlyArray<TYPE>
 */
function readOnlyArrayOfType(thing) {
  return require('babel-types').genericTypeAnnotation(require('babel-types').identifier('$ReadOnlyArray'), require('babel-types').typeParameterInstantiation([thing]));
}

/**
 * +KEY: VALUE
 */
function readOnlyObjectTypeProperty(key, value) {
  var prop = require('babel-types').objectTypeProperty(require('babel-types').identifier(key), value);
  prop.variance = 'plus';
  return prop;
}

function stringLiteralTypeAnnotation(value) {
  var annotation = require('babel-types').stringLiteralTypeAnnotation();
  annotation.value = value;
  return annotation;
}

module.exports = {
  exactObjectTypeAnnotation: exactObjectTypeAnnotation,
  exportType: exportType,
  lineComments: lineComments,
  readOnlyArrayOfType: readOnlyArrayOfType,
  readOnlyObjectTypeProperty: readOnlyObjectTypeProperty,
  stringLiteralTypeAnnotation: stringLiteralTypeAnnotation
};