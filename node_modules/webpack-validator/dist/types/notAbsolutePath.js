'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _joi = require('joi');

var _joi2 = _interopRequireDefault(_joi);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var MESSAGE = 'must not start with leading slash. ' + 'You probably want to supply an absolute path here, but shouldn\'t.';

var notAbsolutePath = _joi2.default.string().regex(/^(?!\/).+$/).options({ language: { string: { regex: { base: MESSAGE } } } });

notAbsolutePath.message = MESSAGE;
exports.default = notAbsolutePath;