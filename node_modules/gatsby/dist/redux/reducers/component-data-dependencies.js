"use strict";

var _ = require(`lodash`);

module.exports = function () {
  var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : { nodes: {}, connections: {} };
  var action = arguments[1];

  switch (action.type) {
    case `DELETE_CACHE`:
      return { nodes: {}, connections: {} };
    case `CREATE_COMPONENT_DEPENDENCY`:
      if (action.payload.path === ``) {
        return state;
      }

      // If this nodeId not set yet.
      if (action.payload.nodeId) {
        var existingPaths = [];
        if (state.nodes[action.payload.nodeId]) {
          existingPaths = state.nodes[action.payload.nodeId];
        }
        var newPaths = _.uniq(existingPaths.concat(action.payload.path || action.payload.id));
        state.nodes[action.payload.nodeId] = newPaths;
      }

      // If this connection not set yet.
      if (action.payload.connection) {
        var _existingPaths = [];
        if (state.connections[action.payload.connection]) {
          _existingPaths = state.connections[action.payload.connection];
        }
        var _newPaths = _.uniq(_existingPaths.concat(action.payload.path || action.payload.id));
        state.connections[action.payload.connection] = _newPaths;
      }

      return state;
    case `DELETE_COMPONENTS_DEPENDENCIES`:
      state.nodes = _.mapValues(state.nodes, function (paths) {
        return _.difference(paths, action.payload.paths);
      });
      state.connections = _.mapValues(state.connections, function (paths) {
        return _.difference(paths, action.payload.paths);
      });

      return state;
    // Don't delete data dependencies as we're now deleting transformed nodes
    // when their parent is changed. WIth the code below as stands, this
    // would delete the connection between the page and the transformed
    // node which will be recreated after its deleted meaning the query
    // won't be re-run.
    // case `DELETE_NODE`:
    // delete state.nodes[action.payload]
    // return state
    // case `DELETE_NODES`:
    // action.payload.forEach(n => delete state.nodes[n])
    // return state
    default:
      return state;
  }
};
//# sourceMappingURL=component-data-dependencies.js.map