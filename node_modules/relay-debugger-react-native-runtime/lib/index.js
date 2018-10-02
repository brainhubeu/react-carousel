module.exports =
/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 3);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\n\nObject.defineProperty(exports, \"__esModule\", {\n  value: true\n});\nexports.connectToDevTools = connectToDevTools;\n\nvar _bridge = __webpack_require__(1);\n\nvar _setupRelayDebugger = __webpack_require__(2);\n\n/**\n * Copyright (c) 2017-present, Facebook, Inc.\n * All rights reserved.\n *\n * This source code is licensed under the BSD-style license found in the\n * LICENSE file in the root directory of this source tree. An additional grant\n * of patent rights can be found in the PATENTS file in the same directory.\n */\n\n/* eslint-disable no-console */\nfunction connectToDevTools(options) {\n  var _ref = options || {},\n      _ref$host = _ref.host,\n      host = _ref$host === undefined ? 'localhost' : _ref$host,\n      _ref$port = _ref.port,\n      port = _ref$port === undefined ? 8098 : _ref$port,\n      _ref$isAppActive = _ref.isAppActive,\n      isAppActive = _ref$isAppActive === undefined ? function () {\n    return true;\n  } : _ref$isAppActive;\n\n  function scheduleRetry() {\n    setTimeout(function () {\n      return connectToDevTools(options);\n    }, 2000);\n  }\n\n  if (!isAppActive()) {\n    // If the app is in background, maybe retry later.\n    // Don't actually attempt to connect until we're in foreground.\n    scheduleRetry();\n    return;\n  }\n\n  var messageListeners = [];\n  var closeListeners = [];\n  var uri = 'ws://' + host + ':' + port;\n  var ws = new window.WebSocket(uri);\n  ws.onclose = handleClose;\n  ws.onerror = handleClose;\n  ws.onmessage = handleMessage;\n  ws.onopen = function () {\n    var wall = {\n      listen: function listen(fn) {\n        messageListeners.push(fn);\n      },\n      onClose: function onClose(fn) {\n        closeListeners.push(fn);\n      },\n      send: function send(data) {\n        ws.send(JSON.stringify(data));\n      }\n    };\n    setupBackend(wall);\n  };\n\n  var hasClosed = false;\n  function handleClose() {\n    if (!hasClosed) {\n      hasClosed = true;\n      scheduleRetry();\n      closeListeners.forEach(function (fn) {\n        return fn();\n      });\n    }\n  }\n\n  function handleMessage(evt) {\n    var data = void 0;\n    try {\n      data = JSON.parse(evt.data);\n    } catch (e) {\n      console.error('failed to parse json: ' + evt.data);\n      return;\n    }\n    messageListeners.forEach(function (fn) {\n      try {\n        fn(data);\n      } catch (e) {\n        // jsc doesn't play so well with tracebacks that go into eval'd code,\n        // so the stack trace here will stop at the `eval()` call. Getting the\n        // message that caused the error is the best we can do for now.\n        console.log(data);\n        throw e;\n      }\n    });\n  }\n}\n\nfunction setupBackend(wall) {\n  var bridge = new _bridge.Bridge(wall);\n  (0, _setupRelayDebugger.setupRelayDebugger)(bridge, window.__RELAY_DEBUGGER__);\n}\n\n//////////////////\n// WEBPACK FOOTER\n// ./src/index.js\n// module id = 0\n// module chunks = 0\n\n//# sourceURL=webpack:///./src/index.js?");

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\n\nObject.defineProperty(exports, \"__esModule\", {\n  value: true\n});\n\nvar _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if (\"value\" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();\n\nfunction _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }\n\nfunction _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError(\"Cannot call a class as a function\"); } }\n\n/**\n * Copyright (c) 2015-present, Facebook, Inc.\n * All rights reserved.\n *\n * This source code is licensed under the BSD-style license found in the\n * LICENSE file in the root directory of this source tree. An additional grant\n * of patent rights can be found in the PATENTS file in the same directory.\n */\n\n// A simplified version of Bridge copied from react-devtools\n\n// Use the polyfill if the function is not native implementation\nfunction getWindowFunction(name, polyfill) {\n  if (String(window[name]).indexOf('[native code]') === -1) {\n    return polyfill;\n  }\n  return window[name];\n}\n\n// Custom polyfill that runs the queue with a backoff.\n// If you change it, make sure it behaves reasonably well in Firefox.\nvar cancelIdleCallback = getWindowFunction('cancelIdleCallback', clearTimeout);\n\nvar requestIdleCallback = getWindowFunction('requestIdleCallback', function (cb) {\n  return setTimeout(function () {\n    cb({\n      didTimeout: false,\n      timeRemaining: function timeRemaining() {\n        return Infinity;\n      }\n    });\n  }, 500);\n});\n\nvar Bridge = exports.Bridge = function () {\n  function Bridge(wall) {\n    _classCallCheck(this, Bridge);\n\n    this._cbs = new Map();\n    this._inspectables = new Map();\n    this._cid = 0;\n    this._listeners = {};\n    this._buffer = [];\n    this._flushHandle = null;\n    this._callers = {};\n    this._paused = false;\n    this._wall = wall;\n\n    wall.listen(this._handleMessage.bind(this));\n  }\n\n  _createClass(Bridge, [{\n    key: 'call',\n    value: function call(name, args, cb) {\n      var _cid = this._cid++;\n      this._cbs.set(_cid, cb);\n\n      this._wall.send({\n        type: 'call',\n        callback: _cid,\n        args: args,\n        name: name\n      });\n    }\n  }, {\n    key: 'onCall',\n    value: function onCall(name, handler) {\n      if (this._callers[name]) {\n        throw new Error('only one call handler per call name allowed');\n      }\n      this._callers[name] = handler;\n    }\n  }, {\n    key: 'pause',\n    value: function pause() {\n      this._wall.send({\n        type: 'pause'\n      });\n    }\n  }, {\n    key: 'resume',\n    value: function resume() {\n      this._wall.send({\n        type: 'resume'\n      });\n    }\n  }, {\n    key: 'send',\n    value: function send(evt, data) {\n      this._buffer.push({ evt: evt, data: data });\n      this.scheduleFlush();\n    }\n  }, {\n    key: 'scheduleFlush',\n    value: function scheduleFlush() {\n      if (!this._flushHandle && this._buffer.length) {\n        var timeout = this._paused ? 5000 : 500;\n        this._flushHandle = requestIdleCallback(this.flushBufferWhileIdle.bind(this), { timeout: timeout });\n      }\n    }\n  }, {\n    key: 'cancelFlush',\n    value: function cancelFlush() {\n      if (this._flushHandle) {\n        cancelIdleCallback(this._flushHandle);\n        this._flushHandle = null;\n      }\n    }\n  }, {\n    key: 'flushBufferWhileIdle',\n    value: function flushBufferWhileIdle(deadline) {\n      this._flushHandle = null;\n\n      // Magic numbers were determined by tweaking in a heavy UI and seeing\n      // what performs reasonably well both when DevTools are hidden and visible.\n      // The goal is that we try to catch up but avoid blocking the UI.\n      // When paused, it's okay to lag more, but not forever because otherwise\n      // when user activates React tab, it will freeze syncing.\n      var chunkCount = this._paused ? 20 : 10;\n      var chunkSize = Math.round(this._buffer.length / chunkCount);\n      var minChunkSize = this._paused ? 50 : 100;\n\n      while (this._buffer.length && (deadline.timeRemaining() > 0 || deadline.didTimeout)) {\n        var take = Math.min(this._buffer.length, Math.max(minChunkSize, chunkSize));\n        var currentBuffer = this._buffer.splice(0, take);\n        this.flushBufferSlice(currentBuffer);\n      }\n\n      if (this._buffer.length) {\n        this.scheduleFlush();\n      }\n    }\n  }, {\n    key: 'flushBufferSlice',\n    value: function flushBufferSlice(bufferSlice) {\n      var events = bufferSlice.map(function (_ref) {\n        var evt = _ref.evt,\n            data = _ref.data;\n\n        return { type: 'event', evt: evt, data: data };\n      });\n      this._wall.send({ type: 'many-events', events: events });\n    }\n  }, {\n    key: 'on',\n    value: function on(evt, fn) {\n      if (!this._listeners[evt]) {\n        this._listeners[evt] = [fn];\n      } else {\n        this._listeners[evt].push(fn);\n      }\n    }\n  }, {\n    key: 'off',\n    value: function off(evt, fn) {\n      if (!this._listeners[evt]) {\n        return;\n      }\n      var ix = this._listeners[evt].indexOf(fn);\n      if (ix !== -1) {\n        this._listeners[evt].splice(ix, 1);\n      }\n    }\n  }, {\n    key: 'once',\n    value: function once(evt, fn) {\n      var self = this;\n      var listener = function listener() {\n        fn.apply(this, arguments);\n        self.off(evt, listener);\n      };\n      this.on(evt, listener);\n    }\n  }, {\n    key: '_handleMessage',\n    value: function _handleMessage(payload) {\n      var _this = this;\n\n      if (payload.type === 'resume') {\n        this._paused = false;\n        this.scheduleFlush();\n        return;\n      }\n\n      if (payload.type === 'pause') {\n        this._paused = true;\n        this.cancelFlush();\n        return;\n      }\n\n      if (payload.type === 'callback') {\n        var callback = this._cbs.get(payload.id);\n        if (callback) {\n          callback.apply(undefined, _toConsumableArray(payload.args));\n          this._cbs.delete(payload.id);\n        }\n        return;\n      }\n\n      if (payload.type === 'call') {\n        this._handleCall(payload.name, payload.args, payload.callback);\n        return;\n      }\n\n      if (payload.type === 'event') {\n        var fns = this._listeners[payload.evt];\n        var data = payload.data;\n        if (fns) {\n          fns.forEach(function (fn) {\n            return fn(data);\n          });\n        }\n      }\n\n      if (payload.type === 'many-events') {\n        payload.events.forEach(function (event) {\n          var handlers = _this._listeners[event.evt];\n          if (handlers) {\n            handlers.forEach(function (fn) {\n              return fn(event.data);\n            });\n          }\n        });\n      }\n    }\n  }, {\n    key: '_handleCall',\n    value: function _handleCall(name, args, callback) {\n      if (!this._callers[name]) {\n        // eslint-disable-next-line no-console\n        console.warn('unknown call: \"' + name + '\"');\n        return;\n      }\n      var argsList = !Array.isArray(args) ? [args] : args;\n      var result = void 0;\n      try {\n        result = this._callers[name].apply(null, argsList);\n      } catch (e) {\n        // eslint-disable-next-line no-console\n        console.error('Failed to call', e);\n        return;\n      }\n      this._wall.send({\n        type: 'callback',\n        id: callback,\n        args: [result]\n      });\n    }\n  }]);\n\n  return Bridge;\n}();\n\n//////////////////\n// WEBPACK FOOTER\n// ./src/bridge.js\n// module id = 1\n// module chunks = 0\n\n//# sourceURL=webpack:///./src/bridge.js?");

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\n\nObject.defineProperty(exports, \"__esModule\", {\n  value: true\n});\nexports.setupRelayDebugger = setupRelayDebugger;\n/**\n * Copyright (c) 2017-present, Facebook, Inc.\n * All rights reserved.\n *\n * This source code is licensed under the BSD-style license found in the\n * LICENSE file in the root directory of this source tree. An additional grant\n * of patent rights can be found in the PATENTS file in the same directory.\n */\n\nfunction setupRelayDebugger(bridge, debuggerObject) {\n  var shouldEnable = Boolean(debuggerObject);\n\n  bridge.onCall('relayDebugger:check', function () {\n    return shouldEnable;\n  });\n\n  if (!shouldEnable) {\n    return;\n  }\n\n  bridge.onCall('relayDebugger:getEnvironments', function () {\n    return debuggerObject.getRegisteredEnvironmentIds();\n  });\n\n  bridge.onCall('relayDebugger:getRecord', function (env, id) {\n    return debuggerObject.getEnvironmentDebugger(env).getRecord(id);\n  });\n\n  bridge.onCall('relayDebugger:getMatchingRecords', function (env, search, type) {\n    return debuggerObject.getEnvironmentDebugger(env).getMatchingRecords(search, type);\n  });\n\n  bridge.onCall('relayDebugger:checkDirty', function (env) {\n    var envDebugger = debuggerObject.getEnvironmentDebugger(env);\n    var isDirty = envDebugger.isDirty();\n    envDebugger.resetDirty();\n    return isDirty;\n  });\n\n  bridge.onCall('relayDebugger:startRecording', function (env) {\n    debuggerObject.getEnvironmentDebugger(env).startRecordingMutationEvents();\n  });\n\n  bridge.onCall('relayDebugger:stopRecording', function (env) {\n    debuggerObject.getEnvironmentDebugger(env).stopRecordingMutationEvents();\n  });\n\n  bridge.onCall('relayDebugger:getRecordedEvents', function (env) {\n    var events = debuggerObject.getEnvironmentDebugger(env).getRecordedMutationEvents();\n\n    // serialize errors\n    events.forEach(function (event) {\n      if (event.payload instanceof Error) {\n        event.payload = { isError: true, message: event.payload.message };\n      }\n    });\n\n    return events;\n  });\n}\n\n//////////////////\n// WEBPACK FOOTER\n// ./src/setupRelayDebugger.js\n// module id = 2\n// module chunks = 0\n\n//# sourceURL=webpack:///./src/setupRelayDebugger.js?");

/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

eval("module.exports = __webpack_require__(0);\n\n\n//////////////////\n// WEBPACK FOOTER\n// multi ./src/index.js\n// module id = 3\n// module chunks = 0\n\n//# sourceURL=webpack:///multi_./src/index.js?");

/***/ })
/******/ ]);