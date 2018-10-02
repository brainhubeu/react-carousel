'use strict';

exports.__esModule = true;

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

exports.default = devToolsEnhancer;
exports.preEnhancer = preEnhancer;
exports.composeWithDevTools = composeWithDevTools;

var _jsan = require('jsan');

var _socketclusterClient = require('socketcluster-client');

var _socketclusterClient2 = _interopRequireDefault(_socketclusterClient);

var _configureStore = require('./configureStore');

var _configureStore2 = _interopRequireDefault(_configureStore);

var _constants = require('./constants');

var _rnHostDetect = require('rn-host-detect');

var _rnHostDetect2 = _interopRequireDefault(_rnHostDetect);

var _remotedevUtils = require('remotedev-utils');

var _catchErrors = require('remotedev-utils/lib/catchErrors');

var _catchErrors2 = _interopRequireDefault(_catchErrors);

var _filters = require('remotedev-utils/lib/filters');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var instanceId = void 0;
var instanceName = void 0;
var suppressConnectErrors = void 0;
var errorCounts = {};
var socketOptions = void 0;
var socket = void 0;
var channel = void 0;
var store = {};
var lastAction = void 0;
var filters = void 0;
var isExcess = void 0;
var isMonitored = void 0;
var started = void 0;
var startOn = void 0;
var stopOn = void 0;
var sendOn = void 0;
var sendOnError = void 0;
var sendTo = void 0;
var lastErrorMsg = void 0;
var locked = void 0;
var paused = void 0;
var actionCreators = void 0;
var stateSanitizer = void 0;
var actionSanitizer = void 0;

function getLiftedState() {
  return (0, _filters.filterStagedActions)(store.liftedStore.getState(), filters);
}

function send() {
  if (!instanceId) instanceId = socket && socket.id || Math.random().toString(36).substr(2);
  try {
    fetch(sendTo, {
      method: 'POST',
      headers: {
        'content-type': 'application/json'
      },
      body: JSON.stringify({
        type: 'STATE',
        id: instanceId,
        name: instanceName,
        payload: (0, _jsan.stringify)(getLiftedState())
      })
    }).catch(function (err) {
      console.log(err);
    });
  } catch (err) {
    console.log(err);
  }
}

function relay(type, state, action, nextActionId) {
  var message = {
    type: type,
    id: socket.id,
    name: instanceName
  };
  if (state) {
    message.payload = type === 'ERROR' ? state : (0, _jsan.stringify)((0, _filters.filterState)(state, type, filters, stateSanitizer, actionSanitizer, nextActionId));
  }
  if (type === 'ACTION') {
    message.action = (0, _jsan.stringify)(!actionSanitizer ? action : actionSanitizer(action.action, nextActionId - 1));
    message.isExcess = isExcess;
    message.nextActionId = nextActionId;
  } else if (action) {
    message.action = action;
  }
  socket.emit(socket.id ? 'log' : 'log-noid', message);
}

function dispatchRemotely(action) {
  try {
    var result = (0, _remotedevUtils.evalAction)(action, actionCreators);
    store.dispatch(result);
  } catch (e) {
    relay('ERROR', e.message);
  }
}

function handleMessages(message) {
  if (message.type === 'IMPORT' || message.type === 'SYNC' && socket.id && message.id !== socket.id) {
    store.liftedStore.dispatch({
      type: 'IMPORT_STATE', nextLiftedState: (0, _jsan.parse)(message.state)
    });
  } else if (message.type === 'UPDATE') {
    relay('STATE', getLiftedState());
  } else if (message.type === 'START') {
    isMonitored = true;
    if (typeof actionCreators === 'function') actionCreators = actionCreators();
    relay('STATE', getLiftedState(), actionCreators);
  } else if (message.type === 'STOP' || message.type === 'DISCONNECTED') {
    isMonitored = false;
    relay('STOP');
  } else if (message.type === 'ACTION') {
    dispatchRemotely(message.action);
  } else if (message.type === 'DISPATCH') {
    store.liftedStore.dispatch(message.action);
  }
}

