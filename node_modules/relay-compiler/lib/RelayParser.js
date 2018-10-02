/**
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @providesModule RelayParser
 * 
 * @format
 */

'use strict';

var _classCallCheck3 = _interopRequireDefault(require('babel-runtime/helpers/classCallCheck'));

var _possibleConstructorReturn3 = _interopRequireDefault(require('babel-runtime/helpers/possibleConstructorReturn'));

var _inherits3 = _interopRequireDefault(require('babel-runtime/helpers/inherits'));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _require = require('./GraphQLCompilerPublic'),
    Parser = _require.Parser,
    SchemaUtils = _require.SchemaUtils;

var _require2 = require('graphql'),
    assertAbstractType = _require2.assertAbstractType,
    isAbstractType = _require2.isAbstractType;

var getRawType = SchemaUtils.getRawType;

var RelayParser = function (_Parser) {
  (0, _inherits3['default'])(RelayParser, _Parser);

  function RelayParser(schema, definition) {
    (0, _classCallCheck3['default'])(this, RelayParser);

    var _this = (0, _possibleConstructorReturn3['default'])(this, _Parser.call(this, schema, definition));

    _this._definition = definition;
    _this._schema = schema;
    return _this;
  }

  /**
   * Find the definition of a field of the specified type.
   */


  RelayParser.prototype.getFieldDefinition = function getFieldDefinition(parentType, fieldName, fieldAST) {
    var schemaFieldDef = _Parser.prototype.getFieldDefinition.call(this, parentType, fieldName, fieldAST);
    if (!schemaFieldDef) {
      var type = getRawType(parentType);
      schemaFieldDef = getClassicFieldDefinition(this._schema, type, fieldName, fieldAST);
    }
    return schemaFieldDef || null;
  };

  return RelayParser;
}(Parser);

function getName(ast) {
  var name = ast.name ? ast.name.value : null;
  require('fbjs/lib/invariant')(typeof name === 'string', 'RelayParser: Expected ast node `%s` to have a name.', ast);
  return name;
}

function getClassicFieldDefinition(schema, type, fieldName, fieldAST) {
  if (isAbstractType(type) && fieldAST && fieldAST.directives && fieldAST.directives.some(function (directive) {
    return getName(directive) === 'fixme_fat_interface';
  })) {
    var possibleTypes = schema.getPossibleTypes(assertAbstractType(type));
    var schemaFieldDef = void 0;

    var _loop = function _loop(ii) {
      var possibleField = possibleTypes[ii].getFields()[fieldName];
      if (possibleField) {
        // Fat interface fields can have differing arguments. Try to return
        // a field with matching arguments, but still return a field if the
        // arguments do not match.
        schemaFieldDef = possibleField;
        if (fieldAST && fieldAST.arguments) {
          var argumentsAllExist = fieldAST.arguments.every(function (argument) {
            return possibleField.args.find(function (argDef) {
              return argDef.name === getName(argument);
            });
          });
          if (argumentsAllExist) {
            return 'break';
          }
        }
      }
    };

    for (var ii = 0; ii < possibleTypes.length; ii++) {
      var _ret = _loop(ii);

      if (_ret === 'break') break;
    }
    return schemaFieldDef;
  }
}

module.exports = RelayParser;