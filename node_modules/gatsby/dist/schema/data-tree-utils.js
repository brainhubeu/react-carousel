"use strict";

var _extends2 = require("babel-runtime/helpers/extends");

var _extends3 = _interopRequireDefault(_extends2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _ = require(`lodash`);
var flatten = require(`flat`);
var typeOf = require(`type-of`);
var invariant = require(`invariant`);

var createKey = require(`./create-key`);

var _require = require(`./type-conflict-reporter`),
    typeConflictReporter = _require.typeConflictReporter;

var INVALID_VALUE = Symbol(`INVALID_VALUE`);
var isDefined = function isDefined(v) {
  return v != null;
};

var isEmptyObjectOrArray = function isEmptyObjectOrArray(obj) {
  if (obj === INVALID_VALUE) {
    return true;
  } else if (_.isDate(obj)) {
    return false;
    // Simple "is object empty" check.
  } else if (_.isObject(obj) && _.isEmpty(obj)) {
    return true;
  } else if (_.isObject(obj)) {
    return _.every(obj, function (value, key) {
      if (!isDefined(value)) {
        return true;
      } else if (_.isObject(value)) {
        return isEmptyObjectOrArray(value);
      } else {
        return false;
      }
    });
  }
  return false;
};

var isScalar = function isScalar(val) {
  return !_.isObject(val) || val instanceof Date;
};

var extractTypes = function extractTypes(value) {
  if (Array.isArray(value)) {
    var uniqueTypes = _.uniq(value.filter(isDefined).map(function (item) {
      return extractTypes(item).type;
    })).sort();
    return {
      type: `array<${uniqueTypes.join(`|`)}>`,
      arrayTypes: uniqueTypes
    };
  } else {
    var type = typeOf(value);
    return {
      type,
      arrayTypes: []
    };
  }
};

var getExampleScalarFromArray = function getExampleScalarFromArray(values) {
  return _.reduce(values, function (value, nextValue) {
    // Prefer floats over ints as they're more specific.
    if (nextValue && _.isNumber(nextValue) && !_.isInteger(nextValue)) {
      return nextValue;
    } else if (value === null) {
      return nextValue;
    } else {
      return value;
    }
  }, null);
};

var extractFromEntries = function extractFromEntries(entries, selector, key) {
  var entriesOfUniqueType = _.uniqBy(entries, function (entry) {
    return entry.type;
  });

  if (entriesOfUniqueType.length == 0) {
    // skip if no defined types
    return null;
  } else if (entriesOfUniqueType.length > 1 || entriesOfUniqueType[0].arrayTypes.length > 1) {
    // there is multiple types or array of multiple types
    if (selector) {
      typeConflictReporter.addConflict(selector, entriesOfUniqueType);
    }
    return INVALID_VALUE;
  }

  // Now we have entries of single type, we can merge them
  var values = entries.map(function (entry) {
    return entry.value;
  });

  var exampleValue = entriesOfUniqueType[0].value;

  if (isScalar(exampleValue)) {
    return getExampleScalarFromArray(values);
  } else if (_.isObject(exampleValue)) {
    if (Array.isArray(exampleValue)) {
      var _ref;

      var concatanedItems = (_ref = []).concat.apply(_ref, values);
      // Linked node arrays don't get reduced further as we
      // want to preserve all the linked node types.
      if (key.includes(`___NODE`)) {
        return concatanedItems;
      }

      return extractFromArrays(concatanedItems, entries, selector);
    } else if (_.isPlainObject(exampleValue)) {
      return extractFieldExamples(values, selector);
    }
  }
  // unsuported object
  return INVALID_VALUE;
};

var extractFromArrays = function extractFromArrays(values, entries, selector) {
  var filteredItems = values.filter(isDefined);
  if (filteredItems.length === 0) {
    return null;
  }
  if (isScalar(filteredItems[0])) {
    return [getExampleScalarFromArray(filteredItems)];
  }

  var flattenEntries = _.flatten(entries.map(function (entry) {
    invariant(Array.isArray(entry.value), `this is validated in the previous call`);

    return entry.value.map(function (value) {
      return (0, _extends3.default)({
        value,
        parent: entry.parent
      }, extractTypes(value));
    });
  }));

  var arrayItemExample = extractFromEntries(flattenEntries, `${selector}[]`, ``);
  if (!isDefined(arrayItemExample) || arrayItemExample === INVALID_VALUE) {
    return INVALID_VALUE;
  }

  return [arrayItemExample];
};

/**
 * Takes an array of source nodes and returns a pristine
 * example that can be used to infer types.
 *
 * Arrays are flattened to either: `null` for empty or sparse arrays or a
 * an array of a sigle merged example. e.g:
 *
 *  - ['red'], ['blue', 'yellow'] -> ['red']
 *  - [{ color: 'red'}, { color: 'blue', ht: 5 }] -> [{ color: 'red', ht: 5 }]
 *
 * @param {*Nodes} args
 */
var extractFieldExamples = function extractFieldExamples(nodes, selector) {
  var ignoreFields = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : [];

  // get list of keys in all nodes
  var allKeys = _(nodes).flatMap(_.keys).uniq();

  var example = {};

  var _loop = function _loop(key) {
    if (ignoreFields.includes(key)) return "continue";
    var nextSelector = selector ? `${selector}.${key}` : key;

    var nodeWithValues = nodes.filter(function (node) {
      if (!node) return false;

      var value = node[key];
      if (_.isObject(value)) {
        return !isEmptyObjectOrArray(value);
      } else {
        return isDefined(value);
      }
    });

    // we want to keep track of nodes as we need it to get origin of data
    var entries = nodeWithValues.map(function (node) {
      var value = node[key];
      return (0, _extends3.default)({
        value,
        parent: node
      }, extractTypes(value));
    });

    var value = extractFromEntries(entries, nextSelector, key);
    if (!isDefined(value)) return "continue";

    example[key] = value;
  };

  for (var _iterator = allKeys, _isArray = Array.isArray(_iterator), _i = 0, _iterator = _isArray ? _iterator : _iterator[Symbol.iterator]();;) {
    var _ref2;

    if (_isArray) {
      if (_i >= _iterator.length) break;
      _ref2 = _iterator[_i++];
    } else {
      _i = _iterator.next();
      if (_i.done) break;
      _ref2 = _i.value;
    }

    var key = _ref2;

    var _ret = _loop(key);

    if (_ret === "continue") continue;
  }

  return example;
};

var buildFieldEnumValues = function buildFieldEnumValues(options) {
  var enumValues = {};
  var values = flatten(getExampleValues(options), {
    maxDepth: 3,
    safe: true, // don't flatten arrays.
    delimiter: `___`
  });
  Object.keys(values).forEach(function (field) {
    if (values[field] == null) return;
    enumValues[createKey(field)] = { field };
  });

  return enumValues;
};

var typeExampleValues = new Map();

var clearTypeExampleValues = function clearTypeExampleValues() {
  typeExampleValues.clear();
  typeConflictReporter.clearConflicts();
};

var getExampleValues = function getExampleValues(_ref3) {
  var nodes = _ref3.nodes,
      typeName = _ref3.typeName,
      ignoreFields = _ref3.ignoreFields;

  var cachedValue = typeName && typeExampleValues.get(typeName);

  // if type is defined and is in example value cache return it
  if (cachedValue) return cachedValue;

  // if nodes were passed extract field example from it
  if (nodes && nodes.length > 0) {
    var exampleValue = extractFieldExamples(nodes, typeName || ``, ignoreFields);
    // if type is set - cache results
    if (typeName) typeExampleValues.set(typeName, exampleValue);
    return exampleValue;
  }

  return {};
};

// extract a list of field names
// nested objects get flattened to "outer___inner" which will be converted back to
// "outer.inner" by run-sift
var extractFieldNames = function extractFieldNames(nodes) {
  var values = flatten(getExampleValues({
    nodes,
    typeName: _.get(nodes[0], `internal.type`)
  }), {
    maxDepth: 3,
    safe: true, // don't flatten arrays.
    delimiter: `___`
  });

  return Object.keys(values);
};

module.exports = {
  INVALID_VALUE,
  buildFieldEnumValues,
  extractFieldNames,
  isEmptyObjectOrArray,
  clearTypeExampleValues,
  getExampleValues
};
//# sourceMappingURL=data-tree-utils.js.map