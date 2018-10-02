'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.looksLikeAbsolutePath = exports.JoiWithPath = undefined;

var _joi = require('joi');

var _joi2 = _interopRequireDefault(_joi);

var _shelljs = require('shelljs');

var _shelljs2 = _interopRequireDefault(_shelljs);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var MESSAGE = '"{{path}}" should be an existing absolute path, ' + 'but I found the following problems: {{msg1}}{{msg2}}';

var JoiWithPath = exports.JoiWithPath = _joi2.default.extend({
  base: _joi2.default.string(),
  name: 'path',
  language: {
    absolute: MESSAGE
  },
  rules: [{
    name: 'absolute',

    params: {
      checkForExistence: _joi2.default.bool()
    },

    validate: function validate(params, value, state, options) {
      var looksLikeAbsolutePath = /^(?!\.?\.\/).+$/.test(value);
      var directoryExists = params.checkForExistence === false ? true : _shelljs2.default.test('-d', value);
      if (!looksLikeAbsolutePath || !directoryExists) {
        return this.createError('path.absolute', {
          path: value,
          msg1: !looksLikeAbsolutePath ? 'The supplied string does not look like an absolute path ' + '(it does not match the regex /^(?!\.?\.\/).+$/). ' : '',
          msg2: !directoryExists ? 'The supplied path does not exist on the file system.' : ''
        }, state, options);
      }
      return null; // Everything is OK
    }
  }]
});

var absolutePath = JoiWithPath.path().absolute(true);
absolutePath.message = MESSAGE;
exports.default = absolutePath;
var looksLikeAbsolutePath = exports.looksLikeAbsolutePath = JoiWithPath.path().absolute(false);