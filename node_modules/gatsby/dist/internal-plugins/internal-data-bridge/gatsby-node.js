"use strict";

var _objectWithoutProperties2 = require("babel-runtime/helpers/objectWithoutProperties");

var _objectWithoutProperties3 = _interopRequireDefault(_objectWithoutProperties2);

var _extends2 = require("babel-runtime/helpers/extends");

var _extends3 = _interopRequireDefault(_extends2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var crypto = require(`crypto`);
var moment = require(`moment`);
var chokidar = require(`chokidar`);
var systemPath = require(`path`);
var _ = require(`lodash`);

var _require = require(`../../redux`),
    emitter = _require.emitter;

var _require2 = require(`../../redux/actions`),
    boundActionCreators = _require2.boundActionCreators;

var _require3 = require(`../../redux`),
    getNode = _require3.getNode;

function transformPackageJson(json) {
  var transformDeps = function transformDeps(deps) {
    return _.entries(deps).map(function (_ref) {
      var name = _ref[0],
          version = _ref[1];

      return {
        name,
        version
      };
    });
  };

  json = _.pick(json, [`name`, `description`, `version`, `main`, `keywords`, `author`, `license`, `dependencies`, `devDependencies`, `peerDependencies`, `optionalDependecies`, `bundledDependecies`]);
  json.dependencies = transformDeps(json.dependencies);
  json.devDependencies = transformDeps(json.devDependencies);
  json.peerDependencies = transformDeps(json.peerDependencies);
  json.optionalDependecies = transformDeps(json.optionalDependecies);
  json.bundledDependecies = transformDeps(json.bundledDependecies);

  return json;
}

exports.sourceNodes = function (_ref2) {
  var boundActionCreators = _ref2.boundActionCreators,
      store = _ref2.store;
  var createNode = boundActionCreators.createNode;

  var state = store.getState();
  var program = state.program;
  var flattenedPlugins = state.flattenedPlugins;

  // Add our default development page since we know it's going to
  // exist and we need a node to exist so its query works :-)

  var page = { path: `/dev-404-page/` };
  createNode((0, _extends3.default)({}, page, {
    id: createPageId(page.path),
    parent: `SOURCE`,
    children: [],
    internal: {
      type: `SitePage`,
      contentDigest: crypto.createHash(`md5`).update(JSON.stringify(page)).digest(`hex`)
    }
  }));

  flattenedPlugins.forEach(function (plugin) {
    plugin.pluginFilepath = plugin.resolve;
    createNode((0, _extends3.default)({}, plugin, {
      packageJson: transformPackageJson(require(`${plugin.resolve}/package.json`)),
      parent: `SOURCE`,
      children: [],
      internal: {
        contentDigest: crypto.createHash(`md5`).update(JSON.stringify(plugin)).digest(`hex`),
        type: `SitePlugin`
      }
    }));
  });

  // Add site node.
  var buildTime = moment().subtract(process.uptime(), `seconds`).toJSON();

  var createGatsbyConfigNode = function createGatsbyConfigNode() {
    var config = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    // Delete plugins from the config as we add plugins above.
    var configCopy = (0, _extends3.default)({}, config);
    delete configCopy.plugins;
    var node = (0, _extends3.default)({
      siteMetadata: (0, _extends3.default)({}, configCopy.siteMetadata),
      port: state.program.port,
      host: state.program.host
    }, configCopy, {
      buildTime
    });
    createNode((0, _extends3.default)({}, node, {
      id: `Site`,
      parent: `SOURCE`,
      children: [],
      internal: {
        contentDigest: crypto.createHash(`md5`).update(JSON.stringify(node)).digest(`hex`),
        type: `Site`
      }
    }));
  };

  createGatsbyConfigNode(state.config);

  var pathToGatsbyConfig = systemPath.join(program.directory, `gatsby-config.js`);
  chokidar.watch(pathToGatsbyConfig).on(`change`, function () {
    var oldCache = require.cache[require.resolve(pathToGatsbyConfig)];
    try {
      // Delete require cache so we can reload the module.
      delete require.cache[require.resolve(pathToGatsbyConfig)];
      var config = require(pathToGatsbyConfig);
      createGatsbyConfigNode(config);
    } catch (e) {
      // Restore the old cache since requiring the new gatsby-config.js failed.
      if (oldCache !== undefined) {
        require.cache[require.resolve(pathToGatsbyConfig)] = oldCache;
      }
    }
  });
};

var createPageId = function createPageId(path) {
  return `SitePage ${path}`;
};

exports.onCreatePage = function (_ref3) {
  var page = _ref3.page,
      boundActionCreators = _ref3.boundActionCreators;
  var createNode = boundActionCreators.createNode;
  // eslint-disable-next-line

  var updatedAt = page.updatedAt,
      pageWithoutUpdated = (0, _objectWithoutProperties3.default)(page, ["updatedAt"]);

  // Add page.

  createNode((0, _extends3.default)({}, pageWithoutUpdated, {
    id: createPageId(page.path),
    parent: `SOURCE`,
    children: [],
    internal: {
      type: `SitePage`,
      contentDigest: crypto.createHash(`md5`).update(JSON.stringify(page)).digest(`hex`),
      description: page.pluginCreatorId === `Plugin default-site-plugin` ? `Your site's "gatsby-node.js"` : page.pluginCreatorId
    }
  }));
};

// Listen for DELETE_PAGE and delete page nodes.
emitter.on(`DELETE_PAGE`, function (action) {
  var nodeId = createPageId(action.payload.path);
  var node = getNode(nodeId);
  boundActionCreators.deleteNode(nodeId, node);
});
//# sourceMappingURL=gatsby-node.js.map