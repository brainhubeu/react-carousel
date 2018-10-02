"use strict";

var _regenerator = require("babel-runtime/regenerator");

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = require("babel-runtime/helpers/asyncToGenerator");

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var fs = require(`fs`);
var webpack = require(`webpack`);

var _require = require(`gatsby-cli/lib/reporter/errors`),
    createErrorFromString = _require.createErrorFromString;

var debug = require(`debug`)(`gatsby:html`);
var webpackConfig = require(`../utils/webpack.config`);

module.exports = function () {
  var _ref = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee(program) {
    var directory, compilerConfig;
    return _regenerator2.default.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            directory = program.directory;


            debug(`generating static HTML`);

            // Static site generation.
            _context.next = 4;
            return webpackConfig(program, directory, `develop-html`, null, [`/`]);

          case 4:
            compilerConfig = _context.sent;
            return _context.abrupt("return", new Promise(function (resolve, reject) {
              webpack(compilerConfig.resolve()).run(function (e, stats) {
                if (e) {
                  return reject(e);
                }
                var outputFile = `${directory}/public/render-page.js`;
                if (stats.hasErrors()) {
                  var webpackErrors = stats.toJson().errors;
                  return reject(createErrorFromString(webpackErrors[0], `${outputFile}.map`));
                }

                // Remove the temp JS bundle file built for the static-site-generator-plugin
                try {
                  fs.unlinkSync(outputFile);
                } catch (e) {
                  // This function will fail on Windows with no further consequences.
                }

                return resolve(null, stats);
              });
            }));

          case 6:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, undefined);
  }));

  return function (_x) {
    return _ref.apply(this, arguments);
  };
}();
//# sourceMappingURL=develop-html.js.map