'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.EXTERNALS_MESSAGE = undefined;

var _joi = require('joi');

var _joi2 = _interopRequireDefault(_joi);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/* eslint-disable max-len */
var EXTERNALS_MESSAGE = exports.EXTERNALS_MESSAGE = 'There was something wrong with how you specified the externals.\nWebpack documentation excerpt:\n\nAs value an object, a string, a function, a RegExp and an array is accepted.\n\n- string: An exact matched dependency becomes external. The same string is used as external dependency.\n- object: If an dependency matches exactly a property of the object, the property value is used as dependency. The property value may contain a dependency type prefixed and separated with a space. If the property value is true the property name is used instead. If the property value is false the externals test is aborted and the dependency is not external. See example below.\n- function: function(context, request, callback(err, result)) The function is called on each dependency. If a result is passed to the callback function this value is handled like a property value of an object (above bullet point).\n- RegExp: Every matched dependency becomes external. The matched text is used as the request for the external dependency. Because the request is the exact code used to generate the external code hook, if you are matching a commonjs package (e.g. \u2018../some/package.js\u2019), instead use the function external strategy. You can import the package via callback(null, "require(\'" + request + "\')", which generates a module.exports = require(\'../some/package.js\');, using require outside of webpack context.\n- array: Multiple values of the scheme (recursive).\n\n(see https://webpack.github.io/docs/configuration.html#externals )';
/* eslint-enable max-len */

var externalObjectSchema = _joi2.default.object().pattern(/.+/, [_joi2.default.string(), _joi2.default.boolean(), _joi2.default.object().pattern(/.+/, [_joi2.default.string(), _joi2.default.boolean()])]);

var externalSchema = [externalObjectSchema, _joi2.default.string(), _joi2.default.func().arity(3), _joi2.default.object().type(RegExp)];

exports.default = _joi2.default.array().items(externalSchema).single().options({ language: { array: {
      includesSingle: EXTERNALS_MESSAGE,
      includes: EXTERNALS_MESSAGE
    } } });