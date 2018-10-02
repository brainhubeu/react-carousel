/**
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @providesModule RelayDataLoader
 * 
 * @format
 */

'use strict';

var _classCallCheck3 = _interopRequireDefault(require('babel-runtime/helpers/classCallCheck'));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _require = require('./RelayRecordState'),
    EXISTENT = _require.EXISTENT,
    UNKNOWN = _require.UNKNOWN;

var CONDITION = require('./RelayConcreteNode').CONDITION,
    INLINE_FRAGMENT = require('./RelayConcreteNode').INLINE_FRAGMENT,
    LINKED_FIELD = require('./RelayConcreteNode').LINKED_FIELD,
    LINKED_HANDLE = require('./RelayConcreteNode').LINKED_HANDLE,
    SCALAR_FIELD = require('./RelayConcreteNode').SCALAR_FIELD;

var getStorageKey = require('./RelayStoreUtils').getStorageKey,
    getArgumentValues = require('./RelayStoreUtils').getArgumentValues;

/**
 * Synchronously check whether the records required to fulfill the
 * given `selector` are present in `source`.
 *
 * If a field is missing, it uses the provided handlers to attempt to substitute
 * data. The `target` will store all records that are modified because of a
 * successful substitution.
 *
 * If all records are present, returns `true`, otherwise `false`.
 */


function check(source, target, selector, handlers) {
  var dataID = selector.dataID,
      node = selector.node,
      variables = selector.variables;

  var loader = new RelayDataLoader(source, target, variables, handlers);
  return loader.check(node, dataID);
}

/**
 * @private
 */

