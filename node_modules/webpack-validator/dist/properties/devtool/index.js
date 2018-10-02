'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _joi = require('joi');

var _joi2 = _interopRequireDefault(_joi);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var options = ['cheap-source-map', 'cheap-eval-source-map', 'cheap-hidden-source-map', 'cheap-inline-source-map', 'cheap-module-source-map', 'cheap-module-eval-source-map', 'cheap-module-hidden-source-map', 'cheap-module-inline-source-map', 'eval', 'eval-source-map', 'source-map', 'hidden-source-map', 'inline-source-map'];

var DEVTOOL_REGEX = new RegExp('^' + // start of string
'(#@|@|#)?' + ( // maybe one of the pragmas
'(' + options.join('$|') + ')') // one of the options
);

exports.default = [_joi2.default.string().regex(DEVTOOL_REGEX), _joi2.default.any().valid(false)];