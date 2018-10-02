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

var _classCallCheck3 = _interopRequireDefault(require('babel-runtime/helpers/classCallCheck'));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _require = require('./RelayStoreUtils'),
    getHandleFilterValues = _require.getHandleFilterValues,
    getArgumentValues = _require.getArgumentValues,
    getStorageKey = _require.getStorageKey,
    TYPENAME_KEY = _require.TYPENAME_KEY;

var CONDITION = require('./RelayConcreteNode').CONDITION,
    INLINE_FRAGMENT = require('./RelayConcreteNode').INLINE_FRAGMENT,
    LINKED_FIELD = require('./RelayConcreteNode').LINKED_FIELD,
    LINKED_HANDLE = require('./RelayConcreteNode').LINKED_HANDLE,
    SCALAR_FIELD = require('./RelayConcreteNode').SCALAR_FIELD,
    SCALAR_HANDLE = require('./RelayConcreteNode').SCALAR_HANDLE;

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
    require('fbjs/lib/invariant')(record, 'RelayResponseNormalizer(): Expected root record `%s` to exist.', dataID);
    this._traverseSelections(node.selections, record, data);
    return this._handleFieldPayloads;
  };

  RelayResponseNormalizer.prototype._getVariableValue = function _getVariableValue(name) {
    require('fbjs/lib/invariant')(this._variables.hasOwnProperty(name), 'RelayResponseNormalizer(): Undefined variable `%s`.', name);
    return this._variables[name];
  };

  RelayResponseNormalizer.prototype._getRecordType = function _getRecordType(data) {
    var typeName = data[TYPENAME_KEY];
    require('fbjs/lib/invariant')(typeName != null, 'RelayResponseNormalizer(): Expected a typename for record `%s`.', JSON.stringify(data, null, 2));
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
        var typeName = require('./RelayModernRecord').getType(record);
        if (typeName === selection.type) {
          _this._traverseSelections(selection.selections, record, data);
        }
      } else if (selection.kind === LINKED_HANDLE || selection.kind === SCALAR_HANDLE) {
        var args = selection.args ? getArgumentValues(selection.args, _this._variables) : {};

        var fieldKey = require('./formatStorageKey')(selection.name, args);
        var handleKey = require('./getRelayHandleKey')(selection.handle, selection.key, selection.name);
        if (selection.filters) {
          var filterValues = getHandleFilterValues(selection.args || [], selection.filters, _this._variables);
          handleKey = require('./formatStorageKey')(handleKey, filterValues);
        }
        _this._handleFieldPayloads.push({
          args: args,
          dataID: require('./RelayModernRecord').getDataID(record),
          fieldKey: fieldKey,
          handle: selection.handle,
          handleKey: handleKey
        });
      } else {
        require('fbjs/lib/invariant')(false, 'RelayResponseNormalizer(): Unexpected ast kind `%s`.', selection.kind);
      }
    });
  };

  RelayResponseNormalizer.prototype._normalizeField = function _normalizeField(selection, record, data) {
    require('fbjs/lib/invariant')(typeof data === 'object' && data, 'writeField(): Expected data for field `%s` to be an object.', selection.name);
    var responseKey = selection.alias || selection.name;
    var storageKey = getStorageKey(selection, this._variables);
    var fieldValue = data[responseKey];
    if (fieldValue == null) {
      if (fieldValue === undefined && !this._handleStrippedNulls) {
        // If we're not stripping nulls, undefined fields are unset
        return;
      }
      if (process.env.NODE_ENV !== 'production') {
        require('fbjs/lib/warning')(Object.prototype.hasOwnProperty.call(data, responseKey), 'RelayResponseNormalizer(): Payload did not contain a value ' + 'for field `%s: %s`. Check that you are parsing with the same ' + 'query that was used to fetch the payload.', responseKey, storageKey);
      }
      require('./RelayModernRecord').setValue(record, storageKey, null);
      return;
    }

    if (selection.kind === SCALAR_FIELD) {
      require('./RelayModernRecord').setValue(record, storageKey, fieldValue);
    } else if (selection.plural) {
      this._normalizePluralLink(selection, record, storageKey, fieldValue);
    } else {
      this._normalizeLink(selection, record, storageKey, fieldValue);
    }
  };

  RelayResponseNormalizer.prototype._normalizeLink = function _normalizeLink(field, record, storageKey, fieldValue) {
    require('fbjs/lib/invariant')(typeof fieldValue === 'object' && fieldValue, 'RelayResponseNormalizer: Expected data for field `%s` to be an object.', storageKey);
    var nextID = fieldValue.id ||
    // Reuse previously generated client IDs
    require('./RelayModernRecord').getLinkedRecordID(record, storageKey) || require('./generateRelayClientID')(require('./RelayModernRecord').getDataID(record), storageKey);
    require('fbjs/lib/invariant')(typeof nextID === 'string', 'RelayResponseNormalizer: Expected id on field `%s` to be a string.', storageKey);
    require('./RelayModernRecord').setLinkedRecordID(record, storageKey, nextID);
    var nextRecord = this._recordSource.get(nextID);
    if (!nextRecord) {
      var typeName = field.concreteType || this._getRecordType(fieldValue);
      nextRecord = require('./RelayModernRecord').create(nextID, typeName);
      this._recordSource.set(nextID, nextRecord);
    } else if (process.env.NODE_ENV !== 'production') {
      this._validateRecordType(nextRecord, field, fieldValue);
    }
    this._traverseSelections(field.selections, nextRecord, fieldValue);
  };

  RelayResponseNormalizer.prototype._normalizePluralLink = function _normalizePluralLink(field, record, storageKey, fieldValue) {
    var _this2 = this;

    require('fbjs/lib/invariant')(Array.isArray(fieldValue), 'RelayResponseNormalizer: Expected data for field `%s` to be an array ' + 'of objects.', storageKey);
    var prevIDs = require('./RelayModernRecord').getLinkedRecordIDs(record, storageKey);
    var nextIDs = [];
    fieldValue.forEach(function (item, nextIndex) {
      // validate response data
      if (item == null) {
        nextIDs.push(item);
        return;
      }
      require('fbjs/lib/invariant')(typeof item === 'object', 'RelayResponseNormalizer: Expected elements for field `%s` to be ' + 'objects.', storageKey);

      var nextID = item.id || prevIDs && prevIDs[nextIndex] || // Reuse previously generated client IDs
      require('./generateRelayClientID')(require('./RelayModernRecord').getDataID(record), storageKey, nextIndex);
      require('fbjs/lib/invariant')(typeof nextID === 'string', 'RelayResponseNormalizer: Expected id of elements of field `%s` to ' + 'be strings.', storageKey);

      nextIDs.push(nextID);
      var nextRecord = _this2._recordSource.get(nextID);
      if (!nextRecord) {
        var typeName = field.concreteType || _this2._getRecordType(item);
        nextRecord = require('./RelayModernRecord').create(nextID, typeName);
        _this2._recordSource.set(nextID, nextRecord);
      } else if (process.env.NODE_ENV !== 'production') {
        _this2._validateRecordType(nextRecord, field, item);
      }
      _this2._traverseSelections(field.selections, nextRecord, item);
    });
    require('./RelayModernRecord').setLinkedRecordIDs(record, storageKey, nextIDs);
  };

  /**
   * Warns if the type of the record does not match the type of the field/payload.
   */


  RelayResponseNormalizer.prototype._validateRecordType = function _validateRecordType(record, field, payload) {
    var typeName = field.concreteType || this._getRecordType(payload);
    require('fbjs/lib/warning')(require('./RelayModernRecord').getType(record) === typeName, 'RelayResponseNormalizer: Invalid record `%s`. Expected %s to be ' + 'be consistent, but the record was assigned conflicting types `%s` ' + 'and `%s`. The GraphQL server likely violated the globally unique ' + 'id requirement by returning the same id for different objects.', require('./RelayModernRecord').getDataID(record), TYPENAME_KEY, require('./RelayModernRecord').getType(record), typeName);
  };

  return RelayResponseNormalizer;
}();

// eslint-disable-next-line no-func-assign


normalize = require('./RelayProfiler').instrument('RelayResponseNormalizer.normalize', normalize);

module.exports = { normalize: normalize };