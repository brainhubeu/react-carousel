'use strict';

exports.__esModule = true;

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _css = require('../../constants/css');

var _css2 = _interopRequireDefault(_css);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var prismStyling = _react2.default.createElement('style', { dangerouslySetInnerHTML: { __html: _css2.default } });

exports.default = function () {
  return prismStyling;
};

module.exports = exports['default'];