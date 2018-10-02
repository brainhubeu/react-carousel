'use strict';

exports.__esModule = true;
exports.FilterState = undefined;

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

exports.arrToRegex = arrToRegex;
exports.getLocalFilter = getLocalFilter;
exports.isFiltered = isFiltered;
exports.filterStagedActions = filterStagedActions;
exports.filterState = filterState;

var _mapValues = require('lodash/mapValues');

var _mapValues2 = _interopRequireDefault(_mapValues);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var FilterState = exports.FilterState = {
  DO_NOT_FILTER: 'DO_NOT_FILTER',
  BLACKLIST_SPECIFIC: 'BLACKLIST_SPECIFIC',
  WHITELIST_SPECIFIC: 'WHITELIST_SPECIFIC'
};

function arrToRegex(v) {
  return typeof v === 'string' ? v : v.join('|');
}

function filterActions(actionsById, actionsFilter) {
  if (!actionsFilter) return actionsById;
  return (0, _mapValues2.default)(actionsById, function (action, id) {
    return _extends({}, action, { action: actionsFilter(action.action, id) });
  });
}

function filterStates(computedStates, statesFilter) {
  if (!statesFilter) return computedStates;
  return computedStates.map(function (state, idx) {
    return _extends({}, state, { state: statesFilter(state.state, idx) });
  });
}

function getLocalFilter(config) {
  if (config.actionsBlacklist || config.actionsWhitelist) {
    return {
      whitelist: config.actionsWhitelist && config.actionsWhitelist.join('|'),
      blacklist: config.actionsBlacklist && config.actionsBlacklist.join('|')
    };
  }
  return undefined;
}

function getDevToolsOptions() {
  return typeof window !== 'undefined' && window.devToolsOptions || {};
}

function isFiltered(action, localFilter) {
  var _ref = action.action || action;

  var type = _ref.type;

  var opts = getDevToolsOptions();
  if (!localFilter && opts.filter && opts.filter === FilterState.DO_NOT_FILTER || type && typeof type.match !== 'function') return false;

  var _ref2 = localFilter || opts;

  var whitelist = _ref2.whitelist;
  var blacklist = _ref2.blacklist;

  return whitelist && !type.match(whitelist) || blacklist && type.match(blacklist);
}

function filterStagedActions(state, filters) {
  if (!filters) return state;

  var filteredStagedActionIds = [];
  var filteredComputedStates = [];

  state.stagedActionIds.forEach(function (id, idx) {
    if (!isFiltered(state.actionsById[id], filters)) {
      filteredStagedActionIds.push(id);
      filteredComputedStates.push(state.computedStates[idx]);
    }
  });

  return _extends({}, state, {
    stagedActionIds: filteredStagedActionIds,
    computedStates: filteredComputedStates
  });
}

function filterState(state, type, localFilter, stateSanitizer, actionSanitizer, nextActionId, predicate) {
  if (type === 'ACTION') return !stateSanitizer ? state : stateSanitizer(state, nextActionId - 1);else if (type !== 'STATE') return state;

  var _getDevToolsOptions = getDevToolsOptions();

  var filter = _getDevToolsOptions.filter;

  if (predicate || localFilter || filter && filter !== FilterState.DO_NOT_FILTER) {
    var _ret = function () {
      var filteredStagedActionIds = [];
      var filteredComputedStates = [];
      var sanitizedActionsById = actionSanitizer && {};
      var actionsById = state.actionsById;
      var computedStates = state.computedStates;


      state.stagedActionIds.forEach(function (id, idx) {
        var liftedAction = actionsById[id];
        var currAction = liftedAction.action;
        var liftedState = computedStates[idx];
        var currState = liftedState.state;
        if (idx) {
          if (predicate && !predicate(currState, currAction)) return;
          if (isFiltered(currAction, localFilter)) return;
        }

        filteredStagedActionIds.push(id);
        filteredComputedStates.push(stateSanitizer ? _extends({}, liftedState, { state: stateSanitizer(currState, idx) }) : liftedState);
        if (actionSanitizer) {
          sanitizedActionsById[id] = _extends({}, liftedAction, { action: actionSanitizer(currAction, id)
          });
        }
      });

      return {
        v: _extends({}, state, {
          actionsById: sanitizedActionsById || actionsById,
          stagedActionIds: filteredStagedActionIds,
          computedStates: filteredComputedStates
        })
      };
    }();

    if ((typeof _ret === 'undefined' ? 'undefined' : _typeof(_ret)) === "object") return _ret.v;
  }

  if (!stateSanitizer && !actionSanitizer) return state;
  return _extends({}, state, {
    actionsById: filterActions(state.actionsById, actionSanitizer),
    computedStates: filterStates(state.computedStates, stateSanitizer)
  });
}