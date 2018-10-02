"use strict";

var _regenerator = require("babel-runtime/regenerator");

var _regenerator2 = _interopRequireDefault(_regenerator);

var _extends2 = require("babel-runtime/helpers/extends");

var _extends3 = _interopRequireDefault(_extends2);

var _asyncToGenerator2 = require("babel-runtime/helpers/asyncToGenerator");

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _graphql = require("graphql");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var fs = require(`fs-extra`);
var report = require(`gatsby-cli/lib/reporter`);
var md5 = require(`md5`);

var _require = require(`../../utils/path`),
    joinPath = _require.joinPath;

var _require2 = require(`../../redux`),
    store = _require2.store;

var resultHashes = {};

var indentString = function indentString(string) {
  return string.replace(/\n/g, `\n  `);
};

// Run query for a page
module.exports = function () {
  var _ref = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee(pageOrLayout, component) {
    var _store$getState, schema, program, graphql, result, contextKey, resultJSON, resultHash, resultPath;

    return _regenerator2.default.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            pageOrLayout.id = pageOrLayout._id;
            _store$getState = store.getState(), schema = _store$getState.schema, program = _store$getState.program;

            graphql = function graphql(query, context) {
              return (0, _graphql.graphql)(schema, query, context, context, context);
            };

            // Run query


            result = void 0;

            // Nothing to do if the query doesn't exist.

            if (!(!component.query || component.query === ``)) {
              _context.next = 8;
              break;
            }

            result = {};
            _context.next = 11;
            break;

          case 8:
            _context.next = 10;
            return graphql(component.query, (0, _extends3.default)({}, pageOrLayout, pageOrLayout.context));

          case 10:
            result = _context.sent;

          case 11:

            // If there's a graphql error then log the error. If we're building, also
            // quit.
            if (result && result.errors) {
              report.log(`
The GraphQL query from ${component.componentPath} failed.

Errors:
  ${result.errors || []}
URL path:
  ${pageOrLayout.path}
Context:
  ${indentString(JSON.stringify(pageOrLayout.context, null, 2))}
Plugin:
  ${pageOrLayout.pluginCreatorId || `none`}
Query:
  ${indentString(component.query)}`);

              // Perhaps this isn't the best way to see if we're building?
              if (program._name === `build`) {
                process.exit(1);
              }
            }

            // Add the path/layout context onto the results.
            contextKey = `pathContext`;

            if (!pageOrLayout.path) {
              contextKey = `layoutContext`;
            }
            result[contextKey] = pageOrLayout.context;
            resultJSON = JSON.stringify(result);
            resultHash = md5(resultJSON);
            resultPath = joinPath(program.directory, `.cache`, `json`, pageOrLayout.jsonName);

            if (!(resultHashes[resultPath] !== resultHash)) {
              _context.next = 22;
              break;
            }

            resultHashes[resultPath] = resultHash;
            _context.next = 22;
            return fs.writeFile(resultPath, resultJSON);

          case 22:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, undefined);
  }));

  return function (_x, _x2) {
    return _ref.apply(this, arguments);
  };
}();
//# sourceMappingURL=query-runner.js.map