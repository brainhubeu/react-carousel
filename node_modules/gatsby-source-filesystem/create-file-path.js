"use strict";

var path = require(`path`);
var slash = require(`slash`);

function findFileNode(_ref) {
  var node = _ref.node,
      getNode = _ref.getNode;

  // Find the file node.
  var fileNode = node;

  var whileCount = 0;
  while (fileNode.internal.type !== `File` && fileNode.parent && getNode(fileNode.parent) !== undefined && whileCount < 101) {
    fileNode = getNode(fileNode.parent);

    whileCount += 1;
    if (whileCount > 100) {
      console.log(`It looks like you have a node that's set its parent as itself`, fileNode);
    }
  }

  return fileNode;
}

module.exports = function (_ref2) {
  var node = _ref2.node,
      getNode = _ref2.getNode,
      _ref2$basePath = _ref2.basePath,
      basePath = _ref2$basePath === undefined ? `src/pages` : _ref2$basePath,
      _ref2$trailingSlash = _ref2.trailingSlash,
      trailingSlash = _ref2$trailingSlash === undefined ? true : _ref2$trailingSlash;

  // Find the File node
  var fileNode = findFileNode({ node, getNode });
  if (!fileNode) return undefined;

  var relativePath = path.posix.relative(slash(basePath), slash(fileNode.relativePath));

  var _path$parse = path.parse(relativePath),
      _path$parse$dir = _path$parse.dir,
      dir = _path$parse$dir === undefined ? `` : _path$parse$dir,
      name = _path$parse.name;

  var parsedName = name === `index` ? `` : name;

  return path.posix.join(`/`, dir, parsedName, trailingSlash ? `/` : ``);
};