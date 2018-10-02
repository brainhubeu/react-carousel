"use strict";

var _regenerator = require("babel-runtime/regenerator");

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = require("babel-runtime/helpers/asyncToGenerator");

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var path = require(`path`);
var fs = require(`fs-extra`);
var chokidar = require(`chokidar`);

exports.createPagesStatefully = function () {
  var _ref2 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee(_ref, options, done) {
    var store = _ref.store,
        boundActionCreators = _ref.boundActionCreators;

    var _store$getState, program, createPage, source, destination, copy;

    return _regenerator2.default.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            if (!(process.env.NODE_ENV !== `production`)) {
              _context.next = 12;
              break;
            }

            _store$getState = store.getState(), program = _store$getState.program;
            createPage = boundActionCreators.createPage;
            source = path.join(__dirname, `./raw_dev-404-page.js`);
            destination = path.join(program.directory, `.cache`, `dev-404-page.js`);

            copy = function copy() {
              return fs.copy(source, destination);
            };

            _context.next = 8;
            return copy();

          case 8:
            createPage({
              component: destination,
              path: `/dev-404-page/`
            });
            chokidar.watch(source).on(`change`, function () {
              return copy();
            }).on(`ready`, function () {
              return done();
            });
            _context.next = 13;
            break;

          case 12:
            done();

          case 13:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, undefined);
  }));

  return function (_x, _x2, _x3) {
    return _ref2.apply(this, arguments);
  };
}();
//# sourceMappingURL=gatsby-node.js.map