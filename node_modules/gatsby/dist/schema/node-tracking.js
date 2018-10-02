"use strict";

var _ = require(`lodash`);

var _require = require(`../redux`),
    getNode = _require.getNode,
    getNodes = _require.getNodes;

/**
 * Map containing links between inline objects or arrays
 * and Node that contains them
 * @type {Object.<(Object|Array),string>}
 */


var rootNodeMap = new WeakMap();

var getRootNodeId = function getRootNodeId(node) {
  return rootNodeMap.get(node);
};

/**
 * Add link between passed data and Node. This function shouldn't be used
 * directly. Use higher level `trackInlineObjectsInRootNode`
 * @see trackInlineObjectsInRootNode
 * @param {(Object|Array)} data Inline object or array
 * @param {string} nodeId Id of node that contains data passed in first parameter
 */
var addRootNodeToInlineObject = function addRootNodeToInlineObject(data, nodeId) {
  if (_.isPlainObject(data) || _.isArray(data)) {
    _.each(data, function (o) {
      return addRootNodeToInlineObject(o, nodeId);
    });
    rootNodeMap.set(data, nodeId);
  }
};

/**
 * Adds link between inline objects/arrays contained in Node object
 * and that Node object.
 * @param {Node} node Root Node
 */
// const nodeDigestTracked = new Set()
var trackInlineObjectsInRootNode = function trackInlineObjectsInRootNode(node) {
  // const id =
  // node && node.internal && node.internal.contentDigest
  // ? node.internal.contentDigest
  // : node.id
  // if (nodeDigestTracked.has(id)) {
  // return node
  // }

  _.each(node, function (v, k) {
    // Ignore the node internal object.
    if (k === `internal`) {
      return;
    }
    addRootNodeToInlineObject(v, node.id);
  });

  // nodeDigestTracked.add(id)
  return node;
};
exports.trackInlineObjectsInRootNode = trackInlineObjectsInRootNode;

/**
 * Finds top most ancestor of node that contains passed Object or Array
 * @param {(Object|Array)} obj Object/Array belonging to Node object or Node object
 * @param {nodePredicate} [predicate] Optional callback to check if ancestor meets defined conditions
 * @returns {Node} Top most ancestor if predicate is not specified
 * or first node that meet predicate conditions if predicate is specified
 */
var findRootNodeAncestor = function findRootNodeAncestor(obj) {
  var predicate = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;

  // Find the root node.
  var rootNode = obj;
  var whileCount = 0;
  var rootNodeId = void 0;
  while ((!predicate || !predicate(rootNode)) && (rootNodeId = getRootNodeId(rootNode) || rootNode.parent) && (getNode(rootNode.parent) !== undefined || getNode(rootNodeId)) && whileCount < 101) {
    if (rootNodeId) {
      rootNode = getNode(rootNodeId);
    } else {
      rootNode = getNode(rootNode.parent);
    }
    whileCount += 1;
    if (whileCount > 100) {
      console.log(`It looks like you have a node that's set its parent as itself`, rootNode);
    }
  }

  return !predicate || predicate(rootNode) ? rootNode : null;
};

/**
 * @callback nodePredicate
 * @param {Node} node Node that is examined
 */

exports.findRootNodeAncestor = findRootNodeAncestor;

// Track nodes that are already in store
_.each(getNodes(), function (node) {
  trackInlineObjectsInRootNode(node);
});
//# sourceMappingURL=node-tracking.js.map