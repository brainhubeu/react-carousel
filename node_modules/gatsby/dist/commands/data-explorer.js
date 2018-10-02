"use strict";

var _regenerator = require("babel-runtime/regenerator");

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = require("babel-runtime/helpers/asyncToGenerator");

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var express = require(`express`);
var graphqlHTTP = require(`express-graphql`);

var _require = require(`../redux`),
    store = _require.store;

var bootstrap = require(`../bootstrap`);

module.exports = function () {
  var _ref = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee(program) {
    var port, host, schema, app;
    return _regenerator2.default.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            port = program.port, host = program.host;

            port = typeof port === `string` ? parseInt(port, 10) : port;

            // bootstrap to ensure schema is in the store
            _context.next = 4;
            return bootstrap(program);

          case 4:
            schema = store.getState().schema;
            app = express();

            app.use(`/`, graphqlHTTP({
              schema,
              graphiql: true
            }));

            console.log(`Gatsby data explorer running at`, `http://${host}:${port}`);
            app.listen(port, host);

          case 9:
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
//# sourceMappingURL=data-explorer.js.map