function async(fn) {
  setTimeout(fn, 0);
}

function sendError(errorAction) {
  // Prevent flooding
  if (errorAction.message && errorAction.message === lastErrorMsg) return;
  lastErrorMsg = errorAction.message;

  async(function () {
    store.dispatch(errorAction);
    if (!started) send();
  });
}

function str2array(str) {
  return typeof str === 'string' ? [str] : str && str.length;
}

function init(options) {
  instanceName = options.name;

  var _ref = options.filters || {};

  var blacklist = _ref.blacklist;
  var whitelist = _ref.whitelist;

  filters = (0, _filters.getLocalFilter)({
    actionsBlacklist: blacklist || options.actionsBlacklist,
    actionsWhitelist: whitelist || options.actionsWhitelist
  });
  if (options.port) {
    socketOptions = {
      port: options.port,
      hostname: options.hostname || 'localhost',
      secure: options.secure
    };
  } else socketOptions = _constants.defaultSocketOptions;

  suppressConnectErrors = options.suppressConnectErrors !== undefined ? options.suppressConnectErrors : true;

  startOn = str2array(options.startOn);
  stopOn = str2array(options.stopOn);
  sendOn = str2array(options.sendOn);
  sendOnError = options.sendOnError;
  if (sendOn || sendOnError) {
    sendTo = options.sendTo || (socketOptions.secure ? 'https' : 'http') + '://' + socketOptions.hostname + ':' + socketOptions.port;
    instanceId = options.id;
  }
  if (sendOnError === 1) (0, _catchErrors2.default)(sendError);

  if (options.actionCreators) actionCreators = function actionCreators() {
    return (0, _remotedevUtils.getActionsArray)(options.actionCreators);
  };
  stateSanitizer = options.stateSanitizer;
  actionSanitizer = options.actionSanitizer;
}

function login() {
  socket.emit('login', 'master', function (err, channelName) {
    if (err) {
      console.log(err);return;
    }
    channel = channelName;
    socket.subscribe(channelName).watch(handleMessages);
    socket.on(channelName, handleMessages);
  });
  started = true;
  relay('START');
}

function stop(keepConnected) {
  started = false;
  isMonitored = false;
  if (!socket) return;
  socket.destroyChannel(channel);
  if (keepConnected) {
    socket.off(channel, handleMessages);
  } else {
    socket.off();
    socket.disconnect();
  }
}

function start() {
  if (started || socket && socket.getState() === socket.CONNECTING) return;

  socket = _socketclusterClient2.default.connect(socketOptions);

  socket.on('error', function (err) {
    // if we've already had this error before, increment it's counter, otherwise assign it '1' since we've had the error once.
    errorCounts[err.name] = errorCounts.hasOwnProperty(err.name) ? errorCounts[err.name] + 1 : 1;

    if (suppressConnectErrors) {
      if (errorCounts[err.name] === 1) {
        console.log('remote-redux-devtools: Socket connection errors are being suppressed. ' + '\n' + 'This can be disabled by setting suppressConnectErrors to \'false\'.');
        console.log(err);
      }
    } else {
      console.log(err);
    }
  });
  socket.on('connect', function () {
    console.log('connected to remotedev-server');
    errorCounts = {}; // clear the errorCounts object, so that we'll log any new errors in the event of a disconnect
    login();
  });
  socket.on('disconnect', function () {
    stop(true);
  });
}

function checkForReducerErrors() {
  var liftedState = arguments.length <= 0 || arguments[0] === undefined ? store.liftedStore.getState() : arguments[0];

  if (liftedState.computedStates[liftedState.currentStateIndex].error) {
    if (started) relay('STATE', (0, _filters.filterStagedActions)(liftedState, filters));else send();
    return true;
  }
  return false;
}

