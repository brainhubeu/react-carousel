/**
 * Relay v1.4.1
 */
(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory(require("fbjs/lib/invariant"), require("fbjs/lib/warning"), require("babel-runtime/helpers/classCallCheck"), require("babel-runtime/helpers/extends"), require("fbjs/lib/areEqual"), require("fbjs/lib/emptyFunction"), require("fbjs/lib/removeFromArray"), require("babel-runtime/helpers/defineProperty"), require("babel-runtime/helpers/toConsumableArray"), require("fbjs/lib/mapObject"), require("fbjs/lib/resolveImmediate"), require("fbjs/lib/sprintf"), (function webpackLoadOptionalExternalModule() { try { return require("relay-debugger-react-native-runtime"); } catch(e) {} }()));
	else if(typeof define === 'function' && define.amd)
		define(["fbjs/lib/invariant", "fbjs/lib/warning", "babel-runtime/helpers/classCallCheck", "babel-runtime/helpers/extends", "fbjs/lib/areEqual", "fbjs/lib/emptyFunction", "fbjs/lib/removeFromArray", "babel-runtime/helpers/defineProperty", "babel-runtime/helpers/toConsumableArray", "fbjs/lib/mapObject", "fbjs/lib/resolveImmediate", "fbjs/lib/sprintf", "relay-debugger-react-native-runtime"], factory);
	else if(typeof exports === 'object')
		exports["RelayRuntime"] = factory(require("fbjs/lib/invariant"), require("fbjs/lib/warning"), require("babel-runtime/helpers/classCallCheck"), require("babel-runtime/helpers/extends"), require("fbjs/lib/areEqual"), require("fbjs/lib/emptyFunction"), require("fbjs/lib/removeFromArray"), require("babel-runtime/helpers/defineProperty"), require("babel-runtime/helpers/toConsumableArray"), require("fbjs/lib/mapObject"), require("fbjs/lib/resolveImmediate"), require("fbjs/lib/sprintf"), (function webpackLoadOptionalExternalModule() { try { return require("relay-debugger-react-native-runtime"); } catch(e) {} }()));
	else
		root["RelayRuntime"] = factory(root["fbjs/lib/invariant"], root["fbjs/lib/warning"], root["babel-runtime/helpers/classCallCheck"], root["babel-runtime/helpers/extends"], root["fbjs/lib/areEqual"], root["fbjs/lib/emptyFunction"], root["fbjs/lib/removeFromArray"], root["babel-runtime/helpers/defineProperty"], root["babel-runtime/helpers/toConsumableArray"], root["fbjs/lib/mapObject"], root["fbjs/lib/resolveImmediate"], root["fbjs/lib/sprintf"], root["relay-debugger-react-native-runtime"]);
})(this, function(__WEBPACK_EXTERNAL_MODULE_1__, __WEBPACK_EXTERNAL_MODULE_5__, __WEBPACK_EXTERNAL_MODULE_6__, __WEBPACK_EXTERNAL_MODULE_13__, __WEBPACK_EXTERNAL_MODULE_28__, __WEBPACK_EXTERNAL_MODULE_29__, __WEBPACK_EXTERNAL_MODULE_30__, __WEBPACK_EXTERNAL_MODULE_63__, __WEBPACK_EXTERNAL_MODULE_64__, __WEBPACK_EXTERNAL_MODULE_65__, __WEBPACK_EXTERNAL_MODULE_66__, __WEBPACK_EXTERNAL_MODULE_67__, __WEBPACK_EXTERNAL_MODULE_68__) {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

	/**
	 * Copyright (c) 2013-present, Facebook, Inc.
	 *
	 * This source code is licensed under the MIT license found in the
	 * LICENSE file in the root directory of this source tree.
	 *
	 * @providesModule RelayRuntime
	 * 
	 * @format
	 */

	'use strict';

	// As early as possible, check for the existence of the JavaScript globals which
	// Relay Runtime relies upon, and produce a clear message if they do not exist.
	if (true) {
	  if (typeof Map !== 'function' || typeof Set !== 'function' || typeof Promise !== 'function' || typeof Object.assign !== 'function') {
	    throw new Error('relay-runtime requires Map, Set, Promise, and Object.assign to exist. ' + 'Use a polyfill to provide these for older browsers.');
	  }
	}

	/**
	 * The public interface to Relay Runtime.
	 */
	module.exports = {
	  // Core API
	  Environment: __webpack_require__(44),
	  Network: __webpack_require__(47),
	  Observable: __webpack_require__(17),
	  QueryResponseCache: __webpack_require__(49),
	  RecordSource: __webpack_require__(12),
	  Store: __webpack_require__(43),

	  areEqualSelectors: __webpack_require__(8).areEqualSelectors,
	  createFragmentSpecResolver: __webpack_require__(8).createFragmentSpecResolver,
	  createOperationSelector: __webpack_require__(8).createOperationSelector,
	  getDataIDsFromObject: __webpack_require__(8).getDataIDsFromObject,
	  getFragment: __webpack_require__(16).getFragment,
	  getOperation: __webpack_require__(16).getOperation,
	  getSelector: __webpack_require__(8).getSelector,
	  getSelectorList: __webpack_require__(8).getSelectorList,
	  getSelectorsFromObject: __webpack_require__(8).getSelectorsFromObject,
	  getVariablesFromObject: __webpack_require__(8).getVariablesFromObject,
	  graphql: __webpack_require__(16).graphql,

	  // Extensions
	  ConnectionHandler: __webpack_require__(9),
	  ViewerHandler: __webpack_require__(35),

	  // Helpers (can be implemented via the above API)
	  applyOptimisticMutation: __webpack_require__(53),
	  commitLocalUpdate: __webpack_require__(54),
	  commitMutation: __webpack_require__(55),
	  fetchQuery: __webpack_require__(56),
	  isRelayModernEnvironment: __webpack_require__(25),
	  requestSubscription: __webpack_require__(61),

	  // Configuration interface for legacy or special uses
	  ConnectionInterface: __webpack_require__(10)
	};

	if (true) {
	  var RelayRecordSourceInspector = __webpack_require__(22);

	  // Debugging-related symbols exposed only in development
	  Object.assign(module.exports, {
	    RecordSourceInspector: RelayRecordSourceInspector
	  });
	}

/***/ }),
/* 1 */
/***/ (function(module, exports) {

	module.exports = __WEBPACK_EXTERNAL_MODULE_1__;

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

	/**
	 * Copyright (c) 2013-present, Facebook, Inc.
	 *
	 * This source code is licensed under the MIT license found in the
	 * LICENSE file in the root directory of this source tree.
	 *
	 * @providesModule RelayModernRecord
	 * 
	 * @format
	 */

	'use strict';

	var _extends3 = _interopRequireDefault(__webpack_require__(13));

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

	var _require = __webpack_require__(4),
	    ID_KEY = _require.ID_KEY,
	    REF_KEY = _require.REF_KEY,
	    REFS_KEY = _require.REFS_KEY,
	    TYPENAME_KEY = _require.TYPENAME_KEY,
	    UNPUBLISH_FIELD_SENTINEL = _require.UNPUBLISH_FIELD_SENTINEL;

	/**
	 * @public
	 *
	 * Low-level record manipulation methods.
	 *
	 * A note about perf: we use long-hand property access rather than computed
	 * properties in this file for speed ie.
	 *
	 *    const object = {};
	 *    object[KEY] = value;
	 *    record[storageKey] = object;
	 *
	 * instead of:
	 *
	 *    record[storageKey] = {
	 *      [KEY]: value,
	 *    };
	 *
	 * The latter gets transformed by Babel into something like:
	 *
	 *    function _defineProperty(obj, key, value) {
	 *      if (key in obj) {
	 *        Object.defineProperty(obj, key, {
	 *          value: value,
	 *          enumerable: true,
	 *          configurable: true,
	 *          writable: true,
	 *        });
	 *      } else {
	 *        obj[key] = value;
	 *      }
	 *      return obj;
	 *    }
	 *
	 *    record[storageKey] = _defineProperty({}, KEY, value);
	 *
	 * A quick benchmark shows that computed property access is an order of
	 * magnitude slower (times in seconds for 100,000 iterations):
	 *
	 *               best     avg     sd
	 *    computed 0.02175 0.02292 0.00113
	 *      manual 0.00110 0.00123 0.00008
	 */

	/**
	 * @public
	 *
	 * Clone a record.
	 */
	function clone(record) {
	  return (0, _extends3['default'])({}, record);
	}

	/**
	 * @public
	 *
	 * Copies all fields from `source` to `sink`, excluding `__id` and `__typename`.
	 *
	 * NOTE: This function does not treat `id` specially. To preserve the id,
	 * manually reset it after calling this function. Also note that values are
	 * copied by reference and not value; callers should ensure that values are
	 * copied on write.
	 */
	function copyFields(source, sink) {
	  for (var key in source) {
	    if (source.hasOwnProperty(key)) {
	      if (key !== ID_KEY && key !== TYPENAME_KEY) {
	        sink[key] = source[key];
	      }
	    }
	  }
	}

	/**
	 * @public
	 *
	 * Create a new record.
	 */
	function create(dataID, typeName) {
	  // See perf note above for why we aren't using computed property access.
	  var record = {};
	  record[ID_KEY] = dataID;
	  record[TYPENAME_KEY] = typeName;
	  return record;
	}

	/**
	 * @public
	 *
	 * Get the record's `id` if available or the client-generated identifier.
	 */
	function getDataID(record) {
	  return record[ID_KEY];
	}

	/**
	 * @public
	 *
	 * Get the concrete type of the record.
	 */
	function getType(record) {
	  return record[TYPENAME_KEY];
	}

	/**
	 * @public
	 *
	 * Get a scalar (non-link) field value.
	 */
	function getValue(record, storageKey) {
	  var value = record[storageKey];
	  if (value && typeof value === 'object') {
	    __webpack_require__(1)(!value.hasOwnProperty(REF_KEY) && !value.hasOwnProperty(REFS_KEY), 'RelayModernRecord.getValue(): Expected a scalar (non-link) value for `%s.%s` ' + 'but found %s.', record[ID_KEY], storageKey, value.hasOwnProperty(REF_KEY) ? 'a linked record' : 'plural linked records');
	  }
	  return value;
	}

	/**
	 * @public
	 *
	 * Get the value of a field as a reference to another record. Throws if the
	 * field has a different type.
	 */
	function getLinkedRecordID(record, storageKey) {
	  var link = record[storageKey];
	  if (link == null) {
	    return link;
	  }
	  __webpack_require__(1)(typeof link === 'object' && link && typeof link[REF_KEY] === 'string', 'RelayModernRecord.getLinkedRecordID(): Expected `%s.%s` to be a linked ID, ' + 'was `%s`.', record[ID_KEY], storageKey, link);
	  return link[REF_KEY];
	}

	/**
	 * @public
	 *
	 * Get the value of a field as a list of references to other records. Throws if
	 * the field has a different type.
	 */
	function getLinkedRecordIDs(record, storageKey) {
	  var links = record[storageKey];
	  if (links == null) {
	    return links;
	  }
	  __webpack_require__(1)(typeof links === 'object' && Array.isArray(links[REFS_KEY]), 'RelayModernRecord.getLinkedRecordIDs(): Expected `%s.%s` to contain an array ' + 'of linked IDs, got `%s`.', record[ID_KEY], storageKey, JSON.stringify(links));
	  // assume items of the array are ids
	  return links[REFS_KEY];
	}

	/**
	 * @public
	 *
	 * Compares the fields of a previous and new record, returning either the
	 * previous record if all fields are equal or a new record (with merged fields)
	 * if any fields have changed.
	 */
	function update(prevRecord, nextRecord) {
	  var updated = void 0;
	  var keys = Object.keys(nextRecord);
	  for (var ii = 0; ii < keys.length; ii++) {
	    var key = keys[ii];
	    if (updated || !__webpack_require__(28)(prevRecord[key], nextRecord[key])) {
	      updated = updated || (0, _extends3['default'])({}, prevRecord);
	      if (nextRecord[key] !== UNPUBLISH_FIELD_SENTINEL) {
	        updated[key] = nextRecord[key];
	      } else {
	        delete updated[key];
	      }
	    }
	  }
	  return updated || prevRecord;
	}

	/**
	 * @public
	 *
	 * Returns a new record with the contents of the given records. Fields in the
	 * second record will overwrite identical fields in the first record.
	 */
	function merge(record1, record2) {
	  return Object.assign({}, record1, record2);
	}

	/**
	 * @public
	 *
	 * Prevent modifications to the record. Attempts to call `set*` functions on a
	 * frozen record will fatal at runtime.
	 */
	function freeze(record) {
	  __webpack_require__(19)(record);
	}

	/**
	 * @public
	 *
	 * Set the value of a storageKey to a scalar.
	 */
	function setValue(record, storageKey, value) {
	  record[storageKey] = value;
	}

	/**
	 * @public
	 *
	 * Set the value of a field to a reference to another record.
	 */
	function setLinkedRecordID(record, storageKey, linkedID) {
	  // See perf note above for why we aren't using computed property access.
	  var link = {};
	  link[REF_KEY] = linkedID;
	  record[storageKey] = link;
	}

	/**
	 * @public
	 *
	 * Set the value of a field to a list of references other records.
	 */
	function setLinkedRecordIDs(record, storageKey, linkedIDs) {
	  // See perf note above for why we aren't using computed property access.
	  var links = {};
	  links[REFS_KEY] = linkedIDs;
	  record[storageKey] = links;
	}

	module.exports = {
	  clone: clone,
	  copyFields: copyFields,
	  create: create,
	  freeze: freeze,
	  getDataID: getDataID,
	  getLinkedRecordID: getLinkedRecordID,
	  getLinkedRecordIDs: getLinkedRecordIDs,
	  getType: getType,
	  getValue: getValue,
	  merge: merge,
	  setValue: setValue,
	  setLinkedRecordID: setLinkedRecordID,
	  setLinkedRecordIDs: setLinkedRecordIDs,
	  update: update
	};

/***/ }),
/* 3 */
/***/ (function(module, exports) {

	/**
	 * Copyright (c) 2013-present, Facebook, Inc.
	 *
	 * This source code is licensed under the MIT license found in the
	 * LICENSE file in the root directory of this source tree.
	 *
	 * @providesModule RelayConcreteNode
	 * 
	 * @format
	 */

	'use strict';

	/**
	 * Represents a single ConcreteRoot along with metadata for processing it at
	 * runtime. The persisted `id` (or `text`) can be used to fetch the query,
	 * the `fragment` can be used to read the root data (masking data from child
	 * fragments), and the `query` can be used to normalize server responses.
	 *
	 * NOTE: The use of "batch" in the name is intentional, as this wrapper around
	 * the ConcreteRoot will provide a place to store multiple concrete nodes that
	 * are part of the same batch, e.g. in the case of deferred nodes or
	 * for streaming connections that are represented as distinct concrete roots but
	 * are still conceptually tied to one source query.
	 */
	var RelayConcreteNode = {
	  CONDITION: 'Condition',
	  FRAGMENT: 'Fragment',
	  FRAGMENT_SPREAD: 'FragmentSpread',
	  INLINE_FRAGMENT: 'InlineFragment',
	  LINKED_FIELD: 'LinkedField',
	  LINKED_HANDLE: 'LinkedHandle',
	  LITERAL: 'Literal',
	  LOCAL_ARGUMENT: 'LocalArgument',
	  ROOT: 'Root',
	  ROOT_ARGUMENT: 'RootArgument',
	  SCALAR_FIELD: 'ScalarField',
	  SCALAR_HANDLE: 'ScalarHandle',
	  VARIABLE: 'Variable'
	};

	module.exports = RelayConcreteNode;

/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

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

	var VARIABLE = __webpack_require__(3).VARIABLE;

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
	      values.push('"' + arg.name + '":' + __webpack_require__(27)(value));
	    }
	  });
	  if (values.length) {
	    return field.name + ('{' + values.join(',') + '}');
	  } else {
	    return field.name;
	  }
	}

	function getVariableValue(name, variables) {
	  __webpack_require__(1)(variables.hasOwnProperty(name), 'getVariableValue(): Undefined variable `%s`.', name);
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

/***/ }),
/* 5 */
/***/ (function(module, exports) {

	module.exports = __WEBPACK_EXTERNAL_MODULE_5__;

/***/ }),
/* 6 */
/***/ (function(module, exports) {

	module.exports = __WEBPACK_EXTERNAL_MODULE_6__;

/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

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
	  return filtered ? fieldName + __webpack_require__(27)(filtered) : fieldName;
	}

	module.exports = formatStorageKey;

/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

	/**
	 * Copyright (c) 2013-present, Facebook, Inc.
	 *
	 * This source code is licensed under the MIT license found in the
	 * LICENSE file in the root directory of this source tree.
	 *
	 * @providesModule RelayCore
	 * 
	 * @format
	 */

	'use strict';

	var _require = __webpack_require__(16),
	    getFragment = _require.getFragment,
	    getOperation = _require.getOperation;

	var _require2 = __webpack_require__(46),
	    createOperationSelector = _require2.createOperationSelector;

	var _require3 = __webpack_require__(33),
	    areEqualSelectors = _require3.areEqualSelectors,
	    getDataIDsFromObject = _require3.getDataIDsFromObject,
	    getSelector = _require3.getSelector,
	    getSelectorList = _require3.getSelectorList,
	    getSelectorsFromObject = _require3.getSelectorsFromObject,
	    getVariablesFromObject = _require3.getVariablesFromObject;

	function createFragmentSpecResolver(context, containerName, fragments, props, callback) {
	  if (true) {
	    var fragmentNames = Object.keys(fragments);
	    fragmentNames.forEach(function (fragmentName) {
	      var propValue = props[fragmentName];
	      __webpack_require__(5)(propValue !== undefined, 'createFragmentSpecResolver: Expected prop `%s` to be supplied to `%s`, but ' + 'got `undefined`. Pass an explicit `null` if this is intentional.', fragmentName, containerName);
	    });
	  }

	  return new (__webpack_require__(45))(context, fragments, props, callback);
	}

	module.exports = {
	  areEqualSelectors: areEqualSelectors,
	  createFragmentSpecResolver: createFragmentSpecResolver,
	  createOperationSelector: createOperationSelector,
	  getDataIDsFromObject: getDataIDsFromObject,
	  getFragment: getFragment,
	  getOperation: getOperation,
	  getSelector: getSelector,
	  getSelectorList: getSelectorList,
	  getSelectorsFromObject: getSelectorsFromObject,
	  getVariablesFromObject: getVariablesFromObject
	};

/***/ }),
/* 9 */
/***/ (function(module, exports, __webpack_require__) {

	/**
	 * Copyright (c) 2013-present, Facebook, Inc.
	 *
	 * This source code is licensed under the MIT license found in the
	 * LICENSE file in the root directory of this source tree.
	 *
	 * @providesModule RelayConnectionHandler
	 * 
	 * @format
	 */

	'use strict';

	var CONNECTION = 'connection';

	// Per-instance incrementing index used to generate unique edge IDs
	var NEXT_EDGE_INDEX = '__connection_next_edge_index';

	/**
	 * @public
	 *
	 * A default runtime handler for connection fields that appends newly fetched
	 * edges onto the end of a connection, regardless of the arguments used to fetch
	 * those edges.
	 */
	function update(store, payload) {
	  var record = store.get(payload.dataID);
	  if (!record) {
	    return;
	  }

	  var _RelayConnectionInter = __webpack_require__(10).get(),
	      EDGES = _RelayConnectionInter.EDGES,
	      END_CURSOR = _RelayConnectionInter.END_CURSOR,
	      HAS_NEXT_PAGE = _RelayConnectionInter.HAS_NEXT_PAGE,
	      HAS_PREV_PAGE = _RelayConnectionInter.HAS_PREV_PAGE,
	      PAGE_INFO = _RelayConnectionInter.PAGE_INFO,
	      PAGE_INFO_TYPE = _RelayConnectionInter.PAGE_INFO_TYPE,
	      START_CURSOR = _RelayConnectionInter.START_CURSOR;

	  var serverConnection = record.getLinkedRecord(payload.fieldKey);
	  var serverPageInfo = serverConnection && serverConnection.getLinkedRecord(PAGE_INFO);
	  if (!serverConnection) {
	    record.setValue(null, payload.handleKey);
	    return;
	  }
	  var clientConnection = record.getLinkedRecord(payload.handleKey);
	  var clientPageInfo = clientConnection && clientConnection.getLinkedRecord(PAGE_INFO);
	  if (!clientConnection) {
	    // Initial fetch with data: copy fields from the server record
	    var connection = store.create(__webpack_require__(11)(record.getDataID(), payload.handleKey), serverConnection.getType());
	    connection.setValue(0, NEXT_EDGE_INDEX);
	    connection.copyFieldsFrom(serverConnection);
	    var serverEdges = serverConnection.getLinkedRecords(EDGES);
	    if (serverEdges) {
	      serverEdges = serverEdges.map(function (edge) {
	        return buildConnectionEdge(store, connection, edge);
	      });
	      connection.setLinkedRecords(serverEdges, EDGES);
	    }
	    record.setLinkedRecord(connection, payload.handleKey);

	    clientPageInfo = store.create(__webpack_require__(11)(connection.getDataID(), PAGE_INFO), PAGE_INFO_TYPE);
	    clientPageInfo.setValue(false, HAS_NEXT_PAGE);
	    clientPageInfo.setValue(false, HAS_PREV_PAGE);
	    clientPageInfo.setValue(null, END_CURSOR);
	    clientPageInfo.setValue(null, START_CURSOR);
	    if (serverPageInfo) {
	      clientPageInfo.copyFieldsFrom(serverPageInfo);
	    }
	    connection.setLinkedRecord(clientPageInfo, PAGE_INFO);
	  } else {
	    var _connection = clientConnection;
	    // Subsequent fetches:
	    // - updated fields on the connection
	    // - merge prev/next edges, de-duplicating by node id
	    // - synthesize page info fields
	    var _serverEdges = serverConnection.getLinkedRecords(EDGES);
	    if (_serverEdges) {
	      _serverEdges = _serverEdges.map(function (edge) {
	        return buildConnectionEdge(store, _connection, edge);
	      });
	    }
	    var prevEdges = _connection.getLinkedRecords(EDGES);
	    var prevPageInfo = _connection.getLinkedRecord(PAGE_INFO);
	    _connection.copyFieldsFrom(serverConnection);
	    // Reset EDGES and PAGE_INFO fields
	    if (prevEdges) {
	      _connection.setLinkedRecords(prevEdges, EDGES);
	    }
	    if (prevPageInfo) {
	      _connection.setLinkedRecord(prevPageInfo, PAGE_INFO);
	    }

	    var nextEdges = [];
	    var args = payload.args;
	    if (prevEdges && _serverEdges) {
	      if (args.after != null) {
	        // Forward pagination from the end of the connection: append edges
	        if (clientPageInfo && args.after === clientPageInfo.getValue(END_CURSOR)) {
	          var nodeIDs = new Set();
	          mergeEdges(prevEdges, nextEdges, nodeIDs);
	          mergeEdges(_serverEdges, nextEdges, nodeIDs);
	        } else {
	          __webpack_require__(5)(false, 'RelayConnectionHandler: Unexpected after cursor `%s`, edges must ' + 'be fetched from the end of the list (`%s`).', args.after, clientPageInfo && clientPageInfo.getValue(END_CURSOR));
	          return;
	        }
	      } else if (args.before != null) {
	        // Backward pagination from the start of the connection: prepend edges
	        if (clientPageInfo && args.before === clientPageInfo.getValue(START_CURSOR)) {
	          var _nodeIDs = new Set();
	          mergeEdges(_serverEdges, nextEdges, _nodeIDs);
	          mergeEdges(prevEdges, nextEdges, _nodeIDs);
	        } else {
	          __webpack_require__(5)(false, 'RelayConnectionHandler: Unexpected before cursor `%s`, edges must ' + 'be fetched from the beginning of the list (`%s`).', args.before, clientPageInfo && clientPageInfo.getValue(START_CURSOR));
	          return;
	        }
	      } else {
	        // The connection was refetched from the beginning/end: replace edges
	        nextEdges = _serverEdges;
	      }
	    } else if (_serverEdges) {
	      nextEdges = _serverEdges;
	    } else {
	      nextEdges = prevEdges;
	    }
	    // Update edges only if they were updated, the null check is
	    // for Flow (prevEdges could be null).
	    if (nextEdges != null && nextEdges !== prevEdges) {
	      _connection.setLinkedRecords(nextEdges, EDGES);
	    }
	    // Page info should be updated even if no new edge were returned.
	    if (clientPageInfo && serverPageInfo) {
	      if (args.before != null || args.after == null && args.last) {
	        clientPageInfo.setValue(!!serverPageInfo.getValue(HAS_PREV_PAGE), HAS_PREV_PAGE);
	        var startCursor = serverPageInfo.getValue(START_CURSOR);
	        if (typeof startCursor === 'string') {
	          clientPageInfo.setValue(startCursor, START_CURSOR);
	        }
	      } else if (args.after != null || args.before == null && args.first) {
	        clientPageInfo.setValue(!!serverPageInfo.getValue(HAS_NEXT_PAGE), HAS_NEXT_PAGE);
	        var endCursor = serverPageInfo.getValue(END_CURSOR);
	        if (typeof endCursor === 'string') {
	          clientPageInfo.setValue(endCursor, END_CURSOR);
	        }
	      }
	    }
	  }
	}

	/**
	 * @public
	 *
	 * Given a record and the name of the schema field for which a connection was
	 * fetched, returns the linked connection record.
	 *
	 * Example:
	 *
	 * Given that data has already been fetched on some user `<id>` on the `friends`
	 * field:
	 *
	 * ```
	 * fragment FriendsFragment on User {
	 *   friends(first: 10) @connection(key: "FriendsFragment_friends") {
	 *    edges {
	 *      node {
	 *        id
	 *        }
	 *      }
	 *   }
	 * }
	 * ```
	 *
	 * The `friends` connection record can be accessed with:
	 *
	 * ```
	 * store => {
	 *   const user = store.get('<id>');
	 *   const friends = RelayConnectionHandler.getConnection(user, 'FriendsFragment_friends');
	 *   // Access fields on the connection:
	 *   const edges = friends.getLinkedRecords('edges');
	 * }
	 * ```
	 *
	 * TODO: t15733312
	 * Currently we haven't run into this case yet, but we need to add a `getConnections`
	 * that returns an array of the connections under the same `key` regardless of the variables.
	 */
	function getConnection(record, key, filters) {
	  var handleKey = __webpack_require__(20)(CONNECTION, key, null);
	  return record.getLinkedRecord(handleKey, filters);
	}

	/**
	 * @public
	 *
	 * Inserts an edge after the given cursor, or at the end of the list if no
	 * cursor is provided.
	 *
	 * Example:
	 *
	 * Given that data has already been fetched on some user `<id>` on the `friends`
	 * field:
	 *
	 * ```
	 * fragment FriendsFragment on User {
	 *   friends(first: 10) @connection(key: "FriendsFragment_friends") {
	 *    edges {
	 *      node {
	 *        id
	 *        }
	 *      }
	 *   }
	 * }
	 * ```
	 *
	 * An edge can be appended with:
	 *
	 * ```
	 * store => {
	 *   const user = store.get('<id>');
	 *   const friends = RelayConnectionHandler.getConnection(user, 'FriendsFragment_friends');
	 *   const edge = store.create('<edge-id>', 'FriendsEdge');
	 *   RelayConnectionHandler.insertEdgeAfter(friends, edge);
	 * }
	 * ```
	 */
	function insertEdgeAfter(record, newEdge, cursor) {
	  var _RelayConnectionInter2 = __webpack_require__(10).get(),
	      CURSOR = _RelayConnectionInter2.CURSOR,
	      EDGES = _RelayConnectionInter2.EDGES;

	  var edges = record.getLinkedRecords(EDGES);
	  if (!edges) {
	    record.setLinkedRecords([newEdge], EDGES);
	    return;
	  }
	  var nextEdges = void 0;
	  if (cursor == null) {
	    nextEdges = edges.concat(newEdge);
	  } else {
	    nextEdges = [];
	    var foundCursor = false;
	    for (var ii = 0; ii < edges.length; ii++) {
	      var edge = edges[ii];
	      nextEdges.push(edge);
	      if (edge == null) {
	        continue;
	      }
	      var edgeCursor = edge.getValue(CURSOR);
	      if (cursor === edgeCursor) {
	        nextEdges.push(newEdge);
	        foundCursor = true;
	      }
	    }
	    if (!foundCursor) {
	      nextEdges.push(newEdge);
	    }
	  }
	  record.setLinkedRecords(nextEdges, EDGES);
	}

	/**
	 * @public
	 *
	 * Creates an edge for a connection record, given a node and edge type.
	 */
	function createEdge(store, record, node, edgeType) {
	  var _RelayConnectionInter3 = __webpack_require__(10).get(),
	      NODE = _RelayConnectionInter3.NODE;

	  // An index-based client ID could easily conflict (unless it was
	  // auto-incrementing, but there is nowhere to the store the id)
	  // Instead, construct a client ID based on the connection ID and node ID,
	  // which will only conflict if the same node is added to the same connection
	  // twice. This is acceptable since the `insertEdge*` functions ignore
	  // duplicates.


	  var edgeID = __webpack_require__(11)(record.getDataID(), node.getDataID());
	  var edge = store.get(edgeID);
	  if (!edge) {
	    edge = store.create(edgeID, edgeType);
	  }
	  edge.setLinkedRecord(node, NODE);
	  return edge;
	}

	/**
	 * @public
	 *
	 * Inserts an edge before the given cursor, or at the beginning of the list if
	 * no cursor is provided.
	 *
	 * Example:
	 *
	 * Given that data has already been fetched on some user `<id>` on the `friends`
	 * field:
	 *
	 * ```
	 * fragment FriendsFragment on User {
	 *   friends(first: 10) @connection(key: "FriendsFragment_friends") {
	 *    edges {
	 *      node {
	 *        id
	 *        }
	 *      }
	 *   }
	 * }
	 * ```
	 *
	 * An edge can be prepended with:
	 *
	 * ```
	 * store => {
	 *   const user = store.get('<id>');
	 *   const friends = RelayConnectionHandler.getConnection(user, 'FriendsFragment_friends');
	 *   const edge = store.create('<edge-id>', 'FriendsEdge');
	 *   RelayConnectionHandler.insertEdgeBefore(friends, edge);
	 * }
	 * ```
	 */
	function insertEdgeBefore(record, newEdge, cursor) {
	  var _RelayConnectionInter4 = __webpack_require__(10).get(),
	      CURSOR = _RelayConnectionInter4.CURSOR,
	      EDGES = _RelayConnectionInter4.EDGES;

	  var edges = record.getLinkedRecords(EDGES);
	  if (!edges) {
	    record.setLinkedRecords([newEdge], EDGES);
	    return;
	  }
	  var nextEdges = void 0;
	  if (cursor == null) {
	    nextEdges = [newEdge].concat(edges);
	  } else {
	    nextEdges = [];
	    var foundCursor = false;
	    for (var ii = 0; ii < edges.length; ii++) {
	      var edge = edges[ii];
	      if (edge != null) {
	        var edgeCursor = edge.getValue(CURSOR);
	        if (cursor === edgeCursor) {
	          nextEdges.push(newEdge);
	          foundCursor = true;
	        }
	      }
	      nextEdges.push(edge);
	    }
	    if (!foundCursor) {
	      nextEdges.unshift(newEdge);
	    }
	  }
	  record.setLinkedRecords(nextEdges, EDGES);
	}

	/**
	 * @public
	 *
	 * Remove any edges whose `node.id` matches the given id.
	 */
	function deleteNode(record, nodeID) {
	  var _RelayConnectionInter5 = __webpack_require__(10).get(),
	      EDGES = _RelayConnectionInter5.EDGES,
	      NODE = _RelayConnectionInter5.NODE;

	  var edges = record.getLinkedRecords(EDGES);
	  if (!edges) {
	    return;
	  }
	  var nextEdges = void 0;
	  for (var ii = 0; ii < edges.length; ii++) {
	    var edge = edges[ii];
	    var node = edge && edge.getLinkedRecord(NODE);
	    if (node != null && node.getDataID() === nodeID) {
	      if (nextEdges === undefined) {
	        nextEdges = edges.slice(0, ii);
	      }
	    } else if (nextEdges !== undefined) {
	      nextEdges.push(edge);
	    }
	  }
	  if (nextEdges !== undefined) {
	    record.setLinkedRecords(nextEdges, EDGES);
	  }
	}

	/**
	 * @internal
	 *
	 * Creates a copy of an edge with a unique ID based on per-connection-instance
	 * incrementing edge index. This is necessary to avoid collisions between edges,
	 * which can occur because (edge) client IDs are assigned deterministically
	 * based on the path from the nearest node with an id.
	 *
	 * Example: if the first N edges of the same connection are refetched, the edges
	 * from the second fetch will be assigned the same IDs as the first fetch, even
	 * though the nodes they point to may be different (or the same and in different
	 * order).
	 */
	function buildConnectionEdge(store, connection, edge) {
	  if (edge == null) {
	    return edge;
	  }

	  var _RelayConnectionInter6 = __webpack_require__(10).get(),
	      EDGES = _RelayConnectionInter6.EDGES;

	  var edgeIndex = connection.getValue(NEXT_EDGE_INDEX);
	  __webpack_require__(1)(typeof edgeIndex === 'number', 'RelayConnectionHandler: Expected %s to be a number, got `%s`.', NEXT_EDGE_INDEX, edgeIndex);
	  var edgeID = __webpack_require__(11)(connection.getDataID(), EDGES, edgeIndex);
	  var connectionEdge = store.create(edgeID, edge.getType());
	  connectionEdge.copyFieldsFrom(edge);
	  connection.setValue(edgeIndex + 1, NEXT_EDGE_INDEX);
	  return connectionEdge;
	}

	/**
	 * @internal
	 *
	 * Adds the source edges to the target edges, skipping edges with
	 * duplicate cursors or node ids.
	 */
	function mergeEdges(sourceEdges, targetEdges, nodeIDs) {
	  var _RelayConnectionInter7 = __webpack_require__(10).get(),
	      NODE = _RelayConnectionInter7.NODE;

	  for (var ii = 0; ii < sourceEdges.length; ii++) {
	    var edge = sourceEdges[ii];
	    if (!edge) {
	      continue;
	    }
	    var node = edge.getLinkedRecord(NODE);
	    var nodeID = node && node.getValue('id');
	    if (nodeID) {
	      if (nodeIDs.has(nodeID)) {
	        continue;
	      }
	      nodeIDs.add(nodeID);
	    }
	    targetEdges.push(edge);
	  }
	}

	module.exports = {
	  buildConnectionEdge: buildConnectionEdge,
	  createEdge: createEdge,
	  deleteNode: deleteNode,
	  getConnection: getConnection,
	  insertEdgeAfter: insertEdgeAfter,
	  insertEdgeBefore: insertEdgeBefore,
	  update: update
	};

/***/ }),
/* 10 */
/***/ (function(module, exports, __webpack_require__) {

	/**
	 * Copyright (c) 2013-present, Facebook, Inc.
	 *
	 * This source code is licensed under the MIT license found in the
	 * LICENSE file in the root directory of this source tree.
	 *
	 * @providesModule RelayConnectionInterface
	 * 
	 * @format
	 */

	'use strict';

	var _defineProperty3 = _interopRequireDefault(__webpack_require__(63));

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

	var CONNECTION_CALLS = {
	  after: true,
	  before: true,
	  find: true,
	  first: true,
	  last: true,
	  surrounds: true
	};

	var REQUIRED_RANGE_CALLS = {
	  find: true,
	  first: true,
	  last: true
	};

	var config = {
	  CLIENT_MUTATION_ID: 'clientMutationId',
	  CURSOR: 'cursor',
	  /**
	   * Whether `edges` fields are expected to have `source` fields.
	   */
	  EDGES_HAVE_SOURCE_FIELD: false,
	  EDGES: 'edges',
	  END_CURSOR: 'endCursor',
	  HAS_NEXT_PAGE: 'hasNextPage',
	  HAS_PREV_PAGE: 'hasPreviousPage',
	  NODE: 'node',
	  PAGE_INFO_TYPE: 'PageInfo',
	  PAGE_INFO: 'pageInfo',
	  START_CURSOR: 'startCursor'
	};

	/**
	 * @internal
	 *
	 * Defines logic relevant to the informal "Connection" GraphQL interface.
	 */
	var RelayConnectionInterface = {
	  inject: function inject(newConfig) {
	    config = newConfig;
	  },
	  get: function get() {
	    return config;
	  },


	  /**
	   * Checks whether a call exists strictly to encode which parts of a connection
	   * to fetch. Fields that only differ by connection call values should have the
	   * same identity.
	   */
	  isConnectionCall: function isConnectionCall(call) {
	    return CONNECTION_CALLS.hasOwnProperty(call.name);
	  },


	  /**
	   * Checks whether a set of calls on a connection supply enough information to
	   * fetch the range fields (i.e. `edges` and `page_info`).
	   */
	  hasRangeCalls: function hasRangeCalls(calls) {
	    return calls.some(function (call) {
	      return REQUIRED_RANGE_CALLS.hasOwnProperty(call.name);
	    });
	  },


	  /**
	   * Gets a default record representing a connection's `PAGE_INFO`.
	   */
	  getDefaultPageInfo: function getDefaultPageInfo() {
	    var _ref;

	    return _ref = {}, (0, _defineProperty3['default'])(_ref, config.END_CURSOR, undefined), (0, _defineProperty3['default'])(_ref, config.HAS_NEXT_PAGE, false), (0, _defineProperty3['default'])(_ref, config.HAS_PREV_PAGE, false), (0, _defineProperty3['default'])(_ref, config.START_CURSOR, undefined), _ref;
	  }
	};

	module.exports = RelayConnectionInterface;

/***/ }),
/* 11 */
/***/ (function(module, exports) {

	/**
	 * Copyright (c) 2013-present, Facebook, Inc.
	 *
	 * This source code is licensed under the MIT license found in the
	 * LICENSE file in the root directory of this source tree.
	 *
	 * @providesModule generateRelayClientID
	 * 
	 * @format
	 */

	'use strict';

	var PREFIX = 'client:';

	function generateRelayClientID(id, storageKey, index) {
	  var key = id + ':' + storageKey;
	  if (index != null) {
	    key += ':' + index;
	  }
	  if (key.indexOf(PREFIX) !== 0) {
	    key = PREFIX + key;
	  }
	  return key;
	}

	module.exports = generateRelayClientID;

/***/ }),
/* 12 */
/***/ (function(module, exports, __webpack_require__) {

	/**
	 * Copyright (c) 2013-present, Facebook, Inc.
	 *
	 * This source code is licensed under the MIT license found in the
	 * LICENSE file in the root directory of this source tree.
	 *
	 * @providesModule RelayInMemoryRecordSource
	 * 
	 * @format
	 */

	'use strict';

	var _classCallCheck3 = _interopRequireDefault(__webpack_require__(6));

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

	var EXISTENT = __webpack_require__(14).EXISTENT,
	    NONEXISTENT = __webpack_require__(14).NONEXISTENT,
	    UNKNOWN = __webpack_require__(14).UNKNOWN;

	/**
	 * An implementation of the `MutableRecordSource` interface (defined in
	 * `RelayStoreTypes`) that holds all records in memory.
	 */


	var RelayInMemoryRecordSource = function () {
	  function RelayInMemoryRecordSource(records) {
	    (0, _classCallCheck3['default'])(this, RelayInMemoryRecordSource);

	    this._records = records || {};
	  }

	  RelayInMemoryRecordSource.prototype.clear = function clear() {
	    this._records = {};
	  };

	  RelayInMemoryRecordSource.prototype['delete'] = function _delete(dataID) {
	    this._records[dataID] = null;
	  };

	  RelayInMemoryRecordSource.prototype.get = function get(dataID) {
	    return this._records[dataID];
	  };

	  RelayInMemoryRecordSource.prototype.getRecordIDs = function getRecordIDs() {
	    return Object.keys(this._records);
	  };

	  RelayInMemoryRecordSource.prototype.getStatus = function getStatus(dataID) {
	    if (!this._records.hasOwnProperty(dataID)) {
	      return UNKNOWN;
	    }
	    return this._records[dataID] == null ? NONEXISTENT : EXISTENT;
	  };

	  RelayInMemoryRecordSource.prototype.has = function has(dataID) {
	    return this._records.hasOwnProperty(dataID);
	  };

	  RelayInMemoryRecordSource.prototype.load = function load(dataID, callback) {
	    callback(null, this.get(dataID));
	  };

	  RelayInMemoryRecordSource.prototype.remove = function remove(dataID) {
	    delete this._records[dataID];
	  };

	  RelayInMemoryRecordSource.prototype.set = function set(dataID, record) {
	    this._records[dataID] = record;
	  };

	  RelayInMemoryRecordSource.prototype.size = function size() {
	    return Object.keys(this._records).length;
	  };

	  RelayInMemoryRecordSource.prototype.toJSON = function toJSON() {
	    return this._records;
	  };

	  return RelayInMemoryRecordSource;
	}();

	module.exports = RelayInMemoryRecordSource;

/***/ }),
/* 13 */
/***/ (function(module, exports) {

	module.exports = __WEBPACK_EXTERNAL_MODULE_13__;

/***/ }),
/* 14 */
/***/ (function(module, exports) {

	/**
	 * Copyright (c) 2013-present, Facebook, Inc.
	 *
	 * This source code is licensed under the MIT license found in the
	 * LICENSE file in the root directory of this source tree.
	 *
	 * @providesModule RelayRecordState
	 * 
	 * @format
	 */

	'use strict';

	var RelayRecordState = {
	  /**
	   * Record exists (either fetched from the server or produced by a local,
	   * optimistic update).
	   */
	  EXISTENT: 'EXISTENT',

	  /**
	   * Record is known not to exist (either as the result of a mutation, or
	   * because the server returned `null` when queried for the record).
	   */
	  NONEXISTENT: 'NONEXISTENT',

	  /**
	   * Record State is unknown because it has not yet been fetched from the
	   * server.
	   */
	  UNKNOWN: 'UNKNOWN'
	};

	module.exports = RelayRecordState;

/***/ }),
/* 15 */
/***/ (function(module, exports, __webpack_require__) {

	/**
	 * Copyright (c) 2013-present, Facebook, Inc.
	 *
	 * This source code is licensed under the MIT license found in the
	 * LICENSE file in the root directory of this source tree.
	 *
	 * @providesModule normalizeRelayPayload
	 * 
	 * @format
	 */

	'use strict';

	var _require = __webpack_require__(4),
	    ROOT_ID = _require.ROOT_ID,
	    ROOT_TYPE = _require.ROOT_TYPE;

	function normalizeRelayPayload(selector, payload, errors) {
	  var options = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : { handleStrippedNulls: false };

	  var source = new (__webpack_require__(12))();
	  source.set(ROOT_ID, __webpack_require__(2).create(ROOT_ID, ROOT_TYPE));
	  var fieldPayloads = __webpack_require__(52).normalize(source, selector, payload, options);
	  return {
	    errors: errors,
	    fieldPayloads: fieldPayloads,
	    source: source
	  };
	}

	module.exports = normalizeRelayPayload;

/***/ }),
/* 16 */
/***/ (function(module, exports, __webpack_require__) {

	/**
	 * Copyright (c) 2013-present, Facebook, Inc.
	 *
	 * This source code is licensed under the MIT license found in the
	 * LICENSE file in the root directory of this source tree.
	 *
	 * @providesModule RelayModernGraphQLTag
	 * 
	 * @format
	 */

	'use strict';

	/**
	 * Runtime function to correspond to the `graphql` tagged template function.
	 * All calls to this function should be transformed by the plugin.
	 */


	// The type of a graphql`...` tagged template expression.
	function graphql(strings) {
	  __webpack_require__(1)(false, 'graphql: Unexpected invocation at runtime. Either the Babel transform ' + 'was not set up, or it failed to identify this call site. Make sure it ' + 'is being used verbatim as `graphql`.');
	}

	/**
	 * Variant of the `graphql` tag that enables experimental features.
	 */
	graphql.experimental = function (strings) {
	  __webpack_require__(1)(false, 'graphql.experimental: Unexpected invocation at runtime. Either the ' + 'Babel transform was not set up, or it failed to identify this call ' + 'site. Make sure it is being used verbatim as `graphql`.');
	};

	function getNode(taggedNode) {
	  var fn = typeof taggedNode === 'function' ? taggedNode : taggedNode.modern;
	  // Support for classic raw nodes (used in test mock)
	  if (typeof fn !== 'function') {
	    return taggedNode;
	  }
	  return fn();
	}

	function getFragment(taggedNode) {
	  var fragment = getNode(taggedNode);
	  __webpack_require__(1)(typeof fragment === 'object' && fragment !== null && fragment.kind === 'Fragment', 'RelayModernGraphQLTag: Expected a fragment, got `%s`.', JSON.stringify(fragment));
	  return fragment;
	}

	function getOperation(taggedNode) {
	  var operation = getNode(taggedNode);
	  __webpack_require__(1)(typeof operation === 'object' && operation !== null && operation.kind === 'Batch', 'RelayModernGraphQLTag: Expected an operation, got `%s`.', JSON.stringify(operation));
	  return operation;
	}

	module.exports = {
	  getFragment: getFragment,
	  getOperation: getOperation,
	  graphql: graphql
	};

/***/ }),
/* 17 */
/***/ (function(module, exports, __webpack_require__) {

	/**
	 * Copyright (c) 2013-present, Facebook, Inc.
	 *
	 * This source code is licensed under the MIT license found in the
	 * LICENSE file in the root directory of this source tree.
	 *
	 * @providesModule RelayObservable
	 * 
	 * @format
	 */

	'use strict';

	var _classCallCheck3 = _interopRequireDefault(__webpack_require__(6));

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

	// Note: This should accept Subscribable<T> instead of RelayObservable<T>,
	// however Flow cannot yet distinguish it from T.
	var hostReportError = swallowError;

	/**
	 * Limited implementation of ESObservable, providing the limited set of behavior
	 * Relay networking requires.
	 *
	 * Observables retain the benefit of callbacks which can be called
	 * synchronously, avoiding any UI jitter, while providing a compositional API,
	 * which simplifies logic and prevents mishandling of errors compared to
	 * the direct use of callback functions.
	 *
	 * ESObservable: https://github.com/tc39/proposal-observable
	 */

	var RelayObservable = function () {
	  function RelayObservable(source) {
	    (0, _classCallCheck3['default'])(this, RelayObservable);

	    if (true) {
	      // Early runtime errors for ill-formed sources.
	      if (!source || typeof source !== 'function') {
	        throw new Error('Source must be a Function: ' + String(source));
	      }
	    }
	    this._source = source;
	  }

	  /**
	   * When an emitted error event is not handled by an Observer, it is reported
	   * to the host environment (what the ESObservable spec refers to as
	   * "HostReportErrors()").
	   *
	   * The default implementation in development rethrows thrown errors, and
	   * logs emitted error events to the console, while in production does nothing
	   * (swallowing unhandled errors).
	   *
	   * Called during application initialization, this method allows
	   * application-specific handling of unhandled errors. Allowing, for example,
	   * integration with error logging or developer tools.
	   *
	   * A second parameter `isUncaughtThrownError` is true when the unhandled error
	   * was thrown within an Observer handler, and false when the unhandled error
	   * was an unhandled emitted event.
	   *
	   *  - Uncaught thrown errors typically represent avoidable errors thrown from
	   *    application code, which should be handled with a try/catch block, and
	   *    usually have useful stack traces.
	   *
	   *  - Unhandled emitted event errors typically represent unavoidable events in
	   *    application flow such as network failure, and may not have useful
	   *    stack traces.
	   */


	  RelayObservable.onUnhandledError = function onUnhandledError(callback) {
	    hostReportError = callback;
	  };

	  /**
	   * Accepts various kinds of data sources, and always returns a RelayObservable
	   * useful for accepting the result of a user-provided FetchFunction.
	   */


	  RelayObservable.from = function from(obj) {
	    return isObservable(obj) ? fromObservable(obj) : __webpack_require__(58)(obj) ? fromPromise(obj) : fromValue(obj);
	  };

	  /**
	   * Creates a RelayObservable, given a function which expects a legacy
	   * Relay Observer as the last argument and which returns a Disposable.
	   *
	   * To support migration to Observable, the function may ignore the
	   * legacy Relay observer and directly return an Observable instead.
	   */


	  RelayObservable.fromLegacy = function fromLegacy(callback) {
	    return new RelayObservable(function (sink) {
	      var result = callback({
	        onNext: sink.next,
	        onError: sink.error,
	        onCompleted: sink.complete
	      });
	      return isObservable(result) ? result.subscribe(sink) : function () {
	        return result.dispose();
	      };
	    });
	  };

	  /**
	   * Similar to promise.catch(), observable.catch() handles error events, and
	   * provides an alternative observable to use in it's place.
	   *
	   * If the catch handler throws a new error, it will appear as an error event
	   * on the resulting Observable.
	   */


	  RelayObservable.prototype['catch'] = function _catch(fn) {
	    var _this = this;

	    return new RelayObservable(function (sink) {
	      var subscription = void 0;
	      _this.subscribe({
	        start: function start(sub) {
	          subscription = sub;
	        },
	        next: sink.next,
	        complete: sink.complete,
	        error: function (_error2) {
	          function error(_x) {
	            return _error2.apply(this, arguments);
	          }

	          error.toString = function () {
	            return _error2.toString();
	          };

	          return error;
	        }(function (error) {
	          try {
	            fn(error).subscribe({
	              start: function start(sub) {
	                subscription = sub;
	              },
	              next: sink.next,
	              complete: sink.complete,
	              error: sink.error
	            });
	          } catch (error2) {
	            sink.error(error2, true /* isUncaughtThrownError */);
	          }
	        })
	      });
	      return function () {
	        return subscription.unsubscribe();
	      };
	    });
	  };

	  /**
	   * Returns a new Observable which returns the same values as this one, but
	   * modified so that the provided Observer is called to perform a side-effects
	   * for all events emitted by the source.
	   *
	   * Any errors that are thrown in the side-effect Observer are unhandled, and
	   * do not affect the source Observable or its Observer.
	   *
	   * This is useful for when debugging your Observables or performing other
	   * side-effects such as logging or performance monitoring.
	   */


	  RelayObservable.prototype['do'] = function _do(observer) {
	    var _this2 = this;

	    return new RelayObservable(function (sink) {
	      var both = function both(action) {
	        return function () {
	          try {
	            observer[action] && observer[action].apply(observer, arguments);
	          } catch (error) {
	            hostReportError(error, true /* isUncaughtThrownError */);
	          }
	          sink[action] && sink[action].apply(sink, arguments);
	        };
	      };
	      return _this2.subscribe({
	        start: both('start'),
	        next: both('next'),
	        error: both('error'),
	        complete: both('complete'),
	        unsubscribe: both('unsubscribe')
	      });
	    });
	  };

	  /**
	   * Returns a new Observable which returns the same values as this one, but
	   * modified so that the finally callback is performed after completion,
	   * whether normal or due to error or unsubscription.
	   *
	   * This is useful for cleanup such as resource finalization.
	   */


	  RelayObservable.prototype['finally'] = function _finally(fn) {
	    var _this3 = this;

	    return new RelayObservable(function (sink) {
	      var subscription = _this3.subscribe(sink);
	      return function () {
	        subscription.unsubscribe();
	        fn();
	      };
	    });
	  };

	  /**
	   * Returns a new Observable which is identical to this one, unless this
	   * Observable completes before yielding any values, in which case the new
	   * Observable will yield the values from the alternate Observable.
	   *
	   * If this Observable does yield values, the alternate is never subscribed to.
	   *
	   * This is useful for scenarios where values may come from multiple sources
	   * which should be tried in order, i.e. from a cache before a network.
	   */


	  RelayObservable.prototype.ifEmpty = function ifEmpty(alternate) {
	    var _this4 = this;

	    return new RelayObservable(function (sink) {
	      var hasValue = false;
	      var current = _this4.subscribe({
	        next: function next(value) {
	          hasValue = true;
	          sink.next(value);
	        },

	        error: sink.error,
	        complete: function complete() {
	          if (hasValue) {
	            sink.complete();
	          } else {
	            current = alternate.subscribe(sink);
	          }
	        }
	      });
	      return function () {
	        current.unsubscribe();
	      };
	    });
	  };

	  /**
	   * Observable's primary API: returns an unsubscribable Subscription to the
	   * source of this Observable.
	   */


	  RelayObservable.prototype.subscribe = function subscribe(observer) {
	    if (true) {
	      // Early runtime errors for ill-formed observers.
	      if (!observer || typeof observer !== 'object') {
	        throw new Error('Observer must be an Object with callbacks: ' + String(observer));
	      }
	    }
	    return _subscribe(this._source, observer);
	  };

	  /**
	   * Supports subscription of a legacy Relay Observer, returning a Disposable.
	   */


	  RelayObservable.prototype.subscribeLegacy = function subscribeLegacy(legacyObserver) {
	    var subscription = this.subscribe({
	      next: legacyObserver.onNext,
	      error: legacyObserver.onError,
	      complete: legacyObserver.onCompleted
	    });
	    return {
	      dispose: subscription.unsubscribe
	    };
	  };

	  /**
	   * Returns a new Observerable where each value has been transformed by
	   * the mapping function.
	   */


	  RelayObservable.prototype.map = function map(fn) {
	    return this.mergeMap(function (value) {
	      return fromValue(fn(value));
	    });
	  };

	  /**
	   * Returns a new Observable where each value is replaced with a new Observable
	   * by the mapping function, the results of which returned as a single
	   * merged Observable.
	   */


	  RelayObservable.prototype.mergeMap = function mergeMap(fn) {
	    var _this5 = this;

	    return new RelayObservable(function (sink) {
	      var subscriptions = [];

	      function start(subscription) {
	        this._sub = subscription;
	        subscriptions.push(subscription);
	      }

	      function complete() {
	        subscriptions.splice(subscriptions.indexOf(this._sub), 1);
	        if (subscriptions.length === 0) {
	          sink.complete();
	        }
	      }

	      _this5.subscribe({
	        start: start,
	        next: function next(value) {
	          try {
	            if (!sink.closed) {
	              RelayObservable.from(fn(value)).subscribe({
	                start: start,
	                next: sink.next,
	                error: sink.error,
	                complete: complete
	              });
	            }
	          } catch (error) {
	            sink.error(error, true /* isUncaughtThrownError */);
	          }
	        },

	        error: sink.error,
	        complete: complete
	      });

	      return function () {
	        subscriptions.forEach(function (sub) {
	          return sub.unsubscribe();
	        });
	        subscriptions.length = 0;
	      };
	    });
	  };

	  /**
	   * Returns a new Observable which first mirrors this Observable, then when it
	   * completes, waits for `pollInterval` milliseconds before re-subscribing to
	   * this Observable again, looping in this manner until unsubscribed.
	   *
	   * The returned Observable never completes.
	   */


	  RelayObservable.prototype.poll = function poll(pollInterval) {
	    var _this6 = this;

	    if (true) {
	      if (typeof pollInterval !== 'number' || pollInterval <= 0) {
	        throw new Error('RelayObservable: Expected pollInterval to be positive, got: ' + pollInterval);
	      }
	    }
	    return new RelayObservable(function (sink) {
	      var subscription = void 0;
	      var timeout = void 0;
	      var poll = function poll() {
	        subscription = _this6.subscribe({
	          next: sink.next,
	          error: sink.error,
	          complete: function complete() {
	            timeout = setTimeout(poll, pollInterval);
	          }
	        });
	      };
	      poll();
	      return function () {
	        clearTimeout(timeout);
	        subscription.unsubscribe();
	      };
	    });
	  };

	  /**
	   * Returns a Promise which resolves when this Observable yields a first value
	   * or when it completes with no value.
	   */


	  RelayObservable.prototype.toPromise = function toPromise() {
	    var _this7 = this;

	    return new Promise(function (resolve, reject) {
	      var subscription = void 0;
	      _this7.subscribe({
	        start: function start(sub) {
	          subscription = sub;
	        },
	        next: function next(val) {
	          resolve(val);
	          subscription.unsubscribe();
	        },

	        error: reject,
	        complete: resolve
	      });
	    });
	  };

	  return RelayObservable;
	}();

	// Use declarations to teach Flow how to check isObservable.


	// prettier-ignore
	function isObservable(obj) {
	  return typeof obj === 'object' && obj !== null && typeof obj.subscribe === 'function';
	}

	function fromObservable(obj) {
	  return obj instanceof RelayObservable ? obj : new RelayObservable(function (sink) {
	    return obj.subscribe(sink);
	  });
	}

	function fromPromise(promise) {
	  return new RelayObservable(function (sink) {
	    // Since sink methods do not throw, the resulting Promise can be ignored.
	    promise.then(function (value) {
	      sink.next(value);
	      sink.complete();
	    }, sink.error);
	  });
	}

	function fromValue(value) {
	  return new RelayObservable(function (sink) {
	    sink.next(value);
	    sink.complete();
	  });
	}

	function _subscribe(source, observer) {
	  var closed = false;
	  var cleanup = void 0;

	  // Ideally we would simply describe a `get closed()` method on the Sink and
	  // Subscription objects below, however not all flow environments we expect
	  // Relay to be used within will support property getters, and many minifier
	  // tools still do not support ES5 syntax. Instead, we can use defineProperty.
	  var withClosed = function withClosed(obj) {
	    return Object.defineProperty(obj, 'closed', { get: function get() {
	        return closed;
	      } });
	  };

	  function doCleanup() {
	    if (cleanup) {
	      if (cleanup.unsubscribe) {
	        cleanup.unsubscribe();
	      } else {
	        try {
	          cleanup();
	        } catch (error) {
	          hostReportError(error, true /* isUncaughtThrownError */);
	        }
	      }
	      cleanup = undefined;
	    }
	  }

	  // Create a Subscription.
	  var subscription = withClosed({
	    unsubscribe: function unsubscribe() {
	      if (!closed) {
	        closed = true;

	        // Tell Observer that unsubscribe was called.
	        try {
	          observer.unsubscribe && observer.unsubscribe(subscription);
	        } catch (error) {
	          hostReportError(error, true /* isUncaughtThrownError */);
	        } finally {
	          doCleanup();
	        }
	      }
	    }
	  });

	  // Tell Observer that observation is about to begin.
	  try {
	    observer.start && observer.start(subscription);
	  } catch (error) {
	    hostReportError(error, true /* isUncaughtThrownError */);
	  }

	  // If closed already, don't bother creating a Sink.
	  if (closed) {
	    return subscription;
	  }

	  // Create a Sink respecting subscription state and cleanup.
	  var sink = withClosed({
	    next: function next(value) {
	      if (!closed && observer.next) {
	        try {
	          observer.next(value);
	        } catch (error) {
	          hostReportError(error, true /* isUncaughtThrownError */);
	        }
	      }
	    },
	    error: function (_error3) {
	      function error(_x2, _x3) {
	        return _error3.apply(this, arguments);
	      }

	      error.toString = function () {
	        return _error3.toString();
	      };

	      return error;
	    }(function (error, isUncaughtThrownError) {
	      if (closed || !observer.error) {
	        closed = true;
	        hostReportError(error, isUncaughtThrownError || false);
	        doCleanup();
	      } else {
	        closed = true;
	        try {
	          observer.error(error);
	        } catch (error2) {
	          hostReportError(error2, true /* isUncaughtThrownError */);
	        } finally {
	          doCleanup();
	        }
	      }
	    }),
	    complete: function complete() {
	      if (!closed) {
	        closed = true;
	        try {
	          observer.complete && observer.complete();
	        } catch (error) {
	          hostReportError(error, true /* isUncaughtThrownError */);
	        } finally {
	          doCleanup();
	        }
	      }
	    }
	  });

	  // If anything goes wrong during observing the source, handle the error.
	  try {
	    cleanup = source(sink);
	  } catch (error) {
	    sink.error(error, true /* isUncaughtThrownError */);
	  }

	  if (true) {
	    // Early runtime errors for ill-formed returned cleanup.
	    if (cleanup !== undefined && typeof cleanup !== 'function' && (!cleanup || typeof cleanup.unsubscribe !== 'function')) {
	      throw new Error('Returned cleanup function which cannot be called: ' + String(cleanup));
	    }
	  }

	  // If closed before the source function existed, cleanup now.
	  if (closed) {
	    doCleanup();
	  }

	  return subscription;
	}

	function swallowError(_error, _isUncaughtThrownError) {
	  // do nothing.
	}

	if (true) {
	  // Default implementation of HostReportErrors() in development builds.
	  // Can be replaced by the host application environment.
	  RelayObservable.onUnhandledError(function (error, isUncaughtThrownError) {
	    if (typeof fail === 'function') {
	      // In test environments (Jest), fail() immediately fails the current test.
	      fail(String(error));
	    } else if (isUncaughtThrownError) {
	      // Rethrow uncaught thrown errors on the next frame to avoid breaking
	      // current logic.
	      setTimeout(function () {
	        throw error;
	      });
	    } else if (typeof console !== 'undefined') {
	      // Otherwise, log the unhandled error for visibility.
	      // eslint-ignore-next-line no-console
	      console.error('RelayObservable: Unhandled Error', error);
	    }
	  });
	}

	module.exports = RelayObservable;

/***/ }),
/* 18 */
/***/ (function(module, exports, __webpack_require__) {

	/**
	 * Copyright (c) 2013-present, Facebook, Inc.
	 *
	 * This source code is licensed under the MIT license found in the
	 * LICENSE file in the root directory of this source tree.
	 *
	 * @providesModule RelayRecordSourceMutator
	 * 
	 * @format
	 */

	'use strict';

	var _extends3 = _interopRequireDefault(__webpack_require__(13));

	var _classCallCheck3 = _interopRequireDefault(__webpack_require__(6));

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

	var _require = __webpack_require__(14),
	    EXISTENT = _require.EXISTENT;

	var _require2 = __webpack_require__(4),
	    UNPUBLISH_FIELD_SENTINEL = _require2.UNPUBLISH_FIELD_SENTINEL,
	    UNPUBLISH_RECORD_SENTINEL = _require2.UNPUBLISH_RECORD_SENTINEL;

	/**
	 * @internal
	 *
	 * Wrapper API that is an amalgam of the `RelayModernRecord` API and
	 * `MutableRecordSource` interface, implementing copy-on-write semantics for
	 * records in a record source. If a `backup` is supplied, the mutator will
	 * ensure that the backup contains sufficient information to revert all
	 * modifications by publishing the backup.
	 *
	 * Modifications are applied to fresh copies of records with optional backups
	 * created:
	 * - Records in `base` are never modified.
	 * - Modifications cause a fresh version of a record to be created in `sink`.
	 *   These sink records contain only modified fields.
	 * - If a `backup` is supplied, any modifications to a record will cause the
	 *   sink version of the record to be added to the backup.
	 * - Creation of a record causes a sentinel object to be added to the backup
	 *   so that the new record can be removed from the store by publishing the
	 *   backup.
	 */
	var RelayRecordSourceMutator = function () {
	  function RelayRecordSourceMutator(base, sink, backup) {
	    (0, _classCallCheck3['default'])(this, RelayRecordSourceMutator);

	    this._backup = backup;
	    this._base = base;
	    this._sink = sink;
	    this.__sources = [sink, base];
	  }

	  RelayRecordSourceMutator.prototype._createBackupRecord = function _createBackupRecord(dataID) {
	    var backup = this._backup;
	    if (backup && !backup.has(dataID)) {
	      var baseRecord = this._base.get(dataID);
	      if (baseRecord != null) {
	        backup.set(dataID, baseRecord);
	      } else if (baseRecord === null) {
	        backup['delete'](dataID);
	      }
	    }
	  };

	  RelayRecordSourceMutator.prototype._setSentinelFieldsInBackupRecord = function _setSentinelFieldsInBackupRecord(dataID, record) {
	    var backup = this._backup;
	    if (backup) {
	      var backupRecord = backup.get(dataID);
	      if (backupRecord && backupRecord !== UNPUBLISH_RECORD_SENTINEL) {
	        var copy = null;
	        for (var key in record) {
	          if (record.hasOwnProperty(key)) {
	            if (!(key in backupRecord)) {
	              copy = copy || (0, _extends3['default'])({}, backupRecord);
	              copy[key] = UNPUBLISH_FIELD_SENTINEL;
	            }
	          }
	        }
	        backup.set(dataID, copy || backupRecord);
	      }
	    }
	  };

	  RelayRecordSourceMutator.prototype._setSentinelFieldInBackupRecord = function _setSentinelFieldInBackupRecord(dataID, storageKey) {
	    var backup = this._backup;
	    if (backup) {
	      var backupRecord = backup.get(dataID);
	      if (backupRecord && backupRecord !== UNPUBLISH_RECORD_SENTINEL && !(storageKey in backupRecord)) {
	        var copy = (0, _extends3['default'])({}, backupRecord);
	        __webpack_require__(2).setValue(copy, storageKey, UNPUBLISH_FIELD_SENTINEL);
	        backup.set(dataID, copy);
	      }
	    }
	  };

	  RelayRecordSourceMutator.prototype._getSinkRecord = function _getSinkRecord(dataID) {
	    var sinkRecord = this._sink.get(dataID);
	    if (!sinkRecord) {
	      var baseRecord = this._base.get(dataID);
	      __webpack_require__(1)(baseRecord, 'RelayRecordSourceMutator: Cannot modify non-existent record `%s`.', dataID);
	      sinkRecord = __webpack_require__(2).create(dataID, __webpack_require__(2).getType(baseRecord));
	      this._sink.set(dataID, sinkRecord);
	    }
	    return sinkRecord;
	  };

	  RelayRecordSourceMutator.prototype.copyFields = function copyFields(sourceID, sinkID) {
	    var sinkSource = this._sink.get(sourceID);
	    var baseSource = this._base.get(sourceID);
	    __webpack_require__(1)(sinkSource || baseSource, 'RelayRecordSourceMutator#copyFields(): Cannot copy fields from ' + 'non-existent record `%s`.', sourceID);
	    this._createBackupRecord(sinkID);
	    var sink = this._getSinkRecord(sinkID);
	    if (baseSource) {
	      __webpack_require__(2).copyFields(baseSource, sink);
	    }
	    if (sinkSource) {
	      __webpack_require__(2).copyFields(sinkSource, sink);
	    }
	    this._setSentinelFieldsInBackupRecord(sinkID, sink);
	  };

	  RelayRecordSourceMutator.prototype.copyFieldsFromRecord = function copyFieldsFromRecord(record, sinkID) {
	    this.copyFields(__webpack_require__(2).getDataID(record), sinkID);
	    var sink = this._getSinkRecord(sinkID);
	    __webpack_require__(2).copyFields(record, sink);
	    this._setSentinelFieldsInBackupRecord(sinkID, sink);
	  };

	  RelayRecordSourceMutator.prototype.create = function create(dataID, typeName) {
	    __webpack_require__(1)(this._base.getStatus(dataID) !== EXISTENT && this._sink.getStatus(dataID) !== EXISTENT, 'RelayRecordSourceMutator#create(): Cannot create a record with id ' + '`%s`, this record already exists.', dataID);
	    if (this._backup) {
	      this._backup.set(dataID, UNPUBLISH_RECORD_SENTINEL);
	    }
	    var record = __webpack_require__(2).create(dataID, typeName);
	    this._sink.set(dataID, record);
	  };

	  RelayRecordSourceMutator.prototype['delete'] = function _delete(dataID) {
	    this._createBackupRecord(dataID);
	    this._sink['delete'](dataID);
	  };

	  RelayRecordSourceMutator.prototype.getStatus = function getStatus(dataID) {
	    return this._sink.has(dataID) ? this._sink.getStatus(dataID) : this._base.getStatus(dataID);
	  };

	  RelayRecordSourceMutator.prototype.getType = function getType(dataID) {
	    for (var ii = 0; ii < this.__sources.length; ii++) {
	      var record = this.__sources[ii].get(dataID);
	      if (record) {
	        return __webpack_require__(2).getType(record);
	      } else if (record === null) {
	        return null;
	      }
	    }
	  };

	  RelayRecordSourceMutator.prototype.getValue = function getValue(dataID, storageKey) {
	    for (var ii = 0; ii < this.__sources.length; ii++) {
	      var record = this.__sources[ii].get(dataID);
	      if (record) {
	        var value = __webpack_require__(2).getValue(record, storageKey);
	        if (value !== undefined) {
	          return value;
	        }
	      } else if (record === null) {
	        return null;
	      }
	    }
	  };

	  RelayRecordSourceMutator.prototype.setValue = function setValue(dataID, storageKey, value) {
	    this._createBackupRecord(dataID);
	    var sinkRecord = this._getSinkRecord(dataID);
	    __webpack_require__(2).setValue(sinkRecord, storageKey, value);
	    this._setSentinelFieldInBackupRecord(dataID, storageKey);
	  };

	  RelayRecordSourceMutator.prototype.getLinkedRecordID = function getLinkedRecordID(dataID, storageKey) {
	    for (var ii = 0; ii < this.__sources.length; ii++) {
	      var record = this.__sources[ii].get(dataID);
	      if (record) {
	        var linkedID = __webpack_require__(2).getLinkedRecordID(record, storageKey);
	        if (linkedID !== undefined) {
	          return linkedID;
	        }
	      } else if (record === null) {
	        return null;
	      }
	    }
	  };

	  RelayRecordSourceMutator.prototype.setLinkedRecordID = function setLinkedRecordID(dataID, storageKey, linkedID) {
	    this._createBackupRecord(dataID);
	    var sinkRecord = this._getSinkRecord(dataID);
	    __webpack_require__(2).setLinkedRecordID(sinkRecord, storageKey, linkedID);
	    this._setSentinelFieldInBackupRecord(dataID, storageKey);
	  };

	  RelayRecordSourceMutator.prototype.getLinkedRecordIDs = function getLinkedRecordIDs(dataID, storageKey) {
	    for (var ii = 0; ii < this.__sources.length; ii++) {
	      var record = this.__sources[ii].get(dataID);
	      if (record) {
	        var linkedIDs = __webpack_require__(2).getLinkedRecordIDs(record, storageKey);
	        if (linkedIDs !== undefined) {
	          return linkedIDs;
	        }
	      } else if (record === null) {
	        return null;
	      }
	    }
	  };

	  RelayRecordSourceMutator.prototype.setLinkedRecordIDs = function setLinkedRecordIDs(dataID, storageKey, linkedIDs) {
	    this._createBackupRecord(dataID);
	    var sinkRecord = this._getSinkRecord(dataID);
	    __webpack_require__(2).setLinkedRecordIDs(sinkRecord, storageKey, linkedIDs);
	    this._setSentinelFieldInBackupRecord(dataID, storageKey);
	  };

	  return RelayRecordSourceMutator;
	}();

	module.exports = RelayRecordSourceMutator;

/***/ }),
/* 19 */
/***/ (function(module, exports) {

	/**
	 * Copyright (c) 2013-present, Facebook, Inc.
	 *
	 * This source code is licensed under the MIT license found in the
	 * LICENSE file in the root directory of this source tree.
	 *
	 * 
	 * @providesModule deepFreeze
	 * @format
	 */

	'use strict';

	/**
	 * Recursively "deep" freezes the supplied object.
	 *
	 * For convenience, and for consistency with the behavior of `Object.freeze`,
	 * returns the now-frozen original object.
	 */

	function deepFreeze(object) {
	  Object.freeze(object);
	  Object.getOwnPropertyNames(object).forEach(function (name) {
	    var property = object[name];
	    if (property && typeof property === 'object' && !Object.isFrozen(property)) {
	      deepFreeze(property);
	    }
	  });
	  return object;
	}

	module.exports = deepFreeze;

/***/ }),
/* 20 */
/***/ (function(module, exports, __webpack_require__) {

	/**
	 * Copyright (c) 2013-present, Facebook, Inc.
	 *
	 * This source code is licensed under the MIT license found in the
	 * LICENSE file in the root directory of this source tree.
	 *
	 * 
	 * @providesModule getRelayHandleKey
	 * @format
	 */

	'use strict';

	var _require = __webpack_require__(40),
	    DEFAULT_HANDLE_KEY = _require.DEFAULT_HANDLE_KEY;

	/**
	 * @internal
	 *
	 * Helper to create a unique name for a handle field based on the handle name, handle key and
	 * source field.
	 */


	function getRelayHandleKey(handleName, key, fieldName) {
	  if (key && key !== DEFAULT_HANDLE_KEY) {
	    return '__' + key + '_' + handleName;
	  }

	  __webpack_require__(1)(fieldName != null, 'getRelayHandleKey: Expected either `fieldName` or `key` in `handle` to be provided');
	  return '__' + fieldName + '_' + handleName;
	}

	module.exports = getRelayHandleKey;

/***/ }),
/* 21 */
/***/ (function(module, exports, __webpack_require__) {

	/**
	 * Copyright (c) 2013-present, Facebook, Inc.
	 *
	 * This source code is licensed under the MIT license found in the
	 * LICENSE file in the root directory of this source tree.
	 *
	 * @providesModule RelayReader
	 * 
	 * @format
	 */

	'use strict';

	var _classCallCheck3 = _interopRequireDefault(__webpack_require__(6));

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

	var CONDITION = __webpack_require__(3).CONDITION,
	    FRAGMENT_SPREAD = __webpack_require__(3).FRAGMENT_SPREAD,
	    INLINE_FRAGMENT = __webpack_require__(3).INLINE_FRAGMENT,
	    LINKED_FIELD = __webpack_require__(3).LINKED_FIELD,
	    SCALAR_FIELD = __webpack_require__(3).SCALAR_FIELD;

	var FRAGMENTS_KEY = __webpack_require__(4).FRAGMENTS_KEY,
	    ID_KEY = __webpack_require__(4).ID_KEY,
	    getArgumentValues = __webpack_require__(4).getArgumentValues,
	    getStorageKey = __webpack_require__(4).getStorageKey;

	function read(recordSource, selector) {
	  var dataID = selector.dataID,
	      node = selector.node,
	      variables = selector.variables;

	  var reader = new RelayReader(recordSource, variables);
	  return reader.read(node, dataID);
	}

	/**
	 * @private
	 */

	var RelayReader = function () {
	  function RelayReader(recordSource, variables) {
	    (0, _classCallCheck3['default'])(this, RelayReader);

	    this._recordSource = recordSource;
	    this._seenRecords = {};
	    this._variables = variables;
	  }

	  RelayReader.prototype.read = function read(node, dataID) {
	    var data = this._traverse(node, dataID, null);
	    return {
	      data: data,
	      dataID: dataID,
	      node: node,
	      seenRecords: this._seenRecords,
	      variables: this._variables
	    };
	  };

	  RelayReader.prototype._traverse = function _traverse(node, dataID, prevData) {
	    var record = this._recordSource.get(dataID);
	    this._seenRecords[dataID] = record;
	    if (record == null) {
	      return record;
	    }
	    var data = prevData || {};
	    this._traverseSelections(node.selections, record, data);
	    return data;
	  };

	  RelayReader.prototype._getVariableValue = function _getVariableValue(name) {
	    __webpack_require__(1)(this._variables.hasOwnProperty(name), 'RelayReader(): Undefined variable `%s`.', name);
	    return this._variables[name];
	  };

	  RelayReader.prototype._traverseSelections = function _traverseSelections(selections, record, data) {
	    var _this = this;

	    selections.forEach(function (selection) {
	      if (selection.kind === SCALAR_FIELD) {
	        _this._readScalar(selection, record, data);
	      } else if (selection.kind === LINKED_FIELD) {
	        if (selection.plural) {
	          _this._readPluralLink(selection, record, data);
	        } else {
	          _this._readLink(selection, record, data);
	        }
	      } else if (selection.kind === CONDITION) {
	        var conditionValue = _this._getVariableValue(selection.condition);
	        if (conditionValue === selection.passingValue) {
	          _this._traverseSelections(selection.selections, record, data);
	        }
	      } else if (selection.kind === INLINE_FRAGMENT) {
	        var typeName = __webpack_require__(2).getType(record);
	        if (typeName != null && typeName === selection.type) {
	          _this._traverseSelections(selection.selections, record, data);
	        }
	      } else if (selection.kind === FRAGMENT_SPREAD) {
	        _this._createFragmentPointer(selection, record, data);
	      } else {
	        __webpack_require__(1)(false, 'RelayReader(): Unexpected ast kind `%s`.', selection.kind);
	      }
	    });
	  };

	  RelayReader.prototype._readScalar = function _readScalar(field, record, data) {
	    var applicationName = field.alias || field.name;
	    var storageKey = getStorageKey(field, this._variables);
	    var value = __webpack_require__(2).getValue(record, storageKey);
	    data[applicationName] = value;
	  };

	  RelayReader.prototype._readLink = function _readLink(field, record, data) {
	    var applicationName = field.alias || field.name;
	    var storageKey = getStorageKey(field, this._variables);
	    var linkedID = __webpack_require__(2).getLinkedRecordID(record, storageKey);

	    if (linkedID == null) {
	      data[applicationName] = linkedID;
	      return;
	    }

	    var prevData = data[applicationName];
	    __webpack_require__(1)(prevData == null || typeof prevData === 'object', 'RelayReader(): Expected data for field `%s` on record `%s` ' + 'to be an object, got `%s`.', applicationName, __webpack_require__(2).getDataID(record), prevData);
	    data[applicationName] = this._traverse(field, linkedID, prevData);
	  };

	  RelayReader.prototype._readPluralLink = function _readPluralLink(field, record, data) {
	    var _this2 = this;

	    var applicationName = field.alias || field.name;
	    var storageKey = getStorageKey(field, this._variables);
	    var linkedIDs = __webpack_require__(2).getLinkedRecordIDs(record, storageKey);

	    if (linkedIDs == null) {
	      data[applicationName] = linkedIDs;
	      return;
	    }

	    var prevData = data[applicationName];
	    __webpack_require__(1)(prevData == null || Array.isArray(prevData), 'RelayReader(): Expected data for field `%s` on record `%s` ' + 'to be an array, got `%s`.', applicationName, __webpack_require__(2).getDataID(record), prevData);
	    var linkedArray = prevData || [];
	    linkedIDs.forEach(function (linkedID, nextIndex) {
	      if (linkedID == null) {
	        linkedArray[nextIndex] = linkedID;
	        return;
	      }
	      var prevItem = linkedArray[nextIndex];
	      __webpack_require__(1)(prevItem == null || typeof prevItem === 'object', 'RelayReader(): Expected data for field `%s` on record `%s` ' + 'to be an object, got `%s`.', applicationName, __webpack_require__(2).getDataID(record), prevItem);
	      var linkedItem = _this2._traverse(field, linkedID, prevItem);
	      linkedArray[nextIndex] = linkedItem;
	    });
	    data[applicationName] = linkedArray;
	  };

	  RelayReader.prototype._createFragmentPointer = function _createFragmentPointer(fragmentSpread, record, data) {
	    var fragmentPointers = data[FRAGMENTS_KEY];
	    if (!fragmentPointers) {
	      fragmentPointers = data[FRAGMENTS_KEY] = {};
	    }
	    __webpack_require__(1)(typeof fragmentPointers === 'object' && fragmentPointers, 'RelayReader: Expected fragment spread data to be an object, got `%s`.', fragmentPointers);
	    data[ID_KEY] = data[ID_KEY] || __webpack_require__(2).getDataID(record);
	    var variables = fragmentSpread.args ? getArgumentValues(fragmentSpread.args, this._variables) : {};
	    fragmentPointers[fragmentSpread.name] = variables;
	  };

	  return RelayReader;
	}();

	module.exports = { read: read };

/***/ }),
/* 22 */
/***/ (function(module, exports, __webpack_require__) {

	/**
	 * Copyright (c) 2013-present, Facebook, Inc.
	 *
	 * This source code is licensed under the MIT license found in the
	 * LICENSE file in the root directory of this source tree.
	 *
	 * @providesModule RelayRecordSourceInspector
	 * 
	 * @format
	 */

	'use strict';

	var _classCallCheck3 = _interopRequireDefault(__webpack_require__(6));

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

	var _require = __webpack_require__(4),
	    ROOT_ID = _require.ROOT_ID,
	    ROOT_TYPE = _require.ROOT_TYPE;

	var _require2 = __webpack_require__(4),
	    REF_KEY = _require2.REF_KEY,
	    REFS_KEY = _require2.REFS_KEY;

	/**
	 * A class intended for introspecting a RecordSource and its Records during
	 * development.
	 */
	var RelayRecordSourceInspector = function () {
	  RelayRecordSourceInspector.getForEnvironment = function getForEnvironment(environment) {
	    return new RelayRecordSourceInspector(environment.getStore().getSource());
	  };

	  function RelayRecordSourceInspector(source) {
	    (0, _classCallCheck3['default'])(this, RelayRecordSourceInspector);

	    this._proxies = {};
	    this._source = source;
	  }

	  /**
	   * Returns an inspector for the record with the given id, or null/undefined if
	   * that record is deleted/unfetched.
	   */


	  RelayRecordSourceInspector.prototype.get = function get(dataID) {
	    if (!this._proxies.hasOwnProperty(dataID)) {
	      var record = this._source.get(dataID);
	      if (record != null) {
	        this._proxies[dataID] = new RecordInspector(this, record);
	      } else {
	        this._proxies[dataID] = record;
	      }
	    }
	    return this._proxies[dataID];
	  };

	  /**
	   * Returns a list of "<id>: <type>" for each record in the store that has an
	   * `id`.
	   */


	  RelayRecordSourceInspector.prototype.getNodes = function getNodes() {
	    var _this = this;

	    var nodes = [];
	    this._source.getRecordIDs().forEach(function (dataID) {
	      if (dataID.indexOf('client:') === 0) {
	        return;
	      }
	      var record = _this._source.get(dataID);
	      nodes.push(RecordSummary.createFromRecord(dataID, record));
	    });
	    return nodes;
	  };

	  /**
	   * Returns a list of "<id>: <type>" for all records in the store including
	   * those that do not have an `id`.
	   */


	  RelayRecordSourceInspector.prototype.getRecords = function getRecords() {
	    var _this2 = this;

	    return this._source.getRecordIDs().map(function (dataID) {
	      var record = _this2._source.get(dataID);
	      return RecordSummary.createFromRecord(dataID, record);
	    });
	  };

	  /**
	   * Returns an inspector for the synthesized "root" object, allowing access to
	   * e.g. the `viewer` object or the results of other fields on the "Query"
	   * type.
	   */


	  RelayRecordSourceInspector.prototype.getRoot = function getRoot() {
	    var root = this.get(ROOT_ID);
	    __webpack_require__(1)(root && root.getType() === ROOT_TYPE, 'RelayRecordSourceProxy#getRoot(): Expected the source to contain a ' + 'root record.');
	    // Make viewer more accessible: if a record is not present on the original
	    // field name but is present on the viewer handle field, rewrite the getter
	    // to make `root.viewer` work.
	    if (root.viewer == null) {
	      var viewerHandle = __webpack_require__(20)('viewer', null, 'viewer');
	      var unsafeRoot = root; // to access getter properties
	      if (unsafeRoot[viewerHandle] != null) {
	        Object.defineProperty(unsafeRoot, 'viewer', {
	          configurable: true,
	          enumerable: true,
	          get: function get() {
	            return unsafeRoot[viewerHandle];
	          }
	        });
	      }
	    }
	    return root;
	  };

	  return RelayRecordSourceInspector;
	}();

	/**
	 * Internal class for inspecting a single Record.
	 */


	var RecordInspector = function () {
	  function RecordInspector(sourceInspector, record) {
	    var _this3 = this;

	    (0, _classCallCheck3['default'])(this, RecordInspector);

	    this._record = record;
	    this._sourceInspector = sourceInspector;

	    // Make it easier to inspect the record in a debugger console:
	    // defined properties appear in autocomplete when typing "obj."

	    var _loop = function _loop(key) {
	      if (record.hasOwnProperty(key)) {
	        var value = record[key];
	        var identifier = key.replace(/[^_a-zA-Z0-9]/g, '_');
	        if (typeof value === 'object' && value !== null) {
	          if (value.hasOwnProperty(REF_KEY)) {
	            Object.defineProperty(_this3, identifier, {
	              configurable: true,
	              enumerable: true,
	              get: function get() {
	                return this.getLinkedRecord(key);
	              }
	            });
	          } else if (value.hasOwnProperty(REFS_KEY)) {
	            Object.defineProperty(_this3, identifier, {
	              configurable: true,
	              enumerable: true,
	              get: function get() {
	                return this.getLinkedRecords(key);
	              }
	            });
	          }
	        } else {
	          Object.defineProperty(_this3, identifier, {
	            configurable: true,
	            enumerable: true,
	            get: function get() {
	              return this.getValue(key);
	            }
	          });
	        }
	      }
	    };

	    for (var key in record) {
	      _loop(key);
	    }
	  }

	  /**
	   * Get the cache id of the given record. For types that implement the `Node`
	   * interface (or that have an `id`) this will be `id`, for other types it will be
	   * a synthesized identifier based on the field path from the nearest ancestor
	   * record that does have an `id`.
	   */


	  RecordInspector.prototype.getDataID = function getDataID() {
	    return __webpack_require__(2).getDataID(this._record);
	  };

	  /**
	   * Returns a list of the fields that have been fetched on the current record.
	   */


	  RecordInspector.prototype.getFields = function getFields() {
	    return Object.keys(this._record).sort();
	  };

	  /**
	   * Returns the type of the record.
	   */


	  RecordInspector.prototype.getType = function getType() {
	    return __webpack_require__(2).getType(this._record);
	  };

	  /**
	   * Returns a copy of the internal representation of the record.
	   */


	  RecordInspector.prototype.inspect = function inspect() {
	    return __webpack_require__(62)(this._record);
	  };

	  /**
	   * Returns the value of a scalar field. May throw if the given field is
	   * present but not actually scalar.
	   */


	  RecordInspector.prototype.getValue = function getValue(name, args) {
	    var storageKey = args ? __webpack_require__(7)(name, args) : name;
	    return __webpack_require__(2).getValue(this._record, storageKey);
	  };

	  /**
	   * Returns an inspector for the given scalar "linked" field (a field whose
	   * value is another Record instead of a scalar). May throw if the field is
	   * present but not a scalar linked record.
	   */


	  RecordInspector.prototype.getLinkedRecord = function getLinkedRecord(name, args) {
	    var storageKey = args ? __webpack_require__(7)(name, args) : name;
	    var linkedID = __webpack_require__(2).getLinkedRecordID(this._record, storageKey);
	    return linkedID != null ? this._sourceInspector.get(linkedID) : linkedID;
	  };

	  /**
	   * Returns an array of inspectors for the given plural "linked" field (a field
	   * whose value is an array of Records instead of a scalar). May throw if the
	   * field is  present but not a plural linked record.
	   */


	  RecordInspector.prototype.getLinkedRecords = function getLinkedRecords(name, args) {
	    var _this4 = this;

	    var storageKey = args ? __webpack_require__(7)(name, args) : name;
	    var linkedIDs = __webpack_require__(2).getLinkedRecordIDs(this._record, storageKey);
	    if (linkedIDs == null) {
	      return linkedIDs;
	    }
	    return linkedIDs.map(function (linkedID) {
	      return linkedID != null ? _this4._sourceInspector.get(linkedID) : linkedID;
	    });
	  };

	  return RecordInspector;
	}();

	/**
	 * An internal class to provide a console-friendly string representation of a
	 * Record.
	 */


	var RecordSummary = function () {
	  RecordSummary.createFromRecord = function createFromRecord(id, record) {
	    var type = record ? __webpack_require__(2).getType(record) : null;
	    return new RecordSummary(id, type);
	  };

	  function RecordSummary(id, type) {
	    (0, _classCallCheck3['default'])(this, RecordSummary);

	    this.id = id;
	    this.type = type;
	  }

	  RecordSummary.prototype.toString = function toString() {
	    return this.type ? this.id + ': ' + this.type : this.id;
	  };

	  return RecordSummary;
	}();

	module.exports = RelayRecordSourceInspector;

/***/ }),
/* 23 */
/***/ (function(module, exports, __webpack_require__) {

	/**
	 * Copyright (c) 2013-present, Facebook, Inc.
	 *
	 * This source code is licensed under the MIT license found in the
	 * LICENSE file in the root directory of this source tree.
	 *
	 * @providesModule RelayRecordSourceProxy
	 * 
	 * @format
	 */

	'use strict';

	var _classCallCheck3 = _interopRequireDefault(__webpack_require__(6));

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

	var _require = __webpack_require__(14),
	    EXISTENT = _require.EXISTENT,
	    NONEXISTENT = _require.NONEXISTENT;

	var _require2 = __webpack_require__(4),
	    ROOT_ID = _require2.ROOT_ID,
	    ROOT_TYPE = _require2.ROOT_TYPE;

	/**
	 * @internal
	 *
	 * A helper for manipulating a `RecordSource` via an imperative/OO-style API.
	 */
	var RelayRecordSourceProxy = function () {
	  function RelayRecordSourceProxy(mutator, handlerProvider) {
	    (0, _classCallCheck3['default'])(this, RelayRecordSourceProxy);

	    this.__mutator = mutator;
	    this._handlerProvider = handlerProvider || null;
	    this._proxies = {};
	  }

	  RelayRecordSourceProxy.prototype.commitPayload = function commitPayload(operation, response) {
	    var _this = this;

	    if (!response) {
	      return new (__webpack_require__(24))(this, operation.fragment);
	    }

	    var _normalizeRelayPayloa = __webpack_require__(15)(operation.root, response),
	        source = _normalizeRelayPayloa.source,
	        fieldPayloads = _normalizeRelayPayloa.fieldPayloads;

	    var dataIDs = source.getRecordIDs();
	    dataIDs.forEach(function (dataID) {
	      var status = source.getStatus(dataID);
	      if (status === EXISTENT) {
	        var sourceRecord = source.get(dataID);
	        if (sourceRecord) {
	          if (_this.__mutator.getStatus(dataID) !== EXISTENT) {
	            _this.create(dataID, __webpack_require__(2).getType(sourceRecord));
	          }
	          _this.__mutator.copyFieldsFromRecord(sourceRecord, dataID);
	          delete _this._proxies[dataID];
	        }
	      } else if (status === NONEXISTENT) {
	        _this['delete'](dataID);
	      }
	    });

	    if (fieldPayloads && fieldPayloads.length) {
	      fieldPayloads.forEach(function (fieldPayload) {
	        var handler = _this._handlerProvider && _this._handlerProvider(fieldPayload.handle);
	        __webpack_require__(1)(handler, 'RelayModernEnvironment: Expected a handler to be provided for handle `%s`.', fieldPayload.handle);
	        handler.update(_this, fieldPayload);
	      });
	    }
	    return new (__webpack_require__(24))(this, operation.fragment);
	  };

	  RelayRecordSourceProxy.prototype.create = function create(dataID, typeName) {
	    this.__mutator.create(dataID, typeName);
	    delete this._proxies[dataID];
	    var record = this.get(dataID);
	    // For flow
	    __webpack_require__(1)(record, 'RelayRecordSourceProxy#create(): Expected the created record to exist.');
	    return record;
	  };

	  RelayRecordSourceProxy.prototype['delete'] = function _delete(dataID) {
	    __webpack_require__(1)(dataID !== ROOT_ID, 'RelayRecordSourceProxy#delete(): Cannot delete the root record.');
	    delete this._proxies[dataID];
	    this.__mutator['delete'](dataID);
	  };

	  RelayRecordSourceProxy.prototype.get = function get(dataID) {
	    if (!this._proxies.hasOwnProperty(dataID)) {
	      var status = this.__mutator.getStatus(dataID);
	      if (status === EXISTENT) {
	        this._proxies[dataID] = new (__webpack_require__(50))(this, this.__mutator, dataID);
	      } else {
	        this._proxies[dataID] = status === NONEXISTENT ? null : undefined;
	      }
	    }
	    return this._proxies[dataID];
	  };

	  RelayRecordSourceProxy.prototype.getRoot = function getRoot() {
	    var root = this.get(ROOT_ID);
	    if (!root) {
	      root = this.create(ROOT_ID, ROOT_TYPE);
	    }
	    __webpack_require__(1)(root && root.getType() === ROOT_TYPE, 'RelayRecordSourceProxy#getRoot(): Expected the source to contain a ' + 'root record.');
	    return root;
	  };

	  return RelayRecordSourceProxy;
	}();

	module.exports = RelayRecordSourceProxy;

/***/ }),
/* 24 */
/***/ (function(module, exports, __webpack_require__) {

	/**
	 * Copyright (c) 2013-present, Facebook, Inc.
	 *
	 * This source code is licensed under the MIT license found in the
	 * LICENSE file in the root directory of this source tree.
	 *
	 * @providesModule RelayRecordSourceSelectorProxy
	 * 
	 * @format
	 */

	'use strict';

	var _classCallCheck3 = _interopRequireDefault(__webpack_require__(6));

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

	var _require = __webpack_require__(4),
	    getStorageKey = _require.getStorageKey;

	/**
	 * @internal
	 *
	 * A subclass of RecordSourceProxy that provides convenience methods for
	 * accessing the root fields of a given query/mutation. These fields accept
	 * complex arguments and it can be tedious to re-construct the correct sets of
	 * arguments to pass to e.g. `getRoot().getLinkedRecord()`.
	 */
	var RelayRecordSourceSelectorProxy = function () {
	  function RelayRecordSourceSelectorProxy(recordSource, readSelector) {
	    (0, _classCallCheck3['default'])(this, RelayRecordSourceSelectorProxy);

	    this.__recordSource = recordSource;
	    this._readSelector = readSelector;
	  }

	  RelayRecordSourceSelectorProxy.prototype.create = function create(dataID, typeName) {
	    return this.__recordSource.create(dataID, typeName);
	  };

	  RelayRecordSourceSelectorProxy.prototype['delete'] = function _delete(dataID) {
	    this.__recordSource['delete'](dataID);
	  };

	  RelayRecordSourceSelectorProxy.prototype.get = function get(dataID) {
	    return this.__recordSource.get(dataID);
	  };

	  RelayRecordSourceSelectorProxy.prototype.getRoot = function getRoot() {
	    return this.__recordSource.getRoot();
	  };

	  RelayRecordSourceSelectorProxy.prototype._getRootField = function _getRootField(selector, fieldName, plural) {
	    var field = selector.node.selections.find(function (selection) {
	      return selection.kind === 'LinkedField' && selection.name === fieldName;
	    });
	    __webpack_require__(1)(field && field.kind === 'LinkedField', 'RelayRecordSourceSelectorProxy#getRootField(): Cannot find root ' + 'field `%s`, no such field is defined on GraphQL document `%s`.', fieldName, selector.node.name);
	    __webpack_require__(1)(field.plural === plural, 'RelayRecordSourceSelectorProxy#getRootField(): Expected root field ' + '`%s` to be %s.', fieldName, plural ? 'plural' : 'singular');
	    return field;
	  };

	  RelayRecordSourceSelectorProxy.prototype.getRootField = function getRootField(fieldName) {
	    var field = this._getRootField(this._readSelector, fieldName, false);
	    var storageKey = getStorageKey(field, this._readSelector.variables);
	    return this.getRoot().getLinkedRecord(storageKey);
	  };

	  RelayRecordSourceSelectorProxy.prototype.getPluralRootField = function getPluralRootField(fieldName) {
	    var field = this._getRootField(this._readSelector, fieldName, true);
	    var storageKey = getStorageKey(field, this._readSelector.variables);
	    return this.getRoot().getLinkedRecords(storageKey);
	  };

	  return RelayRecordSourceSelectorProxy;
	}();

	module.exports = RelayRecordSourceSelectorProxy;

/***/ }),
/* 25 */
/***/ (function(module, exports) {

	/**
	 * Copyright (c) 2013-present, Facebook, Inc.
	 *
	 * This source code is licensed under the MIT license found in the
	 * LICENSE file in the root directory of this source tree.
	 *
	 * @providesModule isRelayModernEnvironment
	 * 
	 * @format
	 */

	'use strict';

	/**
	 * Determine if a given value is an object that implements the `Environment`
	 * interface defined in `RelayStoreTypes`.
	 *
	 * Use a sigil for detection to avoid a realm-specific instanceof check, and to
	 * aid in module tree-shaking to avoid requiring all of RelayRuntime just to
	 * detect its environment.
	 */

	function isRelayModernEnvironment(environment) {
	  return Boolean(environment && environment['@@RelayModernEnvironment']);
	}

	module.exports = isRelayModernEnvironment;

/***/ }),
/* 26 */
/***/ (function(module, exports, __webpack_require__) {

	/**
	 * Copyright (c) 2013-present, Facebook, Inc.
	 *
	 * This source code is licensed under the MIT license found in the
	 * LICENSE file in the root directory of this source tree.
	 *
	 * @providesModule setRelayModernMutationConfigs
	 * 
	 * @format
	 */

	'use strict';

	function setRelayModernMutationConfigs(configs, operation, optimisticUpdater, updater) {
	  var configOptimisticUpdates = optimisticUpdater ? [optimisticUpdater] : [];
	  var configUpdates = updater ? [updater] : [];
	  configs.forEach(function (config) {
	    switch (config.type) {
	      case 'NODE_DELETE':
	        var nodeDeleteResult = nodeDelete(config, operation);
	        if (nodeDeleteResult) {
	          configOptimisticUpdates.push(nodeDeleteResult);
	          configUpdates.push(nodeDeleteResult);
	        }
	        break;
	      case 'RANGE_ADD':
	        var rangeAddResult = rangeAdd(config, operation);
	        if (rangeAddResult) {
	          configOptimisticUpdates.push(rangeAddResult);
	          configUpdates.push(rangeAddResult);
	        }
	        break;
	      case 'RANGE_DELETE':
	        var rangeDeleteResult = rangeDelete(config, operation);
	        if (rangeDeleteResult) {
	          configOptimisticUpdates.push(rangeDeleteResult);
	          configUpdates.push(rangeDeleteResult);
	        }
	        break;
	    }
	  });
	  optimisticUpdater = function optimisticUpdater(store, data) {
	    configOptimisticUpdates.forEach(function (eachOptimisticUpdater) {
	      eachOptimisticUpdater(store, data);
	    });
	  };
	  updater = function updater(store, data) {
	    configUpdates.forEach(function (eachUpdater) {
	      eachUpdater(store, data);
	    });
	  };
	  return { optimisticUpdater: optimisticUpdater, updater: updater };
	}

	function nodeDelete(config, operation) {
	  var updater = void 0;
	  if (config.type !== 'NODE_DELETE') {
	    return;
	  }
	  var deletedIDFieldName = config.deletedIDFieldName;

	  var rootField = getRootField(operation);
	  if (rootField) {
	    updater = function updater(store, data) {
	      var payload = store.getRootField(rootField);
	      if (!payload) {
	        return;
	      }
	      var deleteID = payload.getValue(deletedIDFieldName);
	      var deleteIDs = Array.isArray(deleteID) ? deleteID : [deleteID];
	      deleteIDs.forEach(function (id) {
	        if (id && typeof id === 'string') {
	          store['delete'](id);
	        }
	      });
	    };
	  }
	  return updater;
	}

	function rangeAdd(config, operation) {
	  var updater = void 0;
	  if (config.type !== 'RANGE_ADD') {
	    return;
	  }
	  var parentID = config.parentID,
	      connectionInfo = config.connectionInfo,
	      edgeName = config.edgeName;

	  if (!parentID) {
	    __webpack_require__(5)(false, 'setRelayModernMutationConfigs: For mutation config RANGE_ADD ' + 'to work you must include a parentID');
	    return;
	  }
	  var rootField = getRootField(operation);
	  if (connectionInfo && rootField) {
	    updater = function updater(store, data) {
	      var parent = store.get(parentID);
	      if (parent) {
	        var payload = store.getRootField(rootField);
	        if (!payload) {
	          return;
	        }
	        var serverEdge = payload.getLinkedRecord(edgeName);
	        var _iteratorNormalCompletion = true;
	        var _didIteratorError = false;
	        var _iteratorError = undefined;

	        try {
	          for (var _iterator = connectionInfo[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
	            var info = _step.value;

	            if (serverEdge) {
	              var connection = __webpack_require__(9).getConnection(parent, info.key, info.filters);
	              if (!connection) {
	                return;
	              }
	              var clientEdge = __webpack_require__(9).buildConnectionEdge(store, connection, serverEdge);
	              if (!clientEdge) {
	                return;
	              }
	              switch (info.rangeBehavior) {
	                case 'append':
	                  __webpack_require__(9).insertEdgeAfter(connection, clientEdge);
	                  break;
	                case 'ignore':
	                  // Do nothing
	                  break;
	                case 'prepend':
	                  __webpack_require__(9).insertEdgeBefore(connection, clientEdge);
	                  break;
	                default:
	                  __webpack_require__(5)(false, 'setRelayModernMutationConfigs: RANGE_ADD range behavior ' + ('\'' + info.rangeBehavior + '\' will not work as expected in RelayModern, ') + "supported range behaviors are 'append', 'prepend', and " + "'ignore'");
	                  break;
	              }
	            }
	          }
	        } catch (err) {
	          _didIteratorError = true;
	          _iteratorError = err;
	        } finally {
	          try {
	            if (!_iteratorNormalCompletion && _iterator['return']) {
	              _iterator['return']();
	            }
	          } finally {
	            if (_didIteratorError) {
	              throw _iteratorError;
	            }
	          }
	        }
	      }
	    };
	  }
	  return updater;
	}

	function rangeDelete(config, operation) {
	  var updater = void 0;
	  if (config.type !== 'RANGE_DELETE') {
	    return;
	  }
	  var parentID = config.parentID,
	      connectionKeys = config.connectionKeys,
	      pathToConnection = config.pathToConnection,
	      deletedIDFieldName = config.deletedIDFieldName;

	  if (!parentID) {
	    __webpack_require__(5)(false, 'setRelayModernMutationConfigs: For mutation config RANGE_DELETE ' + 'to work you must include a parentID');
	    return;
	  }
	  var rootField = getRootField(operation);
	  if (rootField) {
	    updater = function updater(store, data) {
	      if (data) {
	        var deleteIDs = [];
	        var deletedIDField = data[rootField];
	        if (deletedIDField && Array.isArray(deletedIDFieldName)) {
	          var _iteratorNormalCompletion2 = true;
	          var _didIteratorError2 = false;
	          var _iteratorError2 = undefined;

	          try {
	            for (var _iterator2 = deletedIDFieldName[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
	              var eachField = _step2.value;

	              if (deletedIDField && typeof deletedIDField === 'object') {
	                deletedIDField = deletedIDField[eachField];
	              }
	            }
	          } catch (err) {
	            _didIteratorError2 = true;
	            _iteratorError2 = err;
	          } finally {
	            try {
	              if (!_iteratorNormalCompletion2 && _iterator2['return']) {
	                _iterator2['return']();
	              }
	            } finally {
	              if (_didIteratorError2) {
	                throw _iteratorError2;
	              }
	            }
	          }

	          if (Array.isArray(deletedIDField)) {
	            deletedIDField.forEach(function (idObject) {
	              if (idObject && idObject.id && typeof idObject === 'object' && typeof idObject.id === 'string') {
	                deleteIDs.push(idObject.id);
	              }
	            });
	          } else if (deletedIDField && deletedIDField.id && typeof deletedIDField.id === 'string') {
	            deleteIDs.push(deletedIDField.id);
	          }
	        } else if (deletedIDField && typeof deletedIDFieldName === 'string' && typeof deletedIDField === 'object') {
	          deletedIDField = deletedIDField[deletedIDFieldName];
	          if (typeof deletedIDField === 'string') {
	            deleteIDs.push(deletedIDField);
	          } else if (Array.isArray(deletedIDField)) {
	            deletedIDField.forEach(function (id) {
	              if (typeof id === 'string') {
	                deleteIDs.push(id);
	              }
	            });
	          }
	        }
	        deleteNode(parentID, connectionKeys, pathToConnection, store, deleteIDs);
	      }
	    };
	  }
	  return updater;
	}

	function deleteNode(parentID, connectionKeys, pathToConnection, store, deleteIDs) {
	  __webpack_require__(5)(connectionKeys, 'setRelayModernMutationConfigs: RANGE_DELETE must provide a ' + 'connectionKeys');
	  var parent = store.get(parentID);
	  if (!parent) {
	    return;
	  }
	  if (pathToConnection.length >= 2) {
	    var recordProxy = parent;
	    for (var i = 1; i < pathToConnection.length - 1; i++) {
	      if (recordProxy) {
	        recordProxy = recordProxy.getLinkedRecord(pathToConnection[i]);
	      }
	    }
	    // Should never enter loop except edge cases
	    if (connectionKeys && recordProxy) {
	      var _iteratorNormalCompletion3 = true;
	      var _didIteratorError3 = false;
	      var _iteratorError3 = undefined;

	      try {
	        var _loop = function _loop() {
	          var key = _step3.value;

	          var connection = __webpack_require__(9).getConnection(recordProxy, key.key, key.filters);
	          if (connection) {
	            deleteIDs.forEach(function (deleteID) {
	              __webpack_require__(9).deleteNode(connection, deleteID);
	            });
	            return 'break';
	          }
	        };

	        for (var _iterator3 = connectionKeys[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
	          var _ret = _loop();

	          if (_ret === 'break') break;
	        }
	      } catch (err) {
	        _didIteratorError3 = true;
	        _iteratorError3 = err;
	      } finally {
	        try {
	          if (!_iteratorNormalCompletion3 && _iterator3['return']) {
	            _iterator3['return']();
	          }
	        } finally {
	          if (_didIteratorError3) {
	            throw _iteratorError3;
	          }
	        }
	      }
	    } else {
	      __webpack_require__(5)(false, 'setRelayModernMutationConfigs: RANGE_DELETE ' + 'pathToConnection is incorrect. Unable to find connection with ' + 'parentID: %s and path: %s', parentID, pathToConnection.toString());
	    }
	  } else {
	    __webpack_require__(5)(false, 'setRelayModernMutationConfigs: RANGE_DELETE ' + 'pathToConnection must include at least parent and connection');
	  }
	}

	function getRootField(operation) {
	  var rootField = void 0;
	  if (operation.fragment && operation.fragment.selections && operation.fragment.selections.length > 0 && operation.fragment.selections[0].kind === 'LinkedField') {
	    rootField = operation.fragment.selections[0].name;
	  }
	  return rootField;
	}

	module.exports = setRelayModernMutationConfigs;

/***/ }),
/* 27 */
/***/ (function(module, exports) {

	/**
	 * Copyright (c) 2013-present, Facebook, Inc.
	 *
	 * This source code is licensed under the MIT license found in the
	 * LICENSE file in the root directory of this source tree.
	 *
	 * 
	 * @providesModule stableJSONStringify
	 * @format
	 */

	'use strict';

	/**
	 * Simple recursive stringifier that produces a stable JSON string suitable for
	 * use as a cache key. Does not handle corner-cases such as circular references
	 * or exotic types.
	 */

	function stableJSONStringify(obj) {
	  if (Array.isArray(obj)) {
	    var result = [];
	    for (var ii = 0; ii < obj.length; ii++) {
	      var value = obj[ii] !== undefined ? obj[ii] : null;
	      result.push(stableJSONStringify(value));
	    }
	    return '[' + result.join(',') + ']';
	  } else if (typeof obj === 'object' && obj) {
	    var _result = [];
	    var keys = Object.keys(obj);
	    keys.sort();
	    for (var _ii = 0; _ii < keys.length; _ii++) {
	      var key = keys[_ii];
	      var _value = stableJSONStringify(obj[key]);
	      _result.push('"' + key + '":' + _value);
	    }
	    return '{' + _result.join(',') + '}';
	  } else {
	    return JSON.stringify(obj);
	  }
	}

	module.exports = stableJSONStringify;

/***/ }),
/* 28 */
/***/ (function(module, exports) {

	module.exports = __WEBPACK_EXTERNAL_MODULE_28__;

/***/ }),
/* 29 */
/***/ (function(module, exports) {

	module.exports = __WEBPACK_EXTERNAL_MODULE_29__;

/***/ }),
/* 30 */
/***/ (function(module, exports) {

	module.exports = __WEBPACK_EXTERNAL_MODULE_30__;

/***/ }),
/* 31 */
/***/ (function(module, exports, __webpack_require__) {

	/**
	 * Copyright (c) 2013-present, Facebook, Inc.
	 *
	 * This source code is licensed under the MIT license found in the
	 * LICENSE file in the root directory of this source tree.
	 *
	 * 
	 * @providesModule RelayConcreteVariables
	 * @format
	 */

	'use strict';

	var _extends3 = _interopRequireDefault(__webpack_require__(13));

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

	/**
	 * Determines the variables that are in scope for a fragment given the variables
	 * in scope at the root query as well as any arguments applied at the fragment
	 * spread via `@arguments`.
	 *
	 * Note that this is analagous to determining function arguments given a function call.
	 */
	function getFragmentVariables(fragment, rootVariables, argumentVariables) {
	  var variables = void 0;
	  fragment.argumentDefinitions.forEach(function (definition) {
	    if (argumentVariables.hasOwnProperty(definition.name)) {
	      return;
	    }
	    variables = variables || (0, _extends3['default'])({}, argumentVariables);
	    switch (definition.kind) {
	      case 'LocalArgument':
	        variables[definition.name] = definition.defaultValue;
	        break;
	      case 'RootArgument':
	        __webpack_require__(1)(rootVariables.hasOwnProperty(definition.name), 'RelayConcreteVariables: Expected a defined query variable for `$%s` ' + 'in fragment `%s`.', definition.name, fragment.name);
	        variables[definition.name] = rootVariables[definition.name];
	        break;
	      default:
	        __webpack_require__(1)(false, 'RelayConcreteVariables: Unexpected node kind `%s` in fragment `%s`.', definition.kind, fragment.name);
	    }
	  });
	  return variables || argumentVariables;
	}

	/**
	 * Determines the variables that are in scope for a given operation given values
	 * for some/all of its arguments. Extraneous input variables are filtered from
	 * the output, and missing variables are set to default values (if given in the
	 * operation's definition).
	 */
	function getOperationVariables(operation, variables) {
	  var operationVariables = {};
	  operation.query.argumentDefinitions.forEach(function (def) {
	    var value = def.defaultValue;
	    if (variables[def.name] != null) {
	      value = variables[def.name];
	    }
	    operationVariables[def.name] = value;
	    if (true) {
	      __webpack_require__(5)(value != null || def.type[def.type.length - 1] !== '!', 'RelayConcreteVariables: Expected a value for non-nullable variable ' + '`$%s: %s` on operation `%s`, got `%s`. Make sure you supply a ' + 'value for all non-nullable arguments.', def.name, def.type, operation.name, JSON.stringify(value));
	    }
	  });
	  return operationVariables;
	}

	module.exports = {
	  getFragmentVariables: getFragmentVariables,
	  getOperationVariables: getOperationVariables
	};

/***/ }),
/* 32 */
/***/ (function(module, exports, __webpack_require__) {

	/**
	 * Copyright (c) 2013-present, Facebook, Inc.
	 *
	 * This source code is licensed under the MIT license found in the
	 * LICENSE file in the root directory of this source tree.
	 *
	 * @providesModule RelayDataLoader
	 * 
	 * @format
	 */

	'use strict';

	var _classCallCheck3 = _interopRequireDefault(__webpack_require__(6));

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

	var _require = __webpack_require__(14),
	    EXISTENT = _require.EXISTENT,
	    UNKNOWN = _require.UNKNOWN;

	var CONDITION = __webpack_require__(3).CONDITION,
	    INLINE_FRAGMENT = __webpack_require__(3).INLINE_FRAGMENT,
	    LINKED_FIELD = __webpack_require__(3).LINKED_FIELD,
	    LINKED_HANDLE = __webpack_require__(3).LINKED_HANDLE,
	    SCALAR_FIELD = __webpack_require__(3).SCALAR_FIELD;

	var getStorageKey = __webpack_require__(4).getStorageKey,
	    getArgumentValues = __webpack_require__(4).getArgumentValues;

	/**
	 * Synchronously check whether the records required to fulfill the
	 * given `selector` are present in `source`.
	 *
	 * If a field is missing, it uses the provided handlers to attempt to substitute
	 * data. The `target` will store all records that are modified because of a
	 * successful substitution.
	 *
	 * If all records are present, returns `true`, otherwise `false`.
	 */


	function check(source, target, selector, handlers) {
	  var dataID = selector.dataID,
	      node = selector.node,
	      variables = selector.variables;

	  var loader = new RelayDataLoader(source, target, variables, handlers);
	  return loader.check(node, dataID);
	}

	/**
	 * @private
	 */

	var RelayDataLoader = function () {
	  function RelayDataLoader(source, target, variables, handlers) {
	    (0, _classCallCheck3['default'])(this, RelayDataLoader);

	    this._source = source;
	    this._variables = variables;
	    this._recordWasMissing = false;
	    this._handlers = handlers;
	    this._mutator = new (__webpack_require__(18))(source, target);
	  }

	  RelayDataLoader.prototype.check = function check(node, dataID) {
	    this._traverse(node, dataID);
	    return !this._recordWasMissing;
	  };

	  RelayDataLoader.prototype._getVariableValue = function _getVariableValue(name) {
	    __webpack_require__(1)(this._variables.hasOwnProperty(name), 'RelayAsyncLoader(): Undefined variable `%s`.', name);
	    return this._variables[name];
	  };

	  RelayDataLoader.prototype._handleMissing = function _handleMissing() {
	    this._recordWasMissing = true;
	  };

	  RelayDataLoader.prototype._getDataForHandlers = function _getDataForHandlers(field, dataID) {
	    return {
	      args: field.args ? getArgumentValues(field.args, this._variables) : {},
	      // Getting a snapshot of the record state is potentially expensive since
	      // we will need to merge the sink and source records. Since we do not create
	      // any new records in this process, it is probably reasonable to provide
	      // handlers with a copy of the source record.
	      // The only thing that the provided record will not contain is fields
	      // added by previous handlers.
	      record: this._source.get(dataID)
	    };
	  };

	  RelayDataLoader.prototype._handleMissingScalarField = function _handleMissingScalarField(field, dataID) {
	    var _getDataForHandlers2 = this._getDataForHandlers(field, dataID),
	        args = _getDataForHandlers2.args,
	        record = _getDataForHandlers2.record;

	    var _iteratorNormalCompletion = true;
	    var _didIteratorError = false;
	    var _iteratorError = undefined;

	    try {
	      for (var _iterator = this._handlers[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
	        var handler = _step.value;

	        if (handler.kind === 'scalar') {
	          var newValue = handler.handle(field, record, args);
	          if (newValue !== undefined) {
	            return newValue;
	          }
	        }
	      }
	    } catch (err) {
	      _didIteratorError = true;
	      _iteratorError = err;
	    } finally {
	      try {
	        if (!_iteratorNormalCompletion && _iterator['return']) {
	          _iterator['return']();
	        }
	      } finally {
	        if (_didIteratorError) {
	          throw _iteratorError;
	        }
	      }
	    }

	    this._handleMissing();
	  };

	  RelayDataLoader.prototype._handleMissingLinkField = function _handleMissingLinkField(field, dataID) {
	    var _getDataForHandlers3 = this._getDataForHandlers(field, dataID),
	        args = _getDataForHandlers3.args,
	        record = _getDataForHandlers3.record;

	    var _iteratorNormalCompletion2 = true;
	    var _didIteratorError2 = false;
	    var _iteratorError2 = undefined;

	    try {
	      for (var _iterator2 = this._handlers[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
	        var handler = _step2.value;

	        if (handler.kind === 'linked') {
	          var newValue = handler.handle(field, record, args);
	          if (newValue != null && this._mutator.getStatus(newValue) === EXISTENT) {
	            return newValue;
	          }
	        }
	      }
	    } catch (err) {
	      _didIteratorError2 = true;
	      _iteratorError2 = err;
	    } finally {
	      try {
	        if (!_iteratorNormalCompletion2 && _iterator2['return']) {
	          _iterator2['return']();
	        }
	      } finally {
	        if (_didIteratorError2) {
	          throw _iteratorError2;
	        }
	      }
	    }

	    this._handleMissing();
	  };

	  RelayDataLoader.prototype._handleMissingPluralLinkField = function _handleMissingPluralLinkField(field, dataID) {
	    var _this = this;

	    var _getDataForHandlers4 = this._getDataForHandlers(field, dataID),
	        args = _getDataForHandlers4.args,
	        record = _getDataForHandlers4.record;

	    var _iteratorNormalCompletion3 = true;
	    var _didIteratorError3 = false;
	    var _iteratorError3 = undefined;

	    try {
	      for (var _iterator3 = this._handlers[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
	        var handler = _step3.value;

	        if (handler.kind === 'pluralLinked') {
	          var newValue = handler.handle(field, record, args);
	          if (newValue != null) {
	            return newValue.filter(function (linkedID) {
	              return linkedID != null && _this._mutator.getStatus(linkedID) === EXISTENT;
	            });
	          }
	        }
	      }
	    } catch (err) {
	      _didIteratorError3 = true;
	      _iteratorError3 = err;
	    } finally {
	      try {
	        if (!_iteratorNormalCompletion3 && _iterator3['return']) {
	          _iterator3['return']();
	        }
	      } finally {
	        if (_didIteratorError3) {
	          throw _iteratorError3;
	        }
	      }
	    }

	    this._handleMissing();
	  };

	  RelayDataLoader.prototype._traverse = function _traverse(node, dataID) {
	    var status = this._mutator.getStatus(dataID);
	    if (status === UNKNOWN) {
	      this._handleMissing();
	    }
	    if (status === EXISTENT) {
	      this._traverseSelections(node.selections, dataID);
	    }
	  };

	  RelayDataLoader.prototype._traverseSelections = function _traverseSelections(selections, dataID) {
	    var _this2 = this;

	    selections.every(function (selection) {
	      switch (selection.kind) {
	        case SCALAR_FIELD:
	          _this2._prepareScalar(selection, dataID);
	          break;
	        case LINKED_FIELD:
	          if (selection.plural) {
	            _this2._preparePluralLink(selection, dataID);
	          } else {
	            _this2._prepareLink(selection, dataID);
	          }
	          break;
	        case CONDITION:
	          var conditionValue = _this2._getVariableValue(selection.condition);
	          if (conditionValue === selection.passingValue) {
	            _this2._traverseSelections(selection.selections, dataID);
	          }
	          break;
	        case INLINE_FRAGMENT:
	          var typeName = _this2._mutator.getType(dataID);
	          if (typeName != null && typeName === selection.type) {
	            _this2._traverseSelections(selection.selections, dataID);
	          }
	          break;
	        case LINKED_HANDLE:
	          // Handles have no selections themselves; traverse the original field
	          // where the handle was set-up instead.
	          var handleField = __webpack_require__(36)(selection, selections, _this2._variables);
	          if (handleField.plural) {
	            _this2._preparePluralLink(handleField, dataID);
	          } else {
	            _this2._prepareLink(handleField, dataID);
	          }
	          break;
	        default:
	          __webpack_require__(1)(selection.kind === SCALAR_FIELD, 'RelayAsyncLoader(): Unexpected ast kind `%s`.', selection.kind);
	      }
	      return !_this2._done;
	    });
	  };

	  RelayDataLoader.prototype._prepareScalar = function _prepareScalar(field, dataID) {
	    var storageKey = getStorageKey(field, this._variables);
	    var fieldValue = this._mutator.getValue(dataID, storageKey);
	    if (fieldValue === undefined) {
	      fieldValue = this._handleMissingScalarField(field, dataID);
	      if (fieldValue !== undefined) {
	        this._mutator.setValue(dataID, storageKey, fieldValue);
	      }
	    }
	  };

	  RelayDataLoader.prototype._prepareLink = function _prepareLink(field, dataID) {
	    var storageKey = getStorageKey(field, this._variables);
	    var linkedID = this._mutator.getLinkedRecordID(dataID, storageKey);

	    if (linkedID === undefined) {
	      linkedID = this._handleMissingLinkField(field, dataID);
	      if (linkedID != null) {
	        this._mutator.setLinkedRecordID(dataID, storageKey, linkedID);
	      }
	    }
	    if (linkedID != null) {
	      this._traverse(field, linkedID);
	    }
	  };

	  RelayDataLoader.prototype._preparePluralLink = function _preparePluralLink(field, dataID) {
	    var _this3 = this;

	    var storageKey = getStorageKey(field, this._variables);
	    var linkedIDs = this._mutator.getLinkedRecordIDs(dataID, storageKey);

	    if (linkedIDs === undefined) {
	      linkedIDs = this._handleMissingPluralLinkField(field, dataID);
	      if (linkedIDs != null) {
	        this._mutator.setLinkedRecordIDs(dataID, storageKey, linkedIDs);
	      }
	    }
	    if (linkedIDs) {
	      linkedIDs.forEach(function (linkedID) {
	        if (linkedID != null) {
	          _this3._traverse(field, linkedID);
	        }
	      });
	    }
	  };

	  return RelayDataLoader;
	}();

	module.exports = {
	  check: check
	};

/***/ }),
/* 33 */
/***/ (function(module, exports, __webpack_require__) {

	/**
	 * Copyright (c) 2013-present, Facebook, Inc.
	 *
	 * This source code is licensed under the MIT license found in the
	 * LICENSE file in the root directory of this source tree.
	 *
	 * @providesModule RelayModernSelector
	 * 
	 * @format
	 */

	'use strict';

	var _require = __webpack_require__(31),
	    getFragmentVariables = _require.getFragmentVariables;

	var _require2 = __webpack_require__(4),
	    FRAGMENTS_KEY = _require2.FRAGMENTS_KEY,
	    ID_KEY = _require2.ID_KEY;

	/**
	 * @public
	 *
	 * Given the result `item` from a parent that fetched `fragment`, creates a
	 * selector that can be used to read the results of that fragment for that item.
	 *
	 * Example:
	 *
	 * Given two fragments as follows:
	 *
	 * ```
	 * fragment Parent on User {
	 *   id
	 *   ...Child
	 * }
	 * fragment Child on User {
	 *   name
	 * }
	 * ```
	 *
	 * And given some object `parent` that is the results of `Parent` for id "4",
	 * the results of `Child` can be accessed by first getting a selector and then
	 * using that selector to `lookup()` the results against the environment:
	 *
	 * ```
	 * const childSelector = getSelector(queryVariables, Child, parent);
	 * const childData = environment.lookup(childSelector).data;
	 * ```
	 */
	function getSelector(operationVariables, fragment, item) {
	  __webpack_require__(1)(typeof item === 'object' && item !== null && !Array.isArray(item), 'RelayModernSelector: Expected value for fragment `%s` to be an object, got ' + '`%s`.', fragment.name, JSON.stringify(item));
	  var dataID = item[ID_KEY];
	  var fragments = item[FRAGMENTS_KEY];
	  if (typeof dataID === 'string' && typeof fragments === 'object' && fragments !== null && typeof fragments[fragment.name] === 'object' && fragments[fragment.name] !== null) {
	    var argumentVariables = fragments[fragment.name];
	    var fragmentVariables = getFragmentVariables(fragment, operationVariables, argumentVariables);
	    return {
	      dataID: dataID,
	      node: fragment,
	      variables: fragmentVariables
	    };
	  }
	  __webpack_require__(5)(false, 'RelayModernSelector: Expected object to contain data for fragment `%s`, got ' + '`%s`. Make sure that the parent operation/fragment included fragment ' + '`...%s` without `@relay(mask: false)`.', fragment.name, JSON.stringify(item), fragment.name);
	  return null;
	}

	/**
	 * @public
	 *
	 * Given the result `items` from a parent that fetched `fragment`, creates a
	 * selector that can be used to read the results of that fragment on those
	 * items. This is similar to `getSelector` but for "plural" fragments that
	 * expect an array of results and therefore return an array of selectors.
	 */
	function getSelectorList(operationVariables, fragment, items) {
	  var selectors = null;
	  items.forEach(function (item) {
	    var selector = item != null ? getSelector(operationVariables, fragment, item) : null;
	    if (selector != null) {
	      selectors = selectors || [];
	      selectors.push(selector);
	    }
	  });
	  return selectors;
	}

	/**
	 * @public
	 *
	 * Given a mapping of keys -> results and a mapping of keys -> fragments,
	 * extracts the selectors for those fragments from the results.
	 *
	 * The canonical use-case for this function is ReactRelayFragmentContainer, which
	 * uses this function to convert (props, fragments) into selectors so that it
	 * can read the results to pass to the inner component.
	 */
	function getSelectorsFromObject(operationVariables, fragments, object) {
	  var selectors = {};
	  for (var _key in fragments) {
	    if (fragments.hasOwnProperty(_key)) {
	      var fragment = fragments[_key];
	      var item = object[_key];
	      if (item == null) {
	        selectors[_key] = item;
	      } else if (fragment.metadata && fragment.metadata.plural === true) {
	        __webpack_require__(1)(Array.isArray(item), 'RelayModernSelector: Expected value for key `%s` to be an array, got `%s`. ' + 'Remove `@relay(plural: true)` from fragment `%s` to allow the prop to be an object.', _key, JSON.stringify(item), fragment.name);
	        selectors[_key] = getSelectorList(operationVariables, fragment, item);
	      } else {
	        __webpack_require__(1)(!Array.isArray(item), 'RelayModernFragmentSpecResolver: Expected value for key `%s` to be an object, got `%s`. ' + 'Add `@relay(plural: true)` to fragment `%s` to allow the prop to be an array of items.', _key, JSON.stringify(item), fragment.name);
	        selectors[_key] = getSelector(operationVariables, fragment, item);
	      }
	    }
	  }
	  return selectors;
	}

	/**
	 * @public
	 *
	 * Given a mapping of keys -> results and a mapping of keys -> fragments,
	 * extracts a mapping of keys -> id(s) of the results.
	 *
	 * Similar to `getSelectorsFromObject()`, this function can be useful in
	 * determining the "identity" of the props passed to a component.
	 */
	function getDataIDsFromObject(fragments, object) {
	  var ids = {};
	  for (var _key2 in fragments) {
	    if (fragments.hasOwnProperty(_key2)) {
	      var fragment = fragments[_key2];
	      var item = object[_key2];
	      if (item == null) {
	        ids[_key2] = item;
	      } else if (fragment.metadata && fragment.metadata.plural === true) {
	        __webpack_require__(1)(Array.isArray(item), 'RelayModernSelector: Expected value for key `%s` to be an array, got `%s`. ' + 'Remove `@relay(plural: true)` from fragment `%s` to allow the prop to be an object.', _key2, JSON.stringify(item), fragment.name);
	        ids[_key2] = getDataIDs(fragment, item);
	      } else {
	        __webpack_require__(1)(!Array.isArray(item), 'RelayModernFragmentSpecResolver: Expected value for key `%s` to be an object, got `%s`. ' + 'Add `@relay(plural: true)` to fragment `%s` to allow the prop to be an array of items.', _key2, JSON.stringify(item), fragment.name);
	        ids[_key2] = getDataID(fragment, item);
	      }
	    }
	  }
	  return ids;
	}

	/**
	 * @internal
	 */
	function getDataIDs(fragment, items) {
	  var ids = void 0;
	  items.forEach(function (item) {
	    var id = item != null ? getDataID(fragment, item) : null;
	    if (id != null) {
	      ids = ids || [];
	      ids.push(id);
	    }
	  });
	  return ids || null;
	}

	/**
	 * @internal
	 */
	function getDataID(fragment, item) {
	  __webpack_require__(1)(typeof item === 'object' && item !== null && !Array.isArray(item), 'RelayModernSelector: Expected value for fragment `%s` to be an object, got ' + '`%s`.', fragment.name, JSON.stringify(item));
	  var dataID = item[ID_KEY];
	  if (typeof dataID === 'string') {
	    return dataID;
	  }
	  __webpack_require__(5)(false, 'RelayModernSelector: Expected object to contain data for fragment `%s`, got ' + '`%s`. Make sure that the parent operation/fragment included fragment ' + '`...%s` without `@relay(mask: false)`.', fragment.name, JSON.stringify(item), fragment.name);
	  return null;
	}

	/**
	 * @public
	 *
	 * Given a mapping of keys -> results and a mapping of keys -> fragments,
	 * extracts the merged variables that would be in scope for those
	 * fragments/results.
	 *
	 * This can be useful in determing what varaibles were used to fetch the data
	 * for a Relay container, for example.
	 */
	function getVariablesFromObject(operationVariables, fragments, object) {
	  var variables = {};
	  for (var _key3 in fragments) {
	    if (fragments.hasOwnProperty(_key3)) {
	      var _ret = function () {
	        var fragment = fragments[_key3];
	        var item = object[_key3];
	        if (item == null) {
	          return 'continue';
	        } else if (fragment.metadata && fragment.metadata.plural === true) {
	          __webpack_require__(1)(Array.isArray(item), 'RelayModernSelector: Expected value for key `%s` to be an array, got `%s`. ' + 'Remove `@relay(plural: true)` from fragment `%s` to allow the prop to be an object.', _key3, JSON.stringify(item), fragment.name);
	          item.forEach(function (value) {
	            if (value != null) {
	              var itemVariables = getVariables(operationVariables, fragment, value);
	              if (itemVariables) {
	                Object.assign(variables, itemVariables);
	              }
	            }
	          });
	        } else {
	          __webpack_require__(1)(!Array.isArray(item), 'RelayModernFragmentSpecResolver: Expected value for key `%s` to be an object, got `%s`. ' + 'Add `@relay(plural: true)` to fragment `%s` to allow the prop to be an array of items.', _key3, JSON.stringify(item), fragment.name);
	          var itemVariables = getVariables(operationVariables, fragment, item);
	          if (itemVariables) {
	            Object.assign(variables, itemVariables);
	          }
	        }
	      }();

	      if (_ret === 'continue') continue;
	    }
	  }
	  return variables;
	}

	/**
	 * @internal
	 */
	function getVariables(operationVariables, fragment, item) {
	  var selector = getSelector(operationVariables, fragment, item);
	  return selector ? selector.variables : null;
	}

	/**
	 * @public
	 *
	 * Determine if two selectors are equal (represent the same selection). Note
	 * that this function returns `false` when the two queries/fragments are
	 * different objects, even if they select the same fields.
	 */
	function areEqualSelectors(thisSelector, thatSelector) {
	  return thisSelector.dataID === thatSelector.dataID && thisSelector.node === thatSelector.node && __webpack_require__(28)(thisSelector.variables, thatSelector.variables);
	}

	module.exports = {
	  areEqualSelectors: areEqualSelectors,
	  getDataIDsFromObject: getDataIDsFromObject,
	  getSelector: getSelector,
	  getSelectorList: getSelectorList,
	  getSelectorsFromObject: getSelectorsFromObject,
	  getVariablesFromObject: getVariablesFromObject
	};

/***/ }),
/* 34 */
/***/ (function(module, exports, __webpack_require__) {

	/**
	 * Copyright (c) 2013-present, Facebook, Inc.
	 *
	 * This source code is licensed under the MIT license found in the
	 * LICENSE file in the root directory of this source tree.
	 *
	 * @providesModule RelayProfiler
	 * 
	 * @format
	 */

	'use strict';

	var aggregateHandlersByName = {
	  '*': []
	};
	var profileHandlersByName = {
	  '*': []
	};

	var NOT_INVOKED = {};
	var defaultProfiler = { stop: __webpack_require__(29) };
	var shouldInstrument = function shouldInstrument(name) {
	  if (true) {
	    return true;
	  }
	  return name.charAt(0) !== '@';
	};

	/**
	 * @public
	 *
	 * Instruments methods to allow profiling various parts of Relay. Profiling code
	 * in Relay consists of three steps:
	 *
	 *  - Instrument the function to be profiled.
	 *  - Attach handlers to the instrumented function.
	 *  - Run the code which triggers the handlers.
	 *
	 * Handlers attached to instrumented methods are called with an instrumentation
	 * name and a callback that must be synchronously executed:
	 *
	 *   instrumentedMethod.attachHandler(function(name, callback) {
	 *     const start = performance.now();
	 *     callback();
	 *     console.log('Duration', performance.now() - start);
	 *   });
	 *
	 * Handlers for profiles are callbacks that return a stop method:
	 *
	 *   RelayProfiler.attachProfileHandler('profileName', (name, state) => {
	 *     const start = performance.now();
	 *     return function stop(name, state) {
	 *       console.log(`Duration (${name})`, performance.now() - start);
	 *     }
	 *   });
	 *
	 * In order to reduce the impact on performance in production, instrumented
	 * methods and profilers with names that begin with `@` will only be measured
	 * if `__DEV__` is true. This should be used for very hot functions.
	 */
	var RelayProfiler = {
	  /**
	   * Instruments methods on a class or object. This re-assigns the method in
	   * order to preserve function names in stack traces (which are detected by
	   * modern debuggers via heuristics). Example usage:
	   *
	   *   const RelayStore = { primeCache: function() {...} };
	   *   RelayProfiler.instrumentMethods(RelayStore, {
	   *     primeCache: 'RelayStore.primeCache'
	   *   });
	   *
	   *   RelayStore.primeCache.attachHandler(...);
	   *
	   * As a result, the methods will be replaced by wrappers that provide the
	   * `attachHandler` and `detachHandler` methods.
	   */
	  instrumentMethods: function instrumentMethods(object, names) {
	    for (var _key in names) {
	      if (names.hasOwnProperty(_key)) {
	        object[_key] = RelayProfiler.instrument(names[_key], object[_key]);
	      }
	    }
	  },


	  /**
	   * Wraps the supplied function with one that provides the `attachHandler` and
	   * `detachHandler` methods. Example usage:
	   *
	   *   const printRelayQuery =
	   *     RelayProfiler.instrument('printRelayQuery', printRelayQuery);
	   *
	   *   printRelayQuery.attachHandler(...);
	   *
	   * NOTE: The instrumentation assumes that no handlers are attached or detached
	   * in the course of executing another handler.
	   */
	  instrument: function instrument(name, originalFunction) {
	    if (!shouldInstrument(name)) {
	      originalFunction.attachHandler = __webpack_require__(29);
	      originalFunction.detachHandler = __webpack_require__(29);
	      return originalFunction;
	    }
	    if (!aggregateHandlersByName.hasOwnProperty(name)) {
	      aggregateHandlersByName[name] = [];
	    }
	    var catchallHandlers = aggregateHandlersByName['*'];
	    var aggregateHandlers = aggregateHandlersByName[name];
	    var handlers = [];
	    var contexts = [];
	    var invokeHandlers = function invokeHandlers() {
	      var context = contexts[contexts.length - 1];
	      if (context[0]) {
	        context[0]--;
	        catchallHandlers[context[0]](name, invokeHandlers);
	      } else if (context[1]) {
	        context[1]--;
	        aggregateHandlers[context[1]](name, invokeHandlers);
	      } else if (context[2]) {
	        context[2]--;
	        handlers[context[2]](name, invokeHandlers);
	      } else {
	        context[5] = originalFunction.apply(context[3], context[4]);
	      }
	    };
	    var instrumentedCallback = function instrumentedCallback() {
	      var returnValue = void 0;
	      if (aggregateHandlers.length === 0 && handlers.length === 0 && catchallHandlers.length === 0) {
	        returnValue = originalFunction.apply(this, arguments);
	      } else {
	        contexts.push([catchallHandlers.length, aggregateHandlers.length, handlers.length, this, arguments, NOT_INVOKED]);
	        invokeHandlers();
	        var context = contexts.pop();
	        returnValue = context[5];
	        if (returnValue === NOT_INVOKED) {
	          throw new Error('RelayProfiler: Handler did not invoke original function.');
	        }
	      }
	      return returnValue;
	    };
	    instrumentedCallback.attachHandler = function (handler) {
	      handlers.push(handler);
	    };
	    instrumentedCallback.detachHandler = function (handler) {
	      __webpack_require__(30)(handlers, handler);
	    };
	    instrumentedCallback.displayName = '(instrumented ' + name + ')';
	    return instrumentedCallback;
	  },


	  /**
	   * Attaches a handler to all methods instrumented with the supplied name.
	   *
	   *   function createRenderer() {
	   *     return RelayProfiler.instrument('render', function() {...});
	   *   }
	   *   const renderA = createRenderer();
	   *   const renderB = createRenderer();
	   *
	   *   // Only profiles `renderA`.
	   *   renderA.attachHandler(...);
	   *
	   *   // Profiles both `renderA` and `renderB`.
	   *   RelayProfiler.attachAggregateHandler('render', ...);
	   *
	   */
	  attachAggregateHandler: function attachAggregateHandler(name, handler) {
	    if (shouldInstrument(name)) {
	      if (!aggregateHandlersByName.hasOwnProperty(name)) {
	        aggregateHandlersByName[name] = [];
	      }
	      aggregateHandlersByName[name].push(handler);
	    }
	  },


	  /**
	   * Detaches a handler attached via `attachAggregateHandler`.
	   */
	  detachAggregateHandler: function detachAggregateHandler(name, handler) {
	    if (shouldInstrument(name)) {
	      if (aggregateHandlersByName.hasOwnProperty(name)) {
	        __webpack_require__(30)(aggregateHandlersByName[name], handler);
	      }
	    }
	  },


	  /**
	   * Instruments profiling for arbitrarily asynchronous code by a name.
	   *
	   *   const timerProfiler = RelayProfiler.profile('timeout');
	   *   setTimeout(function() {
	   *     timerProfiler.stop();
	   *   }, 1000);
	   *
	   *   RelayProfiler.attachProfileHandler('timeout', ...);
	   *
	   * Arbitrary state can also be passed into `profile` as a second argument. The
	   * attached profile handlers will receive this as the second argument.
	   */
	  profile: function profile(name, state) {
	    var hasCatchAllHandlers = profileHandlersByName['*'].length > 0;
	    var hasNamedHandlers = profileHandlersByName.hasOwnProperty(name);
	    if (hasNamedHandlers || hasCatchAllHandlers) {
	      var profileHandlers = hasNamedHandlers && hasCatchAllHandlers ? profileHandlersByName[name].concat(profileHandlersByName['*']) : hasNamedHandlers ? profileHandlersByName[name] : profileHandlersByName['*'];
	      var stopHandlers = void 0;
	      for (var ii = profileHandlers.length - 1; ii >= 0; ii--) {
	        var profileHandler = profileHandlers[ii];
	        var stopHandler = profileHandler(name, state);
	        stopHandlers = stopHandlers || [];
	        stopHandlers.unshift(stopHandler);
	      }
	      return {
	        stop: function stop() {
	          if (stopHandlers) {
	            stopHandlers.forEach(function (stopHandler) {
	              return stopHandler();
	            });
	          }
	        }
	      };
	    }
	    return defaultProfiler;
	  },


	  /**
	   * Attaches a handler to profiles with the supplied name. You can also
	   * attach to the special name '*' which is a catch all.
	   */
	  attachProfileHandler: function attachProfileHandler(name, handler) {
	    if (shouldInstrument(name)) {
	      if (!profileHandlersByName.hasOwnProperty(name)) {
	        profileHandlersByName[name] = [];
	      }
	      profileHandlersByName[name].push(handler);
	    }
	  },


	  /**
	   * Detaches a handler attached via `attachProfileHandler`.
	   */
	  detachProfileHandler: function detachProfileHandler(name, handler) {
	    if (shouldInstrument(name)) {
	      if (profileHandlersByName.hasOwnProperty(name)) {
	        __webpack_require__(30)(profileHandlersByName[name], handler);
	      }
	    }
	  }
	};

	module.exports = RelayProfiler;

/***/ }),
/* 35 */
/***/ (function(module, exports, __webpack_require__) {

	/**
	 * Copyright (c) 2013-present, Facebook, Inc.
	 *
	 * This source code is licensed under the MIT license found in the
	 * LICENSE file in the root directory of this source tree.
	 *
	 * @providesModule RelayViewerHandler
	 * 
	 * @format
	 */

	'use strict';

	var _require = __webpack_require__(4),
	    ROOT_ID = _require.ROOT_ID;

	var VIEWER_ID = __webpack_require__(11)(ROOT_ID, 'viewer');
	var VIEWER_TYPE = 'Viewer';

	/**
	 * A runtime handler for the `viewer` field. The actual viewer record will
	 * *never* be accessed at runtime because all fragments that reference it will
	 * delegate to the handle field. So in order to prevent GC from having to check
	 * both the original server field *and* the handle field (which would be almost
	 * duplicate work), the handler copies server fields and then deletes the server
	 * record.
	 *
	 * NOTE: This means other handles may not be added on viewer, since they may
	 * execute after this handle when the server record is already deleted.
	 */
	function update(store, payload) {
	  var record = store.get(payload.dataID);
	  if (!record) {
	    return;
	  }
	  var serverViewer = record.getLinkedRecord(payload.fieldKey);
	  if (!serverViewer) {
	    record.setValue(null, payload.handleKey);
	    return;
	  }
	  // Server data already has viewer data at `client:root:viewer`, so link the
	  // handle field to the server viewer record.
	  if (serverViewer.getDataID() === VIEWER_ID) {
	    record.setValue(null, payload.fieldKey);
	    record.setLinkedRecord(serverViewer, payload.handleKey);
	    return;
	  }
	  // Other ways to access viewer such as mutations may have a different id for
	  // viewer: synthesize a record at the canonical viewer id, copy its fields
	  // from the server record, and delete the server record link to speed up GC.
	  var clientViewer = store.get(VIEWER_ID) || store.create(VIEWER_ID, VIEWER_TYPE);
	  clientViewer.copyFieldsFrom(serverViewer);
	  record.setValue(null, payload.fieldKey);
	  record.setLinkedRecord(clientViewer, payload.handleKey);

	  // Make sure the root object points to the viewer object as well
	  var root = store.getRoot();
	  root.setLinkedRecord(clientViewer, payload.handleKey);
	}

	module.exports = {
	  VIEWER_ID: VIEWER_ID,
	  update: update
	};

/***/ }),
/* 36 */
/***/ (function(module, exports, __webpack_require__) {

	/**
	 * Copyright (c) 2013-present, Facebook, Inc.
	 *
	 * This source code is licensed under the MIT license found in the
	 * LICENSE file in the root directory of this source tree.
	 *
	 * @providesModule cloneRelayHandleSourceField
	 * 
	 * @format
	 */

	'use strict';

	var _extends3 = _interopRequireDefault(__webpack_require__(13));

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

	var _require = __webpack_require__(4),
	    getHandleFilterValues = _require.getHandleFilterValues;

	var LINKED_FIELD = __webpack_require__(3).LINKED_FIELD;

	/**
	 * @private
	 *
	 * Creates a clone of the supplied `handleField` by finding the original linked
	 * field (on which the handle was declared) among the sibling `selections`, and
	 * copying its selections into the clone.
	 */


	function cloneRelayHandleSourceField(handleField, selections, variables) {
	  var sourceField = selections.find(function (source) {
	    return source.kind === LINKED_FIELD && source.name === handleField.name && source.alias === handleField.alias && __webpack_require__(28)(source.args, handleField.args);
	  });
	  __webpack_require__(1)(sourceField && sourceField.kind === LINKED_FIELD, 'cloneRelayHandleSourceField: Expected a corresponding source field for ' + 'handle `%s`.', handleField.handle);
	  var handleKey = __webpack_require__(20)(handleField.handle, handleField.key, handleField.name);
	  if (handleField.filters && handleField.filters.length > 0) {
	    var filterValues = getHandleFilterValues(handleField.args || [], handleField.filters, variables);
	    handleKey = __webpack_require__(7)(handleKey, filterValues);
	  }

	  var clonedField = (0, _extends3['default'])({}, sourceField, {
	    args: null,
	    name: handleKey,
	    storageKey: handleKey
	  });
	  return clonedField;
	}

	module.exports = cloneRelayHandleSourceField;

/***/ }),
/* 37 */
/***/ (function(module, exports, __webpack_require__) {

	/**
	 * Copyright (c) 2013-present, Facebook, Inc.
	 *
	 * This source code is licensed under the MIT license found in the
	 * LICENSE file in the root directory of this source tree.
	 *
	 * @providesModule normalizePayload
	 * 
	 * @format
	 */

	'use strict';

	var _extends3 = _interopRequireDefault(__webpack_require__(13));

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

	var _require = __webpack_require__(4),
	    ROOT_ID = _require.ROOT_ID;

	function normalizePayload(operation, variables, payload) {
	  var data = payload.data,
	      errors = payload.errors;

	  if (data != null) {
	    return __webpack_require__(15)({
	      dataID: ROOT_ID,
	      node: operation.query,
	      variables: payload.rerunVariables ? (0, _extends3['default'])({}, variables, payload.rerunVariables) : variables
	    }, data, errors, { handleStrippedNulls: true });
	  }
	  var error = __webpack_require__(42).create('RelayNetwork', 'No data returned for operation `%s`, got error(s):\n%s\n\nSee the error ' + '`source` property for more information.', operation.name, errors ? errors.map(function (_ref) {
	    var message = _ref.message;
	    return message;
	  }).join('\n') : '(No errors)');
	  error.source = { errors: errors, operation: operation, variables: variables };
	  throw error;
	}

	module.exports = normalizePayload;

/***/ }),
/* 38 */
/***/ (function(module, exports, __webpack_require__) {

	/**
	 * Copyright (c) 2013-present, Facebook, Inc.
	 *
	 * This source code is licensed under the MIT license found in the
	 * LICENSE file in the root directory of this source tree.
	 *
	 * @providesModule ConvertToExecuteFunction
	 * 
	 * @format
	 */

	'use strict';

	/**
	 * Converts a FetchFunction into an ExecuteFunction for use by RelayNetwork.
	 */
	function convertFetch(fn) {
	  return function fetch(operation, variables, cacheConfig, uploadables) {
	    var result = fn(operation, variables, cacheConfig, uploadables);
	    // Note: We allow FetchFunction to directly return Error to indicate
	    // a failure to fetch. To avoid handling this special case throughout the
	    // Relay codebase, it is explicitly handled here.
	    if (result instanceof Error) {
	      return new (__webpack_require__(17))(function (sink) {
	        return sink.error(result);
	      });
	    }
	    return __webpack_require__(17).from(result);
	  };
	}

	/**
	 * Converts a SubscribeFunction into an ExecuteFunction for use by RelayNetwork.
	 */
	function convertSubscribe(fn) {
	  return function subscribe(operation, variables, cacheConfig) {
	    return __webpack_require__(17).fromLegacy(function (observer) {
	      return fn(operation, variables, cacheConfig, observer);
	    });
	  };
	}

	module.exports = {
	  convertFetch: convertFetch,
	  convertSubscribe: convertSubscribe
	};

/***/ }),
/* 39 */
/***/ (function(module, exports, __webpack_require__) {

	/**
	 * Copyright (c) 2013-present, Facebook, Inc.
	 * All rights reserved.
	 *
	 * This source code is licensed under the BSD-style license found in the
	 * LICENSE file in the root directory of this source tree. An additional grant
	 * of patent rights can be found in the PATENTS file in the same directory.
	 *
	 * @providesModule RelayDebugger
	 * 
	 * @format
	 */

	'use strict';

	var _classCallCheck3 = _interopRequireDefault(__webpack_require__(6));

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

	var RelayDebugger = function () {
	  function RelayDebugger() {
	    (0, _classCallCheck3['default'])(this, RelayDebugger);

	    this._idCounter = 1;
	    this._envDebuggers = new Map();
	  }

	  RelayDebugger.prototype.registerEnvironment = function registerEnvironment(env) {
	    var idString = 'RelayModernEnvironment' + this._idCounter++;
	    this._envDebuggers.set(idString, new EnvironmentDebugger(env, idString));
	    return idString;
	  };

	  RelayDebugger.prototype.getEnvironmentDebugger = function getEnvironmentDebugger(id) {
	    var envDebugger = this._envDebuggers.get(id);
	    if (!envDebugger) {
	      throw new Error('No registered environment: ' + id);
	    }

	    return envDebugger;
	  };

	  RelayDebugger.prototype.getRegisteredEnvironmentIds = function getRegisteredEnvironmentIds() {
	    return Array.from(this._envDebuggers.keys());
	  };

	  return RelayDebugger;
	}();

	var EnvironmentDebugger = function () {
	  function EnvironmentDebugger(environment, id) {
	    (0, _classCallCheck3['default'])(this, EnvironmentDebugger);

	    this._environment = environment;
	    this._id = id;
	    this._envIsDirty = false;
	    this._monkeyPatchSource();

	    this._recordedMutationEvents = [];
	    this._isRecordingMutationEvents = false;
	  }

	  EnvironmentDebugger.prototype.getEnvironment = function getEnvironment() {
	    return this._environment;
	  };

	  EnvironmentDebugger.prototype.getId = function getId() {
	    return this._id;
	  };

	  EnvironmentDebugger.prototype.getMatchingRecords = function getMatchingRecords(matchStr, matchType) {
	    var inspector = __webpack_require__(22).getForEnvironment(this._environment);

	    function isMatching(record) {
	      if (matchType === 'idtype') {
	        return record.id.includes(matchStr) || !!record.type && record.type.includes(matchStr);
	      }
	      if (matchType === 'id') {
	        return record.id.includes(matchStr);
	      }
	      if (matchType === 'type') {
	        return !!record.type && record.type.includes(matchStr);
	      }
	      if (matchType === 'predicate') {
	        var recordInspector = inspector.get(record.id);
	        var fields = recordInspector && recordInspector.inspect();
	        if (typeof fields === 'object' && fields !== null) {
	          throw new Error('Not implemented');
	        }
	        return false;
	      }
	      throw new Error('Unknown match type: ' + matchType);
	    }

	    return inspector.getRecords().filter(isMatching);
	  };

	  EnvironmentDebugger.prototype.getRecord = function getRecord(id) {
	    var inspector = __webpack_require__(22).getForEnvironment(this._environment);
	    var recordInspector = inspector.get(id);
	    return recordInspector && recordInspector.inspect();
	  };

	  EnvironmentDebugger.prototype._monkeyPatchSource = function _monkeyPatchSource() {
	    var _this = this;

	    var source = this._environment.getStore().getSource();
	    var originalSet = source.set;
	    var originalRemove = source.remove;

	    source.set = function () {
	      for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
	        args[_key] = arguments[_key];
	      }

	      originalSet.apply(source, args);
	      _this.triggerDirty();
	    };
	    source.remove = function () {
	      for (var _len2 = arguments.length, args = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
	        args[_key2] = arguments[_key2];
	      }

	      originalRemove.apply(source, args);
	      _this.triggerDirty();
	    };
	  };

	  EnvironmentDebugger.prototype.triggerDirty = function triggerDirty() {
	    this._envIsDirty = true;
	  };

	  EnvironmentDebugger.prototype.isDirty = function isDirty() {
	    return this._envIsDirty;
	  };

	  EnvironmentDebugger.prototype.resetDirty = function resetDirty() {
	    this._envIsDirty = false;
	  };

	  EnvironmentDebugger.prototype.startRecordingMutationEvents = function startRecordingMutationEvents() {
	    this._isRecordingMutationEvents = true;
	    this._recordedMutationEvents = [];
	  };

	  EnvironmentDebugger.prototype.stopRecordingMutationEvents = function stopRecordingMutationEvents() {
	    this._isRecordingMutationEvents = false;
	  };

	  EnvironmentDebugger.prototype.getRecordedMutationEvents = function getRecordedMutationEvents() {
	    return this._recordedMutationEvents;
	  };

	  EnvironmentDebugger.prototype.recordMutationEvent = function recordMutationEvent(_ref) {
	    var eventName = _ref.eventName,
	        seriesId = _ref.seriesId,
	        payload = _ref.payload,
	        mutation = _ref.mutation,
	        fn = _ref.fn;

	    if (this._isRecordingMutationEvents) {
	      var getSnapshot = function getSnapshot() {
	        var snapshot = {};
	        var ids = source.getRecordIDs();
	        ids.forEach(function (id) {
	          snapshot[id] = source.get(id);
	        });
	        return snapshot;
	      };

	      var source = this._environment.getStore().getSource();


	      var _snapshotBefore = getSnapshot();
	      fn();
	      var _snapshotAfter = getSnapshot();

	      var event = {
	        eventName: eventName,
	        seriesId: seriesId,
	        payload: payload,
	        snapshotBefore: _snapshotBefore,
	        snapshotAfter: _snapshotAfter,
	        mutation: mutation
	      };

	      this._recordedMutationEvents.push(event);
	    } else {
	      fn();
	    }
	  };

	  return EnvironmentDebugger;
	}();

	module.exports = {
	  RelayDebugger: RelayDebugger,
	  EnvironmentDebugger: EnvironmentDebugger
	};

/***/ }),
/* 40 */
/***/ (function(module, exports) {

	/**
	 * Copyright (c) 2013-present, Facebook, Inc.
	 *
	 * This source code is licensed under the MIT license found in the
	 * LICENSE file in the root directory of this source tree.
	 *
	 * @providesModule RelayDefaultHandleKey
	 * 
	 * @format
	 */

	'use strict';

	module.exports = {
	  DEFAULT_HANDLE_KEY: ''
	};

/***/ }),
/* 41 */
/***/ (function(module, exports, __webpack_require__) {

	/**
	 * Copyright (c) 2013-present, Facebook, Inc.
	 *
	 * This source code is licensed under the MIT license found in the
	 * LICENSE file in the root directory of this source tree.
	 *
	 * @providesModule RelayDefaultHandlerProvider
	 * 
	 * @format
	 */

	'use strict';

	function RelayDefaultHandlerProvider(handle) {
	  switch (handle) {
	    case 'connection':
	      return __webpack_require__(9);
	    case 'viewer':
	      return __webpack_require__(35);
	  }
	  __webpack_require__(1)(false, 'RelayDefaultHandlerProvider: No handler provided for `%s`.', handle);
	}

	module.exports = RelayDefaultHandlerProvider;

/***/ }),
/* 42 */
/***/ (function(module, exports, __webpack_require__) {

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

	var _toConsumableArray3 = _interopRequireDefault(__webpack_require__(64));

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
	  var error = new Error(__webpack_require__(67).apply(undefined, [format].concat((0, _toConsumableArray3['default'])(args))));
	  error.name = name;
	  error.type = type;
	  error.framesToPop = 2;
	  return error;
	}

	module.exports = RelayError;

/***/ }),
/* 43 */
/***/ (function(module, exports, __webpack_require__) {

	/**
	 * Copyright (c) 2013-present, Facebook, Inc.
	 *
	 * This source code is licensed under the MIT license found in the
	 * LICENSE file in the root directory of this source tree.
	 *
	 * @providesModule RelayMarkSweepStore
	 * 
	 * @format
	 */

	'use strict';

	var _extends3 = _interopRequireDefault(__webpack_require__(13));

	var _classCallCheck3 = _interopRequireDefault(__webpack_require__(6));

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

	var _require = __webpack_require__(4),
	    UNPUBLISH_RECORD_SENTINEL = _require.UNPUBLISH_RECORD_SENTINEL;

	/**
	 * @public
	 *
	 * An implementation of the `Store` interface defined in `RelayStoreTypes`.
	 *
	 * Note that a Store takes ownership of all records provided to it: other
	 * objects may continue to hold a reference to such records but may not mutate
	 * them. The static Relay core is architected to avoid mutating records that may have been
	 * passed to a store: operations that mutate records will either create fresh
	 * records or clone existing records and modify the clones. Record immutability
	 * is also enforced in development mode by freezing all records passed to a store.
	 */
	var RelayMarkSweepStore = function () {
	  function RelayMarkSweepStore(source) {
	    (0, _classCallCheck3['default'])(this, RelayMarkSweepStore);

	    // Prevent mutation of a record from outside the store.
	    if (true) {
	      var storeIDs = source.getRecordIDs();
	      for (var ii = 0; ii < storeIDs.length; ii++) {
	        var record = source.get(storeIDs[ii]);
	        if (record) {
	          __webpack_require__(2).freeze(record);
	        }
	      }
	    }
	    this._hasScheduledGC = false;
	    this._index = 0;
	    this._recordSource = source;
	    this._roots = new Map();
	    this._subscriptions = new Set();
	    this._updatedRecordIDs = {};
	  }

	  RelayMarkSweepStore.prototype.getSource = function getSource() {
	    return this._recordSource;
	  };

	  RelayMarkSweepStore.prototype.check = function check(selector) {
	    return __webpack_require__(32).check(this._recordSource, this._recordSource, selector, []);
	  };

	  RelayMarkSweepStore.prototype.retain = function retain(selector) {
	    var _this = this;

	    var index = this._index++;
	    var dispose = function dispose() {
	      _this._roots['delete'](index);
	      _this._scheduleGC();
	    };
	    this._roots.set(index, selector);
	    return { dispose: dispose };
	  };

	  RelayMarkSweepStore.prototype.lookup = function lookup(selector) {
	    var snapshot = __webpack_require__(21).read(this._recordSource, selector);
	    if (true) {
	      __webpack_require__(19)(snapshot);
	    }
	    return snapshot;
	  };

	  RelayMarkSweepStore.prototype.notify = function notify() {
	    var _this2 = this;

	    this._subscriptions.forEach(function (subscription) {
	      _this2._updateSubscription(subscription);
	    });
	    this._updatedRecordIDs = {};
	  };

	  RelayMarkSweepStore.prototype.publish = function publish(source) {
	    updateTargetFromSource(this._recordSource, source, this._updatedRecordIDs);
	  };

	  RelayMarkSweepStore.prototype.subscribe = function subscribe(snapshot, callback) {
	    var _this3 = this;

	    var subscription = { callback: callback, snapshot: snapshot };
	    var dispose = function dispose() {
	      _this3._subscriptions['delete'](subscription);
	    };
	    this._subscriptions.add(subscription);
	    return { dispose: dispose };
	  };

	  // Internal API


	  RelayMarkSweepStore.prototype.__getUpdatedRecordIDs = function __getUpdatedRecordIDs() {
	    return this._updatedRecordIDs;
	  };

	  RelayMarkSweepStore.prototype._updateSubscription = function _updateSubscription(subscription) {
	    var callback = subscription.callback,
	        snapshot = subscription.snapshot;

	    if (!__webpack_require__(57)(snapshot, this._updatedRecordIDs)) {
	      return;
	    }

	    var _RelayReader$read = __webpack_require__(21).read(this._recordSource, snapshot),
	        data = _RelayReader$read.data,
	        seenRecords = _RelayReader$read.seenRecords;

	    var nextData = __webpack_require__(60)(snapshot.data, data);
	    var nextSnapshot = (0, _extends3['default'])({}, snapshot, {
	      data: nextData,
	      seenRecords: seenRecords
	    });
	    if (true) {
	      __webpack_require__(19)(nextSnapshot);
	    }
	    subscription.snapshot = nextSnapshot;
	    if (nextSnapshot.data !== snapshot.data) {
	      callback(nextSnapshot);
	    }
	  };

	  RelayMarkSweepStore.prototype._scheduleGC = function _scheduleGC() {
	    var _this4 = this;

	    if (this._hasScheduledGC) {
	      return;
	    }
	    this._hasScheduledGC = true;
	    __webpack_require__(66)(function () {
	      _this4._gc();
	      _this4._hasScheduledGC = false;
	    });
	  };

	  RelayMarkSweepStore.prototype._gc = function _gc() {
	    var _this5 = this;

	    var references = new Set();
	    // Mark all records that are traversable from a root
	    this._roots.forEach(function (selector) {
	      __webpack_require__(51).mark(_this5._recordSource, selector, references);
	    });
	    // Short-circuit if *nothing* is referenced
	    if (!references.size) {
	      this._recordSource.clear();
	      return;
	    }
	    // Evict any unreferenced nodes
	    var storeIDs = this._recordSource.getRecordIDs();
	    for (var ii = 0; ii < storeIDs.length; ii++) {
	      var dataID = storeIDs[ii];
	      if (!references.has(dataID)) {
	        this._recordSource.remove(dataID);
	      }
	    }
	  };

	  return RelayMarkSweepStore;
	}();

	/**
	 * Updates the target with information from source, also updating a mapping of
	 * which records in the target were changed as a result.
	 */


	function updateTargetFromSource(target, source, updatedRecordIDs) {
	  var dataIDs = source.getRecordIDs();
	  for (var ii = 0; ii < dataIDs.length; ii++) {
	    var dataID = dataIDs[ii];
	    var sourceRecord = source.get(dataID);
	    var targetRecord = target.get(dataID);
	    // Prevent mutation of a record from outside the store.
	    if (true) {
	      if (sourceRecord) {
	        __webpack_require__(2).freeze(sourceRecord);
	      }
	    }
	    if (sourceRecord === UNPUBLISH_RECORD_SENTINEL) {
	      // Unpublish a record
	      target.remove(dataID);
	      updatedRecordIDs[dataID] = true;
	    } else if (sourceRecord && targetRecord) {
	      var nextRecord = __webpack_require__(2).update(targetRecord, sourceRecord);
	      if (nextRecord !== targetRecord) {
	        // Prevent mutation of a record from outside the store.
	        if (true) {
	          __webpack_require__(2).freeze(nextRecord);
	        }
	        updatedRecordIDs[dataID] = true;
	        target.set(dataID, nextRecord);
	      }
	    } else if (sourceRecord === null) {
	      target['delete'](dataID);
	      if (targetRecord !== null) {
	        updatedRecordIDs[dataID] = true;
	      }
	    } else if (sourceRecord) {
	      target.set(dataID, sourceRecord);
	      updatedRecordIDs[dataID] = true;
	    } // don't add explicit undefined
	  }
	}

	__webpack_require__(34).instrumentMethods(RelayMarkSweepStore.prototype, {
	  lookup: 'RelayMarkSweepStore.prototype.lookup',
	  notify: 'RelayMarkSweepStore.prototype.notify',
	  publish: 'RelayMarkSweepStore.prototype.publish',
	  retain: 'RelayMarkSweepStore.prototype.retain',
	  subscribe: 'RelayMarkSweepStore.prototype.subscribe'
	});

	module.exports = RelayMarkSweepStore;

/***/ }),
/* 44 */
/***/ (function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(global) {/**
	 * Copyright (c) 2013-present, Facebook, Inc.
	 *
	 * This source code is licensed under the MIT license found in the
	 * LICENSE file in the root directory of this source tree.
	 *
	 * @providesModule RelayModernEnvironment
	 * 
	 * @format
	 */

	'use strict';

	var _classCallCheck3 = _interopRequireDefault(__webpack_require__(6));

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

	var RelayModernEnvironment = function () {
	  function RelayModernEnvironment(config) {
	    var _this = this;

	    (0, _classCallCheck3['default'])(this, RelayModernEnvironment);

	    this.configName = config.configName;
	    var handlerProvider = config.handlerProvider ? config.handlerProvider : __webpack_require__(41);
	    this._network = config.network;
	    this._publishQueue = new (__webpack_require__(48))(config.store, handlerProvider);
	    this._store = config.store;
	    this.unstable_internal = __webpack_require__(8);

	    this.__setNet = function (newNet) {
	      return _this._network = newNet;
	    };

	    // TODO(#21781004): This adds support for the older Relay Debugger, which
	    // has been replaced with the Relay DevTools global hook below. This logic
	    // should stick around for a release or two to not break support for the
	    // existing debugger. After allowing time to migrate to latest versions,
	    // this code can be removed.
	    if (true) {
	      var g = typeof global !== 'undefined' ? global : window;

	      // Attach the debugger symbol to the global symbol so it can be accessed by
	      // devtools extension.
	      if (!g.__RELAY_DEBUGGER__) {
	        var _require = __webpack_require__(39),
	            RelayDebugger = _require.RelayDebugger;

	        g.__RELAY_DEBUGGER__ = new RelayDebugger();
	      }

	      // Setup the runtime part for Native
	      if (typeof g.registerDevtoolsPlugin === 'function') {
	        try {
	          g.registerDevtoolsPlugin(__webpack_require__(68));
	        } catch (error) {
	          // No debugger for you.
	        }
	      }

	      var envId = g.__RELAY_DEBUGGER__.registerEnvironment(this);
	      this._debugger = g.__RELAY_DEBUGGER__.getEnvironmentDebugger(envId);
	    } else {
	      this._debugger = null;
	    }

	    // Register this Relay Environment with Relay DevTools if it exists.
	    // Note: this must always be the last step in the constructor.
	    var _global = typeof global !== 'undefined' ? global : typeof window !== 'undefined' ? window : undefined;
	    var devToolsHook = _global && _global.__RELAY_DEVTOOLS_HOOK__;
	    if (devToolsHook) {
	      devToolsHook.registerEnvironment(this);
	    }
	  }

	  RelayModernEnvironment.prototype.getStore = function getStore() {
	    return this._store;
	  };

	  RelayModernEnvironment.prototype.getNetwork = function getNetwork() {
	    return this._network;
	  };

	  RelayModernEnvironment.prototype.getDebugger = function getDebugger() {
	    return this._debugger;
	  };

	  RelayModernEnvironment.prototype.applyUpdate = function applyUpdate(optimisticUpdate) {
	    var _this2 = this;

	    var dispose = function dispose() {
	      _this2._publishQueue.revertUpdate(optimisticUpdate);
	      _this2._publishQueue.run();
	    };
	    this._publishQueue.applyUpdate(optimisticUpdate);
	    this._publishQueue.run();
	    return { dispose: dispose };
	  };

	  RelayModernEnvironment.prototype.revertUpdate = function revertUpdate(update) {
	    this._publishQueue.revertUpdate(update);
	    this._publishQueue.run();
	  };

	  RelayModernEnvironment.prototype.replaceUpdate = function replaceUpdate(update, newUpdate) {
	    this._publishQueue.revertUpdate(update);
	    this._publishQueue.applyUpdate(newUpdate);
	    this._publishQueue.run();
	  };

	  RelayModernEnvironment.prototype.applyMutation = function applyMutation(_ref) {
	    var operation = _ref.operation,
	        optimisticResponse = _ref.optimisticResponse,
	        optimisticUpdater = _ref.optimisticUpdater;

	    return this.applyUpdate({
	      operation: operation,
	      selectorStoreUpdater: optimisticUpdater,
	      response: optimisticResponse || null
	    });
	  };

	  RelayModernEnvironment.prototype.check = function check(readSelector) {
	    return this._store.check(readSelector);
	  };

	  RelayModernEnvironment.prototype.commitPayload = function commitPayload(operationSelector, payload) {
	    // Do not handle stripped nulls when commiting a payload
	    var relayPayload = __webpack_require__(15)(operationSelector.root, payload);
	    this._publishQueue.commitPayload(operationSelector, relayPayload);
	    this._publishQueue.run();
	  };

	  RelayModernEnvironment.prototype.commitUpdate = function commitUpdate(updater) {
	    this._publishQueue.commitUpdate(updater);
	    this._publishQueue.run();
	  };

	  RelayModernEnvironment.prototype.lookup = function lookup(readSelector) {
	    return this._store.lookup(readSelector);
	  };

	  RelayModernEnvironment.prototype.subscribe = function subscribe(snapshot, callback) {
	    return this._store.subscribe(snapshot, callback);
	  };

	  RelayModernEnvironment.prototype.retain = function retain(selector) {
	    return this._store.retain(selector);
	  };

	  /**
	   * Returns an Observable of RelayResponsePayload resulting from executing the
	   * provided Query or Subscription operation, each result of which is then
	   * normalized and committed to the publish queue.
	   *
	   * Note: Observables are lazy, so calling this method will do nothing until
	   * the result is subscribed to: environment.execute({...}).subscribe({...}).
	   */


	  RelayModernEnvironment.prototype.execute = function execute(_ref2) {
	    var _this3 = this;

	    var operation = _ref2.operation,
	        cacheConfig = _ref2.cacheConfig,
	        updater = _ref2.updater;
	    var node = operation.node,
	        variables = operation.variables;

	    return this._network.execute(node, variables, cacheConfig || {}).map(function (payload) {
	      return __webpack_require__(37)(node, variables, payload);
	    })['do']({
	      next: function next(payload) {
	        _this3._publishQueue.commitPayload(operation, payload, updater);
	        _this3._publishQueue.run();
	      }
	    });
	  };

	  /**
	   * Returns an Observable of RelayResponsePayload resulting from executing the
	   * provided Mutation operation, the result of which is then normalized and
	   * committed to the publish queue along with an optional optimistic response
	   * or updater.
	   *
	   * Note: Observables are lazy, so calling this method will do nothing until
	   * the result is subscribed to:
	   * environment.executeMutation({...}).subscribe({...}).
	   */


	  RelayModernEnvironment.prototype.executeMutation = function executeMutation(_ref3) {
	    var _this4 = this;

	    var operation = _ref3.operation,
	        optimisticResponse = _ref3.optimisticResponse,
	        optimisticUpdater = _ref3.optimisticUpdater,
	        updater = _ref3.updater,
	        uploadables = _ref3.uploadables;
	    var node = operation.node,
	        variables = operation.variables;

	    var mutationUid = nextMutationUid();

	    var optimisticUpdate = void 0;
	    if (optimisticResponse || optimisticUpdater) {
	      optimisticUpdate = {
	        operation: operation,
	        selectorStoreUpdater: optimisticUpdater,
	        response: optimisticResponse || null
	      };
	    }

	    return this._network.execute(node, variables, { force: true }, uploadables).map(function (payload) {
	      return __webpack_require__(37)(node, variables, payload);
	    })['do']({
	      start: function start() {
	        if (optimisticUpdate) {
	          _this4._recordDebuggerEvent({
	            eventName: 'optimistic_update',
	            mutationUid: mutationUid,
	            operation: operation,
	            fn: function fn() {
	              if (optimisticUpdate) {
	                _this4._publishQueue.applyUpdate(optimisticUpdate);
	              }
	              _this4._publishQueue.run();
	            }
	          });
	        }
	      },
	      next: function next(payload) {
	        _this4._recordDebuggerEvent({
	          eventName: 'request_commit',
	          mutationUid: mutationUid,
	          operation: operation,
	          payload: payload,
	          fn: function fn() {
	            if (optimisticUpdate) {
	              _this4._publishQueue.revertUpdate(optimisticUpdate);
	              optimisticUpdate = undefined;
	            }
	            _this4._publishQueue.commitPayload(operation, payload, updater);
	            _this4._publishQueue.run();
	          }
	        });
	      },
	      error: function (_error) {
	        function error(_x) {
	          return _error.apply(this, arguments);
	        }

	        error.toString = function () {
	          return _error.toString();
	        };

	        return error;
	      }(function (error) {
	        _this4._recordDebuggerEvent({
	          eventName: 'request_error',
	          mutationUid: mutationUid,
	          operation: operation,
	          payload: error,
	          fn: function fn() {
	            if (optimisticUpdate) {
	              _this4._publishQueue.revertUpdate(optimisticUpdate);
	            }
	            _this4._publishQueue.run();
	          }
	        });
	      }),
	      unsubscribe: function unsubscribe() {
	        if (optimisticUpdate) {
	          _this4._recordDebuggerEvent({
	            eventName: 'optimistic_revert',
	            mutationUid: mutationUid,
	            operation: operation,
	            fn: function fn() {
	              if (optimisticUpdate) {
	                _this4._publishQueue.revertUpdate(optimisticUpdate);
	              }
	              _this4._publishQueue.run();
	            }
	          });
	        }
	      }
	    });
	  };

	  /**
	   * @deprecated Use Environment.execute().subscribe()
	   */


	  RelayModernEnvironment.prototype.sendQuery = function sendQuery(_ref4) {
	    var cacheConfig = _ref4.cacheConfig,
	        onCompleted = _ref4.onCompleted,
	        onError = _ref4.onError,
	        onNext = _ref4.onNext,
	        operation = _ref4.operation;

	    __webpack_require__(5)(false, 'environment.sendQuery() is deprecated. Update to the latest ' + 'version of react-relay, and use environment.execute().');
	    return this.execute({ operation: operation, cacheConfig: cacheConfig }).subscribeLegacy({
	      onNext: onNext,
	      onError: onError,
	      onCompleted: onCompleted
	    });
	  };

	  /**
	   * @deprecated Use Environment.execute().subscribe()
	   */


	  RelayModernEnvironment.prototype.streamQuery = function streamQuery(_ref5) {
	    var cacheConfig = _ref5.cacheConfig,
	        onCompleted = _ref5.onCompleted,
	        onError = _ref5.onError,
	        onNext = _ref5.onNext,
	        operation = _ref5.operation;

	    __webpack_require__(5)(false, 'environment.streamQuery() is deprecated. Update to the latest ' + 'version of react-relay, and use environment.execute().');
	    return this.execute({ operation: operation, cacheConfig: cacheConfig }).subscribeLegacy({
	      onNext: onNext,
	      onError: onError,
	      onCompleted: onCompleted
	    });
	  };

	  /**
	   * @deprecated Use Environment.executeMutation().subscribe()
	   */


	  RelayModernEnvironment.prototype.sendMutation = function sendMutation(_ref6) {
	    var onCompleted = _ref6.onCompleted,
	        onError = _ref6.onError,
	        operation = _ref6.operation,
	        optimisticResponse = _ref6.optimisticResponse,
	        optimisticUpdater = _ref6.optimisticUpdater,
	        updater = _ref6.updater,
	        uploadables = _ref6.uploadables;

	    __webpack_require__(5)(false, 'environment.sendMutation() is deprecated. Update to the latest ' + 'version of react-relay, and use environment.executeMutation().');
	    return this.executeMutation({
	      operation: operation,
	      optimisticResponse: optimisticResponse,
	      optimisticUpdater: optimisticUpdater,
	      updater: updater,
	      uploadables: uploadables
	    }).subscribeLegacy({
	      // NOTE: sendMutation has a non-standard use of onCompleted() by passing
	      // it a value. When switching to use executeMutation(), the next()
	      // Observer should be used to preserve behavior.
	      onNext: function onNext(payload) {
	        onCompleted && onCompleted(payload.errors);
	      },
	      onError: onError,
	      onCompleted: onCompleted
	    });
	  };

	  /**
	   * @deprecated Use Environment.execute().subscribe()
	   */


	  RelayModernEnvironment.prototype.sendSubscription = function sendSubscription(_ref7) {
	    var onCompleted = _ref7.onCompleted,
	        onNext = _ref7.onNext,
	        onError = _ref7.onError,
	        operation = _ref7.operation,
	        updater = _ref7.updater;

	    __webpack_require__(5)(false, 'environment.sendSubscription() is deprecated. Update to the latest ' + 'version of react-relay, and use environment.execute().');
	    return this.execute({
	      operation: operation,
	      updater: updater,
	      cacheConfig: { force: true }
	    }).subscribeLegacy({ onNext: onNext, onError: onError, onCompleted: onCompleted });
	  };

	  RelayModernEnvironment.prototype._recordDebuggerEvent = function _recordDebuggerEvent(_ref8) {
	    var eventName = _ref8.eventName,
	        mutationUid = _ref8.mutationUid,
	        operation = _ref8.operation,
	        payload = _ref8.payload,
	        fn = _ref8.fn;

	    if (this._debugger) {
	      this._debugger.recordMutationEvent({
	        eventName: eventName,
	        payload: payload,
	        fn: fn,
	        mutation: operation,
	        seriesId: mutationUid
	      });
	    } else {
	      fn();
	    }
	  };

	  RelayModernEnvironment.prototype.checkSelectorAndUpdateStore = function checkSelectorAndUpdateStore(selector, handlers) {
	    var target = new (__webpack_require__(12))();
	    var result = __webpack_require__(32).check(this._store.getSource(), target, selector, handlers);
	    if (target.size() > 0) {
	      this._publishQueue.commitSource(target);
	      this._publishQueue.run();
	    }
	    return result;
	  };

	  return RelayModernEnvironment;
	}();

	var mutationUidCounter = 0;
	var mutationUidPrefix = Math.random().toString();
	function nextMutationUid() {
	  return mutationUidPrefix + mutationUidCounter++;
	}

	// Add a sigil for detection by `isRelayModernEnvironment()` to avoid a
	// realm-specific instanceof check, and to aid in module tree-shaking to
	// avoid requiring all of RelayRuntime just to detect its environment.
	RelayModernEnvironment.prototype['@@RelayModernEnvironment'] = true;

	module.exports = RelayModernEnvironment;
	/* WEBPACK VAR INJECTION */}.call(exports, (function() { return this; }())))

/***/ }),
/* 45 */
/***/ (function(module, exports, __webpack_require__) {

	/**
	 * Copyright (c) 2013-present, Facebook, Inc.
	 *
	 * This source code is licensed under the MIT license found in the
	 * LICENSE file in the root directory of this source tree.
	 *
	 * @providesModule RelayModernFragmentSpecResolver
	 * 
	 * @format
	 */

	'use strict';

	var _extends3 = _interopRequireDefault(__webpack_require__(13));

	var _classCallCheck3 = _interopRequireDefault(__webpack_require__(6));

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

	var _require = __webpack_require__(33),
	    areEqualSelectors = _require.areEqualSelectors,
	    getSelectorsFromObject = _require.getSelectorsFromObject;

	/**
	 * A utility for resolving and subscribing to the results of a fragment spec
	 * (key -> fragment mapping) given some "props" that determine the root ID
	 * and variables to use when reading each fragment. When props are changed via
	 * `setProps()`, the resolver will update its results and subscriptions
	 * accordingly. Internally, the resolver:
	 * - Converts the fragment map & props map into a map of `Selector`s.
	 * - Removes any resolvers for any props that became null.
	 * - Creates resolvers for any props that became non-null.
	 * - Updates resolvers with the latest props.
	 *
	 * This utility is implemented as an imperative, stateful API for performance
	 * reasons: reusing previous resolvers, callback functions, and subscriptions
	 * all helps to reduce object allocation and thereby decrease GC time.
	 *
	 * The `resolve()` function is also lazy and memoized: changes in the store mark
	 * the resolver as stale and notify the caller, and the actual results are
	 * recomputed the first time `resolve()` is called.
	 */
	var RelayModernFragmentSpecResolver = function () {
	  function RelayModernFragmentSpecResolver(context, fragments, props, callback) {
	    var _this = this;

	    (0, _classCallCheck3['default'])(this, RelayModernFragmentSpecResolver);

	    this._onChange = function () {
	      _this._stale = true;
	      _this._callback();
	    };

	    this._callback = callback;
	    this._context = context;
	    this._data = {};
	    this._fragments = fragments;
	    this._props = props;
	    this._resolvers = {};
	    this._stale = false;

	    this.setProps(props);
	  }

	  RelayModernFragmentSpecResolver.prototype.dispose = function dispose() {
	    for (var _key in this._resolvers) {
	      if (this._resolvers.hasOwnProperty(_key)) {
	        disposeCallback(this._resolvers[_key]);
	      }
	    }
	  };

	  RelayModernFragmentSpecResolver.prototype.resolve = function resolve() {
	    if (this._stale) {
	      // Avoid mapping the object multiple times, which could occur if data for
	      // multiple keys changes in the same event loop.
	      var prevData = this._data;
	      var nextData = void 0;
	      for (var _key2 in this._resolvers) {
	        if (this._resolvers.hasOwnProperty(_key2)) {
	          var resolver = this._resolvers[_key2];
	          var prevItem = prevData[_key2];
	          if (resolver) {
	            var nextItem = resolver.resolve();
	            if (nextData || nextItem !== prevItem) {
	              nextData = nextData || (0, _extends3['default'])({}, prevData);
	              nextData[_key2] = nextItem;
	            }
	          } else {
	            var prop = this._props[_key2];
	            var _nextItem = prop !== undefined ? prop : null;
	            if (nextData || !__webpack_require__(59)(_nextItem, prevItem)) {
	              nextData = nextData || (0, _extends3['default'])({}, prevData);
	              nextData[_key2] = _nextItem;
	            }
	          }
	        }
	      }
	      this._data = nextData || prevData;
	      this._stale = false;
	    }
	    return this._data;
	  };

	  RelayModernFragmentSpecResolver.prototype.setProps = function setProps(props) {
	    var selectors = getSelectorsFromObject(this._context.variables, this._fragments, props);
	    for (var _key3 in selectors) {
	      if (selectors.hasOwnProperty(_key3)) {
	        var selector = selectors[_key3];
	        var resolver = this._resolvers[_key3];
	        if (selector == null) {
	          if (resolver != null) {
	            resolver.dispose();
	          }
	          resolver = null;
	        } else if (Array.isArray(selector)) {
	          if (resolver == null) {
	            resolver = new SelectorListResolver(this._context.environment, selector, this._onChange);
	          } else {
	            __webpack_require__(1)(resolver instanceof SelectorListResolver, 'RelayModernFragmentSpecResolver: Expected prop `%s` to always be an array.', _key3);
	            resolver.setSelectors(selector);
	          }
	        } else {
	          if (resolver == null) {
	            resolver = new SelectorResolver(this._context.environment, selector, this._onChange);
	          } else {
	            __webpack_require__(1)(resolver instanceof SelectorResolver, 'RelayModernFragmentSpecResolver: Expected prop `%s` to always be an object.', _key3);
	            resolver.setSelector(selector);
	          }
	        }
	        this._resolvers[_key3] = resolver;
	      }
	    }
	    this._props = props;
	    this._stale = true;
	  };

	  RelayModernFragmentSpecResolver.prototype.setVariables = function setVariables(variables) {
	    for (var _key4 in this._resolvers) {
	      if (this._resolvers.hasOwnProperty(_key4)) {
	        var resolver = this._resolvers[_key4];
	        if (resolver) {
	          resolver.setVariables(variables);
	        }
	      }
	    }
	    this._stale = true;
	  };

	  return RelayModernFragmentSpecResolver;
	}();

	/**
	 * A resolver for a single Selector.
	 */


	var SelectorResolver = function () {
	  function SelectorResolver(environment, selector, callback) {
	    (0, _classCallCheck3['default'])(this, SelectorResolver);

	    _initialiseProps.call(this);

	    var snapshot = environment.lookup(selector);
	    this._callback = callback;
	    this._data = snapshot.data;
	    this._environment = environment;
	    this._selector = selector;
	    this._subscription = environment.subscribe(snapshot, this._onChange);
	  }

	  SelectorResolver.prototype.dispose = function dispose() {
	    if (this._subscription) {
	      this._subscription.dispose();
	      this._subscription = null;
	    }
	  };

	  SelectorResolver.prototype.resolve = function resolve() {
	    return this._data;
	  };

	  SelectorResolver.prototype.setSelector = function setSelector(selector) {
	    if (this._subscription != null && areEqualSelectors(selector, this._selector)) {
	      return;
	    }
	    this.dispose();
	    var snapshot = this._environment.lookup(selector);
	    this._data = snapshot.data;
	    this._selector = selector;
	    this._subscription = this._environment.subscribe(snapshot, this._onChange);
	  };

	  SelectorResolver.prototype.setVariables = function setVariables(variables) {
	    var selector = (0, _extends3['default'])({}, this._selector, {
	      variables: variables
	    });
	    this.setSelector(selector);
	  };

	  return SelectorResolver;
	}();

	/**
	 * A resolver for an array of Selectors.
	 */


	var _initialiseProps = function _initialiseProps() {
	  var _this3 = this;

	  this._onChange = function (snapshot) {
	    _this3._data = snapshot.data;
	    _this3._callback();
	  };
	};

	var SelectorListResolver = function () {
	  function SelectorListResolver(environment, selectors, callback) {
	    var _this2 = this;

	    (0, _classCallCheck3['default'])(this, SelectorListResolver);

	    this._onChange = function (data) {
	      _this2._stale = true;
	      _this2._callback();
	    };

	    this._callback = callback;
	    this._data = [];
	    this._environment = environment;
	    this._resolvers = [];
	    this._stale = true;

	    this.setSelectors(selectors);
	  }

	  SelectorListResolver.prototype.dispose = function dispose() {
	    this._resolvers.forEach(disposeCallback);
	  };

	  SelectorListResolver.prototype.resolve = function resolve() {
	    if (this._stale) {
	      // Avoid mapping the array multiple times, which could occur if data for
	      // multiple indices changes in the same event loop.
	      var prevData = this._data;
	      var nextData = void 0;
	      for (var ii = 0; ii < this._resolvers.length; ii++) {
	        var prevItem = prevData[ii];
	        var nextItem = this._resolvers[ii].resolve();
	        if (nextData || nextItem !== prevItem) {
	          nextData = nextData || prevData.slice(0, ii);
	          nextData.push(nextItem);
	        }
	      }
	      if (!nextData && this._resolvers.length !== prevData.length) {
	        nextData = prevData.slice(0, this._resolvers.length);
	      }
	      this._data = nextData || prevData;
	      this._stale = false;
	    }
	    return this._data;
	  };

	  SelectorListResolver.prototype.setSelectors = function setSelectors(selectors) {
	    while (this._resolvers.length > selectors.length) {
	      var resolver = this._resolvers.pop();
	      resolver.dispose();
	    }
	    for (var ii = 0; ii < selectors.length; ii++) {
	      if (ii < this._resolvers.length) {
	        this._resolvers[ii].setSelector(selectors[ii]);
	      } else {
	        this._resolvers[ii] = new SelectorResolver(this._environment, selectors[ii], this._onChange);
	      }
	    }
	    this._stale = true;
	  };

	  SelectorListResolver.prototype.setVariables = function setVariables(variables) {
	    this._resolvers.forEach(function (resolver) {
	      return resolver.setVariables(variables);
	    });
	    this._stale = true;
	  };

	  return SelectorListResolver;
	}();

	function disposeCallback(disposable) {
	  disposable && disposable.dispose();
	}

	module.exports = RelayModernFragmentSpecResolver;

/***/ }),
/* 46 */
/***/ (function(module, exports, __webpack_require__) {

	/**
	 * Copyright (c) 2013-present, Facebook, Inc.
	 *
	 * This source code is licensed under the MIT license found in the
	 * LICENSE file in the root directory of this source tree.
	 *
	 * @providesModule RelayModernOperationSelector
	 * 
	 * @format
	 */

	'use strict';

	var _require = __webpack_require__(31),
	    getOperationVariables = _require.getOperationVariables;

	var _require2 = __webpack_require__(4),
	    ROOT_ID = _require2.ROOT_ID;

	/**
	 * Creates an instance of the `OperationSelector` type defined in
	 * `RelayStoreTypes` given an operation and some variables. The input variables
	 * are filtered to exclude variables that do not match defined arguments on the
	 * operation, and default values are populated for null values.
	 */
	function createOperationSelector(operation, variables) {
	  var operationVariables = getOperationVariables(operation, variables);
	  var dataID = ROOT_ID;
	  return {
	    fragment: {
	      dataID: dataID,
	      node: operation.fragment,
	      variables: operationVariables
	    },
	    node: operation,
	    root: {
	      dataID: dataID,
	      node: operation.query,
	      variables: operationVariables
	    },
	    variables: operationVariables
	  };
	}

	module.exports = {
	  createOperationSelector: createOperationSelector
	};

/***/ }),
/* 47 */
/***/ (function(module, exports, __webpack_require__) {

	/**
	 * Copyright (c) 2013-present, Facebook, Inc.
	 *
	 * This source code is licensed under the MIT license found in the
	 * LICENSE file in the root directory of this source tree.
	 *
	 * @providesModule RelayNetwork
	 * 
	 * @format
	 */

	'use strict';

	var _require = __webpack_require__(38),
	    convertFetch = _require.convertFetch,
	    convertSubscribe = _require.convertSubscribe;

	/**
	 * Creates an implementation of the `Network` interface defined in
	 * `RelayNetworkTypes` given `fetch` and `subscribe` functions.
	 */
	function create(fetchFn, subscribeFn) {
	  // Convert to functions that returns RelayObservable.
	  var observeFetch = convertFetch(fetchFn);
	  var observeSubscribe = subscribeFn ? convertSubscribe(subscribeFn) : undefined;

	  function execute(operation, variables, cacheConfig, uploadables) {
	    if (operation.query.operation === 'subscription') {
	      __webpack_require__(1)(observeSubscribe, 'RelayNetwork: This network layer does not support Subscriptions. ' + 'To use Subscriptions, provide a custom network layer.');

	      __webpack_require__(1)(!uploadables, 'RelayNetwork: Cannot provide uploadables while subscribing.');
	      return observeSubscribe(operation, variables, cacheConfig);
	    }

	    var pollInterval = cacheConfig.poll;
	    if (pollInterval != null) {
	      __webpack_require__(1)(!uploadables, 'RelayNetwork: Cannot provide uploadables while polling.');
	      return observeFetch(operation, variables, { force: true }).poll(pollInterval);
	    }

	    return observeFetch(operation, variables, cacheConfig, uploadables);
	  }

	  return { execute: execute };
	}

	module.exports = { create: create };

/***/ }),
/* 48 */
/***/ (function(module, exports, __webpack_require__) {

	/**
	 * Copyright (c) 2013-present, Facebook, Inc.
	 *
	 * This source code is licensed under the MIT license found in the
	 * LICENSE file in the root directory of this source tree.
	 *
	 * 
	 * @providesModule RelayPublishQueue
	 * @format
	 */

	'use strict';

	var _classCallCheck3 = _interopRequireDefault(__webpack_require__(6));

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

	/**
	 * Coordinates the concurrent modification of a `Store` due to optimistic and
	 * non-revertable client updates and server payloads:
	 * - Applies optimistic updates.
	 * - Reverts optimistic updates, rebasing any subsequent updates.
	 * - Commits client updates (typically for client schema extensions).
	 * - Commits server updates:
	 *   - Normalizes query/mutation/subscription responses.
	 *   - Executes handlers for "handle" fields.
	 *   - Reverts and reapplies pending optimistic updates.
	 */
	var RelayPublishQueue = function () {
	  // Optimistic updaters to add with the next `run()`.

	  // Payloads to apply or Sources to publish to the store with the next `run()`.


	  // A "negative" of all applied updaters. It can be published to the store to
	  // undo them in order to re-apply some of them for a rebase.
	  function RelayPublishQueue(store, handlerProvider) {
	    (0, _classCallCheck3['default'])(this, RelayPublishQueue);

	    this._backup = new (__webpack_require__(12))();
	    this._handlerProvider = handlerProvider || null;
	    this._pendingBackupRebase = false;
	    this._pendingUpdaters = new Set();
	    this._pendingData = new Set();
	    this._pendingOptimisticUpdates = new Set();
	    this._store = store;
	    this._appliedOptimisticUpdates = new Set();
	  }

	  /**
	   * Schedule applying an optimistic updates on the next `run()`.
	   */

	  // Optimistic updaters that are already added and might be rerun in order to
	  // rebase them.

	  // Updaters to apply with the next `run()`. These mutate the store and should
	  // typically only mutate client schema extensions.

	  // True if the next `run()` should apply the backup and rerun all optimistic
	  // updates performing a rebase.


	  RelayPublishQueue.prototype.applyUpdate = function applyUpdate(updater) {
	    __webpack_require__(1)(!this._appliedOptimisticUpdates.has(updater) && !this._pendingOptimisticUpdates.has(updater), 'RelayPublishQueue: Cannot apply the same update function more than ' + 'once concurrently.');
	    this._pendingOptimisticUpdates.add(updater);
	  };

	  /**
	   * Schedule reverting an optimistic updates on the next `run()`.
	   */


	  RelayPublishQueue.prototype.revertUpdate = function revertUpdate(updater) {
	    if (this._pendingOptimisticUpdates.has(updater)) {
	      // Reverted before it was applied
	      this._pendingOptimisticUpdates['delete'](updater);
	    } else if (this._appliedOptimisticUpdates.has(updater)) {
	      this._pendingBackupRebase = true;
	      this._appliedOptimisticUpdates['delete'](updater);
	    }
	  };

	  /**
	   * Schedule a revert of all optimistic updates on the next `run()`.
	   */


	  RelayPublishQueue.prototype.revertAll = function revertAll() {
	    this._pendingBackupRebase = true;
	    this._pendingOptimisticUpdates.clear();
	    this._appliedOptimisticUpdates.clear();
	  };

	  /**
	   * Schedule applying a payload to the store on the next `run()`.
	   */


	  RelayPublishQueue.prototype.commitPayload = function commitPayload(operation, _ref, updater) {
	    var fieldPayloads = _ref.fieldPayloads,
	        source = _ref.source;

	    this._pendingBackupRebase = true;
	    this._pendingData.add({
	      kind: 'payload',
	      payload: { fieldPayloads: fieldPayloads, operation: operation, source: source, updater: updater }
	    });
	  };

	  /**
	   * Schedule an updater to mutate the store on the next `run()` typically to
	   * update client schema fields.
	   */


	  RelayPublishQueue.prototype.commitUpdate = function commitUpdate(updater) {
	    this._pendingBackupRebase = true;
	    this._pendingUpdaters.add(updater);
	  };

	  /**
	   * Schedule a publish to the store from the provided source on the next
	   * `run()`. As an example, to update the store with substituted fields that
	   * are missing in the store.
	   */


	  RelayPublishQueue.prototype.commitSource = function commitSource(source) {
	    this._pendingBackupRebase = true;
	    this._pendingData.add({ kind: 'source', source: source });
	  };

	  /**
	   * Execute all queued up operations from the other public methods.
	   */


	  RelayPublishQueue.prototype.run = function run() {
	    if (this._pendingBackupRebase && this._backup.size()) {
	      this._store.publish(this._backup);
	      this._backup = new (__webpack_require__(12))();
	    }
	    this._commitData();
	    this._commitUpdaters();
	    this._applyUpdates();
	    this._pendingBackupRebase = false;
	    this._store.notify();
	  };

	  RelayPublishQueue.prototype._getSourceFromPayload = function _getSourceFromPayload(payload) {
	    var _this = this;

	    var fieldPayloads = payload.fieldPayloads,
	        operation = payload.operation,
	        source = payload.source,
	        updater = payload.updater;

	    var mutator = new (__webpack_require__(18))(this._store.getSource(), source);
	    var store = new (__webpack_require__(23))(mutator);
	    var selectorStore = new (__webpack_require__(24))(store, operation.fragment);
	    if (fieldPayloads && fieldPayloads.length) {
	      fieldPayloads.forEach(function (fieldPayload) {
	        var handler = _this._handlerProvider && _this._handlerProvider(fieldPayload.handle);
	        __webpack_require__(1)(handler, 'RelayModernEnvironment: Expected a handler to be provided for ' + 'handle `%s`.', fieldPayload.handle);
	        handler.update(store, fieldPayload);
	      });
	    }
	    if (updater) {
	      var selectorData = lookupSelector(source, operation.fragment);
	      updater(selectorStore, selectorData);
	    }
	    return source;
	  };

	  RelayPublishQueue.prototype._commitData = function _commitData() {
	    var _this2 = this;

	    if (!this._pendingData.size) {
	      return;
	    }
	    this._pendingData.forEach(function (data) {
	      var source = void 0;
	      if (data.kind === 'payload') {
	        source = _this2._getSourceFromPayload(data.payload);
	      } else {
	        source = data.source;
	      }
	      _this2._store.publish(source);
	    });
	    this._pendingData.clear();
	  };

	  RelayPublishQueue.prototype._commitUpdaters = function _commitUpdaters() {
	    var _this3 = this;

	    if (!this._pendingUpdaters.size) {
	      return;
	    }
	    var sink = new (__webpack_require__(12))();
	    this._pendingUpdaters.forEach(function (updater) {
	      var mutator = new (__webpack_require__(18))(_this3._store.getSource(), sink);
	      var store = new (__webpack_require__(23))(mutator);
	      updater(store);
	    });
	    this._store.publish(sink);
	    this._pendingUpdaters.clear();
	  };

	  RelayPublishQueue.prototype._applyUpdates = function _applyUpdates() {
	    var _this4 = this;

	    if (this._pendingOptimisticUpdates.size || this._pendingBackupRebase && this._appliedOptimisticUpdates.size) {
	      var sink = new (__webpack_require__(12))();
	      var mutator = new (__webpack_require__(18))(this._store.getSource(), sink, this._backup);
	      var store = new (__webpack_require__(23))(mutator, this._handlerProvider);

	      // rerun all updaters in case we are running a rebase
	      if (this._pendingBackupRebase && this._appliedOptimisticUpdates.size) {
	        this._appliedOptimisticUpdates.forEach(function (optimisticUpdate) {
	          if (optimisticUpdate.operation) {
	            var selectorStoreUpdater = optimisticUpdate.selectorStoreUpdater,
	                _operation = optimisticUpdate.operation,
	                response = optimisticUpdate.response;

	            var selectorStore = store.commitPayload(_operation, response);
	            // TODO: Fix commitPayload so we don't have to run normalize twice
	            var selectorData = void 0,
	                _source = void 0;
	            if (response) {
	              var _normalizeRelayPayloa = __webpack_require__(15)(_operation.root, response);

	              _source = _normalizeRelayPayloa.source;

	              selectorData = lookupSelector(_source, _operation.fragment);
	            }
	            selectorStoreUpdater && selectorStoreUpdater(selectorStore, selectorData);
	          } else {
	            var storeUpdater = optimisticUpdate.storeUpdater;

	            storeUpdater(store);
	          }
	        });
	      }

	      // apply any new updaters
	      if (this._pendingOptimisticUpdates.size) {
	        this._pendingOptimisticUpdates.forEach(function (optimisticUpdate) {
	          if (optimisticUpdate.operation) {
	            var selectorStoreUpdater = optimisticUpdate.selectorStoreUpdater,
	                _operation2 = optimisticUpdate.operation,
	                response = optimisticUpdate.response;

	            var selectorStore = store.commitPayload(_operation2, response);
	            // TODO: Fix commitPayload so we don't have to run normalize twice
	            var selectorData = void 0,
	                _source2 = void 0;
	            if (response) {
	              var _normalizeRelayPayloa2 = __webpack_require__(15)(_operation2.root, response);

	              _source2 = _normalizeRelayPayloa2.source;

	              selectorData = lookupSelector(_source2, _operation2.fragment);
	            }
	            selectorStoreUpdater && selectorStoreUpdater(selectorStore, selectorData);
	          } else {
	            var storeUpdater = optimisticUpdate.storeUpdater;

	            storeUpdater(store);
	          }
	          _this4._appliedOptimisticUpdates.add(optimisticUpdate);
	        });
	        this._pendingOptimisticUpdates.clear();
	      }

	      this._store.publish(sink);
	    }
	  };

	  return RelayPublishQueue;
	}();

	function lookupSelector(source, selector) {
	  var selectorData = __webpack_require__(21).read(source, selector).data;
	  if (true) {
	    var deepFreeze = __webpack_require__(19);
	    if (selectorData) {
	      deepFreeze(selectorData);
	    }
	  }
	  return selectorData;
	}

	module.exports = RelayPublishQueue;

/***/ }),
/* 49 */
/***/ (function(module, exports, __webpack_require__) {

	/**
	 * Copyright (c) 2013-present, Facebook, Inc.
	 *
	 * This source code is licensed under the MIT license found in the
	 * LICENSE file in the root directory of this source tree.
	 *
	 * @providesModule RelayQueryResponseCache
	 * 
	 * @format
	 */

	'use strict';

	var _classCallCheck3 = _interopRequireDefault(__webpack_require__(6));

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

	/**
	 * A cache for storing query responses, featuring:
	 * - `get` with TTL
	 * - cache size limiting, with least-recently *updated* entries purged first
	 */
	var RelayQueryResponseCache = function () {
	  function RelayQueryResponseCache(_ref) {
	    var size = _ref.size,
	        ttl = _ref.ttl;
	    (0, _classCallCheck3['default'])(this, RelayQueryResponseCache);

	    __webpack_require__(1)(size > 0, 'RelayQueryResponseCache: Expected the max cache size to be > 0, got ' + '`%s`.', size);
	    __webpack_require__(1)(ttl > 0, 'RelayQueryResponseCache: Expected the max ttl to be > 0, got `%s`.', ttl);
	    this._responses = new Map();
	    this._size = size;
	    this._ttl = ttl;
	  }

	  RelayQueryResponseCache.prototype.clear = function clear() {
	    this._responses.clear();
	  };

	  RelayQueryResponseCache.prototype.get = function get(queryID, variables) {
	    var _this = this;

	    var cacheKey = getCacheKey(queryID, variables);
	    this._responses.forEach(function (response, key) {
	      if (!isCurrent(response.fetchTime, _this._ttl)) {
	        _this._responses['delete'](key);
	      }
	    });
	    var response = this._responses.get(cacheKey);
	    return response != null ? response.payload : null;
	  };

	  RelayQueryResponseCache.prototype.set = function set(queryID, variables, payload) {
	    var fetchTime = Date.now();
	    var cacheKey = getCacheKey(queryID, variables);
	    this._responses['delete'](cacheKey); // deletion resets key ordering
	    this._responses.set(cacheKey, {
	      fetchTime: fetchTime,
	      payload: payload
	    });
	    // Purge least-recently updated key when max size reached
	    if (this._responses.size > this._size) {
	      var firstKey = this._responses.keys().next();
	      if (!firstKey.done) {
	        this._responses['delete'](firstKey.value);
	      }
	    }
	  };

	  return RelayQueryResponseCache;
	}();

	function getCacheKey(queryID, variables) {
	  return __webpack_require__(27)({ queryID: queryID, variables: variables });
	}

	/**
	 * Determine whether a response fetched at `fetchTime` is still valid given
	 * some `ttl`.
	 */
	function isCurrent(fetchTime, ttl) {
	  return fetchTime + ttl >= Date.now();
	}

	module.exports = RelayQueryResponseCache;

/***/ }),
/* 50 */
/***/ (function(module, exports, __webpack_require__) {

	/**
	 * Copyright (c) 2013-present, Facebook, Inc.
	 *
	 * This source code is licensed under the MIT license found in the
	 * LICENSE file in the root directory of this source tree.
	 *
	 * @providesModule RelayRecordProxy
	 * 
	 * @format
	 */

	'use strict';

	var _classCallCheck3 = _interopRequireDefault(__webpack_require__(6));

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

	/**
	 * @internal
	 *
	 * A helper class for manipulating a given record from a record source via an
	 * imperative/OO-style API.
	 */
	var RelayRecordProxy = function () {
	  function RelayRecordProxy(source, mutator, dataID) {
	    (0, _classCallCheck3['default'])(this, RelayRecordProxy);

	    this._dataID = dataID;
	    this._mutator = mutator;
	    this._source = source;
	  }

	  RelayRecordProxy.prototype.copyFieldsFrom = function copyFieldsFrom(source) {
	    this._mutator.copyFields(source.getDataID(), this._dataID);
	  };

	  RelayRecordProxy.prototype.getDataID = function getDataID() {
	    return this._dataID;
	  };

	  RelayRecordProxy.prototype.getType = function getType() {
	    var type = this._mutator.getType(this._dataID);
	    __webpack_require__(1)(type != null, 'RelayRecordProxy: Cannot get the type of deleted record `%s`.', this._dataID);
	    return type;
	  };

	  RelayRecordProxy.prototype.getValue = function getValue(name, args) {
	    var storageKey = args ? __webpack_require__(7)(name, args) : name;
	    return this._mutator.getValue(this._dataID, storageKey);
	  };

	  RelayRecordProxy.prototype.setValue = function setValue(value, name, args) {
	    __webpack_require__(1)(isValidLeafValue(value), 'RelayRecordProxy#setValue(): Expected a scalar or array of scalars, ' + 'got `%s`.', JSON.stringify(value));
	    var storageKey = args ? __webpack_require__(7)(name, args) : name;
	    this._mutator.setValue(this._dataID, storageKey, value);
	    return this;
	  };

	  RelayRecordProxy.prototype.getLinkedRecord = function getLinkedRecord(name, args) {
	    var storageKey = args ? __webpack_require__(7)(name, args) : name;
	    var linkedID = this._mutator.getLinkedRecordID(this._dataID, storageKey);
	    return linkedID != null ? this._source.get(linkedID) : linkedID;
	  };

	  RelayRecordProxy.prototype.setLinkedRecord = function setLinkedRecord(record, name, args) {
	    __webpack_require__(1)(record instanceof RelayRecordProxy, 'RelayRecordProxy#setLinkedRecord(): Expected a record, got `%s`.', record);
	    var storageKey = args ? __webpack_require__(7)(name, args) : name;
	    var linkedID = record.getDataID();
	    this._mutator.setLinkedRecordID(this._dataID, storageKey, linkedID);
	    return this;
	  };

	  RelayRecordProxy.prototype.getOrCreateLinkedRecord = function getOrCreateLinkedRecord(name, typeName, args) {
	    var linkedRecord = this.getLinkedRecord(name, args);
	    if (!linkedRecord) {
	      var storageKey = args ? __webpack_require__(7)(name, args) : name;
	      var clientID = __webpack_require__(11)(this.getDataID(), storageKey);
	      linkedRecord = this._source.create(clientID, typeName);
	      this.setLinkedRecord(linkedRecord, name, args);
	    }
	    return linkedRecord;
	  };

	  RelayRecordProxy.prototype.getLinkedRecords = function getLinkedRecords(name, args) {
	    var _this = this;

	    var storageKey = args ? __webpack_require__(7)(name, args) : name;
	    var linkedIDs = this._mutator.getLinkedRecordIDs(this._dataID, storageKey);
	    if (linkedIDs == null) {
	      return linkedIDs;
	    }
	    return linkedIDs.map(function (linkedID) {
	      return linkedID != null ? _this._source.get(linkedID) : linkedID;
	    });
	  };

	  RelayRecordProxy.prototype.setLinkedRecords = function setLinkedRecords(records, name, args) {
	    __webpack_require__(1)(Array.isArray(records), 'RelayRecordProxy#setLinkedRecords(): Expected records to be an array, got `%s`.', records);
	    var storageKey = args ? __webpack_require__(7)(name, args) : name;
	    var linkedIDs = records.map(function (record) {
	      return record && record.getDataID();
	    });
	    this._mutator.setLinkedRecordIDs(this._dataID, storageKey, linkedIDs);
	    return this;
	  };

	  return RelayRecordProxy;
	}();

	function isValidLeafValue(value) {
	  return value == null || typeof value !== 'object' || Array.isArray(value) && value.every(isValidLeafValue);
	}

	module.exports = RelayRecordProxy;

/***/ }),
/* 51 */
/***/ (function(module, exports, __webpack_require__) {

	/**
	 * Copyright (c) 2013-present, Facebook, Inc.
	 *
	 * This source code is licensed under the MIT license found in the
	 * LICENSE file in the root directory of this source tree.
	 *
	 * @providesModule RelayReferenceMarker
	 * 
	 * @format
	 */

	'use strict';

	var _classCallCheck3 = _interopRequireDefault(__webpack_require__(6));

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

	var CONDITION = __webpack_require__(3).CONDITION,
	    FRAGMENT_SPREAD = __webpack_require__(3).FRAGMENT_SPREAD,
	    INLINE_FRAGMENT = __webpack_require__(3).INLINE_FRAGMENT,
	    LINKED_FIELD = __webpack_require__(3).LINKED_FIELD,
	    LINKED_HANDLE = __webpack_require__(3).LINKED_HANDLE,
	    SCALAR_FIELD = __webpack_require__(3).SCALAR_FIELD,
	    SCALAR_HANDLE = __webpack_require__(3).SCALAR_HANDLE;

	var getStorageKey = __webpack_require__(4).getStorageKey;

	function mark(recordSource, selector, references) {
	  var dataID = selector.dataID,
	      node = selector.node,
	      variables = selector.variables;

	  var marker = new RelayReferenceMarker(recordSource, variables, references);
	  marker.mark(node, dataID);
	}

	/**
	 * @private
	 */

	var RelayReferenceMarker = function () {
	  function RelayReferenceMarker(recordSource, variables, references) {
	    (0, _classCallCheck3['default'])(this, RelayReferenceMarker);

	    this._references = references;
	    this._recordSource = recordSource;
	    this._variables = variables;
	  }

	  RelayReferenceMarker.prototype.mark = function mark(node, dataID) {
	    this._traverse(node, dataID);
	  };

	  RelayReferenceMarker.prototype._traverse = function _traverse(node, dataID) {
	    this._references.add(dataID);
	    var record = this._recordSource.get(dataID);
	    if (record == null) {
	      return;
	    }
	    this._traverseSelections(node.selections, record);
	  };

	  RelayReferenceMarker.prototype._getVariableValue = function _getVariableValue(name) {
	    __webpack_require__(1)(this._variables.hasOwnProperty(name), 'RelayReferenceMarker(): Undefined variable `%s`.', name);
	    return this._variables[name];
	  };

	  RelayReferenceMarker.prototype._traverseSelections = function _traverseSelections(selections, record) {
	    var _this = this;

	    selections.forEach(function (selection) {
	      if (selection.kind === LINKED_FIELD) {
	        if (selection.plural) {
	          _this._traversePluralLink(selection, record);
	        } else {
	          _this._traverseLink(selection, record);
	        }
	      } else if (selection.kind === CONDITION) {
	        var conditionValue = _this._getVariableValue(selection.condition);
	        if (conditionValue === selection.passingValue) {
	          _this._traverseSelections(selection.selections, record);
	        }
	      } else if (selection.kind === INLINE_FRAGMENT) {
	        var typeName = __webpack_require__(2).getType(record);
	        if (typeName != null && typeName === selection.type) {
	          _this._traverseSelections(selection.selections, record);
	        }
	      } else if (selection.kind === FRAGMENT_SPREAD) {
	        __webpack_require__(1)(false, 'RelayReferenceMarker(): Unexpected fragment spread `...%s`, ' + 'expected all fragments to be inlined.', selection.name);
	      } else if (selection.kind === LINKED_HANDLE) {
	        // The selections for a "handle" field are the same as those of the
	        // original linked field where the handle was applied. Reference marking
	        // therefore requires traversing the original field selections against
	        // the synthesized client field.
	        //
	        // TODO: Instead of finding the source field in `selections`, change
	        // the concrete structure to allow shared subtrees, and have the linked
	        // handle directly refer to the same selections as the LinkedField that
	        // it was split from.
	        var handleField = __webpack_require__(36)(selection, selections, _this._variables);
	        if (handleField.plural) {
	          _this._traversePluralLink(handleField, record);
	        } else {
	          _this._traverseLink(handleField, record);
	        }
	      } else {
	        __webpack_require__(1)(selection.kind === SCALAR_FIELD || selection.kind === SCALAR_HANDLE, 'RelayReferenceMarker(): Unexpected ast kind `%s`.', selection.kind);
	      }
	    });
	  };

	  RelayReferenceMarker.prototype._traverseLink = function _traverseLink(field, record) {
	    var storageKey = getStorageKey(field, this._variables);
	    var linkedID = __webpack_require__(2).getLinkedRecordID(record, storageKey);

	    if (linkedID == null) {
	      return;
	    }
	    this._traverse(field, linkedID);
	  };

	  RelayReferenceMarker.prototype._traversePluralLink = function _traversePluralLink(field, record) {
	    var _this2 = this;

	    var storageKey = getStorageKey(field, this._variables);
	    var linkedIDs = __webpack_require__(2).getLinkedRecordIDs(record, storageKey);

	    if (linkedIDs == null) {
	      return;
	    }
	    linkedIDs.forEach(function (linkedID) {
	      if (linkedID != null) {
	        _this2._traverse(field, linkedID);
	      }
	    });
	  };

	  return RelayReferenceMarker;
	}();

	module.exports = { mark: mark };

/***/ }),
/* 52 */
/***/ (function(module, exports, __webpack_require__) {

	/**
	 * Copyright (c) 2013-present, Facebook, Inc.
	 *
	 * This source code is licensed under the MIT license found in the
	 * LICENSE file in the root directory of this source tree.
	 *
	 * @providesModule RelayResponseNormalizer
	 * 
	 * @format
	 */

	'use strict';

	var _classCallCheck3 = _interopRequireDefault(__webpack_require__(6));

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

	var _require = __webpack_require__(4),
	    getHandleFilterValues = _require.getHandleFilterValues,
	    getArgumentValues = _require.getArgumentValues,
	    getStorageKey = _require.getStorageKey,
	    TYPENAME_KEY = _require.TYPENAME_KEY;

	var CONDITION = __webpack_require__(3).CONDITION,
	    INLINE_FRAGMENT = __webpack_require__(3).INLINE_FRAGMENT,
	    LINKED_FIELD = __webpack_require__(3).LINKED_FIELD,
	    LINKED_HANDLE = __webpack_require__(3).LINKED_HANDLE,
	    SCALAR_FIELD = __webpack_require__(3).SCALAR_FIELD,
	    SCALAR_HANDLE = __webpack_require__(3).SCALAR_HANDLE;

	/**
	 * Normalizes the results of a query and standard GraphQL response, writing the
	 * normalized records/fields into the given MutableRecordSource.
	 *
	 * If handleStrippedNulls is true, will replace fields on the Selector that
	 * are not present in the response with null. Otherwise will leave fields unset.
	 */
	function normalize(recordSource, selector, response) {
	  var options = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : { handleStrippedNulls: false };
	  var dataID = selector.dataID,
	      node = selector.node,
	      variables = selector.variables;

	  var normalizer = new RelayResponseNormalizer(recordSource, variables, options);
	  return normalizer.normalizeResponse(node, dataID, response);
	}

	/**
	 * @private
	 *
	 * Helper for handling payloads.
	 */

	var RelayResponseNormalizer = function () {
	  function RelayResponseNormalizer(recordSource, variables, options) {
	    (0, _classCallCheck3['default'])(this, RelayResponseNormalizer);

	    this._handleFieldPayloads = [];
	    this._recordSource = recordSource;
	    this._variables = variables;
	    this._handleStrippedNulls = options.handleStrippedNulls;
	  }

	  RelayResponseNormalizer.prototype.normalizeResponse = function normalizeResponse(node, dataID, data) {
	    var record = this._recordSource.get(dataID);
	    __webpack_require__(1)(record, 'RelayResponseNormalizer(): Expected root record `%s` to exist.', dataID);
	    this._traverseSelections(node.selections, record, data);
	    return this._handleFieldPayloads;
	  };

	  RelayResponseNormalizer.prototype._getVariableValue = function _getVariableValue(name) {
	    __webpack_require__(1)(this._variables.hasOwnProperty(name), 'RelayResponseNormalizer(): Undefined variable `%s`.', name);
	    return this._variables[name];
	  };

	  RelayResponseNormalizer.prototype._getRecordType = function _getRecordType(data) {
	    var typeName = data[TYPENAME_KEY];
	    __webpack_require__(1)(typeName != null, 'RelayResponseNormalizer(): Expected a typename for record `%s`.', JSON.stringify(data, null, 2));
	    return typeName;
	  };

	  RelayResponseNormalizer.prototype._traverseSelections = function _traverseSelections(selections, record, data) {
	    var _this = this;

	    selections.forEach(function (selection) {
	      if (selection.kind === SCALAR_FIELD || selection.kind === LINKED_FIELD) {
	        _this._normalizeField(selection, record, data);
	      } else if (selection.kind === CONDITION) {
	        var conditionValue = _this._getVariableValue(selection.condition);
	        if (conditionValue === selection.passingValue) {
	          _this._traverseSelections(selection.selections, record, data);
	        }
	      } else if (selection.kind === INLINE_FRAGMENT) {
	        var typeName = __webpack_require__(2).getType(record);
	        if (typeName === selection.type) {
	          _this._traverseSelections(selection.selections, record, data);
	        }
	      } else if (selection.kind === LINKED_HANDLE || selection.kind === SCALAR_HANDLE) {
	        var args = selection.args ? getArgumentValues(selection.args, _this._variables) : {};

	        var fieldKey = __webpack_require__(7)(selection.name, args);
	        var handleKey = __webpack_require__(20)(selection.handle, selection.key, selection.name);
	        if (selection.filters) {
	          var filterValues = getHandleFilterValues(selection.args || [], selection.filters, _this._variables);
	          handleKey = __webpack_require__(7)(handleKey, filterValues);
	        }
	        _this._handleFieldPayloads.push({
	          args: args,
	          dataID: __webpack_require__(2).getDataID(record),
	          fieldKey: fieldKey,
	          handle: selection.handle,
	          handleKey: handleKey
	        });
	      } else {
	        __webpack_require__(1)(false, 'RelayResponseNormalizer(): Unexpected ast kind `%s`.', selection.kind);
	      }
	    });
	  };

	  RelayResponseNormalizer.prototype._normalizeField = function _normalizeField(selection, record, data) {
	    __webpack_require__(1)(typeof data === 'object' && data, 'writeField(): Expected data for field `%s` to be an object.', selection.name);
	    var responseKey = selection.alias || selection.name;
	    var storageKey = getStorageKey(selection, this._variables);
	    var fieldValue = data[responseKey];
	    if (fieldValue == null) {
	      if (fieldValue === undefined && !this._handleStrippedNulls) {
	        // If we're not stripping nulls, undefined fields are unset
	        return;
	      }
	      if (true) {
	        __webpack_require__(5)(Object.prototype.hasOwnProperty.call(data, responseKey), 'RelayResponseNormalizer(): Payload did not contain a value ' + 'for field `%s: %s`. Check that you are parsing with the same ' + 'query that was used to fetch the payload.', responseKey, storageKey);
	      }
	      __webpack_require__(2).setValue(record, storageKey, null);
	      return;
	    }

	    if (selection.kind === SCALAR_FIELD) {
	      __webpack_require__(2).setValue(record, storageKey, fieldValue);
	    } else if (selection.plural) {
	      this._normalizePluralLink(selection, record, storageKey, fieldValue);
	    } else {
	      this._normalizeLink(selection, record, storageKey, fieldValue);
	    }
	  };

	  RelayResponseNormalizer.prototype._normalizeLink = function _normalizeLink(field, record, storageKey, fieldValue) {
	    __webpack_require__(1)(typeof fieldValue === 'object' && fieldValue, 'RelayResponseNormalizer: Expected data for field `%s` to be an object.', storageKey);
	    var nextID = fieldValue.id ||
	    // Reuse previously generated client IDs
	    __webpack_require__(2).getLinkedRecordID(record, storageKey) || __webpack_require__(11)(__webpack_require__(2).getDataID(record), storageKey);
	    __webpack_require__(1)(typeof nextID === 'string', 'RelayResponseNormalizer: Expected id on field `%s` to be a string.', storageKey);
	    __webpack_require__(2).setLinkedRecordID(record, storageKey, nextID);
	    var nextRecord = this._recordSource.get(nextID);
	    if (!nextRecord) {
	      var typeName = field.concreteType || this._getRecordType(fieldValue);
	      nextRecord = __webpack_require__(2).create(nextID, typeName);
	      this._recordSource.set(nextID, nextRecord);
	    } else if (true) {
	      this._validateRecordType(nextRecord, field, fieldValue);
	    }
	    this._traverseSelections(field.selections, nextRecord, fieldValue);
	  };

	  RelayResponseNormalizer.prototype._normalizePluralLink = function _normalizePluralLink(field, record, storageKey, fieldValue) {
	    var _this2 = this;

	    __webpack_require__(1)(Array.isArray(fieldValue), 'RelayResponseNormalizer: Expected data for field `%s` to be an array ' + 'of objects.', storageKey);
	    var prevIDs = __webpack_require__(2).getLinkedRecordIDs(record, storageKey);
	    var nextIDs = [];
	    fieldValue.forEach(function (item, nextIndex) {
	      // validate response data
	      if (item == null) {
	        nextIDs.push(item);
	        return;
	      }
	      __webpack_require__(1)(typeof item === 'object', 'RelayResponseNormalizer: Expected elements for field `%s` to be ' + 'objects.', storageKey);

	      var nextID = item.id || prevIDs && prevIDs[nextIndex] || // Reuse previously generated client IDs
	      __webpack_require__(11)(__webpack_require__(2).getDataID(record), storageKey, nextIndex);
	      __webpack_require__(1)(typeof nextID === 'string', 'RelayResponseNormalizer: Expected id of elements of field `%s` to ' + 'be strings.', storageKey);

	      nextIDs.push(nextID);
	      var nextRecord = _this2._recordSource.get(nextID);
	      if (!nextRecord) {
	        var typeName = field.concreteType || _this2._getRecordType(item);
	        nextRecord = __webpack_require__(2).create(nextID, typeName);
	        _this2._recordSource.set(nextID, nextRecord);
	      } else if (true) {
	        _this2._validateRecordType(nextRecord, field, item);
	      }
	      _this2._traverseSelections(field.selections, nextRecord, item);
	    });
	    __webpack_require__(2).setLinkedRecordIDs(record, storageKey, nextIDs);
	  };

	  /**
	   * Warns if the type of the record does not match the type of the field/payload.
	   */


	  RelayResponseNormalizer.prototype._validateRecordType = function _validateRecordType(record, field, payload) {
	    var typeName = field.concreteType || this._getRecordType(payload);
	    __webpack_require__(5)(__webpack_require__(2).getType(record) === typeName, 'RelayResponseNormalizer: Invalid record `%s`. Expected %s to be ' + 'be consistent, but the record was assigned conflicting types `%s` ' + 'and `%s`. The GraphQL server likely violated the globally unique ' + 'id requirement by returning the same id for different objects.', __webpack_require__(2).getDataID(record), TYPENAME_KEY, __webpack_require__(2).getType(record), typeName);
	  };

	  return RelayResponseNormalizer;
	}();

	// eslint-disable-next-line no-func-assign


	normalize = __webpack_require__(34).instrument('RelayResponseNormalizer.normalize', normalize);

	module.exports = { normalize: normalize };

/***/ }),
/* 53 */
/***/ (function(module, exports, __webpack_require__) {

	/**
	 * Copyright (c) 2013-present, Facebook, Inc.
	 *
	 * This source code is licensed under the MIT license found in the
	 * LICENSE file in the root directory of this source tree.
	 *
	 * @providesModule applyRelayModernOptimisticMutation
	 * 
	 * @format
	 */

	'use strict';

	/**
	 * Higher-level helper function to execute a mutation against a specific
	 * environment.
	 */
	function applyRelayModernOptimisticMutation(environment, config) {
	  __webpack_require__(1)(__webpack_require__(25)(environment), 'commitRelayModernMutation: expect `environment` to be an instance of ' + '`RelayModernEnvironment`.');
	  var _environment$unstable = environment.unstable_internal,
	      createOperationSelector = _environment$unstable.createOperationSelector,
	      getOperation = _environment$unstable.getOperation;

	  var mutation = getOperation(config.mutation);
	  var optimisticUpdater = config.optimisticUpdater;
	  var configs = config.configs,
	      optimisticResponse = config.optimisticResponse,
	      variables = config.variables;

	  var operation = createOperationSelector(mutation, variables);
	  if (configs) {
	    var _setRelayModernMutati = __webpack_require__(26)(configs, mutation, optimisticUpdater);

	    optimisticUpdater = _setRelayModernMutati.optimisticUpdater;
	  }

	  return environment.applyUpdate({
	    operation: operation,
	    selectorStoreUpdater: optimisticUpdater,
	    response: optimisticResponse
	  });
	}

	module.exports = applyRelayModernOptimisticMutation;

/***/ }),
/* 54 */
/***/ (function(module, exports) {

	/**
	 * Copyright (c) 2013-present, Facebook, Inc.
	 *
	 * This source code is licensed under the MIT license found in the
	 * LICENSE file in the root directory of this source tree.
	 *
	 * @providesModule commitLocalUpdate
	 * 
	 * @format
	 */

	'use strict';

	function commitLocalUpdate(environment, updater) {
	  environment.commitUpdate(updater);
	}

	module.exports = commitLocalUpdate;

/***/ }),
/* 55 */
/***/ (function(module, exports, __webpack_require__) {

	/**
	 * Copyright (c) 2013-present, Facebook, Inc.
	 *
	 * This source code is licensed under the MIT license found in the
	 * LICENSE file in the root directory of this source tree.
	 *
	 * @providesModule commitRelayModernMutation
	 * 
	 * @format
	 */

	'use strict';

	/**
	 * Higher-level helper function to execute a mutation against a specific
	 * environment.
	 */
	function commitRelayModernMutation(environment, config) {
	  __webpack_require__(1)(__webpack_require__(25)(environment), 'commitRelayModernMutation: expect `environment` to be an instance of ' + '`RelayModernEnvironment`.');
	  var _environment$unstable = environment.unstable_internal,
	      createOperationSelector = _environment$unstable.createOperationSelector,
	      getOperation = _environment$unstable.getOperation;

	  var mutation = getOperation(config.mutation);
	  var optimisticResponse = config.optimisticResponse,
	      optimisticUpdater = config.optimisticUpdater,
	      updater = config.updater;
	  var configs = config.configs,
	      onError = config.onError,
	      variables = config.variables,
	      uploadables = config.uploadables;

	  var operation = createOperationSelector(mutation, variables);
	  // TODO: remove this check after we fix flow.
	  if (typeof optimisticResponse === 'function') {
	    optimisticResponse = optimisticResponse();
	    __webpack_require__(5)(false, 'commitRelayModernMutation: Expected `optimisticResponse` to be an object, ' + 'received a function.');
	  }
	  if (optimisticResponse && mutation.query.selections && mutation.query.selections.length === 1 && mutation.query.selections[0].kind === 'LinkedField') {
	    var mutationRoot = mutation.query.selections[0].name;
	    __webpack_require__(5)(optimisticResponse[mutationRoot], 'commitRelayModernMutation: Expected `optimisticResponse` to be wrapped ' + 'in mutation name `%s`', mutationRoot);
	  }
	  if (configs) {
	    var _setRelayModernMutati = __webpack_require__(26)(configs, mutation, optimisticUpdater, updater);

	    optimisticUpdater = _setRelayModernMutati.optimisticUpdater;
	    updater = _setRelayModernMutati.updater;
	  }
	  return environment.executeMutation({
	    operation: operation,
	    optimisticResponse: optimisticResponse,
	    optimisticUpdater: optimisticUpdater,
	    updater: updater,
	    uploadables: uploadables
	  }).subscribeLegacy({
	    onNext: function onNext(payload) {
	      // NOTE: commitRelayModernMutation has a non-standard use of
	      // onCompleted() by calling it on every next value. It may be called
	      // multiple times if a network request produces multiple responses.
	      var onCompleted = config.onCompleted;

	      if (onCompleted) {
	        var snapshot = environment.lookup(operation.fragment);
	        onCompleted(snapshot.data, payload.errors);
	      }
	    },
	    onError: onError
	  });
	}

	module.exports = commitRelayModernMutation;

/***/ }),
/* 56 */
/***/ (function(module, exports, __webpack_require__) {

	/**
	 * Copyright (c) 2013-present, Facebook, Inc.
	 *
	 * This source code is licensed under the MIT license found in the
	 * LICENSE file in the root directory of this source tree.
	 *
	 * @providesModule fetchRelayModernQuery
	 * 
	 * @format
	 */

	'use strict';

	/**
	 * A helper function to fetch the results of a query. Note that results for
	 * fragment spreads are masked: fields must be explicitly listed in the query in
	 * order to be accessible in the result object.
	 *
	 * NOTE: This module is primarily intended for integrating with classic APIs.
	 * Most product code should use a Renderer or Container.
	 *
	 * TODO(t16875667): The return type should be `Promise<?SelectorData>`, but
	 * that's not really helpful as `SelectorData` is essentially just `mixed`. We
	 * can probably leverage generated flow types here to return the real expected
	 * shape.
	 */
	function fetchRelayModernQuery(environment, taggedNode, variables, cacheConfig) {
	  __webpack_require__(1)(environment.unstable_internal, 'fetchRelayModernQuery: Expected a valid Relay environment, got `%s`.', environment);
	  var _environment$unstable = environment.unstable_internal,
	      createOperationSelector = _environment$unstable.createOperationSelector,
	      getOperation = _environment$unstable.getOperation;

	  var query = getOperation(taggedNode);
	  var operation = createOperationSelector(query, variables);

	  return environment.execute({ operation: operation, cacheConfig: cacheConfig }).map(function () {
	    return environment.lookup(operation.fragment).data;
	  }).toPromise();
	}

	module.exports = fetchRelayModernQuery;

/***/ }),
/* 57 */
/***/ (function(module, exports) {

	/**
	 * Copyright (c) 2013-present, Facebook, Inc.
	 *
	 * This source code is licensed under the MIT license found in the
	 * LICENSE file in the root directory of this source tree.
	 *
	 * @providesModule hasOverlappingIDs
	 * 
	 * @format
	 */

	'use strict';

	function hasOverlappingIDs(snapshot, updatedRecordIDs) {
	  var keys = Object.keys(snapshot.seenRecords);
	  for (var ii = 0; ii < keys.length; ii++) {
	    if (updatedRecordIDs.hasOwnProperty(keys[ii])) {
	      return true;
	    }
	  }
	  return false;
	}

	module.exports = hasOverlappingIDs;

/***/ }),
/* 58 */
/***/ (function(module, exports) {

	/**
	 * Copyright (c) 2013-present, Facebook, Inc.
	 *
	 * This source code is licensed under the MIT license found in the
	 * LICENSE file in the root directory of this source tree.
	 *
	 * @providesModule isPromise
	 * 
	 * @format
	 */

	'use strict';

	function isPromise(p) {
	  return !!p && typeof p.then === 'function';
	}

	module.exports = isPromise;

/***/ }),
/* 59 */
/***/ (function(module, exports) {

	/**
	 * Copyright (c) 2013-present, Facebook, Inc.
	 *
	 * This source code is licensed under the MIT license found in the
	 * LICENSE file in the root directory of this source tree.
	 *
	 * 
	 * @providesModule isScalarAndEqual
	 * @format
	 */

	'use strict';

	/**
	 * A fast test to determine if two values are equal scalars:
	 * - compares scalars such as booleans, strings, numbers by value
	 * - compares functions by identity
	 * - returns false for complex values, since these cannot be cheaply tested for
	 *   equality (use `areEquals` instead)
	 */

	function isScalarAndEqual(valueA, valueB) {
	  return valueA === valueB && (valueA === null || typeof valueA !== 'object');
	}

	module.exports = isScalarAndEqual;

/***/ }),
/* 60 */
/***/ (function(module, exports) {

	/**
	 * Copyright (c) 2013-present, Facebook, Inc.
	 *
	 * This source code is licensed under the MIT license found in the
	 * LICENSE file in the root directory of this source tree.
	 *
	 * @providesModule recycleNodesInto
	 * 
	 * @format
	 */

	'use strict';

	/**
	 * Recycles subtrees from `prevData` by replacing equal subtrees in `nextData`.
	 */

	function recycleNodesInto(prevData, nextData) {
	  if (prevData === nextData || typeof prevData !== 'object' || !prevData || typeof nextData !== 'object' || !nextData) {
	    return nextData;
	  }
	  var canRecycle = false;

	  // Assign local variables to preserve Flow type refinement.
	  var prevArray = Array.isArray(prevData) ? prevData : null;
	  var nextArray = Array.isArray(nextData) ? nextData : null;
	  if (prevArray && nextArray) {
	    canRecycle = nextArray.reduce(function (wasEqual, nextItem, ii) {
	      var prevValue = prevArray[ii];
	      var nextValue = recycleNodesInto(prevValue, nextItem);
	      if (nextValue !== nextArray[ii]) {
	        nextArray[ii] = nextValue;
	      }
	      return wasEqual && nextArray[ii] === prevArray[ii];
	    }, true) && prevArray.length === nextArray.length;
	  } else if (!prevArray && !nextArray) {
	    // Assign local variables to preserve Flow type refinement.
	    var prevObject = prevData;
	    var nextObject = nextData;
	    var prevKeys = Object.keys(prevObject);
	    var nextKeys = Object.keys(nextObject);
	    canRecycle = nextKeys.reduce(function (wasEqual, key) {
	      var prevValue = prevObject[key];
	      var nextValue = recycleNodesInto(prevValue, nextObject[key]);
	      if (nextValue !== nextObject[key]) {
	        nextObject[key] = nextValue;
	      }
	      return wasEqual && nextObject[key] === prevObject[key];
	    }, true) && prevKeys.length === nextKeys.length;
	  }
	  return canRecycle ? prevData : nextData;
	}

	module.exports = recycleNodesInto;

/***/ }),
/* 61 */
/***/ (function(module, exports, __webpack_require__) {

	/**
	 * Copyright (c) 2013-present, Facebook, Inc.
	 *
	 * This source code is licensed under the MIT license found in the
	 * LICENSE file in the root directory of this source tree.
	 *
	 * @providesModule requestRelaySubscription
	 * 
	 * @format
	 */

	'use strict';

	function requestRelaySubscription(environment, config) {
	  var _environment$unstable = environment.unstable_internal,
	      createOperationSelector = _environment$unstable.createOperationSelector,
	      getOperation = _environment$unstable.getOperation;

	  var subscription = getOperation(config.subscription);
	  var configs = config.configs,
	      onCompleted = config.onCompleted,
	      onError = config.onError,
	      onNext = config.onNext,
	      variables = config.variables;

	  var operation = createOperationSelector(subscription, variables);

	  __webpack_require__(5)(!(config.updater && configs), 'requestRelaySubscription: Expected only one of `updater` and `configs` to be provided');

	  var _ref = configs ? __webpack_require__(26)(configs, subscription, null /* optimisticUpdater */
	  , config.updater) : config,
	      updater = _ref.updater;

	  return environment.execute({
	    operation: operation,
	    updater: updater,
	    cacheConfig: { force: true }
	  }).map(function () {
	    return environment.lookup(operation.fragment).data;
	  }).subscribeLegacy({
	    onNext: onNext,
	    onError: onError,
	    onCompleted: onCompleted
	  });
	}

	module.exports = requestRelaySubscription;

/***/ }),
/* 62 */
/***/ (function(module, exports, __webpack_require__) {

	/**
	 * Copyright (c) 2013-present, Facebook, Inc.
	 *
	 * This source code is licensed under the MIT license found in the
	 * LICENSE file in the root directory of this source tree.
	 *
	 * @providesModule simpleClone
	 * 
	 * @format
	 */

	'use strict';

	/**
	 * A helper to create a deep clone of a value, plain Object, or array of such.
	 *
	 * Does not support RegExp, Date, other classes, or self-referential values.
	 */
	function simpleClone(value) {
	  if (Array.isArray(value)) {
	    return value.map(simpleClone);
	  } else if (value && typeof value === 'object') {
	    return __webpack_require__(65)(value, simpleClone);
	  } else {
	    return value;
	  }
	}

	module.exports = simpleClone;

/***/ }),
/* 63 */
/***/ (function(module, exports) {

	module.exports = __WEBPACK_EXTERNAL_MODULE_63__;

/***/ }),
/* 64 */
/***/ (function(module, exports) {

	module.exports = __WEBPACK_EXTERNAL_MODULE_64__;

/***/ }),
/* 65 */
/***/ (function(module, exports) {

	module.exports = __WEBPACK_EXTERNAL_MODULE_65__;

/***/ }),
/* 66 */
/***/ (function(module, exports) {

	module.exports = __WEBPACK_EXTERNAL_MODULE_66__;

/***/ }),
/* 67 */
/***/ (function(module, exports) {

	module.exports = __WEBPACK_EXTERNAL_MODULE_67__;

/***/ }),
/* 68 */
/***/ (function(module, exports) {

	if(typeof __WEBPACK_EXTERNAL_MODULE_68__ === 'undefined') {var e = new Error("Cannot find module \"relay-debugger-react-native-runtime\""); e.code = 'MODULE_NOT_FOUND'; throw e;}
	module.exports = __WEBPACK_EXTERNAL_MODULE_68__;

/***/ })
/******/ ])
});
;