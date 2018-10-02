"use strict";

var _regenerator = require("babel-runtime/regenerator");

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = require("babel-runtime/helpers/asyncToGenerator");

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var levenshtein = require(`fast-levenshtein`);
var fs = require(`fs-extra`);
var testRequireError = require(`../utils/test-require-error`);
var report = require(`gatsby-cli/lib/reporter`);
var chalk = require(`chalk`);
var path = require(`path`);

function isNearMatch(fileName, configName, distance) {
  return levenshtein.get(fileName, configName) <= distance;
}

module.exports = function () {
  var _ref = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee(rootDir, configName) {
    var distance = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 3;
    var configPath, configModule, nearMatch;
    return _regenerator2.default.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            configPath = path.join(rootDir, configName);
            configModule = void 0;
            _context.prev = 2;

            configModule = require(configPath);
            _context.next = 12;
            break;

          case 6:
            _context.prev = 6;
            _context.t0 = _context["catch"](2);
            _context.next = 10;
            return fs.readdir(rootDir).then(function (files) {
              return files.find(function (file) {
                var fileName = file.split(rootDir).pop();
                return isNearMatch(fileName, configName, distance);
              });
            });

          case 10:
            nearMatch = _context.sent;

            if (!testRequireError(configPath, _context.t0)) {
              report.error(`We encountered an error while trying to load your site's ${configName}. Please fix the error and try again.`, _context.t0);
              process.exit(1);
            } else if (nearMatch) {
              console.log(``);
              report.error(`It looks like you were trying to add the config file? Please rename "${chalk.bold(nearMatch)}" to "${chalk.bold(configName)}"`);
              console.log(``);
              process.exit(1);
            } else if (fs.existsSync(path.join(rootDir, `src`, configName))) {
              console.log(``);
              report.error(`Your ${configName} file is in the wrong place. You've placed it in the src/ directory. It must instead be at the root of your site next to your package.json file.`);
              console.log(``);
              process.exit(1);
            }

          case 12:
            return _context.abrupt("return", configModule);

          case 13:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, this, [[2, 6]]);
  }));

  function getConfigFile(_x2, _x3) {
    return _ref.apply(this, arguments);
  }

  return getConfigFile;
}();
//# sourceMappingURL=get-config-file.js.map