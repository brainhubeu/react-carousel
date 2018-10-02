"use strict";

exports.__esModule = true;

var _extends2 = require("babel-runtime/helpers/extends");

var _extends3 = _interopRequireDefault(_extends2);

var _objectWithoutProperties2 = require("babel-runtime/helpers/objectWithoutProperties");

var _objectWithoutProperties3 = _interopRequireDefault(_objectWithoutProperties2);

exports.findLinkedNode = findLinkedNode;
exports.inferObjectStructureFromNodes = inferObjectStructureFromNodes;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _require = require(`graphql`),
    GraphQLObjectType = _require.GraphQLObjectType,
    GraphQLBoolean = _require.GraphQLBoolean,
    GraphQLString = _require.GraphQLString,
    GraphQLFloat = _require.GraphQLFloat,
    GraphQLInt = _require.GraphQLInt,
    GraphQLList = _require.GraphQLList,
    GraphQLUnionType = _require.GraphQLUnionType;

var _ = require(`lodash`);
var invariant = require(`invariant`);

var _require2 = require(`common-tags`),
    oneLine = _require2.oneLine;

var _require3 = require(`../redux`),
    store = _require3.store,
    getNode = _require3.getNode,
    getNodes = _require3.getNodes;

var _require4 = require(`../redux/actions/add-page-dependency`),
    createPageDependency = _require4.createPageDependency;

var createTypeName = require(`./create-type-name`);
var createKey = require(`./create-key`);

var _require5 = require(`./data-tree-utils`),
    getExampleValues = _require5.getExampleValues,
    isEmptyObjectOrArray = _require5.isEmptyObjectOrArray;

var DateType = require(`./types/type-date`);
var FileType = require(`./types/type-file`);

function inferGraphQLType(_ref) {
  var exampleValue = _ref.exampleValue,
      selector = _ref.selector,
      nodes = _ref.nodes,
      types = _ref.types,
      otherArgs = (0, _objectWithoutProperties3.default)(_ref, ["exampleValue", "selector", "nodes", "types"]);

  if (exampleValue == null || isEmptyObjectOrArray(exampleValue)) return null;
  var fieldName = selector.split(`.`).pop();

  // Check this before checking for array as FileType has
  // builtin support for inferring array of files and inferred
  // array type will have faster resolver than resolving array
  // of files separately.
  if (FileType.shouldInfer(nodes, selector, exampleValue)) {
    return _.isArray(exampleValue) ? FileType.getListType() : FileType.getType();
  }

  if (Array.isArray(exampleValue)) {
    exampleValue = exampleValue[0];

    if (exampleValue == null) return null;

    var inferredType = inferGraphQLType((0, _extends3.default)({}, otherArgs, {
      exampleValue,
      selector,
      nodes,
      types
    }));
    invariant(inferredType, `Could not infer graphQL type for value: ${exampleValue}`);

    var type = inferredType.type,
        _inferredType$args = inferredType.args,
        args = _inferredType$args === undefined ? null : _inferredType$args,
        _inferredType$resolve = inferredType.resolve,
        resolve = _inferredType$resolve === undefined ? null : _inferredType$resolve;


    var listType = { type: new GraphQLList(type), args };

    if (resolve) {
      // If inferredType has resolve function wrap it with Array.map
      listType.resolve = function (object, args, context, resolveInfo) {
        var fieldValue = object[fieldName];
        if (!fieldValue) {
          return null;
        }

        // Field resolver expects first parameter to be plain object
        // containing key with name of field we want to resolve.
        return fieldValue.map(function (value) {
          return resolve({ [fieldName]: value }, args, context, resolveInfo);
        });
      };
    }

    return listType;
  }

  if (DateType.shouldInfer(exampleValue)) {
    return DateType.getType();
  }

  switch (typeof exampleValue) {
    case `boolean`:
      return { type: GraphQLBoolean };
    case `string`:
      return { type: GraphQLString };
    case `object`:
      return {
        type: new GraphQLObjectType({
          name: createTypeName(fieldName),
          fields: _inferObjectStructureFromNodes((0, _extends3.default)({}, otherArgs, {
            selector,
            nodes,
            types
          }), exampleValue)
        })
      };
    case `number`:
      return _.isInteger(exampleValue) ? { type: GraphQLInt } : { type: GraphQLFloat };
    default:
      return null;
  }
}

