'use strict';

exports.__esModule = true;

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _graphql = require('graphql');

var _language = require('graphql/language');

function identity(value) {
  return value;
}

function parseLiteral(ast) {
  switch (ast.kind) {
    case _language.Kind.STRING:
    case _language.Kind.BOOLEAN:
      return ast.value;
    case _language.Kind.INT:
    case _language.Kind.FLOAT:
      return parseFloat(ast.value);
    case _language.Kind.OBJECT:
      {
        var _ret = function () {
          var value = Object.create(null);
          ast.fields.forEach(function (field) {
            value[field.name.value] = parseLiteral(field.value);
          });

          return {
            v: value
          };
        }();

        if ((typeof _ret === 'undefined' ? 'undefined' : _typeof(_ret)) === "object") return _ret.v;
      }
    case _language.Kind.LIST:
      return ast.values.map(parseLiteral);
    default:
      return null;
  }
}

exports.default = new _graphql.GraphQLScalarType({
  name: 'JSON',
  description: 'The `JSON` scalar type represents JSON values as specified by ' + '[ECMA-404](http://www.ecma-international.org/' + 'publications/files/ECMA-ST/ECMA-404.pdf).',
  serialize: identity,
  parseValue: identity,
  parseLiteral: parseLiteral
});
module.exports = exports['default'];