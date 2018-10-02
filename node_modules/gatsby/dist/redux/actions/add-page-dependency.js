"use strict";

var _ = require(`lodash`);

var _require = require(`../`),
    store = _require.store;

var _require2 = require(`../actions.js`),
    actions = _require2.actions;

exports.createPageDependency = function (_ref) {
  var path = _ref.path,
      nodeId = _ref.nodeId,
      connection = _ref.connection;

  var state = store.getState();

  // Check that the dependencies aren't already recorded so we
  // can avoid creating lots of very noisy actions.
  var nodeDependencyExists = false;
  var connectionDependencyExists = false;
  if (!nodeId) {
    nodeDependencyExists = true;
  }
  if (nodeId && _.includes(state.componentDataDependencies.nodes[nodeId], path)) {
    nodeDependencyExists = true;
  }
  if (!connection) {
    connectionDependencyExists = true;
  }
  if (connection && _.includes(state.componentDataDependencies.connections, connection)) {
    connectionDependencyExists = true;
  }
  if (nodeDependencyExists && connectionDependencyExists) {
    return;
  }

  // It's new, let's dispatch it
  var action = actions.createPageDependency({ path, nodeId, connection });
  store.dispatch(action);
};
//# sourceMappingURL=add-page-dependency.js.map