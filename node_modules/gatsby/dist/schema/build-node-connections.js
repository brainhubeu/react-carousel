"use strict";

var _extends2 = require("babel-runtime/helpers/extends");

var _extends3 = _interopRequireDefault(_extends2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _ = require(`lodash`);

var _require = require(`graphql-skip-limit`),
    connectionArgs = _require.connectionArgs,
    connectionDefinitions = _require.connectionDefinitions;

var _require2 = require(`graphql`),
    GraphQLInputObjectType = _require2.GraphQLInputObjectType;

var _require3 = require(`./infer-graphql-input-fields`),
    inferInputObjectStructureFromNodes = _require3.inferInputObjectStructureFromNodes;

var _require4 = require(`./infer-graphql-input-fields-from-fields`),
    inferInputObjectStructureFromFields = _require4.inferInputObjectStructureFromFields;

var createSortField = require(`./create-sort-field`);
var buildConnectionFields = require(`./build-connection-fields`);

var _require5 = require(`../redux`),
    getNodes = _require5.getNodes;

module.exports = function (types) {
  var connections = {};

  _.each(types, function (type /* , fieldName*/) {
    // Don't create a connection for the Site node since there can only be one
    // of them.
    if (type.name === `Site`) {
      return;
    }
    var nodes = type.nodes;
    var typeName = `${type.name}Connection`;

    var _connectionDefinition = connectionDefinitions({
      nodeType: type.nodeObjectType,
      connectionFields: function connectionFields() {
        return buildConnectionFields(type);
      }
    }),
        typeConnection = _connectionDefinition.connectionType;

    var inferredInputFieldsFromNodes = inferInputObjectStructureFromNodes({
      nodes,
      typeName
    });

    var inferredInputFieldsFromPlugins = inferInputObjectStructureFromFields({
      fields: type.fieldsFromPlugins,
      typeName
    });

    var filterFields = _.merge({}, inferredInputFieldsFromNodes.inferredFields, inferredInputFieldsFromPlugins.inferredFields);
    var sortNames = inferredInputFieldsFromNodes.sort.concat(inferredInputFieldsFromPlugins.sort);
    var sort = createSortField(typeName, sortNames);

    connections[_.camelCase(`all ${type.name}`)] = {
      type: typeConnection,
      description: `Connection to all ${type.name} nodes`,
      args: (0, _extends3.default)({}, connectionArgs, {
        sort,
        filter: {
          type: new GraphQLInputObjectType({
            name: _.camelCase(`filter ${type.name}`),
            description: `Filter connection on its fields`,
            fields: function fields() {
              return filterFields;
            }
          })
        }
      }),
      resolve(object, resolveArgs, b, _ref) {
        var rootValue = _ref.rootValue;

        var path = void 0;
        if (typeof rootValue !== `undefined`) {
          path = rootValue.path;
        }
        // If path isn't set, this is probably a layout
        if (!path && rootValue && rootValue.componentChunkName && _.includes(rootValue.componentChunkName, `layout`)) {
          path = `LAYOUT___${rootValue.id}`;
        }
        var runSift = require(`./run-sift`);
        var latestNodes = _.filter(getNodes(), function (n) {
          return n.internal.type === type.name;
        });
        return runSift({
          args: resolveArgs,
          nodes: latestNodes,
          connection: true,
          path,
          type: type.node.type
        });
      }
    };
  });

  return connections;
};
//# sourceMappingURL=build-node-connections.js.map