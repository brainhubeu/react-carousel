/**
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @providesModule GraphQLCompilerUserError
 * 
 * @format
 */

'use strict';

var createUserError = function createUserError(format) {
  for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
    args[_key - 1] = arguments[_key];
  }

  var index = 0;
  var formatted = format.replace(/%s/g, function (match) {
    return args[index++];
  });
  return new Error(formatted);
};

module.exports = { createUserError: createUserError };