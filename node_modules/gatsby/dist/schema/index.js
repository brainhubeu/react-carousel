"use strict";

var _regenerator = require("babel-runtime/regenerator");

var _regenerator2 = _interopRequireDefault(_regenerator);

var _extends2 = require("babel-runtime/helpers/extends");

var _extends3 = _interopRequireDefault(_extends2);

var _asyncToGenerator2 = require("babel-runtime/helpers/asyncToGenerator");

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _ = require(`lodash`);

var _require = require(`graphql`),
    GraphQLSchema = _require.GraphQLSchema,
    GraphQLObjectType = _require.GraphQLObjectType;

var buildNodeTypes = require(`./build-node-types`);
var buildNodeConnections = require(`./build-node-connections`);

var _require2 = require(`../redux`),
    store = _require2.store;

var invariant = require(`invariant`);

module.exports = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee() {
  var typesGQL, connections, nodes, schema;
  return _regenerator2.default.wrap(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.next = 2;
          return buildNodeTypes();

        case 2:
          typesGQL = _context.sent;
          connections = buildNodeConnections(_.values(typesGQL));

          // Pull off just the graphql node from each type object.

          nodes = _.mapValues(typesGQL, `node`);


          invariant(!_.isEmpty(nodes), `There are no available GQL nodes`);
          invariant(!_.isEmpty(connections), `There are no available GQL connections`);

          schema = new GraphQLSchema({
            query: new GraphQLObjectType({
              name: `RootQueryType`,
              fields: (0, _extends3.default)({}, connections, nodes)
            })
          });


          store.dispatch({
            type: `SET_SCHEMA`,
            payload: schema
          });

        case 9:
        case "end":
          return _context.stop();
      }
    }
  }, _callee, undefined);
}));
//# sourceMappingURL=index.js.map