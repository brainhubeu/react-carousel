"use strict";

var _regenerator = require("babel-runtime/regenerator");

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = require("babel-runtime/helpers/asyncToGenerator");

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var getDevelopmentCertificate = require(`devcert-san`).default;
var report = require(`gatsby-cli/lib/reporter`);
var fs = require(`fs`);
var path = require(`path`);

module.exports = function () {
  var _ref2 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee(_ref) {
    var name = _ref.name,
        certFile = _ref.certFile,
        keyFile = _ref.keyFile,
        directory = _ref.directory;
    var keyPath, certPath;
    return _regenerator2.default.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            // check that cert file and key file are both true or both false, if they are both
            // false, it defaults to the automatic ssl
            if (certFile ? !keyFile : keyFile) {
              report.panic(`for custom ssl --https, --cert-file, and --key-file must be used together`);
            }

            if (!(certFile && keyFile)) {
              _context.next = 7;
              break;
            }

            keyPath = path.join(directory, keyFile);
            certPath = path.join(directory, certFile);
            _context.next = 6;
            return {
              keyPath,
              certPath,
              key: fs.readFileSync(keyPath),
              cert: fs.readFileSync(certPath)
            };

          case 6:
            return _context.abrupt("return", _context.sent);

          case 7:

            report.info(`setting up automatic SSL certificate (may require sudo)\n`);
            _context.prev = 8;
            _context.next = 11;
            return getDevelopmentCertificate(name, {
              installCertutil: true
            });

          case 11:
            return _context.abrupt("return", _context.sent);

          case 14:
            _context.prev = 14;
            _context.t0 = _context["catch"](8);

            report.panic(`\nFailed to generate dev SSL certificate`, _context.t0);

          case 17:
            return _context.abrupt("return", false);

          case 18:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, undefined, [[8, 14]]);
  }));

  return function (_x) {
    return _ref2.apply(this, arguments);
  };
}();
//# sourceMappingURL=get-ssl-cert.js.map