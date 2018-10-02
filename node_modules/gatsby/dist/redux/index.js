"use strict";

var _extends2 = require("babel-runtime/helpers/extends");

var _extends3 = _interopRequireDefault(_extends2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Redux = require(`redux`);
var Promise = require(`bluebird`);
var _ = require(`lodash`);

var _require = require(`remote-redux-devtools`),
    composeWithDevTools = _require.composeWithDevTools;

var fs = require(`fs`);
var mitt = require(`mitt`);
var stringify = require(`json-stringify-safe`);

// Create event emitter for actions
var emitter = mitt();

// Reducers
var reducers = require(`./reducers`);

// Read from cache the old node data.
var initialState = {};
try {
  initialState = JSON.parse(fs.readFileSync(`${process.cwd()}/.cache/redux-state.json`));
} catch (e) {
  // ignore errors.
}

var store = void 0;
// Only setup the Redux devtools if explicitly enabled.
if (process.env.REDUX_DEVTOOLS === `true`) {
  var sitePackageJSON = require(`${process.cwd()}/package.json`);
  var composeEnhancers = composeWithDevTools({
    realtime: true,
    port: 19999,
    name: sitePackageJSON.name
  });
  store = Redux.createStore(Redux.combineReducers((0, _extends3.default)({}, reducers)), initialState, composeEnhancers(Redux.applyMiddleware(function multi(_ref) {
    var dispatch = _ref.dispatch;

    return function (next) {
      return function (action) {
        return Array.isArray(action) ? action.filter(Boolean).map(dispatch) : next(action);
      };
    };
  })));
} else {
  store = Redux.createStore(Redux.combineReducers((0, _extends3.default)({}, reducers)), initialState, Redux.applyMiddleware(function multi(_ref2) {
    var dispatch = _ref2.dispatch;

    return function (next) {
      return function (action) {
        return Array.isArray(action) ? action.filter(Boolean).map(dispatch) : next(action);
      };
    };
  }));
}

// Persist state.
var saveState = _.debounce(function (state) {
  var pickedState = _.pick(state, [`nodes`, `status`, `componentDataDependencies`]);
  fs.writeFile(`${process.cwd()}/.cache/redux-state.json`, stringify(pickedState, null, 2), function () {});
}, 1000);

store.subscribe(function () {
  var lastAction = store.getState().lastAction;
  emitter.emit(lastAction.type, lastAction);
});

emitter.on(`*`, function () {
  saveState(store.getState());
});

/** Event emitter */
exports.emitter = emitter;

/** Redux store */
exports.store = store;

/**
 * Get all nodes from redux store.
 *
 * @returns {Array}
 */
exports.getNodes = function () {
  var nodes = _.values(store.getState().nodes);
  return nodes ? nodes : [];
};
var getNode = function getNode(id) {
  return store.getState().nodes[id];
};

/** Get node by id from store.
 *
 * @param {string} id
 * @returns {Object}
 */
exports.getNode = getNode;

/**
 * Determine if node has changed.
 *
 * @param {string} id
 * @param {string} digest
 * @returns {boolean}
 */
exports.hasNodeChanged = function (id, digest) {
  var node = store.getState().nodes[id];
  if (!node) {
    return true;
  } else {
    return node.internal.contentDigest !== digest;
  }
};

/**
 * Get content for a node from the plugin that created it.
 *
 * @param {Object} node
 * @returns {promise}
 */
exports.loadNodeContent = function (node) {
  if (_.isString(node.internal.content)) {
    return Promise.resolve(node.internal.content);
  } else {
    return new Promise(function (resolve) {
      // Load plugin's loader function
      var plugin = store.getState().flattenedPlugins.find(function (plug) {
        return plug.name === node.internal.owner;
      });

      var _require2 = require(plugin.resolve),
          loadNodeContent = _require2.loadNodeContent;

      if (!loadNodeContent) {
        throw new Error(`Could not find function loadNodeContent for plugin ${plugin.name}`);
      }

      return loadNodeContent(node).then(function (content) {
        // TODO update node's content field here.
        resolve(content);
      });
    });
  }
};

/**
 * Get node and save path dependency.
 *
 * @param {string} id
 * @param {string} path
 * @returns {Object} node
 */
exports.getNodeAndSavePathDependency = function (id, path) {
  var _require3 = require(`./actions/add-page-dependency`),
      createPageDependency = _require3.createPageDependency;

  var node = getNode(id);
  createPageDependency({ path, nodeId: id });
  return node;
};

// Start plugin runner which listens to the store
// and invokes Gatsby API based on actions.
require(`./plugin-runner`);
//# sourceMappingURL=index.js.map