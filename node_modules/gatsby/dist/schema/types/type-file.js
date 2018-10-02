"use strict";

exports.__esModule = true;
exports.setFileNodeRootType = setFileNodeRootType;
exports.shouldInfer = shouldInfer;
exports.getType = getType;
exports.getListType = getListType;

var _require = require(`graphql`),
    GraphQLList = _require.GraphQLList;

var _ = require(`lodash`);
var mime = require(`mime`);
var isRelative = require(`is-relative`);
var isRelativeUrl = require(`is-relative-url`);
var normalize = require(`normalize-path`);
var systemPath = require(`path`);

var _require2 = require(`../../redux`),
    getNodes = _require2.getNodes;

var _require3 = require(`../node-tracking`),
    findRootNodeAncestor = _require3.findRootNodeAncestor;

var _require4 = require(`../../redux/actions/add-page-dependency`),
    createPageDependency = _require4.createPageDependency;

var _require5 = require(`../../utils/path`),
    joinPath = _require5.joinPath;

var type = void 0,
    listType = void 0;

function setFileNodeRootType(fileNodeRootType) {
  if (fileNodeRootType) {
    type = createType(fileNodeRootType, false);
    listType = createType(fileNodeRootType, true);
  } else {
    type = null;
    listType = null;
  }
}

function pointsToFile(nodes, key, value) {
  var looksLikeFile = _.isString(value) && mime.lookup(value) !== `application/octet-stream` &&
  // domains ending with .com
  mime.lookup(value) !== `application/x-msdownload` && isRelative(value) && isRelativeUrl(value);

  if (!looksLikeFile) {
    return false;
  }

  // Find the node used for this example.
  var node = nodes.find(function (n) {
    return _.get(n, key) === value;
  });

  if (!node) {
    // Try another search as our "key" isn't always correct e.g.
    // it doesn't support arrays so the right key could be "a.b[0].c" but
    // this function will get "a.b.c".
    //
    // We loop through every value of nodes until we find
    // a match.
    var visit = function visit(current) {
      var selector = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];
      var fn = arguments[2];

      for (var i = 0, keys = Object.keys(current); i < keys.length; i++) {
        var _key = keys[i];
        var _value = current[_key];

        if (_value === undefined || _value === null) continue;

        if (typeof _value === `object` || typeof _value === `function`) {
          visit(current[_key], selector.concat([_key]), fn);
          continue;
        }

        var proceed = fn(current[_key], _key, selector, current);

        if (proceed === false) {
          break;
        }
      }
    };

    var isNormalInteger = function isNormalInteger(str) {
      return (/^\+?(0|[1-9]\d*)$/.test(str)
      );
    };

    node = nodes.find(function (n) {
      var isMatch = false;
      visit(n, [], function (v, k, selector, parent) {
        if (v === value) {
          // Remove integers as they're for arrays, which our passed
          // in object path doesn't have.
          var normalizedSelector = selector.map(function (s) {
            return isNormalInteger(s) ? `` : s;
          }).filter(function (s) {
            return s !== ``;
          });
          var fullSelector = `${normalizedSelector.join(`.`)}.${k}`;
          if (fullSelector === key) {
            isMatch = true;
            return false;
          }
        }

        // Not a match so we continue
        return true;
      });

      return isMatch;
    });

    // Still no node.
    if (!node) {
      return false;
    }
  }

  var rootNode = findRootNodeAncestor(node);

  // Only nodes transformed (ultimately) from a File
  // can link to another File.
  if (rootNode.internal.type !== `File`) {
    return false;
  }

  var pathToOtherNode = normalize(joinPath(rootNode.dir, value));
  var otherFileExists = getNodes().some(function (n) {
    return n.absolutePath === pathToOtherNode;
  });
  return otherFileExists;
}

function shouldInfer(nodes, selector, value) {
  return nodes[0].internal.type !== `File` && (_.isString(value) && !_.isEmpty(value) && pointsToFile(nodes, selector, value) || _.isArray(value) && _.isString(value[0]) && !_.isEmpty(value[0]) && pointsToFile(nodes, `${selector}[0]`, value[0]));
}

function createType(fileNodeRootType, isArray) {
  if (!fileNodeRootType) return null;

  return Object.freeze({
    type: isArray ? new GraphQLList(fileNodeRootType) : fileNodeRootType,
    resolve: function resolve(node, args, _ref, _ref2) {
      var path = _ref.path;
      var fieldName = _ref2.fieldName;

      var fieldValue = node[fieldName];

      if (!fieldValue) {
        return null;
      }

      var findLinkedFileNode = function findLinkedFileNode(relativePath) {
        // Use the parent File node to create the absolute path to
        // the linked file.
        var fileLinkPath = normalize(systemPath.resolve(parentFileNode.dir, relativePath));

        // Use that path to find the linked File node.
        var linkedFileNode = _.find(getNodes(), function (n) {
          return n.internal.type === `File` && n.absolutePath === fileLinkPath;
        });
        if (linkedFileNode) {
          createPageDependency({
            path,
            nodeId: linkedFileNode.id
          });
          return linkedFileNode;
        } else {
          return null;
        }
      };

      // Find the File node for this node (we assume the node is something
      // like markdown which would be a child node of a File node).
      var parentFileNode = findRootNodeAncestor(node);

      // Find the linked File node(s)
      if (isArray) {
        return fieldValue.map(function (relativePath) {
          return findLinkedFileNode(relativePath);
        });
      } else {
        return findLinkedFileNode(fieldValue);
      }
    }
  });
}

function getType() {
  return type;
}

function getListType() {
  return listType;
}
//# sourceMappingURL=type-file.js.map