var RelayDataLoader = function () {
  function RelayDataLoader(source, target, variables, handlers) {
    (0, _classCallCheck3['default'])(this, RelayDataLoader);

    this._source = source;
    this._variables = variables;
    this._recordWasMissing = false;
    this._handlers = handlers;
    this._mutator = new (require('./RelayRecordSourceMutator'))(source, target);
  }

  RelayDataLoader.prototype.check = function check(node, dataID) {
    this._traverse(node, dataID);
    return !this._recordWasMissing;
  };

  RelayDataLoader.prototype._getVariableValue = function _getVariableValue(name) {
    require('fbjs/lib/invariant')(this._variables.hasOwnProperty(name), 'RelayAsyncLoader(): Undefined variable `%s`.', name);
    return this._variables[name];
  };

  RelayDataLoader.prototype._handleMissing = function _handleMissing() {
    this._recordWasMissing = true;
  };

  RelayDataLoader.prototype._getDataForHandlers = function _getDataForHandlers(field, dataID) {
    return {
      args: field.args ? getArgumentValues(field.args, this._variables) : {},
      // Getting a snapshot of the record state is potentially expensive since
      // we will need to merge the sink and source records. Since we do not create
      // any new records in this process, it is probably reasonable to provide
      // handlers with a copy of the source record.
      // The only thing that the provided record will not contain is fields
      // added by previous handlers.
      record: this._source.get(dataID)
    };
  };

  RelayDataLoader.prototype._handleMissingScalarField = function _handleMissingScalarField(field, dataID) {
    var _getDataForHandlers2 = this._getDataForHandlers(field, dataID),
        args = _getDataForHandlers2.args,
        record = _getDataForHandlers2.record;

    var _iteratorNormalCompletion = true;
    var _didIteratorError = false;
    var _iteratorError = undefined;

    try {
      for (var _iterator = this._handlers[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
        var handler = _step.value;

        if (handler.kind === 'scalar') {
          var newValue = handler.handle(field, record, args);
          if (newValue !== undefined) {
            return newValue;
          }
        }
      }
    } catch (err) {
      _didIteratorError = true;
      _iteratorError = err;
    } finally {
      try {
        if (!_iteratorNormalCompletion && _iterator['return']) {
          _iterator['return']();
        }
      } finally {
        if (_didIteratorError) {
          throw _iteratorError;
        }
      }
    }

    this._handleMissing();
  };

  RelayDataLoader.prototype._handleMissingLinkField = function _handleMissingLinkField(field, dataID) {
    var _getDataForHandlers3 = this._getDataForHandlers(field, dataID),
        args = _getDataForHandlers3.args,
        record = _getDataForHandlers3.record;

    var _iteratorNormalCompletion2 = true;
    var _didIteratorError2 = false;
    var _iteratorError2 = undefined;

    try {
      for (var _iterator2 = this._handlers[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
        var handler = _step2.value;

        if (handler.kind === 'linked') {
          var newValue = handler.handle(field, record, args);
          if (newValue != null && this._mutator.getStatus(newValue) === EXISTENT) {
            return newValue;
          }
        }
      }
    } catch (err) {
      _didIteratorError2 = true;
      _iteratorError2 = err;
    } finally {
      try {
        if (!_iteratorNormalCompletion2 && _iterator2['return']) {
          _iterator2['return']();
        }
      } finally {
        if (_didIteratorError2) {
          throw _iteratorError2;
        }
      }
    }

    this._handleMissing();
  };

  RelayDataLoader.prototype._handleMissingPluralLinkField = function _handleMissingPluralLinkField(field, dataID) {
    var _this = this;

    var _getDataForHandlers4 = this._getDataForHandlers(field, dataID),
        args = _getDataForHandlers4.args,
        record = _getDataForHandlers4.record;

    var _iteratorNormalCompletion3 = true;
    var _didIteratorError3 = false;
    var _iteratorError3 = undefined;

    try {
      for (var _iterator3 = this._handlers[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
        var handler = _step3.value;

        if (handler.kind === 'pluralLinked') {
          var newValue = handler.handle(field, record, args);
          if (newValue != null) {
            return newValue.filter(function (linkedID) {
              return linkedID != null && _this._mutator.getStatus(linkedID) === EXISTENT;
            });
          }
        }
      }
    } catch (err) {
      _didIteratorError3 = true;
      _iteratorError3 = err;
    } finally {
      try {
        if (!_iteratorNormalCompletion3 && _iterator3['return']) {
          _iterator3['return']();
        }
      } finally {
        if (_didIteratorError3) {
          throw _iteratorError3;
        }
      }
    }

    this._handleMissing();
  };

  RelayDataLoader.prototype._traverse = function _traverse(node, dataID) {
    var status = this._mutator.getStatus(dataID);
    if (status === UNKNOWN) {
      this._handleMissing();
    }
    if (status === EXISTENT) {
      this._traverseSelections(node.selections, dataID);
    }
  };

  RelayDataLoader.prototype._traverseSelections = function _traverseSelections(selections, dataID) {
    var _this2 = this;

    selections.every(function (selection) {
      switch (selection.kind) {
        case SCALAR_FIELD:
          _this2._prepareScalar(selection, dataID);
          break;
        case LINKED_FIELD:
          if (selection.plural) {
            _this2._preparePluralLink(selection, dataID);
          } else {
            _this2._prepareLink(selection, dataID);
          }
          break;
        case CONDITION:
          var conditionValue = _this2._getVariableValue(selection.condition);
          if (conditionValue === selection.passingValue) {
            _this2._traverseSelections(selection.selections, dataID);
          }
          break;
        case INLINE_FRAGMENT:
          var typeName = _this2._mutator.getType(dataID);
          if (typeName != null && typeName === selection.type) {
            _this2._traverseSelections(selection.selections, dataID);
          }
          break;
        case LINKED_HANDLE:
          // Handles have no selections themselves; traverse the original field
          // where the handle was set-up instead.
          var handleField = require('./cloneRelayHandleSourceField')(selection, selections, _this2._variables);
          if (handleField.plural) {
            _this2._preparePluralLink(handleField, dataID);
          } else {
            _this2._prepareLink(handleField, dataID);
          }
          break;
        default:
          require('fbjs/lib/invariant')(selection.kind === SCALAR_FIELD, 'RelayAsyncLoader(): Unexpected ast kind `%s`.', selection.kind);
      }
      return !_this2._done;
    });
  };

  RelayDataLoader.prototype._prepareScalar = function _prepareScalar(field, dataID) {
    var storageKey = getStorageKey(field, this._variables);
    var fieldValue = this._mutator.getValue(dataID, storageKey);
    if (fieldValue === undefined) {
      fieldValue = this._handleMissingScalarField(field, dataID);
      if (fieldValue !== undefined) {
        this._mutator.setValue(dataID, storageKey, fieldValue);
      }
    }
  };

  RelayDataLoader.prototype._prepareLink = function _prepareLink(field, dataID) {
    var storageKey = getStorageKey(field, this._variables);
    var linkedID = this._mutator.getLinkedRecordID(dataID, storageKey);

    if (linkedID === undefined) {
      linkedID = this._handleMissingLinkField(field, dataID);
      if (linkedID != null) {
        this._mutator.setLinkedRecordID(dataID, storageKey, linkedID);
      }
    }
    if (linkedID != null) {
      this._traverse(field, linkedID);
    }
  };

  RelayDataLoader.prototype._preparePluralLink = function _preparePluralLink(field, dataID) {
    var _this3 = this;

    var storageKey = getStorageKey(field, this._variables);
    var linkedIDs = this._mutator.getLinkedRecordIDs(dataID, storageKey);

    if (linkedIDs === undefined) {
      linkedIDs = this._handleMissingPluralLinkField(field, dataID);
      if (linkedIDs != null) {
        this._mutator.setLinkedRecordIDs(dataID, storageKey, linkedIDs);
      }
    }
    if (linkedIDs) {
      linkedIDs.forEach(function (linkedID) {
        if (linkedID != null) {
          _this3._traverse(field, linkedID);
        }
      });
    }
  };

  return RelayDataLoader;
}();

module.exports = {
  check: check
};