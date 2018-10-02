/**
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @providesModule RelayStoreUtils
 * 
 * @format
 */

'use strict';

var VARIABLE = require('./RelayConcreteNode').VARIABLE;

/**
 * Returns the values of field/fragment arguments as an object keyed by argument
 * names.
 */


function getArgumentValues(args, variables) {
  var values = {};
  args.forEach(function (arg) {
    if (arg.kind === VARIABLE) {
      values[arg.name] = getVariableValue(arg.variableName, variables);
    } else {
      values[arg.name] = arg.value;
    }
  });
  return values;
}

function getHandleFilterValues(args, filters, variables) {
  var filterArgs = args.filter(function (arg) {
    return filters.indexOf(arg.name) > -1;
  });
  return getArgumentValues(filterArgs, variables);
}

/**
 * Given a field and variable values, returns a key that can be used to
 * uniquely identify the combination of the field name and argument values.
 *
 * Note: the word "storage" here refers to the fact this key is primarily used
 * when writing the results of a key in a normalized graph or "store". This
 * name was used in previous implementations of Relay internals and is also
 * used here for consistency.
 */
function getStorageKey(field, variables) {
  if (field.storageKey) {
    return field.storageKey;
  }
  var args = field.args,
      name = field.name;

  if (!args || !args.length) {
    return name;
  }
  var values = [];
  args.forEach(function (arg) {
    var value = void 0;
    if (arg.kind === VARIABLE) {
      value = getVariableValue(arg.variableName, variables);
    } else {
      value = arg.value;
    }
    if (value != null) {
      values.push('"' + arg.name + '":' + require('./stableJSONStringify')(value));
    }
  });
  if (values.length) {
    return field.name + ('{' + values.join(',') + '}');
  } else {
    return field.name;
  }
}

function getVariableValue(name, variables) {
  require('fbjs/lib/invariant')(variables.hasOwnProperty(name), 'getVariableValue(): Undefined variable `%s`.', name);
  return variables[name];
}

/**
 * Constants shared by all implementations of RecordSource/MutableRecordSource/etc.
 */
var RelayStoreUtils = {
  FRAGMENTS_KEY: '__fragments',
  ID_KEY: '__id',
  REF_KEY: '__ref',
  REFS_KEY: '__refs',
  ROOT_ID: 'client:root',
  ROOT_TYPE: '__Root',
  TYPENAME_KEY: '__typename',
  UNPUBLISH_RECORD_SENTINEL: Object.freeze({ __UNPUBLISH_RECORD_SENTINEL: true }),
  UNPUBLISH_FIELD_SENTINEL: Object.freeze({ __UNPUBLISH_FIELD_SENTINEL: true }),

  getArgumentValues: getArgumentValues,
  getStorageKey: getStorageKey,
  getHandleFilterValues: getHandleFilterValues
};

module.exports = RelayStoreUtils;