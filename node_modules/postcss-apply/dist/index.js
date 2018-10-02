'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _postcss = require('postcss');

var _visitor = require('./visitor');

var _visitor2 = _interopRequireDefault(_visitor);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = (0, _postcss.plugin)('postcss-apply', function () {
  return function (css, result) {
    var visitor = new _visitor2.default();
    visitor.result = result;

    css.walk(function (node) {
      if (node.type === 'rule') {
        return visitor.collect(node);
      }
      if (node.type === 'atrule' && node.name === 'apply') {
        return visitor.replace(node);
      }
    });
  };
});