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

var _extends3 = _interopRequireDefault(require('babel-runtime/helpers/extends'));

var _classCallCheck3 = _interopRequireDefault(require('babel-runtime/helpers/classCallCheck'));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _require = require('./RelayStoreUtils'),
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
    if (process.env.NODE_ENV !== 'production') {
      var storeIDs = source.getRecordIDs();
      for (var ii = 0; ii < storeIDs.length; ii++) {
        var record = source.get(storeIDs[ii]);
        if (record) {
          require('./RelayModernRecord').freeze(record);
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
    return require('./RelayDataLoader').check(this._recordSource, this._recordSource, selector, []);
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
    var snapshot = require('./RelayReader').read(this._recordSource, selector);
    if (process.env.NODE_ENV !== 'production') {
      require('./deepFreeze')(snapshot);
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

    if (!require('./hasOverlappingIDs')(snapshot, this._updatedRecordIDs)) {
      return;
    }

    var _RelayReader$read = require('./RelayReader').read(this._recordSource, snapshot),
        data = _RelayReader$read.data,
        seenRecords = _RelayReader$read.seenRecords;

    var nextData = require('./recycleNodesInto')(snapshot.data, data);
    var nextSnapshot = (0, _extends3['default'])({}, snapshot, {
      data: nextData,
      seenRecords: seenRecords
    });
    if (process.env.NODE_ENV !== 'production') {
      require('./deepFreeze')(nextSnapshot);
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
    require('fbjs/lib/resolveImmediate')(function () {
      _this4._gc();
      _this4._hasScheduledGC = false;
    });
  };

  RelayMarkSweepStore.prototype._gc = function _gc() {
    var _this5 = this;

    var references = new Set();
    // Mark all records that are traversable from a root
    this._roots.forEach(function (selector) {
      require('./RelayReferenceMarker').mark(_this5._recordSource, selector, references);
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
    if (process.env.NODE_ENV !== 'production') {
      if (sourceRecord) {
        require('./RelayModernRecord').freeze(sourceRecord);
      }
    }
    if (sourceRecord === UNPUBLISH_RECORD_SENTINEL) {
      // Unpublish a record
      target.remove(dataID);
      updatedRecordIDs[dataID] = true;
    } else if (sourceRecord && targetRecord) {
      var nextRecord = require('./RelayModernRecord').update(targetRecord, sourceRecord);
      if (nextRecord !== targetRecord) {
        // Prevent mutation of a record from outside the store.
        if (process.env.NODE_ENV !== 'production') {
          require('./RelayModernRecord').freeze(nextRecord);
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

require('./RelayProfiler').instrumentMethods(RelayMarkSweepStore.prototype, {
  lookup: 'RelayMarkSweepStore.prototype.lookup',
  notify: 'RelayMarkSweepStore.prototype.notify',
  publish: 'RelayMarkSweepStore.prototype.publish',
  retain: 'RelayMarkSweepStore.prototype.retain',
  subscribe: 'RelayMarkSweepStore.prototype.subscribe'
});

module.exports = RelayMarkSweepStore;