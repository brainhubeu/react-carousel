"use strict";

exports.__esModule = true;
exports.nodeInterface = undefined;

var _graphql = require("graphql");

var nodeInterface = exports.nodeInterface = new _graphql.GraphQLInterfaceType({
  name: `Node`,
  description: `An object with an id, parent, and children`,
  fields: function fields() {
    return {
      id: {
        type: new _graphql.GraphQLNonNull(_graphql.GraphQLID),
        description: `The id of the node.`
      },
      parent: {
        type: nodeInterface,
        description: `The parent of this node.`
      },
      children: {
        type: new _graphql.GraphQLList(nodeInterface),
        description: `The children of this node.`
      }
    };
  }
});
//# sourceMappingURL=node-interface.js.map