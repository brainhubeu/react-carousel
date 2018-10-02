/**
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @providesModule formatStorageKey
 * 
 * @format
 */

'use strict';

/**
 * Given a `fieldName` (eg. "foo") and an object representing arguments and
 * values (eg. `{first: 10, orberBy: "name"}`) returns a unique storage key
 * (ie. `foo{"first":10,"orderBy":"name"}`).
 */
function formatStorageKey(fieldName, argsWithValues) {
  if (!argsWithValues) {
    return fieldName;
  }
  var filtered = null;
  for (var argName in argsWithValues) {
    if (argsWithValues.hasOwnProperty(argName)) {
      var value = argsWithValues[argName];
      if (value != null) {
        if (!filtered) {
          filtered = {};
        }
        filtered[argName] = value;
      }
    }
  }
  return filtered ? fieldName + require('./stableJSONStringify')(filtered) : fieldName;
}

module.exports = formatStorageKey;