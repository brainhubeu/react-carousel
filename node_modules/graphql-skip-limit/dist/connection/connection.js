"use strict";

exports.__esModule = true;
exports.connectionArgs = undefined;

var _extends2 = require("babel-runtime/helpers/extends");

var _extends3 = _interopRequireDefault(_extends2);

exports.connectionDefinitions = connectionDefinitions;

var _graphql = require("graphql");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Returns a GraphQLFieldConfigArgumentMap appropriate to include on a field
 * whose return type is a connection type with backward pagination.
 */
var connectionArgs = exports.connectionArgs = {
  skip: {
    type: _graphql.GraphQLInt
  },
  limit: {
    type: _graphql.GraphQLInt
  }
};

/**
 * The common page info type used by all connections.
 */
var pageInfoType = new _graphql.GraphQLObjectType({
  name: `PageInfo`,
  description: `Information about pagination in a connection.`,
  fields: function fields() {
    return {
      hasNextPage: {
        type: new _graphql.GraphQLNonNull(_graphql.GraphQLBoolean),
        description: `When paginating, are there more items?`
      }
    };
  }
});

function resolveMaybeThunk(thingOrThunk) {
  return typeof thingOrThunk === `function` ? thingOrThunk() : thingOrThunk;
}

/**
 * Returns a GraphQLObjectType for a connection with the given name,
 * and whose nodes are of the specified type.
 */
function connectionDefinitions(config) {
  var nodeType = config.nodeType;

  var name = config.name || nodeType.name;
  var edgeFields = config.edgeFields || {};
  var connectionFields = config.connectionFields || {};
  var resolveNode = config.resolveNode;
  var edgeType = new _graphql.GraphQLObjectType({
    name: `${name}Edge`,
    description: `An edge in a connection.`,
    fields: function fields() {
      return (0, _extends3.default)({
        node: {
          type: nodeType,
          resolve: resolveNode,
          description: `The item at the end of the edge`
        },
        next: {
          type: nodeType,
          resolve: resolveNode,
          description: `The next edge in the connection`
        },
        previous: {
          type: nodeType,
          resolve: resolveNode,
          description: `The previous edge in the connection`
        }
      }, resolveMaybeThunk(edgeFields));
    }
  });

  var connectionType = new _graphql.GraphQLObjectType({
    name: `${name}Connection`,
    description: `A connection to a list of items.`,
    fields: function fields() {
      return (0, _extends3.default)({
        pageInfo: {
          type: new _graphql.GraphQLNonNull(pageInfoType),
          description: `Information to aid in pagination.`
        },
        edges: {
          type: new _graphql.GraphQLList(edgeType),
          description: `A list of edges.`
        }
      }, resolveMaybeThunk(connectionFields));
    }
  });

  return { edgeType, connectionType };
}