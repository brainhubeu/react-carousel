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

var _classCallCheck3 = _interopRequireDefault(require('babel-runtime/helpers/classCallCheck'));

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
    var inspector = require('./RelayRecordSourceInspector').getForEnvironment(this._environment);

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
    var inspector = require('./RelayRecordSourceInspector').getForEnvironment(this._environment);
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