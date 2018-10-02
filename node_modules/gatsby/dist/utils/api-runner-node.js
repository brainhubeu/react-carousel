"use strict";

var _regenerator = require("babel-runtime/regenerator");

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = require("babel-runtime/helpers/asyncToGenerator");

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _extends2 = require("babel-runtime/helpers/extends");

var _extends3 = _interopRequireDefault(_extends2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Promise = require(`bluebird`);
var glob = require(`glob`);
var _ = require(`lodash`);
var mapSeries = require(`async/mapSeries`);

var reporter = require(`gatsby-cli/lib/reporter`);
var cache = require(`./cache`);
var apiList = require(`./api-node-docs`);
var createNodeId = require(`./create-node-id`);

// Bind action creators per plugin so we can auto-add
// metadata to actions they create.
var boundPluginActionCreators = {};
var doubleBind = function doubleBind(boundActionCreators, api, plugin, _ref) {
  var traceId = _ref.traceId;

  if (boundPluginActionCreators[plugin.name + api + traceId]) {
    return boundPluginActionCreators[plugin.name + api + traceId];
  } else {
    var keys = Object.keys(boundActionCreators);
    var doubleBoundActionCreators = {};

    var _loop = function _loop(i) {
      var key = keys[i];
      var boundActionCreator = boundActionCreators[key];
      if (typeof boundActionCreator === `function`) {
        doubleBoundActionCreators[key] = function () {
          // Let action callers override who the plugin is. Shouldn't be used
          // that often.
          if (arguments.length === 1) {
            boundActionCreator(arguments.length <= 0 ? undefined : arguments[0], plugin, traceId);
          } else if (arguments.length === 2) {
            boundActionCreator(arguments.length <= 0 ? undefined : arguments[0], arguments.length <= 1 ? undefined : arguments[1], traceId);
          }
        };
      }
    };

    for (var i = 0; i < keys.length; i++) {
      _loop(i);
    }
    boundPluginActionCreators[plugin.name + api + traceId] = doubleBoundActionCreators;
    return doubleBoundActionCreators;
  }
};

var runAPI = function runAPI(plugin, api, args) {
  var pathPrefix = ``;

  var _require = require(`../redux`),
      store = _require.store,
      loadNodeContent = _require.loadNodeContent,
      getNodes = _require.getNodes,
      getNode = _require.getNode,
      hasNodeChanged = _require.hasNodeChanged,
      getNodeAndSavePathDependency = _require.getNodeAndSavePathDependency;

  var _require2 = require(`../redux/actions`),
      boundActionCreators = _require2.boundActionCreators;

  var doubleBoundActionCreators = doubleBind(boundActionCreators, api, plugin, args);

  if (store.getState().program.prefixPaths) {
    pathPrefix = store.getState().config.pathPrefix;
  }

  var namespacedCreateNodeId = function namespacedCreateNodeId(id) {
    return createNodeId(id, plugin.name);
  };

  var gatsbyNode = require(`${plugin.resolve}/gatsby-node`);
  if (gatsbyNode[api]) {
    var apiCallArgs = [(0, _extends3.default)({}, args, {
      pathPrefix,
      boundActionCreators: doubleBoundActionCreators,
      loadNodeContent,
      store,
      getNodes,
      getNode,
      hasNodeChanged,
      reporter,
      getNodeAndSavePathDependency,
      cache,
      createNodeId: namespacedCreateNodeId
    }), plugin.pluginOptions];

    // If the plugin is using a callback use that otherwise
    // expect a Promise to be returned.
    if (gatsbyNode[api].length === 3) {
      return Promise.fromCallback(function (callback) {
        return gatsbyNode[api].apply(gatsbyNode, apiCallArgs.concat([callback]));
      });
    } else {
      var result = gatsbyNode[api].apply(gatsbyNode, apiCallArgs);
      return Promise.resolve(result);
    }
  }

  return null;
};

var filteredPlugins = void 0;
var hasAPIFile = function hasAPIFile(plugin) {
  return glob.sync(`${plugin.resolve}/gatsby-node*`)[0];
};

var apisRunning = [];
var waitingForCasacadeToFinish = [];

module.exports = function () {
  var _ref2 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee(api) {
    var args = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    var pluginSource = arguments[2];
    return _regenerator2.default.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            return _context.abrupt("return", new Promise(function (resolve) {
              // Check that the API is documented.
              if (!apiList[api]) {
                reporter.error(`api: "${api}" is not a valid Gatsby api`);
                process.exit();
              }

              var _require3 = require(`../redux`),
                  store = _require3.store;

              var plugins = store.getState().flattenedPlugins;
              // Get the list of plugins that implement gatsby-node
              if (!filteredPlugins) {
                filteredPlugins = plugins.filter(function (plugin) {
                  return hasAPIFile(plugin);
                });
              }

              // Break infinite loops.
              // Sometimes a plugin will implement an API and call an
              // action which will trigger the same API being called.
              // "onCreatePage" is the only example right now.
              // In these cases, we should avoid calling the originating plugin
              // again.
              var noSourcePluginPlugins = filteredPlugins;
              if (pluginSource) {
                noSourcePluginPlugins = filteredPlugins.filter(function (p) {
                  return p.name !== pluginSource;
                });
              }

              var apiRunInstance = {
                api,
                args,
                pluginSource,
                resolve,
                startTime: new Date().toJSON(),
                traceId: args.traceId
              };

              if (args.waitForCascadingActions) {
                waitingForCasacadeToFinish.push(apiRunInstance);
              }

              apisRunning.push(apiRunInstance);

              var pluginName = null;
              mapSeries(noSourcePluginPlugins, function (plugin, callback) {
                if (plugin.name === `default-site-plugin`) {
                  pluginName = `gatsby-node.js`;
                } else {
                  pluginName = `Plugin ${plugin.name}`;
                }
                Promise.resolve(runAPI(plugin, api, args)).asCallback(callback);
              }, function (err, results) {
                if (err) {
                  if (process.env.NODE_ENV === `production`) {
                    return reporter.panic(`${pluginName} returned an error`, err);
                  }
                  return reporter.error(`${pluginName} returned an error`, err);
                }
                // Remove runner instance
                apisRunning = apisRunning.filter(function (runner) {
                  return runner !== apiRunInstance;
                });

                if (apisRunning.length === 0) {
                  var _require4 = require(`../redux`),
                      emitter = _require4.emitter;

                  emitter.emit(`API_RUNNING_QUEUE_EMPTY`);
                }

                // Filter empty results
                apiRunInstance.results = results.filter(function (result) {
                  return !_.isEmpty(result);
                });

                // Filter out empty responses and return if the
                // api caller isn't waiting for cascading actions to finish.
                if (!args.waitForCascadingActions) {
                  resolve(apiRunInstance.results);
                }

                // Check if any of our waiters are done.
                return waitingForCasacadeToFinish = waitingForCasacadeToFinish.filter(function (instance) {
                  // If none of its trace IDs are running, it's done.
                  if (!_.some(apisRunning, function (a) {
                    return a.traceId === instance.traceId;
                  })) {
                    instance.resolve(instance.results);
                    return false;
                  } else {
                    return true;
                  }
                });
              });
            }));

          case 1:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, undefined);
  }));

  return function (_x2) {
    return _ref2.apply(this, arguments);
  };
}();
//# sourceMappingURL=api-runner-node.js.map