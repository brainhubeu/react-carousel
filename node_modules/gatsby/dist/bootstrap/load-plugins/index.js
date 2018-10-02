"use strict";

var _regenerator = require("babel-runtime/regenerator");

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = require("babel-runtime/helpers/asyncToGenerator");

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _ = require(`lodash`);

var _require = require(`../../redux`),
    store = _require.store;

var nodeAPIs = require(`../../utils/api-node-docs`);
var browserAPIs = require(`../../utils/api-browser-docs`);
var ssrAPIs = require(`../../../cache-dir/api-ssr-docs`);
var loadPlugins = require(`./load`);

var _require2 = require(`./validate`),
    collatePluginAPIs = _require2.collatePluginAPIs,
    handleBadExports = _require2.handleBadExports,
    handleMultipleReplaceRenderers = _require2.handleMultipleReplaceRenderers;

var apis = {
  node: _.keys(nodeAPIs),
  browser: _.keys(browserAPIs),
  ssr: _.keys(ssrAPIs)

  // Create a "flattened" array of plugins with all subplugins
  // brought to the top-level. This simplifies running gatsby-* files
  // for subplugins.
};var flattenPlugins = function flattenPlugins(plugins) {
  var flattened = [];
  var extractPlugins = function extractPlugins(plugin) {
    plugin.pluginOptions.plugins.forEach(function (subPlugin) {
      flattened.push(subPlugin);
      extractPlugins(subPlugin);
    });
  };

  plugins.forEach(function (plugin) {
    flattened.push(plugin);
    extractPlugins(plugin);
  });

  return flattened;
};

module.exports = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee() {
  var config = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  var plugins, flattenedPlugins, x, apiToPlugins, badExports, isBad;
  return _regenerator2.default.wrap(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.next = 2;
          return loadPlugins(config);

        case 2:
          plugins = _context.sent;


          // Create a flattened array of the plugins
          flattenedPlugins = flattenPlugins(plugins);

          // Work out which plugins use which APIs, including those which are not
          // valid Gatsby APIs, aka 'badExports'

          x = collatePluginAPIs({ apis, flattenedPlugins });

          flattenedPlugins = x.flattenedPlugins;
          apiToPlugins = x.apiToPlugins;
          badExports = x.badExports;

          // Show errors for any non-Gatsby APIs exported from plugins

          isBad = handleBadExports({ apis, badExports });

          if (isBad && process.env.NODE_ENV === `production`) process.exit(1); // TODO: change to panicOnBuild

          // Show errors when ReplaceRenderer has been implemented multiple times
          flattenedPlugins = handleMultipleReplaceRenderers({
            apiToPlugins,
            flattenedPlugins
          });

          // If we get this far, everything looks good. Update the store
          store.dispatch({
            type: `SET_SITE_FLATTENED_PLUGINS`,
            payload: flattenedPlugins
          });

          store.dispatch({
            type: `SET_SITE_API_TO_PLUGINS`,
            payload: apiToPlugins
          });

          // TODO: Is this used? plugins and flattenedPlugins may be out of sync
          store.dispatch({
            type: `SET_SITE_PLUGINS`,
            payload: plugins
          });

          return _context.abrupt("return", flattenedPlugins);

        case 15:
        case "end":
          return _context.stop();
      }
    }
  }, _callee, undefined);
}));
//# sourceMappingURL=index.js.map