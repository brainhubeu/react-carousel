'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _joi = require('joi');

var _joi2 = _interopRequireDefault(_joi);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var MESSAGE = 'should end with a slash (example: "/assets/" or "http://cdn.example.com/assets/[hash]/")';
var urlPart = _joi2.default.string().regex(/\/$/).options({ language: { string: { regex: { base: MESSAGE } } } });

urlPart.message = MESSAGE;

exports.default = urlPart;