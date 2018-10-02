'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _joi = require('joi');

var _joi2 = _interopRequireDefault(_joi);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// console: true or false
// global: true or false
// process: true, "mock" or false
// Buffer: true or false
// __filename: true (real filename), "mock" ("/index.js") or false
// __dirname: true (real dirname), "mock" ("/") or false
// <node buildin>: true, "mock", "empty" or false

// This rigid rules break the angular config, so let's handle this more relaxed
// const mockOrBoolean = [Joi.boolean(), Joi.string().valid('mock')]
var mockOrBoolean = [_joi2.default.boolean(), _joi2.default.string()];

exports.default = _joi2.default.object({
  // This rigid rules break the angular config, so let's handle this more relaxed
  // console: Joi.boolean(),
  // global: Joi.boolean(),
  // Buffer: Joi.boolean(),
  console: mockOrBoolean,
  global: mockOrBoolean,
  Buffer: mockOrBoolean,
  process: mockOrBoolean,
  __filename: mockOrBoolean,
  __dirname: mockOrBoolean
}).pattern(/.+/, mockOrBoolean);