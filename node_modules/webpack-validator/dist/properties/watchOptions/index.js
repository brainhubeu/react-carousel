'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _joi = require('joi');

var _joi2 = _interopRequireDefault(_joi);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = _joi2.default.object({
  aggregateTimeout: _joi2.default.number(),
  poll: [_joi2.default.bool(), _joi2.default.number()]
});