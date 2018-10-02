'use strict';

exports.__esModule = true;

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _transform = require('./transform');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var evalCode = function evalCode(code, scope) {
  var scopeKeys = Object.keys(scope);
  var scopeValues = scopeKeys.map(function (key) {
    return scope[key];
  });
  var res = new (Function.prototype.bind.apply(Function, [null].concat(['_poly', 'React'], scopeKeys, [code])))();
  return res.apply(undefined, [_transform._poly, _react2.default].concat(scopeValues));
};

exports.default = evalCode;
module.exports = exports['default'];