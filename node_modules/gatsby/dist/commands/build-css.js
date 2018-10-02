"use strict";

var _regenerator = require("babel-runtime/regenerator");

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = require("babel-runtime/helpers/asyncToGenerator");

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var webpack = require(`webpack`);
var fs = require(`fs-extra`);
var webpackConfig = require(`../utils/webpack.config`);

module.exports = function () {
  var _ref = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee(program) {
    var directory, compilerConfig;
    return _regenerator2.default.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            directory = program.directory;
            _context.next = 3;
            return webpackConfig(program, directory, `build-css`);

          case 3:
            compilerConfig = _context.sent;
            return _context.abrupt("return", new Promise(function (resolve, reject) {
              webpack(compilerConfig.resolve()).run(function (err) {
                if (err) {
                  reject(err);
                }

                // We don't want any javascript produced by this step in the process.
                try {
                  fs.unlinkSync(`${directory}/public/bundle-for-css.js`);
                } catch (e) {}
                // ignore.


                // Ensure there's a styles.css file in public so tools that expect it
                // can find it.
                fs.ensureFile(`${directory}/public/styles.css`, function (err) {
                  resolve(err);
                });
              });
            }));

          case 5:
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
//# sourceMappingURL=build-css.js.map