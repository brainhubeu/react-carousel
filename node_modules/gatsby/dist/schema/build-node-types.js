"use strict";

var _regenerator = require("babel-runtime/regenerator");

var _regenerator2 = _interopRequireDefault(_regenerator);

var _extends2 = require("babel-runtime/helpers/extends");

var _extends3 = _interopRequireDefault(_extends2);

var _asyncToGenerator2 = require("babel-runtime/helpers/asyncToGenerator");

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _ = require(`lodash`);

var _require = require(`graphql`),
    GraphQLObjectType = _require.GraphQLObjectType,
    GraphQLNonNull = _require.GraphQLNonNull,
    GraphQLID = _require.GraphQLID,
    GraphQLList = _require.GraphQLList;

var apiRunner = require(`../utils/api-runner-node`);

var _require2 = require(`./infer-graphql-type`),
    inferObjectStructureFromNodes = _require2.inferObjectStructureFromNodes;

var _require3 = require(`./infer-graphql-input-fields-from-fields`),
    inferInputObjectStructureFromFields = _require3.inferInputObjectStructureFromFields;

var _require4 = require(`./infer-graphql-input-fields`),
    inferInputObjectStructureFromNodes = _require4.inferInputObjectStructureFromNodes;

var _require5 = require(`./node-interface`),
    nodeInterface = _require5.nodeInterface;

var _require6 = require(`../redux`),
    getNodes = _require6.getNodes,
    getNode = _require6.getNode,
    getNodeAndSavePathDependency = _require6.getNodeAndSavePathDependency;

var _require7 = require(`../redux/actions/add-page-dependency`),
    createPageDependency = _require7.createPageDependency;

var _require8 = require(`./types/type-file`),
    setFileNodeRootType = _require8.setFileNodeRootType;

var _require9 = require(`./data-tree-utils`),
    clearTypeExampleValues = _require9.clearTypeExampleValues;

