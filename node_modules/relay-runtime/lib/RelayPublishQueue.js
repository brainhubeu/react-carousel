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

var _classCallCheck3 = _interopRequireDefault(require('babel-runtime/helpers/classCallCheck'));

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

    this._backup = new (require('./RelayInMemoryRecordSource'))();
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
    require('fbjs/lib/invariant')(!this._appliedOptimisticUpdates.has(updater) && !this._pendingOptimisticUpdates.has(updater), 'RelayPublishQueue: Cannot apply the same update function more than ' + 'once concurrently.');
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
      this._backup = new (require('./RelayInMemoryRecordSource'))();
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

    var mutator = new (require('./RelayRecordSourceMutator'))(this._store.getSource(), source);
    var store = new (require('./RelayRecordSourceProxy'))(mutator);
    var selectorStore = new (require('./RelayRecordSourceSelectorProxy'))(store, operation.fragment);
    if (fieldPayloads && fieldPayloads.length) {
      fieldPayloads.forEach(function (fieldPayload) {
        var handler = _this._handlerProvider && _this._handlerProvider(fieldPayload.handle);
        require('fbjs/lib/invariant')(handler, 'RelayModernEnvironment: Expected a handler to be provided for ' + 'handle `%s`.', fieldPayload.handle);
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
    var sink = new (require('./RelayInMemoryRecordSource'))();
    this._pendingUpdaters.forEach(function (updater) {
      var mutator = new (require('./RelayRecordSourceMutator'))(_this3._store.getSource(), sink);
      var store = new (require('./RelayRecordSourceProxy'))(mutator);
      updater(store);
    });
    this._store.publish(sink);
    this._pendingUpdaters.clear();
  };

  RelayPublishQueue.prototype._applyUpdates = function _applyUpdates() {
    var _this4 = this;

    if (this._pendingOptimisticUpdates.size || this._pendingBackupRebase && this._appliedOptimisticUpdates.size) {
      var sink = new (require('./RelayInMemoryRecordSource'))();
      var mutator = new (require('./RelayRecordSourceMutator'))(this._store.getSource(), sink, this._backup);
      var store = new (require('./RelayRecordSourceProxy'))(mutator, this._handlerProvider);

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
              var _normalizeRelayPayloa = require('./normalizeRelayPayload')(_operation.root, response);

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
              var _normalizeRelayPayloa2 = require('./normalizeRelayPayload')(_operation2.root, response);

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
  var selectorData = require('./RelayReader').read(source, selector).data;
  if (process.env.NODE_ENV !== 'production') {
    var deepFreeze = require('./deepFreeze');
    if (selectorData) {
      deepFreeze(selectorData);
    }
  }
  return selectorData;
}

module.exports = RelayPublishQueue;