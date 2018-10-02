'use strict';

exports.__esModule = true;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _LiveProvider = require('./LiveProvider');

var _cn = require('../../utils/cn');

var _cn2 = _interopRequireDefault(_cn);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

var LiveError = function LiveError(_ref, _ref2) {
  var live = _ref2.live;

  var className = _ref.className,
      rest = _objectWithoutProperties(_ref, ['className']);

  return live.error ? _react2.default.createElement(
    'div',
    _extends({}, rest, {
      className: (0, _cn2.default)('react-live-error', className)
    }),
    live.error
  ) : null;
};

LiveError.contextTypes = _LiveProvider.LiveContextTypes;

exports.default = LiveError;
module.exports = exports['default'];