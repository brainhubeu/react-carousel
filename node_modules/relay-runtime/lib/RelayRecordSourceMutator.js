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

var _extends3 = _interopRequireDefault(require('babel-runtime/helpers/extends'));

var _classCallCheck3 = _interopRequireDefault(require('babel-runtime/helpers/classCallCheck'));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _require = require('./RelayRecordState'),
    EXISTENT = _require.EXISTENT;

var _require2 = require('./RelayStoreUtils'),
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
        require('./RelayModernRecord').setValue(copy, storageKey, UNPUBLISH_FIELD_SENTINEL);
        backup.set(dataID, copy);
      }
    }
  };

  RelayRecordSourceMutator.prototype._getSinkRecord = function _getSinkRecord(dataID) {
    var sinkRecord = this._sink.get(dataID);
    if (!sinkRecord) {
      var baseRecord = this._base.get(dataID);
      require('fbjs/lib/invariant')(baseRecord, 'RelayRecordSourceMutator: Cannot modify non-existent record `%s`.', dataID);
      sinkRecord = require('./RelayModernRecord').create(dataID, require('./RelayModernRecord').getType(baseRecord));
      this._sink.set(dataID, sinkRecord);
    }
    return sinkRecord;
  };

  RelayRecordSourceMutator.prototype.copyFields = function copyFields(sourceID, sinkID) {
    var sinkSource = this._sink.get(sourceID);
    var baseSource = this._base.get(sourceID);
    require('fbjs/lib/invariant')(sinkSource || baseSource, 'RelayRecordSourceMutator#copyFields(): Cannot copy fields from ' + 'non-existent record `%s`.', sourceID);
    this._createBackupRecord(sinkID);
    var sink = this._getSinkRecord(sinkID);
    if (baseSource) {
      require('./RelayModernRecord').copyFields(baseSource, sink);
    }
    if (sinkSource) {
      require('./RelayModernRecord').copyFields(sinkSource, sink);
    }
    this._setSentinelFieldsInBackupRecord(sinkID, sink);
  };

  RelayRecordSourceMutator.prototype.copyFieldsFromRecord = function copyFieldsFromRecord(record, sinkID) {
    this.copyFields(require('./RelayModernRecord').getDataID(record), sinkID);
    var sink = this._getSinkRecord(sinkID);
    require('./RelayModernRecord').copyFields(record, sink);
    this._setSentinelFieldsInBackupRecord(sinkID, sink);
  };

  RelayRecordSourceMutator.prototype.create = function create(dataID, typeName) {
    require('fbjs/lib/invariant')(this._base.getStatus(dataID) !== EXISTENT && this._sink.getStatus(dataID) !== EXISTENT, 'RelayRecordSourceMutator#create(): Cannot create a record with id ' + '`%s`, this record already exists.', dataID);
    if (this._backup) {
      this._backup.set(dataID, UNPUBLISH_RECORD_SENTINEL);
    }
    var record = require('./RelayModernRecord').create(dataID, typeName);
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
        return require('./RelayModernRecord').getType(record);
      } else if (record === null) {
        return null;
      }
    }
  };

  RelayRecordSourceMutator.prototype.getValue = function getValue(dataID, storageKey) {
    for (var ii = 0; ii < this.__sources.length; ii++) {
      var record = this.__sources[ii].get(dataID);
      if (record) {
        var value = require('./RelayModernRecord').getValue(record, storageKey);
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
    require('./RelayModernRecord').setValue(sinkRecord, storageKey, value);
    this._setSentinelFieldInBackupRecord(dataID, storageKey);
  };

  RelayRecordSourceMutator.prototype.getLinkedRecordID = function getLinkedRecordID(dataID, storageKey) {
    for (var ii = 0; ii < this.__sources.length; ii++) {
      var record = this.__sources[ii].get(dataID);
      if (record) {
        var linkedID = require('./RelayModernRecord').getLinkedRecordID(record, storageKey);
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
    require('./RelayModernRecord').setLinkedRecordID(sinkRecord, storageKey, linkedID);
    this._setSentinelFieldInBackupRecord(dataID, storageKey);
  };

  RelayRecordSourceMutator.prototype.getLinkedRecordIDs = function getLinkedRecordIDs(dataID, storageKey) {
    for (var ii = 0; ii < this.__sources.length; ii++) {
      var record = this.__sources[ii].get(dataID);
      if (record) {
        var linkedIDs = require('./RelayModernRecord').getLinkedRecordIDs(record, storageKey);
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
    require('./RelayModernRecord').setLinkedRecordIDs(sinkRecord, storageKey, linkedIDs);
    this._setSentinelFieldInBackupRecord(dataID, storageKey);
  };

  return RelayRecordSourceMutator;
}();

module.exports = RelayRecordSourceMutator;