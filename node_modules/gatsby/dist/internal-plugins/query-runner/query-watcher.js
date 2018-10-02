"use strict";

var _extends2 = require("babel-runtime/helpers/extends");

var _extends3 = _interopRequireDefault(_extends2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/** *
 * Jobs of this module
 * - Maintain the list of components in the Redux store. So monitor new components
 *   and add/remove components.
 * - Watch components for query changes and extract these and update the store.
 * - Ensure all page queries are run as part of bootstrap and report back when
 *   this is done
 * - Whenever a query changes, re-run all pages that rely on this query.
 ***/

var _ = require(`lodash`);
var chokidar = require(`chokidar`);

var _require = require(`../../redux/`),
    store = _require.store;

var _require2 = require(`../../redux/actions`),
    boundActionCreators = _require2.boundActionCreators;

var queryCompiler = require(`./query-compiler`).default;
var queue = require(`./query-queue`);
var normalize = require(`normalize-path`);
var report = require(`gatsby-cli/lib/reporter`);

exports.extractQueries = function () {
  var state = store.getState();
  var pagesAndLayouts = [].concat(state.pages, state.layouts);
  var components = _.uniq(pagesAndLayouts.map(function (p) {
    return normalize(p.component);
  }));
  var queryCompilerPromise = queryCompiler().then(function (queries) {
    var queryWillNotRun = false;

    queries.forEach(function (query, component) {
      if (_.includes(components, component)) {
        boundActionCreators.replaceComponentQuery({
          query: query && query.text,
          componentPath: component
        });
      } else {
        report.warn(`The GraphQL query in the non-page component "${component}" will not be run.`);
        queryWillNotRun = true;
      }
    });

    if (queryWillNotRun) {
      report.log(report.stripIndent`
        Queries are only executed for Page or Layout components. Instead of a query,
        co-locate a GraphQL fragment and compose that fragment into the query (or other
        fragment) of the top-level page or layout that renders this component. For more
        info on fragments and composition see: http://graphql.org/learn/queries/#fragments
      `);
    }

    return;
  });

  // During development start watching files to recompile & run
  // queries on the fly.
  if (process.env.NODE_ENV !== `production`) {
    watch();

    // Ensure every component is being watched.
    components.forEach(function (component) {
      watcher.add(component);
    });
  }

  return queryCompilerPromise;
};

var runQueriesForComponent = function runQueriesForComponent(componentPath) {
  var pages = getPagesForComponent(componentPath);
  // Remove page & layout data dependencies before re-running queries because
  // the changing of the query could have changed the data dependencies.
  // Re-running the queries will add back data dependencies.
  boundActionCreators.deleteComponentsDependencies(pages.map(function (p) {
    return p.path || p.id;
  }));
  pages.forEach(function (page) {
    return queue.push((0, _extends3.default)({}, page, { _id: page.id, id: page.jsonName }));
  });

  return new Promise(function (resolve) {
    queue.on(`drain`, function () {
      return resolve();
    });
  });
};

var getPagesForComponent = function getPagesForComponent(componentPath) {
  var state = store.getState();
  return [].concat(state.pages, state.layouts).filter(function (p) {
    return p.componentPath === componentPath;
  });
};

var watcher = void 0;
exports.watchComponent = function (componentPath) {
  // We don't start watching until mid-way through the bootstrap so ignore
  // new components being added until then. This doesn't affect anything as
  // when extractQueries is called from bootstrap, we make sure that all
  // components are being watched.
  if (watcher) {
    watcher.add(componentPath);
  }
};
var watch = function watch(rootDir) {
  if (watcher) return;
  var debounceCompile = _.debounce(function () {
    queryCompiler().then(function (queries) {
      var components = store.getState().components;

      // If a component previously with a query now doesn't — update the
      // store.
      var noQueryComponents = Object.values(components).filter(function (c) {
        return c.query !== `` && !queries.has(c.componentPath);
      });
      noQueryComponents.forEach(function (_ref) {
        var componentPath = _ref.componentPath;

        boundActionCreators.replaceComponentQuery({
          query: ``,
          componentPath
        });
        runQueriesForComponent(componentPath);
      });

      // Update the store with the new queries and re-run queries that were
      // changed.
      queries.forEach(function (_ref2, id) {
        var text = _ref2.text;

        // Queries can be parsed from non page/layout components
        // e.g. components with fragments so ignore those.
        //
        // If the query has changed, set the new query in the
        // store and run its queries.
        if (components[id] && text !== components[id].query) {
          boundActionCreators.replaceComponentQuery({
            query: text,
            componentPath: id
          });
          runQueriesForComponent(id);
        }
      });
    });
  }, 100);

  watcher = chokidar.watch(`${rootDir}/src/**/*.{js,jsx,ts,tsx}`).on(`change`, function (path) {
    debounceCompile();
  });
};
//# sourceMappingURL=query-watcher.js.map