function inferFromMapping(value, mapping, fieldSelector, types) {
  var linkedType = mapping[fieldSelector].split(`.`)[0];
  var linkedField = mapping[fieldSelector].slice(linkedType.length + 1) || `id`;

  var matchedTypes = types.filter(function (type) {
    return type.name === linkedType;
  });
  if (_.isEmpty(matchedTypes)) {
    console.log(`Couldn't find a matching node type for "${fieldSelector}"`);
    return null;
  }

  var findNode = function findNode(fieldValue, path) {
    var linkedNode = _.find(getNodes(), function (n) {
      return n.internal.type === linkedType && _.get(n, linkedField) === fieldValue;
    });
    if (linkedNode) {
      createPageDependency({ path, nodeId: linkedNode.id });
      return linkedNode;
    }
    return null;
  };

  if (_.isArray(value)) {
    return {
      type: new GraphQLList(matchedTypes[0].nodeObjectType),
      resolve: function resolve(node, a, b, _ref2) {
        var fieldName = _ref2.fieldName;

        var fieldValue = node[fieldName];

        if (fieldValue) {
          return fieldValue.map(function (value) {
            return findNode(value, b.path);
          });
        } else {
          return null;
        }
      }
    };
  }

  return {
    type: matchedTypes[0].nodeObjectType,
    resolve: function resolve(node, a, b, _ref3) {
      var fieldName = _ref3.fieldName;

      var fieldValue = node[fieldName];

      if (fieldValue) {
        return findNode(fieldValue, b.path);
      } else {
        return null;
      }
    }
  };
}

function findLinkedNode(value, linkedField, path) {
  var linkedNode = void 0;
  // If the field doesn't link to the id, use that for searching.
  if (linkedField) {
    linkedNode = getNodes().find(function (n) {
      return n[linkedField] === value;
    });
    // Else the field is linking to the node's id, the default.
  } else {
    linkedNode = getNode(value);
  }

  if (linkedNode) {
    if (path) createPageDependency({ path, nodeId: linkedNode.id });
    return linkedNode;
  }
  return null;
}

function inferFromFieldName(value, selector, types) {
  var isArray = false;
  if (_.isArray(value)) {
    isArray = true;
    // Reduce values to nodes with unique types.
    value = _.uniqBy(value, function (v) {
      return getNode(v).internal.type;
    });
  }

  var key = selector.split(`.`).pop();

  var _key$split = key.split(`___`),
      linkedField = _key$split[2];

  var validateLinkedNode = function validateLinkedNode(linkedNode) {
    invariant(linkedNode, oneLine`
        Encountered an error trying to infer a GraphQL type for: "${selector}".
        There is no corresponding node with the ${linkedField || `id`}
        field matching: "${value}"
      `);
  };
  var validateField = function validateField(linkedNode, field) {
    invariant(field, oneLine`
        Encountered an error trying to infer a GraphQL type for: "${selector}".
        There is no corresponding GraphQL type "${linkedNode.internal.type}" available
        to link to this node.
      `);
  };

  var findNodeType = function findNodeType(node) {
    return types.find(function (type) {
      return type.name === node.internal.type;
    });
  };

  if (isArray) {
    var linkedNodes = value.map(function (v) {
      return findLinkedNode(v);
    });
    linkedNodes.forEach(function (node) {
      return validateLinkedNode(node);
    });
    var fields = linkedNodes.map(function (node) {
      return findNodeType(node);
    });
    fields.forEach(function (field, i) {
      return validateField(linkedNodes[i], field);
    });

    var type = void 0;
    // If there's more than one type, we'll create a union type.
    if (fields.length > 1) {
      type = new GraphQLUnionType({
        name: createTypeName(`Union_${key}_${fields.map(function (f) {
          return f.name;
        }).sort().join(`__`)}`),
        description: `Union interface for the field "${key}" for types [${fields.map(function (f) {
          return f.name;
        }).sort().join(`, `)}]`,
        types: fields.map(function (f) {
          return f.nodeObjectType;
        }),
        resolveType: function resolveType(data) {
          return fields.find(function (f) {
            return f.name == data.internal.type;
          }).nodeObjectType;
        }
      });
    } else {
      type = fields[0].nodeObjectType;
    }

    return {
      type: new GraphQLList(type),
      resolve: function resolve(node, a) {
        var b = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

        var fieldValue = node[key];
        if (fieldValue) {
          return fieldValue.map(function (value) {
            return findLinkedNode(value, linkedField, b.path);
          });
        } else {
          return null;
        }
      }
    };
  }

  var linkedNode = findLinkedNode(value, linkedField);
  validateLinkedNode(linkedNode);
  var field = findNodeType(linkedNode);
  validateField(linkedNode, field);
  return {
    type: field.nodeObjectType,
    resolve: function resolve(node, a) {
      var b = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

      var fieldValue = node[key];
      if (fieldValue) {
        var result = findLinkedNode(fieldValue, linkedField, b.path);
        return result;
      } else {
        return null;
      }
    }
  };
}

