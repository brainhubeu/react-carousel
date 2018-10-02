/**
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @providesModule parseGraphQLText
 * 
 * @format
 */

'use strict';

var _require = require('./ASTConvert'),
    convertASTDocuments = _require.convertASTDocuments;

var _require2 = require('graphql'),
    extendSchema = _require2.extendSchema,
    parse = _require2.parse;

function parseGraphQLText(schema, text) {
  var ast = parse(text);
  var extendedSchema = extendSchema(schema, ast);
  var definitions = convertASTDocuments(extendedSchema, [ast], [], require('./RelayParser').transform.bind(require('./RelayParser')));
  return {
    definitions: definitions,
    schema: extendedSchema !== schema ? extendedSchema : null
  };
}

module.exports = parseGraphQLText;