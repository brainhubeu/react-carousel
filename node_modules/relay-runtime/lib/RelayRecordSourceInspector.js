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

var _classCallCheck3 = _interopRequireDefault(require('babel-runtime/helpers/classCallCheck'));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _require = require('./RelayStoreUtils'),
    ROOT_ID = _require.ROOT_ID,
    ROOT_TYPE = _require.ROOT_TYPE;

var _require2 = require('./RelayStoreUtils'),
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
    require('fbjs/lib/invariant')(root && root.getType() === ROOT_TYPE, 'RelayRecordSourceProxy#getRoot(): Expected the source to contain a ' + 'root record.');
    // Make viewer more accessible: if a record is not present on the original
    // field name but is present on the viewer handle field, rewrite the getter
    // to make `root.viewer` work.
    if (root.viewer == null) {
      var viewerHandle = require('./getRelayHandleKey')('viewer', null, 'viewer');
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
    return require('./RelayModernRecord').getDataID(this._record);
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
    return require('./RelayModernRecord').getType(this._record);
  };

  /**
   * Returns a copy of the internal representation of the record.
   */


  RecordInspector.prototype.inspect = function inspect() {
    return require('./simpleClone')(this._record);
  };

  /**
   * Returns the value of a scalar field. May throw if the given field is
   * present but not actually scalar.
   */


  RecordInspector.prototype.getValue = function getValue(name, args) {
    var storageKey = args ? require('./formatStorageKey')(name, args) : name;
    return require('./RelayModernRecord').getValue(this._record, storageKey);
  };

  /**
   * Returns an inspector for the given scalar "linked" field (a field whose
   * value is another Record instead of a scalar). May throw if the field is
   * present but not a scalar linked record.
   */


  RecordInspector.prototype.getLinkedRecord = function getLinkedRecord(name, args) {
    var storageKey = args ? require('./formatStorageKey')(name, args) : name;
    var linkedID = require('./RelayModernRecord').getLinkedRecordID(this._record, storageKey);
    return linkedID != null ? this._sourceInspector.get(linkedID) : linkedID;
  };

  /**
   * Returns an array of inspectors for the given plural "linked" field (a field
   * whose value is an array of Records instead of a scalar). May throw if the
   * field is  present but not a plural linked record.
   */


  RecordInspector.prototype.getLinkedRecords = function getLinkedRecords(name, args) {
    var _this4 = this;

    var storageKey = args ? require('./formatStorageKey')(name, args) : name;
    var linkedIDs = require('./RelayModernRecord').getLinkedRecordIDs(this._record, storageKey);
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
    var type = record ? require('./RelayModernRecord').getType(record) : null;
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