function monitorReducer() {
  var state = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];
  var action = arguments[1];

  lastAction = action.type;
  if (!started && sendOnError === 2 && store.liftedStore) async(checkForReducerErrors);else if (action.action) {
    if (startOn && !started && startOn.indexOf(action.action.type) !== -1) async(start);else if (stopOn && started && stopOn.indexOf(action.action.type) !== -1) async(stop);else if (sendOn && !started && sendOn.indexOf(action.action.type) !== -1) async(send);
  }
  return state;
}

function handleChange(state, liftedState, maxAge) {
  if (checkForReducerErrors(liftedState)) return;

  if (lastAction === 'PERFORM_ACTION') {
    var nextActionId = liftedState.nextActionId;
    var liftedAction = liftedState.actionsById[nextActionId - 1];
    if ((0, _filters.isFiltered)(liftedAction.action, filters)) return;
    relay('ACTION', state, liftedAction, nextActionId);
    if (!isExcess && maxAge) isExcess = liftedState.stagedActionIds.length >= maxAge;
  } else {
    if (lastAction === 'JUMP_TO_STATE') return;
    if (lastAction === 'PAUSE_RECORDING') {
      paused = liftedState.isPaused;
    } else if (lastAction === 'LOCK_CHANGES') {
      locked = liftedState.isLocked;
    }
    if (paused || locked) {
      if (lastAction) lastAction = undefined;else return;
    }
    relay('STATE', (0, _filters.filterStagedActions)(liftedState, filters));
  }
}

function devToolsEnhancer() {
  var options = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

  init(_extends({}, options, {
    hostname: (0, _rnHostDetect2.default)(options.hostname || 'localhost')
  }));
  var realtime = typeof options.realtime === 'undefined' ? process.env.NODE_ENV === 'development' : options.realtime;
  if (!realtime && !(startOn || sendOn || sendOnError)) return function (f) {
    return f;
  };

  var maxAge = options.maxAge || 30;
  return function (next) {
    return function (reducer, initialState) {
      store = (0, _configureStore2.default)(next, monitorReducer, {
        maxAge: maxAge,
        shouldCatchErrors: !!sendOnError,
        shouldHotReload: options.shouldHotReload,
        shouldRecordChanges: options.shouldRecordChanges,
        shouldStartLocked: options.shouldStartLocked,
        pauseActionType: options.pauseActionType || '@@PAUSED'
      })(reducer, initialState);

      if (realtime) start();
      store.subscribe(function () {
        if (isMonitored) handleChange(store.getState(), store.liftedStore.getState(), maxAge);
      });
      return store;
    };
  };
}

function preEnhancer(createStore) {
  return function (reducer, preloadedState, enhancer) {
    store = createStore(reducer, preloadedState, enhancer);
    return _extends({}, store, {
      dispatch: function dispatch(action) {
        return locked ? action : store.dispatch(action);
      }
    });
  };
}

devToolsEnhancer.updateStore = function (newStore) {
  console.warn('devTools.updateStore is deprecated use composeWithDevTools instead: ' + 'https://github.com/zalmoxisus/remote-redux-devtools#use-devtools-compose-helper');
  store = newStore;
};

var compose = function compose(options) {
  return function () {
    for (var _len = arguments.length, funcs = Array(_len), _key = 0; _key < _len; _key++) {
      funcs[_key] = arguments[_key];
    }

    return function () {
      return [preEnhancer].concat(funcs).reduceRight(function (composed, f) {
        return f(composed);
      }, devToolsEnhancer(options).apply(undefined, arguments));
    };
  };
};

function composeWithDevTools() {
  if (arguments.length === 0) {
    return devToolsEnhancer();
  }
  if (arguments.length === 1 && _typeof(arguments.length <= 0 ? undefined : arguments[0]) === 'object') {
    return compose(arguments.length <= 0 ? undefined : arguments[0]);
  }
  return compose({}).apply(undefined, arguments);
}