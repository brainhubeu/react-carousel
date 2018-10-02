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

var _classCallCheck3 = _interopRequireDefault(require('babel-runtime/helpers/classCallCheck'));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var CONDITION = require('./RelayConcreteNode').CONDITION,
    FRAGMENT_SPREAD = require('./RelayConcreteNode').FRAGMENT_SPREAD,
    INLINE_FRAGMENT = require('./RelayConcreteNode').INLINE_FRAGMENT,
    LINKED_FIELD = require('./RelayConcreteNode').LINKED_FIELD,
    LINKED_HANDLE = require('./RelayConcreteNode').LINKED_HANDLE,
    SCALAR_FIELD = require('./RelayConcreteNode').SCALAR_FIELD,
    SCALAR_HANDLE = require('./RelayConcreteNode').SCALAR_HANDLE;

var getStorageKey = require('./RelayStoreUtils').getStorageKey;

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
    require('fbjs/lib/invariant')(this._variables.hasOwnProperty(name), 'RelayReferenceMarker(): Undefined variable `%s`.', name);
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
        var typeName = require('./RelayModernRecord').getType(record);
        if (typeName != null && typeName === selection.type) {
          _this._traverseSelections(selection.selections, record);
        }
      } else if (selection.kind === FRAGMENT_SPREAD) {
        require('fbjs/lib/invariant')(false, 'RelayReferenceMarker(): Unexpected fragment spread `...%s`, ' + 'expected all fragments to be inlined.', selection.name);
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
        var handleField = require('./cloneRelayHandleSourceField')(selection, selections, _this._variables);
        if (handleField.plural) {
          _this._traversePluralLink(handleField, record);
        } else {
          _this._traverseLink(handleField, record);
        }
      } else {
        require('fbjs/lib/invariant')(selection.kind === SCALAR_FIELD || selection.kind === SCALAR_HANDLE, 'RelayReferenceMarker(): Unexpected ast kind `%s`.', selection.kind);
      }
    });
  };

  RelayReferenceMarker.prototype._traverseLink = function _traverseLink(field, record) {
    var storageKey = getStorageKey(field, this._variables);
    var linkedID = require('./RelayModernRecord').getLinkedRecordID(record, storageKey);

    if (linkedID == null) {
      return;
    }
    this._traverse(field, linkedID);
  };

  RelayReferenceMarker.prototype._traversePluralLink = function _traversePluralLink(field, record) {
    var _this2 = this;

    var storageKey = getStorageKey(field, this._variables);
    var linkedIDs = require('./RelayModernRecord').getLinkedRecordIDs(record, storageKey);

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