"use strict";

var _regenerator = require("babel-runtime/regenerator");

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = require("babel-runtime/helpers/asyncToGenerator");

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var report = require(`gatsby-cli/lib/reporter`);
var buildCSS = require(`./build-css`);
var buildHTML = require(`./build-html`);
var buildProductionBundle = require(`./build-javascript`);
var bootstrap = require(`../bootstrap`);
var apiRunnerNode = require(`../utils/api-runner-node`);
var copyStaticDirectory = require(`../utils/copy-static-directory`);

function reportFailure(msg, err) {
  report.log(``);
  report.panic(msg, err);
}

module.exports = function () {
  var _ref = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee(program) {
    var _ref2, graphqlRunner, activity;

    return _regenerator2.default.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.next = 2;
            return bootstrap(program);

          case 2:
            _ref2 = _context.sent;
            graphqlRunner = _ref2.graphqlRunner;
            _context.next = 6;
            return apiRunnerNode(`onPreBuild`, { graphql: graphqlRunner });

          case 6:

            // Copy files from the static directory to
            // an equivalent static directory within public.
            copyStaticDirectory();

            activity = void 0;

            activity = report.activityTimer(`Building CSS`);
            activity.start();
            _context.next = 12;
            return buildCSS(program).catch(function (err) {
              reportFailure(`Generating CSS failed`, err);
            });

          case 12:
            activity.end();

            activity = report.activityTimer(`Building production JavaScript bundles`);
            activity.start();
            _context.next = 17;
            return buildProductionBundle(program).catch(function (err) {
              reportFailure(`Generating JavaScript bundles failed`, err);
            });

          case 17:
            activity.end();

            activity = report.activityTimer(`Building static HTML for pages`);
            activity.start();
            _context.next = 22;
            return buildHTML(program).catch(function (err) {
              reportFailure(report.stripIndent`
        Building static HTML for pages failed

        See our docs page on debugging HTML builds for help https://goo.gl/yL9lND
      `, err);
            });

          case 22:
            activity.end();

            _context.next = 25;
            return apiRunnerNode(`onPostBuild`, { graphql: graphqlRunner });

          case 25:

            report.info(`Done building in ${process.uptime()} sec`);

          case 26:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, this);
  }));

  function build(_x) {
    return _ref.apply(this, arguments);
  }

  return build;
}();
//# sourceMappingURL=build.js.map