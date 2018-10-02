"use strict";

var _extends2 = require("babel-runtime/helpers/extends");

var _extends3 = _interopRequireDefault(_extends2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var sift = require(`sift`);
var _ = require(`lodash`);

var _require = require(`graphql-skip-limit`),
    connectionFromArray = _require.connectionFromArray;

var _require2 = require(`../redux/actions/add-page-dependency`),
    createPageDependency = _require2.createPageDependency;

var prepareRegex = require(`./prepare-regex`);
var Promise = require(`bluebird`);

var _require3 = require(`./node-tracking`),
    trackInlineObjectsInRootNode = _require3.trackInlineObjectsInRootNode;

var enhancedNodeCache = new Map();
var enhancedNodeCacheId = function enhancedNodeCacheId(_ref) {
  var node = _ref.node,
      args = _ref.args;
  return node && node.internal && node.internal.contentDigest ? `${node.id}${node.internal.contentDigest}${JSON.stringify(args)}` : null;
};

function awaitSiftField(fields, node, k) {
  var field = fields[k];
  if (field.resolve) {
    return field.resolve(node, {}, {}, { fieldName: k });
  } else if (node[k] !== undefined) {
    return node[k];
  }

  return undefined;
}

/*
* Filters a list of nodes using mongodb-like syntax.
* Returns a single unwrapped element if connection = false.
*
*/
module.exports = function (_ref2) {
  var args = _ref2.args,
      nodes = _ref2.nodes,
      type = _ref2.type,
      _ref2$connection = _ref2.connection,
      connection = _ref2$connection === undefined ? false : _ref2$connection,
      _ref2$path = _ref2.path,
      path = _ref2$path === undefined ? `` : _ref2$path;

  // Clone args as for some reason graphql-js removes the constructor
  // from nested objects which breaks a check in sift.js.
  var clonedArgs = JSON.parse(JSON.stringify(args));

  var siftifyArgs = function siftifyArgs(object) {
    var newObject = {};
    _.each(object, function (v, k) {
      if (_.isObject(v) && !_.isArray(v)) {
        newObject[k] = siftifyArgs(v);
      } else {
        // Compile regex first.
        if (k === `regex`) {
          newObject[`$regex`] = prepareRegex(v);
        } else if (k === `glob`) {
          var Minimatch = require(`minimatch`).Minimatch;
          var mm = new Minimatch(v);
          newObject[`$regex`] = mm.makeRe();
        } else {
          newObject[`$${k}`] = v;
        }
      }
    });
    return newObject;
  };

  // Build an object that excludes the innermost leafs,
  // this avoids including { eq: x } when resolving fields.
  function extractFieldsToSift(prekey, key, preobj, obj, val) {
    if (_.isObject(val) && !_.isArray(val)) {
      _.forEach(val, function (v, k) {
        preobj[prekey] = obj;
        extractFieldsToSift(key, k, obj, {}, v);
      });
    } else {
      preobj[prekey] = true;
    }
  }

  var siftArgs = [];
  var fieldsToSift = {};
  if (clonedArgs.filter) {
    _.each(clonedArgs.filter, function (v, k) {
      // Ignore connection and sorting args.
      if (_.includes([`skip`, `limit`, `sort`], k)) return;

      siftArgs.push(siftifyArgs({ [k]: v }));
      extractFieldsToSift(``, k, {}, fieldsToSift, v);
    });
  }

  // Resolves every field used in the node.
  function resolveRecursive(node, siftFieldsObj, gqFields) {
    return Promise.all(_.keys(siftFieldsObj).map(function (k) {
      return Promise.resolve(awaitSiftField(gqFields, node, k)).then(function (v) {
        var innerSift = siftFieldsObj[k];
        var innerGqConfig = gqFields[k];
        if (_.isObject(innerSift) && v != null && innerGqConfig && innerGqConfig.type && _.isFunction(innerGqConfig.type.getFields)) {
          return resolveRecursive(v, innerSift, innerGqConfig.type.getFields());
        } else {
          return v;
        }
      }).then(function (v) {
        return [k, v];
      });
    })).then(function (resolvedFields) {
      var myNode = (0, _extends3.default)({}, node);
      resolvedFields.forEach(function (_ref3) {
        var k = _ref3[0],
            v = _ref3[1];
        return myNode[k] = v;
      });
      return myNode;
    });
  }

  return Promise.all(nodes.map(function (node) {
    var cacheKey = enhancedNodeCacheId({ node, args: fieldsToSift });
    if (cacheKey && enhancedNodeCache.has(cacheKey)) {
      return Promise.resolve(enhancedNodeCache.get(cacheKey));
    }

    return resolveRecursive(node, fieldsToSift, type.getFields()).then(function (resolvedNode) {
      trackInlineObjectsInRootNode(resolvedNode);
      if (cacheKey) {
        enhancedNodeCache.set(cacheKey, resolvedNode);
      }
      return resolvedNode;
    });
  })).then(function (myNodes) {
    if (!connection) {
      var index = _.isEmpty(siftArgs) ? 0 : sift.indexOf({ $and: siftArgs }, myNodes);

      // If a node is found, create a dependency between the resulting node and
      // the path.
      if (index !== -1) {
        createPageDependency({
          path,
          nodeId: myNodes[index].id
        });

        return myNodes[index];
      } else {
        return null;
      }
    }

    var result = _.isEmpty(siftArgs) ? myNodes : sift({ $and: siftArgs }, myNodes);

    if (!result || !result.length) return null;

    // Sort results.
    if (clonedArgs.sort) {
      // create functions that return the item to compare on
      // uses _.get so nested fields can be retrieved
      var convertedFields = clonedArgs.sort.fields.map(function (field) {
        return field.replace(/___/g, `.`);
      }).map(function (field) {
        return function (v) {
          return _.get(v, field);
        };
      });

      result = _.orderBy(result, convertedFields, clonedArgs.sort.order);
    }

    var connectionArray = connectionFromArray(result, args);
    connectionArray.totalCount = result.length;
    if (result.length > 0 && result[0].internal) {
      createPageDependency({
        path,
        connection: result[0].internal.type
      });
    }
    return connectionArray;
  });
};
//# sourceMappingURL=run-sift.js.map