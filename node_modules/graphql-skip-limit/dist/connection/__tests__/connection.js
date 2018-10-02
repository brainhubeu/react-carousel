"use strict";

var _graphql = require("graphql");

var _arrayconnection = require("../arrayconnection.js");

var _connection = require("../connection.js");

const allUsers = [{ name: `Dan`, friends: [1, 2, 3, 4] }, { name: `Nick`, friends: [0, 2, 3, 4] }, { name: `Lee`, friends: [0, 1, 3, 4] }, { name: `Joe`, friends: [0, 1, 2, 4] }, { name: `Tim`, friends: [0, 1, 2, 3] }];

const userType = new _graphql.GraphQLObjectType({
  name: `User`,
  fields: () => {
    return {
      name: {
        type: _graphql.GraphQLString
      },
      friends: {
        type: friendConnection,
        args: _connection.connectionArgs,
        resolve: (user, args) => (0, _arrayconnection.connectionFromArray)(user.friends, args)
      }
    };
  }
});

const { connectionType: friendConnection } = (0, _connection.connectionDefinitions)({
  name: `Friend`,
  nodeType: userType,
  resolveNode: edge => allUsers[edge.node],
  edgeFields: () => {
    return {
      friendshipTime: {
        type: _graphql.GraphQLString,
        resolve: () => `Yesterday`
      }
    };
  },
  connectionFields: () => {
    return {
      totalCount: {
        type: _graphql.GraphQLInt,
        resolve: () => allUsers.length - 1
      }
    };
  }
});

const queryType = new _graphql.GraphQLObjectType({
  name: `Query`,
  fields: () => {
    return {
      user: {
        type: userType,
        resolve: () => allUsers[0]
      }
    };
  }
});

const schema = new _graphql.GraphQLSchema({
  query: queryType
});

describe(`connectionDefinition()`, () => {
  it(`includes connection and edge fields`, async () => {
    const query = `
      query FriendsQuery {
        user {
          friends(limit: 2) {
            totalCount
            edges {
              friendshipTime
              node {
                name
              }
            }
          }
        }
      }
    `;
    const expected = {
      user: {
        friends: {
          totalCount: 4,
          edges: [{
            friendshipTime: `Yesterday`,
            node: {
              name: `Nick`
            }
          }, {
            friendshipTime: `Yesterday`,
            node: {
              name: `Lee`
            }
          }]
        }
      }
    };
    const result = await (0, _graphql.graphql)(schema, query);
    expect(result).toEqual({ data: expected });
  });
});