module.exports = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee2() {
  var createType = function () {
    var _ref8 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee(nodes, typeName) {
      var intermediateType, fieldsFromPlugins, mergedFieldsFromPlugins, inferredInputFieldsFromPlugins, gqlType, inferedInputFields, filterFields, runSift, latestNodes, proccesedType;
      return _regenerator2.default.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              intermediateType = {};


              intermediateType.name = typeName;
              intermediateType.nodes = nodes;

              _context.next = 5;
              return apiRunner(`setFieldsOnGraphQLNodeType`, {
                type: intermediateType,
                allNodes: getNodes(),
                traceId: `initial-setFieldsOnGraphQLNodeType`
              });

            case 5:
              fieldsFromPlugins = _context.sent;
              mergedFieldsFromPlugins = _.merge.apply(_, fieldsFromPlugins);
              inferredInputFieldsFromPlugins = inferInputObjectStructureFromFields({
                fields: mergedFieldsFromPlugins
              });
              gqlType = new GraphQLObjectType({
                name: typeName,
                description: `Node of type ${typeName}`,
                interfaces: [nodeInterface],
                fields: function fields() {
                  return createNodeFields(proccesedType);
                },
                isTypeOf: function isTypeOf(value) {
                  return value.internal.type === typeName;
                }
              });
              inferedInputFields = inferInputObjectStructureFromNodes({
                nodes,
                typeName
              });
              filterFields = _.merge({}, inferedInputFields.inferredFields, inferredInputFieldsFromPlugins.inferredFields);
              _context.t0 = _extends3.default;
              _context.t1 = {};
              _context.t2 = intermediateType;
              _context.t3 = mergedFieldsFromPlugins;
              _context.t4 = gqlType;
              _context.t5 = typeName;
              _context.t6 = gqlType;
              _context.t7 = filterFields;
              _context.t8 = {
                name: _context.t5,
                type: _context.t6,
                args: _context.t7,

                resolve(a, args, context) {
                  runSift = require(`./run-sift`);
                  latestNodes = _.filter(getNodes(), function (n) {
                    return n.internal.type === typeName;
                  });

                  if (!_.isObject(args)) {
                    args = {};
                  }
                  return runSift({
                    args: { filter: (0, _extends3.default)({}, args) },
                    nodes: latestNodes,
                    path: context.path ? context.path : `LAYOUT___${context.id}`,
                    type: gqlType
                  });
                }
              };
              _context.t9 = {
                fieldsFromPlugins: _context.t3,
                nodeObjectType: _context.t4,
                node: _context.t8
              };
              proccesedType = (0, _context.t0)(_context.t1, _context.t2, _context.t9);


              processedTypes[_.camelCase(typeName)] = proccesedType;

              // Special case to construct linked file type used by type inferring
              if (typeName === `File`) {
                setFileNodeRootType(gqlType);
              }

            case 24:
            case "end":
              return _context.stop();
          }
        }
      }, _callee, this);
    }));

    return function createType(_x, _x2) {
      return _ref8.apply(this, arguments);
    };
  }();

  // Create node types and node fields for nodes that have a resolve function.


  var types, processedTypes, createNodeFields;
  return _regenerator2.default.wrap(function _callee2$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          createNodeFields = function createNodeFields(type) {
            var defaultNodeFields = {
              id: {
                type: new GraphQLNonNull(GraphQLID),
                description: `The id of this node.`
              },
              parent: {
                type: nodeInterface,
                description: `The parent of this node.`,
                resolve(node, a, context) {
                  return getNodeAndSavePathDependency(node.parent, context.path);
                }
              },
              children: {
                type: new GraphQLList(nodeInterface),
                description: `The children of this node.`,
                resolve(node, a, _ref2) {
                  var path = _ref2.path;

                  return node.children.map(function (id) {
                    return getNodeAndSavePathDependency(id, path);
                  });
                }
              }

              // Create children fields for each type of children e.g.
              // "childrenMarkdownRemark".
            };var childNodesByType = _(type.nodes).flatMap(function (_ref3) {
              var children = _ref3.children;
              return children.map(getNode);
            }).groupBy(function (node) {
              return node.internal ? _.camelCase(node.internal.type) : undefined;
            }).value();

            Object.keys(childNodesByType).forEach(function (childNodeType) {
              // Does this child type have one child per parent or multiple?
              var maxChildCount = _.maxBy(_.values(_.groupBy(childNodesByType[childNodeType], function (c) {
                return c.parent;
              })), function (g) {
                return g.length;
              }).length;

              if (maxChildCount > 1) {
                defaultNodeFields[_.camelCase(`children ${childNodeType}`)] = {
                  type: new GraphQLList(processedTypes[childNodeType].nodeObjectType),
                  description: `The children of this node of type ${childNodeType}`,
                  resolve(node, a, _ref4) {
                    var path = _ref4.path;

                    var filteredNodes = node.children.map(function (id) {
                      return getNode(id);
                    }).filter(function (_ref5) {
                      var internal = _ref5.internal;
                      return _.camelCase(internal.type) === childNodeType;
                    });

                    // Add dependencies for the path
                    filteredNodes.forEach(function (n) {
                      return createPageDependency({ path, nodeId: n.id });
                    });
                    return filteredNodes;
                  }
                };
              } else {
                defaultNodeFields[_.camelCase(`child ${childNodeType}`)] = {
                  type: processedTypes[childNodeType].nodeObjectType,
                  description: `The child of this node of type ${childNodeType}`,
                  resolve(node, a, _ref6) {
                    var path = _ref6.path;

                    var childNode = node.children.map(function (id) {
                      return getNode(id);
                    }).find(function (_ref7) {
                      var internal = _ref7.internal;
                      return _.camelCase(internal.type) === childNodeType;
                    });

                    if (childNode) {
                      // Add dependencies for the path
                      createPageDependency({ path, nodeId: childNode.id });
                      return childNode;
                    }
                    return null;
                  }
                };
              }
            });

            var inferredFields = inferObjectStructureFromNodes({
              nodes: type.nodes,
              types: _.values(processedTypes),
              ignoreFields: Object.keys(type.fieldsFromPlugins)
            });

            return (0, _extends3.default)({}, defaultNodeFields, inferredFields, type.fieldsFromPlugins);
          };

          types = _.groupBy(getNodes(), function (node) {
            return node.internal.type;
          });
          processedTypes = {};


          clearTypeExampleValues();

          // Reset stored File type to not point to outdated type definition
          setFileNodeRootType(null);

          _context2.next = 7;
          return Promise.all(_.map(types, createType));

        case 7:
          return _context2.abrupt("return", processedTypes);

        case 8:
        case "end":
          return _context2.stop();
      }
    }
  }, _callee2, undefined);
}));
//# sourceMappingURL=build-node-types.js.map