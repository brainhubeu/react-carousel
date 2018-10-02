'use strict';

exports.__esModule = true;
exports._poly = undefined;

var _buble = require('buble/dist/buble.deps');

var _assign = require('core-js/fn/object/assign');

var _assign2 = _interopRequireDefault(_assign);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _poly = exports._poly = { assign: _assign2.default };

var opts = {
  objectAssign: '_poly.assign',
  transforms: {
    dangerousForOf: true,
    dangerousTaggedTemplateString: true
  }
};

exports.default = function (code) {
  return (0, _buble.transform)(code, opts).code;
};