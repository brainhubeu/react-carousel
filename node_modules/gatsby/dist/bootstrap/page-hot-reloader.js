"use strict";

var _regenerator = require("babel-runtime/regenerator");

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = require("babel-runtime/helpers/asyncToGenerator");

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _ = require(`lodash`);

var _require = require(`../redux`),
    emitter = _require.emitter,
    store = _require.store;

var apiRunnerNode = require(`../utils/api-runner-node`);

var _require2 = require(`../redux/actions`),
    boundActionCreators = _require2.boundActionCreators;

var deletePage = boundActionCreators.deletePage,
    deleteComponentsDependencies = boundActionCreators.deleteComponentsDependencies;


var pagesDirty = false;
var graphql = void 0;

emitter.on(`CREATE_NODE`, function (action) {
  if (action.payload.internal.type !== `SitePage`) {
    pagesDirty = true;
  }
});
emitter.on(`DELETE_NODE`, function (action) {
  pagesDirty = true;
  debouncedCreatePages();
});

emitter.on(`API_RUNNING_QUEUE_EMPTY`, function () {
  if (pagesDirty) {
    debouncedCreatePages();
  }
});

var runCreatePages = function () {
  var _ref = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee() {
    var plugins, statefulPlugins, timestamp;
    return _regenerator2.default.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            pagesDirty = false;
            plugins = store.getState().plugins;
            // Test which plugins implement createPagesStatefully so we can
            // ignore their pages.

            statefulPlugins = plugins.filter(function (p) {
              try {
                var gatsbyNode = require(`${p.resolve}/gatsby-node`);
                if (gatsbyNode.createPagesStatefully) {
                  return true;
                } else {
                  return false;
                }
              } catch (e) {
                return false;
              }
            }).map(function (p) {
              return p.id;
            });
            timestamp = new Date().toJSON();
            _context.next = 6;
            return apiRunnerNode(`createPages`, {
              graphql,
              traceId: `createPages`,
              waitForCascadingActions: true
            });

          case 6:

            // Delete pages that weren't updated when running createPages.
            store.getState().pages.filter(function (p) {
              return !_.includes(statefulPlugins, p.pluginCreatorId);
            }).filter(function (p) {
              return p.updatedAt < timestamp;
            }).forEach(function (page) {
              deleteComponentsDependencies([page.path]);
              deletePage(page);
            });

            emitter.emit(`CREATE_PAGE_END`);

          case 8:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, undefined);
  }));

  return function runCreatePages() {
    return _ref.apply(this, arguments);
  };
}();

var debouncedCreatePages = _.debounce(runCreatePages, 100);

module.exports = function (graphqlRunner) {
  graphql = graphqlRunner;
};
//# sourceMappingURL=page-hot-reloader.js.map