/**
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @providesModule RelayError
 * 
 * @format
 */

'use strict';

var _toConsumableArray3 = _interopRequireDefault(require('babel-runtime/helpers/toConsumableArray'));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

/**
 * @internal
 *
 * Factory methods for constructing errors in Relay.
 */
var RelayError = {
  create: function create(name, format) {
    for (var _len = arguments.length, args = Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
      args[_key - 2] = arguments[_key];
    }

    return createError('mustfix', name, format, args);
  },
  createWarning: function createWarning(name, format) {
    for (var _len2 = arguments.length, args = Array(_len2 > 2 ? _len2 - 2 : 0), _key2 = 2; _key2 < _len2; _key2++) {
      args[_key2 - 2] = arguments[_key2];
    }

    return createError('warn', name, format, args);
  }
};

/**
 * @private
 */
function createError(type, name, format, args) {
  var error = new Error(require('fbjs/lib/sprintf').apply(undefined, [format].concat((0, _toConsumableArray3['default'])(args))));
  error.name = name;
  error.type = type;
  error.framesToPop = 2;
  return error;
}

module.exports = RelayError;