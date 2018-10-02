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

var _classCallCheck3 = _interopRequireDefault(require('babel-runtime/helpers/classCallCheck'));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var CONDITION = require('./RelayConcreteNode').CONDITION,
    FRAGMENT_SPREAD = require('./RelayConcreteNode').FRAGMENT_SPREAD,
    INLINE_FRAGMENT = require('./RelayConcreteNode').INLINE_FRAGMENT,
    LINKED_FIELD = require('./RelayConcreteNode').LINKED_FIELD,
    SCALAR_FIELD = require('./RelayConcreteNode').SCALAR_FIELD;

var FRAGMENTS_KEY = require('./RelayStoreUtils').FRAGMENTS_KEY,
    ID_KEY = require('./RelayStoreUtils').ID_KEY,
    getArgumentValues = require('./RelayStoreUtils').getArgumentValues,
    getStorageKey = require('./RelayStoreUtils').getStorageKey;

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
    require('fbjs/lib/invariant')(this._variables.hasOwnProperty(name), 'RelayReader(): Undefined variable `%s`.', name);
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
        var typeName = require('./RelayModernRecord').getType(record);
        if (typeName != null && typeName === selection.type) {
          _this._traverseSelections(selection.selections, record, data);
        }
      } else if (selection.kind === FRAGMENT_SPREAD) {
        _this._createFragmentPointer(selection, record, data);
      } else {
        require('fbjs/lib/invariant')(false, 'RelayReader(): Unexpected ast kind `%s`.', selection.kind);
      }
    });
  };

  RelayReader.prototype._readScalar = function _readScalar(field, record, data) {
    var applicationName = field.alias || field.name;
    var storageKey = getStorageKey(field, this._variables);
    var value = require('./RelayModernRecord').getValue(record, storageKey);
    data[applicationName] = value;
  };

  RelayReader.prototype._readLink = function _readLink(field, record, data) {
    var applicationName = field.alias || field.name;
    var storageKey = getStorageKey(field, this._variables);
    var linkedID = require('./RelayModernRecord').getLinkedRecordID(record, storageKey);

    if (linkedID == null) {
      data[applicationName] = linkedID;
      return;
    }

    var prevData = data[applicationName];
    require('fbjs/lib/invariant')(prevData == null || typeof prevData === 'object', 'RelayReader(): Expected data for field `%s` on record `%s` ' + 'to be an object, got `%s`.', applicationName, require('./RelayModernRecord').getDataID(record), prevData);
    data[applicationName] = this._traverse(field, linkedID, prevData);
  };

  RelayReader.prototype._readPluralLink = function _readPluralLink(field, record, data) {
    var _this2 = this;

    var applicationName = field.alias || field.name;
    var storageKey = getStorageKey(field, this._variables);
    var linkedIDs = require('./RelayModernRecord').getLinkedRecordIDs(record, storageKey);

    if (linkedIDs == null) {
      data[applicationName] = linkedIDs;
      return;
    }

    var prevData = data[applicationName];
    require('fbjs/lib/invariant')(prevData == null || Array.isArray(prevData), 'RelayReader(): Expected data for field `%s` on record `%s` ' + 'to be an array, got `%s`.', applicationName, require('./RelayModernRecord').getDataID(record), prevData);
    var linkedArray = prevData || [];
    linkedIDs.forEach(function (linkedID, nextIndex) {
      if (linkedID == null) {
        linkedArray[nextIndex] = linkedID;
        return;
      }
      var prevItem = linkedArray[nextIndex];
      require('fbjs/lib/invariant')(prevItem == null || typeof prevItem === 'object', 'RelayReader(): Expected data for field `%s` on record `%s` ' + 'to be an object, got `%s`.', applicationName, require('./RelayModernRecord').getDataID(record), prevItem);
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
    require('fbjs/lib/invariant')(typeof fragmentPointers === 'object' && fragmentPointers, 'RelayReader: Expected fragment spread data to be an object, got `%s`.', fragmentPointers);
    data[ID_KEY] = data[ID_KEY] || require('./RelayModernRecord').getDataID(record);
    var variables = fragmentSpread.args ? getArgumentValues(fragmentSpread.args, this._variables) : {};
    fragmentPointers[fragmentSpread.name] = variables;
  };

  return RelayReader;
}();

module.exports = { read: read };