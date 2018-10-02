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

var _classCallCheck3 = _interopRequireDefault(require('babel-runtime/helpers/classCallCheck'));

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
    require('fbjs/lib/invariant')(type != null, 'RelayRecordProxy: Cannot get the type of deleted record `%s`.', this._dataID);
    return type;
  };

  RelayRecordProxy.prototype.getValue = function getValue(name, args) {
    var storageKey = args ? require('./formatStorageKey')(name, args) : name;
    return this._mutator.getValue(this._dataID, storageKey);
  };

  RelayRecordProxy.prototype.setValue = function setValue(value, name, args) {
    require('fbjs/lib/invariant')(isValidLeafValue(value), 'RelayRecordProxy#setValue(): Expected a scalar or array of scalars, ' + 'got `%s`.', JSON.stringify(value));
    var storageKey = args ? require('./formatStorageKey')(name, args) : name;
    this._mutator.setValue(this._dataID, storageKey, value);
    return this;
  };

  RelayRecordProxy.prototype.getLinkedRecord = function getLinkedRecord(name, args) {
    var storageKey = args ? require('./formatStorageKey')(name, args) : name;
    var linkedID = this._mutator.getLinkedRecordID(this._dataID, storageKey);
    return linkedID != null ? this._source.get(linkedID) : linkedID;
  };

  RelayRecordProxy.prototype.setLinkedRecord = function setLinkedRecord(record, name, args) {
    require('fbjs/lib/invariant')(record instanceof RelayRecordProxy, 'RelayRecordProxy#setLinkedRecord(): Expected a record, got `%s`.', record);
    var storageKey = args ? require('./formatStorageKey')(name, args) : name;
    var linkedID = record.getDataID();
    this._mutator.setLinkedRecordID(this._dataID, storageKey, linkedID);
    return this;
  };

  RelayRecordProxy.prototype.getOrCreateLinkedRecord = function getOrCreateLinkedRecord(name, typeName, args) {
    var linkedRecord = this.getLinkedRecord(name, args);
    if (!linkedRecord) {
      var storageKey = args ? require('./formatStorageKey')(name, args) : name;
      var clientID = require('./generateRelayClientID')(this.getDataID(), storageKey);
      linkedRecord = this._source.create(clientID, typeName);
      this.setLinkedRecord(linkedRecord, name, args);
    }
    return linkedRecord;
  };

  RelayRecordProxy.prototype.getLinkedRecords = function getLinkedRecords(name, args) {
    var _this = this;

    var storageKey = args ? require('./formatStorageKey')(name, args) : name;
    var linkedIDs = this._mutator.getLinkedRecordIDs(this._dataID, storageKey);
    if (linkedIDs == null) {
      return linkedIDs;
    }
    return linkedIDs.map(function (linkedID) {
      return linkedID != null ? _this._source.get(linkedID) : linkedID;
    });
  };

  RelayRecordProxy.prototype.setLinkedRecords = function setLinkedRecords(records, name, args) {
    require('fbjs/lib/invariant')(Array.isArray(records), 'RelayRecordProxy#setLinkedRecords(): Expected records to be an array, got `%s`.', records);
    var storageKey = args ? require('./formatStorageKey')(name, args) : name;
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