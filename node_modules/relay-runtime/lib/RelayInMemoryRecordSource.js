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

var _classCallCheck3 = _interopRequireDefault(require('babel-runtime/helpers/classCallCheck'));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var EXISTENT = require('./RelayRecordState').EXISTENT,
    NONEXISTENT = require('./RelayRecordState').NONEXISTENT,
    UNKNOWN = require('./RelayRecordState').UNKNOWN;

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