var EXCLUDE_KEYS = {
  id: 1,
  parent: 1,
  children: 1

  // Call this for the top level node + recursively for each sub-object.
  // E.g. This gets called for Markdown and then for its frontmatter subobject.
};function _inferObjectStructureFromNodes(_ref4, exampleValue) {
  var nodes = _ref4.nodes,
      types = _ref4.types,
      selector = _ref4.selector,
      ignoreFields = _ref4.ignoreFields;

  var config = store.getState().config;
  var isRoot = !selector;
  var mapping = config && config.mapping;

  // Ensure nodes have internal key with object.
  nodes = nodes.map(function (n) {
    return n.internal ? n : (0, _extends3.default)({}, n, { internal: {} });
  });

  var typeName = nodes[0].internal.type;

  var resolvedExample = exampleValue != null ? exampleValue : getExampleValues({ nodes, typeName, ignoreFields });

  var inferredFields = {};
  _.each(resolvedExample, function (value, key) {
    // Remove fields common to the top-level of all nodes.  We add these
    // elsewhere so don't need to infer their type.
    if (isRoot && EXCLUDE_KEYS[key]) return;

    // Several checks to see if a field is pointing to custom type
    // before we try automatic inference.
    var nextSelector = selector ? `${selector}.${key}` : key;
    var fieldSelector = `${typeName}.${nextSelector}`;

    var fieldName = key;
    var inferredField = void 0;

    // First check for manual field => type mappings in the site's
    // gatsby-config.js
    if (mapping && _.includes(Object.keys(mapping), fieldSelector)) {
      inferredField = inferFromMapping(value, mapping, fieldSelector, types);

      // Second if the field has a suffix of ___node. We use then the value
      // (a node id) to find the node and use that node's type as the field
    } else if (key.includes(`___NODE`)) {
      ;
      var _key$split2 = key.split(`___`);

      fieldName = _key$split2[0];

      inferredField = inferFromFieldName(value, nextSelector, types);
    }

    // Replace unsupported values
    var sanitizedFieldName = createKey(fieldName);

    // If a pluging has already provided a type for this, don't infer it.
    if (ignoreFields && ignoreFields.includes(sanitizedFieldName)) {
      return;
    }

    // Finally our automatic inference of field value type.
    if (!inferredField) {
      inferredField = inferGraphQLType({
        nodes,
        types,
        exampleValue: value,
        selector: nextSelector
      });
    }

    if (!inferredField) return;

    // If sanitized field name is different from original field name
    // add resolve passthrough to reach value using original field name
    if (sanitizedFieldName !== fieldName) {
      var _inferredField = inferredField,
          fieldResolve = _inferredField.resolve,
          inferredFieldWithoutResolve = (0, _objectWithoutProperties3.default)(_inferredField, ["resolve"]);

      // Using copy if field as we sometimes have predefined frozen
      // field definitions and we can't mutate them.

      inferredField = inferredFieldWithoutResolve;

      if (fieldResolve) {
        // If field has resolver, call it with adjusted resolveInfo
        // that points to original field name
        inferredField.resolve = function (source, args, context, resolveInfo) {
          return fieldResolve(source, args, context, (0, _extends3.default)({}, resolveInfo, {
            fieldName: fieldName
          }));
        };
      } else {
        inferredField.resolve = function (source) {
          return source[fieldName];
        };
      }
    }

    inferredFields[sanitizedFieldName] = inferredField;
  });

  return inferredFields;
}

function inferObjectStructureFromNodes(options) {
  return _inferObjectStructureFromNodes(options, null);
}
//# sourceMappingURL=infer-graphql-type.js.map