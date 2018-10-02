'use strict';

exports.__esModule = true;
exports.composeWithDevTools = exports.default = undefined;

var _devTools = require('./devTools');

Object.defineProperty(exports, 'composeWithDevTools', {
  enumerable: true,
  get: function get() {
    return _devTools.composeWithDevTools;
  }
});

var _devTools2 = _interopRequireDefault(_devTools);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = _devTools2.default;