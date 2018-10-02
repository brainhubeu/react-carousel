'use strict';

exports.__esModule = true;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

exports.default = importState;

var _mapValues = require('lodash/mapValues');

var _mapValues2 = _interopRequireDefault(_mapValues);

var _jsan = require('jsan');

var _jsan2 = _interopRequireDefault(_jsan);

var _serialize = require('remotedev-serialize/immutable/serialize');

var _serialize2 = _interopRequireDefault(_serialize);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function deprecate(param) {
  console.warn('`' + param + '` parameter for Redux DevTools Extension is deprecated. Use `serialize` parameter instead: https://github.com/zalmoxisus/redux-devtools-extension/releases/tag/v2.12.1'); // eslint-disable-line
}

function importState(state, _ref) {
  var deserializeState = _ref.deserializeState;
  var deserializeAction = _ref.deserializeAction;
  var serialize = _ref.serialize;

  if (!state) return undefined;
  var parse = _jsan2.default.parse;
  if (serialize) {
    if (serialize.immutable) {
      parse = function parse(v) {
        return _jsan2.default.parse(v, (0, _serialize2.default)(serialize.immutable, serialize.refs).reviver);
      };
    } else if (serialize.reviver) {
      parse = function parse(v) {
        return _jsan2.default.parse(v, serialize.reviver);
      };
    }
  }

  var preloadedState = void 0;
  var nextLiftedState = parse(state);
  if (nextLiftedState.payload) {
    if (nextLiftedState.preloadedState) preloadedState = parse(nextLiftedState.preloadedState);
    nextLiftedState = parse(nextLiftedState.payload);
  }
  if (deserializeState) {
    deprecate('deserializeState');
    if (typeof nextLiftedState.computedStates !== 'undefined') {
      nextLiftedState.computedStates = nextLiftedState.computedStates.map(function (computedState) {
        return _extends({}, computedState, {
          state: deserializeState(computedState.state)
        });
      });
    }
    if (typeof nextLiftedState.committedState !== 'undefined') {
      nextLiftedState.committedState = deserializeState(nextLiftedState.committedState);
    }
    if (typeof preloadedState !== 'undefined') {
      preloadedState = deserializeState(preloadedState);
    }
  }
  if (deserializeAction) {
    deprecate('deserializeAction');
    nextLiftedState.actionsById = (0, _mapValues2.default)(nextLiftedState.actionsById, function (liftedAction) {
      return _extends({}, liftedAction, {
        action: deserializeAction(liftedAction.action)
      });
    });
  }

  return { nextLiftedState: nextLiftedState, preloadedState: preloadedState };
}